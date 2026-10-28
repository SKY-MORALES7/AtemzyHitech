import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * TurbulentHero3D
 * Scrollytelling 3D isometric engineering machine inspired by turbulent.ca with Atemzy Hitech
 * electrical/circuitry details:
 * - Aligns flush to the right edge of the viewport.
 * - Intro drop animation when loading finishes (00:09 -> 00:11 in recording).
 * - Stage 1 (Scroll 0.00 -> 0.35): Upper Isometric Deck — wireframe containment cube, glowing floor pad,
 *   tall teal-lit monolith with glowing amber portal, flat L-shaped conveyor belt (ball never sinks into concrete),
 *   side rotary flange wheel, and central conical funnel.
 * - Stage 2 (Scroll 0.35 -> 0.68): Mid-level Cylindrical Porthole Chamber & Curved Dual-Rail Pipe Track on the right
 *   where the energy pulse travels along the parallel pipes while the camera pans down.
 * - Stage 3 (Scroll 0.68 -> 1.00): Lower Cobalt L-Terrace & 2-Tier Rotating Cog/Gear Socket Cylinder with glowing
 *   cyan core and meshed auxiliary circuit gear that actively rotate as the golden ball descends and hovers into place.
 */
export const TurbulentHero3D = ({ scrollProgress = 0, isLoaded = true, onReady }) => {
  const mountRef = useRef(null);
  const scrollRef = useRef(scrollProgress);
  const loadedRef = useRef(isLoaded);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    loadedRef.current = isLoaded;
  }, [isLoaded]);

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

      // Narrow-FOV isometric perspective camera
      camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 300);
      camera.position.set(24, 20, 24);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // ====================================================
      // MATERIALS
      // ====================================================
      const cobaltMat = new THREE.MeshStandardMaterial({
        color: 0x112a5c,
        roughness: 0.58,
        metalness: 0.16
      });

      const deepCobaltMat = new THREE.MeshStandardMaterial({
        color: 0x071533,
        roughness: 0.72,
        metalness: 0.2
      });

      const royalBlueMat = new THREE.MeshStandardMaterial({
        color: 0x1a3f82,
        roughness: 0.48,
        metalness: 0.26
      });

      const tealWallMat = new THREE.MeshStandardMaterial({
        color: 0x1d5c70,
        roughness: 0.5,
        metalness: 0.18
      });

      const brightTealBlockMat = new THREE.MeshStandardMaterial({
        color: 0x2b8a8e,
        roughness: 0.44,
        metalness: 0.15
      });

      const trackSlatMat = new THREE.MeshStandardMaterial({
        color: 0x2c528c,
        roughness: 0.36,
        metalness: 0.46
      });

      const gearDarkMat = new THREE.MeshStandardMaterial({
        color: 0x0b1d45,
        roughness: 0.42,
        metalness: 0.4
      });

      const pipeRailMat = new THREE.MeshStandardMaterial({
        color: 0x22518a,
        roughness: 0.35,
        metalness: 0.52
      });

      const wireframeEdgeMat = new THREE.LineBasicMaterial({
        color: 0x628cd4,
        transparent: true,
        opacity: 0.92
      });

      const coreSphereMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00
      });

      const glowingPadMat = new THREE.MeshBasicMaterial({
        color: 0xffcc33,
        transparent: true,
        opacity: 0.92
      });

      const cyanWellMat = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc
      });

      // ====================================================
      // LIGHTING
      // ====================================================
      const ambientLight = new THREE.AmbientLight(0x0c1f47, 2.35);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0x609afa, 2.6);
      keyLight.position.set(-14, 26, 14);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Upper Teal Rim Light on Left Monolith & Right Wheel
      const upperTealLight = new THREE.PointLight(0x14b8a6, 22, 18, 1.4);
      upperTealLight.position.set(-4.2, 3.2, 3.8);
      scene.add(upperTealLight);

      // Lower Teal Rim Light on Lower Right Wall, Porthole Chamber & Corner Block
      const lowerTealLight = new THREE.PointLight(0x2dd4bf, 26, 20, 1.35);
      lowerTealLight.position.set(3.8, -4.2, 4.4);
      scene.add(lowerTealLight);

      // ====================================================
      // MASTER ISOMETRIC MACHINE GROUP (FLUSH WITH RIGHT EDGE)
      // ====================================================
      const machineGroup = new THREE.Group();

      // Compute exact right-edge world X offset based on camera aspect ratio
      const getBaseOffset = (w, h) => {
        const aspect = w / Math.max(1, h);
        if (w >= 1280) {
          return { x: aspect * 3.15, y: -1.95, z: 1.35, scale: 1.62 };
        }
        if (w >= 1024) {
          return { x: aspect * 2.95, y: -1.95, z: 1.15, scale: 1.46 };
        }
        if (w >= 640) {
          return { x: aspect * 2.4, y: -2.05, z: 0.65, scale: 1.16 };
        }
        return { x: 1.25, y: -2.2, z: 0.1, scale: 0.88 };
      };

      let basePlacement = getBaseOffset(width, height);
      machineGroup.position.set(basePlacement.x, basePlacement.y, basePlacement.z);
      machineGroup.scale.setScalar(basePlacement.scale);
      scene.add(machineGroup);

      // Key Elevations — Strict clearance so the ball NEVER sinks into solid concrete
      const DECK_TOP_Y = 2.0;
      const TRACK_TOP_Y = DECK_TOP_Y + 0.12; // Raised conveyor bed at Y = 2.12
      const BALL_RADIUS = 0.46;
      const BALL_REST_Y = TRACK_TOP_Y + BALL_RADIUS + 0.02; // Y = 2.60 (always above deck!)

      // ====================================================
      // PART A: UPPER ISOMETRIC STRUCTURE (STAGE 1)
      // ====================================================
      const upperCoreBlock = new THREE.Mesh(new THREE.BoxGeometry(7.6, 4.2, 7.6), cobaltMat);
      upperCoreBlock.position.set(0, -2.1, 0);
      upperCoreBlock.castShadow = true;
      upperCoreBlock.receiveShadow = true;
      machineGroup.add(upperCoreBlock);

      // Upper Perimeter Walls (Top surface strictly at Y = 2.0)
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.0, 2.8), cobaltMat);
      backWall.position.set(0, 1.0, -2.4);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      machineGroup.add(backWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 4.8), cobaltMat);
      rightWall.position.set(2.6, 1.0, 1.4);
      rightWall.castShadow = true;
      rightWall.receiveShadow = true;
      machineGroup.add(rightWall);

      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.0, 2.4), cobaltMat);
      frontWall.position.set(-1.2, 1.0, 2.6);
      frontWall.castShadow = true;
      frontWall.receiveShadow = true;
      machineGroup.add(frontWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 2.4), cobaltMat);
      leftWall.position.set(-2.6, 1.0, 0.2);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      machineGroup.add(leftWall);

      // Far-Right Extension Block (bleeding flush to the right viewport edge like 00:12 in video)
      const farRightBlock = new THREE.Mesh(new THREE.BoxGeometry(2.6, 5.2, 3.2), tealWallMat);
      farRightBlock.position.set(5.1, -0.2, -0.8);
      farRightBlock.castShadow = true;
      farRightBlock.receiveShadow = true;
      machineGroup.add(farRightBlock);

      const pitFloor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 3.2), deepCobaltMat);
      pitFloor.position.set(0.0, 0.05, 0.2);
      machineGroup.add(pitFloor);

      // Central Conical Intake Funnel
      const FUNNEL_X = 0.15;
      const FUNNEL_Z = 0.35;
      const funnelGeo = new THREE.CylinderGeometry(1.38, 0.34, 1.5, 40, 1, true);
      const funnelMat = new THREE.MeshStandardMaterial({
        color: 0x081738,
        roughness: 0.42,
        metalness: 0.35,
        side: THREE.DoubleSide
      });
      const funnelMesh = new THREE.Mesh(funnelGeo, funnelMat);
      funnelMesh.position.set(FUNNEL_X, 0.75, FUNNEL_Z);
      machineGroup.add(funnelMesh);

      const funnelRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.38, 0.075, 16, 48),
        royalBlueMat
      );
      funnelRim.rotation.x = Math.PI / 2;
      funnelRim.position.set(FUNNEL_X, 1.5, FUNNEL_Z);
      machineGroup.add(funnelRim);

      // Tall Left Monolith Tower + Glowing Portal Window (seen at 00:36 in recording)
      const towerBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 4.2, 1.9), cobaltMat);
      towerBody.position.set(-2.15, 4.1, 0.55);
      towerBody.castShadow = true;
      towerBody.receiveShadow = true;
      machineGroup.add(towerBody);

      const towerCap = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.68, 1.48), royalBlueMat);
      towerCap.position.set(-2.15, 6.54, 0.55);
      towerCap.castShadow = true;
      machineGroup.add(towerCap);

      // Glowing Amber Portal Doorway on the front-right face of the Monolith Tower (00:36)
      const towerPortalFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 1.15, 0.88),
        royalBlueMat
      );
      towerPortalFrame.position.set(-1.18, 2.58, 0.85);
      machineGroup.add(towerPortalFrame);

      const towerPortalGlow = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.95, 0.68),
        glowingPadMat
      );
      towerPortalGlow.position.set(-1.16, 2.55, 0.85);
      machineGroup.add(towerPortalGlow);

      // Back Secondary Tower & Horn Emitter
      const backTower = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.6, 1.75), cobaltMat);
      backTower.position.set(-1.1, 3.3, -2.2);
      backTower.castShadow = true;
      machineGroup.add(backTower);

      const hornCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.92, 1.65, 32, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x16346b,
          roughness: 0.4,
          metalness: 0.35,
          side: THREE.DoubleSide
        })
      );
      hornCone.rotation.z = Math.PI / 2;
      hornCone.rotation.y = -0.22;
      hornCone.position.set(0.35, 3.1, -1.85);
      machineGroup.add(hornCone);

      const hornRim = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.08, 16, 36), royalBlueMat);
      hornRim.rotation.y = Math.PI / 2 - 0.22;
      hornRim.position.set(1.12, 3.1, -1.65);
      machineGroup.add(hornRim);

      // Upper Wireframe Containment Cube
      const CUBE_X = 2.45;
      const CUBE_Z = -1.55;
      const cageSize = 1.95;
      const cageGroup = new THREE.Group();
      cageGroup.position.set(CUBE_X, DECK_TOP_Y + cageSize / 2, CUBE_Z);
      machineGroup.add(cageGroup);

      const cageBoxGeo = new THREE.BoxGeometry(cageSize, cageSize, cageSize);
      const cageEdges = new THREE.EdgesGeometry(cageBoxGeo);
      cageGroup.add(new THREE.LineSegments(cageEdges, wireframeEdgeMat));

      const strutGeo = new THREE.BoxGeometry(cageSize, 0.065, 0.065);
      const vStrutGeo = new THREE.BoxGeometry(0.065, cageSize, 0.065);
      const zStrutGeo = new THREE.BoxGeometry(0.065, 0.065, cageSize);
      const half = cageSize / 2;
      for (const sx of [-half, half]) {
        for (const sy of [-half, half]) {
          const s1 = new THREE.Mesh(strutGeo, royalBlueMat);
          s1.position.set(0, sx, sy);
          cageGroup.add(s1);

          const s2 = new THREE.Mesh(vStrutGeo, royalBlueMat);
          s2.position.set(sx, 0, sy);
          cageGroup.add(s2);

          const s3 = new THREE.Mesh(zStrutGeo, royalBlueMat);
          s3.position.set(sx, sy, 0);
          cageGroup.add(s3);
        }
      }

      const padMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.1, 1.1), glowingPadMat);
      padMesh.position.set(0, -half + 0.05, 0);
      cageGroup.add(padMesh);

      // Raised Flat Ribbed Conveyor Track on Upper Deck (Y = 2.12, never lets ball sink!)
      const trackGroup = new THREE.Group();
      machineGroup.add(trackGroup);

      // Solid raised conveyor bed under the slats so the ball visibly rides on a raised track
      const rightTrackBed = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 3.3), deepCobaltMat);
      rightTrackBed.position.set(CUBE_X, DECK_TOP_Y + 0.04, 1.0);
      trackGroup.add(rightTrackBed);

      const frontTrackBed = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.08, 0.84), deepCobaltMat);
      frontTrackBed.position.set(1.0, DECK_TOP_Y + 0.04, 2.55);
      trackGroup.add(frontTrackBed);

      const rightRailOuter = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 3.4), royalBlueMat);
      rightRailOuter.position.set(2.88, DECK_TOP_Y + 0.08, 1.05);
      trackGroup.add(rightRailOuter);

      const rightRailInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 2.7), royalBlueMat);
      rightRailInner.position.set(2.02, DECK_TOP_Y + 0.08, 0.7);
      trackGroup.add(rightRailInner);

      const frontRailOuter = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.16, 0.08), royalBlueMat);
      frontRailOuter.position.set(1.25, DECK_TOP_Y + 0.08, 2.98);
      trackGroup.add(frontRailOuter);

      const frontRailInner = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.16, 0.08), royalBlueMat);
      frontRailInner.position.set(0.82, DECK_TOP_Y + 0.08, 2.12);
      trackGroup.add(frontRailInner);

      const slatGeo1 = new THREE.BoxGeometry(0.76, 0.08, 0.11);
      for (let i = 0; i < 20; i++) {
        const t = i / 19;
        const z = -0.5 + t * 3.05;
        const slat = new THREE.Mesh(slatGeo1, trackSlatMat);
        slat.position.set(CUBE_X, DECK_TOP_Y + 0.08, z);
        trackGroup.add(slat);
      }

      const slatGeo2 = new THREE.BoxGeometry(0.11, 0.08, 0.76);
      for (let i = 0; i < 16; i++) {
        const t = i / 15;
        const x = 2.05 - t * 2.4;
        const slat = new THREE.Mesh(slatGeo2, trackSlatMat);
        slat.position.set(x, DECK_TOP_Y + 0.08, 2.55);
        trackGroup.add(slat);
      }

      // Side Rotary Wheel (Upper Right Wall)
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(3.88, -0.35, 1.55);
      wheelGroup.rotation.y = Math.PI / 2;
      machineGroup.add(wheelGroup);

      const wheelDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(1.45, 1.45, 0.34, 40),
        royalBlueMat
      );
      wheelDisc.rotation.x = Math.PI / 2;
      wheelGroup.add(wheelDisc);

      const wheelHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 0.46, 24),
        cobaltMat
      );
      wheelHub.rotation.x = Math.PI / 2;
      wheelGroup.add(wheelHub);

      const holeGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.38, 12);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const hole = new THREE.Mesh(holeGeo, deepCobaltMat);
        hole.rotation.x = Math.PI / 2;
        hole.position.set(Math.cos(angle) * 0.96, Math.sin(angle) * 0.96, 0);
        wheelGroup.add(hole);
      }

      // Left Stepped Ramp & Pegboard
      const leftRamp = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.8, 2.3), cobaltMat);
      leftRamp.position.set(-3.4, -0.8, 2.0);
      leftRamp.rotation.z = 0.44;
      machineGroup.add(leftRamp);

      const pegBoard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.9, 0.15), royalBlueMat);
      pegBoard.position.set(-0.6, -1.5, 3.82);
      machineGroup.add(pegBoard);

      // ====================================================
      // PART B: MID-LEVEL PORTHOLE CHAMBER & CURVED DUAL-RAIL PIPE TRACK (00:37 - 00:40)
      // ====================================================
      const chamberGroup = new THREE.Group();
      chamberGroup.position.set(3.6, -3.4, 0.4);
      machineGroup.add(chamberGroup);

      const chamberUpperDome = new THREE.Mesh(
        new THREE.CylinderGeometry(1.45, 1.1, 1.3, 36),
        royalBlueMat
      );
      chamberUpperDome.position.y = 1.2;
      chamberGroup.add(chamberUpperDome);

      const chamberBody = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.05, 2.1, 36),
        cobaltMat
      );
      chamberBody.position.y = -0.2;
      chamberGroup.add(chamberBody);

      // Circular Porthole Frame & Glowing Interior Window (seen at 00:37 - 00:38)
      const portholeRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.08, 16, 32),
        brightTealBlockMat
      );
      portholeRim.position.set(0, -0.1, 1.02);
      chamberGroup.add(portholeRim);

      const portholeWindow = new THREE.Mesh(
        new THREE.CircleGeometry(0.48, 32),
        new THREE.MeshBasicMaterial({ color: 0x091d42 })
      );
      portholeWindow.position.set(0, -0.1, 1.03);
      chamberGroup.add(portholeWindow);

      // Curved Dual-Rail Pipe Track carrying the relay ball on the right (00:38 - 00:40 & 00:50)
      const railCurveCenter = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.6, -4.6, 0.4),
        new THREE.Vector3(3.6, -5.0, 2.1),
        new THREE.Vector3(5.6, -5.0, 2.1),
        new THREE.Vector3(6.8, -5.0, 0.4)
      ]);

      const railCurveLeft = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.42, -4.6, 0.4),
        new THREE.Vector3(3.42, -5.0, 2.25),
        new THREE.Vector3(5.6, -5.0, 2.25),
        new THREE.Vector3(6.8, -5.0, 0.55)
      ]);
      const railCurveRight = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.78, -4.6, 0.4),
        new THREE.Vector3(3.78, -5.0, 1.95),
        new THREE.Vector3(5.6, -5.0, 1.95),
        new THREE.Vector3(6.8, -5.0, 0.25)
      ]);

      const dualRailPipe1 = new THREE.Mesh(
        new THREE.TubeGeometry(railCurveLeft, 40, 0.09, 12, false),
        pipeRailMat
      );
      machineGroup.add(dualRailPipe1);

      const dualRailPipe2 = new THREE.Mesh(
        new THREE.TubeGeometry(railCurveRight, 40, 0.09, 12, false),
        pipeRailMat
      );
      machineGroup.add(dualRailPipe2);

      // Vertical Pipe Column flanking the chamber (00:38 - 00:41)
      const verticalPipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2.55, -2.1, 1.4),
        new THREE.Vector3(2.55, -5.4, 1.4)
      ]);
      const verticalPipe = new THREE.Mesh(
        new THREE.TubeGeometry(verticalPipeCurve, 20, 0.2, 16, false),
        cobaltMat
      );
      machineGroup.add(verticalPipe);

      // Relay Golden Ball that travels along the Curved Dual-Rail Pipe Track (00:39 - 00:50)
      const relayBallGroup = new THREE.Group();
      machineGroup.add(relayBallGroup);
      const relayBallMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 28, 28),
        coreSphereMat
      );
      relayBallGroup.add(relayBallMesh);
      const relayLight = new THREE.PointLight(0xff9900, 14, 8, 1.4);
      relayBallGroup.add(relayLight);

      // ====================================================
      // PART C: LOWER ISOMETRIC TERRACE & 2-TIER ROTATING GEAR SOCKET (STAGE 3)
      // ====================================================
      const LOWER_DECK_Y = -6.2;

      // Huge Cobalt L-Shaped Lower Terrace jutting forward-left
      const lowerTerraceMain = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.8, 5.4), cobaltMat);
      lowerTerraceMain.position.set(-0.6, LOWER_DECK_Y - 1.4, 2.5);
      lowerTerraceMain.castShadow = true;
      lowerTerraceMain.receiveShadow = true;
      machineGroup.add(lowerTerraceMain);

      // Raised Left Rim Wall on the Lower Terrace (forming the isometric L-cutout)
      const lowerLeftRim = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.45, 5.4), royalBlueMat);
      lowerLeftRim.position.set(-2.6, LOWER_DECK_Y + 0.72, 2.5);
      lowerLeftRim.castShadow = true;
      lowerLeftRim.receiveShadow = true;
      machineGroup.add(lowerLeftRim);

      const lowerBackRim = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.45, 1.8), cobaltMat);
      lowerBackRim.position.set(-0.5, LOWER_DECK_Y + 0.72, 0.7);
      machineGroup.add(lowerBackRim);

      // Teal-Lit Vertical Backing Column right behind the Gear Socket & Floating Ball
      const tealBackingColumn = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.6, 2.4), tealWallMat);
      tealBackingColumn.position.set(1.85, LOWER_DECK_Y + 2.1, 1.85);
      tealBackingColumn.castShadow = true;
      tealBackingColumn.receiveShadow = true;
      machineGroup.add(tealBackingColumn);

      // Bright Teal Isometric Corner Cube at Bottom-Right (flush to right edge)
      const lowerTealCornerCube = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.8, 2.6),
        brightTealBlockMat
      );
      lowerTealCornerCube.position.set(3.25, LOWER_DECK_Y - 1.1, 3.65);
      lowerTealCornerCube.castShadow = true;
      machineGroup.add(lowerTealCornerCube);

      // 2-Tier Dark-Blue Cog / Gear Socket Cylinder sitting on the Lower Terrace
      const GEAR_X = 0.25;
      const GEAR_Z = 3.15;
      const gearSocketGroup = new THREE.Group();
      gearSocketGroup.position.set(GEAR_X, LOWER_DECK_Y, GEAR_Z);
      machineGroup.add(gearSocketGroup);

      // Separate Tier 1 and Tier 2 groups so both gear rings rotate smoothly when the ball goes in!
      const tier1Group = new THREE.Group();
      gearSocketGroup.add(tier1Group);

      const tier1Ring = new THREE.Mesh(
        new THREE.CylinderGeometry(1.14, 1.2, 0.58, 36),
        gearDarkMat
      );
      tier1Ring.position.y = 0.29;
      tier1Group.add(tier1Ring);

      const toothGeo1 = new THREE.BoxGeometry(0.25, 0.56, 0.34);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo1, royalBlueMat);
        tooth.position.set(Math.cos(angle) * 1.18, 0.28, Math.sin(angle) * 1.18);
        tooth.rotation.y = -angle;
        tier1Group.add(tooth);
      }

      const tier2Group = new THREE.Group();
      gearSocketGroup.add(tier2Group);

      const tier2Ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.84, 0.88, 0.58, 36),
        gearDarkMat
      );
      tier2Ring.position.y = 0.86;
      tier2Group.add(tier2Ring);

      const toothGeo2 = new THREE.BoxGeometry(0.19, 0.54, 0.28);
      for (let i = 0; i < 12; i++) {
        const angle = ((i + 0.5) / 12) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo2, royalBlueMat);
        tooth.position.set(Math.cos(angle) * 0.87, 0.86, Math.sin(angle) * 0.87);
        tooth.rotation.y = -angle;
        tier2Group.add(tooth);
      }

      // Auxiliary Meshed Circuit Gear on the Lower Terrace beside the main Gear Socket
      const auxGearGroup = new THREE.Group();
      auxGearGroup.position.set(GEAR_X - 1.55, LOWER_DECK_Y + 0.22, GEAR_Z + 0.85);
      machineGroup.add(auxGearGroup);

      const auxGearDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.56, 0.56, 0.32, 24),
        tealWallMat
      );
      auxGearGroup.add(auxGearDisc);

      const auxToothGeo = new THREE.BoxGeometry(0.14, 0.3, 0.2);
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const tMesh = new THREE.Mesh(auxToothGeo, brightTealBlockMat);
        tMesh.position.set(Math.cos(angle) * 0.58, 0, Math.sin(angle) * 0.58);
        tMesh.rotation.y = -angle;
        auxGearGroup.add(tMesh);
      }

      // Glowing Bright Cyan Inner Well inside the Top of the Gear Socket
      const innerWellDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.64, 0.64, 0.08, 32),
        cyanWellMat
      );
      innerWellDisc.position.y = 1.13;
      gearSocketGroup.add(innerWellDisc);

      const wellLight = new THREE.PointLight(0x38bdf8, 18, 8, 1.5);
      wellLight.position.set(0, 1.45, 0);
      gearSocketGroup.add(wellLight);

      // ====================================================
      // THE MAIN RADIANT GOLDEN ENERGY BALL
      // ====================================================
      const ballGroup = new THREE.Group();
      ballGroup.position.set(CUBE_X, BALL_REST_Y + 4.5, CUBE_Z);
      machineGroup.add(ballGroup);

      const coreSphere = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_RADIUS, 36, 36),
        coreSphereMat
      );
      ballGroup.add(coreSphere);

      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.28
      });
      const coreHalo = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_RADIUS * 1.48, 32, 32),
        haloMat
      );
      ballGroup.add(coreHalo);

      const coreLight = new THREE.PointLight(0xff9900, 30, 15, 1.3);
      coreLight.position.set(0, 0.2, 0);
      coreLight.castShadow = true;
      ballGroup.add(coreLight);

      // ====================================================
      // SCROLL-DRIVEN BALL PATH (NEVER SINKS INTO CONCRETE)
      // ====================================================
      const LOWER_HOVER_Y = LOWER_DECK_Y + 2.15;

      const computeBallPosition = (s) => {
        // 0.00 -> 0.03: Resting cleanly on the glowing pad inside the wireframe cube
        if (s <= 0.03) {
          return new THREE.Vector3(CUBE_X, BALL_REST_Y, CUBE_Z);
        }
        // 0.03 -> 0.28: Rolls flat along Leg 1 of the raised right conveyor track (Y = 2.60)
        if (s <= 0.28) {
          const t = (s - 0.03) / 0.25;
          const easeT = t * t * (3 - 2 * t);
          const z = CUBE_Z + easeT * (2.55 - CUBE_Z);
          return new THREE.Vector3(CUBE_X, BALL_REST_Y, z);
        }
        // 0.28 -> 0.46: Turns 90° and rolls flat along Leg 2 of the front conveyor track (Y = 2.60)
        if (s <= 0.46) {
          const t = (s - 0.28) / 0.18;
          const easeT = t * t * (3 - 2 * t);
          const x = CUBE_X + easeT * (0.25 - CUBE_X);
          return new THREE.Vector3(x, BALL_REST_Y, 2.55);
        }
        // 0.46 -> 0.64: High parabolic arc over the inner wall lip into the hollow center of the Funnel
        if (s <= 0.64) {
          const t = (s - 0.46) / 0.18;
          const x = 0.25 + t * (FUNNEL_X - 0.25);
          const z = 2.55 + t * (FUNNEL_Z - 2.55);
          // Stays above the wall lip (Y >= 2.60) until X,Z is over the funnel mouth, then drops in
          const arcLift = Math.sin(t * Math.PI) * 0.85;
          const drop = Math.pow(t, 2.6) * 2.2;
          const y = BALL_REST_Y + arcLift - drop;
          return new THREE.Vector3(x, y, z);
        }
        // 0.64 -> 1.00: Descends into the lower 2-tier rotating Gear Socket & hovers over the cyan core
        const t = (s - 0.64) / 0.36;
        const easeT = 1 - Math.pow(1 - t, 3);
        const x = FUNNEL_X + easeT * (GEAR_X - FUNNEL_X);
        const z = FUNNEL_Z + easeT * (GEAR_Z - FUNNEL_Z);
        const startY = BALL_REST_Y - 2.2;
        // Dips slightly into the gear socket mouth around t=0.82 then floats at LOWER_HOVER_Y
        const socketDip = Math.sin(t * Math.PI) * -0.28;
        const y = startY + easeT * (LOWER_HOVER_Y - startY) + socketDip;
        return new THREE.Vector3(x, y, z);
      };

      // ====================================================
      // RENDER LOOP & INTRO DROP ANIMATION
      // ====================================================
      const clock = new THREE.Clock();
      let smoothedScroll = scrollRef.current;
      let introProgress = 0;
      let notifiedReady = false;

      const animate = () => {
        if (isDisposed) return;
        animId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();

        if (!notifiedReady) {
          notifiedReady = true;
          if (typeof onReady === 'function') onReady();
        }

        // Once loader completes, run the 00:09 -> 00:11 ball drop-in intro
        if (loadedRef.current && introProgress < 1) {
          introProgress = Math.min(1, introProgress + delta * 1.45);
        }

        smoothedScroll += (scrollRef.current - smoothedScroll) * 0.11;
        const s = Math.max(0, Math.min(1, smoothedScroll));

        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;

        // 1. Vertical Camera Pan from Upper Deck -> Mid Porthole -> Lower Rotating Gear Terrace
        const verticalPan = s * 7.25;
        machineGroup.position.y = basePlacement.y + verticalPan;

        // Subtle pointer parallax
        const targetRotY = -0.04 + pointer.x * 0.035;
        const targetRotX = pointer.y * 0.025;
        machineGroup.rotation.y += (targetRotY - machineGroup.rotation.y) * 0.1;
        machineGroup.rotation.x += (targetRotX - machineGroup.rotation.x) * 0.1;

        camera.lookAt(0.8, 0.6, 0);

        // 2. Update Main Golden Ball Position + Intro Drop + Hover Bob
        const pos = computeBallPosition(s);
        const introEase = 1 - Math.pow(1 - introProgress, 3);
        const introDropOffset = (1 - introEase) * 4.2;
        const hoverBob =
          s < 0.04 || s > 0.82 ? Math.sin(elapsed * 3.2) * 0.08 : 0;

        ballGroup.position.set(
          pos.x,
          pos.y + introDropOffset + hoverBob,
          pos.z
        );

        // Pad glow intensifies as ball lands inside the wireframe cube
        glowingPadMat.opacity = 0.25 + introEase * 0.68 * Math.max(0.2, 1 - s * 2.5);

        coreHalo.scale.setScalar(1 + Math.sin(elapsed * 3.8) * 0.07);
        coreLight.intensity = 28 + Math.sin(elapsed * 3.5) * 4;

        // 3. Update Relay Ball rolling along the Curved Dual-Rail Pipe Track (00:38 -> 00:50)
        const relayT = Math.max(0, Math.min(1, (s - 0.35) / 0.55));
        const railPt = railCurveCenter.getPointAt(relayT);
        relayBallGroup.position.set(railPt.x, railPt.y + 0.42, railPt.z);
        relayBallGroup.visible = s > 0.28;

        // 4. Rotate Upper Side Wheel & Lower 2-Tier Gear Socket (accelerates when ball enters at end!)
        const endSpinBoost = s > 0.6 ? (s - 0.6) * 6.5 : 0;
        wheelGroup.rotation.z = -(s * Math.PI * 3.5 + elapsed * 0.35);

        // Tier 1 and Tier 2 counter-rotate & mesh with the auxiliary circuit gear
        tier1Group.rotation.y = s * Math.PI * 3.2 + elapsed * 0.65 + endSpinBoost;
        tier2Group.rotation.y = -(s * Math.PI * 2.4 + elapsed * 0.9 + endSpinBoost * 1.2);
        auxGearGroup.rotation.y = -(s * Math.PI * 3.8 + elapsed * 0.8 + endSpinBoost);

        // Pulse the cyan gear socket well when the golden ball hovers above it
        wellLight.intensity = s > 0.65 ? 24 + Math.sin(elapsed * 5.0) * 6 : 14;

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
        basePlacement = getBaseOffset(w, h);
        machineGroup.position.x = basePlacement.x;
        machineGroup.position.z = basePlacement.z;
        machineGroup.scale.setScalar(basePlacement.scale);
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
      if (animId) cancelAnimationFrame(animId);
      if (cleanupListeners) cleanupListeners();
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D isometric electrical and network scrollytelling machine"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    />
  );
};

export default TurbulentHero3D;
