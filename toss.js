const areaName = "North East";

const fetchCovidData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const callback = (acc, currentValue) => acc + currentValue.cases.daily;

const wrapitup = async () => {
  // const url = `https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaName=London&structure={%22date%22:%22date%22,%22name%22:%22areaName%22,%22cases%22:{%22daily%22:%22newCasesByPublishDate%22}}`;
  const url =
    "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=ltla;areaName=Birmingham&structure={%22date%22:%22date%22,%22name%22:%22areaName%22,%22cases%22:{%22daily%22:%22newCasesByPublishDate%22}}";
  const covidData = await fetchCovidData(url);
  const slicedData = covidData.data.slice(0, 30);
  console.log(slicedData);
  const sum = slicedData.reduce(callback, 0);
  console.log(sum);
};

wrapitup();

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
