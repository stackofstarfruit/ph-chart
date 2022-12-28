const mongoose = require('mongoose');

const artist = new mongoose.Schema({
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
    required: true,
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