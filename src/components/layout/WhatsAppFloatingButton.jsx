import React from 'react';
import { companyInfo } from '../../data/company';

/**
 * WhatsAppFloatingButton
 * Two-part persistent floating WhatsApp widget fixed at the bottom-right corner:
 * - Left: Rounded green speech-bubble card ("Chat with one of our engineers on Whatsapp") with right pointer tip
 * - Right: Circular green WhatsApp icon button
 */
export const WhatsAppFloatingButton = () => {
  if (!companyInfo.socials?.whatsapp) return null;

  return (
    <a
      href={companyInfo.socials.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with one of our engineers on WhatsApp"
      title={`Chat on WhatsApp (${companyInfo.contact.phone})`}
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 select-none transition-transform duration-300 hover:-translate-y-1 active:scale-95"
    >
      {/* Left Rounded Green Speech Bubble with Right Pointer Tip */}
      <div className="relative bg-[#25D366] group-hover:bg-[#20bd5a] text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_24px_rgba(37,211,102,0.38)] transition-colors">
        <p className="text-[11px] sm:text-xs font-bold leading-snug text-center whitespace-nowrap">
          Chat with one of our
          <br />
          engineers on Whatsapp
        </p>
        {/* Speech Bubble Pointer Triangle on Right Edge */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#25D366] group-hover:bg-[#20bd5a] rotate-45 rounded-[2px] transition-colors"
        />
      </div>

      {/* Right Circular Green WhatsApp Icon Button */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] group-hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-colors shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm"
        >
          <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.115.549 4.177 1.594 6.002L.005 24l6.195-1.625a11.936 11.936 0 0 0 5.831 1.506h.005c6.635 0 12.002-5.367 12.002-11.992.001-3.205-1.244-6.217-3.513-8.487C18.256 1.132 15.242 0 12.031 0zm0 21.895h-.004a9.92 9.92 0 0 1-5.061-1.39l-.363-.215-3.763.987 1.004-3.667-.236-.376a9.96 9.96 0 0 1-1.531-5.247c0-5.503 4.478-9.982 9.986-9.982 2.666 0 5.172 1.039 7.057 2.924a9.919 9.919 0 0 1 2.923 7.058c0 5.504-4.478 9.983-9.983 9.983zm5.467-7.466c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49-.893-.797-1.496-1.782-1.671-2.082-.175-.3-.019-.462.131-.611.136-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.583-.492-.504-.675-.513-.175-.008-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.23 5.125 4.53.716.31 1.275.495 1.71.633.72.229 1.375.196 1.893.119.578-.086 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </div>
    </a>
  );
};

export default WhatsAppFloatingButton;
