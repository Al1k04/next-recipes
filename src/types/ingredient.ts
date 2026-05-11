export interface IIngredient {
  id: string;
  name: string;
  category: string;
  description: string | null;
  unit: string;
  pricePerUnit: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
