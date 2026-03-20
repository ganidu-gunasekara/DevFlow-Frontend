import { useState } from "react";
import Select from "react-select";

interface selectOptionProps {
  loadFunction: (inputValue?: string) => Promise<any>;
  value: any;
  displayValue: string;
  onChange: (option: any) => void;
  placeholder: string;
  isClearable: boolean;
}
export default function SelectOptions({
  loadFunction,
  value,
  displayValue,
  onChange,
  placeholder,
  isClearable,
}: selectOptionProps) {
  const [options, setOptions] = useState<any[]>([]);
  const onMenuOpen = async () => {
    const loadedOptions = await loadFunction();
    setOptions(loadedOptions);
  };
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
    />
  );
}
