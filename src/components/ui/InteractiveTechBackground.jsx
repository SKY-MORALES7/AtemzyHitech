import React, { useEffect, useRef } from 'react';
import {
  Zap,
  Cpu,
  Server,
  Wifi,
  Radio,
  Network,
  Cable,
  BatteryCharging,
  Activity,
  ShieldCheck,
  Database,
  Router
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TECH_NODES = [
  { Icon: Zap, x: 7, y: 12, depth: 1.3, size: 22, rotate: -12 },
  { Icon: Cpu, x: 88, y: 16, depth: 0.9, size: 24, rotate: 8 },
  { Icon: Server, x: 14, y: 34, depth: 1.1, size: 20, rotate: 6 },
  { Icon: Wifi, x: 82, y: 38, depth: 1.4, size: 22, rotate: -8 },
  { Icon: Network, x: 6, y: 58, depth: 0.85, size: 24, rotate: 14 },
  { Icon: Cable, x: 92, y: 62, depth: 1.25, size: 21, rotate: -10 },
  { Icon: Radio, x: 18, y: 78, depth: 1.05, size: 20, rotate: -6 },
  { Icon: BatteryCharging, x: 85, y: 82, depth: 1.15, size: 22, rotate: 10 },
  { Icon: Router, x: 48, y: 24, depth: 0.75, size: 19, rotate: -5 },
  { Icon: Activity, x: 52, y: 68, depth: 0.95, size: 20, rotate: 7 },
  { Icon: Database, x: 28, y: 92, depth: 1.2, size: 19, rotate: -9 },
  { Icon: ShieldCheck, x: 73, y: 94, depth: 0.8, size: 21, rotate: 6 }
];

/**
 * InteractiveTechBackground
 * Subtle ambient Electrical & ICT icon field across the page body that reacts
 * smoothly to mouse movement, touch drag, and window scroll.
 */
export const InteractiveTechBackground = () => {
  const { isDark } = useTheme();
  const nodeRefs = useRef([]);
  const stateRef = useRef({
    pointerX: 0,
    pointerY: 0,
    targetPointerX: 0,
    targetPointerY: 0,
    scrollY: 0,
    targetScrollY: 0,
    rafId: null
  });

  useEffect(() => {
    const state = stateRef.current;
    state.scrollY = window.scrollY || 0;
    state.targetScrollY = state.scrollY;

    const handleMouseMove = (e) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      state.targetPointerX = (e.clientX / vw - 0.5) * 2; // -1 to 1
      state.targetPointerY = (e.clientY / vh - 0.5) * 2; // -1 to 1
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      state.targetPointerX = (touch.clientX / vw - 0.5) * 2;
      state.targetPointerY = (touch.clientY / vh - 0.5) * 2;
    };

    const handleScroll = () => {
      state.targetScrollY = window.scrollY || 0;
    };

    const animate = () => {
      state.pointerX += (state.targetPointerX - state.pointerX) * 0.08;
      state.pointerY += (state.targetPointerY - state.pointerY) * 0.08;
      state.scrollY += (state.targetScrollY - state.scrollY) * 0.1;

      const vh = window.innerHeight || 900;

      nodeRefs.current.forEach((el, idx) => {
        if (!el) return;
        const node = TECH_NODES[idx];
        const scrollShift = ((state.scrollY * 0.12 * node.depth) % (vh * 0.45));
        const moveX = state.pointerX * 28 * node.depth;
        const moveY = state.pointerY * 24 * node.depth - scrollShift;
        const rot = node.rotate + state.pointerX * 10 * node.depth + (state.scrollY * 0.015 * (idx % 2 === 0 ? 1 : -1));

        el.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
      });

      state.rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    state.rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      if (state.rafId) cancelAnimationFrame(state.rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-[1]"
    >
      {TECH_NODES.map((node, idx) => {
        const IconComp = node.Icon;
        return (
          <div
            key={idx}
            ref={(el) => {
              nodeRefs.current[idx] = el;
            }}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              willChange: 'transform'
            }}
            className={`absolute flex items-center justify-center rounded-2xl border backdrop-blur-[2px] p-2.5 transition-colors duration-500 ${
              isDark
                ? 'bg-slate-900/25 border-sky-400/15 text-sky-400/25 shadow-[0_0_24px_rgba(56,189,248,0.06)]'
                : 'bg-blue-50/40 border-blue-500/15 text-blue-600/20 shadow-sm'
            }`}
          >
            <IconComp style={{ width: node.size, height: node.size }} strokeWidth={1.6} />
          </div>
        );
      })}
    </div>
  );
};

