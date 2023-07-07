import { useEffect, useState } from "react";
import "../App.css";
import ArtistMenu from "./ArtistMenu";
import WeekMenu from "./WeekMenu";
import ArtistGraph from "./ArtistGraph";
import TimePeriodButtons from './TimePeriodButtons';

function Artist() {
  const [currArtist, setCurrArtist] = useState(null);
  const [currWeek, setCurrWeek] = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [currArtistData, setCurrArtistData] = useState(null);
  const [currGraphData, setCurrGraphData] = useState(null);
  const [activePeriod, setActivePeriod] = useState('1w');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/weeks");
      const data = await res.json();
      const reversedData = data.reverse();
      setWeekData(reversedData);
      setCurrWeek(reversedData[0].value);
      setCurrArtist("(G)I-DLE");
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/artists");
      const data = await res.json();
      setCurrArtist(data[0].value);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (currArtist) {
        setTimeout(async () => {
          try {
            const artistData = await fetch(
              `/getArtistStats?nameindex=${currArtist + currWeek}`,
              { signal: abortController.signal }
            );
            const artistJSON = await artistData.json();
            setCurrArtistData(artistJSON);
          } catch (error) {
            if (error.name === "AbortError") {
              // no error
            } else {
              setCurrArtistData("");
            }
          }
        }, Math.round(Math.random() * 100));
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [currArtist, currWeek]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (currArtist) {
        setTimeout(async () => {
          try {
            const artistData = await fetch(
              `/graphPoints?name=${currArtist}&index=${currWeek}`,
              { signal: abortController.signal }
            );
            const graphData = await artistData.json();
            const processedGraphData = graphData.map((item) => ({
              weekIndex: parseInt(item.week, 10) + 1,
              Points: item.points,
            })).reverse();
            setCurrGraphData(processedGraphData);
          } catch (error) {
            if (error.name === "AbortError") {
              // no error
            } else {
              setCurrGraphData("");
            }
          }
        }, Math.round(Math.random() * 100));
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [currArtist, currWeek]);

  const periodToDataPoints = (period) => {
    switch (period) {
      case '1w': return 7;
      case '1m': return 30;
      case '3m': return 90;
      case '6m': return 180;
      case '1y': return 365;
      case 'ALL': return currGraphData.length;
      default: return 7;
    }
  };

  const numDataPoints = periodToDataPoints(activePeriod);
  const finalGraphData = currGraphData ? currGraphData.slice(Math.max(currGraphData.length - numDataPoints, 0)) : [];

  return (
    <section id="artist-view">
      <h1 className="section-title">Artist View</h1>
      {currArtist ? (
        <ArtistMenu
          currArtist={currArtist}
          setCurrArtist={setCurrArtist}
          currWeek={currWeek}
        />
      ) : (
        <p>Loading...</p>
      )}
      {weekData && currWeek ? (
        <WeekMenu currWeek={currWeek} setCurrWeek={setCurrWeek} weekData={weekData} />
      ) : (
        <p>Loading...</p>
      )}
      <> { currArtistData && currArtistData.numSongs !== 0 ?
      <section id="artist-data">
        <h2>{currArtistData.name}</h2>
        <section id="artist-profile">
          <ul>
            <li>Total Points: {currArtistData.currentPoints}</li>
            <li>Total Number Ones: {currArtistData.currentNumberOnes}</li>
            <li>Total Listeners: {currArtistData.currentListeners}</li>
            <li>Songs in Top 10000: {currArtistData.songs.length}</li>
          </ul>
        </section>
        <section id="top-songs">
          <h3>TOP SONGS</h3> 
          <ul>
            {currArtistData.songs[0] ? <li>#{currArtistData.songs[0].position}: {currArtistData.songs[0].song}</li>:<></>}
            {currArtistData.songs[1] ? <li>#{currArtistData.songs[1].position}: {currArtistData.songs[1].song}</li>:<></>}
            {currArtistData.songs[2] ? <li>#{currArtistData.songs[2].position}: {currArtistData.songs[2].song}</li>:<></>}
            {currArtistData.songs[3] ? <li>#{currArtistData.songs[3].position}: {currArtistData.songs[3].song}</li>:<></>}
            {currArtistData.songs[4] ? <li>#{currArtistData.songs[4].position}: {currArtistData.songs[4].song}</li>:<></>}
          </ul>
        </section>
        <section>
          <ArtistGraph 
            graphData={finalGraphData}
            artistName={currArtist}
            currWeek={currWeek}
          />
          <TimePeriodButtons 
            periods={['1w', '1m', '3m', '6m', '1y', 'ALL']} 
            onPeriodChange={(period) => setActivePeriod(period)}
          />
        </section>
      </section> : 
      <section>
        <p>NO ARTIST DATA FOUND FOR THIS WEEK</p>
      </section>
      }
      </>
    </section>
  )
}

export default Artist;