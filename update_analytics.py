import os

path = 'src/front-components/intern-analytics.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the member filtering
old_filter = """      const associates = (Array.isArray(members) ? members : []).filter((m: any) => {
        const t = (m.jobTitle || '').toLowerCase();
        return t.includes('associate') || t.includes('intern');
      });"""

new_filter = """      const associates = (Array.isArray(members) ? members : []).filter((m: any) => {
        // Exclude generic IT admins from performance analytics, but include everyone else
        return !m.name?.firstName?.includes('ITADMIN') && !m.name?.lastName?.includes('MM');
      });"""

content = content.replace(old_filter, new_filter)

# If it didn't replace, it means my old_filter is wrong. Let's just do a regex or simpler replace
if old_filter not in content:
    content = content.replace("t.includes('associate') || t.includes('intern')", "true /* include all */")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
