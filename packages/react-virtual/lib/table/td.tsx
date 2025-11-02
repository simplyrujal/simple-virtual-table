import React from "react";
import { useTableContext } from "./table";

interface TdProps extends React.HTMLAttributes<HTMLDivElement> {
  colIndex?: number; // This prop is automatically injected by Tr via React.cloneElement
}

const Td = ({ children, style, colIndex, ...props }: TdProps) => {
  const { columnWidths, columnCount } = useTableContext();

  // colIndex is injected by Tr component via React.cloneElement
  // If it's missing, that's an error condition
  if (colIndex === undefined) {
    throw new Error(
      "Td component must receive colIndex prop. Make sure it's used inside Tr component."
    );
  }

  const width = columnWidths[colIndex] ?? 100;

  return (
    <div
      style={{
        width: width,
        minWidth: 100,
        padding: "8px 16px",
        fontSize: "14px",
        borderRight:
          columnCount > 0 && colIndex < columnCount - 1
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
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Td;
