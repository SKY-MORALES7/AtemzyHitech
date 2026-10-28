import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Zap, 
  Cpu, 
  ArrowRight,
  FileCheck2
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { BrutalistCard } from '../components/cards/BrutalistCard';
import { ScrollReveal, HairlineScrollFigure } from '../components/ui/ScrollReveal';

export const About = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="relative py-16 lg:py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>Corporate Profile & Engineering Governance</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              About Atemzy Hitech Engineering Services Ltd
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              A registered electrical power engineering and enterprise ICT infrastructure firm dedicated to system reliability, technical precision, and ethical contracting standards.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Corporate Overview */}
      <section className="py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal direction="left" className="lg:col-span-7 space-y-6 text-slate-300">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Our Technical Foundation & Corporate Commitment
              </h2>
              <p className="leading-relaxed">
                Incorporated with the Corporate Affairs Commission ({companyInfo.rcNumber}), Atemzy Hitech Engineering Services Ltd was established to deliver high-specification electrical power systems and modern ICT infrastructure bridging conceptual engineering design with mission-critical operational uptime.
              </p>
              <p className="leading-relaxed">
                We operate across five synchronized technology disciplines: <strong>Electrical Power Engineering & Distribution</strong>, <strong>Enterprise ICT & Fiber-Optic Networking</strong>, <strong>Industrial Automation & Smart BMS</strong>, <strong>OEM Electrical/ICT Hardware Procurement</strong>, and <strong>24/7 Managed Systems Maintenance</strong>. Our integrated model enables enterprises to partner with a single accountable engineering team from load-flow design to NOC monitoring.
              </p>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <FileCheck2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Verified Corporate & Regulatory Standing</h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400">
                      All statutory corporate documentation, tax compliance, COREN/NEMSA electrical standards, and OEM ICT certifications are maintained to guarantee full legal transparency for domestic and multinational tenders.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={120} className="lg:col-span-5 space-y-6">
              <BrutalistCard
                icon={<Target className="w-5 h-5" />}
                title="Our Mission"
                tag="Mandate"
                description={companyInfo.mission}
                secondaryActionText="View Projects"
                secondaryActionHref="/projects"
              />

              <BrutalistCard
                icon={<Eye className="w-5 h-5" />}
                title="Our Vision"
                tag="Future"
                description={companyInfo.vision}
                secondaryActionText="Explore Services"
                secondaryActionHref="/services"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Core Values
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              The operational benchmarks guiding every substation design, fiber splice, OEM hardware dispatch, and enterprise SLA.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyInfo.coreValues.map((val, idx) => (
              <ScrollReveal key={idx} delay={idx * 90}>
                <BrutalistCard
                  icon={<ShieldCheck className="w-5 h-5" />}
                  title={val.title}
                  tag="Standard"
                  description={val.description}
                  secondaryActionText="Learn More"
                  secondaryActionHref="/quote"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Governance & Interactive Hairline Schematic */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                  <Zap className="w-4 h-4" />
                  <span>Quality Assurance & Accountability</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                  Corporate Governance & Engineering Integrity
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Atemzy Hitech strictly follows verified IEEE, IEC, and TIA/EIA engineering standards. Every electrical substation, hybrid solar microgrid, and enterprise network featured across our portals represents verifiable field execution backed by comprehensive factory and site acceptance testing.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/quote"
                    className="btn-3d text-sm py-3 px-6"
                  >
                    <span>Partner With Us Today</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </Link>
                  <Link
                    to="/contact"
                    className="btn-3d-secondary text-sm py-3 px-6"
                  >
                    Contact Our Engineering Desk
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <HairlineScrollFigure
                  figure="Sieve"
                  badge="Multi-Stage QA/QC"
                  title="Verification & Compliance Filter"
                  subtitle="Every component and termination passes rigorous electrical & optical testing"
                  label="Interactive QA/QC sieve diagram"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
