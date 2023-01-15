import React from "react";
import Select from "react-select";
import { useEffect, useState } from "react";

function ArtistMenu({currArtist, setCurrArtist, currWeek}) {

  const [currArtistData, setCurrArtistData] = useState([{ label: 'CHARLI XCX', value: "CHARLI XCX" }]);

  useEffect(() => {
    fetch("/artists")
      .then(res => res.json())
      .then(res => {setCurrArtistData(res)})
  }, [currWeek]);

  function handleChange(event) { // whole object of selected option 
    setCurrArtist(event.value);
  };

  return (
    <section class="select-region">
      <Select 
        options={currArtistData}
        value={currArtistData.find(obj => obj.value === currArtist)}
        onChange={handleChange}
      />
    </section>
  )
}
export default ArtistMenu;