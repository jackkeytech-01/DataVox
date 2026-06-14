function updateClock() {

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, 0);
  const minutes = now.getMinutes().toString().padStart(2, 0);
  const seconds = now.getSeconds().toString().padStart(2, 0);
  const timer = `${hours}:${minutes}:${seconds}`;
  document.getElementById('clock').textContent = timer;
}
function updateDate() {
  const now = new Date();
  /*
  const date = now.getDate().toString();
  const month = now.getMonth();
  const year = now.getFullYear().toString();
  //const today = `${date}-${month+1}-${year}`;
  //const today = now.toLocaleDateString();
  */
  const today = now.toDateString();
  document.getElementById('date').textContent = today;
}
updateClock();
updateDate();
setInterval(updateClock, 1000);
setInterval(updateDate, 1000);