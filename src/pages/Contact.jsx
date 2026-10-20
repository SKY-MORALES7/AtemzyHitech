import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';
import { companyInfo } from '../data/company';
import { validateContactForm } from '../utils/validation';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { FormAlert } from '../components/forms/FormAlert';
import { EarthCanvas, StarsCanvas } from '../components/canvas';
import { CorporateCard } from '../components/cards';
import { useTheme } from '../context/ThemeContext';
import { CaptchaWidget } from '../components/forms/CaptchaWidget';

export const Contact = () => {
  const { isDark } = useTheme();
  const initialFormState = {
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const { status, isSubmitting, errorMessage, submitForm, resetStatus } =
    useFormSubmit('General Contact Enquiry');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateContactForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    await submitForm(formData, () => {
      setFormData(initialFormState);
      setFormErrors({});
    });
  };

  return (
    <div className="relative z-0 min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* 3D Galaxy Stars in Background (Dark Mode only) */}
      {isDark && <StarsCanvas />}

      {/* Header Banner */}
      <div className={`relative z-10 py-12 lg:py-16 border-b transition-colors ${
        isDark ? 'bg-slate-900/80 backdrop-blur-md border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-500 text-xs font-bold uppercase tracking-wider mb-3">
              Direct Communication Desk
            </span>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Contact Atemzy Hitech
            </h1>
            <p className={`mt-3 text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Reach our corporate and engineering management teams directly for tenders, inquiries, or procurement consultations.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Section: Form on one side, 3D Rotating Earth on the other */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Contact Form Column */}
          <div className={`lg:col-span-6 rounded-3xl p-6 sm:p-10 shadow-2xl border transition-colors ${
            isDark
              ? 'bg-slate-900/90 backdrop-blur-xl border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>Send an Enquiry</h2>
            <p className={`text-xs sm:text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Complete the form below. Enquiries are received directly at our corporate inbox.
            </p>

            <FormAlert
              status={status}
              errorMessage={errorMessage}
              successTitle="Message Sent Successfully!"
              successText="Thank you for contacting Atemzy Hitech. Our office has received your message and will reply shortly."
              onDismiss={resetStatus}
            />

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <input
                type="checkbox"
                name="botcheck"
                checked={formData.botcheck}
                onChange={handleChange}
                className="hidden"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Ngozi Okafor"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    formErrors.name
                      ? 'border-rose-500 focus:ring-rose-500/50'
                      : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-blue-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ngozi@enterprise.com"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    formErrors.email
                      ? 'border-rose-500 focus:ring-rose-500/50'
                      : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject <span className="text-blue-400">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Technical Equipment Supply Tender"
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    formErrors.subject
                      ? 'border-rose-500 focus:ring-rose-500/50'
                      : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                  }`}
                />
                {formErrors.subject && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1">
                  Message <span className="text-blue-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please state how we can assist you..."
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                    formErrors.message
                      ? 'border-rose-500 focus:ring-rose-500/50'
                      : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                  }`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.message}</p>
                )}
              </div>

              {/* Automated reCAPTCHA & Spam Protection Notice */}
              <CaptchaWidget />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-3d w-full py-4 text-sm justify-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>{isSubmitting ? 'Sending Message...' : 'Send Direct Message'}</span>
              </button>
            </form>
          </div>

          {/* 3D Rotating Earth Column next to the Form */}
          <div className="lg:col-span-6 h-[420px] sm:h-[520px] lg:h-[620px] w-full flex flex-col items-center justify-center relative">
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <EarthCanvas />
            </div>
          </div>
        </div>

        {/* Corporate Contact Information Cards below Form & Earth */}
        <div className="mt-16 pt-12 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Head Office Location Card */}
          <CorporateCard
            title="Headquarters"
            badgeLabel="LAGOS"
            badgeValue="HQ"
            theme="theme-blue"
            description={companyInfo.contact.address}
            features={[
              { icon: <MapPin className="w-3.5 h-3.5" />, text: "Direct Site Access" },
              { icon: <Clock className="w-3.5 h-3.5" />, text: companyInfo.contact.hours }
            ]}
            actionText="Get Directions"
            actionHref={`https://maps.google.com/?q=${encodeURIComponent(companyInfo.contact.address)}`}
            isExternal={true}
          />

          {/* Direct Lines Card */}
          <CorporateCard
            title="Corporate Comms"
            badgeLabel="DIRECT"
            badgeValue="LINE"
            theme="theme-blue"
            description="Official telecommunication and correspondence channels for tenders, contracts, and procurement."
            features={[
              { icon: <Phone className="w-3.5 h-3.5" />, text: companyInfo.contact.phone },
              { icon: <Mail className="w-3.5 h-3.5" />, text: companyInfo.contact.email }
            ]}
            actionText="Dial Direct"
            actionHref={`tel:${companyInfo.contact.phone.replace(/\s+/g, '')}`}
          />

          {/* Instant WhatsApp Link Card */}
          {companyInfo.socials.whatsapp && (
            <CorporateCard
              title="Rapid Liaison"
              badgeLabel="ONLINE"
              badgeValue="24/7"
              theme="theme-blue"
              description="Immediate engineering consultations, project dispatch, and rapid tenders response via WhatsApp."
              features={[
                { icon: <MessageSquare className="w-3.5 h-3.5" />, text: "Instant Response" },
                { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "Certified Engineers" }
              ]}
              actionText="Open WhatsApp"
              actionHref={companyInfo.socials.whatsapp}
              isExternal={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
