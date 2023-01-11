/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";

const ChartModel = require('../models/Chart');
const { CSVtoHTML } = require('../methods/CSVtoHTML');
const { storeArtistWeek } = require('../methods/storeArtistWeek');

async function storeFullChart(index) {
  console.log(index);
  ChartModel.findOne({index: index}, async (err, docs) => {
    if (docs.fullChartURL && docs.fullChartURL[0] && (docs.fullChartURL[0].includes("pastebin") || docs.fullChartURL[0].includes("paste.ee"))) {
      console.log(index);
      let fullChartURL = docs.fullChartURL[0].replace(/\/p\//, "/r/");
      fullChartURL = fullChartURL.replace(/pastebin.com\//, "pastebin.com\/raw\/");
      await fetch(fullChartURL)
        .then(res => res.text())
        .then(res => {
          let rows = res.split("\n");
          let titleInfo = "<h2><a href=" + docs.redditURL + ">" + docs.title + "</a></h2>";
          let rowsHTML = CSVtoHTML(res, titleInfo);
          if (rows[0].includes("Rank")) {
            console.log("SAVING STUFF");
            docs.fullChart = rows;
            docs.fullChartHTML = rowsHTML;
          } else {
            docs.fullChart = [];
            docs.fullChartHTML = "";
          }
          storeArtistWeek(rows, index);
        });
    }
    await docs.save();
  });
}
exports.storeFullChart = storeFullChart;