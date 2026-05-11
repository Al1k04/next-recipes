"use client";

import { useState } from "react";
import {
  type FormData as IngredientFormData,
  FormErrors,
  validateAll,
  validateField,
} from "@/utils/ingredientForm.validation";
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";
import { ToastContainer, toast } from "react-toastify";
import { useIngredientStore } from "@/store/ingredient.store";

const IngredientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    pricePerUnit: "",
    description: "",
  });

  const { addIngredient } = useIngredientStore();
  const [isPending, setIsPending] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof IngredientFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateAll(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      pricePerUnit:
        formData.pricePerUnit === "" ? null : Number(formData.pricePerUnit),
    };

    setIsPending(true);
    try {
      await addIngredient(formData);
      const storeError = useIngredientStore.getState().error;
      if (storeError) {
        handleReset();
        toast.success("Ingredient added succeffully!");
      } else {
        console.log("Error:", storeError);
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
      pricePerUnit: "",
      description: "",
    });
    setErrors({});
  };

  const inputClass = (error?: string) =>
    `w-full rounded-md border px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors
    dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500
    ${
      error
        ? "border-red-400 focus:border-red-500 dark:border-red-500"
        : "border-neutral-200 focus:border-blue-900 dark:border-neutral-700 dark:focus:border-blue-500"
    }`;

  return (
    <div className="w-full max-w-[560px] mx-auto mt-8 rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950">
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Add ingredient
      </h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            placeholder="Enter ingredient name"
            className={inputClass(errors.name)}
            onChange={(e) => handleChange("name")(e.target.value)}
            onBlur={(e) =>
              setErrors((prev) => ({
                ...prev,
                name: validateField("name", e.target.value),
              }))
            }
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            className={inputClass(errors.category)}
            onChange={(e) => handleChange("category")(e.target.value)}
            onBlur={(e) =>
              setErrors((prev) => ({
                ...prev,
                category: validateField("category", e.target.value),
              }))
            }
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Unit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Unit <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.unit}
            className={inputClass(errors.unit)}
            onChange={(e) => handleChange("unit")(e.target.value)}
            onBlur={(e) =>
              setErrors((prev) => ({
                ...prev,
                unit: validateField("unit", e.target.value),
              }))
            }
          >
            <option value="">Select a unit</option>
            {UNIT_OPTIONS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
          {errors.unit && <p className="text-xs text-red-500">{errors.unit}</p>}
        </div>

        {/* Price per unit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Price per unit
            <span className="ml-1.5 text-xs font-normal text-neutral-400 dark:text-neutral-500">
              optional
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-neutral-500">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={formData.pricePerUnit}
              placeholder="0.00"
              className={`${inputClass(errors.pricePerUnit)} pl-7`}
              onChange={(e) => handleChange("pricePerUnit")(e.target.value)}
              onBlur={(e) =>
                setErrors((prev) => ({
                  ...prev,
                  pricePerUnit: validateField("pricePerUnit", e.target.value),
                }))
              }
            />
          </div>
          {errors.pricePerUnit ? (
            <p className="text-xs text-red-500">{errors.pricePerUnit}</p>
          ) : (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Leave empty if not applicable
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            placeholder="Describe the ingredient..."
            className={inputClass(errors.description)}
            onChange={(e) => handleChange("description")(e.target.value)}
            onBlur={(e) =>
              setErrors((prev) => ({
                ...prev,
                description: validateField("description", e.target.value),
              }))
            }
          />
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {formData.description.length}/200
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-60 dark:bg-blue-700"
          >
            {isPending && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
            )}
            {isPending ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default IngredientForm;
