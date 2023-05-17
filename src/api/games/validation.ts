import createHttpError from "http-errors";
import { RequestHandler } from "express";
import {
  checkSchema,
  Schema,
  Location,
  validationResult,
} from "express-validator";

const overSchema: Schema<"isString" | "in"> = {
  id: {
    in: "body" as Location,
    isNumeric: {
      errorMessage: "id is a mandatory field and needs to be a number!",
    },
  },
  name: {
    in: "body" as Location,
    isString: {
      errorMessage: "name is a mandatory field and needs to be a string!",
    },
  },
  cover: {
    in: "body" as Location,
    optional: { options: { nullable: true } },
    isString: {
      errorMessage: "cover is a mandatory field and needs to be a string!",
    },
  },
  rating: {
    in: "body" as Location,
    optional: { options: { nullable: true } },
    isNumeric: {
      errorMessage: "rating is a mandatory field and needs to be a number!",
    },
  },
  release_date: {
    in: "body" as Location,
    optional: { options: { nullable: true } },
    isString: {
      errorMessage:
        "release_date is a mandatory field and needs to be a string!",
    },
  },
  platforms: {
    in: "body" as Location,
    optional: { options: { nullable: true } },
    isArray: {
      errorMessage: "platforms is a mandatory field and needs to be an array!",
    },
  },
  genres: {
    in: "body" as Location,
    optional: { options: { nullable: true } },
    isArray: {
      errorMessage: "genres is a mandatory field and needs to be an array!",
    },
  },
};

export const checkOversSchema = checkSchema(overSchema);

export const generateBadRequest: RequestHandler = (request, response, next) => {
  const errors = validationResult(request);
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during over validation", {
        errorsList: errors.array(),
      })
    );
  }
};
