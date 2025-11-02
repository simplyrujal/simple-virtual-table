import React from "react";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  totalHeight: number;
  totalWidth: number;
}
const Tbody = ({
  children,
  totalHeight,
  totalWidth,
  style,
  ...props
}: IProps) => {
  return (
    <div
      style={{
        position: "relative",
        height: totalHeight,
        width: totalWidth,
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tbody;
