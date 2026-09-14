import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { cn, focusRing } from '@/lib/utils'
import { FAQ_ITEMS } from '../data/faqContent'
import { SECTION_PADDING } from './sectionSpacing'

export function Faq() {
  return (
    <section className={cn('bg-surface-page', SECTION_PADDING)}>
      <div className="mx-auto max-w-[760px] px-6 md:px-10">
        <h2 className="text-center font-serif text-[28px] font-medium leading-[1.2] text-ink-primary md:text-[36px]">
          Questions, answered honestly
        </h2>

        <AccordionPrimitive.Root type="single" collapsible className="mt-10 divide-y divide-hairline border-t border-hairline">
          {FAQ_ITEMS.map((item) => (
            <AccordionPrimitive.Item key={item.question} value={item.question}>
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className={cn(
                    'group flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-medium text-ink-primary',
                    focusRing,
                  )}
                >
                  {item.question}
                  <Plus className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-data-[state=open]:rotate-45" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden text-[15px] leading-[1.65] text-ink-secondary data-[state=open]:pb-5 data-[state=open]:animate-fade">
                {item.answer}
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  )
}
