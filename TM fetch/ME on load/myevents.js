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
},
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

const displaySavedEvents = () => {
  //this is a placeholder
  //build card and store object values as data attributes against card container
  console.log("display function")
};

function onLoad () {
  // check if there are any saved events in local storage
  if (localStorage.getItem("favouriteEvents") !== null) {
    // order local storage objects in order of search recency
    eventsInAddedOrder = orderFavEvents();
    console.log(eventsInAddedOrder)
    // for each saved event, render a card
    $(eventsInAddedOrder).each(displaySavedEvents); 
  } else {
    displayNoEventsScreen();
    console.log("no events")
  }
};

const displayCovidInfo = () => {
  console.log("here")
}

$(document).ready(onLoad);
$("#covid-info-container").on("click", "button", displayCovidInfo);