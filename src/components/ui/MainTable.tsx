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
          <div className="flex justify-center items-center gap-1">
            {includeEdit && (
              <button
                className="icon-btn text-brand"
                onClick={() => onEdit?.(row.original)}
                title="Edit"
              >
                <Pencil size={14} />
              </button>
            )}
            {includeDelete && (
              <button
                className="icon-btn text-red-500"
                onClick={() => onDelete?.(row.original)}
                title="Delete"
              >
                <Trash2 size={14} />
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
    <div className="w-full rounded-[var(--radius)] overflow-hidden border border-border">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="table-header p-3 text-center"
                  key={header.id}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              className={`table-row ${idx % 2 === 0 ? "bg-surface" : "bg-surface-2"}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="table-cell text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
