import type { ChangeEvent } from "react";

type TextFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function TextField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
}: TextFieldProps) {
  return (
    <div className="flex flex-col space-y-1 m-2 flex-1 min-w-0">
      <label
        htmlFor={name}
        className="font-poppins font-semibold text-gray-400"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={name === "password" ? "new-password" : name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`border rounded-sm h-12 p-2 ${
          error ? "border-red-500" : "border-gray-400"
        }`}
      />
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
