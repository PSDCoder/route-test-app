(function () {
    'use strict';

    angular
        .module('svg-icons')
        .directive('svgIcon', svgIconDirective);

    function svgIconDirective($log) {
        if (window.SVGRect === undefined) {
            angular.element(document.documentElement).addClass('no-svg');
        }

        return {
            restrict: 'EA',
            templateUrl: '/src/svg-icons/blocks/svg-icon/svg-icon.html',
            scope: true,
            link: function ($scope, $element, $attrs) {
                if (!$attrs.type) {
                    $log.error('You must pass type of icon');
                }

                $scope.type = $attrs.type;
                $scope.size = $attrs.size || 'small';
            }
        };
    }
})();
