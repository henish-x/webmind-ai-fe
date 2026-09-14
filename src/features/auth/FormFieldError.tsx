export function FormFieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" aria-live="polite" className="mt-1 text-caption text-danger">
      {message}
    </p>
  )
}
