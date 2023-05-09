import React from "react";
import Select from "react-select";
import { useEffect, useState } from "react";

function ArtistMenu({ currArtist, setCurrArtist, currWeek }) {
  const [currArtistData, setCurrArtistData] = useState(null);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    fetch("/artists")
      .then((res) => res.json())
      .then((res) => {
        setCurrArtistData(res);
        if (initialRender && res && res.length > 0) {
          setCurrArtist("CHARLI XCX");
          setInitialRender(false);
        }
      });
  }, [currWeek, setCurrArtist, initialRender]);

  function handleChange(event) {
    // whole object of selected option
    setCurrArtist(event.value);
  }

  return (
    <section className="select-region">
      {currArtistData ? (
        <Select
          options={currArtistData}
          value={currArtistData.find((obj) => obj.value === currArtist)}
          onChange={handleChange}
        />
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
}
export default ArtistMenu;