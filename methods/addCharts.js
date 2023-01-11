/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This method adds new charts to the database.
 */
"use strict";

const ChartModel = require('../models/Chart');
const { parseHTML } = require("../methods/parseHTML");
const { parsePastes } = require("../methods/parsePastes");
const { processComments } = require("../methods/processComments");
const { wikiPageToHTML } = require("../methods/wikiPageToHTML");
const { getDate } = require("../methods/getDate");
const { storeArtistWeek } = require('./storeArtistWeek');
const { storeFullChart } = require('./storeFullChart');

async function addCharts(r, chartPosts, chartSize) {
  for(let i = 0; i < chartPosts.length; i++) {
    let currIndex = i + chartSize;
    let post = await r
      .getSubmission(chartPosts[i])
      .fetch();
    let redditURL = await post.url;
    let title = await post.title;
    let titleInfo = "<h2><a href=" +
      await post.url + ">" +
      await post.title +
      "</a></h2>";
    let parsedDate = getDate(title);
    let pastes = ["",""];
    let postHTML = post.selftext_html;
    pastes = parseHTML(postHTML);
    let songData = "SONGS EMPTY";
    if(i != 19) {
      songData = await parsePastes(pastes, 0, titleInfo);
    }
    let fullCharts = await post
      .expandReplies({limit: 100, depth: 2}).comments
      .then(processComments)
      .then(parseHTML)
      .catch(err => {console.error(err); [];});
    let albumData = "ALBUMS EMPTY";
    if((i != 19) && (pastes[1].includes("reddit"))) {
      albumData = await wikiPageToHTML(pastes[1], titleInfo, r);
      myChart.save();
    } else if(i != 19) {
      albumData = await parsePastes(pastes, 1, titleInfo);
    } else {
      console.log(title);
      console.log(parsedDate);
      console.log(redditURL);
      console.log(songData);
      console.log(albumData);
      console.log(fullCharts);
    }
    const myChart = new ChartModel({
      index: currIndex,
      code: chartPosts[i],
      title: title,
      date: parsedDate, 
      redditURL: redditURL,
      songData: songData,
      albumData: albumData,
      fullChartURL: fullCharts
    });
    await myChart.save();
    setTimeout(storeFullChart, 5000, currIndex);
  }
  console.log("DONE ADDING CHARTS");
}
exports.addCharts = addCharts;