const fetchTicketmasterData = async (tmUrl) => {
  try {
  const response = await fetch(tmUrl);
  const data = await response.json();
  const eventsData = data._embedded.events;

  return eventsData;
  
  } catch(error) {
    //function to handle error
  }
}

const createEventInfoObject = (item) => {
  eventInfoObject = {
    name: item.name,
    date: item.dates.start.localDate,
    time: item.dates.start.localTime,
    image: item.images[1].url,
    venue: item._embedded.venues[0].name,
    eventUrl: item.url,
  }
  return eventInfoObject;
}

const getTicketmasterData = async () => {
  //placeholder url
  const tmUrl = "https://app.ticketmaster.com/discovery/v2/events.json?&countryCode=GB&city=London&classificationName=comedy&sort=date,name,asc&apikey=RTmsu653zlIq0O4v4JzO14tOOeKbVAMK"

  let allData = await fetchTicketmasterData(tmUrl);
  let eventsInfoArray = allData.map(createEventInfoObject);
}

$(document).ready(getTicketmasterData)