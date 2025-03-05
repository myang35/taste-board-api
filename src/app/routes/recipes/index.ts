import { RecipeDto } from "@src/app/dto/recipe-dto";
import { UserDto } from "@src/app/dto/user-dto";
import {
  InvalidInputsError,
  InvalidInputsErrorInput,
} from "@src/app/errors/invalid-inputs-error";
import { ResourceNotFoundError } from "@src/app/errors/resource-not-found-error";
import { recipeService } from "@src/app/services/recipe-service";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import express from "express";

const PATH = "/recipes/:recipeId?";

export const recipesRouter = express.Router();

recipesRouter
  .route(PATH)
  .get(
    requestHandler(async (req, res) => {
      if (!req.params.recipeId) {
        const recipeDocs = await recipeService.getAll();
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
      const { name, authorId } = req.body;

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
      if (invalidInputs.length > 0) {
        res.status(400).json(new InvalidInputsError({ inputs: invalidInputs }));
        return;
      }

      const authorDoc = await userService.getById(authorId);
      if (!authorDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
        return;
      }

      const recipeDoc = await recipeService.create({ name, authorId });
      const recipeDto = new RecipeDto({
        id: recipeDoc._id,
        name: recipeDoc.name,
        author: UserDto.fromDoc(authorDoc),
        createdAt: recipeDoc.createdAt.toISOString(),
        updatedAt: recipeDoc.updatedAt.toISOString(),
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
