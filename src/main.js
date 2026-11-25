import { getDailyForecast } from "./fetch";

loadWeather();

function renderCurrentWeather(data) {
  document.querySelector(".current-weather__city").textContent = data.city;
  document.querySelector(".current-weather__temp").textContent =
    `${Math.round(data.currentTemp)}°`;
  document.querySelector(".current-weather__description").textContent =
    data.description;
  document.querySelector(".current-weather__min-temp").textContent =
    `Min: ${Math.round(data.min_temp)}°`;
  document.querySelector(".current-weather__max-temp").textContent =
    `Max: ${Math.round(data.max_temp)}°`;
}

function renderLoading(isLoading) {
  const loadingElement = document.getElementById("loading");
  loadingElement.classList.toggle("loading--hidden", !isLoading);
}

async function loadWeather() {
  renderLoading(true);
  try {
    const currentForecast = await getDailyForecast("Düsseldorf", 1, Date.now);
    renderCurrentWeather(currentForecast);
  } finally {
    renderLoading(false);
  }
}
