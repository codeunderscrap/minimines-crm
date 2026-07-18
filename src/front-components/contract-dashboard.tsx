import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { CONTRACT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

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

const ContractDashboard = () => {
  const recordId = useRecordId();
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (!recordId) return;
    
    const fetchContract = async () => {
      try {
        const response = await fetch(`https://api.twenty.com/rest/contracts/${recordId}`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ'
          }
        });
        const json = await response.json();
        if (json.data && json.data.contract) {
          setContract(json.data.contract);
        }
      } catch (err) {
        console.error('Failed to load contract', err);
      }
    };
    fetchContract();
  }, [recordId]);

  if (!contract) return null;

  const totalQuantity = contract.totalQuantity || 0;
  // Calculate a fake fulfillment progress based on the total quantity for visual demonstration
  const fulfilledQuantity = Math.floor(totalQuantity * 0.4); 
  const progressPercent = totalQuantity > 0 ? (fulfilledQuantity / totalQuantity) * 100 : 0;

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
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase', margin: '0 0 16px 0' }}>Contract Insights & Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Quantity Tracker */}
        <div style={{ backgroundColor: BRAND.bg, padding: '16px', border: `1px solid ${BRAND.border}` }}>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Volume Fulfillment</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: BRAND.primary }}>{fulfilledQuantity} MT</span>
            <span style={{ fontSize: '14px', color: BRAND.text, alignSelf: 'flex-end' }}>of {totalQuantity} MT</span>
          </div>
          
          <div style={{ width: '100%', height: '12px', backgroundColor: '#E0E0E0', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 1s' }}></div>
          </div>
        </div>

        {/* Timeline Gantt */}
        <div style={{ backgroundColor: BRAND.bg, padding: '16px', border: `1px solid ${BRAND.border}` }}>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Contract Timeline</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: BRAND.text }}>
            <span>Start: {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : 'N/A'}</span>
            <span>End: {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          
          <div style={{ position: 'relative', width: '100%', height: '24px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', width: '60%', height: '100%', backgroundColor: BRAND.lightAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#FFF', fontWeight: 'bold', letterSpacing: '1px' }}>
              ACTIVE DURATION
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: CONTRACT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Contract Dashboard',
  component: ContractDashboard
});

