const constructUrl = (cityName, eventType) => {
  if (cityName && eventType) {
    return `file:///C:/Users/soume/coding_bootcamp/projects/results.html?cityName=${cityName}&eventType=${eventType}`;
  } else {
    return `file:///C:/Users/soume/coding_bootcamp/projects/results.html?cityName=${cityName}`;
  }
};

const callback = () => {
  // get form input
  //navigate to url

  // Get searched value and trim and get option if chosen
  const searchInput = $("#city-input").val().trim();
  const eventType = $("#eventType-dropdown").val();

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
  }
};

$("#search-container").on("click", "a", callback);

// const getUrlParams = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const cityName = urlParams.get("cityName");
//   const eventType = urlParams.get("eventType");

//   console.log(cityName, eventType);
// };

// $(document).ready(getUrlParams);
