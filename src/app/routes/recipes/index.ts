import { RecipeDto } from "@src/app/dto/recipe-dto";
import { InvalidInputsError } from "@src/app/errors/invalid-inputs-error";
import { ResourceNotFoundError } from "@src/app/errors/resource-not-found-error";
import { UnauthorizedError } from "@src/app/errors/unauthorized-error";
import { authenticate } from "@src/app/middleware/authenticate";
import { recipeService } from "@src/app/services/recipe-service";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import { queryUtils } from "@src/utils/query-utils";
import express from "express";
import { isValidObjectId } from "mongoose";

export const recipesRouter = express.Router();

recipesRouter.route("/count").get(
  requestHandler(async (req, res) => {
    const query = {
      search: queryUtils.toString(req.query.search),
    };

    const count = await recipeService.count(query);
    res.json({ result: count });
  })
);

recipesRouter.route("/random/:size").get(
  requestHandler(async (req, res) => {
    const size = Number.parseInt(req.params.size);
    if (size <= 0 || Number.isNaN(size)) {
      res.status(400).json(
        new InvalidInputsError({
          inputs: {
            size: "Must be a positive integer",
          },
        })
      );
      return;
    }

    const recipeDoc = await recipeService.getRandom(
      req.params.size ? parseInt(req.params.size) : 1
    );
    if (!recipeDoc) {
      res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
      return;
    }

    const recipeDtos = recipeDoc.map(RecipeDto.fromDoc);
    res.json(recipeDtos);
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
          userId: queryUtils.toString(req.query.userId),
        };

        const recipeDocs = await recipeService.getAll(query);
        const recipeDtos = recipeDocs.map(RecipeDto.fromDoc);
        res.json(recipeDtos);
        return;
      }

      if (!isValidObjectId(req.params.recipeId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: {
              recipeId: "Invalid ObjectId",
            },
          })
        );
        return;
      }

      const recipeDoc = await recipeService.getById(req.params.recipeId);
      if (!recipeDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
        return;
      }
      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  )
  .post(
    authenticate,
    requestHandler(async (req, res) => {
      const invalidInputsError = new InvalidInputsError();

      if (!req.body.name) {
        invalidInputsError.addInputError("name", "Required");
      }

      if (invalidInputsError.hasInputErrors()) {
        res.status(400).json(invalidInputsError);
        return;
      }

      const authorDoc = await userService.getById(res.locals.user.id);
      if (!authorDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
        return;
      }

      const recipeDoc = await recipeService.create({
        authorId: authorDoc._id,
        ...req.body,
      });

      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  )
  .patch(
    authenticate,
    requestHandler(async (req, res) => {
      const invalidInputsError = new InvalidInputsError();

      if (!req.params.recipeId) {
        invalidInputsError.addInputError("recipeId", "Required");
      } else if (!isValidObjectId(req.params.recipeId)) {
        invalidInputsError.addInputError("recipeId", "Invalid ObjectId");
      }

      if (invalidInputsError.hasInputErrors()) {
        res.status(400).json(invalidInputsError);
        return;
      }

      const recipeDoc = await recipeService.getById(req.params.recipeId!);

      if (!recipeDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
        return;
      }

      if (recipeDoc.author._id.toString() !== res.locals.user.id) {
        res.status(403).json(new UnauthorizedError());
        return;
      }

      await recipeService.updateById(req.params.recipeId!, req.body);

      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  )
  .delete(
    authenticate,
    requestHandler(async (req, res) => {
      const invalidInputsError = new InvalidInputsError();

      if (!res.locals.user?.id) {
        invalidInputsError.addInputError("authorId", "Required");
      }

      if (!req.params.recipeId) {
        invalidInputsError.addInputError("recipeId", "Required");
      }

      if (!isValidObjectId(req.params.recipeId)) {
        invalidInputsError.addInputError("recipeId", "Invalid ObjectId");
      }

      if (invalidInputsError.hasInputErrors()) {
        res.status(400).json(invalidInputsError);
        return;
      }

      const recipeDoc = await recipeService.getById(req.params.recipeId!);

      if (!recipeDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
        return;
      }

      if (recipeDoc.author._id.toString() !== res.locals.user.id) {
        res.status(403).json(new UnauthorizedError());
        return;
      }

      await recipeService.deleteById(req.params.recipeId!);

      const recipeDto = RecipeDto.fromDoc(recipeDoc);
      res.json(recipeDto);
    })
  );
