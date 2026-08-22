import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useUserId } from 'twenty-sdk/front-component';
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
  const url = `https://minimines.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';
  
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
  const rawUserId = useUserId();
  const [currentMemberId, setCurrentMemberId] = useState<string>('');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [lmeRates, setLmeRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOppIds, setSelectedOppIds] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<any>(null);
  const [workedbyOptions, setWorkedbyOptions] = useState<string[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  
  // Soft RLS Virtual Identity State
  const [virtualIdentity, setVirtualIdentity] = useState<string>(
    typeof window !== 'undefined' ? (window.localStorage.getItem('virtualIdentity') || 'All') : 'All'
  );

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setVirtualIdentity(val);
    if (typeof window !== 'undefined') window.localStorage.setItem('virtualIdentity', val);
  };

  const fetchGraphQL = async (query: string) => {
    try {
      const res = await fetch('https://minimines.twenty.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      return json?.data;
    } catch {
      return null;
    }
  };

  const loadData = async () => {
    setLoading(true);
    const schemaQuery = `{ __type(name: "LeadWorkedbyEnum") { enumValues { name } } }`;
    const [data, schema, quosData, membersData, lmeData] = await Promise.all([
      fetchTwenty('bdOpportunities?limit=100&depth=1'),
      fetchGraphQL(schemaQuery),
      fetchTwenty('quotations?limit=100'),
      fetchTwenty('workspaceMembers?limit=100'),
      fetchTwenty('lMETrackers?limit=50&orderBy=createdAt,desc')
    ]);
    setOpportunities(Array.isArray(data) ? data : []);
    setQuotations(Array.isArray(quosData) ? quosData : []);
    setLmeRates(Array.isArray(lmeData) ? lmeData : []);
    
    let members = membersData?.workspaceMembers || membersData || [];
    if (members?.edges) members = members.edges.map((e: any) => e.node);
    const me = (Array.isArray(members) ? members : []).find(
      (m: any) => m.userId === rawUserId || m.id === rawUserId
    );
    if (me) {
      setCurrentMemberId(me.id);
    }
    
    const opts = schema?.__type?.enumValues?.map((e: any) => e.name) || [];
    setWorkedbyOptions(opts);
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' && window.location ? window.location.search : '');
    const highlightId = params.get('id');
    
    if (highlightId && opportunities.length > 0) {
      setSelectedOppIds(new Set([highlightId]));
      setTimeout(() => {
        const el = document.getElementById(`opp-row-${highlightId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [opportunities]);


  const handleUpdateStage = async (id: string, stage: string) => {
    setIsUpdating(true);
    await fetchTwenty(`bdOpportunities/${id}`, 'PATCH', { stage });
    await loadData();
    setIsUpdating(false);
  };

  const handleCreateQuotation = async (opp: any) => {
    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // Guess metal type from context
      const text = (opp.name + ' ' + (opp.requirements || '')).toUpperCase();
      let guessedMetal = 'CU';
      if (text.includes('ALUMINUM') || text.includes('ALUMINIUM')) guessedMetal = 'AL';
      else if (text.includes('IRON')) guessedMetal = 'FE';
      else if (text.includes('LITHIUM')) guessedMetal = 'LI';
      
      const latestRateRecord = lmeRates.find((r) => r.metalType === guessedMetal);
      let baseRate = latestRateRecord?.rateUSD || 0;

      const url = `https://minimines.twenty.com/rest/quotations`;
      const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteNumber: `QT-${Date.now().toString(36).toUpperCase()}`,
          buyerCompanyId: opp.companyNameId ? { connect: { id: opp.companyNameId } } : undefined,
          productId: '',
          quantity: 0,
          proposedRate: { amountMicros: Math.round(baseRate * 1000000), currencyCode: 'USD' },
          approvalStatus: 'DRAFT',
          linkedOpportunityId: opp.id,
          associateName: opp.associateName || '',
        }),
      });
      const quot = await res.json();

      if (!res.ok) {
        const errMsg = quot?.error?.message || quot?.message || JSON.stringify(quot);
        setErrorMsg(`Failed to create quotation: ${errMsg}`);
        return;
      }

      const newId = quot?.data?.id || quot?.data?.createQuotation?.id || quot?.id || null;

      if (newId) {
        setSuccessMsg(
          <div style={{ padding: '16px', backgroundColor: '#EBF5FF', color: '#1E40AF', border: '1px solid #3B82F6', borderRadius: '4px', marginBottom: '24px' }}>
            Quotation created!{' '}
            <a href={`/object/quotation/${newId}`} target="_parent" style={{ color: '#1D4ED8', fontWeight: 'bold', textDecoration: 'underline' }}>
              Open Quotation to fill in details
            </a>
          </div>
        );
      } else {
        setSuccessMsg(
          <div style={{ padding: '16px', backgroundColor: '#EBF5FF', color: '#1E40AF', border: '1px solid #3B82F6', borderRadius: '4px', marginBottom: '24px' }}>
            Quotation created! View it on the Quotation Dashboard.
          </div>
        );
      }
      await loadData();
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to create quotation.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateSalesOrder = async (opp: any) => {
    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const oppCompanyName = (typeof opp.companyName === 'object' && opp.companyName !== null ? opp.companyName.name : opp.companyName) || opp.name;
      const so = await fetchTwenty('salesOrders', 'POST', {
        name: `Order for ${oppCompanyName}`,
        linkedOpportunityId: opp.id,
        quantity: 0,
        fulfillmentStatus: 'PENDING',
        company: opp.companyNameId ? { connect: { id: opp.companyNameId } } : undefined,
        associateName: opp.associateName || '',
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
            <div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                BD Opportunity Pipeline
              </h1>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '16px', color: BRAND.text }}>
                Manage transferred leads, negotiate deals, and convert to sales orders.
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontWeight: 600, fontSize: '14px', color: BRAND.secondary }}>
                Viewing As:
              </label>
              <select
                value={virtualIdentity}
                onChange={handleIdentityChange}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: `1px solid ${BRAND.border}`,
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: BRAND.white,
                  color: BRAND.primary,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="All">View All ({userRole === 'hod' ? 'HOD Bird View' : 'Team View'})</option>
                {workedbyOptions.map(name => (
                  <option key={name} value={name}>{name.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {STAGES.map(stage => {
              const filteredOpps = opportunities.filter(o => {
                if (userRole === 'manager' && o.assignedManagerPrimaryId !== currentMemberId) return false;
                return (virtualIdentity === 'All' || o.associateName === virtualIdentity);
              });
              
              const stageOpps = filteredOpps.filter(o => o.stage === stage.id || (!o.stage && stage.id === 'REQUIREMENTS'));
              return (
                <div key={stage.id} style={{ backgroundColor: BRAND.white, borderRadius: '8px', border: `1px solid ${BRAND.border}`, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ padding: '16px', borderBottom: `3px solid ${stage.color}`, backgroundColor: `${stage.color}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: BRAND.primary }}>{stage.label}</div>
                    <div style={{ backgroundColor: BRAND.white, padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, border: `1px solid ${BRAND.border}` }}>
                      {stageOpps.length}
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, backgroundColor: BRAND.bg }}>
                    {stageOpps.map(opp => {
                      const oppQuotations = quotations.filter(q => q.linkedOpportunityId === opp.id);
                      const hasApprovedQuote = oppQuotations.some(q => q.approvalStatus === 'HOD_APPROVED');
                      const latestQuote = oppQuotations.length > 0 ? oppQuotations[oppQuotations.length - 1] : null;

                      return (
                      <div key={opp.id} id={`opp-row-${opp.id}`} style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '6px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontWeight: 600, color: BRAND.primary, marginBottom: '4px' }}>{opp.name}</div>
                        <div style={{ fontSize: '12px', color: BRAND.secondary, marginBottom: '12px' }}>{(typeof opp.companyName === 'object' && opp.companyName !== null ? opp.companyName.name : opp.companyName) || 'No Company'}</div>
                        
                        {/* Approval Status Badge */}
                        {latestQuote && opp.stage === 'NEGOTIATION' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: latestQuote.approvalStatus === 'HOD_APPROVED' ? '#dcfce7' : (latestQuote.approvalStatus === 'REJECTED' ? '#fee2e2' : '#fef9c3'), color: latestQuote.approvalStatus === 'HOD_APPROVED' ? '#166534' : (latestQuote.approvalStatus === 'REJECTED' ? '#991b1b' : '#854d0e'), borderRadius: '12px', fontWeight: 600 }}>
                              Quote Status: {latestQuote.approvalStatus?.replace(/_/g, ' ') || 'DRAFT'}
                            </div>
                            <div />
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <select 
                            value={opp.stage || 'REQUIREMENTS'} 
                            onChange={e => handleUpdateStage(opp.id, e.target.value)}
                            disabled={isUpdating}
                            style={{ width: '100%', padding: '6px', fontSize: '12px', borderRadius: '4px', border: `1px solid ${BRAND.border}` }}
                          >
                            <option value="REQUIREMENTS">Move to: Requirements</option>
                            <option value="NEGOTIATION">Move to: Negotiation</option>
                            <option value="WON" disabled={!hasApprovedQuote}>Move to: Won {(!hasApprovedQuote) && '(Requires HOD Approval)'}</option>
                            <option value="LOST">Move to: Lost</option>
                          </select>

                          {opp.stage === 'NEGOTIATION' && (
                            <button
                              onClick={() => handleCreateQuotation(opp)}
                              disabled={isUpdating || (latestQuote && latestQuote.approvalStatus !== 'REJECTED' && latestQuote.approvalStatus !== 'DRAFT')}
                              style={{ width: '100%', padding: '8px', backgroundColor: (latestQuote && latestQuote.approvalStatus !== 'REJECTED' && latestQuote.approvalStatus !== 'DRAFT') ? (latestQuote.approvalStatus === 'HOD_APPROVED' ? BRAND.green : BRAND.secondary) : '#3B82F6', color: BRAND.white, border: 'none', borderRadius: '4px', fontWeight: 600, cursor: (latestQuote && latestQuote.approvalStatus !== 'REJECTED' && latestQuote.approvalStatus !== 'DRAFT') ? 'not-allowed' : 'pointer', fontSize: '12px' }}
                            >
                              {latestQuote ? (latestQuote.approvalStatus === 'REJECTED' ? '+ Re-create Quotation' : (latestQuote.approvalStatus === 'HOD_APPROVED' ? 'In Talk with Client' : 'Quotation In Progress')) : '+ Create Quotation'}
                            </button>
                          )}

                          {opp.stage === 'WON' && (
                            <button 
                              onClick={() => handleGenerateSalesOrder(opp)}
                              disabled={isUpdating || !hasApprovedQuote}
                              style={{ width: '100%', padding: '8px', backgroundColor: hasApprovedQuote ? BRAND.primary : BRAND.secondary, color: BRAND.white, border: 'none', borderRadius: '4px', fontWeight: 600, cursor: hasApprovedQuote ? 'pointer' : 'not-allowed', fontSize: '12px' }}
                            >
                              + Create Sales Order
                            </button>
                          )}
                        </div>
                      </div>
                      );
                    })}
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


// cache-bust: 1786104341236