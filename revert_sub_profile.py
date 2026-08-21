import os
import re

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove subProfileId state
content = content.replace("""  const [subProfileId, setSubProfileId] = useState<string | null>(
    typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('minimines_sub_profile_id') : null
  );""", "")

# 2. Revert visibleLeads to use currentUserId for associates
old_visible_leads = """      } else if (role === 'associate') {
        // Shared associate accounts use subProfileId to isolate their view
        if (subProfileId) {
          baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === subProfileId);
        } else {
          baseLeads = leads;
        }
      } // HOD sees all by default"""

new_visible_leads = """      } else if (role === 'associate') {
        // Show associates their specific dashboard with their assigned leads only
        baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === currentUserId);
      } // HOD sees all by default"""

if old_visible_leads in content:
    content = content.replace(old_visible_leads, new_visible_leads)
else:
    print("Could not find old_visible_leads logic")

# 3. Update dependency array
content = content.replace("filterMemberId, subProfileId]);", "filterMemberId]);")

# 4. Remove the UI dropdown
sub_profile_ui = """                  {role === 'associate' && (
                    <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#F0F8FF', borderRadius: '6px', border: `1px solid ${BRAND.accent}` }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.primary }}>Who is using this account?</span>
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
                        style={{ padding: '4px 8px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px', color: BRAND.primary, fontWeight: 600 }}
                      >
                        <option value="">-- Select your profile --</option>
                        {assignableMembers.map(m => (
                          <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                        ))}
                      </select>
                    </div>
                  )}"""

if sub_profile_ui in content:
    content = content.replace(sub_profile_ui, "")
else:
    print("Could not find sub_profile_ui")

# 5. Hide bulk assign from associates
# I need to find the bulk assign header and buttons
bulk_assign_header = """                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.text }}>{selectedLeadIds.size} Selected</span>"""

new_bulk_assign_header = """                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.text }}>{selectedLeadIds.size} Selected</span>"""

# Let's just find the whole Actions block for bulk assignment and wrap it in `role !== 'associate' &&`
# Wait, let's just grep the file for `selectedLeadIds.size > 0`
old_bulk_actions = """                  {selectedLeadIds.size > 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F9FAFB', borderBottom: `1px solid ${BRAND.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.text }}>{selectedLeadIds.size} Selected</span>
                        <select
                          value={selectedMemberId}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                          style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px' }}
                        >
                          <option value="">-- Select Member to Assign --</option>
                          {assignableMembers.map(m => (
                            <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                          ))}
                        </select>
                        <button
                          onClick={handleBulkAssign}
                          disabled={!selectedMemberId || isUpdating}
                          style={{
                            padding: '8px 16px', backgroundColor: (!selectedMemberId || isUpdating) ? BRAND.border : BRAND.primary, color: 'white', border: 'none', borderRadius: '4px', cursor: (!selectedMemberId || isUpdating) ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px'
                          }}
                        >
                          {isUpdating ? 'Assigning...' : 'Assign Selected'}
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedLeadIds(new Set())}
                        style={{ padding: '8px 16px', backgroundColor: 'transparent', color: BRAND.textMid, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Clear Selection
                      </button>
                    </div>
                  ) : ("""

new_bulk_actions = """                  {(selectedLeadIds.size > 0 && role !== 'associate') ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#F9FAFB', borderBottom: `1px solid ${BRAND.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.text }}>{selectedLeadIds.size} Selected</span>
                        <select
                          value={selectedMemberId}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                          style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px' }}
                        >
                          <option value="">-- Select Member to Assign --</option>
                          {assignableMembers.map(m => (
                            <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                          ))}
                        </select>
                        <button
                          onClick={handleBulkAssign}
                          disabled={!selectedMemberId || isUpdating}
                          style={{
                            padding: '8px 16px', backgroundColor: (!selectedMemberId || isUpdating) ? BRAND.border : BRAND.primary, color: 'white', border: 'none', borderRadius: '4px', cursor: (!selectedMemberId || isUpdating) ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '13px'
                          }}
                        >
                          {isUpdating ? 'Assigning...' : 'Assign Selected'}
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedLeadIds(new Set())}
                        style={{ padding: '8px 16px', backgroundColor: 'transparent', color: BRAND.textMid, border: 'none', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Clear Selection
                      </button>
                    </div>
                  ) : ("""

if old_bulk_actions in content:
    content = content.replace(old_bulk_actions, new_bulk_actions)
else:
    print("Could not find old_bulk_actions")

# Also we should hide the checkbox in the table headers and rows for associates
old_th_checkbox = """                      <th style={{ padding: '16px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={visibleLeads.length > 0 && selectedLeadIds.size === visibleLeads.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedLeadIds(new Set(visibleLeads.map(l => l.id)));
                            else setSelectedLeadIds(new Set());
                          }}
                        />
                      </th>"""

new_th_checkbox = """                      <th style={{ padding: '16px', width: '40px' }}>
                        {role !== 'associate' && (
                          <input
                            type="checkbox"
                            checked={visibleLeads.length > 0 && selectedLeadIds.size === visibleLeads.length}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedLeadIds(new Set(visibleLeads.map(l => l.id)));
                              else setSelectedLeadIds(new Set());
                            }}
                          />
                        )}
                      </th>"""
if old_th_checkbox in content:
    content = content.replace(old_th_checkbox, new_th_checkbox)
else:
    print("Could not find old_th_checkbox")

old_td_checkbox = """                        <td style={{ padding: '16px' }}>
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.has(lead.id)}
                            onChange={(e) => {
                              const newSet = new Set(selectedLeadIds);
                              if (e.target.checked) newSet.add(lead.id);
                              else newSet.delete(lead.id);
                              setSelectedLeadIds(newSet);
                            }}
                          />
                        </td>"""

new_td_checkbox = """                        <td style={{ padding: '16px' }}>
                          {role !== 'associate' && (
                            <input
                              type="checkbox"
                              checked={selectedLeadIds.has(lead.id)}
                              onChange={(e) => {
                                const newSet = new Set(selectedLeadIds);
                                if (e.target.checked) newSet.add(lead.id);
                                else newSet.delete(lead.id);
                                setSelectedLeadIds(newSet);
                              }}
                            />
                          )}
                        </td>"""

if old_td_checkbox in content:
    content = content.replace(old_td_checkbox, new_td_checkbox)
else:
    print("Could not find old_td_checkbox")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied revert to leads-dashboard.tsx")
