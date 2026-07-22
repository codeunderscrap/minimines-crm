import { defineFrontComponent } from 'twenty-sdk/define';
import { useUserId } from 'twenty-sdk/front-component';
import React, { useState, useEffect, useMemo } from 'react';
import { LEADS_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const relationId = (record: any, name: string): string | null => {
  const nested = record?.[name];
  if (nested && typeof nested === 'object' && nested.id) return nested.id;
  if (typeof nested === 'string') return nested;
  return record?.[`${name}Id`] ?? null;
};

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
  purple: '#8b5cf6',
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

const API_URL = 'https://api.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ',
  'Content-Type': 'application/json',
};

const fetchApi = async (path: string, method = 'GET', body: any = null) => {
  try {
    const opts: any = { method, headers: API_HEADERS };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_URL}/${path}`, opts);
    const json = await res.json();
    if (method !== 'GET') return json;
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? json?.data ?? [];
    if (items?.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error('API error:', err);
    return method === 'GET' ? [] : null;
  }
};

type Role = 'hod' | 'manager' | 'associate';

const LeadsDashboard = () => {
  const currentUserId = useUserId();
  const [leads, setLeads] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<React.ReactNode>(null);

  const loadData = async () => {
    setLoading(true);
    const [leadData, memberData] = await Promise.all([
      fetchApi('leads?limit=500'),
      fetchApi('workspaceMembers?limit=100'),
    ]);
    setLeads(leadData);
    setMembers(memberData);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const roleFromJobTitle = (title: string): Role | null => {
    const t = (title || '').toLowerCase();
    if (t.includes('associate')) return 'associate';
    if (t.includes('executive') || t.includes('manager')) return 'manager';
    if (t.includes('head') || t.includes('hod') || t.includes('director') || t.includes('admin')) return 'hod';
    return null;
  };

  const role: Role = useMemo(() => {
    const isMgr = leads.some(l =>
      relationId(l, 'assignedManagerPrimary') === currentUserId ||
      relationId(l, 'assignedManagerSecondary') === currentUserId
    );
    const isAssoc = leads.some(l =>
      relationId(l, 'assignedAssociate') === currentUserId
    );
    if (isAssoc && !isMgr) return 'associate';
    if (isMgr) return 'manager';

    const me = members.find((m: any) => m.id === currentUserId);
    const titleRole = roleFromJobTitle(me?.jobTitle);
    if (titleRole) return titleRole;

    return 'hod';
  }, [currentUserId, leads, members]);

  const getMemberName = (id: string | null) => {
    if (!id) return null;
    const m = members.find((x: any) => x.id === id);
    if (!m) return null;
    if (m.name) {
      if (typeof m.name === 'string') return m.name;
      return `${m.name.firstName || ''} ${m.name.lastName || ''}`.trim() || null;
    }
    return null;
  };

  const relationName = (lead: any, field: string) => {
    const nested = lead?.[field];
    if (nested && typeof nested === 'object' && nested.name) {
      const n = nested.name;
      if (typeof n === 'string') return n;
      return `${n.firstName || ''} ${n.lastName || ''}`.trim() || null;
    }
    return getMemberName(relationId(lead, field));
  };

  const visibleLeads = useMemo(() => {
    if (role === 'hod') return leads;
    if (role === 'manager') {
      return leads.filter(l =>
        relationId(l, 'assignedManagerPrimary') === currentUserId ||
        relationId(l, 'assignedManagerSecondary') === currentUserId
      );
    }
    return leads.filter(l => relationId(l, 'assignedAssociate') === currentUserId);
  }, [role, currentUserId, leads]);

  const assignableMembers = useMemo(() => {
    if (role === 'associate') return [];
    return members.filter((m: any) => m.id !== currentUserId);
  }, [role, members, currentUserId]);

  const canAssign = role !== 'associate';
  const canConvert = role !== 'associate';
  const canAcknowledge = role !== 'associate';

  const toggleLeadSelection = (id: string) => {
    if (!canAssign) return;
    const s = new Set(selectedLeadIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedLeadIds(s);
  };

  const selectAll = () => {
    if (!canAssign) return;
    setSelectedLeadIds(
      selectedLeadIds.size === visibleLeads.length
        ? new Set()
        : new Set(visibleLeads.map(l => l.id))
    );
  };

  const handleBulkAssign = async () => {
    if (selectedLeadIds.size === 0 || !selectedMemberId || !canAssign) return;
    setIsUpdating(true);
    try {
      const field = role === 'hod' ? 'assignedManagerPrimaryId' : 'assignedAssociateId';
      const promises = Array.from(selectedLeadIds).map(id =>
        fetchApi(`leads/${id}`, 'PATCH', { [field]: selectedMemberId })
      );
      await Promise.all(promises);
      setSelectedLeadIds(new Set());
      setSelectedMemberId('');
      const targetName = getMemberName(selectedMemberId) || 'member';
      setSuccessMsg(`${promises.length} lead(s) assigned to ${targetName}`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadData();
    } catch (e) {
      console.error('Failed bulk assign', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConvertToOpportunity = async (lead: any) => {
    if (!canConvert) return;
    setIsUpdating(true);
    try {
      const opp = await fetchApi('bdOpportunities', 'POST', {
        name: `${lead.company || lead.name} - Opportunity`,
        linkedLeadId: lead.id,
        companyName: lead.company || '',
        stage: 'REQUIREMENTS',
      });
      try {
        await fetchApi('opportunities', 'POST', {
          name: `${lead.company || lead.name} - BD Pipeline`,
        });
      } catch (_) {}

      let newOppId = opp?.data?.id || opp?.data?.createBdOpportunity?.id || opp?.id;
      if (newOppId) {
        await fetchApi(`leads/${lead.id}`, 'PATCH', {
          convertedToOpportunityId: newOppId,
          status: 'QUALIFIED',
        });
      }
      await loadData();
    } catch (e) {
      console.error('Failed to convert', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFollowUp = async (leadId: string, followUpStatus: string) => {
    setIsUpdating(true);
    try {
      await fetchApi(`leads/${leadId}`, 'PATCH', { followUpStatus });
      await loadData();
    } catch (e) {
      console.error('Failed to update follow up', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendAcknowledgment = async (lead: any) => {
    if (!canAcknowledge) return;
    setIsUpdating(true);
    try {
      await fetchApi(`leads/${lead.id}`, 'PATCH', { acknowledgmentSent: 'true' });
      const leadEmail = lead.email?.primaryEmail || lead.email || '';
      const subject = encodeURIComponent('Thank you for reaching out to MiniMines');
      const body = encodeURIComponent(
        `Hi ${lead.name || 'there'},\n\nThank you for reaching out to MiniMines. We have received your inquiry and our BD team will get back to you shortly.\n\nBest regards,\nMiniMines BD Team`
      );
      setSuccessMsg(
        <span>
          Acknowledgment marked!{' '}
          <a href={`mailto:${leadEmail}?subject=${subject}&body=${body}`} target="_parent" style={{ color: '#065F46', fontWeight: 'bold', textDecoration: 'underline' }}>
            Click to send email
          </a>
        </span>
      );
      await loadData();
    } catch (e) {
      console.error('Failed to send ack', e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && leads.length === 0) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading Leads...</div>;
  }

  const getStatusColor = (status: string) => {
    if (status === 'NEW') return BRAND.blue;
    if (status === 'CONTACTED') return BRAND.yellow;
    if (status === 'QUALIFIED') return BRAND.green;
    if (status === 'DISQUALIFIED') return BRAND.red;
    return BRAND.secondary;
  };

  const roleLabel = role === 'hod' ? 'HOD' : role === 'manager' ? 'Manager' : 'Associate';
  const roleBg = role === 'hod' ? '#fef3c7' : role === 'manager' ? '#dbeafe' : '#d1fae5';
  const roleFg = role === 'hod' ? BRAND.yellow : role === 'manager' ? BRAND.blue : BRAND.green;

  const title = role === 'hod'
    ? 'Lead Distribution Center'
    : role === 'manager'
    ? 'My Team Leads'
    : 'My Assigned Leads';

  const subtitle = role === 'hod'
    ? 'Assign leads to Managers. They will distribute to their Associates.'
    : role === 'manager'
    ? 'Leads assigned to your team. Assign them to your Associates.'
    : 'Leads assigned to you by your Manager. Update follow-up status as you work them.';

  const gridCols = canAssign
    ? '40px 2fr 1.5fr 1fr 1fr 1.5fr 2fr'
    : '2fr 1.5fr 1fr 1fr 1.5fr 1.5fr';

  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-leads-dashboard">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {successMsg && (
            <div style={{ padding: '14px 16px', backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #10B981', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
              {successMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
                  {title}
                </h1>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, backgroundColor: roleBg, color: roleFg }}>
                  {roleLabel}
                </span>
              </div>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '14px', color: BRAND.text }}>
                {subtitle}
              </div>
            </div>

            {canAssign && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: BRAND.primary, fontWeight: 600, fontSize: '13px' }}>
                  {selectedLeadIds.size} selected
                </div>
                <select
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  style={{
                    padding: '9px 14px', borderRadius: '4px', border: `1px solid ${BRAND.border}`,
                    fontFamily: "'Barlow', sans-serif", fontSize: '13px', minWidth: '180px',
                  }}
                >
                  <option value="">
                    {role === 'hod' ? '-- Select Manager --' : '-- Select Associate --'}
                  </option>
                  {assignableMembers.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {getMemberName(m.id) || 'Unnamed'}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBulkAssign}
                  disabled={selectedLeadIds.size === 0 || !selectedMemberId || isUpdating}
                  style={{
                    backgroundColor: selectedLeadIds.size > 0 && selectedMemberId ? BRAND.primary : BRAND.border,
                    color: selectedLeadIds.size > 0 && selectedMemberId ? BRAND.white : BRAND.text,
                    border: 'none', padding: '9px 20px', borderRadius: '4px', fontWeight: 600,
                    cursor: selectedLeadIds.size > 0 && selectedMemberId ? 'pointer' : 'not-allowed',
                    opacity: isUpdating ? 0.7 : 1, fontSize: '13px',
                  }}
                >
                  {isUpdating ? 'Assigning...' : role === 'hod' ? 'Assign to Manager' : 'Assign to Associate'}
                </button>
                <div style={{ width: '1px', height: '24px', backgroundColor: BRAND.border }} />
                <a
                  href="/objects/leads"
                  target="_parent"
                  style={{
                    display: 'inline-block', textDecoration: 'none', backgroundColor: BRAND.green,
                    color: BRAND.white, padding: '9px 20px', borderRadius: '4px', fontWeight: 600, fontSize: '13px',
                  }}
                >
                  + Add Lead
                </a>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 27, 46, 0.04)' }}>

            <div style={{
              display: 'grid', gridTemplateColumns: gridCols, gap: '12px', padding: '14px 20px',
              backgroundColor: BRAND.bg, borderBottom: `1px solid ${BRAND.border}`,
              fontWeight: 600, fontSize: '11px', color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              {canAssign && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="checkbox"
                    checked={visibleLeads.length > 0 && selectedLeadIds.size === visibleLeads.length}
                    onChange={selectAll}
                    style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                  />
                </div>
              )}
              <div>Lead</div>
              <div>Company</div>
              <div>Source</div>
              <div>Status</div>
              <div>Assigned To</div>
              <div>Actions</div>
            </div>

            {visibleLeads.map(lead => {
              const isSelected = selectedLeadIds.has(lead.id);
              const mgrName = relationName(lead, 'assignedManagerPrimary');
              const assocName = relationName(lead, 'assignedAssociate');

              return (
                <div key={lead.id} style={{
                  display: 'grid', gridTemplateColumns: gridCols, gap: '12px', padding: '13px 20px',
                  borderBottom: `1px solid ${BRAND.border}`, alignItems: 'center', fontSize: '13px',
                  backgroundColor: isSelected ? 'rgba(59, 110, 147, 0.05)' : 'transparent',
                }}>
                  {canAssign && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={isSelected}
                        onChange={() => toggleLeadSelection(lead.id)}
                        style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                      />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '14px' }}>{lead.name}</div>
                    <div style={{ fontSize: '12px', color: BRAND.secondary }}>
                      {typeof lead.email === 'string' ? lead.email : (lead.email?.primaryEmail || '')}
                    </div>
                  </div>
                  <div style={{ color: BRAND.secondary }}>{lead.company || '-'}</div>
                  <div>
                    <span style={{ fontSize: '11px', backgroundColor: BRAND.bg, padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {lead.source || 'UNKNOWN'}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      fontSize: '11px', backgroundColor: `${getStatusColor(lead.status)}20`,
                      color: getStatusColor(lead.status), padding: '3px 8px', borderRadius: '4px', fontWeight: 600,
                    }}>
                      {lead.status || 'NEW'}
                    </span>
                  </div>
                  <div>
                    {mgrName && (
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: BRAND.text }}>Mgr: </span>
                        <span style={{ fontWeight: 600, color: BRAND.blue }}>{mgrName}</span>
                      </div>
                    )}
                    {assocName && (
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: BRAND.text }}>Assoc: </span>
                        <span style={{ fontWeight: 600, color: BRAND.green }}>{assocName}</span>
                      </div>
                    )}
                    {!mgrName && !assocName && (
                      <span style={{ fontSize: '12px', color: BRAND.text }}>Unassigned</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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

                    {canConvert && (
                      <button
                        onClick={() => handleConvertToOpportunity(lead)}
                        disabled={!!lead.convertedToOpportunityId || isUpdating}
                        style={{
                          fontSize: '11px', padding: '4px 8px',
                          backgroundColor: lead.convertedToOpportunityId ? BRAND.border : BRAND.primary,
                          color: lead.convertedToOpportunityId ? BRAND.text : BRAND.white,
                          border: 'none', borderRadius: '4px',
                          cursor: lead.convertedToOpportunityId ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {lead.convertedToOpportunityId ? 'Converted' : 'To Opp'}
                      </button>
                    )}

                    {canAcknowledge && (
                      <button
                        onClick={() => handleSendAcknowledgment(lead)}
                        disabled={lead.acknowledgmentSent === 'true' || isUpdating}
                        style={{
                          fontSize: '11px', padding: '4px 8px',
                          backgroundColor: lead.acknowledgmentSent === 'true' ? BRAND.green : BRAND.secondary,
                          color: BRAND.white, border: 'none', borderRadius: '4px',
                          cursor: lead.acknowledgmentSent === 'true' ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {lead.acknowledgmentSent === 'true' ? 'Ack Sent' : 'Send Ack'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {visibleLeads.length === 0 && (
              <div style={{ padding: '60px', textAlign: 'center', color: BRAND.text }}>
                <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
                  {leads.length === 0 ? 'No leads yet.' : 'No leads assigned to you.'}
                </div>
                <div style={{ fontSize: '14px' }}>
                  {role === 'associate'
                    ? 'Your Manager will assign leads to you. They will appear here automatically.'
                    : role === 'manager'
                    ? 'HOD will assign leads to your team. Assign them to your Associates from here.'
                    : 'Transfer leads from SalesHub or add them directly, then assign to Managers.'}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px', fontSize: '11px', color: BRAND.text, display: 'flex', justifyContent: 'space-between' }}>
            <span>Showing {visibleLeads.length} of {leads.length} leads</span>
            <span>Logged in as: {roleLabel}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: LEADS_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Leads Dashboard',
  description: 'Role-aware lead distribution dashboard with cascading assignment.',
  component: LeadsDashboard,
});
