/*
 * u/bright_baby_blue
 * 08/09/2023
 *
 * This is the server-side JavaScript for the popheads chart, which allows
 * you to make API calls to the full chart. The Git history for this file is
 * scrubbed for credential-wiping purposes.
 */

"use strict";

// Load environment variables from .env file
require('dotenv').config();

// Authentication and configuration tokens
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const USER_AGENT = process.env.USER_AGENT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

// Default port and standard HTTP response codes
const DEFAULT_PORT = 8000;
const RESPONSE_OK = 200;
const CLIENT_ERROR = 400;
const SERVER_ERROR = 500;

// Core Node.js modules
const path = require('path');
const fs = require('fs');

// Express setup
const express = require('express');
const multer = require('multer');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer().none());
app.use(express.static('public'));

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Third-party libraries
const snoowrap = require('snoowrap');
const Promise = require('bluebird');
require('cross-fetch/polyfill');

// File upload configuration
const upload = multer({ dest: "./chart-files" });

// MongoDB modules and configuration
const mongoose = require('mongoose');
mongoose.connect(MONGO_CONNECTION_URL);
mongoose.set('strictQuery', false);
const date = require('date-and-time');
const ordinal = require('date-and-time/plugin/ordinal');
date.plugin(ordinal);

// Importing models and methods for charts
const ArtistModel = require('./models/Artist');
const ArtistTotalModel = require('./models/ArtistTotal');
const ChartModel = require('./models/Chart');
const { addCharts } = require("./methods/addCharts");

// Configuration for snoowrap (Reddit API Wrapper)
const r = new snoowrap({
  userAgent: USER_AGENT,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  username: USERNAME,
  password: PASSWORD
});

// Importing methods for deprecated endpoints (commented out)
/*
const { parseHTML } = require("./methods/parseHTML");
const { parsePastes } = require("./methods/parsePastes");
const { processComments } = require("./methods/processComments");
const { wikiPageToHTML } = require("./methods/wikiPageToHTML");
const { CSVtoHTML } = require("./methods/CSVtoHTML");
const { getDate } = require("./methods/getDate");
const { storeFullChart } = require('./methods/storeFullChart');
const { buildArtistTotal } = require("./methods/buildArtistTotal");
const { storeArtistWeek } = require("./methods/storeArtistWeek");
*/

/**
 * Fetches week items for react-select dropdown menu.
 *
 * @route GET /weeks
 * @param {string} req.query.type - Set to 'artist' for Artist View.
 * @returns {Object[]} weeks - The week items.
 */
app.get('/weeks', async (req, res) => {
  res.type("json");
  try {
    let filter = {};
    if (req.query.type == 'artist') {
      filter = { date: {$gte: 182} };
    }
    let weeks = [];
    ChartModel.find(filter, 'index date', (err, docs) => {
      for (let i = 0; i < docs.length; i++) {
        if(docs[i].date) { // Ensure date exists before calling toDateString
          weeks.push({
            "value" : docs[i].index,
            "label" : docs[i].date.toDateString()
          });
        } else {
          console.warn(`Document with index ${docs[i].index} has no date property`);
        }
      }
      res.status(RESPONSE_OK);
      res.send(weeks);
    });
  } catch(error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT FIND POSTS: " + error);
  }
});

/**
 * Fetches artist items for react-select dropdown menu (Artist View).
 *
 * @route GET /artists
 * @returns {Object[]} artists - The artist items.
 */
app.get('/artists', async (req, res) => {
  res.type("json");
  try {
    ArtistTotalModel.find({}, 'name', (err, docs) => {
      let artists = [];
      for (let i = 0; i < docs.length; i++) {
        artists.push({
          "value" : docs[i].name,
          "label" : docs[i].name
        });
      }
      res.status(RESPONSE_OK)
      res.send(artists);
    }).sort({ name: 1 });
  } catch(error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT FIND POSTS: " + error);
  }
});

