import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { EXPORT_DOCUMENT_TRACKER_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  green: '#2E8B57',
  red: '#D32F2F',
  orange: '#F57C00',
  gray: '#9E9E9E'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Roboto+Slab:wght@400&family=Barlow:wght@400;500;600&display=swap');
  
  .compliance-tracker {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background: ${BRAND.white};
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 27, 46, 0.04);
    border: 1px solid ${BRAND.border};
  }

  .h2 {
    font-family: 'Barlow Condensed', sans-serif;
    color: ${BRAND.primary};
    text-transform: uppercase;
    font-size: 24px;
    margin: 0 0 16px 0;
  }
`;

const fetchTwenty = async (path: string) => {
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';
  
  try {
    const res = await fetch(url, { headers: { Authorization: apiKey, 'Content-Type': 'application/json' } });
    const json = await res.json();
    return json?.data?.items || json?.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const ExportDocumentTracker = () => {
  const recordId = useRecordId();
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Fetch documents related to shipments — filtered client-side since
      // standard REST filter syntax might vary.
      const allDocs = await fetchTwenty(`exportDocuments?limit=100`);
      setAllDocuments(Array.isArray(allDocs) ? allDocs : []);

      if (!recordId) {
        // Standalone-page mode: no shipment in context, offer a picker.
        const allShipments = await fetchTwenty(`exportShipments?limit=100`);
        const items = Array.isArray(allShipments) ? allShipments : [];
        setShipments(items);
        if (items.length > 0) setSelectedShipmentId(items[0].id);
      }
      setLoading(false);
    };
    loadData();
  }, [recordId]);

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading compliance checklist...</div>;
  }

  const activeShipmentId = recordId || selectedShipmentId;

  if (!recordId && shipments.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", color: BRAND.text }}>No export shipments found.</div>;
  }

  const documents = allDocuments.filter(d => d.exportShipmentId === activeShipmentId);
  const REQUIRED_DOCS = ['EVD', 'FEMA', 'SCOMET', 'HSN', 'PACKING_NOTE', 'SHIPPING_BILL'];

  return (
    <>
      <style>{FONTS}</style>
      <div className="compliance-tracker">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 className="h2" style={{ margin: 0 }}>Compliance Documentation</h2>
          {!recordId && shipments.length > 0 && (
            <select
              value={selectedShipmentId || ''}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
            >
              {shipments.map(s => <option key={s.id} value={s.id}>{s.name || s.vesselName || `Shipment ${(s.id || '').substring(0, 6)}`}</option>)}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {REQUIRED_DOCS.map(docType => {
            const foundDoc = documents.find(d => d.documentType === docType);
            const isSubmitted = foundDoc?.status === 'SUBMITTED';
            const isPrepared = foundDoc?.status === 'PREPARED';
            
            let statusColor = BRAND.gray;
            let statusText = 'Pending';
            
            if (isSubmitted) {
              statusColor = BRAND.green;
              statusText = 'Submitted to CHA';
            } else if (isPrepared) {
              statusColor = BRAND.accent;
              statusText = 'Prepared & Signed';
            }

            return (
              <div key={docType} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px', 
                backgroundColor: BRAND.bg, 
                borderRadius: '6px', 
                border: `1px solid ${isSubmitted ? BRAND.green : BRAND.border}`,
                borderLeft: `4px solid ${statusColor}`
              }}>
                <div style={{ fontWeight: 600, color: BRAND.primary }}>{docType.replace('_', ' ')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isSubmitted && (
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: BRAND.green, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: statusColor, textTransform: 'uppercase' }}>
                    {statusText}
                  </span>
                </div>
              </div>
            );
          })}
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

