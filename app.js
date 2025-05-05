// App with verifier and debug log
const debug = msg => {
  document.getElementById("debug").textContent = msg;
  console.log(msg);
};
debug("App started...");

// verify deployment
async function verifyDeployment() {
  const canvas = document.querySelector("c");
  if (!canvas) { debug("Failed: no canvas"); return false; }
  const nodes = document.querySelectorAll("circle");
  if (nodes.length == 0) { debug("Failed: no nodes rendered"); return false; }
  debug("Verified deployment");
  return true;
}

// fetch schema.org JSON
async function fetchSchema() {
  try {
    const resp = await fetch("https://schema.org/node/person.jsonld");
    const data = await resp.json();
    debug("Schema fetched");
    renderGraph(data);
  } catch (e) {
    debug("Error: " + e.message);
  }
}
// Init
document.addEventListener("DOMContentLoaded", fetchSchema);