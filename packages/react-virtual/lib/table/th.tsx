import React from "react";
import { useTheadContext } from "./thead";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  colIndex?: number; // This prop is automatically injected by Thead via React.cloneElement
  width?: number; // Column width (default: 100)
}

const Th = ({ children, style, colIndex, width = 100, ...props }: IProps) => {
  // Ensure Th is used within Thead context - throws error if not wrapped
  const { columnCount } = useTheadContext();

  // colIndex is injected by Thead component via React.cloneElement
  const effectiveColIndex = colIndex ?? 0;

  return (
    <div
      style={{
        width,
        borderRight:
          columnCount > 0 && effectiveColIndex < columnCount - 1
            ? "1px solid #e0e0e0"
            : "none",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
        flexShrink: 0,
        flexGrow: 0,
        boxSizing: "border-box",
        ...style,
        textAlign: "left",
        padding: "8px 16px",
        fontWeight: "600",
        fontSize: "14px",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Th;
