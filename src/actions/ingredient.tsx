"use server";

import { ingredientSchema } from "@/schema/zod";
import { prisma } from "@/utils/prisma";
import { ZodError } from "zod";

type IngredientPayload = {
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number | null;
  description: string;
};

export async function createIngredient(payload: IngredientPayload) {
  try {
    const validated = ingredientSchema.parse(payload);

    const ingredient = await prisma.ingredient.create({
      data: {
        name: validated.name,
        category: validated.category,
        unit: validated.unit,
        pricePerUnit: validated.pricePerUnit ?? null,
        description: validated.description,
      },
    });

    return { success: true as const, ingredient };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false as const,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }

    console.log("Unknown error type:", typeof error, JSON.stringify(error));

    return { success: false as const, error: "Something went wrong" };
  }
}

export async function getIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany();
    return { success: true as const, ingredients };
  } catch (error) {
    console.log("Error retrieving ingredients:", error);
    return { success: false as const, error: "Error retrieving ingredients" };
  }
}

export async function deleteIngredients(id: string) {
  try {
    await prisma.ingredient.delete({
      where: { id },
    });
    return { success: true as const };
  } catch (error) {
    console.log("Ingredient removal error:", error);
    return { success: false as const, error: "Ingredient removal error" };
  }
}
