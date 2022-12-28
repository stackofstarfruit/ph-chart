/**
 * Uses snoowrap to get the weekly Popheads charts from Reddit
 */
/* OLD NO DATABASE METHOD
app.get('/chart', async (req, res) => {
  res.type("text");
  if(!req.query.weeksBack || !req.query.chartType) {
    res.status(CLIENT_ERROR);
    res.send("PARAMETERS NOT FOUND");
  }
  const weeksBack = req.query.weeksBack;
  const chartType = req.query.chartType;
  try {
    let chartPageHTML = await r
      .getSubreddit('popheads')
      .getWikiPage('index/charts-numberones')
      .fetch().content_html;
    let chartPosts = chartPageHTML.match(/(?<=redd.it\/)(.*)(?=..rel)/g);
    let postNum = chartPosts.length - 1 - weeksBack;
    let post = await r
      .getSubmission(chartPosts[postNum])
      .fetch();
    let titleInfo = "<h2><a href=" +
      await post.url + ">" +
      await post.title +
      "</a></h2>";
    let pastes = ["",""];
    if(chartType == 0 || chartType == 1) {
      let postHTML = post.selftext_html;
      pastes = parseHTML(postHTML);
    } else if(chartType == 2) {
      let secretPastes = await post
        .expandReplies({limit: 100, depth: 2}).comments
        .then(processComments)
        .then(parseHTML)
        .catch(err => console.error(err));
      for(let j = 0; j < secretPastes.length; j++) {
        pastes.push(secretPastes[j]);
      }
    } else {
      res.status(CLIENT_ERROR);
      res.send("INVALID CHART TYPE");
    }
    if(chartType == 1 && pastes[1].includes("reddit")) {
      let oldChart = await wikiPageToHTML(pastes[1], titleInfo);
      res.status(RESPONSE_OK);
      res.send(await oldChart);
    } else {
      let charts = await parsePastes(pastes, chartType, titleInfo);
      res.status(RESPONSE_OK);
      res.send(await charts);
    }
  } catch (error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT SCRAPE REDDIT: " + error);
  }
});*/