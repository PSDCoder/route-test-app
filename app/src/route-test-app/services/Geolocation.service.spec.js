/* globals describe, beforeEach, afterEach, before, after, context, it, expect, sinonSandbox, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

describe('Geolocation', function () {
    var Geolocation;
    var $rootScope;

    beforeEach(module('route-test-app'));
    beforeEach(inject(function ($injector, _$rootScope_) {
        Geolocation = $injector.get('Geolocation');
        $rootScope = _$rootScope_;
    }));

    describe('isSupports()', function () {
        it('Should return correct value of supporting geolocation API by client', function () {
            sinonSandbox.stub(window.navigator, 'geolocation', function () {});
            expect(Geolocation.isSupports()).to.be.equal(true);
        });
    });

    describe('getCurrentCoordinates()', function () {
        it('Should resolve promise with coordinates when the user has consented', function (done) {
            var stub = sinonSandbox.stub(window.navigator.geolocation, 'getCurrentPosition');

            stub.callsArgWith(0, {
                coords: {
                    latitude: 100,
                    longitude: 100
                }
            });

            Geolocation.getCurrentCoordinates().then(function (value) {
                expect(value).to.deep.equal([100, 100]);
                done();
            });
            $rootScope.$digest();
        });

        it('Should reject promise when user has not consented', function (done) {
            var stub = sinonSandbox.stub(window.navigator.geolocation, 'getCurrentPosition');

            stub.callsArg(1);
            Geolocation.getCurrentCoordinates().catch(done);
            $rootScope.$digest();
        });

        it('Should reject with error message on calling when client doesn\'t support geolocation API', function (done) {
            delete window.navigator.geolocation;

            Geolocation.getCurrentCoordinates().catch(function (error) {
                expect(error).to.have.property('message');
                expect(error.message).to.contain('isSupports()');
                done();
            });
            $rootScope.$digest();
        });
    });
});
