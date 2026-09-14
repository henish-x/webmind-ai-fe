export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How is this different from other chatbot tools?',
    answer:
      "Most chatbot tools do one thing: answer questions from your content. This one also classifies every message as support or sales, in real time, and runs a completely different flow for each — a structured lead capture instead of a generic reply. You get one widget that does the job of two.",
  },
  {
    question: 'Will it actually understand my website content?',
    answer:
      'We crawl your public pages, index the content, and ground every answer in what we found — you can preview and edit exactly what it indexed before it ever talks to a visitor. If your site is thin on content, tell us during setup and we can add FAQs or documents manually.',
  },
  {
    question: "What happens if it doesn't know an answer?",
    answer:
      "It says so, honestly — \"I don't have that information\" — instead of guessing, and offers to connect the visitor with your team. You set the confidence threshold, and a visitor can always ask for a human, at any point, regardless of how confident the bot is.",
  },
  {
    question: 'Can I see what leads it captures?',
    answer:
      'Every lead lands in your inbox with the full conversation attached, plus whatever qualification answers it collected. If you connect a CRM, it pushes there automatically too — partial leads (someone who started but didn\'t finish) are saved and flagged, not discarded.',
  },
  {
    question: 'How long does setup really take?',
    answer:
      'Pasting your URL to having a live, installed widget is usually under 10 minutes — crawling your site, reviewing what it found, and copying one script tag onto your site. Fine-tuning tone, qualification questions, and integrations can take longer, but the bot works well on day one.',
  },
  {
    question: 'What happens if I cancel?',
    answer:
      "Your widget stops responding to new conversations at the end of your billing period — no lock-in, no cancellation call required. Your data stays available for export for 30 days after that, and you can request full deletion any time from Settings.",
  },
]
