"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBadRequest = exports.checkUserSchema = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_validator_1 = require("express-validator");
const userSchema = {
    username: {
        in: "body",
        isString: {
            errorMessage: "Username is a mandatory field and needs to be a string!",
        },
    },
    email: {
        in: "body",
        isString: {
            errorMessage: "Email is a mandatory field and needs to be a string!",
        },
    },
    password: {
        in: "body",
        isString: {
            errorMessage: "Password is a mandatory field and needs to be a string!",
        },
    },
};
exports.checkUserSchema = (0, express_validator_1.checkSchema)(userSchema);
const generateBadRequest = (request, response, next) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (errors.isEmpty()) {
        next();
    }
    else {
        next((0, http_errors_1.default)(400, "Errors during user validation", {
            errorsList: errors.array(),
        }));
    }
};
exports.generateBadRequest = generateBadRequest;
