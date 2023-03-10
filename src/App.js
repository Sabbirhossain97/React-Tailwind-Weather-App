import React, { useState, useEffect } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdVisibility } from "react-icons/md";
import { TbGauge } from "react-icons/tb";
import { WiHumidity } from "react-icons/wi";
import { BiWind } from "react-icons/bi";
import { TbTemperatureCelsius } from "react-icons/tb";
import "./index.css";
import Forecast from "./components/Forecast";
import LoadingScreen from "./components/LoadingScreen";
import axios from "axios";

export default function App() {
  const [weatherApiData, setWeatherApiData] = useState();
  const [forecastData, setForecastData] = useState();
  const [city, setCity] = useState("");
  const [weatherByCity, setWeatherByCity] = useState();
  const [forecastByCity, setForecastByCity] = useState();
  const [delay, setDelay] = useState(0);
  const apiKey = process.env.REACT_APP_API_KEY;

  function getWeatherDetails() {
    if (!navigator.geolocation) {
      console.log("does not work!");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&type=hour&units=metric&appid=${apiKey}`;
        axios
          .get(weatherUrl)
          .then((response) => setWeatherApiData(response.data));
        axios
          .get(forecastUrl)
          .then((response) => setForecastData(response.data));
      });
    }
  }
  useEffect(() => {
    getWeatherDetails();
    // eslint-disable-next-line
  }, []);

  const date = new Date().toLocaleDateString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const queryCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const queryForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&type=hour&units=metric&appid=${apiKey}`;

  function handleSubmit(e) {
    if (e.key === "Enter") {
      axios
        .get(queryCity)
        .then((response) => {
          setWeatherByCity(response.data);
        })
        .catch((error) => {
          console.log(error);
          setCity("");
        });
      axios
        .get(queryForecast)
        .then((response) => {
          setForecastByCity(response.data);
        })
        .catch((error) => {
          console.log(error);
          setCity("");
        });
    }
  }

  setTimeout(() => setDelay(1), 2000);
  return delay === 0 ? (
    <LoadingScreen />
  ) : (
    <div className="overflow-hidden">
      <div className="font-inter font-medium bg-gradient-to-b from-slate-800 to-slate-900 h-full w-full">
        <div className="mx-auto border border-transparent sm:h-full xs:w-11/12 sm:w-10/12 md:w-3/4 lg:w-3/4 xl:w-2/3 2xl:w-1/2  ">
          {/* search area */}
          <div className="mt-24 ">
            <label className="relative block ">
              <span className="absolute inset-y-0 left-0 flex items-center ml-4 ">
                <AiOutlineSearch className="text-slate-400 " />
              </span>
              <input
                className=" caret-slate-400 placeholder:not-italic placeholder:text-slate-400 placeholder:text-md block text-slate-400 bg-zinc-900/20 w-full h-12 border border-slate-900/10 rounded-md py-2 pl-9  shadow-md focus:outline-none focus:border-cyan-500 sm:text-sm"
                placeholder="Search by cities..."
                type="text"
                name="search"
                value={city}
                onKeyPress={handleSubmit}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </label>
          </div>
          {/* search area /end */}

          {/* main */}

          <div>
            <div className="  bg-zinc-900/20 rounded-lg mt-8 grid xs:grid-cols-1 xs:grid-rows-2 sm:grid-cols-2 sm:grid-rows-1  ">
              {/* first column /start*/}
              <div className="  flex flex-col items-center ">
                <div className=" h-36 w-52 mt-4 ">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-cyan-400 text-md mt-10">{date}</p>
                    <div className="flex justify-center ">
                      <img
                        style={{ color: "white", marginLeft: "10px" }}
                        src={`http://openweathermap.org/img/wn/${
                          weatherByCity
                            ? weatherByCity.weather[0].icon
                            : weatherApiData.weather[0].icon
                        }@2x.png`}
                        alt="error"
                      />
                    </div>
                  </div>
                </div>
                <div className=" h-32 w-52 ">
                  <div className="flex flex-col justify-center items-center">
                    <div className="flex mt-4">
                      <p className=" text-white text-5xl ">
                        {weatherByCity
                          ? Math.round(weatherByCity.main.temp)
                          : Math.round(weatherApiData.main.temp)}
                      </p>
                      <span>
                        <TbTemperatureCelsius className="text-4xl text-slate-400" />
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center mt-4">
                    {" "}
                    <p className=" text-slate-400">Feels like </p>{" "}
                    <span className="text-white ml-1">
                      {weatherByCity
                        ? Math.round(weatherByCity.main.feels_like)
                        : Math.round(weatherApiData.main.feels_like)}
                      <span className="text-slate-400 ml-0.5">??</span>
                    </span>
                  </div>
                </div>
                <div className=" h-36 w-52">
                  <div className=" flex flex-col justify-center items-center">
                    <div>
                      <p className=" text-white text-3xl text-center">
                        {weatherByCity
                          ? weatherByCity.weather[0].description
                              .charAt(0)
                              .toUpperCase() +
                            weatherByCity.weather[0].description.slice(1)
                          : weatherApiData.weather[0].description
                              .charAt(0)
                              .toUpperCase() +
                            weatherApiData.weather[0].description.slice(1)}
                      </p>
                    </div>
                    <div className="flex mt-2 justify-center ">
                      <span>
                        <MdLocationOn className="mt-0.5 mr-0.5 text-cyan-500 text-xl" />
                      </span>
                      <p className="flex text-slate-400 text-md">
                        {weatherByCity
                          ? weatherByCity.name +
                            ", " +
                            weatherByCity.sys.country
                          : weatherApiData.sys.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* first column /end */}

              {/* second column /start */}
              <div className=" mx-auto xs:grid xs:grid-rows-2 xs:grid-cols-3 sm:grid sm:grid-cols-2 sm:grid-rows-3 ">
                <div className=" flex flex-col justify-end items-center h-32 w-36 xs:mr-2 sm:mr-8">
                  <div className="flex flex-row justify-center">
                    <p className="text-slate-400 ">Max</p>
                    <FaLongArrowAltUp className="text-cyan-400 text-lg ml-0.5 mt-1" />
                  </div>

                  <p className="text-lg p-4 text-white flex flex-row">
                    {weatherByCity
                      ? Math.round(weatherByCity.main.temp_max)
                      : Math.round(weatherApiData.main.temp_max)}
                    <span className="text-slate-400 ">
                      <TbTemperatureCelsius className="mt-0.5" />
                    </span>
                  </p>
                </div>
                <div className=" flex flex-col justify-end items-center h-32 w-36  ">
                  <div className="flex flex-row justify-center">
                    <p className="text-slate-400">Min</p>
                    <FaLongArrowAltDown className="text-cyan-400 text-lg ml-0.5 mt-1" />
                  </div>
                  <p className="text-lg p-4 text-white flex flex-row">
                    {weatherByCity
                      ? Math.round(weatherByCity.main.temp_min)
                      : Math.round(weatherApiData.main.temp_min)}
                    <span className="text-slate-400">
                      <TbTemperatureCelsius className="mt-0.5" />
                    </span>
                  </p>
                </div>

                <div className=" flex flex-col sm:justify-center items-center h-32 w-36 xs:justify-end">
                  <div className="flex flex-row justify-center">
                    <p className="text-slate-400">Humidity</p>
                    <WiHumidity className="text-cyan-400 text-xl ml-0.5" />
                  </div>
                  <p className="text-lg p-4 text-white">
                    {weatherByCity
                      ? weatherByCity.main.humidity
                      : weatherApiData.main.humidity}
                    %
                  </p>
                </div>
                <div className=" flex flex-col xs:justify-start sm:justify-center items-center h-32 w-36 xs:-mt-16 sm:mt-0">
                  <div className="flex flex-row justify-center">
                    <p className="text-slate-400">Pressure</p>
                    <TbGauge className="text-cyan-400 text-xl ml-2 mt-0.5" />
                  </div>
                  <p className="text-lg p-4 text-white">
                    {weatherByCity
                      ? weatherByCity.main.pressure
                      : weatherApiData.main.pressure}{" "}
                    mb
                  </p>
                </div>
                <div className=" flex flex-col justify-start items-center h-32 w-36 xs:-mt-16 sm:mt-0">
                  <div className="flex flex-row justify-center">
                    <p className="text-slate-400">Visibility </p>
                    <MdVisibility className="text-cyan-400 text-xl ml-2 mt-1" />
                  </div>
                  <p className="text-lg p-4 text-white">
                    {weatherByCity
                      ? Math.round(weatherByCity.visibility / 1609.34)
                      : Math.round(weatherApiData.visibility / 1609.34)}{" "}
                    Miles
                  </p>
                </div>
                <div className=" flex flex-col justify-start items-center h-32 w-36 xs:-mt-16 sm:mt-0">
                  <div className="flex flex-row justify-center">
                    <p className="text-slate-400">Wind </p>
                    <BiWind className="text-cyan-400 text-xl ml-2 mt-0.5" />
                  </div>
                  <p className="text-lg p-4 text-white">
                    {weatherByCity
                      ? weatherByCity.wind.speed
                      : weatherApiData.wind.speed}{" "}
                    mph
                  </p>
                </div>
              </div>

              {/* second column /end */}
            </div>

            {/* main /end*/}

            {/* {Forecast} */}
            <Forecast
              forecastByCity={forecastByCity}
              forecastData={forecastData}
            />
            {/* forecast */}
            <footer className="mt-8 h-24 border-t border-cyan-400/20 w-full flex justify-center items-center">
              <span className="text-cyan-500">?? </span>{" "}
              <span className="text-white text-sm">
                &nbsp;2023 Weather-App. All Rights Reserved.
              </span>
            </footer>
            {/* forecast /end*/}
          </div>
        </div>
      </div>
    </div>
  );
}
