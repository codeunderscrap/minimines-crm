import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { SHIPMENT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
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

const postRecord = async (path: string, body: any) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) { console.error('POST error:', path, json); return null; }
    return json;
  } catch (e) {
    console.error('POST exception:', path, e);
    return null;
  }
};

const patchRecord = async (path: string, body: any) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, {
      method: 'PATCH',
      headers: API_HEADERS,
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) { console.error('PATCH error:', path, json); return null; }
    return json;
  } catch (e) {
    console.error('PATCH exception:', path, e);
    return null;
  }
};

const TRANSIT_STEPS = [
  { id: 'DOCUMENTATION', label: 'Documentation' },
  { id: 'CUSTOMS', label: 'Customs' },
  { id: 'IN_TRANSIT', label: 'In Transit' },
  { id: 'DELIVERED', label: 'Delivered' },
];

const REQUIRED_DOCS = ['EVD', 'FEMA', 'SCOMET', 'HSN', 'PACKING_NOTE', 'E_WAY_BILL', 'SHIPPING_BILL', 'OTHER'];

const getTransitIndex = (status: string) => {
  const idx = TRANSIT_STEPS.findIndex((s) => s.id === status);
  return idx >= 0 ? idx : 0;
};

const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A');

const QA_COLORS: Record<string, string> = { PASSED: '#10b981', FAILED: '#ef4444', PENDING: '#f59e0b' };

