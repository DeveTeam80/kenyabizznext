// /seo/config.ts
export const seoConfig = {
  // Site Identity
  siteName: "Kenya Bizz Directory", // Added - used throughout the refactored code
  defaultTitle: "Top Business Listing Directory in Kenya | Kenya Bizz Directory",
  titleTemplate: "%s | Kenya Bizz Directory", 
  defaultDescription: "Find trusted businesses across Kenya with our comprehensive business directory. Discover contacts, locations, reviews, and services all in one place.",
  siteUrl: "https://www.kenyabizzdirectory.com",
  defaultOgImage: "/assets/img/logo/og-default.png",
  twitterHandle: "@kenyabizzdirectory",
  defaultAuthor: "Kenya Bizz Directory",
  
  // Localization
  defaultLocale: "en_KE", // Changed from en_US to en_KE (Kenya)
  supportedLocales: ["en_KE", "sw_KE"], // Added Swahili support for Kenya
  
  // SEO Defaults
  defaultRobots: "index, follow",
  defaultOgType: "website",
  
  // Analytics
  analytics: {
    googleAnalytics: {
      measurementId: "G-LZ3GP2FHBP",
    },
    googleTagManager: {
      containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
    },
  },
  
  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  
  // Social Media (optional - for future expansion)
  social: {
    facebook: "https://facebook.com/kenyabizzdirectory",
    twitter: "https://twitter.com/kenyabizzdirectory",
    instagram: "https://instagram.com/kenyabizzdirectory",
    linkedin: "https://linkedin.com/company/kenyabizzdirectory",
  },
};

// Type export for better TypeScript support
export type SEOConfig = typeof seoConfig;