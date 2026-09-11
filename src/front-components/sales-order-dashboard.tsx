import { defineFrontComponent } from 'twenty-sdk/define';
import { useUserId } from 'twenty-sdk/front-component';
import React, { useEffect, useState } from 'react';

// --- Inlined role-gate ---
type UserRole = 'hod' | 'manager' | 'associate';

const ROLE_API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

const useUserRole = (): UserRole | null => {
  const rawUserId = useUserId();
  const [role, setRole] = React.useState<UserRole | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://minimines.twenty.com/rest/workspaceMembers?limit=100',
          { headers: { Authorization: ROLE_API_KEY, 'Content-Type': 'application/json' } },
        );
        const json = await res.json();
        let items = json?.data?.workspaceMembers ?? json?.data ?? [];
        if (items?.edges) items = items.edges.map((e: any) => e.node);
        const me = (Array.isArray(items) ? items : []).find(
          (m: any) => m.userId === rawUserId || m.id === rawUserId,
        );
        if (!me) { setRole('hod'); return; }
        const t = (me.jobTitle || '').toLowerCase();
        if (t.includes('associate') || t.includes('intern')) setRole('associate');
        else if (t.includes('executive') || t.includes('manager')) setRole('manager');
        else setRole('hod');
      } catch { setRole('hod'); }
    })();
  }, [rawUserId]);
  return role;
};

const AccessDenied = ({ minRole = 'manager' }: { minRole?: 'hod' | 'manager' }) => (
  <div style={{ padding: '60px 40px', textAlign: 'center' as const, fontFamily: "'Barlow', sans-serif", display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 600, color: '#001B2E', marginBottom: '8px' }}>Access Restricted</div>
    <div style={{ fontSize: '14px', color: '#7A7A7A', maxWidth: '400px', lineHeight: 1.5 }}>
      {minRole === 'hod' ? 'This dashboard is available to the Head of Department only.' : 'This dashboard is available to Managers and HODs only.'}
    </div>
  </div>
);

const RoleLoading = () => (
  <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", color: '#7A7A7A' }}>Loading...</div>
);
// --- End role-gate ---

const BRAND = {
  primary: '#001B2E',
  secondary: '#294C60',
  accent: '#FFC857',
  text: '#1F2937',
  bg: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB',
  green: '#10B981',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  red: '#EF4444'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;

export type UserRole = 'hod' | 'manager' | 'associate';

const API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';

export const useUserRole = (): UserRole | null => {
  const rawUserId = useUserId();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://minimines.twenty.com/rest/workspaceMembers?limit=100',
          { headers: { Authorization: API_KEY, 'Content-Type': 'application/json' } },
        );
        const json = await res.json();
        let items = json?.data?.workspaceMembers ?? json?.data ?? [];
        if (items?.edges) items = items.edges.map((e: any) => e.node);
        const me = (Array.isArray(items) ? items : []).find(
          (m: any) => m.userId === rawUserId || m.id === rawUserId,
        );
        if (!me) {
          setRole('hod');
          return;
        }
        const t = (me.jobTitle || '').toLowerCase();
        if (t.includes('associate') || t.includes('intern')) setRole('associate');
        else if (t.includes('executive') || t.includes('manager')) setRole('manager');
        else setRole('hod');
      } catch {
        setRole('hod');
      }
    })();
  }, [rawUserId]);

  return role;
};

export const AccessDenied = ({
  minRole = 'manager',
}: {
  minRole?: 'hod' | 'manager';
}) => (
  <div
    style={{
      padding: '60px 40px',
      textAlign: 'center' as const,
      fontFamily: "'Barlow', sans-serif",
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
    }}
  >
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </div>
    <div style={{ fontSize: '20px', fontWeight: 600, color: '#001B2E', marginBottom: '8px' }}>
      Access Restricted
    </div>
    <div style={{ fontSize: '14px', color: '#7A7A7A', maxWidth: '400px', lineHeight: 1.5 }}>
      {minRole === 'hod'
        ? 'This dashboard is available to the Head of Department only.'
        : 'This dashboard is available to Managers and HODs only.'}
    </div>
  </div>
);

export const RoleLoading = () => (
  <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", color: '#7A7A7A' }}>
    Loading...
  </div>
);

