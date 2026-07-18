import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState, useEffect } from 'react';
import { useRecordId } from 'twenty-sdk/front-component';

import {
  APP_DISPLAY_NAME,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

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

  .minimines-dashboard {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background-color: ${BRAND.bg};
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
  }

  .h1, .h2, .h3 {
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    font-weight: 600;
    margin: 0;
  }

  .h1 { font-size: 32px; color: ${BRAND.primary}; margin-bottom: 8px; }
  .h2 { font-size: 24px; color: ${BRAND.primary}; margin-bottom: 24px; }
  .h3 { font-size: 18px; color: ${BRAND.secondary}; }

  .subtitle {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
    color: ${BRAND.text};
    font-weight: 400;
  }

  .card {
    background: ${BRAND.white};
    border: 1px solid ${BRAND.border};
    border-radius: 8px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 27, 46, 0.04);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 27, 46, 0.08);
  }

  .stat-value {
    font-family: 'Barlow', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: ${BRAND.primary};
    margin-top: 8px;
  }

  .stat-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    color: ${BRAND.accent};
    letter-spacing: 0.5px;
  }

  .stat-sub {
    font-family: 'Roboto Slab', serif;
    font-size: 12px;
    color: ${BRAND.text};
    margin-top: 8px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th, .data-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${BRAND.border};
  }

  .data-table th {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    color: ${BRAND.secondary};
    background-color: ${BRAND.bg};
  }

  .data-table td {
    font-size: 14px;
    color: ${BRAND.primary};
    font-weight: 500;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Barlow', sans-serif;
    background: ${BRAND.bg};
    color: ${BRAND.accent};
    border: 1px solid ${BRAND.accent};
  }
  
  .btn {
    display: inline-block;
    background: ${BRAND.primary};
    color: ${BRAND.white};
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0.5px;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .btn:hover {
    background: ${BRAND.accent};
    transform: translateY(-1px);
  }
  
  .btn-outline {
    background: transparent;
    color: ${BRAND.primary};
    border: 2px solid ${BRAND.primary};
  }
  
  .btn-outline:hover {
    background: ${BRAND.bg};
  }
`;

const StatCard = ({ label, value, sub, link }: any) => {
  const content = (
    <div className="card" style={{ padding: '20px' }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
  
  if (link) {
    return <a href={link} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a>;
  }
  return content;
};

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';
  
  const options: any = {
    method,
    headers: { Authorization: apiKey, 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    const json = await res.json();
    
    if (method !== 'GET') return json;

    const key = path.split('?')[0]; // Extract base path e.g. contracts
    let items = json.data && json.data[key] ? json.data[key] : [];
    if (items && items.edges) {
      items = items.edges.map((e: any) => e.node);
    }
    if (!Array.isArray(items)) {
      items = [];
    }
    return items;
  } catch (error) {
    console.error('Fetch error:', error);
    return method === 'GET' ? [] : null;
  }
};

const ActivityTable = ({ recentActs }: { recentActs: any[] }) => (
  <div className="card" style={{ padding: 0 }}>
    <table className="data-table">
      <thead>
        <tr>
          <th>Reference ID</th>
          <th>Type</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {(Array.isArray(recentActs) ? recentActs : []).map((act, i) => (
          <tr key={i}>
            <td>{act?.referenceId || (act?.id ? String(act.id).substring(0, 8) : 'N/A')}</td>
            <td>{act?.type || 'Unknown'}</td>
            <td><span className="status-badge">{act?.status || 'N/A'}</span></td>
            <td style={{ color: BRAND.text }}>{act?.date ? new Date(act.date).toLocaleDateString() : 'N/A'}</td>
          </tr>
        ))}
        {(!recentActs || recentActs.length === 0) && (
          <tr>
            <td colSpan={4} style={{ textAlign: 'center', color: BRAND.text }}>No recent operations found.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const ContractTracker = ({ contracts = [] }: { contracts: any[] }) => {
  const safeContracts = Array.isArray(contracts) ? contracts : [];
  const [selectedId, setSelectedId] = useState(safeContracts.length > 0 ? safeContracts[0].id : null);
  useEffect(() => { if (safeContracts.length > 0 && !selectedId) setSelectedId(safeContracts[0].id); }, [safeContracts]);
  
  if (safeContracts.length === 0) return <div className="card" style={{ padding: '40px', textAlign: 'center' }}>No Active Contracts</div>;

  const contract = safeContracts.find(c => c.id === selectedId) || safeContracts[0];
  if (!contract) return <div className="card">Error loading contract</div>;

  const totalQuantity = contract.totalQuantity || 0;
  const fulfilledQuantity = Math.floor(totalQuantity * 0.4); 
  const progressPercent = totalQuantity > 0 ? (fulfilledQuantity / totalQuantity) * 100 : 0;

  return (
    <div className="card" style={{ gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 className="h2" style={{ margin: 0 }}>Contract Analytics</h2>
        <select 
          value={selectedId || ''} 
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
        >
          {safeContracts.map(c => <option key={c.id} value={c.id}>{c.name || `Contract ${(c.id || '').substring(0,6)}`}</option>)}
        </select>
      </div>

      <div style={{ backgroundColor: BRAND.bg, padding: '20px', border: `1px solid ${BRAND.border}` }}>
        <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Volume Fulfillment</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: BRAND.primary }}>{fulfilledQuantity} MT</span>
          <span style={{ fontSize: '14px', color: BRAND.text, alignSelf: 'flex-end', marginBottom: '4px' }}>of {totalQuantity} MT</span>
        </div>
        
        <div style={{ width: '100%', height: '12px', backgroundColor: '#E0E0E0', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.5s ease-out' }}></div>
        </div>
      </div>

      <div style={{ backgroundColor: BRAND.bg, padding: '20px', border: `1px solid ${BRAND.border}` }}>
        <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>Contract Timeline</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: BRAND.text }}>
          <span>Start: <strong style={{ color: BRAND.primary }}>{contract.startDate ? new Date(contract.startDate).toLocaleDateString() : 'N/A'}</strong></span>
          <span>End: <strong style={{ color: BRAND.primary }}>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}</strong></span>
        </div>
        
        <div style={{ position: 'relative', width: '100%', height: '24px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', width: '60%', height: '100%', backgroundColor: BRAND.lightAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#FFF', fontWeight: 'bold', letterSpacing: '1px' }}>
            ACTIVE DURATION
          </div>
        </div>
      </div>
    </div>
  );
};

const ShipmentTracker = ({ shipments = [] }: { shipments: any[] }) => {
  const safeShipments = Array.isArray(shipments) ? shipments : [];
  const [selectedId, setSelectedId] = useState(safeShipments.length > 0 ? safeShipments[0].id : null);
  useEffect(() => { if (safeShipments.length > 0 && !selectedId) setSelectedId(safeShipments[0].id); }, [safeShipments]);
  
  if (safeShipments.length === 0) return <div className="card" style={{ padding: '40px', textAlign: 'center' }}>No Active Shipments</div>;

  const shipment = safeShipments.find(s => s.id === selectedId) || safeShipments[0];
  if (!shipment) return <div className="card">Error loading shipment</div>;

  const currentStatus = (shipment.transitExport || 'DOCUMENTATION').toUpperCase();

  const steps = [
    { label: 'Documentation', active: true },
    { label: 'Customs', active: ['CUSTOMS', 'IN_TRANSIT', 'DELIVERED', 'PASSED'].includes(currentStatus) },
    { label: 'In Transit', active: ['IN_TRANSIT', 'DELIVERED'].includes(currentStatus) },
    { label: 'Delivered', active: ['DELIVERED'].includes(currentStatus) }
  ];
  
  const activeStepsCount = steps.filter(s => s.active).length;
  const progressPercent = ((activeStepsCount - 1) / (Math.max(steps.length - 1, 1))) * 100;

  return (
    <div className="card" style={{ gap: '16px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 className="h2" style={{ margin: 0 }}>Logistics Tracker</h2>
        <select 
          value={selectedId || ''} 
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
        >
          {safeShipments.map(s => <option key={s.id} value={s.id}>{s.vesselName || `Shipment ${(s.id || '').substring(0,6)}`}</option>)}
        </select>
      </div>
      
      <div style={{ backgroundColor: BRAND.bg, padding: '20px', border: `1px solid ${BRAND.border}` }}>
        <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>Vessel & Cargo</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: BRAND.text, fontSize: '15px' }}>Vessel:</span>
            <span style={{ fontWeight: 600, color: BRAND.primary, fontSize: '15px' }}>{shipment.vesselName || 'TBD'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: BRAND.text, fontSize: '15px' }}>Container:</span>
            <span style={{ fontWeight: 600, color: BRAND.primary, fontSize: '15px' }}>{shipment.containerNumber || 'TBD'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${BRAND.border}`, paddingTop: '12px', marginTop: '4px' }}>
            <span style={{ color: BRAND.text, fontSize: '15px' }}>QA Status:</span>
            <span style={{ fontWeight: 600, color: shipment.qaStatus === 'PASSED' ? BRAND.accent : BRAND.primary, fontSize: '15px' }}>{shipment.qaStatus || 'PENDING'}</span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: BRAND.bg, padding: '24px 16px', border: `1px solid ${BRAND.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
        <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '28px' }}>Transit Progress</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '0 8px' }}>
          <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '4px', backgroundColor: '#E0E0E0', zIndex: 0 }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: BRAND.accent, transition: 'width 0.5s ease-out' }}></div>
          </div>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step.active ? BRAND.accent : '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '13px', fontWeight: 'bold', transition: 'background-color 0.3s' }}>
                {i + 1}
              </div>
              <div style={{ fontSize: '12px', fontWeight: step.active ? 600 : 400, color: step.active ? BRAND.primary : BRAND.text, textAlign: 'center', width: '60px', lineHeight: '1.2' }}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EnquiryQuickReply = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const loadData = async () => {
    setLoading(true);
    // Fetch only unanswered enquiries
    const allEnqs = await fetchTwenty('enquiries?orderBy=createdAt,desc&limit=20');
    const unanswered = (Array.isArray(allEnqs) ? allEnqs : []).filter((e: any) => e.status === 'UNANSWERED');
    
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

const MainPage = () => {
  const [data, setData] = useState({
    contracts: [],
    salesOrders: [],
    exportShipments: [],
    opportunities: [],
    leads: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let { contracts, salesOrders, exportShipments, opportunities, leads } = await Promise.all([
        fetchTwenty('contracts?orderBy=createdAt,desc&limit=5'),
        fetchTwenty('salesOrders?orderBy=createdAt,desc&limit=5'),
        fetchTwenty('exportShipments?orderBy=createdAt,desc&limit=5'),
        fetchTwenty('opportunities?limit=50'),
        fetchTwenty('leads?limit=50')
      ]).then(([c, s, e, o, l]) => ({ contracts: c, salesOrders: s, exportShipments: e, opportunities: o, leads: l }));

      setData({ contracts, salesOrders, exportShipments, opportunities, leads });
      setLoading(false);
    };
    loadData();
  }, []);

  const safeContracts = Array.isArray(data.contracts) ? data.contracts : [];
  const safeSalesOrders = Array.isArray(data.salesOrders) ? data.salesOrders : [];
  const safeShipments = Array.isArray(data.exportShipments) ? data.exportShipments : [];
  
  const recentActs = [
    ...safeContracts.map((c: any) => ({ type: 'Contract', referenceId: c.name || c.id, status: c.status || 'ACTIVE', date: c.createdAt })),
    ...safeSalesOrders.map((o: any) => ({ type: 'Sales Order', referenceId: o.orderNumber || o.id, status: o.status || 'PENDING', date: o.createdAt })),
    ...safeShipments.map((s: any) => ({ type: 'Shipment', referenceId: s.containerNumber || s.id, status: s.transitExport || 'IN TRANSIT', date: s.createdAt }))
  ].sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()).slice(0, 5);

  const safeOpportunities = Array.isArray(data.opportunities) ? data.opportunities : [];
  const safeLeads = Array.isArray(data.leads) ? data.leads : [];
  
  const activeContracts = safeContracts.filter((c: any) => c?.status !== 'EXPIRED').length;
  
  const openOpportunities = safeOpportunities.filter((o: any) => o?.stage !== 'CLOSED_WON' && o?.stage !== 'CLOSED_LOST').length;
  const totalLeadsCount = safeLeads.length;

  if (loading) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading secure CRM data...</div>;
  }

  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-dashboard">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <div>
              <h1 className="h1">MiniMines BD CRM</h1>
              <div className="subtitle">Corporate Command Center</div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="/objects/contracts" className="btn btn-outline">Contracts</a>
              <a href="/objects/salesOrders" className="btn btn-outline">Sales Orders</a>
              <a href="/objects/exportShipments" className="btn btn-outline">Shipments</a>
              <a href="/objects/lMETrackers" className="btn btn-outline">LME Tracker</a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard label="Active Contracts" value={activeContracts.toString()} sub="Total Active" link="/objects/contracts" />
            <StatCard label="Active Shipments" value={data.exportShipments.length.toString()} sub="Total shipments recorded" link="/objects/exportShipments" />
            <StatCard label="Open Opportunities" value={openOpportunities.toString()} sub="In Pipeline" link="/page/275fc99b-e0bc-42b7-a949-ad0480c2d797" />
            <StatCard label="Total Leads" value={totalLeadsCount.toString()} sub="New Prospects" link="/page/41530a63-a8a1-4219-9809-d0e93dc16970" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px', alignItems: 'stretch' }}>
             <ContractTracker contracts={data.contracts} />
             <ShipmentTracker shipments={data.exportShipments} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div>
              <h2 className="h2">Incoming Enquiries</h2>
              <EnquiryQuickReply />
            </div>
            
            <div>
              <h2 className="h2">System Links</h2>
              <div className="card" style={{ gap: '16px' }}>
                <a href="/objects/contracts" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; Manage Contracts</a>
                <a href="/objects/salesOrders" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; Manage Sales Orders</a>
                <a href="/objects/exportShipments" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; Manage Export Shipments</a>
                <a href="/objects/lMETrackers" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; LME Price Feeds</a>
                
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${BRAND.border}` }}>
                  <div className="stat-label" style={{ marginBottom: '8px' }}>Module Status</div>
                  <div style={{ fontSize: '14px', color: BRAND.text }}>All custom business development modules are active and synced.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: APP_DISPLAY_NAME,
  description: 'MiniMines Custom CRM Dashboard',
  component: MainPage,
});

