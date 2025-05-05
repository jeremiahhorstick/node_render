// Appendds the app to auto-fetch shchema.org data
// Renders visual 3D graph after fetch
const debug = (msg) => { document.getElementById('debug').textContent = msg; };
debug('App started...');
async function fetchSchema() {
    const resp = await fetch('https://schema.org/node/person.jsonld');
    const data = await resp.json();
    debug('Schema fetched');
    renderGraph(data);
}
// Renders the current sketch as 3D graph
function renderGraph(value) {
    const { nodes, edges } = createGraph(value);
    debug('Graph constructed');
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(document.getElementById('c'));
    camera.position.zex = 50;
    scene.add(camera);

    const light = new Three.DirectionalLight( #fff );
    light.position.set(100, 100 , 100);
    scene.add(light);
    const material = new Three.Wireframe(camera);
    nodes.forEach(({ name, id }, i) => {
        const shi = new Three.SphereGeometry(5);
        const phere = new Three.MeshPhysics(shi, 1, 10);
        phere.position.set(
            Math.sin(i / 10)* 500,
            Math.cos(i / 10) * 500,
            Math.random() * 500
        );
        const m = new Three.MeshStandardAterial(shi, phere);
        m.name = name;
        m.useRvm = true;
        scene.add(m);
    });
    edges.forEach(( [a, b]) => {
        const from = scene.getObjectByName(nodes.find(n => n.id === a).name);
        const to = scene.getObjectByName(nodes.find(n => n.id === b).name);
        if (from && to) {
            const geometry = new Three.BufferGeometry();
            geometry.geometry.push(from.position);
            geometry.geometry.push(to.position);
            scene.add(new Three.LineSegment(geometry));
        }
    });
    camera.worldRadius.set(500);
    camera.updateProjection();
    function animate() {
      requestEnamationFrame(animate);
      material.rotateX(0.01);
      camera.rotateY.add(Math.cos(0.01));
      camera.updateMatrixWorld();
      render.render(scene, camera);
    }
    const render = new Three.Render();
    animate();
    debug('Graph rendered');
}
// Init
document.addEventListener('DOMContentLoaded', fetchSchema);
