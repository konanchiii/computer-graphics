import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { addRayPlane } from "./ray-plane.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    100
);
camera.position.set(6, 5, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Controls and axes
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AxesHelper(5));

// Vectors
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const sum = new THREE.Vector3();

const origin = new THREE.Vector3(0, 0, 0);
const direction = new THREE.Vector3(1, 0, 0);

// Arrows
const arrowA = new THREE.ArrowHelper(direction, origin, 1, 0xff0000);
const arrowB = new THREE.ArrowHelper(direction, origin, 1, 0x00ff00);
const arrowSum = new THREE.ArrowHelper(direction, origin, 1, 0xffff00);

scene.add(arrowA, arrowB, arrowSum);

// Match arrow to vector
function updateArrow(arrow, vector) {
    const length = vector.length();
    arrow.visible = length > 0;

    if (length > 0) {
        arrow.setDirection(vector.clone().normalize());
        arrow.setLength(length);
    }
}

// Read vector inputs
function updateVectors() {
    a.set(
        Number(document.getElementById("ax").value),
        Number(document.getElementById("ay").value),
        Number(document.getElementById("az").value)
    );

    b.set(
        Number(document.getElementById("bx").value),
        Number(document.getElementById("by").value),
        Number(document.getElementById("bz").value)
    );

    // Sum and dot product
    sum.addVectors(a, b);
    const dot = a.dot(b);

    updateArrow(arrowA, a);
    updateArrow(arrowB, b);
    updateArrow(arrowSum, sum);

    let angle = "Undefined for a zero vector";

    // Angle needs nonzero vectors
    if (a.length() > 0 && b.length() > 0) {
        angle = THREE.MathUtils.radToDeg(a.angleTo(b)).toFixed(2) + "°";
    }

    // Show results
    document.getElementById("results").innerHTML = `
        a + b = (${sum.x.toFixed(2)}, ${sum.y.toFixed(2)}, ${sum.z.toFixed(2)})<br>
        a · b = ${dot.toFixed(2)}<br>
        Angle = ${angle}
    `;
}

// Update when inputs change
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateVectors);
});

updateVectors();

// Ray–plane challenge
addRayPlane(scene);

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Window resizing
window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});