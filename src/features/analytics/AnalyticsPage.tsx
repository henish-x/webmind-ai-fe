import { useState } from 'react'
import type { DateRangeDays } from '@/data/services/analyticsService'
import { RangeToggle } from '@/features/dashboard/RangeToggle'
import { PageContainer } from '@/shell/PageContainer'
import { useBotStore } from '@/state/useBotStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CombinedView } from './CombinedView'
import { SalesView } from './SalesView'
import { SupportView } from './SupportView'

export function AnalyticsPage() {
  const currentBotId = useBotStore((s) => s.currentBotId)
  const [range, setRange] = useState<DateRangeDays>(30)

  if (!currentBotId) return null

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-page-title font-medium text-ink-primary">Analytics</p>
        <RangeToggle value={range} onChange={setRange} />
      </div>

      <Tabs defaultValue="support">
        <TabsList>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="combined">Combined</TabsTrigger>
        </TabsList>
        <TabsContent value="support">
          <SupportView botId={currentBotId} range={range} />
        </TabsContent>
        <TabsContent value="sales">
          <SalesView botId={currentBotId} range={range} />
        </TabsContent>
        <TabsContent value="combined">
          <CombinedView botId={currentBotId} range={range} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
