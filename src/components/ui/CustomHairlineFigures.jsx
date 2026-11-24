import React, { useEffect, useRef, useState } from 'react';

/**
 * Isometric 3D Projection Helper matching @lucasmarkes/hairline (src/core/iso.ts)
 */
const rad = (d) => (d * Math.PI) / 180;
const r2 = (n) => Math.round(n * 100) / 100;
const poly = (pts) =>
  'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z';
const seg = (a, b) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
const openPath = (pts) =>
  pts.length < 2
    ? ''
    : 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L');

function createProjector(azDeg, k, scale, ox = 120, oy = 104) {
  const az = rad(azDeg);
  const c = Math.cos(az);
  const s = Math.sin(az);
  const zf = Math.sqrt(Math.max(0.05, 1 - k * k));
  return (x, y, z) => {
    const X = x * c - y * s;
    const Y = x * s + y * c;
    return [ox + scale * X, oy + scale * (Y * k - z * zf)];
  };
}

/**
 * Generates visible faces of an axis-aligned 3D box [x0, y0, z0] -> [x1, y1, z1]
 * sorted back-to-front for isometric painter's algorithm rendering.
 */
function buildIsoBox(P, x0, y0, z0, x1, y1, z1, azDeg = -35) {
  const normAz = ((azDeg % 360) + 360) % 360;
  const showFrontX = normAz > 180 || normAz < 90;
  const showFrontY = normAz < 180;

  const faces = [];

  // Bottom face (back)
  faces.push({
    kind: 'bottom',
    d: poly([P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)])
  });

  // Back wall faces
  if (showFrontX) {
    faces.push({
      kind: 'backX',
      d: poly([P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)])
    });
  } else {
    faces.push({
      kind: 'backX',
      d: poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)])
    });
  }

  if (showFrontY) {
    faces.push({
      kind: 'backY',
      d: poly([P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)])
    });
  } else {
    faces.push({
      kind: 'backY',
      d: poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)])
    });
  }

  // Front wall faces
  if (showFrontY) {
    faces.push({
      kind: 'frontY',
      d: poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)])
    });
  } else {
    faces.push({
      kind: 'frontY',
      d: poly([P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)])
    });
  }

  if (showFrontX) {
    faces.push({
      kind: 'frontX',
      d: poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)])
    });
  } else {
    faces.push({
      kind: 'frontX',
      d: poly([P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)])
    });
  }

  // Top face
  faces.push({
    kind: 'top',
    d: poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)])
  });

  return faces;
}

/**
 * 1. WalkieTalkie — Interactive @lucasmarkes/hairline Isometric Figure
 * Responds to mouse movement, touch, and scroll:
 * - Tilts & rotates the isometric rugged two-way walkie-talkie transceiver toward the cursor.
 * - Radiates concentric UHF/VHF radio waves from the high-gain whip antenna toward the cursor.
 * - Animates the channel selector rotary knob, PTT side grip, backlit frequency screen & signal bars.
 */
