import React from "react";

interface SubmitButtonProps {
  text?: string;
  disabled?: boolean;
  variant?: "gray" | "blue" | "gray_blue" | "light_blue";
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text = "Submit", disabled = false, variant = "gray", onClick }) => {
  const variantClasses = {
    gray: {
      enabled: "bg-gray-100 hover:bg-gray-200 text-[#2C3287] border ",
      disabled: "bg-gray-500 text-gray-800 cursor-not-allowed border",
    },
    blue: {
      enabled: "bg-[#1F76E4] hover:bg-[#1F76E4]/90 text-white border ",
      disabled: "bg-[#D9D9D9] text-white cursor-not-allowed border ",
    },
    gray_blue: {
      enabled: "bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-[#0061A2] border font-medium ",
      disabled: "bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 text-[#0061A2] border font-medium ",
    },
    light_blue: {
      enabled: "bg-[#B0CFF5] hover:bg-[#B0CFF5]/90 text-[#13120F]  font-medium text-sm ",
      disabled: "bg-[#B0CFF5] hover:bg-[#B0CFF5]/90 text-[#13120F]  font-medium text-sm ",
    },
  };

  const buttonClass = disabled ? variantClasses[variant].disabled : variantClasses[variant].enabled;

  return (
    <button type="submit" disabled={disabled} onClick={onClick} className={`w-full p-3 rounded font-bold transition-all ${buttonClass}`}>
      {text}
    </button>
  );
};

export default SubmitButton;
