import React from "react";
import Select from "react-select";
import { useEffect, useState } from "react";

function ArtistMenu({currArtist, setCurrArtist, currWeek}) {

  const [currArtistData, setCurrArtistData] = useState([{ label: 'CHARLI XCX', value: "CHARLI XCX" }]);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setTimeout(async () => {
        try {
          const artistDataRaw = await fetch(`/artists?week=${currWeek}`,
            { signal: abortController.signal });
          const artistData = await artistDataRaw.json();
          setCurrArtistData(artistData);
          } catch (error) {
            if(error.name === 'AbortError') {
              // no error
            } else {
              console.error();
            }
          }
      }, Math.round(Math.random() * 100))
    }

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [currWeek]);

  function handleChange(event) { // whole object of selected option 
    console.log(event.label);
    setCurrArtist(event.value);
  };

  return (
    <section id="artist-selector">
      <Select 
        options={currArtistData}
        value={currArtistData.find(obj => obj.value === currArtist)}
        onChange={handleChange}
      />
    </section>
  )
}
export default ArtistMenu;