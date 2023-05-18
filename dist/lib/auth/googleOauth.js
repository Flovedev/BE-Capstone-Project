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
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const model_1 = __importDefault(require("../../api/users/model"));
const tools_1 = require("./tools");
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_DEV_URL}/users/googleRedirect`,
}, (_, __, profile, passportNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, sub } = profile._json;
        //   console.log("PROFILE:", profile);
        const user = yield model_1.default.findOne({ email });
        if (user) {
            const accessToken = yield (0, tools_1.createAccessToken)({
                _id: user._id,
            });
            passportNext(null, { accessToken });
        }
        else {
            const newUser = new model_1.default({
                username: name,
                email,
                googleId: sub,
            });
            const createdUser = yield newUser.save();
            const accessToken = yield (0, tools_1.createAccessToken)({
                _id: createdUser._id,
            });
            passportNext(null, { accessToken });
        }
    }
    catch (error) {
        passportNext(error);
    }
}));
exports.default = googleStrategy;
