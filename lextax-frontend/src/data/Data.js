// Demo Data for LexTax Application
// This file contains sample questions, answers, and responses for testing the interface

export const demoData = {
  // Sample search queries and their responses
  searchResponses: {
    "vat rate": {
      title: "Current VAT Rates in Sri Lanka",
      source: "VAT Act No. 14 of 2002 (as amended)",
      answer: "The standard VAT rate in Sri Lanka is 15%. This applies to most goods and services. However, there are reduced rates for certain essential items like rice (0%), milk powder (0%), and some telecommunications services (12%). Some items are completely exempt from VAT, including most financial services and educational services.",
      keyPoints: [
        "Standard VAT rate: 15%",
        "Essential food items: 0% VAT",
        "Some services: 12% VAT",
        "Exports: 0% VAT (zero-rated)",
        "Registration threshold: Rs. 12 million annual turnover"
      ],
      example: "If you buy a laptop for Rs. 100,000, you'll pay Rs. 15,000 as VAT (15%), making the total Rs. 115,000.",
      confidence: 95,
      responseTime: 2.3
    },
    
    "income tax": {
      title: "Personal Income Tax Calculation",
      source: "Inland Revenue Act No. 24 of 2017",
      answer: "Personal income tax in Sri Lanka uses a progressive rate system. For residents, the first Rs. 1.2 million of annual income is tax-free. Income above this is taxed at rates ranging from 6% to 36% depending on the income level. Non-residents are taxed at a flat rate of 24% on Sri Lankan sourced income.",
      keyPoints: [
        "Tax-free threshold: Rs. 1.2 million per year",
        "Progressive rates: 6% to 36%",
        "Non-resident rate: 24%",
        "Self-assessment required for high earners",
        "PAYE system for employees"
      ],
      example: "If your annual salary is Rs. 2.4 million, the first Rs. 1.2 million is tax-free. The remaining Rs. 1.2 million is taxed progressively, starting at 6%.",
      confidence: 98,
      responseTime: 1.8
    },
    
    "nbt exemptions": {
      title: "NBT Exemptions for Small Businesses",
      source: "Nation Building Tax Act No. 9 of 2009",
      answer: "Small businesses with an annual turnover below Rs. 12 million are exempt from Nation Building Tax (NBT). Additionally, certain sectors like agriculture, exports, and specific manufacturing activities may qualify for exemptions regardless of turnover. Newly established businesses may also get temporary exemptions.",
      keyPoints: [
        "Threshold: Rs. 12 million annual turnover",
        "Agricultural activities: Generally exempt",
        "Export businesses: Usually exempt",
        "New businesses: May get 2-year exemption",
        "Some manufacturing: Sector-specific exemptions"
      ],
      example: "A small grocery shop with Rs. 8 million annual sales doesn't need to pay NBT as it's below the Rs. 12 million threshold.",
      confidence: 92,
      responseTime: 2.1
    },
    
    "stamp duty property": {
      title: "Stamp Duty on Property Transactions",
      source: "Stamp Duty Act No. 43 of 1982 (as amended)",
      answer: "Stamp duty on property transfers in Sri Lanka varies based on the property value and location. For properties in Colombo Municipal Council area, it's typically 4% of the market value or consideration (whichever is higher). For other areas, it's usually 2%. Additional taxes may apply for non-residents.",
      keyPoints: [
        "Colombo MC area: 4% of property value",
        "Other areas: 2% of property value",
        "Calculated on higher of market value or sale price",
        "Non-residents may pay additional taxes",
        "Paid before property transfer registration"
      ],
      example: "For a house worth Rs. 10 million in Colombo, stamp duty would be Rs. 400,000 (4% of Rs. 10 million).",
      confidence: 90,
      responseTime: 2.7
    }
  },
  
  // Sample processing steps for different types of queries
  processingSteps: [
    "Analyzing your question...",
    "Searching tax regulations...",
    "Finding relevant sections...",
    "Simplifying legal language...",
    "Preparing your answer..."
  ],
  
  // Quick action suggestions
  quickActions: [
    {
      category: "VAT",
      queries: [
        "What is the current VAT rate in Sri Lanka?",
        "Which items are exempt from VAT?",
        "How to register for VAT?",
        "VAT calculation examples"
      ]
    },
    {
      category: "Income Tax",
      queries: [
        "How do I calculate my income tax?",
        "What is the tax-free threshold?",
        "Income tax rates for 2024",
        "Tax deductions available"
      ]
    },
    {
      category: "NBT",
      queries: [
        "What is Nation Building Tax?",
        "NBT exemptions for businesses",
        "NBT registration process",
        "NBT calculation method"
      ]
    },
    {
      category: "Stamp Duty",
      queries: [
        "Stamp duty rates for property",
        "How to calculate stamp duty?",
        "Stamp duty exemptions",
        "Documents requiring stamp duty"
      ]
    }
  ],
  
  // Related questions that might be suggested
  relatedQuestions: {
    "vat": [
      "How to claim VAT refunds?",
      "VAT registration requirements",
      "VAT on imported goods",
      "Monthly VAT return filing"
    ],
    "income tax": [
      "Tax allowances and reliefs",
      "Quarterly payment system",
      "Self-assessment tax returns",
      "Tax on rental income"
    ],
    "nbt": [
      "NBT on service providers",
      "Quarterly NBT payments",
      "NBT penalties and interest",
      "NBT refund procedures"
    ],
    "stamp duty": [
      "Digital stamp duty payment",
      "Stamp duty on agreements",
      "Refund of stamp duty",
      "Late payment penalties"
    ]
  },
  
  // Sample tax scenarios for testing
  testScenarios: [
    {
      scenario: "Small Business Owner",
      questions: [
        "Do I need to register for VAT with Rs. 8 million turnover?",
        "What taxes apply to my retail business?",
        "How often should I file tax returns?"
      ]
    },
    {
      scenario: "Property Buyer",
      questions: [
        "What are all the taxes when buying a house?",
        "Stamp duty calculation for Rs. 15 million property",
        "Tax implications of joint property ownership"
      ]
    },
    {
      scenario: "Freelancer",
      questions: [
        "How to pay tax on freelance income?",
        "Quarterly advance tax payments",
        "Allowable business expenses"
      ]
    }
  ]
};

