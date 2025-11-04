import React, { createContext, useContext } from "react";
import { useTableContext } from "./table";

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

const Tbody = ({ children, offsetHeight = 45, style, ...props }: IProps) => {
  const {
    rowHeight,
    totalData,
    startIndex,
    endIndex,
    contentWidth,
    columnWidths,
    columnCount,
  } = useTableContext();

  const totalHeight = totalData * offsetHeight;

  const contextValue: TbodyContextValue = {
    contentWidth,
    rowHeight,
    columnWidths,
    columnCount,
  };

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

        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // Inject rowIndex as absolute index (startIndex + relative index in children)
            return React.cloneElement(child, {
              rowIndex: startIndex + index,
            } as any);
          }
          return child;
        }).slice(startIndex, endIndex)}

        <div style={{ height: (totalData - endIndex) * rowHeight }} />
      </div>
    </TbodyContext>
  );
};

export default Tbody;
