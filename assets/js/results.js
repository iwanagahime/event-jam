const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cityName = urlParams.get("cityName");
  const eventType = urlParams.get("eventType");

  const params = {
    cityName,
    eventType,
  };
  return params;
};

const buildTicketmasterUrl = (urlParams) => {
  const baseURL =
    "https://app.ticketmaster.com/discovery/v2/events.json?&countryCode=GB&city=";
  const apiKey = "RTmsu653zlIq0O4v4JzO14tOOeKbVAMK";

  if (urlParams.cityName && urlParams.eventType) {
    return `${baseURL}${urlParams.cityName}&classificationName=${urlParams.eventType}&sort=date,name,asc&apikey=${apiKey}`;
  } else {
    return `${baseURL}${urlParams.cityName}&sort=date,name,asc&apikey=${apiKey}`;
  }
};

const fetchTicketmasterData = async (tmUrl) => {
  try {
    const response = await fetch(tmUrl);
    const data = await response.json();
    const eventsData = data._embedded.events;

    return eventsData;
  } catch (error) {
    //function to handle error
  }
};

const getTicketmasterData = async (tmUrl, urlParams) => {
  let allData = await fetchTicketmasterData(tmUrl);
  const createEventInfoObject = (item) => {
    eventInfoObject = {
      name: item.name,
      date: item.dates.start.localDate,
      time: item.dates.start.localTime,
      image: item.images[1].url,
      venue: item._embedded.venues[0].name,
      eventUrl: item.url,
      city: urlParams.cityName,
    };
    return eventInfoObject;
  };
  let eventsInfoArray = allData.map(createEventInfoObject);
  return eventsInfoArray;
};

const buildCovidUrl = (urlParams) => {
  if (urlParams.cityName === "London") {
    return `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaName=London&structure={%22date%22:%22date%22,%22name%22:%22areaName%22,%22cases%22:{%22daily%22:%22newCasesByPublishDate%22}}`;
  } else {
    return `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=ltla;areaName=${urlParams.cityName}&structure={%22date%22:%22date%22,%22name%22:%22areaName%22,%22cases%22:{%22daily%22:%22newCasesByPublishDate%22}}`;
  }
};

const fetchCovidData = async (covidUrl) => {
  try {
    const response = await fetch(covidUrl);
    const allData = await response.json();
    return allData;
  } catch (error) {
    console.log(error);
  }
};

const sumDailyCases = (acc, currentValue) => acc + currentValue.cases.daily;

const getCovidData = async (covidUrl) => {
  // fetch covid data
  const covidData = await fetchCovidData(covidUrl);
  // filter covid data
  const last30DaysCovidData = covidData.data.slice(0, 30);
  const sumLast30DaysCovidData = last30DaysCovidData.reduce(sumDailyCases, 0);
  // store what we want to render and return
  return sumLast30DaysCovidData;
};

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
  buttonContainerDiv = $(event.currentTarget).parent()

  if (localStorage.getItem("favouriteEvents") !== null) {
    previouslySavedEvents = JSON.parse(localStorage.getItem("favouriteEvents"));

    // remove object with event info previously saved
    function removeEventIfSavedBefore (item) {
      if (item.eventUrl !== buttonContainerDiv.attr("data-eventUrl")) {
        return true
      }
      return false;
    }

    let filteredSavedEvents = previouslySavedEvents.filter(removeEventIfSavedBefore);

    let newEvent = {
      name: buttonContainerDiv.attr("date-name"),
      date: buttonContainerDiv.attr("data-date"),
      time: buttonContainerDiv.attr("data-time"),
      venue: buttonContainerDiv.attr("data-venue"),
      eventUrl: buttonContainerDiv.attr("data-eventUrl"),
      city: buttonContainerDiv.attr("data-city"),
    }

    filteredSavedEvents.push(newEvent);
    let savedEventsString = JSON.stringify(filteredSavedEvents);
    localStorage.setItem("favouriteEvents", savedEventsString);

  } else {
    savedEvents=[]

    let newEvent = {
      name: buttonContainerDiv.attr("date-name"),
      date: buttonContainerDiv.attr("data-date"),
      time: buttonContainerDiv.attr("data-time"),
      venue: buttonContainerDiv.attr("data-venue"),
      eventUrl: buttonContainerDiv.attr("data-eventUrl"),
      city: buttonContainerDiv.attr("data-city"),
    }

    savedEvents.push(newEvent);
    let savedEventsString = JSON.stringify(savedEvents);
    localStorage.setItem("favouriteEvents", savedEventsString);
  }
}

const goToTMEventPage = (event) => {
  let urlForTMEventPage = $(event.currentTarget).parent().attr("data-url")
  window.open(`${urlForTMEventPage}`, '_blank')
}

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
    $("main").append(`<div class="field has-addons has-addons-left mb-6 "><h2 class=" is-size-3 has-text-warning has-text-weight-bold">Events in ${tmData[0].city}</h2>
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
    <a class="button is-warning has-text-warning-dark has-text-weight-bold" id="search-button">
      <i class="fas fa-search"></i>
    </a>
  </div>
</div>
  `)

  //create container cards
  $("main").append(`<div class="tile is-ancestor" id="card-container"><div>`);
  tmData.forEach(displayEventCard);
  $(".save").click(saveToMyEvents);
  $(".event-tm-info").click(goToTMEventPage);
};

const showResults = async () => {
  // get parameters
  const urlParams = getUrlParams();
  // build ticketmaster url
  const tmUrl = buildTicketmasterUrl(urlParams);

  // build covid url
  const covidUrl = buildCovidUrl(urlParams);

  // call ticketmaster api
  const tmData = await getTicketmasterData(tmUrl, urlParams);
  // call covid api

  const covidData = await getCovidData(covidUrl);

  // separate functions to build info

  renderResults(tmData, covidData);
};

$(document).ready(showResults);
