const SECTIONS = [
  {
    title: 'What we collect',
    body: "Account details you give us (name, email, company), the content of your website when you connect it for indexing, and conversation data your chatbot handles on your site (visitor messages, captured lead details).",
  },
  {
    title: 'How we use it',
    body: 'To run the product — index your site, generate answers, route leads, and show you analytics. We don\'t sell your data or your visitors\' data to third parties.',
  },
  {
    title: 'Retention & deletion',
    body: 'You control how long conversation data is kept, from Settings → Data & Privacy. You can request full deletion of your account and its data at any time.',
  },
  {
    title: 'Third parties',
    body: 'We share data only with integrations you explicitly connect (your CRM, helpdesk, Slack, etc.) and with infrastructure providers required to run the service.',
  },
  {
    title: 'Contact',
    body: 'Questions about this policy — reach us through the Contact page.',
  },
]

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <h1 className="font-serif text-[36px] font-medium leading-[1.15] text-ink-primary md:text-[42px]">Privacy policy</h1>
      <p className="mt-4 text-[15px] text-ink-muted">Last updated September 2026</p>
      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <p className="text-[17px] font-medium text-ink-primary">{s.title}</p>
            <p className="mt-2 text-[15px] leading-[1.65] text-ink-secondary">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
