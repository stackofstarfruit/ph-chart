/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";

const { off } = require('../models/Artist');
const ArtistModel = require('../models/Artist');

async function storeArtistWeek(rows, index) {
  console.log(index);
  if (rows && rows[0]) {
    let artistList = new Map();
    for (let i = 0; i < 10000; i++) {
      let rowRegEx = /\d\|.*/;
      if (rows[i] && rowRegEx.test(rows[i])) {
        let rowData = rows[i].split("|");
        let currPosition = rowData[0];
        let currEntry = rowData[1];
        let currArtist = currEntry.split(" - ")[0].toUpperCase();
        let currSong = currEntry.split(" - ")[1];
        let currPoints = parseInt(rowData[2]);
        let currNumberOnes = parseInt(rowData[3]);
        let currListeners = parseInt(rowData[4]);
        let currSongData = { "position": currPosition, "song": currSong };
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
        if (currPoints && currNumberOnes && currListeners && currListeners > 1) {
            artistData.numSongs = artistData.numSongs + 1;
            artistData.songs.push(currSongData);
            artistData.points += currPoints;
            artistData.numberOnes += currNumberOnes;
            artistData.listeners += currListeners;
        }
        artistList.set(currArtist, artistData);
      }
    }
    let artistArray = [];
    artistList.forEach(function(val, key){
      artistArray.push(val);
      if (key) {
        const artist = new ArtistModel({ 
          nameindex: key + index,
          index: index,
          name: key,
          currentPoints: val.points,
          currentNumberOnes: val.numberOnes,
          currentListeners: val.listeners,
          songs: val.songs
        });
        artist.save();
      }
    });
    return artistArray;
  } else {
    return "ERROR!";
  }
}
exports.storeArtistWeek = storeArtistWeek;