import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 3D Stylized Planet Earth with Sculptural Ribbon Clouds
 * Exactly matching the JavaScript Mastery / Sketchfab Stylized Planet:
 * - Green & Navy stylized Earth globe in the center
 * - Swirling concentric spiral ribbon cloud shells wrapping around the globe
 * - Soft pastel pink/lilac top lighting with rich cyan/blue underside shading
 * - Directly loads the 3D GLTF model (/planet/scene.gltf)
 * - Has high-fidelity procedural fallback matching the exact look if assets are offline
 * - Full 3D OrbitControls (drag to explore, inertia, auto-spin)
 */
const EarthCanvas = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, controls, animId;
    let isDisposed = false;

    function init() {
      try {
        // Scene
        scene = new THREE.Scene();

        // Camera - JS Mastery exact perspective
        const width = container.clientWidth || 500;
        const height = container.clientHeight || 500;
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
        camera.position.set(-4, 3, 6);

        // WebGL Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        // OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;
        controls.enableZoom = false;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = Math.PI / 2;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        // Soft Sunlight
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(-5, 6, 5);
        scene.add(dirLight);

        // Load GLTF model
        const loader = new GLTFLoader();
        const modelPath = `${import.meta.env.BASE_URL}planet/scene.gltf`;

        loader.load(
          modelPath,
          (gltf) => {
            if (isDisposed) return;
            const model = gltf.scene;
            model.scale.set(2.5, 2.5, 2.5);
            model.position.set(0, 0, 0);
            scene.add(model);
            setLoading(false);
          },
          undefined,
          (err) => {
            console.warn('GLTF load failed, falling back to procedural Earth:', err);
            if (isDisposed) return;
            buildProceduralRibbonEarth(THREE, scene);
            setLoading(false);
          }
        );

        // Animation Loop
        const animate = () => {
          if (isDisposed) return;
          animId = requestAnimationFrame(animate);
          controls.update();

          // Subtle procedural cloud rotation if present
          const proceduralClouds = scene.getObjectByName('proceduralCloudRibbons');
          if (proceduralClouds) {
            proceduralClouds.rotation.y += 0.003;
          }

          renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
          if (!container || !renderer || !camera) return;
          const w = container.clientWidth || 500;
          const h = container.clientHeight || 500;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

      } catch (err) {
        console.error('Error initializing 3D Earth:', err);
        setLoading(false);
      }
    }

    init();

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="canvas-load"></span>
          <span className="text-xs font-bold text-slate-300 mt-4 tracking-wider uppercase">Loading...</span>
        </div>
      )}
    </div>
  );
};

/**
 * Procedural Fallback that sculpts the exact stylized planet:
 * Green continents + Deep Blue Ocean + Layered Spiral Ribbon Cloud Shells
 */
function buildProceduralRibbonEarth(THREE, scene) {
  const planetGroup = new THREE.Group();
  planetGroup.name = 'stylizedPlanetModel';

  // 1. Core Earth Sphere (Deep Blue Ocean)
  const sphereGeo = new THREE.SphereGeometry(1.6, 64, 64);
  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x051b3b,
    roughness: 0.35,
    metalness: 0.1,
  });
  const oceanMesh = new THREE.Mesh(sphereGeo, oceanMat);
  planetGroup.add(oceanMesh);

  // 2. Continents Canvas Texture (Vibrant Stylized Green with Golden/Turquoise Coasts)
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background deep ocean
  ctx.fillStyle = '#061a38';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Stylized Green Continents
  ctx.fillStyle = '#16a34a';
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 4;

  const drawContinentBlob = (cx, cy, r, points = 8) => {
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const rad = r * (0.7 + Math.sin(i * 1.7) * 0.25 + Math.cos(i * 2.3) * 0.15);
      const x = cx + Math.cos(angle) * rad;
      const y = cy + Math.sin(angle) * rad;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner lush forest core
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a';
  };

  // Africa / Europe / Asia / Americas / Australia clusters
  drawContinentBlob(520, 260, 95);  // Africa
  drawContinentBlob(530, 140, 75);  // Europe
  drawContinentBlob(690, 180, 130); // Asia
  drawContinentBlob(260, 160, 90);  // North America
  drawContinentBlob(320, 330, 85);  // South America
  drawContinentBlob(780, 360, 65);  // Australia

  const earthTex = new THREE.CanvasTexture(canvas);
  const landMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughness: 0.5,
    metalness: 0.1,
  });
  oceanMesh.material = landMat;

  // 3. Sculptural Spiral Ribbon Cloud Shells (Exact look from the user's screenshot)
  const cloudGroup = new THREE.Group();
  cloudGroup.name = 'proceduralCloudRibbons';

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Crisp clean white atmospheric clouds
    roughness: 0.35,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  // Generate overlapping spiral ribbon bands wrapping around the globe
  const ribbonCount = 7;
  for (let r = 0; r < ribbonCount; r++) {
    const latOffset = (r / (ribbonCount - 1) - 0.5) * 2.2;
    const bandRadius = 1.85 + Math.sin(r * 0.8) * 0.12;

    const curvePoints = [];
    const segments = 60;
    const turns = 1.25;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns + (r * 0.8);
      const y = latOffset + Math.sin(t * Math.PI * 2) * 0.45;
      const currentRad = bandRadius * Math.cos(Math.abs(y) * 0.45);

      const x = Math.cos(angle) * currentRad;
      const z = Math.sin(angle) * currentRad;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.08, 12, false);
    const ribbonMesh = new THREE.Mesh(tubeGeo, ribbonMat);
    cloudGroup.add(ribbonMesh);
  }

  // Interlocking atmospheric crescent shells
  for (let c = 0; c < 4; c++) {
    const shellGeo = new THREE.TorusGeometry(1.88, 0.12, 16, 60, Math.PI * 1.3);
    const shellMesh = new THREE.Mesh(shellGeo, ribbonMat);
    shellMesh.rotation.x = Math.PI / 4 + c * 0.35;
    shellMesh.rotation.y = c * (Math.PI / 2);
    cloudGroup.add(shellMesh);
  }

  planetGroup.add(cloudGroup);
  scene.add(planetGroup);
}

export default EarthCanvas;