import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Send, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { serviceCategories } from '../data/services';
import { companyInfo } from '../data/company';
import { validateQuoteForm } from '../utils/validation';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { FormAlert } from '../components/forms/FormAlert';
import { CaptchaWidget } from '../components/forms/CaptchaWidget';

export const RequestQuote = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    organization: '',
    serviceCategory: preselectedService,
    projectLocation: '',
    projectDescription: '',
    estimatedBudget: '',
    preferredContact: 'Email',
    privacyAccepted: false,
    botcheck: '' // Honeypot field
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const { status, isSubmitting, errorMessage, submitForm, resetStatus } =
    useFormSubmit('Formal Quotation Request');

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceCategory: preselectedService }));
    }
  }, [preselectedService]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-level error on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Run client-side validation
    const { isValid, errors } = validateQuoteForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // 2. Submit via Web3Forms hook
    await submitForm(formData, () => {
      setFormData(initialFormState);
      setFormErrors({});
    });
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className="relative py-14 lg:py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              Commercial & Engineering Proposal
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Request a Project Quotation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Submit your engineering, construction, procurement, or property management specifications. Our quantity surveyors and technical leads will analyze your requirements and follow up promptly.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Column */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <FormAlert
              status={status}
              errorMessage={errorMessage}
              successTitle="Quotation Request Dispatched!"
              successText="We have received your technical specifications. A project engineer will review your scope and follow up with a detailed response."
              onDismiss={resetStatus}
            />

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Anti-spam honeypot */}
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

              {/* Section 1: Client Information */}
              <div>
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black shadow-md shadow-blue-500/30">
                    1
                  </span>
                  <span>Contact & Organization Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-blue-400">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Engr. Babatunde Adeyemi"
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

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1">
                      Corporate or Personal Email <span className="text-blue-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="adeyemi@company.com"
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

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number <span className="text-blue-400">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 803 123 4567"
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                        formErrors.phone
                          ? 'border-rose-500 focus:ring-rose-500/50'
                          : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-rose-400">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Organization (Optional) */}
                  <div>
                    <label htmlFor="organization" className="block text-xs font-semibold text-slate-300 mb-1">
                      Company / Organization <span className="text-slate-500 text-[11px]">(Optional)</span>
                    </label>
                    <input
                      id="organization"
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Apex Industrial Consortium Ltd"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Project Specifications */}
              <div className="pt-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black shadow-md shadow-blue-500/30">
                    2
                  </span>
                  <span>Project Scope & Specifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Service Category */}
                  <div>
                    <label htmlFor="serviceCategory" className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Service Category <span className="text-blue-400">*</span>
                    </label>
                    <select
                      id="serviceCategory"
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                        formErrors.serviceCategory
                          ? 'border-rose-500 focus:ring-rose-500/50'
                          : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                      }`}
                    >
                      <option value="">-- Select a Category --</option>
                      {serviceCategories
                        .filter((c) => c !== 'All Services')
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                    {formErrors.serviceCategory && (
                      <p className="mt-1 text-xs text-rose-400">{formErrors.serviceCategory}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="projectLocation" className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Site Location <span className="text-slate-500 text-[11px]">(Optional)</span>
                    </label>
                    <input
                      id="projectLocation"
                      type="text"
                      name="projectLocation"
                      value={formData.projectLocation}
                      onChange={handleChange}
                      placeholder="e.g. Lekki Free Zone, Lagos"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Project Description / Scope */}
                <div className="mb-4">
                  <label htmlFor="projectDescription" className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Description & Requirements Scope <span className="text-blue-400">*</span>
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    rows={4}
                    value={formData.projectDescription}
                    onChange={handleChange}
                    placeholder="Provide details about structural requirements, square meterage, equipment specifications, site conditions, or milestone targets..."
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.projectDescription
                        ? 'border-rose-500 focus:ring-rose-500/50'
                        : 'border-slate-800 focus:ring-blue-500/40 focus:border-blue-500'
                    }`}
                  />
                  {formErrors.projectDescription && (
                    <p className="mt-1 text-xs text-rose-400">{formErrors.projectDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Budget */}
                  <div>
                    <label htmlFor="estimatedBudget" className="block text-xs font-semibold text-slate-300 mb-1">
                      Estimated Budget Range <span className="text-slate-500 text-[11px]">(Optional)</span>
                    </label>
                    <select
                      id="estimatedBudget"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    >
                      <option value="">Flexible / Under Assessment</option>
                      <option value="Below ₦10 Million">Below ₦10 Million</option>
                      <option value="₦10M - ₦50 Million">₦10M – ₦50 Million</option>
                      <option value="₦50M - ₦250 Million">₦50M – ₦250 Million</option>
                      <option value="₦250 Million+">₦250 Million+</option>
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label htmlFor="preferredContact" className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred Follow-up Channel
                    </label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    >
                      <option value="Email">Email Communication</option>
                      <option value="Phone Call">Direct Phone Call</option>
                      <option value="WhatsApp">WhatsApp Message</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy Notice Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="privacyAccepted"
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-400 leading-normal">
                    I acknowledge that the information submitted will be processed by Atemzy Hitech Engineering Services Ltd to provide a preliminary quotation, as detailed in our{' '}
                    <Link to="/privacy" className="text-blue-400 underline hover:text-blue-300">
                      Privacy Policy
                    </Link>. I understand this submission does not create a binding legal contract. <span className="text-blue-400">*</span>
                  </span>
                </label>
                {formErrors.privacyAccepted && (
                  <p className="mt-1 text-xs text-rose-400">{formErrors.privacyAccepted}</p>
                )}
              </div>

              {/* Automated reCAPTCHA & Spam Protection Notice */}
              <CaptchaWidget />

              {/* Submit Button with 3D Pop-Out Effect */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-3d w-full py-4 text-base justify-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>{isSubmitting ? 'Transmitting Specification...' : 'Submit Quotation Request'}</span>
                </button>
                <p className="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit encrypted submission. Never shared with third-party advertisers.</span>
                </p>
              </div>
            </form>
          </div>

          {/* Right Trust & Protocol Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 text-blue-400 mb-3">
                <Clock className="w-5 h-5" />
                <h4 className="text-sm font-bold text-white">What Happens Next?</h4>
              </div>
              <ol className="space-y-3 text-xs text-slate-400 leading-relaxed list-decimal list-inside">
                <li><strong className="text-slate-200">Scope Assessment:</strong> Our engineering leads evaluate structural parameters and feasibility.</li>
                <li><strong className="text-slate-200">Preliminary BOQ:</strong> A tailored estimate of materials, timelines, and logistics is drafted.</li>
                <li><strong className="text-slate-200">Formal Proposal:</strong> A technical representative schedules a review call or site inspection.</li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 text-blue-400 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Non-Binding Notice</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submitting a quotation request allows us to assess project viability and provide guidance. A legally binding contract is established only upon execution of formal engineering terms and agreed milestone schedules.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2">Need Urgent Assistance?</h4>
              <p className="text-xs text-slate-400 mb-4">
                For emergency infrastructure response or expedited tender bids, reach our technical desk directly:
              </p>
              <a
                href={`tel:${companyInfo.contact.phone.replace(/\s+/g, '')}`}
                className="btn-3d-secondary block text-center py-2.5 px-4 text-xs font-bold w-full"
              >
                Call {companyInfo.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
