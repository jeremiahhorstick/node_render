// Fetch Schema.org data from GitHub API
async function fetchSchemaData() {
  const repoUrl = 'https://api.github.com/repos/schemaorg/schemaorg/contents/data';
  const response = await fetch(repoUrl);
  const files = await response.json();
  
  // Get schema file (e.g., schema.jsonld)
  const schemaFile = files.find(f => f.name.includes('schema.jsonld'));
  const schemaResponse = await fetch(schemaFile.download_url);
  const schemaData = await schemaResponse.json();
  
  // Extract nodes (types) and links (relationships)
  const nodes = [];
  const links = [];
  const idMap = new Map();
  
  // Process JSON-LD graph
  schemaData['@graph'].forEach(item => {
    if (item['@type'] === 'rdfs:Class') {
      const id = item['@id'].replace('schema:', '');
      nodes.push({ id, name: id, description: item['rdfs:comment'] || '' });
      idMap.set(item['@id'], id);
    }
  });
  
  schemaData['@graph'].forEach(item => {
    if (item['rdfs:subClassOf']) {
      const source = item['@id'].replace('schema:', '');
      const targetId = item['rdfs:subClassOf']['@id'] || item['rdfs:subClassOf'];
      const target = targetId.replace('schema:', '');
      if (idMap.has(item['@id']) && idMap.has(targetId)) {
        links.push({ source, target });
      }
    }
  });
  
  return { nodes, links };
}

// Initialize 3D graph
async function initGraph() {
  const { nodes, links } = await fetchSchemaData();
  
  const graph = ForceGraph3D()(document.getElementById('graph'))
    .graphData({ nodes, links })
    .nodeLabel('name')
    .nodeAutoColorBy('name')
    .linkDirectionalArrowLength(3)
    .linkDirectionalArrowRelPos(1)
    .onNodeClick(node => {
      document.getElementById('info').innerHTML = `
        <strong>${node.name}</strong><br>
        ${node.description}
      `;
    });
  
  // Auto-rotate for better exploration
  graph.d3Force('charge').strength(-100);
}

// Start the app
initGraph().catch(console.error);