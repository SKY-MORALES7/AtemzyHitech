import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Award, 
  HardHat, 
  CheckCircle2, 
  ArrowRight,
  FileCheck2,
  Building
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { BrutalistCard } from '../components/cards/BrutalistCard';

export const About = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Page Header */}
      <div className="relative py-16 lg:py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              Corporate Profile & Governance
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              About Atemzy Hitech Engineering Services Ltd
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              A registered engineering and construction firm dedicated to infrastructure durability, technical precision, and ethical contracting standards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Corporate Overview */}
      <section className="py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-slate-300">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Our Foundation & Corporate Commitment
              </h2>
              <p className="leading-relaxed">
                Incorporated with the Corporate Affairs Commission ({companyInfo.rcNumber}), Atemzy Hitech Engineering Services Ltd was established to deliver comprehensive multi-sector solutions bridging conceptual engineering design with physical realization.
              </p>
              <p className="leading-relaxed">
                We operate across five synchronized disciplines: <strong>Civil & Structural Engineering</strong>, <strong>Building Construction</strong>, <strong>Procurement & Technical Supplies</strong>, <strong>Real Estate & Property Management</strong>, and <strong>General Commercial Trading</strong>. Our integrated approach allows clients to work with a single, highly accountable partner capable of managing complex dependencies from planning to execution.
              </p>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <FileCheck2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Verified Corporate Standing</h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400">
                      All statutory corporate documentation, tax compliance, and engineering certifications are maintained to guarantee full legal transparency for domestic and multinational tenders.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
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
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Core Values
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              The operational benchmarks guiding every calculation, site pour, vendor selection, and client interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyInfo.coreValues.map((val, idx) => (
              <BrutalistCard
                key={idx}
                icon={<ShieldCheck className="w-5 h-5" />}
                title={val.title}
                tag="Standard"
                description={val.description}
                secondaryActionText="Learn More"
                secondaryActionHref="/quote"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Governance & Credentials */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Corporate Governance & Professional Integrity
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Atemzy Hitech strictly follows verified engineering standards. We do not publish unverified affiliations or fabricate client testimonials. Every project featured across our portals represents verifiable field experience and contracts completed with distinction.
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
                  Contact Our Corporate Office
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
