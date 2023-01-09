import React from "react";
import Select from "react-select";
import { useEffect, useState } from "react";

function WeekMenu({currWeek, setCurrWeek}) {

  const [weekData, setWeekData] = useState([{ label: 'Mon Jun 26 2017', value: 0 }]);
  useEffect(() => {
    fetch("/weeks?type=artist")
      .then(res => res.json())
      .then(res => res.reverse())
      .then(res => {setWeekData(res)})
  }, [currWeek]);

  function handleChange(event) { // whole object of selected option 
    console.log(event.label);
    setCurrWeek(event.value);
  };

  return (
    <section id="artist-selector">
      <Select 
        options={weekData}
        value={weekData.find(obj => obj.value === currWeek)}
        onChange={handleChange}
      />
    </section>
  )
}
export default WeekMenu;