/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";

async function storeSong(currArtist, currPoints, currNumberOnes, currListeners, currSongData, artistList) {
  let artistData = {
    "artist": currArtist,
    "numSongs": 0,
    "songs": [],
    "points": 0,
    "numberOnes": 0,
    "listeners": 0
  };
  if (artistList.has(currArtist)) {
    artistData = artistList.get(currArtist);
  }
  console.log(currArtist + ": " + artistData.songs);
  if (currPoints && currNumberOnes && currListeners && currListeners > 1) {
    artistData.numSongs = artistData.numSongs + 1;
    artistData.songs.push(currSongData);
    artistData.points += currPoints;
    artistData.numberOnes += currNumberOnes;
    artistData.listeners += currListeners;
  }
  return artistData;
}

exports.storeSong = storeSong;