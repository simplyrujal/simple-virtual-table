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

export interface TableContextValue<T = any> {
  totalData: number;
  rowHeight?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  width?: number;
  height?: number;
  scrollTop: number;
  containerWidth: number | null;
  contentWidth: number;
  totalWidth: number;
  columnWidths: number[];
  needsFill: boolean;
  spacerWidth: number;
  overscan: number;
  startIndex: number;
  endIndex: number;
  setColumnWidths: (widths: number[]) => void; // Function to update column widths from Thead
  columnCount: number; // Number of columns (for border calculations)
}

const TableContext = createContext<TableContextValue | null>(null);

export const useTableContext = <T = any,>(): TableContextValue<T> => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used within a Table provider");
  }
  return context as TableContextValue<T>;
};

export interface TableProps<T = any> {
  totalData: number;
  rowHeight?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  width?: number;
  height?: number;
  overscan?: number;
  children: ReactNode;
}

const Table = <T extends Record<string, any> = any>({
  totalData,
  rowHeight = 40,
  className = "",
  headerClassName = "",
  rowClassName = "",
  children,
  width,
  height,
  overscan = 5,
}: TableProps<T>) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Stable setter function to prevent unnecessary re-renders
  const stableSetColumnWidths = useCallback((widths: number[]) => {
    setColumnWidths((prev) => {
      // Only update if widths actually changed
      if (
        prev.length !== widths.length ||
        prev.some((w, i) => w !== widths[i])
      ) {
        return widths;
      }
      return prev;
    });
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

  const { startIndex, endIndex } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.ceil((scrollTop + height) / rowHeight);
    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(totalData, visibleEnd + overscan);

    return { startIndex, endIndex };
  }, [scrollTop, height, rowHeight, totalData, overscan]);

  const contextValue: TableContextValue<T> = {
    totalData,
    rowHeight,
    width,
    containerWidth,
    headerClassName,
    rowClassName,
    scrollTop,
    contentWidth,
    totalWidth,
    columnWidths,
    needsFill,
    spacerWidth,
    overscan,
    startIndex,
    endIndex,
    setColumnWidths: stableSetColumnWidths,
    columnCount: columnWidths.length,
  };

  return (
    <TableContext.Provider value={contextValue as TableContextValue}>
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
    </TableContext.Provider>
  );
};

export default Table;
