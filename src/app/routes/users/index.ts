import { UserDto } from "@src/app/dto/user-dto";
import { InvalidInputsError } from "@src/app/errors/invalid-inputs-error";
import { ResourceNotFoundError } from "@src/app/errors/resource-not-found-error";
import { UnauthorizedError } from "@src/app/errors/unauthorized-error";
import { authenticate } from "@src/app/middleware/authenticate";
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
        const userDtos = userDocs.map(UserDto.fromDoc);
        res.json(userDtos);
        return;
      }

      if (!isValidObjectId(req.params.userId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: { userId: "Invalid ObjectId" },
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
    authenticate,
    requestHandler(async (req, res) => {
      if (!req.params.userId) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: { userId: "Required" },
          })
        );
        return;
      }

      if (!isValidObjectId(req.params.userId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: { userId: "Invalid ObjectId" },
          })
        );
        return;
      }

      if (res.locals.user.id !== req.params.userId) {
        res.status(403).json(
          new UnauthorizedError({
            message: "You can only update your own user profile",
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
    authenticate,
    requestHandler(async (req, res) => {
      if (!req.params.userId) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: { userId: "Required" },
          })
        );
        return;
      }

      if (!isValidObjectId(req.params.userId)) {
        res.status(400).json(
          new InvalidInputsError({
            inputs: { userId: "Invalid ObjectId" },
          })
        );
        return;
      }

      if (res.locals.user.id !== req.params.userId) {
        res.status(403).json(
          new UnauthorizedError({
            message: "You can only delete your own user profile",
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
