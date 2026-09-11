import { useUserId } from 'twenty-sdk/front-component';
import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  green: '#2E8B57',
  red: '#D32F2F',
  orange: '#F57C00',
  gray: '#9E9E9E'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Roboto+Slab:wght@400&family=Barlow:wght@400;

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

500;600&display=swap');
  
  .product-dashboard {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background: ${BRAND.white};
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 27, 46, 0.04);
    border: 1px solid ${BRAND.border};
  }

  .h2 {
    font-family: 'Barlow Condensed', sans-serif;
    color: ${BRAND.primary};
    text-transform: uppercase;
    font-size: 24px;
    margin: 0 0 16px 0;
  }
`;

const API_URL = 'https://minimines.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg',
  'Content-Type': 'application/json',
};

const fetchList = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const fetchOne = async (path: string, key: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    return json?.data?.[key] ?? null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

const ProductDashboard = () => {
  const userRole = useUserRole();
  const recordId = useRecordId();
  const [recordProduct, setRecordProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (recordId) {
        setRecordProduct(await fetchOne(`products/${recordId}`, 'product'));
      } else {
        const items = await fetchList('products?limit=100');
        setAllProducts(items);
        if (items.length > 0) setSelectedId(items[0].id);
      }
      setLoading(false);
    };
    loadData();
  }, [recordId]);

  if (!recordId && userRole === null) return <RoleLoading />;
  if (!recordId && userRole === 'associate') return <AccessDenied minRole="manager" />;

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading product specifications...</div>;
  }

  if (!recordId && allProducts.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", color: BRAND.text }}>No products found.</div>;
  }

  const product = recordId ? recordProduct : (allProducts.find(p => p.id === selectedId) || null);

  if (!product) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Could not load product details.</div>;
  }

  return (
    <>
      <style>{FONTS}</style>
      <div className="product-dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <h2 className="h2" style={{ margin: 0 }}>Product Specifications</h2>
          {!recordId && allProducts.length > 0 && (
            <select
              value={selectedId || ''}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
            >
              {allProducts.map(p => <option key={p.id} value={p.id}>{p.materialName || p.sku || `Product ${(p.id || '').substring(0, 6)}`}</option>)}
            </select>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Material SKU</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: BRAND.primary }}>{product.sku || 'N/A'}</div>
           </div>
           
           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Category</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: BRAND.primary }}>{(product.category || 'N/A').replace('_', ' ')}</div>
           </div>

           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}`, gridColumn: 'span 2' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Base Composition</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: BRAND.secondary, marginTop: '8px' }}>
                {product.baseComposition || 'No composition specified.'}
              </div>
           </div>

           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}`, gridColumn: 'span 2' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Pricing Strategy</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: BRAND.secondary, marginTop: '8px' }}>
                {product.targetLmeLinkage 
                  ? `Linked to: ${product.targetLmeLinkage}` 
                  : 'Fixed domestic pricing model (No LME linkage).'}
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: '5d2183d3-4eea-4228-bdcd-68859871c430',
  name: 'Product Master Dashboard',
  component: ProductDashboard,
});


// cache-bust: 1786104341237