/* globals describe, beforeEach, afterEach, before, after, it, expect, sinon, module, inject */
/* jshint expr:true, maxlen:false */
// jscs:disable maximumLineLength
'use strict';

var sinonSandbox;

beforeEach(function () {
    sinonSandbox = sinon.sandbox.create();
});

afterEach(function () {
    sinonSandbox.restore();
});