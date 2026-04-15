
const userTimeEl = document.getElementById("user-time");
const userReadableTimeEl = document.getElementById("user-time-readable");

function renderCurrentTimeInMilliseconds() {
  const now = new Date();
  userTimeEl.textContent = String(now.getTime());

  const readableTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  userReadableTimeEl.querySelector("span").textContent = readableTime;
}

renderCurrentTimeInMilliseconds();
setInterval(renderCurrentTimeInMilliseconds, 1000);