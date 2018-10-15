var geoip2 = require('geoip2');
geoip2.init();
geoip2.lookupSimple('73.70.26.116', function(error, result) {
  if (error) {
    console.log('Error: %s', error);
  }
  else if (result) {
    console.log(result);
  }
});