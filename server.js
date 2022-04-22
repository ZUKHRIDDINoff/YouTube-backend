import express from 'express';
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import JOI from 'joi'
// import JWT from 'jsonwebtoken'

import modelMiddleware from './src/middleware/module.js'


const PORT = process.env.PORT || 8080
const app = express()

app.use(express.static(path.join(process.cwd(), 'src')))

app.use(modelMiddleware({
    databasePath: path.join(process.cwd(), 'src', 'database')
}))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.json())
app.use(cors())
app.use(fileUpload())
// app.use(fileUpload({
//     limits: {
//         fileSize: 1000000 
//     },
//     abortOnLimit: true
// }));
app.use(bodyParser.json())
app.use(userRouter)


import userRouter from './src/routers/user.js'














app.listen(PORT, () => {
    console.log('*' + PORT)
})