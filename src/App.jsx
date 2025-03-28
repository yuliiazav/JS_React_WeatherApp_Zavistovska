import { useEffect, useState, useContext } from "react";
import "./App.css";
import iconWeather from "./assets/images/iconweather.svg";
import sunriseIcon from "./assets/images/sunriseIcon.svg";
import sunsetIcon from "./assets/images/sunsetIcon.svg";
import humidityIcon from "./assets/images/humidityIcon.svg";
import pressureIcon from "./assets/images/pressureIcon.svg";
import windIcon from "./assets/images/windIcon.svg";
import React from "react";
import {
  ThemeContext,
  ThemeProvider,
} from "./components/ThemeContext/ThemeContext";

const key = "61c2f0427e316fdd5b1ac0d1228b6c28";

function App() {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [query, setQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${key}`
    )
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("City not found.");
          }
          throw new Error("Не вдалося завантажити дані.");
        }
        return res.json();
      })
      .then((data) => setCity(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCityChange = (e) => {
    setInputCity(e.target.value);
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      setQuery(inputCity);
      setInputCity("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setInputCity("");
    }
  };

  return (
    <ThemeProvider>
      <div className="wrapper">
        <div id="weather" className={`weather ${theme}`}>
          <button className="colorScheme-switch" onClick={toggleTheme}>
            Switch color theme
          </button>
          <h2 className="welcometext">Check the weather in your city!</h2>
          <div className="weather__header">
            <div className="logo">
              <img src={iconWeather} alt="iconWeather" className="logo__img" />
            </div>
            <div className="search">
              <input
                className="inputCity"
                type="text"
                value={inputCity}
                onChange={handleCityChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your city name..."
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {!loading && !error && city && (
            <>
              <div className="weather__boxes">
                <div
                  className="weather__generalInfo weather__box"
                  style={{
                    background: theme === "dark" ? "#909090f2" : "#d9d9d9",
                  }}
                >
                  <div className="weather__city">
                    <h1>{city.name} </h1>
                  </div>
                  <div className="weather__time">
                    <div className="time">
                      {currentTime.toLocaleTimeString()}
                    </div>
                    <div className="date">
                      {new Date().toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className="weather__detailedInfo weather__box block"
                  style={{
                    background: theme === "dark" ? "#909090f2" : "#d9d9d9",
                  }}
                >
                  <div className="block__weatherTemp">
                    <div className="weather__temp">
                      {Math.round(city.main?.temp)}°C
                    </div>

                    <div className="weather__sun">
                      <div className="weather__sunrise ">
                        <img
                          src={sunriseIcon}
                          alt="sunriseIcon"
                          className="weather__detailsIcon"
                        />
                        <div className="weather__sunInfo">
                          <span className="accent">Sunrise: </span>
                          <span>
                            {new Date(
                              city.sys?.sunrise * 1000
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="weather__sunset">
                        <img
                          src={sunsetIcon}
                          alt="sunsetIcon"
                          className="weather__detailsIcon"
                        />
                        <div className="weather__sunInfo">
                          <span className="accent">Sunset:</span>
                          <span>
                            {new Date(
                              city.sys?.sunset * 1000
                            ).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="block__weatherStatus">
                    <div className="weather__feels-like">
                      <span>Feels like:</span>
                      <span className="accent">
                        {Math.round(city.main?.feels_like)}°C
                      </span>
                    </div>
                    <div className="weather__icon">
                      <img
                        src={`http://openweathermap.org/img/w/${city.weather[0].icon}.png`}
                        alt="Weather icon"
                      />
                    </div>
                    <div className="weather__status">
                      {city.weather[0].description}
                    </div>
                  </div>
                  <div className="block__weatherDetails">
                    <div className="weatherDetails__box">
                      <img
                        src={humidityIcon}
                        alt="humidityIcon"
                        className="weather__detailsIcon"
                      />
                      <div className="weatherDetails__info">
                        <span>Humidity: </span>
                        <span className="accent"> {city.main?.humidity}%</span>
                      </div>
                    </div>
                    <div className="weatherDetails__box">
                      <img
                        src={windIcon}
                        alt="windIcon"
                        className="weather__detailsIcon"
                      />
                      <div className="weatherDetails__info">
                        <span> Wind: </span>
                        <span className="accent"> {city.wind?.speed} m/s </span>
                      </div>
                    </div>
                    <div className="weatherDetails__box">
                      <img
                        src={pressureIcon}
                        alt="pressureIcon"
                        className="weather__detailsIcon"
                      />
                      <div className="weatherDetails__info">
                        <span>Pressure : </span>
                        <span className="accent">
                          {city.main?.pressure} hPa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
