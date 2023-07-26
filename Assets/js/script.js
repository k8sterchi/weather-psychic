document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired!");
    const weatherForm = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");
    const weatherForecastDiv = document.getElementById("weatherForecast");
    const fiveDayForecastDiv = document.getElementById("fiveDayForecast");
    const searchHistoryList = document.getElementById("searchHistory");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    const WeatherPsychicAppKey = 'd72fd408c6d82ddc85880d6e8ae64a2b'; 


  // Function to fetch weather data from the OpenWeather API
  function fetchWeatherData(cityName) {
    console.log("Fetching weather data for:", cityName);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WeatherPsychicAppKey}&units=imperial`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("City not found. Please check your spelling and try again.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Weather data fetched successfully:", data);
        // Extract relevant weather information
        const city = data.name;
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        // Get today's date
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);

        // Get the weather icon URL
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

        // Update the HTML with the weather information
        weatherForecastDiv.innerHTML = `
          <h3>Today in ${city} <img src="${iconUrl}" alt="Weather Icon"></h3>
          <p>Date: ${formattedDate}</p>
          <p>Description: ${weatherDescription}</p>
          <p>Temperature: ${temperature} °F</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${windSpeed} mph</p>
          
        `;

        // Fetch the 5-day weather forecast for the searched city
        fetchFiveDayForecast(cityName);

        // Only add the searched city to the search history list if it's not already in localStorage
        if (!isCityInSearchHistory(cityName)) {
          addToSearchHistory(cityName);
        }
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        weatherForecastDiv.textContent = "Error fetching weather data.";
      });
  }

  
  // Function to fetch 5-day weather forecast data from the OpenWeather API
  //  created async function with my tutor to replace a .then code 
  async function fetchFiveDayForecast(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${WeatherPsychicAppKey}&units=imperial`;
  
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found. Please check your spelling and try again.");
    }
    const data = await response.json();
  
    // Get the list of weather data for the next 5 days (excluding today)
    const forecastList = data.list.filter(forecast => {
      const date = new Date(forecast.dt * 1000);
      const today = new Date();
      return date.getDate() !== today.getDate(); // Filter out today's forecast
    });
  
    displayFiveDayForecast(forecastList); // Pass forecastList as an argument
  }

// Function to display the 5-day weather forecast
function displayFiveDayForecast(forecastList) { // Accept forecastList as an argument
    // Clear the previous 5-day forecast data
    fiveDayForecastDiv.innerHTML = "";
  
    if (!Array.isArray(forecastList)) {
      console.error("Invalid forecast data. Expected an array.");
      return;
    }
  
    if (forecastList.length === 0) {
      // Display a message when there is no data for the next 5 days
      fiveDayForecastDiv.textContent = "No 5-day forecast data available.";
      return;
    }

    // Create an array to store 5-day weather data
    const fiveDayWeather = [];

    // Loop through the forecast list and group weather data by date
    // learned from tutor that this for of loop was adapted from python
    for (const forecast of forecastList) {
      const date = new Date(forecast.dt * 1000); // Convert the UNIX timestamp to milliseconds and create a Date object
      const existingDay = fiveDayWeather.find(item => item.date === formatDate(date));

      if (!existingDay) {
        fiveDayWeather.push({
          date: formatDate(date),
          minTemp: forecast.main.temp_min,
          maxTemp: forecast.main.temp_max,
          weatherDescription: forecast.weather[0].description,
          iconCode: forecast.weather[0].icon,
          windSpeed: forecast.wind.speed,
        });
      } else {
        if (forecast.main.temp_min < existingDay.minTemp) {
          existingDay.minTemp = forecast.main.temp_min;
        }
        if (forecast.main.temp_max > existingDay.maxTemp) {
          existingDay.maxTemp = forecast.main.temp_max;
        }
      }
    }

    // Loop through the fiveDayWeather array and display the weather information
    // for of loop comes from python 
    for (const day of fiveDayWeather) {
      const iconUrl = `https://openweathermap.org/img/w/${day.iconCode}.png`;

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day-forecast");

      dayDiv.innerHTML = `
        <p>Date: ${day.date}</p>
        <p>Wind Speed: ${day.windSpeed} mph</p>
        <p>Description: ${day.weatherDescription}</p>
        <p>Max Temperature: ${day.maxTemp.toFixed(2)} °F</p>
        <img src="${iconUrl}" alt="Weather Icon">
      `;

      fiveDayForecastDiv.appendChild(dayDiv);
    }
  }
  // Function to format the date as "Day of the Week, Month Day, Year"
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  
    // Function to add the searched city to the search history list and localStorage
    function addToSearchHistory(cityName) {
      const listItem = document.createElement("li");
      listItem.textContent = cityName;
      listItem.classList.add("search-history-item");
  
      // Add a click event listener to the search history item
      listItem.addEventListener("click", function () {
        cityInput.value = cityName;
        fetchWeatherData(cityName);
      });
  
      searchHistoryList.appendChild(listItem);
  
      // Save the search history to localStorage
      // make sure it does not repeat upon reload
      const searchHistory = getSearchHistory();
      if (searchHistory.indexOf(cityName) === -1){
        searchHistory.push(cityName);
      }
      
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
  
// Function to get the search history from localStorage
    function getSearchHistory() {
      const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      return searchHistory;
    }
  
 // Function to check if a city is already in the search history
    function isCityInSearchHistory(cityName) {
      const searchHistory = getSearchHistory();
      return searchHistory.includes(cityName);
    }
  
 // Function to display the search history on page load
    function displaySearchHistory() {
      const searchHistory = getSearchHistory();
  
      // Only display the search history if there are items in localStorage
      if (searchHistory.length > 0) {
        searchHistoryList.innerHTML = ""; // Clear the previous list items
  
        // Add each searched city to the search history list
        for (const city of searchHistory) {
          addToSearchHistory(city);
        }
      }
    }

 // Function to clear the search history from localStorage and the list
  function clearSearchHistory() {
    localStorage.removeItem("searchHistory");
    searchHistoryList.innerHTML = "";
  }
// Event listener for the form submission
weatherForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const cityName = cityInput.value;
    console.log("Form submitted with city:", cityName);
    fetchWeatherData(cityName);
  });

  // Add an event listener for the "Clear Search History" button
  clearHistoryButton.addEventListener("click", function () {
    clearSearchHistory();
  });

  // Display the search history on page load
  displaySearchHistory();
})






