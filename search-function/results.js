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

const createEventInfoObject = (item) => {
  eventInfoObject = {
    name: item.name,
    date: item.dates.start.localDate,
    time: item.dates.start.localTime,
    image: item.images[1].url,
    venue: item._embedded.venues[0].name,
    eventUrl: item.url,
  };
  return eventInfoObject;
};

const getTicketmasterData = async (tmUrl) => {
  let allData = await fetchTicketmasterData(tmUrl);
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

const showResults = async () => {
  // get parameters
  const urlParams = getUrlParams();
  // build ticketmaster url
  const tmUrl = buildTicketmasterUrl(urlParams);

  // build covid url
  const covidUrl = buildCovidUrl(urlParams);
  console.log(covidUrl);

  // call ticketmaster api
  const tmData = await getTicketmasterData(tmUrl);
  // call covid api
  // separate functions to build info
};

$(document).ready(showResults);
