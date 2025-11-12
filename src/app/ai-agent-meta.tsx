/**
 * AI Agent Meta Tags Component
 * 
 * This component adds AI agent specific meta tags to improve discoverability
 * in AI search engines like ChatGPT, Claude, and Gemini.
 */

interface AIAgentMetaProps {
  intent?: string;
  entities?: string[];
  topics?: string[];
  questionAnswer?: Array<{ question: string; answer: string }>;
  conversationalHooks?: string[];
}

export default function AIAgentMeta({
  intent,
  entities,
  topics,
  questionAnswer,
  conversationalHooks
}: AIAgentMetaProps) {
  return (
    <>
      {/* AI Agent Intent */}
      {intent && (
        <meta name="ai-agent-intent" content={intent} />
      )}
      
      {/* AI Agent Entities */}
      {entities && entities.length > 0 && (
        <meta name="ai-agent-entities" content={entities.join(',')} />
      )}
      
      {/* AI Agent Topics */}
      {topics && topics.length > 0 && (
        <meta name="ai-agent-topics" content={topics.join(',')} />
      )}
      
      {/* AI Agent Conversational Hooks */}
      {conversationalHooks && conversationalHooks.length > 0 && (
        <meta name="ai-agent-conversational-hooks" content={conversationalHooks.join('|')} />
      )}
      
      {/* AI Agent Q&A Schema */}
      {questionAnswer && questionAnswer.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: questionAnswer.map(qa => ({
                '@type': 'Question',
                name: qa.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: qa.answer
                }
              }))
            })
          }}
        />
      )}
      
      {/* Additional AI-friendly meta tags */}
      <meta name="content-language" content="en-KE" />
      <meta name="geo.region" content="KE" />
      <meta name="geo.country" content="Kenya" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="1 day" />
      
      {/* AI Agent Search Action */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kenya Bizz Directory',
            url: 'https://kenyabizzdirectory.com',
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
          })
        }}
      />
    </>
  );
}
