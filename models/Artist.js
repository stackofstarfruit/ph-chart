const mongoose = require('mongoose');

const artist = new mongoose.Schema({
  tickerindex: {
    type: String,
    unique: true,
    required: true
  },
  ticker: {
    type: String,
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
  },
  lastFiveWeeks: {
    type: Array,
    required: false
  },
  totalRank: {
    type: Number,
    required: false,
  },
  totalPoints: {
    type: Number,
    required: false,
  }
})

const Artist = mongoose.model("Artist", artist)
module.exports = Artist;