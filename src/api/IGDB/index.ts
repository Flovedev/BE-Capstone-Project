import axios from "axios";
import Express from "express";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const igdbRouter = Express.Router();

igdbRouter.get(
  "/genres",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.post(
        process.env.IGDB_URL + "/genres",
        "fields: *; limit: 100;",
        {
          headers: {
            "Client-ID": process.env.CLIENT_ID,
            Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  }
);

igdbRouter.get(
  "/platforms",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.post(
        process.env.IGDB_URL + "/platforms",
        "fields: name, platform_logo.url; limit: 200; sort name asc;",
        {
          headers: {
            "Client-ID": process.env.CLIENT_ID,
            Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  }
);

igdbRouter.get(
  "/:where/search/:what",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.post(
        process.env.IGDB_URL + "/" + req.params.where,
        `fields: *; search: "${req.params.what}"; limit: 200;`,
        {
          headers: {
            "Client-ID": process.env.CLIENT_ID,
            Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  }
);

export default igdbRouter;
