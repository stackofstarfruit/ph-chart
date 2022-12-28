const mongoose = require('mongoose');

const week = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: false,
    unique: true
  }
})

const Week = mongoose.model("Week", week)
module.exports = Week;