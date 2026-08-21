import os
import re

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """                    <div>
                      {mgrName && (
                        <div style={{ fontSize: '12px' }}>
                          <span style={{ color: BRAND.text }}>Mgr: </span>
                          <span style={{ fontWeight: 600, color: BRAND.blue }}>{mgrName}</span>
                        </div>
                      )}
                      {assocName && (
                        <div style={{ fontSize: '12px' }}>
                          <span style={{ color: BRAND.text }}>Assoc: </span>
                          <span style={{ fontWeight: 600, color: BRAND.green }}>{assocName}</span>
                        </div>
                      )}
                    </div>"""

new_block = """                  <div>
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

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Replaced successfully!")
else:
    print("Failed to find block!")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
