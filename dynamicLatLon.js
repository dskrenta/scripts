'use strict';

const getLatLon = require('./getLatLon');

async function dynamicLatLon() {
  try {
    const dp = {};
    return (placeStr) => {
      if (placeStr in dp) {
        return dp[placeStr];
      }
      else {
        const latLon = getLatLon(placeStr);
        dp[placeStr] = latLon;
        return latLon;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = dynamicLatLon;