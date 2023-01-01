"use strict";

const ChartModel = require('../models/Chart');
const { storeArtist } = require("./storeArtist");

async function addArtist(index, ticker, name) {
  ChartModel.findOne({index: index}, async (err, docs) => {
    let fullChartURL = docs.fullChartURL[0];
    fullChartURL = fullChartURL.replace(/\/p\//, "/r/");
    fullChartURL = fullChartURL.replace(/pastebin.com\//, "pastebin.com\/raw\/");
    if (fullChartURL && (fullChartURL.includes("pastebin") || fullChartURL.includes("paste.ee"))) {
      await fetch(fullChartURL)
        .then(res => res.text())
        .then(res => storeArtist(res, ticker, name, index));
    }
  });
}
exports.addArtist = addArtist;