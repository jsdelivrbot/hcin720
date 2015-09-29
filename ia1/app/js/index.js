var $ = require('jquery');
//var paper = require('paper');
//paper.install(window);
window.$ = $;
//var filtered = JSON.parse('[{"temp":"54","waterTemp":"60","weatherDesc":"Partly Cloudy","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png","swHeight":"1.7"},{"temp":"54","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.7"},{"temp":"68","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.6"},{"temp":"86","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.6"},{"temp":"89","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.6"},{"temp":"86","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.6"},{"temp":"63","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.5"},{"temp":"61","waterTemp":"60","weatherDesc":"Sunny","weatherIcon":"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png","swHeight":"1.5"}]');

function s() {

var filtered = [
  {
    temp: "54",
    waterTemp: "60",
    weatherDesc: "Partly Cloudy",
    weatherIcon: "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png",
    swHeight:"1.7"
  },
  {
    temp:"54",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.7"
  },
  {
    temp:"68",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.6"
  },
  {
    temp:"86",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.6"
  },
  {
    temp:"89",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.6"
  },
  {
    temp:"86",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.6"
  },
  {
    temp:"63",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.5"
  },
  {
    temp:"61",
    waterTemp:"60",
    weatherDesc:"Sunny",
    weatherIcon:"http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0001_sunny.png",
    swHeight:"1.5"
  }];
console.log(filtered);


var freduced = filtered.reduce(
  function(reduced, obj) {
    reduced.swHeights.push(parseFloat(obj.swHeight));
    reduced.temps.push(obj.temp);
    reduced.waterTemps.push(obj.waterTemp);
    reduced.weatherDescs.push(obj.weatherDesc);
    reduced.weatherIcons.push(obj.weatherIcon);
    return reduced;
}, {
  swHeights:[],
  temps:[],
  waterTemps:[],
  weatherDescs:[],
  weatherIcons:[]
});
 console.log(freduced);


ChartData = window.ChartData || {};

// Stick on the modules that need to be exported.
// You only need to require the top-level modules, browserify
// will walk the dependency graph and load everything correctly
ChartData = freduced;
}
