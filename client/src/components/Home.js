import Artist from './Artist'
import Chart from './Chart'
import ToggleButton from './ToggleButton'
import React, { Fragment, useState } from "react";

function Home() {
  const [mode, setMode] = useState(0);
  return (
    <>
      <ToggleButton mode = {mode} setMode = {setMode} />
      {mode === 0 && <Chart/>}
      {mode === 1 && <Artist/>}
    </>
  );
}

export default Home;
