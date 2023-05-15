"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OversModel = void 0;
const mongoose_1 = require("mongoose");
const OversSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    cover: { type: String, required: true },
    rating: { type: String, required: true },
}, { timestamps: true });
const OversModel = (0, mongoose_1.model)("Over", OversSchema);
exports.OversModel = OversModel;
