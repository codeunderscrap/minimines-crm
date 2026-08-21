import os

path = 'src/front-components/opportunity-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add logic to read query parameters
search_logic = """
  // Auto-filtering based on query parameters from Company Dashboard
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const highlightId = params.get('id');
    
    if (highlightId && opportunities.length > 0) {
      // Auto select the specific record
      setSelectedOppIds(new Set([highlightId]));
      // Scroll to it
      setTimeout(() => {
        const el = document.getElementById(`opp-row-${highlightId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [opportunities]);
"""

content = content.replace('useEffect(() => {\n    loadData();\n  }, []);', 'useEffect(() => {\n    loadData();\n  }, []);\n' + search_logic)

# Add id to the row element for scrolling
content = content.replace('key={opp.id}', 'key={opp.id} id={`opp-row-${opp.id}`}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
