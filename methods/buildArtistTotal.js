"use strict";

const ArtistModel = require('../models/Artist');
const ArtistTotalModel = require('../models/ArtistTotal');

async function buildArtistTotal(artistName) {
  try {
    const docs = await ArtistModel.find({ name: artistName });

    let totalPoints = 0;
    let totalNumberOnes = 0;
    let totalListeners = 0;
    let pointsByWeek = [];
    let numberOnesByWeek = [];
    let listenersByWeek = [];
    
    for (let i = 0; i < docs.length; i++) {
      totalPoints = totalPoints + docs[i].currentPoints;
      totalNumberOnes = totalNumberOnes + docs[i].currentNumberOnes;
      totalListeners = totalListeners + docs[i].currentListeners;
      pointsByWeek.splice(docs[i].index, 0, docs[i].currentPoints);
      pointsByWeek.push(docs[i].currentPoints);
      numberOnesByWeek.splice(docs[i].index, 0, docs[i].currentNumberOnes);
      listenersByWeek.splice(docs[i].index, 0, docs[i].currentListeners);
    }

    const artistTotal = new ArtistTotalModel({ 
      name: artistName,
      totalPoints: totalPoints,
      totalNumberOnes: totalNumberOnes,
      totalListeners: totalListeners,
      pointsByWeek: pointsByWeek,
      numberOnesByWeek: numberOnesByWeek,
      listenersByWeek: listenersByWeek
    });

    await artistTotal.save();
  } catch (error) {
    console.error(error);
  }
}

exports.buildArtistTotal = buildArtistTotal;