import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  green: '#10b981',
  red: '#ef4444',
  yellow: '#f59e0b',
  blue: '#3b82f6',
  gray: '#9CA3AF',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Roboto+Slab:wght@400&family=Barlow:wght@400;500;600&display=swap');
`;

const API_URL = 'https://api.twenty.com/rest';
const API_HEADERS = {
  Authorization:
    'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ',
  'Content-Type': 'application/json',
};

const fetchList = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const patchRecord = async (path: string, body: any) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, {
      method: 'PATCH',
      headers: API_HEADERS,
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return null;
  }
};

const STEPS = [
  { id: 'DRAFT', label: 'Draft', color: '#9CA3AF' },
  { id: 'HOD_REVIEW', label: 'HOD Review', color: '#f59e0b' },
  { id: 'CEO_APPROVED', label: 'CEO Approved', color: '#3b82f6' },
  { id: 'CONVERTED_TO_ORDER', label: 'Converted', color: '#10b981' },
];

const getStepIndex = (status: string) => {
  const idx = STEPS.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
};

const getStatusColor = (status: string) => {
  if (status === 'REJECTED') return BRAND.red;
  const step = STEPS.find((s) => s.id === status);
  return step?.color || BRAND.gray;
};

const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
  <div style={{ backgroundColor: BRAND.white, padding: '16px 20px', borderRadius: '8px', border: `1px solid ${BRAND.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>
      {typeof value === 'number' ? value : '#'}
    </div>
    <div>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, letterSpacing: '0.5px' }}>{title}</div>
      <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.primary, fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
    </div>
  </div>
);

