import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { ONBOARDING_CONTRACTS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
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
  green: '#10b981',
  red: '#ef4444',
  yellow: '#f59e0b',
  blue: '#3b82f6',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Roboto+Slab:wght@400&family=Barlow:wght@400;500;600&display=swap');
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

const patchRecord = async (id: string, body: any) => {
  try {
    const res = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PATCH',
      headers: API_HEADERS,
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return null;
  }
};

const OnboardingContracts = () => {
  const role = useUserRole();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    // Fetch all companies. In the future, we could filter for only 'enrolled' companies natively.
    const compData = await fetchList('companies?limit=500');
    setCompanies(compData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (role === null) return <RoleLoading />;

  const updateContractStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const dateField = status === 'SENT' ? { contractSentDate: new Date().toISOString() } : {};
    await patchRecord(id, { contractStatus: status, ...dateField });
    await loadData();
    setUpdatingId(null);
  };

  const isOverdue = (dateStr: string) => {
    if (!dateStr) return false;
    const sentDate = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 7; // 7 days overdue
  };

  const sendReminder = (company: any) => {
    const subject = encodeURIComponent(`Action Required: Pending Contract for ${company.name}`);
    const body = encodeURIComponent(`Hi team,\n\nWe noticed that the onboarding contract sent on ${new Date(company.contractSentDate).toLocaleDateString()} has not been signed yet. Please review and sign the contract at your earliest convenience to proceed with enrollment.\n\nThank you,\nMiniMines CRM Team`);
    const email = company.accountEmail || 'client@example.com';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const total = companies.length;
  const notSent = companies.filter(c => !c.contractStatus || c.contractStatus === 'NOT_SENT').length;
  const sent = companies.filter(c => c.contractStatus === 'SENT').length;
  const signed = companies.filter(c => c.contractStatus === 'SIGNED').length;
  const overdue = companies.filter(c => c.contractStatus === 'SENT' && isOverdue(c.contractSentDate)).length;

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif", height: '100vh', backgroundColor: BRAND.bg, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
              Company Contracts Tracking
            </h1>
            <div style={{ color: BRAND.text, fontSize: '14px', marginTop: '4px' }}>
              Track onboarding contracts, send reminders, and manage document compliance.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: BRAND.white, padding: '16px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Total Companies</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: BRAND.primary }}>{total}</div>
          </div>
          <div style={{ backgroundColor: BRAND.white, padding: '16px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Not Sent</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: BRAND.text }}>{notSent}</div>
          </div>
          <div style={{ backgroundColor: BRAND.white, padding: '16px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Sent (Pending)</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: BRAND.yellow }}>{sent}</div>
          </div>
          <div style={{ backgroundColor: BRAND.white, padding: '16px', borderRadius: '8px', border: `1px solid ${BRAND.border}` }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: BRAND.text, fontWeight: 600 }}>Signed</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: BRAND.green }}>{signed}</div>
          </div>
          <div style={{ backgroundColor: BRAND.white, padding: '16px', borderRadius: '8px', border: `1px solid ${BRAND.border}`, borderLeft: `4px solid ${BRAND.red}` }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: BRAND.red, fontWeight: 600 }}>Overdue (&gt;7 Days)</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: BRAND.red }}>{overdue}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: BRAND.text }}>Loading contract data...</div>
        ) : (
          <div style={{ backgroundColor: BRAND.white, borderRadius: '8px', border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: '16px', padding: '12px 16px', backgroundColor: BRAND.primary, color: BRAND.white, fontWeight: 600, fontSize: '12px', textTransform: 'uppercase' }}>
              <div>Company Name</div>
              <div>Domain</div>
              <div>Contract Status</div>
              <div>Sent Date</div>
              <div>Actions</div>
            </div>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {companies.map(c => {
                const status = c.contractStatus || 'NOT_SENT';
                const overdueFlag = status === 'SENT' && isOverdue(c.contractSentDate);
                
                return (
                  <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: '16px', padding: '16px', borderBottom: `1px solid ${BRAND.border}`, alignItems: 'center', backgroundColor: overdueFlag ? '#fef2f2' : 'transparent', transition: 'background-color 0.2s' }}>
                    <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '14px' }}>
                      <a href={`/object/company/${c.id}`} target="_parent" style={{ color: 'inherit', textDecoration: 'none' }}>{c.name || 'Unknown Company'}</a>
                    </div>
                    <div style={{ fontSize: '13px', color: BRAND.secondary }}>{c.domainName || 'N/A'}</div>
                    
                    <div>
                      <select
                        value={status}
                        onChange={(e) => updateContractStatus(c.id, e.target.value)}
                        disabled={updatingId === c.id}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '12px', fontWeight: 600,
                          backgroundColor: status === 'SIGNED' ? '#d1fae5' : status === 'SENT' ? '#fef3c7' : '#f3f4f6',
                          color: status === 'SIGNED' ? BRAND.green : status === 'SENT' ? BRAND.yellow : BRAND.text,
                        }}
                      >
                        <option value="NOT_SENT">Not Sent</option>
                        <option value="SENT">Sent</option>
                        <option value="SIGNED">Signed</option>
                      </select>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: overdueFlag ? BRAND.red : BRAND.secondary, fontWeight: overdueFlag ? 700 : 400 }}>
                      {c.contractSentDate ? new Date(c.contractSentDate).toLocaleDateString() : '-'}
                      {overdueFlag && <span style={{ display: 'block', fontSize: '10px' }}>(Overdue)</span>}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {status === 'SENT' && (
                        <button
                          onClick={() => sendReminder(c)}
                          style={{ padding: '6px 12px', backgroundColor: BRAND.white, border: `1px solid ${BRAND.accent}`, color: BRAND.accent, borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Send Reminder
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          alert(`To upload the signed contract, please open the company record and attach the PDF to the "Attachments" section. Then change the status here to SIGNED.`);
                        }}
                        style={{ padding: '6px 12px', backgroundColor: BRAND.primary, border: 'none', color: BRAND.white, borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Upload PDF
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {companies.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>
                  No companies found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: ONBOARDING_CONTRACTS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Company Contracts',
  component: OnboardingContracts,
});
