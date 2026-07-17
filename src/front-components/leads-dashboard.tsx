import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState, useEffect } from 'react';
import { LEADS_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

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
  yellow: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');

  .minimines-leads-dashboard {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background-color: ${BRAND.bg};
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
  }
`;

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';
  
  const options: any = {
    method,
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    
    if (method !== 'GET') return json;

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

const LeadsDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [selectedExecutive, setSelectedExecutive] = useState('UNASSIGNED');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTwenty('leads?limit=100');
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleLeadSelection = (id: string) => {
    const newSelection = new Set(selectedLeadIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedLeadIds(newSelection);
  };

  const selectAll = () => {
    if (selectedLeadIds.size === leads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(leads.map(l => l.id)));
    }
  };

  const handleBulkAssign = async () => {
    if (selectedLeadIds.size === 0) return;
    setIsUpdating(true);
    
    try {
      const promises = Array.from(selectedLeadIds).map(id => 
        fetchTwenty(`leads/${id}`, 'PATCH', { assignedTo: selectedExecutive })
      );
      await Promise.all(promises);
      
      setSelectedLeadIds(new Set());
      await loadData();
    } catch (e) {
      console.error("Failed bulk assign", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConvertToOpportunity = async (lead: any) => {
    setIsUpdating(true);
    try {
      // 1. Create Opportunity
      const opp = await fetchTwenty('opportunities', 'POST', {
        name: `${lead.company || lead.name} - Opportunity`,
        linkedLeadId: lead.id,
        companyName: lead.company || '',
        stage: 'REQUIREMENTS',
      });
      // 2. Update Lead
      if (opp && opp.data && opp.data.id) {
        await fetchTwenty(`leads/${lead.id}`, 'PATCH', {
          convertedToOpportunityId: opp.data.id,
          status: 'QUALIFIED'
        });
      }
      await loadData();
    } catch (e) {
      console.error("Failed to convert", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFollowUp = async (leadId: string, followUpStatus: string) => {
    setIsUpdating(true);
    try {
      await fetchTwenty(`leads/${leadId}`, 'PATCH', { followUpStatus });
      await loadData();
    } catch (e) {
      console.error("Failed to update follow up", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendAcknowledgment = async (leadId: string) => {
    setIsUpdating(true);
    try {
      // Mock sending email
      alert('Acknowledgment email sent to Lead!');
      await fetchTwenty(`leads/${leadId}`, 'PATCH', { acknowledgmentSent: true });
      await loadData();
    } catch (e) {
      console.error("Failed to send ack", e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && leads.length === 0) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading Leads Pipeline...</div>;
  }

  const getStatusColor = (status: string) => {
    if (status === 'NEW') return BRAND.blue;
    if (status === 'CONTACTED') return BRAND.yellow;
    if (status === 'QUALIFIED') return BRAND.green;
    if (status === 'DISQUALIFIED') return BRAND.red;
    return BRAND.secondary;
  };

  const getAssignedColor = (assignedTo: string) => {
    if (assignedTo === 'MANISH') return BRAND.blue;
    if (assignedTo === 'EXECUTIVE_1') return BRAND.green;
    if (assignedTo === 'EXECUTIVE_2') return BRAND.purple;
    return BRAND.text; // UNASSIGNED
  };
  
  const formatAssignedTo = (assignedTo: string) => {
    if (assignedTo === 'MANISH') return 'Manish';
    if (assignedTo === 'EXECUTIVE_1') return 'Executive 1';
    if (assignedTo === 'EXECUTIVE_2') return 'Executive 2';
    return 'Unassigned';
  };

  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-leads-dashboard">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                Lead Distribution Center
              </h1>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '16px', color: BRAND.text }}>
                Manage and allocate incoming prospects
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ color: BRAND.primary, fontWeight: 600 }}>
                {selectedLeadIds.size} Leads Selected
              </div>
              <select 
                value={selectedExecutive}
                onChange={e => setSelectedExecutive(e.target.value)}
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '4px', 
                  border: `1px solid ${BRAND.border}`,
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '14px'
                }}
              >
                <option value="UNASSIGNED">Unassigned</option>
                <option value="MANISH">Manish</option>
                <option value="EXECUTIVE_1">Executive 1</option>
                <option value="EXECUTIVE_2">Executive 2</option>
              </select>
              <button 
                onClick={handleBulkAssign}
                disabled={selectedLeadIds.size === 0 || isUpdating}
                style={{
                  backgroundColor: selectedLeadIds.size > 0 ? BRAND.primary : BRAND.text,
                  color: BRAND.white,
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: selectedLeadIds.size > 0 ? 'pointer' : 'not-allowed',
                  opacity: isUpdating ? 0.7 : 1,
                  transition: 'background-color 0.2s'
                }}
              >
                {isUpdating ? 'Assigning...' : 'Bulk Assign'}
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 27, 46, 0.04)' }}>
            
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1.5fr 1fr 1fr 1fr 2fr', gap: '16px', padding: '16px 24px', backgroundColor: BRAND.bg, borderBottom: `1px solid ${BRAND.border}`, fontWeight: 600, color: BRAND.primary }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={leads.length > 0 && selectedLeadIds.size === leads.length}
                  onChange={selectAll}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
              </div>
              <div>Lead Name</div>
              <div>Company</div>
              <div>Source</div>
              <div>Status</div>
              <div>Assigned To</div>
              <div>Actions</div>
            </div>

            {/* Table Body */}
            {leads.map(lead => {
              const isSelected = selectedLeadIds.has(lead.id);
              
              return (
                <div key={lead.id} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '40px 2fr 1.5fr 1fr 1fr 1fr 2fr', 
                  gap: '16px', 
                  padding: '16px 24px', 
                  borderBottom: `1px solid ${BRAND.border}`,
                  alignItems: 'center',
                  backgroundColor: isSelected ? 'rgba(59, 110, 147, 0.05)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleLeadSelection(lead.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: BRAND.primary }}>{lead.name}</div>
                    <div style={{ fontSize: '12px', color: BRAND.secondary }}>
                      {typeof lead.email === 'string' ? lead.email : (lead.email?.primaryEmail || '-')}
                    </div>
                  </div>
                  <div style={{ color: BRAND.secondary }}>
                    {lead.company || '-'}
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', backgroundColor: BRAND.bg, padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {lead.source || 'UNKNOWN'}
                    </span>
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '12px', 
                      backgroundColor: `${getStatusColor(lead.status)}20`, 
                      color: getStatusColor(lead.status),
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontWeight: 600 
                    }}>
                      {lead.status || 'NEW'}
                    </span>
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '13px',
                      fontWeight: 600,
                      color: getAssignedColor(lead.assignedTo)
                    }}>
                      {formatAssignedTo(lead.assignedTo)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <select
                      value={lead.followUpStatus || 'NONE'}
                      onChange={e => handleUpdateFollowUp(lead.id, e.target.value)}
                      style={{ fontSize: '11px', padding: '4px', borderRadius: '4px', border: `1px solid ${BRAND.border}` }}
                    >
                      <option value="NONE">Follow Up</option>
                      <option value="FOLLOW_UP_1">Follow Up 1</option>
                      <option value="FOLLOW_UP_2">Follow Up 2</option>
                      <option value="FOLLOW_UP_3">Follow Up 3</option>
                    </select>

                    <button 
                      onClick={() => handleConvertToOpportunity(lead)}
                      disabled={!!lead.convertedToOpportunityId || isUpdating}
                      style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: lead.convertedToOpportunityId ? BRAND.border : BRAND.primary, color: lead.convertedToOpportunityId ? BRAND.text : BRAND.white, border: 'none', borderRadius: '4px', cursor: lead.convertedToOpportunityId ? 'not-allowed' : 'pointer' }}
                    >
                      {lead.convertedToOpportunityId ? 'Converted' : 'To Opp'}
                    </button>

                    <button 
                      onClick={() => handleSendAcknowledgment(lead.id)}
                      disabled={lead.acknowledgmentSent || isUpdating}
                      style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: lead.acknowledgmentSent ? BRAND.green : BRAND.secondary, color: BRAND.white, border: 'none', borderRadius: '4px', cursor: lead.acknowledgmentSent ? 'not-allowed' : 'pointer' }}
                    >
                      {lead.acknowledgmentSent ? 'Ack Sent' : 'Send Ack'}
                    </button>
                  </div>
                </div>
              );
            })}

            {leads.length === 0 && (
              <div style={{ padding: '60px', textAlign: 'center', color: BRAND.text }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📬</div>
                <div style={{ fontSize: '18px', fontWeight: 500 }}>No leads available.</div>
                <div style={{ marginTop: '8px' }}>Once your webhooks start firing, leads will appear here for allocation!</div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: LEADS_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Leads Dashboard',
  description: 'Custom Dashboard for Lead Distribution and Bulk Allocation',
  component: LeadsDashboard,
});
