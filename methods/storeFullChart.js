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

async function storeFullChart(index) {
  ChartModel.findOne({index: index}, async (err, docs) => {
    if (docs.fullChartURL && docs.fullChartURL[0] && (docs.fullChartURL[0].includes("pastebin") || docs.fullChartURL[0].includes("paste.ee"))) {
      console.log(index);
      let fullChartURL = docs.fullChartURL[0].replace(/\/p\//, "/r/");
      fullChartURL = fullChartURL.replace(/pastebin.com\//, "pastebin.com\/raw\/");
      await fetch(fullChartURL)
        .then(res => res.text())
        .then(res => {
          // let rows = res.match(/\n(\d)*|.*\n/g);
          let titleInfo = "<h2><a href=" + docs.redditURL + ">" + docs.title + "</a></h2>";
          let rows = CSVtoHTML(res, titleInfo);
          if (rows.includes("Rank")) {
            docs.fullChartHTML = rows;
            docs.save();
          } else {
            docs.fullChartHTML = "";
            docs.save();
          }
        });
    }
  });
}
exports.storeFullChart = storeFullChart;