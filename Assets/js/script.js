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
