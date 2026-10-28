import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * TurbulentHero3D
 * Clean, soft-lit isometric 3D scrollytelling machine matching turbulent.ca:
 * - True isometric camera pan (camera.position.y and lookAt.y move together by -10.2 units on scroll)
 *   so at Stage 3 ("and deliver uninterrupted uptime.") the upper box scrolls completely out of view
 *   and the lower L-terrace, 2-tier rotating gear socket, and hovering golden ball are 100% unobstructed.
 * - Full 360-degree clearance around both the upper side wheel and the lower 2-tier gear socket so
 *   no gear or wheel ever touches or rotates into any box.
 * - Shifted along the true camera-right vector (+X, -Z) so the machine aligns cleanly to the right edge.
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

      // Narrow-FOV isometric camera
      const BASE_CAM_X = 26;
      const BASE_CAM_Y = 21.5;
      const BASE_CAM_Z = 26;
      camera = new THREE.PerspectiveCamera(18.5, width / height, 0.1, 300);
      camera.position.set(BASE_CAM_X, BASE_CAM_Y, BASE_CAM_Z);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // ====================================================
      // SOFT MATTE ARCHITECTURAL MATERIALS (TONED-DOWN DEEP COBALT & TEAL)
      // ====================================================
      const cobaltMat = new THREE.MeshStandardMaterial({
        color: 0x132b5c,
        roughness: 0.84,
        metalness: 0.04
      });

      const softIndigoMat = new THREE.MeshStandardMaterial({
        color: 0x1b3b75,
        roughness: 0.8,
        metalness: 0.05
      });

      const deepRecessMat = new THREE.MeshStandardMaterial({
        color: 0x09193a,
        roughness: 0.88,
        metalness: 0.04
      });

      const softTealMat = new THREE.MeshStandardMaterial({
        color: 0x1d5f6e,
        roughness: 0.8,
        metalness: 0.04
      });

      const seafoamTealMat = new THREE.MeshStandardMaterial({
        color: 0x2b7f87,
        roughness: 0.76,
        metalness: 0.04
      });

      const trackSlatMat = new THREE.MeshStandardMaterial({
        color: 0x274d8c,
        roughness: 0.72,
        metalness: 0.08
      });

      const pipeMat = new THREE.MeshStandardMaterial({
        color: 0x1f4680,
        roughness: 0.7,
        metalness: 0.08
      });

      const gearBodyMat = new THREE.MeshStandardMaterial({
        color: 0x0e224d,
        roughness: 0.78,
        metalness: 0.08
      });

      const gearToothMat = new THREE.MeshStandardMaterial({
        color: 0x1a3a73,
        roughness: 0.75,
        metalness: 0.08
      });

      const wireframeEdgeMat = new THREE.LineBasicMaterial({
        color: 0x5c80bf,
        transparent: true,
        opacity: 0.88
      });

      const coreSphereMat = new THREE.MeshStandardMaterial({
        color: 0xffb326,
        emissive: 0xff9500,
        emissiveIntensity: 0.72,
        roughness: 0.35,
        metalness: 0.0
      });

      const glowingPadMat = new THREE.MeshBasicMaterial({
        color: 0xffcc44,
        transparent: true,
        opacity: 0.85
      });

      const cyanWellMat = new THREE.MeshBasicMaterial({
        color: 0x7dd3fc
      });

      // ====================================================
      // BALANCED STUDIO LIGHTING (TONED-DOWN BLUE SOFTNESS)
      // ====================================================
      const hemiLight = new THREE.HemisphereLight(0x5278c4, 0x185662, 1.42);
      scene.add(hemiLight);

      const ambientLight = new THREE.AmbientLight(0x122852, 0.92);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0x6488e0, 1.5);
      keyLight.position.set(16, 28, 12);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      scene.add(keyLight);

      const tealDirLight = new THREE.DirectionalLight(0x38b2ac, 1.48);
      tealDirLight.position.set(-18, 12, 18);
      scene.add(tealDirLight);

      const lowerTealPoint = new THREE.PointLight(0x38b2ac, 16, 22, 1.3);
      lowerTealPoint.position.set(3.8, -7.2, 5.2);
      scene.add(lowerTealPoint);

      // ====================================================
      // MASTER ISOMETRIC MACHINE GROUP (ALIGNED TO RIGHT EDGE VIA +X, -Z)
      // ====================================================
      const machineGroup = new THREE.Group();

      // From camera (26, 21.5, 26), the screen-right direction is (+1, 0, -1).
      const getBaseOffset = (w, h) => {
        const aspect = w / Math.max(1, h);
        if (w >= 1280) {
          const rightShift = Math.min(3.25, aspect * 1.72);
          return { x: rightShift, y: -1.4, z: -rightShift, scale: 1.2 };
        }
        if (w >= 1024) {
          const rightShift = Math.min(2.75, aspect * 1.55);
          return { x: rightShift, y: -1.5, z: -rightShift, scale: 1.12 };
        }
        if (w >= 640) {
          return { x: 1.65, y: -1.65, z: -1.65, scale: 0.95 };
        }
        return { x: 0.85, y: -1.8, z: -0.85, scale: 0.78 };
      };

      let basePlacement = getBaseOffset(width, height);
      machineGroup.position.set(basePlacement.x, basePlacement.y, basePlacement.z);
      machineGroup.scale.setScalar(basePlacement.scale);
      scene.add(machineGroup);

      // Key Elevations — Strict clearance so the ball NEVER sinks into solid concrete
      const DECK_TOP_Y = 2.0;
      const TRACK_TOP_Y = DECK_TOP_Y + 0.08;
      const BALL_RADIUS = 0.44;
      const BALL_REST_Y = TRACK_TOP_Y + BALL_RADIUS + 0.02; // Y = 2.54

      // ====================================================
      // PART A: UPPER ISOMETRIC DECK (STAGE 1)
      // ====================================================
      const upperCoreBlock = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.6, 7.2), cobaltMat);
      upperCoreBlock.position.set(0, -1.8, 0);
      upperCoreBlock.castShadow = true;
      upperCoreBlock.receiveShadow = true;
      machineGroup.add(upperCoreBlock);

      // Upper Perimeter Deck Walls (Top surface at Y = 2.0)
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.0, 2.4), cobaltMat);
      backWall.position.set(0, 1.0, -2.4);
      backWall.castShadow = true;
      backWall.receiveShadow = true;
      machineGroup.add(backWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 4.8), cobaltMat);
      rightWall.position.set(2.5, 1.0, 1.2);
      rightWall.castShadow = true;
      rightWall.receiveShadow = true;
      machineGroup.add(rightWall);

      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.0, 2.2), cobaltMat);
      frontWall.position.set(-1.1, 1.0, 2.5);
      frontWall.castShadow = true;
      frontWall.receiveShadow = true;
      machineGroup.add(frontWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 2.6), cobaltMat);
      leftWall.position.set(-2.5, 1.0, 0.1);
      leftWall.castShadow = true;
      leftWall.receiveShadow = true;
      machineGroup.add(leftWall);

      // Right-Edge Architectural Pillar (placed behind the wheel at Z = -1.2 so zero overlap with wheel)
      const rightEdgePillar = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 4.4, 2.2),
        softIndigoMat
      );
      rightEdgePillar.position.set(4.65, 0.3, -1.2);
      rightEdgePillar.castShadow = true;
      rightEdgePillar.receiveShadow = true;
      machineGroup.add(rightEdgePillar);

      // Central Pit Floor & Conical Intake Funnel
      const pitFloor = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 3.0), deepRecessMat);
      pitFloor.position.set(0.1, 0.05, 0.15);
      machineGroup.add(pitFloor);

      const FUNNEL_X = 0.2;
      const FUNNEL_Z = 0.2;
      const funnelGeo = new THREE.CylinderGeometry(1.32, 0.34, 1.55, 48, 1, true);
      const funnelMat = new THREE.MeshStandardMaterial({
        color: 0x0b1d46,
        roughness: 0.68,
        metalness: 0.08,
        side: THREE.DoubleSide
      });
      const funnelMesh = new THREE.Mesh(funnelGeo, funnelMat);
      funnelMesh.position.set(FUNNEL_X, 0.78, FUNNEL_Z);
      machineGroup.add(funnelMesh);

      const funnelRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.32, 0.065, 16, 48),
        softIndigoMat
      );
      funnelRim.rotation.x = Math.PI / 2;
      funnelRim.position.set(FUNNEL_X, 1.55, FUNNEL_Z);
      machineGroup.add(funnelRim);

      // Tall Left Monolith Tower
      const towerBody = new THREE.Mesh(new THREE.BoxGeometry(1.85, 4.1, 1.85), softTealMat);
      towerBody.position.set(-2.05, 4.05, 0.55);
      towerBody.castShadow = true;
      towerBody.receiveShadow = true;
      machineGroup.add(towerBody);

      const towerCap = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.62, 1.42), softIndigoMat);
      towerCap.position.set(-2.05, 6.41, 0.55);
      towerCap.castShadow = true;
      machineGroup.add(towerCap);

      const towerFrontBump = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 1.75, 2.1),
        softTealMat
      );
      towerFrontBump.position.set(-2.55, 1.65, 1.65);
      towerFrontBump.castShadow = true;
      towerFrontBump.receiveShadow = true;
      machineGroup.add(towerFrontBump);

      // Back Secondary Tower & Horn Emitter
      const backTower = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.5, 1.65), cobaltMat);
      backTower.position.set(-0.95, 3.25, -2.15);
      backTower.castShadow = true;
      machineGroup.add(backTower);

      const hornCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.86, 1.55, 36, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x183878,
          roughness: 0.68,
          metalness: 0.08,
          side: THREE.DoubleSide
        })
      );
      hornCone.rotation.z = Math.PI / 2;
      hornCone.rotation.y = -0.22;
      hornCone.position.set(0.4, 3.05, -1.8);
      machineGroup.add(hornCone);

      const hornRim = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.07, 16, 36), softIndigoMat);
      hornRim.rotation.y = Math.PI / 2 - 0.22;
      hornRim.position.set(1.12, 3.05, -1.62);
      machineGroup.add(hornRim);

      // Upper Wireframe Containment Cube
      const CUBE_X = 2.35;
      const CUBE_Z = -1.55;
      const cageSize = 1.88;
      const cageGroup = new THREE.Group();
      cageGroup.position.set(CUBE_X, DECK_TOP_Y + cageSize / 2, CUBE_Z);
      machineGroup.add(cageGroup);

      const cageBoxGeo = new THREE.BoxGeometry(cageSize, cageSize, cageSize);
      const cageEdges = new THREE.EdgesGeometry(cageBoxGeo);
      cageGroup.add(new THREE.LineSegments(cageEdges, wireframeEdgeMat));

      const strutGeo = new THREE.BoxGeometry(cageSize, 0.055, 0.055);
      const vStrutGeo = new THREE.BoxGeometry(0.055, cageSize, 0.055);
      const zStrutGeo = new THREE.BoxGeometry(0.055, 0.055, cageSize);
      const half = cageSize / 2;
      for (const sx of [-half, half]) {
        for (const sy of [-half, half]) {
          const s1 = new THREE.Mesh(strutGeo, softIndigoMat);
          s1.position.set(0, sx, sy);
          cageGroup.add(s1);

          const s2 = new THREE.Mesh(vStrutGeo, softIndigoMat);
          s2.position.set(sx, 0, sy);
          cageGroup.add(s2);

          const s3 = new THREE.Mesh(zStrutGeo, softIndigoMat);
          s3.position.set(sx, sy, 0);
          cageGroup.add(s3);
        }
      }

      const padMesh = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.06, 1.02), glowingPadMat);
      padMesh.position.set(0, -half + 0.03, 0);
      cageGroup.add(padMesh);

      // Raised Flat Ribbed Conveyor Track on Upper Deck (Y = 2.08)
      const trackGroup = new THREE.Group();
      machineGroup.add(trackGroup);

      const rightRailOuter = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 3.35), softIndigoMat);
      rightRailOuter.position.set(2.76, DECK_TOP_Y + 0.06, 1.0);
      trackGroup.add(rightRailOuter);

      const rightRailInner = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 2.65), softIndigoMat);
      rightRailInner.position.set(1.94, DECK_TOP_Y + 0.06, 0.65);
      trackGroup.add(rightRailInner);

      const frontRailOuter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 0.07), softIndigoMat);
      frontRailOuter.position.set(1.2, DECK_TOP_Y + 0.06, 2.86);
      trackGroup.add(frontRailOuter);

      const frontRailInner = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.12, 0.07), softIndigoMat);
      frontRailInner.position.set(0.8, DECK_TOP_Y + 0.06, 2.04);
      trackGroup.add(frontRailInner);

      const slatGeo1 = new THREE.BoxGeometry(0.72, 0.07, 0.1);
      for (let i = 0; i < 20; i++) {
        const t = i / 19;
        const z = -0.5 + t * 2.95;
        const slat = new THREE.Mesh(slatGeo1, trackSlatMat);
        slat.position.set(CUBE_X, DECK_TOP_Y + 0.045, z);
        slat.receiveShadow = true;
        trackGroup.add(slat);
      }

      const slatGeo2 = new THREE.BoxGeometry(0.1, 0.07, 0.72);
      for (let i = 0; i < 16; i++) {
        const t = i / 15;
        const x = 1.95 - t * 2.3;
        const slat = new THREE.Mesh(slatGeo2, trackSlatMat);
        slat.position.set(x, DECK_TOP_Y + 0.045, 2.45);
        slat.receiveShadow = true;
        trackGroup.add(slat);
      }

      // ====================================================
      // SIDE FLANGE WHEEL (MOUNTED ON RIGHT WALL WITH STANDOFF AXLE)
      // ====================================================
      const wheelMountGroup = new THREE.Group();
      // Right wall outer face is at X = 3.60; placing wheel at X = 3.85 with standoff axle gives 100% clearance
      wheelMountGroup.position.set(3.85, 0.25, 1.45);
      machineGroup.add(wheelMountGroup);

      const wheelAxle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.4, 24),
        deepRecessMat
      );
      wheelAxle.rotation.z = Math.PI / 2;
      wheelAxle.position.x = -0.15;
      wheelMountGroup.add(wheelAxle);

      const wheelSpinGroup = new THREE.Group();
      wheelMountGroup.add(wheelSpinGroup);

      const wheelDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(1.18, 1.18, 0.28, 40),
        seafoamTealMat
      );
      wheelDisc.rotation.z = Math.PI / 2;
      wheelSpinGroup.add(wheelDisc);

      const wheelOuterRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.64, 0.035, 16, 36),
        softIndigoMat
      );
      wheelOuterRing.rotation.y = Math.PI / 2;
      wheelOuterRing.position.x = 0.14;
      wheelSpinGroup.add(wheelOuterRing);

      const wheelHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.34, 28),
        deepRecessMat
      );
      wheelHub.rotation.z = Math.PI / 2;
      wheelSpinGroup.add(wheelHub);

      const holeGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.3, 16);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const hole = new THREE.Mesh(holeGeo, deepRecessMat);
        hole.rotation.z = Math.PI / 2;
        hole.position.set(0.02, Math.cos(angle) * 0.86, Math.sin(angle) * 0.86);
        wheelSpinGroup.add(hole);
      }

      // Left Stepped Slide & Front Circuit Pegboard
      const leftRamp = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.6, 2.1), cobaltMat);
      leftRamp.position.set(-3.2, -0.9, 1.95);
      leftRamp.rotation.z = 0.44;
      machineGroup.add(leftRamp);

      const pegBoard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.75, 0.12), softTealMat);
      pegBoard.position.set(-0.65, -1.4, 3.62);
      machineGroup.add(pegBoard);

      const chipPositions = [
        [-1.2, -0.95, 0.28, 0.36],
        [-0.75, -1.1, 0.35, 0.22],
        [-0.25, -0.95, 0.22, 0.4],
        [-1.15, -1.6, 0.42, 0.3],
        [-0.55, -1.65, 0.32, 0.35]
      ];
      chipPositions.forEach(([cx, cy, cw, ch]) => {
        const chip = new THREE.Mesh(
          new THREE.BoxGeometry(cw, ch, 0.08),
          deepRecessMat
        );
        chip.position.set(cx, cy, 3.68);
        machineGroup.add(chip);
      });

      // ====================================================
      // PART B: MID-LEVEL CHAMBER (STAGE 2 — NO EXTENDING RIGHT WIRE OR RIGHT BALL)
      // ====================================================
      const chamberGroup = new THREE.Group();
      chamberGroup.position.set(3.15, -5.2, 0.65);
      machineGroup.add(chamberGroup);

      const chamberUpperDome = new THREE.Mesh(
        new THREE.CylinderGeometry(1.32, 1.0, 1.2, 36),
        softIndigoMat
      );
      chamberUpperDome.position.y = 1.1;
      chamberGroup.add(chamberUpperDome);

      const chamberBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.98, 0.98, 2.0, 36),
        cobaltMat
      );
      chamberBody.position.y = -0.2;
      chamberGroup.add(chamberBody);

      const portholeRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.48, 0.07, 16, 32),
        seafoamTealMat
      );
      portholeRim.position.set(0, -0.1, 0.95);
      chamberGroup.add(portholeRim);

      const portholeWindow = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 32),
        deepRecessMat
      );
      portholeWindow.position.set(0, -0.1, 0.96);
      chamberGroup.add(portholeWindow);

      // Bent Industrial Pipe well below the side wheel (starts at Y = -1.35 so zero contact with wheel)
      const rightBentPipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.65, -1.35, 2.15),
        new THREE.Vector3(3.65, -3.1, 2.15),
        new THREE.Vector3(4.35, -3.1, 2.15),
        new THREE.Vector3(4.35, -2.2, 2.15)
      ]);
      const rightBentPipe = new THREE.Mesh(
        new THREE.TubeGeometry(rightBentPipeCurve, 28, 0.18, 16, false),
        softTealMat
      );
      machineGroup.add(rightBentPipe);

      // ====================================================
      // PART C: LOWER ISOMETRIC TERRACE & 2-TIER COG SOCKET (STAGE 3)
      // Placed at Y = -9.2 so when camera pans down, the upper box is completely
      // above the viewport and the gear socket + hovering ball are 100% unobstructed!
      // ====================================================
      const LOWER_DECK_Y = -9.2;

      // Cobalt L-Shaped Lower Terrace jutting forward-left
      const lowerTerraceMain = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.8, 5.6), cobaltMat);
      lowerTerraceMain.position.set(-0.4, LOWER_DECK_Y - 1.4, 3.2);
      lowerTerraceMain.castShadow = true;
      lowerTerraceMain.receiveShadow = true;
      machineGroup.add(lowerTerraceMain);

      // Raised Left Rim Wall (X spans -3.6 to -1.8, leaving wide clearance for gear at X = 0.15)
      const lowerLeftRim = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 5.6), softIndigoMat);
      lowerLeftRim.position.set(-2.7, LOWER_DECK_Y + 0.7, 3.2);
      lowerLeftRim.castShadow = true;
      lowerLeftRim.receiveShadow = true;
      machineGroup.add(lowerLeftRim);

      // Raised Back Rim Wall (Z spans 0.4 to 1.8, leaving wide clearance for gear at Z = 3.85)
      const lowerBackRim = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.4, 1.4), cobaltMat);
      lowerBackRim.position.set(-0.3, LOWER_DECK_Y + 0.7, 1.1);
      machineGroup.add(lowerBackRim);

      // Teal-Lit Vertical Backing Column (placed at X = 1.65, Z = 1.65 so its front face is at Z = 2.65,
      // well behind the gear socket at Z = 3.85 — zero collision!)
      const tealBackingColumn = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 5.4, 2.0),
        softTealMat
      );
      tealBackingColumn.position.set(1.65, LOWER_DECK_Y + 2.5, 1.65);
      tealBackingColumn.castShadow = true;
      tealBackingColumn.receiveShadow = true;
      machineGroup.add(tealBackingColumn);

      // Seafoam-Teal Isometric Corner Cube at Bottom-Right
      const lowerTealCornerCube = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 2.8, 2.5),
        seafoamTealMat
      );
      lowerTealCornerCube.position.set(2.85, LOWER_DECK_Y - 1.0, 4.25);
      lowerTealCornerCube.castShadow = true;
      machineGroup.add(lowerTealCornerCube);

      // ====================================================
      // PRECISION 2-TIER COG / GEAR SOCKET (100% OPEN CLEARANCE, NEVER HITS ANY BOX)
      // ====================================================
      const GEAR_X = 0.15;
      const GEAR_Z = 3.85;
      const gearSocketGroup = new THREE.Group();
      gearSocketGroup.position.set(GEAR_X, LOWER_DECK_Y, GEAR_Z);
      machineGroup.add(gearSocketGroup);

      // Tier 1: Bottom Wider Gear Ring (Radius 0.94) + 12 Radially Aligned Teeth
      const tier1Ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.92, 0.96, 0.54, 36),
        gearBodyMat
      );
      tier1Ring.position.y = 0.27;
      gearSocketGroup.add(tier1Ring);

      const toothGeo1 = new THREE.BoxGeometry(0.2, 0.52, 0.2);
      for (let i = 0; i < 12; i++) {
        const pivot = new THREE.Group();
        pivot.rotation.y = (i / 12) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo1, gearToothMat);
        tooth.position.set(0.94, 0.26, 0);
        pivot.add(tooth);
        gearSocketGroup.add(pivot);
      }

      // Tier 2: Upper Narrower Gear Ring (Radius 0.70) + 12 Radially Aligned Teeth
      const tier2Ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.68, 0.72, 0.54, 36),
        gearBodyMat
      );
      tier2Ring.position.y = 0.81;
      gearSocketGroup.add(tier2Ring);

      const toothGeo2 = new THREE.BoxGeometry(0.16, 0.5, 0.16);
      for (let i = 0; i < 12; i++) {
        const pivot = new THREE.Group();
        pivot.rotation.y = (i / 12) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo2, gearToothMat);
        tooth.position.set(0.7, 0.81, 0);
        pivot.add(tooth);
        gearSocketGroup.add(pivot);
      }

      // Dark Inner Rim & Glowing Bright Cyan Inner Well inside the Top of the Gear Socket
      const innerSocketWall = new THREE.Mesh(
        new THREE.CylinderGeometry(0.54, 0.54, 0.14, 32),
        deepRecessMat
      );
      innerSocketWall.position.y = 1.05;
      gearSocketGroup.add(innerSocketWall);

      const innerWellDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.06, 32),
        cyanWellMat
      );
      innerWellDisc.position.y = 1.1;
      gearSocketGroup.add(innerWellDisc);

      const wellLight = new THREE.PointLight(0x38bdf8, 16, 7, 1.4);
      wellLight.position.set(0, 1.35, 0);
      gearSocketGroup.add(wellLight);

      // ====================================================
      // THE MAIN RADIANT GOLDEN ENERGY BALL
      // ====================================================
      const ballGroup = new THREE.Group();
      ballGroup.position.set(CUBE_X, BALL_REST_Y + 4.0, CUBE_Z);
      machineGroup.add(ballGroup);

      const coreSphere = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_RADIUS, 36, 36),
        coreSphereMat
      );
      ballGroup.add(coreSphere);

      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffaa22,
        transparent: true,
        opacity: 0.22
      });
      const coreHalo = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_RADIUS * 1.35, 32, 32),
        haloMat
      );
      ballGroup.add(coreHalo);

      const coreLight = new THREE.PointLight(0xffaa22, 20, 9, 1.4);
      coreLight.position.set(0, 0.1, 0);
      coreLight.castShadow = true;
      ballGroup.add(coreLight);

      // ====================================================
      // SCROLL-DRIVEN BALL PATH (ENTERS THE ROTATING GEAR SOCKET AT THE END)
      // ====================================================
      const LOWER_HOVER_Y = LOWER_DECK_Y + 2.15;
      const SOCKET_INSIDE_Y = LOWER_DECK_Y + 0.48;

      const computeBallPosition = (s) => {
        // 0.00 -> 0.03: Resting cleanly on the glowing pad inside the wireframe cube
        if (s <= 0.03) {
          return new THREE.Vector3(CUBE_X, BALL_REST_Y, CUBE_Z);
        }
        // 0.03 -> 0.24: Rolls flat along Leg 1 of the right conveyor track (Y = 2.54)
        if (s <= 0.24) {
          const t = (s - 0.03) / 0.21;
          const easeT = t * t * (3 - 2 * t);
          const z = CUBE_Z + easeT * (2.45 - CUBE_Z);
          return new THREE.Vector3(CUBE_X, BALL_REST_Y, z);
        }
        // 0.24 -> 0.40: Turns 90° and rolls flat along Leg 2 of the front conveyor track (Y = 2.54)
        if (s <= 0.40) {
          const t = (s - 0.24) / 0.16;
          const easeT = t * t * (3 - 2 * t);
          const x = CUBE_X + easeT * (0.2 - CUBE_X);
          return new THREE.Vector3(x, BALL_REST_Y, 2.45);
        }
        // 0.40 -> 0.56: Clean parabolic arc over the inner wall lip into the hollow center of the Funnel
        if (s <= 0.56) {
          const t = (s - 0.40) / 0.16;
          const x = 0.2 + t * (FUNNEL_X - 0.2);
          const z = 2.45 + t * (FUNNEL_Z - 2.45);
          const arcLift = Math.sin(t * Math.PI) * 0.78;
          const drop = Math.pow(t, 2.5) * 2.1;
          const y = BALL_REST_Y + arcLift - drop;
          return new THREE.Vector3(x, y, z);
        }
        // 0.56 -> 0.78: Emerges on the Lower Terrace & hovers above the 2-Tier Gear Socket
        if (s <= 0.78) {
          const t = (s - 0.56) / 0.22;
          const easeT = 1 - Math.pow(1 - t, 3);
          const x = FUNNEL_X + easeT * (GEAR_X - FUNNEL_X);
          const z = FUNNEL_Z + easeT * (GEAR_Z - FUNNEL_Z);
          const startY = LOWER_DECK_Y + 3.8;
          const y = startY + easeT * (LOWER_HOVER_Y - startY);
          return new THREE.Vector3(x, y, z);
        }
        // 0.78 -> 1.00: Drops straight down INSIDE the glowing cyan 2-Tier Rotating Gear Socket!
        const enterT = Math.min(1, (s - 0.78) / 0.14);
        const easeEnter = enterT * enterT * (3 - 2 * enterT);
        const y = LOWER_HOVER_Y + easeEnter * (SOCKET_INSIDE_Y - LOWER_HOVER_Y);
        return new THREE.Vector3(GEAR_X, y, GEAR_Z);
      };

      // ====================================================
      // RENDER LOOP, TRUE ISOMETRIC CAMERA PAN & END ZOOM-IN
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

        if (loadedRef.current && introProgress < 1) {
          introProgress = Math.min(1, introProgress + delta * 1.45);
        }

        smoothedScroll += (scrollRef.current - smoothedScroll) * 0.11;
        const s = Math.max(0, Math.min(1, smoothedScroll));

        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;

        // Final Stage Zoom Effect (0.78 -> 1.00):
        // As the ball enters the gear socket and all text clears, zoom in on the rotating gear socket!
        const zoomRaw = Math.max(0, Math.min(1, (s - 0.78) / 0.22));
        const zoomEase = zoomRaw * zoomRaw * (3 - 2 * zoomRaw);

        const targetFov = 18.5 - zoomEase * 4.3;
        if (Math.abs(camera.fov - targetFov) > 0.01) {
          camera.fov = targetFov;
          camera.updateProjectionMatrix();
        }

        // 1. True Isometric Vertical Camera Pan + Final Zoom Framing
        const panProgress = Math.min(1, s / 0.82);
        const camDrop = panProgress * 10.4 + zoomEase * 0.55;
        camera.position.set(BASE_CAM_X, BASE_CAM_Y - camDrop, BASE_CAM_Z);
        camera.lookAt(0.65 + zoomEase * 0.85, 0.55 - camDrop, -zoomEase * 0.45);

        // Subtle pointer parallax on the machine group
        const targetRotY = -0.02 + pointer.x * 0.025;
        const targetRotX = pointer.y * 0.018;
        machineGroup.rotation.y += (targetRotY - machineGroup.rotation.y) * 0.1;
        machineGroup.rotation.x += (targetRotX - machineGroup.rotation.x) * 0.1;

        // 2. Update Main Golden Ball Position + Intro Drop + Absorption into Gear Socket
        const pos = computeBallPosition(s);
        const introEase = 1 - Math.pow(1 - introProgress, 3);
        const introDropOffset = (1 - introEase) * 3.8;
        const hoverBob =
          s < 0.04 || (s > 0.58 && s < 0.78) ? Math.sin(elapsed * 3.0) * 0.07 : 0;

        ballGroup.position.set(
          pos.x,
          pos.y + introDropOffset + hoverBob,
          pos.z
        );

        // Shrink and hide the golden sphere once it sinks deep inside the glowing cyan gear well
        const sinkProgress = Math.max(0, Math.min(1, (s - 0.82) / 0.1));
        const ballScale = Math.max(0.001, 1 - sinkProgress * 0.95);
        ballGroup.scale.setScalar(ballScale);
        ballGroup.visible = s < 0.93;

        glowingPadMat.opacity = 0.2 + introEase * 0.65 * Math.max(0.15, 1 - s * 3.0);
        coreHalo.scale.setScalar(1 + Math.sin(elapsed * 3.5) * 0.05);

        // 3. Clean Axial Spin for the Side Flange Wheel & Accelerated End Spin for the 2-Tier Gear Socket
        wheelSpinGroup.rotation.x = -(s * Math.PI * 2.5 + elapsed * 0.35);
        const endGearSpin = zoomEase * Math.PI * 3.8;
        gearSocketGroup.rotation.y = s * Math.PI * 2.4 + endGearSpin + elapsed * 0.55;

        // Cyan well flares up brightly as the golden ball enters the socket (matching screenshot)
        wellLight.intensity = 12 + zoomEase * 24 + Math.sin(elapsed * 4.5) * 3;

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
        machineGroup.position.set(basePlacement.x, basePlacement.y, basePlacement.z);
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
