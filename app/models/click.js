const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const ClickSchema = new Schema({
  timestamp: String,
  ip: String,
  userAgent: String,
  geo: Object,
  itemId: String
})

module.exports = mongoose.model('Click', ClickSchema)
