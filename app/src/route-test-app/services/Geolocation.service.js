(function () {
    'use strict';

    angular
        .module('route-test-app')
        .service('Geolocation', Geolocation);

    function Geolocation($log, $q) {
        this.isSupports = isSupports;
        this.getCurrentCoordinates = getCurrentCoordinates;

        function isSupports() {
            return 'geolocation' in window.navigator;
        }

        function getCurrentCoordinates() {
            var errorMessage = 'You should not call "getCurrentCoordinates()" method when User client doen\'t ' +
                'support geolocation api. Use "isSupports()" method before call "getCurrentCoordinates()"';
            var defer = $q.defer();

            if (isSupports()) {
                window.navigator.geolocation.getCurrentPosition(function (position) {
                    defer.resolve([position.coords.latitude, position.coords.longitude]);
                }, defer.reject);
            } else {
                $log.error(errorMessage);
                defer.reject({ message: errorMessage });
            }

            return defer.promise;
        }
    }
})();
