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
    console.log("hello");
    return `${baseUrl}cityName=${cityName}`;
  }
};

const goToResults = (url) => {
  console.log(url);
  window.location.href = url;
};

const onSearch = () => {
  // get
  //navigate to url

  // Get form input value and trim, get event type option if chosen
  const searchInput = $("#city-input").val().trim();
  const eventType = validateEventType();

  if (searchInput === "") {
    // append error alert
    // refactor change to guard clause instead of if else
  } else {
    lowerCaseSearchInput = searchInput.toLowerCase();
    // capitalise first letter of city name
    let cityName =
      lowerCaseSearchInput.charAt(0).toUpperCase() +
      lowerCaseSearchInput.slice(1);

    const url = constructUrl(cityName, eventType);
    goToResults(url);
  }
};

$("#search-bar-container").on("click", "a", onSearch);
