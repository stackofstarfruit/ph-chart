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
  rank: {
    type: Number,
    required: false,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  totalNumberOnes: {
    type: Number,
    required: true,
  },
  totalListeners: {
    type: Number,
    required: true,
  },
  pointsByWeek: {
    type: Array,
    required: true,
  },
  numberOnesByWeek: {
    type: Array,
    required: true,
  },
  listenersByWeek: {
    type: Array,
    required: true,
  }
})

const ArtistTotal = mongoose.model("ArtistTotals", artist)
module.exports = ArtistTotal;