const validateEventType = () => {
  let eventType = $("#eventType-dropdown").val();
  if (eventType === "Event type") {
    eventType = null;
  }
  return eventType;
};

const constructUrl = (cityName, eventType) => {
  if (cityName && eventType) {
    return `file:///C:/Users/soume/coding_bootcamp/projects/event-jam/search-function/results.html?cityName=${cityName}&eventType=${eventType}`;
  } else {
    return `file:///C:/Users/soume/coding_bootcamp/projects/event-jam/search-function/results.html?cityName=${cityName}`;
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
    // append error alert
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

$("#search-container").on("click", "a", onSearch);
