import React from "react";
import { useTableContext } from "./table";
import { useTbodyContext } from "./tbody";

interface TrProps extends React.HTMLAttributes<HTMLDivElement> {
  rowIndex?: number; // This prop is automatically injected by Tbody via React.cloneElement
}

const Tr = ({ children, style, rowIndex, ...props }: TrProps) => {
  // Ensure Tr is used within Tbody context - throws error if not wrapped
  useTbodyContext();
  const { totalWidth, rowHeight, needsFill, spacerWidth } = useTableContext();

  // rowIndex is injected by Tbody component via React.cloneElement as absolute index
  // If it's missing, that's an error condition
  if (rowIndex === undefined) {
    throw new Error(
      "Tr component must receive rowIndex prop. Make sure it's used inside Tbody component."
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: rowHeight,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#fafafa",
        transition: "background-color 0.2s",
        width: totalWidth,
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { colIndex: index } as any);
        }
        return child;
      })}
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
};

export default Tr;
