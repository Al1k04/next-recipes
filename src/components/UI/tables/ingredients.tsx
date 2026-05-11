"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from "@/store/ingredient.store";

const IngredientsTable = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const ingredients = useIngredientStore((state) => state.ingredients);
  const isPending = useIngredientStore((state) => state.isPending);
  const error = useIngredientStore((state) => state.error);
  const removeIngredient = useIngredientStore(
    (state) => state.removeIngredient,
  );
  const loadingIngredients = useIngredientStore(
    (state) => state.loadingIngredients,
  );

  useEffect(() => {
    if (isAuth && ingredients.length === 0) {
      loadingIngredients();
    }
  }, [isAuth, ingredients.length, loadingIngredients]);

  if (!isAuth) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
        Сначала авторизуйтесь
      </div>
    );
  }

  if (isPending && ingredients.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-900 dark:border-neutral-700 dark:border-t-blue-400" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border mt-10 border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
      <h2 className="mb-4 text-lg font-semibold tracking-tight dark:text-neutral-100">
        Ingredients
      </h2>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800">
              {[
                "Название",
                "Категория",
                "Ед. изм.",
                "Цена",
                "Описание",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="pb-3 pr-4 text-left font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-neutral-400 dark:text-neutral-600"
                >
                  Нет ингредиентов
                </td>
              </tr>
            ) : (
              ingredients.map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className="border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                  <td className="py-3 pr-4 font-medium dark:text-neutral-100">
                    {ingredient.name}
                  </td>

                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                      {ingredient.category}
                    </span>
                  </td>

                  <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">
                    {ingredient.unit}
                  </td>

                  <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">
                    {ingredient.pricePerUnit ?? "—"}
                  </td>

                  <td className="py-3 pr-4 text-neutral-600 dark:text-neutral-400">
                    {ingredient.description || "—"}
                  </td>

                  <td className="py-3 text-right">
                    <button
                      onClick={() => removeIngredient(ingredient.id)}
                      disabled={isPending}
                      className="rounded-md px-2 py-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950 dark:hover:text-red-400"
                      aria-label="Удалить"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsTable;
