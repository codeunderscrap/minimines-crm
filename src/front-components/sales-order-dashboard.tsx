import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

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
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@300;400;600&display=swap');
`;

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  try {
    const opts: any = {
      method,
      headers: { 
        'Authorization': `Bearer ${(window as any).TWENTY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(`/rest/${path}`, opts);
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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTwenty('salesOrders?limit=100');
    let items = data.data && data.data.salesOrders ? data.data.salesOrders : [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    if (!Array.isArray(items)) items = data.data?.edges?.map((e: any) => e.node) || data.data || [];
    setOrders(items);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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

          <div style={{ backgroundColor: BRAND.white, borderRadius: '8px', border: `1px solid ${BRAND.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', backgroundColor: BRAND.primary, color: BRAND.white, fontWeight: 600 }}>
              <div>Order ID</div>
              <div>Name</div>
              <div>Qty (MT)</div>
              <div>Linked Opp ID</div>
              <div>Fulfillment Status</div>
            </div>
            
            {orders.map(order => (
              <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '16px', padding: '16px 24px', borderBottom: `1px solid ${BRAND.border}`, alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: BRAND.secondary, fontFamily: 'monospace' }}>
                  {order.id.slice(0, 8)}...
                </div>
                <div style={{ fontWeight: 600, color: BRAND.text }}>
                  {order.name || 'Unnamed Order'}
                </div>
                <div style={{ color: BRAND.text }}>
                  {order.quantity || 0} MT
                </div>
                <div style={{ fontSize: '12px', color: BRAND.blue, textDecoration: 'underline', cursor: 'pointer' }}>
                  {order.linkedOpportunityId ? order.linkedOpportunityId.slice(0,8) + '...' : 'Direct Order'}
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
  universalIdentifier: SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Sales Order Dashboard',
  description: 'View for confirmed deals transferred from BD',
  component: SalesOrderDashboard,
});
