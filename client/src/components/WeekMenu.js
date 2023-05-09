import React from "react";
import Select from "react-select";

function WeekMenu({ currWeek, setCurrWeek, weekData }) {
  function handleChange(event) {
    setCurrWeek(event.value);
  }

  return (
    <section className="select-region">
      <Select
        options={weekData}
        value={weekData.find((obj) => obj.value === currWeek)}
        onChange={handleChange}
      />
    </section>
  );
}
export default WeekMenu;
