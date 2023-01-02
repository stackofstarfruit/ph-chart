import Artist from './Artist'
import Chart from './Chart'
import ToggleButton from './ToggleButton'
import WeekMenu from './WeekMenu'
import React, { Fragment, useState } from "react";

function Home() {
  const [mode, setMode] = useState();
  const [currWeek, setCurrWeek] = useState(286);

  return (
    <>
      <ToggleButton mode = {mode} setMode = {setMode} />
      <br />
      <h1 className="section-title">Popheads Chart</h1>
      <WeekMenu currWeek = {currWeek} setCurrWeek = {setCurrWeek}/>
      {mode === 0 && <Chart currWeek = {currWeek} />}
      {mode === 1 && <Artist currWeek = {currWeek} />}
    </>
  );
}

export default Home;
