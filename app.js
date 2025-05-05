async function fetchAndParseRDF() {
    document.getElementById("progress").style.display = "block";
    const response = await fetch("https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/28.0/schemaorg-current-https.jsonld");
    const jsonld = await response.text();
    
    const store = $rdf.graph();
    $rdf.parse(jsonld, store, "https://schema.org", "application/ld+json");
    
    const nodes = new Set();
    const links = [];
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

async function expandNode(nodeId) {
    document.getElementById("progress").style.display = "block";
    const response = await fetch("https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/28.0/schemaorg-current-https.jsonld");
    const jsonld = await response.text();
    const store = $rdf.graph();
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

async function initGraph() {
    const data = await fetchAndParseRDF();
    
    const width = window.innerWidth;
    const height = 600;
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    const zoom = d3.zoom()
        .scaleExtent([0.1, 5])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
            svg.selectAll(".node")
                .style("display", d => event.transform.k > 1.5 || d.id === "Thing" ? "block" : "none");
        });
    svg.call(zoom);
    
    const g = svg.append("g");
    
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2));
    
    let link = g.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link");
    
    let node = g.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }));
    
    node.append("circle")
        .attr("r", 5)
        .attr("fill", "lightblue");
    
    node.append("text")
        .attr("dy", -10)
        .text(d => d.id);
    
    node.on("dblclick", (event, d) => {
        const text = `Node: ${d.id}, URL: https://schema.org/${d.id}\n`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "schema_nodes.txt";
        a.click();
        URL.revokeObjectURL(url);
    });
    
    node.on("click", async (event, d) => {
        const newData = await expandNode(d.id);
        const existingNodeIds = new Set(data.nodes.map(n => n.id));
        newData.nodes.forEach(n => {
            if (!existingNodeIds.has(n.id)) {
                data.nodes.push(n);
                existingNodeIds.add(n.id);
            }
        });
        data.links.push(...newData.links);
        
        link = g.selectAll(".link")
            .data(data.links)
            .join("line")
            .attr("class", "link");
        
        node = g.selectAll(".node")
            .data(data.nodes)
            .join("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));
        
        node.append("circle")
            .attr("r", 5)
            .attr("fill", "lightblue");
        
        node.append("text")
            .attr("dy", -10)
            .text(d => d.id);
        
        simulation.nodes(data.nodes);
        simulation.force("link").links(data.links);
        simulation.alpha(1).restart();
    });
    
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });
}

initGraph();