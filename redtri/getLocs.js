const getLatLon = require('../getLatLon');

const places = ["Albuquerque", "Ann Arbor", "Ashburn", "Atlanta", "Austin", "Baltimore", "Beaverton", "Bellevue", "Birmingham", "Boston", "Chicago", "Cincinnati", "Columbus", "Dallas", "Denver", "Detroit", "Fort Worth", "Honolulu", "Houston", "Indianapolis", "Jersey City", "Kansas City", "Kirkland", "Las Vegas", "Los Angeles", "Louisville", "Memphis", "Miami", "Milwaukee", "Minneapolis", "Nashville", "New Orleans", "New York", "Oakland", "Oklahoma City", "Omaha", "Orange County", "Orlando", "Philadelphia", "Phoenix", "Pittsburgh", "Portland", "Providence", "Raleigh", "Sacramento", "Saint Louis", "Salt Lake City", "San Antonio", "San Diego", "San Francisco", "San Jose", "Santa Rosa", "Seattle", "Tacoma", "Tampa", "Washington DC"];

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

async function main() {
  try {
    for (let place of places) {
      console.log(await getLatLon(place));
      await wait(1000);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();