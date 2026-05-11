import {
  createIngredient,
  deleteIngredients,
  getIngredients,
} from "@/actions/ingredient";
import { IIngredient } from "@/types/ingredient";
import { create } from "zustand";

interface IngredientStore {
  ingredients: IIngredient[];
  isPending: boolean;
  error: string | null;
  loadingIngredients: () => Promise<void>;
  addIngredient: (formData: FormData) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
}

export const useIngredientStore = create<IngredientStore>((set) => ({
  ingredients: [],
  isPending: false,
  error: null,
  loadingIngredients: async () => {
    set({ isPending: true, error: null });

    try {
      const result = await getIngredients();

      if (result.success) {
        set({ ingredients: result?.ingredients, isPending: false });
      } else {
        set({ error: result.error, isPending: false });
      }
    } catch (error) {
      console.log("error", error);
      set({ error: "Error loading ingredients", isPending: false });
    }
  },

  addIngredient: async (formData: FormData) => {
    set({ isPending: true, error: null });

    try {
      const result = await createIngredient(formData);

      if (result.success) {
        set((state) => ({
          ingredients: [...state.ingredients, result.ingredient],
          isPending: false,
        }));
      } else {
        set({ error: result.error, isPending: false });
      }
    } catch (error) {
      console.log("error:", error);
      set({ error: "Error adding ingredients", isPending: false });
    }
  },

  removeIngredient: async (id: string) => {
    set({ isPending: true, error: null });

    try {
      const result = await deleteIngredients(id);

      if (result?.success) {
        set((state) => ({
          ingredients: state.ingredients.filter(
            (ingredient) => ingredient.id !== id,
          ),
          isPending: false,
        }));
      } else {
        set({ error: result.error, isPending: false });
      }
    } catch (error) {
      console.log("error:", error);
      set({ error: "Error deleting ingredients", isPending: false });
    }
  },
}));
