import React, { useEffect, useMemo, useRef, useState } from "react";

export interface ColumnDef<T = any> {
  accessorKey?: keyof T | string;
  header: string;
  cell?: (info: {
    getValue: () => any;
    row: T;
    column: ColumnDef<T>;
  }) => React.ReactNode;
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
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
}

export function VirtualTable<T extends Record<string, any> = any>({
  columns,
  data,
  rowHeight = 40,
  headerHeight = 50,
  height = 600,
  width,
  overscan = 5,
  className = "",
  headerClassName = "",
  rowClassName = "",
  onRowClick,
}: VirtualTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Column widths
  const columnWidths = useMemo(() => {
    return columns.map((col) => col.width || 100);
  }, [columns]);

  // Calculate total content width (sum of all column widths)
  const contentWidth = useMemo(() => {
    return columnWidths.reduce((sum, w) => sum + w, 0);
  }, [columnWidths]);

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

  // Calculate visible range
  const { startIndex, endIndex, totalHeight } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.ceil((scrollTop + height) / rowHeight);
    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(data.length, visibleEnd + overscan);
    const totalHeight = data.length * rowHeight;

    return { startIndex, endIndex, totalHeight };
  }, [scrollTop, height, rowHeight, data.length, overscan]);

  // Visible rows
  const visibleRows = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Get cell value
  const getCellValue = (row: T, column: ColumnDef<T>): any => {
    if (column.accessorKey) {
      const key = column.accessorKey as keyof T;
      return row[key];
    }
    return null;
  };

  // Get row class name
  const getRowClassName = (row: T, index: number): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }
    return rowClassName || "";
  };

  // Determine if horizontal scroll is needed
  const needsHorizontalScroll = useMemo(() => {
    if (needsFill) return false; // If we're filling, no scroll needed
    if (width) {
      return contentWidth > width - 2;
    }
    if (containerWidth !== null) {
      return contentWidth > containerWidth - 2;
    }
    return true; // Default to allowing scroll until measured
  }, [needsFill, contentWidth, width, containerWidth]);

  return (
    <div
      className={`virtual-table-container ${className}`}
      style={{
        width: width || "100%",
        height,
        overflowX: needsHorizontalScroll ? "auto" : "hidden",
        overflowY: "auto",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        position: "relative",
        boxSizing: "border-box",
      }}
      ref={scrollElementRef}
      onScroll={handleScroll}
    >
      {/* Fixed Header */}
      <div
        className={`virtual-table-header ${headerClassName}`}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          backgroundColor: "#f5f5f5",
          borderBottom: "2px solid #ddd",
          height: headerHeight,
          width: totalWidth,
          boxSizing: "border-box",
        }}
      >
        {columns.map((column, colIndex) => (
          <div
            key={column.accessorKey as string}
            style={{
              width: columnWidths[colIndex],
              minWidth: column.minWidth || 100,
              maxWidth: column.maxWidth,
              padding: "8px 16px",
              fontWeight: "600",
              fontSize: "14px",
              borderRight:
                colIndex < columns.length - 1 ? "1px solid #e0e0e0" : "none",
              display: "flex",
              alignItems: "center",
              textAlign: "left",
              userSelect: "none",
              flexShrink: 0,
              flexGrow: 0,
              boxSizing: "border-box",
            }}
          >
            {column.header}
          </div>
        ))}
        {/* Spacer to fill remaining space when content is smaller than container */}
        {needsFill && spacerWidth > 0 && (
          <div
            style={{
              width: spacerWidth,
              minWidth: spacerWidth,
              maxWidth: spacerWidth,
              flexShrink: 0,
              flexGrow: 0,
            }}
          />
        )}
      </div>

      {/* Virtualized Body */}
      <div
        style={{
          position: "relative",
          height: totalHeight,
          width: totalWidth,
          boxSizing: "border-box",
        }}
      >
        {/* Spacer before visible rows */}
        <div style={{ height: startIndex * rowHeight }} />

        {/* Visible rows */}
        {visibleRows.map((row, relativeIndex) => {
          const absoluteIndex = startIndex + relativeIndex;
          return (
            <div
              key={absoluteIndex}
              className={`virtual-table-row ${getRowClassName(
                row,
                absoluteIndex
              )}`}
              onClick={() => onRowClick?.(row, absoluteIndex)}
              style={{
                display: "flex",
                height: rowHeight,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor:
                  absoluteIndex % 2 === 0 ? "#ffffff" : "#fafafa",
                cursor: onRowClick ? "pointer" : "default",
                transition: "background-color 0.2s",
                width: totalWidth,
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  absoluteIndex % 2 === 0 ? "#ffffff" : "#fafafa";
              }}
            >
              {columns.map((column, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    width: columnWidths[colIndex],
                    minWidth: column.minWidth || 100,
                    maxWidth: column.maxWidth,
                    padding: "8px 16px",
                    fontSize: "14px",
                    borderRight:
                      colIndex < columns.length - 1
                        ? "1px solid #e0e0e0"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    flexGrow: 0,
                    boxSizing: "border-box",
                  }}
                >
                  {column.cell ? (
                    column.cell({
                      getValue: () => getCellValue(row, column),
                      row,
                      column,
                    })
                  ) : (
                    <span>{getCellValue(row, column)?.toString() || ""}</span>
                  )}
                </div>
              ))}
              {/* Spacer to fill remaining space when content is smaller than container */}
              {needsFill && spacerWidth > 0 && (
                <div
                  style={{
                    width: spacerWidth,
                    minWidth: spacerWidth,
                    maxWidth: spacerWidth,
                    flexShrink: 0,
                    flexGrow: 0,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Spacer after visible rows */}
        <div style={{ height: (data.length - endIndex) * rowHeight }} />
      </div>
    </div>
  );
}
