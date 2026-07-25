import React, { useState, useEffect } from 'react';
import { useUserId } from 'twenty-sdk/front-component';

export type UserRole = 'hod' | 'manager' | 'associate';

const API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgwNGZmMTA2LWM2YjQtNDUwZC04OThjLWYxZDUxMDc5MTNmMyJ9.eyJzdWIiOiI5NzljY2YxMy04ZDU2LTRjNjEtOTk5Ni0wMjE4MjY5MTI1ZGQiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiOTc5Y2NmMTMtOGQ1Ni00YzYxLTk5OTYtMDIxODI2OTEyNWRkIiwiaWF0IjoxNzg0OTY2NDAwLCJleHAiOjQ5Mzg1NjYzOTksImp0aSI6ImU1NzY4YTIyLWViODctNDc3MC04M2ZlLThhOGU3MjA4Y2VjMyJ9.3SnTbSOioIatsslSwMoWs1yVqGfL71Vw8QeyuPN8zUH9fVj9thl5Ohx3KyKngZG9_SPA0O0qJz2HZ4QAjaFzow';

export const useUserRole = (): UserRole | null => {
  const rawUserId = useUserId();
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://api.twenty.com/rest/workspaceMembers?limit=100',
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
