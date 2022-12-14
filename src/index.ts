import express from "express"
import {videoRouter} from "./routes/videos";

const app = express()
const port = 3500

// app.use()
app.use(express.json())

// routes
app.use("/testing", videoRouter)
app.use("/videos", videoRouter)

app.listen(port, ()=> {
    console.log(`Example app listening on port ${port}`)
})