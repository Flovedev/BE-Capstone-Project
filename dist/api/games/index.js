"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_1 = __importDefault(require("../users/model"));
const model_2 = require("./model");
const jwt_1 = require("../../lib/auth/jwt");
const validation_1 = require("./validation");
const gamesRouter = express_1.default.Router();
gamesRouter.post("/favourites", jwt_1.JWTAuthMiddleware, validation_1.checkOversSchema, validation_1.generateBadRequest, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, cover, rating, release_date, platforms, genres } = req.body;
        const newFavourite = new model_2.OversModel({
            id,
            name,
            cover,
            rating,
            release_date,
            platforms,
            genres,
        });
        const checkFavourite = yield model_1.default.findOne({
            _id: req.user._id,
            "games.favourites": { $elemMatch: { id: newFavourite.id } },
        });
        if (!checkFavourite) {
            yield model_1.default.findByIdAndUpdate({ _id: req.user._id }, { $push: { "games.favourites": newFavourite } }, { new: true, runValidators: true });
            res.send({
                message: `Game with id ${newFavourite.id} added to favourites`,
            });
        }
        else {
            yield model_1.default.findByIdAndUpdate({ _id: req.user._id }, { $pull: { "games.favourites": { id: newFavourite.id } } }, { new: true, runValidators: true });
            res.send({
                message: `Game with id ${newFavourite.id} removed from favourites`,
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
gamesRouter.post("/over", jwt_1.JWTAuthMiddleware, validation_1.checkOversSchema, validation_1.generateBadRequest, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, cover, rating, release_date, platforms, genres } = req.body;
        const newOver = new model_2.OversModel({
            id,
            name,
            cover,
            rating,
            release_date,
            platforms,
            genres,
        });
        const checkOver = yield model_1.default.findOne({
            _id: req.user._id,
            "games.over": { $elemMatch: { id: newOver.id } },
        });
        if (!checkOver) {
            yield model_1.default.findByIdAndUpdate(req.user._id, {
                $push: { "games.over": newOver },
                $pull: { "games.pending": { id: newOver.id } },
            }, { new: true, runValidators: true });
            res.send({
                message: `Game with id ${newOver.id} added to over`,
            });
        }
        else {
            yield model_1.default.findByIdAndUpdate(req.user._id, { $pull: { "games.over": { id: newOver.id } } }, { new: true, runValidators: true });
            res.send({
                message: `Game with id ${newOver.id} removed from over`,
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
gamesRouter.post("/pending", jwt_1.JWTAuthMiddleware, validation_1.checkOversSchema, validation_1.generateBadRequest, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, cover, rating, release_date, platforms, genres } = req.body;
        const newPending = new model_2.OversModel({
            id,
            name,
            cover,
            rating,
            release_date,
            platforms,
            genres,
        });
        const checkPending = yield model_1.default.findOne({
            _id: req.user._id,
            "games.pending": { $elemMatch: { id: newPending.id } },
        });
        if (!checkPending) {
            yield model_1.default.findByIdAndUpdate(req.user._id, {
                $push: { "games.pending": newPending },
                $pull: { "games.over": { id: newPending.id } },
            }, { new: true, runValidators: true });
            res.send({
                message: `Game with id ${newPending.id} added to pending`,
            });
        }
        else {
            yield model_1.default.findByIdAndUpdate(req.user._id, { $pull: { "games.pending": { id: newPending.id } } }, { new: true, runValidators: true });
            res.send({
                message: `Game with id ${newPending.id} removed from pending`,
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = gamesRouter;
