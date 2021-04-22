const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cityName = urlParams.get("cityName");
  const eventType = urlParams.get("eventType");

  // get event type somehow

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
    return `${baseURL}${urlParams.cityName}&classificationName=${urlParams.eventType}&size=20&page=${pageNumber}&sort=date,name,asc&apikey=${apiKey}`;
  } else {
    return `${baseURL}${urlParams.cityName}&size=20&page=${pageNumber}&sort=date,name,asc&apikey=${apiKey}`;
  }
};

const buildCovidUrl = (cityName) => {
  const baseURL = "https://api.coronavirus.data.gov.uk/v1/data?filters=";
  const structure =
    "&structure={%22date%22:%22date%22,%22newCases%22:%22newCasesByPublishDate%22}";

  if (cityName === "London") {
    return `${baseURL}areaType=region;areaName=London${structure}`;
  } else {
    return `${baseURL}areaType=ltla;areaName=${cityName}${structure}`;
  }
};

const handleInternalError = () => {
  $("main").append(
    `<h1 class="has-text-white" style="size:40px"> Sorry, we're having internal issues. Please come back and search later. </h1>`
  );
};

const handleError = () => {
  $("#error-container").empty();
  $("#error-container").append(
    `<h1 class="has-text-white is-centered mt4" style="size:40px"> Sorry, we couldn’t find any information. </h1>`
  );
};

const fetchTicketmasterData = async (tmUrl) => {
  try {
    const response = await fetch(tmUrl);
    if (response.status > 499 && response.status < 600) {
      throw new Error("internal");
    } else if (response.status < 200 || response.status > 299) {
      throw new Error("error");
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

const fetchCovidData = async (covidUrl) => {
  try {
    const response = await fetch(covidUrl);
    if (response.status > 499 && response.status < 600) {
      throw new Error("internal");
    } else if (response.status < 200 || response.status > 299) {
      throw new Error("error");
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

const getTicketmasterData = async (tmUrl, urlParams) => {
  let allData = await fetchTicketmasterData(tmUrl);

  if (allData === undefined) {
    return;
  } else {
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
  }
};

const sumDailyCases = (acc, currentValue) => acc + currentValue.newCases;

// or put in defualt value

const getCovidData = async (covidUrl) => {
  // fetch covid data
  const covidData = await fetchCovidData(covidUrl);
  if (covidData === undefined) {
    return;
  } else {
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
  }
};

const showResults = async (pageNumber) => {
  // get parameters
  const urlParams = getUrlParams();
  // build ticketmaster url
  const tmUrl = buildTicketmasterUrl(urlParams, pageNumber);

  // build covid url
  const covidUrl = buildCovidUrl(urlParams.cityName);

  // call ticketmaster api
  const tmData = await getTicketmasterData(tmUrl, urlParams);

  // call covid api

  const covidDataObject = await getCovidData(covidUrl);

  const allDataObject = {
    tmData,
    covidDataObject,
  };
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
