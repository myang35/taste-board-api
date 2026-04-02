import { RecipeDto } from "../../dto/recipe-dto";
import { InvalidInputsError } from "../../errors/invalid-inputs-error";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import { requireAuth } from "../../middleware/require-auth";
import { fileService } from "../../services/file-service";
import { recipeService } from "../../services/recipe-service";
import { userService } from "../../services/user-service";
import { requestHandler } from "../../wrappers/request-handler";
import { queryUtils } from "../../../utils/query-utils";
import express from "express";
import { isValidObjectId } from "mongoose";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const recipesRouter = express.Router();

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
          shared: queryUtils.toBoolean(req.query.shared),
        };

        const recipeDocs = await recipeService.getAll(query);
        const imageUrls = await Promise.all(
          recipeDocs.map(
            (recipeDoc) =>
              recipeDoc.imageKey && fileService.getImageUrl(recipeDoc.imageKey)
          )
        );
        const recipeDtos = recipeDocs.map((recipeDoc, i) =>
          RecipeDto.fromDoc(recipeDoc, imageUrls[i])
        );
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
      const imageUrl =
        recipeDoc.imageKey &&
        (await fileService.getImageUrl(recipeDoc.imageKey));
      const recipeDto = RecipeDto.fromDoc(recipeDoc, imageUrl);
      res.json(recipeDto);
    })
  )
  .post(
    requireAuth,
    upload.single("image"),
    requestHandler(async (req, res) => {
      const data = JSON.parse(req.body.data);
      const invalidInputsError = new InvalidInputsError();

      if (!data.name) {
        invalidInputsError.addInputError("name", "Required");
      }

      for (const [index, ingredient] of Object.entries(data.ingredients)) {
        if (!(ingredient as any).name) {
          invalidInputsError.addInputError(
            `ingredients.${index}.name`,
            "Required"
          );
        }
        if (!(ingredient as any).amount) {
          invalidInputsError.addInputError(
            `ingredients.${index}.amount`,
            "Required"
          );
        }
        if ((ingredient as any).amount < 0) {
          invalidInputsError.addInputError(
            `ingredients.${index}.amount`,
            "Must be a postive number"
          );
        }
        if (!(ingredient as any).unit) {
          invalidInputsError.addInputError(
            `ingredients.${index}.unit`,
            "Required"
          );
        }
      }

      for (const [index, instruction] of Object.entries(data.instructions)) {
        if (!(instruction as any).description) {
          invalidInputsError.addInputError(
            `instructions.${index}.description`,
            "Required"
          );
        }
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

      const imageKey =
        req.file && (await fileService.storeImage(req.file, data.shared));

      const recipeDoc = await recipeService.create({
        authorId: authorDoc._id,
        imageKey,
        ...data,
      });

      res.status(201).json({ id: recipeDoc.id });
    })
  )
  .patch(
    requireAuth,
    upload.single("image"),
    requestHandler(async (req, res) => {
      const data = JSON.parse(req.body.data);
      const invalidInputsError = new InvalidInputsError();

      if (!req.params.recipeId) {
        invalidInputsError.addInputError("recipeId", "Required");
      } else if (!isValidObjectId(req.params.recipeId)) {
        invalidInputsError.addInputError("recipeId", "Invalid ObjectId");
      }

      for (const [index, ingredient] of Object.entries(data.ingredients)) {
        if (!(ingredient as any).name) {
          invalidInputsError.addInputError(
            `ingredients.${index}.name`,
            "Required"
          );
        }
        if (!(ingredient as any).amount) {
          invalidInputsError.addInputError(
            `ingredients.${index}.amount`,
            "Required"
          );
        }
        if ((ingredient as any).amount < 0) {
          invalidInputsError.addInputError(
            `ingredients.${index}.amount`,
            "Must be a postive number"
          );
        }
        if (!(ingredient as any).unit) {
          invalidInputsError.addInputError(
            `ingredients.${index}.unit`,
            "Required"
          );
        }
      }

      for (const [index, instruction] of Object.entries(data.instructions)) {
        if (!(instruction as any).description) {
          invalidInputsError.addInputError(
            `instructions.${index}.description`,
            "Required"
          );
        }
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

      if (data.shared !== recipeDoc.shared && recipeDoc.imageKey) {
        data.shared
          ? await fileService.moveToPublic(recipeDoc.imageKey)
          : await fileService.moveToPrivate(recipeDoc.imageKey);
      }

      const imageKey = await (async () => {
        if (recipeDoc.imageKey) {
          if (data.image === null) {
            return fileService.deleteImage(recipeDoc.imageKey);
          }
          if (req.file) {
            return fileService.updateImage(recipeDoc.imageKey, req.file);
          }
        } else {
          if (req.file) {
            return fileService.storeImage(req.file, { isPublic: data.shared });
          }
        }
        return recipeDoc.imageKey;
      })();

      await recipeService.updateById(req.params.recipeId!, {
        authorId: res.locals.user.id,
        imageKey,
        ...data,
      });

      res.status(204).send();
    })
  )
  .delete(
    requireAuth,
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

      res.status(204).send();
    })
  );

recipesRouter.route("/:recipeId/views").post(
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

    const recipeDoc = await recipeService.addView(
      req.params.recipeId,
      req.body.viewerId
    );
    if (!recipeDoc) {
      res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
      return;
    }

    res.status(204).send();
  })
);

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

    const recipeDocs = await recipeService.getRandom(
      req.params.size ? parseInt(req.params.size) : 1
    );
    if (!recipeDocs) {
      res.status(404).json(new ResourceNotFoundError({ resource: "recipe" }));
      return;
    }

    const imageUrls = await Promise.all(
      recipeDocs.map(
        (recipeDoc) =>
          recipeDoc.imageKey && fileService.getImageUrl(recipeDoc.imageKey)
      )
    );
    const recipeDtos = recipeDocs.map((recipeDoc, i) =>
      RecipeDto.fromDoc(recipeDoc, imageUrls[i])
    );
    res.json(recipeDtos);
  })
);
