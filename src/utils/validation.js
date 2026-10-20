/**
 * Client-side validation utilities for Atemzy Hitech forms
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // Standard RFC 5322 simplified pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Allow international formatting (+), digits, spaces, hyphens, parentheses (min 8 digits)
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 16;
};

export const validateContactForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!formData.subject || formData.subject.trim().length < 3) {
    errors.subject = 'Please specify a subject for your enquiry.';
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'Please include a message detailing your request (min 10 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateQuoteForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address for quotation delivery.';
  }

  if (!formData.phone || !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (e.g. +234 803 000 0000).';
  }

  if (!formData.serviceCategory || formData.serviceCategory === '') {
    errors.serviceCategory = 'Please select a primary service category.';
  }

  if (!formData.projectDescription || formData.projectDescription.trim().length < 15) {
    errors.projectDescription = 'Please provide a brief scope or description of your project (min 15 characters).';
  }

  if (!formData.privacyAccepted) {
    errors.privacyAccepted = 'You must acknowledge our privacy notice before submitting.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
