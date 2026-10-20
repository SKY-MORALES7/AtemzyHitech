import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Wrench, 
  Truck, 
  Home as HomeIcon, 
  Boxes, 
  HardHat, 
  Award,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { services } from '../data/services';
import { projects } from '../data/projects';
import { BrutalistCard } from '../components/cards/BrutalistCard';
import { useTheme } from '../context/ThemeContext';

// Map icon strings to Lucide components
const iconMap = {
  Wrench: Wrench,
  Building2: Building2,
  Truck: Truck,
  Home: HomeIcon,
  Boxes: Boxes
};

export const Home = () => {
  const { isDark } = useTheme();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* 1. HERO SECTION WITH SCENE.WEBM */}
      <section className="relative overflow-hidden bg-slate-950 -mt-24 sm:-mt-28 pt-32 sm:pt-40 pb-24 sm:pb-28 lg:pb-36 border-b border-slate-800 flex flex-col justify-center items-center">
        {/* Hero Background: Construction drafting flat lay on mobile, scene.webm on desktop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-slate-950">
          {/* Mobile Image Fallback - No people, clean blueprints & engineering tools */}
          <img
            src="/hero-construction.jpg"
            alt="Engineering Blueprints and Construction Planning"
            className="w-full h-full object-cover block sm:hidden"
          />
          {/* Desktop/Tablet Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero-construction.jpg"
            ref={(el) => {
              if (el) {
                el.muted = true;
                el.play().catch(() => {});
              }
            }}
            className="w-full h-full object-cover opacity-100 hidden sm:block"
          >
            <source src="/scene.webm" type="video/webm" />
          </video>
        </div>

        {/* Centralized Hero Text & Actions */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Accreditation Badge */}
          <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-bold mb-4 sm:mb-6 shadow-lg border backdrop-blur-md transition-all max-w-full ${
            isDark
              ? 'bg-slate-900/90 text-blue-400 border-blue-500/30'
              : 'bg-white/95 text-slate-900 border-slate-300 shadow-sm'
          }`}>
            <HardHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
            <span className="leading-tight text-center">Multidisciplinary Engineering & Construction Contractors</span>
          </div>

          {/* Centered Headline - Soft charcoal black (not too black) */}
          <h1 className={`text-[1.85rem] leading-[1.18] sm:text-4xl sm:leading-[1.12] md:text-5xl md:leading-[1.08] lg:text-7xl font-black tracking-tight ${
            isDark ? 'text-slate-900' : 'text-slate-900'
          }`}>
            Engineering Solutions. <br />
            <span className="text-[#7d5656] font-extrabold">
              Construction Excellence.
            </span> <br />
            Reliable Service.
          </h1>

          {/* Centered Sub-headline - Soft charcoal black (not too black) */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-bold px-1 text-slate-900">
            Atemzy Hitech Engineering Services Ltd partners with corporate, industrial, and real estate clients to execute high-specification civil engineering, turnkey construction, technical procurement, and asset management across Nigeria.
          </p>

          {/* Centered CTA Buttons - Thumb-friendly full-width stack on mobile, horizontal row on desktop */}
          <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link
              to="/quote"
              className={`w-full sm:w-auto justify-center ${
                isDark ? 'btn-3d text-sm py-3 px-6 sm:py-3.5 sm:px-8' : 'btn-3d text-sm py-3 px-6 sm:py-3.5 sm:px-8 shadow-md'
              }`}
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4 text-blue-500" />
            </Link>
            <Link
              to="/services"
              className={`w-full sm:w-auto justify-center ${
                isDark ? 'btn-3d-secondary text-sm py-3 px-5 sm:py-3.5 sm:px-7' : 'inline-flex items-center text-sm py-3 px-5 sm:py-3.5 sm:px-7 rounded-xl font-extrabold bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 shadow-md transition-all hover:border-slate-400'
              }`}
            >
              <span>Explore Our Services</span>
            </Link>
            <Link
              to="/projects"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm font-bold transition-all border shadow-md ${
                isDark
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700/80 hover:border-blue-400'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-blue-600 shadow-sm'
              }`}
            >
              <span>View Our Projects</span>
              <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white' : 'text-blue-600'}`} />
            </Link>
          </div>
        </div>

        {/* Stats Strip - 2x2 grid on mobile with clean dividing borders, 4x1 on desktop */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-24 w-full">
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
        </div>
      </section>

      {/* 2. CORPORATE INTRODUCTION & VALUE PROPOSITION */}
      <section className={`py-20 lg:py-28 border-b transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-wider">
                About Atemzy Hitech
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                Engineering Discipline & Rigorous Commercial Integrity
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Registered under the Corporate Affairs Commission ({companyInfo.rcNumber}), Atemzy Hitech Engineering Services Ltd was founded to solve complex infrastructural and technical challenges through sound engineering standards, certified human capital, and dependable supply chain logistics.
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
                  <span>Learn more about our organizational structure & credentials</span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                  alt="Atemzy Hitech construction and engineering work"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-xl border backdrop-blur-md transition-colors ${
                  isDark ? 'bg-slate-900/90 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
                }`}>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
                    <div>
                      <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>Full Safety & Statutory Compliance</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Strict adherence to national building codes and OSHA safety standards.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES OVERVIEW */}
      <section className="py-20 lg:py-28 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              Capabilities Directory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Five Business Pillars
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              Structured capabilities designed to serve individual developers, corporate enterprises, and public infrastructure requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => {
              const IconComponent = iconMap[srv.iconName] || Wrench;
              return (
                <BrutalistCard
                  key={srv.id}
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
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="btn-3d-secondary text-sm py-3.5 px-8 inline-flex items-center gap-2"
            >
              <span>View Full Service Catalog & Specifications</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS PREVIEW */}
      <section className="py-20 lg:py-28 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                Experience & Track Record
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Explore All Verified Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                className="brutalist-card p-0 overflow-hidden flex flex-col justify-between"
              >
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
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ATEMZY HITECH */}
      <section className="py-20 lg:py-28 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              Competitive Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Partner With Atemzy Hitech?
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg">
              We eliminate common contracting bottlenecks through engineering precision, certified procurement channels, and proactive milestone accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BrutalistCard
              icon={<Award className="w-5 h-5" />}
              title="Engineering Rigor & Quality"
              tag="Standard QA/QC"
              description="All structural designs, calculations, and civil foundations undergo multi-stage technical verification prior to on-site concrete pours and structural framing."
              secondaryActionText="Learn Standards"
              secondaryActionHref="/about"
            />

            <BrutalistCard
              icon={<Truck className="w-5 h-5" />}
              title="Direct OEM Supply Chain"
              tag="Verified Logistics"
              description="Our procurement pipelines bypass intermediate brokers, securing authentic manufacturer equipment, raw materials, and heavy parts at optimal commercial rates."
              secondaryActionText="Procure Materials"
              secondaryActionHref="/quote?service=Procurement%20%26%20Technical%20Supplies"
            />

            <BrutalistCard
              icon={<PhoneCall className="w-5 h-5" />}
              title="Accountable Communication"
              tag="24/7 Operations"
              description="Clients receive regular Gantt-schedule progress reports, transparent milestone billings, and dedicated project managers for continuous peace of mind."
              secondaryActionText="Contact Direct"
              secondaryActionHref="/contact"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
