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
  try {
    const doc = await ChartModel.findOne({ index: index });
    
    if (doc === null) {
      console.log(`No document found for index: ${index}`);
      return;
    }

    if (doc.fullChartURL && doc.fullChartURL[0] && (doc.fullChartURL[0].includes("pastebin") || doc.fullChartURL[0].includes("paste.ee"))) {
      let fullChartURL = doc.fullChartURL[0].replace(/\/p\//, "/r/");
      fullChartURL = fullChartURL.replace(/pastebin.com\//, "pastebin.com\/raw\/");

      // If there is no fullChartURL, skip the fetching process
      if (!fullChartURL) {
        console.log(`No fullChartURL found for index: ${index}`);
        return;
      }

      try {
        const res = await fetch(fullChartURL);
        const resText = await res.text();
        let rows = resText.split("\n");
        let titleInfo = "<h2><a href=" + doc.redditURL + ">" + doc.title + "</a></h2>";
        let rowsHTML = CSVtoHTML(resText, titleInfo);
        if (rows[0].includes("Rank")) {
          doc.fullChart = rows;
          doc.fullChartHTML = rowsHTML;
        } else {
          doc.fullChart = [];
          doc.fullChartHTML = "";
        }
        await storeArtistWeek(rows, index);
      } catch (error) {
        console.log('Error fetching full chart URL:', error);
      }
    }
    await doc.save();
  } catch (error) {
    console.log('Error retrieving document:', error);
  }
}

exports.storeFullChart = storeFullChart;