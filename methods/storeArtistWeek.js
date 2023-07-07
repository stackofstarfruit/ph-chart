"use strict";

const ArtistModel = require('../models/Artist');
const ArtistTotalModel = require('../models/ArtistTotal');

async function storeArtistWeek(rows, index) {
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
        let artistData;
        if (artistList.has(currArtist)) {
          artistData = artistList.get(currArtist);
        } else {
          artistData = {
            "artist": currArtist,
            "numSongs": 0,
            "songs": [],
            "points": 0,
            "numberOnes": 0,
            "listeners": 0
          };
        }
        if (artistData && currPoints && currListeners && currListeners > 1) {
          artistData.numSongs = artistData.numSongs + 1;
          artistData.songs.push(currSongData);
          artistData.points += currPoints;
          artistData.numberOnes += currNumberOnes;
          artistData.listeners += currListeners;
        }
        artistList.set(currArtist, artistData);
      }
    }

    const promises = [];

    for (let [key, val] of artistList) {
      if (key && val && val.points >= 10) {
        const existingData = await ArtistModel.findOne({ nameindex: key + index });
        if (existingData) {
          continue;
        }
        const artist = new ArtistModel({ 
          nameindex: key + index,
          index: index,
          name: key,
          currentPoints: val.points,
          currentNumberOnes: val.numberOnes,
          currentListeners: val.listeners,
          songs: val.songs
        });

        promises.push(artist.save().catch(error => console.log('Error saving artist data:', error)));

        if(val.points >= 250) {
          promises.push(ArtistTotalModel.findOne({name: key}).then(docs => {
            if(!docs) {
              const artistTotal = new ArtistTotalModel({ 
                name: key,
                totalPoints: val.points,
                totalNumberOnes: val.numberOnes,
                totalListeners: val.listeners
              });

              return artistTotal.save();
            }
          }).catch(error => console.log('Error saving total artist data:', error)));
        }
      }
    }

    // Wait for all promises to complete
    await Promise.all(promises);

    return Array.from(artistList.values());
  } else {
    throw new Error('Rows data is not valid.');
  }
}

module.exports = { storeArtistWeek };