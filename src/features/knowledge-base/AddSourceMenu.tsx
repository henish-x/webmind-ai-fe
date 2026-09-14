import { ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/Modal'
import { sourceService } from '@/data/services'
import { toast } from '@/components/Toast'

export function AddSourceMenu({ botId, onAdded }: { botId: string; onAdded: () => void }) {
  const [modal, setModal] = useState<'url' | 'faq' | null>(null)
  const [value, setValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAddUrl() {
    if (!value.trim()) return
    await sourceService.addManualSource(botId, value, value)
    toast({ title: 'Source added', description: value, variant: 'success' })
    setModal(null)
    setValue('')
    onAdded()
  }

  async function handleAddFaq() {
    if (!value.trim()) return
    await sourceService.addManualSource(botId, value, null)
    toast({ title: 'FAQ source added', description: value, variant: 'success' })
    setModal(null)
    setValue('')
    onAdded()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await sourceService.addManualSource(botId, file.name, null)
    toast({ title: 'File uploaded', description: file.name, variant: 'success' })
    onAdded()
    e.target.value = ''
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Add source <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setModal('url')}>Crawl URL</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>Upload file</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setModal('faq')}>Add FAQ manually</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} accept=".pdf,.docx,.csv" />

      <Modal
        open={modal === 'url'}
        onOpenChange={(open) => !open && setModal(null)}
        title="Crawl a URL"
        description="We'll index this page and add it to your knowledge base."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddUrl}>Add source</Button>
          </>
        }
      >
        <Label htmlFor="add-url">Page URL</Label>
        <Input id="add-url" className="mt-1.5" placeholder="https://yoursite.com/page" value={value} onChange={(e) => setValue(e.target.value)} />
      </Modal>

      <Modal
        open={modal === 'faq'}
        onOpenChange={(open) => !open && setModal(null)}
        title="Add an FAQ entry"
        description="Give it a name — you can add the question and answer content after."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddFaq}>Add source</Button>
          </>
        }
      >
        <Label htmlFor="add-faq">Name</Label>
        <Input id="add-faq" className="mt-1.5" placeholder="Shipping FAQ" value={value} onChange={(e) => setValue(e.target.value)} />
      </Modal>
    </>
  )
}
