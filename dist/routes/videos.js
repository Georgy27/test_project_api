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
    videos = [];
    // return res.status(204).send()
    // return res.send(204)
    return res.sendStatus(204);
});
// actual routers
exports.videoRouter.get("/", (req, res) => {
    res.status(200).send(videos);
    return;
});
exports.videoRouter.post("/", (req, res) => {
    let errorsMessages = [];
    const { title, author, availableResolutions } = req.body;
    availableResolutions.map((value, index) => {
        if (!availableResolutionsArr.includes(value)) {
            errorsMessages.push({
                message: "You did not provide correct resolution",
                field: "resolution"
            });
        }
    });
    if (!title || title.length > 40) {
        errorsMessages.push({
            message: "You don't have title or the title is incorrect",
            field: "title"
        });
    }
    if (!author || author.length > 20) {
        errorsMessages.push({
            message: "You don't have author or author is incorrect",
            field: `${author}`
        });
    }
    if (!availableResolutions || availableResolutions.length === 0) {
        errorsMessages.push({
            message: "You don't have availableResolutions",
            field: "availableResolutions"
        });
    }
    if (errorsMessages.length > 1) {
        return res.status(400).send(errorsMessages);
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
        return res.sendStatus(404);
    }
    else {
        return res.status(200).send(foundVideo);
    }
});
exports.videoRouter.put("/:id", (req, res) => {
    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    let errorsMessages = [];
    let video = videos.find((video) => {
        return video.id === +req.params.id;
    });
    if (!video) {
        return res.status(404);
    }
    availableResolutions.map((value, index) => {
        if (!availableResolutionsArr.includes(value)) {
            errorsMessages.push({
                message: "You did not provide correct resolution",
                field: "resolution"
            });
        }
    });
    if (!title || title.length > 40) {
        errorsMessages.push({
            message: "You don't have title or the title is incorrect",
            field: "title"
        });
    }
    if (!author || author.length > 20) {
        errorsMessages.push({
            message: "You don't have author or author is incorrect",
            field: `${author}`
        });
    }
    if (!availableResolutions || availableResolutions.length === 0) {
        errorsMessages.push({
            message: "You don't have availableResolutions",
            field: "availableResolutions"
        });
    }
    if (!minAgeRestriction || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errorsMessages.push({
            message: "I know you cant test this -_-",
            field: "minAgeRestriction"
        });
    }
    if (!publicationDate) {
        errorsMessages.push({
            message: "Это самурайский бекенннннннд",
            field: "publicationDate"
        });
    }
    if (errorsMessages.length > 1) {
        return res.status(400).send(errorsMessages);
    }
    video.title = title;
    video.author = author;
    video.availableResolutions = availableResolutions;
    video.canBeDownloaded = canBeDownloaded;
    video.minAgeRestriction = minAgeRestriction;
    video.publicationDate = publicationDate;
    res.status(204).send(video);
});
exports.videoRouter.delete("/:id", (req, res) => {
    const videoId = +req.body.id;
    // if (!videoId) {
    // 	return res.sendStatus(404)
    // }
    const newVideos = videos.filter((video) => {
        return video.id !== videoId;
    });
    if (newVideos.length < videos.length) {
        videos = newVideos;
        return res.sendStatus(204);
    }
    else {
        return res.sendStatus(404);
    }
});
exports.default = videos;
