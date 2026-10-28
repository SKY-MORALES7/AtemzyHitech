import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Server, 
  Cpu, 
  Truck, 
  Network, 
  Wifi, 
  Radio, 
  Cable, 
  BatteryCharging,
  Award,
  ChevronRight,
  PhoneCall,
  Activity
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { services } from '../data/services';
import { projects } from '../data/projects';
import { BrutalistCard } from '../components/cards/BrutalistCard';
import { ScrollReveal, HairlineScrollFigure } from '../components/ui/ScrollReveal';
import { useTheme } from '../context/ThemeContext';

// Map icon strings to Electrical & ICT Lucide components
const iconMap = {
  Zap: Zap,
  Server: Server,
  Cpu: Cpu,
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  Network: Network
};

const heroTechBadges = [
  { icon: Zap, label: 'HV/LV Power Grids', code: '33/11kV' },
  { icon: Server, label: 'Tier-III Data Centers', code: '99.99% SLA' },
  { icon: Network, label: 'Fiber-Optic Backbones', code: '40/100GbE' },
  { icon: Cpu, label: 'PLC / SCADA & BMS', code: 'IoT Ready' },
  { icon: Wifi, label: 'Enterprise Wireless', code: 'Wi-Fi 6E/7' },
  { icon: BatteryCharging, label: 'Hybrid Solar & BESS', code: 'Clean Power' }
];

