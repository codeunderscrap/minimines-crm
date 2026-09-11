import { defineFrontComponent } from 'twenty-sdk/define';
import { useUserId } from 'twenty-sdk/front-component';
import React, { useState, useEffect } from 'react';

// --- Inlined role-gate ---
type UserRole = 'hod' | 'manager' | 'associate';

const ROLE_API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

const useUserRole = (): UserRole | null => {
  const rawUserId = useUserId();
  const [role, setRole] = React.useState<UserRole | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://minimines.twenty.com/rest/workspaceMembers?limit=100',
          { headers: { Authorization: ROLE_API_KEY, 'Content-Type': 'application/json' } },
        );
        const json = await res.json();
        let items = json?.data?.workspaceMembers ?? json?.data ?? [];
        if (items?.edges) items = items.edges.map((e: any) => e.node);
        const me = (Array.isArray(items) ? items : []).find(
          (m: any) => m.userId === rawUserId || m.id === rawUserId,
        );
        if (!me) { setRole('hod'); return; }
        const t = (me.jobTitle || '').toLowerCase();
        if (t.includes('associate') || t.includes('intern')) setRole('associate');
        else if (t.includes('executive') || t.includes('manager')) setRole('manager');
        else setRole('hod');
      } catch { setRole('hod'); }
    })();
  }, [rawUserId]);
  return role;
};

const AccessDenied = ({ minRole = 'manager' }: { minRole?: 'hod' | 'manager' }) => (
  <div style={{ padding: '60px 40px', textAlign: 'center' as const, fontFamily: "'Barlow', sans-serif", display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 600, color: '#001B2E', marginBottom: '8px' }}>Access Restricted</div>
    <div style={{ fontSize: '14px', color: '#7A7A7A', maxWidth: '400px', lineHeight: 1.5 }}>
      {minRole === 'hod' ? 'This dashboard is available to the Head of Department only.' : 'This dashboard is available to Managers and HODs only.'}
    </div>
  </div>
);

const RoleLoading = () => (
  <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", color: '#7A7A7A' }}>Loading...</div>
);
// --- End role-gate ---

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  red: '#E74C3C',
  orange: '#F39C12',
  green: '#27AE60',
  blue: '#3B6E93'
};

const API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

const fetchApi = async (path: string) => {
  try {
    const res = await fetch(`https://minimines.twenty.com/rest/${path}`, {
      headers: { Authorization: API_KEY, 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? json?.data ?? [];
    if (items?.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const relationId = (record: any, name: string): string | null => {
  const nested = record?.[name];
  if (nested && typeof nested === 'object' && nested.id) return nested.id;
  if (typeof nested === 'string') return nested;
  return record?.[`${name}Id`] ?? null;
};

const relationName = (record: any, fieldName: string) => {
  const nested = record?.[fieldName];
  if (nested && typeof nested === 'object' && nested.name) return nested.name;
  return null;
};

const formatDate = (isoString: string) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const AssociateAnalytics = () => {
  const userRole = useUserRole();
  const [loading, setLoading] = useState(true);
  const [associateData, setAssociateData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const schemaQuery = `{ __type(name: "LeadWorkedbyEnum") { enumValues { name } } }`;
      
      const fetchGraphQL = async (query: string) => {
        try {
          const res = await fetch('https://minimines.twenty.com/graphql', {
            method: 'POST',
            headers: { Authorization: API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });
          const json = await res.json();
          return json?.data;
        } catch {
          return null;
        }
      };

      const [leads, schema] = await Promise.all([
        fetchApi('leads?limit=1000'),
        fetchGraphQL(schemaQuery)
      ]);

      let uniqueNames = schema?.__type?.enumValues?.map((e: any) => e.name) || [];
      if (uniqueNames.length === 0) {
        // Fallback if enum fails
        uniqueNames = Array.from(new Set(
          (Array.isArray(leads) ? leads : [])
            .map((l: any) => l.workedby)
            .filter((name: string) => typeof name === 'string' && name.trim().length > 0)
        )) as string[];
      }

      const data = uniqueNames.map((name: string) => {
        const assignedLeads = leads.filter((l: any) => l.workedby === name);

        const stats = {
          total: assignedLeads.length,
          new: assignedLeads.filter((l: any) => l.status === 'NEW').length,
          contacted: assignedLeads.filter((l: any) => l.status === 'CONTACTED').length,
          qualified: assignedLeads.filter((l: any) => l.status === 'QUALIFIED').length,
          converted: assignedLeads.filter((l: any) => l.convertedToOpportunityId).length,
        };

        // Sort leads: NEW first, then by createdAt desc
        const sortedLeads = assignedLeads.sort((a: any, b: any) => {
          if (a.status === 'NEW' && b.status !== 'NEW') return -1;
          if (a.status !== 'NEW' && b.status === 'NEW') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return {
          id: name, // Use name as ID
          name,
          stats,
          leads: sortedLeads,
        };
      });

      setAssociateData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (userRole === null) return <RoleLoading />;
  if (userRole !== 'hod') return <AccessDenied minRole="hod" />;

  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", fontSize: '18px', color: BRAND.primary }}>
        Loading Advanced Analytics & Tracking Data...
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'NEW': return { bg: '#FEE2E2', color: '#B91C1C' }; // Red alert
      case 'CONTACTED': return { bg: '#FEF3C7', color: '#D97706' }; // Yellow warning
      case 'QUALIFIED': return { bg: '#D1FAE5', color: '#047857' }; // Green success
      case 'DISQUALIFIED': return { bg: '#F3F4F6', color: '#374151' }; // Gray
      default: return { bg: '#E0E7FF', color: '#4338CA' }; // Default blue
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        backgroundColor: '#FFFFFF',
        padding: '32px',
        minHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;

export 
const API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

export   const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://minimines.twenty.com/rest/workspaceMembers?limit=100',
          { headers: { Authorization: API_KEY, 'Content-Type': 'application/json' } },
        );
        const json = await res.json();
        let items = json?.data?.workspaceMembers ?? json?.data ?? [];
        if (items?.edges) items = items.edges.map((e: any) => e.node);
        const me = (Array.isArray(items) ? items : []).find(
          (m: any) => m.userId === rawUserId || m.id === rawUserId,
        );
        if (!me) {
          setRole('hod');
          return;
        }
        const t = (me.jobTitle || '').toLowerCase();
        if (t.includes('associate') || t.includes('intern')) setRole('associate');
        else if (t.includes('executive') || t.includes('manager')) setRole('manager');
        else setRole('hod');
      } catch {
        setRole('hod');
      }
    })();
  }, [rawUserId]);

  return role;
};

export }) => (
  <div
    style={{
      padding: '60px 40px',
      textAlign: 'center' as const,
      fontFamily: "'Barlow', sans-serif",
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
    }}
  >
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 600, color: '#001B2E', marginBottom: '8px' }}>
      Access Restricted
    </div>
    <div style={{ fontSize: '14px', color: '#7A7A7A', maxWidth: '400px', lineHeight: 1.5 }}>
      {minRole === 'hod'
        ? 'This dashboard is available to the Head of Department only.'
        : 'This dashboard is available to Managers and HODs only.'}
    </div>
  </div>
);

