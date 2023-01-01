/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";
/**
 * Turns chart data CSV into block of HTML
 * @param {String} rawPasteData dump of data from pastebin
 * @param {String} titleInfo block containing title HTML
 * @returns {String} block of HTML with chart data inside of table
 */
function HTMLtoCSV(rawHTML) {
  console.log(rawHTML);
  let HTMLtable = rawHTML.match(/(?<=\<table>)(.*)(?=\<\/table>)/);
  console.log(HTMLtable);
  let lines = HTMLtable.split("</td><td>");
  console.log(lines);
}
exports.HTMLtoCSV = HTMLtoCSV;