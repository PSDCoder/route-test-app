(function () {
    'use strict';

    angular.module('route-test-app')
        .run(function (SvgIcons) {
            SvgIcons.loadSprite('./assets/svgs/sprite.svg');
        });
})();