/**
 * Fetches chart based on the given week and type.
 *
 * @route GET /chart
 * @param {string} req.query.chartNum - Chart week number (0 is the first week in the database).
 * @param {string} req.query.chartType - Chart type. (0 displays short charts, 1 displays albums up until 01/02/2023, then displays full charts, 2 displays full charts between 12/14/2020 and 01/02/2023, otherwise displays list of registered users)
 * @returns {string} responseHTML - The chart data in HTML format.
 */
app.get('/chart', async (req, res) => {
  res.type("text");
  if(!req.query.chartNum || !req.query.chartType) {
    res.status(CLIENT_ERROR);
    res.send("PARAMETERS NOT FOUND");
  }
  const chartNum = req.query.chartNum;
  const chartType = req.query.chartType;
  try {
    ChartModel.findOne({index: chartNum}, (err, foundChart) => {
      if (err) {
        res.status(SERVER_ERROR);
        res.send(err);
      }
      let responseHTML;
      switch(chartType) {
        case '0':
          responseHTML = foundChart.songData;
          break;
        case '1':
          responseHTML = foundChart.albumData;
          break;
        case '2':
          responseHTML = foundChart.fullChartHTML;
          break;
        default:
          res.status(CLIENT_ERROR);
          res.send("INVALID CHART TYPE");
          return;
      }
      res.send(responseHTML);
    });
  } catch(error) {
    res.status(SERVER_ERROR);
    res.send(error);
  }
});

/**
 * Updates charts from Reddit if not already updated.
 *
 * @route GET /updateCharts
 * @returns {string} status - Status of the chart update process.
 */
app.get('/updateCharts', async (req, res) => {
  res.type('text');
  try {
    let chartPageHTML = await r
      .getSubreddit('popheads')
      .getWikiPage('index/charts-numberones')
      .fetch().content_html;
    let chartPosts = chartPageHTML.match(/(?<=redd.it\/).*(?=..rel)/g); 
    let chartSize = await ChartModel.count({});
    console.log(chartPosts.length);
    console.log(chartSize);
    if (chartSize == chartPosts.length) {
      res.status(RESPONSE_OK);
      res.send("CHART IS ALREADY UP TO DATE");
    } else {
      let newChartPosts = chartPosts.slice(chartSize);
      addCharts(r, newChartPosts, chartSize); // Pass the chartSize to addCharts
      res.status(RESPONSE_OK);
      res.send("CHARTS UPDATED SUCCESSFULLY: " + chartPosts.length);
    }
  } catch(error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT UPDATE CHARTS: " + error);
  }
});

/**
 * Fetches statistics for the given artist during the given week.
 *
 * @route GET /getArtistStats
 * @param {string} req.query.nameindex - Artist name concatenated with the desired week number.
 * @returns {Object} artistEntry - The artist statistics.
 */
app.get('/getArtistStats', async (req, res) => {
  res.type("json");
  if(!req.query.nameindex) {
    res.status(CLIENT_ERROR);
    res.send("ARTIST NOT SPECIFIED");
  }
  let nameindex = decodeURIComponent(req.query.nameindex);
  // checks MongoDB for artist entry
  try {
    const artistEntry = await ArtistModel.findOne({ nameindex: nameindex });
    if(!artistEntry) {
      res.status(CLIENT_ERROR);
      res.send("Artist not in database. Please check your spelling.");
    } else {
      res.status(RESPONSE_OK);
      res.send(artistEntry.toJSON());
    }
  } catch (error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT SCRAPE REDDIT: " + error);
  }
});

/**
 * Fetches chart points for a specified artist over time ending at the given week.
 *
 * @route GET /graphPoints
 * @param {string} req.query.name - Artist name.
 * @param {number} req.query.index - Given week.
 * @returns {Object[]} data - An array of objects containing the week number and points for each week.
 */
