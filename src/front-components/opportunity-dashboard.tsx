import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { OPPORTUNITY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

const BRAND = {
  primary: '#001B2E',
  secondary: '#294C60',
  accent: '#FFC857',
  text: '#1F2937',
  bg: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB',
  green: '#10B981',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  red: '#EF4444'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@300;400;600&display=swap');
`;

const STAGES = [
  { id: 'REQUIREMENTS', label: 'Requirements Gathering', color: BRAND.blue },
  { id: 'NEGOTIATION', label: 'Negotiation', color: BRAND.yellow },
  { id: 'WON', label: 'Won (Ready for Order)', color: BRAND.green },
  { id: 'LOST', label: 'Lost', color: BRAND.red },
];

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';
  
  try {
    const opts: any = {
      method,
      headers: { 
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    };
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(url, opts);
    const json = await res.json();
    
    if (method !== 'GET') return json;

    if (json.data && Array.isArray(json.data)) {
      return json.data;
    }
    const key = path.split('?')[0]; // Extract base path e.g. leads
    let items = json.data && json.data[key] ? json.data[key] : [];
    if (items && items.edges) {
      items = items.edges.map((e: any) => e.node);
    }
    return Array.isArray(items) ? items : (json.data?.edges?.map((e: any) => e.node) || json.data || []);
  } catch (error) {
    console.error('fetchTwenty Error:', error);
    return [];
  }
};

const OpportunityDashboard = () => {
  const userRole = useUserRole();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTwenty('bdOpportunities?limit=100');
    setOpportunities(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStage = async (id: string, stage: string) => {
    setIsUpdating(true);
    await fetchTwenty(`bdOpportunities/${id}`, 'PATCH', { stage });
    await loadData();
    setIsUpdating(false);
  };

  const handleGenerateSalesOrder = async (opp: any) => {
    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const so = await fetchTwenty('salesOrders', 'POST', {
        name: `Order for ${opp.companyName || opp.name}`,
        linkedOpportunityId: opp.id,
        quantity: 0,
        fulfillmentStatus: 'PENDING',
      });
      
      let newSoId = null;
      if (so?.data?.id) newSoId = so.data.id;
      else if (so?.data?.createSalesOrder?.id) newSoId = so.data.createSalesOrder.id;
      else if (so?.id) newSoId = so.id;

      if (newSoId) {
        setSuccessMsg(
          <div style={{ padding: '16px', backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #10B981', borderRadius: '4px', marginBottom: '24px' }}>
            Sales Order generated successfully!{' '}
            <a href={`/object/salesOrder/${newSoId}`} target="_parent" style={{ color: '#047857', fontWeight: 'bold', textDecoration: 'underline' }}>
              Click here to open and edit the order.
            </a>
          </div>
        );
      } else {
        setSuccessMsg(
          <div style={{ padding: '16px', backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #10B981', borderRadius: '4px', marginBottom: '24px' }}>
            Sales Order generated successfully!
          </div>
        );
      }
      await loadData();
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to generate sales order.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (userRole === null) return <RoleLoading />;
  if (userRole === 'associate') return <AccessDenied minRole="manager" />;

  if (loading && opportunities.length === 0) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading BD Pipeline...</div>;
  }

  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-opportunity-dashboard" style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {errorMsg && (
            <div style={{ padding: '16px', backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #EF4444', borderRadius: '4px', marginBottom: '24px' }}>
              {errorMsg}
            </div>
          )}
          {successMsg && successMsg}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              BD Opportunity Pipeline
            </h1>
            <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '16px', color: BRAND.text }}>
              Manage transferred leads, negotiate deals, and convert to sales orders.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {STAGES.map(stage => {
              const stageOpps = opportunities.filter(o => o.stage === stage.id || (!o.stage && stage.id === 'REQUIREMENTS'));
              return (
                <div key={stage.id} style={{ backgroundColor: BRAND.white, borderRadius: '8px', border: `1px solid ${BRAND.border}`, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ padding: '16px', borderBottom: `3px solid ${stage.color}`, backgroundColor: `${stage.color}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: BRAND.primary }}>{stage.label}</div>
                    <div style={{ backgroundColor: BRAND.white, padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, border: `1px solid ${BRAND.border}` }}>
                      {stageOpps.length}
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, backgroundColor: BRAND.bg }}>
                    {stageOpps.map(opp => (
                      <div key={opp.id} style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '6px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontWeight: 600, color: BRAND.primary, marginBottom: '4px' }}>{opp.name}</div>
                        <div style={{ fontSize: '12px', color: BRAND.secondary, marginBottom: '12px' }}>{opp.companyName || 'No Company'}</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <select 
                            value={opp.stage || 'REQUIREMENTS'} 
                            onChange={e => handleUpdateStage(opp.id, e.target.value)}
                            disabled={isUpdating}
                            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: `1px solid ${BRAND.border}` }}
                          >
                            {STAGES.map(s => <option key={s.id} value={s.id}>Move to: {s.label}</option>)}
                          </select>

                          {opp.stage === 'WON' && (
                            <button 
                              onClick={() => handleGenerateSalesOrder(opp)}
                              disabled={isUpdating}
                              style={{ width: '100%', padding: '8px', backgroundColor: BRAND.primary, color: BRAND.white, border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                            >
                              + Create Sales Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {stageOpps.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px', color: BRAND.secondary, fontSize: '12px', fontStyle: 'italic' }}>
                        No opportunities in this stage.
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
  universalIdentifier: OPPORTUNITY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Opportunity Pipeline',
  description: 'Kanban view for tracking deal negotiations',
  component: OpportunityDashboard,
});

