/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";
/**
 * Finds the pastebin or paste.ee link inside the html
 * @param {String} postHTML HTML from either post or comment in the post
 * @returns {String} link to pastebin or paste.ee link
 */
function parseHTML(postHTML) {
  let pastes = [];
  const pattern = /https:\/\/pastebin.com\/[\w]+|https:\/\/paste.ee\/p\/[\w]+/g;
  if (postHTML == "" || (typeof postHTML != 'string')) {
    console.error("COULD NOT FIND PASTEBIN LINK");
    return [];
  } else {
    pastes = postHTML.match(pattern);
  }
  let oldAlbumChart = postHTML.match(/https:\/\/www.reddit.com\/r\/popheads\/wiki\/index\/weeklyhot40\-monthlytop20\-[\w]+/g);
  if (oldAlbumChart != null) {
    pastes.splice(1, 0, oldAlbumChart[0]);
  }
  return pastes;
}
exports.parseHTML = parseHTML;
