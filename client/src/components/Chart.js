import { useState } from "react";
import '../App.css';

function Chart() {
  const [currChart, setCurrChart] = useState();
  const [chartType, setChartType] = useState(0);

  function getChart(event) {
    // for some reason pastebins are private from 192-196, albums get weird starting at 197
    event.preventDefault();
    let weeksBack = event.target[0].value;
    let fetchURL = "/chart?weeksBack=" + weeksBack + "&chartType=" + chartType;
    fetch(fetchURL)
      .then(res => res.text())
      .then(res => setCurrChart(res))
      .catch(console.error);
  }

  function handleChange(event) {
    setChartType(event.target.value);
  }

  return (
    <section id="chart-view">
      <h1 className="section-title">Popheads Chart</h1>
      <section>
        <form onSubmit={getChart}>
          <label>
            Weeks Back (up to 262, gets weird after 191):
          </label>
            <input
              type="number" 
              defaultValue="0"
              min="0"
              max="262"
              maxLength="3"
              style={{width: "2.5rem"}}
            />
            <br />
            <input 
              type="radio"
              value="0"
              name="chartType"
              defaultChecked
              onChange={handleChange}
            />Get Songs
            <input
              type="radio"
              value="1"
              name="chartType"
              onChange={handleChange}
            />Get Albums
            <br />
            <input 
              type="radio"
              value="2"
              name="chartType"
              onChange={handleChange}
            />Get ALL Songs (warning: experimental)
          <br />
          <input className="button" type="submit" value="Get Chart!" />
        </form>
        <div dangerouslySetInnerHTML={{__html:currChart}}></div>
      </section>
    </section>
  )
}

export default Chart;