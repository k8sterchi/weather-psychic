document.addEventListener("DOMContentLoaded", function () {
    const weatherForm = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");
    const weatherForecastDiv = document.getElementById("weatherForecast");
    const searchHistoryList = document.getElementById("searchHistory");
    const clearHistoryButton = document.getElementById("clearHistoryButton");
    const WeatherPsychicAppKey = 'd72fd408c6d82ddc85880d6e8ae64a2b'; 
  
       // Function to fetch weather data from the OpenWeather API
  function fetchWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WeatherPsychicAppKey}`;

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
      const searchHistory = getSearchHistory();
      searchHistory.push(cityName);
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

  
    // Add an event listener for form submission
    weatherForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission from refreshing the page
  
      // Get the user input (city name)
      const cityNameInput = cityInput.value.trim();
  
      if (cityNameInput === "") {
        // Show an error message if the city name is empty
        console.log("Please enter a city name.");
        weatherForecastDiv.textContent = "Please enter a city name.";
      } else {
        // Fetch weather data for the searched city
        fetchWeatherData(cityNameInput);
      }
    });

     // Add an event listener for the "Clear Search History" button
  clearHistoryButton.addEventListener("click", function () {
    clearSearchHistory();
  });
  
    // Display the search history on page load
    displaySearchHistory();
  });