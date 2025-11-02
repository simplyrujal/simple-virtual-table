import React, { createContext, useContext, useLayoutEffect } from "react";
import { useTableContext } from "./table";

interface TheadContextValue {
  // Context exists to ensure Th is wrapped in Thead
  // The colIndex is injected via props by React.cloneElement
}

const TheadContext = createContext<TheadContextValue | null>(null);

export const useTheadContext = (): TheadContextValue => {
  const context = useContext(TheadContext);
  if (!context) {
    throw new Error("Th component must be used inside Thead component");
  }
  return context;
};

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  headerHeight?: number;
}

const Thead = ({ children, style, headerHeight = 50, ...props }: IProps) => {
  const { totalWidth, needsFill, spacerWidth, setColumnWidths } =
    useTableContext();

  // Extract widths from Th children and update table context
  // The setColumnWidths function now handles change detection internally
  useLayoutEffect(() => {
    const widths: number[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const thProps = child.props as { width?: number };
        widths.push(thProps.width ?? 100);
      }
    });
    if (widths.length > 0) {
      setColumnWidths(widths);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, setColumnWidths]);

  const contextValue: TheadContextValue = {};

  return (
    <TheadContext.Provider value={contextValue}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          height: headerHeight,
          width: totalWidth,
          boxSizing: "border-box",
          ...style,
          backgroundColor: "#f5f5f5",
          borderBottom: "2px solid #ddd",
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
    </TheadContext.Provider>
  );
};

export default Thead;
