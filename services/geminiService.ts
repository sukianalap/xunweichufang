import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, RecipeSummary, SolarTermInfo, SoulDishAnalysis, CookingSkill } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate image
export async function generateImage(prompt: string): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality, appetizing food photography of Chinese dish: ${prompt}. Professional lighting, 4k. Realistic style.` }],
      },
      config: {
        imageConfig: { aspectRatio: "4:3" }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Image generation failed", e);
    return undefined;
  }
  return undefined;
}

const RECIPE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    cookingTime: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    calories: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING },
        }
      }
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
        }
      }
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    videoKeyword: { type: Type.STRING, description: "Search keyword for finding video tutorials" },
    reviews: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          author: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          comment: { type: Type.STRING },
          date: { type: Type.STRING }
        }
      }
    }
  },
  required: ["name", "description", "ingredients", "steps", "cookingTime", "difficulty"]
};

export const generateRecipeByName = async (dishName: string): Promise<Recipe> => {
  const model = "gemini-2.5-flash";
  const prompt = `请提供一道中国菜 "${dishName}" 的详细食谱。返回 JSON 格式。请包含 2-3 条模拟的用户好评。`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA
    }
  });

  if (!response.text) throw new Error("No response from AI");
  const recipe = JSON.parse(response.text) as Recipe;
  
  // Generate Image
  const imageUrl = await generateImage(recipe.name + ", " + recipe.description);
  if (imageUrl) recipe.imageUrl = imageUrl;
  
  return recipe;
};

export const recommendByIngredients = async (ingredients: string): Promise<RecipeSummary[]> => {
  const model = "gemini-2.5-flash";
  const prompt = `我有这些食材: ${ingredients}。请推荐 5 道可以制作的正宗中国菜。包含简短描述和推荐理由。`;
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        matchReason: { type: Type.STRING },
      },
      required: ["name", "description", "matchReason"]
    }
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as RecipeSummary[];
};

export const getSolarTermRecommendations = async (): Promise<SolarTermInfo> => {
  const model = "gemini-2.5-flash";
  const today = new Date().toLocaleDateString('zh-CN');
  const prompt = `今天是 ${today}。请识别当前或最近的中国二十四节气。请注意：在 date 字段中，不要返回今天，而是返回该节气的具体日期（例如：2023年10月24日）。提供该节气的养生建议，并严格按照顺序推荐3道菜：1道适合早餐的，1道适合午餐的，1道适合晚餐的。请全部使用中文。`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      termName: { type: Type.STRING },
      date: { type: Type.STRING },
      description: { type: Type.STRING },
      healthTips: { type: Type.STRING },
      recommendedDishes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      }
    },
    required: ["termName", "date", "description", "healthTips", "recommendedDishes"]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as SolarTermInfo;
};

export const analyzeSoulDish = async (name: string, hometown: string): Promise<SoulDishAnalysis> => {
  const model = "gemini-2.5-flash";
  const prompt = `为一个叫 "${name}" 来自 "${hometown}" 的人进行有趣的、略带神秘感的分析。根据名字的文化气息和家乡的饮食历史，为他们指定一道代表他们“灵魂”或“命运”的中国菜。请风趣且富有诗意。全部使用中文。`;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      dishName: { type: Type.STRING },
      description: { type: Type.STRING },
      personalityAnalysis: { type: Type.STRING },
      hometownConnection: { type: Type.STRING },
      poem: { type: Type.STRING }
    },
    required: ["dishName", "personalityAnalysis", "hometownConnection", "poem"]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  if (!response.text) throw new Error("No response from AI");
  const analysis = JSON.parse(response.text) as SoulDishAnalysis;
  
  // Generate Image for Soul Dish
  const imageUrl = await generateImage(analysis.dishName);
  if (imageUrl) analysis.imageUrl = imageUrl;

  return analysis;
};

export const recommendByCategory = async (category: string): Promise<RecipeSummary[]> => {
    const model = "gemini-2.5-flash";
    const prompt = `请推荐 12 道经典的"${category}"。包含菜名和简短的一句话描述。`;

    const schema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
            },
            required: ["name", "description"]
        }
    };

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as RecipeSummary[];
};