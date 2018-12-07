const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
mongoose.connect(process.env.MONGODB_URI)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.redirect(302, 'https://github.com/zanedb/micro')
})

app.use('/read-receipts', require('./app/controllers/readReceipts'))
app.get('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
