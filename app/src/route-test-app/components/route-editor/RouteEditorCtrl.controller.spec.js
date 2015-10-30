/* globals describe, beforeEach, afterEach, before, after, context, it, expect, sinonSandbox, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

describe('RouteEditorCtrl', function () {
    var $rootScope;
    var $q;
    var RouteEditorCtrl;
    var ngNotifyErrorSpy;
    var $logErrorSpy;
    var enterEvent;
    var MAP_DECOR_PARAMS_MOCK = {
        label: { iconColor: 'red' },
        labelFirst: { iconColor: 'green' },
        labelLast: { iconColor: 'blue' }
    };

    beforeEach(module('route-test-app'));
    beforeEach(inject(function ($controller, $log, ngNotify, _$rootScope_, _$q_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        RouteEditorCtrl = $controller('RouteEditorCtrl', {
            $scope: $rootScope,
            ngNotify: ngNotify,
            $log: $log,
            MAP_DECOR_PARAMS: MAP_DECOR_PARAMS_MOCK
        });
        RouteEditorCtrl.map = { getCenter: function () {
            return $q.resolve([100, 100]);
        }};

        ngNotifyErrorSpy = sinonSandbox.spy(ngNotify, 'error');
        $logErrorSpy = sinonSandbox.spy($log, 'error');
    }));
    beforeEach(function () {
        enterEvent = document.createEvent('Event');
        enterEvent.initEvent('keydown', true, true);
        enterEvent.keyCode = 13;
    });

    describe('addPoint()', function () {
        it('Shouldn\'t add point if pressed key is not Enter', function () {
            enterEvent.keyCode = 14;
            RouteEditorCtrl.addPoint(enterEvent, 'Some point');
            $rootScope.$digest();

            expect(RouteEditorCtrl.points).to.have.length(0);
        });

        it('Must add point to vm.points on pressing Enter key', function () {
            var pointName = 'Some point';

            RouteEditorCtrl.addPoint(enterEvent, pointName);
            $rootScope.$digest();

            expect(RouteEditorCtrl.points).to.have.length(1);
            expect(RouteEditorCtrl.points[0]).to.deep.equal({ name: pointName, coordinates: [100, 100] });
        });

        it('Must log error when map public api isn\'t assigned to vm.map', function () {
            RouteEditorCtrl.map = undefined;

            RouteEditorCtrl.addPoint(enterEvent, 'Some point');
            $rootScope.$digest();

            expect($logErrorSpy.calledWith('You should pass to vm.map public api of map')).to.equal(true);
        });

        it('Should trim name of point', function () {
            var pointName = 'Some point';

            RouteEditorCtrl.addPoint(enterEvent, '      ' + pointName + '       ');
            $rootScope.$digest();

            expect(RouteEditorCtrl.points).to.have.length(1);
            expect(RouteEditorCtrl.points[0]).to.deep.equal({ name: pointName, coordinates: [100, 100] });
        });

        it('Should call error notification if point name is empty, and shouldn\'t add it to points', function () {
            RouteEditorCtrl.addPoint(enterEvent, '');
            $rootScope.$digest();

            expect(ngNotifyErrorSpy.calledWith('Нельзя добавить точку без имени')).to.equal(true);
        });

        it('Should call error notification when user tries add point with coordinates which already in array', function () {
            RouteEditorCtrl.addPoint(enterEvent, 'First point');
            RouteEditorCtrl.addPoint(enterEvent, 'Second point');
            $rootScope.$digest();

            expect(ngNotifyErrorSpy.calledWith('Точка с такими координатами уже существует')).to.equal(true);
        });

        it('Should clear vm.pointName name after successive adding of point', function () {
            RouteEditorCtrl.pointName = 'Some point';

            RouteEditorCtrl.addPoint(enterEvent, 'First point');
            $rootScope.$digest();

            expect(RouteEditorCtrl.pointName).to.be.equal('');
        });
    });

    describe('removePoint()', function () {
        it('Should remove point from vm.points', function () {
            var stub = sinonSandbox.stub(RouteEditorCtrl.map, 'getCenter');
            stub.onCall(0).returns($q.resolve([100, 100]));
            stub.onCall(1).returns($q.resolve([200, 200]));

            RouteEditorCtrl.addPoint(enterEvent, 'First point');
            RouteEditorCtrl.addPoint(enterEvent, 'Second point');
            $rootScope.$digest();

            expect(RouteEditorCtrl.points).to.have.length(2);
            RouteEditorCtrl.removePoint(RouteEditorCtrl.points[0]);
            expect(RouteEditorCtrl.points).to.have.length(1);
        });
    });

    describe('getPointStyle()', function () {
        it('Should return correct fill on point index', function () {
            var stub = sinonSandbox.stub(RouteEditorCtrl.map, 'getCenter');
            stub.onCall(0).returns($q.resolve([100, 100]));
            stub.onCall(1).returns($q.resolve([200, 200]));
            stub.onCall(2).returns($q.resolve([300, 300]));

            RouteEditorCtrl.addPoint(enterEvent, 'First point');
            RouteEditorCtrl.addPoint(enterEvent, 'Second point');
            RouteEditorCtrl.addPoint(enterEvent, 'Third point');
            $rootScope.$digest();

            expect(RouteEditorCtrl.getPointStyle(0)).to.deep.equal({ fill: 'green' });
            expect(RouteEditorCtrl.getPointStyle(1)).to.deep.equal({ fill: 'red' });
            expect(RouteEditorCtrl.getPointStyle(2)).to.deep.equal({ fill: 'blue' });
        });
    });

    describe('onDragPoint()', function () {
        it('Should update point coordinates', function () {
            var newCoordinates = [500, 1000];
            var stub = sinonSandbox.stub(RouteEditorCtrl.map, 'getCenter');
            stub.onCall(0).returns($q.resolve([100, 100]));
            stub.onCall(1).returns($q.resolve([200, 200]));

            RouteEditorCtrl.addPoint(enterEvent, 'First point');
            RouteEditorCtrl.addPoint(enterEvent, 'Second point');
            $rootScope.$digest();

            RouteEditorCtrl.onDragPoint(0, newCoordinates);
            expect(RouteEditorCtrl.points[0].coordinates).to.deep.equal(newCoordinates);
        });
    });
});
