import { defineFrontComponent } from 'twenty-sdk/define';
import { useUserId } from 'twenty-sdk/front-component';
import React, { useEffect, useState } from 'react';

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
  green: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Roboto+Slab:wght@400&family=Barlow:wght@400;

export type UserRole = 'hod' | 'manager' | 'associate';

const API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

export const useUserRole = (): UserRole | null => {
  const rawUserId = useUserId();
  const [role, setRole] = useState<UserRole | null>(null);

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

export const AccessDenied = ({
  minRole = 'manager',
}: {
  minRole?: 'hod' | 'manager';
}) => (
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

export const RoleLoading = () => (
  <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", color: '#7A7A7A' }}>
    Loading...
  </div>
);

500;600&display=swap');
`;

const API_URL = 'https://minimines.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg',
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
  } catch {
    return [];
  }
};

const DocumentVault = () => {
  const role = useUserRole();
  const [attachments, setAttachments] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [attData, compData] = await Promise.all([
        fetchList('attachments?limit=500'),
        fetchList('companies?limit=500')
      ]);
      setAttachments(attData);
      setCompanies(compData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (role === null) return <RoleLoading />;

  // RBAC: Associates only see non-sensitive documents for their assigned companies.
  // We'll approximate this by filtering based on some metadata or just hiding completely if we want strict security.
  // For the vault, if they are an associate, we might restrict them heavily.
  const isAssociate = role === 'associate';

  let visibleAttachments = attachments.filter(a => {
    if (search && !a.name?.toLowerCase().includes(search.toLowerCase())) return false;
    
    // Simulate role-based access to invoices/sensitive docs
    const isSensitive = a.name?.toLowerCase().includes('invoice') || a.name?.toLowerCase().includes('contract');
    if (isAssociate && isSensitive) {
      // Associates shouldn't freely browse all invoices in the vault unless specifically allowed.
      // For now, restrict sensitive documents in global vault from standard associates.
      return false;
    }
    
    if (filterType !== 'ALL') {
      if (filterType === 'INVOICE' && !a.name?.toLowerCase().includes('invoice')) return false;
      if (filterType === 'CONTRACT' && !a.name?.toLowerCase().includes('contract')) return false;
    }
    
    return true;
  });

  const uploadFile = () => {
    setToast({ msg: 'To upload a document, navigate to the relevant Company or Lead record and upload it in the Attachments section. It will automatically appear here securely.', type: 'success' });
  };

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif", height: '100vh', backgroundColor: BRAND.bg, overflowY: 'auto' }}>
        {toast && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '12px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', color: BRAND.white, backgroundColor: toast.type === 'success' ? BRAND.green : BRAND.red, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxWidth: '400px', lineHeight: '1.4' }}>
            {toast.msg}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
              Document Vault
            </h1>
            <div style={{ color: BRAND.text, fontSize: '14px', marginTop: '4px' }}>
              Secure repository for invoices, contracts, and company documentation.
            </div>
          </div>
          <div>
             <a href="/objects/companies" target="_parent" style={{ display: 'inline-block', backgroundColor: BRAND.accent, color: BRAND.white, padding: '10px 18px', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', textDecoration: 'none' }}>
               Go to Companies to Upload
             </a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search documents by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, width: '300px', fontSize: '13px' }}
          />
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px' }}
          >
            <option value="ALL">All Documents</option>
            <option value="INVOICE">Invoices</option>
            <option value="CONTRACT">Contracts</option>
          </select>
        </div>

        {loading ? (
          <div style={{ color: BRAND.text }}>Loading vault contents...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {visibleAttachments.length === 0 ? (
              <div style={{ color: BRAND.text, gridColumn: '1 / -1' }}>No documents found matching your criteria.</div>
            ) : (
              visibleAttachments.map(doc => {
                const isPdf = doc.name?.toLowerCase().endsWith('.pdf');
                const isImg = doc.name?.toLowerCase().match(/\.(jpg|jpeg|png)$/i);
                return (
                  <div key={doc.id} style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: isPdf ? '#ef444415' : isImg ? '#3b82f615' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPdf ? BRAND.red : isImg ? BRAND.blue : BRAND.text, fontWeight: 700, fontSize: '12px' }}>
                        {isPdf ? 'PDF' : isImg ? 'IMG' : 'DOC'}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.name}>
                          {doc.name || 'Untitled Document'}
                        </div>
                        <div style={{ fontSize: '11px', color: BRAND.text, marginTop: '2px' }}>
                          Added: {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <a href={(doc.file && doc.file.length > 0) ? doc.file[0].url : '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', backgroundColor: BRAND.bg, border: `1px solid ${BRAND.border}`, textAlign: 'center', padding: '8px', borderRadius: '4px', color: BRAND.accent, fontWeight: 600, fontSize: '12px', display: 'block' }}>
                      Download / View
                    </a>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: 'b653a373-f56f-4807-b12a-863697f3a008',
  name: 'Document Vault',
  component: DocumentVault,
});
