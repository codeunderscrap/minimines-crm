import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

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
  
  .quotation-dashboard {
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
  const url = `http://localhost:3000/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';
  
  try {
    const res = await fetch(url, { headers: { Authorization: apiKey, 'Content-Type': 'application/json' } });
    const json = await res.json();
    return json?.data?.items || json?.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const QuotationDashboard = () => {
  const recordId = useRecordId();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!recordId) return;
      const data = await fetchTwenty(`quotations/${recordId}`);
      setQuotation(data);
      setLoading(false);
    };
    loadData();
  }, [recordId]);

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading quotation workflow...</div>;
  }

  if (!quotation) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Could not load quotation details.</div>;
  }

  const status = quotation.approvalStatus || 'DRAFT';
  const steps = [
    { id: 'DRAFT', label: 'Draft' },
    { id: 'HOD_REVIEW', label: 'HOD Review' },
    { id: 'CEO_APPROVED', label: 'CEO Approved' },
    { id: 'CONVERTED_TO_ORDER', label: 'Converted to Order' },
  ];

  let currentStepIndex = steps.findIndex(s => s.id === status);
  if (currentStepIndex === -1 && status === 'REJECTED') {
    currentStepIndex = steps.length; // Max out progress but color red
  } else if (currentStepIndex === -1) {
    currentStepIndex = 0;
  }

  const isRejected = status === 'REJECTED';
  const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <>
      <style>{FONTS}</style>
      <div className="quotation-dashboard">
        <h2 className="h2">Approval Workflow</h2>
        
        {isRejected ? (
          <div style={{ backgroundColor: '#ffebee', border: `1px solid ${BRAND.red}`, padding: '16px', borderRadius: '4px', color: BRAND.red, fontWeight: 600 }}>
            This Quotation was REJECTED.
          </div>
        ) : (
          <div style={{ position: 'relative', padding: '20px 0 40px 0', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '14px', left: '0', right: '0', height: '4px', backgroundColor: '#E0E0E0', zIndex: 0 }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.5s ease-out' }}></div>
              </div>
              {steps.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '10px' }}>
                    <div style={{ 
                      width: isCurrent ? '32px' : '28px', 
                      height: isCurrent ? '32px' : '28px', 
                      borderRadius: '50%', 
                      backgroundColor: isActive ? BRAND.accent : '#E0E0E0', 
                      border: isCurrent ? `3px solid ${BRAND.lightAccent}` : 'none',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#FFF', 
                      fontSize: '13px', 
                      fontWeight: 'bold', 
                      transition: 'all 0.3s' 
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? BRAND.primary : BRAND.text, textAlign: 'center' }}>
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', display: 'flex', gap: '24px' }}>
           <div style={{ flex: 1, padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Requested Quantity</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: BRAND.primary }}>{quotation.quantity || 0} MT</div>
           </div>
           <div style={{ flex: 1, padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Proposed Rate</div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: BRAND.primary }}>₹{Number(quotation.proposedRate || 0).toLocaleString()}</div>
           </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: QUOTATION_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Quotation Workflow',
  component: QuotationDashboard,
});
