import { RecipeDto } from "@src/app/dto/recipe-dto";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "@src/app/errors/invalid-inputs-error";
import { ResourceNotFoundError } from "@src/app/errors/resource-not-found-error";
import { recipeService } from "@src/app/services/recipe-service";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import { queryUtils } from "@src/utils/query-utils";
import express from "express";

export const recipesRouter = express.Router();

recipesRouter.get(
  "/count",
  requestHandler(async (req, res) => {
    const count = await recipeService.count();
    res.json({ count });
  })
);

recipesRouter
  .route("/:recipeId?")
  .get(
    requestHandler(async (req, res) => {
      if (!req.params.recipeId) {
        const query = {
          sort: (() => {
            let value = queryUtils.toString(req.query.sort);
            if (!value) return undefined;
            if (!["most_viewed", "newest", "trending"].includes(value)) {
              return undefined;
            }
            return value;
          })(),
          search: queryUtils.toString(req.query.search),
          limit: queryUtils.toInt(req.query.limit),
          skip: queryUtils.toInt(req.query.skip),
        };

        const recipeDocs = await recipeService.getAll(query);
        const recipeDtos = recipeDocs.map(RecipeDto.fromDoc);
        res.json(recipeDtos);
        return;
      }

      const recipeDoc = await recipeService.get(req.params.recipeId);
      if (!recipeDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
        return;
      }
      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  )
  .post(
    requestHandler(async (req, res) => {
      const {
        name,
        authorId,
        description,
        imageUrl,
        prepMinutes,
        calories,
        tags,
        ingredients,
        steps,
        notes,
        shared,
      } = req.body;

      const invalidInputs: InvalidInputsErrorInput[] = [];
      if (!name) {
        invalidInputs.push({
          name: "name",
          message: "Required",
        });
      }
      if (!authorId) {
        invalidInputs.push({
          name: "authorId",
          message: "Required",
        });
      }
      if (!ingredients) {
        invalidInputs.push({
          name: "ingredients",
          message: "Required",
        });
      }
      if (!steps) {
        invalidInputs.push({
          name: "steps",
          message: "Required",
        });
      }
      if (!shared) {
        invalidInputs.push({
          name: "shared",
          message: "Required",
        });
      }
      if (invalidInputs.length > 0) {
        res.status(400).json(new InvalidInputsError({ inputs: invalidInputs }));
        return;
      }

      const authorDoc = await userService.getById(authorId);
      if (!authorDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
        return;
      }

      const recipeDoc = await recipeService.create({
        name,
        authorId,
        description,
        imageUrl,
        prepMinutes,
        calories,
        tags,
        ingredients,
        steps,
        notes,
        shared,
      });
      const recipeDto = RecipeDto.fromDoc({
        ...recipeDoc,
        author: authorDoc,
      });
      res.json(recipeDto);
    })
  )
  .patch(
    requestHandler(async (req, res) => {
      if (!req.params.recipeId) {
        res.json(
          new InvalidInputsError({
            inputs: [
              {
                name: "recipeId",
                message: "Required",
              },
            ],
          })
        );
        return;
      }

      const recipe = req.body;

      const recipeDoc = await recipeService.update(req.params.recipeId, recipe);
      if (!recipeDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
        return;
      }
      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  )
  .delete(
    requestHandler(async (req, res) => {
      if (!req.params.recipeId) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: [
              {
                name: "recipeId",
                message: "Required",
              },
            ],
          })
        );
        return;
      }

      const recipeDoc = await recipeService.delete(req.params.recipeId);
      if (!recipeDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
        return;
      }
      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  );
