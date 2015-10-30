'use strict';

module.exports = GulpManager;

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');

var configFilePath = path.resolve(__dirname, 'config.js');
var tasksFolderPath = path.resolve(__dirname, 'tasks');
var bowerPackagePath = path.resolve(__dirname, '..', 'bower.json');

function GulpManager() {
    this._storage = {};
    this._parseArgs();
    this._loadTasks();
}

GulpManager.prototype._loadTasks = function () {
    var self = this;

    if (!fs.existsSync(configFilePath)) {
        throw new Error('Config file for gulp doesn\'t exist. Check it on path: ' + configFilePath);
    }

    if (!fs.existsSync(tasksFolderPath)) {
        throw new Error('Tasks folder for gulp doesn\'t exist. Check it on path: ' + tasksFolderPath);
    }

    self._config = require(configFilePath)(self);

    fs.readdirSync(tasksFolderPath)
        .forEach(function (file) {
            var task = require(path.join(tasksFolderPath, file));

            task(self, gulp, self._config);
        });
};

GulpManager.prototype._parseArgs = function () {
    if (!this._parsedArgs) {
        this._parsedArgs = require('minimist')(process.argv.slice(2), {
            alias: {
                port: 'p',
                env: 'e',
                watch: 'w'
            }
        });
    }
};

GulpManager.prototype.getArgs = function () {
    return this._parsedArgs;
};

GulpManager.prototype.getArg = function (name) {
    return this._parsedArgs[name];
};

GulpManager.prototype.getBower = function () {
    if (!fs.existsSync(bowerPackagePath)) {
        throw new Error('You tried get bower file, but it doesn\'t exist. Check it on path: ' + bowerPackagePath);
    }

    delete require.cache[bowerPackagePath];
    return require(bowerPackagePath);
};

GulpManager.prototype.set = function (key, value) {
    if (this._storage[key]) {
        throw new Error('Value with key "' + key + '" already set to storage');
    }

    this._storage[key] = value;
    return value;
};

GulpManager.prototype.get = function (key) {
    if (!this._storage[key]) {
        throw new Error('!Value with key "' + key + '" doesn\'t exist in storage');
    }

    return this._storage[key];
};