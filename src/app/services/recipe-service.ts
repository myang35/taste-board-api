import { RecipeModel } from "@src/app/models/recipe";
import { dateUtils } from "@src/utils/date-utils";
import { ObjectId } from "mongodb";
import { PipelineStage, Types } from "mongoose";

export const recipeService = {
  getAll: async (options?: {
    search?: string;
    sort?: string;
    limit?: number;
    skip?: number;
    userId?: string;
  }) => {
    const oneMonthAgo = dateUtils.createDateAfter(-1000 * 60 * 60 * 24 * 30);
    const pipelineStages: PipelineStage[] = [
      {
        $match: {
          $or: [
            {
              name: {
                $regex: options?.search ?? "",
                $options: "i",
              },
            },
            {
              tags: {
                $regex: options?.search ?? "",
                $options: "i",
              },
            },
          ],
        },
      },
    ];

    if (options?.userId) {
      pipelineStages.push({
        $match: {
          author: new ObjectId(options.userId),
        },
      });
    }

    if (
      options?.sort &&
      ["most_viewed", "newest", "trending"].includes(options.sort)
    ) {
      pipelineStages.push(
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
          $sort: (() => {
            let result: PipelineStage.Sort["$sort"];
            switch (options?.sort) {
              case "most_viewed":
                result = {
                  totalViews: -1,
                };
                break;
              case "newest":
                result = {
                  createdAt: -1,
                };
                break;
              case "trending":
                result = {
                  recentViews: -1,
                  totalViews: -1,
                };
                break;
              default:
                result = {};
                break;
            }
            return result;
          })(),
        }
      );
    }

    if (options?.skip && options.skip > 0) {
      pipelineStages.push({
        $skip: options.skip,
      });
    }

    if (options?.limit && options.limit > 0) {
      pipelineStages.push({
        $limit: options.limit,
      });
    }

    const recipeDocs = await RecipeModel.aggregate(pipelineStages);

    return RecipeModel.populate(recipeDocs, { path: "author" });
  },
  getById: async (id: Types.ObjectId | string) => {
    return RecipeModel.findById(id).populate("author").lean();
  },
  getRandom: async (size: number) => {
    const recipeDocs = await RecipeModel.aggregate([{ $sample: { size } }]);
    if (recipeDocs.length === 0) return null;
    return RecipeModel.populate(recipeDocs, { path: "author" });
  },
  create: async (recipe: {
    authorId: string;
    name: string;
    servings?: number;
    description?: string;
    cookMinutes?: number;
    difficulty?: number;
    imageKey?: string;
    tags?: string[];
    ingredients?: {
      name: string;
      amount: number;
      unit: string;
    }[];
    instructions?: {
      description: string;
      minutes?: number;
    }[];
    calories?: number;
    proteinGrams?: number;
    carbohydratesGrams?: number;
    fatGrams?: number;
    fiberGrams?: number;
    sugarGrams?: number;
    shared?: boolean;
    notes?: string;
    views?: {
      viewer: string;
      date: number;
    }[];
  }) => {
    const recipeDoc = await RecipeModel.create({
      author: recipe.authorId,
      name: recipe.name,
      servings: recipe.servings,
      description: recipe.description,
      cookMinutes: recipe.cookMinutes,
      difficulty: recipe.difficulty,
      imageKey: recipe.imageKey,
      tags: recipe.tags,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      calories: recipe.calories,
      proteinGrams: recipe.proteinGrams,
      carbohydratesGrams: recipe.carbohydratesGrams,
      fatGrams: recipe.fatGrams,
      fiberGrams: recipe.fiberGrams,
      sugarGrams: recipe.sugarGrams,
      notes: recipe.notes,
      shared: recipe.shared,
      views: recipe.views,
    });
    const populatedRecipeDoc = await recipeDoc.populate("author");
    return populatedRecipeDoc;
  },
  deleteById: async (id: Types.ObjectId | string) => {
    return RecipeModel.findByIdAndDelete(id).populate("author").lean();
  },
  updateById: async (
    id: Types.ObjectId | string,
    recipe: {
      authorId?: string;
      name?: string;
      servings?: number;
      description?: string;
      cookMinutes?: number;
      difficulty?: number;
      imageKey?: string;
      tags?: string[];
      ingredients?: {
        name: string;
        amount: number;
        unit: string;
        minutes: number;
      }[];
      instructions?: {
        description: string;
        minutes?: number;
      }[];
      calories?: number;
      proteinGrams?: number;
      carbohydratesGrams?: number;
      fatGrams?: number;
      fiberGrams?: number;
      sugarGrams?: number;
      viewCount?: number;
      notes?: string;
      shared?: boolean;
      views?: {
        viewer: string;
        date: number;
      }[];
    }
  ) => {
    return RecipeModel.findByIdAndUpdate(
      id,
      {
        author: recipe.authorId,
        name: recipe.name,
        servings: recipe.servings,
        description: recipe.description,
        cookMinutes: recipe.cookMinutes,
        difficulty: recipe.difficulty,
        imageKey: recipe.imageKey,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        calories: recipe.calories,
        proteinGrams: recipe.proteinGrams,
        carbohydratesGrams: recipe.carbohydratesGrams,
        fatGrams: recipe.fatGrams,
        fiberGrams: recipe.fiberGrams,
        sugarGrams: recipe.sugarGrams,
        viewCount: recipe.viewCount,
        notes: recipe.notes,
        shared: recipe.shared,
        views: recipe.views,
      },
      { new: true }
    )
      .populate("author")
      .lean();
  },
  count: async (options?: { search?: string }) => {
    return RecipeModel.countDocuments({
      $or: [
        {
          name: {
            $regex: options?.search ?? "",
            $options: "i",
          },
        },
        {
          tags: {
            $regex: options?.search ?? "",
            $options: "i",
          },
        },
      ],
    });
  },
};
