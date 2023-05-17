import Express from "express";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import UsersModel from "../users/model";
import { OversModel, IOver } from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { checkOversSchema, generateBadRequest } from "./validation";

const gamesRouter = Express.Router();

gamesRouter.post(
  "/favourites",
  JWTAuthMiddleware,
  checkOversSchema,
  generateBadRequest,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id, name, cover, rating, release_date, platforms, genres } =
        req.body;
      const newFavourite: IOver = new OversModel({
        id,
        name,
        cover,
        rating,
        release_date,
        platforms,
        genres,
      });

      const checkFavourite = await UsersModel.findOne({
        _id: req.user!._id,
        "games.favourites": { $elemMatch: { id: newFavourite.id } },
      });

      if (!checkFavourite) {
        await UsersModel.findByIdAndUpdate(
          { _id: req.user!._id },
          { $push: { "games.favourites": newFavourite } },
          { new: true, runValidators: true }
        );

        res.send({
          message: `Game with id ${newFavourite.id} added to favourites`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          { _id: req.user!._id },
          { $pull: { "games.favourites": { id: newFavourite.id } } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newFavourite.id} removed from favourites`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

gamesRouter.post(
  "/over",
  JWTAuthMiddleware,
  checkOversSchema,
  generateBadRequest,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id, name, cover, rating, release_date, platforms, genres } =
        req.body;
      const newOver: IOver = new OversModel({
        id,
        name,
        cover,
        rating,
        release_date,
        platforms,
        genres,
      });

      const checkOver = await UsersModel.findOne({
        _id: req.user!._id,
        "games.over": { $elemMatch: { id: newOver.id } },
      });

      if (!checkOver) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          {
            $push: { "games.over": newOver },
            $pull: { "games.pending": { id: newOver.id } },
          },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newOver.id} added to over`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.over": { id: newOver.id } } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newOver.id} removed from over`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

gamesRouter.post(
  "/pending",
  JWTAuthMiddleware,
  checkOversSchema,
  generateBadRequest,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id, name, cover, rating, release_date, platforms, genres } =
        req.body;
      const newPending: IOver = new OversModel({
        id,
        name,
        cover,
        rating,
        release_date,
        platforms,
        genres,
      });

      const checkPending = await UsersModel.findOne({
        _id: req.user!._id,
        "games.pending": { $elemMatch: { id: newPending.id } },
      });

      if (!checkPending) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          {
            $push: { "games.pending": newPending },
            $pull: { "games.over": { id: newPending.id } },
          },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newPending.id} added to pending`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.pending": { id: newPending.id } } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newPending.id} removed from pending`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default gamesRouter;
