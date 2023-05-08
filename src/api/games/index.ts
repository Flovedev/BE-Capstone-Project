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
      const { _id, name, cover, rating } = req.body;
      const newFavourite: IOver = new OversModel({
        _id,
        name,
        cover,
        rating,
      });

      const checkFavourite = await UsersModel.findOne({
        _id: req.user!._id,
        "games.favourites": { $elemMatch: { _id: newFavourite._id } },
      });

      if (!checkFavourite) {
        await UsersModel.findByIdAndUpdate(
          { _id: req.user!._id },
          { $push: { "games.favourites": newFavourite } },
          { new: true, runValidators: true }
        );

        res.send({
          message: `Game with id ${newFavourite._id} added to favourites`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          { _id: req.user!._id },
          { $pull: { "games.favourites": { _id: newFavourite._id } } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newFavourite._id} removed from favourites`,
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
      const { _id, name, cover, rating } = req.body;
      const newOver: IOver = new OversModel({
        _id,
        name,
        cover,
        rating,
      });

      const checkOver = await UsersModel.findOne({
        _id: req.user!._id,
        "games.over": { $elemMatch: { _id: newOver._id } },
      });

      if (!checkOver) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          {
            $push: { "games.over": newOver },
            $pull: { "games.pending": { _id: newOver._id } },
          },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newOver._id} added to over`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.over": { _id: newOver._id } } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newOver._id} removed from over`,
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
      const { _id, name, cover, rating } = req.body;
      const newPending: IOver = new OversModel({
        _id,
        name,
        cover,
        rating,
      });

      const checkPending = await UsersModel.findOne({
        _id: req.user!._id,
        "games.pending": { $elemMatch: { _id: newPending._id } },
      });

      if (!checkPending) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          {
            $push: { "games.pending": newPending },
            $pull: { "games.over": { _id: newPending._id } },
          },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newPending._id} added to pending`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.pending": { _id: newPending._id } } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${newPending._id} removed from pending`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default gamesRouter;
