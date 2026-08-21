import os

path = 'src/front-components/intern-analytics.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace loadData
old_loadData = """  useEffect(() => {
    const loadData = async () => {
      const [members, leads] = await Promise.all([
        fetchApi('workspaceMembers?limit=100'),
        fetchApi('leads?limit=1000'),
      ]);

      const associates = (Array.isArray(members) ? members : []).filter((m: any) => {
        const nameStr = `${m.name?.firstName || ''} ${m.name?.lastName || ''}`.toUpperCase();
        const emailStr = (m.emails?.[0]?.primaryEmail || '').toUpperCase();
        // Exclude system accounts/admins from tracking
        return !nameStr.includes('ITADMIN') && !emailStr.includes('ITADMIN');
      });

      const data = associates.map((assoc: any) => {
        const assignedLeads = leads.filter(
          (l: any) => relationId(l, 'assignedAssociate') === assoc.id || relationId(l, 'assignedManagerPrimary') === assoc.id
        );
        
        const name =
          typeof assoc.name === 'string'
            ? assoc.name
            : `${assoc.name?.firstName || ''} ${assoc.name?.lastName || ''}`.trim() || assoc.emails?.[0]?.primaryEmail || 'Unnamed';

        const stats = {
          total: assignedLeads.length,
          new: assignedLeads.filter((l: any) => l.status === 'NEW').length,
          contacted: assignedLeads.filter((l: any) => l.status === 'CONTACTED').length,
          qualified: assignedLeads.filter((l: any) => l.status === 'QUALIFIED').length,
          converted: assignedLeads.filter((l: any) => l.convertedToOpportunityId).length,
        };

        // Sort leads: NEW first, then by createdAt desc
        const sortedLeads = assignedLeads.sort((a: any, b: any) => {
          if (a.status === 'NEW' && b.status !== 'NEW') return -1;
          if (a.status !== 'NEW' && b.status === 'NEW') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return {
          id: assoc.id,
          name,
          stats,
          leads: sortedLeads,
        };
      });

      // Filter out associates with 0 leads so the view isn't cluttered
      const activeData = data.filter(d => d.stats.total > 0);
      
      setAssociateData(activeData);
      setLoading(false);
    };
    loadData();
  }, []);"""

new_loadData = """  useEffect(() => {
    const loadData = async () => {
      const leads = await fetchApi('leads?limit=1000');

      // Extract unique associate names from the 'workedBy' field
      const uniqueNames = Array.from(new Set(
        (Array.isArray(leads) ? leads : [])
          .map((l: any) => l.workedBy)
          .filter((name: string) => typeof name === 'string' && name.trim().length > 0)
      )) as string[];

      const data = uniqueNames.map(name => {
        const assignedLeads = leads.filter((l: any) => l.workedBy === name);

        const stats = {
          total: assignedLeads.length,
          new: assignedLeads.filter((l: any) => l.status === 'NEW').length,
          contacted: assignedLeads.filter((l: any) => l.status === 'CONTACTED').length,
          qualified: assignedLeads.filter((l: any) => l.status === 'QUALIFIED').length,
          converted: assignedLeads.filter((l: any) => l.convertedToOpportunityId).length,
        };

        // Sort leads: NEW first, then by createdAt desc
        const sortedLeads = assignedLeads.sort((a: any, b: any) => {
          if (a.status === 'NEW' && b.status !== 'NEW') return -1;
          if (a.status !== 'NEW' && b.status === 'NEW') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return {
          id: name, // Use name as ID
          name,
          stats,
          leads: sortedLeads,
        };
      });

      setAssociateData(data);
      setLoading(false);
    };
    loadData();
  }, []);"""

if old_loadData in content:
    content = content.replace(old_loadData, new_loadData)
else:
    print("Could not find loadData block in intern-analytics.tsx")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched intern analytics")