export const Home = () => {
  const { isDark } = useTheme();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* 1. HERO SECTION - ELECTRICAL ENGINEERING & ICT ARCHITECTURE (NO SCENE.WEBM) */}
      <section className="relative overflow-hidden bg-slate-950 -mt-24 sm:-mt-28 pt-32 sm:pt-40 pb-20 sm:pb-28 lg:pb-32 border-b border-slate-800 flex flex-col justify-center items-center">
        {/* Technical Circuit & Grid Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(56, 189, 248, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.14) 1px, transparent 1px)',
              backgroundSize: '3rem 3rem'
            }}
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[780px] h-[420px] bg-blue-600/20 blur-[130px] rounded-full" />
          <div className="absolute bottom-0 right-10 w-[420px] h-[320px] bg-sky-500/10 blur-[110px] rounded-full" />

          {/* Ambient Floating Electrical & ICT Icons on Desktop */}
          <div className="hidden lg:flex absolute top-36 left-10 xl:left-20 w-14 h-14 rounded-2xl bg-slate-900/90 border border-blue-500/30 items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10 animate-pulse">
            <Zap className="w-7 h-7" />
          </div>
          <div className="hidden lg:flex absolute top-52 right-12 xl:right-24 w-14 h-14 rounded-2xl bg-slate-900/90 border border-sky-500/30 items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
            <Server className="w-7 h-7" />
          </div>
          <div className="hidden lg:flex absolute bottom-44 left-16 xl:left-28 w-12 h-12 rounded-2xl bg-slate-900/90 border border-blue-500/30 items-center justify-center text-blue-400 shadow-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="hidden lg:flex absolute bottom-48 right-16 xl:right-32 w-12 h-12 rounded-2xl bg-slate-900/90 border border-emerald-500/30 items-center justify-center text-emerald-400 shadow-lg">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        {/* Hero Content Grid: Left/Center Copy + Interactive Hairline Schematic & ICT Icons */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headline, Copy, ICT Icon Matrix & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Accreditation Badge */}
              <div className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-bold mb-5 shadow-lg border backdrop-blur-md transition-all max-w-full ${
                isDark
                  ? 'bg-slate-900/90 text-blue-400 border-blue-500/30'
                  : 'bg-white/95 text-slate-900 border-slate-300 shadow-sm'
              }`}>
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                <span className="leading-tight">Electrical Power Engineering & Enterprise ICT Solutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[2rem] leading-[1.15] sm:text-4xl sm:leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-6xl font-black tracking-tight">
                <span className="text-blue-400">
                  Electrical Precision.
                </span>{' '}
                <br />
                <span className="text-sky-300 font-extrabold">
                  ICT Infrastructure.
                </span>{' '}
                <br />
                <span className="text-white">
                  Uninterrupted Uptime.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-medium text-slate-300">
                Atemzy Hitech Engineering Services Ltd partners with enterprises, telecom operators, and industrial facilities across Nigeria to engineer resilient HV/LV power distribution, Tier-III data centers, fiber-optic networks, and intelligent SCADA/BMS automation.
              </p>

              {/* Electrical & ICT Icon Strip on Hero */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-2xl">
                {heroTechBadges.map((item, index) => {
                  const BadgeIcon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/50 text-slate-200'
                          : 'bg-white/95 border-slate-200 hover:border-blue-600 text-slate-900 shadow-sm'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <BadgeIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold truncate">{item.label}</span>
                        <span className="block text-[10px] font-mono text-blue-400">{item.code}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  to="/quote"
                  className="btn-3d text-sm py-3 px-6 sm:py-3.5 sm:px-8 justify-center"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </Link>
                <Link
                  to="/services"
                  className="btn-3d-secondary text-sm py-3 px-5 sm:py-3.5 sm:px-7 justify-center"
                >
                  <span>Explore ICT & Power Scope</span>
                </Link>
                <Link
                  to="/projects"
                  className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm font-bold transition-all border shadow-md ${
                    isDark
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700/80 hover:border-blue-400'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-blue-600 shadow-sm'
                  }`}
                >
                  <span>Deployed Systems</span>
                  <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white' : 'text-blue-600'}`} />
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive @lucasmarkes/hairline Isometric Telemetry Card */}
            <div className="lg:col-span-5">
              <ScrollReveal direction="scale">
                <HairlineScrollFigure
                  figure="Cabinet"
                  badge="Interactive Data Center & Power Rack"
                  title="12-Blade Enterprise Server & UPS Rack"
                  subtitle="Move your cursor, touch, or scroll to inspect live blade rails & power telemetry"
                  label="Interactive 12-blade server rack cabinet figure"
                />
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 w-full">
          <ScrollReveal direction="up" delay={100}>
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
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {stat.value}
                  </span>
                  <span className={`block mt-1 text-[11px] sm:text-xs md:text-sm font-semibold leading-tight ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. CORPORATE INTRODUCTION & ELECTRICAL/ICT VALUE PROPOSITION */}
      <section className={`py-20 lg:py-28 border-b transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal direction="left" className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
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
                        ? 'bg-slate-950/70 border-slate-800 hover:border-blue-500/40' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:bg-white shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center gap-2 font-bold text-sm ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
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
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={120} className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
                  alt="Atemzy Hitech data center fiber optics and electrical switchgear engineering"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border backdrop-blur-md transition-colors ${
                  isDark ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
                }`}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>IEC, IEEE & NEMSA Certified Execution</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Strict adherence to international electrical safety and Tier-III ICT cabling standards.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HAIRLINE TELEMETRY & SCROLL SHOWCASE */}
      <section className="py-20 lg:py-24 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Systems Architecture</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Precision Across Every Layer
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Explore our interactive isometric schematics—scroll or hover over each diagram to inspect how we unify power distribution, network topology, and hardware assembly.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <HairlineScrollFigure
                figure="Plug"
                badge="Layer 01 • HV/LV Power"
                title="Industrial Power & Feeders"
                subtitle="High-voltage substation interconnects, surge arrestors & redundant power feeds"
                label="Interactive electrical power plug and socket schematic"
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
                badge="Layer 03 • SCADA & Packet Routing"
                title="Multi-Hop Telemetry & Relay Grid"
                subtitle="Deterministic PLC control loops, wireless routing & sub-millisecond failover"
                label="Interactive multi-hop relay and network routing schematic"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES OVERVIEW */}
      <section className="py-20 lg:py-28 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
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
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS PREVIEW */}
      <section className="py-20 lg:py-28 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                Experience & Track Record
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Power & ICT Deployments
              </h2>
            </div>
            <Link
              to="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
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
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-black uppercase bg-slate-950 text-white border-2 border-slate-900 shadow-[3px_3px_0px_#020617]">
                          {p.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase bg-blue-600 text-white border-2 border-blue-900 shadow-[2px_2px_0px_#020617]">
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
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
                      to="/projects"
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

      {/* 6. WHY CHOOSE ATEMZY HITECH */}
      <section className="py-20 lg:py-28 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
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
                description="Our procurement pipelines bypass middlemen, securing genuine transformers, armored cables, Cisco/enterprise switches, and UPS systems with full factory warranties."
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
