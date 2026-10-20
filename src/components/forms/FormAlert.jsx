import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const FormAlert = ({ status, errorMessage, successTitle, successText, onDismiss }) => {
  if (status === 'IDLE') return null;

  if (status === 'SUBMITTING') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 p-4 mb-6 text-blue-900 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
      >
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
        <p className="text-sm font-medium">Submitting your details securely to our engineering team...</p>
      </div>
    );
  }

  if (status === 'SUCCESS') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="p-5 mb-6 text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-xl shadow-sm"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-base font-bold text-emerald-900">
              {successTitle || 'Enquiry Submitted Successfully!'}
            </h4>
            <p className="mt-1 text-sm text-emerald-800 leading-relaxed">
              {successText ||
                'Thank you for contacting Atemzy Hitech Engineering Services Ltd. A technical representative has received your request and will follow up with you within one business day.'}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              type="button"
              className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold ml-2"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 'ERROR') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="p-5 mb-6 text-rose-950 bg-rose-50 border border-rose-300 rounded-xl shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-base font-bold text-rose-900">Submission Error</h4>
            <p className="mt-1 text-sm text-rose-800 leading-relaxed">
              {errorMessage ||
                'An error occurred while transmitting your request. Please try again or reach our technical office directly at info@atemzyhitech.com.'}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              type="button"
              className="text-rose-700 hover:text-rose-900 text-sm font-semibold ml-2"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
