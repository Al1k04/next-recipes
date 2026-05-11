export interface FormData {
  name: string;
  category: string;
  unit: string;
  pricePerUnit: string;
  description: string;
}

export interface FormErrors {
  name?: string;
  category?: string;
  unit?: string;
  pricePerUnit?: string;
  description?: string;
}

export const validateField = (
  field: keyof FormData,
  value: string,
): string | undefined => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return undefined;

    case "category":
      if (!value) return "Please select a category";
      return undefined;

    case "unit":
      if (!value) return "Please select a unit";
      return undefined;

    case "pricePerUnit":
      if (value && isNaN(Number(value))) return "Price must be a valid number";
      if (value && Number(value) < 0) return "Price cannot be negative";
      return undefined;

    case "description":
      if (value.length > 100) return "Description must be under 200 characters";
      return undefined;

    default:
      return undefined;
  }
};

export const validateAll = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) errors[field] = error;
  });
  return errors;
};
