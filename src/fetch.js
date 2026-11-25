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

function mapResultToObj(result) {
  const location = result.location;
  const currentData = result.current;
  const forecastData = result.forecast?.forecastday?.[0]?.day;

  return {
    city: location.name,
    currentTemp: currentData.temp_c,
    description: currentData.condition.text,
    min_temp: forecastData.mintemp_c,
    max_temp: forecastData.maxtemp_c,
  };
}
