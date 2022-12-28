/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";

/**
 * Converts the old album chart format to an HTML block
 * @param {String} wikiPage address to wiki page with chart
 * @param {String} titleInfo HTML block with title and link to post
 * @param {Object} r reddit snoowrap instance
 * @returns {String} block of HTML with chart data inside of table
 */
async function wikiPageToHTML(wikiPage, titleInfo, r) {
  let wikiID = wikiPage.split("\/wiki\/")[1];
  let tableHTML = await r
    .getSubreddit("popheads")
    .getWikiPage(wikiID)
    .fetch()
    .then(res => res.content_html)
    .then(res => res.match(/\<table>.*(\n.*)*\<\/table>/g)[0])
    .catch(err => console.error(err));
  return titleInfo + tableHTML;
}
exports.wikiPageToHTML = wikiPageToHTML;
