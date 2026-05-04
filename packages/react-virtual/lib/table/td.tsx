import React from "react";
import { useTrContext } from "./tr";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  colIndex?: number; // This prop is automatically injected by Tr via React.cloneElement
  colSpan?: number;
  rowSpan?: number;
}

const Td = ({
  children,
  style,
  colIndex,
  colSpan = 1,
  rowSpan = 1,
  ...props
}: IProps) => {
  const { columnWidths, columnCount, rowHeight } = useTrContext();

  const effectiveColIndex = colIndex ?? 0;
  const width = columnWidths
    .slice(effectiveColIndex, effectiveColIndex + colSpan)
    .reduce((sum, w) => sum + w, 0);

  return (
    <div
      style={{
        width,
        minWidth: 100,
        height: rowHeight * rowSpan,
        padding: "8px 16px",
        fontSize: "14px",
        borderRight:
          columnCount > 0 && effectiveColIndex + colSpan - 1 < columnCount - 1
            ? "1px solid #e0e0e0"
            : "none",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textWrap: "initial",
        flexShrink: 0,
        flexGrow: 0,
        boxSizing: "border-box",
        backgroundColor: "inherit",
        zIndex: rowSpan > 1 ? 1 : "auto",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Td;
