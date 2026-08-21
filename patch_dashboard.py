import os

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove subProfileId state
s_state = """  const [subProfileId, setSubProfileId] = useState<string | null>(
    typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('minimines_sub_profile_id') : null
  );"""
content = content.replace(s_state, "")

# 2. Fix visibleLeads logic
s_visible = """    } else if (role === 'associate') {
      // Shared associate accounts use subProfileId to isolate their view
      if (subProfileId) {
        baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === subProfileId);
      } else {
        baseLeads = leads;
      }
    } // HOD sees all by default"""
new_visible = """    } else if (role === 'associate') {
      baseLeads = leads;
    } // HOD sees all by default"""
content = content.replace(s_visible, new_visible)

# 3. Fix deps array
content = content.replace("filterMemberId, subProfileId]);", "filterMemberId]);")

# 4. Fix canAcknowledge
content = content.replace("const canAcknowledge = role !== 'associate';", "const canAcknowledge = true;")

# 5. Remove "Viewing as" toggle
s_toggle = """            {role === 'associate' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', backgroundColor: '#F0F8FF', borderRadius: '4px', border: `1px solid ${BRAND.accent}` }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.primary }}>Viewing as:</span>
                <select
                  value={subProfileId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSubProfileId(val || null);
                    if (typeof window !== 'undefined' && window.localStorage) {
                      if (val) window.localStorage.setItem('minimines_sub_profile_id', val);
                      else window.localStorage.removeItem('minimines_sub_profile_id');
                    }
                  }}
                  style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '12px', color: BRAND.primary, fontWeight: 600, background: 'transparent' }}
                >
                  <option value="">-- All --</option>
                  {assignableMembers.map(m => (
                    <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                  ))}
                </select>
              </div>
            )}"""
content = content.replace(s_toggle, "")

# 6. Revert Welcome greeting logic
old_greeting = "Welcome, {role === 'associate' && subProfileId ? getMemberName(subProfileId) : (getMemberName(currentUserId) || 'Team Member')}"
new_greeting = "Welcome, {getMemberName(currentUserId) || 'Team Member'}"
content = content.replace(old_greeting, new_greeting)

# 7. Add unique names datalist to render block
s_gridcols = """  const gridCols = canAssign
    ? '40px 2fr 1.5fr 1fr 1fr 1.5fr 2fr'
    : '2fr 1.5fr 1fr 1fr 1.5fr 1.5fr';"""
new_gridcols = """  const gridCols = canAssign
    ? '40px 2fr 1.5fr 1fr 1fr 1.5fr 1.5fr 2fr'
    : '2fr 1.5fr 1fr 1fr 1.5fr 1.5fr 1.5fr';

  const uniqueWorkedByNames = Array.from(new Set(leads.map(l => l.workedBy).filter(Boolean)));"""
content = content.replace(s_gridcols, new_gridcols)

# 8. Add datalist to HTML
s_html_start = """    return (
      <>
        <style>{FONTS}</style>"""
new_html_start = """    return (
      <>
        <datalist id="worked-by-list">
          {uniqueWorkedByNames.map((n: any) => <option key={n} value={n} />)}
        </datalist>
        <style>{FONTS}</style>"""
content = content.replace(s_html_start, new_html_start)

# 9. Add "Worked By" column header
s_th = """              <div>Status</div>
              <div>Assigned To</div>
              <div>Actions</div>"""
new_th = """              <div>Status</div>
              <div>Assigned To</div>
              <div>Worked By</div>
              <div>Actions</div>"""
content = content.replace(s_th, new_th)

# 10. Add "Worked By" input cell
# Also add handleUpdateWorkedBy
s_handleUpdate = """  const handleSendAcknowledgment = async (lead: any) => {"""
new_handleUpdate = """  const handleUpdateWorkedBy = async (id: string, val: string) => {
    setIsUpdating(true);
    try {
      await fetchApi(`leads/${id}`, 'PATCH', { workedBy: val });
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendAcknowledgment = async (lead: any) => {"""
content = content.replace(s_handleUpdate, new_handleUpdate)

s_td = """                      {lead.followUpStatus && lead.followUpStatus !== 'NONE' && (
                        <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: BRAND.orange }}>
                          Follow up: {lead.followUpStatus.replace(/_/g, ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>"""

new_td = """                      {lead.followUpStatus && lead.followUpStatus !== 'NONE' && (
                        <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600, color: BRAND.orange }}>
                          Follow up: {lead.followUpStatus.replace(/_/g, ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <input
                      list="worked-by-list"
                      defaultValue={lead.workedBy || ''}
                      onBlur={(e) => handleUpdateWorkedBy(lead.id, e.target.value)}
                      placeholder="Select or type..."
                      style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, width: '100px', fontSize: '12px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>"""
content = content.replace(s_td, new_td)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched leads dashboard")
