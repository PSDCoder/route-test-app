(function () {
    'use strict';

    angular
        .module('route-test-app')
        .controller('RouteEditorCtrl', RouteEditorCtrl);

    function RouteEditorCtrl($log, ngNotify, _, MAP_DECOR_PARAMS) {
        var vm = this;
        var ENTER_KEY_CODE = 13;

        vm.pointName = '';
        vm.points = [];
        vm.addPoint = addPoint;
        vm.removePoint = _.remove.bind(_, vm.points);
        vm.getPointStyle = getPointStyle;
        vm.onDragPoint = onDragPoint;

        function addPoint(event, name) {
            if (!angular.isDefined(vm.map)) {
                $log.error('You should pass to vm.map public api of map');
                return;
            }

            if (event.keyCode === ENTER_KEY_CODE) {
                name = _.trim(name);

                if (!name.length) {
                    ngNotify.error('Нельзя добавить точку без имени');
                    return;
                }

                vm.map.getCenter().then(function (coordinates) {
                    if (_.find(vm.points, { coordinates: coordinates })) {
                        ngNotify.error('Точка с такими координатами уже существует');
                        return;
                    }

                    vm.points.push({
                        name: name,
                        coordinates: coordinates
                    });
                    vm.pointName = '';
                });
            }
        }

        function getPointStyle(index) {
            var fill;

            if (index === 0) {
                fill = MAP_DECOR_PARAMS.labelFirst.iconColor;
            } else if (index === vm.points.length - 1) {
                fill = MAP_DECOR_PARAMS.labelLast.iconColor;
            } else {
                fill = MAP_DECOR_PARAMS.label.iconColor;
            }

            return {
                fill: fill
            };
        }

        function onDragPoint(index, coordinates) {
            vm.points[index].coordinates = coordinates;
        }
    }
})();

