import React from "react";
import { useTrContext } from "./tr";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  colIndex?: number; // This prop is automatically injected by Tr via React.cloneElement
}

const Td = ({ children, style, colIndex, ...props }: IProps) => {
  const { columnWidths, columnCount } = useTrContext();

  const width = columnWidths[colIndex] ?? 100;

  return (
    <div
      style={{
        width,
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
