import { getDailyForecast } from "./fetch";

loadWeather();

function renderCurrentWeather(data) {
  document.querySelector(".current-weather__city").textContent = data.city;
  document.querySelector(".current-weather__temp").textContent =
    `${Math.round(data.currentTemp)}°`;
  document.querySelector(".current-weather__description").textContent =
    data.description;
  document.querySelector(".current-weather__min-temp").textContent =
    `T: ${Math.round(data.minTemp)}°`;
  document.querySelector(".current-weather__max-temp").textContent =
    `H: ${Math.round(data.maxTemp)}°`;
}

function renderHourlyForecast(data) {
  const forecastList = document.querySelector(".day-forecast__list");
  const forecastItem = `<div class="day-forecast__hour">
            <p class="day-forecast__time"></p>
            <img
              src=""
              alt=""
              class="day-forecast__icon"
            />
            <p class="day-forecast__temp"></p>
          </div>`;

  forecastList.innerHTML = forecastItem.repeat(24);

  const hourElements = forecastList.querySelectorAll(".day-forecast__hour");

  hourElements.forEach((element, i) => {
    const hour = data.dayHour[i];

    element.querySelector(".day-forecast__time").textContent = formatHour(
      hour.time,
    );
    element.querySelector(".day-forecast__icon").src = hour.condition.icon;
    element.querySelector(".day-forecast__temp").textContent =
      `${Math.round(hour.temp_c)}°`;
  });
}

function renderForecastSummary(data) {
  const forecastSummaryEl = document.querySelector(".day-forecast__summary");
  const forecastSummary =
    "Heute " + data.description + ". Wind bis zu: " + data.maxWind + "km/h.";

  forecastSummaryEl.innerHTML = forecastSummary;
}

function renderLoading(isLoading) {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.toggle("loading--hidden", !isLoading);
}

function formatHour(dateTimeString) {
  return new Date(dateTimeString).getHours() + " Uhr";
}

async function loadWeather() {
  renderLoading(true);
  try {
    const currentForecast = await getDailyForecast("Düsseldorf", 1, Date.now);
    renderCurrentWeather(currentForecast);
    renderForecastSummary(currentForecast);
    renderHourlyForecast(currentForecast);
  } finally {
    renderLoading(false);
  }
}
