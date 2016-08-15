var router = require('express').Router(),
	async = require('async'),
	redis = require("redis"),
	FlightAPI = require('../../../lib/FlightAPI');

// create a new redis client and connect to our local redis instance
var client = redis.createClient();
var CACHE_EXPIRY = 21600; // expire in 6 hours or 21600 seconds

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("[Redis] Error: " + err);
});

/* GET /api/v1/airlines 
   Lists all available airlines from the Flight API.
*/
router.use('/airlines', function(req, res, next) {
	FlightAPI.airlines(function(result) {
		res.json(result);
	}, function(err) {
		console.log('airlines error', err);
		return next(err);
	});
});

/* GET /api/v1/airports?q
   Lists all matching airports from the Flight API.
*/
router.use('/airports', function(req, res, next) {
	var query = req.query.q;
	if (!query || !(query.length > 1)) {
		return next(new Error('query must contain at least two letters'));
	}

	var urlParams = '/airports?q=' + query.toLowerCase();
	
	// use the redis client to get the forecast info associated 
  // to the query params from our redis cache
  client.get(urlParams, function(error, result) {
    // if we have a result cached for these query params
    if (result) {
      // parse stringified JSON result
      result = JSON.parse(result)
      // return it to our client
      res.json(result);
    } else {
			FlightAPI.airports(query, function(result) {
				// store the key-value pair (urlParams:result) in our cache
        // with an expiry defined by CACHE_EXPIRY constant.
        client.setex(urlParams, CACHE_EXPIRY, JSON.stringify(result));
				res.json(result);
			}, function(err) {
				console.log('airports error', err);
				return next(err);
			});
		}
	});
});

/* GET /api/v1/search?date&from&to 
   Search for flights in Flight API according to params.
*/
router.use('/search', function(req, res, next) {
	if (!(/^\d{4}-\d{1,2}-\d{1,2}/.test(req.query.date))) {
		return next(new Error('Invalid date param. It should be in YYYY-MM-DD format.'));
	} else if ((!req.query.from || !(req.query.from.length === 3))
		||  (!req.query.to || !(req.query.to.length === 3))) {
		return next(new Error('Invalid airportCode.'));
	}

	var query = req.query;

	FlightAPI.airlines(function(result) {
		var flights = [];

		// Parallel Async
		async.each(result, function(airline, done) {
			query.airlineCode = airline.code;
			FlightAPI.searchFlight(query, function(result) {
				flights.push(result);
				// done callback
				done();
			}, function(err) {
				done(err);
			});
		}, function(err) {
      if (err) {
        console.log('flights error', err);
        // One of the iterations produced an error.
        return next(err);
      } else {
      	res.json(flights);
      }
		});
	}, function(err) {
		console.log('airlines error', err);
		return next(err);
	});
	
});

module.exports = router;