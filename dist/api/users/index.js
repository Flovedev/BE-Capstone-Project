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
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const model_1 = __importDefault(require("./model"));
const validation_1 = require("./validation");
const tools_1 = require("../../lib/auth/tools");
const jwt_1 = require("../../lib/auth/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const passport_1 = __importDefault(require("passport"));
const usersRouter = express_1.default.Router();
usersRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_1.default.find();
        res.send(users);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/me", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findById(req.user._id);
        res.send(user);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.put("/me", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = (yield model_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true }));
        if (!updatedUser) {
            next((0, http_errors_1.default)(404, `User with id ${req.user._id} not found!`));
        }
        Object.keys(req.body).forEach((key) => {
            if (key !== "password") {
                updatedUser[key] = req.body[key];
            }
        });
        if (req.body.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
            // console.log("hashed pass", hashedPassword);
            updatedUser.password = hashedPassword;
        }
        const savedUser = yield updatedUser.save();
        res.send(savedUser);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.delete("/me", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield model_1.default.findById(req.user._id);
        if (!user) {
            next((0, http_errors_1.default)(404, `User doesn't exist.`));
        }
        else {
            yield model_1.default.findByIdAndDelete((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        }
        res.send(204);
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/session", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_1.default.checkCredentials(email, password);
        if (user) {
            const payload = { _id: user._id };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            res.send({ accessToken, user });
        }
        else {
            next((0, http_errors_1.default)(401, "Credentials are not valid."));
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/account", validation_1.checkUserSchema, validation_1.generateBadRequest, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkEmail = yield model_1.default.findOne({ email: req.body.email });
        if (checkEmail) {
            next((0, http_errors_1.default)(404, `Email ${req.body.email} is already in use!`));
        }
        else {
            const newUser = new model_1.default(req.body);
            const { _id } = yield newUser.save();
            const payload = { _id: _id };
            const accessToken = yield (0, tools_1.createAccessToken)(payload);
            res.status(201).send({ user: newUser, accessToken: accessToken });
        }
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.get("/googleLogin", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
usersRouter.get("/googleRedirect", passport_1.default.authenticate("google", { session: false }), (req, res, next) => {
    try {
        res.cookie("accessToken", req.user.accessToken);
        res.redirect(`${process.env.FE_DEV_URL}`);
    }
    catch (error) {
        next(error);
    }
});
const cloudinaryUploader = (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage({
        cloudinary: cloudinary_1.v2,
        params: {
            folder: "Games-over",
        },
    }),
}).single("avatar");
usersRouter.post("/me/avatar", jwt_1.JWTAuthMiddleware, cloudinaryUploader, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findByIdAndUpdate(req.user._id, Object.assign(Object.assign({}, req.body), { avatar: req.file.path }), { new: true, runValidators: true });
        // avatar: req.file.path
        res.send({ user });
    }
    catch (error) {
        next(error);
    }
}));
usersRouter.post("/me/background", jwt_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_1.default.findByIdAndUpdate({ _id: req.user._id }, { $set: { background: req.body.bgLink } }, { new: true, runValidators: true });
        res.send(user);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = usersRouter;
