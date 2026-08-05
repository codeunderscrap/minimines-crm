import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

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
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJmOWVmNmViLTk5M2UtNDMyNi1iNzU1LTU0Zjk2ZmFkNmJhMCJ9.eyJzdWIiOiIyYjI0MDBhNy0xMTUxLTQ0YjMtYmU2Mi00MmIyZDg4ZjM4MmQiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiMmIyNDAwYTctMTE1MS00NGIzLWJlNjItNDJiMmQ4OGYzODJkIiwiaWF0IjoxNzg1OTA2OTQ3LCJleHAiOjQ5Mzk1MDY5NDYsImp0aSI6IjE0ZGMwN2RjLTFkYjYtNDA4Ny1hYjBmLTYyODZjZGRmZWZiZCJ9.V7DVW5gPycqPKvA9FjE6nclpS3EbUkFEY22f_xX22H6Be71zZd3HpilWY6KOAlTIQh6UXLHw-H4zZaFW0I_qWw';
  
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
                <div>
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
  universalIdentifier: SALES_ORDER_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Sales Order Dashboard',
  description: 'View for confirmed deals transferred from BD',
  component: SalesOrderDashboard,
});

