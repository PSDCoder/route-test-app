(function () {
    'use strict';

    angular
        .module('route-test-app')
        .factory('YandexMapLoader', YandexMapLoader);

    function YandexMapLoader($q, $log) {
        return {
            getMaps: getMaps
        };

        function getMaps() {
            var errorMessage = 'You must load yandex maps js before using "yandex-map" component';
            var defer = $q.defer();

            if (!('ymaps' in window)) {
                $log.error(errorMessage);
                defer.reject({ message: errorMessage });
            } else {
                window.ymaps.ready(function () {
                    defer.resolve(window.ymaps);
                });
            }

            return defer.promise;
        }
    }
})();
