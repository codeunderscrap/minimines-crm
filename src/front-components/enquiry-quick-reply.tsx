/**
 * CommunicationsHub — MiniMines CRM
 * ──────────────────────────────────
 * Slack-style 3-column unified inbox for all inbound enquiries.
 * Sources: Website, Email, LinkedIn, Phone, WhatsApp (future).
 *
 * Email reply: Uses Resend API (https://resend.com).
 * ⚠️  Set RESEND_API_KEY and SENDER_EMAIL below before deploying.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

// ─── Config — set your own values ────────────────────────────────────────────
const TWENTY_API_BASE = 'https://api.twenty.com/rest';
const TWENTY_API_KEY =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';

/** ⚠️  Replace with your Resend API key from https://resend.com/api-keys */
const RESEND_API_KEY = 're_REPLACE_WITH_YOUR_RESEND_API_KEY';
/** ⚠️  Replace with the verified sender email on your Resend domain */
const SENDER_EMAIL = 'communications@minimines.com';
const SENDER_NAME = 'MiniMines Team';

const POLL_INTERVAL_MS = 30_000;

// ─── Brand tokens ────────────────────────────────────────────────────────────
const B = {
  sidebar: '#001B2E',
  sidebarHover: '#002d4a',
  sidebarActive: '#003d66',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F5F7FA',
  text: '#7A7A7A',
  textDark: '#1A2E3B',
  textMid: '#54595F',
  green: '#27AE60',
  red: '#E74C3C',
  orange: '#F39C12',
  yellow: '#F1C40F',
  bubble: {
    inbound: '#F0F4F8',
    outbound: '#3B6E93',
    internal: '#FFFBEA',
  },
};

// ─── Source metadata ─────────────────────────────────────────────────────────
const SOURCES: Record<string, { label: string; icon: string; color: string; badgeColor: string }> = {
  ALL: { label: 'All Channels', icon: '💬', color: B.accent, badgeColor: '#E8F4F8' },
  WEBSITE: { label: 'Website', icon: '🌐', color: '#2980B9', badgeColor: '#EBF5FB' },
  EMAIL: { label: 'Email', icon: '📧', color: '#7F8C8D', badgeColor: '#F2F3F4' },
  LINKEDIN: { label: 'LinkedIn', icon: '🔗', color: '#2867B2', badgeColor: '#EAF2FF' },
  PHONE: { label: 'Phone', icon: '📞', color: '#27AE60', badgeColor: '#EAFAF1' },
  WHATSAPP: { label: 'WhatsApp', icon: '📱', color: '#25D366', badgeColor: '#E9FBF0' },
  OTHER: { label: 'Other', icon: '📨', color: '#E67E22', badgeColor: '#FEF9E7' },
};

const STATUSES: Record<string, { label: string; color: string; dot: string }> = {
  ALL: { label: 'All', color: B.accent, dot: B.accent },
  NEW: { label: 'New', color: '#2980B9', dot: '#2980B9' },
  IN_PROGRESS: { label: 'In Progress', color: '#F39C12', dot: '#F39C12' },
  WAITING_REPLY: { label: 'Waiting Reply', color: '#E67E22', dot: '#E67E22' },
  RESOLVED: { label: 'Resolved', color: '#27AE60', dot: '#27AE60' },
  SPAM: { label: 'Spam', color: '#E74C3C', dot: '#E74C3C' },
};

