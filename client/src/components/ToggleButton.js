function ToggleButton({mode, setMode}) {
  return (
    <button id="switch-modes-button" onClick={() => setMode(1 - mode)}>
      {mode ? <p>Switch to Chart View</p> : <p>Switch to Artist View</p>}
    </button>
  );
}

export default ToggleButton;
