import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000);
camera.position.set(0, 1, 4);

// Renderer
const renderer = new THREE.WebGLRenderer;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*const cube=new THREE.Mesh(
    new THREE.BoxGeometry(1.5,4,1.5),
    new THREE.MeshStandardMaterial({ color: 0xFFC0CB })
);
scene.add(cube); */

// Wireframe sphere
const geometry = new THREE.SphereGeometry(1, 30, 30);
const material = new THREE.MeshBasicMaterial({ color: 0xFF69B4 });
const sphere = new THREE.Mesh(geometry, material);
sphere.material.wireframe = true;
scene.add(sphere);


// Ambient lighting
const light = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(light);

// Mouse controls and timer
const control = new OrbitControls(camera, renderer.domElement);
const timer =  new THREE.Timer();

// Rotate each frame
function animate() {
    requestAnimationFrame(animate);
    timer.update();
    const dt = timer.getDelta();
    sphere.rotation.x += dt * 0.5;
    sphere.rotation.y += dt * 0.5;

    control.update();
    renderer.render(scene, camera);
}
animate();

// Resize the view
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
