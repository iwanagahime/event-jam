const displayEventCard = (tmData) => {
  $("#card-container").append(
    `<div class="tile is-parent cardcontent-container">
    <div class="card">
      <div class="card-image">
          <figure class="image is-4by3">
            <img src="${tmData.image}" alt="${tmData.name} event image">
          </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <div><h2 class="has-text-centered ">${tmData.name}</h2> </div>
          <div class="py-1 has-text-weight-medium">${tmData.date}</div>
          <div class="py-1 has-text-weight-medium">${tmData.time}</div> 
          <div class="py-1 has-text-weight-medium">${tmData.venue}</div>
          <div style="text-align:center" data-name="${tmData.name}" data-date="${tmData.date}" data-time="${tmData.time}" data-venue="${tmData.venue}" data-eventUrl="${tmData.eventUrl}" data-city="${tmData.city}" >
            <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded event-tm-info">More info</a>
            <a class="button mx-5 my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded save">Save Event</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
  );
};

const saveToMyEvents = (event) => {
  // identify
  buttonContainerDiv = $(event.currentTarget).parent();

  if (localStorage.getItem("favouriteEvents") !== null) {
    previouslySavedEvents = JSON.parse(localStorage.getItem("favouriteEvents"));

    // remove object with event info previously saved
    function removeEventIfSavedBefore(item) {
      if (item.eventUrl !== buttonContainerDiv.attr("data-eventUrl")) {
        return true;
      }
      return false;
    }

    let filteredSavedEvents = previouslySavedEvents.filter(
      removeEventIfSavedBefore
    );

    let newEvent = {
      name: buttonContainerDiv.attr("date-name"),
      date: buttonContainerDiv.attr("data-date"),
      time: buttonContainerDiv.attr("data-time"),
      venue: buttonContainerDiv.attr("data-venue"),
      eventUrl: buttonContainerDiv.attr("data-eventUrl"),
      city: buttonContainerDiv.attr("data-city"),
    };

    filteredSavedEvents.push(newEvent);
    let savedEventsString = JSON.stringify(filteredSavedEvents);
    localStorage.setItem("favouriteEvents", savedEventsString);
  } else {
    savedEvents = [];

    let newEvent = {
      name: buttonContainerDiv.attr("date-name"),
      date: buttonContainerDiv.attr("data-date"),
      time: buttonContainerDiv.attr("data-time"),
      venue: buttonContainerDiv.attr("data-venue"),
      eventUrl: buttonContainerDiv.attr("data-eventUrl"),
      city: buttonContainerDiv.attr("data-city"),
    };

    savedEvents.push(newEvent);
    let savedEventsString = JSON.stringify(savedEvents);
    localStorage.setItem("favouriteEvents", savedEventsString);
  }
};

const goToTMEventPage = (event) => {
  let urlForTMEventPage = $(event.currentTarget).parent().attr("data-url");
  window.open(`${urlForTMEventPage}`, "_blank");
};

const renderResults = (tmData, covidData) => {
  // create container and render for covid data
  $("main").append(`
    <article class="message is-warning mb-6">
      <div class="message-header has-text-warning-dark" id="covid-info">
      <img src="./assets/images/covid-icon.jpg"  class=" image is-64x64" id="covid-image">
        <span class="px-4 is-size-4">COVID info</span>
      </div>
      <div class="message-body ">
        In ${tmData[0].city} there have been ${covidData} Covid cases in the last 30 days.
      </div>
    </article>`);

  // Display event heading
  $("main")
    .append(`<div class="field has-addons has-addons-left mb-6 "><h2 class=" is-size-3 has-text-warning has-text-weight-bold">Events in ${tmData[0].city}</h2>
  <div class="control mx-4 my-2">
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
  <div class="control my-2">
    <a class="button is-warning has-text-warning-dark has-text-weight-bold" id="filter-search-button">
      <i class="fas fa-search"></i>
    </a>
  </div>
</div>
  `);

  //create container cards
  $("main").append(`<div class="tile is-ancestor" id="card-container"><div>`);
  tmData.forEach(displayEventCard);
  $(".save").click(saveToMyEvents);
  $(".event-tm-info").click(goToTMEventPage);
};

const doSomething = /* async */ () => {
  console.log("hello");
  // await showResults();
};

$(document).ready(showResults);
// search bar top of results html
$("#search-bar-container").on("click", "a", onSearch);

// event type "filter"
$("#filter-search-button").on("click", "a", doSomething);
