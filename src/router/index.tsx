import { createBrowserRouter } from 'react-router-dom'
import { AppShellLayout } from '@/layouts/AppShellLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { OnboardingLayout } from '@/layouts/OnboardingLayout'
import { RequireAuth } from './RequireAuth'
import { RequireOnboarded } from './RequireOnboarded'

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', lazy: () => import('@/features/marketing/LandingPage').then((m) => ({ Component: m.LandingPage })) },
      { path: '/pricing', lazy: () => import('@/features/marketing/PricingPage').then((m) => ({ Component: m.PricingPage })) },
      { path: '/contact', lazy: () => import('@/features/marketing/ContactPage').then((m) => ({ Component: m.ContactPage })) },
      { path: '/book-a-demo', lazy: () => import('@/features/marketing/BookDemoPage').then((m) => ({ Component: m.BookDemoPage })) },
      { path: '/privacy', lazy: () => import('@/features/marketing/PrivacyPage').then((m) => ({ Component: m.PrivacyPage })) },
      { path: '/terms', lazy: () => import('@/features/marketing/TermsPage').then((m) => ({ Component: m.TermsPage })) },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', lazy: () => import('@/features/auth/LoginPage').then((m) => ({ Component: m.LoginPage })) },
      { path: '/signup', lazy: () => import('@/features/auth/SignupPage').then((m) => ({ Component: m.SignupPage })) },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <OnboardingLayout />,
        children: [
          {
            path: '/onboarding',
            lazy: () => import('@/features/onboarding/OnboardingPage').then((m) => ({ Component: m.OnboardingPage })),
          },
        ],
      },
      {
        element: <RequireOnboarded />,
        children: [
          {
            element: <AppShellLayout />,
            children: [
              {
                path: '/dashboard',
                lazy: () => import('@/features/dashboard/OverviewPage').then((m) => ({ Component: m.OverviewPage })),
              },
              {
                path: '/builder',
                lazy: () => import('@/features/builder/BuilderLayout').then((m) => ({ Component: m.BuilderLayout })),
                children: [
                  {
                    index: true,
                    lazy: () => import('@/features/builder/GeneralTab').then((m) => ({ Component: m.GeneralTab })),
                  },
                  {
                    path: 'persona',
                    lazy: () => import('@/features/builder/PersonaToneTab').then((m) => ({ Component: m.PersonaToneTab })),
                  },
                  {
                    path: 'lanes',
                    lazy: () => import('@/features/builder/LaneConfigTab').then((m) => ({ Component: m.LaneConfigTab })),
                  },
                  {
                    path: 'fallback',
                    lazy: () => import('@/features/builder/FallbackBehaviorTab').then((m) => ({ Component: m.FallbackBehaviorTab })),
                  },
                ],
              },
              {
                path: '/knowledge-base',
                lazy: () => import('@/features/knowledge-base/KnowledgeBasePage').then((m) => ({ Component: m.KnowledgeBasePage })),
              },
              {
                path: '/inbox',
                lazy: () => import('@/features/inbox/InboxPage').then((m) => ({ Component: m.InboxPage })),
              },
              {
                path: '/analytics',
                lazy: () => import('@/features/analytics/AnalyticsPage').then((m) => ({ Component: m.AnalyticsPage })),
              },
              {
                path: '/customize',
                lazy: () => import('@/features/customize/CustomizePage').then((m) => ({ Component: m.CustomizePage })),
              },
              {
                path: '/integrations',
                lazy: () => import('@/features/integrations/IntegrationsPage').then((m) => ({ Component: m.IntegrationsPage })),
              },
              {
                path: '/billing',
                lazy: () => import('@/features/billing/BillingPage').then((m) => ({ Component: m.BillingPage })),
              },
              {
                path: '/settings',
                lazy: () => import('@/features/settings/SettingsLayout').then((m) => ({ Component: m.SettingsLayout })),
                children: [
                  {
                    index: true,
                    lazy: () => import('@/features/settings/GuardrailsTab').then((m) => ({ Component: m.GuardrailsTab })),
                  },
                  {
                    path: 'data-privacy',
                    lazy: () => import('@/features/settings/DataPrivacyTab').then((m) => ({ Component: m.DataPrivacyTab })),
                  },
                  {
                    path: 'api-keys',
                    lazy: () => import('@/features/settings/ApiKeysTab').then((m) => ({ Component: m.ApiKeysTab })),
                  },
                  {
                    path: 'danger-zone',
                    lazy: () => import('@/features/settings/DangerZoneTab').then((m) => ({ Component: m.DangerZoneTab })),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', lazy: () => import('@/features/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })) },
])
