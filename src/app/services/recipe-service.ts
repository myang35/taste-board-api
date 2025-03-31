import { IRecipePopulated, Recipe } from "@src/app/models/recipe";
import { IUser, User } from "@src/app/models/user";
import { dateUtils } from "@src/utils/date-utils";

export const recipeService = {
  getAll: async (options?: { sort?: string }) => {
    const query = (() => {
      const oneMonthAgo = dateUtils.createDateAfter(-1000 * 60 * 60 * 24 * 30);
      return Recipe.aggregate<
        IRecipePopulated & { recentViews: number; totalViews: number }
      >([
        {
          $addFields: {
            recentViews: {
              $size: {
                $filter: {
                  input: "$views",
                  as: "view",
                  cond: { $gte: ["$$view.date", oneMonthAgo] },
                },
              },
            },
            totalViews: {
              $size: "$views",
            },
          },
        },
        {
          $lookup: {
            from: User.collection.name,
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
      ]);
    })();

    switch (options?.sort) {
      case "most_viewed":
        query.sort("-totalViews");
        break;
      case "newest":
        query.sort("-createdAt");
        break;
      case "trending":
        query.sort("-recentViews -totalViews");
      default:
        break;
    }

    return query;
  },
  get: async (id: string) => {
    return Recipe.findById(id).populate<{ author: IUser }>("author").lean();
  },
  create: async (recipe: {
    name: string;
    authorId: string;
    ingredients: {
      name: string;
      amount: number;
      unit: string;
    }[];
    steps: string[];
    shared: boolean;
    description?: string;
    imageUrl?: string;
    prepMinutes?: number;
    calories?: number;
    tags?: string[];
    notes?: string;
    views?: {
      viewer: string;
      date: number;
    }[];
  }) => {
    const recipeDoc = await Recipe.create({
      name: recipe.name,
      author: recipe.authorId,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      shared: recipe.shared,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      prepMinutes: recipe.prepMinutes,
      calories: recipe.calories,
      tags: recipe.tags,
      views: recipe.views,
    });
    return recipeDoc;
  },
  delete: async (id: string) => {
    return Recipe.findByIdAndDelete(id)
      .populate<{ author: IUser }>("author")
      .lean();
  },
  update: async (
    id: string,
    recipe: {
      authorId?: string;
      name?: string;
      description?: string;
      imageUrl?: string;
      prepMinutes?: number;
      calories?: number;
      tags?: string[];
      ingredients?: {
        name: string;
        amount: number;
        unit: string;
      }[];
      steps?: string[];
      viewCount?: number;
      notes?: string;
      shared?: boolean;
      views?: {
        viewer: string;
        date: number;
      };
    }
  ) => {
    return Recipe.findByIdAndUpdate(
      id,
      {
        author: recipe.authorId,
        name: recipe.name,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        prepMinutes: recipe.prepMinutes,
        calories: recipe.calories,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        viewCount: recipe.viewCount,
        notes: recipe.notes,
        shared: recipe.shared,
        views: recipe.views,
      },
      { new: true }
    )
      .populate<{ author: IUser }>("author")
      .lean();
  },
};
