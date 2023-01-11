import { useEffect, useState } from "react";
import '../App.css';
import ArtistMenu from "./ArtistMenu";
import WeekMenuArtist from "./WeekMenuArtist";

function Artist() {
  const [currArtist, setCurrArtist] = useState("CHARLI XCX");
  const [currWeek, setCurrWeek] = useState(289);
  const [currArtistData, setCurrArtistData] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setTimeout(async () => {
        try {
          const artistData = await fetch(`/getArtistStats?nameindex=${currArtist + currWeek}`,
            { signal: abortController.signal });
          const artistJSON = await artistData.json();
          setCurrArtistData(artistJSON);
          } catch (error) {
            if(error.name === 'AbortError') {
              // no error
            } else {
              setCurrArtistData("");
            }
          }
      }, Math.round(Math.random() * 100))
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [currArtist, currWeek]);

  return (
    <section id="artist-view">
      <h1 className="section-title">Artist View</h1>
      <ArtistMenu currArtist = {currArtist} setCurrArtist = {setCurrArtist} currWeek = {currWeek}/>
      <WeekMenuArtist currWeek = {currWeek} setCurrWeek = {setCurrWeek}/>
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