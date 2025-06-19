import { UserDto } from "@src/app/dto/user-dto";
import { InvalidInputsError } from "@src/app/errors/invalid-inputs-error";
import { ResourceNotFoundError } from "@src/app/errors/resource-not-found-error";
import { userService } from "@src/app/services/user-service";
import { requestHandler } from "@src/app/wrappers/request-handler";
import express from "express";
import { isValidObjectId } from "mongoose";

export const usersRouter = express.Router();

usersRouter
  .route("/:userId?")
  .get(
    requestHandler(async (req, res) => {
      if (!req.params.userId) {
        const userDocs = await userService.getAll();
        console.log("userDocs[0]:", userDocs[0]);
        const userDtos = userDocs.map(UserDto.fromDoc);
        res.json(userDtos);
        return;
      }

      if (!isValidObjectId(req.params.userId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: [
              {
                name: "userId",
                message: "Invalid ObjectId",
              },
            ],
          })
        );
        return;
      }

      const userDoc = await userService.getById(req.params.userId);
      if (!userDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
        return;
      }
      const userDto = UserDto.fromDoc(userDoc);
      res.json(userDto);
    })
  )
  .patch(
    requestHandler(async (req, res) => {
      if (!req.params.userId) {
        res.json(
          new InvalidInputsError({
            inputs: [
              {
                name: "userId",
                message: "Required",
              },
            ],
          })
        );
        return;
      }

      if (!isValidObjectId(req.params.userId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: [
              {
                name: "userId",
                message: "Invalid ObjectId",
              },
            ],
          })
        );
        return;
      }

      const user = req.body;

      const userDoc = await userService.updateById(req.params.userId, user);
      if (!userDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
        return;
      }
      const userDto = UserDto.fromDoc(userDoc);
      res.json(userDto);
    })
  )
  .delete(
    requestHandler(async (req, res) => {
      if (!req.params.userId) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: [
              {
                name: "userId",
                message: "Required",
              },
            ],
          })
        );
        return;
      }

      if (!isValidObjectId(req.params.userId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: [
              {
                name: "userId",
                message: "Invalid ObjectId",
              },
            ],
          })
        );
        return;
      }

      const userDoc = await userService.deleteById(req.params.userId);
      if (!userDoc) {
        res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
        return;
      }
      const userDto = UserDto.fromDoc(userDoc);
      res.json(userDto);
    })
  );
