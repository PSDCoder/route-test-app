/* globals describe, beforeEach, afterEach, before, after, context, it, expect, sinonSandbox, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

describe('YandexMapCtrl', function () {
    var $rootScope;
    var $q;
    var YandexMapCtrl;
    var $logErrorSpy;
    var YandexMapLoader;
    var Geolocation;
    var yandexMapSpies = {};
    var testPoints = [
        { name: 'test', coordinates: [100, 100] },
        { name: 'test2', coordinates: [200, 200] }
    ];
    var MAP_DECOR_PARAMS = {
        line: {},
        label: {
            fillColor: 'red'
        },
        labelFirst: {
            fillColor: 'blue'
        },
        labelLast: {
            fillColor: 'green'
        }
    };
    var MAP_DEFAULT_PARAMS = {
        center: [1000, 1000]
    };
    var ngNotify;

    beforeEach(module('route-test-app'));
    beforeEach(inject(function ($controller, _$q_, $log, _$rootScope_, _YandexMapLoader_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        YandexMapLoader = _YandexMapLoader_;

        sinonSandbox.stub(YandexMapLoader, 'getMaps', function () {
            yandexMapSpies.instance = {
                getCenter: sinonSandbox.spy(function () {
                    return [100, 100];
                }),
                geoObjectsAdd: sinonSandbox.spy(),
                geoObjectsRemoveAll: sinonSandbox.spy(),
                getObjectsEventsAdd: sinonSandbox.spy(),
                destroy: sinonSandbox.spy()
            };

            return $q.resolve({
                geometry: {
                    Point: sinonSandbox.spy(function (coordinates) {
                        return coordinates;
                    }),
                    LineString: sinonSandbox.spy(function (coordinatesArray) {
                        return coordinatesArray;
                    })
                },
                GeoObject: sinonSandbox.spy(function (geometryObject) {
                    return {
                        geometry: geometryObject,
                        events: {
                            add: yandexMapSpies.instance.getObjectsEventsAdd
                        }
                    };
                }),
                Map: sinonSandbox.spy(function () {
                    return {
                        getCenter: yandexMapSpies.instance.getCenter,
                        geoObjects: {
                            add: yandexMapSpies.instance.geoObjectsAdd,
                            removeAll: yandexMapSpies.instance.geoObjectsRemoveAll
                        },
                        destroy: yandexMapSpies.instance.destroy
                    };
                })
            });
        });

        Geolocation = {
            isSupports: sinonSandbox.stub().returns(true),
            getCurrentCoordinates: sinonSandbox.stub().returns($q.resolve([100, 100]))
        };

        ngNotify = {
            warn: sinonSandbox.stub()
        };

        YandexMapCtrl = $controller(
            'YandexMapCtrl',
            {
                Geolocation: Geolocation,
                ngNotify: ngNotify,
                MAP_DECOR_PARAMS: MAP_DECOR_PARAMS,
                MAP_DEFAULT_PARAMS: MAP_DEFAULT_PARAMS
            },
            {
                onDragPoint: sinonSandbox.spy()
            }
        );
        $logErrorSpy = sinonSandbox.spy($log, 'error');
    }));

    describe('construct()', function () {
        it('Should get maps from loader and current user location and resolve base map', function (done) {
            sinonSandbox.spy(YandexMapCtrl, '_getUserLocation');

            YandexMapCtrl.construct(angular.element('<div></div>'));
            expect(YandexMapLoader.getMaps.calledOnce).to.equal(true);
            expect(YandexMapCtrl._getUserLocation.calledOnce).to.equal(true);

            YandexMapCtrl._map.then(function () {
                done();
            });
            $rootScope.$digest();
        });
    });

    describe('destroy()', function () {
        it('Should destroy map on call', function (done) {
            YandexMapCtrl.construct(angular.element('<div></div>'));
            $rootScope.$digest();

            YandexMapCtrl.destroy();
            YandexMapCtrl._map.then(function () {
                expect(yandexMapSpies.instance.destroy.calledOnce).to.equal(true);

                done();
            });
            $rootScope.$digest();
        });
    });

    describe('getMapCenter()', function () {
        it('Should get center from maps API', function (done) {
            YandexMapCtrl.construct(angular.element('<div></div>'));

            YandexMapCtrl.mapApi.getCenter().then(function (value) {
                expect(yandexMapSpies.instance.getCenter.calledOnce).to.equal(true);
                expect(yandexMapSpies.instance.getCenter.returnValues[0]).to.deep.equal([100, 100]);
                expect(value).to.deep.equal([100, 100]);
                done();
            });
            $rootScope.$digest();
        });
    });

    describe('redrawRoute()', function () {
        it('Should clear all objects on map, through maps API', function () {
            YandexMapCtrl.construct(angular.element('<div></div>'));

            YandexMapCtrl.redrawRoute(testPoints);
            $rootScope.$digest();

            expect(yandexMapSpies.instance.geoObjectsRemoveAll.calledOnce).to.equal(true);
        });
    });

    describe('_buildGeoObjects()', function () {
        it('Should return count of geoObjects: points + one line', function (done) {
            YandexMapCtrl.construct(angular.element('<div></div>'));
            $rootScope.$digest();

            YandexMapCtrl._map.then(function (map) {
                var geoObjects = YandexMapCtrl._buildGeoObjects(map.ymaps, testPoints);

                expect(geoObjects).to.be.length(testPoints.length + 1);
                done();
            });
            $rootScope.$digest();
        });

        it('Should add events handlers for "drag" and "dragend" only for points', function (done) {
            YandexMapCtrl.construct(angular.element('<div></div>'));
            $rootScope.$digest();

            YandexMapCtrl._map.then(function (map) {
                YandexMapCtrl._buildGeoObjects(map.ymaps, testPoints);
                expect(yandexMapSpies.instance.getObjectsEventsAdd.withArgs('drag').callCount).to.equal(testPoints.length);
                expect(yandexMapSpies.instance.getObjectsEventsAdd.withArgs('dragend').callCount).to.equal(testPoints.length);
                done();
            });
            $rootScope.$digest();
        });
    });

    describe('_getLabelOptions()', function () {
        it('Should return correct styles', function () {
            expect(YandexMapCtrl._getLabelOptions(0, 2)).to.deep.equal(MAP_DECOR_PARAMS.labelFirst);
            expect(YandexMapCtrl._getLabelOptions(1, 2)).to.deep.equal(MAP_DECOR_PARAMS.label);
            expect(YandexMapCtrl._getLabelOptions(2, 2)).to.deep.equal(MAP_DECOR_PARAMS.labelLast);
        });
    });

    describe('_getUserLocation()', function () {
        it('Should check that client supports Geolocation API', function () {
            YandexMapCtrl._getUserLocation();
            expect(Geolocation.isSupports.calledOnce).to.equal(true);
        });

        it('Should notify user if him client doesn\'t support Geolocation API', function () {
            Geolocation.isSupports.returns(false);
            YandexMapCtrl._getUserLocation();
            expect(ngNotify.warn.calledWithExactly('Ваш браузер не поддерживает определение локации. Будут ' +
                'использованы стандартные координаты')).to.equal(true);
        });

        it('Should notify user if him client doesn\'t support Geolocation API', function () {
            Geolocation.isSupports.returns(false);
            YandexMapCtrl._getUserLocation();
            expect(ngNotify.warn.calledWithExactly('Ваш браузер не поддерживает определение локации. Будут ' +
                'использованы стандартные координаты')).to.equal(true);
        });

        it('Should return coordinates if user has give permission to use Geolocation API', function (done) {
            YandexMapCtrl._getUserLocation().then(function (value) {
                expect(value).to.deep.equal([100, 100]);
                done();
            });
            $rootScope.$digest();
        });

        it('Should return default coordinates if user didn\'t give permission to use Geolocation API', function (done) {
            Geolocation.getCurrentCoordinates.returns($q.reject());

            YandexMapCtrl._getUserLocation().then(function (value) {
                expect(value).to.deep.equal(MAP_DEFAULT_PARAMS.center);
                done();
            });
            $rootScope.$digest();
        });

        it('Should show warning if user didn\'t give permission to use Geolocation API', function (done) {
            Geolocation.getCurrentCoordinates.returns($q.reject());

            YandexMapCtrl._getUserLocation().then(function (value) {
                expect(ngNotify.warn.calledWithExactly('Вы запретили использовать определение своей локации. ' +
                    'Будут использованы стандартные координаты')).to.equal(true);
                done();
            });
            $rootScope.$digest();
        });
    });
});
