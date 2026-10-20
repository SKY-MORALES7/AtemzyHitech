import React from 'react';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './BrutalistCard.css';

/**
 * BrutalistCard Component
 * Implements the user's requested brutalist architecture:
 * - Thick solid borders with hard offset box-shadows
 * - Header with dedicated icon square and uppercase title
 * - Content message with divider
 * - Bold actionable buttons with sliding light sheen and tactile press effect
 */
export const BrutalistCard = ({
  icon,
  title,
  tag,
  description,
  features = [],
  primaryActionText = "Explore Scope",
  primaryActionHref,
  onPrimaryClick,
  secondaryActionText = "Request Quote",
  secondaryActionHref,
  onSecondaryClick,
  className = ""
}) => {
  return (
    <div className={`brutalist-card ${className}`}>
      <div>
        <div className="brutalist-card__header">
          {icon && (
            <div className="brutalist-card__icon">
              {icon}
            </div>
          )}
          <div>
            <div className="brutalist-card__alert">{title}</div>
            {tag && <span className="brutalist-card__tag">{tag}</span>}
          </div>
        </div>

        <div className="brutalist-card__message">
          {description}
        </div>

        {features && features.length > 0 && (
          <div className="brutalist-card__features">
            {features.map((feat, idx) => (
              <div key={idx} className="brutalist-card__feature-item">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="brutalist-card__actions">
        {primaryActionHref && (
          primaryActionHref.startsWith('/') ? (
            <Link
              to={primaryActionHref}
              className="brutalist-card__button brutalist-card__button--read"
            >
              <span>{primaryActionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <a
              href={primaryActionHref}
              className="brutalist-card__button brutalist-card__button--read"
            >
              <span>{primaryActionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          )
        )}

        {secondaryActionHref && (
          secondaryActionHref.startsWith('/') ? (
            <Link
              to={secondaryActionHref}
              className="brutalist-card__button brutalist-card__button--mark"
            >
              <span>{secondaryActionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <a
              href={secondaryActionHref}
              className="brutalist-card__button brutalist-card__button--mark"
            >
              <span>{secondaryActionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default BrutalistCard;
