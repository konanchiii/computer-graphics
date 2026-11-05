import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const aspect = window.innerWidth / window.innerHeight;

// Perspective camera
const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
perspective.position.set(2, 2, 10);
perspective.lookAt(0, 0, 0);

// Orthographic camera
const size = 8;
const orthographic = new THREE.OrthographicCamera(
    -size * aspect, size * aspect,
    size, -size,
    0.1, 100
);
orthographic.position.set(0, 0, 10);
orthographic.lookAt(0, 0, 0);

// Press Space to switch cameras
const cameras = [perspective, orthographic];
let current = 0;
console.log('Active: PerspectiveCamera');

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (event.repeat) return;

        current = current === 0 ? 1 : 0;
        console.log('Active:', cameras[current].type);
    }
});

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.35);
const directional = new THREE.DirectionalLight(0xffffff, 2.5);
scene.add(ambient, directional);

// One color and depth for each copy of the model
const depths = [2, 0, -2];
const colors = [0xdb8787, 0x77aa77, 0x7799dd];

new PLYLoader().load('/models/3D.ply', (geometry) => {
    geometry.center();
    if (!geometry.hasAttribute('normal')) {
        geometry.computeVertexNormals();
    }

    for (let i = 0; i < depths.length; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: colors[i],
            roughness: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(0.02);
        mesh.rotation.x = Math.PI / 2;

        // Separate the copies horizontally and place each at its own depth
        mesh.position.set((i - 1) * 4, 0, depths[i]);
        scene.add(mesh);
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, cameras[current]);
}

animate();