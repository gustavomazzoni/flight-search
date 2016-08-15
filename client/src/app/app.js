(function(document, $) {

  document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
      // document ready

      var typeaheadAjax = {
        url: '/api/v1/airports',
        timeout: 500,
        displayField: 'location',
        valueField: 'airportCode',
        triggerLength: 2,
        method: "get",
        loadingClass: "loading-circle",
        preDispatch: function (query) {
          return {
            q: query
          }
        },
        preProcess: function (data) {
          if (data.success === false) {
            // Hide the list, there was some error
            return false;
          }
          return data.map(function(item) {
            return {
              location: item.cityName + ' - ' + item.airportName,
              airportCode: item.airportCode
            }
          });
        }
      };

      /**
        * Twitter Bootstrap Ajax Typeahead Plugin
        * https://github.com/biggora/bootstrap-ajax-typeahead
      */ 
      $('#qFrom').typeahead({
        onSelect: function(item) {
          document.getElementById('from').value = item.value;
        },
        ajax: typeaheadAjax
      });
      $('#qTo').typeahead({
        onSelect: function(item) {
          document.getElementById('to').value = item.value;
        },
        ajax: typeaheadAjax
      });

      /**
        * bootstrap-datepicker
        * https://github.com/eternicode/bootstrap-datepicker
      */
      $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
      });

    }
  };

})(document, jQuery);
