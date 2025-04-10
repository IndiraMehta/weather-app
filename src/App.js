import './App.css';
import { useEffect, useState } from 'react';

function App() {
  // State for city input
  const [city, setCity] = useState("Delhi");

  // State for fetched weather data
  const [weatherData, setWeatherData] = useState(null);

  // State for weather condition (for background change)
  const [weatherCondition, setWeatherCondition] = useState("");

  // Date setup
  const currentDate = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formatedDate = `${month} ${day}, ${year}`;

  // Weather API key
  const API_KEY = "209ac46616b5f90d97f51b050ac95120";

  // Weather data fetch function (by city)

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === "404") {
        alert("City not found!");
        return;
      }

      setWeatherData(data);
      setWeatherCondition(data.weather[0].main); // Set condition for bg
    } catch (error) {
      console.log(error);
    }
  };

  // Get current location and fetch weather
  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          if (data.cod === "404") {
            alert("City not found!");
            return;
          }
    
          setWeatherData(data);
          setCity(data.name); // Update city input too
          setWeatherCondition(data.weather[0].main);
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  // Page load par initial data fetch karo
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Input field update
  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  // Submit par API call karo
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  // Weather ke icon select karo
  const getWeaatherIconUrl = (main) => {
    if (main === "Clouds") return "/thunder.png";
    else if (main === "Rain") return "/rain_with_cloud.png";
    else if (main === "Mist") return "/Tornado.png";
    else if (main === "Haze") return "/sun.png";
    else if (main === "Clear") return "/sun.png";
    else return "/images.png"; // default icon
  };

  
  

  return (
    // <div className={`App ${setBackgroundImage()}`}>
    
    < div>
      <div className='container'>
        {weatherData && (
          <>
            {/* Date */}
            <h1 className='container_date'>{formatedDate}</h1>

            {/* Weather Info */}
            <div className='weather_data'>
              <h2 className='container_city'>{weatherData.name}</h2>

              {/* Weather Icon */}
              <img
                className='container_img'
                src={getWeaatherIconUrl(weatherData.weather[0].main)}
                width="180px"
                alt='Weather Icon'
              />

              {/* Temperature and Condition */}
              <h2 className='container_degree'>{weatherData.main.temp}°C</h2>
              <h2 className='country_per'>{weatherData.weather[0].main}</h2>

              {/* City Input Form */}
              <form className='form' onSubmit={handleSubmit}>
                <input
                  type="text"
                  className='input'
                  placeholder='Enter City Name'
                  value={city}
                  onChange={handleInputChange}
                />
                <button type='submit'>Get</button>
              </form>

              {/* Current Location Button */}
              <button type='button' className='location-btn' onClick={getCurrentLocationWeather}>
                Use Current Location
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

