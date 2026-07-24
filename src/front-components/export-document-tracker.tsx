import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { EXPORT_DOCUMENT_TRACKER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
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
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&display=swap');
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
    let items = json?.data?.[key] ?? json?.data?.items ?? json?.data ?? [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const patchRecord = async (path: string, body: any) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { method: 'PATCH', headers: API_HEADERS, body: JSON.stringify(body) });
    return await res.json();
  } catch {
    return null;
  }
};

const REQUIRED_DOCS = ['EVD', 'FEMA', 'SCOMET', 'HSN', 'PACKING_NOTE', 'E_WAY_BILL', 'SHIPPING_BILL', 'OTHER'];

const DOC_LABELS: Record<string, string> = {
  EVD: 'Export Value Declaration',
  FEMA: 'FEMA Compliance',
  SCOMET: 'SCOMET Certificate',
  HSN: 'HSN Classification',
  PACKING_NOTE: 'Packing Note',
  E_WAY_BILL: 'E-Way Bill',
  SHIPPING_BILL: 'Shipping Bill',
  OTHER: 'Other Documents',
};

const ExportDocumentTracker = () => {
  const userRole = useUserRole();
  const recordId = useRecordId();
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    const [docs, ships] = await Promise.all([
      fetchList('exportDocuments?limit=200'),
      recordId ? Promise.resolve([]) : fetchList('exportShipments?limit=100'),
    ]);
    setAllDocuments(docs);
    if (!recordId) {
      setShipments(ships);
      if (ships.length > 0 && !selectedShipmentId) setSelectedShipmentId(ships[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [recordId]);

  const handleUpdateDocStatus = async (docId: string, newStatus: string) => {
    setUpdating(true);
    const result = await patchRecord(`exportDocuments/${docId}`, { status: newStatus });
    if (result) {
      showToast(`Document status updated to ${newStatus}`);
      await loadData();
    }
    setUpdating(false);
  };

  if (!recordId && userRole === null) return <RoleLoading />;
  if (!recordId && userRole !== 'hod') return <AccessDenied minRole="hod" />;

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading compliance checklist...</div>;
  }

  const activeShipmentId = recordId || selectedShipmentId;

  if (!recordId && shipments.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", color: BRAND.text }}>No export shipments found.</div>;
  }

  const documents = allDocuments.filter((d) => (d.exportShipmentId || d.exportShipment?.id) === activeShipmentId);
  const submittedCount = documents.filter((d) => d.status === 'SUBMITTED').length;
  const preparedCount = documents.filter((d) => d.status === 'PREPARED').length;
  const progress = Math.round(((submittedCount + preparedCount * 0.5) / REQUIRED_DOCS.length) * 100);
  const activeShipment = shipments.find((s) => s.id === activeShipmentId);

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '12px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', color: BRAND.white, backgroundColor: BRAND.green, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {toast}
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '26px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
              Export Compliance Documents
            </h1>
            <div style={{ fontSize: '13px', color: BRAND.text, marginTop: '2px' }}>
              Track &amp; manage required export documentation per shipment
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {!recordId && shipments.length > 0 && (
              <select
                value={selectedShipmentId || ''}
                onChange={(e) => setSelectedShipmentId(e.target.value)}
                style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '13px', borderRadius: '4px' }}
              >
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>{s.name || s.vesselName || `Shipment ${(s.id || '').substring(0, 6)}`}</option>
                ))}
              </select>
            )}
            <a href="/objects/exportDocuments" target="_parent" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: BRAND.primary, color: BRAND.white, padding: '8px 16px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
              View All Records
            </a>
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: '16px 24px', backgroundColor: BRAND.white, borderBottom: `1px solid ${BRAND.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, marginBottom: '4px' }}>Shipment</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: BRAND.primary, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {activeShipment?.name || activeShipment?.vesselName || 'N/A'}
              </div>
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, marginBottom: '4px' }}>Submitted</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.green, fontFamily: "'Barlow Condensed', sans-serif" }}>{submittedCount}/{REQUIRED_DOCS.length}</div>
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, marginBottom: '4px' }}>Prepared</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: BRAND.blue, fontFamily: "'Barlow Condensed', sans-serif" }}>{preparedCount}</div>
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600, marginBottom: '4px' }}>Overall Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: BRAND.green }}></div>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: BRAND.primary }}>{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Checklist */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {REQUIRED_DOCS.map((docType) => {
              const foundDoc = documents.find((d) => d.documentType === docType);
              const isSubmitted = foundDoc?.status === 'SUBMITTED';
              const isPrepared = foundDoc?.status === 'PREPARED';

              let statusColor = '#9CA3AF';
              if (isSubmitted) statusColor = BRAND.green;
              else if (isPrepared) statusColor = BRAND.blue;

              return (
                <div key={docType} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  backgroundColor: BRAND.white,
                  borderRadius: '6px',
                  border: `1px solid ${isSubmitted ? BRAND.green : BRAND.border}`,
                  borderLeft: `4px solid ${statusColor}`,
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '14px' }}>{docType.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: '11px', color: BRAND.text, marginTop: '2px' }}>{DOC_LABELS[docType]}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {foundDoc && (
                      <select
                        value={foundDoc.status || 'PENDING'}
                        onChange={(e) => handleUpdateDocStatus(foundDoc.id, e.target.value)}
                        disabled={updating}
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontWeight: 600 }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PREPARED">Prepared</option>
                        <option value="SUBMITTED">Submitted</option>
                      </select>
                    )}
                    {!foundDoc && (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>
                        Not Created
                      </span>
                    )}
                    {isSubmitted && (
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: BRAND.green, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: EXPORT_DOCUMENT_TRACKER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Export Compliance Checklist',
  component: ExportDocumentTracker,
});