600;700&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@300;400;600&display=swap');
`;

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `https://minimines.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';
  
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
    const key = path.split('?')[0]; // Extract base path e.g. leads
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

const SalesOrderDashboard = () => {
  const userRole = useUserRole();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTwenty('salesOrders?limit=100');
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateShipment = async (order: any) => {
    setIsUpdating(true);
    try {
      // 1. Create Export Shipment
      const shipment = await fetchTwenty('exportShipments', 'POST', {
        name: `Shipment for ${order.name || 'Order'}`,
        salesOrderId: order.id,
        qaStatus: 'PENDING',
        documentationStatus: 'INCOMPLETE'
      });

      // 2. Update Sales Order status
      await fetchTwenty(`salesOrders/${order.id}`, 'PATCH', {
        fulfillmentStatus: 'PROCESSING'
      });

      let shipmentId = shipment?.data?.id || shipment?.id || shipment?.data?.createExportShipment?.id;

      setSuccessMsg(
        <span>
          Shipment Created! <a href={`/object/exportShipment/${shipmentId}`} target="_parent" style={{ color: '#065F46', fontWeight: 'bold', textDecoration: 'underline' }}>View Shipment</a>
        </span>
      );
      await loadData();
    } catch (e) {
      console.error("Failed to create shipment", e);
    } finally {
      setIsUpdating(false);
    }
  };

  if (userRole === null) return <RoleLoading />;

  if (loading && orders.length === 0) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading Confirmed Orders...</div>;
  }

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              Confirmed Sales Orders
            </h1>
            <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '16px', color: BRAND.text }}>
              Finalized orders generated from won BD opportunities. Ready for fulfillment & logistics.
            </div>
          </div>

          {successMsg && (
            <div style={{ padding: '16px', backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #10B981', borderRadius: '4px', marginBottom: '24px' }}>
              {successMsg}
            </div>
          )}

          <div style={{ backgroundColor: BRAND.white, borderRadius: '8px', border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', backgroundColor: BRAND.primary, color: BRAND.white, fontWeight: 600 }}>
              <div>Order ID</div>
              <div>Name</div>
              <div>Qty (MT)</div>
              <div>Linked Opp ID</div>
              <div>Fulfillment Status</div>
              <div>Shipment</div>
            </div>
            
            {orders.map(order => (
              <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', borderBottom: `1px solid ${BRAND.border}`, alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: BRAND.secondary, fontFamily: 'monospace' }}>
                  {order.id.slice(0, 8)}...
                </div>
                <div style={{ fontWeight: 600, color: BRAND.text }}>
                  {order.name || 'Unnamed Order'}
                </div>
                <div style={{ color: BRAND.text }}>
                  {order.quantity || 0} MT
                </div>
                <div style={{ fontSize: '12px', color: BRAND.blue, textDecoration: 'underline' }}>
                  {order.linkedOpportunityId ? (
                    <a href={`/object/bdOpportunity/${order.linkedOpportunityId}`} target="_parent" style={{ color: 'inherit' }}>
                      {order.linkedOpportunityId.slice(0,8) + '...'}
                    </a>
                  ) : 'Direct Order'}
                </div>
                <div>
                  <span style={{ 
                    backgroundColor: order.fulfillmentStatus === 'PENDING' ? `${BRAND.yellow}20` : `${BRAND.green}20`,
                    color: order.fulfillmentStatus === 'PENDING' ? BRAND.yellow : BRAND.green,
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                  }}>
                    {order.fulfillmentStatus || 'PENDING'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleCreateShipment(order)}
                    disabled={isUpdating}
                    style={{
                      backgroundColor: BRAND.primary, color: BRAND.white, border: 'none', 
                      padding: '8px 12px', borderRadius: '4px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600, transition: '0.2s'
                    }}
                  >
                    To Shipment
                  </button>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: BRAND.secondary }}>
                No active sales orders. Convert a WON opportunity to see it here.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: '22192d04-e682-4a94-afd3-1508a7d8bdb0',
  name: 'Sales Order Dashboard',
  description: 'View for confirmed deals transferred from BD',
  component: SalesOrderDashboard,
});
