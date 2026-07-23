import React, { useState, useEffect } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { INTERN_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

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

const API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';

const fetchApi = async (path: string) => {
  try {
    const res = await fetch(`https://api.twenty.com/rest/${path}`, {
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

const AssociateAnalytics = () => {
  const userRole = useUserRole();
  const [loading, setLoading] = useState(true);
  const [associateData, setAssociateData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [members, leads] = await Promise.all([
        fetchApi('workspaceMembers?limit=100'),
        fetchApi('leads?limit=500'),
      ]);

      const associates = (Array.isArray(members) ? members : []).filter((m: any) => {
        const t = (m.jobTitle || '').toLowerCase();
        return t.includes('associate') || t.includes('intern');
      });

      const data = associates.map((assoc: any) => {
        const assignedLeads = leads.filter(
          (l: any) => relationId(l, 'assignedAssociate') === assoc.id,
        );
        const converted = assignedLeads.filter(
          (l: any) => l.convertedToOpportunityId,
        ).length;
        const followedUp = assignedLeads.filter(
          (l: any) => l.followUpStatus && l.followUpStatus !== 'NONE',
        ).length;

        const name =
          typeof assoc.name === 'string'
            ? assoc.name
            : `${assoc.name?.firstName || ''} ${assoc.name?.lastName || ''}`.trim() || 'Unnamed';

        return {
          name,
          totalLeads: assignedLeads.length,
          converted,
          followedUp,
        };
      });

      setAssociateData(data.length > 0 ? data : []);
      setLoading(false);
    };
    loadData();
  }, []);

  if (userRole === null) return <RoleLoading />;
  if (userRole !== 'hod') return <AccessDenied minRole="hod" />;

  if (loading) {
    return (
      <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>
        Loading Associate Performance Data...
      </div>
    );
  }

  const maxLeads = Math.max(...associateData.map((d) => d.totalLeads), 1);

  return (
    <div
      style={{
        fontFamily: "'Barlow', sans-serif",
        backgroundColor: '#FFFFFF',
        border: `1px solid ${BRAND.border}`,
        padding: '24px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&display=swap');
      `}</style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '24px',
              color: BRAND.primary,
              textTransform: 'uppercase',
              margin: '0 0 4px 0',
            }}
          >
            Associate Performance
          </h2>
          <div style={{ fontSize: '14px', color: BRAND.text }}>
            Assigned leads, follow-ups &amp; conversions per associate
          </div>
        </div>
        <div
          style={{
            padding: '6px 12px',
            backgroundColor: BRAND.bg,
            border: `1px solid ${BRAND.border}`,
            fontSize: '12px',
            fontWeight: 600,
            color: BRAND.secondary,
          }}
        >
          ALL TIME
        </div>
      </div>

      {associateData.length === 0 ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: BRAND.text,
            fontSize: '14px',
          }}
        >
          No associates found. Assign the "Sales Associate" job title to team
          members.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {associateData.map((assoc, i) => (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: BRAND.primary,
                    fontSize: '15px',
                  }}
                >
                  {assoc.name}
                </span>
                <span style={{ fontSize: '13px', color: BRAND.secondary }}>
                  <strong>{assoc.totalLeads}</strong> Leads &nbsp;|&nbsp;{' '}
                  <strong>{assoc.followedUp}</strong> Followed Up &nbsp;|&nbsp;{' '}
                  <strong style={{ color: BRAND.accent }}>
                    {assoc.converted}
                  </strong>{' '}
                  Converted
                </span>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '16px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${(assoc.totalLeads / maxLeads) * 100}%`,
                    height: '100%',
                    backgroundColor: BRAND.lightAccent,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width:
                        assoc.totalLeads > 0
                          ? `${(assoc.converted / assoc.totalLeads) * 100}%`
                          : '0%',
                      height: '100%',
                      backgroundColor: BRAND.accent,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${BRAND.border}`,
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          color: BRAND.secondary,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: BRAND.lightAccent,
              borderRadius: '2px',
            }}
          ></div>
          Total Leads Assigned
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: BRAND.accent,
              borderRadius: '2px',
            }}
          ></div>
          Successfully Converted
        </div>
      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: INTERN_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Associate Analytics',
  component: AssociateAnalytics,
});
