import { Download } from 'lucide-react'
import { Button } from '@/components/Button'
import { exportToCsv } from '@/lib/csv'

export function ExportCsvButton({
  filename,
  headers,
  rows,
}: {
  filename: string
  headers: string[]
  rows: (string | number)[][]
}) {
  return (
    <Button variant="ghost" size="sm" onClick={() => exportToCsv(filename, headers, rows)}>
      <Download className="h-3.5 w-3.5" /> Export CSV
    </Button>
  )
}
