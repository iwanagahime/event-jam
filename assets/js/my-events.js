let pageNumber = 0;

const orderFavEvents = (savedEvents) => {
  orderedEventSearchesArray = savedEvents.reverse();
  return orderedEventSearchesArray;
};

const displayNoEventsScreen = () => {
  const noEventsSearchScreenElement = 
  `<div class="search-bar-container mt-6 py-5" id="search-bar-container">
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
  </div>`

  $("main").append(noEventsSearchScreenElement);
  $("#search-bar-container").on("click", "a", onSearch);
};

const removeEventObject = (event) => {
  // retrieve array from local storage
  const savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));

  // get url of object to remove
  const urlForObjectToRemove = $(event.currentTarget).parent().attr("data-eventUrl");

  const removeEvent = (item) => {
    if (item.eventUrl !== urlForObjectToRemove) {
      return true;
    } else {
      return false;
    }
  };

  // go through the retrieved array and remove the object
  const newSavedEventsArray = savedEvents.filter(removeEvent);

  // empty the cards container
  $("#card-container").empty();

  // render the cards for the updated list of saved events
  displaySavedEvents(newSavedEventsArray);

  // save updated list of events in local storage
  localStorage.setItem("favoriteEvents", JSON.stringify(newSavedEventsArray));
};

const goToTMEventPage = (event) => {
  const urlForTMEventPage = $(event.currentTarget).parent().attr("data-eventUrl");
  window.open(`${urlForTMEventPage}`, "_blank");
};

const displaySavedEventCard = (item) => {
  const savedEventCard = 
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
</div>`

  $("#card-container").append(savedEventCard);
};

const displayCovidInfo = async (event) => {
  const parent = $(event.currentTarget).parent();
  //get city name
  const cityName = $(parent).attr("data-city");
  
  //get COVID-19 information
  const covidUrl = buildCovidUrl(cityName);
  const covidData = await getCovidData(covidUrl);

  // display covid info onto page
  const covidInfoElement = `<div class="py-1 has-text-weight-medium"> Number of cases in the last 30 days: ${covidData.sumLast30DaysCovidData}</div>`

  $(parent).empty();
  $(parent).parent()
    .append(covidInfoElement);
};

const displaySearchBar = () => {
  const myEventsSearchBarElement = 
  `<div class="search-bar-container mt-6 py-5" id="search-bar-container">
  <div class="field has-addons has-addons-left mb-5 mx-4 columns is-mobile is-centered pt-6 is-flex-wrap-wrap is-align-items-center">
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
  </div>`

  $("main").append(myEventsSearchBarElement);
  $("#search-bar-container").on("click", "a", onSearch);;
};

const displaySavedEvents = (eventsArray) => {
  savedCardsContainer = `<div class="tile is-ancestor mx-4 is-flex-wrap-wrap is-align-items-center" id="card-container">`
  //create container
  $("main").append(savedCardsContainer);
  eventsArray.forEach(displaySavedEventCard);
  $(".covid-info-container").on("click", "button", displayCovidInfo);
  $(".remove").click(removeEventObject);
  $(".event-tm-info").click(goToTMEventPage)
};

const onLoad = () => {
  const savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
  // check if there are any saved events in local storage
  if (savedEvents !== null && savedEvents.length) {
    // order local storage objects for added recenecy
    eventsInAddedOrder = orderFavEvents(savedEvents);
    displaySearchBar();
    //for each saved event, render a card
    displaySavedEvents(eventsInAddedOrder);
  } else {
    // if local storage is empty display the screen for no saved events
    displayNoEventsScreen();
  }
};

$(document).ready(onLoad);
