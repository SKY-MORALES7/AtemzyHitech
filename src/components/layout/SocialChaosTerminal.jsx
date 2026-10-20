import React from 'react';
import { companyInfo } from '../../data/company';
import './SocialChaosTerminal.css';

export const SocialChaosTerminal = () => {
  return (
    <div className="chaos-terminal" title="Hover to access social channels">
      <div className="chaos-main-frame">
        <div className="chaos-text">CONNECT CHANNELS</div>
      </div>
      
      <div className="chaos-icon-container">
        {/* Twitter / X */}
        <a 
          href={companyInfo.socials.twitter} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="chaos-social-unit" 
          aria-label="Twitter / X"
        >
          <svg viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a 
          href={companyInfo.socials.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="chaos-social-unit" 
          aria-label="LinkedIn"
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>

        {/* Facebook */}
        <a 
          href={companyInfo.socials.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="chaos-social-unit" 
          aria-label="Facebook"
        >
          <svg viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>

        {/* WhatsApp Direct */}
        <a 
          href={companyInfo.socials.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="chaos-social-unit" 
          aria-label="WhatsApp"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12.031 0C5.396 0 .029 5.367.029 11.987c0 2.115.549 4.177 1.594 6.002L.005 24l6.195-1.625a11.936 11.936 0 0 0 5.831 1.506h.005c6.635 0 12.002-5.367 12.002-11.992.001-3.205-1.244-6.217-3.513-8.487C18.256 1.132 15.242 0 12.031 0zm0 21.895h-.004a9.92 9.92 0 0 1-5.061-1.39l-.363-.215-3.763.987 1.004-3.667-.236-.376a9.96 9.96 0 0 1-1.531-5.247c0-5.503 4.478-9.982 9.986-9.982 2.666 0 5.172 1.039 7.057 2.924a9.919 9.919 0 0 1 2.923 7.058c0 5.504-4.478 9.983-9.983 9.983zm5.467-7.466c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49-.893-.797-1.496-1.782-1.671-2.082-.175-.3-.019-.462.131-.611.136-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.583-.492-.504-.675-.513-.175-.008-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.23 5.125 4.53.716.31 1.275.495 1.71.633.72.229 1.375.196 1.893.119.578-.086 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
          </svg>
        </a>
      </div>

      <div className="chaos-noise-layer" />
    </div>
  );
};

export default SocialChaosTerminal;
