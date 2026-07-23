import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { CONTRACT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
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

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#9CA3AF',
  ACTIVE: '#10b981',
  EXPIRED: '#ef4444',
};

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A');

const StatCard = ({ title, value, color, sub }: { title: string; value: string | number; color: string; sub?: string }) => (
  <div style={{ backgroundColor: BRAND.white, padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>{title}</div>
    <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: BRAND.text, marginTop: '2px' }}>{sub}</div>}
  </div>
);

const ContractDashboard = () => {
  const userRole = useUserRole();
  const recordId = useRecordId();
  const [allContracts, setAllContracts] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recordId) setSelectedId(recordId);
    const loadData = async () => {
      setLoading(true);
      const [contracts, orders] = await Promise.all([
        fetchList('contracts?limit=200'),
        fetchList('salesOrders?limit=500'),
      ]);
      setAllContracts(contracts);
      setSalesOrders(orders);
      setLoading(false);
    };
    loadData();
  }, [recordId]);

  if (!recordId && userRole === null) return <RoleLoading />;
  if (!recordId && userRole === 'associate') return <AccessDenied minRole="manager" />;

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading contracts...</div>;
  }

  const selected = selectedId ? allContracts.find((c) => c.id === selectedId) : null;

  const getLinkedOrders = (contractId: string) =>
    salesOrders.filter((o) => {
      const cId = o.contractId || o.contract?.id;
      return cId === contractId;
    });

  const getFulfillment = (contract: any) => {
    const orders = getLinkedOrders(contract.id);
    const totalQty = contract.totalQuantity || 0;
    const shippedQty = orders
      .filter((o: any) => o.fulfillmentStatus === 'SHIPPED')
      .reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);
    const inProgressQty = orders
      .filter((o: any) => o.fulfillmentStatus === 'IN_PROGRESS')
      .reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);
    const pct = totalQty > 0 ? Math.min(100, Math.round(((shippedQty + inProgressQty) / totalQty) * 100)) : 0;
    return { totalQty, shippedQty, inProgressQty, pct, orderCount: orders.length };
  };

  const getTimeline = (contract: any) => {
    const startTime = contract.startDate ? new Date(contract.startDate).getTime() : null;
    const endTime = contract.endDate ? new Date(contract.endDate).getTime() : null;
    const now = Date.now();
    if (!startTime || !endTime || endTime <= startTime) return { pct: 0, label: 'No dates set' };
    const pct = Math.max(0, Math.min(100, ((now - startTime) / (endTime - startTime)) * 100));
    const label = now < startTime ? 'Not started' : now > endTime ? 'Ended' : `${Math.round(pct)}% elapsed`;
    return { pct, label };
  };

  const totalCount = allContracts.length;
  const active = allContracts.filter((c) => c.status === 'ACTIVE').length;
  const draft = allContracts.filter((c) => c.status === 'DRAFT').length;
  const expired = allContracts.filter((c) => c.status === 'EXPIRED').length;

  const gridCols = '1.2fr 0.8fr 0.8fr 0.6fr 0.8fr 0.6fr 1fr';

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '26px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
              Contract Dashboard
            </h1>
            <div style={{ fontSize: '13px', color: BRAND.text, marginTop: '2px' }}>
              Contract lifecycle, fulfillment &amp; timeline tracking
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/objects/contracts/new" target="_parent" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: BRAND.accent, color: BRAND.white, padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
              + Add Contract
            </a>
            <a href="/objects/contracts" target="_parent" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: BRAND.primary, color: BRAND.white, padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
              View All Records
            </a>
          </div>
        </div>

        {/* Detail / Summary Panel — top 50% */}
        <div style={{ flex: '0 0 auto', padding: '16px 24px', backgroundColor: BRAND.white, borderBottom: `1px solid ${BRAND.border}` }}>
          {selected ? (() => {
            const ff = getFulfillment(selected);
            const tl = getTimeline(selected);
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: BRAND.primary }}>
                    {selected.name || `Contract ${(selected.id || '').substring(0, 8)}`}
                    <span style={{ marginLeft: '10px', fontSize: '11px', backgroundColor: `${STATUS_COLORS[selected.status] || BRAND.text}18`, color: STATUS_COLORS[selected.status] || BRAND.text, padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {selected.status || 'DRAFT'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: `1px solid ${BRAND.border}`, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: BRAND.text, cursor: 'pointer' }}>
                    Back to Summary
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Volume Fulfillment */}
                  <div style={{ backgroundColor: BRAND.bg, padding: '16px', borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: BRAND.secondary, marginBottom: '10px' }}>Volume Fulfillment</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 700, color: BRAND.primary, fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {ff.shippedQty + ff.inProgressQty} MT
                      </span>
                      <span style={{ fontSize: '13px', color: BRAND.text }}>of {ff.totalQty} MT ({ff.pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', backgroundColor: '#E0E0E0', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: `${ff.totalQty > 0 ? (ff.shippedQty / ff.totalQty) * 100 : 0}%`, height: '100%', backgroundColor: BRAND.green }}></div>
                      <div style={{ width: `${ff.totalQty > 0 ? (ff.inProgressQty / ff.totalQty) * 100 : 0}%`, height: '100%', backgroundColor: BRAND.yellow }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', marginTop: '8px', fontSize: '11px', color: BRAND.text }}>
                      <span><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: BRAND.green, borderRadius: '2px', marginRight: '4px' }}></span>Shipped: {ff.shippedQty} MT</span>
                      <span><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: BRAND.yellow, borderRadius: '2px', marginRight: '4px' }}></span>In Progress: {ff.inProgressQty} MT</span>
                      <span><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#E0E0E0', borderRadius: '2px', marginRight: '4px' }}></span>Remaining: {Math.max(0, ff.totalQty - ff.shippedQty - ff.inProgressQty)} MT</span>
                    </div>
                  </div>

                  {/* Contract Timeline */}
                  <div style={{ backgroundColor: BRAND.bg, padding: '16px', borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: BRAND.secondary, marginBottom: '10px' }}>Contract Timeline</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: BRAND.text, marginBottom: '8px' }}>
                      <span>Start: {fmtDate(selected.startDate)}</span>
                      <span>End: {fmtDate(selected.endDate)}</span>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '8px', backgroundColor: '#E0E0E0', borderRadius: '4px', margin: '12px 0 8px' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${tl.pct}%`, backgroundColor: BRAND.accent, borderRadius: '4px' }}></div>
                      <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: BRAND.primary, border: '2px solid #FFF' }}></div>
                      <div style={{ position: 'absolute', top: '50%', left: '100%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: BRAND.lightAccent, border: '2px solid #FFF' }}></div>
                      {tl.pct > 0 && tl.pct < 100 && (
                        <div style={{ position: 'absolute', top: '50%', left: `${tl.pct}%`, transform: 'translate(-50%, -50%)', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#FFF', border: `3px solid ${BRAND.accent}` }}></div>
                      )}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: BRAND.secondary }}>{tl.label}</div>
                  </div>
                </div>

                {/* Detail cards row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '14px' }}>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Total Quantity</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: BRAND.primary }}>{ff.totalQty} MT</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>LME Formula</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.primary, wordBreak: 'break-all' }}>{selected.lmeFormula || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Linked Orders</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: BRAND.blue }}>{ff.orderCount}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: BRAND.bg, borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Duration</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.primary }}>
                      {selected.startDate && selected.endDate
                        ? `${Math.ceil((new Date(selected.endDate).getTime() - new Date(selected.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })() : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <StatCard title="Total Contracts" value={totalCount} color={BRAND.accent} />
              <StatCard title="Active" value={active} color={BRAND.green} />
              <StatCard title="Draft" value={draft} color={BRAND.text} />
              <StatCard title="Expired" value={expired} color={BRAND.red} />
            </div>
          )}
        </div>

        {/* Table — bottom 50% */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 24px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '12px', padding: '12px 16px', backgroundColor: BRAND.primary, color: BRAND.white, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '6px 6px 0 0', marginTop: '16px' }}>
            <div>Contract Name</div>
            <div>Start</div>
            <div>End</div>
            <div>Qty (MT)</div>
            <div>Status</div>
            <div>Orders</div>
            <div>Fulfillment</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            {allContracts.map((c) => {
              const isSelected = c.id === selectedId;
              const ff = getFulfillment(c);
              const statusColor = STATUS_COLORS[c.status] || BRAND.text;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(isSelected ? null : c.id)}
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
                  <div style={{ fontWeight: 600, color: BRAND.primary }}>{c.name || (c.id || '').substring(0, 8)}</div>
                  <div style={{ color: BRAND.secondary, fontSize: '12px' }}>{fmtDate(c.startDate)}</div>
                  <div style={{ color: BRAND.secondary, fontSize: '12px' }}>{fmtDate(c.endDate)}</div>
                  <div style={{ color: BRAND.primary }}>{c.totalQuantity || 0}</div>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: `${statusColor}18`, color: statusColor, padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {c.status || 'DRAFT'}
                    </span>
                  </div>
                  <div style={{ color: BRAND.blue, fontWeight: 600 }}>{ff.orderCount}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${ff.pct}%`, height: '100%', backgroundColor: BRAND.green, transition: 'width 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '10px', color: BRAND.text, fontWeight: 600, minWidth: '28px' }}>
                      {ff.pct}%
                    </span>
                  </div>
                </div>
              );
            })}

            {allContracts.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>
                No contracts found. Click "Add Contract" to create one.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: CONTRACT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Contract Dashboard',
  component: ContractDashboard,
});
