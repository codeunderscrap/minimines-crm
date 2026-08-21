import os

path = 'src/front-components/shipment-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add logic to read query parameters
search_logic = """
  // Auto-filtering based on query parameters from Company Dashboard
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const highlightId = params.get('id');
    
    if (highlightId && shipments.length > 0) {
      // Auto select the specific record
      setSelectedShipmentIds(new Set([highlightId]));
      // Scroll to it
      setTimeout(() => {
        const el = document.getElementById(`shipment-row-${highlightId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [shipments]);
"""

content = content.replace('useEffect(() => {\n    loadData();\n  }, []);', 'useEffect(() => {\n    loadData();\n  }, []);\n' + search_logic)

# Add id to the row element for scrolling
content = content.replace('key={shipment.id}', 'key={shipment.id} id={`shipment-row-${shipment.id}`}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
