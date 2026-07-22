import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useUserId } from 'twenty-sdk/front-component';
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
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');
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

type Tab = 'people' | 'departments' | 'roles' | 'hierarchy';

const TABS: { key: Tab; label: string }[] = [
  { key: 'people', label: 'People' },
  { key: 'departments', label: 'Departments' },
  { key: 'roles', label: 'Roles & Access' },
  { key: 'hierarchy', label: 'Org Chart' },
];

const StatCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
  <div style={{
    backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`,
    borderRadius: '8px', padding: '18px 20px', minWidth: '120px',
    boxShadow: '0 2px 8px rgba(0,27,46,0.03)',
  }}>
    <div style={{ fontSize: '26px', fontWeight: 700, color, fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
    <div style={{ fontSize: '11px', color: BRAND.text, textTransform: 'uppercase', fontWeight: 600, marginTop: '4px', letterSpacing: '0.5px' }}>{label}</div>
  </div>
);

const relationId = (record: any, name: string): string | null => {
  const nested = record?.[name];
  if (nested && typeof nested === 'object' && nested.id) return nested.id;
  if (typeof nested === 'string') return nested;
  return record?.[`${name}Id`] ?? null;
};

const TeamAccessDashboard = () => {
  const currentUserId = useUserId();
  const [tab, setTab] = useState<Tab>('people');
  const [members, setMembers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDeptName, setNewDeptName] = useState('');
  const [editingDept, setEditingDept] = useState<{ id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, d, l] = await Promise.all([
      fetchApi('workspaceMembers?limit=100'),
      fetchApi('departments?limit=100'),
      fetchApi('leads?limit=500'),
    ]);
    setMembers(m);
    setDepartments(d);
    setLeads(l);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const roleFromJobTitle = (title: string): 'hod' | 'manager' | 'associate' | null => {
    const t = (title || '').toLowerCase();
    if (t.includes('associate')) return 'associate';
    if (t.includes('executive') || t.includes('manager')) return 'manager';
    if (t.includes('head') || t.includes('hod') || t.includes('director') || t.includes('admin')) return 'hod';
    return null;
  };

  const isHod = useMemo(() => {
    const isMgr = leads.some((l: any) =>
      relationId(l, 'assignedManagerPrimary') === currentUserId ||
      relationId(l, 'assignedManagerSecondary') === currentUserId
    );
    const isAssoc = leads.some((l: any) =>
      relationId(l, 'assignedAssociate') === currentUserId
    );
    if (isMgr || isAssoc) return false;

    const me = members.find((m: any) => m.id === currentUserId);
    const titleRole = roleFromJobTitle(me?.jobTitle);
    if (titleRole && titleRole !== 'hod') return false;

    return true;
  }, [currentUserId, leads, members]);

  if (!loading && !isHod) {
    return (
      <div style={{ fontFamily: "'Barlow', sans-serif", display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '12px', color: BRAND.text }}>
        <div style={{ fontSize: '18px', fontWeight: 600, color: BRAND.primary }}>Admin Access Only</div>
        <div style={{ fontSize: '14px' }}>This dashboard is available to HOD / Super Admin only.</div>
        <a href="/objects/leads" target="_parent" style={{ marginTop: '8px', color: BRAND.accent, fontWeight: 600, fontSize: '14px' }}>Go to Leads</a>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addDept = async () => {
    if (!newDeptName.trim() || saving) return;
    setSaving(true);
    await fetchApi('departments', 'POST', { name: newDeptName.trim() });
    showToast(`Department "${newDeptName.trim()}" created`);
    setNewDeptName('');
    await load();
    setSaving(false);
  };

  const saveDeptEdit = async () => {
    if (!editingDept || !editingDept.name.trim() || saving) return;
    setSaving(true);
    await fetchApi(`departments/${editingDept.id}`, 'PATCH', { name: editingDept.name.trim() });
    setEditingDept(null);
    await load();
    setSaving(false);
    showToast('Department updated');
  };

  const deleteDept = async (id: string, name: string) => {
    if (saving) return;
    setSaving(true);
    await fetchApi(`departments/${id}`, 'DELETE');
    await load();
    setSaving(false);
    showToast(`"${name}" removed`);
  };

  const leadsByDept = leads.reduce((acc: Record<string, number>, l: any) => {
    const d = l.department || 'Unset';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const managerIds = new Set<string>();
  const associateIds = new Set<string>();
  leads.forEach((l: any) => {
    const mp = l.assignedManagerPrimary?.id || l.assignedManagerPrimaryId;
    const ms = l.assignedManagerSecondary?.id || l.assignedManagerSecondaryId;
    const aa = l.assignedAssociate?.id || l.assignedAssociateId;
    if (mp) managerIds.add(mp);
    if (ms) managerIds.add(ms);
    if (aa) associateIds.add(aa);
  });

  const inferRole = (m: any): string => {
    const isMgr = managerIds.has(m.id);
    const isAssoc = associateIds.has(m.id);
    if (isMgr && isAssoc) return 'Multi-role';
    if (isMgr) return 'Manager';
    if (isAssoc) return 'Associate';

    const titleRole = roleFromJobTitle(m?.jobTitle);
    if (titleRole === 'associate') return 'Associate';
    if (titleRole === 'manager') return 'Manager';

    return 'HOD';
  };

  const roleColor = (role: string) => {
    if (role === 'Manager') return { bg: '#dbeafe', fg: BRAND.blue };
    if (role === 'Associate') return { bg: '#d1fae5', fg: BRAND.green };
    if (role === 'Multi-role') return { bg: '#ede9fe', fg: BRAND.purple };
    return { bg: '#fef3c7', fg: BRAND.yellow };
  };

  const getLeadCount = (id: string) =>
    leads.filter((l: any) => {
      const mp = l.assignedManagerPrimary?.id || l.assignedManagerPrimaryId;
      const ms = l.assignedManagerSecondary?.id || l.assignedManagerSecondaryId;
      const aa = l.assignedAssociate?.id || l.assignedAssociateId;
      return mp === id || ms === id || aa === id;
    }).length;

  const memberName = (m: any) => {
    if (m.name) {
      if (typeof m.name === 'string') return m.name;
      return `${m.name.firstName || ''} ${m.name.lastName || ''}`.trim() || 'Unnamed';
    }
    return m.firstName ? `${m.firstName} ${m.lastName || ''}`.trim() : 'Unnamed';
  };

  const memberEmail = (m: any) => {
    if (m.userEmail) return m.userEmail;
    if (m.email) return typeof m.email === 'string' ? m.email : m.email?.primaryEmail;
    return '';
  };

  const renderPeople = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase' }}>Team Members</h2>
          <p style={{ margin: 0, fontSize: '13px', color: BRAND.text }}>Everyone in your workspace. Invite new people or manage roles from Settings.</p>
        </div>
        <a href="/settings" target="_parent" style={{
          textDecoration: 'none', backgroundColor: BRAND.primary, color: BRAND.white,
          padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '14px',
        }}>
          + Invite Person
        </a>
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Total Members" value={members.length} color={BRAND.primary} />
        <StatCard label="Managers" value={members.filter(m => inferRole(m) === 'Manager').length} color={BRAND.blue} />
        <StatCard label="Associates" value={members.filter(m => inferRole(m) === 'Associate').length} color={BRAND.green} />
        <StatCard label="Total Leads" value={leads.length} color={BRAND.accent} />
      </div>

      <div style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 80px 80px',
          gap: '12px', padding: '12px 20px',
          backgroundColor: BRAND.bg, borderBottom: `1px solid ${BRAND.border}`,
          fontWeight: 600, fontSize: '11px', color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          <div>Name</div><div>Email</div><div>Role</div><div>Leads</div><div></div>
        </div>
        {members.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>
            No members found. Invite your first team member above.
          </div>
        ) : members.map((m: any) => {
          const role = inferRole(m);
          const rc = roleColor(role);
          return (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 80px 80px',
              gap: '12px', padding: '13px 20px', borderBottom: `1px solid ${BRAND.border}`,
              alignItems: 'center', fontSize: '14px',
            }}>
              <div style={{ fontWeight: 600, color: BRAND.primary }}>{memberName(m)}</div>
              <div style={{ color: BRAND.secondary, fontSize: '13px' }}>{memberEmail(m) || '-'}</div>
              <div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', fontWeight: 600, backgroundColor: rc.bg, color: rc.fg }}>
                  {role}
                </span>
              </div>
              <div style={{ fontWeight: 700, color: BRAND.primary, textAlign: 'center' }}>{getLeadCount(m.id)}</div>
              <div>
                <a href="/settings" target="_parent" style={{ fontSize: '12px', color: BRAND.accent, textDecoration: 'none', fontWeight: 600 }}>
                  Manage
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderDepartments = () => (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase' }}>Departments</h2>
        <p style={{ margin: 0, fontSize: '13px', color: BRAND.text }}>Add, rename, or remove departments. These appear as options on Lead records.</p>
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Total Depts" value={departments.length} color={BRAND.primary} />
        {Object.entries(leadsByDept).map(([dept, count]) => (
          <StatCard key={dept} label={dept} value={count as number} color={BRAND.accent} />
        ))}
      </div>

      <div style={{
        backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px',
        padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center',
      }}>
        <input
          type="text"
          value={newDeptName}
          onChange={e => setNewDeptName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addDept()}
          placeholder="New department name (e.g. Procurement)"
          style={{
            flex: 1, padding: '10px 14px', border: `1px solid ${BRAND.border}`, borderRadius: '6px',
            fontSize: '14px', fontFamily: "'Barlow', sans-serif", outline: 'none',
          }}
        />
        <button
          onClick={addDept}
          disabled={!newDeptName.trim() || saving}
          style={{
            backgroundColor: newDeptName.trim() ? BRAND.primary : BRAND.border,
            color: newDeptName.trim() ? BRAND.white : BRAND.text,
            border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600,
            cursor: newDeptName.trim() ? 'pointer' : 'not-allowed', fontSize: '14px',
            fontFamily: "'Barlow', sans-serif", whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'Saving...' : '+ Add'}
        </button>
      </div>

      <div style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', overflow: 'hidden' }}>
        {departments.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>
            No departments yet. Add one above.
          </div>
        ) : departments.map((d: any) => (
          <div key={d.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px', borderBottom: `1px solid ${BRAND.border}`,
          }}>
            {editingDept?.id === d.id ? (
              <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                <input
                  type="text"
                  value={editingDept.name}
                  onChange={e => setEditingDept({ ...editingDept, name: e.target.value })}
                  onKeyDown={e => { if (e.key === 'Enter') saveDeptEdit(); if (e.key === 'Escape') setEditingDept(null); }}
                  style={{ flex: 1, padding: '8px 12px', border: `1px solid ${BRAND.accent}`, borderRadius: '4px', fontSize: '14px', fontFamily: "'Barlow', sans-serif", outline: 'none' }}
                  autoFocus
                />
                <button onClick={saveDeptEdit} disabled={saving} style={{ padding: '7px 14px', backgroundColor: BRAND.green, color: BRAND.white, border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Save</button>
                <button onClick={() => setEditingDept(null)} style={{ padding: '7px 14px', backgroundColor: BRAND.bg, color: BRAND.secondary, border: `1px solid ${BRAND.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 600, color: BRAND.primary, fontSize: '15px' }}>{d.name}</span>
                  <span style={{ fontSize: '11px', color: BRAND.text, backgroundColor: BRAND.bg, padding: '2px 8px', borderRadius: '999px', fontWeight: 500 }}>
                    {leadsByDept[d.name] || 0} leads
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingDept({ id: d.id, name: d.name })}
                    style={{ padding: '6px 12px', backgroundColor: BRAND.bg, color: BRAND.secondary, border: `1px solid ${BRAND.border}`, borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: "'Barlow', sans-serif" }}
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => deleteDept(d.id, d.name)}
                    disabled={saving}
                    style={{ padding: '6px 12px', backgroundColor: '#fef2f2', color: BRAND.red, border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: "'Barlow', sans-serif" }}
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', fontSize: '12px', color: BRAND.text, lineHeight: 1.6 }}>
        Departments are stored as records. You can also manage them from the{' '}
        <a href="/objects/departments" target="_parent" style={{ color: BRAND.accent, fontWeight: 600 }}>Departments table</a> in the sidebar.
      </div>
    </>
  );

  const renderRoles = () => {
    const roles = [
      {
        tag: 'HOD', label: 'Head of Department (Super Admin)',
        desc: 'Full access to every module and every lead. Can manage the team, create roles, and see the entire pipeline.',
        perms: ['All objects: read, update, delete', 'All leads: no row-level restriction', 'Settings: full access'],
        color: BRAND.yellow, bg: '#fef3c7',
      },
      {
        tag: 'Manager', label: 'Manager',
        desc: 'Full module access like HOD, but leads are scoped: only sees leads where they are the Primary or Secondary manager.',
        perms: ['All objects: read, update, delete', 'Leads: only their team (row-level)', 'Cannot destroy records'],
        color: BRAND.blue, bg: '#dbeafe',
      },
      {
        tag: 'Associate', label: 'Associate',
        desc: 'Least-privilege. Can only read and update leads assigned specifically to them. No access to other modules by default.',
        perms: ['Leads only: read, update', 'Row-level: own assigned leads only', 'No delete, no other modules'],
        color: BRAND.green, bg: '#d1fae5',
      },
    ];

    return (
      <>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase' }}>Roles & Access Control</h2>
          <p style={{ margin: 0, fontSize: '13px', color: BRAND.text }}>Three built-in roles cover most cases. Need a combination? Create a custom one below.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {roles.map(r => (
            <div key={r.tag} style={{
              backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px',
              padding: '20px', boxShadow: '0 2px 8px rgba(0,27,46,0.03)', display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, backgroundColor: r.bg, color: r.color }}>{r.tag}</span>
              </div>
              <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '14px' }}>{r.label}</div>
              <p style={{ margin: 0, fontSize: '13px', color: BRAND.text, lineHeight: 1.5 }}>{r.desc}</p>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: BRAND.secondary, lineHeight: 1.7 }}>
                {r.perms.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: BRAND.white, border: `2px solid ${BRAND.accent}`, borderRadius: '8px',
          padding: '24px', marginBottom: '20px',
        }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '20px', color: BRAND.primary, textTransform: 'uppercase' }}>
            Create a Combined Role
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: BRAND.text, lineHeight: 1.6 }}>
            Twenty allows exactly <strong style={{ color: BRAND.primary }}>one role per person</strong>. If someone needs access across multiple departments
            (e.g. Aditya works under both Sales and BD managers), create a single role that bundles both sets of permissions, then assign that one role.
          </p>

          <div style={{ backgroundColor: BRAND.bg, border: `1px solid ${BRAND.border}`, borderRadius: '6px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: BRAND.primary, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Steps</div>
            <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: BRAND.secondary, lineHeight: 1.8 }}>
              <li>Go to <strong>Settings</strong> &rarr; <strong>Roles</strong></li>
              <li>Click <strong>+ Create Role</strong></li>
              <li>Name it clearly (e.g. "Sales + BD Associate")</li>
              <li>Under <strong>Object Permissions</strong>, grant access to all objects they need</li>
              <li>Under <strong>Row-Level Permissions</strong>, set which leads they can see</li>
              <li>Save, then assign this role in <strong>Settings</strong> &rarr; <strong>Members</strong></li>
            </ol>
          </div>

          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: '14px 18px', marginBottom: '16px', fontSize: '13px', color: '#0c4a6e', lineHeight: 1.5 }}>
            <strong>Example:</strong> To give Aditya access under both Manish Chauhan (Sales) and Hanuman (BD), create a role called "Sales + BD Associate" with row-level rules for both manager fields, then assign it to Aditya.
          </div>

          <a href="/settings" target="_parent" style={{
            textDecoration: 'none', backgroundColor: BRAND.primary, color: BRAND.white,
            padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '14px',
            display: 'inline-block',
          }}>
            Open Settings &rarr; Roles
          </a>
        </div>

        <div style={{
          backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', padding: '20px',
        }}>
          <h3 style={{ margin: '0 0 10px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', color: BRAND.primary, textTransform: 'uppercase' }}>
            How role assignment works
          </h3>
          <div style={{ fontSize: '13px', color: BRAND.text, lineHeight: 1.7 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: BRAND.primary, minWidth: '18px' }}>1.</span>
              <span>Invite a person via <strong>Settings &rarr; Members &rarr; + Invite</strong></span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: BRAND.primary, minWidth: '18px' }}>2.</span>
              <span>Pick their role (HOD, Manager, Associate, or a custom combined role)</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: BRAND.primary, minWidth: '18px' }}>3.</span>
              <span>Assign leads to them from the <strong>Leads Dashboard</strong> &mdash; row-level rules kick in automatically</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 700, color: BRAND.primary, minWidth: '18px' }}>4.</span>
              <span>To change someone's role later, go back to <strong>Settings &rarr; Members</strong> and reassign</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderHierarchy = () => {
    const hodMembers = members.filter(m => inferRole(m) === 'HOD');
    const mgrMembers = members.filter(m => inferRole(m) === 'Manager' || inferRole(m) === 'Multi-role');
    const assocMembers = members.filter(m => inferRole(m) === 'Associate');

    const getAssociatesFor = (mgrId: string) => {
      const ids = new Set<string>();
      leads.forEach((l: any) => {
        const mp = l.assignedManagerPrimary?.id || l.assignedManagerPrimaryId;
        const ms = l.assignedManagerSecondary?.id || l.assignedManagerSecondaryId;
        if (mp !== mgrId && ms !== mgrId) return;
        const aa = l.assignedAssociate?.id || l.assignedAssociateId;
        if (aa) ids.add(aa);
      });
      return members.filter(m => ids.has(m.id));
    };

    const linkedAssocIds = new Set<string>();
    mgrMembers.forEach(mgr => {
      getAssociatesFor(mgr.id).forEach(a => linkedAssocIds.add(a.id));
    });
    const unlinkedAssocs = assocMembers.filter(a => !linkedAssocIds.has(a.id));

    const NodeCard = ({ member, role }: { member: any; role: string }) => {
      const rc = roleColor(role);
      return (
        <div style={{
          backgroundColor: BRAND.white, border: `2px solid ${rc.fg}`,
          borderRadius: '10px', padding: '14px 20px', minWidth: '150px', textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,27,46,0.05)',
        }}>
          <div style={{ fontWeight: 700, color: BRAND.primary, fontSize: '14px', marginBottom: '4px' }}>{memberName(member)}</div>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700, backgroundColor: rc.bg, color: rc.fg }}>
            {role}
          </span>
          <div style={{ fontSize: '11px', color: BRAND.text, marginTop: '5px' }}>{getLeadCount(member.id)} leads</div>
        </div>
      );
    };

    const Connector = () => (
      <div style={{ width: '2px', height: '20px', backgroundColor: BRAND.border, margin: '0 auto' }} />
    );

    return (
      <>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase' }}>Organization Chart</h2>
          <p style={{ margin: 0, fontSize: '13px', color: BRAND.text }}>Auto-detected from lead assignments. Assign leads to build the hierarchy.</p>
        </div>

        <div style={{
          backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px',
          padding: '40px 32px', overflowX: 'auto',
        }}>
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', color: BRAND.text, padding: '30px' }}>
              <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>No team data yet</div>
              <div style={{ fontSize: '13px' }}>Invite members and assign leads to build the org chart.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {hodMembers.length > 0 && (
                <>
                  <div style={{ fontSize: '11px', color: BRAND.text, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '4px' }}>HOD / Admin</div>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {hodMembers.map(m => <NodeCard key={m.id} member={m} role="HOD" />)}
                  </div>
                </>
              )}

              {hodMembers.length > 0 && mgrMembers.length > 0 && <Connector />}

              {mgrMembers.length > 0 && (
                <>
                  <div style={{ fontSize: '11px', color: BRAND.text, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '4px', marginTop: '8px' }}>Managers</div>
                  <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {mgrMembers.map(mgr => {
                      const teamAssocs = getAssociatesFor(mgr.id);
                      return (
                        <div key={mgr.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <NodeCard member={mgr} role="Manager" />
                          {teamAssocs.length > 0 && (
                            <>
                              <Connector />
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {teamAssocs.map(a => <NodeCard key={a.id} member={a} role="Associate" />)}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {unlinkedAssocs.length > 0 && (
                <>
                  <div style={{ width: '60%', height: '1px', backgroundColor: BRAND.border, margin: '16px 0' }} />
                  <div style={{ fontSize: '11px', color: BRAND.text, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '1px', marginBottom: '4px' }}>Unlinked Associates</div>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {unlinkedAssocs.map(a => <NodeCard key={a.id} member={a} role="Associate" />)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px', fontSize: '12px', color: BRAND.text, lineHeight: 1.5 }}>
          Roles are detected from lead assignments: people assigned as Manager Primary/Secondary appear as Managers, those in the Associate field appear as Associates, everyone else shows as HOD. To change the structure, reassign leads or update roles in Settings.
        </div>
      </>
    );
  };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Barlow', sans-serif" }}>
        <div style={{
          width: '196px', backgroundColor: BRAND.primary, display: 'flex', flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ margin: 0, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '17px', color: BRAND.white, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Team & Access
            </h2>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>Admin Panel</div>
          </div>
          <nav style={{ padding: '10px 0', flex: 1 }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  display: 'block', width: '100%',
                  padding: '11px 18px', border: 'none', textAlign: 'left',
                  backgroundColor: tab === t.key ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: tab === t.key ? BRAND.white : 'rgba(255,255,255,0.55)',
                  cursor: 'pointer', fontSize: '13.5px', fontWeight: tab === t.key ? 600 : 400,
                  borderLeft: tab === t.key ? `3px solid ${BRAND.lightAccent}` : '3px solid transparent',
                  transition: 'all 0.15s',
                  fontFamily: "'Barlow', sans-serif",
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/settings" target="_parent" style={{
              display: 'block', textAlign: 'center', textDecoration: 'none',
              backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)',
              padding: '8px', borderRadius: '5px', fontSize: '12px', fontWeight: 600,
            }}>
              Open Settings
            </a>
            <a href="/objects/departments" target="_parent" style={{
              display: 'block', textAlign: 'center', textDecoration: 'none',
              backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
              padding: '8px', borderRadius: '5px', fontSize: '12px', fontWeight: 500,
            }}>
              Departments Table
            </a>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: BRAND.bg, padding: '28px 32px', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
          {toast && (
            <div style={{
              position: 'fixed', top: '16px', right: '24px', zIndex: 1000,
              backgroundColor: '#065f46', color: BRAND.white, padding: '10px 18px',
              borderRadius: '6px', fontSize: '13px', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}>
              {toast}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: BRAND.text, fontSize: '14px' }}>
              Loading...
            </div>
          ) : (
            <div style={{ maxWidth: '960px' }}>
              {tab === 'people' && renderPeople()}
              {tab === 'departments' && renderDepartments()}
              {tab === 'roles' && renderRoles()}
              {tab === 'hierarchy' && renderHierarchy()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: TEAM_ACCESS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Team & Access',
  description: 'Admin control center for people, roles, departments, and org hierarchy.',
  component: TeamAccessDashboard,
});
