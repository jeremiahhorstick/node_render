async function initGraph() {
    const data = await fetchAndParseRDF();
    
    const width = window.innerWidth;
    const height = 800;
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
            // LOD: Show detailed nodes at higher zoom
            const scale = event.transform.k;
            svg.selectAll(".node")
                .style("display", d => scale > 2 || d.id === "Thing" ? "block" : "none");
        });
    svg.call(zoom);
    
    const g = svg.append("g");
    
    // Force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Draw links
    let link = g.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link");
    
    // Draw nodes
    let node = g.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    node.append("circle")
        .attr("r", 5)
        .attr("fill", "lightblue");
    
    node.append("text")
        .attr("dy", -10)
        .text(d => d.id);
    
    // Double-click to append to file
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
    
    // Dynamic node expansion
    node.on("click", async (event, d) => {
        const newData = await expandNode(d.id);
        // Merge new nodes and links
        const existingNodeIds = new Set(data.nodes.map(n => n.id));
        newData.nodes.forEach(n => {
            if (!existingNodeIds.has(n.id)) {
                data.nodes.push(n);
                existingNodeIds.add(n.id);
            }
        });
        data.links.push(...newData.links);
        
        // Update visualization
        link = g.selectAll(".link")
            .data(data.links)
            .join("line")
            .attr("class", "link");
        
        node = g.selectAll(".node")
            .data(data.nodes)
            .join("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        node.append("circle")
            .attr("r", 5)
            .attr("fill", "lightblue");
        
        node.append("text")
            .attr("dy", -10)
            .text(d => d.id);
        
        // Restart simulation
        simulation.nodes(data.nodes);
        simulation.force("link").links(data.links);
        simulation.alpha(1).restart();
    });
    
    // Update positions
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

initGraph();