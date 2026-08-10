import React, { useEffect, useState, useCallback } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserRole, RoleLoading } from '../utils/role-gate';

// Brand tokens
const B = {
  sidebar: '#001B2E',
  sidebarActive: '#003d66',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F5F7FA',
  text: '#7A7A7A',
  textDark: '#1A2E3B',
  textMid: '#54595F',
  green: '#27AE60',
  red: '#E74C3C',
  orange: '#F39C12',
};

const TWENTY_API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

const getEmailPrimary = (emailField: any) => {
  if (typeof emailField === 'string') return emailField;
  if (emailField && typeof emailField === 'object' && emailField.primaryEmail) return emailField.primaryEmail;
  return '';
};

const getPhonePrimary = (phoneField: any) => {
  if (typeof phoneField === 'string') return phoneField;
  if (phoneField && typeof phoneField === 'object' && phoneField.primaryPhoneNumber) return phoneField.primaryPhoneNumber;
  return '';
};

const EnquiryInbox = () => {
  const role = useUserRole();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);

  const api = async (endpoint: string, method = 'GET', body?: any) => {
    try {
      const res = await fetch(`https://minimines.twenty.com/rest/${endpoint}`, {
        method,
        headers: { Authorization: TWENTY_API_KEY, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      return data?.data?.[endpoint.split('?')[0]] ?? data?.data ?? data;
    } catch {
      return null;
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    // ONLY fetch website enquiries
    const data = await api(`enquiries?filter[source][eq]=WEBSITE&orderBy=createdAt,desc&limit=50`);
    const arr = Array.isArray(data) ? data : (data?.edges?.map((e: any) => e.node) || []);
    setEnquiries(arr);
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    loadEnquiries();
    const interval = setInterval(() => loadEnquiries(true), 30000);
    return () => clearInterval(interval);
  }, [loadEnquiries]);

  const selected = enquiries.find(e => e.id === selectedId) ?? null;

  const handleConvertToLead = async () => {
    if (!selected) return;
    setConverting(true);

    const emailAddr = getEmailPrimary(selected.contactEmail);
    const phoneNum = getPhonePrimary(selected.contactPhone);

    const leadPayload = {
      name: selected.customerName || "Website Lead",
      company: typeof selected.company === 'string' ? selected.company : (selected.company?.id ? { id: selected.company.id } : null),
      emails: emailAddr ? { primaryEmail: emailAddr } : undefined,
      phones: phoneNum ? { primaryPhoneNumber: phoneNum } : undefined,
      source: "WEBSITE",
      status: "NEW",
      notes: `Converted from Website Enquiry.\nMessage: ${selected.message || ""}`
    };

    try {
      // Remove company if null so API doesn't complain
      if (!leadPayload.company) delete leadPayload.company;

      const res = await api('leads', 'POST', leadPayload);
      if (res) {
        showToast('Successfully converted to Lead!', 'success');
        await api(`enquiries/${selected.id}`, 'PATCH', { status: 'RESOLVED' });
        setSelectedId(null);
        await loadEnquiries(true);
      } else {
        showToast('Failed to create lead.', 'error');
      }
    } catch (e) {
      showToast('Error converting lead.', 'error');
    } finally {
      setConverting(false);
    }
  };

  if (role === null) return <RoleLoading />;

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: "'Barlow', sans-serif", backgroundColor: B.bg }}>
      
      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          padding: '12px 24px', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backgroundColor: toast.type === 'success' ? B.green : toast.type === 'error' ? B.red : B.sidebar
        }}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar - List of Enquiries */}
      <div style={{ width: '320px', backgroundColor: B.white, borderRight: `1px solid ${B.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${B.border}`, backgroundColor: B.sidebar, color: B.white }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>Website Inbound Leads</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.8 }}>Live tracking of website form submissions.</p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: B.text }}>Loading leads...</div>
          ) : enquiries.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: B.text }}>No website leads currently.</div>
          ) : (
            enquiries.map(enq => {
              const isActive = selectedId === enq.id;
              return (
                <div 
                  key={enq.id} 
                  onClick={() => setSelectedId(enq.id)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: `1px solid ${B.border}`,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#F0F8FF' : 'transparent',
                    borderLeft: isActive ? `4px solid ${B.accent}` : '4px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: B.textDark, fontSize: '15px' }}>{enq.customerName || 'Anonymous'}</strong>
                    <span style={{ fontSize: '11px', color: B.text }}>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: B.textMid, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {enq.message || 'No message provided.'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Panel - Enquiry Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', backgroundColor: B.bg, overflowY: 'auto' }}>
        {selected ? (
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', backgroundColor: B.white, borderRadius: '12px', border: `1px solid ${B.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: `1px solid ${B.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ margin: '0 0 8px', fontSize: '24px', color: B.textDark }}>{selected.customerName || 'Anonymous Website Lead'}</h1>
                <div style={{ display: 'flex', gap: '16px', color: B.textMid, fontSize: '14px' }}>
                  {getEmailPrimary(selected.contactEmail) && <span>📧 {getEmailPrimary(selected.contactEmail)}</span>}
                  {getPhonePrimary(selected.contactPhone) && <span>📞 {getPhonePrimary(selected.contactPhone)}</span>}
                </div>
              </div>
              
              <button 
                onClick={handleConvertToLead}
                disabled={converting}
                style={{
                  backgroundColor: B.accent,
                  color: B.white,
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: converting ? 'not-allowed' : 'pointer',
                  opacity: converting ? 0.7 : 1
                }}
              >
                {converting ? 'Converting...' : 'Convert to Lead'}
              </button>
            </div>

            {/* Message Body */}
            <div style={{ padding: '32px 24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: B.text, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Original Message
              </div>
              <div style={{ fontSize: '15px', color: B.textDark, lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', border: `1px solid ${B.border}` }}>
                {selected.message || <i>No message content provided.</i>}
              </div>
            </div>
            
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: B.text, flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🌐</div>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>Select a website lead to view details</div>
          </div>
        )}
      </div>

    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Website Inbound Leads',
  component: EnquiryInbox,
});

// cache-bust: 1786111300001