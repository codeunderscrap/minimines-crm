import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  green: '#2E8B57'
};

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `http://localhost:3000/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';
  
  const options: any = {
    method,
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    return method === 'GET' ? (json?.data?.items || json?.data || []) : json;
  } catch (error) {
    console.error('Fetch error:', error);
    return method === 'GET' ? [] : null;
  }
};

export const EnquiryQuickReply = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const loadData = async () => {
    setLoading(true);
    // Fetch only unanswered enquiries
    const allEnqs = await fetchTwenty(`enquiries?orderBy=createdAt,desc&limit=20`);
    const unanswered = (Array.isArray(allEnqs) ? allEnqs : []).filter(e => e.status === 'UNANSWERED');
    
    // If DB is empty, let's inject a mock one to show the UI
    if (unanswered.length === 0) {
      setEnquiries([
        { id: 'mock-1', customerName: 'Rajesh Kumar', source: 'WEBSITE', message: 'I need a quote for 50MT of Copper Wire Scrap. Can you deliver to Mumbai port?', status: 'UNANSWERED', createdAt: new Date().toISOString() },
        { id: 'mock-2', customerName: 'Sarah Jenkins', source: 'LINKEDIN', message: 'Hello! Does MiniMines supply Battery Grade Lithium Carbonate?', status: 'UNANSWERED', createdAt: new Date(Date.now() - 3600000).toISOString() }
      ]);
    } else {
      setEnquiries(unanswered);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendReply = async () => {
    if (!selectedEnquiry || !replyText.trim()) return;
    
    if (selectedEnquiry.id.startsWith('mock')) {
      // Simulate reply for mock data
      setEnquiries(enquiries.filter(e => e.id !== selectedEnquiry.id));
      setSelectedEnquiry(null);
      setReplyText('');
      return;
    }

    // Real DB update
    await fetchTwenty(`enquiries/${selectedEnquiry.id}`, 'PATCH', {
      reply: replyText,
      status: 'REPLIED'
    });
    
    setSelectedEnquiry(null);
    setReplyText('');
    await loadData();
  };

  if (loading) return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading incoming enquiries...</div>;

  return (
    <div style={{ display: 'flex', border: `1px solid ${BRAND.border}`, borderRadius: '8px', overflow: 'hidden', height: '400px', backgroundColor: BRAND.white, fontFamily: "'Barlow', sans-serif" }}>
      {/* Left panel - Inbox list */}
      <div style={{ width: '300px', borderRight: `1px solid ${BRAND.border}`, overflowY: 'auto', backgroundColor: BRAND.bg }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.white, position: 'sticky', top: 0 }}>
          <div style={{ fontWeight: 600, color: BRAND.primary }}>Incoming Enquiries ({enquiries.length})</div>
        </div>
        {enquiries.map(enq => (
          <div 
            key={enq.id}
            onClick={() => { setSelectedEnquiry(enq); setReplyText(''); }}
            style={{ 
              padding: '16px', 
              borderBottom: `1px solid ${BRAND.border}`, 
              cursor: 'pointer',
              backgroundColor: selectedEnquiry?.id === enq.id ? '#E8F4F8' : 'transparent',
              borderLeft: selectedEnquiry?.id === enq.id ? `4px solid ${BRAND.accent}` : '4px solid transparent'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: BRAND.primary }}>{enq.customerName}</span>
              <span style={{ fontSize: '10px', color: BRAND.text, backgroundColor: '#E0E0E0', padding: '2px 6px', borderRadius: '4px' }}>{enq.source}</span>
            </div>
            <div style={{ fontSize: '12px', color: BRAND.secondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {enq.message}
            </div>
          </div>
        ))}
        {enquiries.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: BRAND.text, fontSize: '14px' }}>Inbox Zero! 🎉</div>
        )}
      </div>

      {/* Right panel - Reply view */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: BRAND.white }}>
        {selectedEnquiry ? (
          <>
            <div style={{ padding: '24px', borderBottom: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '18px', fontWeight: 600, color: BRAND.primary, marginBottom: '4px' }}>{selectedEnquiry.customerName}</div>
              <div style={{ fontSize: '12px', color: BRAND.text }}>Via {selectedEnquiry.source} • {new Date(selectedEnquiry.createdAt).toLocaleString()}</div>
            </div>
            
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
              <div style={{ backgroundColor: BRAND.bg, padding: '16px', borderRadius: '8px', border: `1px solid ${BRAND.border}`, marginBottom: '24px', fontSize: '14px', lineHeight: 1.5, color: BRAND.secondary }}>
                {selectedEnquiry.message}
              </div>

              <textarea 
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Type your reply to ${selectedEnquiry.customerName}...`}
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: `1px solid ${BRAND.border}`,
                  resize: 'none',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ padding: '16px 24px', borderTop: `1px solid ${BRAND.border}`, display: 'flex', justifyContent: 'flex-end', backgroundColor: BRAND.bg }}>
              <button 
                onClick={handleSendReply}
                style={{
                  backgroundColor: replyText.trim() ? BRAND.accent : BRAND.text,
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
              >
                Send Reply
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: BRAND.text, flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>💬</div>
            <div>Select an enquiry to reply</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Enquiry Quick Reply',
  component: EnquiryQuickReply,
});
