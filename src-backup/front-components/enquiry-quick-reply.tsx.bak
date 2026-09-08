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
  const [sourceFilter, setSourceFilter] = useState<'WEBSITE' | 'OTHER'>('WEBSITE');
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
    let filterString = `filter[source][eq]=${sourceFilter}`;
    if (sourceFilter === 'OTHER') {
        filterString = `filter[source][neq]=WEBSITE`;
    }
    const data = await api(`enquiries?${filterString}&orderBy=createdAt,desc&limit=50`);
    const arr = Array.isArray(data) ? data : (data?.edges?.map((e: any) => e.node) || []);
    setEnquiries(arr);
    if (!silent) setLoading(false);
  }, [sourceFilter]);

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
      source: selected.source || "WEBSITE",
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
          <h2 style={{ margin: 0, fontSize: '22px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inbound Leads</h2>
          
          <div style={{ display: 'flex', marginTop: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px' }}>
            <button 
              onClick={() => setSourceFilter('WEBSITE')}
              style={{
                flex: 1, padding: '6px 0', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                backgroundColor: sourceFilter === 'WEBSITE' ? B.white : 'transparent',
                color: sourceFilter === 'WEBSITE' ? B.sidebar : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
              Website
            </button>
            <button 
              onClick={() => setSourceFilter('OTHER')}
              style={{
                flex: 1, padding: '6px 0', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                backgroundColor: sourceFilter === 'OTHER' ? B.white : 'transparent',
                color: sourceFilter === 'OTHER' ? B.sidebar : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
              Other Sources
            </button>
          </div>
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
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  style={{
                    padding: '16px 24px',
                    borderBottom: `1px solid ${B.border}`,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#F0F8FF' : 'transparent',
                    borderLeft: isActive ? `4px solid ${B.accent}` : '4px solid transparent',
                    transition: 'all 0.2s ease-in-out',
                    transform: isActive ? 'translateX(2px)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <strong style={{ color: B.textDark, fontSize: '15px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{enq.customerName || 'Anonymous'}</strong>
                    <span style={{ fontSize: '10px', color: B.text, backgroundColor: B.bg, padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  {sourceFilter === 'OTHER' && (
                    <div style={{ fontSize: '10px', fontWeight: 600, color: B.accent, marginBottom: '4px', textTransform: 'uppercase' }}>{enq.source || 'UNKNOWN'}</div>
                  )}
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', backgroundColor: B.bg, overflowY: 'auto', position: 'relative' }}>
        {selected ? (
          <div style={{ 
            maxWidth: '800px', width: '100%', margin: '0 auto', 
            backgroundColor: B.white, borderRadius: '12px', border: `1px solid ${B.border}`, 
            boxShadow: '0 8px 30px rgba(0,27,46,0.04)',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <style>
              {`
                @keyframes slideUp {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
            
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