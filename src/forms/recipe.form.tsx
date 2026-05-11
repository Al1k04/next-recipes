"use client";

import { useState, useTransition } from "react";
import { useIngredientStore } from "@/store/ingredient.store";
import { useRecipeStore } from "@/store/recipe.store";
import { IRecipe } from "@/types/recipe";
import { useRouter } from "next/navigation";

interface RecipeFormProps {
  initialRecipe?: IRecipe;
}

interface IIngredientField {
  id: number;
  ingredientId: string;
  quantity: number | null;
}

const initialState = {
  name: "",
  description: "",
  imageUrl: "",
};

const RecipeForm = ({ initialRecipe }: RecipeFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [quantityErrors, setQuantityErrors] = useState<
    Record<number, string | null>
  >({});

  const [formData, setFormData] = useState({
    name: initialRecipe?.name || initialState.name,
    description: initialRecipe?.description || initialState.description,
    imageUrl: initialRecipe?.imageUrl || initialState.imageUrl,
  });

  const [ingredientFields, setIngredientFields] = useState<IIngredientField[]>(
    initialRecipe?.ingredients
      ? initialRecipe.ingredients.map((ing, index) => ({
          id: index,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
        }))
      : [{ id: 0, ingredientId: "", quantity: null }],
  );

  const { ingredients } = useIngredientStore();
  const { addRecipe, updateRecipe } = useRecipeStore();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const inputClass = (error?: string | null) =>
    `w-full rounded-md border px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors
    dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500
    ${
      error
        ? "border-red-400 focus:border-red-500 dark:border-red-500"
        : "border-neutral-200 focus:border-blue-900 dark:border-neutral-700 dark:focus:border-blue-500"
    }`;

  const handleAddIngredientField = () => {
    if (ingredientFields.length < 10) {
      setIngredientFields([
        ...ingredientFields,
        { id: ingredientFields.length, ingredientId: "", quantity: null },
      ]);
    }
  };

  const handleRemoveIngredientField = (id: number) => {
    if (ingredientFields.length > 1) {
      setIngredientFields(ingredientFields.filter((field) => field.id !== id));
    }
  };

  const handleIngredientChange = (
    id: number,
    field: keyof IIngredientField,
    value: string | number | null,
  ) => {
    setIngredientFields(
      ingredientFields.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    );
  };

  const validate = (): boolean => {
    let valid = true;

    if (!formData.name) {
      setNameError("Name is required");
      valid = false;
    } else {
      setNameError(null);
    }

    const newQuantityErrors: Record<number, string | null> = {};
    ingredientFields.forEach((field) => {
      if (!field.quantity || field.quantity <= 0) {
        newQuantityErrors[field.id] = "Quantity must be greater than 0";
        valid = false;
      } else {
        newQuantityErrors[field.id] = null;
      }
    });
    setQuantityErrors(newQuantityErrors);

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData(e.currentTarget);

    startTransition(async () => {
      setError(null);

      const result = initialRecipe
        ? await updateRecipe(initialRecipe.id, data)
        : await addRecipe(data);

      if (result.success) {
        setIngredientFields([{ id: 0, ingredientId: "", quantity: null }]);
        router.push("/");
        setFormData(initialState);
      } else {
        setError(result.error || "Error saving recipe");
      }
    });
  };

  const handleReset = () => {
    setFormData(initialState);
    setIngredientFields([{ id: 0, ingredientId: "", quantity: null }]);
    setNameError(null);
    setQuantityErrors({});
    setError(null);
  };

  return (
    <div className="w-full max-w-[560px] mx-auto mt-8 rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950">
      <h2 className="mb-6 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        {initialRecipe ? "Edit Recipe" : "Add Recipe"}
      </h2>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-500 dark:bg-red-950">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            placeholder="Enter recipe name"
            className={inputClass(nameError)}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Description
            <span className="ml-1.5 text-xs font-normal text-neutral-400 dark:text-neutral-500">
              optional
            </span>
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            placeholder="Describe the recipe..."
            className={inputClass()}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {formData.description.length}/200
          </p>
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Image URL
            <span className="ml-1.5 text-xs font-normal text-neutral-400 dark:text-neutral-500">
              optional
            </span>
          </label>
          <input
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            placeholder="https://example.com/image.jpg"
            className={inputClass()}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>

        {/* Ingredients */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Ingredients <span className="text-red-500">*</span>
          </label>

          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              {/* Select ingredient */}
              <div className="flex flex-col gap-1 flex-1">
                <select
                  name={`ingredient_${index}`}
                  value={field.ingredientId}
                  className={inputClass()}
                  onChange={(e) =>
                    handleIngredientChange(
                      field.id,
                      "ingredientId",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Select ingredient</option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-1 w-[110px]">
                <input
                  name={`quantity_${index}`}
                  type="number"
                  placeholder="Qty"
                  value={
                    field.quantity !== null ? field.quantity.toString() : ""
                  }
                  className={inputClass(quantityErrors[field.id])}
                  min={0}
                  step="any"
                  onChange={(e) =>
                    handleIngredientChange(
                      field.id,
                      "quantity",
                      e.target.value ? parseFloat(e.target.value) : null,
                    )
                  }
                />
                {quantityErrors[field.id] && (
                  <p className="text-xs text-red-500">
                    {quantityErrors[field.id]}
                  </p>
                )}
              </div>

              {/* Remove button */}
              {ingredientFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIngredientField(field.id)}
                  className="mt-1 rounded-md px-2 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Add ingredient */}
          {ingredientFields.length < 10 && (
            <button
              type="button"
              onClick={handleAddIngredientField}
              className="self-start rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              + Add ingredient
            </button>
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
            {isPending
              ? "Saving..."
              : initialRecipe
                ? "Save changes"
                : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
