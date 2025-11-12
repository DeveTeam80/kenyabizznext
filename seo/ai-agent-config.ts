/**
 * AI Agent Optimization Configuration
 * 
 * This file contains configuration for optimizing content for AI search engines
 * like ChatGPT, Claude, and Gemini.
 */

export interface AIAgentConfig {
  // Primary intent keywords that AI agents should understand
  primaryIntents: string[];
  
  // Entity recognition patterns
  entityPatterns: {
    businessTypes: string[];
    locations: string[];
    services: string[];
    industries: string[];
  };
  
  // Conversational hooks for better AI understanding
  conversationalHooks: {
    greetings: string[];
    questions: string[];
    callsToAction: string[];
  };
  
  // Knowledge graph optimization
  knowledgeGraph: {
    mainTopics: string[];
    relatedTopics: string[];
    semanticKeywords: string[];
  };
  
  // AI agent specific meta tags
  metaTags: {
    contentLanguage: string;
    geoRegion: string;
    geoCountry: string;
    distribution: string;
    rating: string;
    revisitAfter: string;
  };
}

export const aiAgentConfig: AIAgentConfig = {
  primaryIntents: [
    'find business',
    'search directory',
    'locate service',
    'contact company',
    'business information',
    'service provider',
    'local business',
    'Kenya business'
  ],
  
  entityPatterns: {
    businessTypes: [
      'restaurant', 'hotel', 'clinic', 'school', 'bank', 'shop', 'office',
      'factory', 'warehouse', 'salon', 'gym', 'pharmacy', 'garage',
      'law firm', 'accounting firm', 'real estate', 'insurance'
    ],
    locations: [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
      'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Meru'
    ],
    services: [
      'consulting', 'repair', 'maintenance', 'delivery', 'installation',
      'training', 'cleaning', 'security', 'transport', 'catering',
      'photography', 'design', 'marketing', 'legal', 'financial'
    ],
    industries: [
      'healthcare', 'education', 'technology', 'manufacturing', 'retail',
      'hospitality', 'construction', 'agriculture', 'finance', 'transport'
    ]
  },
  
  conversationalHooks: {
    greetings: [
      'Looking for a business in Kenya?',
      'Need to find a service provider?',
      'Searching for local businesses?',
      'Want to connect with companies?'
    ],
    questions: [
      'What type of business are you looking for?',
      'Which city or area interests you?',
      'What services do you need?',
      'Are you looking for verified businesses?'
    ],
    callsToAction: [
      'Browse our directory now',
      'Find verified businesses',
      'Connect with local companies',
      'Discover services near you'
    ]
  },
  
  knowledgeGraph: {
    mainTopics: [
      'Kenya business directory',
      'local businesses',
      'service providers',
      'company listings',
      'business information',
      'contact details',
      'location services'
    ],
    relatedTopics: [
      'East Africa business',
      'African companies',
      'business networking',
      'professional services',
      'commercial directory',
      'business verification',
      'local economy'
    ],
    semanticKeywords: [
      'business directory Kenya',
      'company listings Nairobi',
      'service providers Mombasa',
      'local businesses Kisumu',
      'verified companies Kenya',
      'business contacts Kenya',
      'professional services directory'
    ]
  },
  
  metaTags: {
    contentLanguage: 'en-KE',
    geoRegion: 'KE',
    geoCountry: 'Kenya',
    distribution: 'global',
    rating: 'general',
    revisitAfter: '1 day'
  }
};

/**
 * Generates AI agent optimized content based on business data
 */
export function generateAIAgentContent(
  businessName: string,
  category: string,
  location: string,
  description: string,
  type: 'listing' | 'category' | 'location' = 'listing'
) {
  const config = aiAgentConfig;
  
  // Generate intent based on type
  let intent = '';
  switch (type) {
    case 'listing':
      intent = `Find information about ${businessName}, a ${category} business in ${location}, Kenya`;
      break;
    case 'category':
      intent = `Find ${category} businesses and services in Kenya`;
      break;
    case 'location':
      intent = `Find businesses and services in ${location}, Kenya`;
      break;
  }
  
  // Generate entities
  const entities = [
    businessName,
    category,
    location,
    'Kenya',
    'business directory',
    ...config.entityPatterns.businessTypes.filter(bt => 
      category.toLowerCase().includes(bt.toLowerCase())
    ),
    ...config.entityPatterns.locations.filter(loc => 
      location.toLowerCase().includes(loc.toLowerCase())
    )
  ];
  
  // Generate topics
  const topics = [
    category.toLowerCase(),
    'business services',
    'local directory',
    'Kenya business',
    ...config.knowledgeGraph.mainTopics,
    ...config.knowledgeGraph.semanticKeywords.filter(keyword =>
      keyword.toLowerCase().includes(category.toLowerCase()) ||
      keyword.toLowerCase().includes(location.toLowerCase())
    )
  ];
  
  // Generate conversational hooks
  const conversationalHooks = [
    ...config.conversationalHooks.greetings,
    `Looking for ${category} in ${location}?`,
    `Find the best ${category} services`,
    `Connect with ${businessName}`
  ];
  
  // Generate Q&A pairs
  const questionAnswer = [
    {
      question: `What is ${businessName}?`,
      answer: `${businessName} is a ${category} business located in ${location}, Kenya. ${description.substring(0, 200)}...`
    },
    {
      question: `Where is ${businessName} located?`,
      answer: `${businessName} is located in ${location}, Kenya. You can find their exact address and contact details on our directory.`
    },
    {
      question: `What services does ${businessName} offer?`,
      answer: `${businessName} offers ${category} services in ${location}. For detailed information about their services, contact them directly.`
    }
  ];
  
  return {
    intent,
    entities: [...new Set(entities)],
    topics: [...new Set(topics)],
    questionAnswer,
    conversationalHooks: [...new Set(conversationalHooks)]
  };
}

/**
 * Generates AI agent optimized schema markup
 */
export function generateAIAgentSchema(
  businessName: string,
  category: string,
  location: string,
  description: string,
  type: 'listing' | 'category' | 'location' = 'listing'
) {
  const content = generateAIAgentContent(businessName, category, location, description, type);
  
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: businessName,
      description: description,
      about: {
        '@type': 'Thing',
        name: category,
        description: `${category} services in ${location}, Kenya`
      },
      mainEntity: {
        '@type': 'Organization',
        name: businessName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: location,
          addressCountry: 'KE'
        },
        knowsAbout: content.topics,
        sameAs: content.entities
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://kenyabizzdirectory.com/search?q={search_term_string}',
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform'
          ]
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'QAPage',
      mainEntity: {
        '@type': 'Question',
        name: `What is ${businessName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: content.questionAnswer[0]?.answer || description
        }
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${category} in ${location}`,
      description: `Directory of ${category} businesses in ${location}, Kenya`,
      itemListElement: content.entities.map((entity, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entity,
        item: {
          '@type': 'Thing',
          name: entity,
          description: `${entity} related to ${category} in ${location}`
        }
      }))
    }
  ];
}
