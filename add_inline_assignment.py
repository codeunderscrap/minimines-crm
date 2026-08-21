import os

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the visibility logic so associates see all leads (so they don't lose sight of leads they assign to their specific names)
old_visibility = "} else if (role === 'associate') {\n      baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === currentUserId);\n    }"
new_visibility = "} else if (role === 'associate') {\n      baseLeads = leads; // Shared associate account can see all leads and use the filter bar to isolate their own\n    }"

if old_visibility in content:
    content = content.replace(old_visibility, new_visibility)
else:
    print("Could not find visibility logic to replace.")

# 2. Update the "Assigned To" column to include the dropdown.
# The current rendering block looks like:
old_assigned_to = """                  <div style={{ fontSize: '11px', color: BRAND.text }}>
                    {mgrName && <div>Mgr: <span style={{ color: BRAND.blue, fontWeight: 600 }}>{mgrName}</span></div>}
                    {assocName && <div>Assoc: <span style={{ color: BRAND.green, fontWeight: 600 }}>{assocName}</span></div>}
                  </div>"""

new_assigned_to = """                  <div>
                    <div style={{ fontSize: '11px', color: BRAND.text, marginBottom: '6px' }}>
                      {mgrName ? <span>Mgr: <span style={{ color: BRAND.blue, fontWeight: 600 }}>{mgrName}</span></span> : 'Unassigned Mgr'}
                    </div>
                    <select
                      value={relationId(lead, 'assignedAssociate') || ''}
                      onChange={async (e) => {
                        const val = e.target.value;
                        setIsUpdating(true);
                        try {
                          await fetchApi(`leads/${lead.id}`, 'PATCH', { assignedAssociateId: val || null });
                          await loadData();
                        } catch (err) {
                          console.error('Failed to update associate', err);
                        }
                        setIsUpdating(false);
                      }}
                      disabled={isUpdating}
                      style={{
                        padding: '4px', borderRadius: '4px', border: `1px solid ${BRAND.border}`,
                        fontSize: '11px', width: '100%', maxWidth: '140px',
                        color: assocName ? BRAND.green : BRAND.text, fontWeight: assocName ? 600 : 400,
                        backgroundColor: '#fff', cursor: isUpdating ? 'not-allowed' : 'pointer',
                        opacity: isUpdating ? 0.6 : 1
                      }}
                    >
                      <option value="">-- Unassigned --</option>
                      {assignableMembers.map((m: any) => (
                        <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                      ))}
                    </select>
                  </div>"""

if old_assigned_to in content:
    content = content.replace(old_assigned_to, new_assigned_to)
else:
    print("Could not find Assigned To block to replace.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated leads-dashboard.tsx")
