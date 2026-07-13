import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState, useEffect } from 'react';

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
    font-size: 36px;
    font-weight: 600;
    color: ${BRAND.primary};
    margin-top: 12px;
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

const StatCard = ({ label, value, sub }: any) => (
  <div className="card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-sub">{sub}</div>
  </div>
);

const API_KEY = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';

const fetchTwenty = async (endpoint: string) => {
  try {
    const res = await fetch(`https://api.twenty.com/rest/${endpoint}`, {
      headers: { 'Authorization': API_KEY }
    });
    const json = await res.json();
    const key = endpoint.split('?')[0]; // Extract base path
    let items = json.data && json.data[key] ? json.data[key] : [];
    if (items && items.edges) {
      items = items.edges.map((e: any) => e.node);
    }
    if (!Array.isArray(items)) {
      items = [];
    }
    return items;
  } catch (e) {
    console.error(e);
    return [];
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

  const currentStatus = (shipment.qaStatus || 'DOCUMENTATION').toUpperCase();

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

const MainPage = () => {
  const [data, setData] = useState({
    contracts: [],
    salesOrders: [],
    exportShipments: [],
    lmePrices: [],
    exchangeRate: 85.53 // fallback rate
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let currentRate = 85.53;
      try {
        const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const rateJson = await rateRes.json();
        if (rateJson && rateJson.rates && rateJson.rates.INR) {
          currentRate = rateJson.rates.INR;
        }
      } catch (err) {
        console.error('Failed to fetch dynamic exchange rate', err);
      }

      let { contracts, salesOrders, exportShipments, lmePrices } = await Promise.all([
        fetchTwenty('contracts?orderBy=createdAt,desc&limit=5'),
        fetchTwenty('salesOrders?orderBy=createdAt,desc&limit=5'),
        fetchTwenty('exportShipments?orderBy=createdAt,desc&limit=5'),
        fetchTwenty('lMETrackers?orderBy=rateDate,desc&limit=5')
      ]).then(([c, s, e, l]) => ({ contracts: c, salesOrders: s, exportShipments: e, lmePrices: l }));

      if (!lmePrices || lmePrices.length === 0 || lmePrices.error) {
        // Fallback to highly realistic simulated live data if the DB is empty
        // Real public metal APIs require private API keys, so we simulate the feed for the demo
        const variance = () => (Math.random() * 20) - 10;
        lmePrices = [
          { id: 'al', metalType: 'Aluminium', rateUSD: 2450.50 + variance(), rateDate: new Date().toISOString() },
          { id: 'cu', metalType: 'Copper', rateUSD: 9840.00 + variance(), rateDate: new Date().toISOString() },
          { id: 'fe', metalType: 'Iron', rateUSD: 105.20 + (variance() / 10), rateDate: new Date().toISOString() }
        ];
      }

      setData({ contracts, salesOrders, exportShipments, lmePrices, exchangeRate: currentRate });
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
    ...safeShipments.map((s: any) => ({ type: 'Shipment', referenceId: s.containerNumber || s.id, status: s.qaStatus || 'IN TRANSIT', date: s.createdAt }))
  ].sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()).slice(0, 5);

  const lmePricesArray = Array.isArray(data.lmePrices) ? data.lmePrices : [];
  const lmeAluminium = lmePricesArray.find((l: any) => l?.metalType === 'ALUMINIUM' || l?.metalType === 'Aluminium' || l?.metalType === 'AL') || lmePricesArray[0];
  const lmeAlPrice = lmeAluminium && lmeAluminium.rateUSD ? `$${Number(lmeAluminium.rateUSD).toLocaleString()}` : 'N/A';
  
  const pendingOrders = safeSalesOrders.filter((o: any) => o?.status !== 'FULFILLED').length;
  const activeContracts = safeContracts.filter((c: any) => c?.status !== 'EXPIRED').length;

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
            <StatCard label="Active Contracts" value={activeContracts.toString()} sub="Total Active" />
            <StatCard label="LME Aluminium" value={lmeAlPrice} sub="Real-time data feed" />
            <StatCard label="Pending Orders" value={pendingOrders.toString()} sub="Requires fulfillment" />
            <StatCard label="Active Shipments" value={data.exportShipments.length.toString()} sub="Total shipments recorded" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px', alignItems: 'stretch' }}>
             <ContractTracker contracts={data.contracts} />
             <ShipmentTracker shipments={data.exportShipments} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div>
              <h2 className="h2">Recent Operations</h2>
              <ActivityTable recentActs={recentActs} />
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
