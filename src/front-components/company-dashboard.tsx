import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState, useEffect, useMemo } from 'react';
import { COMPANY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#0F172A',
  secondary: '#475569',
  text: '#64748B',
  accent: '#3B82F6',
  lightAccent: '#DBEAFE',
  white: '#FFFFFF',
  border: '#E2E8F0',
  bg: '#F8FAFC',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
  .minimines-company-dashboard {
    font-family: 'Outfit', sans-serif;
    color: ${BRAND.primary};
    background-color: ${BRAND.bg};
    min-height: 100vh;
    display: flex;
    box-sizing: border-box;
  }
  .company-list-item {
    padding: 16px 24px;
    border-bottom: 1px solid ${BRAND.border};
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }
  .company-list-item:hover {
    background-color: ${BRAND.lightAccent};
  }
  .company-list-item.active {
    background-color: ${BRAND.white};
    border-left: 4px solid ${BRAND.accent};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .data-card {
    background-color: ${BRAND.white};
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    border: 1px solid ${BRAND.border};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
  }
  .data-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  }
  .record-item {
    display: block;
    text-decoration: none;
    padding: 12px 16px;
    border-radius: 8px;
    background-color: #F8FAFC;
    border: 1px solid transparent;
    transition: all 0.2s;
    margin-bottom: 8px;
  }
  .record-item:hover {
    background-color: ${BRAND.white};
    border-color: ${BRAND.accent};
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }
  .record-item-title {
    font-size: 14px;
    font-weight: 600;
    color: ${BRAND.primary};
    margin-bottom: 4px;
  }
  .record-item-meta {
    font-size: 12px;
    color: ${BRAND.text};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
  }
  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }
  .scrollable-content::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
  }
