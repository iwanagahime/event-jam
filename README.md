![Title: Event Jam and Logo ](./assets/images/logo.png)

# Event Jam

## Table of Contents

- [Event Jam](#event-jam)
  - [Table of Contents](#table-of-contents)
  - [Deployed Github Page](#deployed-github-page)
  - [Contributors](#contributors)
  - [Getting started](#getting-started)
  - [Project Overview](#project-overview)
    - [Motivation](#motivation)
    - [Description](#description)
    - [User Story](#user-story)
  - [What Was Done](#what-was-done)
  - [Screenshots](#screenshots)
    - [Homepage](#homepage)
    - [Results Page](#results-page)
    - [Results Page with Displayed Covid-19 Info](#results-page-with-displayed-covid-19-info)
    - [My Events Page](#my-events-page)
    - [My Events Page No Events Saved](#my-events-page-no-events-saved)
    - [No Events Matching Criteria Found](#no-events-matching-criteria-found)

## Deployed Github Page

Click [here](https://iwanagahime.github.io/event-jam/) to view project on GitHub pages.

## Contributors

Dominika Pietrzak: [Github](https://github.com/dominikacookies),
[LinkedIn](https://www.linkedin.com/in/dominika-pietrzak-183755137/)

Soumeya Hassan: [here](https://github.com/SoumeyaH), [LinkedIn](https://www.linkedin.com/in/soumeya-hassan-0a12a5203/)

Eliza Krucon: [here](https://github.com/iwanagahime), [LinkedIn](https://www.linkedin.com/in/eliza-krucon-a84426204/)
Adam Arthur: [here](https://github.com/KingArthur0877), [LinkedIn](https://www.linkedin.com/in/adam-arthur-315b39156/)

## Getting started

- Clone the GitHub project onto your local machine
- Navigate into the project
- Open the project in VSCode
- Open the `script.js` file in your default browser

```
git clone https://iwanagahime.github.io/event-jam/.
code .
```

## Project Overview

### Motivation

With the successful vaccine roll out and summer coming the past year of lock-downs and restrictions will start to seem a distant memory, as people look to start seeing friends and family again offline.

However, we know how quickly the situation can change and how constant alterations to restrictions rules and COVID-19 hotspots can make it difficult to plan a safe time. So at Event Jam were here to help.

### Description

Event Jam is a dynamic online application that offer users the ability to search for events in any city in the UK and get relevant, reliable and up to date covid-19 information for that area. By using our dynamic application that utilizes two different server-side API's to get you all the information you could need to safely and easily plan a day out.

### User Story

As a user I want to search for events in any city in the UK, and at the same time receive up to date COVID-19 information for that location. So that I can make an informed decision when booking my tickets accordingly.

```
GIVEN an EventJam Homepage with search inputs
WHEN I search for a city and optionally for event type
THEN I am redirected to Results page and presented with events taking place in that city.Events are displayed as cards with event image, name, the date, time and venue shown. Each of the cards contains navigation buttons - one linking the app to event page on TicketMaster and the other allowing the user to save the event in My Events page if it hasn't been saved already. If the event has been already saved a Saved button is rendered instead of Save Event one.
THEN I am taken to the Results page and presented with the current Covid-19 information for that location
WHEN I scroll down
THEN I have the option to click the Load More button and another twenty event cards are displayed
When I click on the My Events button on the Homepage or the Results page
THEN I am redirected to the My Events page where cards with my saved events are displayed
WHEN I am presented with the cards for my favorite events
THEN I have the option of navigating to the TicketMaster page for a given event, rendering current Covid-19 info for that event location or removing the event from favorites
WHEN I have no saved events
THEN I am presented with a message prompting me to make a search as there are no events saved

```

## What Was Done

- We created a landing page that includes a search bar allowing the user to search for events by city and event type
- Our search inputs are displayed on each of the application pages
- We dynamically created an event card containing such data as event image, event name, date, time and venue
- Our events cards contain navigation buttons
- We used a CSS framework (Bulma) to style our application
- We used Adobe xd to create page design
- We used the [TicketMaster](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) to retrieve events data
- We used the [UK Coronavirus Dashboard] (https://coronavirus.data.gov.uk/details/developers-guide) to retrieve Covid-19 data
- We formatted our code using prettier

## Screenshots

### Homepage

![Deployed application  ](src=./../assets/images/screenshots/home-page.png)

### Results Page

![Deployed application ](src=./../assets/images/screenshots/rendering-results.png)

### Results Page with Displayed Covid-19 Info

![Deployed application Results Page](src=./../assets/images/screenshots/results-covid-info.png)

### My Events Page

![Deployed application My Events Page](src=./../assets/images/screenshots/my-events.png)

### My Events Page No Events Saved

![Deployed application No Events Saved](src=./../assets/images/screenshots/no-events-no-events-saved.png)

### No Events Matching Criteria Found

![Deployed application No Events Matching Criteria Found ](src=./../assets/images/screenshots/prompting-user.png)
