"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

interface MainTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  includeDelete?: boolean;
  includeEdit?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function MainTable<T>({
  columns,
  data,
  includeDelete,
  includeEdit,
  onEdit,
  onDelete,
}: MainTableProps<T>) {
  const enrichedColumns = columns.map((col) => {
    if ((col as any).accessorKey === "action") {
      return {
        ...col,
        cell: ({ row }: { row: any }) => (
          <div className="flex justify-center items-center gap-2">
            {includeEdit && (
              <button
                className="icon-btn text-brand"
                onClick={() => onEdit?.(row.original)}
              >
                <Pencil size={16} />
              </button>
            )}
            {includeDelete && (
              <button
                className="icon-btn text-red-500"
                onClick={() => onDelete?.(row.original)}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ),
      };
    }
    return col;
  });

  const table = useReactTable({
    data,
    columns: enrichedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full max-w-screen-2xl mx-auto">
      <thead className="w-full text-center">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="p-2 table-header rounded-t" key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="w-full text-center">
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td className="p-2 border border-gray-400" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
