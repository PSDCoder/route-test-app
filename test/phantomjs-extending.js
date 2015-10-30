'use strict';
/* jshint freeze:false */

if (window.navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
    //Phantom.js doesn't support geolocation API
    window.navigator.geolocation = function () {};
    window.navigator.geolocation.getCurrentPosition = function () {};
}