`;

const API_URL = 'https://minimines.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg',
  'Content-Type': 'application/json',
};

const fetchApi = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? json?.data ?? [];
    if (items?.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error('API error:', err);
    return [];
  }
};

const relationId = (record: any, name: string): string | null => {
  const nested = record?.[name];
  if (nested && typeof nested === 'object' && nested.id) return nested.id;
  if (typeof nested === 'string') return nested;
  return record?.[`${name}Id`] ?? null;
};

const renderText = (obj: any, fallback: string) => {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  return obj.primaryLinkUrl || obj.primaryLinkLabel || obj.address1 || obj.city || fallback;
};

const CompanyDashboard = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [allData, setAllData] = useState({
    contracts: [],
    opportunities: [],
    quotations: [],
    leads: [],
    shipments: []
  });

  useEffect(() => {
    const loadAll = async () => {
      const [comps, conts, opps, quots, lds, ships] = await Promise.all([
        fetchApi('companies'),
        fetchApi('contracts'),
        fetchApi('opportunities'),
        fetchApi('quotations'),
        fetchApi('leads'),
        fetchApi('exportShipments')
      ]);
      setCompanies(comps);
      setAllData({
        contracts: conts,
        opportunities: opps,
        quotations: quots,
        leads: lds,
        shipments: ships
      });
      setLoading(false);
    };
    loadAll();
  }, []);

  const data = useMemo(() => {
    if (!selectedCompanyId) return { contracts: [], opportunities: [], quotations: [], leads: [], shipments: [] };
    
    // Filter locally by companyId to ensure absolute correctness regardless of Twenty REST filter limitations
    return {
      contracts: allData.contracts.filter((r: any) => relationId(r, 'company') === selectedCompanyId),
      opportunities: allData.opportunities.filter((r: any) => relationId(r, 'company') === selectedCompanyId),
      quotations: allData.quotations.filter((r: any) => relationId(r, 'buyerCompanyId') === selectedCompanyId), // Quotations use buyerCompanyId
      leads: allData.leads.filter((r: any) => relationId(r, 'company') === selectedCompanyId),
      shipments: allData.shipments.filter((r: any) => relationId(r, 'company') === selectedCompanyId),
    };
  }, [allData, selectedCompanyId]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-company-dashboard">
        
        {/* Left Panel: Company Directory */}
        <div style={{ width: '320px', borderRight: `1px solid ${BRAND.border}`, backgroundColor: '#F1F5F9', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', backgroundColor: BRAND.primary, borderBottom: `4px solid ${BRAND.accent}` }}>
            <h2 style={{ margin: 0, color: BRAND.white, fontSize: '20px', fontWeight: 700, letterSpacing: '1px' }}>
              CLIENT DIRECTORY
            </h2>
            <div style={{ color: BRAND.text, fontSize: '12px', marginTop: '4px' }}>Select a client to view their master profile</div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: BRAND.text }}>Loading clients...</div>
            ) : companies.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: BRAND.text }}>No companies found. Add one in the Companies object.</div>
            ) : (
              companies.map(company => (
                <div 
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`company-list-item ${selectedCompanyId === company.id ? 'active' : ''}`}
                >
                  <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '15px', marginBottom: '4px' }}>
                    {company.name || 'Unnamed Company'}
                  </div>
                  <div style={{ fontSize: '12px', color: BRAND.secondary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: BRAND.green }}></span>
                    {renderText(company.domainName, 'No Domain')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Master Profile */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
          {!selectedCompany ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', color: BRAND.text }}>
              <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.2 }}>🏢</div>
              <h2 style={{ margin: '0 0 8px 0', color: BRAND.primary }}>Master Profile Dashboard</h2>
              <p style={{ margin: 0 }}>Select a company from the sidebar to view their aggregated data.</p>
            </div>
          ) : (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px', paddingBottom: '24px', borderBottom: `2px solid ${BRAND.border}` }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '16px', backgroundColor: BRAND.primary, color: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 700, marginRight: '24px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)' }}>
                  {selectedCompany.name ? selectedCompany.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: '0 0 8px 0', color: BRAND.primary, fontSize: '32px', fontWeight: 700 }}>
                      {selectedCompany.name}
                    </h1>
                    <a href={`/object/companies/${selectedCompany.id}`} className="badge" style={{ backgroundColor: BRAND.lightAccent, color: BRAND.accent, textDecoration: 'none', padding: '6px 12px' }}>
                      View Full Record ↗
                    </a>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: BRAND.secondary }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ opacity: 0.5 }}>🌐</span> {renderText(selectedCompany.domainName, 'No Website')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ opacity: 0.5 }}>📍</span> {renderText(selectedCompany.address, 'No Address')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
                
                {/* Contracts Card */}
                <div className="data-card" style={{ maxHeight: '350px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: BRAND.accent }}>📄</span> Active Contracts
                    </h3>
                    <span className="badge" style={{ backgroundColor: '#F1F5F9', color: BRAND.secondary }}>{data.contracts.length}</span>
                  </div>
                  <div className="scrollable-content">
                    {data.contracts.length === 0 ? (
                      <div style={{ fontSize: '14px', color: BRAND.text, fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No active contracts.</div>
                    ) : (
                      data.contracts.map((c: any) => (
                        <a href={`/object/contracts/${c.id}`} key={c.id} className="record-item">
                          <div className="record-item-title">{c.name || 'Unnamed Contract'}</div>
                          <div className="record-item-meta">
                            <span>Status: <strong style={{ color: BRAND.green }}>{c.status || 'ACTIVE'}</strong></span>
                            <span>{c.totalQuantity || 0} MT</span>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${BRAND.border}`, textAlign: 'center' }}>
                    <a href="/objects/contracts" style={{ color: BRAND.accent, fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Go to Contracts Dashboard &rarr;</a>
                  </div>
                </div>

                {/* Opportunities Card */}
                <div className="data-card" style={{ maxHeight: '350px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: BRAND.yellow }}>🎯</span> Pipeline Opportunities
                    </h3>
                    <span className="badge" style={{ backgroundColor: '#FFFBEB', color: BRAND.yellow }}>{data.opportunities.length}</span>
                  </div>
                  <div className="scrollable-content">
                    {data.opportunities.length === 0 ? (
                      <div style={{ fontSize: '14px', color: BRAND.text, fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No open opportunities.</div>
                    ) : (
                      data.opportunities.map((o: any) => (
                        <a href={`/object/opportunities/${o.id}`} key={o.id} className="record-item">
                          <div className="record-item-title">{o.name || 'Unnamed Opportunity'}</div>
                          <div className="record-item-meta">
                            <span className="badge" style={{ backgroundColor: '#F1F5F9', color: BRAND.secondary, padding: '2px 8px', fontSize: '10px' }}>{o.stage || 'NEW'}</span>
                            <span style={{ fontWeight: 600 }}>₹{o.amount?.amountMicros ? (o.amount.amountMicros / 1000000).toLocaleString() : 0}</span>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${BRAND.border}`, textAlign: 'center' }}>
                    <a href="/objects/opportunities" style={{ color: BRAND.accent, fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Go to Opportunities Dashboard &rarr;</a>
                  </div>
                </div>

                {/* Leads Card */}
                <div className="data-card" style={{ maxHeight: '350px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: BRAND.purple }}>👤</span> Associated Leads
                    </h3>
                    <span className="badge" style={{ backgroundColor: '#F3E8FF', color: BRAND.purple }}>{data.leads.length}</span>
                  </div>
                  <div className="scrollable-content">
                    {data.leads.length === 0 ? (
                      <div style={{ fontSize: '14px', color: BRAND.text, fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No leads recorded.</div>
                    ) : (
                      data.leads.map((l: any) => (
                        <a href={`/object/leads/${l.id}`} key={l.id} className="record-item">
                          <div className="record-item-title">{l.name || 'Unnamed Lead'}</div>
                          <div className="record-item-meta">
                            <span>Status: {l.status || 'NEW'}</span>
                            <span>Source: <strong>{l.source || 'UNKNOWN'}</strong></span>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${BRAND.border}`, textAlign: 'center' }}>
                    <a href="/objects/leads" style={{ color: BRAND.accent, fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Go to Leads Dashboard &rarr;</a>
                  </div>
                </div>

                {/* Shipments Card */}
                <div className="data-card" style={{ maxHeight: '350px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: BRAND.green }}>🚢</span> Active Shipments
                    </h3>
                    <span className="badge" style={{ backgroundColor: '#ECFDF5', color: BRAND.green }}>{data.shipments.length}</span>
                  </div>
                  <div className="scrollable-content">
                    {data.shipments.length === 0 ? (
                      <div style={{ fontSize: '14px', color: BRAND.text, fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No shipments recorded.</div>
                    ) : (
                      data.shipments.map((s: any) => (
                        <a href={`/object/exportShipments/${s.id}`} key={s.id} className="record-item">
                          <div className="record-item-title">{s.invoiceNumber || 'Pending Invoice'}</div>
                          <div className="record-item-meta">
                            <span>Status: <strong style={{ color: BRAND.green }}>{s.status || 'BOOKED'}</strong></span>
                            <span>{s.destinationPort || 'TBD'}</span>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${BRAND.border}`, textAlign: 'center' }}>
                    <a href="/objects/exportShipments" style={{ color: BRAND.accent, fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Go to Shipments Dashboard &rarr;</a>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: COMPANY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Company Dashboard',
  component: CompanyDashboard,
});
