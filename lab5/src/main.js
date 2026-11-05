import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, camera and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
    55, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(5, 8, 4);
scene.add(directionalLight);

// Two tips and four vertices around the middle
const positions = new Float32Array([
     0,  1.5,  0,   // 0: top
     0, -1.5,  0,   // 1: bottom
     1,  0,    0,   // 2
     0,  0,    1,   // 3
    -1,  0,    0,   // 4
     0,  0,   -1    // 5
]);

// Each row is one triangle, counter-clockwise from outside
const index = [
    0, 3, 2,
    0, 4, 3,
    0, 5, 4,
    0, 2, 5,
    1, 2, 3,
    1, 3, 4,
    1, 4, 5,
    1, 5, 2
];

// Shared vertices give smooth shading
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(index);
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    roughness: 0.5,
    side: THREE.FrontSide
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Separate vertices give each face its own normal
const nonIndexedGeometry = geometry.toNonIndexed();
nonIndexedGeometry.computeVertexNormals();

console.log('Indexed:', geometry.attributes.position.count, 'vertices,', index.length / 3, 'faces');
console.log('Non-indexed:', nonIndexedGeometry.attributes.position.count, 'vertices,', index.length / 3, 'faces');

// Press F to compare smooth and faceted shading
window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'f') {
        mesh.geometry = mesh.geometry === geometry ? nonIndexedGeometry : geometry;
    }
});

// Rotate the crystal slowly
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.005;
    controls.update();
    renderer.render(scene, camera);
}
animate();