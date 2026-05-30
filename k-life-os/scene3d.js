import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function init3D(containerId, spheresData, onSphereClick) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05050f);
    scene.fog = new THREE.FogExp2(0x05050f, 0.02);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);

    // Світло
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 3, 2);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x3366cc, 0.6);
    backLight.position.set(-1, 1, -2);
    scene.add(backLight);
    const fillLight = new THREE.PointLight(0xffaa66, 0.4);
    fillLight.position.set(1, 1, 1);
    scene.add(fillLight);

    // Центральне ядро
    const coreGeo = new THREE.SphereGeometry(0.55, 64, 64);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xffaa55, emissive: 0xff4400, emissiveIntensity: 0.4 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Частинки
    const particleCount = 800;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i*3] = (Math.random() - 0.5) * 30;
        particlePositions[i*3+1] = (Math.random() - 0.5) * 18;
        particlePositions[i*3+2] = (Math.random() - 0.5) * 25 - 10;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.07, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    const colors = [0xff3366, 0x33ff66, 0x3366ff, 0xffdd44, 0xff44ff, 0x44ffdd, 0xff8844, 0x88ff44, 0x44aaff, 0xff44aa, 0xaaff44, 0x44ffaa];
    const orbitRadius = 2.8;
    const spheres = [];

    spheresData.forEach((sphere, idx) => {
        const angle = (idx / spheresData.length) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;

        const geometry = new THREE.SphereGeometry(0.42, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: colors[idx % colors.length],
            emissive: 0x222222,
            emissiveIntensity: 0.2,
            metalness: 0.5,
            roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 0, z);
        mesh.userData = { id: sphere.id, sphereData: sphere };
        scene.add(mesh);
        spheres.push(mesh);

        // Спрайт
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px "Segoe UI", "Poppins"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sphere.icon || '●', 32, 32);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(0.7, 0.7, 0.7);
        sprite.position.set(x, 0.75, z);
        scene.add(sprite);
        mesh.userData.sprite = sprite;

        // Лінія
        const linePoints = [new THREE.Vector3(0, 0, 0), mesh.position.clone()];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x88aaff, transparent: true, opacity: 0.4 });
        const line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
    });

    // Кільце
    const ringPoints = [];
    for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(a) * (orbitRadius + 0.25), 0, Math.sin(a) * (orbitRadius + 0.25)));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({ color: 0x44aaff });
    const ring = new THREE.LineLoop(ringGeo, ringMat);
    scene.add(ring);

    // Клік
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(spheres);
        if (intersects.length > 0) {
            const sphereId = intersects[0].object.userData.id;
            if (onSphereClick) onSphereClick(sphereId);
            spheres.forEach(s => {
                const active = s.userData.id === sphereId;
                s.material.emissiveIntensity = active ? 0.8 : 0.1;
                s.scale.setScalar(active ? 1.2 : 1);
            });
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        particles.rotation.y += 0.0005;
        ring.rotation.y += 0.002;
        core.rotation.y += 0.005;
        core.rotation.x += 0.003;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });

    return {
        setHighlight: (id) => {
            spheres.forEach(s => {
                s.material.emissiveIntensity = (s.userData.id === id) ? 0.8 : 0.1;
                s.scale.setScalar((s.userData.id === id) ? 1.2 : 1);
            });
        },
        spinToSphereId: (id) => {
            spheres.forEach(s => {
                s.material.emissiveIntensity = (s.userData.id === id) ? 0.8 : 0.1;
            });
        },
        setAutoRotate: (enabled) => { controls.autoRotate = enabled; }
    };
}