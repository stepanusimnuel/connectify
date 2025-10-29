// src/components/ConnectifyText.tsx
import React from "react";

interface ConnectifyTextProps {
  className?: string;
}

const ConnectifyText: React.FC<ConnectifyTextProps> = ({ className }) => {
  return <span className={`tracking-wide text-[#01367B] select-none ${className}`}>CONNECTIFY</span>;
};

export default ConnectifyText;