app.get('/graphPoints', async (req, res) => {
  if(!req.query.name || !req.query.index) {
    res.status(CLIENT_ERROR);
    res.send("ARTIST NOT SPECIFIED");
  }
  try {
    const artistName = decodeURIComponent(req.query.name);
    const currentWeek = req.query.index;
    const nameIndices = [];
    for (let i = 0; i < currentWeek; i++) {
      nameIndices.push(`${artistName.toUpperCase()}${currentWeek - i}`);
    }
    const artistData = await ArtistModel.find({
      nameindex: { $in: nameIndices }
    });

    const data = nameIndices.map(nameIndex => {
      const weekNumber = nameIndex.slice(artistName.length);
      const artistEntry = artistData.find(entry => entry.nameindex === nameIndex);
  
      return {
        week: weekNumber,
        points: artistEntry ? artistEntry.currentPoints : 0
      };
    });
  
    res.json(data);
  } catch(error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Deprecated endpoint for loading short charts into MongoDB from scratch
/*app.post('/buildCharts', async (req, res) => {
  res.type('text');
  try {
    let chartPageHTML = await r
      .getSubreddit('popheads')
      .getWikiPage('index/charts-numberones')
      .fetch().content_html;
    let chartPosts = await chartPageHTML.match(/(?<=redd.it\/)(.*)(?=..rel)/g);
    for(let i = 0; i < await chartPosts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let post = await r
        .getSubmission(chartPosts[i])
        .fetch();
      let redditURL = await post.url;
      let title = await post.title;
      let titleInfo = "<h2><a href=" +
        await post.url + ">" +
        await post.title +
        "</a></h2>";
      let parsedDate = getDate(title);
      let pastes = ["",""];
      let postHTML = post.selftext_html;
      pastes = parseHTML(postHTML);
      let songData = "SONGS EMPTY";
      if(i != 19) {
        songData = await parsePastes(pastes, 0, titleInfo, 500);
      }
      let fullCharts = await post
        .expandReplies({limit: 100, depth: 2}).comments
        .then(processComments)
        .then(parseHTML)
        .catch(err => {console.error(err); [];});
      if((i != 19) && (pastes[1].includes("reddit"))) {
        let albumData = await wikiPageToHTML(pastes[1], titleInfo, r);
        const myChart = new ChartModel({
          index: i,
          code: chartPosts[i],
          title: title,
          date: parsedDate,
          redditURL: redditURL,
          songData: songData,
          albumData: albumData,
          fullCharts: fullCharts
        });
        myChart.save();
      } else {
        let albumData = "ALBUMS EMPTY";
        if(i != 19) {
          albumData = await parsePastes(pastes, 1, titleInfo, 500);
        } else {
          console.log(title);
          console.log(parsedDate);
          console.log(redditURL);
          console.log(songData);
          console.log(albumData);
          console.log(fullCharts);
        }
        const myChart = new ChartModel({
          index: i,
          code: chartPosts[i],
          title: title,
          date: parsedDate, 
          redditURL: redditURL,
          songData: songData,
          albumData: albumData,
          fullChartURL: fullCharts
        });
        await myChart.save();
      }}
      if(chartType == 2) { // this code block should be commented out if used
        let secretPastes = await post
          .expandReplies({limit: 100, depth: 2}).comments
          .then(processComments)
          .then(parseHTML)
          .catch(console.error("FAILED TO FIND FULL CHART"));
        for(let j = 0; j < secretPastes.length; j++) {
          pastes.push(secretPastes[j]);
        }
      }
    res.status(RESPONSE_OK);
    res.send("SUBMITTED CHARTS");
  } catch (error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT SCRAPE REDDIT: " + error);
  }
});*/

// Deprecated endpoint for loading full charts into MongoDB from scratch
/*app.post('/buildFullCharts', async (req, res) => {
  try {
    const count = await ChartModel.countDocuments();
    
    // Create an array of indices from 0 to count-1
    const indices = Array.from({ length: count }, (_, i) => i);

    // Use Promise.map with a concurrency limit
    await Promise.map(indices, storeFullChart, { concurrency: 50 }); // Adjust the concurrency limit as necessary
    
    // Once all operations have completed successfully, send a response.
    res.status(200);
    res.send("Successfully built full charts");
    
  } catch(error) {
    console.error("Error occurred during buildFullCharts: ", error);
    res.status(SERVER_ERROR);
    res.send("Something bad happened");
  }
});

// Deprecated endpoint for replacing lost files
app.post('/fixCharts', async (req, res) => {
  res.type('text');
  let chartType = req.query.chartType;
  if(chartType == "songData" || chartType == "albumData" || chartType == "fullChartData") {
    let fileDirectory = "./" + chartType.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + "-files";
    try {
      const files = await fs.promises.readdir(fileDirectory);
      for (const file of files) {
        const p = fileDirectory + "/" + path.basename(file);
        if (p.includes("txt")) {
          let entryCode = p.split("/")[2];
          entryCode = entryCode.split(".")[0];
          let currURL = await r.getSubmission(entryCode).url;
          let currEntry = await ChartModel.findOne({
            redditURL: currURL
          });
          let titleInfo = await "<h2><a href=" +
              currEntry.redditURL + ">" +
              currEntry.title +
              "</a></h2>";
          console.log(currEntry.date);
          fs.readFile(p, async (err, data) => {
            if (err || (!currEntry)) {
              throw err;
            } else {
              let chartHTML = CSVtoHTML(data.toString(), titleInfo);
              await currEntry.updateOne({[chartType]: chartHTML});
            }
          });
        }
      }
      res.status(RESPONSE_OK);
      res.send("TRANSFER SUCCESSFUL");
    } catch (e) {
      res.status(SERVER_ERROR);
      res.send("COULD NOT UPDATE CHARTS");
      console.error(e);
    }
  } else {
    res.status(CLIENT_ERROR);
    res.send("INVALID CHART TYPE");
  }
});*/

// Deprecated endpoint for loading weekly artist data into MongoDB from scratch
/*app.post('/buildArtistWeeks', async (req, res) => {
  res.type('json');
  const count = await ChartModel.countDocuments();
  try {
    for(let w = count - 1; w >= 182; w--) {
      ChartModel.findOne({index: w}, async (err, docs) => {
        if(docs && docs.fullChart) {
          docs.artists = storeArtistWeek(docs.fullChart, w);
          docs.save();
        }
      });
    }
  } catch(error) {
    res.status(SERVER_ERROR);
    res.send("SMTH BAD HAPPENED");
  }
});*/

// Deprecated endpoint for adding up weekly artist data into MongoDB from scratch
/*app.post('/buildTotals', async (req, res) => {
  res.type('text');
  try {
    const docs = await ArtistModel.find({}).distinct('name');
    const validDocs = docs.filter(doc => /\w/.test(doc));
    const buildArtistPromises = validDocs.map(doc => buildArtistTotal(doc));
    await Promise.all(buildArtistPromises);
    res.status(RESPONSE_OK);
    res.send(validDocs);
  } catch (error) {
    res.status(SERVER_ERROR);
    res.send("UNABLE TO UPDATE CHARTS: " + error);
  }
});*/


// Deprecated endpoint for getting rid of data for artists with small number of points
/*app.delete('/pruneTotals', async (req, res) => {
  ArtistTotalModel.deleteMany({ totalPoints: {$lte: 999} }).then(function(){
    console.log("Data deleted"); // Success
  }).catch(function(error){
    console.log(error); // Failure
  });
});*/

// Deprecated endpoint for clearing the database (USE WITH CAUTION!!!)
/*app.delete('/clearAll', async (req, res) => {
  res.type('text');
  
  try {
    await Promise.all([
      ChartModel.deleteMany(),
      ArtistModel.deleteMany(),
      ArtistTotalModel.deleteMany()
    ]);
    
    res.status(RESPONSE_OK);
    res.send("DATA DELETED");
  } catch (error) {
    console.log(error);
    res.status(SERVER_ERROR);
    res.send("FAILED TO DELETE DATA");
  }
});*/

if(process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);