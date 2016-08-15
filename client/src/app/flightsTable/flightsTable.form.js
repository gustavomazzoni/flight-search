(function(document, moment) {
  'use strict';

  // Loads navigation items via AJAX request
  function ajax(options) {
    return new Promise(function(resolve, reject) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        // When request is finished and response is ready
        if (xmlhttp.readyState == 4) {
          // if no errors
          if (xmlhttp.status == 200) {
            try {
              var response = JSON.parse(xmlhttp.responseText);
              resolve(response);
            } catch(err) {
              reject(err);
            }
          } else {
            reject(new Error('Error with the HTTP Request.', xmlhttp.responseText));
          }
        }
      };

      var method = options.type || 'GET';
      var url = options.data ? (options.url + '?' + options.data) : options.url;
      xmlhttp.open(method, url, true);
      xmlhttp.send();
    });
  }

  function validate(form) {
    var valid = true;
    if (!form.from.value) {
      form.from.parentElement.className += ' has-error';
      valid = false;
    } else {
      form.from.parentElement.className.replace(' has-error', '');
    }
    if (!form.to.value) {
      form.to.parentElement.className += ' has-error';
      valid = false;
    } else {
      form.to.parentElement.className.replace(' has-error', '');
    }
    if ((!form.date.value) || 
      !(/^\d{4}-\d{1,2}-\d{1,2}/.test(form.date.value))) {
      form.date.parentElement.className += ' has-error';
      valid = false;
    } else {
      form.date.parentElement.className.replace(' has-error', '');
    }
    return valid;
  }

  document.querySelector('form[flights-table]').addEventListener('submit', function(event) {
    event.preventDefault();

    var form = this,
        method = form.getAttribute('method'),
        url = form.getAttribute('action'),
        target = form.getAttribute('data-target'),
        template = form.getAttribute('data-template');

    if (!validate(form)) return false;

    waitingDialog.show('Searching for Flights...');

    Promise.all([
      ajax({
        type: method,
        url: url,
        data: 'from=' + form.from.value + '&to=' + form.to.value + 
              '&date=' + moment(form.date.value).subtract(2, 'day').format('YYYY-MM-DD')
      }),
      ajax({
        type: method,
        url: url,
        data: 'from=' + form.from.value + '&to=' + form.to.value + 
              '&date=' + moment(form.date.value).subtract(1, 'day').format('YYYY-MM-DD')
      }),
      ajax({
        type: method,
        url: url,
        data: 'from=' + form.from.value + '&to=' + form.to.value + '&date=' + form.date.value
      }),
      ajax({
        type: method,
        url: url,
        data: 'from=' + form.from.value + '&to=' + form.to.value + 
              '&date=' + moment(form.date.value).add(1, 'day').format('YYYY-MM-DD')
      }),
      ajax({
        type: method,
        url: url,
        data: 'from=' + form.from.value + '&to=' + form.to.value + 
              '&date=' + moment(form.date.value).add(2, 'day').format('YYYY-MM-DD')
      })
    ])
    .then(function(resultList) {
      var flightsTable = new FlightsTable(resultList, form.date.value, target, template);
      document.querySelector(target).scrollIntoView();
      waitingDialog.hide();
    }, function(err) {
      console.log('Error when Searching for Flights', err.message);
      waitingDialog.hide();
    });
  });

})(document, moment);