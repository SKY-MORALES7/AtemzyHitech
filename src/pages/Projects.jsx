import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Clock,
  ArrowRight,
  Cpu,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ScrollReveal, HairlineScrollFigure } from '../components/ui/ScrollReveal';
import { useTheme } from '../context/ThemeContext';

export const Projects = () => {
  const { isDark } = useTheme();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      {/* Header Banner */}
      <div
        className={`relative py-16 lg:py-24 border-b transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Project Portfolio & Dossiers</span>
            </span>
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'
                }`}
            >
              Electrical Power & ICT Deployments
            </h1>
            <p
              className={`mt-4 text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
            >
              Our engineering portfolio of 33/11kV substation installations, enterprise data centers, fiber-optic backbones, and smart automation deployments.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Coming Soon Main Showcase */}
      <section className="flex-1 py-16 lg:py-24 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Coming Soon Announcement Card */}
            <ScrollReveal direction="left" className="lg:col-span-7">
              <div
                className={`rounded-3xl border p-8 sm:p-12 shadow-2xl transition-colors ${isDark
                    ? 'bg-slate-900/90 border-slate-800 shadow-slate-950/60'
                    : 'bg-white border-slate-200 shadow-slate-200/80'
                  }`}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-extrabold uppercase tracking-widest mb-6">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Coming Soon</span>
                </div>

                <h2
                  className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-950'
                    }`}
                >
                  Verified Project Case Studies Are Currently Being Compiled
                </h2>

                <p
                  className={`mt-4 text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                >
                  We are preparing detailed technical case studies, engineering schematics, and commissioning dossiers for our upcoming Electrical Power, Enterprise ICT, and Industrial Automation projects. Check back soon as we publish our verified deployment showcase.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Full Technical Scopes
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        HV/LV load-flow profiles, fiber topologies, and OEM hardware bills of materials.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Ready for New Commissions
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        Our engineering team is actively accepting new electrical & ICT project briefs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    to="/quote"
                    className="btn-3d text-xs sm:text-sm py-3 px-6 inline-flex items-center gap-2"
                  >
                    <span>Initiate a Project With Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/services"
                    className="btn-3d-secondary text-xs sm:text-sm py-3 px-6 inline-flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>Explore Our Capabilities</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Interactive Hairline Schematic Preview */}
            <ScrollReveal direction="right" delay={120} className="lg:col-span-5">
              <HairlineScrollFigure
                figure="Cabinet"
                badge="Portfolio Dossier • Coming Soon"
                title="Power & Rack Infrastructure"
                subtitle="Upcoming case studies covering 33/11kV substations, Tier-III server racks & fiber networks"
                label="Interactive engineering cabinet schematic"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
