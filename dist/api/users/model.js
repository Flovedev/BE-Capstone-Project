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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Schema, model } = mongoose_1.default;
const UsersSchema = new Schema({
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: false },
    avatar: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
    },
    background: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/GOODS_South_field.jpg/1024px-GOODS_South_field.jpg",
    },
    games: {
        favourites: [
            {
                id: Number,
                name: String,
                cover: String,
                rating: String,
            },
        ],
        pending: [
            {
                id: Number,
                name: String,
                cover: String,
                rating: String,
            },
        ],
        over: [
            {
                id: Number,
                name: String,
                cover: String,
                rating: String,
            },
        ],
    },
    social: {
        sent: { type: [String], default: [] },
        pending: { type: [String], default: [] },
        friends: { type: [String], default: [] },
    },
}, { timestamps: true });
UsersSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const newUserData = this;
        if (newUserData.isModified("password")) {
            const plainPW = newUserData.password;
            const hash = yield bcrypt_1.default.hash(plainPW, 11);
            newUserData.password = hash;
        }
    });
});
UsersSchema.methods.toJSON = function () {
    const currentUserDocument = this;
    const currentUser = currentUserDocument.toObject();
    delete currentUser.password;
    delete currentUser.createdAt;
    delete currentUser.updatedAt;
    delete currentUser.__v;
    const games = currentUser.games;
    delete currentUser.games;
    const friends = currentUser.friends;
    delete currentUser.friends;
    currentUser.games = games;
    currentUser.friends = friends;
    return currentUser;
};
UsersSchema.static("checkCredentials", function (email, plainPW) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (user) {
            const passwordMatch = yield bcrypt_1.default.compare(plainPW, user.password);
            if (passwordMatch) {
                return user;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
});
exports.default = model("user", UsersSchema);
