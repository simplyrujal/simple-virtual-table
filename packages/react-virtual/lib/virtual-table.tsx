import React from "react";

export interface VirtualTableProps {
  name?: string;
}

export const VirtualTable: React.FC<VirtualTableProps> = ({
  name = "World",
}) => {
  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #646cff",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
        fontSize: "24px",
        color: "#213547",
      }}
    >
      Hey Table, {name}! 👋
    </div>
  );
};
