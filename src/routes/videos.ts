import {Request, Response, Router} from "express"
import addDays from 'date-fns/addDays'

export const videoRouter = Router({})

let videos: IVideo[] = []

const availableResolutionsArr: string[] = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
const dateNow = new Date()

interface IVideo {
	id: number,
	title: string,
	author: string,
	canBeDownloaded: boolean,
	minAgeRestriction: null | number,
	createdAt: string,
	publicationDate: string,
	availableResolutions: string[],
}

enum IResolutions {
	P144 = "P144",
	P240 = "P240",
	P360 = "P360",
	P480 = "P480",
	P720 = "P720",
	P1080 = "P1080",
	P1440 = "P1440",
	P2160 = "P2160"
}


// testing
videoRouter.delete("/all-data", (req, res) => {
	videos = []
	// return res.status(204).send()
	// return res.send(204)
	return res.sendStatus(204)
})
// actual routers
videoRouter.get("/", (req: Request, res: Response<IVideo[]>) => {
	res.status(200).send(videos)
	return
})
videoRouter.post("/", (req: Request<{}, {}, { title: string, author: string, availableResolutions: string[], minAgeRestriction?: number, publicationDate?:string, canBeDownloaded?:boolean }>, res: Response) => {
	let errorsMessages: { message: string, field: string }[] = []
	const {title, author, availableResolutions, minAgeRestriction, publicationDate, canBeDownloaded} = req.body
	availableResolutions.map((value, index) => {
		if (!availableResolutionsArr.includes(value)) {
			errorsMessages.push({
				message: "You did not provide correct resolution",
				field: "availableResolutions"
			})
		}
	})

	if (!title || title.length > 40 || title.trim().length === 0 || typeof title !== "string") {

		errorsMessages.push(
			{
				message: "You don't have title or the title is incorrect",
				field: "title"
			}
		)

	}

	if (!author || author.length > 20 || author.trim().length === 0 || typeof author !== "string") {
		errorsMessages.push(
			{
				message: "You don't have author or author is incorrect",
				field: "author"
			})
	}

	if (!availableResolutions || availableResolutions.length > availableResolutionsArr.length  || availableResolutions.length === 0) {
		errorsMessages.push(
			{
				message: "You don't have availableResolutions",
				field: "availableResolutions"
			})
	}


	if (errorsMessages.length >= 1) {
		res.status(400).send({errorsMessages: errorsMessages})
		return
	}

	const newVideo: IVideo = {
		id: videos.length,
		title,
		author,
		canBeDownloaded: canBeDownloaded || false,
		minAgeRestriction: minAgeRestriction || null,
		createdAt: dateNow.toISOString(),
		publicationDate: publicationDate || addDays(dateNow, 1).toISOString(),
		availableResolutions,
	}

	videos.push(newVideo)

	res.status(201).send(newVideo)
})
videoRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
	const foundVideo = videos.find((video) => {
		return video.id === +req.params.id
	})

	if (!foundVideo) {
		return res.sendStatus(404)
	} else {
		return res.status(200).send(foundVideo)
	}
})
videoRouter.put("/:id", (req: Request<{ id: string }, {}, { title: string, author: string, availableResolutions: string[], canBeDownloaded: boolean, minAgeRestriction: number, publicationDate: string }>, res: Response) => {
	const {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
	let errorsMessages: { message: string, field: string }[] = []
	let video = videos.find((video) => {
		return video.id === +req.params.id
	})
	if (!video) {
		return res.sendStatus(404)
	}

	availableResolutions.map((value, index) => {
		if (!availableResolutionsArr.includes(value)) {
			errorsMessages.push({
				message: "You did not provide correct resolution",
				field: "availableResolutions"
			})
		}
	})


	if (!title || title.length > 40 || title.trim().length === 0 || typeof title !== "string") {

		errorsMessages.push(
			{
				message: "You don't have title or the title is incorrect",
				field: "title"
			}
		)

	}

	if (!author || author.length > 20 || author.trim().length === 0 || typeof author !== "string") {
		errorsMessages.push(
			{
				message: "You don't have author or author is incorrect",
				field: "author"
			})
	}

	if (!availableResolutions || availableResolutions.length > availableResolutionsArr.length  || availableResolutions.length === 0) {
		errorsMessages.push(
			{
				message: "You don't have availableResolutions",
				field: "availableResolutions"
			})
	}


	if (!minAgeRestriction || minAgeRestriction < 1 || minAgeRestriction > 18 || typeof minAgeRestriction !== "number") {

		errorsMessages.push(
			{
				message: "I know you cant test this -_-",
				field: "minAgeRestriction"
			}
		)

	}

	if(!publicationDate || typeof publicationDate !== "string") {
	errorsMessages.push(
		{
			message: "Это самурайский бекенннннннд",
			field: "publicationDate"
		}
	)
	}

	if(typeof canBeDownloaded !== "boolean") {
		errorsMessages.push(
			{
				message: "Это самурайский бекенннннннд!",
				field: "canBeDownloaded"
			}
		)
	}

	if (errorsMessages.length >= 1) {
		return res.status(400).send({errorsMessages: errorsMessages})
	}

	    video.title = title
		video.author = author
		video.availableResolutions = availableResolutions
		video.canBeDownloaded = canBeDownloaded
		video.minAgeRestriction = minAgeRestriction
		video.publicationDate = publicationDate
		res.status(204).send(video)


})
videoRouter.delete("/:id", (req: Request<{ id: string }>, res: Response) => {

	const videoId = +req.params.id

	// if (!videoId) {
	// 	return res.sendStatus(404)
	// }

	const newVideos = videos.filter((video) => {
		return video.id !== videoId
	})

	if (newVideos.length < videos.length) {
		videos = newVideos
		return res.sendStatus(204)
	} else {
		return res.sendStatus(404)
	}

})

