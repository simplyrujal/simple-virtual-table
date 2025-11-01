import React from "react";

export interface HelloWorldProps {
  name?: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ name = "World" }) => {
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
      Hey Hello, {name}! 👋
    </div>
  );
};
