import { Outlet } from 'react-router-dom'
import { SubNavLayout } from '@/components/SubNavLayout'
import { PageContainer } from '@/shell/PageContainer'

const ITEMS = [
  { label: 'Guardrails', to: '/settings' },
  { label: 'Data & Privacy', to: '/settings/data-privacy' },
  { label: 'API keys', to: '/settings/api-keys' },
  { label: 'Danger zone', to: '/settings/danger-zone' },
]

export function SettingsLayout() {
  return (
    <PageContainer>
      <SubNavLayout title="Settings" items={ITEMS}>
        <Outlet />
      </SubNavLayout>
    </PageContainer>
  )
}
