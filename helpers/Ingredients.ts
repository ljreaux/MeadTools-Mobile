import { API_URL } from "@/app/_layout";

export default async function getAllIngredients() {
  const result = await fetch(`${API_URL}/ingredients`);
  const ingredients = await result.json();
  return ingredients;
}
export interface IngredientListItem {
  id: number;
  name: string;
  sugar_content: string;
  water_content: string;
  category: string;
}
