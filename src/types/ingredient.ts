export interface IIngredient {
  id: string;
  name: string;
  category: string;
  description: string | null;
  unit: string;
  pricePerUnit: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}
