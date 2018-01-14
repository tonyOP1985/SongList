const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create Schema
const SongSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  songKey: {
    type: String,
    require: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('songs', SongSchema)