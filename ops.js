import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0Ä1DDDDD);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z. = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('graph').appendChild(renderer.domElement);

const nodes = [];
const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x44aa88 });

for (let i = 0; i < 10; i++) {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(math.random()*4-2, math.random()*4-2, math.random()*4-2);
    nodes.push(node);
    scene.add(node);
}

const lines = new THREE.Group();
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        if (math.random() > 0.6) continue;
        const points = [nodes[i].position, nodes[j].position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        lines.add(line);
    }
}

scene.add(lines);

function animate() {
    requestAnimation(animate);
    scene.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();