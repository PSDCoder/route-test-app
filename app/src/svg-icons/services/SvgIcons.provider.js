(function () {
    'use strict';

    angular
        .module('svg-icons')
        .provider('SvgIcons', SvgIcons);

    function SvgIcons() {
        this.$get = SvgIconsFactory;

        function SvgIconsFactory() {
            return {
                loadSprite: load
            };

            function load(url) {
                var xhr = new window.XMLHttpRequest();

                xhr.onload = function () {
                    var x = document.createElement('x');
                    x.innerHTML = xhr.responseText;

                    document.body.insertBefore(x.firstChild, document.body.firstChild);
                };

                xhr.open('GET', url);
                xhr.send();
            }
        }
    }
})();

