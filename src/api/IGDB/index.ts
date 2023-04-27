import axios from "axios";
import AxiosResponse from "axios";
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
        { fields: "*" },
        {
          headers: {
            "Client-ID": process.env.CLIENT_ID,
            Authorization: `Baerer ${process.env.ADMIN_TOKEN}`,
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
