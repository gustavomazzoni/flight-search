var http = require('http');

var FlightAPI = (function() {
  var flightAPI = {};

  // The Flight API base uri
  var baseUri = 'http://node.locomote.com/code-task/';

  // airlines method for Flight API airlines endpoint
  flightAPI.airlines = function(successCallback, errorCallback) {
    var endpoint = 'airlines';
    // make the http request to Flight API
    var request = http.get(baseUri + endpoint, function (response) {
      // data is streamed in chunks from the server
      // so we have to handle the "data" event    
      var buffer = '', 
          result;

      response.on('data', function (chunk) {
        buffer += chunk;
      }); 

        // finished transferring data
      response.on('end', function () {
        // if response status is not 200, something went wrong.
        if (response.statusCode !== 200) {
          // call error callback function
          errorCallback(new Error('Error with Flight API airlines endpoint.', response));
        } else {
          // dump the raw data
          try {
            result = JSON.parse(buffer);

            // call success callback function with the result
            successCallback(result);
          } catch(err) {
            // catch any error with JSON parsing the result
            // call error callback function
            errorCallback(err);
          }
        }
      }); 
    });
    request.setTimeout( 10000, function() {
      // handle timeout
      request.abort();
    });
    // if an error occurs
    request.on('error', function(e) {
      // call error callback function
      errorCallback(e);
    });
  };

  // airports method for Flight API airports endpoint
  flightAPI.airports = function(query, successCallback, errorCallback) {
      if (!query || !(query.length > 1)) {
        return errorCallback(new Error('query must contain at least two letters'));
      }

      var endpoint = 'airports';
      
      // Make the http request to Flight API to get the airports
      var request = http.get(baseUri + endpoint + '?q='+query, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "", 
            result;

        response.on("data", function (chunk) {
          buffer += chunk;
        });

        // finished transferring data
        response.on('end', function () {
          // if response status is not 200, something went wrong.
          if (response.statusCode !== 200) {
            // call error callback function
            errorCallback(new Error('Error with Flight API airports endpoint.', response));
          } else {
            // dump the raw data
            try {
              result = JSON.parse(buffer);

              // call success callback function with the result
              successCallback(result);
            } catch(err) {
              // catch any error with JSON parsing the result
              // call error callback function
              errorCallback(err);
            }
          }
        });
      });
      request.setTimeout( 10000, function() {
        // handle timeout
        request.abort();
      });
      // if an error occurs
      request.on('error', function(e) {
        // call error callback function
        errorCallback(e);
      });
  };

  // method for Flight API flight_search endpoint
  flightAPI.searchFlight = function(query, successCallback, errorCallback) {
    if (!query || !query.airlineCode || !query.date || !query.from || !query.to) {
      return errorCallback(new Error('query must contain airlineCode, date, from and to params.'));
    }

    var endpoint = 'flight_search';

    var params = query.airlineCode + '?date=' + query.date + '&from=' + query.from + '&to=' + query.to;
    
    // make the http request to Flight API to get the airports
    var request = http.get(baseUri + endpoint + '/' + params, function (response) {
      // data is streamed in chunks from the server
      // so we have to handle the "data" event    
      var buffer = "", 
          result;

      response.on("data", function (chunk) {
        buffer += chunk;
      });

      // finished transferring data
      response.on('end', function () {
        // if response status is not 200, something went wrong.
        if (response.statusCode !== 200) {
          // call error callback function
          errorCallback(new Error('Error with Flight API flight_search endpoint.', response));
        } else {
          // dump the raw data
          try {
            result = JSON.parse(buffer);

            // call success callback function with the result
            successCallback(result);
          } catch(err) {
            // catch any error with JSON parsing the result
            // call error callback function
            errorCallback(err);
          }
        }
      });
    });
    request.setTimeout(10000, function() {
      // handle timeout
      request.abort();
    });
    // if an error occurs
    request.on('error', function(e) {
      // call error callback function
      errorCallback(e);
    });
  };


  /*
      INTERNAL METHODS
  */


  return flightAPI;
})();

module.exports = FlightAPI;
