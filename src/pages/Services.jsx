import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Server, 
  Cpu, 
  Truck, 
  ShieldCheck, 
  Network,
  Router as RouterIcon,
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { services, serviceCategories } from '../data/services';
import { ScrollReveal, HairlineScrollFigure } from '../components/ui/ScrollReveal';
import { useTheme } from '../context/ThemeContext';

const iconMap = {
  Zap: Zap,
  Server: Server,
  Cpu: Cpu,
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  Network: Network,
  Router: RouterIcon
};

export const Services = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  const filteredServices =
    selectedCategory === 'All Services'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className={`relative py-16 lg:py-24 border-b transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Comprehensive Electrical & ICT Portfolio</span>
            </span>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Electrical Power Engineering, Enterprise ICT & Smart Automation
            </h1>
            <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Tailored capabilities delivering end-to-end execution across HV/LV power substations, structured fiber-optic networks, data centers, industrial automation, and OEM technical procurement.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="sticky top-[86px] sm:top-[96px] z-40 w-full px-3 sm:px-6 lg:px-8 py-2 pointer-events-auto">
        <div className={`max-w-7xl mx-auto backdrop-blur-md rounded-xl sm:rounded-2xl border transition-all duration-300 px-2 sm:px-3 py-1.5 shadow-lg ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/60 shadow-slate-950/60'
            : 'bg-white/95 border-slate-300 shadow-slate-300/50'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            {serviceCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? isDark
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                        : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                      : isDark
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:text-slate-950 hover:bg-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Listing */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {filteredServices.map((srv, index) => {
            const IconComponent = iconMap[srv.iconName] || Zap;
            const isReversed = index % 2 !== 0;

            return (
              <ScrollReveal key={srv.id} delay={80}>
                <div
                  id={srv.slug}
                  className="scroll-mt-36 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl hover:border-blue-500/40 transition-colors"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Visual Image + Interactive Hairline Schematic Side */}
                    <div className={`lg:col-span-5 relative min-h-[320px] lg:min-h-full flex flex-col justify-between ${isReversed ? 'lg:order-2' : ''}`}>
                      <div className="relative h-64 lg:h-1/2 overflow-hidden">
                        <img
                          src={srv.image}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = srv.fallbackImage || '/images/electrical-substation.svg';
                          }}
                          alt={srv.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/35" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-blue-400 border border-slate-700">
                            {srv.badge}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex-1 flex flex-col justify-center">
                        <HairlineScrollFigure
                          figure={srv.hairlineFigure || 'Phosphor'}
                          badge={`${srv.badge} Schematic`}
                          title={srv.category}
                          subtitle="Scroll or hover to interact with system schematic"
                          label={`Interactive schematic for ${srv.title}`}
                        />
                      </div>
                    </div>

                    {/* Content Detail Side */}
                    <div className={`lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between ${isReversed ? 'lg:order-1' : ''}`}>
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <IconComponent className="w-5 h-5 stroke-[2]" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            {srv.category}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          {srv.title}
                        </h2>

                        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                          {srv.fullDescription}
                        </p>

                        <div className="mt-8">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                            Core Capabilities & Technical Deliverables
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {srv.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-xs text-slate-300 font-medium">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>IEEE / IEC / NEMSA & Tier-III ICT certified</span>
                        </div>
                        <Link
                          to={`/quote?service=${encodeURIComponent(srv.category)}`}
                          className="btn-3d text-xs sm:text-sm py-2.5 px-5"
                        >
                          <span>Request a Quotation</span>
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Bottom Conversion Prompt */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <ScrollReveal className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need a Custom Electrical Power or ICT Network Architecture?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Our electrical and network engineering leads are available to review single-line diagrams (SLDs), bills of engineering measurement and evaluation (BEME), or data center RFPs.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/quote"
              className="btn-3d text-sm py-3 px-6"
            >
              Submit BEME / Technical Scope
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
