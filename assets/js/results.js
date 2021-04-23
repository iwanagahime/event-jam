// search bar top of results html
$("#search-bar-container").on("click", "a", onSearch);

let pageNumber = 0;

const getUrl = (item) => item.eventUrl;

const checkIfEventPreviouslySaved = (tmData) => {
  const savedEventsInLocalStorage = localStorage.getItem("favoriteEvents");
  if (savedEventsInLocalStorage !== null) {
    previouslySavedEvents = JSON.parse(savedEventsInLocalStorage);
    // create an array of event urls (unique identifiers) of past events
    previouslySavedEventsUrls = previouslySavedEvents.map(getUrl);

    // set the class ([0]) and text ([1]) based on if the current event has a url that's equal to that of a saved event 
    isItemSaved = $.inArray(tmData.eventUrl, previouslySavedEventsUrls);
    if (isItemSaved == -1) {
      saveButtonProperties = ["save", "Save Event"];
      return saveButtonProperties;
    } else {
      saveButtonProperties = ["", "Saved"];
      return saveButtonProperties;
    }
  } else {
    saveButtonProperties = ["save", "Save Event"];
    return saveButtonProperties;
  }
};

const displayEventCard = (tmData) => {
  const saveButtonProperties = checkIfEventPreviouslySaved(tmData);
  const cardElement = 
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
          <a class="button mx-5 my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded ${saveButtonProperties[0]}">${saveButtonProperties[1]}</a>
        </div>
      </div>
    </div>
   </div>
</div>`

  $("#card-container").append(cardElement);
};

const renderMoreEvents = async () => {
  // add one to the current page number
  pageNumber++;

  // get data from API
  const allDataObject = await showResults();
  const tmData = allDataObject.tmData;

  if (tmData === undefined) {
    $("#error-container").empty();
    $("#load-events-button-container").empty();
    $("#load-events-button-container").append(`<p class="has-text-white">Sorry, we couldn't find any more events.</p>`)
    return;
  } else {
    // render new event cards and add event listeners to their buttons
    tmData.forEach(displayEventCard);
    addEventListeners()
  }
};

const saveToMyEvents = (event) => {
  $(event.currentTarget).off("click", saveToMyEvents)
  // identify button container div
  const buttonContainerDiv = $(event.currentTarget).parent();
  let savedEvents = [];
  const eventsInLocalStorage = localStorage.getItem("favoriteEvents")

  if (eventsInLocalStorage !== null) {
    savedEvents = JSON.parse(eventsInLocalStorage);
  }

  const newEvent = {
    name: buttonContainerDiv.attr("data-name"),
    date: buttonContainerDiv.attr("data-date"),
    time: buttonContainerDiv.attr("data-time"),
    venue: buttonContainerDiv.attr("data-venue"),
    eventUrl: buttonContainerDiv.attr("data-eventUrl"),
    city: buttonContainerDiv.attr("data-city"),
    image: buttonContainerDiv.attr("data-image"),
  };

  savedEvents.push(newEvent);
  const savedEventsString = JSON.stringify(savedEvents);
  localStorage.setItem("favoriteEvents", savedEventsString);

  $(event.currentTarget).text("Saved");
  $(event.currentTarget).removeClass("save");
};

const goToTMEventPage = (event) => {
  const urlForTMEventPage = $(event.currentTarget)
    .parent()
    .attr("data-eventUrl");
  window.open(`${urlForTMEventPage}`, "_blank");
};

const addEventListeners = () => {
  $("#load-events-button").click(renderMoreEvents);
  $(".save").on("click", saveToMyEvents);
  $(".event-tm-info").click(goToTMEventPage);
}

const renderResults = (tmData, covidData) => {
  const covidInformationElement = 
    `<div class="message is-warning mb-6 mx-5 is-flex-wrap-wrap is-align-items-center" id="covid-section" >
      <div class="message-header has-text-warning-dark" id="covid-info">
        <img src="./assets/images/covid-icon.jpg"  class=" image is-64x64" id="covid-image">
        <span class="px-4 is-size-4">COVID info</span>
      </div>
      <div class="message-body ">
        In ${tmData[0].city} there have been <strong> ${covidData} </strong> Covid cases in the last 30 days.
      </div>
    </div>`

  const searchHeadingElement =
    `<div class="field has-addons has-addons-left mb-6 ml-6 is-flex-wrap-wrap is-align-items-center" id ="events-in-search">
      <h2 class="is-size-3 has-text-warning has-text-weight-bold">Events in ${tmData[0].city}</h2>
    </div>` 
  
  const cardContainer = `<div class="tile is-ancestor mx-4 is-flex-wrap-wrap is-align-items-center" id="card-container">`

  const loadMoreEventsElement = 
    `<div class="mb-6 mx-5 is-flex-wrap-wrap is-align-items-center">
      <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded" id="load-events-button">Load more</a>
    </div>`
  
  $("main").empty();

  // create container and render for COVID-19 data
  $("main").append(covidInformationElement);

  // Display event heading
  $("main").append(searchHeadingElement);

  //create container for cards and render cards
  $("main").append(cardContainer);
  tmData.forEach(displayEventCard);

  // add button to load more events
  $("main").append(loadMoreEventsElement);

  // add event listeners to created html elements
  addEventListeners()
};

const fetchDataAndRender = async () => {
  // get ticketmaster and COVID-19 data from APIs
  const allDataObject = await showResults();

  if (
    allDataObject.tmData === undefined ||
    allDataObject.covidDataObject === undefined
  ) {
    return;
  } else {
    renderResults(
      allDataObject.tmData,
      allDataObject.covidDataObject.sumLast30DaysCovidData
    );
  }

  // use data from allDataObject.covidDataObject.last30DaysCovidData to render graph
};

$(document).ready(fetchDataAndRender);
