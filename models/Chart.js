const mongoose = require('mongoose');

const chart = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    unique: true
  },
  redditURL: {
    type: String,
    required: true,
    unique: true
  },
  fullChartURL: {
    type: Array,
    required: false
  },
  songData: {
    type: String,
    required: false
  },
  albumData: {
    type: String,
    required: false
  },
  fullChart: {
    type: Array,
    required: false
  },
  fullChartHTML: {
    type: String,
    required: false
  },
  artists: {
    type: Array,
    required: false
  }
})

const Chart = mongoose.model("Chart", chart)
module.exports = Chart;