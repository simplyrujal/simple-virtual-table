import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import useCheckOverflow from "../hooks/use-check-overflow";

export interface TableContextValue {
  totalData: number;
  rowHeight?: number;
  height?: number;
  scrollTop: number;
  contentWidth: number;
  totalWidth: number;
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
  containerStyle?: React.CSSProperties;
  overscan?: number;
  children: ReactNode;
}

const Table = <T extends Record<string, any> = any>({
  totalData,
  rowHeight = 40,
  children,
  height = 100,
  overscan = 5,
  containerStyle,
}: TableProps) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  const { overflowY } = useCheckOverflow({ ref: scrollElementRef });

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

  const contextValue: TableContextValue = {
    totalData,
    rowHeight,
    scrollTop,
    contentWidth,
    columnWidths,
    overscan,
    startIndex,
    endIndex,
    setColumnWidths: stableSetColumnWidths,
    columnCount: columnWidths.length,
    totalWidth: contentWidth,
  };

  const widthAdjust = 3.8;
  const overflowWidth: number = overflowY ? -3 : -13;

  return (
    <TableContext.Provider value={contextValue as TableContextValue}>
      <div
        style={{
          height,
          width:
            contentWidth + columnWidths.length * widthAdjust + overflowWidth,
          overflow: "auto",
          border: "1px solid",
          borderRadius: "4px",
          position: "relative",
          ...containerStyle,
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
