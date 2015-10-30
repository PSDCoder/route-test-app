(function () {
    'use strict';

    angular
        .module('route-test-app')
        .directive('yandexMap', yandexMapDirective);

    function yandexMapDirective($parse, $log) {
        return {
            restrict: 'E',
            controller: 'YandexMapCtrl',
            controllerAs: 'vm',
            templateUrl: '/src/route-test-app/components/yandex-map/yandex-map.html',
            scope: {},
            bindToController: {
                mapApi: '=',
                onDragPoint: '&'
            },
            link: function ($scope, $element, $attrs, $ctrl) {
                $ctrl.construct($element[0].querySelector('.yandex-map'));

                var parsedRoute = $parse($attrs.route)($scope.$parent);

                //watch by coordinates
                //used this approach for one direction binding with watching
                if (angular.isArray(parsedRoute)) {
                    $scope.$watchCollection(function () {
                        return parsedRoute.map(function (point) {
                            return point.coordinates.join('|');
                        });
                    }, function () {
                        $ctrl.redrawRoute(parsedRoute);
                    });
                } else {
                    $log.warn('You must pass array to "route" attribute of "yandex-map" directive');
                }

                $scope.$on('$destroy', $ctrl.destroy);
            }
        };
    }
})();
