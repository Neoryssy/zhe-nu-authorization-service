import 'dotenv/config'

import express from 'express'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import logger from 'morgan'

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI!, {
  user: 'service',
  pass: 'pass'
})

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
