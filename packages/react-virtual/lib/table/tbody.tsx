import React, { createContext, useContext, useMemo } from "react";
import { useTableStore } from "./table";

interface TbodyContextValue {
  contentWidth: number;
  rowHeight: number;
  columnWidths: number[];
  columnCount: number;
  // Context exists to ensure Tr is wrapped in Tbody
  // The rowIndex is injected via props by React.cloneElement
}

const TbodyContext = createContext<TbodyContextValue | null>(null);

export const useTbodyContext = (): TbodyContextValue => {
  const context = useContext(TbodyContext);
  if (!context) {
    throw new Error("Tr component must be used inside Tbody component");
  }
  return context;
};

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  offsetHeight?: number;
}

const Tbody = ({ children, style, ...props }: IProps) => {
  const rowHeight = useTableStore((s) => s.rowHeight);
  const totalData = useTableStore((s) => s.totalData);
  const startIndex = useTableStore((s) => s.startIndex);
  const endIndex = useTableStore((s) => s.endIndex);
  const contentWidth = useTableStore((s) => s.contentWidth);
  const columnWidths = useTableStore((s) => s.columnWidths);
  const columnCount = useTableStore((s) => s.columnCount);

  const totalHeight = totalData * rowHeight;

  const contextValue: TbodyContextValue = useMemo(
    () => ({
      contentWidth,
      rowHeight,
      columnWidths,
      columnCount,
    }),
    [contentWidth, rowHeight, columnWidths, columnCount]
  );

  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children]
  );

  const visibleChildren = useMemo(
    () => childrenArray.slice(startIndex, endIndex),
    [childrenArray, startIndex, endIndex]
  );

  return (
    <TbodyContext value={contextValue}>
      <div
        style={{
          position: "relative",
          height: totalHeight,
          width: contentWidth,
          boxSizing: "border-box",
          ...style,
        }}
        {...props}
      >
        <div style={{ height: startIndex * rowHeight }} />

        {visibleChildren.map((child, index) => {
          if (React.isValidElement(child)) {
            // Inject rowIndex as absolute index (startIndex + relative index in visibleChildren)
            return React.cloneElement(child, {
              rowIndex: startIndex + index,
            } as any);
          }
          return child;
        })}

        <div style={{ height: (totalData - endIndex) * rowHeight }} />
      </div>
    </TbodyContext>
  );
};

export default Tbody;
