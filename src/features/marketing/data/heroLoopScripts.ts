export interface HeroLoopExchange {
  question: string
  answer: string
}

export interface HeroLoopScript {
  id: string
  domain: string
  indexedPages: string[]
  support: HeroLoopExchange & { citation: string }
  sales: HeroLoopExchange & { leadName: string }
  /** Only set on one script — alternates in occasionally in place of the normal support resolution. */
  escalation?: HeroLoopExchange
}

/** Three business types the hero demo auto-cycles through, each one support + one sales exchange. */
export const HERO_LOOP_SCRIPTS: HeroLoopScript[] = [
  {
    id: 'real-estate',
    domain: 'meridianhomes.com',
    indexedPages: ['/listings', '/pricing', '/faq'],
    support: {
      question: 'Is Tower B ready for possession?',
      answer: 'Expected December 2026, based on the current build timeline.',
      citation: 'FAQ page',
    },
    sales: {
      question: 'Do you have 2-bedroom units under $300,000?',
      answer: "We do — I'll have someone send you the current list. What's your name and email?",
      leadName: 'Amara Chen',
    },
  },
  {
    id: 'coaching',
    domain: 'apexacademy.com',
    indexedPages: ['/programs', '/pricing', '/faq'],
    support: {
      question: "What's the fee for the NEET batch?",
      answer: 'The NEET batch is $650 for the full year, including all study material and mock tests.',
      citation: 'Programs page',
    },
    sales: {
      question: 'Can I get a demo class this Saturday?',
      answer: "Of course — I'll get you booked in. What's your name and email?",
      leadName: 'Leo Fischer',
    },
  },
  {
    id: 'dental',
    domain: 'brightsmileclinic.com',
    indexedPages: ['/services', '/hours', '/faq'],
    support: {
      question: 'Do you accept walk-ins?',
      answer: 'Yes, we accept walk-ins for basic checkups — though booking ahead guarantees you a slot.',
      citation: 'FAQ page',
    },
    sales: {
      question: 'I need a cleaning appointment this week',
      answer: "I can get that booked — what's your name and email?",
      leadName: 'Nadia Osei',
    },
    escalation: {
      question: "Can't find my booking confirmation",
      answer: 'Let me connect you with our team.',
    },
  },
]
