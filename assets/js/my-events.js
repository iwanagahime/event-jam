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
        <div class="select ">
          <select >
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
        <a class="button is-warning has-text-warning-dark has-text-weight-bold"id="search-button">
          <i class="fas fa-search"></i>
        </a>
      </div>
  </div>`);
};

const removeEventObject = (event) => {
  console.log("hello");
  // retrieve array from local storage
  let savedEvents = JSON.parse(localStorage.getItem("favouriteEvents"));

  // get url of object to remove
  let urlForObjectToRemove = $(event.currentTarget).parent().attr("data-url");

  const removeEvent = (item) => {
    if (item.eventUrl !== urlForObjectToRemove) {
      return true;
    } else {
      return false;
    }
  };
  // go through the retrieved array and remove the object
  newSavedEventsArray = savedEvents.filter(removeEvent);
  // empty container
  $("#card-container").empty();
  // render cards
  displaySavedEvents(newSavedEventsArray);
  // save new array in local storage
  localStorage.setItem("favouriteEvents", JSON.stringify(newSavedEventsArray));
};

const goToTMEventPage = (event) => {
  let urlForTMEventPage = $(event.currentTarget).parent().attr("data-url");
  window.open(`${urlForTMEventPage}`, "_blank");
};

const displayEventCard = (tmData) => {
  let saveAnchor = checkIfEventPreviouslySaved(tmData);
  $("#card-container").append(
    `<div class="tile is-parent">
      <div class="card has-text-centered">
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="${tmData.image}" alt="${tmData.name} event image">
          </figure>
        </div>
        <div class="card-content">
            <div class="content">
             <div><h2 class="has-text-weight-semibold">${tmData.name}</h2> </div>
            <div class="py-1 has-text-weight-medium">Date: ${tmData.date}</div>
            <div class="py-1 has-text-weight-medium">Time: ${tmData.time}</div> 
            <div class="py-1 has-text-weight-medium">Venue: ${tmData.venue}</div>
            <div style="text-align:center" data-name="${tmData.name}" data-date="${tmData.date}" data-time="${tmData.time}" data-venue="${tmData.venue}" data-eventUrl="${tmData.eventUrl}" data-city="${tmData.city}" data-image="${tmData.image}">
              <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded event-tm-info">More info</a>
              <a class="button mx-5 my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded ${saveAnchor[0]}">${saveAnchor[1]}</a>
            </div>
          </div>
        </div>
       </div>
    </div>`
  );
};

const displayCovidInfo = async (event) => {
  const allDataObject = await showResults();

  const covidData = allDataObject.covidDataObject.sumLast30DaysCovidData;

  const parent = $(event.currentTarget).parent();
  //get region/city name
  let cityName = $(parent).attr("data-city");
  //call covid info function

  console.log("covidInfo", covidData);
  // display covid info onto page
  $(parent).empty();
  $(parent).parent()
    .append(`<div class="py-1 has-text-weight-medium"> Number of cases in the last 30 days: ${covidData}</div>
  `);
};

const displaySavedEvents = () => {
  let savedEvents = JSON.parse(localStorage.getItem("favouriteEvents"));
  //create container
  $("main").append(
    `<div class="tile is-ancestor mx-4 is-flex-wrap-wrap is-align-items-center" id="card-container">`
  );
  savedEvents.forEach(displayEventCard);
  $(".covid-info-container").on("click", "button", displayCovidInfo);
  $(".remove").click(removeEventObject);
  $(".event-tm-info").click(goToTMEventPage);
};

function onLoad() {
  let savedEvents = JSON.parse(localStorage.getItem("favouriteEvents"));

  // check if there are any saved events in local storage
  if (savedEvents !== null) {
    // order local storage objects in order of search recency
    eventsInAddedOrder = orderFavEvents(savedEvents);

    // for each saved event, render a card
    displaySavedEvents(savedEvents);
    //$(eventsInAddedOrder).each(displaySavedEvents);
  } else {
    displayNoEventsScreen();
  }
}

$(document).ready(onLoad);
