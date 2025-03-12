import { IngredientDto } from "@src/app/dto/ingredient-dto";
import { InvalidInputsError } from "@src/app/errors/invalid-inputs-error";
import { ResourceNotFoundError } from "@src/app/errors/resource-not-found-error";
import { ingredientService } from "@src/app/services/ingredient-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import express from "express";

export const ingredientsRouter = express.Router();

ingredientsRouter
  .route("/:ingredientId?")
  .get(
    requestHandler(async (req, res) => {
      const query = {
        distinct: (() => {
          if (req.query.distinct instanceof Array) {
            return req.query.distinct[0] as string | undefined;
          }
          return req.query.distinct as string | undefined;
        })(),
      };

      if (!req.params.ingredientId) {
        const ingredientDocs = await ingredientService.getAll(query);

        if (query.distinct) {
          res.json(ingredientDocs);
          return;
        }

        const ingredientDtos = ingredientDocs.map(IngredientDto.fromDoc);
        res.json(ingredientDtos);
        return;
      }

      const ingredientDoc = await ingredientService.get(
        req.params.ingredientId
      );
      if (!ingredientDoc) {
        res.json(new ResourceNotFoundError({ resource: "ingredient" }));
        return;
      }

      const ingredientDto = IngredientDto.fromDoc(ingredientDoc);
      res.json(ingredientDto);
    })
  )
  .post(
    requestHandler(async (req, res) => {
      const { ingredients } = req.body;
      const ingredientDocs = await ingredientService.create(ingredients);
      const ingredientDtos = ingredientDocs.map(IngredientDto.fromDoc);
      res.json({ created: ingredientDtos });
    })
  )
  .patch(
    requestHandler(async (req, res) => {
      if (!req.params.ingredientId) {
        res.json(
          new InvalidInputsError({
            inputs: [
              {
                name: "ingredientId",
                message: "Required",
              },
            ],
          })
        );
        return;
      }

      const { name, category, description } = req.body;

      const ingredientDoc = await ingredientService.update(
        req.params.ingredientId,
        {
          name,
          category,
          description,
        }
      );

      if (!ingredientDoc) {
        res.json(new ResourceNotFoundError({ resource: "ingredient" }));
        return;
      }

      const ingredientDto = IngredientDto.fromDoc(ingredientDoc);
      res.json(ingredientDto);
    })
  )
  .delete(
    requestHandler(async (req, res) => {
      if (!req.params.ingredientId) {
        res.json(
          new InvalidInputsError({
            inputs: [
              {
                name: "ingredientId",
                message: "Required",
              },
            ],
          })
        );
        return;
      }

      const ingredientDoc = await ingredientService.delete(
        req.params.ingredientId
      );

      if (!ingredientDoc) {
        res.json(new ResourceNotFoundError({ resource: "ingredient" }));
        return;
      }

      const ingredientDto = IngredientDto.fromDoc(ingredientDoc);
      res.json(ingredientDto);
    })
  );
