(function () {
    'use strict';

    angular
        .module('route-test-app')
        .constant('MAP_DEFAULT_PARAMS', {
            controls: [],
            center: [55.773842,37.625675], //Moscow
            zoom: 10
        })
        .constant('MAP_DECOR_PARAMS', {
            line: {
                strokeColor: '#6c7174',
                strokeWidth: 5,
                strokeOpacity: 0.5
            },
            label: {
                preset: 'islands#circleIcon',
                iconColor: '#989c9e',
                draggable: true
            },
            labelFirst: {
                iconColor: '#70E63C'
            },
            labelLast: {
                iconColor: '#FF4646'
            }
        });
})();
