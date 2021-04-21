let pageNumber = 0;

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
  const baseURL ="https://app.ticketmaster.com/discovery/v2/events.json?&countryCode=GB&city=";
  const apiKey = "RTmsu653zlIq0O4v4JzO14tOOeKbVAMK";
  if (urlParams.cityName && urlParams.eventType) {
    return `${baseURL}${urlParams.cityName}&classificationName=${urlParams.eventType}&size=20&page=${pageNumber}&sort=date,name,asc&apikey=${apiKey}`;
  } else {
    return `${baseURL}${urlParams.cityName}&size=20&page=${pageNumber}&sort=date,name,asc&apikey=${apiKey}`;
  }
};

const buildCovidUrl = (urlParams) => {
  if (urlParams.cityName === "London") {
    return `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaName=London&structure={%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDate%22}`;
  } else {
    return `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=ltla;areaName=${urlParams.cityName}&structure={%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDate%22}`
  }
};

const handleInternalError = () => {
  $("main").append(
    `<h1 class="has-text-white" style="size:40px"> Sorry, we're having internal issues. Please come back and search later. </h1>`
  )
}

const handleError = () => {
  $("#error-container").empty()
  $("#error-container").append(
    `<h1 class="has-text-white is-centered mt4" style="size:40px"> Sorry, we couldn’t find any events or COVID-19 data in your city, please search again. </h1>`
  )
}

const fetchTicketmasterData = async (tmUrl) => {
  try {
    const response = await fetch(tmUrl);
    if (response.status > 499 && response.status < 600) {
      throw new Error ("internal")
    } else if (response.status  <200 || response.status >299) {
      throw new Error ("error")
    } else {
      const data = await response.json();
      const eventsData = data._embedded.events;
  
      return eventsData;
    }
  } catch (error) {
    if (error == "internal") {
      handleInternalError();
    } else {
    handleError();
    }
  }
};

const getTicketmasterData = async (tmUrl, urlParams) => {
  let allData = await fetchTicketmasterData(tmUrl);
  if (allData === undefined) {
    return
  } else {
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
  }
};

const fetchCovidData = async (covidUrl) => {
  try {
    const response = await fetch(covidUrl);
    if (response.status >499 && response.status <600) {
      throw new Error ("internal")
    } else if (response.status  <200 || response.status >299) {
      throw new Error ("error")
    } else {
    const allData = await response.json();
    return allData;
    }
  } catch (error) {
    if (error == "internal") {
      handleInternalError();
    } else {
    handleError();
    }
  }
};

const sumDailyCases = (acc, currentValue) => acc + currentValue.newCases;

const getCovidData = async (covidUrl) => {
  // fetch covid data
  const covidData = await fetchCovidData(covidUrl);
  if (covidData === undefined) {
    return
  } else {
  // filter covid data
  const last30DaysCovidData = covidData.data.slice(0, 30);
  const sumLast30DaysCovidData = last30DaysCovidData.reduce(sumDailyCases, 0);
  // store what we want to render and return
  return sumLast30DaysCovidData;
  }
};

const checkIfEventPreviouslySaved = (tmData) => {
  if (localStorage.getItem("favoriteEvents") !== null) {
    previouslySavedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
    previouslySavedEventsUrls = previouslySavedEvents.map(function getUrl(item) {return item.eventUrl})

    isItemSaved = $.inArray( tmData.eventUrl, previouslySavedEventsUrls)
    if (isItemSaved == -1) {
      saveAnchor = ["save", "Save Event",]
      return saveAnchor
    } else {
      saveAnchor = ["", "Saved"]
      return saveAnchor
    }
  } else {
    saveAnchor = ["save", "Save Event",]
    return saveAnchor;
  }
}

const goToTMEventPage = (event) => {
  let urlForTMEventPage = $(event.currentTarget).parent().attr("data-eventUrl")
  window.open(`${urlForTMEventPage}`, '_blank')
}

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

const renderResults = (tmData, covidData) => {
  $("main").empty()
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
    <div class="control mx-4 my-2">
      <div class="select ">
        <select>
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
  `);

  //create container cards
  $("main").append(`<div class="tile is-ancestor mx-4 is-flex-wrap-wrap is-align-items-center" id="card-container">`);
  tmData.forEach(displayEventCard);
  $("main").append(`
    <div class="mb-6 mx-5 is-flex-wrap-wrap is-align-items-center">
      <a class="button my-3 has-background-warning has-text-warning-dark has-text-weight-bold is-rounded" id="load-events-button">Load more</a>
    </div>`)
  $("#load-events-button").click(renderMoreEvents)
  $(".save").click(saveToMyEvents);
  $(".event-tm-info").click(goToTMEventPage);
};

const renderMoreEvents = async () => {
  pageNumber++;
  const urlParams = getUrlParams()
  // build ticketmaster url
  const tmUrl = buildTicketmasterUrl(urlParams);

  // call ticketmaster api
  const tmData = await getTicketmasterData(tmUrl, urlParams);

  if (tmData === undefined) {
    return
  } else {
    tmData.forEach(displayEventCard);
  }
}

const saveToMyEvents = (event) => {
  // identify button container div
  buttonContainerDiv = $(event.currentTarget).parent()
  savedEvents=[]

  if (localStorage.getItem("favoriteEvents") !== null) {
    savedEvents = JSON.parse(localStorage.getItem("favoriteEvents"));
  }

  let newEvent = {
    name: buttonContainerDiv.attr("data-name"),
    date: buttonContainerDiv.attr("data-date"),
    time: buttonContainerDiv.attr("data-time"),
    venue: buttonContainerDiv.attr("data-venue"),
    eventUrl: buttonContainerDiv.attr("data-eventUrl"),
    city: buttonContainerDiv.attr("data-city"),
    image: buttonContainerDiv.attr("data-image")
  };

  savedEvents.push(newEvent);
  let savedEventsString = JSON.stringify(savedEvents);
  localStorage.setItem("favoriteEvents", savedEventsString);

  $(event.currentTarget).text("Saved")
  $(event.currentTarget).removeClass("save")
}

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

  if (covidData === undefined || tmData === undefined) {
    return
  } else {
    renderResults(tmData, covidData);
  }
};

$(document).ready(showResults);