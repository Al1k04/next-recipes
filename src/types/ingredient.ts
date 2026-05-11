export interface IIngredient {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  pricePerUnit: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
