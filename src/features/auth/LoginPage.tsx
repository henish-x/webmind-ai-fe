import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/state/useAuthStore'
import { FormFieldError } from './FormFieldError'

const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email address').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginForm) {
    setServerError(null)
    try {
      await login(values.email, values.password)
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'
      navigate(from, { replace: true })
    } catch {
      setServerError("We couldn't log you in. Check your details and try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-section-heading font-medium text-ink-primary">Log in</p>
        <p className="mt-1 text-body text-ink-secondary">Welcome back — pick up where you left off.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" className="mt-1.5" {...register('email')} />
          <FormFieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" className="mt-1.5" {...register('password')} />
          <FormFieldError message={errors.password?.message} />
        </div>

        {serverError && (
          <p role="alert" aria-live="polite" className="text-meta text-danger">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="text-center text-meta text-ink-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-ink-primary underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </div>
  )
}