export 
500;600;700&display=swap');
        
        .tracker-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          border: 1px solid ${BRAND.border};
          border-radius: 8px;
          overflow: hidden;
        }
        .tracker-table th {
          background-color: ${BRAND.bg};
          color: ${BRAND.secondary};
          font-weight: 600;
          text-align: left;
          padding: 12px 16px;
          font-size: 13px;
          text-transform: uppercase;
          border-bottom: 2px solid ${BRAND.border};
        }
        .tracker-table td {
          padding: 14px 16px;
          border-bottom: 1px solid ${BRAND.border};
          font-size: 14px;
          color: ${BRAND.primary};
        }
        .tracker-table tr:hover {
          background-color: #F8FAFC;
        }
        
        .metric-card {
          flex: 1;
          background: #fff;
          border: 1px solid ${BRAND.border};
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .metric-title {
          font-size: 12px;
          color: ${BRAND.secondary};
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
        }
      `}</style>

      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
            Team Accountability Tracker
          </h1>
          <div style={{ fontSize: '15px', color: BRAND.text }}>
            Detailed breakdown of every lead assigned to your team and their current status.
          </div>
        </div>
      </div>

      {associateData.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: BRAND.text, fontSize: '16px', background: BRAND.bg, borderRadius: '8px' }}>
          No associates have leads assigned to them yet. Go to the Leads Dashboard to assign leads.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {associateData.map((assoc) => (
            <div key={assoc.id} style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Associate Header & Stats */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: BRAND.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    {assoc.name.charAt(0)}
                  </div>
                  <h2 style={{ fontSize: '22px', color: BRAND.primary, margin: 0, fontWeight: 700 }}>{assoc.name}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div className="metric-card">
                  <div className="metric-title">Total Assigned</div>
                  <div className="metric-value" style={{ color: BRAND.primary }}>{assoc.stats.total}</div>
                </div>
                <div className="metric-card" style={{ borderLeft: `4px solid ${BRAND.red}` }}>
                  <div className="metric-title">Requires Action (NEW)</div>
                  <div className="metric-value" style={{ color: BRAND.red }}>{assoc.stats.new}</div>
                </div>
                <div className="metric-card" style={{ borderLeft: `4px solid ${BRAND.orange}` }}>
                  <div className="metric-title">Contacted</div>
                  <div className="metric-value" style={{ color: BRAND.orange }}>{assoc.stats.contacted}</div>
                </div>
                <div className="metric-card" style={{ borderLeft: `4px solid ${BRAND.green}` }}>
                  <div className="metric-title">Qualified</div>
                  <div className="metric-value" style={{ color: BRAND.green }}>{assoc.stats.qualified}</div>
                </div>
              </div>

              {/* Detailed Tracker Table */}
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Follow Up</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {assoc.leads.map((lead: any) => {
                    const statusStyle = getStatusStyle(lead.status || 'NEW');
                    return (
                      <tr key={lead.id} style={{ backgroundColor: lead.status === 'NEW' ? '#FEF2F2' : 'transparent' }}>
                        <td style={{ fontWeight: 600 }}>{lead.name || 'Unnamed Lead'}</td>
                        <td>{relationName(lead, 'company') || '-'}</td>
                        <td style={{ fontSize: '13px', color: BRAND.secondary }}>{lead.source || 'UNKNOWN'}</td>
                        <td>
                          <span style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700
                          }}>
                            {lead.status || 'NEW'}
                          </span>
                        </td>
                        <td>
                          {lead.followUpStatus && lead.followUpStatus !== 'NONE' ? (
                            <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.orange }}>
                              {lead.followUpStatus.replace(/_/g, ' ')}
                            </span>
                          ) : (
                            <span style={{ fontSize: '13px', color: BRAND.text }}>-</span>
                          )}
                        </td>
                        <td style={{ fontSize: '13px', color: BRAND.secondary }}>{formatDate(lead.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: '970a20de-6142-4a05-a871-6eaa13fdb035',
  name: 'Team Accountability Tracker',
  component: AssociateAnalytics,
});
