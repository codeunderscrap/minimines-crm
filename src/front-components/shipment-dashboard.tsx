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

const ShipmentDashboard = () => {
  const recordId = useRecordId();
  const [shipment, setShipment] = useState<any>(null);

  useEffect(() => {
    if (!recordId) return;
    
    const fetchShipment = async () => {
      try {
        const response = await fetch(`https://api.twenty.com/rest/exportShipments/${recordId}`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA'
          }
        });
        const json = await response.json();
        if (json.data && json.data.exportShipment) {
          setShipment(json.data.exportShipment);
        }
      } catch (err) {
        console.error('Failed to load shipment', err);
      }
    };
    fetchShipment();
  }, [recordId]);

  if (!shipment) return null;

  const rawStatus = shipment.transitStatus || shipment.shipmentStatus || 'DOCUMENTATION';
  const currentStatus = (typeof rawStatus === 'string' ? rawStatus : String(rawStatus)).toUpperCase();

  const steps = [
    { label: 'Documentation', active: true },
    { label: 'Customs', active: ['CUSTOMS', 'IN_TRANSIT', 'DELIVERED', 'PASSED'].includes(currentStatus) },
    { label: 'In Transit', active: ['IN_TRANSIT', 'DELIVERED'].includes(currentStatus) },
    { label: 'Delivered', active: ['DELIVERED'].includes(currentStatus) }
  ];
  
  const activeStepsCount = steps.filter(s => s.active).length;
  const progressPercent = ((activeStepsCount - 1) / (steps.length - 1)) * 100;

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
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase', margin: '0 0 16px 0' }}>Logistics Tracker</h2>
      
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
              <span style={{ color: BRAND.text, fontSize: '14px' }}>Transit Status:</span>
              <span style={{ fontWeight: 600, color: BRAND.accent }}>{currentStatus}</span>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ backgroundColor: BRAND.bg, padding: '16px', border: `1px solid ${BRAND.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '24px' }}>Transit Progress</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Line connecting steps */}
            <div style={{ position: 'absolute', top: '12px', left: '10%', right: '10%', height: '4px', backgroundColor: '#E0E0E0', zIndex: 0 }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.5s ease-out' }}></div>
            </div>
            
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: step.active ? BRAND.accent : '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '12px', fontWeight: 'bold', transition: 'background-color 0.3s' }}>
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
