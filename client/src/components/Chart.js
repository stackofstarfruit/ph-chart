import { useEffect, useState } from "react";
import '../App.css';
import WeekMenu from './WeekMenu'
import UpdateButton from './UpdateButton'

function Chart() {
  const [currChart, setCurrChart] = useState(0);
  const [chartType, setChartType] = useState(0);
  const [currWeek, setCurrWeek] = useState(289);
  const [currChartHTML, setCurrChartHTML] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
      setTimeout(async () => {
        try {
          const weekData = await fetch(`/chart?chartNum=${currWeek}&chartType=${chartType}`,
            { signal: abortController.signal });
          const chartHTML = await weekData.text();
          setCurrChartHTML(chartHTML);
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
  }, [currWeek, chartType]);

  function getChart(event) {
    event.preventDefault();
    let fetchURL = "/chart?chartNum=" + currChart + "&chartType=" + chartType;
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
          <WeekMenu currWeek = {currWeek} setCurrWeek = {setCurrWeek}/>
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
            />Get Albums (deprecated, displays users signed up for the charts as of 01/09/2023)
            <br />
            <input 
              type="radio"
              value="2"
              name="chartType"
              onChange={handleChange}
            />Get ALL Songs (only works after 12/14/2020)
          <br />
          <UpdateButton />
        </form>
        <div dangerouslySetInnerHTML={{__html:currChartHTML}}></div>
      </section>
    </section>
  )
}

export default Chart;