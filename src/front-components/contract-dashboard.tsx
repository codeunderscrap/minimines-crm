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

const API_HEADERS = {
  'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ'
};

const ContractDashboard = () => {
  const recordId = useRecordId();
  const [recordContract, setRecordContract] = useState<any>(null);
  const [allContracts, setAllContracts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Record-page mode: a specific contract was opened, fetch just that one.
  useEffect(() => {
    if (!recordId) return;
    const fetchContract = async () => {
      try {
        const response = await fetch(`https://api.twenty.com/rest/contracts/${recordId}`, { headers: API_HEADERS });
        const json = await response.json();
        if (json.data && json.data.contract) {
          setRecordContract(json.data.contract);
        }
      } catch (err) {
        console.error('Failed to load contract', err);
      }
    };
    fetchContract();
  }, [recordId]);

  // Standalone-page mode: no record in context, fetch all contracts for a picker.
  useEffect(() => {
    if (recordId) return;
    const fetchAll = async () => {
      try {
        const response = await fetch('https://api.twenty.com/rest/contracts?orderBy=createdAt,desc&limit=100', { headers: API_HEADERS });
        const json = await response.json();
        let items = json.data?.contracts || [];
        if (items && items.edges) items = items.edges.map((e: any) => e.node);
        if (!Array.isArray(items)) items = [];
        setAllContracts(items);
        if (items.length > 0) setSelectedId(items[0].id);
      } catch (err) {
        console.error('Failed to load contracts', err);
      }
    };
    fetchAll();
  }, [recordId]);

  const contract = recordId ? recordContract : (allContracts.find(c => c.id === selectedId) || null);

  if (!recordId && allContracts.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", color: BRAND.text }}>No contracts found.</div>;
  }
  if (!contract) return null;

  const totalQuantity = contract.totalQuantity || 0;
  // Calculate a fake fulfillment progress based on the total quantity for visual demonstration
  const fulfilledQuantity = Math.floor(totalQuantity * 0.4);
  const progressPercent = totalQuantity > 0 ? (fulfilledQuantity / totalQuantity) * 100 : 0;

  const startTime = contract.startDate ? new Date(contract.startDate).getTime() : null;
  const endTime = contract.endDate ? new Date(contract.endDate).getTime() : null;
  const now = Date.now();
  let elapsedPercent = 0;
  let timelineLabel = 'No dates set';
  if (startTime && endTime && endTime > startTime) {
    elapsedPercent = Math.max(0, Math.min(100, ((now - startTime) / (endTime - startTime)) * 100));
    timelineLabel = now < startTime ? 'Not started yet' : now > endTime ? 'Contract ended' : `${Math.round(elapsedPercent)}% of duration elapsed`;
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase', margin: 0 }}>Contract Insights & Analytics</h2>
        {!recordId && allContracts.length > 0 && (
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
          >
            {allContracts.map(c => <option key={c.id} value={c.id}>{c.name || `Contract ${(c.id || '').substring(0, 6)}`}</option>)}
          </select>
        )}
      </div>

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

        {/* Timeline */}
        <div style={{ backgroundColor: BRAND.bg, padding: '16px', border: `1px solid ${BRAND.border}` }}>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Contract Timeline</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: BRAND.text }}>
            <span>Start: {contract.startDate ? new Date(contract.startDate).toLocaleDateString() : 'N/A'}</span>
            <span>End: {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}</span>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '8px', backgroundColor: '#E0E0E0', borderRadius: '4px', margin: '18px 0 8px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${elapsedPercent}%`, backgroundColor: BRAND.accent, borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: BRAND.primary, border: '2px solid #FFF' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '100%', transform: 'translate(-50%, -50%)', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: BRAND.lightAccent, border: '2px solid #FFF' }}></div>
            {startTime && endTime && now >= startTime && now <= endTime && (
              <div style={{ position: 'absolute', top: '50%', left: `${elapsedPercent}%`, transform: 'translate(-50%, -50%)', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#FFF', border: `3px solid ${BRAND.accent}` }} title="Today"></div>
            )}
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: BRAND.secondary }}>{timelineLabel}</div>
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

