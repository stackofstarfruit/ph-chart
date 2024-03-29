const mongoose = require('mongoose');

const artist = new mongoose.Schema({
  nameindex: {
    type: String,
    required: true,
    unique: true,
  },
  index: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  currentRank: {
    type: Number,
    required: false,
  },
  currentPoints: {
    type: Number,
    required: true,
  },
  currentNumberOnes: {
    type: Number,
    required: true,
  },
  currentListeners: {
    type: Number,
    required: true,
  },
  songs: {
    type: Array,
    required: true,
  }
})

const Artist = mongoose.model("Artist", artist)
module.exports = Artist;