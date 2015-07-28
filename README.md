# broccoli-browser-sync
BrowserSync support for Broccolijs

## Usage

Right now usage is still a bit suboptimal, but you already get all the beauty of BrowserSync including live css injection as well as livereload.

```js
var browserSync = new BrowserSync(inputTrees);
```

e.g.
```js
var fastBrowserify = require('broccoli-fast-browserify');
var babelify = require('babelify');
var mergeTrees = require('broccoli-merge-trees');
var compileSass = require('broccoli-sass-source-maps');
var funnel = require('broccoli-funnel');
var BrowserSync = require('broccoli-browser-sync');

var optionalTransforms = [
  'regenerator'
  // 'minification.deadCodeElimination',
  // 'minification.inlineExpressions'
];

var babelOptions = {stage: 0, optional: optionalTransforms, compact: true};

// var browserifyOpts = {deps: true, entries: files, noParse: noParse, ignoreMissing: true};
var transformedBabelify = fastBrowserify('app', {
  browserify: {
    extensions: [".js"]
  },
  bundles: {
    'js/app.js': {
      entryPoints: ['app.js'],
      transform: {
        tr: babelify,
        options: {
          stage: 0
        }
      }
    }
  }
});

var appCss = compileSass(['piggy/frontend/app'], 'main.scss', 'css/app.css');

var staticFiles = funnel('frontend', {
  srcDir: 'static'
});

var browserSync = new BrowserSync([staticFiles, transformedBabelify, appCss]);

module.exports = mergeTrees([staticFiles, transformedBabelify, appCss, browserSync]);
```
