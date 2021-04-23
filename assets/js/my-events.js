let pageNumber = 0;
const orderFavEvents = (savedEvents) => {
  orderedEventSearchesArray = savedEvents.reverse();
  return orderedEventSearchesArray;
};

const displayNoEventsScreen = () => {
  $("main").append(`
  <div class="search-bar-container mt-6 py-5" id="search-bar-container">
  <div class="is-size-3 has-text-centered has-text-weight-bold has-text-warning pb-6">You have no saved events. Search to find your next event!</div>
  <div class="field has-addons has-addons-left mb-5 columns is-mobile is-centered pt-6">
    <div class="control ">
      <input class="input is-warning" type="text" placeholder="Enter city name" id="city-input">
    </div>
    
     <div class="control mx-4">
        <div class="select">
          <select id="eventType-dropdown">
            <option >Event type</option>
            <option>Music</option>
            <option>Sport</option>
            <option>Family</option>
            <option>Theatre</option>
            <option>Comedy</option>
          </select>
        </div>
      </div>
      <div class="control">
        <a class="button is-warning has-text-warning-dark has-text-weight-bold" id="search-button">
          <i class="fas fa-search"></i>
        </a>
      </div>
  </div>`);
  $("#search-bar-container").on("click", "a", onSearch);
};

const removeEventObject = (event) => {
  // retrieve array from local storage
  const savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
  console.log("hello")
  // get url of object to remove
  const urlForObjectToRemove = $(event.currentTarget)
    .parent()
    .attr("data-eventUrl");

  const removeEvent = (item) => {
    if (item.eventUrl !== urlForObjectToRemove) {
      return true;
    } else {
      return false;
    }
  };
  // go through the retrieved array and remove the object
  const newSavedEventsArray = savedEvents.filter(removeEvent);
  // empty container
  $("#card-container").empty();

  // newSavedEventsArray.forEach(displayEventCard);
  // // render cards
  displaySavedEvents(newSavedEventsArray);
  // save new array in local storage
  localStorage.setItem("favoriteEvents", JSON.stringify(newSavedEventsArray));
};

const goToTMEventPage = (event) => {
  const urlForTMEventPage = $(event.currentTarget)
    .parent()
    .attr("data-eventUrl");
  window.open(`${urlForTMEventPage}`, "_blank");
};

const displayEventCard = (item) => {
  $("#card-container").append(
    `<div class="tile is-parent">
    <div class="card has-text-centered">
      <div class="card-image">
          <figure class="image is-4by3">
            <img src="${item.image}" alt="${item.name} event image">
          </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <div><h2 class="has-text-centered ">${item.name}</h2> </div>
          <div class="py-1 has-text-weight-medium">Date: ${item.date}</div>
          <div class="py-1 has-text-weight-medium">Time: ${item.time}</div> 
          <div class="py-1 has-text-weight-medium">Venue: ${item.venue}</div>
          <div style="text-align:center" data-name="${item.name}" data-date="${item.date}" data-time="${item.time}" data-venue="${item.venue}" data-eventUrl="${item.eventUrl}" data-city="${item.city}" >
            <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded event-tm-info">More info</a>
            <a class="button mx-5 my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded remove">Remove from My Events</a>
          </div>
        </div>
        <div class="covid-info-container" data-city="${item.city}">
          <button class="button is-light has-text-black has-background-warning has-text-weight-bold is-rounded covid-info">
            See COVID 19 info
          </button>
        </div>
        <div id="error-container"></div>
      </div>
    </div>
  </div>
  `
  );
};

const displayCovidInfo = async (event) => {
  const parent = $(event.currentTarget).parent();
  //get region/city name
  const cityName = $(parent).attr("data-city");
  //call covid info function
  const covidUrl = buildCovidUrl(cityName);

  const covidData = await getCovidData(covidUrl);

  // display covid info onto page
  $(parent).empty();
  $(parent).parent()
    .append(`<div class="py-1 has-text-weight-medium"> Number of cases in the last 30 days: ${covidData.sumLast30DaysCovidData}</div>
  `);
};

const displaySearchBar = () => {
  $("main").append(`
  <div class="container" id="search-bar-container">
  <div class="field has-addons has-addons-left mb-5">
    <div class="control">
      <input class="input is-warning" type="text" placeholder="Enter city name" id="city-input">
    </div>
     <div class="control mx-4">
        <div class="select" >
        <select id="eventType-dropdown">
            <option >Event type</option>
            <option>Music</option>
            <option>Sport</option>
            <option>Family</option>
            <option>Theatre</option>
            <option>Comedy</option>
          </select>
        </div>
      </div>
      <div class="control">
        <a class="button is-warning has-text-warning-dark has-text-weight-bold" id="search-button">
          <i class="fas fa-search"></i>
        </a>
      </div>
  </div>
</div>`);
  $("#search-bar-container").on("click", "a", onSearch);;
};

const displaySavedEvents = (eventsArray) => {
  //create container
  $("main").append(
    `<div class="tile is-ancestor mx-4 is-flex-wrap-wrap is-align-items-center" id="card-container">`
  );
  eventsArray.forEach(displayEventCard);
  $(".covid-info-container").on("click", "button", displayCovidInfo);
  $(".remove").click(removeEventObject);
  $(".event-tm-info").click(goToTMEventPage)
};

const onLoad = () => {
  const savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
  // check if there are any saved events in local storage
  if (savedEvents !== null && savedEvents.length) {
    // order local storage objects in order of search recency
    eventsInAddedOrder = orderFavEvents(savedEvents);
    displaySearchBar();
    // for each saved event, render a card
    displaySavedEvents(eventsInAddedOrder);
    //$(eventsInAddedOrder).each(displaySavedEvents);
  } else {
    displayNoEventsScreen();
  }
};

$(document).ready(onLoad);
