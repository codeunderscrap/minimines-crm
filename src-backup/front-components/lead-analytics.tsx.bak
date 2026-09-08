import React, { useEffect, useState, useMemo } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserId } from 'twenty-sdk/front-component';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

const BRAND = {
  primary: '#001B2E',
  secondary: '#3B6E93',
  bg: '#F5F9FC',
  white: '#FFFFFF',
  border: '#E2E8F0',
  blue: '#005F9E',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  text: '#475569'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
  
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 27, 46, 0.05), 0 8px 10px -6px rgba(0, 27, 46, 0.01);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .glass-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 27, 46, 0.08), 0 10px 10px -5px rgba(0, 27, 46, 0.02);
  }
  
  .trend-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw 2s ease-out forwards;
  }
  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }
`;

const API_KEY = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

const fetchTwenty = async (path: string) => {
  const url = `https://minimines.twenty.com/rest/${path}`;
  try {
    const res = await fetch(url, { headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' } });
    const json = await res.json();
    const key = path.split('?')[0]; 
    let items = json.data && json.data[key] ? json.data[key] : [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : (json.data?.edges?.map((e: any) => e.node) || json.data || []);
  } catch {
    return [];
  }
};

const fetchGraphQL = async (query: string) => {
  try {
    const res = await fetch('https://minimines.twenty.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const json = await res.json();
    return json?.data;
  } catch {
    return null;
  }
};

const relationId = (record: any, name: string): string | null => {
  const nested = record?.[name];
  if (nested && typeof nested === 'object' && nested.id) return nested.id;
  if (typeof nested === 'string') return nested;
  return record?.[`${name}Id`] ?? null;
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
    <div style={{
      width: '56px', height: '56px', borderRadius: '16px',
      background: `linear-gradient(135deg, ${color}20, ${color}40)`,
      color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '28px', border: `1px solid ${color}30`
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: BRAND.secondary, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ color: BRAND.primary, fontSize: '32px', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
        {value}
      </div>
    </div>
  </div>
);

const LeadAnalytics = () => {
  const userRole = useUserRole();
  const currentUserId = useUserId();

  const [leads, setLeads] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [workedbyOptions, setWorkedbyOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState<string>('All');
  const [filterAssociate, setFilterAssociate] = useState<string>('All');
  const [filterMaterial, setFilterMaterial] = useState<string>('All');

  useEffect(() => {
    const init = async () => {
      const schemaQuery = `{ __type(name: "LeadWorkedbyEnum") { enumValues { name } } }`;
      const [leadData, memberData, schema] = await Promise.all([
        fetchTwenty('leads?limit=1000'),
        fetchTwenty('workspaceMembers?limit=100'),
        fetchGraphQL(schemaQuery)
      ]);
      setLeads(leadData);
      setMembers(memberData);
      setWorkedbyOptions(schema?.__type?.enumValues?.map((e: any) => e.name) || []);
      setLoading(false);
    };
    init();
  }, []);

  const visibleLeads = useMemo(() => {
    let filtered = leads;
    
    // 1. Soft RLS Security
    if (userRole === 'manager') {
      filtered = filtered.filter(l =>
        relationId(l, 'assignedManagerPrimary') === currentUserId ||
        relationId(l, 'assignedManagerSecondary') === currentUserId
      );
    } else if (userRole === 'associate') {
      const me = members.find(m => m.id === currentUserId || m.userId === currentUserId);
      if (me) {
        // Find associate name in workedbyOptions matching first name loosely, or check relation
        filtered = filtered.filter(l => 
          relationId(l, 'assignedAssociate') === currentUserId ||
          (me.name && l.associateName && l.associateName.toLowerCase().includes(me.name.firstName?.toLowerCase()))
        );
      }
    }

    // 2. Date Filter
    if (dateRange !== 'All') {
      const now = new Date();
      let threshold = new Date(0);
      if (dateRange === '7D') threshold = new Date(now.setDate(now.getDate() - 7));
      if (dateRange === '30D') threshold = new Date(now.setDate(now.getDate() - 30));
      if (dateRange === 'ThisMonth') threshold = new Date(now.getFullYear(), now.getMonth(), 1);
      
      filtered = filtered.filter(l => new Date(l.createdAt) >= threshold);
    }

    // 3. Associate Filter
    if (filterAssociate !== 'All') {
      filtered = filtered.filter(l => l.workedby === filterAssociate || l.associateName === filterAssociate);
    }

    // 4. Material Filter
    if (filterMaterial !== 'All') {
      filtered = filtered.filter(l => l.material === filterMaterial);
    }

    return filtered;
  }, [leads, members, userRole, currentUserId, dateRange, filterAssociate, filterMaterial]);

  // Trend Chart Data (Last 6 Months)
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months[d.toLocaleString('default', { month: 'short' })] = 0;
    }
    visibleLeads.forEach(l => {
      const d = new Date(l.createdAt);
      const m = d.toLocaleString('default', { month: 'short' });
      if (months[m] !== undefined) months[m]++;
    });
    return Object.entries(months).map(([label, value]) => ({ label, value }));
  }, [visibleLeads]);

  if (userRole === null) return <RoleLoading />;
  if (loading) return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Aggregating Live Lead Data...</div>;

  const totalLeads = visibleLeads.length;
  const converted = visibleLeads.filter(l => l.convertedToOpportunityId).length;
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;
  
  // Aggregate Source Data
  const sources = visibleLeads.reduce((acc, lead) => {
    const src = lead.source || 'UNKNOWN';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Aggregate Status Data
  const statuses = visibleLeads.reduce((acc, lead) => {
    const st = lead.status || 'NEW';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxTrend = Math.max(1, ...monthlyData.map(d => d.value));
  const trendPoints = monthlyData.map((d, i) => {
    const x = (i / 5) * 400 + 40; // width=400, padding=40
    const y = 160 - (d.value / maxTrend) * 120; // height=160, padding=40
    return `${x},${y}`;
  }).join(' L ');

  const COLORS = [BRAND.blue, BRAND.green, BRAND.yellow, BRAND.red, BRAND.purple];
  let currentAngle = 0;
  const sourceChart = Object.entries(sources).map(([src, count], index) => {
    const percentage = (count as number) / (totalLeads || 1);
    const angle = percentage * 360;
    const color = COLORS[index % COLORS.length];
    
    const x1 = Math.cos((currentAngle * Math.PI) / 180) * 100;
    const y1 = Math.sin((currentAngle * Math.PI) / 180) * 100;
    currentAngle += angle;
    // Handle full circle
    if (angle === 360) {
      return { src, count: count as number, color, percentage, path: `M 100 0 A 100 100 0 1 1 99.9 0 Z` };
    }
    const x2 = Math.cos((currentAngle * Math.PI) / 180) * 100;
    const y2 = Math.sin((currentAngle * Math.PI) / 180) * 100;
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      src, count: count as number, color, percentage,
      path: `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`
    };
  });

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ padding: '40px', fontFamily: "'Inter', sans-serif", backgroundColor: BRAND.bg, minHeight: '100vh', color: BRAND.primary }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: `2px solid ${BRAND.border}`, paddingBottom: '24px' }}>
            <div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '40px', color: BRAND.primary, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Lead Analytics Dashboard
              </h1>
              <div style={{ color: BRAND.secondary, fontSize: '15px' }}>
                Advanced insights into acquisition channels, conversions, and team performance.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${BRAND.border}`, backgroundColor: '#fff', fontSize: '14px', fontWeight: 500, outline: 'none' }}>
                <option value="All">All Time</option>
                <option value="ThisMonth">This Month</option>
                <option value="30D">Last 30 Days</option>
                <option value="7D">Last 7 Days</option>
              </select>

              {(userRole === 'hod' || userRole === 'manager') && (
                <select value={filterAssociate} onChange={e => setFilterAssociate(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${BRAND.border}`, backgroundColor: '#fff', fontSize: '14px', fontWeight: 500, outline: 'none' }}>
                  <option value="All">All Associates</option>
                  {workedbyOptions.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
                </select>
              )}

              <select value={filterMaterial} onChange={e => setFilterMaterial(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${BRAND.border}`, backgroundColor: '#fff', fontSize: '14px', fontWeight: 500, outline: 'none' }}>
                <option value="All">All Materials</option>
                <option value="HEAVY_TRUCK_SWAP">Heavy Truck Swap</option>
                <option value="MULTI_OEM_EV">Multi OEM EV</option>
                <option value="TWO_W_LFP">2W Packs LFP</option>
                <option value="LI_ION_BATTERIES">Li-Ion</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
            <StatCard title="Total Leads (Filtered)" value={totalLeads} icon="🌍" color={BRAND.blue} />
            <StatCard title="Converted to Opp" value={converted} icon="🎯" color={BRAND.green} />
            <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon="🚀" color={BRAND.yellow} />
            <StatCard title="Active Follow-ups" value={visibleLeads.filter(l => l.followUpStatus && l.followUpStatus !== 'NONE').length} icon="📞" color={BRAND.red} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            
            {/* Trend Chart */}
            <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: BRAND.primary, margin: 0, fontWeight: 600 }}>Lead Acquisition Trend (6 Months)</h2>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <svg viewBox="0 0 480 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BRAND.blue} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={BRAND.blue} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="40" y1={40 + (i * 40)} x2="440" y2={40 + (i * 40)} stroke={BRAND.border} strokeDasharray="4 4" />
                  ))}

                  {/* Area fill */}
                  <path d={`M 40 160 L ${trendPoints} L 440 160 Z`} fill="url(#trendGradient)" />
                  
                  {/* Line */}
                  <path className="trend-line" d={`M ${trendPoints}`} fill="none" stroke={BRAND.blue} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Data points */}
                  {monthlyData.map((d, i) => {
                    const x = (i / 5) * 400 + 40;
                    const y = 160 - (d.value / maxTrend) * 120;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill={BRAND.white} stroke={BRAND.blue} strokeWidth="3" />
                        <text x={x} y={y - 16} textAnchor="middle" fontSize="12" fontWeight="600" fill={BRAND.secondary}>{d.value}</text>
                        <text x={x} y="180" textAnchor="middle" fontSize="13" fontWeight="500" fill={BRAND.text}>{d.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Source Chart */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', color: BRAND.primary, marginTop: 0, marginBottom: '32px', alignSelf: 'flex-start', fontWeight: 600 }}>Lead Sources</h2>
              <div style={{ display: 'flex', gap: '48px', alignItems: 'center', width: '100%' }}>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  {totalLeads > 0 ? (
                    <svg viewBox="-100 -100 200 200" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                      {sourceChart.map((s, i) => (
                        <path key={i} d={s.path} fill={s.color} stroke="#FFFFFF" strokeWidth="2" style={{ transition: 'all 0.3s' }} />
                      ))}
                      <circle cx="0" cy="0" r="65" fill={BRAND.white} />
                    </svg>
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `16px solid ${BRAND.border}` }} />
                  )}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: BRAND.primary, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>{totalLeads}</div>
                    <div style={{ fontSize: '13px', color: BRAND.secondary, fontWeight: 500 }}>Total Leads</div>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  {sourceChart.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', marginBottom: '8px', backgroundColor: `${s.color}08` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: s.color }} />
                        <span style={{ fontWeight: 600, fontSize: '14px', color: BRAND.primary }}>{s.src}</span>
                      </div>
                      <div style={{ fontWeight: 600, color: BRAND.secondary, fontSize: '15px' }}>
                        {s.count} <span style={{ opacity: 0.6, fontSize: '12px', marginLeft: '4px' }}>({Math.round(s.percentage * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Funnel */}
            <div className="glass-card">
              <h2 style={{ fontSize: '20px', color: BRAND.primary, marginTop: 0, marginBottom: '40px', fontWeight: 600 }}>Lead Status Funnel</h2>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', borderBottom: `2px solid ${BRAND.border}`, paddingBottom: '16px', marginBottom: '20px' }}>
                {Object.entries(statuses).map(([st, count], index) => {
                  const height = totalLeads ? (`${((count as number) / totalLeads) * 100}%`) : '0%';
                  return (
                    <div key={st} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px', gap: '12px' }}>
                      <div style={{ fontWeight: 700, color: BRAND.primary, fontSize: '16px', fontFamily: "'Barlow Condensed', sans-serif" }}>{count as number}</div>
                      <div style={{ 
                        width: '100%', 
                        height: height, 
                        minHeight: '6px',
                        backgroundColor: COLORS[index % COLORS.length], 
                        borderRadius: '8px 8px 0 0',
                        transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: `0 4px 10px ${COLORS[index % COLORS.length]}40`
                      }} />
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {Object.entries(statuses).map(([st], index) => (
                  <div key={st} style={{ fontSize: '12px', fontWeight: 600, color: BRAND.secondary, textAlign: 'center', width: '70px', textTransform: 'uppercase' }}>
                    {st.replace(/_/g, ' ')}
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
  description: 'Production-ready interactive analytics for Lead Conversion',
  component: LeadAnalytics,
});

// cache-bust: 1786104341999