import React, { createContext, useContext } from "react";
import { useTbodyContext } from "./tbody";

interface TrContextValue {
  columnCount: number;
  columnWidths: number[];
  // Context exists to ensure Th is wrapped in Thead
  // The colIndex is injected via props by React.cloneElement
}

const TrContext = createContext<TrContextValue | null>(null);

export const useTheadContext = (): TrContextValue => {
  const context = useContext(TrContext);
  if (!context) {
    throw new Error("Th component must be used inside Thead component");
  }
  return context;
};

interface TrProps extends React.HTMLAttributes<HTMLDivElement> {
  rowIndex?: number; // This prop is automatically injected by Tbody via React.cloneElement
}

const Tr = ({ children, style, rowIndex, ...props }: TrProps) => {
  // Ensure Tr is used within Tbody context - throws error if not wrapped
  const { contentWidth, rowHeight, columnCount, columnWidths } =
    useTbodyContext();

  // rowIndex is injected by Tbody component via React.cloneElement as absolute index
  // If it's missing, that's an error condition
  if (rowIndex === undefined) {
    throw new Error(
      "Tr component must receive rowIndex prop. Make sure it's used inside Tbody component."
    );
  }

  const contextValue: TrContextValue = {
    columnCount,
    columnWidths,
  };

  return (
    <TrContext.Provider value={contextValue}>
      <div
        style={{
          display: "flex",
          width: contentWidth,
          height: rowHeight,
          ...style,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#fafafa",
          transition: "background-color 0.2s",
          boxSizing: "border-box",
        }}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { colIndex: index } as any);
          }
          return child;
        })}
      </div>
    </TrContext.Provider>
  );
};

export default Tr;
