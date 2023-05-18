"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressServer = exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const errorHandlers_1 = require("./errorHandlers");
const passport_1 = __importDefault(require("passport"));
const IGDB_1 = __importDefault(require("./api/IGDB"));
const users_1 = __importDefault(require("./api/users"));
const games_1 = __importDefault(require("./api/games"));
const http_errors_1 = __importDefault(require("http-errors"));
const googleOauth_1 = __importDefault(require("./lib/auth/googleOauth"));
const expressServer = (0, express_1.default)();
exports.expressServer = expressServer;
const httpServer = (0, http_1.createServer)(expressServer);
exports.httpServer = httpServer;
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
passport_1.default.use("google", googleOauth_1.default);
//MIDDLEWARES
expressServer.use((0, cors_1.default)({
    origin: (currentOrigin, corsNext) => {
        // corsNext(null, true);
        if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
            corsNext(null, true);
        }
        else {
            corsNext((0, http_errors_1.default)(400, `Origin ${currentOrigin} is not in the whitelist!`));
        }
    },
}));
expressServer.use(express_1.default.json());
expressServer.use(passport_1.default.initialize());
//ENDPOINTS
expressServer.use("/igdb", IGDB_1.default);
expressServer.use("/users", users_1.default);
expressServer.use("/games", games_1.default);
//ERROR HANDLERS
expressServer.use(errorHandlers_1.badRequestHandler);
expressServer.use(errorHandlers_1.unauthorizedHandler);
expressServer.use(errorHandlers_1.forbiddenHandler);
expressServer.use(errorHandlers_1.notFoundHandler);
expressServer.use(errorHandlers_1.genericErrorHandler);
