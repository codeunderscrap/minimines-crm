import { defineFrontComponent } from 'twenty-sdk/define';
import { useState } from 'react';

// Icons using SVG for maximum customizability and zero external dependencies
const IconContracts = ({ color = '#fff' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconShipments = ({ color = '#fff' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const IconTrending = ({ color = '#fff' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconSales = ({ color = '#fff' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const StatCard = ({ title, value, subtitle, trend, icon: Icon, color1, color2 }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 24px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '150px',
          height: '150px',
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
          filter: 'blur(50px)',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ 
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
          padding: '12px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <Icon />
        </div>
        {trend && (
          <div style={{ 
            background: 'rgba(46, 213, 115, 0.15)',
            color: '#2ed573',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            {trend}
          </div>
        )}
      </div>

      <div style={{ zIndex: 1, marginTop: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.5px' }}>{title}</h3>
        <div style={{ margin: '8px 0 0 0', fontSize: '32px', color: '#ffffff', fontWeight: 700, fontFamily: '"Outfit", "Inter", sans-serif' }}>
          {value}
        </div>
        <div style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

const ActivityRow = ({ status, id, description, date, color }: any) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background 0.2s ease',
    cursor: 'pointer',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
  >
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: color,
      marginRight: '16px',
      boxShadow: `0 0 10px ${color}`
    }} />
    <div style={{ flex: 1 }}>
      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{id}</div>
      <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>{description}</div>
    </div>
    <div style={{ color: color, fontSize: '12px', fontWeight: 600, padding: '4px 12px', background: `${color}15`, borderRadius: '12px', marginRight: '16px' }}>
      {status}
    </div>
    <div style={{ color: '#64748b', fontSize: '13px' }}>{date}</div>
  </div>
);

const MainPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '40px 48px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '42px', 
              fontWeight: 800, 
              background: 'linear-gradient(to right, #ffffff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Outfit", "Inter", sans-serif',
              letterSpacing: '-1px'
            }}>
              MiniMines BD CRM
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '16px', fontWeight: 400 }}>
              Welcome back. Here's what's happening with your contracts and logistics today.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              View Reports
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s',
            }}>
              + New Contract
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <StatCard 
            title="ACTIVE CONTRACTS" 
            value="24" 
            subtitle="4 awaiting renewal"
            trend="+12%"
            icon={IconContracts}
            color1="#3b82f6"
            color2="#8b5cf6"
          />
          <StatCard 
            title="LME ALUMINIUM (LME)" 
            value="$2,450.50" 
            subtitle="Updated 2 hours ago"
            trend="+1.2%"
            icon={IconTrending}
            color1="#10b981"
            color2="#059669"
          />
          <StatCard 
            title="PENDING SALES ORDERS" 
            value="14" 
            subtitle="Requires fulfillment"
            icon={IconSales}
            color1="#f59e0b"
            color2="#d97706"
          />
          <StatCard 
            title="ACTIVE SHIPMENTS" 
            value="8" 
            subtitle="In transit / Customs"
            icon={IconShipments}
            color1="#ec4899"
            color2="#e11d48"
          />
        </div>

        {/* Bottom Section: Tables/Widgets */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          
          {/* Recent Activity Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 600 }}>Recent Shipments & Orders</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <ActivityRow id="EXP-2024-089" description="Shipment to Rotterdam Port" status="IN TRANSIT" date="2 hours ago" color="#3b82f6" />
              <ActivityRow id="SO-2024-142" description="Sales Order: Aluminium Billets 500MT" status="PENDING" date="5 hours ago" color="#f59e0b" />
              <ActivityRow id="CTR-2024-004" description="Annual Supply Contract - TechCorp" status="ACTIVE" date="1 day ago" color="#10b981" />
              <ActivityRow id="EXP-2024-088" description="Shipment to Jebel Ali" status="CUSTOMS CLEARANCE" date="2 days ago" color="#ec4899" />
            </div>
          </div>

          {/* Quick Info Panel */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '20px',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 600 }}>System Status</h2>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>LME Feed Sync</span>
                <span style={{ color: '#2ed573', fontSize: '13px', fontWeight: 600 }}>Connected</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: '100%', height: '100%', background: '#2ed573', borderRadius: '2px', boxShadow: '0 0 10px #2ed573' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Contracts Capacity</span>
                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>75%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ width: '75%', height: '100%', background: '#3b82f6', borderRadius: '2px', boxShadow: '0 0 10px #3b82f6' }}></div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                This is your custom CMS dashboard tailored for MiniMines Business Development. You can click on the side menu items to manage underlying entities.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

import {
  APP_DISPLAY_NAME,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: APP_DISPLAY_NAME,
  description: 'MiniMines Custom CRM Dashboard',
  component: MainPage,
});
