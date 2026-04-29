import { useState } from "react";
import { ZodType } from "zod";

export function useForm<T>(initialValues: T, schema?: ZodType) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: string; extraFields?: Record<string, string> },
    isSelect = false,
  ) => {
    if (isSelect) {
      const { name, value, extraFields } = e as {
        name: string;
        value: string;
        extraFields?: Record<string, string>;
      };
      setFormData((prev) => ({ ...prev, [name]: value, ...extraFields }));
    } else {
      const { target } = e as React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement
      >;
      setFormData((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  const validate = (): boolean => {
    if (!schema) {
      return true;
    }

    const result = schema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof T;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      console.log(fieldErrors);
      setErrors(fieldErrors);
      return false;
    }
  };
  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return { formData, setFormData, handleChange, resetForm, validate, errors };
}
