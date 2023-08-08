function UpdateButton() {
  return (
    <button className="fancy-button" onClick={() => updateCharts()}>
      UPDATE CHARTS!
    </button>
  );
}

function updateCharts() {
  fetch("/updateCharts")
    .then(() => {
      setTimeout(() => {
        window.location.reload(false);
      }, 2500);
    })
    .catch(error => console.error("An error occurred:", error));
}

export default UpdateButton;