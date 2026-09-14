import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/state/useAuthStore'
import { Faq } from './components/Faq'
import { FeatureHighlights } from './components/FeatureHighlights'
import { FinalCta } from './components/FinalCta'
import { ForkSection } from './components/ForkSection'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { InteractiveDemo } from './components/InteractiveDemo'
import { PricingSection } from './components/PricingSection'

export function LandingPage() {
  const session = useAuthStore((s) => s.session)

  // Signed-in visitors go straight to the product — the guard chain there
  // (RequireAuth/RequireOnboarded) further routes them to onboarding if needed.
  if (session) return <Navigate to="/dashboard" replace />

  return (
    <>
      <Hero />
      <ForkSection />
      <HowItWorks />
      <InteractiveDemo />
      <FeatureHighlights />
      <PricingSection />
      <Faq />
      <FinalCta />
    </>
  )
}
