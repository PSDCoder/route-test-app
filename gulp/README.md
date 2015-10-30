# Debug tools


## See list of files
```js
.pipe(require('gulp-debug')())
```

## See content of files
```js
.pipe(require('through2').obj(function (file, enc, cb) {
    if (file.isNull() || file.isStream()) {
        return cb(null, file);
    }

    if (file.isBuffer()) {
        console.log(file.path);
        console.log(file.contents.toString('utf8'));
        cb(null, file);
    }
}))
```