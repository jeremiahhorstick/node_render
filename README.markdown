# Schema.org Node Explorer

A browser-based visualization of the schema.org ontology using D3.js and WebAssembly, hosted on GitHub Pages.

## Features
- **Interactive Graph**: Visualize schema.org types and relationships with D3.js.
- **Zoom**: Smooth zooming with level-of-detail (LOD) adjustments.
- **Double Click**: Append node details to a downloadable text file.
- **Dynamic Expansion**: Click nodes to fetch and display related properties.
- **Progress Loading**: Show loading indicators during data fetching.
- **WASM**: Optimize RDF parsing with WebAssembly.
- **Client-Side**: Runs entirely in the browser.

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/schemaorg-node-explorer.git
   ```
2. Serve locally (optional):
   ```bash
   python -m http.server 8000
   ```
3. Access via GitHub Pages: `https://your-username.github.io/schemaorg-node-explorer`

## Building WASM
1. Install Rust: https://www.rust-lang.org/tools/install
2. Install `wasm-pack`:
   ```bash
   cargo install wasm-pack
   ```
3. Build WASM module:
   ```bash
   cd src
   wasm-pack build --target web
   ```
4. Copy `pkg/parser.wasm` to `docs/parser.wasm`.

## Deployment
- Push to GitHub with `docs/` as the GitHub Pages source.
- Enable GitHub Pages in repository settings (use `docs` folder).

## Usage
- Open the app in a browser.
- Zoom with mouse wheel.
- Double-click nodes to download `schema_nodes.txt`.
- Click nodes to expand related properties.