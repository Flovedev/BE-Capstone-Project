"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBadRequest = exports.checkOversSchema = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_validator_1 = require("express-validator");
const overSchema = {
    id: {
        in: "body",
        isNumeric: {
            errorMessage: "id is a mandatory field and needs to be a number!",
        },
    },
    name: {
        in: "body",
        isString: {
            errorMessage: "name is a mandatory field and needs to be a string!",
        },
    },
    cover: {
        in: "body",
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "cover is a mandatory field and needs to be a string!",
        },
    },
    rating: {
        in: "body",
        optional: { options: { nullable: true } },
        isNumeric: {
            errorMessage: "rating is a mandatory field and needs to be a number!",
        },
    },
    release_date: {
        in: "body",
        optional: { options: { nullable: true } },
        isString: {
            errorMessage: "release_date is a mandatory field and needs to be a string!",
        },
    },
    platforms: {
        in: "body",
        optional: { options: { nullable: true } },
        isArray: {
            errorMessage: "platforms is a mandatory field and needs to be an array!",
        },
    },
    genres: {
        in: "body",
        optional: { options: { nullable: true } },
        isArray: {
            errorMessage: "genres is a mandatory field and needs to be an array!",
        },
    },
};
exports.checkOversSchema = (0, express_validator_1.checkSchema)(overSchema);
const generateBadRequest = (request, response, next) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (errors.isEmpty()) {
        next();
    }
    else {
        next((0, http_errors_1.default)(400, "Errors during over validation", {
            errorsList: errors.array(),
        }));
    }
};
exports.generateBadRequest = generateBadRequest;
