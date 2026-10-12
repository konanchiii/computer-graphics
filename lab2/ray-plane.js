import * as THREE from "three";

export function addRayPlane(scene) {
    const results = document.getElementById("ray-results");

    // Plane: n · p = d
    const n = new THREE.Vector3(0, 1, 0);
    const p0 = new THREE.Vector3(0, 0, 0);
    const d = n.dot(p0);

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 12),
        new THREE.MeshBasicMaterial({
            color: 0x2a3140,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        })
    );

    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    floor.updateMatrixWorld(true);

    const grid = new THREE.GridHelper(12, 12);
    scene.add(grid);

    // Ray origin and direction
    const o = new THREE.Vector3(2, 5, 1);
    const dir = new THREE.Vector3(0.3, -1, 0.1).normalize();

    // Intersection formula
    const denominator = n.dot(dir);

    if (Math.abs(denominator) < 0.000001) {
        results.textContent = "Ray is parallel: no unique intersection.";
        return;
    }

    const t = (d - n.dot(o)) / denominator;

    if (t < 0) {
        results.textContent = "Intersection is behind the ray.";
        return;
    }

    const hit = o.clone().addScaledVector(dir, t);

    // Draw ray to intersection
    const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([o, hit]),
        new THREE.LineBasicMaterial({ color: 0xff4422 })
    );
    scene.add(line);

    // Mark intersection
    const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18),
        new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    dot.position.copy(hit);
    scene.add(dot);

    // Compare with Three.js Raycaster
    const raycaster = new THREE.Raycaster(o, dir);
    const intersection = raycaster.intersectObject(floor)[0];

    if (!intersection) {
        results.textContent = "Raycaster did not hit the finite floor.";
        return;
    }

    const difference = hit.distanceTo(intersection.point);

    results.innerHTML = `
        Formula: ${hit.toArray().map(x => x.toFixed(3)).join(", ")}<br>
        Raycaster: ${intersection.point.toArray().map(x => x.toFixed(3)).join(", ")}<br>
        Results match: ${difference < 0.000001 ? "Yes" : "No"}
    `;

    console.log("Our formula:", hit.toArray());
    console.log("Raycaster:", intersection.point.toArray());
}