const ShipmentLogisticsDashboard = () => {
  const userRole = useUserRole();
  const recordId = useRecordId();
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
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
    const [shipments, docs] = await Promise.all([
      fetchList('exportShipments?limit=200'),
      fetchList('exportDocuments?limit=500'),
    ]);
    setAllShipments(shipments);
    setAllDocuments(docs);
    setLoading(false);
  };

  useEffect(() => {
    if (recordId) setSelectedId(recordId);
    loadData();
  }, [recordId]);

  const handleUpdateTransit = async (shipmentId: string, newStatus: string) => {
    setUpdating(true);
    const result = await patchRecord(`exportShipments/${shipmentId}`, { transitExport: newStatus });
    if (result) {
      showToast(`Transit updated to ${newStatus.replace(/_/g, ' ')}`);
      await loadData();
    } else {
      showToast('Failed to update transit status', 'error');
    }
    setUpdating(false);
  };

  const handleUpdateQA = async (shipmentId: string, newStatus: string) => {
    setUpdating(true);
    const result = await patchRecord(`exportShipments/${shipmentId}`, { qaStatus: newStatus });
    if (result) {
      showToast(`QA status updated to ${newStatus}`);
      await loadData();
    } else {
      showToast('Failed to update QA status', 'error');
    }
    setUpdating(false);
  };

  const handleUpdateDocStatus = async (shipmentId: string, newStatus: string) => {
    setUpdating(true);
    const result = await patchRecord(`exportShipments/${shipmentId}`, { documentationStatus: newStatus });
    if (result) {
      showToast(`Documentation status updated to ${newStatus}`);
      await loadData();
    } else {
      showToast('Failed to update doc status', 'error');
    }
    setUpdating(false);
  };

  const handleCreateShipment = async () => {
    setUpdating(true);
    const result = await postRecord('exportShipments', {
      name: `Shipment-${Date.now().toString(36).toUpperCase()}`,
      vesselName: '',
      containerNumber: '',
      transitExport: 'DOCUMENTATION',
      qaStatus: 'PENDING',
      documentationStatus: 'INCOMPLETE',
    });
    if (result) {
      showToast('Shipment created');
      await loadData();
    } else {
      showToast('Failed to create shipment', 'error');
    }
    setUpdating(false);
  };

  if (!recordId && userRole === null) return <RoleLoading />;
  if (!recordId && userRole === 'associate') return <AccessDenied minRole="manager" />;

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading logistics data...</div>;
  }

  const selected = selectedId ? allShipments.find((s) => s.id === selectedId) : null;

  const getDocsForShipment = (shipmentId: string) =>
    allDocuments.filter((d) => (d.exportShipmentId || d.exportShipment?.id) === shipmentId);

  const getDocChecklist = (shipmentId: string) => {
    const docs = getDocsForShipment(shipmentId);
    return REQUIRED_DOCS.map((type) => {
      const found = docs.find((d) => d.documentType === type);
      return { type, status: found?.status || 'PENDING', targetDate: found?.targetDate || null };
    });
  };

  const totalCount = allShipments.length;
  const inTransit = allShipments.filter((s) => s.transitExport === 'IN_TRANSIT').length;
  const delivered = allShipments.filter((s) => s.transitExport === 'DELIVERED').length;
  const docReady = allShipments.filter((s) => s.documentationStatus === 'READY').length;

  const gridCols = '1.2fr 0.8fr 0.8fr 0.7fr 0.7fr 0.8fr 1fr';

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
              Shipment &amp; Logistics Tracker
            </h1>
            <div style={{ fontSize: '13px', color: BRAND.text, marginTop: '2px' }}>
              Export shipments, documentation compliance &amp; transit tracking
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleCreateShipment} disabled={updating} style={{ padding: '8px 16px', backgroundColor: BRAND.green, color: BRAND.white, border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '13px', cursor: updating ? 'not-allowed' : 'pointer' }}>
              + New Shipment
            </button>
            <a href="/objects/exportShipments" target="_parent" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: BRAND.primary, color: BRAND.white, padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
              View All Records
            </a>
          </div>
        </div>

        {/* Detail / Summary Panel */}
        <div style={{ flex: '0 0 auto', padding: '16px 24px', backgroundColor: BRAND.white, borderBottom: `1px solid ${BRAND.border}`, overflow: 'auto' }}>
          {selected ? (() => {
            const transitIdx = getTransitIndex(selected.transitExport || 'DOCUMENTATION');
            const checklist = getDocChecklist(selected.id);
            const submittedCount = checklist.filter((d) => d.status === 'SUBMITTED').length;
            const preparedCount = checklist.filter((d) => d.status === 'PREPARED').length;
            const docProgress = Math.round(((submittedCount + preparedCount * 0.5) / REQUIRED_DOCS.length) * 100);

            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: BRAND.primary }}>
                    {selected.name || selected.vesselName || (selected.id || '').substring(0, 8)}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <a href={`/object/exportShipment/${selected.id}`} target="_parent" style={{ padding: '5px 10px', backgroundColor: BRAND.bg, color: BRAND.primary, borderRadius: '4px', fontWeight: 600, fontSize: '12px', textDecoration: 'none', border: `1px solid ${BRAND.border}` }}>
                      Edit Record
                    </a>
                    <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: `1px solid ${BRAND.border}`, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', color: BRAND.text, cursor: 'pointer' }}>
                      Back to Summary
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  {/* Transit Progress Stepper with inline update */}
                  <div style={{ backgroundColor: BRAND.bg, padding: '16px', borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: BRAND.secondary }}>Transit Progress</div>
                      <select
                        value={selected.transitExport || 'DOCUMENTATION'}
                        onChange={(e) => handleUpdateTransit(selected.id, e.target.value)}
                        disabled={updating}
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontWeight: 600, backgroundColor: BRAND.white }}
                      >
                        {TRANSIT_STEPS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '11px', left: '8%', right: '8%', height: '3px', backgroundColor: '#E0E0E0', zIndex: 0 }}>
                        <div style={{ width: `${(transitIdx / Math.max(TRANSIT_STEPS.length - 1, 1)) * 100}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.4s' }}></div>
                      </div>
                      {TRANSIT_STEPS.map((step, i) => {
                        const isActive = i <= transitIdx;
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

                  {/* Shipment Details with inline QA update */}
                  <div style={{ backgroundColor: BRAND.bg, padding: '16px', borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: BRAND.secondary, marginBottom: '10px' }}>Vessel &amp; Cargo</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Vessel</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.primary }}>{selected.vesselName || 'TBD'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Container</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.primary }}>{selected.containerNumber || 'TBD'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, marginBottom: '4px' }}>QA Status</div>
                        <select
                          value={selected.qaStatus || 'PENDING'}
                          onChange={(e) => handleUpdateQA(selected.id, e.target.value)}
                          disabled={updating}
                          onClick={(e) => e.stopPropagation()}
                          style={{ padding: '3px 6px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontWeight: 600, color: QA_COLORS[selected.qaStatus] || BRAND.yellow }}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PASSED">Passed</option>
                          <option value="FAILED">Failed</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, marginBottom: '4px' }}>Doc Status</div>
                        <select
                          value={selected.documentationStatus || 'INCOMPLETE'}
                          onChange={(e) => handleUpdateDocStatus(selected.id, e.target.value)}
                          disabled={updating}
                          onClick={(e) => e.stopPropagation()}
                          style={{ padding: '3px 6px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontWeight: 600 }}
                        >
                          <option value="INCOMPLETE">Incomplete</option>
                          <option value="READY">Ready</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documentation Checklist */}
                <div style={{ backgroundColor: BRAND.bg, padding: '16px', borderRadius: '6px', border: `1px solid ${BRAND.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: BRAND.secondary }}>
                      Documentation Checklist ({submittedCount}/{REQUIRED_DOCS.length} submitted)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${docProgress}%`, height: '100%', backgroundColor: BRAND.green }}></div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: BRAND.text }}>{docProgress}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {checklist.map((doc) => {
                      const isSubmitted = doc.status === 'SUBMITTED';
                      const isPrepared = doc.status === 'PREPARED';
                      const color = isSubmitted ? BRAND.green : isPrepared ? BRAND.blue : '#9CA3AF';
                      return (
                        <div key={doc.type} style={{
                          padding: '10px 12px',
                          backgroundColor: BRAND.white,
                          borderRadius: '4px',
                          border: `1px solid ${isSubmitted ? BRAND.green : BRAND.border}`,
                          borderLeft: `3px solid ${color}`,
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: BRAND.primary }}>{doc.type.replace(/_/g, ' ')}</div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color, textTransform: 'uppercase', marginTop: '4px' }}>
                            {isSubmitted ? 'Submitted' : isPrepared ? 'Prepared' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ backgroundColor: BRAND.white, padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>Total Shipments</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.accent, fontFamily: "'Barlow Condensed', sans-serif" }}>{totalCount}</div>
              </div>
              <div style={{ backgroundColor: BRAND.white, padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>In Transit</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.yellow, fontFamily: "'Barlow Condensed', sans-serif" }}>{inTransit}</div>
              </div>
              <div style={{ backgroundColor: BRAND.white, padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>Delivered</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.green, fontFamily: "'Barlow Condensed', sans-serif" }}>{delivered}</div>
              </div>
              <div style={{ backgroundColor: BRAND.white, padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>Docs Ready</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.blue, fontFamily: "'Barlow Condensed', sans-serif" }}>{docReady}</div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0 24px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '12px', padding: '12px 16px', backgroundColor: BRAND.primary, color: BRAND.white, fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '6px 6px 0 0', marginTop: '16px' }}>
            <div>Shipment / Vessel</div>
            <div>Container</div>
            <div>Ship Date</div>
            <div>QA</div>
            <div>Docs</div>
            <div>Transit</div>
            <div>Progress</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            {allShipments.map((s) => {
              const isSelected = s.id === selectedId;
              const transitIdx = getTransitIndex(s.transitExport || 'DOCUMENTATION');
              const transitPct = (transitIdx / Math.max(TRANSIT_STEPS.length - 1, 1)) * 100;
              const shipDocs = getDocsForShipment(s.id);
              const submittedDocs = shipDocs.filter((d) => d.status === 'SUBMITTED').length;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedId(isSelected ? null : s.id)}
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
                  <div style={{ fontWeight: 600, color: BRAND.primary }}>{s.name || s.vesselName || (s.id || '').substring(0, 8)}</div>
                  <div style={{ color: BRAND.secondary, fontSize: '12px' }}>{s.containerNumber || 'TBD'}</div>
                  <div style={{ color: BRAND.secondary, fontSize: '12px' }}>{fmtDate(s.shipmentDate)}</div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: QA_COLORS[s.qaStatus] || BRAND.yellow, backgroundColor: `${QA_COLORS[s.qaStatus] || BRAND.yellow}18`, padding: '2px 6px', borderRadius: '3px' }}>
                      {s.qaStatus || 'PENDING'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: BRAND.secondary }}>{submittedDocs}/{REQUIRED_DOCS.length}</div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: BRAND.accent }}>
                      {(s.transitExport || 'DOCUMENTATION').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#E0E0E0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${transitPct}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.3s' }}></div>
                    </div>
                    <span style={{ fontSize: '10px', color: BRAND.text, fontWeight: 600, minWidth: '24px' }}>
                      {transitIdx + 1}/4
                    </span>
                  </div>
                </div>
              );
            })}

            {allShipments.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>
                No export shipments found. Create one from the Sales Order Dashboard.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: SHIPMENT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Shipment & Logistics Tracker',
  component: ShipmentLogisticsDashboard,
});
