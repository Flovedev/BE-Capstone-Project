import Express from "express";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import UsersModel from "./model";
import { checkUserSchema, generateBadRequest } from "./validation";
import { createAccessToken } from "../../lib/auth/tools";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import bcrypt from "bcrypt";

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

usersRouter.put(
  "/me",
  JWTAuthMiddleware,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const updatedUser = (await UsersModel.findByIdAndUpdate(
        req.user!._id,
        req.body,
        { new: true, runValidators: true }
      )) as any;
      if (!updatedUser) {
        next(
          createHttpError(404, `User with id id ${req.user!._id} not found!`)
        );
      }

      Object.keys(req.body).forEach((key) => {
        if (key !== "password") {
          updatedUser[key] = req.body[key];
        }
      });

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // console.log("hashed pass", hashedPassword);
        updatedUser.password = hashedPassword;
      }
      const savedUser = await updatedUser.save();

      res.send(savedUser);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/session",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await UsersModel.checkCredentials(email, password);
      if (user) {
        const payload = { _id: user._id };
        const accessToken = await createAccessToken(payload);
        res.send({ accessToken, user });
      } else {
        next(createHttpError(401, "Credentials are not valid."));
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/account",
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
