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
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const igdbRouter = express_1.default.Router();
igdbRouter.get("/genres", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/genres", "fields: *; limit: 50; sort name asc;", {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
igdbRouter.get("/genre/:genreId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/games", `fields: name, cover.url, rating, release_dates.human, artworks.url, screenshots.url, genres.name, involved_companies.company.name, involved_companies.*, language_supports.language.name, platforms.abbreviation, platforms.name, platforms.platform_logo.url, similar_games.name, similar_games.cover.url, similar_games.rating, summary, videos.name, videos.video_id;
        where genres = (${req.params.genreId}) & rating > 1;
        sort rating desc;
        limit 50;`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
igdbRouter.get("/platform/:platformId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/games", `fields: name, cover.url, rating, release_dates.human, artworks.url, screenshots.url, genres.name, involved_companies.company.name, involved_companies.*, language_supports.language.name, platforms.abbreviation, platforms.name, platforms.platform_logo.url, similar_games.name, similar_games.cover.url, similar_games.rating, summary, videos.name, videos.video_id;
        where platforms = (${req.params.platformId}) & rating > 1;
        sort rating desc;
        limit 50;`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
igdbRouter.get("/platforms", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/platforms", "fields: name, platform_logo.url; limit: 200; sort name asc;", {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
igdbRouter.get("/:where/search/:what", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/" + req.params.where, `fields: name, cover.url, rating, release_dates.human, artworks.url, screenshots.url, genres.name, involved_companies.company.name, involved_companies.*, language_supports.language.name, platforms.abbreviation, platforms.name, platforms.platform_logo.url, similar_games.name, similar_games.cover.url, similar_games.rating, summary, videos.name, videos.video_id;
        search: "${req.params.what}";
        limit: 200;`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
igdbRouter.get("/game/:gameId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/games", `fields: name, cover.url, rating, release_dates.human, artworks.url, screenshots.url, genres.name, involved_companies.company.name, involved_companies.*, language_supports.language.name, platforms.abbreviation, platforms.name, platforms.platform_logo.url, similar_games.name, similar_games.cover.url, similar_games.rating, summary, videos.name, videos.video_id;
        where id = ${req.params.gameId};`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
igdbRouter.get("/discover", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(process.env.IGDB_URL + "/games", `fields: name, cover.url, rating, release_dates.human, artworks.url, screenshots.url, genres.name, involved_companies.company.name, involved_companies.*, language_supports.language.name, platforms.abbreviation, platforms.name, platforms.platform_logo.url, similar_games.name, similar_games.cover.url, similar_games.rating, summary, videos.name, videos.video_id;
      where release_dates.date >= 1672534861 & rating > 90;
      sort rating desc;
      limit 5;`, {
            headers: {
                "Client-ID": process.env.CLIENT_ID,
                Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = igdbRouter;
