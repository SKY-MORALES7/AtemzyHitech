import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  HardHat, 
  ChevronRight, 
  ShieldCheck,
  ExternalLink 
} from 'lucide-react';
import { companyInfo } from '../../data/company';
import { SocialChaosTerminal } from './SocialChaosTerminal';
import { useTheme } from '../../context/ThemeContext';

export const Footer = () => {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t transition-colors ${
      isDark 
        ? 'bg-slate-950 text-slate-300 border-slate-800' 
        : 'bg-slate-100/90 text-slate-700 border-slate-200'
    }`}>
      {/* Top CTA Banner - Dark Slate Blue & White */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Ready to Initiate Your Next Engineering Project?
            </h3>
            <p className="mt-2 text-slate-300 font-medium max-w-2xl">
              Partner with Atemzy Hitech for verified technical excellence, safety compliance, and disciplined on-budget execution.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/quote"
              className="btn-3d text-xs"
            >
              Request a Free Quote
            </Link>
            <Link
              to="/contact"
              className="btn-3d-secondary text-xs"
            >
              Contact Our Engineers
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Brand & Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-1.png"
                alt="Atemzy Hitech"
                className="w-10 h-10 rounded-full object-contain drop-shadow-md"
              />
              <span className="text-lg font-black tracking-tight text-white uppercase">
                ATEMZY <span className="text-blue-400">HITECH</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Atemzy Hitech Engineering Services Ltd delivers end-to-end engineering, civil construction, technical procurement, real estate, and commercial trading solutions across Nigeria.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Registered Corporate Entity ({companyInfo.rcNumber})</span>
            </div>

            {/* Interactive Cyber Social Terminal */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Official Networks</span>
              <SocialChaosTerminal />
            </div>
          </div>

          {/* Col 2: Core Capabilities */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { title: "Engineering Consultancy & Design", href: "/services" },
                { title: "Building & Civil Construction", href: "/services" },
                { title: "Procurement & Technical Supplies", href: "/services" },
                { title: "Real Estate & Property Management", href: "/services" },
                { title: "General Commercial Contracting", href: "/services" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.href} 
                    className={`flex items-center gap-1.5 transition-colors ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600 font-medium'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Corporate Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { title: "Company Overview & Leadership", href: "/about" },
                { title: "Projects & Experience Portfolio", href: "/projects" },
                { title: "Request a Formal Quotation", href: "/quote" },
                { title: "Office Locations & Inquiries", href: "/contact" },
                { title: "Privacy & Data Handling Notice", href: "/privacy" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.href} 
                    className={`transition-colors block ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600 font-medium'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Operations */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Corporate Office
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className={`flex items-start gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                <span>{companyInfo.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a 
                  href={`tel:${companyInfo.contact.phone.replace(/\s+/g, '')}`} 
                  className={`transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600 font-medium'
                  }`}
                >
                  {companyInfo.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a 
                  href={`mailto:${companyInfo.contact.email}`} 
                  className={`transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600 font-medium'
                  }`}
                >
                  {companyInfo.contact.email}
                </a>
              </li>
              <li className={`flex items-start gap-3 ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                <span>{companyInfo.contact.hours}</span>
              </li>
              {companyInfo.socials.whatsapp && (
                <li className="pt-2">
                  <a
                    href={companyInfo.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d text-[11px] py-2 px-3.5"
                  >
                    <span>Direct WhatsApp Chat</span>
                    <ExternalLink className="w-3 h-3 text-blue-500" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Legal & Disclaimer */}
        <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-600'
        }`}>
          <p>
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl">
            Disclaimer: Quotation requests submitted via this platform serve as non-binding preliminary estimates. Binding commercial contracts require signed technical documentation.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
