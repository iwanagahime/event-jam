const sampleArray = [
  {
      name: "Gaby's Talking Pictures with Alistair McGowan and Ronni Ancona",
      date: "2021-04-25",
      time: "19:30:00",
      image: "https://s1.ticketm.net/dam/c/50a/fa9caa1f-73a1-411e-b507-ec56fa59650a_106061_RETINA_PORTRAIT_16_9.jpg",
      venue: "Leicester Square Theatre",
      eventUrl: "https://www.ticketmaster.co.uk/gabys-talking-pictures-with-alistair-mcgowan-london-04-25-2021/event/370057919EC99232",
      city: "London",
  },
  {
    name: "Gaby's Talking Pictures with Alistair McGowan and Ronni Ancona",
    date: "2021-04-25",
    time: "19:30:00",
    image: "https://s1.ticketm.net/dam/c/50a/fa9caa1f-73a1-411e-b507-ec56fa59650a_106061_RETINA_PORTRAIT_16_9.jpg",
    venue: "Leicester Square Theatre",
    eventUrl: "https://www.ticketmaster.co.uk/gabys-talking-pictures-with-alistair-mcgowan-london-04-25-2021/event/370057919EC99232",
    city: "Birmingham",
  }
]

const orderFavEvents = () => {
  eventSearchesArray = JSON.parse(localStorage.getItem("favouriteEvents"))
  // reverse the array so that the most recent search is first
  orderedEventSearchesArray = eventSearchesArray.reverse()
  return orderedEventSearchesArray;
};

const displayNoEventsScreen = () => {
  //this is a placeholder
};

const displayEventCard = (item) => {
  $("#card-container").append(
  `<div class="tile is-parent cardcontent-container" data-url="${item.eventUrl}">
    <div class="card">
      <div class="card-image">
          <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
          </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <div><h2 class="has-text-centered ">Craig David Life</h2> </div>
          <div class="py-1 has-text-weight-medium">Date: 09/05/2021</div>
          <div class="py-1 has-text-weight-medium">Time:19:00</div> 
          <div class="py-1 has-text-weight-medium">Venue:O2 Academy</div>
          <div style="text-align:center">
            <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded">Add to Favs</a><a class="button mx-5 my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded">More Info</a>
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
  `)
}

const displaySavedEvents = (sampleArray) => {
  //create container
  $("body").append(`<div class="tile is-ancestor" id="card-container"><div>`)
  sampleArray.forEach(displayEventCard);
  $(".covid-info-container").on("click", "button", displayCovidInfo);
};

function onLoad () {
  // check if there are any saved events in local storage
  if (localStorage.getItem("favouriteEvents") !== null) {
    // order local storage objects in order of search recency
    eventsInAddedOrder = orderFavEvents();
    console.log(eventsInAddedOrder)
    // for each saved event, render a card
    displaySavedEvents(sampleArray)
    //$(eventsInAddedOrder).each(displaySavedEvents); 
  } else {
    displayNoEventsScreen();
    console.log("no events")
  }
};

const displayCovidInfo = (event) => {
  const parent = $(event.currentTarget).parent()
  //get region/city name 
  let cityName = $(parent).attr("data-city")
  //call covid info function
  const covidInfo = "informaiton about covid"
  // display covid info onto page
  $(parent).empty()
  $(parent).parent().append(`<div class="py-1 has-text-weight-medium"> This is more info ${covidInfo} lorem impsum </div>
  `)
}


$(document).ready(onLoad);