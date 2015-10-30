(function () {
    'use strict';

    angular
        .module('route-test-app')
        .directive('routeEditor', routeEditorDirective);

    function routeEditorDirective() {
        return {
            restrict: 'E',
            controller: 'RouteEditorCtrl',
            controllerAs: 'routeEditor',
            scope: {},
            templateUrl: '/src/route-test-app/components/route-editor/route-editor.html'
        };
    }
})();
