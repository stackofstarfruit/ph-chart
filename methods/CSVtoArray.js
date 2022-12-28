/*
 * u/bright_baby_blue
 * 02/28/2022
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart.
 */
"use strict";

async function CSVtoArray(currChartHTML, artist, artistName) {
  let leaderboard = new Map();
  let rows = currChartHTML.match(/\n(\d)*|.*\n/g);
  let artistData = {
    "artist": artistName,
    "ticker": artist,
    "numSongs": 0,
    "songs": [],
    "points": 0,
    "numberOnes": 0,
    "listeners": 0
  };
  for (let i = 0; i < rows.length; i++) {
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
      artistData.songs.push(currSongData);
      artistData.points += currPoints;
      artistData.numberOnes += currNumberOnes;
      artistData.listeners += currListeners;
    }
    /*if(leaderboard.has(currArtist)) {
      leaderboard.set(currArtist, currPoints + leaderboard.get(currArtist));
      //leaderboard.set(currArtist, leaderboard.get(currArtist) + 1);
    } else {
      leaderboard.set(currArtist, currPoints)
      //leaderboard.set(currArtist, 1);
    }*/
  }
  // let sorted_map_by_num_values = new Map([...leaderboard].sort((a, b) => a[1] - b[1]))
  // console.log(sorted_map_by_num_values);
  artistData.numSongs = artistData.songs.length;
  return artistData;
}
exports.CSVtoArray = CSVtoArray;
