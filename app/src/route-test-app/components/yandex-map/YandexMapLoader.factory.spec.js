/* globals describe, beforeEach, afterEach, before, after, context, it, expect, sinonSandbox, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

describe('YandexMapLoader', function () {
    var $rootScope;
    var YandexMapLoader;
    var $log;

    beforeEach(module('route-test-app'));
    beforeEach(inject(function ($injector, _$log_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $log = _$log_;
        YandexMapLoader = $injector.get('YandexMapLoader');
        sinonSandbox.spy($log, 'error');
    }));

    describe('getMaps()', function () {
        it('Reject promise and log error when yandex maps not connected before use this factory', function (done) {
            var errorMessage = 'You must load yandex maps js before using "yandex-map" component';

            YandexMapLoader.getMaps().catch(function (error) {
                expect(error).to.deep.equal({
                    message: errorMessage
                });
                expect($log.error.calledOnce).to.equal(true);
                expect($log.error.calledWithExactly(errorMessage)).to.equal(true);
                done();
            });
            $rootScope.$digest();
        });

        it('Should resolve promise with maps API when yandex maps already loaded', function (done) {
            window.ymaps = {
                ready: function (cb) {
                    cb();
                }
            };

            YandexMapLoader.getMaps().then(function (result) {
                expect(result).to.equal(window.ymaps);
                done();
            });
            $rootScope.$digest();
        });
    });
});
