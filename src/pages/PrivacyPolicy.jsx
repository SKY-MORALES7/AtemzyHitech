import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Database, 
  Server, 
  EyeOff, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft,
  HardHat,
  Send,
  Building
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { useTheme } from '../context/ThemeContext';

export const PrivacyPolicy = () => {
  const { isDark } = useTheme();

  const sections = [
    {
      id: 'entity-governance',
      icon: <Building className="w-5 h-5 text-blue-500" />,
      title: '1. Corporate Entity & Scope of Notice',
      content: (
        <>
          <p>
            This Privacy & Data Protection Notice applies to all digital interactions, quotation submissions, and technical correspondence conducted through the official web platform of <strong>{companyInfo.name}</strong> (referred to as &quot;Atemzy Hitech&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), registered under the Companies and Allied Matters Act of the Federal Republic of Nigeria with registration identifier <strong>{companyInfo.rcNumber}</strong>.
          </p>
          <p className="mt-3">
            Our principal registered operational office is located at {companyInfo.contact.address}. We operate this corporate website to present our multidisciplinary engineering, civil construction, technical procurement, real estate facilities, and commercial trading capabilities to prospective corporate clients, institutions, and project owners.
          </p>
        </>
      )
    },
    {
      id: 'information-collected',
      icon: <Database className="w-5 h-5 text-blue-500" />,
      title: '2. Information We Collect Through This Website',
      content: (
        <>
          <p>
            We adhere to strict data minimization principles. We only collect information voluntarily submitted by you through our interactive web forms:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="font-bold text-blue-500 text-xs uppercase tracking-wider mb-2">
                A. Request for Quote (RFQ) Form
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Primary contact name and corporate designation</li>
                <li>Authorized organization or enterprise name</li>
                <li>Official corporate email address and direct phone line</li>
                <li>Target project location (State / City / Site coordinates)</li>
                <li>Selected engineering service category (e.g. Civil, MEP, Procurement)</li>
                <li>Scope specifications, estimated timeline, and budget parameters</li>
              </ul>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className="font-bold text-blue-500 text-xs uppercase tracking-wider mb-2">
                B. Direct Communication Desk
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Sender full name and identification</li>
                <li>Return email address for correspondence</li>
                <li>Subject line and formal tender or enquiry content</li>
                <li>Automated anti-spam verification tokens (honeypot check)</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs opacity-80">
            Note: We do not process sensitive personal data (such as political affiliations or genetic data), nor do we collect payment card details directly through this website.
          </p>
        </>
      )
    },
    {
      id: 'purpose-of-processing',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: '3. Purpose & Legal Basis for Processing',
      content: (
        <>
          <p>
            Under the Nigeria Data Protection Act (NDPA 2023) and general data protection standards, we process your information exclusively on lawful grounds, including pre-contractual assessment and legitimate business operations:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
            <li>
              <strong>Engineering Feasibility Assessment:</strong> To evaluate site parameters, technical deliverables, and material procurement prerequisites.
            </li>
            <li>
              <strong>Preliminary Cost Formulation:</strong> To calculate transparent, accurate estimates and formulate customized Bills of Quantities (BOQ).
            </li>
            <li>
              <strong>Corporate Correspondence:</strong> To respond directly to procurement requests, tender invitations, or operational inquiries sent to our corporate desk.
            </li>
            <li>
              <strong>Regulatory & Audit Compliance:</strong> To maintain verified corporate records in accordance with statutory engineering and commercial requirements.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'form-transmission',
      icon: <Server className="w-5 h-5 text-blue-500" />,
      title: '4. Third-Party Transmission & Web3Forms Security',
      content: (
        <>
          <p>
            To guarantee rapid, high-availability dispatch without storing personal data on vulnerable public database layers, our contact and quotation forms transmit payloads via <strong>Web3Forms</strong>, an encrypted serverless form forwarding service.
          </p>
          <div className={`p-4 rounded-xl border mt-3 flex items-start gap-3 ${
            isDark ? 'bg-blue-950/20 border-blue-900/40 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">End-to-End Encryption in Transit</p>
              <p>
                All form submissions are encrypted via TLS 1.3 in transit and delivered directly into our verified corporate inbox ({companyInfo.contact.email}). Web3Forms does not sell, profile, or monetize client correspondence.
              </p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'confidentiality-blueprints',
      icon: <EyeOff className="w-5 h-5 text-blue-500" />,
      title: '5. Confidentiality of Client Blueprints & Tender Documents',
      content: (
        <>
          <p>
            Atemzy Hitech recognizes that technical drawings, architectural schematics, structural calculations, and tender pricing represent highly valuable intellectual property:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
            <li>
              All project specifications, proprietary site layouts, and commercial pricing submitted through our channels are treated as strictly confidential.
            </li>
            <li>
              We never disclose, trade, or share client project details with competing contractors or unauthorized third parties.
            </li>
            <li>
              Where required, our legal team will execute formal Non-Disclosure Agreements (NDAs) prior to detailed site surveys or structural audits.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'cookies-localstorage',
      icon: <Lock className="w-5 h-5 text-blue-500" />,
      title: '6. Cookies, 3D WebGL Canvas & Local Storage',
      content: (
        <>
          <p>
            Our web platform operates with zero invasive advertising trackers, marketing pixels, or third-party behavioral profiling cookies:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3 pl-2">
            <li>
              <strong>Functional Theme Storage:</strong> We use browser <code>localStorage</code> strictly to remember your preferred interface mode (<code>light</code> or <code>dark</code>), ensuring optimal visual comfort across subsequent visits.
            </li>
            <li>
              <strong>3D Earth Canvas (Three.js):</strong> The interactive 3D Earth planet on our contact page is rendered entirely on your client machine using WebGL. It does not track, store, or transmit your device fingerprint or personal information.
            </li>
            <li>
              <strong>Google Fonts:</strong> Typographic styles are loaded from Google Fonts servers to ensure consistent, readable corporate typography across operating systems.
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'data-retention-rights',
      icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
      title: '7. Data Retention & Your Statutory Rights',
      content: (
        <>
          <p>
            We retain quotation and enquiry records only as long as necessary to complete commercial consultations or fulfill statutory record-keeping obligations. Under the Nigeria Data Protection Act (NDPA), you maintain the following rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-bold text-white block mb-1">Right to Access</span>
              Request copies of information submitted through our portal.
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-bold text-white block mb-1">Right to Rectification</span>
              Update or correct project parameters, telephone numbers, or addresses.
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-bold text-white block mb-1">Right to Erasure</span>
              Request deletion of your archived email enquiries when no active contract exists.
            </div>
            <div className={`p-3 rounded-xl border ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="font-bold text-white block mb-1">Right to Object</span>
              Withdraw consent for follow-up communications at any time.
            </div>
          </div>
        </>
      )
    },
    {
      id: 'dpo-contact',
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      title: '8. Corporate Data Protection Contact Desk',
      content: (
        <>
          <p>
            If you wish to exercise your data rights, request clarification regarding our data protection standards, or report a security concern, please direct your correspondence to our administrative office:
          </p>
          <div className={`p-6 rounded-2xl border mt-4 space-y-3 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-base text-white">{companyInfo.name}</span>
            </div>
            <p className="text-xs text-slate-400">
              Corporate Governance & Compliance Desk • {companyInfo.rcNumber}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${companyInfo.contact.email}`} className="hover:text-blue-400 transition-colors">
                  {companyInfo.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${companyInfo.contact.phone.replace(/\s+/g, '')}`} className="hover:text-blue-400 transition-colors">
                  {companyInfo.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{companyInfo.contact.address}</span>
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header Banner */}
      <div className={`border-b transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4">
              NDPA 2023 & NDPR Compliance Notice
            </span>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Privacy & Data Protection Policy
            </h1>
            <p className={`mt-4 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Official guidance on how Atemzy Hitech Engineering Services Ltd collects, processes, encrypts, and safeguards client quotation requests, tender blueprints, and direct correspondence.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>Effective: October 2026</span>
              <span>•</span>
              <span>Entity: {companyInfo.rcNumber}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Corporate Policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Quick Navigation Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className={`sticky top-28 p-6 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Table of Contents
              </h3>
              <nav className="space-y-2 text-xs">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`block py-1.5 px-2 rounded-lg transition-colors truncate ${
                      isDark 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <Link
                  to="/quote"
                  className="btn-3d w-full py-2.5 text-xs justify-center"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Request a Quote</span>
                </Link>
                <Link
                  to="/contact"
                  className="btn-3d-secondary w-full py-2.5 text-xs justify-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Desk</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Policy Detail Sections */}
          <main className="lg:col-span-8 space-y-8">
            {sections.map((sec) => (
              <section
                key={sec.id}
                id={sec.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-colors scroll-mt-28 ${
                  isDark 
                    ? 'bg-slate-900/70 border-slate-800' 
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${
                    isDark ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {sec.icon}
                  </div>
                  <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {sec.title}
                  </h2>
                </div>
                <div className={`text-xs sm:text-sm leading-relaxed space-y-3 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {sec.content}
                </div>
              </section>
            ))}

            {/* Bottom Non-Binding Notice Card */}
            <div className={`p-6 rounded-2xl border text-xs leading-relaxed ${
              isDark 
                ? 'bg-slate-900/40 border-slate-800 text-slate-400' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <p>
                <strong>Legal Notice:</strong> This privacy notice describes online data handling practices for {companyInfo.name}. Quotations provided as a result of digital inquiries are non-binding estimates. Enforceable contractual commitments, structural guarantees, and binding project execution schedules are governed exclusively by executed engineering contracts and verified technical documentation.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
