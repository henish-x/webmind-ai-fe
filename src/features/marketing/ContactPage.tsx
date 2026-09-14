import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn, focusRing } from '@/lib/utils'
import { MktButton } from './components/MktButton'

const contactSchema = z.object({
  name: z.string().min(1, 'Enter your name'),
  email: z.string().min(1, 'Enter your work email').email('Enter a valid email address'),
  company: z.string().min(1, 'Enter your company name'),
  website: z.string().optional(),
  message: z.string().min(1, 'Tell us a little about what you need'),
})

type ContactForm = z.infer<typeof contactSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" aria-live="polite" className="mt-1 text-[13px] text-danger">
      {message}
    </p>
  )
}

const fieldClass = cn(
  'h-11 w-full rounded-lg border border-hairline bg-white px-3.5 text-[15px] text-ink-primary placeholder:text-ink-muted',
  focusRing,
)

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 500))
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <h1 className="font-serif text-[36px] font-medium leading-[1.15] text-ink-primary md:text-[48px]">Contact</h1>
      <p className="mt-4 text-[17px] leading-[1.65] text-ink-secondary">
        Tell us a bit about your business and we'll get back to you — no automated reply, a real person reads these.
      </p>

      {sent ? (
        <p className="mt-10 text-[17px] text-ink-primary">Thanks — we'll get back to you within a day.</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="text-[14px] font-medium text-ink-primary">
              Name
            </label>
            <input id="name" className={cn(fieldClass, 'mt-1.5')} {...register('name')} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <label htmlFor="email" className="text-[14px] font-medium text-ink-primary">
              Work email
            </label>
            <input id="email" type="email" className={cn(fieldClass, 'mt-1.5')} {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <label htmlFor="company" className="text-[14px] font-medium text-ink-primary">
              Company
            </label>
            <input id="company" className={cn(fieldClass, 'mt-1.5')} {...register('company')} />
            <FieldError message={errors.company?.message} />
          </div>
          <div>
            <label htmlFor="website" className="text-[14px] font-medium text-ink-primary">
              Website URL <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input id="website" placeholder="yourwebsite.com" className={cn(fieldClass, 'mt-1.5')} {...register('website')} />
          </div>
          <div>
            <label htmlFor="message" className="text-[14px] font-medium text-ink-primary">
              Message
            </label>
            <textarea id="message" rows={4} className={cn(fieldClass, 'mt-1.5 h-auto py-2.5')} {...register('message')} />
            <FieldError message={errors.message?.message} />
          </div>
          <MktButton type="submit" variant="dark" size="md" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'}
          </MktButton>
        </form>
      )}
    </div>
  )
}
