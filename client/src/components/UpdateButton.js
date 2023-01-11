function UpdateButton() {
  return (
    <button className="fancy-button" onClick={() => updateCharts()}>
      UPDATE CHARTS!
    </button>
  );
}

function updateCharts() {
  fetch("/updateCharts");
  window.location.reload(false);
}

export default UpdateButton;