export const WalkieTalkie = ({
  intensity = 0.8,
  play = true,
  label = 'Interactive isometric walkie-talkie two-way radio schematic',
  onRead,
  className = ''
}) => {
  const svgRef = useRef(null);
  const [pointer, setPointer] = useState({ x: 0.2, y: -0.15, active: false });
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    if (!play) return;
    let rafId;
    let start = performance.now();

    const tick = (now) => {
      const dt = (now - start) / 1000;
      setPulsePhase(dt);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [play]);

  const handlePointerMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    const clampedX = Math.max(-1, Math.min(1, nx));
    const clampedY = Math.max(-1, Math.min(1, ny));
    setPointer({ x: clampedX, y: clampedY, active: true });

    if (onRead) {
      const ch = Math.max(1, Math.min(16, Math.round(8 + clampedX * 7)));
      const freq = (446.00625 + ch * 0.0125).toFixed(4);
      const dbm = Math.round(32 + (1 - Math.abs(clampedY)) * 6);
      onRead(`UHF ${freq} MHz • CH-${String(ch).padStart(2, '0')} • +${dbm}dBm`);
    }
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0, active: false });
    if (onRead) onRead('');
  };

  // Isometric camera angles driven smoothly by mouse cursor on hover (steady when not hovering)
  const activeX = pointer.active ? pointer.x : 0;
  const activeY = pointer.active ? pointer.y : 0;
  const azDeg = -36 + activeX * 26 * intensity;
  const k = Math.max(0.38, Math.min(0.68, 0.5 + activeY * 0.14 * intensity));
  const P = createProjector(azDeg, k, 1.56, 120, 102);

  // Compact Base Reference Grid Plate (stays well inside the border with generous margin)
  const basePlate = poly([
    P(-25, -22, -22),
    P(25, -22, -22),
    P(25, 22, -22),
    P(-25, 22, -22)
  ]);

  const gridLines = [];
  for (let g = -16; g <= 16; g += 8) {
    gridLines.push(seg(P(g, -22, -22), P(g, 22, -22)));
    gridLines.push(seg(P(-25, g, -22), P(25, g, -22)));
  }

  // Main Walkie-Talkie Rugged Chassis Body [-13..13, -8..8, -22..14]
  const bodyFaces = buildIsoBox(P, -13, -8, -22, 13, 8, 14, azDeg);

  // Side PTT (Push-To-Talk) Ribbed Grip Module [-16..-13, -4.5..4.5, -3..10]
  const pttFaces = buildIsoBox(P, -16, -4.5, -3, -13, 4.5, 10, azDeg);

  // Top Rotary Channel Knob [3..8.5, -3.5..3.5, 14..20.5]
  const knobFaces = buildIsoBox(P, 3, -3.5, 14, 8.5, 3.5, 20.5, azDeg);

  // High-Gain Helical Whip Antenna [-10.5..-5, -3.5..3.5, 14..43]
  const antBaseFaces = buildIsoBox(P, -10.5, -3.5, 14, -5, 3.5, 21.5, azDeg);
  const antMidFaces = buildIsoBox(P, -9.3, -2.4, 21.5, -6.1, 2.4, 41, azDeg);
  const antTipPt = P(-7.7, 0, 42.5);

  // Front Panel Backlit LCD Frequency Screen [-9.5..9.5, 8.2, -1..10]
  const lcdScreen = poly([
    P(-9.5, 8.2, -1),
    P(9.5, 8.2, -1),
    P(9.5, 8.2, 10),
    P(-9.5, 8.2, 10)
  ]);

  // Speaker Grille Horizontal Acoustic Slats on Front Face
  const speakerSlats = [];
  for (let z = -17.5; z <= -5.5; z += 2.4) {
    speakerSlats.push(seg(P(-8.5, 8.3, z), P(8.5, 8.3, z)));
  }

  // Concentric Isometric RF Waves radiating from Antenna Tip ONLY when hovered (pointer.active)
  const rfWaves = pointer.active
    ? [0, 1, 2].map((idx) => {
        const progress = (pulsePhase * 0.85 + idx / 3) % 1;
        const radius = 6 + progress * 26;
        const pts = [];
        const steps = 28;
        const driftX = pointer.x * 10 * progress;
        const driftY = pointer.y * 10 * progress;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          pts.push(
            P(
              -7.7 + driftX + Math.cos(a) * radius,
              driftY + Math.sin(a) * radius,
              42.5 + progress * 3
            )
          );
        }
        return {
          d: openPath(pts),
          isHi: idx === 0
        };
      })
    : [];

  // Directional Telemetry Vector Line from Antenna Tip toward Pointer Target (only when hovered)
  const targetPt = P(-7.7 + activeX * 26, activeY * 22, 43.5);
  const vectorBeam = seg(antTipPt, targetPt);

  const plateColor = 'var(--hairline-plate, #0f172a)';
  const hiColor = 'var(--hairline-hi, #38bdf8)';
  const edgeColor = 'var(--hairline-edge, #7dd3fc)';
  const midColor = 'var(--hairline-mid, #0284c7)';
  const loColor = 'var(--hairline-lo, #1e3a8a)';
  const strokeW = 'var(--hairline-stroke, 1.25)';

  return (
    <div
      data-hairline=""
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ aspectRatio: '5 / 4', position: 'relative' }}
      className={`w-full h-full select-none cursor-crosshair overflow-hidden ${className}`}
      aria-label={label}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 192"
        className="w-full h-full block overflow-hidden"
        style={{
          strokeWidth: strokeW,
          strokeLinejoin: 'round',
          strokeLinecap: 'round'
        }}
      >
        {/* Base Reference Telemetry Grid */}
        <path d={basePlate} fill={plateColor} stroke={loColor} />
        {gridLines.map((d, i) => (
          <path key={`g-${i}`} d={d} fill="none" stroke={loColor} strokeDasharray="1 3" />
        ))}

        {/* PTT Side Module */}
        {pttFaces.map((f, i) => (
          <path
            key={`ptt-${i}`}
            d={f.d}
            fill={plateColor}
            stroke={pointer.active ? hiColor : edgeColor}
          />
        ))}

        {/* Main Walkie-Talkie Body */}
        {bodyFaces.map((f, i) => (
          <path
            key={`b-${i}`}
            d={f.d}
            fill={plateColor}
            stroke={f.kind === 'top' || f.kind === 'frontY' ? edgeColor : midColor}
          />
        ))}

        {/* Front LCD Frequency Screen & Telemetry Waveform */}
        <path d={lcdScreen} fill={plateColor} stroke={hiColor} />
        <path
          d={seg(
            P(-6.5, 8.4, 4.5),
            P(6.5, 8.4, 4.5 + activeX * 2.2)
          )}
          fill="none"
          stroke={hiColor}
        />
        <circle
          cx={P(7, 8.4, 7.5)[0]}
          cy={P(7, 8.4, 7.5)[1]}
          r="1.8"
          fill={pointer.active ? hiColor : midColor}
        />

        {/* Speaker Grille Acoustic Slats */}
        {speakerSlats.map((d, i) => (
          <path key={`sp-${i}`} d={d} fill="none" stroke={midColor} />
        ))}

        {/* Top Channel Selector Knob */}
        {knobFaces.map((f, i) => (
          <path key={`k-${i}`} d={f.d} fill={plateColor} stroke={edgeColor} />
        ))}

        {/* Whip Antenna Base & Helical Mast */}
        {antBaseFaces.map((f, i) => (
          <path key={`ab-${i}`} d={f.d} fill={plateColor} stroke={edgeColor} />
        ))}
        {antMidFaces.map((f, i) => (
          <path key={`am-${i}`} d={f.d} fill={plateColor} stroke={hiColor} />
        ))}

        {/* Propagating UHF/VHF Radio Waves & Signal Beam — Shown ONLY on Hover */}
        {pointer.active &&
          rfWaves.map((w, i) => (
            <path
              key={`rf-${i}`}
              d={w.d}
              fill="none"
              stroke={w.isHi ? hiColor : midColor}
              strokeDasharray={w.isHi ? undefined : '2 3'}
            />
          ))}

        {pointer.active && (
          <>
            <path d={vectorBeam} fill="none" stroke={hiColor} strokeDasharray="2 3" />
            <circle cx={targetPt[0]} cy={targetPt[1]} r="2.2" fill={edgeColor} />
          </>
        )}
        <circle cx={antTipPt[0]} cy={antTipPt[1]} r="2.4" fill={hiColor} />
      </svg>
    </div>
  );
};

