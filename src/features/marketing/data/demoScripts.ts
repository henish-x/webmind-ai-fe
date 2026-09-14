export type DemoExampleCategory = 'support' | 'sales' | 'fallback' | 'booking' | 'escalation'

export interface DemoExample {
  category: DemoExampleCategory
  question: string
  answer: string
  /** support: source page citation; booking: scheduling link label; fallback/escalation: handoff note. */
  meta: string
}

export interface DemoScript {
  id: string
  label: string
  domain: string
  indexedPages: string[]
  leadName: string
  /** Exactly one example per category, in this order: support, sales, fallback, booking, escalation. */
  examples: DemoExample[]
}

/** Used by the hero's autoplay loop (support + sales) and the fuller interactive demo (all five). */
export const DEMO_SCRIPTS: DemoScript[] = [
  {
    id: 'real-estate',
    label: 'Real estate',
    domain: 'meridianhomes.com',
    indexedPages: ['/listings', '/pricing', '/faq'],
    leadName: 'Amara Chen',
    examples: [
      {
        category: 'support',
        question: 'What are your office hours?',
        answer: "We're open Monday–Saturday, 10am–6pm. You can also book a site visit anytime right here.",
        meta: 'FAQ page',
      },
      {
        category: 'sales',
        question: 'Do you have any 2-bedroom units under $300,000?',
        answer: "We do — I'll have someone send you the current list. What's your name and email?",
        meta: 'Lead sent to your team',
      },
      {
        category: 'fallback',
        question: 'Can I get a mortgage arranged directly through you?',
        answer: "I don't have that information yet, but I can connect you with our team.",
        meta: 'No confident answer — flagged for follow-up',
      },
      {
        category: 'booking',
        question: 'Can I schedule a site visit this Saturday?',
        answer: "Absolutely — here's our booking calendar, pick a time that works for you.",
        meta: 'Opens booking calendar',
      },
      {
        category: 'escalation',
        question: "This is the third time I've gotten a different answer. I want to talk to a real person now.",
        answer: 'I hear you — let me connect you with someone from our team right away.',
        meta: 'Escalated to your team',
      },
    ],
  },
  {
    id: 'coaching',
    label: 'Coaching institute',
    domain: 'ascendcoaching.com',
    indexedPages: ['/programs', '/pricing', '/faq'],
    leadName: 'Leo Fischer',
    examples: [
      {
        category: 'support',
        question: 'What are your office hours?',
        answer: 'Our support desk is open Monday–Saturday, 9am–7pm, and live sessions run twice a week in the evenings.',
        meta: 'FAQ page',
      },
      {
        category: 'sales',
        question: 'What are the batch fees for the certification program?',
        answer: "Batch fees start at $499 for the Foundations track — I'll get you the full breakdown. What's your name and email?",
        meta: 'Lead sent to your team',
      },
      {
        category: 'fallback',
        question: 'Do you offer a scholarship for toppers?',
        answer: "I don't have that information yet, but I can connect you with our admissions team.",
        meta: 'No confident answer — flagged for follow-up',
      },
      {
        category: 'booking',
        question: 'Can I visit for a demo class this Saturday?',
        answer: "Yes — here's our demo class calendar, grab a slot that works for you.",
        meta: 'Opens booking calendar',
      },
      {
        category: 'escalation',
        question: "I've asked this twice already and I'm still not getting a straight answer. I want to speak to someone.",
        answer: "I'm sorry about that — connecting you with a member of our team right now.",
        meta: 'Escalated to your team',
      },
    ],
  },
  {
    id: 'local-service',
    label: 'Local service business',
    domain: 'brightfixplumbing.com',
    indexedPages: ['/services', '/pricing', '/faq'],
    leadName: 'Nadia Osei',
    examples: [
      {
        category: 'support',
        question: 'Do you offer emergency callouts?',
        answer: 'Yes — we run 24/7 emergency callouts, and most jobs in your area are covered within the hour.',
        meta: 'Services page',
      },
      {
        category: 'sales',
        question: 'What would a bathroom re-pipe cost, roughly?',
        answer: "That depends on the layout — I'll get you a proper quote. What's your name and email?",
        meta: 'Lead sent to your team',
      },
      {
        category: 'fallback',
        question: 'Do you handle gas line repairs too?',
        answer: "I don't have that information yet, but I can connect you with our team.",
        meta: 'No confident answer — flagged for follow-up',
      },
      {
        category: 'booking',
        question: 'Can someone come out Thursday afternoon?',
        answer: "Sure — here's our scheduling calendar, pick a slot that works.",
        meta: 'Opens booking calendar',
      },
      {
        category: 'escalation',
        question: "I've called twice about this leak and no one followed up. I need to talk to an actual person.",
        answer: "I'm really sorry about that — let me get you connected with our team lead right now.",
        meta: 'Escalated to your team',
      },
    ],
  },
]
