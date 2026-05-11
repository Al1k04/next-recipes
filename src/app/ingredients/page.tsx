import IngredientsTable from "@/components/UI/tables/ingredients";
import IngredientForm from "@/forms/ingredient.form";

export default function Ingredients() {
  return (
    <div>
      <IngredientForm />
      <IngredientsTable />
    </div>
  );
}
