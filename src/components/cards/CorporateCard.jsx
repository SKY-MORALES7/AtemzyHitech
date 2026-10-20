import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import './Isometric3DCard.css';

/**
 * 3D Isometric Pop-Out Corporate Card Component
 * Styled with Atemzy Hitech aesthetics:
 * - 3D Perspective with animated shifting background pattern on hover
 * - Multi-layer Z-axis depth (title, text, action button popping out)
 * - Floating 3D Badge Box (e.g. HQ, 24/7, Active status)
 * - Clean responsive CSS without styled-components dependency
 */
export const CorporateCard = ({
  title = "Corporate Operations",
  badgeLabel = "VERIFIED",
  badgeValue = "HQ",
  description = "Delivering comprehensive engineering excellence and cutting-edge industrial solutions.",
  features = [],
  actionText = "See More",
  actionHref = "#",
  onActionClick,
  theme = "theme-blue", // 'theme-blue' | 'theme-slate' | 'theme-emerald'
  isExternal = false
}) => {
  return (
    <div className="card-3d-parent">
      <div className={`card-3d ${theme}`}>
        {/* Floating 3D Badge Box */}
        <div className="card-3d-date-box">
          <span className="badge-label">{badgeLabel}</span>
          <span className="badge-value">{badgeValue}</span>
        </div>

        {/* 3D Content Box */}
        <div className={`card-3d-content ${theme}`}>
          <span className="card-3d-title">{title}</span>
          
          <p className="card-3d-text">
            {description}
          </p>

          {/* 3D Feature Grid */}
          {features && features.length > 0 && (
            <div className="card-3d-features">
              {features.map((item, index) => (
                <div key={index} className="card-3d-feature-item">
                  <div className="card-3d-feature-icon">
                    {item.icon || <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* 3D Actions */}
          <div className="card-3d-actions">
            <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium transform translate-z-[20px]">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Atemzy Standard</span>
            </div>

            {onActionClick ? (
              <button onClick={onActionClick} className="card-3d-see-more">
                <span>{actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <a
                href={actionHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="card-3d-see-more"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateCard;
