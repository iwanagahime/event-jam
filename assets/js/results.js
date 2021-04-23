// search bar top of results html
$("#search-bar-container").on("click", "a", onSearch);

let pageNumber = 0;

const getUrl = (item) => item.eventUrl;

const checkIfEventPreviouslySaved = (tmData) => {
  if (localStorage.getItem("favoriteEvents") !== null) {
    previouslySavedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
    previouslySavedEventsUrls = previouslySavedEvents.map(getUrl);

    isItemSaved = $.inArray(tmData.eventUrl, previouslySavedEventsUrls);
    if (isItemSaved == -1) {
      saveAnchor = ["save", "Save Event"];
      return saveAnchor;
    } else {
      saveAnchor = ["", "Saved"];
      return saveAnchor;
    }
  } else {
    saveAnchor = ["save", "Save Event"];
    return saveAnchor;
  }
};

const displayEventCard = (tmData) => {
  const saveAnchor = checkIfEventPreviouslySaved(tmData);
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

const renderMoreEvents = async () => {
  pageNumber++;

  const allDataObject = await showResults();
  const tmData = allDataObject.tmData;

  if (tmData === undefined) {
    return;
  } else {
    tmData.forEach(displayEventCard);
    addEventListeners()
  }
};

const saveToMyEvents = (event) => {
  $(event.currentTarget).off("click", saveToMyEvents)
  // identify button container div
  const buttonContainerDiv = $(event.currentTarget).parent();
  savedEvents = [];

  if (localStorage.getItem("favoriteEvents") !== null) {
    savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
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
  $("main").empty();
  // create container and render for covid data
  $("main").append(`
    <div class="message is-warning mb-6 mx-5 is-flex-wrap-wrap is-align-items-center" id="covid-section" >
      <div class="message-header has-text-warning-dark" id="covid-info">
        <img src="./assets/images/covid-icon.jpg"  class=" image is-64x64" id="covid-image">
        <span class="px-4 is-size-4">COVID info</span>
      </div>
      <div class="message-body ">
        In ${tmData[0].city} there have been <strong> ${covidData} </strong> Covid cases in the last 30 days.
      </div>
    </div>`);

  // Display event heading
  $("main")
    .append(`<div class="field has-addons has-addons-left mb-6 ml-6 is-flex-wrap-wrap is-align-items-center" id ="events-in-search"><h2 class="is-size-3 has-text-warning has-text-weight-bold">Events in ${tmData[0].city}</h2>
    
  </div> 
  `);

  //create container cards
  $("main").append(
    `<div class="tile is-ancestor mx-4 is-flex-wrap-wrap is-align-items-center" id="card-container">`
  );
  tmData.forEach(displayEventCard);
  $("main").append(`
    <div class="mb-6 mx-5 is-flex-wrap-wrap is-align-items-center">
      <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded" id="load-events-button">Load more</a>
    </div>`);
  addEventListeners()
};

const fetchDataAndRender = async () => {
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
