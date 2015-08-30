'use strict';
var glob = require('glob');
var bs = require('browser-sync');
var path = require('path');
var CachingWriter = require('broccoli-caching-writer');

function BrowserSyncWatcher(inputTrees, options) {
  if (!(this instanceof BrowserSyncWatcher)) {
    return new BrowserSyncWatcher(inputTrees, options);
  }

  // the options should override that in the CachingWrite if passed through option
  this.onlyReturnUpdatedTrees = true;

  CachingWriter.call(this, inputTrees, options);

  options = options || {};
  this.options = options;
  this.port = (options.port > 0 ? options.port : 4200 );
  this.bsInstance = bs.create();
  
  var bsOptions = options.browserSync || {};
  bsOptions.proxy = 'http://localhost:' + this.port

  this.bsInstance.init(bsOptions);

  this.reload = function (files) {
    this.bsInstance.reload(files);
  };
}

BrowserSyncWatcher.prototype = Object.create(CachingWriter.prototype);
BrowserSyncWatcher.prototype.constructor = BrowserSyncWatcher;

// browser-sync can only inject css files at the moment
BrowserSyncWatcher.prototype.extensions = ['css'];

// TODO(markus): write custom caching functionality that either returns
// all the files that have been updated, or better: It returns all updated
// files with given extensions if those are the only files that have been updated.
// otherwise it will return an empty array.
BrowserSyncWatcher.prototype.updateCache = function(srcPaths, destDir) {
  var files = [];
  for (var i = 0; i < srcPaths.length; i++) {
    var tmpFiles = glob.sync(path.join(srcPaths[i], '/**/*'), { nodir: true });
    for (var j = 0; j < tmpFiles.length; j++) {
      var fileEnding = '.' + this.extensions[0];
      // if a filename does not end with the specified fileEnding then reload
      // the whole page and exit.
      if (tmpFiles[j].indexOf(fileEnding, this.length - fileEnding.length) === -1) {
        this.reload();
        return;
      }
    }
    files = files.concat(tmpFiles);
  }

  // if we have any css file then inject these.
  if (files.length > 0) {
    console.log('injecting css', files);
    this.reload(files);
  }
  return;
};

module.exports = BrowserSyncWatcher;
