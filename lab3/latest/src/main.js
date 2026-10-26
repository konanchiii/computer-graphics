import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(5, 6, 7)
// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// Sun and ambient lighting
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

// Sun
const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0XFFA500 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

// Earth orbit pivot
const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)


// Earth
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)

// Moon orbits Earth
const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X808080, roughness: 0.9 })
)
moon.position.x = 1.8
moonOrbit.add(moon)

// Mars orbit pivot
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit)

// Mars
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xc1440e, roughness: 0.9 })
)
mars.position.x = 9
marsOrbit.add(mars)

// Phobos orbits Mars
const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit)

const phobos = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0x9b8877, roughness: 1 })
)
// Stretch the moon
phobos.scale.set(1.4, 0.9, 1)
phobos.position.x = 1.2
phobosOrbit.add(phobos)

// Mouse controls
const control = new OrbitControls(camera, renderer.domElement);
// Animate orbits and spins
function animate() {
    requestAnimationFrame(animate)
    control.update()
    earthOrbit.rotation.y += 0.01
    moonOrbit.rotation.y += 0.04
    earth.rotation.y += 0.05

    marsOrbit.rotation.y += 0.006
    phobosOrbit.rotation.y += 0.06
    mars.rotation.y += 0.009

    // Spin the sun
    sun.rotation.y += 0.003
    renderer.render(scene, camera)
}
animate()


