/* globals describe, beforeEach, afterEach, before, after, context, it, expect, sinonSandbox, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

describe('yandex-map', function () {
    describe('postlink()', function () {
        context('With stubbed controller', function () {
            var directiveScope;
            var YandexMapCtrl = function () {
                this.construct = sinonSandbox.spy();
                this.destroy = sinonSandbox.spy();
                this.redrawRoute = sinonSandbox.spy();
            };
            var YandexMapCtrlInstance;

            beforeEach(module('route-test-app', function ($controllerProvider) {
                $controllerProvider.register('YandexMapCtrl', YandexMapCtrl);
            }));
            beforeEach(inject(function ($rootScope, $compile) {
                var directive = angular.element('<yandex-map></yandex-map>');

                $compile(directive)($rootScope.$new());
                $rootScope.$digest();
                YandexMapCtrlInstance = directive.controller('yandexMap');
                directiveScope = directive.isolateScope();
            }));

            it('Should call controller constructor() on initialization', function () {
                expect(YandexMapCtrlInstance.construct.calledOnce).to.be.equal(true);
            });

            it('Should call controller destroy() on directive destroying', function () {
                directiveScope.$destroy();
                expect(YandexMapCtrlInstance.destroy.calledOnce).to.be.equal(true);
            });
        });

        context('With real controller and not passed route', function () {
            var YandexMapCtrlInstance;
            var logWarnSpy;

            beforeEach(module('route-test-app'));
            beforeEach(inject(function ($rootScope, $compile, $log) {
                logWarnSpy = sinonSandbox.spy($log, 'warn');

                var directive = angular.element('<yandex-map></yandex-map>');

                $compile(directive)($rootScope.$new());
                $rootScope.$digest();
                YandexMapCtrlInstance = directive.controller('yandexMap');
            }));

            it('Should set public API', function () {
                expect(YandexMapCtrlInstance.mapApi).to.have.property('getCenter');
                expect(YandexMapCtrlInstance.mapApi.getCenter).to.be.a('function');
            });

            it('Should log warning when passed route attribute is not array', function () {
                expect(logWarnSpy.calledWithExactly('You must pass array to "route" attribute of "yandex-map" directive')).to.equal(true);
            });
        });

        context('With real controller and passed route', function () {
            var $rootScope;
            var redrawRouteSpy;
            var routeData = [{
                name: 'First point',
                coordinates: [100, 100]
            }];

            beforeEach(module('route-test-app'));
            beforeEach(inject(function (_$rootScope_, $compile) {
                $rootScope = _$rootScope_;

                var directive = angular.element('<yandex-map route="routeData"></yandex-map>');
                var YandexMapCtrlInstance;

                $rootScope.routeData = routeData;
                $compile(directive)($rootScope.$new());
                $rootScope.$digest();
                YandexMapCtrlInstance = directive.controller('yandexMap');

                redrawRouteSpy = sinonSandbox.spy(YandexMapCtrlInstance, 'redrawRoute');
            }));

            it('Should call redrawRoute() controller method when changed route array', function () {
                routeData.push({ name: 'Second point', coordinates: [200, 200] });
                $rootScope.$digest();
                expect(redrawRouteSpy.calledOnce).to.equal(true);
                routeData[0].coordinates = [99, 99];
                $rootScope.$digest();
                expect(redrawRouteSpy.calledTwice).to.equal(true);
            });
        });
    });
});
