import Express from "express";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import UsersModel from "./model";
import { checkUserSchema, generateBadRequest } from "./validation";
import { createAccessToken } from "../../lib/auth/tools";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import bcrypt from "bcrypt";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Params } from "express-serve-static-core";
import passport from "passport";

const usersRouter = Express.Router();

usersRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UsersModel.find().select("-email -social -native");
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/single/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UsersModel.findById(req.params.userId).select(
        "-email -social -native"
      );
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/find/:search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UsersModel.find({
        username: { $regex: req.params.search, $options: "i" },
      }).select("-email -social -native");
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/me", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const user = await UsersModel.findById(req.user!._id);
    if (!user) {
      next(createHttpError(404, `User doesn't exist.`));
    } else {
      res.send(user);
    }
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
        next(createHttpError(404, `User with id ${req.user!._id} not found!`));
      }

      Object.keys(req.body).forEach((key) => {
        if (key !== "password") {
          updatedUser[key] = req.body[key];
        }
      });

      if (req.body.password) {
        const plainPW = req.body.password;
        const hashedPassword = await bcrypt.hash(plainPW!, 11);

        updatedUser.password = hashedPassword;
      }
      const savedUser = await updatedUser.save();

      res.send(savedUser);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/me",
  JWTAuthMiddleware,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await UsersModel.findById(req.user!._id);
      if (!user) {
        next(createHttpError(404, `User doesn't exist.`));
      } else {
        await UsersModel.findByIdAndDelete(req.user?._id);
      }

      res.send(204);
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
      const checkEmail = await UsersModel.findOne({ email: req.body.email });
      if (checkEmail) {
        next(
          createHttpError(404, `Email ${req.body.email} is already in use!`)
        );
      } else {
        const newNative = { ...req.body, native: true };
        const newUser = new UsersModel(newNative);
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

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  (req: any, res: Response, next: NextFunction) => {
    try {
      res.cookie("accessToken", req.user!.accessToken);
      res.redirect(`${process.env.FE_PROD_URL}`);
    } catch (error) {
      next(error);
    }
  }
);

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "Games-over",
    } as Params,
  }),
}).single("avatar");

usersRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req: any, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(
        req.user!._id,
        { ...req.body, avatar: req.file.path },
        { new: true, runValidators: true }
      );
      // avatar: req.file.path
      res.send({ user });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/me/background",
  JWTAuthMiddleware,
  async (req: any, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(
        { _id: req.user!._id },
        { $set: { background: req.body.bgLink } },
        { new: true, runValidators: true }
      );
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
