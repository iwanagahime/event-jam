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
    console.log(eventInfoObject);
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
    `<div class="tile is-parent cardcontent-container" data-city="${tmData.city} data-name="${tmData.name}" data-date="${tmData.date}" data-time="${tmData.time}" data-venue="${tmData.venue}" data-eventUrl="${tmData.eventUrl}">
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
          <div style="text-align:center" data-url="${tmData.eventUrl}">
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

const renderResults = (tmData, covidData) => {
  console.log(tmData);

  // create container and render for covid data
  $("body").append(`
  <article class="message is-warning mb-6">
  <div class="message-header has-text-warning-dark" id="covid-info">
   <img src="./assets/images/covid.jpg"  class=" image is-64x64" id="covid-image">
    <span class="px-4 is-size-4">COVID info</span>
    
  </div>
  <div class="message-body ">
   In ${tmData[0].city} there have been ${covidData} Covid cases in the last 30 days.
  </div>
</article>`);

  //create container cards
  $("body").append(`<div class="tile is-ancestor" id="card-container"><div>`);
  tmData.forEach(displayEventCard);
  $(".covid-info-container").on("click", "button", displayCovidInfo);
  $(".remove").click(removeEventObject);
  $(".event-tm-info").click(goToTMEventPage);
};

const showResults = async () => {
  // get parameters
  const urlParams = getUrlParams();
  // build ticketmaster url
  const tmUrl = buildTicketmasterUrl(urlParams);

  // build covid url
  const covidUrl = buildCovidUrl(urlParams);
  console.log(covidUrl);

  // call ticketmaster api
  const tmData = await getTicketmasterData(tmUrl, urlParams);
  // call covid api

  const covidData = await getCovidData(covidUrl);

  // separate functions to build info

  renderResults(tmData, covidData);
};

$(document).ready(showResults);
