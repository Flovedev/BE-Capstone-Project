import Express from "express";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import UsersModel from "./model";
import { checkUserSchema, generateBadRequest } from "./validation";
import { createAccessToken } from "../../lib/auth/tools";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";

const usersRouter = Express.Router();

usersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UsersModel.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/me", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const user = await UsersModel.findById(req.user!._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.post(
  "/",
  checkUserSchema,
  generateBadRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const checkUsername = await UsersModel.findOne({
        username: req.body.username,
      });
      if (checkUsername) {
        next(
          createHttpError(
            404,
            `Username ${req.body.username} is already in use!`
          )
        );
      }

      const checkEmail = await UsersModel.findOne({ email: req.body.email });
      if (checkEmail) {
        next(
          createHttpError(404, `Email ${req.body.email} is already in use!`)
        );
      } else {
        const newUser = new UsersModel(req.body);
        const { _id } = await newUser.save();
        const payload = { _id: _id };
        const accessToken = await createAccessToken(payload);
        res.status(201).send({ user: newUser, accessToken: accessToken });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
