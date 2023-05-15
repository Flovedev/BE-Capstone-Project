"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAccessToken = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, { expiresIn: "1 week" }, (err, token) => {
    if (err)
        reject(err);
    else
        resolve(token);
}));
exports.createAccessToken = createAccessToken;
const verifyAccessToken = (token) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err)
        reject(err);
    else
        resolve(payload);
}));
exports.verifyAccessToken = verifyAccessToken;
