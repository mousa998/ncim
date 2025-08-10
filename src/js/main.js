function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  });
  document.getElementById("date-time").textContent = date;
  document.getElementById("time").textContent = time;
}

function fetchWeather() {
  // Only get weather condition in Arabic
  fetch("https://wttr.in/?format=%C&lang=ar")
    .then((res) => res.text())
    .then((condition) => {
      document.getElementById("weather-status").textContent = condition;

      // Pick icon based on condition
      if (condition.includes("غائم")) {
        document.getElementById("weather-icon").src =
          "https://openweathermap.org/img/wn/03d.png";
      } else if (condition.includes("مشمس")) {
        document.getElementById("weather-icon").src =
          "https://openweathermap.org/img/wn/01d.png";
      } else if (condition.includes("أمطار")) {
        document.getElementById("weather-icon").src =
          "https://openweathermap.org/img/wn/09d.png";
      } else {
        document.getElementById("weather-icon").src =
          "https://openweathermap.org/img/wn/50d.png";
      }
    })
    .catch((err) => console.error(err));
}

function getCity() {
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("location").textContent = data.city;
    });
}

function initWeatherWidget() {
  fetchWeather();
  updateDateTime();
  setInterval(updateDateTime, 60000);
}

function updateYear() {
  const currentYear = new Date().getFullYear();
  const yearTags = document.getElementsByClassName("year");

  for (let i = 0; i < yearTags.length; i++) {
    yearTags[i].textContent = currentYear;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initWeatherWidget();
  getCity();
  updateDateTime();
  updateYear();
});
