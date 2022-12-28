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
function CSVtoHTML(rawPasteData, titleInfo) {
  let lines = rawPasteData.split("\n");
  let output = "";
  for (let i = 0; i < lines.length; i++) {
    output += "<tr><td>"
      + lines[i].slice(0, -1).split("|").join("</td><td>")
      + "</td></tr>";
  }
  output = titleInfo + "<br /><table>" + output + "</table>";
  return output;
}
exports.CSVtoHTML = CSVtoHTML;