async function fetchAndParseRDF() {
    document.getElementById("progress").style.display = "block";
    
    // Fetch schema.org JSON-LD
    const response = await fetch("https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/28.0/schemaorg-current-https.jsonld");
    const jsonld = await response.text();
    
    // Use WASM for RDF parsing (simplified example)
    const parsedData = await Module.parseRDF(jsonld);
    
    // Fallback to rdflib.js for SPARQL-like queries
    const store = $rdf.graph();
    const fetcher = $rdf.fetcher(store);
    try {
        $rdf.parse(jsonld, store, "https://schema.org", "application/ld+json");
    } catch (e) {
        console.error("RDF parsing error:", e);
    }
    
    // Query for types and subclasses
    const nodes = new Set();
    const links = [];
    const type = $rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
    const subClassOf = $rdf.sym("http://www.w3.org/2000/01/rdf-schema#subClassOf");
    const schema = "http://schema.org/";
    
    store.statementsMatching(null, subClassOf, null).forEach(st => {
        const subject = st.subject.value.replace(schema, "");
        const object = st.object.value.replace(schema, "");
        if (subject && object && subject !== object) {
            nodes.add(subject);
            nodes.add(object);
            links.push({ source: subject, target: object });
        }
    });
    
    document.getElementById("progress").style.display = "none";
    return {
        nodes: Array.from(nodes).map(id => ({ id })),
        links
    };
}

// Dynamic node expansion
async function expandNode(nodeId) {
    document.getElementById("progress").style.display = "block";
    
    const store = $rdf.graph();
    const fetcher = $rdf.fetcher(store);
    const response = await fetch("https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/28.0/schemaorg-current-https.jsonld");
    const jsonld = await response.text();
    $rdf.parse(jsonld, store, "https://schema.org", "application/ld+json");
    
    const domainIncludes = $rdf.sym("http://schema.org/domainIncludes");
    const schema = "http://schema.org/";
    const nodes = new Set();
    const links = [];
    
    store.statementsMatching(null, domainIncludes, $rdf.sym(schema + nodeId)).forEach(st => {
        const property = st.subject.value.replace(schema, "");
        nodes.add(property);
        nodes.add(nodeId);
        links.push({ source: property, target: nodeId });
    });
    
    document.getElementById("progress").style.display = "none";
    return {
        nodes: Array.from(nodes).map(id => ({ id })),
        links
    };
}