/**
 * 2. CctvCamera — Interactive @lucasmarkes/hairline Isometric Figure
 * Responds to mouse movement, touch, and scroll:
 * - Motorized PTZ / armored IP CCTV camera housing physically pans and tilts in 3D isometric
 *   space to track the user's mouse cursor!
 * - Projects an isometric field-of-view (FOV) scan cone and target reticle onto the floor plane
 *   where the cursor points, with live optical & IR telemetry readouts.
 */
export const CctvCamera = ({
  intensity = 0.8,
  play = true,
  label = 'Interactive isometric CCTV camera surveillance schematic',
  onRead,
  className = ''
}) => {
  const svgRef = useRef(null);
  const [pointer, setPointer] = useState({ x: 0.15, y: 0.1, active: false });
  const [scanTime, setScanTime] = useState(0);

  useEffect(() => {
    if (!play) return;
    let rafId;
    let start = performance.now();

    const tick = (now) => {
      setScanTime((now - start) / 1000);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [play]);

  const handlePointerMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    const clampedX = Math.max(-1, Math.min(1, nx));
    const clampedY = Math.max(-1, Math.min(1, ny));
    setPointer({ x: clampedX, y: clampedY, active: true });

    if (onRead) {
      const panDeg = Math.round(clampedX * 45);
      const tiltDeg = Math.round(-15 - clampedY * 20);
      onRead(
        `PAN ${panDeg >= 0 ? '+' : ''}${panDeg}° • TILT ${tiltDeg}° • 4K IR LOCK`
      );
    }
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0, active: false });
    if (onRead) onRead('');
  };

  // Smooth autonomous patrol sweep when mouse isn't hovering, or direct mouse lock on hover
  const autoPan = Math.sin(scanTime * 1.1) * 0.45;
  const autoTilt = Math.cos(scanTime * 0.8) * 0.22;
  const aimX = pointer.active ? pointer.x : autoPan;
  const aimY = pointer.active ? pointer.y : autoTilt;

  const azDeg = -34 + aimX * 18 * intensity;
  const k = Math.max(0.38, Math.min(0.68, 0.5 + aimY * 0.1 * intensity));
  const P = createProjector(azDeg, k, 1.52, 120, 98);

  // Surveillance Floor Detection Zone Grid (z = -22, stays cleanly inside the borders)
  const floorGrid = poly([
    P(-28, -24, -22),
    P(28, -24, -22),
    P(28, 24, -22),
    P(-28, 24, -22)
  ]);

  const floorLines = [];
  for (let g = -16; g <= 16; g += 16) {
    floorLines.push(seg(P(g, -24, -22), P(g, 24, -22)));
    floorLines.push(seg(P(-28, g, -22), P(28, g, -22)));
  }

  // Wall/Mast Mounting Bracket & Gimbal Arm at Rear-Left [-30..-18, -12..2, 6..24]
  const wallMountFaces = buildIsoBox(P, -30, -12, 6, -24, 2, 24, azDeg);
  const armBarFaces = buildIsoBox(P, -24, -8, 12, -12, -2, 18, azDeg);

  // Camera Housing Pivots dynamically around (-10, -6, 14) based on aimX / aimY!
  const camOffsetY = aimX * 7;
  const camTiltZ = -aimY * 6;

  // Armored IP CCTV Camera Main Body & Sunshield Hood
  const camBodyFaces = buildIsoBox(
    P,
    -12,
    -12 + camOffsetY * 0.3,
    6 + camTiltZ * 0.3,
    12,
    5 + camOffsetY * 0.6,
    21 + camTiltZ * 0.6,
    azDeg
  );

  // Upper Sun-Shield Visor Overhang
  const visorFaces = buildIsoBox(
    P,
    -13,
    -13 + camOffsetY * 0.3,
    20 + camTiltZ * 0.5,
    14.5,
    6 + camOffsetY * 0.6,
    23.5 + camTiltZ * 0.6,
    azDeg
  );

  // Front Optical Lens Barrel & Infrared LED Ring at X = 12..16
  const lensCenterX = 14;
  const lensCenterY = -3.5 + camOffsetY * 0.55;
  const lensCenterZ = 13.5 + camTiltZ * 0.55;

  const lensOuterPts = [];
  const lensInnerPts = [];
  const irDots = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    lensOuterPts.push(
      P(lensCenterX, lensCenterY + Math.cos(a) * 6.8, lensCenterZ + Math.sin(a) * 6.8)
    );
    lensInnerPts.push(
      P(lensCenterX + 1.1, lensCenterY + Math.cos(a) * 3.5, lensCenterZ + Math.sin(a) * 3.5)
    );
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    irDots.push(
      P(lensCenterX + 0.55, lensCenterY + Math.cos(a) * 5.2, lensCenterZ + Math.sin(a) * 5.2)
    );
  }

  // Target Reticle on the Surveillance Floor Plane tracking the Cursor
  const targetX = 12 + aimX * 11;
  const targetY = 5 + aimY * 12;
  const targetZ = -22;

  const fovCorners = [
    P(targetX - 8, targetY - 7, targetZ),
    P(targetX + 8, targetY - 7, targetZ),
    P(targetX + 8, targetY + 7, targetZ),
    P(targetX - 8, targetY + 7, targetZ)
  ];
  const fovZone = poly(fovCorners);
  const lensOrigin = P(lensCenterX + 1.1, lensCenterY, lensCenterZ);
  const targetCenter = P(targetX, targetY, targetZ);

  const plateColor = 'var(--hairline-plate, #0f172a)';
  const hiColor = 'var(--hairline-hi, #38bdf8)';
  const edgeColor = 'var(--hairline-edge, #7dd3fc)';
  const midColor = 'var(--hairline-mid, #0284c7)';
  const loColor = 'var(--hairline-lo, #1e3a8a)';
  const strokeW = 'var(--hairline-stroke, 1.25)';

  return (
    <div
      data-hairline=""
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ aspectRatio: '5 / 4', position: 'relative' }}
      className={`w-full h-full select-none cursor-crosshair overflow-hidden ${className}`}
      aria-label={label}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 192"
        className="w-full h-full block overflow-hidden"
        style={{
          strokeWidth: strokeW,
          strokeLinejoin: 'round',
          strokeLinecap: 'round'
        }}
      >
        {/* Floor Detection Plane & Grid */}
        <path d={floorGrid} fill={plateColor} stroke={loColor} />
        {floorLines.map((d, i) => (
          <path key={`fl-${i}`} d={d} fill="none" stroke={loColor} strokeDasharray="1 3" />
        ))}

        {/* Field-of-View Target Footprint on Floor */}
        <path d={fovZone} fill="none" stroke={hiColor} />
        <circle cx={targetCenter[0]} cy={targetCenter[1]} r="2.6" fill={hiColor} />

        {/* 4 Optical FOV Laser Rays from Camera Lens to Target Footprint */}
        {fovCorners.map((pt, i) => (
          <path
            key={`ray-${i}`}
            d={seg(lensOrigin, pt)}
            fill="none"
            stroke={i % 2 === 0 ? hiColor : midColor}
            strokeDasharray="2 3"
          />
        ))}
        <path d={seg(lensOrigin, targetCenter)} fill="none" stroke={hiColor} />

        {/* Wall Mounting Bracket & Gimbal Arm */}
        {wallMountFaces.map((f, i) => (
          <path key={`wm-${i}`} d={f.d} fill={plateColor} stroke={midColor} />
        ))}
        {armBarFaces.map((f, i) => (
          <path key={`arm-${i}`} d={f.d} fill={plateColor} stroke={edgeColor} />
        ))}

        {/* Main Motorized CCTV Camera Housing */}
        {camBodyFaces.map((f, i) => (
          <path
            key={`cb-${i}`}
            d={f.d}
            fill={plateColor}
            stroke={f.kind === 'top' || f.kind === 'frontX' ? edgeColor : midColor}
          />
        ))}

        {/* Optical Lens Barrel & Infrared Night-Vision Array */}
        <path d={poly(lensOuterPts)} fill={plateColor} stroke={edgeColor} />
        {irDots.map((pt, i) => (
          <circle key={`ir-${i}`} cx={pt[0]} cy={pt[1]} r="1.35" fill={hiColor} />
        ))}
        <path d={poly(lensInnerPts)} fill={plateColor} stroke={hiColor} />
        <circle cx={lensOrigin[0]} cy={lensOrigin[1]} r="2.2" fill={hiColor} />

        {/* Upper Weatherproof Sun-Shield Visor */}
        {visorFaces.map((f, i) => (
          <path
            key={`vs-${i}`}
            d={f.d}
            fill={plateColor}
            stroke={f.kind === 'top' ? hiColor : edgeColor}
          />
        ))}
      </svg>
    </div>
  );
};
