'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<T> {
  columns: {
    accessorKey: string;
    header: string;
    cell?: (params: any) => React.ReactNode;
  }[];
  data: T[];
  loading: boolean;
  emptyMessage: string;
  rowClassName?: (row: T) => string; // ✅ nueva prop
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyMessage,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={index}
                className={rowClassName ? rowClassName(item) : ''}
              >
                {columns.map((column) => (
                  <TableCell key={`${index}-${column.accessorKey}`}>
                    {column.cell
                      ? column.cell({ row: { original: item } })
                      : (item as any)[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
