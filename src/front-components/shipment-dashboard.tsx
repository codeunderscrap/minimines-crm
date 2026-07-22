import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { SHIPMENT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
};

const API_HEADERS = {
  'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ'
};

const ShipmentDashboard = () => {
  const recordId = useRecordId();
  const [recordShipment, setRecordShipment] = useState<any>(null);
  const [allShipments, setAllShipments] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (recordId) {
        try {
          const response = await fetch(`https://api.twenty.com/rest/exportShipments/${recordId}`, { headers: API_HEADERS });
          const json = await response.json();
          if (json.data && json.data.exportShipment) setRecordShipment(json.data.exportShipment);
        } catch (err) {
          console.error('Failed to load shipment', err);
        }
      } else {
        try {
          const response = await fetch('https://api.twenty.com/rest/exportShipments?orderBy=createdAt,desc&limit=100', { headers: API_HEADERS });
          const json = await response.json();
          let items = json.data?.exportShipments || [];
          if (items && items.edges) items = items.edges.map((e: any) => e.node);
          if (!Array.isArray(items)) items = [];
          setAllShipments(items);
          if (items.length > 0) setSelectedId(items[0].id);
        } catch (err) {
          console.error('Failed to load shipments', err);
        }
      }
    };
    load();
  }, [recordId]);

  const shipment = recordId ? recordShipment : (allShipments.find(s => s.id === selectedId) || null);

  if (!recordId && allShipments.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", color: BRAND.text }}>No export shipments found.</div>;
  }
  if (!shipment) return null;

  const steps = [
    { label: 'Documentation', active: true },
    { label: 'Customs', active: shipment.qaStatus === 'PASSED' },
    { label: 'In Transit', active: shipment.qaStatus === 'PASSED' },
    { label: 'Delivered', active: false }
  ];

  return (
    <div style={{
      fontFamily: "'Barlow', sans-serif",
      backgroundColor: '#FFFFFF',
      border: `1px solid ${BRAND.border}`,
      padding: '24px',
      marginBottom: '24px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase', margin: 0 }}>Logistics Tracker</h2>
        {!recordId && allShipments.length > 0 && (
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
          >
            {allShipments.map(s => <option key={s.id} value={s.id}>{s.name || s.vesselName || `Shipment ${(s.id || '').substring(0, 6)}`}</option>)}
          </select>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Info Card */}
        <div style={{ backgroundColor: BRAND.bg, padding: '16px', border: `1px solid ${BRAND.border}` }}>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Vessel & Cargo</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: BRAND.text, fontSize: '14px' }}>Vessel:</span>
              <span style={{ fontWeight: 600, color: BRAND.primary }}>{shipment.vesselName || 'TBD'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: BRAND.text, fontSize: '14px' }}>Container:</span>
              <span style={{ fontWeight: 600, color: BRAND.primary }}>{shipment.containerNumber || 'TBD'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${BRAND.border}`, paddingTop: '8px', marginTop: '4px' }}>
              <span style={{ color: BRAND.text, fontSize: '14px' }}>QA Status:</span>
              <span style={{ fontWeight: 600, color: shipment.qaStatus === 'PASSED' ? BRAND.accent : BRAND.primary }}>{shipment.qaStatus || 'PENDING'}</span>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ backgroundColor: BRAND.bg, padding: '16px', border: `1px solid ${BRAND.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '24px' }}>Transit Progress</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Line connecting steps */}
            <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '4px', backgroundColor: '#E0E0E0', zIndex: 0 }}>
              <div style={{ width: '60%', height: '100%', backgroundColor: BRAND.accent }}></div>
            </div>
            
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step.active ? BRAND.accent : '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '12px', fontWeight: 'bold' }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: '12px', fontWeight: step.active ? 600 : 400, color: step.active ? BRAND.primary : BRAND.text }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: SHIPMENT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Shipment Tracker',
  component: ShipmentDashboard
});

