/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";
const date = require('date-and-time');

function getDate(title) {
  if (title.includes("A Happy 1st Anniversary Post")) {
    title = title.replace("June 18, 2018", "June 25, 2018");
  } else if (title.includes("Horses in Your Area")) {
    title = title.replace("April 8th, 2019", "April 15th, 2019");
  } else if (title.includes("Am I the problem?")) {
    title = title.replace("May 16, 2022", "May 9, 2022");
  } else if (title.includes("181,")) {
    title = title.replace("181,", "18,");
  } else if (title.includes("12*,")) {
    title = title.replace("12*,", "12,");
  }
  let rawDate = null;
  if (title.match(/\w* \w{1,4},? \d{4}/)) {
    rawDate = title.match(/\w* \w{1,4},? \d{4}/)[0];
    rawDate = rawDate.replace(/(?<=\d{1,2})([a-z]{2})/g, "");
    // rawDate = rawDate.replace(/(?<=(\d{2}))(\d{1}),/g, "");
    rawDate = rawDate.replace(/,/, "");
    return date.parse(rawDate, 'MMMM D YYYY');
  } else if (title.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
    rawDate = title.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)[0];
    return date.parse(rawDate, 'M/D/YYYY');
  }
}
exports.getDate = getDate;
