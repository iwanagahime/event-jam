const validateEventType = () => {
  let eventType = $("#eventType-dropdown").val();
  if (eventType === "Event type") {
    eventType = null;
  }
  return eventType;
};

const constructUrl = (cityName, eventType) => {
  const baseUrl =
    // "file:///C:/Users/soume/coding_bootcamp/projects/event-jam/results.html?";
    "http://127.0.0.1:5500/results.html?";
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
    goToResults(url);
  }
};

$("#search-bar-container").on("click", "a", onSearch);
