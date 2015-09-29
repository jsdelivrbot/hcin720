
var path;
var size = view.size;


//Monterey Bay        / Santa Cruz, CA 36.961419, -122.015068
//Waialua Bay         / Haleiwa, HI 21.595299, -158.111836
//North Pacific Ocean / Encinitas, CA 33.036938, -117.308063
//North Pacific Ocean / Paia, HI 20.923168, -156.378652
//Pacific Ocean       / San Clemente, CA 33.413771, -117.638179

// var surfLocations = {
//   santaCruzCA: '36.961419, -122.015068',
//   haleiwaHI: '21.595299, -158.111836',
//   encinitasCA: '33.036938, -117.308063',
//   paiaHI: '20.923168, -156.378652',
//   sanClementeCA: '33.413771, -117.638179'
// }

// $.ajax({
//   url: "https://api.worldweatheronline.com/free/v2/marine.ashx",
//   type: "get",
//   data:{
//     key: '3bc1c3ae1211a3ef78dc503fa11fd',
//     format: 'json',
//     q: surfLocations.encinitasCA
//   }
// }).done(function(response){

//   //filter only the data that we will use
//   var filteredData = response.data.weather[0].hourly.map(
//     function(data){
//       return {
//         'temp': data.tempF,
//         'waterTemp': data.waterTemp_F,
//         'weatherDesc': data.weatherDesc[0].value,
//         'weatherIcon': data.weatherIconUrl[0].value,
//         'swHeight': data.swellHeight_m
//       };
//   });

//   //Put series of the same data type on their respective array
//   var formattedSeries = filteredData.reduce(
//     function(reducedObject, obj) {
//       reduced.swHeights.push(parseFloat(obj.swHeight));
//       reduced.temps.push(obj.temp);
//       reduced.waterTemps.push(obj.waterTemp);
//       reduced.weatherDescs.push(obj.weatherDesc);
//       reduced.weatherIcons.push(obj.weatherIcon);
//       return reduced;
//   }, {
//     swHeights:[],
//     temps:[],
//     waterTemps:[],
//     weatherDescs:[],
//     weatherIcons:[]
//   });

//   path = createPath(formattedSeries.swHeights);
//   var currentTimeSlice = Math.floor(new Date().getHours()/3);
//   $('.overlay-slice:gt(' + currentTimeSlice +')').css({'background-color':'rgba(0,0,0,0.1)'});
//   console.log($('.overlay-slice:gt(' + currentTimeSlice +')'));

//   var slices = $('.slice');
//   //We always have 8 slices in a day so we iterate over them
//   for (var i = 0; i < 8; i++) {
//     slices.eq(i).find('.weather-pic').attr('src', formattedSeries.weatherIcons[i]);
//     slices.eq(i).find('.weather-desc').html(formattedSeries.weatherDescs[i]);
//     slices.eq(i).find('.temp').html(formattedSeries.temps[i] + '&deg;F');
//     slices.eq(i).find('.water-temp').html(formattedSeries.waterTemps[i] + '&deg;F');
//     slices.eq(i).find('.swell-value').html(formattedSeries.swHeights[i] + 'm');
//   }


// });

setInterval(function(){
  var location = $('#surf-location');

  var currentOptionId = location.find('option:selected').index();
  var nextOption = location.find('option').eq((currentOptionId + 1) % 5);

  location.val(nextOption.val());
  location.trigger('change');
  $('#location-title').html(nextOption.html());

}, 15000);

var makeAPIRequest = function(callback) {
  $.ajax({
    url: "https://api.worldweatheronline.com/free/v2/marine.ashx",
    type: "get",
    data:{
      key: '3bc1c3ae1211a3ef78dc503fa11fd',
      format: 'json',
      q: $('#surf-location').val()
    }
  }).done(function(response){

    //filter only the data that we will use
    var filteredData = response.data.weather[0].hourly.map(
      function(data){
        return {
          'temp': data.tempF,
          'waterTemp': data.waterTemp_F,
          'weatherDesc': data.weatherDesc[0].value,
          'weatherIcon': data.weatherIconUrl[0].value,
          'swHeight': data.swellHeight_m
        };
    });

    //Put series of the same data type on their respective array
    var formattedSeries = filteredData.reduce(
      function(reducedObject, obj) {
        reducedObject.swHeights.push(parseFloat(obj.swHeight));
        reducedObject.temps.push(obj.temp);
        reducedObject.waterTemps.push(obj.waterTemp);
        reducedObject.weatherDescs.push(obj.weatherDesc);
        reducedObject.weatherIcons.push(obj.weatherIcon);
        return reducedObject;
    }, {
      swHeights:[],
      temps:[],
      waterTemps:[],
      weatherDescs:[],
      weatherIcons:[]
    });
    callback(formattedSeries);
  });
};

var formatChartInfo = function(formattedSeries) {
  if (path) {
    path.remove();
  }

  path = createPath(formattedSeries.swHeights);
  var currentTimeSlice = Math.floor(new Date().getHours()/3);
  $('.overlay-slice:gt(' + currentTimeSlice +')').css({'background-color':'rgba(0,0,0,0.1)'});

  var slices = $('.slice');
  //We always have 8 slices in a day so we iterate over them
  for (var i = 0; i < 8; i++) {
    slices.eq(i).find('.weather-pic').attr('src', formattedSeries.weatherIcons[i]);
    slices.eq(i).find('.weather-desc').html(formattedSeries.weatherDescs[i]);
    slices.eq(i).find('.temp').html(formattedSeries.temps[i] + '&deg;F');
    slices.eq(i).find('.water-temp').html(formattedSeries.waterTemps[i] + '&deg;F');
    slices.eq(i).find('.swell-value').html(formattedSeries.swHeights[i] + 'm');
  }
};

makeAPIRequest(formatChartInfo);

$('#surf-location').change(function() {
  makeAPIRequest(formatChartInfo);
});


//This graph was made by following some of the techniques used in http://paperjs.org/examples/smoothing/


function createPath(swellHeights) {
  var path = new Path({
    fillColor: '#2E7DFF'
  });

  //initial points for the chart
  path.add(new Point(-500,size.height));
  path.add(new Point(-500,size.height/2));

  for (var i = 0; i < swellHeights.length; i++) {
    var yPercentage = swellHeights[i] / (swellHeights.reduce(function(a,b){return Math.max(a,b)},0) * 1.5);
    var seriesPoint = new Point(i / (swellHeights.length - 1), 1 - yPercentage) * size;
    var segment = path.add(seriesPoint);

  }

  //final point for the chart
  path.add(new Point(size.width ,size.height));

  return path;
}

//apply the wavy effect
function onFrame(event) {
  if(path) {
    path.smooth();
  }
}


// function onKeyDown(event) {
//   if (event.key == 'space') {
//     path.fullySelected = !path.fullySelected;
//     path.fillColor = path.fullySelected ? null : '#2E7DFF';
//   }
// }

