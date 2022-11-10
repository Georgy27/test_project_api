"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouter = void 0;
const express_1 = require("express");
const addDays_1 = __importDefault(require("date-fns/addDays"));
exports.videoRouter = (0, express_1.Router)({});
let videos = [];
const availableResolutionsArr = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const dateNow = new Date();
var IResolutions;
(function (IResolutions) {
    IResolutions["P144"] = "P144";
    IResolutions["P240"] = "P240";
    IResolutions["P360"] = "P360";
    IResolutions["P480"] = "P480";
    IResolutions["P720"] = "P720";
    IResolutions["P1080"] = "P1080";
    IResolutions["P1440"] = "P1440";
    IResolutions["P2160"] = "P2160";
})(IResolutions || (IResolutions = {}));
// testing
exports.videoRouter.delete("/all-data", (req, res) => {
    console.log("hello there");
    videos = [];
    return res.status(204);
});
// actual routers
exports.videoRouter.get("/", (req, res) => {
    res.status(200).send(videos);
    return;
});
exports.videoRouter.post("/", (req, res) => {
    const { title, author, availableResolutions } = req.body;
    availableResolutions.map((value, index) => {
        if (!availableResolutionsArr.includes(value)) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "You did not provide correct resolution",
                        field: "resolution"
                    }
                ]
            });
            return;
        }
    });
    if (!title || typeof title !== "string" || title.length > 40 || !author || typeof author !== "string" || author.length > 20 || !availableResolutions || availableResolutions.length === 0) {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "You don't have title or author or you didnt provide resolution",
                    field: "title or author or resolution"
                }
            ]
        });
        return;
    }
    const newVideo = {
        id: videos.length,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: dateNow.toISOString(),
        publicationDate: (0, addDays_1.default)(dateNow, 1).toISOString(),
        availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videoRouter.get("/:id", (req, res) => {
    const foundVideo = videos.find((video) => {
        return video.id === +req.params.id;
    });
    if (!foundVideo) {
        return res.status(404);
    }
    else {
        return res.status(200).send(foundVideo);
    }
});
exports.videoRouter.put("/:id", (req, res) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    let video = videos.find((video) => {
        return video.id === +req.params.id;
    });
    if (!video) {
        return res.status(404);
    }
    availableResolutions.map((value, index) => {
        if (!availableResolutionsArr.includes(value)) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "You did not provide correct resolution",
                        field: "resolution"
                    }
                ]
            });
            return;
        }
    });
    if (!title || typeof title !== "string" || title.length > 40 || !author || typeof author !== "string" || author.length > 20 || !availableResolutions || availableResolutions.length === 0 || typeof canBeDownloaded !== "boolean"
        || !minAgeRestriction || typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18 || !publicationDate || typeof publicationDate !== "string") {
        res.status(400).send({
            errorsMessages: [
                {
                    message: "You don't have title or author or you didnt provide resolution",
                    field: "title or author or resolution"
                }
            ]
        });
        return;
    }
    else {
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;
        video.canBeDownloaded = canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction;
        video.publicationDate = publicationDate;
        res.status(204).send(video);
    }
});
exports.videoRouter.delete("/:id", (req, res) => {
    const videoId = +req.body.id;
    if (!videoId || videos.length === 0) {
        return res.status(404);
    }
    const newVideos = videos.filter((video) => {
        return video.id !== videoId;
    });
    if (newVideos.length < videos.length) {
        videos = newVideos;
        return res.status(204);
    }
    else {
        return res.status(404);
    }
});
exports.default = videos;
