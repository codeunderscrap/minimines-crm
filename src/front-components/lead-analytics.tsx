import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#3B6E93',
  bg: '#F5F9FC',
  white: '#FFFFFF',
  border: '#E2E8F0',
  blue: '#005F9E',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');
`;

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';
  
  try {
    const opts: any = {
      method,
      headers: { 
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    };
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(url, opts);
    const json = await res.json();
    
    if (method !== 'GET') return json;

    if (json.data && Array.isArray(json.data)) {
      return json.data;
    }
    const key = path.split('?')[0]; 
    let items = json.data && json.data[key] ? json.data[key] : [];
    if (items && items.edges) {
      items = items.edges.map((e: any) => e.node);
    }
    return Array.isArray(items) ? items : (json.data?.edges?.map((e: any) => e.node) || json.data || []);
  } catch (error) {
    console.error('fetchTwenty Error:', error);
    return [];
  }
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div style={{
    backgroundColor: BRAND.white,
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${BRAND.border}`,
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      backgroundColor: `${color}15`, color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: BRAND.secondary, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </div>
      <div style={{ color: BRAND.primary, fontSize: '28px', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
        {value}
      </div>
    </div>
  </div>
);

const LeadAnalytics = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await fetchTwenty('leads?limit=500');
      setLeads(data);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Crunching Lead Data...</div>;

  const totalLeads = leads.length;
  const converted = leads.filter(l => l.convertedToOpportunityId).length;
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;
  
  const sources = leads.reduce((acc, lead) => {
    const src = lead.source || 'UNKNOWN';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statuses = leads.reduce((acc, lead) => {
    const st = lead.status || 'NEW';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#005F9E', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  let currentAngle = 0;
  const sourceChart = Object.entries(sources).map(([src, count], index) => {
    const percentage = (count as number) / totalLeads;
    const angle = percentage * 360;
    const color = COLORS[index % COLORS.length];
    
    const x1 = Math.cos((currentAngle * Math.PI) / 180) * 100;
    const y1 = Math.sin((currentAngle * Math.PI) / 180) * 100;
    currentAngle += angle;
    const x2 = Math.cos((currentAngle * Math.PI) / 180) * 100;
    const y2 = Math.sin((currentAngle * Math.PI) / 180) * 100;
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      src, count, color, percentage,
      path: `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`
    };
  });

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '36px', color: BRAND.primary, marginBottom: '8px', textTransform: 'uppercase' }}>
              Lead Analytics Dashboard
            </h1>
            <div style={{ color: BRAND.secondary }}>
              Comprehensive breakdown of lead sources, statuses, and BD conversions.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard title="Total Leads (All Time)" value={totalLeads} icon="📊" color={BRAND.blue} />
            <StatCard title="Converted to Opp" value={converted} icon="🎯" color={BRAND.green} />
            <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon="🚀" color={BRAND.yellow} />
            <StatCard title="Active Follow-ups" value={leads.filter(l => l.followUpStatus && l.followUpStatus !== 'NONE').length} icon="📞" color={BRAND.red} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div style={{ backgroundColor: BRAND.white, padding: '32px', borderRadius: '12px', border: `1px solid ${BRAND.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', color: BRAND.primary, marginTop: 0, marginBottom: '32px', alignSelf: 'flex-start' }}>Lead Sources</h2>
              
              <div style={{ display: 'flex', gap: '48px', alignItems: 'center', width: '100%' }}>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  <svg viewBox="-100 -100 200 200" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {sourceChart.map((s, i) => (
                      <path key={i} d={s.path} fill={s.color} stroke="#FFFFFF" strokeWidth="2" />
                    ))}
                    <circle cx="0" cy="0" r="60" fill={BRAND.white} />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: BRAND.primary, fontFamily: "'Barlow Condensed', sans-serif" }}>{totalLeads}</div>
                    <div style={{ fontSize: '12px', color: BRAND.secondary, fontWeight: 600 }}>Total Leads</div>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  {sourceChart.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: s.color }} />
                        <span style={{ fontWeight: 500, fontSize: '14px', color: BRAND.primary }}>{s.src}</span>
                      </div>
                      <div style={{ fontWeight: 600, color: BRAND.secondary }}>
                        {s.count} <span style={{ opacity: 0.5, fontSize: '12px', marginLeft: '4px' }}>({Math.round(s.percentage * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: BRAND.white, padding: '32px', borderRadius: '12px', border: `1px solid ${BRAND.border}` }}>
              <h2 style={{ fontSize: '20px', color: BRAND.primary, marginTop: 0, marginBottom: '32px' }}>Lead Status Funnel</h2>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', borderBottom: `1px solid ${BRAND.border}`, paddingBottom: '16px', marginBottom: '16px' }}>
                {Object.entries(statuses).map(([st, count], index) => {
                  const height = (`${((count as number) / totalLeads) * 100}%`);
                  return (
                    <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', gap: '8px' }}>
                      <div style={{ fontWeight: 600, color: BRAND.secondary, fontSize: '14px' }}>{count as number}</div>
                      <div style={{ 
                        width: '100%', 
                        height: height, 
                        minHeight: '4px',
                        backgroundColor: COLORS[index % COLORS.length], 
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease-out'
                      }} />
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.entries(statuses).map(([st], index) => (
                  <div key={st} style={{ fontSize: '12px', fontWeight: 600, color: BRAND.primary, textAlign: 'center', width: '60px' }}>
                    {st}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Lead Analytics',
  description: 'Analytics for Lead Conversion',
  component: LeadAnalytics,
});
