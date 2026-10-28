import React, { useEffect, useRef, useState } from 'react';
import {
  Terrain,
  Sieve,
  Phosphor,
  Riffle,
  Exploded,
  Plug,
  Patch,
  Cabinet,
  Router,
  Dish,
  Relay,
  Hub,
  Terminal,
  Vault
} from '@lucasmarkes/hairline/react';
import { useTheme } from '../../context/ThemeContext';

const figureMap = {
  Phosphor,
  Terrain,
  Riffle,
  Exploded,
  Sieve,
  Plug,
  Patch,
  Cabinet,
  Router,
  Dish,
  Relay,
  Hub,
  Terminal,
  Vault
};

/**
 * ScrollReveal Wrapper
 * Triggers smooth hardware-accelerated entrance & scroll-linked parallax effects
 * as elements enter the viewport while scrolling.
 */
export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up' | 'left' | 'right' | 'scale'
  threshold = 0.12
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenTransform = {
    up: 'translate3d(0, 36px, 0) scale(0.98)',
    left: 'translate3d(-36px, 0, 0) scale(0.98)',
    right: 'translate3d(36px, 0, 0) scale(0.98)',
    scale: 'translate3d(0, 20px, 0) scale(0.93)'
  }[direction] || 'translate3d(0, 36px, 0)';

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform,
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform'
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * HairlineScrollFigure
 * Renders an interactive @lucasmarkes/hairline isometric figure that activates
 * on scroll (play=true when scrolled into view) and responds to pointer, touch & scroll intensity.
 * Properly themes --hairline-plate, --hairline-hi, --hairline-edge, --hairline-mid, --hairline-lo
 * so figures glow with electric cyan/blue in dark mode instead of appearing black.
 */
export const HairlineScrollFigure = ({
  figure = 'Router',
  label = 'Interactive electrical and ICT telemetry schematic',
  badge = 'Live Telemetry',
  title = 'Isometric Schematic',
  subtitle = 'Interactive pointer, touch & scroll-reactive engineering model',
  className = ''
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [scrollIntensity, setScrollIntensity] = useState(0.7);
  const [readout, setReadout] = useState('');

  const FigureComponent = figureMap[figure] || Router;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 800;
      const centerOffset =
        1 - Math.min(1, Math.abs(rect.top + rect.height / 2 - viewportHeight / 2) / (viewportHeight / 2));
      const dynamicIntensity = Number((0.5 + centerOffset * 0.5).toFixed(2));
      setScrollIntensity(dynamicIntensity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [inView]);

  // Electric cyan/blue palette in Dark Mode (never black!), crisp royal blue in Light Mode
  const hairlineVars = isDark
    ? {
        '--hairline-plate': '#0f172a',
        '--hairline-hi': '#38bdf8',
        '--hairline-edge': '#7dd3fc',
        '--hairline-mid': '#0284c7',
        '--hairline-lo': '#1e3a8a',
        '--hairline-stroke': '1.25'
      }
    : {
        '--hairline-plate': '#ffffff',
        '--hairline-hi': '#1d4ed8',
        '--hairline-edge': '#2563eb',
        '--hairline-mid': '#60a5fa',
        '--hairline-lo': '#bfdbfe',
        '--hairline-stroke': '1.25'
      };

  return (
    <div
      ref={containerRef}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${
        isDark
          ? 'bg-slate-900/90 border-sky-500/30 hover:border-sky-400 shadow-2xl shadow-sky-950/50'
          : 'bg-white border-slate-200 hover:border-blue-600 shadow-lg'
      } ${className}`}
    >
      {/* Top Technical Status Bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b text-[11px] font-mono uppercase tracking-wider ${
        isDark ? 'bg-slate-950/90 border-slate-800 text-sky-400' : 'bg-slate-100 border-slate-200 text-blue-700'
      }`}>
        <span className="flex items-center gap-2 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {badge}
        </span>
        <span className="opacity-85">SIGNAL {(scrollIntensity * 100).toFixed(0)}%</span>
      </div>

      {/* Isometric Hairline SVG Figure */}
      <div
        className="relative w-full h-56 sm:h-64 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-[1.03]"
        style={hairlineVars}
      >
        <FigureComponent
          intensity={scrollIntensity}
          play={inView}
          theme={isDark ? 'dark' : 'light'}
          label={label}
          onRead={(txt) => setReadout(txt)}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Readout Caption */}
      <div className={`px-4 py-3 border-t transition-colors ${
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-xs font-extrabold uppercase tracking-wide ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {title}
          </h4>
          {readout && (
            <span className="text-[10px] font-mono text-sky-400 truncate max-w-[140px]">
              {readout}
            </span>
          )}
        </div>
        <p className={`mt-0.5 text-[11px] leading-snug ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};
