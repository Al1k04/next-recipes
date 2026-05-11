import z, { object, string } from "zod"; // ← убрали number из импорта

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const ingredientSchema = object({
  name: string().min(1, "Название обязательно"),
  category: z.enum([
    "VEGETABLES",
    "FRUITS",
    "MEAT",
    "DAIRY",
    "SPICES",
    "OTHER",
  ]),
  unit: z.enum(["GRAMS", "KILOGRAMS", "LITERS", "MILLILITER", "PIECES"]),
  pricePerUnit: z.coerce
    .number({ invalid_type_error: "Цена должна быть числом" })
    .min(0, "Цена должна быть положительной")
    .nullable()
    .optional(),
  description: z.string().optional(),
});
