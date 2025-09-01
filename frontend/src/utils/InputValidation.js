/* ==================== INPUT VALIDATION UTILITY ==================== */

/* ========== LANGUAGE DETECTION PATTERNS ========== */
const LANGUAGE_PATTERNS = {
  // Arabic and related scripts
  arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  
  // Chinese, Japanese, Korean
  chinese: /[\u4E00-\u9FFF]/,
  japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
  korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
  
  // Cyrillic (Russian, Bulgarian, etc.)
  cyrillic: /[\u0400-\u04FF]/,
  
  // Hindi and Devanagari
  hindi: /[\u0900-\u097F]/,
  
  // Tamil
  tamil: /[\u0B80-\u0BFF]/,
  
  // Sinhala (Sri Lankan)
  sinhala: /[\u0D80-\u0DFF]/,
  
  // Bengali
  bengali: /[\u0980-\u09FF]/,
  
  // Thai
  thai: /[\u0E00-\u0E7F]/,
  
  // Greek
  greek: /[\u0370-\u03FF]/,
  
  // Hebrew
  hebrew: /[\u0590-\u05FF]/,
  
  // Armenian
  armenian: /[\u0530-\u058F]/,
  
  // Georgian
  georgian: /[\u10A0-\u10FF]/,
  
  // Vietnamese extended characters
  vietnamese: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
  
  // European accented characters (French, German, Spanish, etc.)
  european: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i,
  
  // Other common scripts
  myanmar: /[\u1000-\u109F]/,
  khmer: /[\u1780-\u17FF]/,
  lao: /[\u0E80-\u0EFF]/,
  tibetan: /[\u0F00-\u0FFF]/,
  malayalam: /[\u0D00-\u0D7F]/,
  telugu: /[\u0C00-\u0C7F]/,
  kannada: /[\u0C80-\u0CFF]/,
  oriya: /[\u0B00-\u0B7F]/,
  punjabi: /[\u0A00-\u0A7F]/,
  gujarati: /[\u0A80-\u0AFF]/
};

/* ========== LANGUAGE NAMES MAPPING ========== */
const LANGUAGE_NAMES = {
  arabic: 'Arabic',
  chinese: 'Chinese',
  japanese: 'Japanese',
  korean: 'Korean',
  cyrillic: 'Russian/Cyrillic',
  hindi: 'Hindi',
  tamil: 'Tamil',
  sinhala: 'Sinhala',
  bengali: 'Bengali',
  thai: 'Thai',
  greek: 'Greek',
  hebrew: 'Hebrew',
  armenian: 'Armenian',
  georgian: 'Georgian',
  vietnamese: 'Vietnamese',
  european: 'European language',
  myanmar: 'Myanmar',
  khmer: 'Khmer',
  lao: 'Lao',
  tibetan: 'Tibetan',
  malayalam: 'Malayalam',
  telugu: 'Telugu',
  kannada: 'Kannada',
  oriya: 'Oriya',
  punjabi: 'Punjabi',
  gujarati: 'Gujarati'
};

/* ==================== VALIDATION FUNCTIONS ==================== */

/**
 * Detects if text contains non-English characters
 * @param {string} text - Input text to validate
 * @returns {Object} Validation result
 */