// Function to simulate search and return demo results
export const searchDemo = (query) => {
  const normalizedQuery = query.toLowerCase();
  
  // Simple keyword matching for demo purposes
  if (normalizedQuery.includes('vat') && normalizedQuery.includes('rate')) {
    return demoData.searchResponses['vat rate'];
  } else if (normalizedQuery.includes('income') && normalizedQuery.includes('tax')) {
    return demoData.searchResponses['income tax'];
  } else if (normalizedQuery.includes('nbt') && normalizedQuery.includes('exemption')) {
    return demoData.searchResponses['nbt exemptions'];
  } else if (normalizedQuery.includes('stamp') && normalizedQuery.includes('duty')) {
    return demoData.searchResponses['stamp duty property'];
  } else if (normalizedQuery.includes('vat')) {
    return demoData.searchResponses['vat rate'];
  } else if (normalizedQuery.includes('income')) {
    return demoData.searchResponses['income tax'];
  } else if (normalizedQuery.includes('nbt')) {
    return demoData.searchResponses['nbt exemptions'];
  } else if (normalizedQuery.includes('stamp') || normalizedQuery.includes('property')) {
    return demoData.searchResponses['stamp duty property'];
  } else {
    // Default response for unmatched queries
    return {
      title: "General Tax Information",
      source: "Sri Lankan Tax Laws - Multiple Acts",
      answer: "I found some information related to your question. Sri Lankan tax system includes several types of taxes: Income Tax, VAT, NBT, Stamp Duty, and others. Each has specific rules, rates, and exemptions. For specific advice tailored to your situation, I'd recommend asking a more detailed question about the particular tax type you're interested in.",
      keyPoints: [
        "Multiple tax types apply in Sri Lanka",
        "Each tax has specific rules and rates",
        "Exemptions available for certain categories",
        "Regular updates to tax laws",
        "Professional advice recommended for complex cases"
      ],
      example: "Try asking specific questions like 'What is the VAT rate?' or 'How do I calculate income tax?'",
      confidence: 85,
      responseTime: 1.5
    };
  }
};

// Export additional utility functions
export const getRandomQuestion = (category = null) => {
  if (category) {
    const categoryActions = demoData.quickActions.find(action => 
      action.category.toLowerCase() === category.toLowerCase()
    );
    if (categoryActions) {
      const randomIndex = Math.floor(Math.random() * categoryActions.queries.length);
      return categoryActions.queries[randomIndex];
    }
  }
  
  // Return random question from any category
  const allQueries = demoData.quickActions.flatMap(action => action.queries);
  const randomIndex = Math.floor(Math.random() * allQueries.length);
  return allQueries[randomIndex];
};

export const getRelatedQuestions = (query) => {
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes('vat')) {
    return demoData.relatedQuestions.vat;
  } else if (normalizedQuery.includes('income')) {
    return demoData.relatedQuestions['income tax'];
  } else if (normalizedQuery.includes('nbt')) {
    return demoData.relatedQuestions.nbt;
  } else if (normalizedQuery.includes('stamp') || normalizedQuery.includes('property')) {
    return demoData.relatedQuestions['stamp duty'];
  }
  
  return [];
};

// Function to simulate loading states with realistic delays
export const simulateProcessing = async (steps, onStepUpdate) => {
  for (let i = 0; i < steps.length; i++) {
    if (onStepUpdate) {
      onStepUpdate(i, steps[i]);
    }
    
    // Realistic delays between steps
    const delay = 600 + Math.random() * 800; // 600-1400ms per step
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Export configuration for the demo
export const demoConfig = {
  maxProcessingTime: 5000, // 5 seconds max
  minProcessingTime: 2000, // 2 seconds min
  typicalResponseTime: 3000, // 3 seconds typical
  confidenceThreshold: 80, // Minimum confidence for good answers
  supportedLanguages: ['en', 'si', 'ta'], // English, Sinhala, Tamil
  maxQueryLength: 500, // Maximum characters in query
  cacheTimeout: 300000 // 5 minutes cache timeout
};