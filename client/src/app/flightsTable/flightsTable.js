(function(window, document, moment) {
	'use strict';

	var defaultTemplate = [
	  '<div class="flights-table panel panel-default">',
        '<div class="panel-heading">',
          '<h3 class="panel-title">',
            '<span>Flights</span>',
          '</h3>',
        '</div>',
        '<div class="panel-body">',
          '<ul class="flights-dates-nav nav nav-pills nav-justified" role="tablist">',
            '<li class="flights-date-template" role="presentation">',
              '<a class="flights-date" role="tab" data-toggle="pill"></a>',
            '</li>',
          '</ul>',
        '</div>',
        '<div class="panel-body">',
          '<div class="flights-content tab-content">',
            '<div role="tabpanel" class="flights-list-template flights-list tab-pane">',
              '<div class="flight-template media list-group-item">',
                '<div class="flight-airline col-xs-3"></div>',
                '<div class="col-xs-3">',
                  '<h4 class="flight-start-airportCode media-heading"></h4>',
                  '<p class="flight-start-dateTime"></p>',
                '</div>',
                '<div class="col-xs-3">',
                  '<h4 class="flight-finish-airportCode media-heading"></h4>',
                  '<p class="flight-finish-dateTime"></p>',
                '</div>',
                '<div class="col-xs-3">',
                  '<h4 class="flight-price media-heading"></h4>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
	].join('\n');

	function getElementSafely(selector, fromElement) {
		var element = fromElement || document;

		var node = element.querySelector(selector);
		// check if node exists
		if (!node) {
			var msg = selector + ' not found.';
			console.log(msg);
			throw new Error(msg);
		}
		return node;
	}

	function FlightsTable(flightsWeek, selectedDate, target, template) {
		this.flightsWeek = flightsWeek;
		this.currentDate = selectedDate;
		this.target = target;
		this.template = template;

		this._init();
	}

	FlightsTable.prototype._init = function() {
		if (!this.flightsWeek || !this.currentDate || !this.target) {
			var msg = 'Invalid arguments on initializing FlightsTable.';
			console.log(msg);
			throw new TypeError(msg);
		}

		var tmpl = {
			innerHTML: defaultTemplate
		}
		if (this.template) {
			tmpl = getElementSafely(this.template);
		}
		this.target = getElementSafely(this.target);
		
		// Get TEMPLATES
		// flightsTable template
		this.template = tmpl.innerHTML;
		this.target.innerHTML = this.template;

		// flight-template
		var elm = getElementSafely('.flight-template', this.target);
		this.flightTmpl = elm.parentElement.removeChild(elm);
		this.flightTmpl.className = this.flightTmpl.className.replace('flight-template', '');

		// flights-list-template
		elm = getElementSafely('.flights-list-template', this.target);
		this.flightListTmpl = elm.parentElement.removeChild(elm);
		this.flightListTmpl.className = this.flightListTmpl.className.replace('flights-list-template', '');

		// flights-date-template
		elm = getElementSafely('.flights-date-template', this.target);
		this.flightsDateTmpl = elm.parentElement.removeChild(elm);
		this.flightsDateTmpl.className = this.flightsDateTmpl.className.replace('flights-date-template', '');

		
		this.flightsWeek.forEach(function(flightsDay) {
			// get first flight from the first company
			var firstFlight = flightsDay[0][0];
			// extract date YYYY-MM-DD from departure dateTime
			var date = /^\d{4}-\d{1,2}-\d{2}/.exec(firstFlight.start.dateTime)
			// check if departure dateTime is in correct format
			if (!date) {
				var msg = 'flight departure date is not in the YYYY-MM-DD format.';
				console.log(msg);
				throw new Error(msg);
			}
			// get the string of characters matched
			date = date[0];
			
			this._addNavItem(date),
			this._addPanel(date).then(function(panel) {
				this._addList(flightsDay, date);
			}.bind(this));
		}, this);
	};

	FlightsTable.prototype._addNavItem = function(date) {
		var self = this;
		// return a promise so the client doesn't have to wait
		return new Promise(function(resolve, reject) {
			var navItem = self.flightsDateTmpl.cloneNode(true);
			navItem.setAttribute('id', 'nav-item_' + date);
			
			// if same date as selected, activate the element
			if (date === self.currentDate) {
				navItem.className += ' active';
			}

			var dateElem = getElementSafely('.flights-date', navItem);
			dateElem.setAttribute('href', '#' + date);
			dateElem.setAttribute('aria-controls', 'panel_' + date);
			dateElem.innerHTML = moment(date).format('ddd, MMM Do');

			// add click event to nav item
		  navItem.addEventListener('click', function(e) {
		    e.preventDefault();
		    
		    self.navigateTo(date);
		  });

			// append to Nav element
			var nav = getElementSafely('.flights-dates-nav', self.target);
			navItem = nav.appendChild(navItem);

			resolve(navItem);
		});
	};

	FlightsTable.prototype._addPanel = function(date) {
		var self = this;
		// return a promise so the client doesn't have to wait
		return new Promise(function(resolve, reject) {
			var panel = self.flightListTmpl.cloneNode(true);
			
			if (date === self.currentDate) {
				panel.className += ' active';
			}
			panel.setAttribute('id', 'panel_' + date);
	        
	    // append to content element
			var content = getElementSafely('.flights-content', self.target);
			panel = content.appendChild(panel);

			resolve(panel);
		});
	};

	FlightsTable.prototype._addList = function(flightsDay, date) {
		// flatten the array and sort it by flight departure datetime
		var flattened = flightsDay.reduce(function(a, b) {
			return a.concat(b);
		}).sort(function(flightA, flightB) {
			return (new Date(flightA.start.dateTime)).getTime() - (new Date(flightB.start.dateTime)).getTime();
		});
		// add item for each flight and when done place lowest price value to Nav item
		Promise.all(flattened.map(this._addItem, this)).then(function(prices) {
			// Calculate the lowest price
			var lowestPrice = prices.reduce(function(a, b) {
				return Math.min( a, b );
			});
			getElementSafely('#nav-item_' + date + ' .flights-date', self.target).innerHTML += '<br>$' + lowestPrice;
		});
	};

	FlightsTable.prototype._addItem = function(flight) {
		var self = this;
		// return a promise so the client doesn't have to wait
		return new Promise(function(resolve, reject) {
			var item = self.flightTmpl.cloneNode(true);
			
			getElementSafely('.flight-airline', item).innerHTML = flight.airline.name;
			getElementSafely('.flight-start-airportCode', item).innerHTML = flight.start.airportCode;
			getElementSafely('.flight-start-dateTime', item).innerHTML = moment(flight.start.dateTime).tz(flight.start.timeZone).format('LT');
			getElementSafely('.flight-finish-airportCode', item).innerHTML = flight.finish.airportCode;
			getElementSafely('.flight-finish-dateTime', item).innerHTML = moment(flight.finish.dateTime).tz(flight.finish.timeZone).format('LT');
			getElementSafely('.flight-price', item).innerHTML = '$' + flight.price;

			var date = /^\d{4}-\d{1,2}-\d{2}/.exec(flight.start.dateTime)[0];

			// append to panel element
			var panel = getElementSafely('#panel_' + date, self.target);
			item = panel.appendChild(item);
			resolve(flight.price);
		});
	};

	FlightsTable.prototype._events = function() {
	};

	FlightsTable.prototype.navigateTo = function(date, element) {
		// get all navigation elements with 'active' class (should find none or one)
		var elements = this.target.querySelectorAll('.active');
		for (var i = 0; i < elements.length; i++) {
			// remove 'active' class
			elements[i].className = elements[i].className.replace('active', '');
		}
		this.target.querySelector('#nav-item_' + date).className += ' active';
		this.target.querySelector('#panel_' + date).className += ' active';
	};


	/**
	*	Expose FlightsTable adding it to global namespace
	*/
	window.FlightsTable = FlightsTable;

})(window, document, moment);

