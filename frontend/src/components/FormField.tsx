import React from "react";

interface FormFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, type = "text", name, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <input type={type} name={name} value={value} placeholder={label} onChange={onChange} className="border border-white/15 rounded-xl focus:ring-2 focus:ring-primary py-4 px-8 text-[#F4F6FC]/50" />
    </div>
  );
};

export default FormField;
