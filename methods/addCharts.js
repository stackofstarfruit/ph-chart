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
const { RateLimitError } = require('snoowrap');

async function addCharts(r, chartPosts, chartSize) {
  try {
    const operations = chartPosts.map(async (postCode, i) => {
      const currIndex = chartSize + i;
      const post = await fetchWithRetry(() => r.getSubmission(postCode).fetch());
      const redditURL = post.url;
      const title = post.title;
      const titleInfo = `<h2><a href="${post.url}">${post.title}</a></h2>`;
      const parsedDate = getDate(title);
      let pastes = ["", ""];
      const postHTML = post.selftext_html;

      pastes = parseHTML(postHTML);

      let songData = "SONGS EMPTY";
      if (i !== 19) {
        songData = await parsePastes(pastes, 0, titleInfo);
      }

      const fullCharts = await fetchWithRetry(() =>
        post.expandReplies({ limit: 100, depth: 2 })
          .comments.then(processComments)
          .then(parseHTML)
      );

      let albumData = "ALBUMS EMPTY";
      if (i !== 19 && pastes[1].includes("reddit")) {
        albumData = await wikiPageToHTML(pastes[1], titleInfo, r);
      } else if (i !== 19) {
        albumData = await parsePastes(pastes, 1, titleInfo);
      } else {
        console.log(title);
        console.log(parsedDate);
        console.log(redditURL);
        console.log(songData);
        console.log(albumData);
        console.log(fullCharts);
      }

      return {
        index: currIndex,
        code: postCode,
        title,
        date: parsedDate,
        redditURL,
        songData,
        albumData,
        fullChartURL: fullCharts,
      };
    });

    const results = await Promise.all(operations);

    results.forEach(async (chartData) => {
      const myChart = new ChartModel(chartData);
      await myChart.save();
      setTimeout(storeFullChart, 5000, chartData.index);
    });

    console.log("DONE ADDING CHARTS");
  } catch (error) {
    console.error("Error in addCharts:", error);
  }
}

async function fetchWithRetry(fetchFn) {
  const maxRetries = 3;
  let retryDelay = 1000; // Initial delay in milliseconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (error.name === 'RateLimitError') {
        console.log('Rate limit error occurred. Retrying in ' + retryDelay + 'ms...');
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Double the delay for the next retry
      } else {
        throw error;
      }
    }
  }

  throw new Error('Exceeded maximum retry attempts');
}

function isRateLimitError(error) {
  // Check if the error message contains rate limit related information
  const errorMessage = error.message || '';
  return errorMessage.includes('rate limit') || errorMessage.includes('ratelimit');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.addCharts = addCharts;