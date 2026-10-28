import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * CircuitryHeroCanvas
 * Inspired by turbulent.ca interactive technical canvas & PCB/HV circuitry architecture.
 * Renders an orthogonal + 45-degree PCB circuit board matrix with IC microprocessor packages,
 * via pads, and high-speed electric signal pulses that react dynamically to mouse, touch, and scroll.
 */
export const CircuitryHeroCanvas = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = null;

    // Pointer & scroll state for Turbulent-style field interaction
    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      vx: 0,
      vy: 0,
      active: false,
      scrollBoost: 0
    };

    let nodes = [];
    let traces = [];
    let pulses = [];
    let chips = [];
    let ripples = [];

    // Build deterministic + organic PCB circuit topology on resize
    const buildCircuitTopology = () => {
      nodes = [];
      traces = [];
      pulses = [];
      chips = [];

      const spacing = width < 640 ? 56 : 68;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      const grid = [];

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          // Slight deterministic offset for 45-degree PCB routing feel
          const baseX = (c - 0.5) * spacing;
          const baseY = (r - 0.5) * spacing;
          const isVia = (r * 7 + c * 13) % 5 === 0;
          const isPin = (r * 3 + c * 5) % 9 === 0;
          const node = {
            id: r * cols + c,
            r,
            c,
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            isVia,
            isPin,
            energy: 0,
            neighbors: []
          };
          grid[r][c] = node;
          nodes.push(node);
        }
      }

      // Create IC Microprocessor / Substation Logic Blocks
      const chipCount = width < 640 ? 3 : 6;
      for (let i = 0; i < chipCount; i++) {
        const cr = Math.floor(((i + 1) * rows) / (chipCount + 1));
        const cc = Math.floor((((i * 3 + 1) % ( chipCount )) + 1) * (cols / (chipCount + 1)));
        if (grid[cr] && grid[cr][cc]) {
          const centerNode = grid[cr][cc];
          chips.push({
            node: centerNode,
            w: spacing * 1.35,
            h: spacing * 0.95,
            label: ['HV-33KV', 'ICT-CORE', 'SCADA-PLC', 'FIBER-MUX', 'UPS-SYNC', 'SW-L3'][i % 6],
            pins: 6
          });
        }
      }

      // Connect PCB traces (orthogonal + 45-degree chamfered PCB paths)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const curr = grid[r][c];
          const hash = (r * 31 + c * 17) % 10;

          // Horizontal trace with 45-deg chamfer midpoint
          if (c + 1 < cols && hash < 7) {
            const next = grid[r][c + 1];
            const chamfer = (r + c) % 2 === 0 ? 10 : -10;
            const trace = {
              a: curr,
              b: next,
              chamfer,
              type: 'h',
              energy: 0
            };
            traces.push(trace);
            curr.neighbors.push({ node: next, trace });
            next.neighbors.push({ node: curr, trace });
          }

          // Vertical trace
          if (r + 1 < rows && hash >= 3) {
            const below = grid[r + 1][c];
            const chamfer = (r * c) % 2 === 0 ? 10 : -10;
            const trace = {
              a: curr,
              b: below,
              chamfer,
              type: 'v',
              energy: 0
            };
            traces.push(trace);
            curr.neighbors.push({ node: below, trace });
            below.neighbors.push({ node: curr, trace });
          }

          // 45-degree diagonal bus trace
          if (r + 1 < rows && c + 1 < cols && hash === 2) {
            const diag = grid[r + 1][c + 1];
            const trace = {
              a: curr,
              b: diag,
              chamfer: 0,
              type: 'd',
              energy: 0
            };
            traces.push(trace);
            curr.neighbors.push({ node: diag, trace });
            diag.neighbors.push({ node: curr, trace });
          }
        }
      }

      // Seed initial autonomous electric pulses
      const initialPulses = width < 640 ? 18 : 36;
      for (let i = 0; i < initialPulses; i++) {
        spawnPulse();
      }
    };

    const spawnPulse = (startNode = null, boosted = false) => {
      if (traces.length === 0) return;
      let chosenTrace = null;
      let forward = true;

      if (startNode && startNode.neighbors.length > 0) {
        const pick = startNode.neighbors[Math.floor(Math.random() * startNode.neighbors.length)];
        chosenTrace = pick.trace;
        forward = chosenTrace.a === startNode;
      } else {
        chosenTrace = traces[Math.floor(Math.random() * traces.length)];
        forward = Math.random() > 0.5;
      }

      pulses.push({
        trace: chosenTrace,
        forward,
        t: 0,
        speed: boosted ? 0.032 + Math.random() * 0.02 : 0.012 + Math.random() * 0.014,
        boosted,
        hopsLeft: boosted ? 4 : 8 + Math.floor(Math.random() * 8)
      });
    };

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: 760
      };
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCircuitTopology();
    };

    const updatePointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      pointer.vx = x - pointer.targetX;
      pointer.vy = y - pointer.targetY;
      pointer.targetX = x;
      pointer.targetY = y;
      pointer.active = true;

      if (pointer.x < -1000) {
        pointer.x = x;
        pointer.y = y;
      }
    };

    const handleMouseMove = (e) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      updatePointer(clientX, clientY);

      ripples.push({
        x: pointer.targetX,
        y: pointer.targetY,
        radius: 10,
        maxRadius: 340,
        alpha: 0.9
      });

      // Spawn burst of high-voltage pulses from nearest node
      let nearest = null;
      let minDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const d = Math.hypot(n.x - pointer.targetX, n.y - pointer.targetY);
        if (d < minDist) {
          minDist = d;
          nearest = n;
        }
      }
      if (nearest) {
        for (let k = 0; k < 6; k++) {
          spawnPulse(nearest, true);
        }
      }
    };

    const handleMouseLeave = () => {
      pointer.active = false;
    };

    let lastScrollY = window.scrollY || 0;
    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = Math.abs(currentY - lastScrollY);
      lastScrollY = currentY;
      pointer.scrollBoost = Math.min(1, pointer.scrollBoost + delta * 0.015);
    };

    // Helper to get point along a chamfered PCB trace at progress t in [0, 1]
    const getTracePoint = (trace, t) => {
      const ax = trace.a.x;
      const ay = trace.a.y;
      const bx = trace.b.x;
      const by = trace.b.y;

      if (trace.type === 'd' || trace.chamfer === 0) {
        return {
          x: ax + (bx - ax) * t,
          y: ay + (by - ay) * t
        };
      }

      // 3-segment PCB trace: straight -> 45-deg bend -> straight
      const mx1 = ax + (bx - ax) * 0.35;
      const my1 = ay + (by - ay) * 0.35 + (trace.type === 'h' ? trace.chamfer : 0);
      const mx2 = ax + (bx - ax) * 0.65;
      const my2 = ay + (by - ay) * 0.65 + (trace.type === 'h' ? trace.chamfer : 0);

      if (t < 0.35) {
        const lt = t / 0.35;
        return { x: ax + (mx1 - ax) * lt, y: ay + (my1 - ay) * lt };
      } else if (t < 0.65) {
        const lt = (t - 0.35) / 0.3;
        return { x: mx1 + (mx2 - mx1) * lt, y: my1 + (my2 - my1) * lt };
      } else {
        const lt = (t - 0.65) / 0.35;
        return { x: mx2 + (bx - mx2) * lt, y: my2 + (by - my2) * lt };
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer interpolation
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.14;
        pointer.y += (pointer.targetY - pointer.y) * 0.14;
      } else {
        pointer.x += (-9999 - pointer.x) * 0.05;
        pointer.y += (-9999 - pointer.y) * 0.05;
      }
      pointer.scrollBoost *= 0.92;

      const influenceRadius = width < 640 ? 150 : 230;
      const baseTraceColor = isDark ? 'rgba(56, 189, 248, 0.13)' : 'rgba(2, 132, 199, 0.14)';
      const activeTraceRGB = isDark ? '56, 189, 248' : '37, 99, 235';
      const pulseCoreColor = isDark ? '#e0f2fe' : '#1d4ed8';
      const pulseGlowColor = isDark ? '#38bdf8' : '#0284c7';

      // 1. Update node positions & electromagnetic energy from pointer & ripples
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.baseX - pointer.x;
        const dy = n.baseY - pointer.y;
        const dist = Math.hypot(dx, dy);

        if (dist < influenceRadius && dist > 0.01) {
          const factor = 1 - dist / influenceRadius;
          // Turbulent-style subtle magnetic lens displacement
          const pull = Math.sin(factor * Math.PI) * 9;
          n.x = n.baseX + (dx / dist) * pull;
          n.y = n.baseY + (dy / dist) * pull;
          n.energy = Math.max(n.energy, factor * 0.95);

          // Occasional spark when moving cursor across nodes
          if (Math.random() < 0.012 * factor && pulses.length < 75) {
            spawnPulse(n, true);
          }
        } else {
          n.x += (n.baseX - n.x) * 0.15;
          n.y += (n.baseY - n.y) * 0.15;
        }

        // Apply ripple ring energy
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const rDist = Math.abs(Math.hypot(n.baseX - rip.x, n.baseY - rip.y) - rip.radius);
          if (rDist < 36) {
            n.energy = Math.max(n.energy, (1 - rDist / 36) * rip.alpha);
          }
        }

        n.energy = Math.max(0, n.energy * 0.93 + pointer.scrollBoost * 0.08);
      }

      // 2. Draw PCB Traces
      ctx.lineWidth = 1.25;
      for (let i = 0; i < traces.length; i++) {
        const tr = traces[i];
        const traceEnergy = Math.max(tr.energy, (tr.a.energy + tr.b.energy) * 0.5);
        tr.energy *= 0.9;

        const p0 = { x: tr.a.x, y: tr.a.y };
        const p1 = getTracePoint(tr, 0.35);
        const p2 = getTracePoint(tr, 0.65);
        const p3 = { x: tr.b.x, y: tr.b.y };

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        if (tr.type === 'd' || tr.chamfer === 0) {
          ctx.lineTo(p3.x, p3.y);
        } else {
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
        }

        if (traceEnergy > 0.05) {
          const alpha = Math.min(0.85, 0.15 + traceEnergy * 0.75);
          ctx.strokeStyle = `rgba(${activeTraceRGB}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.25 + traceEnergy * 1.1;
        } else {
          ctx.strokeStyle = baseTraceColor;
          ctx.lineWidth = 1.15;
        }
        ctx.stroke();
      }

      // 3. Draw Solder Vias & Circuit Pads
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n.isVia && !n.isPin && n.energy < 0.1) continue;

        const alpha = Math.min(0.9, 0.22 + n.energy * 0.75);
        ctx.strokeStyle = `rgba(${activeTraceRGB}, ${alpha.toFixed(3)})`;
        ctx.fillStyle = isDark ? '#020617' : '#ffffff';

        if (n.isVia) {
          // Outer solder ring + inner drill hole
          const radius = 3.2 + n.energy * 1.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 1.4;
          ctx.stroke();

          if (n.energy > 0.25) {
            ctx.fillStyle = pulseGlowColor;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (n.isPin || n.energy > 0.2) {
          // Square IC terminal pad
          const sz = 4 + n.energy * 2;
          ctx.fillRect(n.x - sz / 2, n.y - sz / 2, sz, sz);
          ctx.strokeRect(n.x - sz / 2, n.y - sz / 2, sz, sz);
        }
      }

      // 4. Draw IC Microprocessor / Power Logic Modules
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < chips.length; i++) {
        const chip = chips[i];
        const cx = chip.node.x;
        const cy = chip.node.y;
        const e = chip.node.energy;
        const hw = chip.w / 2;
        const hh = chip.h / 2;

        // IC pins along top and bottom
        ctx.strokeStyle = `rgba(${activeTraceRGB}, ${(0.3 + e * 0.6).toFixed(2)})`;
        ctx.lineWidth = 1.4;
        for (let p = -2; p <= 2; p++) {
          const px = cx + p * (chip.w / 6);
          ctx.beginPath();
          ctx.moveTo(px, cy - hh - 6);
          ctx.lineTo(px, cy - hh);
          ctx.moveTo(px, cy + hh);
          ctx.lineTo(px, cy + hh + 6);
          ctx.stroke();
        }

        // IC Package Body
        ctx.fillStyle = isDark ? 'rgba(9, 14, 26, 0.92)' : 'rgba(248, 250, 252, 0.94)';
        ctx.strokeStyle = `rgba(${activeTraceRGB}, ${(0.38 + e * 0.62).toFixed(2)})`;
        ctx.lineWidth = 1.5 + e * 1.2;
        ctx.beginPath();
        ctx.roundRect(cx - hw, cy - hh, chip.w, chip.h, 6);
        ctx.fill();
        ctx.stroke();

        // IC Label
        ctx.fillStyle = isDark
          ? `rgba(125, 211, 252, ${(0.55 + e * 0.45).toFixed(2)})`
          : `rgba(37, 99, 235, ${(0.65 + e * 0.35).toFixed(2)})`;
        ctx.fillText(chip.label, cx, cy);
      }

      // 5. Update & Render Traveling High-Speed Electric Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed + pointer.scrollBoost * 0.015;

        const progress = p.forward ? p.t : 1 - p.t;
        const clamped = Math.max(0, Math.min(1, progress));
        const pos = getTracePoint(p.trace, clamped);

        const tailDelta = p.forward ? -0.14 : 0.14;
        const tailPos = getTracePoint(p.trace, Math.max(0, Math.min(1, clamped + tailDelta)));

        p.trace.energy = Math.max(p.trace.energy, p.boosted ? 0.9 : 0.55);

        // Glowing pulse trail
        const grad = ctx.createLinearGradient(tailPos.x, tailPos.y, pos.x, pos.y);
        grad.addColorStop(0, `rgba(${activeTraceRGB}, 0)`);
        grad.addColorStop(1, pulseGlowColor);

        ctx.strokeStyle = grad;
        ctx.lineWidth = p.boosted ? 2.8 : 2.1;
        ctx.beginPath();
        ctx.moveTo(tailPos.x, tailPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        // Photon head
        ctx.fillStyle = pulseCoreColor;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.boosted ? 2.6 : 2.0, 0, Math.PI * 2);
        ctx.fill();

        if (p.t >= 1) {
          const arrivedNode = p.forward ? p.trace.b : p.trace.a;
          arrivedNode.energy = Math.max(arrivedNode.energy, p.boosted ? 0.95 : 0.6);

          if (p.hopsLeft > 1 && arrivedNode.neighbors.length > 0) {
            const candidates = arrivedNode.neighbors.filter((nb) => nb.trace !== p.trace);
            const nextPick =
              candidates.length > 0
                ? candidates[Math.floor(Math.random() * candidates.length)]
                : arrivedNode.neighbors[0];
            p.trace = nextPick.trace;
            p.forward = p.trace.a === arrivedNode;
            p.t = 0;
            p.hopsLeft -= 1;
          } else {
            pulses.splice(i, 1);
            if (pulses.length < (width < 640 ? 18 : 36)) {
              spawnPulse();
            }
          }
        }
      }

      // 6. Render Click/Tap Electromagnetic Surge Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 7;
        rip.alpha *= 0.95;

        ctx.strokeStyle = `rgba(${activeTraceRGB}, ${(rip.alpha * 0.55).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (rip.radius > rip.maxRadius || rip.alpha < 0.03) {
          ripples.splice(i, 1);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
};
