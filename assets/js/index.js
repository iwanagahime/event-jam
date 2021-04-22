const validateEventType = () => {
  let eventType = $("#eventType-dropdown").val();
  if (eventType === "Event type") {
    eventType = null;
  }
  return eventType;
};

const constructUrl = (cityName, eventType) => {
  const baseUrl = "http://127.0.0.1:5500/results.html?";
  // change baseURL to deployed when done working
  if (cityName && eventType) {
    return `${baseUrl}cityName=${cityName}&eventType=${eventType}`;
  } else {
    return `${baseUrl}cityName=${cityName}`;
  }
};

const goToResults = (url) => {
  window.location.href = url;
};

const onSearch = () => {
  const searchInput = $("#city-input").val().trim();
  const eventType = validateEventType();

  if (searchInput === "") {
    $("#error-container").empty();
    $("#error-container").append(
      `<h1 class="has-text-white is-centered mt4" style="size:40px">Please enter a city name to search</h1>`
    );
  } else {
    lowerCaseSearchInput = searchInput.toLowerCase();

    let cityName =
      lowerCaseSearchInput.charAt(0).toUpperCase() +
      lowerCaseSearchInput.slice(1);

    const url = constructUrl(cityName, eventType);
    goToResults(url);
  }
};

$("#search-bar-container").on("click", "a", onSearch);
