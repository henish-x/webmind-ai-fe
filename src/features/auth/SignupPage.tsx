import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/state/useAuthStore'
import { FormFieldError } from './FormFieldError'

const signupSchema = z
  .object({
    name: z.string().min(1, 'Enter your name'),
    email: z.string().min(1, 'Enter your email address').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don’t match',
    path: ['confirmPassword'],
  })

type SignupForm = z.infer<typeof signupSchema>

export function SignupPage() {
  const signup = useAuthStore((s) => s.signup)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(values: SignupForm) {
    setServerError(null)
    try {
      await signup(values.name, values.email, values.password)
      navigate('/onboarding', { replace: true })
    } catch {
      setServerError("We couldn't create your account. Try again in a moment.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-section-heading font-medium text-ink-primary">Create your account</p>
        <p className="mt-1 text-body text-ink-secondary">Turn your website into a chatbot in under 10 minutes.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" className="mt-1.5" {...register('name')} />
          <FormFieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" className="mt-1.5" {...register('email')} />
          <FormFieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" className="mt-1.5" {...register('password')} />
          <FormFieldError message={errors.password?.message} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-1.5"
            {...register('confirmPassword')}
          />
          <FormFieldError message={errors.confirmPassword?.message} />
        </div>

        {serverError && (
          <p role="alert" aria-live="polite" className="text-meta text-danger">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-meta text-ink-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ink-primary underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  )
}
