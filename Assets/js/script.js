const WeatherPsychicAppKey = 'd72fd408c6d82ddc85880d6e8ae64a2b';


document.addEventListener("DOMContentLoaded", function () {
  // Get the form element
  const weatherForm = document.getElementById("weatherForm");

  // Add an event listener for form submission
  weatherForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    // Get the user input (city name)
    const cityNameInput = weatherForm.elements.city.value;

    // Log the city name to the console
    console.log("City Name:", cityNameInput);

    // You can proceed to fetch weather data from the OpenWeather API here
    // Make sure to use the cityNameInput variable in your API call

    // For demonstration purposes, let's update the weatherInfo div with the city name
    const weatherInfoDiv = document.getElementById("weatherInfo");
    weatherInfoDiv.textContent = `Weather information for ${cityNameInput}`;
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const weatherForm = document.getElementById("weatherForm");
    const weatherInfoDiv = document.getElementById("weatherInfo");
  
    weatherForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const cityNameInput = weatherForm.elements.city.value;
      const WeatherPsychicAppKey = 'd72fd408c6d82ddc85880d6e8ae64a2b'; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameInput}&appid=${WeatherPsychicAppKey}`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Process the API response to extract weather information
          const weatherDescription = data.weather[0].description;
          const temperature = data.main.temp;
  
          // Update the HTML with the weather information
          weatherInfoDiv.innerHTML = `
            <h3>${cityNameInput}</h3>
            <p>Weather: ${weatherDescription}</p>
            <p>Temperature: ${temperature} °C</p>
          `;
  
          // Apply dynamic styling based on weather conditions
          if (weatherDescription.includes("rain")) {
            weatherInfoDiv.classList.add("rainy"); // Add a CSS class for rainy weather
          } else {
            weatherInfoDiv.classList.remove("rainy"); // Remove the class if not rainy
          }
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          weatherInfoDiv.innerHTML = "Error fetching weather data.";
        });
    });
  });