import React, { useRef } from "react";
import { useTheadContext } from "./thead";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  colIndex?: number; // This prop is automatically injected by Thead via React.cloneElement
  width?: number; // Column width (default: 100)
}

const Th = ({ children, style, colIndex, width = 100, ...props }: IProps) => {
  // Ensure Th is used within Thead context - throws error if not wrapped
  const { columnCount, columnWidths } = useTheadContext();

  // colIndex is injected by Thead component via React.cloneElement
  const effectiveColIndex = colIndex ?? 0;

  const ref = useRef<HTMLDivElement>(null);

  const showRightBorder =
    columnCount > 0 && effectiveColIndex < columnCount - 1;

  return (
    <div
      ref={ref}
      style={{
        width: columnWidths[effectiveColIndex],
        borderRight: showRightBorder ? `1px solid #e0e0e0` : "none",
        display: "flex",
        alignItems: "center",
        userSelect: "none",
        flexShrink: 0,
        flexGrow: 0,
        boxSizing: "border-box",
        textAlign: "left",
        padding: "8px 16px",
        fontWeight: "600",
        fontSize: "14px",
        position: "relative",
        ...style,
      }}
      {...props}
    >
      {children}

      {/* 👇 Invisible hit zone for right border hover detection */}
      {/* {showRightBorder && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: -5,
            width: "10px", // hover zone width (adjust as needed)
            height: "100%",
            cursor: "col-resize", // show resize cursor
            zIndex: 10,
          }}
          
        />
      )} */}
    </div>
  );
};

export default Th;
