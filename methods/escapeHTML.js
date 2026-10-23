"use strict";
/**
 * Escapes text so it can be placed inside HTML elements or quoted attributes
 * @param {String} text untrusted text (paste data, Reddit titles, URLs)
 * @returns {String} text with HTML special characters escaped
 */
function escapeHTML(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
exports.escapeHTML = escapeHTML;
