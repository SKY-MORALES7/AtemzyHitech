import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowDown,
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Server, 
  Cpu, 
  Truck, 
  Network, 
  Router as RouterIcon,
  Cable, 
  Award,
  PhoneCall,
  Activity
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { services } from '../data/services';
import { projects } from '../data/projects';
import { BrutalistCard } from '../components/cards/BrutalistCard';
import { TurbulentHero3D } from '../components/canvas/TurbulentHero3D';
import { ScrollReveal, HairlineScrollFigure } from '../components/ui/ScrollReveal';
import { useTheme } from '../context/ThemeContext';

// Map icon strings to Electrical & ICT Lucide components
const iconMap = {
  Zap: Zap,
  Server: Server,
  Cpu: Cpu,
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  Network: Network,
  Router: RouterIcon
};

export const Home = () => {
  const { isDark } = useTheme();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const heroTrackRef = useRef(null);
  const afterHeroRef = useRef(null);
  const [heroScroll, setHeroScroll] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(5);
  const [loaderHidden, setLoaderHidden] = useState(false);

  // Smooth bottom-right side loading effect (5 -> 95 -> 100) matching the turbulent.ca recording
  useEffect(() => {
    let timerId;
    const stepLoader = () => {
      setLoadProgress((prev) => {
        if (prev >= 100) return 100;
        if (!sceneReady && prev >= 95) return 95;
        const step = prev < 60 ? 18 : prev < 90 ? 12 : 5;
        return Math.min(sceneReady ? 100 : 95, prev + step);
      });
    };

    timerId = setInterval(stepLoader, 90);
    return () => clearInterval(timerId);
  }, [sceneReady]);

  useEffect(() => {
    if (loadProgress >= 100) {
      const timeout = setTimeout(() => setLoaderHidden(true), 320);
      return () => clearTimeout(timeout);
    }
  }, [loadProgress]);

  // Compute 0 -> 1 scroll progress through the sticky scrollytelling hero track
  useEffect(() => {
    const handleScroll = () => {
      const track = heroTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
      const scrolled = Math.min(scrollableDistance, Math.max(0, -rect.top));
      setHeroScroll(scrolled / scrollableDistance);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToNextStageOrContent = () => {
    const track = heroTrackRef.current;
    if (!track) return;
    const scrollableDistance = Math.max(1, track.offsetHeight - window.innerHeight);
    if (heroScroll < 0.35) {
      window.scrollTo({
        top: track.offsetTop + scrollableDistance * 0.5,
        behavior: 'smooth'
      });
    } else if (heroScroll < 0.75) {
      window.scrollTo({
        top: track.offsetTop + scrollableDistance * 0.96,
        behavior: 'smooth'
      });
    } else if (afterHeroRef.current) {
      afterHeroRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Line-masked scroll transitions across the 3 Hero stages (matching 00:10 -> 00:36 -> 00:41 in recording)
  // Stage 1 (0.00 -> 0.33): "We engineer power- / igniting networks" + "↓ SCROLL"
  const stage1Exit = Math.max(0, Math.min(1, (heroScroll - 0.16) / 0.17));
  const stage1Opacity = 1 - stage1Exit;
  const stage1LineOffset = stage1Exit * -110;

  // Stage 2 (0.28 -> 0.68): "that fuel digital / infrastructures"
  const stage2Enter = Math.max(0, Math.min(1, (heroScroll - 0.26) / 0.14));
  const stage2Exit = Math.max(0, Math.min(1, (heroScroll - 0.54) / 0.15));
  const stage2Opacity = Math.min(stage2Enter, 1 - stage2Exit);
  const stage2LineOffset = (1 - stage2Enter) * 105 - stage2Exit * 110;

  // Stage 3 (0.64 -> 1.00): "and deliver / uninterrupted / uptime." + "(→) LEARN MORE"
  const stage3Enter = Math.max(0, Math.min(1, (heroScroll - 0.63) / 0.18));
  const stage3Opacity = stage3Enter;
  const stage3LineOffset = (1 - stage3Enter) * 105;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* =====================================================================
          1. THREE-STAGE 3D ISOMETRIC SCROLLYTELLING HERO + SIDE LOADING BAR
             - Loader (00:00-00:08): Bottom-right cyan percentage + vertical bar
             - Stage 1 (Top): "We engineer power- / igniting networks" + "↓ SCROLL"
             - Stage 2 (Mid): "that fuel digital / infrastructures"
             - Stage 3 (End): "and deliver / uninterrupted / uptime." + "(→) LEARN MORE"
         ===================================================================== */}
      <section
        ref={heroTrackRef}
        className="turbulent-hero-stage relative h-[300vh] -mt-24 sm:-mt-28 select-none"
      >
        <div
          style={{
            background:
              'radial-gradient(circle at 75% 50%, #092042 0%, #021129 55%, #010814 100%)'
          }}
          className="sticky top-0 h-screen w-full overflow-hidden border-b border-slate-800/80"
        >
          {/* 3D Isometric Engineering Machine aligned flush to the right edge */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              loaderHidden ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <TurbulentHero3D
              scrollProgress={heroScroll}
              isLoaded={loaderHidden}
              onReady={() => setSceneReady(true)}
            />
          </div>

          {/* BOTTOM-RIGHT SIDE LOADING OVERLAY (Exact 00:00 -> 00:08 Screen Recording Effect) */}
          <div
            aria-hidden={loaderHidden}
            className={`absolute inset-0 z-30 flex items-end justify-end p-6 sm:p-10 lg:p-12 bg-[#011836] transition-opacity duration-500 ${
              loaderHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight text-[#00d2ff]">
                {loadProgress}
              </span>
              <div className="relative h-20 sm:h-24 w-[2px] bg-slate-700/60 overflow-hidden rounded-full">
                <div
                  style={{ height: `${loadProgress}%` }}
                  className="absolute bottom-0 left-0 right-0 bg-[#00d2ff] transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* Subtle Left Scrim for Crisp White Editorial Typography */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-r from-[#010814]/85 via-[#010814]/35 to-transparent"
          />

          {/* STAGE 1 LEFT TEXT + BOTTOM-LEFT "↓ SCROLL" (00:10 -> 00:34) */}
          <div
            style={{
              opacity: loaderHidden ? stage1Opacity : 0,
              pointerEvents: loaderHidden && stage1Opacity > 0.15 ? 'auto' : 'none'
            }}
            className="absolute inset-0 z-10 flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-36 sm:pt-44 pb-12 sm:pb-16 transition-opacity duration-300"
          >
            <div className="my-auto">
              <h1
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: '#ffffff'
                }}
                className="text-[2.5rem] sm:text-[4.1rem] lg:text-[4.85rem] font-bold leading-[1.08] tracking-[-0.02em] text-white"
              >
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${stage1LineOffset.toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    We engineer power-
                  </span>
                </span>
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${(stage1LineOffset * 1.12).toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    igniting networks
                  </span>
                </span>
              </h1>
            </div>

            <div>
              <button
                type="button"
                onClick={scrollToNextStageOrContent}
                className="group inline-flex items-center gap-3 text-[11px] sm:text-xs font-extrabold tracking-[0.18em] uppercase text-[#00d2ff] hover:text-sky-300 transition-colors cursor-pointer"
              >
                <ArrowDown className="w-4 h-4 text-[#00d2ff] transition-transform group-hover:translate-y-1" />
                <span>SCROLL</span>
              </button>
            </div>
          </div>

          {/* STAGE 2 MIDDLE SCROLL TEXT (00:36 -> 00:39: "that fuel digital / infrastructures") */}
          <div
            style={{
              opacity: stage2Opacity,
              pointerEvents: stage2Opacity > 0.2 ? 'auto' : 'none'
            }}
            className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-16"
          >
            <div>
              <h2
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: '#ffffff'
                }}
                className="text-[2.5rem] sm:text-[4.1rem] lg:text-[4.85rem] font-bold leading-[1.08] tracking-[-0.02em] text-white"
              >
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${stage2LineOffset.toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    that fuel digital
                  </span>
                </span>
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${(stage2LineOffset * 1.15).toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    infrastructures
                  </span>
                </span>
              </h2>
            </div>
          </div>

          {/* STAGE 3 FINAL SCROLL TEXT + "(→) LEARN MORE" (00:41 -> 00:43) */}
          <div
            style={{
              opacity: stage3Opacity,
              pointerEvents: stage3Opacity > 0.15 ? 'auto' : 'none'
            }}
            className="absolute inset-0 z-10 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-16"
          >
            <div>
              <h2
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: '#ffffff'
                }}
                className="text-[2.5rem] sm:text-[4.1rem] lg:text-[4.85rem] font-bold leading-[1.08] tracking-[-0.02em] text-white"
              >
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${stage3LineOffset.toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    and deliver
                  </span>
                </span>
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${(stage3LineOffset * 1.12).toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    uninterrupted
                  </span>
                </span>
                <span className="block overflow-hidden py-1">
                  <span
                    style={{
                      transform: `translate3d(0, ${(stage3LineOffset * 1.24).toFixed(1)}%, 0)`
                    }}
                    className="block will-change-transform"
                  >
                    uptime.
                  </span>
                </span>
              </h2>

              <div
                style={{
                  transform: `translate3d(0, ${(stage3LineOffset * 0.6).toFixed(1)}px, 0)`
                }}
                className="mt-10 sm:mt-12"
              >
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-3.5 text-xs sm:text-[13px] font-extrabold tracking-[0.16em] uppercase text-[#00d2ff] hover:text-white transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-[#00d2ff] text-[#010712] flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                  <span>LEARN MORE</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. SITE CONTENT REVEALED AFTER 3D HERO SCROLL
         ===================================================================== */}
      <div ref={afterHeroRef} className="relative z-10 bg-slate-950 pt-12 pb-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <ScrollReveal direction="up">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-8 rounded-2xl backdrop-blur-md shadow-2xl border transition-colors ${
              isDark 
                ? 'bg-slate-900/90 border-slate-700/60' 
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
            }`}>
              {companyInfo.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center p-2.5 sm:p-3 ${
                    idx % 2 === 0 ? 'border-r' : 'border-r-0 md:border-r'
                  } ${idx === 3 ? 'md:border-r-0' : ''} ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <span className={`block text-2xl sm:text-3xl md:text-4xl font-black ${
                    isDark ? 'text-sky-400' : 'text-blue-600'
                  }`}>
                    {stat.value}
                  </span>
                  <span className={`block mt-1 text-[11px] sm:text-xs md:text-sm font-semibold leading-tight ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* 3. CORPORATE INTRODUCTION & ELECTRICAL/ICT VALUE PROPOSITION */}
      <section className={`py-20 lg:py-28 border-b transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal direction="left" className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>About Atemzy Hitech</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                Powering Critical Infrastructure & Enterprise Digital Transformation
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Registered under the Corporate Affairs Commission ({companyInfo.rcNumber}), Atemzy Hitech Engineering Services Ltd was founded to solve mission-critical power and connectivity challenges through IEEE/IEC electrical standards, certified network engineers, and direct OEM hardware supply chains.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {companyInfo.coreValues.map((val, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border transition-all ${
                      isDark 
                        ? 'bg-slate-950/70 border-slate-800 hover:border-sky-500/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-white shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center gap-2 font-bold text-sm ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-400" />
                      <span>{val.title}</span>
                    </div>
                    <p className={`mt-1 text-xs leading-normal ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {val.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  to="/about"
                  className={isDark ? 'btn-3d-secondary text-xs py-2.5 px-5' : 'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-sm transition-all text-xs'}
                >
                  <span>Learn more about our engineering governance & certifications</span>
                  <ArrowRight className="w-4 h-4 text-sky-400" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={120} className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/data-center-ict.svg';
                  }}
                  alt="Atemzy Hitech data center fiber optics and electrical switchgear engineering"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border backdrop-blur-md transition-colors ${
                  isDark ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
                }`}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-sky-400 shrink-0" />
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>IEC, IEEE & NEMSA Certified Execution</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Strict adherence to international electrical safety and Tier-III ICT cabling standards.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE HAIRLINE TELEMETRY & SCROLL SHOWCASE */}
      <section className="py-20 lg:py-24 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>Interactive Circuit & Network Architecture</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Precision Across Every Layer
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Explore our interactive isometric schematics—scroll, touch, or move your cursor over each diagram to inspect how we unify high-voltage power, enterprise routing, and patch matrices.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <HairlineScrollFigure
                figure="Router"
                badge="Layer 01 • Enterprise Routing"
                title="Carrier Wi-Fi & SD-WAN Router"
                subtitle="High-gain directional beamforming, redundant WAN uplinks & zero-trust routing"
                label="Interactive wireless router schematic"
              />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <HairlineScrollFigure
                figure="Patch"
                badge="Layer 02 • Structured Cabling"
                title="24-Port Fiber & Cat6A Patch Matrix"
                subtitle="High-density optical patch panels, core switches & certified structured terminations"
                label="Interactive 24-port network patch panel schematic"
              />
            </ScrollReveal>
            <ScrollReveal delay={240}>
              <HairlineScrollFigure
                figure="Relay"
                badge="Layer 03 • SCADA & Packet Relay"
                title="Multi-Hop Telemetry & Relay Grid"
                subtitle="Deterministic PLC control loops, wireless routing & sub-millisecond failover"
                label="Interactive multi-hop relay and network routing schematic"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. CORE SERVICES OVERVIEW */}
      <section className="py-20 lg:py-28 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
              Capabilities Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Five Electrical & ICT Pillars
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Specialized engineering capabilities designed for financial institutions, telecom operators, industrial plants, and modern commercial campuses.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, idx) => {
              const IconComponent = iconMap[srv.iconName] || Zap;
              return (
                <ScrollReveal key={srv.id} delay={idx * 90}>
                  <BrutalistCard
                    icon={<IconComponent className="w-5 h-5" />}
                    title={srv.title}
                    tag={srv.badge}
                    description={srv.shortDescription}
                    features={srv.features.slice(0, 3)}
                    primaryActionText="Explore Scope"
                    primaryActionHref={`/services#${srv.slug}`}
                    secondaryActionText="Request Quote"
                    secondaryActionHref={`/quote?service=${encodeURIComponent(srv.category)}`}
                  />
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal className="mt-12 text-center">
            <Link
              to="/services"
              className="btn-3d-secondary text-sm py-3.5 px-8 inline-flex items-center gap-2"
            >
              <span>View Full Electrical & ICT Service Catalog</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. FEATURED PROJECTS PREVIEW */}
      <section className="py-20 lg:py-28 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
                Experience & Track Record
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Power & ICT Deployments
              </h2>
            </div>
            <Link
              to="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Explore All Verified Commissions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 100}>
                <div className="brutalist-card p-0 overflow-hidden flex flex-col justify-between h-full">
                  <div>
                    <div className="relative h-56 overflow-hidden border-b-2 border-slate-800">
                      <img
                        src={p.image}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = p.fallbackImage || '/images/electrical-substation.svg';
                        }}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-black uppercase bg-slate-950 text-white border-2 border-slate-900 shadow-[3px_3px_0px_#020617]">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                        {p.location} • {p.year}
                      </span>
                      <h3 className="mt-2 text-lg font-black uppercase text-white leading-tight">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {p.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/projects/${p.slug}`}
                      className="brutalist-card__button brutalist-card__button--mark w-full text-xs py-2.5"
                    >
                      <span>View Technical Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE ATEMZY HITECH */}
      <section className="py-20 lg:py-28 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
              Competitive Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Partner With Atemzy Hitech?
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              We eliminate downtime and integration bottlenecks through certified electrical & ICT engineering, direct OEM procurement channels, and proactive SLA accountability.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <BrutalistCard
                icon={<Award className="w-5 h-5" />}
                title="IEEE/IEC Engineering Rigor"
                tag="Certified QA/QC"
                description="All HV/LV power schematics, load-flow calculations, and fiber-optic architectures undergo multi-stage testing (OTDR, Megger & thermography) prior to commissioning."
                secondaryActionText="Learn Standards"
                secondaryActionHref="/about"
              />
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <BrutalistCard
                icon={<Cable className="w-5 h-5" />}
                title="Direct OEM Hardware Supply"
                tag="Verified Hardware"
                description="Our procurement pipelines bypass middlemen, securing genuine transformers, armored cables, Cisco/enterprise routers & switches, and UPS systems with full factory warranties."
                secondaryActionText="Procure Hardware"
                secondaryActionHref="/quote?service=Procurement%20%26%20Technical%20Supplies"
              />
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <BrutalistCard
                icon={<PhoneCall className="w-5 h-5" />}
                title="24/7 NOC & SLA Support"
                tag="99.99% Uptime"
                description="Clients receive transparent project telemetry, comprehensive as-built CAD schematics, and rapid 24/7 engineering dispatch for mission-critical infrastructure."
                secondaryActionText="Contact Direct"
                secondaryActionHref="/contact"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
