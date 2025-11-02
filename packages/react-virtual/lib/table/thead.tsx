import React from "react";
import { useTableContext } from "./table";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  headerHeight?: number;
}

const Thead = ({ children, style, headerHeight = 50, ...props }: IProps) => {
  const { totalWidth } = useTableContext();
  return (
    <div
      style={{
        ...style,
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        backgroundColor: "#f5f5f5",
        borderBottom: "2px solid #ddd",
        height: headerHeight,
        width: totalWidth,
        boxSizing: "border-box",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Thead;
