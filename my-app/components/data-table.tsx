import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps {
  columns: { key: string; label: string }[]
  data: Record<string, any>[]
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-neutral-50 border-b border-border">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className="text-neutral-900 font-semibold py-3 px-4">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-neutral-50 border-b border-border">
              {columns.map((col) => (
                <TableCell key={col.key} className="py-3 px-4 text-neutral-700">
                  {row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
