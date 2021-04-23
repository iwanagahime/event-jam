const validateEventType = () => {
  let eventType = $("#eventType-dropdown").val();
  if (eventType === "Event type") {
    eventType = null;
  }
  return eventType;
};

const constructUrl = (cityName, eventType) => {
  const baseUrl = "file:///Users/dominikapietrzak/coding_bootcamp/project1/event-jam/results.html?";
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
  const emptyInputErrorMessage = `<h1 class="has-text-white is-centered mt4" style="size:40px">Please enter a city name to search</h1>`

  if (searchInput === "") {
    $("#error-container").empty();
    $("#error-container").append(emptyInputErrorMessage)
  } else {
    const lowerCaseSearchInput = searchInput.toLowerCase();

    const cityName =
      lowerCaseSearchInput.charAt(0).toUpperCase() +
      lowerCaseSearchInput.slice(1);

    const url = constructUrl(cityName, eventType);
    goToResults(url);
  }
};

$("#search-bar-container").on("click", "a", onSearch);
