'use strict';

const getLatLon = require('./getLatLon');

function dynamicLatLon() {
  const dp = {};
  return async (placeStr) => {
    try {
      if (placeStr in dp) {
        return dp[placeStr];
      }
      else {
        const latLon = await getLatLon(placeStr);
        dp[placeStr] = latLon;
        return latLon;
      }
    }
    catch (error) {
      console.error(error);
    }
  }
}

module.exports = dynamicLatLon;
