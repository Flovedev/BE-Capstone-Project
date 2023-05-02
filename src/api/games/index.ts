import Express from "express";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import UsersModel from "../users/model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";

const gamesRouter = Express.Router();

gamesRouter.post(
  "/favourites/:gameId",
  JWTAuthMiddleware,
  async (req: any, res, next) => {
    try {
      const checkFavourite = await UsersModel.findOne({
        _id: req.user!._id,
        "games.favourites": req.params.gameId,
      });

      if (!checkFavourite) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $push: { "games.favourites": req.params.gameId } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${req.params.gameId} added to favourites`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.favourites": req.params.gameId } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${req.params.gameId} removed from favourites`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

gamesRouter.post(
  "/over/:gameId",
  JWTAuthMiddleware,
  async (req: any, res, next) => {
    try {
      const checkOver = await UsersModel.findOne({
        _id: req.user!._id,
        "games.over": req.params.gameId,
      });

      if (!checkOver) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          {
            $push: { "games.over": req.params.gameId },
            $pull: { "games.pending": req.params.gameId },
          },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${req.params.gameId} added to over`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.over": req.params.gameId } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${req.params.gameId} removed from over`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

gamesRouter.post(
  "/pending/:gameId",
  JWTAuthMiddleware,
  async (req: any, res, next) => {
    try {
      const checkPending = await UsersModel.findOne({
        _id: req.user!._id,
        "games.pending": req.params.gameId,
      });

      if (!checkPending) {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          {
            $push: { "games.pending": req.params.gameId },
            $pull: { "games.over": req.params.gameId },
          },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${req.params.gameId} added to pending`,
        });
      } else {
        await UsersModel.findByIdAndUpdate(
          req.user!._id,
          { $pull: { "games.pending": req.params.gameId } },
          { new: true, runValidators: true }
        );
        res.send({
          message: `Game with id ${req.params.gameId} removed from pending`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default gamesRouter;
