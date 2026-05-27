import * as THREE from "./vendor/three/three.module.js";
import { OrbitControls } from "./vendor/three/examples/jsm/controls/OrbitControls.js";

const SPHERE_COLORS = [
  0x8be3ff, 0x7f73ff, 0xff8bd2, 0xffd56a, 0x9dffb0, 0xff9b6a,
  0x6affea, 0x6aff8b, 0xc4a1ff, 0x7cffb2, 0xff7a9e, 0xb8c7ff,
];

export function createCompassScene(canvas, spheres) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
  camera.position.set(0, 2.4, 9);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 5;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;

  const ambient = new THREE.AmbientLight(0x9eb8ff, 0.55);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 8, 6);
  const rim = new THREE.PointLight(0x8be3ff, 1.4, 30);
  rim.position.set(-3, 2, -2);
  scene.add(ambient, key, rim);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 2),
    new THREE.MeshStandardMaterial({
      color: 0x8be3ff,
      emissive: 0x224466,
      metalness: 0.35,
      roughness: 0.25,
    }),
  );
  scene.add(core);

  const ringGroup = new THREE.Group();
  const orbitMeshes = [];
  const radius = 3.2;
  const step = (Math.PI * 2) / spheres.length;

  spheres.forEach((sphere, index) => {
    const angle = index * step - Math.PI / 2;
    const geo = new THREE.SphereGeometry(0.28, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: SPHERE_COLORS[index % SPHERE_COLORS.length],
      emissive: 0x111122,
      metalness: 0.5,
      roughness: 0.35,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    mesh.userData = { sphereId: sphere.id, slug: sphere.slug };
    ringGroup.add(mesh);
    orbitMeshes.push(mesh);

    const sprite = makeLabelSprite(`${sphere.icon}`);
    sprite.position.copy(mesh.position);
    sprite.position.y += 0.55;
    sprite.scale.set(0.9, 0.9, 0.9);
    ringGroup.add(sprite);
  });

  const orbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 64 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      }),
    ),
    new THREE.LineBasicMaterial({ color: 0x8be3ff, transparent: true, opacity: 0.25 }),
  );
  scene.add(orbitLine, ringGroup);

  const particles = makeParticles(420);
  scene.add(particles);

  let targetSpin = 0;
  let spinVelocity = 0;
  let highlightId = null;

  function makeLabelSprite(text) {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    ctx.font = "72px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    return new THREE.Sprite(mat);
  }

  function makeParticles(count) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x8be3ff, size: 0.04, transparent: true, opacity: 0.65 }),
    );
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function spinToSphereId(sphereId, extraTurns = 3) {
    const index = spheres.findIndex((s) => s.id === sphereId);
    if (index < 0) return;
    const stepAngle = (Math.PI * 2) / spheres.length;
    const targetAngle = -index * stepAngle + Math.PI / 2;
    targetSpin = extraTurns * Math.PI * 2 + targetAngle;
    spinVelocity = 0.14;
    controls.autoRotate = false;
    highlightId = sphereId;
  }

  function updateHighlight() {
    orbitMeshes.forEach((mesh) => {
      const active = mesh.userData.sphereId === highlightId;
      mesh.scale.setScalar(active ? 1.35 : 1);
      mesh.material.emissive.setHex(active ? 0x335577 : 0x111122);
    });
  }

  function tick() {
    requestAnimationFrame(tick);
    if (spinVelocity > 0.001) {
      const delta = Math.min(spinVelocity, targetSpin);
      ringGroup.rotation.y += delta;
      targetSpin -= delta;
      spinVelocity *= 0.985;
      if (targetSpin <= 0.02) {
        spinVelocity = 0;
        controls.autoRotate = true;
      }
    }
    core.rotation.y += 0.004;
    core.rotation.x += 0.002;
    particles.rotation.y += 0.0004;
    updateHighlight();
    controls.update();
    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener("resize", resize);
  tick();

  return { spinToSphereId, setHighlight: (id) => { highlightId = id; } };
}
