var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var FlightAPI = require('../../lib/FlightAPI');

describe('FlightAPI', function() {

	describe('#airports', function() {

		it('should throw an Error when query is not a valid argument', function() {
		  	var expectedResponse = 'query must contain at least two letters';
            
		  	var query = '';
			FlightAPI.airports(query, function(response) {
			}, function(err) {
				expect(err.message).to.equal(expectedResponse);
			});
		});

	});

	describe('#searchFlight', function() {

		it('should throw an Error when query is not a valid argument', function() {
		  	var expectedResponse = 'query must contain airlineCode, date, from and to params.';
            
		  	var query = { airlineCode: 'SYD' };
			FlightAPI.searchFlight(query, function(response) {
			}, function(err) {
				expect(err.message).to.equal(expectedResponse);
			});
		});

	});
  
});