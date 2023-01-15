import React from "react";
import Select from "react-select";
import { useEffect, useState } from "react";

function WeekMenu({currWeek, setCurrWeek}) {

  const [weekData, setWeekData] = useState([{ label: 'Mon Dec 26 2022', value: 287 }]);
  useEffect(() => {
    fetch("/weeks")
      .then(res => res.json())
      .then(res => res.reverse())
      .then(res => {setWeekData(res)})
  }, [currWeek]);

  function handleChange(event) { // whole object of selected option 
    setCurrWeek(event.value);
  };

  return (
    <section class="select-region">
      <Select
        options={weekData}
        value={weekData.find(obj => obj.value === currWeek)}
        onChange={handleChange}
      />
    </section>
  )
}
export default WeekMenu;