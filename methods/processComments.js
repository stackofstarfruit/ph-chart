/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";
/**
 * Checks comment thread to find the comment with full chart
 * @param {Array} threadComments array of all top level comments in thread
 * @returns {String} comment containing full chart
 */
async function processComments(threadComments) {
  for (let i = 0; i < threadComments.length; i++) {
    const comm = threadComments[i];
    if(testComment(comm)) {
      return threadComments[i].body_html;
    } else {
      for (let j = 0; j < comm.replies.length; j++) {
        if (testComment(comm)) {
          return comm.replies[j].body_html;
        }
      }
    }
  }
}

/**
 * Checks comment to see if it is a Full Chart candidate
 * @param {Object} comm current comment
 * @returns {Boolean} true if comment is Full Chart candidate, otherwise false
 */
function testComment(comm) {
  if((comm.is_submitter ||
    comm.author.name == 'letsallpoo' || 
    comm.author.name == 'ImADudeDuh') && 
   (comm.body_html.includes('pastebin') ||
    comm.body_html.includes('paste.ee'))
  ) {
    return true;
  }
  return false;
}

exports.processComments = processComments;