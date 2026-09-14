const SECTIONS = [
  {
    title: 'Using the service',
    body: "You need an account to use WebMind. You're responsible for the content you connect and for keeping your account credentials secure.",
  },
  {
    title: 'Your content',
    body: "You own the content on your website and the data your chatbot collects. We process it to run the service on your behalf — we don't claim ownership of it.",
  },
  {
    title: 'Acceptable use',
    body: "Don't use the service to publish content that's illegal, or to build a bot intended to mislead or defraud visitors.",
  },
  {
    title: 'Billing & cancellation',
    body: 'Plans renew automatically each billing cycle. You can cancel any time from Billing — your widget stops responding to new conversations at the end of the current period, with no lock-in.',
  },
  {
    title: 'Changes',
    body: 'We may update these terms as the product evolves. Material changes will be communicated by email before they take effect.',
  },
]

export function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <h1 className="font-serif text-[36px] font-medium leading-[1.15] text-ink-primary md:text-[42px]">
        Terms of service
      </h1>
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
