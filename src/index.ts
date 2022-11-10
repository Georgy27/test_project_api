import express from "express"
import {videoRouter} from "./routes/videos";

const app = express()
const port = 3500

app.use(express.json())

// routes
app.use("/api/videos", videoRouter)

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}`)
})