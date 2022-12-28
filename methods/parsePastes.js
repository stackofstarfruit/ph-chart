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
 * @returns {String} block of HTML with chart data inside of table
 */

async function parsePastes(pastes, chartType, titleInfo) {
  let currURL = pastes[chartType].replace("https://pastebin.com/", "https://pastebin.com/raw/");
  currURL = currURL.replace("https://paste.ee/p", "https://paste.ee/r");
  let pasteData = await fetch(currURL)
    .then(res => res.text())
    .then(res => CSVtoHTML(res, titleInfo))
    .catch(err => console.error(err));
  return pasteData;
}
exports.parsePastes = parsePastes;
