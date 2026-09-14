import { Outlet } from 'react-router-dom'
import { SubNavLayout } from '@/components/SubNavLayout'
import { PageContainer } from '@/shell/PageContainer'

const ITEMS = [
  { label: 'General', to: '/builder' },
  { label: 'Persona & Tone', to: '/builder/persona' },
  { label: 'Lane Configuration', to: '/builder/lanes' },
  { label: 'Fallback Behavior', to: '/builder/fallback' },
]

export function BuilderLayout() {
  return (
    <PageContainer>
      <SubNavLayout title="Chatbot Builder" items={ITEMS}>
        <Outlet />
      </SubNavLayout>
    </PageContainer>
  )
}
