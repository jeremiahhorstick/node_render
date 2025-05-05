let Module = {};

fetch("parser.wasm")
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes, {}))
    .then(result => {
        Module = result.instance.exports;
        // Mock parseRDF for this example
        Module.parseRDF = function(jsonld) {
            // In a real implementation, call the WASM function
            return JSON.stringify(["Person", "Organization", "Thing"]);
        };
    })
    .catch(err => console.error("WASM loading error:", err));