"use client";

import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from "@/store/ingredient.store";
import { useRecipeStore } from "@/store/recipe.store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface IProps {
  children: React.ReactNode;
}

export const AppLoader = ({ children }: IProps) => {
  const { data: session, status } = useSession();
  const { ingredients, loadingIngredients } = useIngredientStore();
  const { loadRecipes } = useRecipeStore();

  const { isAuth, setAuthState } = useAuthStore();

  console.log("ingredients:", ingredients);

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session, setAuthState]);

  useEffect(() => {
    if (isAuth) {
      loadingIngredients();
    }
  }, [isAuth]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return <>{children}</>;
};
