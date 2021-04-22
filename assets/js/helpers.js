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
    const images = getValueFromNestedObject(item, ["images"], []);
    eventInfoObject = {
      name: item.name,
      date: item.dates.start.localDate,
      time: getValueFromNestedObject(
        item,
        ["dates", "start", "localTime"],
        "TBC"
      ),
      image: (images.length > 0 && images[1].url) || "",
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
  const baseURL = "https://api.coronavirus.data.gov.uk/v1/data?filters=";
  const structure =
    "&structure={%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDate%22}";

  if (urlParams.cityName === "London") {
    return `${baseURL}areaType=region;areaName=London${structure}`;
  } else {
    return `${baseURL}areaType=ltla;areaName=${urlParams.cityName}${structure}`;
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

const sumDailyCases = (acc, currentValue) => acc + currentValue.newCases;

// or put in defualt value

const getCovidData = async (covidUrl) => {
  // fetch covid data
  const covidData = await fetchCovidData(covidUrl);
  // filter covid data
  const last30DaysCovidData = covidData.data.slice(0, 30);
  const sumLast30DaysCovidData = last30DaysCovidData.reduce(sumDailyCases, 0);
  // store what we want to render and return

  const covidDataObject = {
    last30DaysCovidData,
    sumLast30DaysCovidData,
  };

  // to do return sumLast30DaysCovidData;
  return covidDataObject;
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

  const covidDataObject = await getCovidData(covidUrl);

  const allDataObject = {
    tmData,
    covidDataObject,
  };
  console.log(allDataObject);
  return allDataObject;
};

const getValueFromNestedObject = (
  nestedObj = {},
  tree = [],
  defaultValue = ""
) =>
  Array.isArray(tree)
    ? tree.reduce(
        (obj, key) => (obj && obj[key] ? obj[key] : defaultValue),
        nestedObj
      )
    : {};
// getValueFromNestedObject(allDataObject, ["covidDataObject", "sumLast30DaysCovidData"])
// USE IT PROPERLY in fetch