export const validateInputLanguage = (text) => {
  // Return valid for empty input
  if (!text || text.trim() === '') {
    return {
      isValid: true,
      detectedLanguages: [],
      message: ''
    };
  }

  const detectedLanguages = [];
  
  // Check each language pattern
  Object.entries(LANGUAGE_PATTERNS).forEach(([lang, pattern]) => {
    if (pattern.test(text)) {
      detectedLanguages.push(lang);
    }
  });

  // Check for basic English pattern (letters, numbers, common punctuation)
  const englishPattern = /^[a-zA-Z0-9\s.,!?;:()\-'"\/\\\[\]{}@#$%^&*+=<>|`~_]*$/;
  const isEnglishOnly = englishPattern.test(text);

  if (detectedLanguages.length === 0 && isEnglishOnly) {
    return {
      isValid: true,
      detectedLanguages: [],
      message: ''
    };
  }

  // If non-English detected
  if (detectedLanguages.length > 0) {
    const languageNames = detectedLanguages.map(lang => LANGUAGE_NAMES[lang]);
    const message = languageNames.length === 1 
      ? `${languageNames[0]} language is not currently supported. Please use English only.`
      : `Multiple languages detected (${languageNames.join(', ')}). Please use English only.`;

    return {
      isValid: false,
      detectedLanguages,
      message,
      iconType: 'language'
    };
  }

  // If contains other non-English characters not in our patterns
  if (!isEnglishOnly) {
    return {
      isValid: false,
      detectedLanguages: ['unknown'],
      message: 'Non-English characters detected. Please use English only.',
      iconType: 'language'
    };
  }

  return {
    isValid: true,
    detectedLanguages: [],
    message: '',
    iconType: null
  };
};

/**
 * Validates input length
 * @param {string} text - Input text
 * @param {number} minLength - Minimum length (default: 3)
 * @param {number} maxLength - Maximum length (default: 500)
 * @returns {Object} Validation result
 */
export const validateInputLength = (text, minLength = 3, maxLength = 500) => {
  const length = text.trim().length;
  
  if (length === 0) {
    return {
      isValid: false,
      message: 'Please enter your tax question.',
      iconType: 'edit'
    };
  }
  
  if (length < minLength) {
    return {
      isValid: false,
      message: `Please enter at least ${minLength} characters.`,
      iconType: 'edit'
    };
  }
  
  if (length > maxLength) {
    return {
      isValid: false,
      message: `Please limit your question to ${maxLength} characters. Current: ${length}`,
      iconType: 'edit'
    };
  }
  
  return {
    isValid: true,
    message: '',
    iconType: null
  };
};

/**
 * Validates if input contains meaningful content (not just punctuation/numbers)
 * @param {string} text - Input text
 * @returns {Object} Validation result
 */
export const validateInputContent = (text) => {
  const trimmedText = text.trim();
  
  // Check if text contains at least some letters
  const hasLetters = /[a-zA-Z]/.test(trimmedText);
  const hasWords = /\b[a-zA-Z]{2,}\b/.test(trimmedText);
  
  if (!hasLetters) {
    return {
      isValid: false,
      message: 'Please enter a meaningful question with words.',
      iconType: 'message'
    };
  }
  
  if (!hasWords) {
    return {
      isValid: false,
      message: 'Please enter complete words in your question.',
      iconType: 'message'
    };
  }
  
  return {
    isValid: true,
    message: '',
    iconType: null
  };
};

/**
 * Complete input validation combining all checks
 * @param {string} text - Input text to validate
 * @param {Object} options - Validation options
 * @returns {Object} Complete validation result
 */
export const validateTaxInput = (text, options = {}) => {
  const {
    minLength = 3,
    maxLength = 500,
    checkLanguage = true,
    checkLength = true,
    checkContent = true
  } = options;

  // Check language first
  if (checkLanguage) {
    const languageValidation = validateInputLanguage(text);
    if (!languageValidation.isValid) {
      return {
        isValid: false,
        type: 'language',
        message: languageValidation.message,
        detectedLanguages: languageValidation.detectedLanguages,
        iconType: 'language'
      };
    }
  }

  // Check length
  if (checkLength) {
    const lengthValidation = validateInputLength(text, minLength, maxLength);
    if (!lengthValidation.isValid) {
      return {
        isValid: false,
        type: 'length',
        message: lengthValidation.message,
        iconType: 'edit'
      };
    }
  }

  // Check content quality
  if (checkContent) {
    const contentValidation = validateInputContent(text);
    if (!contentValidation.isValid) {
      return {
        isValid: false,
        type: 'content',
        message: contentValidation.message,
        iconType: 'message'
      };
    }
  }

  return {
    isValid: true,
    type: 'success',
    message: 'Input is valid',
    iconType: null
  };
};

/* ==================== UTILITY FUNCTIONS ==================== */

/**
 * Sanitizes input text by removing potentially harmful characters
 * @param {string} text - Input text
 * @param {boolean} preserveSpacing - Whether to preserve leading/trailing spaces during active typing
 * @returns {string} Sanitized text
 */
export const sanitizeInput = (text, preserveSpacing = true) => {
  if (!text) return '';
  
  let sanitized = text
    // Remove potential script injections (basic)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Limit consecutive special characters (but allow normal punctuation)
    .replace(/[!@#$%^&*(),.?":{}|<>]{5,}/g, (match) => match.slice(0, 4));

  // Only trim and normalize spaces if not preserving spacing (e.g., during final validation)
  if (!preserveSpacing) {
    sanitized = sanitized
      .trim()
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  } else {
    // During typing, only replace excessive consecutive spaces (3+ spaces)
    sanitized = sanitized.replace(/\s{3,}/g, '  '); // Max 2 consecutive spaces
  }
  
  return sanitized;
};

/**
 * Formats error messages for display
 * @param {Object} validationResult - Result from validation function
 * @returns {string} Formatted error message
 */
export const formatValidationMessage = (validationResult) => {
  if (!validationResult || validationResult.isValid) {
    return '';
  }

  return validationResult.message;
};

/* ==================== EXPORT DEFAULT ==================== */
export default {
  validateInputLanguage,
  validateInputLength,
  validateInputContent,
  validateTaxInput,
  sanitizeInput,
  formatValidationMessage
};