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

export interface TableContextValue {
  totalData: number;
  rowHeight?: number;
  height?: number;
  scrollTop: number;
  contentWidth: number;
  columnWidths: number[];
  overscan: number;
  startIndex: number;
  endIndex: number;
  setColumnWidths: (widths: number[]) => void; // Function to update column widths from Thead
  columnCount: number; // Number of columns (for border calculations)
}

const TableContext = createContext<TableContextValue | null>(null);

export const useTableContext = (): TableContextValue => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used within a Table provider");
  }
  return context as TableContextValue;
};

export interface TableProps {
  totalData: number;
  rowHeight?: number;
  height?: number;
  containerStyle?: Omit<
    React.CSSProperties,
    "width" | "height" | "position" | "overflow"
  >;
  overscan?: number;
  children: ReactNode;
  containerClassName?: string;
}

const Table = ({
  totalData,
  rowHeight = 40,
  children,
  height = 200,
  overscan = 5,
  containerStyle,
  containerClassName,
}: TableProps) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Calculate total content width (sum of all column widths)
  const contentWidth = useMemo(() => {
    return columnWidths.reduce((sum, w) => sum + w, 0);
  }, [columnWidths]);

  const { startIndex, endIndex } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.ceil((scrollTop + height) / rowHeight);
    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(totalData, visibleEnd + overscan);

    return { startIndex, endIndex };
  }, [scrollTop, height, rowHeight, totalData, overscan]);

  // Update container width based on content width comparison
  useEffect(() => {
    const updateWidth = () => {
      if (scrollElementRef.current && contentWidth > 0) {
        // Get the container's current width (which is 100% initially)
        // We need to get the parent's width or the actual rendered width
        const container = scrollElementRef.current;
        // Temporarily ensure width is 100% to get accurate measurement
        container.style.width = "100%";
        // Use requestAnimationFrame to ensure layout has updated
        requestAnimationFrame(() => {
          if (scrollElementRef.current) {
            const containerWidth = scrollElementRef.current.clientWidth;
            if (contentWidth > containerWidth) {
              scrollElementRef.current.style.width = "100%";
            } else {
              scrollElementRef.current.style.width = "fit-content";
            }
          }
        });
      }
    };

    updateWidth();

    // Handle window resize
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [contentWidth]);

  const contextValue: TableContextValue = {
    totalData,
    rowHeight,
    scrollTop,
    contentWidth,
    columnWidths,
    overscan,
    startIndex,
    endIndex,
    setColumnWidths,
    columnCount: columnWidths.length,
  };

  return (
    <TableContext.Provider value={contextValue as TableContextValue}>
      <div
        style={{
          height,
          width: "100%",
          overflow: "auto",
          position: "relative",
          ...containerStyle,
          border: "1px solid",
          borderRadius: "4px",
        }}
        {...(containerClassName && { className: containerClassName })}
        ref={scrollElementRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

export default Table;