// ─── API helpers ─────────────────────────────────────────────────────────────
const api = async (path: string, method = 'GET', body: any = null) => {
  const opts: RequestInit = {
    method,
    headers: { Authorization: TWENTY_API_KEY, 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${TWENTY_API_BASE}/${path}`, opts);
    const json = await res.json();
    if (method === 'GET') return json?.data?.items ?? json?.data ?? [];
    return json;
  } catch (err) {
    console.error('[CommunicationsHub] API error:', err);
    return method === 'GET' ? [] : null;
  }
};

const sendEmailViaResend = async (
  to: string,
  subject: string,
  html: string,
): Promise<boolean> => {
  if (!RESEND_API_KEY.startsWith('re_') || RESEND_API_KEY === 're_REPLACE_WITH_YOUR_RESEND_API_KEY') {
    console.warn('[CommunicationsHub] Resend API key not configured. Email not sent.');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: [to],
        subject,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
};

// ─── Utility ──────────────────────────────────────────────────────────────────
const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const getEmailPrimary = (emailField: any): string => {
  if (!emailField) return '';
  if (typeof emailField === 'string') return emailField;
  if (emailField.primaryEmail) return emailField.primaryEmail;
  if (Array.isArray(emailField?.emails) && emailField.emails.length > 0)
    return emailField.emails[0].email ?? '';
  return '';
};

// ─── Mock data (shown when Twenty DB is empty) ────────────────────────────────
const MOCK_ENQUIRIES = [
  {
    id: 'mock-1',
    customerName: 'Rajesh Kumar',
    company: 'XYZ Metals Ltd',
    contactEmail: { primaryEmail: 'rajesh@xyzmels.com' },
    source: 'WEBSITE',
    status: 'NEW',
    priority: 'HIGH',
    message: 'I need a quote for 50MT of Copper Wire Scrap. Can you deliver to Mumbai port? We need Grade A quality.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'mock-2',
    customerName: 'Sarah Jenkins',
    company: 'EuroMetals GmbH',
    contactEmail: { primaryEmail: 'sarah.jenkins@eurometals.de' },
    source: 'LINKEDIN',
    status: 'IN_PROGRESS',
    priority: 'NORMAL',
    message: 'Hello! Does MiniMines supply Battery Grade Lithium Carbonate? We are looking for regular monthly shipments.',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'mock-3',
    customerName: 'Ahmed Al-Rashid',
    company: 'Gulf Commodities',
    contactEmail: { primaryEmail: 'ahmed@gulfcommodities.ae' },
    source: 'EMAIL',
    status: 'WAITING_REPLY',
    priority: 'URGENT',
    message: 'Following up on my earlier enquiry about Zinc Ingots. Please advise on current LME pricing and availability.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-4',
    customerName: 'Priya Sharma',
    company: 'Bharati Minerals',
    contactEmail: { primaryEmail: 'priya@bharatiminerals.in' },
    source: 'PHONE',
    status: 'NEW',
    priority: 'NORMAL',
    message: 'Interested in Aluminium Scrap — 100MT monthly. Please share product catalogue and pricing.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const MOCK_MESSAGES: Record<string, any[]> = {
  'mock-1': [
    { id: 'm1-1', direction: 'INBOUND', senderName: 'Rajesh Kumar', senderType: 'CUSTOMER', channel: 'WEBSITE', body: 'I need a quote for 50MT of Copper Wire Scrap. Can you deliver to Mumbai port? We need Grade A quality.', sentAt: new Date(Date.now() - 7200000).toISOString(), isRead: true },
    { id: 'm1-2', direction: 'OUTBOUND', senderName: 'Manish', senderType: 'TEAM_MEMBER', channel: 'EMAIL', body: 'Hello Rajesh! Thank you for reaching out to MiniMines. We can definitely provide Grade A Copper Wire Scrap. Let me prepare a detailed quote for you within 24 hours. Could you please share your port of loading preference?', sentAt: new Date(Date.now() - 5400000).toISOString(), isRead: true },
    { id: 'm1-3', direction: 'INBOUND', senderName: 'Rajesh Kumar', senderType: 'CUSTOMER', channel: 'WEBSITE', body: 'That would be great. What is the current LME price for Copper? We also need FOB Mumbai pricing.', sentAt: new Date(Date.now() - 3600000).toISOString(), isRead: false },
  ],
  'mock-2': [
    { id: 'm2-1', direction: 'INBOUND', senderName: 'Sarah Jenkins', senderType: 'CUSTOMER', channel: 'LINKEDIN', body: 'Hello! Does MiniMines supply Battery Grade Lithium Carbonate? We are looking for regular monthly shipments of 20MT.', sentAt: new Date(Date.now() - 18000000).toISOString(), isRead: true },
    { id: 'm2-2', direction: 'OUTBOUND', senderName: 'Manish', senderType: 'TEAM_MEMBER', channel: 'EMAIL', body: 'Hi Sarah, great to connect! Yes, we do supply Battery Grade Li2CO3 (99.5% min). Could you share your specifications and preferred delivery port? We will send you a formal quotation.', sentAt: new Date(Date.now() - 14400000).toISOString(), isRead: true },
  ],
  'mock-3': [
    { id: 'm3-1', direction: 'INBOUND', senderName: 'Ahmed Al-Rashid', senderType: 'CUSTOMER', channel: 'EMAIL', body: 'Hello, I sent an enquiry 3 days ago regarding Zinc Ingots (LME Grade). Still awaiting your response. Please advise on current availability and pricing.', sentAt: new Date(Date.now() - 86400000).toISOString(), isRead: true },
  ],
  'mock-4': [
    { id: 'm4-1', direction: 'INBOUND', senderName: 'Priya Sharma', senderType: 'CUSTOMER', channel: 'PHONE', body: 'Interested in Aluminium Scrap — 100MT monthly. Please share product catalogue and pricing. Our company imports regularly.', sentAt: new Date(Date.now() - 3600000).toISOString(), isRead: false },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const SourceBadge = ({ source }: { source: string }) => {
  const s = SOURCES[source] ?? SOURCES.OTHER;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 12, backgroundColor: s.badgeColor, color: s.color,
      letterSpacing: '0.3px', whiteSpace: 'nowrap',
    }}>
      {s.icon} {s.label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUSES[status] ?? { label: status, color: B.text, dot: B.text };
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 10px',
      borderRadius: 12, backgroundColor: s.color + '18', color: s.color,
      display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  );
};

const PriorityTag = ({ priority }: { priority?: string }) => {
  if (!priority || priority === 'NORMAL') return null;
  const map: Record<string, string> = { LOW: '#AEB6BF', HIGH: '#E67E22', URGENT: '#E74C3C' };
  const color = map[priority] ?? B.text;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8, backgroundColor: color + '22', color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {priority}
    </span>
  );
};

const Avatar = ({ name, size = 32, color = B.accent }: { name: string; size?: number; color?: string }) => {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', backgroundColor: color,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

const Toast = ({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) => {
  const colors = { success: B.green, error: B.red, info: B.accent };
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: colors[type], color: '#fff', padding: '12px 20px',
      borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500,
      animation: 'slideIn 0.3s ease',
    }}>
      <span style={{ fontWeight: 700 }}>{icons[type]}</span>
      {message}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const CommunicationsHub = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [prevCount, setPrevCount] = useState(0);
  const [useMock, setUseMock] = useState(false);
  const [notifNote, setNotifNote] = useState<boolean>(true);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selected = enquiries.find(e => e.id === selectedId) ?? null;

  // ── Show toast ─────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load enquiries ─────────────────────────────────────────────────────────
  const loadEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const data = await api(`enquiries?orderBy=createdAt,desc&limit=50`);
    const arr: any[] = Array.isArray(data) ? data : [];

    if (arr.length === 0) {
      setUseMock(true);
      setEnquiries(MOCK_ENQUIRIES);
      if (!silent) setLoading(false);
      return;
    }

    setUseMock(false);
    setEnquiries(arr);

    // Notification: new enquiry arrived since last poll
    const newCount = arr.filter(e => e.status === 'NEW').length;
    if (silent && newCount > prevCount) {
      const diff = newCount - prevCount;
      showToast(`🔔 ${diff} new enquiry${diff > 1 ? 's' : ''} arrived!`, 'info');
      if (notifPermission === 'granted') {
        new Notification('MiniMines — New Enquiry', {
          body: `You have ${diff} new communication${diff > 1 ? 's' : ''} waiting.`,
          icon: '💬',
        });
      }
    }
    setPrevCount(newCount);

    if (!silent) setLoading(false);
  }, [prevCount, notifPermission]);

  // ── Load messages for selected enquiry ────────────────────────────────────
  const loadMessages = useCallback(async (enquiryId: string) => {
    setLoadingMsgs(true);

    if (useMock || enquiryId.startsWith('mock')) {
      setTimeout(() => {
        setMessages(MOCK_MESSAGES[enquiryId] ?? []);
        setLoadingMsgs(false);
      }, 300);
      return;
    }

    const data = await api(
      `conversationMessages?filter[enquiry][id][eq]=${enquiryId}&orderBy=sentAt,asc&limit=100`,
    );
    const arr: any[] = Array.isArray(data) ? data : [];

    // If no messages yet, bootstrap with the initial enquiry message as first bubble
    if (arr.length === 0) {
      const enq = enquiries.find(e => e.id === enquiryId);
      if (enq?.message) {
        setMessages([{
          id: `init-${enquiryId}`,
          direction: 'INBOUND',
          senderName: enq.customerName,
          senderType: 'CUSTOMER',
          channel: enq.source,
          body: enq.message,
          sentAt: enq.createdAt,
          isRead: true,
        }]);
      } else {
        setMessages([]);
      }
    } else {
      setMessages(arr);
    }

    setLoadingMsgs(false);
  }, [useMock, enquiries]);

  // ── Initial load + polling ─────────────────────────────────────────────────
  useEffect(() => {
    loadEnquiries();
    // Request browser notification permission once
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => setNotifPermission(p));
    } else if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
    const timer = setInterval(() => loadEnquiries(true), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // ── Load messages when enquiry selected ───────────────────────────────────
  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
    else setMessages([]);
  }, [selectedId]);

  // ── Scroll thread to bottom ────────────────────────────────────────────────
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Send reply ────────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!selected || !replyText.trim()) return;
    setSending(true);

    const now = new Date().toISOString();
    const emailAddr = getEmailPrimary(selected.contactEmail);
    const isMock = selected.id.startsWith('mock');

    // Optimistic UI: add the outbound bubble immediately
    const optimistic = {
      id: `temp-${Date.now()}`,
      direction: 'OUTBOUND',
      senderName: 'You',
      senderType: 'TEAM_MEMBER',
      channel: emailAddr ? 'EMAIL' : selected.source,
      body: replyText.trim(),
      sentAt: now,
      isRead: true,
    };
    setMessages(prev => [...prev, optimistic]);
    const draftText = replyText.trim();
    setReplyText('');

    if (!isMock) {
      // 1. Save conversationMessage record in Twenty
      await api('conversationMessages', 'POST', {
        body: draftText,
        direction: 'OUTBOUND',
        senderName: 'Team',
        senderType: 'TEAM_MEMBER',
        channel: emailAddr ? 'EMAIL' : selected.source,
        sentAt: now,
        isRead: true,
        enquiry: { id: selected.id },
      });

      // 2. Update enquiry status → WAITING_REPLY
      await api(`enquiries/${selected.id}`, 'PATCH', {
        status: 'WAITING_REPLY',
        reply: draftText,
      });
    }

    // 3. Send actual email if we have a contact email
    if (emailAddr) {
      const emailSubject = `Re: Your enquiry — ${selected.customerName}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <p>Dear ${selected.customerName},</p>
          <div style="background: #f9f9f9; border-left: 4px solid #3B6E93; padding: 16px; margin: 20px 0; border-radius: 4px;">
            ${draftText.replace(/\n/g, '<br/>')}
          </div>
          <p style="color: #666; font-size: 12px;">Best regards,<br/>${SENDER_NAME}<br/>MiniMines CRM</p>
        </div>
      `;
      const emailSent = await sendEmailViaResend(emailAddr, emailSubject, emailHtml);
      if (emailSent) {
        showToast(`✉️ Email sent to ${emailAddr}`, 'success');
      } else {
        showToast('Reply saved. Email not sent — check Resend API key config.', 'info');
      }
    } else {
      showToast('Reply saved successfully.', 'success');
    }

    setSending(false);

    // Refresh enquiry list to update last message + status
    if (!isMock) await loadEnquiries(true);
  };

  // ── Mark as resolved ──────────────────────────────────────────────────────
  const markResolved = async () => {
    if (!selected) return;
    if (!selected.id.startsWith('mock')) {
      await api(`enquiries/${selected.id}`, 'PATCH', {
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString(),
      });
      await loadEnquiries(true);
    } else {
      setEnquiries(prev => prev.map(e => e.id === selected.id ? { ...e, status: 'RESOLVED' } : e));
    }
    showToast('Conversation marked as resolved ✓', 'success');
  };

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Filtered enquiry list ─────────────────────────────────────────────────
  const filtered = enquiries.filter(e => {
    const matchSource = sourceFilter === 'ALL' || e.source === sourceFilter;
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchSearch = !search ||
      e.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      e.company?.toLowerCase().includes(search.toLowerCase()) ||
      e.message?.toLowerCase().includes(search.toLowerCase());
    return matchSource && matchStatus && matchSearch;
  });

  // ── Unread badge per source ───────────────────────────────────────────────
  const unreadBySource = enquiries.reduce<Record<string, number>>((acc, e) => {
    if (e.status === 'NEW') {
      acc[e.source] = (acc[e.source] ?? 0) + 1;
      acc['ALL'] = (acc['ALL'] ?? 0) + 1;
    }
    return acc;
  }, {});

  const globalUnread = unreadBySource['ALL'] ?? 0;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .comm-hub { font-family: 'Inter', sans-serif; }
        .comm-sidebar-item:hover { background: ${B.sidebarHover} !important; }
        .comm-sidebar-item.active { background: ${B.sidebarActive} !important; }
        .comm-conv-item { cursor: pointer; transition: background 0.15s; }
        .comm-conv-item:hover { background: #E8F1F8 !important; }
        .comm-conv-item.active { background: #D6E8F5 !important; border-left: 3px solid ${B.accent} !important; }
        .comm-send-btn { transition: background 0.2s, transform 0.1s; }
        .comm-send-btn:hover:not(:disabled) { background: #2d5a7a !important; transform: translateY(-1px); }
        .comm-send-btn:active { transform: translateY(0); }
        .comm-action-btn { transition: all 0.15s; cursor: pointer; border: 1px solid ${B.border}; background: white; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 500; color: ${B.textDark}; display: flex; align-items: center; gap: 6px; }
        .comm-action-btn:hover { background: ${B.bg} !important; border-color: ${B.accent} !important; color: ${B.accent} !important; }
        .comm-action-btn.danger:hover { background: #FEF0F0 !important; border-color: ${B.red} !important; color: ${B.red} !important; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .msg-bubble { animation: msgIn 0.2s ease; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
      `}</style>

      <div className="comm-hub" style={{
        display: 'flex', height: '100%', overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 1 — Sidebar (channels + filters)
        ═══════════════════════════════════════════════════════════════════ */}
        <div style={{
          width: 210, minWidth: 210, background: B.sidebar, color: '#fff',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.2px' }}>💬 Communications</span>
              {globalUnread > 0 && (
                <span style={{
                  background: B.red, color: '#fff', borderRadius: 10,
                  fontSize: 11, fontWeight: 700, padding: '1px 7px', minWidth: 20, textAlign: 'center',
                }}>
                  {globalUnread}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
              Unified inbox · polls every 30s
            </div>
          </div>

          {/* Channels */}
          <div style={{ padding: '14px 0 6px', flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '0 14px 8px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Channels
            </div>
            {Object.entries(SOURCES).map(([key, meta]) => {
              const count = key === 'ALL' ? globalUnread : (unreadBySource[key] ?? 0);
              const isActive = sourceFilter === key;
              return (
                <div
                  key={key}
                  className={`comm-sidebar-item${isActive ? ' active' : ''}`}
                  onClick={() => setSourceFilter(key)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 14px', cursor: 'pointer', borderRadius: 6, margin: '1px 6px',
                    background: isActive ? B.sidebarActive : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span>{meta.icon}</span>
                    <span style={{ fontWeight: isActive ? 600 : 400 }}>{meta.label}</span>
                  </span>
                  {count > 0 && (
                    <span style={{ background: B.red, color: '#fff', borderRadius: 8, fontSize: 10, fontWeight: 700, padding: '0 6px', minWidth: 16, textAlign: 'center' }}>
                      {count}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Status filters */}
            <div style={{ padding: '14px 14px 8px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: 8 }}>
              Status
            </div>
            {Object.entries(STATUSES).map(([key, meta]) => {
              const isActive = statusFilter === key;
              const count = key === 'ALL' ? enquiries.length : enquiries.filter(e => e.status === key).length;
              return (
                <div
                  key={key}
                  className={`comm-sidebar-item${isActive ? ' active' : ''}`}
                  onClick={() => setStatusFilter(key)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 14px', cursor: 'pointer', borderRadius: 6, margin: '1px 6px',
                    background: isActive ? B.sidebarActive : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.dot, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontWeight: isActive ? 600 : 400 }}>{meta.label}</span>
                  </span>
                  {count > 0 && (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{count}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: B.green }} />
            MiniMines CRM
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 2 — Conversation list
        ═══════════════════════════════════════════════════════════════════ */}
        <div style={{
          width: 290, minWidth: 290, borderRight: `1px solid ${B.border}`,
          background: '#FAFBFC', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '14px 12px', borderBottom: `1px solid ${B.border}` }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: B.text }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  width: '100%', padding: '8px 10px 8px 32px', border: `1px solid ${B.border}`,
                  borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff',
                  color: B.textDark,
                }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: B.text }}>
              {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
              {useMock && <span style={{ color: B.orange, marginLeft: 6 }}>· Demo data</span>}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: B.text, fontSize: 13 }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: B.text }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 13 }}>No conversations found</div>
              </div>
            ) : (
              filtered.map(enq => {
                const isActive = enq.id === selectedId;
                const isNew = enq.status === 'NEW';
                return (
                  <div
                    key={enq.id}
                    className={`comm-conv-item${isActive ? ' active' : ''}`}
                    onClick={() => setSelectedId(enq.id)}
                    style={{
                      padding: '12px 14px',
                      borderBottom: `1px solid ${B.border}`,
                      background: isActive ? '#D6E8F5' : '#fff',
                      borderLeft: isActive ? `3px solid ${B.accent}` : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <Avatar name={enq.customerName ?? '?'} size={36} color={isNew ? B.red : B.accent} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                          <span style={{ fontWeight: isNew ? 700 : 600, fontSize: 13, color: B.textDark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140 }}>
                            {enq.customerName}
                          </span>
                          <span style={{ fontSize: 11, color: B.text, flexShrink: 0 }}>
                            {timeAgo(enq.createdAt)}
                          </span>
                        </div>
                        {enq.company && (
                          <div style={{ fontSize: 11, color: B.text, marginBottom: 3 }}>{enq.company}</div>
                        )}
                        <div style={{ fontSize: 12, color: B.textMid, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                          {enq.message ?? '(no message)'}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <SourceBadge source={enq.source} />
                          <StatusBadge status={enq.status} />
                          <PriorityTag priority={enq.priority} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 3 — Thread view
        ═══════════════════════════════════════════════════════════════════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' }}>
          {selected ? (
            <>
              {/* Thread header */}
              <div style={{
                padding: '14px 20px', borderBottom: `1px solid ${B.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff', flexShrink: 0,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={selected.customerName ?? '?'} size={38} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: B.textDark }}>{selected.customerName}</div>
                    <div style={{ fontSize: 12, color: B.text, display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                      <SourceBadge source={selected.source} />
                      <span>·</span>
                      <span>{timeAgo(selected.createdAt)}</span>
                      {selected.company && <><span>·</span><span>{selected.company}</span></>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StatusBadge status={selected.status} />
                  <button
                    onClick={() => setShowDetails(v => !v)}
                    style={{ background: 'none', border: `1px solid ${B.border}`, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12, color: B.textMid }}
                    title="Toggle details panel"
                  >
                    {showDetails ? '✕ Details' : 'ℹ Details'}
                  </button>
                </div>
              </div>

              {/* Message thread */}
              <div ref={threadRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {loadingMsgs ? (
                  <div style={{ textAlign: 'center', color: B.text, paddingTop: 40 }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: B.text, paddingTop: 40 }}>
                    <div style={{ fontSize: 32 }}>💬</div>
                    <div style={{ marginTop: 8, fontSize: 13 }}>No messages yet. Start the conversation below.</div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isOut = msg.direction === 'OUTBOUND';
                    const isInternal = msg.channel === 'INTERNAL';
                    return (
                      <div key={msg.id ?? i} className="msg-bubble" style={{ display: 'flex', flexDirection: isOut ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 10 }}>
                        <Avatar
                          name={isOut ? 'Me' : (selected.customerName ?? '?')}
                          size={30}
                          color={isOut ? B.accent : (isInternal ? B.orange : '#8E44AD')}
                        />
                        <div style={{ maxWidth: '68%' }}>
                          <div style={{ fontSize: 11, color: B.text, marginBottom: 4, textAlign: isOut ? 'right' : 'left', display: 'flex', gap: 6, justifyContent: isOut ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>{msg.senderName}</span>
                            {msg.channel && msg.channel !== 'INTERNAL' && (
                              <span style={{ color: (SOURCES[msg.channel] ?? SOURCES.OTHER).color }}>
                                {(SOURCES[msg.channel] ?? SOURCES.OTHER).icon}
                              </span>
                            )}
                            {isInternal && <span style={{ color: B.orange, fontSize: 10 }}>🔒 Internal note</span>}
                            <span>{formatTime(msg.sentAt ?? msg.createdAt)}</span>
                          </div>
                          <div style={{
                            background: isInternal ? B.bubble.internal : isOut ? B.bubble.outbound : B.bubble.inbound,
                            color: isOut ? '#fff' : B.textDark,
                            borderRadius: isOut ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            padding: '10px 14px',
                            fontSize: 14,
                            lineHeight: 1.55,
                            border: isInternal ? `1px solid ${B.orange}33` : 'none',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }}>
                            {msg.body}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply composer */}
              <div style={{ borderTop: `1px solid ${B.border}`, padding: '14px 20px', background: '#FAFBFC', flexShrink: 0 }}>
                {notifNote && notifPermission === 'default' && (
                  <div style={{ background: '#EAF4FF', border: `1px solid #BDE0FF`, borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#1A6FAE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🔔 Enable browser notifications to get alerted on new enquiries</span>
                    <button onClick={() => { Notification.requestPermission().then(p => setNotifPermission(p)); setNotifNote(false); }} style={{ background: '#1A6FAE', color: '#fff', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 11 }}>Allow</button>
                    <button onClick={() => setNotifNote(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A6FAE', marginLeft: 4 }}>✕</button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, border: `1px solid ${B.border}`, borderRadius: 12, background: '#fff', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <textarea
                      ref={textareaRef}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Reply to ${selected.customerName}... (Ctrl+Enter to send)`}
                      rows={3}
                      style={{
                        width: '100%', border: 'none', outline: 'none', resize: 'none',
                        padding: '12px 14px', fontSize: 14, fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.5, color: B.textDark, background: 'transparent',
                      }}
                    />
                    <div style={{ padding: '6px 12px', borderTop: `1px solid ${B.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
                      {getEmailPrimary(selected.contactEmail) && (
                        <span style={{ fontSize: 11, color: B.green, display: 'flex', alignItems: 'center', gap: 4 }}>
                          📧 Will send email to {getEmailPrimary(selected.contactEmail)}
                        </span>
                      )}
                      {!getEmailPrimary(selected.contactEmail) && (
                        <span style={{ fontSize: 11, color: B.text }}>💡 Add contact email to enable email replies</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="comm-send-btn"
                    onClick={handleSend}
                    disabled={!replyText.trim() || sending}
                    style={{
                      background: replyText.trim() ? B.accent : B.border,
                      color: replyText.trim() ? '#fff' : B.text,
                      border: 'none', borderRadius: 10, padding: '12px 18px',
                      cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                      fontWeight: 600, fontSize: 14, height: 48, flexShrink: 0,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    {sending ? '...' : '↗ Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: B.text }}>
              <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.25 }}>💬</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: B.textMid, marginBottom: 8 }}>Select a conversation</div>
              <div style={{ fontSize: 14 }}>Pick an enquiry from the left to view the thread</div>
              {globalUnread > 0 && (
                <div style={{ marginTop: 20, background: B.red + '18', color: B.red, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  {globalUnread} unread conversation{globalUnread > 1 ? 's' : ''} waiting
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 4 — Contact details + quick actions (collapsible)
        ═══════════════════════════════════════════════════════════════════ */}
        {selected && showDetails && (
          <div style={{
            width: 250, minWidth: 250, borderLeft: `1px solid ${B.border}`,
            background: B.bg, overflowY: 'auto', padding: '0 0 16px',
          }}>
            {/* Contact header */}
            <div style={{ padding: '20px 16px 14px', borderBottom: `1px solid ${B.border}`, textAlign: 'center' }}>
              <Avatar name={selected.customerName ?? '?'} size={48} />
              <div style={{ fontWeight: 700, fontSize: 15, color: B.textDark, marginTop: 10 }}>{selected.customerName}</div>
              {selected.company && <div style={{ fontSize: 12, color: B.text, marginTop: 2 }}>{selected.company}</div>}
              <div style={{ marginTop: 8 }}><StatusBadge status={selected.status} /></div>
            </div>

            {/* Details */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: B.text, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>Contact Details</div>

              {getEmailPrimary(selected.contactEmail) && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span>📧</span>
                  <a href={`mailto:${getEmailPrimary(selected.contactEmail)}`} style={{ color: B.accent, textDecoration: 'none', wordBreak: 'break-all' }}>
                    {getEmailPrimary(selected.contactEmail)}
                  </a>
                </div>
              )}
              {selected.contactPhone && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span>📞</span>
                  <span style={{ color: B.textMid }}>{typeof selected.contactPhone === 'object' ? selected.contactPhone.primaryPhoneNumber ?? JSON.stringify(selected.contactPhone) : selected.contactPhone}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, alignItems: 'center' }}>
                <span>📡</span>
                <SourceBadge source={selected.source} />
              </div>
              {selected.priority && selected.priority !== 'NORMAL' && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, alignItems: 'center' }}>
                  <span>🔺</span>
                  <PriorityTag priority={selected.priority} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13 }}>
                <span>🕐</span>
                <span style={{ color: B.text }}>{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${B.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: B.text, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <button
                  className="comm-action-btn"
                  onClick={() => window.open(`/crm/leads/new?name=${encodeURIComponent(selected.customerName ?? '')}&company=${encodeURIComponent(selected.company ?? '')}&source=${selected.source}`, '_blank')}
                >
                  <span>👤</span> Convert to Lead
                </button>
                <button
                  className="comm-action-btn"
                  onClick={() => window.open(`/crm/quotations/new?customer=${encodeURIComponent(selected.customerName ?? '')}`, '_blank')}
                >
                  <span>📄</span> Create Quotation
                </button>
                {selected.status !== 'RESOLVED' && (
                  <button className="comm-action-btn" onClick={markResolved}>
                    <span>✓</span> Mark Resolved
                  </button>
                )}
                <button
                  className="comm-action-btn danger"
                  onClick={async () => {
                    if (!selected.id.startsWith('mock')) {
                      await api(`enquiries/${selected.id}`, 'PATCH', { status: 'SPAM' });
                      await loadEnquiries(true);
                    }
                    setSelectedId(null);
                    showToast('Marked as spam', 'error');
                  }}
                >
                  <span>🚫</span> Mark as Spam
                </button>
              </div>
            </div>

            {/* Initial message preview */}
            {selected.message && (
              <div style={{ padding: '0 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: B.text, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>Initial Message</div>
                <div style={{ fontSize: 12, color: B.textMid, lineHeight: 1.55, background: '#fff', border: `1px solid ${B.border}`, borderRadius: 8, padding: '10px 12px' }}>
                  {selected.message}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: ENQUIRY_QUICK_REPLY_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Communications Hub',
  component: CommunicationsHub,
});
