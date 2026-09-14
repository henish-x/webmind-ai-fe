import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        action={
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        }
      />
    </div>
  )
}
