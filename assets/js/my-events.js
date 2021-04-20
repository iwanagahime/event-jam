const orderFavEvents = (savedEvents) => {
  orderedEventSearchesArray = savedEvents.reverse();
  return orderedEventSearchesArray;
};

const displayNoEventsScreen = () => {
  //this is a placeholder
};

const removeEventObject = (event) => {
  // retrieve array from local storage
  let savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));

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
  console.log(urlForTMEventPage);
  window.open(`${urlForTMEventPage}`, "_blank");
};

const displayEventCard = (item) => {
  $("#card-container").append(
    `<div class="tile is-parent card-content-container">
    <div class="card">
      <div class="card-image">
          <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
          </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <div><h2 class="has-text-centered ">${item.name}</h2> </div>
          <div class="py-1 has-text-weight-medium">Date:${item.date}</div>
          <div class="py-1 has-text-weight-medium">Time:${item.time}</div> 
          <div class="py-1 has-text-weight-medium">Venue:${item.venue}</div>
          <div style="text-align:center" data-url=">${item.eventUrl}">
            <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded event-tm-info">More info</a>
            <a class="button mx-5 my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded remove">Remove from My Events</a>
          </div>
        </div>
        <div class="covid-info-container" data-city="${item.city}">
          <button>
            See COVID 19 info
          </button>
        </div>
      </div>
    </div>
  </div>
  `
  );
};

const displaySavedEvents = () => {
  let savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
  //create container
  $("body").append(`<div class="tile is-ancestor" id="card-container"><div>`);
  savedEvents.forEach(displayEventCard);
  $(".covid-info-container").on("click", "button", displayCovidInfo);
  $(".remove").click(removeEventObject);
  $(".event-tm-info").click(goToTMEventPage);
};

function onLoad() {
  let savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
  console.log(savedEvents);
  // check if there are any saved events in local storage
  if (savedEvents !== null) {
    // order local storage objects in order of search recency
    eventsInAddedOrder = orderFavEvents(savedEvents);
    console.log(eventsInAddedOrder);
    // for each saved event, render a card
    displaySavedEvents(savedEvents);
    //$(eventsInAddedOrder).each(displaySavedEvents);
  } else {
    displayNoEventsScreen();
    console.log("no events");
  }
}

const displayCovidInfo = (event) => {
  const parent = $(event.currentTarget).parent();
  //get region/city name
  let cityName = $(parent).attr("data-city");
  //call covid info function
  const covidInfo = "information about covid";
  // display covid info onto page
  $(parent).empty();
  $(parent).parent()
    .append(`<div class="py-1 has-text-weight-medium"> This is more info ${covidInfo} lorem impsum </div>
  `);
};

$(document).ready(onLoad);
