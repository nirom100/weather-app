const BASE_URL = "https://api.weatherapi.com/v1";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const currentCity = "Düsseldorf";

export async function getCurrent(currentCity) {
  const params = new URLSearchParams({
    q: currentCity,
    key: API_KEY,
  });
  try {
    const response = await fetch(`${BASE_URL}/current.json?${params}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Request failed: ", error.message);
  }
}

export async function getDailyForecast(currentCity, days, date) {
  const params = new URLSearchParams({
    q: currentCity,
    days: days,
    dt: date,
    key: API_KEY,
    lang: "de",
  });

  try {
    const response = await fetch(`${BASE_URL}/forecast.json?${params}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return mapResultToObj(result);
  } catch (error) {
    console.error("Request failed: ", error.message);
  }
}

function mapCurrentHourForecast(result) {
  // Get day 0 + 1
  const today = result.forecast?.forecastday[0].hour;
  const tomorrow = result.forecast?.forecastday[1].hour;

  // get current hour
  const hour = new Date().getHours();

  // determine lengths of arrays & combine
  const hoursToday = today.slice(hour);
  const missingLength = 24 - hoursToday.length;
  const missingTomorrow = tomorrow.slice(0, missingLength);

  const merged = hoursToday.concat(missingTomorrow);
  return merged;
}

function mapResultToObj(result) {
  const location = result.location;
  const currentData = result.current;
  const forecastDayData = result.forecast?.forecastday?.[0]?.day;
  const forecastHourData = result.forecast?.forecastday?.[0]?.hour;

  return {
    city: location.name,
    currentTemp: currentData.temp_c,
    description: currentData.condition.text,
    minTemp: forecastDayData.mintemp_c,
    maxTemp: forecastDayData.maxtemp_c,
    maxWind: forecastDayData.maxwind_kph,
    dayHour: mapCurrentHourForecast(result),
  };
}
