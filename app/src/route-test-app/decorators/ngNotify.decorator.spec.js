/* globals describe, beforeEach, afterEach, before, after, context, it, expect, sinonSandbox, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

describe('ngNotify decoration', function () {
    var ngNotify;

    beforeEach(module('route-test-app'));
    beforeEach(inject(function ($injector) {
        ngNotify = $injector.get('ngNotify');
    }));

    it('Should contain all helpers methods', function () {
        expect(ngNotify).to.contain.all.keys('info', 'error', 'success', 'warn', 'grimace');
    });

    it('Should delegate data to set() method of original', function () {
        var setMethodSpy = sinonSandbox.spy(ngNotify, 'set');
        var message = 'Notify me!';

        ngNotify.info(message);
        expect(setMethodSpy.calledWith(message, 'info'));
    });
});
