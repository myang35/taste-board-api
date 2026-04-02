import { UserDto } from "../../dto/user-dto";
import { InvalidInputsError } from "../../errors/invalid-inputs-error";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import { requireAuth } from "../../middleware/require-auth";
import { userService } from "../../services/user-service";
import { requestHandler } from "../../wrappers/request-handler";
import express from "express";
import { isValidObjectId } from "mongoose";

export const usersRouter = express.Router();

usersRouter.route("/:userId/username").patch(
  requireAuth,
  requestHandler(async (req, res) => {
    const { newUsername, password } = req.body;

    const userDoc = await userService.getById(req.params.userId);
    if (!userDoc) {
      res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
      return;
    }

    if (res.locals.user.id !== req.params.userId) {
      res.status(403).json(new UnauthorizedError());
      return;
    }

    const invalidInputsError = new InvalidInputsError();

    if (!newUsername) {
      invalidInputsError.addInputError("newUsername", "Required");
    } else if (await userService.getByUsername(newUsername)) {
      invalidInputsError.addInputError(
        "newUsername",
        "Username is already in use"
      );
    }

    if (!password) {
      invalidInputsError.addInputError("password", "Required");
    } else if (!(await userService.verifyPassword(userDoc, password))) {
      invalidInputsError.addInputError("password", "Password is incorrect");
    }

    if (invalidInputsError.hasInputErrors()) {
      res.status(400).json(invalidInputsError);
      return;
    }

    const updatedUserDoc = await userService.updateUsernameById(
      req.params.userId,
      newUsername
    );
    if (!updatedUserDoc) {
      res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
      return;
    }
    const userDto = UserDto.fromDoc(updatedUserDoc);
    res.json(userDto);
  })
);

usersRouter.route("/:userId/password").patch(
  requireAuth,
  requestHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const userDoc = await userService.getById(req.params.userId);

    if (!userDoc) {
      res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
      return;
    }

    if (res.locals.user.id !== req.params.userId) {
      res.status(403).json(new UnauthorizedError());
      return;
    }

    const invalidInputsError = new InvalidInputsError();

    if (!currentPassword) {
      invalidInputsError.addInputError("currentPassword", "Required");
    } else if (!(await userService.verifyPassword(userDoc, currentPassword))) {
      invalidInputsError.addInputError(
        "currentPassword",
        "Password is incorrect"
      );
    }

    if (!newPassword) {
      invalidInputsError.addInputError("newPassword", "Required");
    }

    if (invalidInputsError.hasInputErrors()) {
      res.status(400).json(invalidInputsError);
      return;
    }

    const updatedUserDoc = await userService.updatePasswordById(
      req.params.userId,
      newPassword
    );
    if (!updatedUserDoc) {
      res.status(404).json(new ResourceNotFoundError({ resource: "user" }));
      return;
    }
    const userDto = UserDto.fromDoc(updatedUserDoc);
    res.json(userDto);
  })
);

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
    requireAuth,
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
    requireAuth,
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
