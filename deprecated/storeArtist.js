/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";

const ArtistModel = require('../models/Artist');

async function storeArtist(rows, ticker, artistName, index) {
  if(index === 272) {
    console.log(rows);
  }
  if (rows[0]) {
    let artistData = {
      "artist": artistName,
      "ticker": ticker,
      "numSongs": 0,
      "songs": [],
      "points": 0,
      "numberOnes": 0,
      "listeners": 0
    };
    for (let i = 0; i < rows.length - 1; i++) {
      if (rows[i].includes("|")) {
        let rowData = rows[i].split("|");
        let currPosition = rowData[0];
        let currEntry = rowData[1];
        let currArtist = currEntry.split(" - ")[0];
        let currSong = currEntry.split(" - ")[1];
        let currPoints = parseInt(rowData[2]);
        let currNumberOnes = parseInt(rowData[3]);
        let currListeners = parseInt(rowData[4]);
        let currSongData = { "position": currPosition, "song": currSong };
        if (currArtist.toUpperCase().includes(artistName)) {
          if(currPoints && currNumberOnes && currListeners) {
            artistData.songs.push(currSongData);
            artistData.points += currPoints;
            artistData.numberOnes += currNumberOnes;
            artistData.listeners += currListeners;
          }
        }
      }
    }
    artistData.numSongs = artistData.songs.length;
    const artist = new ArtistModel({ 
      nameindex: artistName + index,
      index: index,
      name: artistName,
      currentPoints: artistData.points,
      currentNumberOnes: artistData.numberOnes,
      currentListeners: artistData.listeners,
      songs: artistData.songs
    });
    artist.save();
    return artistData;
  } else {
    return "ERROR!";
  }
}
exports.storeArtist = storeArtist;