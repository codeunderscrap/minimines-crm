import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { TEAM_ACCESS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

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

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');
`;

const API_URL = 'https://api.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ',
  'Content-Type': 'application/json',
};

const fetchList = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const ActionCard = ({ title, blurb, steps, linkHref, linkLabel }: {
  title: string; blurb: string; steps: string[]; linkHref: string; linkLabel: string;
}) => (
  <div style={{
    backgroundColor: BRAND.white,
    border: `1px solid ${BRAND.border}`,
    borderRadius: '8px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: '0 4px 12px rgba(0, 27, 46, 0.04)',
  }}>
    <div>
      <h3 style={{ margin: '0 0 6px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '20px', color: BRAND.primary, textTransform: 'uppercase' }}>{title}</h3>
      <div style={{ fontSize: '13.5px', color: BRAND.text, lineHeight: 1.5 }}>{blurb}</div>
    </div>
    <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: BRAND.secondary, lineHeight: 1.7 }}>
      {steps.map((s, i) => <li key={i}>{s}</li>)}
    </ol>
    <a
      href={linkHref}
      target="_parent"
      style={{
        alignSelf: 'flex-start',
        marginTop: 'auto',
        textDecoration: 'none',
        backgroundColor: BRAND.primary,
        color: BRAND.white,
        padding: '9px 18px',
        borderRadius: '4px',
        fontWeight: 600,
        fontSize: '13.5px',
      }}
    >
      {linkLabel} &rarr;
    </a>
  </div>
);

const TeamAccessDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [leadItems, deptItems] = await Promise.all([
        fetchList('leads?limit=500'),
        fetchList('departments?limit=100'),
      ]);
      setLeads(leadItems);
      setDepartments(deptItems);
      setLoading(false);
    };
    load();
  }, []);

  const leadCountsByDepartment = leads.reduce((acc: Record<string, number>, lead: any) => {
    const dept = lead.department || 'Unset';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg, minHeight: '100vh', padding: '40px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ marginBottom: '32px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '20px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              Team &amp; Access
            </h1>
            <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '15px', color: BRAND.text }}>
              Set up who works here, what they can see, and which department they belong to.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <ActionCard
              title="Add a person"
              blurb="Invite a new teammate and set their tier — HOD, Manager, or Associate — right when you invite them."
              steps={[
                'Settings → Members → + Invite',
                'Enter their email address',
                'Choose their role (HOD / Manager / Associate)',
                'Send invite',
              ]}
              linkHref="/settings"
              linkLabel="Open Settings"
            />
            <ActionCard
              title="Add a department"
              blurb="Departments are plain records, not a fixed list — add a new one any time, no code or redeploy needed."
              steps={[
                'Open Departments below',
                'Click + New',
                'Name it (e.g. Procurement)',
                'Ready to use on Leads right away',
              ]}
              linkHref="/objects/departments"
              linkLabel="Open Departments"
            />
            <ActionCard
              title="One person, two departments?"
              blurb="Twenty allows exactly one role per person — so instead of stacking roles, create one role that already combines the access that person needs (e.g. a 'Procurement Manager' role with both Sales and BD permissions), then assign that single role to them."
              steps={[
                'Settings → Roles → + Create Role',
                'Grant whichever object/field access their job spans',
                'Assign that one role to the person',
              ]}
              linkHref="/settings"
              linkLabel="Open Roles & Permissions"
            />
          </div>

          <div style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '18px', color: BRAND.primary, textTransform: 'uppercase' }}>
              At a Glance
            </h3>
            {loading ? (
              <div style={{ color: BRAND.text, fontSize: '14px' }}>Loading…</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: BRAND.text, textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>Departments ({departments.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {departments.length === 0 && <span style={{ fontSize: '13px', color: BRAND.text }}>None yet — add one above.</span>}
                    {departments.map((d: any) => (
                      <span key={d.id} style={{ fontSize: '12px', backgroundColor: BRAND.bg, border: `1px solid ${BRAND.border}`, padding: '4px 10px', borderRadius: '999px', color: BRAND.primary, fontWeight: 600 }}>
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: BRAND.text, textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>Leads by Department</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Object.entries(leadCountsByDepartment).length === 0 && <span style={{ fontSize: '13px', color: BRAND.text }}>No leads yet.</span>}
                    {Object.entries(leadCountsByDepartment).map(([dept, count]) => (
                      <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                        <span style={{ color: BRAND.secondary }}>{dept}</span>
                        <span style={{ fontWeight: 700, color: BRAND.primary }}>{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: TEAM_ACCESS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Team & Access',
  description: 'Admin control center for people, roles, and departments.',
  component: TeamAccessDashboard,
});
