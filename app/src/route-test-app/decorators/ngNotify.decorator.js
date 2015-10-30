(function () {
    'use strict';

    angular
        .module('route-test-app')
        .config(ngNotifyDecorator);

    function ngNotifyDecorator($provide) {
        $provide.decorator('ngNotify', function ($delegate) {
            var types = [
                'info',
                'error',
                'success',
                'warn',
                'grimace'
            ];

            types.forEach(function (type) {
                $delegate[type] = messageByType.bind(null, $delegate, type);
            });

            return $delegate;

            function messageByType(ngNotify, type, message) {
                ngNotify.set(message, type);
            }
        });
    }
})();
