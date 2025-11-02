import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ColumnDef } from "../virtual-table";

export interface TableContextValue<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  rowHeight?: number;
  headerHeight?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  width?: number;
  height?: number;
  scrollTop: number;
  containerWidth: number | null;
  contentWidth: number;
  totalWidth: number;
}

const TableContext = createContext<TableContextValue | null>(null);

export const useTableContext = <T = any,>(): TableContextValue<T> => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used within a Table provider");
  }
  return context as TableContextValue<T>;
};

export interface TableProps<T = any> extends TableContextValue<T> {
  children: ReactNode;
}

const Table = <T extends Record<string, any> = any>({
  columns,
  data,
  rowHeight = 40,
  headerHeight = 50,
  className = "",
  headerClassName = "",
  rowClassName = "",
  onRowClick,
  children,
  width,
  height,
}: TableProps<T>) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Measure container width when no explicit width is provided
  useEffect(() => {
    if (!width && scrollElementRef.current) {
      const updateWidth = () => {
        if (scrollElementRef.current) {
          const rect = scrollElementRef.current.getBoundingClientRect();
          setContainerWidth(rect.width);
        }
      };

      updateWidth();
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(scrollElementRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [width]);

  // Column widths
  const columnWidths = useMemo(() => {
    return columns.map((col) => col.width || 100);
  }, [columns]);

  // Calculate total content width (sum of all column widths)
  const contentWidth = useMemo(() => {
    return columnWidths.reduce((sum, w) => sum + w, 0);
  }, [columnWidths]);

  // Calculate if we need to fill container (when content is smaller)
  const needsFill = useMemo(() => {
    if (width) {
      const availableWidth = width - 2;
      return contentWidth < availableWidth;
    }
    if (containerWidth !== null) {
      const availableWidth = containerWidth - 2;
      return contentWidth < availableWidth;
    }
    return false;
  }, [contentWidth, width, containerWidth]);

  // Calculate spacer width (extra space to fill)
  // Only add spacer if there's significant space to fill (avoid sub-pixel issues)
  const spacerWidth = useMemo(() => {
    if (!needsFill) return 0;
    let calculatedSpacer = 0;
    if (width) {
      calculatedSpacer = width - 2 - contentWidth;
    } else if (containerWidth !== null) {
      calculatedSpacer = containerWidth - 2 - contentWidth;
    }
    // Only use spacer if there's at least 1px to fill (avoid rounding issues)
    return calculatedSpacer > 0.5 ? Math.ceil(calculatedSpacer) : 0;
  }, [needsFill, contentWidth, width, containerWidth]);

  // Calculate total width for table content
  // Include spacer width when we need to fill the container
  const totalWidth = useMemo(() => {
    if (needsFill && spacerWidth > 0) {
      return contentWidth + spacerWidth;
    }
    return contentWidth;
  }, [contentWidth, needsFill, spacerWidth]);

  const contextValue: TableContextValue<T> = {
    columns,
    data,
    rowHeight,
    headerHeight,
    width,
    containerWidth,
    className,
    headerClassName,
    rowClassName,
    onRowClick,
    scrollTop,
    contentWidth,
    totalWidth,
  };

  return (
    <TableContext value={contextValue as TableContextValue}>
      <div
        className={`virtual-table-container ${className}`}
        style={{
          width: width || "100%",
          height,
          //   overflowX: needsHorizontalScroll ? "auto" : "hidden",
          //   overflowY: "auto",
          overflow: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          position: "relative",
          boxSizing: "border-box",
        }}
        ref={scrollElementRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </TableContext>
  );
};

export default Table;
