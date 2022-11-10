"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videos_1 = require("./routes/videos");
const app = (0, express_1.default)();
const port = 3500;
app.use(express_1.default.json());
// routes
app.use("/videos", videos_1.videoRouter);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
