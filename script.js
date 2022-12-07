//globals
let apiKey = '843fa40ad68a96668befb0da86d9b44b';
let cityName = 'Phoenix'; 
let weatherApiRootUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
//testing response
fetch(weatherApiRootUrl)
.then(function (res) {
    return res.json();
})
.then(function (data) {
    console.log(data.main.humidity);
})

//DOM element references 
let searchForm = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
let todayContainer = document.querySelector('#today');
let forecastContainer = document.querySelector('#forecast');
let searchHistoryContainer = document.querySelector('#history');
//location
let heading = document.querySelector('#currentLocation');
//icons 
let weatherIcon = document.querySelector('#currentWeatherIcon');
let forecastIcon1 = document.querySelector('#day-1-icon');
let forecastIcon2 = document.querySelector('#day-2-icon');
let forecastIcon3 = document.querySelector('#day-3-icon');
let forecastIcon4 = document.querySelector('#day-4-icon');
let forecastIcon5 = document.querySelector('#day-5-icon');


let tempEl = document.querySelector('#currentTemp');
let windEl = document.querySelector('#currentWind');
let humidity = document.querySelector('#currentHumidity');
let uvEl = document.querySelector('#currentUV');
//Dates
let currentDate = document.querySelector('#currentDate');
let fDate = document.querySelector('#fDate')
let fDate2 = document.querySelector('#fDate2')
let fDate3 = document.querySelector('#fDate3')
let fDate4 = document.querySelector('#fDate4')
let fDate5 = document.querySelector('#fDate5')
//forecast temps
let fTemp = document.querySelector('#day-1-temp');
let fTemp2 = document.querySelector('#day-2-temp');
let fTemp3 = document.querySelector('#day-3-temp');
let fTemp4 = document.querySelector('#day-4-temp');
let fTemp5 = document.querySelector('#day-5-temp');



dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);






function fetchWeather(location) {
    let { lat } = location;
    let { lon } = location;

    let city = location.name;
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
      let iconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
      let forecastIconUrl1 = `https://openweathermap.org/img/w/${data.daily[0].weather[0].icon}.png`;
      let forecastIconUrl2 = `https://openweathermap.org/img/w/${data.daily[1].weather[0].icon}.png`;
      let forecastIconUrl3 = `https://openweathermap.org/img/w/${data.daily[2].weather[0].icon}.png`;
      let forecastIconUrl4 = `https://openweathermap.org/img/w/${data.daily[3].weather[0].icon}.png`;
      let forecastIconUrl5 = `https://openweathermap.org/img/w/${data.daily[4].weather[0].icon}.png`;
      
      console.log(city, data);
      //currents (weather)
      heading.textContent = `City: ${city}`;
      tempEl.textContent = `${data.current.temp}°F`;
      humidity.textContent = `Humidity: ${data.current.humidity}`;
      windEl.textContent = `Wind Speed: ${data.current.wind_speed}`;
      uvEl.textContent = `UV Index: ${data.current.uvi}`;
      currentDate.textContent = dayjs().tz(data.current.timezone).format('M/D/YYYY');
      //forecasts (weather)
      fTemp.textContent = `${data.daily[0].temp.eve}°F`;
      fTemp2.textContent = `${data.daily[1].temp.eve}°F`;
      fTemp3.textContent = `${data.daily[2].temp.eve}°F`;
      fTemp4.textContent = `${data.daily[3].temp.eve}°F`;
      fTemp5.textContent = `${data.daily[4].temp.eve}°F`;
      //forecats (day)
      fDate.textContent = dayjs().tz(data.current.timezone).add(1, 'day').startOf('day').format('ddd, MMM D, YYYY');
      fDate2.textContent = dayjs().tz(data.current.timezone).add(2, 'day').startOf('day').format('ddd, MMM D, YYYY');
      fDate3.textContent = dayjs().tz(data.current.timezone).add(3, 'day').startOf('day').format('ddd, MMM D, YYYY');
      fDate4.textContent = dayjs().tz(data.current.timezone).add(4, 'day').startOf('day').format('ddd, MMM D, YYYY');
      fDate5.textContent = dayjs().tz(data.current.timezone).add(5, 'day').startOf('day').format('ddd, MMM D, YYYY');
      //icons (current)
      weatherIcon.setAttribute('src', iconUrl);
      //icons (forecast)
      forecastIcon1.setAttribute('src', forecastIconUrl1);
      forecastIcon2.setAttribute('src', forecastIconUrl2);
      forecastIcon3.setAttribute('src', forecastIconUrl3);
      forecastIcon4.setAttribute('src', forecastIconUrl4);
      forecastIcon5.setAttribute('src', forecastIconUrl5);
      
    })
    .catch(function (err) {
      console.error(err);
    });
};



function fetchCoords(search) {
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
};

function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  
};

function renderSearchHistory() {
  searchHistoryContainer.innerHTML = '';

  // Start at end of history array and count down to show the most recent at the top.
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    // `data-search` allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // If there is no search term return the function
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);

  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  var storedHistory = localStorage.getItem('search-history');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

function handleSearchHistoryClick(e) {
  // Don't do search if current elements is not a search history button
  if (!e.target.matches('.btn-history')) {
    return;
  }

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

searchForm.addEventListener('submit', handleSearchFormSubmit);

