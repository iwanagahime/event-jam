const validateEventType = () => {
  let eventType = $("#eventType-dropdown").val();
  if (eventType === "Event type") {
    eventType = null;
  }
  return eventType;
};

const constructUrl = (cityName, eventType) => {
  if (cityName && eventType) {
    return `https://iwanagahime.github.io/event-jam/results.html?cityName=${cityName}&eventType=${eventType}`;
  } else {
    return `https://iwanagahime.github.io/event-jam/results.html?cityName=${cityName}`;
  }
};

const goToResults = (url) => {
  window.location.href = url;
};

const onSearch = () => {
  // get form input
  //navigate to url

  // Get searched value and trim and get option if chosen
  const searchInput = $("#city-input").val().trim();
  const eventType = validateEventType();

  if (searchInput === "") {
    $("#error-container").empty()
    $("#error-container").append(
      `<h1 class="has-text-white is-centered mt4" style="size:40px">Please enter a city name to search</h1>`)
  } else {
    lowerCaseSearchInput = searchInput.toLowerCase();
    // capitalise first letter of city name
    let cityName =
      lowerCaseSearchInput.charAt(0).toUpperCase() +
      lowerCaseSearchInput.slice(1);

    const url = constructUrl(cityName, eventType);
    console.log(url);
    goToResults(url);
  }
};

$("#search-bar-container").on("click", "a", onSearch);
