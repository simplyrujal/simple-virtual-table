import type { Snippet } from "svelte";

export interface ColumnDef<T = any> {
  accessorKey?: keyof T | string;
  header: string;
  cell?: (info: {
    getValue: () => any;
    row: T;
    column: ColumnDef<T>;
  }) => Snippet | string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface VirtualTableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  rowHeight?: number;
  headerHeight?: number;
  height?: number;
  width?: number;
  overscan?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: any, index: number) => string);
  onRowClick?: (row: any, index: number) => void;
}
