import { useState } from "react";
import Select from "react-select";

interface selectOptionProps {
  loadFunction: (inputValue?: string) => Promise<any>;
  value: any;
  displayValue: string;
  onChange: (option: any) => void;
  placeholder: string;
  isClearable: boolean;
  styles?: any;
}

const defaultStyles = {
  control: (base: any) => ({
    ...base,
    width: "100%",
    border: "1px solid rgb(var(--border))",
    borderRadius: "8px",
    background: "rgb(var(--surface))",
    boxShadow: "none",
    minHeight: "32px",
    fontSize: "12px",
    cursor: "pointer",
    color: "rgb(var(--text))",
    "&:hover": {
      borderColor: "rgb(var(--brand-light))",
    },
  }),
  menu: (base: any) => ({
    ...base,
    background: "rgb(var(--surface))",
    border: "1px solid rgb(var(--border))",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  }),
  menuList: (base: any) => ({
    ...base,
    background: "rgb(var(--surface))",
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: "12px",
    background: state.isSelected
      ? "rgb(var(--brand-soft))"
      : state.isFocused
        ? "rgb(var(--brand-soft))"
        : "transparent",
    color: state.isSelected ? "rgb(var(--brand))" : "rgb(var(--text))",
    "&:hover": {
      background: "rgb(var(--brand-soft))",
      color: "rgb(var(--brand))",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "rgb(var(--text))",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "rgb(var(--muted))",
    fontSize: "12px",
  }),
  input: (base: any) => ({
    ...base,
    color: "rgb(var(--text))",
  }),
};

export default function SelectOptions({
  loadFunction,
  value,
  displayValue,
  onChange,
  placeholder,
  isClearable,
  styles = {},
}: selectOptionProps) {
  const [options, setOptions] = useState<any[]>([]);
  const onMenuOpen = async () => {
    const loadedOptions = await loadFunction();
    setOptions(loadedOptions);
  };

  const mergedStyles = { ...defaultStyles, ...styles };
  return (
    <Select
      options={options}
      onMenuOpen={onMenuOpen}
      value={
        value
          ? {
              value: value,
              label: displayValue,
            }
          : null
      }
      onChange={onChange}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={mergedStyles}
    />
  );
}
