(function () {
    'use strict';

    angular
        .module('route-test-app')
        .controller('YandexMapCtrl', YandexMapCtrl);

    function YandexMapCtrl($q, YandexMapLoader, Geolocation, ngNotify, _, MAP_DEFAULT_PARAMS, MAP_DECOR_PARAMS) {
        var vm = this;
        var mapDefer = $q.defer();

        //public api
        vm.mapApi = {
            getCenter: getMapCenter
        };
        vm.isLoading = true;
        vm.construct = construct;
        vm.destroy = destroy;
        vm.redrawRoute = redrawRoute;
        vm._map = mapDefer.promise;
        vm._buildGeoObjects = buildGeoObjects;
        vm._getLabelOptions = getLabelOptions;
        vm._getUserLocation = getUserLocation;

        function construct(domNode) {
            $q.all({
                ymaps: YandexMapLoader.getMaps(),
                center: vm._getUserLocation()
            })
            .then(function (resolved) {
                var options = angular.extend({}, MAP_DEFAULT_PARAMS, { center: resolved.center });

                vm.isLoading = false;
                mapDefer.resolve({
                    ymaps: resolved.ymaps,
                    instance: new resolved.ymaps.Map(domNode, options)
                });
            });
        }

        function destroy() {
            vm._map.then(function (map) {
                map.instance.destroy();
            });
        }

        function getMapCenter() {
            return vm._map.then(function (map) {
                return map.instance.getCenter();
            });
        }

        function redrawRoute(points) {
            vm._map.then(function (map) {
                map.instance.geoObjects.removeAll();
                vm._buildGeoObjects(map.ymaps, points).forEach(function (obj) {
                    map.instance.geoObjects.add(obj);
                });
            });
        }

        function buildGeoObjects(ymaps, points) {
            //path
            var geoPath = new ymaps.GeoObject(
                {
                    geometry: new ymaps.geometry.LineString(
                        points.map(function (point) {
                            return point.coordinates;
                        })
                    )
                },
                MAP_DECOR_PARAMS.line
            );
            var geoObjects = [geoPath];
            var pointsLastIndex = points.length - 1;

            //labels
            points.forEach(function (point, index) {
                var geoPoint = new ymaps.GeoObject(
                    {
                        geometry: new ymaps.geometry.Point(point.coordinates),
                        properties: {
                            balloonContent: point.name
                        }
                    },
                    vm._getLabelOptions(index, pointsLastIndex)
                );

                geoPoint.events.add('drag', function () {
                    geoPath.geometry.set(index, geoPoint.geometry.getCoordinates());
                });

                if (angular.isFunction(vm.onDragPoint)) {
                    geoPoint.events.add('dragend', _.throttle(function () {
                        vm.onDragPoint({
                            index: index,
                            coordinates: geoPoint.geometry.getCoordinates()
                        });
                    }, 100));
                }

                geoObjects.push(geoPoint);
            });

            return geoObjects;
        }

        function getLabelOptions(index, lastIndex) {
            var options = angular.extend({}, MAP_DECOR_PARAMS.label);

            if (index === 0) {
                angular.extend(options, MAP_DECOR_PARAMS.labelFirst);
            } else if (index === lastIndex) {
                angular.extend(options, MAP_DECOR_PARAMS.labelLast);
            }

            return options;
        }

        function getUserLocation() {
            var defer = $q.defer();

            if (Geolocation.isSupports()) {
                Geolocation.getCurrentCoordinates()
                    .then(resolveCoords)
                    .catch(function () {
                        ngNotify.warn('Вы запретили использовать определение своей локации. ' +
                            'Будут использованы стандартные координаты');
                        resolveCoords();
                    });
            } else {
                ngNotify.warn('Ваш браузер не поддерживает определение локации. ' +
                    'Будут использованы стандартные координаты');
                resolveCoords();
            }

            return defer.promise;

            function resolveCoords(coords) {
                defer.resolve(coords || MAP_DEFAULT_PARAMS.center);
            }
        }
    }
})();

