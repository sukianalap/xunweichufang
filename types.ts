export enum RecipeStatus {
  Eager = 'eager',       // 跃跃欲试
  Tried = 'tried',       // 小试牛刀
  Mastered = 'mastered'  // 小有成就
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tips: string[];
  cookingTime: string;
  difficulty: string;
  tags: string[];
  calories?: string;
  imageUrl?: string; // Base64 image
  videoKeyword?: string; // For generating video search links
  reviews?: Review[]; // Mocked community reviews
}

export interface SavedRecipe extends Recipe {
  savedAt: number;
  status: RecipeStatus;
  userRating?: number; // 1-5
  notes?: string;
}

export interface SolarTermInfo {
  termName: string;
  date: string;
  description: string;
  healthTips: string;
  recommendedDishes: RecipeSummary[];
}

export interface RecipeSummary {
  name: string;
  description: string;
  matchReason?: string; // For ingredient matching
}

export interface SoulDishAnalysis {
  dishName: string;
  description: string;
  personalityAnalysis: string;
  hometownConnection: string;
  poem: string;
  imageUrl?: string;
}

export interface CookingSkill {
  title: string;
  description: string;
  steps: string[];
  imageUrl?: string;
}