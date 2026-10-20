import { useState } from 'react';

/**
 * Custom hook to handle Web3Forms submission with loading states,
 * honeypot spam detection, and accessible error handling.
 */
export const useFormSubmit = (formName = 'Website Enquiry') => {
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'
  const [errorMessage, setErrorMessage] = useState(null);

  const submitForm = async (formData, resetCallback) => {
    setStatus('SUBMITTING');
    setErrorMessage(null);

    // 1. Check for spam bot honeypot (if bot filled the invisible input)
    if (formData.botcheck) {
      console.warn('Bot submission prevented.');
      // Silently pretend success to avoid spam retry loops
      setStatus('SUCCESS');
      if (resetCallback) resetCallback();
      return true;
    }

    // 2. Retrieve Web3Forms Access Key
    // Falls back to a public test key or prompts the user if not configured
    const accessKey =
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
      'fafa27d4-e5e6-46ee-92b0-3d1ec6834d67';

    // 3. Prepare payload for Web3Forms API
    const submissionData = {
      ...formData,
      access_key: accessKey,
      from_name: 'Atemzy Hitech Website',
      subject: `New ${formName} from ${formData.name || 'Website Visitor'}`
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('SUCCESS');
        if (resetCallback) resetCallback();
        return true;
      } else {
        setStatus('ERROR');
        setErrorMessage(
          result.message ||
            'We were unable to process your request. Please verify your connection or reach us directly by phone.'
        );
        return false;
      }
    } catch (err) {
      console.error('Submission network error:', err);
      setStatus('ERROR');
      setErrorMessage(
        'A network connection error occurred while submitting. Please call or email our office directly.'
      );
      return false;
    }
  };

  const resetStatus = () => {
    setStatus('IDLE');
    setErrorMessage(null);
  };

  return {
    status,
    isSubmitting: status === 'SUBMITTING',
    isSuccess: status === 'SUCCESS',
    isError: status === 'ERROR',
    errorMessage,
    submitForm,
    resetStatus
  };
};
