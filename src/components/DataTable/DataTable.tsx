import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown, MoreHorizontal } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, focusRing } from '@/lib/utils'

export interface RowAction<T> {
  label: string
  onSelect: (row: T) => void
  variant?: 'default' | 'destructive'
}

export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  loading?: boolean
  emptyState?: ReactNode
  rowActions?: (row: T) => RowAction<T>[]
  onRowClick?: (row: T) => void
  getRowId?: (row: T) => string
  skeletonRows?: number
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyState,
  rowActions,
  onRowClick,
  getRowId,
  skeletonRows = 6,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId,
  })

  const colSpan = columns.length + (rowActions ? 1 : 0)

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-surface-card">
      <table className="w-full border-collapse text-body">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-hairline">
              {headerGroup.headers.map((header) => {
                const sortable = header.column.getCanSort()
                const sortDirection = header.column.getIsSorted()
                return (
                  <th key={header.id} className="px-4 py-2.5 text-left text-meta font-medium text-ink-secondary">
                    {header.isPlaceholder ? null : sortable ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn('inline-flex items-center gap-1 rounded', focusRing)}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDirection === 'asc' && <ChevronUp className="h-3.5 w-3.5" />}
                        {sortDirection === 'desc' && <ChevronDown className="h-3.5 w-3.5" />}
                        {!sortDirection && <ChevronsUpDown className="h-3.5 w-3.5 text-ink-muted" />}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                )
              })}
              {rowActions && <th className="w-10 px-4 py-2.5" aria-hidden />}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-hairline last:border-0">
                {columns.map((_col, ci) => (
                  <td key={ci} className="px-4 py-3">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-surface-sunken" />
                  </td>
                ))}
                {rowActions && <td className="px-4 py-3" />}
              </tr>
            ))}

          {!loading && data.length === 0 && emptyState && (
            <tr>
              <td colSpan={colSpan}>{emptyState}</td>
            </tr>
          )}

          {!loading &&
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(
                  'border-b border-hairline last:border-0',
                  onRowClick && 'cursor-pointer hover:bg-surface-sunken',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-ink-primary">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {rowActions && (
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn('rounded-md p-1.5 text-ink-muted hover:bg-surface-sunken hover:text-ink-primary', focusRing)}
                        aria-label="Row actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {rowActions(row.original).map((action) => (
                          <DropdownMenuItem
                            key={action.label}
                            variant={action.variant}
                            onSelect={() => action.onSelect(row.original)}
                          >
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
