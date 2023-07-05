/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";
const { CSVtoHTML } = require("./CSVtoHTML");

/**
 * Gets raw pastebin data out of links and turns it into block of HTML
 * @param {Array} pastes list of pastebin and paste.ee links
 * @param {Integer} chartType integer where 0 is songs, 1 is albums, 2 is all songs
 * @param {String} titleInfo block of HTML containing title info
 * @param {Number} delay delay in milliseconds between requests
 * @returns {String} block of HTML with chart data inside of table
 */

async function parsePastes(pastes, chartType, titleInfo, delay) {
  let currURL = pastes[chartType].replace("https://pastebin.com/", "https://pastebin.com/raw/");
  currURL = currURL.replace("https://paste.ee/p", "https://paste.ee/r");

  let pasteData = await new Promise(resolve => {
    setTimeout(async () => {
      try {
        const response = await fetch(currURL);
        const text = await response.text();
        const html = CSVtoHTML(text, titleInfo);
        resolve(html);
      } catch (err) {
        console.error(err);
      }
    }, delay);
  });

  return pasteData;
}

exports.parsePastes = parsePastes;