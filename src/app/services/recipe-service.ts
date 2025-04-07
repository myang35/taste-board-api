import { IRecipePopulated, Recipe } from "@src/app/models/recipe";
import { IUser, User } from "@src/app/models/user";
import { dateUtils } from "@src/utils/date-utils";
import { PipelineStage } from "mongoose";

export const recipeService = {
  getAll: async (options?: {
    search?: string;
    sort?: string;
    limit?: number;
    skip?: number;
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
                  totalsViews: -1,
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

    return Recipe.aggregate<IRecipePopulated>(pipelineStages);
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
  count: async (options?: { search?: string }) => {
    return Recipe.countDocuments({
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
