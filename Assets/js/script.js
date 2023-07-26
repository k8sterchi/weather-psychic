document.addEventListener("DOMContentLoaded", function () {
    const weatherForm = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");
    const weatherForecastDiv = document.getElementById("weatherForecast");
    const WeatherPsychicAppKey = 'd72fd408c6d82ddc85880d6e8ae64a2b'; 
  
    weatherForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission from refreshing the page
  
      // Get the user input (city name)
      const cityNameInput = cityInput.value.trim();
  
      if (cityNameInput === "") {
        // Show an error message if the city name is empty
        weatherForecastDiv.textContent = "Please enter a city name.";
      } else {
        // Proceed to fetch weather data from the OpenWeather API
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${WeatherPsychicAppKey}`;
  
        fetch(currentWeatherUrl)
          .then(response => response.json())
          .then(data => {
            // relevant weather information
            const city = data.name;
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
  
            // Get today's date
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = today.toLocaleDateString('en-US', options);
  
            // Get the weather icon URL
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
  
            // Update the HTML with the weather information
            weatherForecastDiv.innerHTML = `
              <h3>Weather in ${city}</h3>
              <p>Date: ${formattedDate}</p>
              <p>Description: ${weatherDescription}</p>
              <p>Temperature: ${temperature} °C</p>
              <p>Humidity: ${humidity}%</p>
              <img src="${iconUrl}" alt="Weather Icon">
            `;
          })
          .catch(error => {
            console.error("Error fetching weather data:", error);
            weatherForecastDiv.textContent = "Error fetching weather data.";
          });
      }
    });
  });