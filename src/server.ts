import Express from "express";
import { createServer } from "http";
import cors from "cors";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import passport from "passport";
import igdbRouter from "./api/IGDB";
import usersRouter from "./api/users";
import gamesRouter from "./api/games";
import createHttpError from "http-errors";
// import googleStrategy from "./lib/auth/googleOauth";

const expressServer = Express();
const httpServer = createServer(expressServer);
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
// passport.use("google", googleStrategy);

//MIDDLEWARES
expressServer.use(
  cors({
    origin: (currentOrigin: any, corsNext: any) => {
      // corsNext(null, true);
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);
expressServer.use(Express.json());
expressServer.use(passport.initialize());

//ENDPOINTS
expressServer.use("/igdb", igdbRouter);
expressServer.use("/users", usersRouter);
expressServer.use("/games", gamesRouter);

//ERROR HANDLERS
expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);
expressServer.use(genericErrorHandler);

export { httpServer, expressServer };
