import React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        disabled={disabled}
        value={value}
        className={cn(
          "form-input w-full",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  );
};

export default InputField;
