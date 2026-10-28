import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * TurbulentHero3D
 * Recreates the turbulent.ca 3D isometric machine aesthetic with Electrical & ICT circuitry:
 * - Matte cobalt/navy architectural monoliths with teal/cyan rim lighting
 * - Upper wireframe containment cube housing a radiant golden-amber energy core
 * - Horn emitter, central conical intake funnel, and curved industrial conduit pipes
 * - L-shaped ribbed circuit conveyor track with scroll-driven traveling energy pulses
 * - Side-mounted rotary substation turbine wheel with bolt holes that spins on scroll
 * - Etched PCB circuit traces & pegboard matrix that energize as the user scrolls
 */
export const TurbulentHero3D = ({ scrollProgress = 0 }) => {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, animId;
    let isDisposed = false;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const init = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      scene = new THREE.Scene();

      // Isometric-feel low-FOV Perspective Camera positioned to frame the machine on the right
      camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 200);
      camera.position.set(16, 14.5, 18);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // ====================================================
      // MATERIALS (Turbulent Cobalt/Navy + Teal + Amber Core)
      // ====================================================
      const cobaltMat = new THREE.MeshStandardMaterial({
        color: 0x132b59,
        roughness: 0.62,
        metalness: 0.18
      });

      const darkCobaltMat = new THREE.MeshStandardMaterial({
        color: 0x0a1836,
        roughness: 0.7,
        metalness: 0.22
      });

      const accentBlueMat = new THREE.MeshStandardMaterial({
        color: 0x1c3f7a,
        roughness: 0.5,
        metalness: 0.28
      });

      const trackSlatMat = new THREE.MeshStandardMaterial({
        color: 0x264b82,
        roughness: 0.42,
        metalness: 0.45
      });

      const wireframeEdgeMat = new THREE.LineBasicMaterial({
        color: 0x4f75b8,
        transparent: true,
        opacity: 0.85
      });

      const circuitTraceMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65
      });

      const coreSphereMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00
      });

      const glowingPadMat = new THREE.MeshBasicMaterial({
        color: 0xffcc33
      });

      // ====================================================
      // LIGHTING (Deep Navy Ambient + Teal Rim + Golden Core)
      // ====================================================
      const ambientLight = new THREE.AmbientLight(0x0d2149, 2.2);
      scene.add(ambientLight);

      // Cool key directional light from top-left
      const keyLight = new THREE.DirectionalLight(0x4f8df7, 2.4);
      keyLight.position.set(-12, 20, 10);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Aqua/Teal rim light hitting the left monolith face (signature Turbulent gradient)
      const tealLight = new THREE.PointLight(0x14b8a6, 18, 16, 1.5);
      tealLight.position.set(-3.8, 3.2, 3.5);
      scene.add(tealLight);

      // Deep indigo fill from bottom-right
      const fillLight = new THREE.DirectionalLight(0x1e3a8a, 1.5);
      fillLight.position.set(14, -8, 12);
      scene.add(fillLight);

      // ====================================================
      // BUILD 3D ISOMETRIC MACHINE GROUP
      // ====================================================
      const machineGroup = new THREE.Group();
      // Shift machine to the right side on desktop so left editorial text has breathing room
      const updateMachineOffset = (w) => {
        if (w >= 1024) {
          machineGroup.position.set(3.1, -1.2, 0);
          machineGroup.scale.setScalar(1.0);
        } else if (w >= 640) {
          machineGroup.position.set(1.8, -1.5, 0);
          machineGroup.scale.setScalar(0.85);
        } else {
          machineGroup.position.set(0.6, -2.0, 0);
          machineGroup.scale.setScalar(0.68);
        }
      };
      updateMachineOffset(width);
      scene.add(machineGroup);

      // 1. Main Upper Deck Platform & Lower Substructure
      const mainBaseGeo = new THREE.BoxGeometry(7.2, 4.2, 7.2);
      const mainBase = new THREE.Mesh(mainBaseGeo, cobaltMat);
      mainBase.position.set(0, -1.6, 0);
      mainBase.castShadow = true;
      mainBase.receiveShadow = true;
      machineGroup.add(mainBase);

      // Recessed Inner Courtyard Pit
      const pitWallBack = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.4, 0.8), darkCobaltMat);
      pitWallBack.position.set(0.3, 0.8, -1.6);
      machineGroup.add(pitWallBack);

      const pitFloor = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.3, 4.4), darkCobaltMat);
      pitFloor.position.set(0.3, 0.55, 0.2);
      machineGroup.add(pitFloor);

      // Conical Intake Funnel / Hopper inside Courtyard
      const funnelGeo = new THREE.CylinderGeometry(1.45, 0.38, 1.35, 36, 1, true);
      const funnelMat = new THREE.MeshStandardMaterial({
        color: 0x0b1d42,
        roughness: 0.45,
        metalness: 0.35,
        side: THREE.DoubleSide
      });
      const funnelMesh = new THREE.Mesh(funnelGeo, funnelMat);
      funnelMesh.position.set(0.35, 0.95, 0.35);
      machineGroup.add(funnelMesh);

      const funnelRimGeo = new THREE.TorusGeometry(1.45, 0.07, 16, 48);
      const funnelRim = new THREE.Mesh(funnelRimGeo, accentBlueMat);
      funnelRim.rotation.x = Math.PI / 2;
      funnelRim.position.set(0.35, 1.62, 0.35);
      machineGroup.add(funnelRim);

      // 2. Tall Left Monolith Tower (Stepped Server/Substation Column)
      const towerBody = new THREE.Mesh(new THREE.BoxGeometry(1.85, 5.2, 1.85), cobaltMat);
      towerBody.position.set(-1.95, 2.4, 0.45);
      towerBody.castShadow = true;
      towerBody.receiveShadow = true;
      machineGroup.add(towerBody);

      const towerCap = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.75, 1.45), accentBlueMat);
      towerCap.position.set(-1.95, 5.35, 0.45);
      towerCap.castShadow = true;
      machineGroup.add(towerCap);

      // Back Secondary Tower & Acoustic/EMP Horn Emitter
      const backTower = new THREE.Mesh(new THREE.BoxGeometry(1.7, 3.8, 1.7), cobaltMat);
      backTower.position.set(-1.2, 2.1, -1.9);
      backTower.castShadow = true;
      machineGroup.add(backTower);

      // Curved Horn / Waveguide Emitter feeding the Containment Cube
      const hornCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.95, 1.6, 32, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x153268,
          roughness: 0.4,
          metalness: 0.35,
          side: THREE.DoubleSide
        })
      );
      hornCone.rotation.z = Math.PI / 2;
      hornCone.rotation.y = -0.25;
      hornCone.position.set(-0.05, 4.15, -1.65);
      machineGroup.add(hornCone);

      const hornRim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 16, 36), accentBlueMat);
      hornRim.rotation.y = Math.PI / 2 - 0.25;
      hornRim.position.set(0.7, 4.15, -1.45);
      machineGroup.add(hornRim);

      // 3. Upper Pedestal + Wireframe Containment Cube + Glowing Golden Energy Core
      const cubePedestal = new THREE.Mesh(new THREE.BoxGeometry(2.15, 2.6, 2.15), cobaltMat);
      cubePedestal.position.set(1.45, 1.8, -1.45);
      cubePedestal.castShadow = true;
      cubePedestal.receiveShadow = true;
      machineGroup.add(cubePedestal);

      // Wireframe Containment Cube (3D thick frame + line edges)
      const cageSize = 1.95;
      const cageCenter = new THREE.Vector3(1.45, 4.1, -1.45);
      const cageGroup = new THREE.Group();
      cageGroup.position.copy(cageCenter);
      machineGroup.add(cageGroup);

      const cageBoxGeo = new THREE.BoxGeometry(cageSize, cageSize, cageSize);
      const cageEdges = new THREE.EdgesGeometry(cageBoxGeo);
      const cageLines = new THREE.LineSegments(cageEdges, wireframeEdgeMat);
      cageGroup.add(cageLines);

      // Thin metallic struts for the containment cube
      const strutGeo = new THREE.BoxGeometry(cageSize, 0.06, 0.06);
      const vStrutGeo = new THREE.BoxGeometry(0.06, cageSize, 0.06);
      const zStrutGeo = new THREE.BoxGeometry(0.06, 0.06, cageSize);
      const half = cageSize / 2;
      for (const sx of [-half, half]) {
        for (const sy of [-half, half]) {
          const s1 = new THREE.Mesh(strutGeo, accentBlueMat);
          s1.position.set(0, sx, sy);
          cageGroup.add(s1);

          const s2 = new THREE.Mesh(vStrutGeo, accentBlueMat);
          s2.position.set(sx, 0, sy);
          cageGroup.add(s2);

          const s3 = new THREE.Mesh(zStrutGeo, accentBlueMat);
          s3.position.set(sx, sy, 0);
          cageGroup.add(s3);
        }
      }

      // Glowing Floor Pad inside Containment Cube
      const padMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.95), glowingPadMat);
      padMesh.position.set(0, -half + 0.04, 0);
      cageGroup.add(padMesh);

      // Radiant Golden Energy Core Sphere + PointLight
      const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 32), coreSphereMat);
      coreSphere.position.set(0, -0.25, 0);
      cageGroup.add(coreSphere);

      // Outer subtle golden halo sphere
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.25
      });
      const coreHalo = new THREE.Mesh(new THREE.SphereGeometry(0.68, 32, 32), haloMat);
      coreSphere.add(coreHalo);

      const coreLight = new THREE.PointLight(0xff9900, 22, 12, 1.4);
      coreLight.position.set(0, 0.1, 0);
      coreLight.castShadow = true;
      cageGroup.add(coreLight);

      // 4. L-Shaped Ribbed Circuit Conveyor Track
      // Leg A: From Containment Cube (1.45, 3.12, -0.45) to Front-Right Corner (2.85, 0.65, 2.65)
      // Sloping down along the right deck, then running flat along the front deck
      const trackGroup = new THREE.Group();
      machineGroup.add(trackGroup);

      // Right elevated ramp block supporting the conveyor
      const rightDeck = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 4.8), cobaltMat);
      rightDeck.position.set(2.55, 0.7, 0.35);
      rightDeck.castShadow = true;
      rightDeck.receiveShadow = true;
      machineGroup.add(rightDeck);

      // Front elevated ledge supporting the lower conveyor leg
      const frontDeck = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 1.35), cobaltMat);
      frontDeck.position.set(0.65, 0.35, 2.65);
      frontDeck.castShadow = true;
      frontDeck.receiveShadow = true;
      machineGroup.add(frontDeck);

      // Create ribbed conveyor slats along Leg 1 (Z: -0.9 to 2.65 at X: 2.55) and Leg 2 (X: 2.55 to -1.6 at Z: 2.65)
      const slats = [];
      const slatGeo1 = new THREE.BoxGeometry(0.78, 0.08, 0.12);
      for (let i = 0; i < 22; i++) {
        const t = i / 21;
        const z = -0.85 + t * 3.5;
        const y = 3.1 - t * 2.08;
        const slat = new THREE.Mesh(slatGeo1, trackSlatMat);
        slat.position.set(2.55, y, z);
        slat.rotation.x = 0.52;
        trackGroup.add(slat);
        slats.push({ mesh: slat, basePos: slat.position.clone(), index: i });
      }

      const slatGeo2 = new THREE.BoxGeometry(0.12, 0.08, 0.78);
      for (let i = 0; i < 24; i++) {
        const t = i / 23;
        const x = 2.55 - t * 3.9;
        const slat = new THREE.Mesh(slatGeo2, trackSlatMat);
        slat.position.set(x, 1.02, 2.65);
        trackGroup.add(slat);
        slats.push({ mesh: slat, basePos: slat.position.clone(), index: 22 + i });
      }

      // Traveling Data/Energy Packet Sphere that rides along the conveyor track on scroll
      const packetSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      const packetLight = new THREE.PointLight(0x38bdf8, 8, 5);
      packetSphere.add(packetLight);
      machineGroup.add(packetSphere);

      // 5. Side Rotary Substation Turbine Wheel (Front-Right Wall, exact match to Turbulent screenshot)
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(3.68, -0.55, 1.35);
      wheelGroup.rotation.y = Math.PI / 2;
      machineGroup.add(wheelGroup);

      const wheelDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(1.38, 1.38, 0.32, 40),
        accentBlueMat
      );
      wheelDisc.rotation.x = Math.PI / 2;
      wheelDisc.castShadow = true;
      wheelGroup.add(wheelDisc);

      const wheelHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.44, 24),
        cobaltMat
      );
      wheelHub.rotation.x = Math.PI / 2;
      wheelGroup.add(wheelHub);

      const wheelCoreDot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.5, 16),
        darkCobaltMat
      );
      wheelCoreDot.rotation.x = Math.PI / 2;
      wheelGroup.add(wheelCoreDot);

      // Radial Bolt Holes around the Turbine Disc
      const holeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.36, 12);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const hole = new THREE.Mesh(holeGeo, darkCobaltMat);
        hole.rotation.x = Math.PI / 2;
        hole.position.set(Math.cos(angle) * 0.92, Math.sin(angle) * 0.92, 0);
        wheelGroup.add(hole);
      }

      // 6. Left Escalator / Stepped Conduit Ramp & Pegboard Circuit Matrix
      const leftRamp = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.4, 2.2), cobaltMat);
      leftRamp.position.set(-3.1, -1.35, 1.9);
      leftRamp.rotation.z = 0.42;
      machineGroup.add(leftRamp);

      // Pegboard / Patch Panel Matrix on Lower Front Wall
      const pegBoard = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.8, 0.15), accentBlueMat);
      pegBoard.position.set(-0.55, -2.15, 3.62);
      machineGroup.add(pegBoard);

      const pegGeo = new THREE.SphereGeometry(0.055, 8, 8);
      const pegDots = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 6; c++) {
          const isGlowing = (r + c) % 3 === 0;
          const pegMat = new THREE.MeshBasicMaterial({
            color: isGlowing ? 0x38bdf8 : 0x09152e
          });
          const peg = new THREE.Mesh(pegGeo, pegMat);
          peg.position.set(-1.3 + c * 0.3, -1.65 - r * 0.34, 3.72);
          machineGroup.add(peg);
          if (isGlowing) pegDots.push(peg);
        }
      }

      // 7. Industrial Curved Conduit Pipes on Lower Right
      const pipeCurve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.8, -1.6, 3.4),
        new THREE.Vector3(2.8, -2.5, 3.9),
        new THREE.Vector3(2.8, -3.7, 3.9)
      ]);
      const pipeMesh1 = new THREE.Mesh(
        new THREE.TubeGeometry(pipeCurve1, 24, 0.28, 16, false),
        cobaltMat
      );
      machineGroup.add(pipeMesh1);

      // 8. Glowing PCB Circuitry Traces Etched Across the Isometric Machine
      const circuitLines = [
        [
          new THREE.Vector3(-1.95, 5.0, 1.39),
          new THREE.Vector3(-1.95, 2.2, 1.39),
          new THREE.Vector3(-1.2, 1.4, 1.39)
        ],
        [
          new THREE.Vector3(-2.35, 4.6, 1.39),
          new THREE.Vector3(-2.35, 1.6, 1.39)
        ],
        [
          new THREE.Vector3(-1.55, 4.6, 1.39),
          new THREE.Vector3(-1.55, 2.8, 1.39)
        ],
        [
          new THREE.Vector3(-1.3, 0.98, 3.35),
          new THREE.Vector3(2.4, 0.98, 3.35),
          new THREE.Vector3(2.8, 0.5, 3.35)
        ]
      ];

      circuitLines.forEach((pts) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, circuitTraceMat);
        machineGroup.add(line);
      });

      // ====================================================
      // ANIMATION & SCROLL INTERACTION LOOP
      // ====================================================
      const clock = new THREE.Clock();

      const animate = () => {
        if (isDisposed) return;
        animId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        const prog = scrollRef.current; // 0 to 1 across the sticky hero scroll

        // Smooth pointer interpolation
        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;

        // 1. Scroll-driven Isometric Rotation & Camera Framing
        const targetRotY = -0.18 + prog * 0.58 + pointer.x * 0.14;
        const targetRotX = prog * 0.12 + pointer.y * 0.08;
        machineGroup.rotation.y += (targetRotY - machineGroup.rotation.y) * 0.1;
        machineGroup.rotation.x += (targetRotX - machineGroup.rotation.x) * 0.1;

        // Subtle camera vertical pan following the energy flow from top cube to lower plant
        const targetCamY = 14.5 - prog * 2.4;
        const targetCamZ = 18.0 - prog * 1.6;
        camera.position.y += (targetCamY - camera.position.y) * 0.08;
        camera.position.z += (targetCamZ - camera.position.z) * 0.08;
        camera.lookAt(0.8, 0.8 - prog * 1.1, 0);

        // 2. Golden Energy Core Hover & Pulse inside Wireframe Cube
        const corePulse = Math.sin(elapsed * 3.2) * 0.08;
        coreSphere.position.y = -0.22 + corePulse + prog * 0.18;
        coreHalo.scale.setScalar(1 + Math.sin(elapsed * 4.5) * 0.12 + prog * 0.2);
        coreLight.intensity = 20 + Math.sin(elapsed * 4.0) * 4 + prog * 10;

        // 3. Traveling Data/Energy Packet along the L-shaped Conveyor Track
        // Loops continuously + accelerates with scroll progress
        const trackProgress = (elapsed * 0.22 + prog * 1.4) % 1;
        if (trackProgress < 0.5) {
          const lt = trackProgress / 0.5;
          packetSphere.position.set(2.55, 3.18 - lt * 2.08, -0.85 + lt * 3.5);
        } else {
          const lt = (trackProgress - 0.5) / 0.5;
          packetSphere.position.set(2.55 - lt * 3.9, 1.12, 2.65);
        }

        // 4. Side Rotary Substation Turbine Wheel Spins with Scroll + Idle Clock
        wheelGroup.rotation.z = -(elapsed * 0.45 + prog * Math.PI * 3.5);

        // 5. Wave Ripple along Conveyor Slats
        for (let i = 0; i < slats.length; i++) {
          const s = slats[i];
          const wave = Math.sin(elapsed * 4 - i * 0.35 + prog * 10);
          s.mesh.position.y = s.basePos.y + Math.max(0, wave) * 0.045;
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        updateMachineOffset(w);
      };

      const handleMouseMove = (e) => {
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        pointer.targetX = (e.clientX / vw - 0.5) * 2;
        pointer.targetY = (e.clientY / vh - 0.5) * 2;
      };

      const handleTouchMove = (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const vw = window.innerWidth || 1;
        const vh = window.innerHeight || 1;
        pointer.targetX = (e.touches[0].clientX / vw - 0.5) * 2;
        pointer.targetY = (e.touches[0].clientY / vh - 0.5) * 2;
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    };

    const cleanupListeners = init();

    return () => {
      isDisposed = true;
      if (cleanupListeners) cleanupListeners();
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D isometric electrical and ICT engineering plant"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-[1]"
    />
  );
};

export default TurbulentHero3D;
