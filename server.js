import express from 'express'
import dotenv from "dotenv"
import { dbConnection } from './database/dbConnection.js'
import morgan from "morgan"
import cors from 'cors'
import { init } from './src/index.routes.js'
dotenv.config()
const app = express()
const port = 3000


//middleware
app.use(express.json())
app.use(morgan("dev"))

app.use(express.static('uploads'))
app.use(cors())

init(app)

dbConnection()
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))

process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection", err);
})
