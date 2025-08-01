import * as React from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchableColumns?: string[]
  searchPlaceholder?: string
  className?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchableColumns = [],
  searchPlaceholder = "Search...",
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data

    return data.filter((item) =>
      searchableColumns.some((column) => {
        const value = item[column]
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, searchableColumns])

  return (
    <div className={cn("space-y-4", className)}>
      {searchableColumns.length > 0 && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      )}
      
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "p-4 align-middle",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? "No results found." : "No data available."}
          </div>
        )}
      </div>
    </div>
  )
}