const ApprovalStepper = ({ status }: { status: string }) => {
  const currentIdx = getStepIndex(status);
  const isRejected = status === 'REJECTED';
  if (isRejected) {
    return (
      <div style={{ backgroundColor: '#fef2f2', border: `1px solid ${BRAND.red}`, padding: '12px 16px', borderRadius: '6px', color: BRAND.red, fontWeight: 600, fontSize: '13px' }}>
        REJECTED
      </div>
    );
  }
  const progressPercent = (currentIdx / Math.max(STEPS.length - 1, 1)) * 100;
  return (
    <div style={{ position: 'relative', padding: '8px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '11px', left: 0, right: 0, height: '3px', backgroundColor: '#E0E0E0', zIndex: 0 }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.4s' }}></div>
        </div>
        {STEPS.map((step, i) => {
          const isActive = i <= currentIdx;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '6px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isActive ? BRAND.accent : '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '11px', fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, color: isActive ? BRAND.primary : BRAND.text, textAlign: 'center', width: '60px' }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuotationDashboard = () => {
  const userRole = useUserRole();
  const recordId = useRecordId();
  const [allQuotations, setAllQuotations] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    const items = await fetchList('quotations?limit=200');
    setAllQuotations(items);
    setLoading(false);
  };

  useEffect(() => {
    if (recordId) setSelectedId(recordId);
    loadData();
  }, [recordId]);

  const handleStatusChange = async (quotId: string, newStatus: string) => {
    setUpdating(true);
    const result = await patchRecord(`quotations/${quotId}`, { approvalStatus: newStatus });
    if (result) {
      showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`);
      await loadData();
    } else {
      showToast('Failed to update status', 'error');
    }
    setUpdating(false);
  };

  if (!recordId && userRole === null) return <RoleLoading />;
  if (!recordId && userRole === 'associate') return <AccessDenied minRole="manager" />;

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading quotations...</div>;
  }

  const selected = selectedId ? allQuotations.find((q) => q.id === selectedId) : null;

  const totalCount = allQuotations.length;
  const pendingReview = allQuotations.filter((q) => q.approvalStatus === 'HOD_REVIEW').length;
  const approved = allQuotations.filter((q) => q.approvalStatus === 'CEO_APPROVED').length;
  const converted = allQuotations.filter((q) => q.approvalStatus === 'CONVERTED_TO_ORDER').length;
  const rejected = allQuotations.filter((q) => q.approvalStatus === 'REJECTED').length;

  const gridCols = '1.2fr 1fr 0.7fr 0.8fr 1fr 1.2fr';

  const getActionButtons = (q: any) => {
    const status = q.approvalStatus || 'DRAFT';
    const btns: { label: string; newStatus: string; color: string; bg: string }[] = [];

    if (status === 'DRAFT') {
      btns.push({ label: 'Submit for Review', newStatus: 'HOD_REVIEW', color: BRAND.white, bg: BRAND.yellow });
    }
    if (status === 'HOD_REVIEW' && (userRole === 'hod' || userRole === 'manager')) {
      btns.push({ label: 'Approve', newStatus: 'CEO_APPROVED', color: BRAND.white, bg: BRAND.green });
      btns.push({ label: 'Reject', newStatus: 'REJECTED', color: BRAND.white, bg: BRAND.red });
      btns.push({ label: 'Back to Draft (Revise)', newStatus: 'DRAFT', color: BRAND.primary, bg: '#E0E0E0' });
    }
    if (status === 'CEO_APPROVED' && userRole === 'hod') {
      btns.push({ label: 'Convert to Order', newStatus: 'CONVERTED_TO_ORDER', color: BRAND.white, bg: BRAND.accent });
      btns.push({ label: 'Revise (Back to Draft)', newStatus: 'DRAFT', color: BRAND.primary, bg: '#E0E0E0' });
    }
    if (status === 'REJECTED') {
      btns.push({ label: 'Revise (Back to Draft)', newStatus: 'DRAFT', color: BRAND.primary, bg: '#E0E0E0' });
    }
    return btns;
  };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '12px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', color: BRAND.white, backgroundColor: toast.type === 'success' ? BRAND.green : BRAND.red, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '26px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
              Quotation Dashboard
            </h1>
            <div style={{ fontSize: '13px', color: BRAND.text, marginTop: '2px' }}>
              Quotation approval workflow &amp; tracking — linked from Opportunity Pipeline
            </div>
          </div>
          <a href="/objects/quotations" target="_parent" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: BRAND.primary, color: BRAND.white, padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
            View All Records
          </a>
        </div>

        {/* Detail / Summary Panel — top 30% */}
        <div style={{ flex: '0 0 auto', padding: '16px 24px', backgroundColor: BRAND.white, borderBottom: `1px solid ${BRAND.border}` }}>
          {selected ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.primary }}>
                  {selected.quoteNumber || `Quote ${(selected.id || '').substring(0, 8)}`}
                  {selected.linkedOpportunityId && (
                    <a href={`/object/bdOpportunity/${selected.linkedOpportunityId}`} target="_parent" style={{ marginLeft: '10px', fontSize: '11px', color: BRAND.blue, textDecoration: 'underline' }}>
                      View Linked Opportunity
                    </a>
                  )}
                </div>
                <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: `1px solid ${BRAND.border}`, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: BRAND.text, cursor: 'pointer' }}>
                  Back to Summary
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Left: Approval stepper + actions */}
                <div>
                  <ApprovalStepper status={selected.approvalStatus || 'DRAFT'} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                    {getActionButtons(selected).map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => handleStatusChange(selected.id, btn.newStatus)}
                        disabled={updating}
                        style={{ padding: '7px 14px', backgroundColor: btn.bg, color: btn.color, border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '12px', cursor: updating ? 'not-allowed' : 'pointer', opacity: updating ? 0.6 : 1 }}
                      >
                        {btn.label}
                      </button>
                    ))}
                    <a href={`/object/quotation/${selected.id}`} target="_parent" style={{ padding: '7px 14px', backgroundColor: BRAND.bg, color: BRAND.primary, borderRadius: '4px', fontWeight: 600, fontSize: '12px', textDecoration: 'none', border: `1px solid ${BRAND.border}` }}>
                      Edit Record
                    </a>
                  </div>
                </div>
                {/* Right: Key details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Quote #</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary }}>{selected.quoteNumber || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Buyer</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary }}>{selected.buyerCompanyId || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Quantity</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary }}>{selected.quantity || 0} MT</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Rate (INR)</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary }}>{'₹'}{Number(selected.proposedRate || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              <StatCard title="Total Quotations" value={totalCount} color={BRAND.accent} />
              <StatCard title="Pending HOD Review" value={pendingReview} color={BRAND.yellow} />
              <StatCard title="CEO Approved" value={approved} color={BRAND.blue} />
              <StatCard title="Converted to Order" value={converted} color={BRAND.green} />
              <StatCard title="Rejected" value={rejected} color={BRAND.red} />
            </div>
          )}
        </div>

        {/* Table — bottom 70% */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 24px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '12px', padding: '12px 16px', backgroundColor: BRAND.primary, color: BRAND.white, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '6px 6px 0 0', marginTop: '16px' }}>
            <div>Quote #</div>
            <div>Product / Buyer</div>
            <div>Qty (MT)</div>
            <div>Rate (INR)</div>
            <div>Status</div>
            <div>Approval Progress</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            {allQuotations.map((q) => {
              const isSelected = q.id === selectedId;
              const statusColor = getStatusColor(q.approvalStatus || 'DRAFT');
              const stepIdx = getStepIndex(q.approvalStatus || 'DRAFT');
              const progressPct = q.approvalStatus === 'REJECTED' ? 100 : (stepIdx / Math.max(STEPS.length - 1, 1)) * 100;

              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedId(isSelected ? null : q.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: `1px solid ${BRAND.border}`,
                    alignItems: 'center',
                    fontSize: '13px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#EBF5FF' : 'transparent',
                    borderLeft: isSelected ? `3px solid ${BRAND.accent}` : '3px solid transparent',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 600, color: BRAND.primary }}>
                    {q.quoteNumber || (q.id || '').substring(0, 8)}
                    {q.linkedOpportunityId && <span style={{ display: 'block', fontSize: '10px', color: BRAND.blue }}>Linked to Opp</span>}
                  </div>
                  <div style={{ color: BRAND.secondary, fontSize: '12px' }}>{q.buyerCompanyId || q.productId || 'N/A'}</div>
                  <div style={{ color: BRAND.primary }}>{q.quantity || 0}</div>
                  <div style={{ color: BRAND.primary }}>{'₹'}{Number(q.proposedRate || 0).toLocaleString()}</div>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: `${statusColor}18`, color: statusColor, padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {(q.approvalStatus || 'DRAFT').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: q.approvalStatus === 'REJECTED' ? BRAND.red : BRAND.accent, transition: 'width 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '10px', color: BRAND.text, fontWeight: 600, minWidth: '24px' }}>
                      {q.approvalStatus === 'REJECTED' ? 'REJ' : `${stepIdx + 1}/4`}
                    </span>
                  </div>
                </div>
              );
            })}

            {allQuotations.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>
                No quotations found. Create one from the Opportunity Pipeline (Negotiation stage).
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Quotation Dashboard',
  component: QuotationDashboard,
});
