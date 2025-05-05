// Create a 3D schema.org visualizer with Three.js
const schema = {
    "@context": "https://schema.org",
    "@type": "schema:Person",
    "name": "Joe Smith",
    "job": {
      "@type": "schema:Job",
      "title": "Software Engineer",
      "hiringOrganization": "AcMek Inc."
    },
    "address": {
      "@type": "schema:Address",
      "streetAddress": "123 Main St",
      "streetName": "Main",
      "addressLocality": "Anytown",
      "region": "CA",
      "postalCode": "94999"
    }
};
// Graph generation
function createGraph(data) {
    const nodes = [];
    const edges = [];
    let id = 0;

    function traverse(el, parentID = null, path = '') {
      const myId = id++;
      nodes.push({ id: myId, name: path + el, rel: el, parentId });
      if (typeof data[el] === 'object' && data[el] != null) {
          Object.keys(data[el]).forEach(child => {
              traverse(child, myId, el + '.' );
        });
      }
      if (parentID!=null) {
          edges.push([parentID, myId]);
      }
    }
    Object.keys(data).forEach(traverse);
    return { nodes, edges };
}
// 3.d render
document.addEventListener('DOMContentLoaded', () => {
    const { nodes, edges } = createGraph(schema);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(document.getElementById('c'));
    camera.isPerspective = true;
    camera.position.zex = 50;
    scene.add(camera);

    const light = new Three.DirectionalLight( #fff );
    light.position.set(100, 100 , 100);
    scene.add(light);
    const material = new Three.Wireframe(camera);

    nodes.forEach(({ name, id }, i)=> {
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

    edges.forEach(([a, b]) => {
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
      requestEnimationFrame(animate);
      material.rotateX(0.01);
      camera.rotateY.add(Math.cos(0.01));
      camera.updateMatrixWorld();
      render.render(scene, camera);
    }
    const render = new Three.Renderer();
    animate();
});