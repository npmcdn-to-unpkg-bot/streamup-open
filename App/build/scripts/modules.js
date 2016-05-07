/*
 angular-file-upload v2.2.0
 https://github.com/nervgh/angular-file-upload
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["angular-file-upload"] = factory();
	else
		root["angular-file-upload"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var options = _interopRequire(__webpack_require__(2));

	var serviceFileUploader = _interopRequire(__webpack_require__(3));

	var serviceFileLikeObject = _interopRequire(__webpack_require__(4));

	var serviceFileItem = _interopRequire(__webpack_require__(5));

	var serviceFileDirective = _interopRequire(__webpack_require__(6));

	var serviceFileSelect = _interopRequire(__webpack_require__(7));

	var serviceFileDrop = _interopRequire(__webpack_require__(8));

	var serviceFileOver = _interopRequire(__webpack_require__(9));

	var directiveFileSelect = _interopRequire(__webpack_require__(10));

	var directiveFileDrop = _interopRequire(__webpack_require__(11));

	var directiveFileOver = _interopRequire(__webpack_require__(12));

	angular.module(CONFIG.name, []).value("fileUploaderOptions", options).factory("FileUploader", serviceFileUploader).factory("FileLikeObject", serviceFileLikeObject).factory("FileItem", serviceFileItem).factory("FileDirective", serviceFileDirective).factory("FileSelect", serviceFileSelect).factory("FileDrop", serviceFileDrop).factory("FileOver", serviceFileOver).directive("nvFileSelect", directiveFileSelect).directive("nvFileDrop", directiveFileDrop).directive("nvFileOver", directiveFileOver).run(["FileUploader", "FileLikeObject", "FileItem", "FileDirective", "FileSelect", "FileDrop", "FileOver", function (FileUploader, FileLikeObject, FileItem, FileDirective, FileSelect, FileDrop, FileOver) {
	    // only for compatibility
	    FileUploader.FileLikeObject = FileLikeObject;
	    FileUploader.FileItem = FileItem;
	    FileUploader.FileDirective = FileDirective;
	    FileUploader.FileSelect = FileSelect;
	    FileUploader.FileDrop = FileDrop;
	    FileUploader.FileOver = FileOver;
	}]);

/***/ },

/* 1 */
/***/ function(module, exports) {

	module.exports = {
		"name": "angularFileUpload"
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	    url: "/",
	    alias: "file",
	    headers: {'authorization': 'Bearer Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn'},
	    queue: [],
	    progress: 0,
	    autoUpload: false,
	    removeAfterUpload: false,
	    method: "POST",
	    filters: [],
	    formData: [],
	    queueLimit: Number.MAX_VALUE,
	    withCredentials: false
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var copy = angular.copy;
	var extend = angular.extend;
	var forEach = angular.forEach;
	var isObject = angular.isObject;
	var isNumber = angular.isNumber;
	var isDefined = angular.isDefined;
	var isArray = angular.isArray;
	var element = angular.element;

	module.exports = function (fileUploaderOptions, $rootScope, $http, $window, FileLikeObject, FileItem) {
	    var File = $window.File;
	    var FormData = $window.FormData;

	    var FileUploader = (function () {
	        /**********************
	         * PUBLIC
	         **********************/
	        /**
	         * Creates an instance of FileUploader
	         * @param {Object} [options]
	         * @constructor
	         */

	        function FileUploader(options) {
	            _classCallCheck(this, FileUploader);

	            var settings = copy(fileUploaderOptions);

	            extend(this, settings, options, {
	                isUploading: false,
	                _nextIndex: 0,
	                _failFilterIndex: -1,
	                _directives: { select: [], drop: [], over: [] }
	            });

	            // add default filters
	            this.filters.unshift({ name: "queueLimit", fn: this._queueLimitFilter });
	            this.filters.unshift({ name: "folder", fn: this._folderFilter });
	        }

	        _createClass(FileUploader, {
	            addToQueue: {
	                /**
	                 * Adds items to the queue
	                 * @param {File|HTMLInputElement|Object|FileList|Array<Object>} files
	                 * @param {Object} [options]
	                 * @param {Array<Function>|String} filters
	                 */

	                value: function addToQueue(files, options, filters) {
	                    var _this = this;

	                    var list = this.isArrayLikeObject(files) ? files : [files];
	                    var arrayOfFilters = this._getFilters(filters);
	                    var count = this.queue.length;
	                    var addedFileItems = [];

	                    forEach(list, function (some /*{File|HTMLInputElement|Object}*/) {
	                        var temp = new FileLikeObject(some);

	                        if (_this._isValidFile(temp, arrayOfFilters, options)) {
	                            var fileItem = new FileItem(_this, some, options);
	                            addedFileItems.push(fileItem);
	                            _this.queue.push(fileItem);
	                            _this._onAfterAddingFile(fileItem);
	                        } else {
	                            var filter = arrayOfFilters[_this._failFilterIndex];
	                            _this._onWhenAddingFileFailed(temp, filter, options);
	                        }
	                    });

	                    if (this.queue.length !== count) {
	                        this._onAfterAddingAll(addedFileItems);
	                        this.progress = this._getTotalProgress();
	                    }

	                    this._render();
	                    if (this.autoUpload) this.uploadAll();
	                }
	            },
	            removeFromQueue: {
	                /**
	                 * Remove items from the queue. Remove last: index = -1
	                 * @param {FileItem|Number} value
	                 */

	                value: function removeFromQueue(value) {
	                    var index = this.getIndexOfItem(value);
	                    var item = this.queue[index];
	                    if (item.isUploading) item.cancel();
	                    this.queue.splice(index, 1);
	                    item._destroy();
	                    this.progress = this._getTotalProgress();
	                }
	            },
	            clearQueue: {
	                /**
	                 * Clears the queue
	                 */

	                value: function clearQueue() {
	                    while (this.queue.length) {
	                        this.queue[0].remove();
	                    }
	                    this.progress = 0;
	                }
	            },
	            uploadItem: {
	                /**
	                 * Uploads a item from the queue
	                 * @param {FileItem|Number} value
	                 */

	                value: function uploadItem(value) {
	                    var index = this.getIndexOfItem(value);
	                    var item = this.queue[index];
	                    var transport = this.isHTML5 ? "_xhrTransport" : "_iframeTransport";

	                    item._prepareToUploading();
	                    if (this.isUploading) {
	                        return;
	                    }this.isUploading = true;
	                    this[transport](item);
	                }
	            },
	            cancelItem: {
	                /**
	                 * Cancels uploading of item from the queue
	                 * @param {FileItem|Number} value
	                 */

	                value: function cancelItem(value) {
	                    var index = this.getIndexOfItem(value);
	                    var item = this.queue[index];
	                    var prop = this.isHTML5 ? "_xhr" : "_form";
	                    if (item && item.isUploading) item[prop].abort();
	                }
	            },
	            uploadAll: {
	                /**
	                 * Uploads all not uploaded items of queue
	                 */

	                value: function uploadAll() {
	                    var items = this.getNotUploadedItems().filter(function (item) {
	                        return !item.isUploading;
	                    });
	                    if (!items.length) {
	                        return;
	                    }forEach(items, function (item) {
	                        return item._prepareToUploading();
	                    });
	                    items[0].upload();
	                }
	            },
	            cancelAll: {
	                /**
	                 * Cancels all uploads
	                 */

	                value: function cancelAll() {
	                    var items = this.getNotUploadedItems();
	                    forEach(items, function (item) {
	                        return item.cancel();
	                    });
	                }
	            },
	            isFile: {
	                /**
	                 * Returns "true" if value an instance of File
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFile(value) {
	                    return this.constructor.isFile(value);
	                }
	            },
	            isFileLikeObject: {
	                /**
	                 * Returns "true" if value an instance of FileLikeObject
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFileLikeObject(value) {
	                    return this.constructor.isFileLikeObject(value);
	                }
	            },
	            isArrayLikeObject: {
	                /**
	                 * Returns "true" if value is array like object
	                 * @param {*} value
	                 * @returns {Boolean}
	                 */

	                value: function isArrayLikeObject(value) {
	                    return this.constructor.isArrayLikeObject(value);
	                }
	            },
	            getIndexOfItem: {
	                /**
	                 * Returns a index of item from the queue
	                 * @param {Item|Number} value
	                 * @returns {Number}
	                 */

	                value: function getIndexOfItem(value) {
	                    return isNumber(value) ? value : this.queue.indexOf(value);
	                }
	            },
	            getNotUploadedItems: {
	                /**
	                 * Returns not uploaded items
	                 * @returns {Array}
	                 */

	                value: function getNotUploadedItems() {
	                    return this.queue.filter(function (item) {
	                        return !item.isUploaded;
	                    });
	                }
	            },
	            getReadyItems: {
	                /**
	                 * Returns items ready for upload
	                 * @returns {Array}
	                 */

	                value: function getReadyItems() {
	                    return this.queue.filter(function (item) {
	                        return item.isReady && !item.isUploading;
	                    }).sort(function (item1, item2) {
	                        return item1.index - item2.index;
	                    });
	                }
	            },
	            destroy: {
	                /**
	                 * Destroys instance of FileUploader
	                 */

	                value: function destroy() {
	                    var _this = this;

	                    forEach(this._directives, function (key) {
	                        forEach(_this._directives[key], function (object) {
	                            object.destroy();
	                        });
	                    });
	                }
	            },
	            onAfterAddingAll: {
	                /**
	                 * Callback
	                 * @param {Array} fileItems
	                 */

	                value: function onAfterAddingAll(fileItems) {}
	            },
	            onAfterAddingFile: {
	                /**
	                 * Callback
	                 * @param {FileItem} fileItem
	                 */

	                value: function onAfterAddingFile(fileItem) {}
	            },
	            onWhenAddingFileFailed: {
	                /**
	                 * Callback
	                 * @param {File|Object} item
	                 * @param {Object} filter
	                 * @param {Object} options
	                 */

	                value: function onWhenAddingFileFailed(item, filter, options) {}
	            },
	            onBeforeUploadItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} fileItem
	                 */

	                value: function onBeforeUploadItem(fileItem) {}
	            },
	            onProgressItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} fileItem
	                 * @param {Number} progress
	                 */

	                value: function onProgressItem(fileItem, progress) {}
	            },
	            onProgressAll: {
	                /**
	                 * Callback
	                 * @param {Number} progress
	                 */

	                value: function onProgressAll(progress) {}
	            },
	            onSuccessItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onSuccessItem(item, response, status, headers) {}
	            },
	            onErrorItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onErrorItem(item, response, status, headers) {}
	            },
	            onCancelItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onCancelItem(item, response, status, headers) {}
	            },
	            onCompleteItem: {
	                /**
	                 * Callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onCompleteItem(item, response, status, headers) {}
	            },
	            onCompleteAll: {
	                /**
	                 * Callback
	                 */

	                value: function onCompleteAll() {}
	            },
	            _getTotalProgress: {
	                /**********************
	                 * PRIVATE
	                 **********************/
	                /**
	                 * Returns the total progress
	                 * @param {Number} [value]
	                 * @returns {Number}
	                 * @private
	                 */

	                value: function _getTotalProgress(value) {
	                    if (this.removeAfterUpload) {
	                        return value || 0;
	                    }var notUploaded = this.getNotUploadedItems().length;
	                    var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
	                    var ratio = 100 / this.queue.length;
	                    var current = (value || 0) * ratio / 100;

	                    return Math.round(uploaded * ratio + current);
	                }
	            },
	            _getFilters: {
	                /**
	                 * Returns array of filters
	                 * @param {Array<Function>|String} filters
	                 * @returns {Array<Function>}
	                 * @private
	                 */

	                value: function _getFilters(filters) {
	                    if (!filters) {
	                        return this.filters;
	                    }if (isArray(filters)) {
	                        return filters;
	                    }var names = filters.match(/[^\s,]+/g);
	                    return this.filters.filter(function (filter) {
	                        return names.indexOf(filter.name) !== -1;
	                    });
	                }
	            },
	            _render: {
	                /**
	                 * Updates html
	                 * @private
	                 */

	                value: function _render() {
	                    if (!$rootScope.$$phase) $rootScope.$apply();
	                }
	            },
	            _folderFilter: {
	                /**
	                 * Returns "true" if item is a file (not folder)
	                 * @param {File|FileLikeObject} item
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _folderFilter(item) {
	                    return !!(item.size || item.type);
	                }
	            },
	            _queueLimitFilter: {
	                /**
	                 * Returns "true" if the limit has not been reached
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _queueLimitFilter() {
	                    return this.queue.length < this.queueLimit;
	                }
	            },
	            _isValidFile: {
	                /**
	                 * Returns "true" if file pass all filters
	                 * @param {File|Object} file
	                 * @param {Array<Function>} filters
	                 * @param {Object} options
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _isValidFile(file, filters, options) {
	                    var _this = this;

	                    this._failFilterIndex = -1;
	                    return !filters.length ? true : filters.every(function (filter) {
	                        _this._failFilterIndex++;
	                        return filter.fn.call(_this, file, options);
	                    });
	                }
	            },
	            _isSuccessCode: {
	                /**
	                 * Checks whether upload successful
	                 * @param {Number} status
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function _isSuccessCode(status) {
	                    return status >= 200 && status < 300 || status === 304;
	                }
	            },
	            _transformResponse: {
	                /**
	                 * Transforms the server response
	                 * @param {*} response
	                 * @param {Object} headers
	                 * @returns {*}
	                 * @private
	                 */

	                value: function _transformResponse(response, headers) {
	                    var headersGetter = this._headersGetter(headers);
	                    forEach($http.defaults.transformResponse, function (transformFn) {
	                        response = transformFn(response, headersGetter);
	                    });
	                    return response;
	                }
	            },
	            _parseHeaders: {
	                /**
	                 * Parsed response headers
	                 * @param headers
	                 * @returns {Object}
	                 * @see https://github.com/angular/angular.js/blob/master/src/ng/http.js
	                 * @private
	                 */

	                value: function _parseHeaders(headers) {
	                    var parsed = {},
	                        key,
	                        val,
	                        i;

	                    if (!headers) {
	                        return parsed;
	                    }forEach(headers.split("\n"), function (line) {
	                        i = line.indexOf(":");
	                        key = line.slice(0, i).trim().toLowerCase();
	                        val = line.slice(i + 1).trim();

	                        if (key) {
	                            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
	                        }
	                    });

	                    return parsed;
	                }
	            },
	            _headersGetter: {
	                /**
	                 * Returns function that returns headers
	                 * @param {Object} parsedHeaders
	                 * @returns {Function}
	                 * @private
	                 */

	                value: function _headersGetter(parsedHeaders) {
	                    return function (name) {
	                        if (name) {
	                            return parsedHeaders[name.toLowerCase()] || null;
	                        }
	                        return parsedHeaders;
	                    };
	                }
	            },
	            _xhrTransport: {
	                /**
	                 * The XMLHttpRequest transport
	                 * @param {FileItem} item
	                 * @private
	                 */

	                value: function _xhrTransport(item) {
	                    var _this = this;

	                    var xhr = item._xhr = new XMLHttpRequest();
	                    var form = new FormData();

	                    this._onBeforeUploadItem(item);

	                    forEach(item.formData, function (obj) {
	                        forEach(obj, function (value, key) {
	                            form.append(key, value);
	                        });
	                    });

	                    if (typeof item._file.size != "number") {
	                        throw new TypeError("The file specified is no longer valid");
	                    }

	                    form.append(item.alias, item._file, item.file.name);

	                    xhr.upload.onprogress = function (event) {
	                        var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
	                        _this._onProgressItem(item, progress);
	                    };

	                    xhr.onload = function () {
	                        var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	                        var response = _this._transformResponse(xhr.response, headers);
	                        var gist = _this._isSuccessCode(xhr.status) ? "Success" : "Error";
	                        var method = "_on" + gist + "Item";
	                        _this[method](item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    xhr.onerror = function () {
	                        var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	                        var response = _this._transformResponse(xhr.response, headers);
	                        _this._onErrorItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    xhr.onabort = function () {
	                        var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	                        var response = _this._transformResponse(xhr.response, headers);
	                        _this._onCancelItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    xhr.open(item.method, item.url, true);

	                    xhr.withCredentials = item.withCredentials;

	                    forEach(item.headers, function (value, name) {
	                        xhr.setRequestHeader(name, value);
	                    });

	                    xhr.send(form);
	                    this._render();
	                }
	            },
	            _iframeTransport: {
	                /**
	                 * The IFrame transport
	                 * @param {FileItem} item
	                 * @private
	                 */

	                value: function _iframeTransport(item) {
	                    var _this = this;

	                    var form = element("<form style=\"display: none;\" />");
	                    var iframe = element("<iframe name=\"iframeTransport" + Date.now() + "\">");
	                    var input = item._input;

	                    if (item._form) item._form.replaceWith(input); // remove old form
	                    item._form = form; // save link to new form

	                    this._onBeforeUploadItem(item);

	                    input.prop("name", item.alias);

	                    forEach(item.formData, function (obj) {
	                        forEach(obj, function (value, key) {
	                            var element_ = element("<input type=\"hidden\" name=\"" + key + "\" />");
	                            element_.val(value);
	                            form.append(element_);
	                        });
	                    });

	                    form.prop({
	                        action: item.url,
	                        method: "POST",
	                        target: iframe.prop("name"),
	                        enctype: "multipart/form-data",
	                        encoding: "multipart/form-data" // old IE
	                    });

	                    iframe.bind("load", function () {
	                        var html = "";
	                        var status = 200;

	                        try {
	                            // Fix for legacy IE browsers that loads internal error page
	                            // when failed WS response received. In consequence iframe
	                            // content access denied error is thrown becouse trying to
	                            // access cross domain page. When such thing occurs notifying
	                            // with empty response object. See more info at:
	                            // http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
	                            // Note that if non standard 4xx or 5xx error code returned
	                            // from WS then response content can be accessed without error
	                            // but 'XHR' status becomes 200. In order to avoid confusion
	                            // returning response via same 'success' event handler.

	                            // fixed angular.contents() for iframes
	                            html = iframe[0].contentDocument.body.innerHTML;
	                        } catch (e) {
	                            // in case we run into the access-is-denied error or we have another error on the server side
	                            // (intentional 500,40... errors), we at least say 'something went wrong' -> 500
	                            status = 500;
	                        }

	                        var xhr = { response: html, status: status, dummy: true };
	                        var headers = {};
	                        var response = _this._transformResponse(xhr.response, headers);

	                        _this._onSuccessItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    });

	                    form.abort = function () {
	                        var xhr = { status: 0, dummy: true };
	                        var headers = {};
	                        var response;

	                        iframe.unbind("load").prop("src", "javascript:false;");
	                        form.replaceWith(input);

	                        _this._onCancelItem(item, response, xhr.status, headers);
	                        _this._onCompleteItem(item, response, xhr.status, headers);
	                    };

	                    input.after(form);
	                    form.append(input).append(iframe);

	                    form[0].submit();
	                    this._render();
	                }
	            },
	            _onWhenAddingFileFailed: {
	                /**
	                 * Inner callback
	                 * @param {File|Object} item
	                 * @param {Object} filter
	                 * @param {Object} options
	                 * @private
	                 */

	                value: function _onWhenAddingFileFailed(item, filter, options) {
	                    this.onWhenAddingFileFailed(item, filter, options);
	                }
	            },
	            _onAfterAddingFile: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 */

	                value: function _onAfterAddingFile(item) {
	                    this.onAfterAddingFile(item);
	                }
	            },
	            _onAfterAddingAll: {
	                /**
	                 * Inner callback
	                 * @param {Array<FileItem>} items
	                 */

	                value: function _onAfterAddingAll(items) {
	                    this.onAfterAddingAll(items);
	                }
	            },
	            _onBeforeUploadItem: {
	                /**
	                 *  Inner callback
	                 * @param {FileItem} item
	                 * @private
	                 */

	                value: function _onBeforeUploadItem(item) {
	                    item._onBeforeUpload();
	                    this.onBeforeUploadItem(item);
	                }
	            },
	            _onProgressItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {Number} progress
	                 * @private
	                 */

	                value: function _onProgressItem(item, progress) {
	                    var total = this._getTotalProgress(progress);
	                    this.progress = total;
	                    item._onProgress(progress);
	                    this.onProgressItem(item, progress);
	                    this.onProgressAll(total);
	                    this._render();
	                }
	            },
	            _onSuccessItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onSuccessItem(item, response, status, headers) {
	                    item._onSuccess(response, status, headers);
	                    this.onSuccessItem(item, response, status, headers);
	                }
	            },
	            _onErrorItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onErrorItem(item, response, status, headers) {
	                    item._onError(response, status, headers);
	                    this.onErrorItem(item, response, status, headers);
	                }
	            },
	            _onCancelItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onCancelItem(item, response, status, headers) {
	                    item._onCancel(response, status, headers);
	                    this.onCancelItem(item, response, status, headers);
	                }
	            },
	            _onCompleteItem: {
	                /**
	                 * Inner callback
	                 * @param {FileItem} item
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onCompleteItem(item, response, status, headers) {
	                    item._onComplete(response, status, headers);
	                    this.onCompleteItem(item, response, status, headers);

	                    var nextItem = this.getReadyItems()[0];
	                    this.isUploading = false;

	                    if (isDefined(nextItem)) {
	                        nextItem.upload();
	                        return;
	                    }

	                    this.onCompleteAll();
	                    this.progress = this._getTotalProgress();
	                    this._render();
	                }
	            }
	        }, {
	            isFile: {
	                /**********************
	                 * STATIC
	                 **********************/
	                /**
	                 * Returns "true" if value an instance of File
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFile(value) {
	                    return File && value instanceof File;
	                }
	            },
	            isFileLikeObject: {
	                /**
	                 * Returns "true" if value an instance of FileLikeObject
	                 * @param {*} value
	                 * @returns {Boolean}
	                 * @private
	                 */

	                value: function isFileLikeObject(value) {
	                    return value instanceof FileLikeObject;
	                }
	            },
	            isArrayLikeObject: {
	                /**
	                 * Returns "true" if value is array like object
	                 * @param {*} value
	                 * @returns {Boolean}
	                 */

	                value: function isArrayLikeObject(value) {
	                    return isObject(value) && "length" in value;
	                }
	            },
	            inherit: {
	                /**
	                 * Inherits a target (Class_1) by a source (Class_2)
	                 * @param {Function} target
	                 * @param {Function} source
	                 */

	                value: function inherit(target, source) {
	                    target.prototype = Object.create(source.prototype);
	                    target.prototype.constructor = target;
	                    target.super_ = source;
	                }
	            }
	        });

	        return FileUploader;
	    })();

	    /**********************
	     * PUBLIC
	     **********************/
	    /**
	     * Checks a support the html5 uploader
	     * @returns {Boolean}
	     * @readonly
	     */
	    FileUploader.prototype.isHTML5 = !!(File && FormData);
	    /**********************
	     * STATIC
	     **********************/
	    /**
	     * @borrows FileUploader.prototype.isHTML5
	     */
	    FileUploader.isHTML5 = FileUploader.prototype.isHTML5;

	    return FileUploader;
	};

	module.exports.$inject = ["fileUploaderOptions", "$rootScope", "$http", "$window", "FileLikeObject", "FileItem"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var copy = angular.copy;
	var isElement = angular.isElement;
	var isString = angular.isString;

	module.exports = function () {
	    var FileLikeObject = (function () {
	        /**
	         * Creates an instance of FileLikeObject
	         * @param {File|HTMLInputElement|Object} fileOrInput
	         * @constructor
	         */

	        function FileLikeObject(fileOrInput) {
	            _classCallCheck(this, FileLikeObject);

	            var isInput = isElement(fileOrInput);
	            var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
	            var postfix = isString(fakePathOrObject) ? "FakePath" : "Object";
	            var method = "_createFrom" + postfix;
	            this[method](fakePathOrObject);
	        }

	        _createClass(FileLikeObject, {
	            _createFromFakePath: {
	                /**
	                 * Creates file like object from fake path string
	                 * @param {String} path
	                 * @private
	                 */

	                value: function _createFromFakePath(path) {
	                    this.lastModifiedDate = null;
	                    this.size = null;
	                    this.type = "like/" + path.slice(path.lastIndexOf(".") + 1).toLowerCase();
	                    this.name = path.slice(path.lastIndexOf("/") + path.lastIndexOf("\\") + 2);
	                }
	            },
	            _createFromObject: {
	                /**
	                 * Creates file like object from object
	                 * @param {File|FileLikeObject} object
	                 * @private
	                 */

	                value: function _createFromObject(object) {
	                    this.lastModifiedDate = copy(object.lastModifiedDate);
	                    this.size = object.size;
	                    this.type = object.type;
	                    this.name = object.name;
	                }
	            }
	        });

	        return FileLikeObject;
	    })();

	    return FileLikeObject;
	};

	module.exports.$inject = [];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var copy = angular.copy;
	var extend = angular.extend;
	var element = angular.element;
	var isElement = angular.isElement;

	module.exports = function ($compile, FileLikeObject) {
	    var FileItem = (function () {
	        /**
	         * Creates an instance of FileItem
	         * @param {FileUploader} uploader
	         * @param {File|HTMLInputElement|Object} some
	         * @param {Object} options
	         * @constructor
	         */

	        function FileItem(uploader, some, options) {
	            _classCallCheck(this, FileItem);

	            var isInput = isElement(some);
	            var input = isInput ? element(some) : null;
	            var file = !isInput ? some : null;

	            extend(this, {
	                url: uploader.url,
	                alias: uploader.alias,
	                headers: copy(uploader.headers),
	                formData: copy(uploader.formData),
	                removeAfterUpload: uploader.removeAfterUpload,
	                withCredentials: uploader.withCredentials,
	                method: uploader.method
	            }, options, {
	                uploader: uploader,
	                file: new FileLikeObject(some),
	                isReady: false,
	                isUploading: false,
	                isUploaded: false,
	                isSuccess: false,
	                isCancel: false,
	                isError: false,
	                progress: 0,
	                index: null,
	                _file: file,
	                _input: input
	            });

	            if (input) this._replaceNode(input);
	        }

	        _createClass(FileItem, {
	            upload: {
	                /**********************
	                 * PUBLIC
	                 **********************/
	                /**
	                 * Uploads a FileItem
	                 */

	                value: function upload() {
	                    try {
	                        this.uploader.uploadItem(this);
	                    } catch (e) {
	                        this.uploader._onCompleteItem(this, "", 0, []);
	                        this.uploader._onErrorItem(this, "", 0, []);
	                    }
	                }
	            },
	            cancel: {
	                /**
	                 * Cancels uploading of FileItem
	                 */

	                value: function cancel() {
	                    this.uploader.cancelItem(this);
	                }
	            },
	            remove: {
	                /**
	                 * Removes a FileItem
	                 */

	                value: function remove() {
	                    this.uploader.removeFromQueue(this);
	                }
	            },
	            onBeforeUpload: {
	                /**
	                 * Callback
	                 * @private
	                 */

	                value: function onBeforeUpload() {}
	            },
	            onProgress: {
	                /**
	                 * Callback
	                 * @param {Number} progress
	                 * @private
	                 */

	                value: function onProgress(progress) {}
	            },
	            onSuccess: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onSuccess(response, status, headers) {}
	            },
	            onError: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onError(response, status, headers) {}
	            },
	            onCancel: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onCancel(response, status, headers) {}
	            },
	            onComplete: {
	                /**
	                 * Callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 */

	                value: function onComplete(response, status, headers) {}
	            },
	            _onBeforeUpload: {
	                /**********************
	                 * PRIVATE
	                 **********************/
	                /**
	                 * Inner callback
	                 */

	                value: function _onBeforeUpload() {
	                    this.isReady = true;
	                    this.isUploading = true;
	                    this.isUploaded = false;
	                    this.isSuccess = false;
	                    this.isCancel = false;
	                    this.isError = false;
	                    this.progress = 0;
	                    this.onBeforeUpload();
	                }
	            },
	            _onProgress: {
	                /**
	                 * Inner callback
	                 * @param {Number} progress
	                 * @private
	                 */

	                value: function _onProgress(progress) {
	                    this.progress = progress;
	                    this.onProgress(progress);
	                }
	            },
	            _onSuccess: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onSuccess(response, status, headers) {
	                    this.isReady = false;
	                    this.isUploading = false;
	                    this.isUploaded = true;
	                    this.isSuccess = true;
	                    this.isCancel = false;
	                    this.isError = false;
	                    this.progress = 100;
	                    this.index = null;
	                    this.onSuccess(response, status, headers);
	                }
	            },
	            _onError: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onError(response, status, headers) {
	                    this.isReady = false;
	                    this.isUploading = false;
	                    this.isUploaded = true;
	                    this.isSuccess = false;
	                    this.isCancel = false;
	                    this.isError = true;
	                    this.progress = 0;
	                    this.index = null;
	                    this.onError(response, status, headers);
	                }
	            },
	            _onCancel: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onCancel(response, status, headers) {
	                    this.isReady = false;
	                    this.isUploading = false;
	                    this.isUploaded = false;
	                    this.isSuccess = false;
	                    this.isCancel = true;
	                    this.isError = false;
	                    this.progress = 0;
	                    this.index = null;
	                    this.onCancel(response, status, headers);
	                }
	            },
	            _onComplete: {
	                /**
	                 * Inner callback
	                 * @param {*} response
	                 * @param {Number} status
	                 * @param {Object} headers
	                 * @private
	                 */

	                value: function _onComplete(response, status, headers) {
	                    this.onComplete(response, status, headers);
	                    if (this.removeAfterUpload) this.remove();
	                }
	            },
	            _destroy: {
	                /**
	                 * Destroys a FileItem
	                 */

	                value: function _destroy() {
	                    if (this._input) this._input.remove();
	                    if (this._form) this._form.remove();
	                    delete this._form;
	                    delete this._input;
	                }
	            },
	            _prepareToUploading: {
	                /**
	                 * Prepares to uploading
	                 * @private
	                 */

	                value: function _prepareToUploading() {
	                    this.index = this.index || ++this.uploader._nextIndex;
	                    this.isReady = true;
	                }
	            },
	            _replaceNode: {
	                /**
	                 * Replaces input element on his clone
	                 * @param {JQLite|jQuery} input
	                 * @private
	                 */

	                value: function _replaceNode(input) {
	                    var clone = $compile(input.clone())(input.scope());
	                    clone.prop("value", null); // FF fix
	                    input.css("display", "none");
	                    input.after(clone); // remove jquery dependency
	                }
	            }
	        });

	        return FileItem;
	    })();

	    return FileItem;
	};

	module.exports.$inject = ["$compile", "FileLikeObject"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;

	module.exports = function () {
	    var FileDirective = (function () {
	        /**
	         * Creates instance of {FileDirective} object
	         * @param {Object} options
	         * @param {Object} options.uploader
	         * @param {HTMLElement} options.element
	         * @param {Object} options.events
	         * @param {String} options.prop
	         * @constructor
	         */

	        function FileDirective(options) {
	            _classCallCheck(this, FileDirective);

	            extend(this, options);
	            this.uploader._directives[this.prop].push(this);
	            this._saveLinks();
	            this.bind();
	        }

	        _createClass(FileDirective, {
	            bind: {
	                /**
	                 * Binds events handles
	                 */

	                value: function bind() {
	                    for (var key in this.events) {
	                        var prop = this.events[key];
	                        this.element.bind(key, this[prop]);
	                    }
	                }
	            },
	            unbind: {
	                /**
	                 * Unbinds events handles
	                 */

	                value: function unbind() {
	                    for (var key in this.events) {
	                        this.element.unbind(key, this.events[key]);
	                    }
	                }
	            },
	            destroy: {
	                /**
	                 * Destroys directive
	                 */

	                value: function destroy() {
	                    var index = this.uploader._directives[this.prop].indexOf(this);
	                    this.uploader._directives[this.prop].splice(index, 1);
	                    this.unbind();
	                    // this.element = null;
	                }
	            },
	            _saveLinks: {
	                /**
	                 * Saves links to functions
	                 * @private
	                 */

	                value: function _saveLinks() {
	                    for (var key in this.events) {
	                        var prop = this.events[key];
	                        this[prop] = this[prop].bind(this);
	                    }
	                }
	            }
	        });

	        return FileDirective;
	    })();

	    /**
	     * Map of events
	     * @type {Object}
	     */
	    FileDirective.prototype.events = {};

	    return FileDirective;
	};

	module.exports.$inject = [];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;

	module.exports = function (FileDirective) {
	    var FileSelect = (function (_FileDirective) {
	        /**
	         * Creates instance of {FileSelect} object
	         * @param {Object} options
	         * @constructor
	         */

	        function FileSelect(options) {
	            _classCallCheck(this, FileSelect);

	            var extendedOptions = extend(options, {
	                // Map of events
	                events: {
	                    $destroy: "destroy",
	                    change: "onChange"
	                },
	                // Name of property inside uploader._directive object
	                prop: "select"
	            });

	            _get(Object.getPrototypeOf(FileSelect.prototype), "constructor", this).call(this, extendedOptions);

	            if (!this.uploader.isHTML5) {
	                this.element.removeAttr("multiple");
	            }
	            this.element.prop("value", null); // FF fix
	        }

	        _inherits(FileSelect, _FileDirective);

	        _createClass(FileSelect, {
	            getOptions: {
	                /**
	                 * Returns options
	                 * @return {Object|undefined}
	                 */

	                value: function getOptions() {}
	            },
	            getFilters: {
	                /**
	                 * Returns filters
	                 * @return {Array<Function>|String|undefined}
	                 */

	                value: function getFilters() {}
	            },
	            isEmptyAfterSelection: {
	                /**
	                 * If returns "true" then HTMLInputElement will be cleared
	                 * @returns {Boolean}
	                 */

	                value: function isEmptyAfterSelection() {
	                    return !!this.element.attr("multiple");
	                }
	            },
	            onChange: {
	                /**
	                 * Event handler
	                 */

	                value: function onChange() {
	                    var files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
	                    var options = this.getOptions();
	                    var filters = this.getFilters();

	                    if (!this.uploader.isHTML5) this.destroy();
	                    this.uploader.addToQueue(files, options, filters);
	                    if (this.isEmptyAfterSelection()) {
	                        this.element.prop("value", null);
	                        this.element.replaceWith(this.element = this.element.clone(true)); // IE fix
	                    }
	                }
	            }
	        });

	        return FileSelect;
	    })(FileDirective);

	    return FileSelect;
	};

	module.exports.$inject = ["FileDirective"];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;
	var forEach = angular.forEach;

	module.exports = function (FileDirective) {
	    var FileDrop = (function (_FileDirective) {
	        /**
	         * Creates instance of {FileDrop} object
	         * @param {Object} options
	         * @constructor
	         */

	        function FileDrop(options) {
	            _classCallCheck(this, FileDrop);

	            var extendedOptions = extend(options, {
	                // Map of events
	                events: {
	                    $destroy: "destroy",
	                    drop: "onDrop",
	                    dragover: "onDragOver",
	                    dragleave: "onDragLeave"
	                },
	                // Name of property inside uploader._directive object
	                prop: "drop"
	            });

	            _get(Object.getPrototypeOf(FileDrop.prototype), "constructor", this).call(this, extendedOptions);
	        }

	        _inherits(FileDrop, _FileDirective);

	        _createClass(FileDrop, {
	            getOptions: {
	                /**
	                 * Returns options
	                 * @return {Object|undefined}
	                 */

	                value: function getOptions() {}
	            },
	            getFilters: {
	                /**
	                 * Returns filters
	                 * @return {Array<Function>|String|undefined}
	                 */

	                value: function getFilters() {}
	            },
	            onDrop: {
	                /**
	                 * Event handler
	                 */

	                value: function onDrop(event) {
	                    var transfer = this._getTransfer(event);
	                    if (!transfer) {
	                        return;
	                    }var options = this.getOptions();
	                    var filters = this.getFilters();
	                    this._preventAndStop(event);
	                    forEach(this.uploader._directives.over, this._removeOverClass, this);
	                    this.uploader.addToQueue(transfer.files, options, filters);
	                }
	            },
	            onDragOver: {
	                /**
	                 * Event handler
	                 */

	                value: function onDragOver(event) {
	                    var transfer = this._getTransfer(event);
	                    if (!this._haveFiles(transfer.types)) {
	                        return;
	                    }transfer.dropEffect = "copy";
	                    this._preventAndStop(event);
	                    forEach(this.uploader._directives.over, this._addOverClass, this);
	                }
	            },
	            onDragLeave: {
	                /**
	                 * Event handler
	                 */

	                value: function onDragLeave(event) {
	                    if (event.currentTarget === this.element[0]) {
	                        return;
	                    }this._preventAndStop(event);
	                    forEach(this.uploader._directives.over, this._removeOverClass, this);
	                }
	            },
	            _getTransfer: {
	                /**
	                 * Helper
	                 */

	                value: function _getTransfer(event) {
	                    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
	                }
	            },
	            _preventAndStop: {
	                /**
	                 * Helper
	                 */

	                value: function _preventAndStop(event) {
	                    event.preventDefault();
	                    event.stopPropagation();
	                }
	            },
	            _haveFiles: {
	                /**
	                 * Returns "true" if types contains files
	                 * @param {Object} types
	                 */

	                value: function _haveFiles(types) {
	                    if (!types) {
	                        return false;
	                    }if (types.indexOf) {
	                        return types.indexOf("Files") !== -1;
	                    } else if (types.contains) {
	                        return types.contains("Files");
	                    } else {
	                        return false;
	                    }
	                }
	            },
	            _addOverClass: {
	                /**
	                 * Callback
	                 */

	                value: function _addOverClass(item) {
	                    item.addOverClass();
	                }
	            },
	            _removeOverClass: {
	                /**
	                 * Callback
	                 */

	                value: function _removeOverClass(item) {
	                    item.removeOverClass();
	                }
	            }
	        });

	        return FileDrop;
	    })(FileDirective);

	    return FileDrop;
	};

	module.exports.$inject = ["FileDirective"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var CONFIG = _interopRequire(__webpack_require__(1));

	var extend = angular.extend;

	module.exports = function (FileDirective) {
	    var FileOver = (function (_FileDirective) {
	        /**
	         * Creates instance of {FileDrop} object
	         * @param {Object} options
	         * @constructor
	         */

	        function FileOver(options) {
	            _classCallCheck(this, FileOver);

	            var extendedOptions = extend(options, {
	                // Map of events
	                events: {
	                    $destroy: "destroy"
	                },
	                // Name of property inside uploader._directive object
	                prop: "over",
	                // Over class
	                overClass: "nv-file-over"
	            });

	            _get(Object.getPrototypeOf(FileOver.prototype), "constructor", this).call(this, extendedOptions);
	        }

	        _inherits(FileOver, _FileDirective);

	        _createClass(FileOver, {
	            addOverClass: {
	                /**
	                 * Adds over class
	                 */

	                value: function addOverClass() {
	                    this.element.addClass(this.getOverClass());
	                }
	            },
	            removeOverClass: {
	                /**
	                 * Removes over class
	                 */

	                value: function removeOverClass() {
	                    this.element.removeClass(this.getOverClass());
	                }
	            },
	            getOverClass: {
	                /**
	                 * Returns over class
	                 * @returns {String}
	                 */

	                value: function getOverClass() {
	                    return this.overClass;
	                }
	            }
	        });

	        return FileOver;
	    })(FileDirective);

	    return FileOver;
	};

	module.exports.$inject = ["FileDirective"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	module.exports = function ($parse, FileUploader, FileSelect) {

	    return {
	        link: function (scope, element, attributes) {
	            var uploader = scope.$eval(attributes.uploader);

	            if (!(uploader instanceof FileUploader)) {
	                throw new TypeError("\"Uploader\" must be an instance of FileUploader");
	            }

	            var object = new FileSelect({
	                uploader: uploader,
	                element: element
	            });

	            object.getOptions = $parse(attributes.options).bind(object, scope);
	            object.getFilters = function () {
	                return attributes.filters;
	            };
	        }
	    };
	};

	module.exports.$inject = ["$parse", "FileUploader", "FileSelect"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	module.exports = function ($parse, FileUploader, FileDrop) {

	    return {
	        link: function (scope, element, attributes) {
	            var uploader = scope.$eval(attributes.uploader);

	            if (!(uploader instanceof FileUploader)) {
	                throw new TypeError("\"Uploader\" must be an instance of FileUploader");
	            }

	            if (!uploader.isHTML5) return;

	            var object = new FileDrop({
	                uploader: uploader,
	                element: element
	            });

	            object.getOptions = $parse(attributes.options).bind(object, scope);
	            object.getFilters = function () {
	                return attributes.filters;
	            };
	        }
	    };
	};

	module.exports.$inject = ["$parse", "FileUploader", "FileDrop"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var CONFIG = _interopRequire(__webpack_require__(1));

	module.exports = function (FileUploader, FileOver) {

	    return {
	        link: function (scope, element, attributes) {
	            var uploader = scope.$eval(attributes.uploader);

	            if (!(uploader instanceof FileUploader)) {
	                throw new TypeError("\"Uploader\" must be an instance of FileUploader");
	            }

	            var object = new FileOver({
	                uploader: uploader,
	                element: element
	            });

	            object.getOverClass = function () {
	                return attributes.overClass || object.overClass;
	            };
	        }
	    };
	};

	module.exports.$inject = ["FileUploader", "FileOver"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=angular-file-upload.js.map

// --Author Muragijimana Richard <beastar457@gmail.com>
// var sync = angular.module("sync", ["ngRoute","angularFileUpload","ionic","ngResource","ui.bootstrap","infinite-scroll"]);
angular.module('AuthManager',[]).service('SessionService', [function(){
    var userIsAuthenticated = false;

    this.setUserAuthenticated = function(value){
        userIsAuthenticated = value;
    };

    this.getUserAuthenticated = function(){
        return userIsAuthenticated;
    };
}]);

var sync = angular.module("sync", ["ngRoute","angularFileUpload","ui.bootstrap","ui.router","infinite-scroll",'ngMaterial', 'ngMessages', 'material.svgAssetsCache','ng-mfb','pdf','ngContextMenu','angular-loading-bar','ngFileSaver','AuthManager','ngDialog']);


var Logger=angular.module("Logger",[]);
Logger.run(['$rootScope',function($rootScope){

      // $rootScope.endPoint='https://streamupbox.com';
      $rootScope.endPoint='http://syncme.com:8000';
}]);
window.routes =
{
    "/Files": {
        url: "/Files",
        templateUrl: 'views/files.html',
        controller: 'FilesController',
        requireLogin: true
      },
      "preview":{
        url: '/!/:preview/:extension/:of/:user',
        templateUrl: 'views/filePreview.html',
        controller : 'previewController'
      },

      "/Groups": {
          url: "/Groups",
          templateUrl: 'views/groups.html',
          controller: 'GroupController',
          requireLogin: true
      }
};


sync.run(['$rootScope','$log',function($rootScope,$log){
  $rootScope.endPoint='http://syncme.com:8000';
   // $rootScope.endPoint='https://streamupbox.com';


  $rootScope.$on('$routeChangeStart',function(event, next, current){
    for(var i in window.routes) {

        if(next.indexOf(i) != -1) {
            if(window.routes[i].requireLogin && !SessionService.getUserAuthenticated()) {
                alert("You need to be authenticated to see this page!");
                event.preventDefault();
            }
        }

    }
  });
}]);
sync.provider({

    $exceptionHandler: function(){
        var handler = function(exception, cause) {
          console.log(exception);

        };

        this.$get = function() {
            return handler;
        };
    }
});
sync.config(['$sceProvider','$httpProvider','$mdThemingProvider','cfpLoadingBarProvider',function($sceProvider,$httpProvider,$mdThemingProvider,cfpLoadingBarProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    //set authorization for oauth2.0 for protection


    $httpProvider.defaults.headers.common['authorization'] = 'Bearer Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn';

    // $httpProvider.defaults.useXDomain = true;
    $sceProvider.enabled(false);

    cfpLoadingBarProvider.includeBar = false;
}]);
sync.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider,$scope){
        // $parseProvider.unwrapPromises(true) ;
          for(var path in window.routes) {

              // if(next.indexOf(path) != -1) {
              //     if(window.routes[path].requireLogin && !SessionService.getUserAuthenticated()) {
              //         alert("You need to be authenticated to see this page!");
              //         event.preventDefault();
              //     }
              // }
              $stateProvider.state(path, window.routes[path]);
          }

          $urlRouterProvider.otherwise('/Files');

}]);
//-----------------------done with Muragijimana Richard <beastar457@gmail.com>---------------//
//-----------------------deal with user's actions and interaction with other users---------------//

;(function(window, angular, undefined) {

  'use strict';

  var mfb = angular.module('ng-mfb', []);

  mfb.run(['$templateCache', function($templateCache) {
    $templateCache.put('ng-mfb-menu-default.tpl.html',
      '<ul class="mfb-component--{{position}} mfb-{{effect}}"' +
      '    data-mfb-toggle="{{togglingMethod}}" data-mfb-state="{{menuState}}">' +
      '  <li class="mfb-component__wrap">' +
      '    <a ng-click="clicked()" ng-mouseenter="hovered()" ng-mouseleave="hovered()"' +
      '       ng-attr-data-mfb-label="{{label}}" class="mfb-component__button--main">' +
      '     <i class="mfb-component__main-icon--resting {{resting}}"></i>' +
      '     <i class="mfb-component__main-icon--active {{active}}"></i>' +
      '    </a>' +
      '    <ul class="mfb-component__list" ng-transclude>' +
      '    </ul>' +
      '</li>' +
      '</ul>'
    );

    $templateCache.put('ng-mfb-menu-md.tpl.html',
      '<ul class="mfb-component--{{position}} mfb-{{effect}}"' +
      '    data-mfb-toggle="{{togglingMethod}}" data-mfb-state="{{menuState}}">' +
      '  <li class="mfb-component__wrap">' +
      '    <a ng-click="clicked()" ng-mouseenter="hovered()" ng-mouseleave="hovered()"' +
      '       style="background: transparent; box-shadow: none;"' +
      '       ng-attr-data-mfb-label="{{label}}" class="mfb-component__button--main">' +
      '     <md-button class="md-fab md-accent" aria-label={{label}} style="position:relative; margin: 0; padding:0;">' +
      '       <md-icon style="left: 0; position: relative;" md-svg-icon="{{resting}}"' +
      '         class="mfb-component__main-icon--resting"></md-icon>' +
      '       <md-icon style="position:relative;" md-svg-icon="{{active}}"' +
      '         class="mfb-component__main-icon--active"></md-icon>' +
      '     </md-button>' +
      '    </a>' +
      '    <ul class="mfb-component__list" ng-transclude>' +
      '    </ul>' +
      '</li>' +
      '</ul>'
    );

    $templateCache.put('ng-mfb-button-default.tpl.html',
      '<li>' +
      '  <a data-mfb-label="{{label}}" class="mfb-component__button--child">' +
      '    <i class="mfb-component__child-icon {{icon}}">' +
      '    </i>' +
      '  </a>' +
      '</li>'
    );

    $templateCache.put('ng-mfb-button-md.tpl.html',
      '<li>' +
      '  <a href="" data-mfb-label="{{label}}" class="mfb-component__button--child" ' +
      '     style="background: transparent; box-shadow: none;">' +
      '     <md-button style="margin: 0;" class="md-fab md-accent" aria-label={{label}}>' +
      '       <md-icon md-svg-src="img/icons/android.svg"></md-icon>' +
      '       <md-icon md-svg-icon="{{icon}}"></md-icon>' +
      '     </md-button>' +
      '  </a>' +
      '</li>'
    );
  }]);

  mfb.directive('mfbButtonClose', function() {
    return {
      restrict: 'A',
      require: '^mfbMenu',
      link: function($scope, $element, $attrs, mfbMenuController) {
        $element.bind('click', function() {
          mfbMenuController.close();
        });
      },
    };

  });

  mfb.directive('mfbMenu', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        position: '@',
        effect: '@',
        label: '@',
        resting: '@restingIcon',
        active: '@activeIcon',
        mainAction: '&',
        menuState: '=?',
        togglingMethod: '@'
      },
      templateUrl: function(elem, attrs) {
        return attrs.templateUrl || 'ng-mfb-menu-default.tpl.html';
      },
      controller: ['$scope', '$attrs', function($scope, $attrs) {
        var openState = 'open',
          closedState = 'closed';

        // Attached toggle, open and close to the controller to give other
        // directive access
        this.toggle = toggle;
        this.close = close;
        this.open = open;

        $scope.clicked = clicked;
        $scope.hovered = hovered;

        /**
         * Set the state to user-defined value. Fallback to closed if no
         * value is passed from the outside.
         */
        if (!$scope.menuState) {
          $scope.menuState = closedState;
        }

        /**
         * If on touch device AND 'hover' method is selected:
         * wait for the digest to perform and then change hover to click.
         */
        if (_isTouchDevice() && _isHoverActive()) {
          $timeout(useClick);
        }

        $attrs.$observe('menuState', function() {
          $scope.currentState = $scope.menuState;
        });

        function clicked() {
          // If there is a main action, let's fire it
          if ($scope.mainAction) {
            $scope.mainAction();
          }

          if (!_isHoverActive()) {
            toggle();
          }
        };

        function hovered() {
          if (_isHoverActive()) {
            //toggle();
          }
        };

        /**
         * Invert the current state of the menu.
         */
        function toggle() {
          if ($scope.menuState === openState) {
            close();
          } else {
            open();
          }
        }

        function open() {
          $scope.menuState = openState;
        }

        function close() {
          $scope.menuState = closedState;
        }

        /**
         * Check if we're on a touch-enabled device.
         * Requires Modernizr to run, otherwise simply returns false
         */
        function _isTouchDevice() {
          return window.Modernizr && Modernizr.touch;
        }

        function _isHoverActive() {
          return $scope.togglingMethod === 'hover';
        }

        /**
         * Convert the toggling method to 'click'.
         * This is used when 'hover' is selected by the user
         * but a touch device is enabled.
         */
        function useClick() {
          $scope.$apply(function() {
            $scope.togglingMethod = 'click';
          });
        }
      }]
    };
  }]);

  mfb.directive('mfbButton', [function() {
    return {
      require: '^mfbMenu',
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        icon: '@',
        label: '@'
      },
      templateUrl: function(elem, attrs) {
        return attrs.templateUrl || 'ng-mfb-button-default.tpl.html';
      }
    };
  }]);

})(window, angular);

sync.directive('leftMenu',function(){
  return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '='
        },
        templateUrl: "directives/leftMenu.html"
    };
});
sync.directive('feeds',function(){
  return {
        restrict: 'AE',
        scope: {
            posts: '=',
            replies: '=',
            createPost:'='
        },
        templateUrl: "directives/middleContent.html"
    };
});
sync.directive('header',function(){
  return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '='
        },
        templateUrl: "./directives/header.html"

    };
});


sync.directive('keybinding', function () {
    return {
        restrict: 'E',
        scope: {
            invoke: '&'
        },
        link: function (scope, el, attr) {
            Mousetrap.bind(attr.on, scope.invoke);
        }
    };
});

/* global $window */
/* global Logger */

Logger.controller('loginController',['$scope','$http','$rootScope','$window', function ($scope,$http,$rootScope,$window) {
    var options = {
        'crededential-not-found'       : 'Credentials not found!',
        'success'                      : 'logging in...'
    };
  $scope.login = function (info)
  {
    //before notify that we are loggingin
    $('.login-form-main-message').addClass('show success').html(options['success']);
    $http.post($rootScope.endPoint + '/sessions',info)
    .success(function(response){
        console.log(response);
        if(response ==="1"){
            Redirecting();

        }else if(response === "0"){
             $('.login-form-main-message').addClass('show error').html(options['crededential-not-found']);
        }else if(response === "notVerified"){
            notVerified();
        }
    })
    .error(function(error) {
        console.log('error:'+ error);
    })
    function notVerified(){
         $window.location.href = '/notVerified';
    }
    function Redirecting(){
        $window.location.href = '/sync';
    }
  }
}]);

Logger.controller('RegisterController', ['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
    var options = {
        'password-notMatch': 'password do not match',
        'SignUpInProgress' : 'Wait we are setting up your account.'
    };
    $scope.register=function(user){
      $('.register-form-main-message').addClass('show success').html(options['SignUpInProgress']);
        if($('#password').val() != $('#password-confirm').val()){
          $('.register-form-main-message').addClass('show error').html(options['password-notMatch']);
          setTimeout(messageRemove, 2000);
          function messageRemove(){
              $('.register-form-main-message').removeClass('show error');
          }
          return;
        }
        var username=$('#username').val();
        var email=$('#email').val();


        jQuery.post('/sessions', {username: username, password:user.password, email:email, option:user.option, phone:user.phone}, function(data, textStatus, xhr) {
            if(data == 1){
                 Redirecting();
            }else if(data ==0){
                // console.log('we are fired this can not happen');
            }
        }).error(function(error) {

            // console.log(error);
        });
        function Redirecting(){
            window.location = '/checkEmail';
        }
    }
}]);

Logger.directive('uniqueUsername', ['isUsernameAvailable',function(isUsernameAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueUsername = isUsernameAvailable;
        }
    };
}]);
Logger.factory('isUsernameAvailable', ['$q','$http','$rootScope',function($q, $http,$rootScope) {
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! Redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };
    return function(username) {

        var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?username=' + username + '&access_token=Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn').success(function(data){
            if(data=='available'){
                $('.register-form-main-message').addClass('show success').html(options['msg-username-available']);
                setTimeout(messageRemove, 2000);
                function messageRemove(){
                    $('.register-form-main-message').removeClass('show success');
                }
            }else if(data=='taken'){
                $('.register-form-main-message').addClass('show error').html(options['msg-username-taken']);
                setTimeout(usernameTaken, 2000);
                function usernameTaken(){
                    $('.register-form-main-message').removeClass('show error');
                }
            }
            deferred.reject();
        }).error(function(err) {
           deferred.resolve();
        });
        return deferred.promise;
    }
}]);
Logger.directive('uniqueEmail', ['isEmailAvailable',function(isEmailAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueEmail = isEmailAvailable;
        }
    };
}]);
Logger.factory('isEmailAvailable', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! Redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-email-available'   : 'email available',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };

    return function(email) {
         var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?email=' + email + '&access_token=Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn').success(function(data){

            if(data=='email-available'){
                $('.register-form-main-message').addClass('show success').html(options['msg-email-available']);
                setTimeout(messageRemove, 2000);
                function messageRemove(){
                    $('.register-form-main-message').removeClass('show success');
                }

            }else if(data=='email-taken'){
                $('.register-form-main-message').addClass('show error').html(options['msg-email-taken']);
                setTimeout(messageEmailTaken, 2000);
                function messageEmailTaken(){
                    $('.register-form-main-message').removeClass('show error');
                }
            }
             deferred.reject();
         }).error(function() {
            deferred.resolve();
         });
         return deferred.promise;
    };
}]);

sync.service('Files', ['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
    this.getGroupFiles =function(groupId) {
        var differed = $q.defer();
        //down endpoint return all files I own
        $http.get($rootScope.endPoint +'/api/v1/groups/'+groupId+'/groupfiles')
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(error) {
            differed.reject(error);
        })
        return differed.promise;
    };
    this.single = function(file){
      var promise = $q.defer();
      $http.get($rootScope.endPoint+ '/preview/'+ file)
      .success(function(response){
        promise.resolve(response);
      })
      .error(function(err){
        promise.reject(err);
      });
      return promise.promise;
    };
    this.getBoxFiles = function(){
        var groupId = 1;//by default this can be any number
        var differed = $q.defer();
        //the idea is to get a file either from groups or individual account group is optional
        $http.get($rootScope.endPoint + '/api/v1/groups/'+groupId+'/boxfiles')
        .success(function(response){
          differed.resolve(response);
        })
        .error(function(err){
          differed.reject(err);
        });
        return differed.promise;
    };
    this.getMimeType = function(file_name){
      var promise = $q.defer();
      $http.get($rootScope.endPoint + '/api/v1/files/mimeType/'+ file_name)
      .success(function(response){
          promise.resolve(response);
      })
      .error(function(err){
          promise.reject(err);
      });
      return promise.promise;
    };
    this.downloadFile = function(file_name){

      var promise = $q.defer();
      //hard coded a user StrimUp! need to inject him dyamically
      $http.get($rootScope.endPoint+ '/api/v1/files/download/'+file_name+'/of/'+ 'StrimUp')
      .success(function(response){
        promise.resolve(response);
      })
      .error(function(err){
        promise.reject(err);
      });
      return promise.promise;
    };
    return this;
}]);

sync.service('People', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
	this.get  = function (){
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/suggestions')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
	this.allIfollow = function () {
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/me/followings')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		})
		return differed.promise;
	}
	this.unFollow = function(id){
		var differed = $q.defer();
		$http.delete($rootScope.endPoint + '/api/v1/me/following/' +id)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		})
		return differed.promise;
	}
	this.follow = function(param){
		var differed = $q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/followings', param)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error){
			differed.reject(error);
		})
		return differed.promise;
	}
	return this;
}]);

sync.service('Share',['$log','$http','$q','$rootScope', function ($log,$http,$q,$rootScope) {
	this.share = function(sharebleObj){
		var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/share',sharebleObj)
        .success(function(response){
            differed.resolve(response);
        })
        .error(function(err){
            differed.reject(err);
        });
        return differed.promise;
	};
	this.getUser = function(user){

		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/me/users/'+ user)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
	this.fileMime = function(file){
		var differed = $q.defer();
		$http.get($rootScope.endPoint + '/api/v1/mimeType/'+ file)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		});
		return differed.promise;
	};
    return this;
}]);
sync.service('User', ['$http','$q','$rootScope',function Files ($http,$q,$rootScope) {
	this.info = function(){
		var promise = $q.defer();
		$http.get($rootScope.endPoint +"/api/v1/users/info")
		.success(function(res){
			promise.resolve(res);
		})
		.error(function() {
			promise.reject();
		});
		return promise.promise;
	};
	this.groups = function(user){
      var differed = $q.defer();
      $http.get($rootScope.endPoint + '/api/v1/me/groups')
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      })
      return differed.promise;
    }
    
	return this;
}])
/* global sync */
sync.service('Notification', ['$http', '$q', '$rootScope', function Notification($http, $q, $rootScope) {
    this.getNotification = function (user_id) {
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/notifications', {cache: false})
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            })
        return differed.promise;
    }
    this.createNotification = function (Notification) {
        var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/notifications', Notification)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    }
    this.deleteNotification = function (notification) {
        var differed = $q.defer();
        $http.delete($rootScope.endPoint + '/api/v1/notifications/' + notification)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            })
        return differed.promise;
    }

    return this;
}]);

sync.controller('notificationController', ['$scope','Notification','$log', function ($scope,Notification,$log) {
    $scope.init = function(){
        $scope.getNotification();
    }
    $scope.clearNotification = function(notification){


      Notification.clearNotification(notification)
      .then(function(response){
        //load remaining notification
        $scope.getNotification();
      },function(err){
        console.log(err);
      });
    }
    $scope.getNotification = function(){
        Notification.getNotification()
        .then(function(result){
            // $log.info(result);
            $scope.notifications = result;
            
        },function(error){
            // $log.info(error);
        });
    }
    $scope.init();
}]);
sync.directive('notify',[function(){
  return{
    restrict:'AE',
    scope:{

    },
    link: function(scope, el, iAttrs){
      setTimeout(function(){
              var title='This will be title';
              var desc='Most popular article.';
              var url='sync.com:8000';
              notifyBrowser(title,desc,url);
          }, 2000);
          document.addEventListener('DOMContentLoaded', function (){
                if (Notification.permission !== "granted"){
                  Notification.requestPermission();
            }
      });

      function notifyBrowser(title,desc,url)
      {
        if (!Notification) {
            console.log('Desktop notifications not available in your browser..');
        return;
        }
        if (Notification.permission !== "granted"){
          Notification.requestPermission();
        }
        else {
          var notification = new Notification(title, {
            icon:'https://lh3.googleusercontent.com/-aCFiK4baXX4/VjmGJojsQ_I/AAAAAAAANJg/h-sLVX1M5zA/s48-Ic42/eggsmall.png',
            body: desc,
        });
        // Remove the notification from Notification Center when clicked.
        notification.onclick = function () {
            window.open(url);
        };
        // Callback function when the notification is closed.
        notification.onclose = function () {
          console.log('Notification closed');
        };
        }
      }
    }
  }
}])

sync.factory('userInteractionNotification', function () {
    return {
        success: function (message) {
            toastr.success(message, "Success");
        },
        warn: function (message) {
            toastr.warning(message, "Hey");
        },
        info: function (message) {
            toastr.info(message, "FYI");
        },
        error: function (message) {
            toastr.error(message, "Oh No");
        }
    };
});

sync.factory('userInteractionNotification', function () {
    return {
        success: function (message) {
            toastr.success(message, "Success");
        },
        warn: function (message) {
            toastr.warning(message, "Hey");
        },
        info: function (message) {
            toastr.info(message, "FYI");
        },
        error: function (message) {
            toastr.error(message, "Oh No");
        }
    };
});


sync.controller('uploadDialogCtrl', ['$scope','$uibModal','$mdDialog','$mdMedia', function ($scope,$uibModal, $mdDialog, $mdMedia) {

				//declare global function for shortcut
				$scope.cancel = function() {
					$mdDialog.hide();
				};
		    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
		    $scope.upload = function(ev) {
		      $mdDialog.show({
						parent: angular.element(document.body),
		        controller: DialogController,
		        templateUrl: 'views/upload.tpl.html',
		        parent: angular.element(document.body),
		        targetEvent: ev,
		        clickOutsideToClose:false
		      })
		      .then(function(answer) {
		            $scope.status = 'You said the information was "' + answer + '".';
		          }, function() {
		            $scope.status = 'You cancelled the dialog.';
		          });
		    };
				function DialogController($scope, $mdDialog) {
				  $scope.hide = function() {
				    $mdDialog.hide();
				  };
				  $scope.cancel = function() {
				    $mdDialog.cancel();
				  };
				  $scope.answer = function(answer) {
				    $mdDialog.hide(answer);
				  };
				}
				DialogController.$inject = ["$scope", "$mdDialog"];
}]);
sync.controller('shareController', ['$scope','$uibModal','$mdDialog','$mdMedia','urlShortener','Share','User', function ($scope,$uibModal, $mdDialog, $mdMedia,urlShortener,Share,User) {

	//declare global function for shortcut
	$scope.cancel = function() {
		$mdDialog.hide();
	};
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	$scope.share = function(ev,fileName) {

		$mdDialog.show({
			parent: angular.element(document.body),
			controller: DialogController,
			templateUrl: 'views/share.tpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false
		})
		.then(function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					$scope.status = 'You cancelled the dialog.';
				});
				function DialogController($scope, $mdDialog) {
					// console.log('sharedFile'+ fileName);
					$scope.getFile = function(){
						return $scope.file=urlShortener.makeShort(fileName);
					};
					$scope.hide = function() {
						$mdDialog.hide();
					};
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
					$scope.answer = function(answer) {
						$mdDialog.hide(answer);
					};
				}
				DialogController.$inject = ["$scope", "$mdDialog"];

	};



	$scope.shareFile = function(vm){

		var emails=vm.emails;
		var email_array = emails.split(',');
		var i;
		for ( i=0; i < email_array.length; i++ ) {
			//validate each email to share with
			Share.share(vm)
			.then(function(res){
				console.log(res);
			}).catch();
			// console.log(email_array[i]);

		}
	}

}]);

/* global sync */
/**
 *  Created by Muragijimana Richard on 10/20/15.
 *  Beastar457@gmail.com , sync@gmail.com , check with me!
 */
/*I use CamelCase while renaming my functions */
/*and i use snake case while renaming variables */
/*post service */

sync.service('Post', ['$http', '$q', '$rootScope', function Post($http, $q, $rootScope) {
    this.getPost = function (user_id) {
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/me/posts?user_id' + user_id, {cache: false})
            .success(function (response) {

                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.participate = function(obj){
      var differed = $q.defer();
      $http.put($rootScope.endPoint + '/api/v1/me/posts/',obj)
      .success(function(response){
        differed.resolve(response);
      })
      .error(function(err){
        differed.reject(err);
      });
      return differed.promise;
    };
    this.createPost = function (post) {
        var differed = $q.defer();
        $http.post($rootScope.endPoint + '/api/v1/me/posts', post)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    this.deletePost = function (id) {
        var differed = $q.defer();
        $http.delete($rootScope.endPoint + '/api/v1/me/posts/' + id)
            .success(function (response) {
                differed.resolve(response);
            })
            .error(function (error) {
                differed.reject(error);
            });
        return differed.promise;
    };
    return this;
}]);

sync.controller('PostingController', [
  '$scope',
  'Post',
  '$timeout',
  'User',
  '$interval',
  'Notification',
  // '$ionicListDelegate',
  '$log',
  'userInteractionNotification',
  function (
  $scope,
  Post,
  $timeout,
  User,
  $interval,
  Notification,
  $ionicListDelegate,
  $log,
  userInteractionNotification
) {

    $scope.init = function () {
        $scope.postLoader();
        $scope.getUser();

    };

    $interval(function () {
        $scope.postLoader();
    }, 8000);
    $scope.getUser =function(){

      User._id()
      .then(function(response){

        $scope.user = response;
        console.log(response);
      },function(err){
        //quit slintly
      });
    };
    $scope.loadMore = function(){

    };
    $scope.participateIntoPost = function(post,user){
      // console.log(user);
      var obj ={
        'post_id':post,
        'user_id':user
      };
      Post.participate(obj)
      .then(function(response){
        $scope.postLoader();
      },function(err){
        //quit slently

      });
    };
    $scope.postLoader = function () {
        $scope.dataLoading = true;
        Post.getPost()
            .then(function (tree) {

                $scope.posts =tree;
                //navigate trough tree response which is require much attention
                $scope.friends=[];
                $scope.replies=[];
                for (var i = 0; i < tree.length; i++) {
                    if (tree[i].hasOwnProperty('friends') && tree[i]['replies']  && tree[i]['friends'] ) {
                      $scope.friends.push(tree[i].friends);
                      $scope.replies.push(tree[i].replies);
                    } else if (tree[i].hasOwnProperty('friends')) {
                        $scope.friends = friends.concat(traverse(tree[i].friends));
                        $scope.replies = replies.concat(traverse(tree[i].replies));
                    }
                }
            }, function (error) {
        });
    };
    $scope.imageDesc = function(index){
      //show images with different pixel
      switch (index) {
        case 0:
          return '60px';

          case 1:
            return "60px";

          case 2:
            return "60px";

          case 3:
            return "60px";

          case 4:
            return "60px";

        default:
        return "60px";

      }
      console.log(index);
    };
    $scope.share = function(id){
        $ionicListDelegate.closeOptionButtons();
        $log.info(id);
    };
    $scope.createPost = function (posting) {
      //if image is uploaded uploaded
        var _this = { message: posting };
        Post.createPost(_this)
            .then(function (postCreated) {
                  $scope.message = '';
                  $scope.posts.push(postCreated);
                  userInteractionNotification.success("New Post feed created!");
            }, function (error) {

            });
    };

    $scope.init();
}]);
sync.directive('feedsUploader',[function(){
  return {
    restrict: 'AE',
    replace: false,
    templateUrl: 'App/js/scripts/views/feedAttachment.html',
    scope: {
      action: '@'
    },
    controller: ['$scope', function ($scope) {
      $scope.progress = 0;
      $scope.avatar = '';
      $scope.sendFile = function(el) {
        var $form = $(el).parents('form');
        if ($(el).val() === '') {
          return false;
        }
        $form.attr('action', $scope.action);
        $scope.$apply(function() {
          $scope.progress = 0;
        });
        $form.ajaxSubmit({
          type: 'POST',
        	beforeSend: function (xhr) {
        		xhr.setRequestHeader('authorization', 'Bearer OqFirQS44RQTjRuWniXjdHZJQXdCuEx49rq8JY5A');
        	},
          uploadProgress: function(evt, pos, tot, percComplete) {
            $scope.$apply(function() {
              // upload the progress bar during the upload
              // $scope.progress = percentComplete;
            });
          },
          error: function(evt, statusText, response, form) {
            // remove the action attribute from the form
            $form.removeAttr('action');
          },
          success: function(response, status, xhr, form) {
            var ar = $(el).val().split('\\'),
              filename =  ar[ar.length-1];
            // remove the action attribute from the form
            $form.removeAttr('action');
            $scope.$apply(function() {
              $scope.avatar = filename;
            });
          },
        });
      };
    }],
    link: function(scope, elem, attrs, ctrl) {

      elem.find('.fake-uploader').click(function() {
        elem.find('input[type="file"]').click();
      });

    }
  };
}]);

/* global $uibModalInstance */
/* global ModalInstanceCtrl */
/* global $uibModal */
/* global sync */
/* global sync */
sync.controller('FilesController',
 [
	'$scope','Files','$log','$window','User','$uibModal','$interval','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler', function (
		$scope, Files,$log,$window,User,$uibModal,$interval,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler) {

	  $scope.init = function(){
      //load all box files
		    $scope.all();
	  };


	  // $interval(function () {
			// $scope.all();
   //  }, 8000);


	 $scope.all = function(){
    $scope.dataLoading = true;
		Files.getBoxFiles()
			.then(function(res){
				$scope.files 	=	res;

			}, function(error){
				// console.log(error);
			})
      .finally(function () {
          $scope.dataLoading = false;
     });
	 };
  $scope.fileType  = function(type) {

      switch (type) {
        case 'pdf':
          return 'img/pdf.png';
          break;
        case 'folder':
          return 'img/universal_folder.png';
          break;
        case 'folder+':
          return 'img/Add_folder.png';
          break;
        case 'php':
          return 'img/code.png';
          break;
        case 'txt':
        return 'img/code.png';
        break;
        case 'docx':
          return 'img/word.png';
        case 'jpg':
          return 'fa fa-image';
          break;
        case 'png':
          return 'img/video.png';
          break;
        case 'jpeg':
            return 'img/universal_folder.png';
          break;
        case 'zip':
         return 'img/zip.png';
         break;
        default:
        return 'img/universal_folder.png';
      }
  };

	$scope.init();
}]);

sync.directive('draggable', function() {

     return {
        restrict: 'AE',
        link: function (scope, element, attr) {
           var el = element[0];

            el.draggable = true;

            el.addEventListener(
                'dragstart',
                function(e) {
                  // console.log('drag event started');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('Text', this.id);
                    this.classList.add('drag');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragend',
                function(e) {
                    // console.log('drag event released');
                    this.classList.remove('drag');
                    return false;
                },
                false
            );
        }
    };
});

sync.directive('droppable', ['userInteractionNotification','Files',function(userInteractionNotification,Files) {
    return {
        scope: {
            drop: '&',
            bin: '='// parent
        },
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];
            el.addEventListener(
              'dragover',
              function(e) {
                  e.dataTransfer.dropEffect = 'move';
                  // allows us to drop
                  
                  if (e.preventDefault) e.preventDefault();
                  this.classList.add('over');
                  return false;
              },
              false
          );
           el.addEventListener(
              'dragenter',
              function(e) {
                  this.classList.add('over');
                  return false;
              },
              false
          );

          el.addEventListener(
              'dragleave',
              function(e) {
                  this.classList.remove('over');
                  return false;
              },
              false
          ); 
          el.addEventListener(
            'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove('over');

                    var binId = this.id;
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    // console.log('Item now is:'+item);
                    
                    
                    try{
                      // call the passed drop function
                        this.appendChild(item);
                        scope.$apply(function(scope) {
                            var fn = scope.drop();
                            if ('undefined' !== typeof fn) {
                              fn(item.id, binId);
                            }
                        });

                        return false;
                    }catch(e){
                      //throw error that happen when file is dropped in it's own location
                      //give some alert to notify what happned
                      // throw( new Error(e))
                      // userInteractionNotification.error("Drop File on folder to move it!");
                    }
                    
                },
                false
        );
        }
    }
}]);
sync.controller('DragDropCtrl', ['$scope','Files','$interval',function($scope,Files,$interval) {

  
    $scope.handleDrop = function() {
      // 1)if moved only when it reach on folder allow move
      // 2)take th id of file moved and take id of folder move file into folder

       //move the item into where it is droped
       //the first thing here is to recalculate the array to keep the arrangement intact
       
        
    }
}]);

sync.controller('previewController',
 [
	'$scope','pdfDelegate','$timeout','$stateParams','$rootScope','$exceptionHandler','Files', 'FileSaver','Blob',function (
		$scope,pdfDelegate,$timeout,$stateParams,$rootScope,$exceptionHandler,Files,FileSaver, Blob) {

      //get mime type of anyFile that comes in my hood!

      

      if($stateParams.preview && $stateParams.extension == 'pdf'){
        $scope.previewable = true;
        try {
            //a user StrimUp is injected in bellow url it should be dynamic in future!
            $scope.pdfUrl = $rootScope.endPoint+ '/preview/'+ $stateParams.preview+'/of/'+'StrimUp';

            $timeout(function() {
                pdfDelegate.$getByHandle('my-pdf-container').zoomIn(0.5);
            }, 3000);
        } catch (e) {

           throw( new Error(e))
        }
      }else if($stateParams.preview && $stateParams.extension == 'jpg'||$stateParams.extension == 'png'){
        $scope.file_name = $stateParams.preview;
        $scope.previewable = false;
        //as by now images are not ready to be previewed so set it to false!provide only option to download them!
          // $scope.previewable = false;
          // Files.single($stateParams.preview)
          // .then(function(response){
          //   $scope.imagePreview = response;
          // },function(err){
          //   console.log(err);
          // });
      }else {
        //send a filename to a download button
        $scope.file_name = $stateParams.preview;
        $scope.previewable = false;
      }

      $scope.goNext = function() {
          $scope.increment = 1;
          pdfDelegate.$getByHandle('my-pdf-container').next($scope.increment+1);
      };
      //this option down here of downloading a file was nice but still have some drowback

      // $scope.download = function(file_name){

      //   Files.downloadFile(file_name)
      //   .then(function(file_writen){
            
      //     Files.getMimeType($stateParams.preview)
      //       .then(function(mimeType){

      //         var blob = new Blob([file_writen], {
      //             type: mimeType,
      //         });
      //         FileSaver.saveAs(blob, $stateParams.preview);

      //       },function(err){
      //         console.log(err);
      //       });

          

      //   },function(err){
      //     console.log(err);
      //   });
      // };
      $scope.goPrev = function(page){
          pdfDelegate.$getByHandle('my-pdf-container').prev($scope.increment-1);
      };
}]);

sync.directive('fileDownload', [function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<button class="btn btn-default" data-ng-click="download()"><span class=""></span>Download</button>',
            controller: ['$rootScope', '$scope', '$element', '$attrs', '$timeout', function ($rootScope, $scope, $element, $attrs, $timeout) {
                $scope.progress = 0;

                function prepare(url) {
                    // dialogs.wait("Please wait", "Your download starts in a few seconds.", $scope.progress);
                    fakeProgress();
                }
                function success(url) {
                    $rootScope.$broadcast('dialogs.wait.complete');
                }
                function error(response, url) {
                    // dialogs.error("Couldn't process your download!");
                }

                function fakeProgress() {
                    $timeout(function () {
                        if ($scope.progress < 95) {
                            $scope.progress += (96 - $scope.progress) / 2;
                            // $rootScope.$broadcast('dialogs.wait.progress', { 'progress': $scope.progress });
                            fakeProgress();
                        }
                    }, 250);
                }

                $scope.download = function () {
                    $scope.progress = 0;
                    $.fileDownload('http://syncme.com:8000/api/v1/files/download/phpxFnlheDVE5j5mcVDX.png/of/StrimUp?access_token=Bc7DWS7KKRLtxmddUZI1T1lZu2J1YhR8OLXGWNZn', { prepareCallback: prepare, successCallback: success, failCallback: error });
                }
            }]
        }
}]);

/* global sync */
"use strict";
sync.controller('PeopleController', ['$scope','People',function ($scope, People) {
		$scope.init = function(){
			$scope.getPeopleToFollow();
		}
		$scope.getPeopleToFollow  = function(){
			People.get()
			.then(function(response){
				
				$scope.people = response;
			}, function(error){

			})
		}
		$scope.$on('followMember',function(event,params){
			event.preventDefault();
			People.follow(params)
			.then(function(response){
				//console.log(response);
				$scope.getPeopleToFollow();
			},function(error){
				console.log(error);
			})
		});
		$scope.follow = function(id){
			var follow ={id: id, option:'addPeople'};
			$scope.$emit("followMember", follow);
		}
		$scope.init();
}]);

/* global Files */
/* global sync */
/* global $scope */
/* global angular */
/*Author Muragijimana Founder & CEO of sync call him on StrimUp@gmail.com*/

sync.service('Group', [
	'$http',
	'$rootScope',
	'$q',function Group (
		$http,
		$rootScope,
		$q) {
	this.create 		=	function(name){
		var differed 	=	$q.defer();
		$http.post($rootScope.endPoint + '/api/v1/me/groups', name)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
	this.delete 		=	function(id){
		var differed 	=	$q.defer();
		$http.delete($rootScope.endPoint + '/api/v1/me/groups/'+id)
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
	this.myGroups		=	function(){
		var differed 	=	$q.defer();

		$http.get($rootScope.endPoint + '/api/v1/me/groups')
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			console.log('differed slow:' + error);
			differed.reject(error);
		})
		return differed.promise;
	}

	this.addPeople 	=	function(member){
		var differed 	=	$q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/groups/'+JSON.stringify(member))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.resolve(error);
		})
		return differed.promise;
	};
	this.addFileToGroup = function(fileObj){
		var differed = $q.defer();
		$http.put($rootScope.endPoint + '/api/v1/me/groups/'+ JSON.stringify(fileObj))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(err){
			differed.reject(err);
		})
		return differed.promise;
	}
	this.removePeople 	=	function(member){
		var differed 	=	$q.defer();
		$http.put($rootScope.endPoint +'/api/v1/me/groups/'+JSON.stringify(member))
		.success(function(response){
			differed.resolve(response);
		})
		.error(function(error) {
			differed.reject(error);
		})
		return differed.promise;
	}
  this.suggestPeople = function(id){

    	var differed = $q.defer();
    	$http.get($rootScope.endPoint + '/api/v1/me/groups/' + id)
    	.success(function(res){
    		differed.resolve(res);
    	})
    	.error(function(err) {
    		differed.reject(err);
    	})
    	return differed.promise;
    }
	return this;
}]);

sync.controller('GroupController', [
	'$scope',
	'Group',
	'User',
	'Files',
	'userInteractionNotification',
	function GroupController (
		$scope,
		Group,
		User,
		Files,
		userInteractionNotification
	) {
	$scope.init 	=	function(){
		$scope.myGroups();

		$scope.suggestedPeopleToGroup();//ofcause they are arleady your friend but not participant in your stuff work!
	}
	$scope.userId 				=	function(){
		User._id()
		.then(function(response){
			$scope.userId 	=	response;
		}, function(error){
			console.log(error);
		});
	};
	$scope.myGroups 			=	function(){
		Group.myGroups()
		.then(function(response){
			$scope.group 	= response;
		}, function(error){
		});
	};
	$scope.suggestedPeopleToGroup 	=	function(id){
		//clearing all view rendered before
		$scope.showFiles=false;
		$scope.showGroup=false;
		$scope.showBox=false;
		if(!angular.isUndefined(id)){
			Group.suggestPeople(id).then(function(response){
				// console.log(response);
				$scope.followers = response;
			}, function(error){
				console.log(error);
			});
		}
	};
	$scope.$on('refreshGroup',function(){
       $scope.init();
  	});
	$scope.$on('groupDeleted', function (event, args) {
		event.preventDefault();
		$scope.myGroups();
	});
	$scope.$on('groupTobindwith', function (event, groupid) {
		event.preventDefault();
        $scope.emitted =groupid;
        if( $scope.showFiles == true){
            $scope.showFiles=false;
        }
        $scope.suggestedPeopleToGroup(groupid);
        $scope.addPeople=true;
	});
	$scope.getGroupFiles = function(owner){
    Files.getGroupFiles(owner)
		.then(function(tree){
			$scope.files = tree;
				//navigate trough tree response which is require much attention
				$scope.groups=[];
				for (var i = 0; i < tree.length; i++) {
						if (tree[i].hasOwnProperty('groups') && tree[i]['groups']) {
								$scope.groups.push(tree[i].friends);
						} else if (tree[i].hasOwnProperty('groups')) {
								$scope.groups = groups.concat(traverse(tree[i].groups));
						}
				}
		}, function(error){
			console.log(error);
		});
  };
	$scope.getBoxFiles = function(groupId){
		$scope.emitted =groupId;
  	Files.getBoxFiles(groupId)
		.then(function(tree){
			$scope.files = tree;
				//navigate trough tree response which is require much attention
				$scope.groups=[];
				for (var i = 0; i < tree.length; i++) {
						if (tree[i].hasOwnProperty('groups') && tree[i]['groups']) {
								$scope.groups.push(tree[i].friends);
						} else if (tree[i].hasOwnProperty('groups')) {
				            $scope.groups = groups.concat(traverse(tree[i].groups));
						}
				}
		}, function(error){
			console.log(error);
		});
  };
$scope.$on('showOptions',function(_,params){
     if(params.owner ==="box"){
			 $scope.addPeople=false;
			 $scope.showGroup=false;
       $scope.showBox=true;
       if( $scope.addPeople == true){
           $scope.addPeople=false;
       }
			 //set files scope to show files of box files is repeated in view directive
       $scope.getBoxFiles (params.group_id);
		 }else if (params.owner === "group") {
			 $scope.showBox=false;
			 $scope.addPeople=false;
			 $scope.showGroup=true;
			 if( $scope.addPeople == true){
					 $scope.addPeople=false;
			 }
			 //change files to new scope files to show files of groups  is repeated in view directive
			 $scope.getGroupFiles (params.group_id);
		 }
});
$scope.init();
}]);
sync.directive('myGroups', [
	'Group',
	'Report',
	'userInteractionNotification',
	function myGroups (
		Group,
		Report,
		userInteractionNotification,
		Notification) {
	return {
		priority: 10,
		templateUrl: 'App/scripts/js/directives/groups.html',
		restrict: 'E',
		scope: {
			  id: '=userId',
          groups: '=',
          followers: '=',
          emitted:'=',
          showPeople:'=',
          showGroup   :  '=',
          files   :  '=',
	  			showBox:  '='
		},
		link: function (scope, iElement, iAttrs) {
			scope.deleteGroup = function(id){
				Group.delete(id)
				.then(function(res){
						userInteractionNotification.info("Group deleted");
					 	scope.$emit("groupDeleted", 'group deleted');
				}, function(err){
					Report.send('delete group error:'+err)
					.then(function(){}, function(){});
				})
			};
      scope.createGroup	=	function(name){
          Group.create(name)
                  .then(function(response){
											userInteractionNotification.success("Created new Group");
                      scope.$emit('refreshGroup',null);
                  }, function(error){
                      console.log(error);
                  });
              };
			scope.initAddPeople = function(groupid){
				scope.$emit("groupTobindwith", groupid);
			};

			scope.addPeople = function(params){
				var newParams ={
					'option':'addMember',
					'userId':params.userId,
					'groupId':params.groupId
				}
				if(angular.isUndefined(params)){
					//won't happen!or if ti happen we quit
				}else{

					Group.addPeople(newParams)
					.then(function (response){
						//refresh group with new member status
							userInteractionNotification.success("Added Member in group.");
              scope.initAddPeople(params.groupId);
              scope.$emit('refreshGroup','');
              console.log(response);
					}, function (error,status){
              console.log(error);
					});
				}
			}
			scope.removePeople = function(params){

				var newParams ={
					'option':'removeMember',
					'userId':params.userId,
					'groupId':params.groupId
				}

				if(angular.isUndefined(params)){
					//won't happen!or if ti happen we quit too bad hierachy!
				}else{
				Group.removePeople(newParams)
					.then(function (response){
							userInteractionNotification.info("Removed Member in group.");
	            scope.initAddPeople(params.groupId);
	            scope.$emit('refreshGroup','');
            	console.log(response);
					}, function (error,status){
              console.log(error);
					});
				}
			};
			scope.removeFromGroup = function(){
				console.log('we can remove file in group');
			}
			scope.addFileToGroup = function(params){
				var fileObj ={
					'option':'addFiles',
					'fileId':params.fileId,
					'groupId':params.groupId
				}

				Group.addFileToGroup(fileObj)
				.then(function(response){
					console.log(response);
					// userInteractionNotification.success("A file is added in group");
				},function(err){
					userInteractionNotification.warn("Some error occured during adding file");
				})

			}
			scope.filesInBox = function(groupid){
				var params ={'group_id':groupid,'owner':'box'};
				scope.$emit('showOptions',params);

			}
			scope.filesInGroup = function(groupid){

				var params ={'group_id':groupid,'owner':'group'};
				scope.$emit('showOptions',params);
			}
		}
	};
}]);

sync.service('Report', [function Report ($http,$q,$rootScope) {
	this.send = function(issue){
		var differed = $q.defer();
		$http.post($rootScope.endPoint + '/api/v1/issues', issue)
		.success(function(res){
			differed.resolve(res);
		})
		.error(function(err) {
			differed.reject(err);
		})
		return differed.promise;
	}
	return this;
}]);

/* global sync */
sync.service('Settings', ['$http','$rootScope','$q',function ($http,$rootScope,$q) {
	this.current = function(){
        var differed = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/settings')
        .success(function(resp){
            differed.resolve(resp);
        })
        .error(function(err){
            differed.reject(err);
        })
        return differed.promise;
    }
    return this;
}]);

sync.controller('SettingsController', ['$scope','Settings','$log', function ($scope,Settings,$log) {
	$scope.init = function(){
        $scope.loadCurrentSettings();
    }
     $scope.loadCurrentSettings = function(){
         Settings.current().then(function(resp){
             $scope.settings = resp;
         }, function(err){
             $log.info('errror prevent promise to be fullfill');
         });
     }
     $scope.init();
}]);

/* global sync */
sync.controller('ShareController', [
	'$scope',
	'$rootScope',
	'$routeParams',
	'$route',
	'$log',
	'$uibModal',
	'Share',
	'User',
	function (
		$scope,
		$rootScope,
		$routeParams,
		$route,
		$log,
		$uibModal,
		Share,
		User
	) 
{

	$scope.share = function(file_id){
		// alert('here');
		console.log(file_id);
	};
}
]);

/* global sync */
/* global angular */
'use strict';

angular

    sync.controller('UploadController', ['$scope', 'FileUploader','$rootScope','Files', function($scope, FileUploader,$rootScope,Files) {
        var uploader = $scope.uploader = new FileUploader({
            url: $rootScope.endPoint+'/api/v1/upload'
        });
        //FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        //CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
          Files.getBoxFiles()
            .then(function(res){
              $scope.files 	=	res;

            }, function(error){
              console.log(error);
            })
            .finally(function () {
                $scope.dataLoading = false;
           });
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);
    }]);

sync.service('urlShortener',[function(){
  this.makeShort = function(longUrl){
    return longUrl;
  };
  // this.makeShort = function(longUrl)
  // {
  //   //  var longUrl=document.getElementById("longurl").value;
  //     var request = gapi.client.urlshortener.url.insert({
  //     'resource': {
  //       'longUrl': longUrl
  // 	}
  //     });
  //     request.execute(function(response)
  // 	{
  //
  // 		if(response.id != null)
  // 		{
  // 			str ="<b>Long URL:</b>"+longUrl+"<br>";
  // 			str +="<b>your File is:</b> <a href='"+response.id+"'>"+response.id+"</a><br>";
  // 			return str;
  // 		}
  // 		else
  // 		{
  // 			console.log("error: unable to create short url");
  // 		}
  //
  //     });
  //  }
  //
  // this.getShortInfo = function()
  //  {
  //      var shortUrl=document.getElementById("shorturl").value;
  //
  //      var request = gapi.client.urlshortener.url.get({
  //        'shortUrl': shortUrl,
  //  	     'projection':'FULL'
  //      });
  //      request.execute(function(response)
  //  	{
  //  		if(response.longUrl!= null)
  //  		{
  //  			str ="<b>Long URL:</b>"+response.longUrl+"<br>";
  //  			str +="<b>Create On:</b>"+response.created+"<br>";
  //  			document.getElementById("output").innerHTML = str;
  //  		}
  //  		else
  //  		{
  //  			console.log("error: unable to get URL information");
  //  		}
  //
  //      });
  //
  //  }
  //  function load()
  //  {
  //  	gapi.client.setApiKey('AIzaSyDSn7z7V1f6H3yXrgAlgVGw52dSEmqALIc'); //get your ownn Browser API KEY
  //  	gapi.client.load('urlshortener', 'v1',function(){});
  //  }
  //  window.onload = load;
}]);

  //
  // (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  // (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  // m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  // })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  //
  // ga('create', 'UA-64955866-2', 'auto');
  // ga('send', 'pageview');

        //this function can remove an array element.
            Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
            var total_popups = 0;
            var popups = [];
            function close_popup(id)
            {
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);

                        document.getElementById(id).style.display = "none";

                        calculate_popups();

                        return;
                    }
                }
            }

            //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
            function display_popups()
            {
                var right = 220;

                var iii = 0;
                for(iii; iii < total_popups; iii++)
                {
                    if(popups[iii] != undefined)
                    {
                        var element = document.getElementById(popups[iii]);
                        element.style.right = right + "px";
                        right = right + 320;
                        element.style.display = "block";
                    }
                }

                for(var jjj = iii; jjj < popups.length; jjj++)
                {
                    var element = document.getElementById(popups[jjj]);
                    element.style.display = "none";
                }
            }
             /*
                this script has been added by me for my custome

                */
                $(document).ready(function() {
                    $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                    });


                    $("#chat").keypress(function(evt) {
                        if(evt.which == 13) {
                            alert("we are listning to enter event");
                                var iusername = $('#shout_username').val();
                                var imessage = $('#shout_message').val();
                                post_data = {'username':iusername, 'message':imessage};

                                //send data to "shout.php" using jQuery $.post()
                                $.post('shout.php', post_data, function(data) {

                                    //append data into messagebox with jQuery fade effect!
                                    $(data).hide().appendTo('.message_box').fadeIn();

                                    //keep scrolled to bottom of chat!
                                    var scrolltoh = $('.message_box')[0].scrollHeight;
                                    $('.message_box').scrollTop(scrolltoh);

                                    //reset value of message box
                                    $('#shout_message').val('');

                                }).fail(function(err) {

                                //alert HTTP server error
                                alert(err.statusText);
                                });
                            }
                    });

                    //toggle hide/show shout box
                    $(".close_btn").click(function (e) {
                        //get CSS display state of .toggle_chat element
                        var toggleState = $('.toggle_chat').css('display');

                        //toggle show/hide chat box
                        $('.toggle_chat').slideToggle();

                        //use toggleState var to change close/open icon image
                        if(toggleState == 'block')
                        {
                            $(".header div").attr('class', 'open_btn');
                        }else{
                            $(".header div").attr('class', 'close_btn');
                        }


                    });
                });
                /*done adding my custom scripts*/
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(id, name)
            {

                for(var iii = 0; iii < popups.length; iii++)
                {
                    //already registered. Bring it to front.
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);

                        popups.unshift(id);

                        calculate_popups();


                        return;
                    }
                }

                var element='<div class="popup-box chat-popup" id="'+ id +'">';
                    element =element + '<div style="background:#ddd;color:#fff;" class="header">Group<div class="close_btn">&nbsp;</div></div>';
                    element =element + ' <div class="toggle_chat">';
                    element =element + '<div class="message_box"></div>';
                    element =element + '<textarea style="background:white;margin-top:180px;" id="chat" class="form-control" rows="3" required="required"></textarea>';
                    // element =element +
                    // element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
                // var element = '<div class="popup-box chat-popup" id="'+ id +'">';
                // element = element + '<div class="popup-head">';
                // element = element + '<div class="popup-head-left">'+ name +'</div>';
                // element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
                // element = element + '<div style="clear: both;"></div></div><p onclick="t()" id="m"></p><div class="popup-messages"><textarea  class="top"></textarea></div></div>';

                document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;

                popups.unshift(id);

                calculate_popups();

            }

            //calculate the total number of popups suitable and then populate the toatal_popups variable.
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540)
                {
                    total_popups = 0;
                }
                else
                {
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }

                display_popups();

            }

            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);
//Author Muragijimana Richard strimup@gmail.com beastar457@gmail.com

  sync.controller('MessageController', ["$http", "$scope", "$q", "$rootScope", function ($http,$scope,$q,$rootScope) {
       $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
      
         $scope.name="Muragijimana";
         var posts=$http.get($rootScope.endPoint + '/api/v1/post'),
             institutions=$http.get($rootScope.endPoint + '/api/v1/post');

          $q.all([posts,institutions]).then(function(result) {
            var tmp = [];
            angular.forEach(result, function(response) {
              tmp.push(response.data);
            });
            return tmp;
          }).then(function(tmpResult) {
              // posts=tmpResult;
              // console.log(angular.toJson(tmpResult[0], true));
            $scope.posts = tmpResult[0];
          });
         $('.post-in').atwho({
            at: "@",
            data:['Peter', 'Tom', 'Anne'],

         });

  }]);


sync.controller("TutorialModal", ["$scope", function($scope) {

  $scope.open = function() {
    $scope.showModal = true;
  };
  $scope.ok = function() {
    $scope.showModal = false;
  };

  $scope.cancel = function() {
    $scope.showModal = false;
  };

}]);

sync.controller("StriminModal", ["$scope", function($scope) {

  $scope.open = function() {
    $scope.showModal = true;
  };
  $scope.ok = function() {
    $scope.showModal = false;
  };

  $scope.cancel = function() {
    $scope.showModal = false;
  };

}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXItdXBsb2FkLmpzIiwiYXBwQ29uZmlnLmpzIiwiYnV0dG9uLmpzIiwiZGlyZWN0aXZlcy5qcyIsImxvZ2luQ29udHJvbGxlci5qcyIsInJlZ2lzdGVyQ29udHJvbGxlci5qcyIsImNvbW1vbi9GaWxlU2VydmljZS5qcyIsImNvbW1vbi9QZW9wbGVTZXJ2aWNlLmpzIiwiY29tbW9uL1NoYXJlU2VydmljZS5qcyIsImNvbW1vbi9Vc2VyU2VydmljZS5qcyIsImNvbW1vbi9ub3RpZmljYXRpb24uanMiLCJjb21tb24vdXNlckludGVyYWN0aW9uTWFuYWdlci5qcyIsImNvbW1vbi91c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24uanMiLCJkaWFsb2dzL2RpYWxvZ0N0cmwuanMiLCJmZWVkcy9mZWVkcy5qcyIsImZpbGVzL2ZpbGUuanMiLCJmaWxlcy9wcmV2aWV3LmpzIiwiZm9sbG93ZXJzL2ZvbGxvd2Vycy5qcyIsImdyb3Vwcy9ncm91cHMuanMiLCJzZXR0aW5ncy9zZXR0aW5ncy5qcyIsInNoYXJpbmcvc2hhcmluZy5qcyIsInVwbG9hZGVyL3VwbG9hZGVyLmpzIiwidXJsU2hvcnRuZXIvc2hvcnRuZXIuanMiLCJmZWVkcy9jb250cm9sbGVyL2FuYWx5dGljcy5qcyIsImZlZWRzL2NvbnRyb2xsZXIvY2hhdFBvcHVwQ29udHJvbGxlci5qcyIsImZlZWRzL2NvbnRyb2xsZXIvbWVzc2FnZUNvbnRyb2xsZXIuanMiLCJmZWVkcy9jb250cm9sbGVyL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQUtBLENBQUMsU0FBUyxpQ0FBaUMsTUFBTSxTQUFTO0NBQ3pELEdBQUcsT0FBTyxZQUFZLFlBQVksT0FBTyxXQUFXO0VBQ25ELE9BQU8sVUFBVTtNQUNiLEdBQUcsT0FBTyxXQUFXLGNBQWMsT0FBTztFQUM5QyxPQUFPLElBQUk7TUFDUCxHQUFHLE9BQU8sWUFBWTtFQUMxQixRQUFRLHlCQUF5Qjs7RUFFakMsS0FBSyx5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YXItZmlsZS11cGxvYWQgdjIuMi4wXG4gaHR0cHM6Ly9naXRodWIuY29tL25lcnZnaC9hbmd1bGFyLWZpbGUtdXBsb2FkXG4qL1xuXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhbmd1bGFyLWZpbGUtdXBsb2FkXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFuZ3VsYXItZmlsZS11cGxvYWRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIG9wdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygyKSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlVXBsb2FkZXIgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygzKSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlTGlrZU9iamVjdCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDQpKTtcblxuXHR2YXIgc2VydmljZUZpbGVJdGVtID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oNSkpO1xuXG5cdHZhciBzZXJ2aWNlRmlsZURpcmVjdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDYpKTtcblxuXHR2YXIgc2VydmljZUZpbGVTZWxlY3QgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg3KSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlRHJvcCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDgpKTtcblxuXHR2YXIgc2VydmljZUZpbGVPdmVyID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oOSkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlU2VsZWN0ID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMTApKTtcblxuXHR2YXIgZGlyZWN0aXZlRmlsZURyb3AgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxMSkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlT3ZlciA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKSk7XG5cblx0YW5ndWxhci5tb2R1bGUoQ09ORklHLm5hbWUsIFtdKS52YWx1ZShcImZpbGVVcGxvYWRlck9wdGlvbnNcIiwgb3B0aW9ucykuZmFjdG9yeShcIkZpbGVVcGxvYWRlclwiLCBzZXJ2aWNlRmlsZVVwbG9hZGVyKS5mYWN0b3J5KFwiRmlsZUxpa2VPYmplY3RcIiwgc2VydmljZUZpbGVMaWtlT2JqZWN0KS5mYWN0b3J5KFwiRmlsZUl0ZW1cIiwgc2VydmljZUZpbGVJdGVtKS5mYWN0b3J5KFwiRmlsZURpcmVjdGl2ZVwiLCBzZXJ2aWNlRmlsZURpcmVjdGl2ZSkuZmFjdG9yeShcIkZpbGVTZWxlY3RcIiwgc2VydmljZUZpbGVTZWxlY3QpLmZhY3RvcnkoXCJGaWxlRHJvcFwiLCBzZXJ2aWNlRmlsZURyb3ApLmZhY3RvcnkoXCJGaWxlT3ZlclwiLCBzZXJ2aWNlRmlsZU92ZXIpLmRpcmVjdGl2ZShcIm52RmlsZVNlbGVjdFwiLCBkaXJlY3RpdmVGaWxlU2VsZWN0KS5kaXJlY3RpdmUoXCJudkZpbGVEcm9wXCIsIGRpcmVjdGl2ZUZpbGVEcm9wKS5kaXJlY3RpdmUoXCJudkZpbGVPdmVyXCIsIGRpcmVjdGl2ZUZpbGVPdmVyKS5ydW4oW1wiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZUxpa2VPYmplY3RcIiwgXCJGaWxlSXRlbVwiLCBcIkZpbGVEaXJlY3RpdmVcIiwgXCJGaWxlU2VsZWN0XCIsIFwiRmlsZURyb3BcIiwgXCJGaWxlT3ZlclwiLCBmdW5jdGlvbiAoRmlsZVVwbG9hZGVyLCBGaWxlTGlrZU9iamVjdCwgRmlsZUl0ZW0sIEZpbGVEaXJlY3RpdmUsIEZpbGVTZWxlY3QsIEZpbGVEcm9wLCBGaWxlT3Zlcikge1xuXHQgICAgLy8gb25seSBmb3IgY29tcGF0aWJpbGl0eVxuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVMaWtlT2JqZWN0ID0gRmlsZUxpa2VPYmplY3Q7XG5cdCAgICBGaWxlVXBsb2FkZXIuRmlsZUl0ZW0gPSBGaWxlSXRlbTtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlRGlyZWN0aXZlID0gRmlsZURpcmVjdGl2ZTtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlU2VsZWN0ID0gRmlsZVNlbGVjdDtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlRHJvcCA9IEZpbGVEcm9wO1xuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVPdmVyID0gRmlsZU92ZXI7XG5cdH1dKTtcblxuLyoqKi8gfSxcblxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdFx0XCJuYW1lXCI6IFwiYW5ndWxhckZpbGVVcGxvYWRcIlxuXHR9O1xuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICB1cmw6IFwiL1wiLFxuXHQgICAgYWxpYXM6IFwiZmlsZVwiLFxuXHQgICAgaGVhZGVyczogeydhdXRob3JpemF0aW9uJzogJ0JlYXJlciBCYzdEV1M3S0tSTHR4bWRkVVpJMVQxbFp1MkoxWWhSOE9MWEdXTlpuJ30sXG5cdCAgICBxdWV1ZTogW10sXG5cdCAgICBwcm9ncmVzczogMCxcblx0ICAgIGF1dG9VcGxvYWQ6IGZhbHNlLFxuXHQgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IGZhbHNlLFxuXHQgICAgbWV0aG9kOiBcIlBPU1RcIixcblx0ICAgIGZpbHRlcnM6IFtdLFxuXHQgICAgZm9ybURhdGE6IFtdLFxuXHQgICAgcXVldWVMaW1pdDogTnVtYmVyLk1BWF9WQUxVRSxcblx0ICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2Vcblx0fTtcblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgY29weSA9IGFuZ3VsYXIuY29weTtcblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXHR2YXIgZm9yRWFjaCA9IGFuZ3VsYXIuZm9yRWFjaDtcblx0dmFyIGlzT2JqZWN0ID0gYW5ndWxhci5pc09iamVjdDtcblx0dmFyIGlzTnVtYmVyID0gYW5ndWxhci5pc051bWJlcjtcblx0dmFyIGlzRGVmaW5lZCA9IGFuZ3VsYXIuaXNEZWZpbmVkO1xuXHR2YXIgaXNBcnJheSA9IGFuZ3VsYXIuaXNBcnJheTtcblx0dmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmlsZVVwbG9hZGVyT3B0aW9ucywgJHJvb3RTY29wZSwgJGh0dHAsICR3aW5kb3csIEZpbGVMaWtlT2JqZWN0LCBGaWxlSXRlbSkge1xuXHQgICAgdmFyIEZpbGUgPSAkd2luZG93LkZpbGU7XG5cdCAgICB2YXIgRm9ybURhdGEgPSAkd2luZG93LkZvcm1EYXRhO1xuXG5cdCAgICB2YXIgRmlsZVVwbG9hZGVyID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAqIFBVQkxJQ1xuXHQgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZVVwbG9hZGVyKG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVVcGxvYWRlcik7XG5cblx0ICAgICAgICAgICAgdmFyIHNldHRpbmdzID0gY29weShmaWxlVXBsb2FkZXJPcHRpb25zKTtcblxuXHQgICAgICAgICAgICBleHRlbmQodGhpcywgc2V0dGluZ3MsIG9wdGlvbnMsIHtcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIF9uZXh0SW5kZXg6IDAsXG5cdCAgICAgICAgICAgICAgICBfZmFpbEZpbHRlckluZGV4OiAtMSxcblx0ICAgICAgICAgICAgICAgIF9kaXJlY3RpdmVzOiB7IHNlbGVjdDogW10sIGRyb3A6IFtdLCBvdmVyOiBbXSB9XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIC8vIGFkZCBkZWZhdWx0IGZpbHRlcnNcblx0ICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnVuc2hpZnQoeyBuYW1lOiBcInF1ZXVlTGltaXRcIiwgZm46IHRoaXMuX3F1ZXVlTGltaXRGaWx0ZXIgfSk7XG5cdCAgICAgICAgICAgIHRoaXMuZmlsdGVycy51bnNoaWZ0KHsgbmFtZTogXCJmb2xkZXJcIiwgZm46IHRoaXMuX2ZvbGRlckZpbHRlciB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZVVwbG9hZGVyLCB7XG5cdCAgICAgICAgICAgIGFkZFRvUXVldWU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQWRkcyBpdGVtcyB0byB0aGUgcXVldWVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxIVE1MSW5wdXRFbGVtZW50fE9iamVjdHxGaWxlTGlzdHxBcnJheTxPYmplY3Q+fSBmaWxlc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj58U3RyaW5nfSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFRvUXVldWUoZmlsZXMsIG9wdGlvbnMsIGZpbHRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzLmlzQXJyYXlMaWtlT2JqZWN0KGZpbGVzKSA/IGZpbGVzIDogW2ZpbGVzXTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgYXJyYXlPZkZpbHRlcnMgPSB0aGlzLl9nZXRGaWx0ZXJzKGZpbHRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBhZGRlZEZpbGVJdGVtcyA9IFtdO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChsaXN0LCBmdW5jdGlvbiAoc29tZSAvKntGaWxlfEhUTUxJbnB1dEVsZW1lbnR8T2JqZWN0fSovKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gbmV3IEZpbGVMaWtlT2JqZWN0KHNvbWUpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5faXNWYWxpZEZpbGUodGVtcCwgYXJyYXlPZkZpbHRlcnMsIG9wdGlvbnMpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZUl0ZW0gPSBuZXcgRmlsZUl0ZW0oX3RoaXMsIHNvbWUsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRGaWxlSXRlbXMucHVzaChmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5xdWV1ZS5wdXNoKGZpbGVJdGVtKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkFmdGVyQWRkaW5nRmlsZShmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyID0gYXJyYXlPZkZpbHRlcnNbX3RoaXMuX2ZhaWxGaWx0ZXJJbmRleF07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25XaGVuQWRkaW5nRmlsZUZhaWxlZCh0ZW1wLCBmaWx0ZXIsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggIT09IGNvdW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQWZ0ZXJBZGRpbmdBbGwoYWRkZWRGaWxlSXRlbXMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5fZ2V0VG90YWxQcm9ncmVzcygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9VcGxvYWQpIHRoaXMudXBsb2FkQWxsKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHJlbW92ZUZyb21RdWV1ZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZW1vdmUgaXRlbXMgZnJvbSB0aGUgcXVldWUuIFJlbW92ZSBsYXN0OiBpbmRleCA9IC0xXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfE51bWJlcn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRnJvbVF1ZXVlKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleE9mSXRlbSh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXVlW2luZGV4XTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc1VwbG9hZGluZykgaXRlbS5jYW5jZWwoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fZGVzdHJveSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLl9nZXRUb3RhbFByb2dyZXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNsZWFyUXVldWU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclF1ZXVlKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLnF1ZXVlLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlWzBdLnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBVcGxvYWRzIGEgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEl0ZW0odmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4T2ZJdGVtKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVldWVbaW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc3BvcnQgPSB0aGlzLmlzSFRNTDUgPyBcIl94aHJUcmFuc3BvcnRcIiA6IFwiX2lmcmFtZVRyYW5zcG9ydFwiO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fcHJlcGFyZVRvVXBsb2FkaW5nKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH10aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzW3RyYW5zcG9ydF0oaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyB1cGxvYWRpbmcgb2YgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhbmNlbEl0ZW0odmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4T2ZJdGVtKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVldWVbaW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5pc0hUTUw1ID8gXCJfeGhyXCIgOiBcIl9mb3JtXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5pc1VwbG9hZGluZykgaXRlbVtwcm9wXS5hYm9ydCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1cGxvYWRBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhbGwgbm90IHVwbG9hZGVkIGl0ZW1zIG9mIHF1ZXVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEFsbCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmdldE5vdFVwbG9hZGVkSXRlbXMoKS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFpdGVtLmlzVXBsb2FkaW5nO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9Zm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uX3ByZXBhcmVUb1VwbG9hZGluZygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW1zWzBdLnVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBjYW5jZWxBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyBhbGwgdXBsb2Fkc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY2FuY2VsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNGaWxlKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNGaWxlKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNGaWxlTGlrZU9iamVjdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZUxpa2VPYmplY3QodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5pc0ZpbGVMaWtlT2JqZWN0KHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNBcnJheUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBpcyBhcnJheSBsaWtlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNBcnJheUxpa2VPYmplY3QodmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRJbmRleE9mSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGEgaW5kZXggb2YgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtJdGVtfE51bWJlcn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluZGV4T2ZJdGVtKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSA/IHZhbHVlIDogdGhpcy5xdWV1ZS5pbmRleE9mKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0Tm90VXBsb2FkZWRJdGVtczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG5vdCB1cGxvYWRlZCBpdGVtc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXROb3RVcGxvYWRlZEl0ZW1zKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXVlLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWl0ZW0uaXNVcGxvYWRlZDtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0UmVhZHlJdGVtczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGl0ZW1zIHJlYWR5IGZvciB1cGxvYWRcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UmVhZHlJdGVtcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeSAmJiAhaXRlbS5pc1VwbG9hZGluZztcblx0ICAgICAgICAgICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uIChpdGVtMSwgaXRlbTIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0xLmluZGV4IC0gaXRlbTIuaW5kZXg7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGRlc3Ryb3k6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRGVzdHJveXMgaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2godGhpcy5fZGlyZWN0aXZlcywgZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKF90aGlzLl9kaXJlY3RpdmVzW2tleV0sIGZ1bmN0aW9uIChvYmplY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5kZXN0cm95KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkFmdGVyQWRkaW5nQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBmaWxlSXRlbXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25BZnRlckFkZGluZ0FsbChmaWxlSXRlbXMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQWZ0ZXJBZGRpbmdGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBmaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkFmdGVyQWRkaW5nRmlsZShmaWxlSXRlbSkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25XaGVuQWRkaW5nRmlsZUZhaWxlZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfE9iamVjdH0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZpbHRlclxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25XaGVuQWRkaW5nRmlsZUZhaWxlZChpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQmVmb3JlVXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25CZWZvcmVVcGxvYWRJdGVtKGZpbGVJdGVtKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblByb2dyZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzSXRlbShmaWxlSXRlbSwgcHJvZ3Jlc3MpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uUHJvZ3Jlc3NBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzQWxsKHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblN1Y2Nlc3NJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uRXJyb3JJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkVycm9ySXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNvbXBsZXRlSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Db21wbGV0ZUFsbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNvbXBsZXRlQWxsKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2dldFRvdGFsUHJvZ3Jlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG5cdCAgICAgICAgICAgICAgICAgKiBQUklWQVRFXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyB0aGUgdG90YWwgcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdmFsdWVdXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRvdGFsUHJvZ3Jlc3ModmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVBZnRlclVwbG9hZCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgfHwgMDtcblx0ICAgICAgICAgICAgICAgICAgICB9dmFyIG5vdFVwbG9hZGVkID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCkubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB1cGxvYWRlZCA9IG5vdFVwbG9hZGVkID8gdGhpcy5xdWV1ZS5sZW5ndGggLSBub3RVcGxvYWRlZCA6IHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByYXRpbyA9IDEwMCAvIHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gKHZhbHVlIHx8IDApICogcmF0aW8gLyAxMDA7XG5cblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh1cGxvYWRlZCAqIHJhdGlvICsgY3VycmVudCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgYXJyYXkgb2YgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj58U3RyaW5nfSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXk8RnVuY3Rpb24+fVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEZpbHRlcnMoZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICAgICAgICAgIH1pZiAoaXNBcnJheShmaWx0ZXJzKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVycztcblx0ICAgICAgICAgICAgICAgICAgICB9dmFyIG5hbWVzID0gZmlsdGVycy5tYXRjaCgvW15cXHMsXSsvZyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVycy5maWx0ZXIoZnVuY3Rpb24gKGZpbHRlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXMuaW5kZXhPZihmaWx0ZXIubmFtZSkgIT09IC0xO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcmVuZGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVwZGF0ZXMgaHRtbFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbmRlcigpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoISRyb290U2NvcGUuJCRwaGFzZSkgJHJvb3RTY29wZS4kYXBwbHkoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2ZvbGRlckZpbHRlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIGl0ZW0gaXMgYSBmaWxlIChub3QgZm9sZGVyKVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfEZpbGVMaWtlT2JqZWN0fSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9mb2xkZXJGaWx0ZXIoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIShpdGVtLnNpemUgfHwgaXRlbS50eXBlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3F1ZXVlTGltaXRGaWx0ZXI6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB0aGUgbGltaXQgaGFzIG5vdCBiZWVuIHJlYWNoZWRcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3F1ZXVlTGltaXRGaWx0ZXIoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVldWUubGVuZ3RoIDwgdGhpcy5xdWV1ZUxpbWl0O1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaXNWYWxpZEZpbGU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiBmaWxlIHBhc3MgYWxsIGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxPYmplY3R9IGZpbGVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaXNWYWxpZEZpbGUoZmlsZSwgZmlsdGVycywgb3B0aW9ucykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWlsRmlsdGVySW5kZXggPSAtMTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWZpbHRlcnMubGVuZ3RoID8gdHJ1ZSA6IGZpbHRlcnMuZXZlcnkoZnVuY3Rpb24gKGZpbHRlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZmFpbEZpbHRlckluZGV4Kys7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuZm4uY2FsbChfdGhpcywgZmlsZSwgb3B0aW9ucyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9pc1N1Y2Nlc3NDb2RlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENoZWNrcyB3aGV0aGVyIHVwbG9hZCBzdWNjZXNzZnVsXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pc1N1Y2Nlc3NDb2RlKHN0YXR1cykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3RyYW5zZm9ybVJlc3BvbnNlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFRyYW5zZm9ybXMgdGhlIHNlcnZlciByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3RyYW5zZm9ybVJlc3BvbnNlKHJlc3BvbnNlLCBoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnNHZXR0ZXIgPSB0aGlzLl9oZWFkZXJzR2V0dGVyKGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goJGh0dHAuZGVmYXVsdHMudHJhbnNmb3JtUmVzcG9uc2UsIGZ1bmN0aW9uICh0cmFuc2Zvcm1Gbikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRyYW5zZm9ybUZuKHJlc3BvbnNlLCBoZWFkZXJzR2V0dGVyKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9wYXJzZUhlYWRlcnM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUGFyc2VkIHJlc3BvbnNlIGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHQgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvbWFzdGVyL3NyYy9uZy9odHRwLmpzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkID0ge30sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfWZvckVhY2goaGVhZGVycy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24gKGxpbmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGxpbmUuaW5kZXhPZihcIjpcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGxpbmUuc2xpY2UoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGxpbmUuc2xpY2UoaSArIDEpLnRyaW0oKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyBcIiwgXCIgKyB2YWwgOiB2YWw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9oZWFkZXJzR2V0dGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJzZWRIZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGVhZGVyc0dldHRlcihwYXJzZWRIZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkSGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldIHx8IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEhlYWRlcnM7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3hoclRyYW5zcG9ydDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBUaGUgWE1MSHR0cFJlcXVlc3QgdHJhbnNwb3J0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfeGhyVHJhbnNwb3J0KGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IGl0ZW0uX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGl0ZW0uZm9ybURhdGEsIGZ1bmN0aW9uIChvYmopIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChrZXksIHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uX2ZpbGUuc2l6ZSAhPSBcIm51bWJlclwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgZmlsZSBzcGVjaWZpZWQgaXMgbm8gbG9uZ2VyIHZhbGlkXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGl0ZW0uYWxpYXMsIGl0ZW0uX2ZpbGUsIGl0ZW0uZmlsZS5uYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUgPyBldmVudC5sb2FkZWQgKiAxMDAgLyBldmVudC50b3RhbCA6IDApO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Qcm9ncmVzc0l0ZW0oaXRlbSwgcHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVycyA9IF90aGlzLl9wYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gX3RoaXMuX3RyYW5zZm9ybVJlc3BvbnNlKHhoci5yZXNwb25zZSwgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnaXN0ID0gX3RoaXMuX2lzU3VjY2Vzc0NvZGUoeGhyLnN0YXR1cykgPyBcIlN1Y2Nlc3NcIiA6IFwiRXJyb3JcIjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IFwiX29uXCIgKyBnaXN0ICsgXCJJdGVtXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzW21ldGhvZF0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4oaXRlbS5tZXRob2QsIGl0ZW0udXJsLCB0cnVlKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBpdGVtLndpdGhDcmVkZW50aWFscztcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbS5oZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZm9ybSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9pZnJhbWVUcmFuc3BvcnQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVGhlIElGcmFtZSB0cmFuc3BvcnRcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pZnJhbWVUcmFuc3BvcnQoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IGVsZW1lbnQoXCI8Zm9ybSBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTtcXFwiIC8+XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpZnJhbWUgPSBlbGVtZW50KFwiPGlmcmFtZSBuYW1lPVxcXCJpZnJhbWVUcmFuc3BvcnRcIiArIERhdGUubm93KCkgKyBcIlxcXCI+XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGl0ZW0uX2lucHV0O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX2Zvcm0pIGl0ZW0uX2Zvcm0ucmVwbGFjZVdpdGgoaW5wdXQpOyAvLyByZW1vdmUgb2xkIGZvcm1cblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9mb3JtID0gZm9ybTsgLy8gc2F2ZSBsaW5rIHRvIG5ldyBmb3JtXG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpbnB1dC5wcm9wKFwibmFtZVwiLCBpdGVtLmFsaWFzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbS5mb3JtRGF0YSwgZnVuY3Rpb24gKG9iaikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50XyA9IGVsZW1lbnQoXCI8aW5wdXQgdHlwZT1cXFwiaGlkZGVuXFxcIiBuYW1lPVxcXCJcIiArIGtleSArIFwiXFxcIiAvPlwiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRfLnZhbCh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChlbGVtZW50Xyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgZm9ybS5wcm9wKHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBpdGVtLnVybCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBpZnJhbWUucHJvcChcIm5hbWVcIiksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGVuY3R5cGU6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZzogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgLy8gb2xkIElFXG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZnJhbWUuYmluZChcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSAyMDA7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCBmb3IgbGVnYWN5IElFIGJyb3dzZXJzIHRoYXQgbG9hZHMgaW50ZXJuYWwgZXJyb3IgcGFnZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBmYWlsZWQgV1MgcmVzcG9uc2UgcmVjZWl2ZWQuIEluIGNvbnNlcXVlbmNlIGlmcmFtZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGVudCBhY2Nlc3MgZGVuaWVkIGVycm9yIGlzIHRocm93biBiZWNvdXNlIHRyeWluZyB0b1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWNjZXNzIGNyb3NzIGRvbWFpbiBwYWdlLiBXaGVuIHN1Y2ggdGhpbmcgb2NjdXJzIG5vdGlmeWluZ1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCBlbXB0eSByZXNwb25zZSBvYmplY3QuIFNlZSBtb3JlIGluZm8gYXQ6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE1MTM2Mi9hY2Nlc3MtaXMtZGVuaWVkLWVycm9yLW9uLWFjY2Vzc2luZy1pZnJhbWUtZG9jdW1lbnQtb2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgaWYgbm9uIHN0YW5kYXJkIDR4eCBvciA1eHggZXJyb3IgY29kZSByZXR1cm5lZFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBXUyB0aGVuIHJlc3BvbnNlIGNvbnRlbnQgY2FuIGJlIGFjY2Vzc2VkIHdpdGhvdXQgZXJyb3Jcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCAnWEhSJyBzdGF0dXMgYmVjb21lcyAyMDAuIEluIG9yZGVyIHRvIGF2b2lkIGNvbmZ1c2lvblxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuaW5nIHJlc3BvbnNlIHZpYSBzYW1lICdzdWNjZXNzJyBldmVudCBoYW5kbGVyLlxuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZCBhbmd1bGFyLmNvbnRlbnRzKCkgZm9yIGlmcmFtZXNcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSBpZnJhbWVbMF0uY29udGVudERvY3VtZW50LmJvZHkuaW5uZXJIVE1MO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBjYXNlIHdlIHJ1biBpbnRvIHRoZSBhY2Nlc3MtaXMtZGVuaWVkIGVycm9yIG9yIHdlIGhhdmUgYW5vdGhlciBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChpbnRlbnRpb25hbCA1MDAsNDAuLi4gZXJyb3JzKSwgd2UgYXQgbGVhc3Qgc2F5ICdzb21ldGhpbmcgd2VudCB3cm9uZycgLT4gNTAwXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSA1MDA7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgeGhyID0geyByZXNwb25zZTogaHRtbCwgc3RhdHVzOiBzdGF0dXMsIGR1bW15OiB0cnVlIH07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0ge307XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4aHIgPSB7IHN0YXR1czogMCwgZHVtbXk6IHRydWUgfTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSB7fTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmcmFtZS51bmJpbmQoXCJsb2FkXCIpLnByb3AoXCJzcmNcIiwgXCJqYXZhc2NyaXB0OmZhbHNlO1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXBsYWNlV2l0aChpbnB1dCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmFmdGVyKGZvcm0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGlucHV0KS5hcHBlbmQoaWZyYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm1bMF0uc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbldoZW5BZGRpbmdGaWxlRmFpbGVkOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8T2JqZWN0fSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZmlsdGVyXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQoaXRlbSwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbldoZW5BZGRpbmdGaWxlRmFpbGVkKGl0ZW0sIGZpbHRlciwgb3B0aW9ucyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkFmdGVyQWRkaW5nRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25BZnRlckFkZGluZ0ZpbGUoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25BZnRlckFkZGluZ0ZpbGUoaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkFmdGVyQWRkaW5nQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5PEZpbGVJdGVtPn0gaXRlbXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQWZ0ZXJBZGRpbmdBbGwoaXRlbXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQWZ0ZXJBZGRpbmdBbGwoaXRlbXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25CZWZvcmVVcGxvYWRJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqICBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQmVmb3JlVXBsb2FkSXRlbShpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fb25CZWZvcmVVcGxvYWQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkSXRlbShpdGVtKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uUHJvZ3Jlc3NJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblByb2dyZXNzSXRlbShpdGVtLCBwcm9ncmVzcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MocHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0b3RhbDtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vblByb2dyZXNzKHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3NJdGVtKGl0ZW0sIHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3NBbGwodG90YWwpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25TdWNjZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25FcnJvckl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uRXJyb3IocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9ySXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uQ2FuY2VsSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkNhbmNlbEl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQ2FuY2VsKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25Db21wbGV0ZUl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbSA9IHRoaXMuZ2V0UmVhZHlJdGVtcygpWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQobmV4dEl0ZW0pKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQWxsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sIHtcblx0ICAgICAgICAgICAgaXNGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogU1RBVElDXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBhbiBpbnN0YW5jZSBvZiBGaWxlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZSh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBGaWxlICYmIHZhbHVlIGluc3RhbmNlb2YgRmlsZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNGaWxlTGlrZU9iamVjdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZUxpa2VPYmplY3QodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBGaWxlTGlrZU9iamVjdDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNBcnJheUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBpcyBhcnJheSBsaWtlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBcImxlbmd0aFwiIGluIHZhbHVlO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpbmhlcml0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEluaGVyaXRzIGEgdGFyZ2V0IChDbGFzc18xKSBieSBhIHNvdXJjZSAoQ2xhc3NfMilcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRhcmdldFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc291cmNlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaGVyaXQodGFyZ2V0LCBzb3VyY2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzb3VyY2UucHJvdG90eXBlKTtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGFyZ2V0O1xuXHQgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdXBlcl8gPSBzb3VyY2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlVXBsb2FkZXI7XG5cdCAgICB9KSgpO1xuXG5cdCAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICogUFVCTElDXG5cdCAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgIC8qKlxuXHQgICAgICogQ2hlY2tzIGEgc3VwcG9ydCB0aGUgaHRtbDUgdXBsb2FkZXJcblx0ICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICogQHJlYWRvbmx5XG5cdCAgICAgKi9cblx0ICAgIEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNSA9ICEhKEZpbGUgJiYgRm9ybURhdGEpO1xuXHQgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAqIFNUQVRJQ1xuXHQgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAvKipcblx0ICAgICAqIEBib3Jyb3dzIEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNVxuXHQgICAgICovXG5cdCAgICBGaWxlVXBsb2FkZXIuaXNIVE1MNSA9IEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNTtcblxuXHQgICAgcmV0dXJuIEZpbGVVcGxvYWRlcjtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiZmlsZVVwbG9hZGVyT3B0aW9uc1wiLCBcIiRyb290U2NvcGVcIiwgXCIkaHR0cFwiLCBcIiR3aW5kb3dcIiwgXCJGaWxlTGlrZU9iamVjdFwiLCBcIkZpbGVJdGVtXCJdO1xuXG4vKioqLyB9LFxuLyogNCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXHR2YXIgaXNFbGVtZW50ID0gYW5ndWxhci5pc0VsZW1lbnQ7XG5cdHZhciBpc1N0cmluZyA9IGFuZ3VsYXIuaXNTdHJpbmc7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgRmlsZUxpa2VPYmplY3QgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRmlsZUxpa2VPYmplY3Rcblx0ICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8SFRNTElucHV0RWxlbWVudHxPYmplY3R9IGZpbGVPcklucHV0XG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlTGlrZU9iamVjdChmaWxlT3JJbnB1dCkge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUxpa2VPYmplY3QpO1xuXG5cdCAgICAgICAgICAgIHZhciBpc0lucHV0ID0gaXNFbGVtZW50KGZpbGVPcklucHV0KTtcblx0ICAgICAgICAgICAgdmFyIGZha2VQYXRoT3JPYmplY3QgPSBpc0lucHV0ID8gZmlsZU9ySW5wdXQudmFsdWUgOiBmaWxlT3JJbnB1dDtcblx0ICAgICAgICAgICAgdmFyIHBvc3RmaXggPSBpc1N0cmluZyhmYWtlUGF0aE9yT2JqZWN0KSA/IFwiRmFrZVBhdGhcIiA6IFwiT2JqZWN0XCI7XG5cdCAgICAgICAgICAgIHZhciBtZXRob2QgPSBcIl9jcmVhdGVGcm9tXCIgKyBwb3N0Zml4O1xuXHQgICAgICAgICAgICB0aGlzW21ldGhvZF0oZmFrZVBhdGhPck9iamVjdCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVMaWtlT2JqZWN0LCB7XG5cdCAgICAgICAgICAgIF9jcmVhdGVGcm9tRmFrZVBhdGg6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBmaWxlIGxpa2Ugb2JqZWN0IGZyb20gZmFrZSBwYXRoIHN0cmluZ1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVGcm9tRmFrZVBhdGgocGF0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vZGlmaWVkRGF0ZSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBcImxpa2UvXCIgKyBwYXRoLnNsaWNlKHBhdGgubGFzdEluZGV4T2YoXCIuXCIpICsgMSkudG9Mb3dlckNhc2UoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBwYXRoLnNsaWNlKHBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgcGF0aC5sYXN0SW5kZXhPZihcIlxcXFxcIikgKyAyKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2NyZWF0ZUZyb21PYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBmaWxlIGxpa2Ugb2JqZWN0IGZyb20gb2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8RmlsZUxpa2VPYmplY3R9IG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2NyZWF0ZUZyb21PYmplY3Qob2JqZWN0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW9kaWZpZWREYXRlID0gY29weShvYmplY3QubGFzdE1vZGlmaWVkRGF0ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gb2JqZWN0LnNpemU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gb2JqZWN0LnR5cGU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gb2JqZWN0Lm5hbWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlTGlrZU9iamVjdDtcblx0ICAgIH0pKCk7XG5cblx0ICAgIHJldHVybiBGaWxlTGlrZU9iamVjdDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW107XG5cbi8qKiovIH0sXG4vKiA1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGtleSBpbiBwcm9wcykgeyB2YXIgcHJvcCA9IHByb3BzW2tleV07IHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlOyB9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpOyB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGNvcHkgPSBhbmd1bGFyLmNvcHk7XG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblx0dmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQ7XG5cdHZhciBpc0VsZW1lbnQgPSBhbmd1bGFyLmlzRWxlbWVudDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkY29tcGlsZSwgRmlsZUxpa2VPYmplY3QpIHtcblx0ICAgIHZhciBGaWxlSXRlbSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBGaWxlSXRlbVxuXHQgICAgICAgICAqIEBwYXJhbSB7RmlsZVVwbG9hZGVyfSB1cGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7RmlsZXxIVE1MSW5wdXRFbGVtZW50fE9iamVjdH0gc29tZVxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlSXRlbSh1cGxvYWRlciwgc29tZSwgb3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUl0ZW0pO1xuXG5cdCAgICAgICAgICAgIHZhciBpc0lucHV0ID0gaXNFbGVtZW50KHNvbWUpO1xuXHQgICAgICAgICAgICB2YXIgaW5wdXQgPSBpc0lucHV0ID8gZWxlbWVudChzb21lKSA6IG51bGw7XG5cdCAgICAgICAgICAgIHZhciBmaWxlID0gIWlzSW5wdXQgPyBzb21lIDogbnVsbDtcblxuXHQgICAgICAgICAgICBleHRlbmQodGhpcywge1xuXHQgICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRlci51cmwsXG5cdCAgICAgICAgICAgICAgICBhbGlhczogdXBsb2FkZXIuYWxpYXMsXG5cdCAgICAgICAgICAgICAgICBoZWFkZXJzOiBjb3B5KHVwbG9hZGVyLmhlYWRlcnMpLFxuXHQgICAgICAgICAgICAgICAgZm9ybURhdGE6IGNvcHkodXBsb2FkZXIuZm9ybURhdGEpLFxuXHQgICAgICAgICAgICAgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IHVwbG9hZGVyLnJlbW92ZUFmdGVyVXBsb2FkLFxuXHQgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB1cGxvYWRlci53aXRoQ3JlZGVudGlhbHMsXG5cdCAgICAgICAgICAgICAgICBtZXRob2Q6IHVwbG9hZGVyLm1ldGhvZFxuXHQgICAgICAgICAgICB9LCBvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBmaWxlOiBuZXcgRmlsZUxpa2VPYmplY3Qoc29tZSksXG5cdCAgICAgICAgICAgICAgICBpc1JlYWR5OiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkZWQ6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzQ2FuY2VsOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG5cdCAgICAgICAgICAgICAgICBpbmRleDogbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9maWxlOiBmaWxlLFxuXHQgICAgICAgICAgICAgICAgX2lucHV0OiBpbnB1dFxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICBpZiAoaW5wdXQpIHRoaXMuX3JlcGxhY2VOb2RlKGlucHV0KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZUl0ZW0sIHtcblx0ICAgICAgICAgICAgdXBsb2FkOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogUFVCTElDXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhIEZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZEl0ZW0odGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9vbkNvbXBsZXRlSXRlbSh0aGlzLCBcIlwiLCAwLCBbXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuX29uRXJyb3JJdGVtKHRoaXMsIFwiXCIsIDAsIFtdKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNhbmNlbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYW5jZWxzIHVwbG9hZGluZyBvZiBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5jYW5jZWxJdGVtKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlcyBhIEZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLnJlbW92ZUZyb21RdWV1ZSh0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25CZWZvcmVVcGxvYWQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQmVmb3JlVXBsb2FkKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Qcm9ncmVzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzKHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblN1Y2Nlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uU3VjY2VzcyhyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkVycm9yOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ2FuY2VsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNhbmNlbChyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNvbXBsZXRlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkJlZm9yZVVwbG9hZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAgICAgICAgICAgICAqIFBSSVZBVEVcblx0ICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25CZWZvcmVVcGxvYWQoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblByb2dyZXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblByb2dyZXNzKHByb2dyZXNzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Qcm9ncmVzcyhwcm9ncmVzcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblN1Y2Nlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25TdWNjZXNzKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGVkID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkVycm9yOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uRXJyb3IocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTdWNjZXNzID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25DYW5jZWw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkNvbXBsZXRlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZShyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVBZnRlclVwbG9hZCkgdGhpcy5yZW1vdmUoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2Rlc3Ryb3k6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRGVzdHJveXMgYSBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVzdHJveSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5wdXQpIHRoaXMuX2lucHV0LnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mb3JtKSB0aGlzLl9mb3JtLnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9mb3JtO1xuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9pbnB1dDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3ByZXBhcmVUb1VwbG9hZGluZzoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBQcmVwYXJlcyB0byB1cGxvYWRpbmdcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcmVwYXJlVG9VcGxvYWRpbmcoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggfHwgKyt0aGlzLnVwbG9hZGVyLl9uZXh0SW5kZXg7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3JlcGxhY2VOb2RlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJlcGxhY2VzIGlucHV0IGVsZW1lbnQgb24gaGlzIGNsb25lXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0pRTGl0ZXxqUXVlcnl9IGlucHV0XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVwbGFjZU5vZGUoaW5wdXQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSAkY29tcGlsZShpbnB1dC5jbG9uZSgpKShpbnB1dC5zY29wZSgpKTtcblx0ICAgICAgICAgICAgICAgICAgICBjbG9uZS5wcm9wKFwidmFsdWVcIiwgbnVsbCk7IC8vIEZGIGZpeFxuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmFmdGVyKGNsb25lKTsgLy8gcmVtb3ZlIGpxdWVyeSBkZXBlbmRlbmN5XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlSXRlbTtcblx0ICAgIH0pKCk7XG5cblx0ICAgIHJldHVybiBGaWxlSXRlbTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGNvbXBpbGVcIiwgXCJGaWxlTGlrZU9iamVjdFwiXTtcblxuLyoqKi8gfSxcbi8qIDYgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgRmlsZURpcmVjdGl2ZSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURpcmVjdGl2ZX0gb2JqZWN0XG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy51cGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9wdGlvbnMuZWxlbWVudFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmV2ZW50c1xuXHQgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnByb3Bcblx0ICAgICAgICAgKiBAY29uc3RydWN0b3Jcblx0ICAgICAgICAgKi9cblxuXHQgICAgICAgIGZ1bmN0aW9uIEZpbGVEaXJlY3RpdmUob3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICAgICAgZXh0ZW5kKHRoaXMsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzW3RoaXMucHJvcF0ucHVzaCh0aGlzKTtcblx0ICAgICAgICAgICAgdGhpcy5fc2F2ZUxpbmtzKCk7XG5cdCAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9jcmVhdGVDbGFzcyhGaWxlRGlyZWN0aXZlLCB7XG5cdCAgICAgICAgICAgIGJpbmQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQmluZHMgZXZlbnRzIGhhbmRsZXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5ldmVudHMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmV2ZW50c1trZXldO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYmluZChrZXksIHRoaXNbcHJvcF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdW5iaW5kOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVuYmluZHMgZXZlbnRzIGhhbmRsZXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdW5iaW5kKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmV2ZW50cykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudW5iaW5kKGtleSwgdGhpcy5ldmVudHNba2V5XSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBkZXN0cm95OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIERlc3Ryb3lzIGRpcmVjdGl2ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXNbdGhpcy5wcm9wXS5pbmRleE9mKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXNbdGhpcy5wcm9wXS5zcGxpY2UoaW5kZXgsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5lbGVtZW50ID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3NhdmVMaW5rczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBTYXZlcyBsaW5rcyB0byBmdW5jdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zYXZlTGlua3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuZXZlbnRzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5ldmVudHNba2V5XTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wXSA9IHRoaXNbcHJvcF0uYmluZCh0aGlzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlRGlyZWN0aXZlO1xuXHQgICAgfSkoKTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBNYXAgb2YgZXZlbnRzXG5cdCAgICAgKiBAdHlwZSB7T2JqZWN0fVxuXHQgICAgICovXG5cdCAgICBGaWxlRGlyZWN0aXZlLnByb3RvdHlwZS5ldmVudHMgPSB7fTtcblxuXHQgICAgcmV0dXJuIEZpbGVEaXJlY3RpdmU7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtdO1xuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxuXHR2YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEZpbGVEaXJlY3RpdmUpIHtcblx0ICAgIHZhciBGaWxlU2VsZWN0ID0gKGZ1bmN0aW9uIChfRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgaW5zdGFuY2Ugb2Yge0ZpbGVTZWxlY3R9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlU2VsZWN0KG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVTZWxlY3QpO1xuXG5cdCAgICAgICAgICAgIHZhciBleHRlbmRlZE9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgLy8gTWFwIG9mIGV2ZW50c1xuXHQgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgJGRlc3Ryb3k6IFwiZGVzdHJveVwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogXCJvbkNoYW5nZVwiXG5cdCAgICAgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICAgICAgLy8gTmFtZSBvZiBwcm9wZXJ0eSBpbnNpZGUgdXBsb2FkZXIuX2RpcmVjdGl2ZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgIHByb3A6IFwic2VsZWN0XCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZVNlbGVjdC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcywgZXh0ZW5kZWRPcHRpb25zKTtcblxuXHQgICAgICAgICAgICBpZiAoIXRoaXMudXBsb2FkZXIuaXNIVE1MNSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHIoXCJtdWx0aXBsZVwiKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aGlzLmVsZW1lbnQucHJvcChcInZhbHVlXCIsIG51bGwpOyAvLyBGRiBmaXhcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfaW5oZXJpdHMoRmlsZVNlbGVjdCwgX0ZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVTZWxlY3QsIHtcblx0ICAgICAgICAgICAgZ2V0T3B0aW9uczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ3x1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZpbHRlcnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpc0VtcHR5QWZ0ZXJTZWxlY3Rpb246IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSWYgcmV0dXJucyBcInRydWVcIiB0aGVuIEhUTUxJbnB1dEVsZW1lbnQgd2lsbCBiZSBjbGVhcmVkXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNFbXB0eUFmdGVyU2VsZWN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXRoaXMuZWxlbWVudC5hdHRyKFwibXVsdGlwbGVcIik7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEV2ZW50IGhhbmRsZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVzID0gdGhpcy51cGxvYWRlci5pc0hUTUw1ID8gdGhpcy5lbGVtZW50WzBdLmZpbGVzIDogdGhpcy5lbGVtZW50WzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLmdldEZpbHRlcnMoKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy51cGxvYWRlci5pc0hUTUw1KSB0aGlzLmRlc3Ryb3koKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLmFkZFRvUXVldWUoZmlsZXMsIG9wdGlvbnMsIGZpbHRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHlBZnRlclNlbGVjdGlvbigpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wcm9wKFwidmFsdWVcIiwgbnVsbCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuY2xvbmUodHJ1ZSkpOyAvLyBJRSBmaXhcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlU2VsZWN0O1xuXHQgICAgfSkoRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgIHJldHVybiBGaWxlU2VsZWN0O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlRGlyZWN0aXZlXCJdO1xuXG4vKioqLyB9LFxuLyogOCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxuXHR2YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXHR2YXIgZm9yRWFjaCA9IGFuZ3VsYXIuZm9yRWFjaDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZURyb3AgPSAoZnVuY3Rpb24gKF9GaWxlRGlyZWN0aXZlKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURyb3B9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlRHJvcChvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlRHJvcCk7XG5cblx0ICAgICAgICAgICAgdmFyIGV4dGVuZGVkT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICAvLyBNYXAgb2YgZXZlbnRzXG5cdCAgICAgICAgICAgICAgICBldmVudHM6IHtcblx0ICAgICAgICAgICAgICAgICAgICAkZGVzdHJveTogXCJkZXN0cm95XCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJvcDogXCJvbkRyb3BcIixcblx0ICAgICAgICAgICAgICAgICAgICBkcmFnb3ZlcjogXCJvbkRyYWdPdmVyXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJhZ2xlYXZlOiBcIm9uRHJhZ0xlYXZlXCJcblx0ICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAvLyBOYW1lIG9mIHByb3BlcnR5IGluc2lkZSB1cGxvYWRlci5fZGlyZWN0aXZlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgcHJvcDogXCJkcm9wXCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZURyb3AucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVEcm9wLCBfRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZURyb3AsIHtcblx0ICAgICAgICAgICAgZ2V0T3B0aW9uczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ3x1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZpbHRlcnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkRyb3A6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyb3AoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmZXIgPSB0aGlzLl9nZXRUcmFuc2ZlcihldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0cmFuc2Zlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfXZhciBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLmdldEZpbHRlcnMoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX3JlbW92ZU92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5hZGRUb1F1ZXVlKHRyYW5zZmVyLmZpbGVzLCBvcHRpb25zLCBmaWx0ZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25EcmFnT3Zlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBFdmVudCBoYW5kbGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmZXIgPSB0aGlzLl9nZXRUcmFuc2ZlcihldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYXZlRmlsZXModHJhbnNmZXIudHlwZXMpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9dHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZlbnRBbmRTdG9wKGV2ZW50KTtcblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXMub3ZlciwgdGhpcy5fYWRkT3ZlckNsYXNzLCB0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25EcmFnTGVhdmU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyYWdMZWF2ZShldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0ID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH10aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX3JlbW92ZU92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRUcmFuc2Zlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBIZWxwZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRyYW5zZmVyKGV2ZW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmRhdGFUcmFuc2ZlciA/IGV2ZW50LmRhdGFUcmFuc2ZlciA6IGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyOyAvLyBqUXVlcnkgZml4O1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcHJldmVudEFuZFN0b3A6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSGVscGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcmV2ZW50QW5kU3RvcChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9oYXZlRmlsZXM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB0eXBlcyBjb250YWlucyBmaWxlc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHR5cGVzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9oYXZlRmlsZXModHlwZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB9aWYgKHR5cGVzLmluZGV4T2YpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVzLmluZGV4T2YoXCJGaWxlc1wiKSAhPT0gLTE7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlcy5jb250YWlucykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZXMuY29udGFpbnMoXCJGaWxlc1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfYWRkT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRPdmVyQ2xhc3MoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkT3ZlckNsYXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9yZW1vdmVPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbW92ZU92ZXJDbGFzcyhpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmVPdmVyQ2xhc3MoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgcmV0dXJuIEZpbGVEcm9wO1xuXHQgICAgfSkoRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgIHJldHVybiBGaWxlRHJvcDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiRmlsZURpcmVjdGl2ZVwiXTtcblxuLyoqKi8gfSxcbi8qIDkgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cblx0dmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZU92ZXIgPSAoZnVuY3Rpb24gKF9GaWxlRGlyZWN0aXZlKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURyb3B9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlT3ZlcihvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlT3Zlcik7XG5cblx0ICAgICAgICAgICAgdmFyIGV4dGVuZGVkT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICAvLyBNYXAgb2YgZXZlbnRzXG5cdCAgICAgICAgICAgICAgICBldmVudHM6IHtcblx0ICAgICAgICAgICAgICAgICAgICAkZGVzdHJveTogXCJkZXN0cm95XCJcblx0ICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAvLyBOYW1lIG9mIHByb3BlcnR5IGluc2lkZSB1cGxvYWRlci5fZGlyZWN0aXZlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgcHJvcDogXCJvdmVyXCIsXG5cdCAgICAgICAgICAgICAgICAvLyBPdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICBvdmVyQ2xhc3M6IFwibnYtZmlsZS1vdmVyXCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZU92ZXIucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVPdmVyLCBfRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZU92ZXIsIHtcblx0ICAgICAgICAgICAgYWRkT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEFkZHMgb3ZlciBjbGFzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRPdmVyQ2xhc3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMuZ2V0T3ZlckNsYXNzKCkpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmVPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlcyBvdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZU92ZXJDbGFzcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3ModGhpcy5nZXRPdmVyQ2xhc3MoKSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGdldE92ZXJDbGFzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG92ZXIgY2xhc3Ncblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE92ZXJDbGFzcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vdmVyQ2xhc3M7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlT3Zlcjtcblx0ICAgIH0pKEZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICByZXR1cm4gRmlsZU92ZXI7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIkZpbGVEaXJlY3RpdmVcIl07XG5cbi8qKiovIH0sXG4vKiAxMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkcGFyc2UsIEZpbGVVcGxvYWRlciwgRmlsZVNlbGVjdCkge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlU2VsZWN0KHtcblx0ICAgICAgICAgICAgICAgIHVwbG9hZGVyOiB1cGxvYWRlcixcblx0ICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgb2JqZWN0LmdldE9wdGlvbnMgPSAkcGFyc2UoYXR0cmlidXRlcy5vcHRpb25zKS5iaW5kKG9iamVjdCwgc2NvcGUpO1xuXHQgICAgICAgICAgICBvYmplY3QuZ2V0RmlsdGVycyA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmZpbHRlcnM7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHBhcnNlXCIsIFwiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZVNlbGVjdFwiXTtcblxuLyoqKi8gfSxcbi8qIDExICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRwYXJzZSwgRmlsZVVwbG9hZGVyLCBGaWxlRHJvcCkge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYgKCF1cGxvYWRlci5pc0hUTUw1KSByZXR1cm47XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlRHJvcCh7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPcHRpb25zID0gJHBhcnNlKGF0dHJpYnV0ZXMub3B0aW9ucykuYmluZChvYmplY3QsIHNjb3BlKTtcblx0ICAgICAgICAgICAgb2JqZWN0LmdldEZpbHRlcnMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIiRwYXJzZVwiLCBcIkZpbGVVcGxvYWRlclwiLCBcIkZpbGVEcm9wXCJdO1xuXG4vKioqLyB9LFxuLyogMTIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoRmlsZVVwbG9hZGVyLCBGaWxlT3Zlcikge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlT3Zlcih7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPdmVyQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5vdmVyQ2xhc3MgfHwgb2JqZWN0Lm92ZXJDbGFzcztcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlVXBsb2FkZXJcIiwgXCJGaWxlT3ZlclwiXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5ndWxhci1maWxlLXVwbG9hZC5qcy5tYXBcbiIsIi8vIC0tQXV0aG9yIE11cmFnaWppbWFuYSBSaWNoYXJkIDxiZWFzdGFyNDU3QGdtYWlsLmNvbT5cbi8vIHZhciBzeW5jID0gYW5ndWxhci5tb2R1bGUoXCJzeW5jXCIsIFtcIm5nUm91dGVcIixcImFuZ3VsYXJGaWxlVXBsb2FkXCIsXCJpb25pY1wiLFwibmdSZXNvdXJjZVwiLFwidWkuYm9vdHN0cmFwXCIsXCJpbmZpbml0ZS1zY3JvbGxcIl0pO1xuYW5ndWxhci5tb2R1bGUoJ0F1dGhNYW5hZ2VyJyxbXSkuc2VydmljZSgnU2Vzc2lvblNlcnZpY2UnLCBbZnVuY3Rpb24oKXtcbiAgICB2YXIgdXNlcklzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRVc2VyQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdXNlcklzQXV0aGVudGljYXRlZCA9IHZhbHVlO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXJBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHVzZXJJc0F1dGhlbnRpY2F0ZWQ7XG4gICAgfTtcbn1dKTtcblxudmFyIHN5bmMgPSBhbmd1bGFyLm1vZHVsZShcInN5bmNcIiwgW1wibmdSb3V0ZVwiLFwiYW5ndWxhckZpbGVVcGxvYWRcIixcInVpLmJvb3RzdHJhcFwiLFwidWkucm91dGVyXCIsXCJpbmZpbml0ZS1zY3JvbGxcIiwnbmdNYXRlcmlhbCcsICduZ01lc3NhZ2VzJywgJ21hdGVyaWFsLnN2Z0Fzc2V0c0NhY2hlJywnbmctbWZiJywncGRmJywnbmdDb250ZXh0TWVudScsJ2FuZ3VsYXItbG9hZGluZy1iYXInLCduZ0ZpbGVTYXZlcicsJ0F1dGhNYW5hZ2VyJywnbmdEaWFsb2cnXSk7XG5cblxudmFyIExvZ2dlcj1hbmd1bGFyLm1vZHVsZShcIkxvZ2dlclwiLFtdKTtcbkxvZ2dlci5ydW4oWyckcm9vdFNjb3BlJyxmdW5jdGlvbigkcm9vdFNjb3BlKXtcblxuICAgICAgLy8gJHJvb3RTY29wZS5lbmRQb2ludD0naHR0cHM6Ly9zdHJlYW11cGJveC5jb20nO1xuICAgICAgJHJvb3RTY29wZS5lbmRQb2ludD0naHR0cDovL3N5bmNtZS5jb206ODAwMCc7XG59XSk7XG53aW5kb3cucm91dGVzID1cbntcbiAgICBcIi9GaWxlc1wiOiB7XG4gICAgICAgIHVybDogXCIvRmlsZXNcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9maWxlcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0ZpbGVzQ29udHJvbGxlcicsXG4gICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgfSxcbiAgICAgIFwicHJldmlld1wiOntcbiAgICAgICAgdXJsOiAnLyEvOnByZXZpZXcvOmV4dGVuc2lvbi86b2YvOnVzZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2ZpbGVQcmV2aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyIDogJ3ByZXZpZXdDb250cm9sbGVyJ1xuICAgICAgfSxcblxuICAgICAgXCIvR3JvdXBzXCI6IHtcbiAgICAgICAgICB1cmw6IFwiL0dyb3Vwc1wiLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZ3JvdXBzLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdHcm91cENvbnRyb2xsZXInLFxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgfVxufTtcblxuXG5zeW5jLnJ1bihbJyRyb290U2NvcGUnLCckbG9nJyxmdW5jdGlvbigkcm9vdFNjb3BlLCRsb2cpe1xuICAkcm9vdFNjb3BlLmVuZFBvaW50PSdodHRwOi8vc3luY21lLmNvbTo4MDAwJztcbiAgIC8vICRyb290U2NvcGUuZW5kUG9pbnQ9J2h0dHBzOi8vc3RyZWFtdXBib3guY29tJztcblxuXG4gICRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsZnVuY3Rpb24oZXZlbnQsIG5leHQsIGN1cnJlbnQpe1xuICAgIGZvcih2YXIgaSBpbiB3aW5kb3cucm91dGVzKSB7XG5cbiAgICAgICAgaWYobmV4dC5pbmRleE9mKGkpICE9IC0xKSB7XG4gICAgICAgICAgICBpZih3aW5kb3cucm91dGVzW2ldLnJlcXVpcmVMb2dpbiAmJiAhU2Vzc2lvblNlcnZpY2UuZ2V0VXNlckF1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiWW91IG5lZWQgdG8gYmUgYXV0aGVudGljYXRlZCB0byBzZWUgdGhpcyBwYWdlIVwiKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG4gIH0pO1xufV0pO1xuc3luYy5wcm92aWRlcih7XG5cbiAgICAkZXhjZXB0aW9uSGFuZGxlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbihleGNlcHRpb24sIGNhdXNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXhjZXB0aW9uKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXI7XG4gICAgICAgIH07XG4gICAgfVxufSk7XG5zeW5jLmNvbmZpZyhbJyRzY2VQcm92aWRlcicsJyRodHRwUHJvdmlkZXInLCckbWRUaGVtaW5nUHJvdmlkZXInLCdjZnBMb2FkaW5nQmFyUHJvdmlkZXInLGZ1bmN0aW9uKCRzY2VQcm92aWRlciwkaHR0cFByb3ZpZGVyLCRtZFRoZW1pbmdQcm92aWRlcixjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIHtcbiAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydBY2NlcHQnXSA9ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnO1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydBY2NlcHQnXSA9ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnO1xuICAgIC8vc2V0IGF1dGhvcml6YXRpb24gZm9yIG9hdXRoMi4wIGZvciBwcm90ZWN0aW9uXG5cblxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ2F1dGhvcml6YXRpb24nXSA9ICdCZWFyZXIgQmM3RFdTN0tLUkx0eG1kZFVaSTFUMWxadTJKMVloUjhPTFhHV05abic7XG5cbiAgICAvLyAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xuICAgICRzY2VQcm92aWRlci5lbmFibGVkKGZhbHNlKTtcblxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlQmFyID0gZmFsc2U7XG59XSk7XG5zeW5jLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywnJHVybFJvdXRlclByb3ZpZGVyJyxmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCRzY29wZSl7XG4gICAgICAgIC8vICRwYXJzZVByb3ZpZGVyLnVud3JhcFByb21pc2VzKHRydWUpIDtcbiAgICAgICAgICBmb3IodmFyIHBhdGggaW4gd2luZG93LnJvdXRlcykge1xuXG4gICAgICAgICAgICAgIC8vIGlmKG5leHQuaW5kZXhPZihwYXRoKSAhPSAtMSkge1xuICAgICAgICAgICAgICAvLyAgICAgaWYod2luZG93LnJvdXRlc1twYXRoXS5yZXF1aXJlTG9naW4gJiYgIVNlc3Npb25TZXJ2aWNlLmdldFVzZXJBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgLy8gICAgICAgICBhbGVydChcIllvdSBuZWVkIHRvIGJlIGF1dGhlbnRpY2F0ZWQgdG8gc2VlIHRoaXMgcGFnZSFcIik7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwYXRoLCB3aW5kb3cucm91dGVzW3BhdGhdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvRmlsZXMnKTtcblxufV0pO1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLWRvbmUgd2l0aCBNdXJhZ2lqaW1hbmEgUmljaGFyZCA8YmVhc3RhcjQ1N0BnbWFpbC5jb20+LS0tLS0tLS0tLS0tLS0tLy9cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1kZWFsIHdpdGggdXNlcidzIGFjdGlvbnMgYW5kIGludGVyYWN0aW9uIHdpdGggb3RoZXIgdXNlcnMtLS0tLS0tLS0tLS0tLS0vL1xuIiwiOyhmdW5jdGlvbih3aW5kb3csIGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbWZiID0gYW5ndWxhci5tb2R1bGUoJ25nLW1mYicsIFtdKTtcblxuICBtZmIucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbmctbWZiLW1lbnUtZGVmYXVsdC50cGwuaHRtbCcsXG4gICAgICAnPHVsIGNsYXNzPVwibWZiLWNvbXBvbmVudC0te3twb3NpdGlvbn19IG1mYi17e2VmZmVjdH19XCInICtcbiAgICAgICcgICAgZGF0YS1tZmItdG9nZ2xlPVwie3t0b2dnbGluZ01ldGhvZH19XCIgZGF0YS1tZmItc3RhdGU9XCJ7e21lbnVTdGF0ZX19XCI+JyArXG4gICAgICAnICA8bGkgY2xhc3M9XCJtZmItY29tcG9uZW50X193cmFwXCI+JyArXG4gICAgICAnICAgIDxhIG5nLWNsaWNrPVwiY2xpY2tlZCgpXCIgbmctbW91c2VlbnRlcj1cImhvdmVyZWQoKVwiIG5nLW1vdXNlbGVhdmU9XCJob3ZlcmVkKClcIicgK1xuICAgICAgJyAgICAgICBuZy1hdHRyLWRhdGEtbWZiLWxhYmVsPVwie3tsYWJlbH19XCIgY2xhc3M9XCJtZmItY29tcG9uZW50X19idXR0b24tLW1haW5cIj4nICtcbiAgICAgICcgICAgIDxpIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fbWFpbi1pY29uLS1yZXN0aW5nIHt7cmVzdGluZ319XCI+PC9pPicgK1xuICAgICAgJyAgICAgPGkgY2xhc3M9XCJtZmItY29tcG9uZW50X19tYWluLWljb24tLWFjdGl2ZSB7e2FjdGl2ZX19XCI+PC9pPicgK1xuICAgICAgJyAgICA8L2E+JyArXG4gICAgICAnICAgIDx1bCBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2xpc3RcIiBuZy10cmFuc2NsdWRlPicgK1xuICAgICAgJyAgICA8L3VsPicgK1xuICAgICAgJzwvbGk+JyArXG4gICAgICAnPC91bD4nXG4gICAgKTtcblxuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbmctbWZiLW1lbnUtbWQudHBsLmh0bWwnLFxuICAgICAgJzx1bCBjbGFzcz1cIm1mYi1jb21wb25lbnQtLXt7cG9zaXRpb259fSBtZmIte3tlZmZlY3R9fVwiJyArXG4gICAgICAnICAgIGRhdGEtbWZiLXRvZ2dsZT1cInt7dG9nZ2xpbmdNZXRob2R9fVwiIGRhdGEtbWZiLXN0YXRlPVwie3ttZW51U3RhdGV9fVwiPicgK1xuICAgICAgJyAgPGxpIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fd3JhcFwiPicgK1xuICAgICAgJyAgICA8YSBuZy1jbGljaz1cImNsaWNrZWQoKVwiIG5nLW1vdXNlZW50ZXI9XCJob3ZlcmVkKClcIiBuZy1tb3VzZWxlYXZlPVwiaG92ZXJlZCgpXCInICtcbiAgICAgICcgICAgICAgc3R5bGU9XCJiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgYm94LXNoYWRvdzogbm9uZTtcIicgK1xuICAgICAgJyAgICAgICBuZy1hdHRyLWRhdGEtbWZiLWxhYmVsPVwie3tsYWJlbH19XCIgY2xhc3M9XCJtZmItY29tcG9uZW50X19idXR0b24tLW1haW5cIj4nICtcbiAgICAgICcgICAgIDxtZC1idXR0b24gY2xhc3M9XCJtZC1mYWIgbWQtYWNjZW50XCIgYXJpYS1sYWJlbD17e2xhYmVsfX0gc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTsgbWFyZ2luOiAwOyBwYWRkaW5nOjA7XCI+JyArXG4gICAgICAnICAgICAgIDxtZC1pY29uIHN0eWxlPVwibGVmdDogMDsgcG9zaXRpb246IHJlbGF0aXZlO1wiIG1kLXN2Zy1pY29uPVwie3tyZXN0aW5nfX1cIicgK1xuICAgICAgJyAgICAgICAgIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fbWFpbi1pY29uLS1yZXN0aW5nXCI+PC9tZC1pY29uPicgK1xuICAgICAgJyAgICAgICA8bWQtaWNvbiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO1wiIG1kLXN2Zy1pY29uPVwie3thY3RpdmV9fVwiJyArXG4gICAgICAnICAgICAgICAgY2xhc3M9XCJtZmItY29tcG9uZW50X19tYWluLWljb24tLWFjdGl2ZVwiPjwvbWQtaWNvbj4nICtcbiAgICAgICcgICAgIDwvbWQtYnV0dG9uPicgK1xuICAgICAgJyAgICA8L2E+JyArXG4gICAgICAnICAgIDx1bCBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2xpc3RcIiBuZy10cmFuc2NsdWRlPicgK1xuICAgICAgJyAgICA8L3VsPicgK1xuICAgICAgJzwvbGk+JyArXG4gICAgICAnPC91bD4nXG4gICAgKTtcblxuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbmctbWZiLWJ1dHRvbi1kZWZhdWx0LnRwbC5odG1sJyxcbiAgICAgICc8bGk+JyArXG4gICAgICAnICA8YSBkYXRhLW1mYi1sYWJlbD1cInt7bGFiZWx9fVwiIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fYnV0dG9uLS1jaGlsZFwiPicgK1xuICAgICAgJyAgICA8aSBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2NoaWxkLWljb24ge3tpY29ufX1cIj4nICtcbiAgICAgICcgICAgPC9pPicgK1xuICAgICAgJyAgPC9hPicgK1xuICAgICAgJzwvbGk+J1xuICAgICk7XG5cbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ25nLW1mYi1idXR0b24tbWQudHBsLmh0bWwnLFxuICAgICAgJzxsaT4nICtcbiAgICAgICcgIDxhIGhyZWY9XCJcIiBkYXRhLW1mYi1sYWJlbD1cInt7bGFiZWx9fVwiIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fYnV0dG9uLS1jaGlsZFwiICcgK1xuICAgICAgJyAgICAgc3R5bGU9XCJiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgYm94LXNoYWRvdzogbm9uZTtcIj4nICtcbiAgICAgICcgICAgIDxtZC1idXR0b24gc3R5bGU9XCJtYXJnaW46IDA7XCIgY2xhc3M9XCJtZC1mYWIgbWQtYWNjZW50XCIgYXJpYS1sYWJlbD17e2xhYmVsfX0+JyArXG4gICAgICAnICAgICAgIDxtZC1pY29uIG1kLXN2Zy1zcmM9XCJpbWcvaWNvbnMvYW5kcm9pZC5zdmdcIj48L21kLWljb24+JyArXG4gICAgICAnICAgICAgIDxtZC1pY29uIG1kLXN2Zy1pY29uPVwie3tpY29ufX1cIj48L21kLWljb24+JyArXG4gICAgICAnICAgICA8L21kLWJ1dHRvbj4nICtcbiAgICAgICcgIDwvYT4nICtcbiAgICAgICc8L2xpPidcbiAgICApO1xuICB9XSk7XG5cbiAgbWZiLmRpcmVjdGl2ZSgnbWZiQnV0dG9uQ2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHJlcXVpcmU6ICdebWZiTWVudScsXG4gICAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIG1mYk1lbnVDb250cm9sbGVyKSB7XG4gICAgICAgICRlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbWZiTWVudUNvbnRyb2xsZXIuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgfSk7XG5cbiAgbWZiLmRpcmVjdGl2ZSgnbWZiTWVudScsIFsnJHRpbWVvdXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgcG9zaXRpb246ICdAJyxcbiAgICAgICAgZWZmZWN0OiAnQCcsXG4gICAgICAgIGxhYmVsOiAnQCcsXG4gICAgICAgIHJlc3Rpbmc6ICdAcmVzdGluZ0ljb24nLFxuICAgICAgICBhY3RpdmU6ICdAYWN0aXZlSWNvbicsXG4gICAgICAgIG1haW5BY3Rpb246ICcmJyxcbiAgICAgICAgbWVudVN0YXRlOiAnPT8nLFxuICAgICAgICB0b2dnbGluZ01ldGhvZDogJ0AnXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAnbmctbWZiLW1lbnUtZGVmYXVsdC50cGwuaHRtbCc7XG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGF0dHJzJywgZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMpIHtcbiAgICAgICAgdmFyIG9wZW5TdGF0ZSA9ICdvcGVuJyxcbiAgICAgICAgICBjbG9zZWRTdGF0ZSA9ICdjbG9zZWQnO1xuXG4gICAgICAgIC8vIEF0dGFjaGVkIHRvZ2dsZSwgb3BlbiBhbmQgY2xvc2UgdG8gdGhlIGNvbnRyb2xsZXIgdG8gZ2l2ZSBvdGhlclxuICAgICAgICAvLyBkaXJlY3RpdmUgYWNjZXNzXG4gICAgICAgIHRoaXMudG9nZ2xlID0gdG9nZ2xlO1xuICAgICAgICB0aGlzLmNsb3NlID0gY2xvc2U7XG4gICAgICAgIHRoaXMub3BlbiA9IG9wZW47XG5cbiAgICAgICAgJHNjb3BlLmNsaWNrZWQgPSBjbGlja2VkO1xuICAgICAgICAkc2NvcGUuaG92ZXJlZCA9IGhvdmVyZWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgc3RhdGUgdG8gdXNlci1kZWZpbmVkIHZhbHVlLiBGYWxsYmFjayB0byBjbG9zZWQgaWYgbm9cbiAgICAgICAgICogdmFsdWUgaXMgcGFzc2VkIGZyb20gdGhlIG91dHNpZGUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoISRzY29wZS5tZW51U3RhdGUpIHtcbiAgICAgICAgICAkc2NvcGUubWVudVN0YXRlID0gY2xvc2VkU3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgb24gdG91Y2ggZGV2aWNlIEFORCAnaG92ZXInIG1ldGhvZCBpcyBzZWxlY3RlZDpcbiAgICAgICAgICogd2FpdCBmb3IgdGhlIGRpZ2VzdCB0byBwZXJmb3JtIGFuZCB0aGVuIGNoYW5nZSBob3ZlciB0byBjbGljay5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChfaXNUb3VjaERldmljZSgpICYmIF9pc0hvdmVyQWN0aXZlKCkpIHtcbiAgICAgICAgICAkdGltZW91dCh1c2VDbGljayk7XG4gICAgICAgIH1cblxuICAgICAgICAkYXR0cnMuJG9ic2VydmUoJ21lbnVTdGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5jdXJyZW50U3RhdGUgPSAkc2NvcGUubWVudVN0YXRlO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBjbGlja2VkKCkge1xuICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgbWFpbiBhY3Rpb24sIGxldCdzIGZpcmUgaXRcbiAgICAgICAgICBpZiAoJHNjb3BlLm1haW5BY3Rpb24pIHtcbiAgICAgICAgICAgICRzY29wZS5tYWluQWN0aW9uKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFfaXNIb3ZlckFjdGl2ZSgpKSB7XG4gICAgICAgICAgICB0b2dnbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gaG92ZXJlZCgpIHtcbiAgICAgICAgICBpZiAoX2lzSG92ZXJBY3RpdmUoKSkge1xuICAgICAgICAgICAgLy90b2dnbGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludmVydCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgbWVudS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcbiAgICAgICAgICBpZiAoJHNjb3BlLm1lbnVTdGF0ZSA9PT0gb3BlblN0YXRlKSB7XG4gICAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcGVuKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlbigpIHtcbiAgICAgICAgICAkc2NvcGUubWVudVN0YXRlID0gb3BlblN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgICAgJHNjb3BlLm1lbnVTdGF0ZSA9IGNsb3NlZFN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIHdlJ3JlIG9uIGEgdG91Y2gtZW5hYmxlZCBkZXZpY2UuXG4gICAgICAgICAqIFJlcXVpcmVzIE1vZGVybml6ciB0byBydW4sIG90aGVyd2lzZSBzaW1wbHkgcmV0dXJucyBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzVG91Y2hEZXZpY2UoKSB7XG4gICAgICAgICAgcmV0dXJuIHdpbmRvdy5Nb2Rlcm5penIgJiYgTW9kZXJuaXpyLnRvdWNoO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2lzSG92ZXJBY3RpdmUoKSB7XG4gICAgICAgICAgcmV0dXJuICRzY29wZS50b2dnbGluZ01ldGhvZCA9PT0gJ2hvdmVyJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb252ZXJ0IHRoZSB0b2dnbGluZyBtZXRob2QgdG8gJ2NsaWNrJy5cbiAgICAgICAgICogVGhpcyBpcyB1c2VkIHdoZW4gJ2hvdmVyJyBpcyBzZWxlY3RlZCBieSB0aGUgdXNlclxuICAgICAgICAgKiBidXQgYSB0b3VjaCBkZXZpY2UgaXMgZW5hYmxlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHVzZUNsaWNrKCkge1xuICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUudG9nZ2xpbmdNZXRob2QgPSAnY2xpY2snO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH07XG4gIH1dKTtcblxuICBtZmIuZGlyZWN0aXZlKCdtZmJCdXR0b24nLCBbZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmU6ICdebWZiTWVudScsXG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgaWNvbjogJ0AnLFxuICAgICAgICBsYWJlbDogJ0AnXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVVcmw6IGZ1bmN0aW9uKGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAnbmctbWZiLWJ1dHRvbi1kZWZhdWx0LnRwbC5odG1sJztcbiAgICAgIH1cbiAgICB9O1xuICB9XSk7XG5cbn0pKHdpbmRvdywgYW5ndWxhcik7XG4iLCJzeW5jLmRpcmVjdGl2ZSgnbGVmdE1lbnUnLGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgZGF0YTogJz0nLFxuICAgICAgICAgICAgdXNlcjogJz0nLFxuICAgICAgICAgICAgdHlwZTogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcImRpcmVjdGl2ZXMvbGVmdE1lbnUuaHRtbFwiXG4gICAgfTtcbn0pO1xuc3luYy5kaXJlY3RpdmUoJ2ZlZWRzJyxmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0FFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIHBvc3RzOiAnPScsXG4gICAgICAgICAgICByZXBsaWVzOiAnPScsXG4gICAgICAgICAgICBjcmVhdGVQb3N0Oic9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJkaXJlY3RpdmVzL21pZGRsZUNvbnRlbnQuaHRtbFwiXG4gICAgfTtcbn0pO1xuc3luYy5kaXJlY3RpdmUoJ2hlYWRlcicsZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBkYXRhOiAnPScsXG4gICAgICAgICAgICB1c2VyOiAnPScsXG4gICAgICAgICAgICB0eXBlOiAnPSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiLi9kaXJlY3RpdmVzL2hlYWRlci5odG1sXCJcblxuICAgIH07XG59KTtcblxuXG5zeW5jLmRpcmVjdGl2ZSgna2V5YmluZGluZycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgaW52b2tlOiAnJidcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbCwgYXR0cikge1xuICAgICAgICAgICAgTW91c2V0cmFwLmJpbmQoYXR0ci5vbiwgc2NvcGUuaW52b2tlKTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsIi8qIGdsb2JhbCAkd2luZG93ICovXG4vKiBnbG9iYWwgTG9nZ2VyICovXG5cbkxvZ2dlci5jb250cm9sbGVyKCdsb2dpbkNvbnRyb2xsZXInLFsnJHNjb3BlJywnJGh0dHAnLCckcm9vdFNjb3BlJywnJHdpbmRvdycsIGZ1bmN0aW9uICgkc2NvcGUsJGh0dHAsJHJvb3RTY29wZSwkd2luZG93KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICdjcmVkZWRlbnRpYWwtbm90LWZvdW5kJyAgICAgICA6ICdDcmVkZW50aWFscyBub3QgZm91bmQhJyxcbiAgICAgICAgJ3N1Y2Nlc3MnICAgICAgICAgICAgICAgICAgICAgIDogJ2xvZ2dpbmcgaW4uLi4nXG4gICAgfTtcbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKGluZm8pXG4gIHtcbiAgICAvL2JlZm9yZSBub3RpZnkgdGhhdCB3ZSBhcmUgbG9nZ2luZ2luXG4gICAgJCgnLmxvZ2luLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgc3VjY2VzcycpLmh0bWwob3B0aW9uc1snc3VjY2VzcyddKTtcbiAgICAkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL3Nlc3Npb25zJyxpbmZvKVxuICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICBpZihyZXNwb25zZSA9PT1cIjFcIil7XG4gICAgICAgICAgICBSZWRpcmVjdGluZygpO1xuXG4gICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlID09PSBcIjBcIil7XG4gICAgICAgICAgICAgJCgnLmxvZ2luLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgZXJyb3InKS5odG1sKG9wdGlvbnNbJ2NyZWRlZGVudGlhbC1ub3QtZm91bmQnXSk7XG4gICAgICAgIH1lbHNlIGlmKHJlc3BvbnNlID09PSBcIm5vdFZlcmlmaWVkXCIpe1xuICAgICAgICAgICAgbm90VmVyaWZpZWQoKTtcbiAgICAgICAgfVxuICAgIH0pXG4gICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjonKyBlcnJvcik7XG4gICAgfSlcbiAgICBmdW5jdGlvbiBub3RWZXJpZmllZCgpe1xuICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9ub3RWZXJpZmllZCc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIFJlZGlyZWN0aW5nKCl7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvc3luYyc7XG4gICAgfVxuICB9XG59XSk7XG4iLCJMb2dnZXIuY29udHJvbGxlcignUmVnaXN0ZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCckcm9vdFNjb3BlJywnJGh0dHAnLGZ1bmN0aW9uICgkc2NvcGUsJHJvb3RTY29wZSwkaHR0cCkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAncGFzc3dvcmQtbm90TWF0Y2gnOiAncGFzc3dvcmQgZG8gbm90IG1hdGNoJyxcbiAgICAgICAgJ1NpZ25VcEluUHJvZ3Jlc3MnIDogJ1dhaXQgd2UgYXJlIHNldHRpbmcgdXAgeW91ciBhY2NvdW50LidcbiAgICB9O1xuICAgICRzY29wZS5yZWdpc3Rlcj1mdW5jdGlvbih1c2VyKXtcbiAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IHN1Y2Nlc3MnKS5odG1sKG9wdGlvbnNbJ1NpZ25VcEluUHJvZ3Jlc3MnXSk7XG4gICAgICAgIGlmKCQoJyNwYXNzd29yZCcpLnZhbCgpICE9ICQoJyNwYXNzd29yZC1jb25maXJtJykudmFsKCkpe1xuICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IGVycm9yJykuaHRtbChvcHRpb25zWydwYXNzd29yZC1ub3RNYXRjaCddKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KG1lc3NhZ2VSZW1vdmUsIDIwMDApO1xuICAgICAgICAgIGZ1bmN0aW9uIG1lc3NhZ2VSZW1vdmUoKXtcbiAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgZXJyb3InKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB1c2VybmFtZT0kKCcjdXNlcm5hbWUnKS52YWwoKTtcbiAgICAgICAgdmFyIGVtYWlsPSQoJyNlbWFpbCcpLnZhbCgpO1xuXG5cbiAgICAgICAgalF1ZXJ5LnBvc3QoJy9zZXNzaW9ucycsIHt1c2VybmFtZTogdXNlcm5hbWUsIHBhc3N3b3JkOnVzZXIucGFzc3dvcmQsIGVtYWlsOmVtYWlsLCBvcHRpb246dXNlci5vcHRpb24sIHBob25lOnVzZXIucGhvbmV9LCBmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzLCB4aHIpIHtcbiAgICAgICAgICAgIGlmKGRhdGEgPT0gMSl7XG4gICAgICAgICAgICAgICAgIFJlZGlyZWN0aW5nKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZihkYXRhID09MCl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3dlIGFyZSBmaXJlZCB0aGlzIGNhbiBub3QgaGFwcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZ1bmN0aW9uIFJlZGlyZWN0aW5nKCl7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnL2NoZWNrRW1haWwnO1xuICAgICAgICB9XG4gICAgfVxufV0pO1xuXG5Mb2dnZXIuZGlyZWN0aXZlKCd1bmlxdWVVc2VybmFtZScsIFsnaXNVc2VybmFtZUF2YWlsYWJsZScsZnVuY3Rpb24oaXNVc2VybmFtZUF2YWlsYWJsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRhc3luY1ZhbGlkYXRvcnMudW5pcXVlVXNlcm5hbWUgPSBpc1VzZXJuYW1lQXZhaWxhYmxlO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcbkxvZ2dlci5mYWN0b3J5KCdpc1VzZXJuYW1lQXZhaWxhYmxlJywgWyckcScsJyRodHRwJywnJHJvb3RTY29wZScsZnVuY3Rpb24oJHEsICRodHRwLCRyb290U2NvcGUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgJ2J0bi1sb2FkaW5nJzogJzxpIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT4nLFxuICAgICAgICAnYnRuLXN1Y2Nlc3MnOiAnPGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT4nLFxuICAgICAgICAnYnRuLWVycm9yJzogJzxpIGNsYXNzPVwiZmEgZmEtcmVtb3ZlXCI+PC9pPicsXG4gICAgICAgICdtc2ctc3VjY2Vzcyc6ICdBbGwgR29vZCEgUmVkaXJlY3RpbmcuLi4nLFxuICAgICAgICAnbXNnLXVzZXJuYW1lLWF2YWlsYWJsZSc6ICdnb29kIHVzZXJuYW1lIGF2YWlsYWJsZSEnLFxuICAgICAgICAnbXNnLXVzZXJuYW1lLXRha2VuJyAgICA6ICdvb3BzIHVzZXJuYW1lIHRha2VuJyxcbiAgICAgICAgJ21zZy1lbWFpbC10YWtlbicgICAgICAgOiAnZW1haWwgdGFrZW4nLFxuICAgICAgICAnbXNnLXlvdXItcGhvbmUtc3VjaycgICA6ICd5b3VyIHBob25lIGlzIG5vdCB2YWxpZCcsXG4gICAgICAgICd1c2VBSkFYJzogdHJ1ZSxcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbih1c2VybmFtZSkge1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS91c2Vycz91c2VybmFtZT0nICsgdXNlcm5hbWUgKyAnJmFjY2Vzc190b2tlbj1CYzdEV1M3S0tSTHR4bWRkVVpJMVQxbFp1MkoxWWhSOE9MWEdXTlpuJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmKGRhdGE9PSdhdmFpbGFibGUnKXtcbiAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBzdWNjZXNzJykuaHRtbChvcHRpb25zWydtc2ctdXNlcm5hbWUtYXZhaWxhYmxlJ10pO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQobWVzc2FnZVJlbW92ZSwgMjAwMCk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbWVzc2FnZVJlbW92ZSgpe1xuICAgICAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5yZW1vdmVDbGFzcygnc2hvdyBzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYoZGF0YT09J3Rha2VuJyl7XG4gICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgZXJyb3InKS5odG1sKG9wdGlvbnNbJ21zZy11c2VybmFtZS10YWtlbiddKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHVzZXJuYW1lVGFrZW4sIDIwMDApO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHVzZXJuYW1lVGFrZW4oKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbn1dKTtcbkxvZ2dlci5kaXJlY3RpdmUoJ3VuaXF1ZUVtYWlsJywgWydpc0VtYWlsQXZhaWxhYmxlJyxmdW5jdGlvbihpc0VtYWlsQXZhaWxhYmxlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgIG5nTW9kZWwuJGFzeW5jVmFsaWRhdG9ycy51bmlxdWVFbWFpbCA9IGlzRW1haWxBdmFpbGFibGU7XG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuTG9nZ2VyLmZhY3RvcnkoJ2lzRW1haWxBdmFpbGFibGUnLCBbJyRxJywnJGh0dHAnLCckcm9vdFNjb3BlJyxmdW5jdGlvbiAoJHEsICRodHRwLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICdidG4tbG9hZGluZyc6ICc8aSBjbGFzcz1cImZhIGZhLXNwaW5uZXIgZmEtcHVsc2VcIj48L2k+JyxcbiAgICAgICAgJ2J0bi1zdWNjZXNzJzogJzxpIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgJ2J0bi1lcnJvcic6ICc8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiPjwvaT4nLFxuICAgICAgICAnbXNnLXN1Y2Nlc3MnOiAnQWxsIEdvb2QhIFJlZGlyZWN0aW5nLi4uJyxcbiAgICAgICAgJ21zZy11c2VybmFtZS1hdmFpbGFibGUnOiAnZ29vZCB1c2VybmFtZSBhdmFpbGFibGUhJyxcbiAgICAgICAgJ21zZy11c2VybmFtZS10YWtlbicgICAgOiAnb29wcyB1c2VybmFtZSB0YWtlbicsXG4gICAgICAgICdtc2ctZW1haWwtdGFrZW4nICAgICAgIDogJ2VtYWlsIHRha2VuJyxcbiAgICAgICAgJ21zZy1lbWFpbC1hdmFpbGFibGUnICAgOiAnZW1haWwgYXZhaWxhYmxlJyxcbiAgICAgICAgJ21zZy15b3VyLXBob25lLXN1Y2snICAgOiAneW91ciBwaG9uZSBpcyBub3QgdmFsaWQnLFxuICAgICAgICAndXNlQUpBWCc6IHRydWUsXG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL3VzZXJzP2VtYWlsPScgKyBlbWFpbCArICcmYWNjZXNzX3Rva2VuPUJjN0RXUzdLS1JMdHhtZGRVWkkxVDFsWnUySjFZaFI4T0xYR1dOWm4nKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuXG4gICAgICAgICAgICBpZihkYXRhPT0nZW1haWwtYXZhaWxhYmxlJyl7XG4gICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgc3VjY2VzcycpLmh0bWwob3B0aW9uc1snbXNnLWVtYWlsLWF2YWlsYWJsZSddKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG1lc3NhZ2VSZW1vdmUsIDIwMDApO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG1lc3NhZ2VSZW1vdmUoKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfWVsc2UgaWYoZGF0YT09J2VtYWlsLXRha2VuJyl7XG4gICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgZXJyb3InKS5odG1sKG9wdGlvbnNbJ21zZy1lbWFpbC10YWtlbiddKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG1lc3NhZ2VFbWFpbFRha2VuLCAyMDAwKTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBtZXNzYWdlRW1haWxUYWtlbigpe1xuICAgICAgICAgICAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5yZW1vdmVDbGFzcygnc2hvdyBlcnJvcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgfSk7XG4gICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufV0pO1xuIiwic3luYy5zZXJ2aWNlKCdGaWxlcycsIFsnJGh0dHAnLCckcScsJyRyb290U2NvcGUnLGZ1bmN0aW9uIEZpbGVzICgkaHR0cCwkcSwkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy5nZXRHcm91cEZpbGVzID1mdW5jdGlvbihncm91cElkKSB7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIC8vZG93biBlbmRwb2ludCByZXR1cm4gYWxsIGZpbGVzIEkgb3duXG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsnL2FwaS92MS9ncm91cHMvJytncm91cElkKycvZ3JvdXBmaWxlcycpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdGhpcy5zaW5nbGUgPSBmdW5jdGlvbihmaWxlKXtcbiAgICAgIHZhciBwcm9taXNlID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50KyAnL3ByZXZpZXcvJysgZmlsZSlcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2UucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuZ2V0Qm94RmlsZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgZ3JvdXBJZCA9IDE7Ly9ieSBkZWZhdWx0IHRoaXMgY2FuIGJlIGFueSBudW1iZXJcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgLy90aGUgaWRlYSBpcyB0byBnZXQgYSBmaWxlIGVpdGhlciBmcm9tIGdyb3VwcyBvciBpbmRpdmlkdWFsIGFjY291bnQgZ3JvdXAgaXMgb3B0aW9uYWxcbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9ncm91cHMvJytncm91cElkKycvYm94ZmlsZXMnKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmdldE1pbWVUeXBlID0gZnVuY3Rpb24oZmlsZV9uYW1lKXtcbiAgICAgIHZhciBwcm9taXNlID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvZmlsZXMvbWltZVR5cGUvJysgZmlsZV9uYW1lKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIHByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2UucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuZG93bmxvYWRGaWxlID0gZnVuY3Rpb24oZmlsZV9uYW1lKXtcblxuICAgICAgdmFyIHByb21pc2UgPSAkcS5kZWZlcigpO1xuICAgICAgLy9oYXJkIGNvZGVkIGEgdXNlciBTdHJpbVVwISBuZWVkIHRvIGluamVjdCBoaW0gZHlhbWljYWxseVxuICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQrICcvYXBpL3YxL2ZpbGVzL2Rvd25sb2FkLycrZmlsZV9uYW1lKycvb2YvJysgJ1N0cmltVXAnKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICBwcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJvbWlzZS5wcm9taXNlO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59XSk7XG4iLCJzeW5jLnNlcnZpY2UoJ1Blb3BsZScsIFsnJHEnLCckaHR0cCcsJyRyb290U2NvcGUnLGZ1bmN0aW9uICgkcSwgJGh0dHAsICRyb290U2NvcGUpIHtcblx0dGhpcy5nZXQgID0gZnVuY3Rpb24gKCl7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL3N1Z2dlc3Rpb25zJylcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG5cdHRoaXMuYWxsSWZvbGxvdyA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZm9sbG93aW5ncycpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyKXtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuXHRcdH0pXG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH1cblx0dGhpcy51bkZvbGxvdyA9IGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmRlbGV0ZSgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZm9sbG93aW5nLycgK2lkKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG5cdHRoaXMuZm9sbG93ID0gZnVuY3Rpb24ocGFyYW0pe1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucHV0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9mb2xsb3dpbmdzJywgcGFyYW0pXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG5cdHJldHVybiB0aGlzO1xufV0pO1xuIiwic3luYy5zZXJ2aWNlKCdTaGFyZScsWyckbG9nJywnJGh0dHAnLCckcScsJyRyb290U2NvcGUnLCBmdW5jdGlvbiAoJGxvZywkaHR0cCwkcSwkcm9vdFNjb3BlKSB7XG5cdHRoaXMuc2hhcmUgPSBmdW5jdGlvbihzaGFyZWJsZU9iail7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvc2hhcmUnLHNoYXJlYmxlT2JqKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmdldFVzZXIgPSBmdW5jdGlvbih1c2VyKXtcblxuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS91c2Vycy8nKyB1c2VyKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblx0dGhpcy5maWxlTWltZSA9IGZ1bmN0aW9uKGZpbGUpe1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9taW1lVHlwZS8nKyBmaWxlKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcbiAgICByZXR1cm4gdGhpcztcbn1dKTsiLCJzeW5jLnNlcnZpY2UoJ1VzZXInLCBbJyRodHRwJywnJHEnLCckcm9vdFNjb3BlJyxmdW5jdGlvbiBGaWxlcyAoJGh0dHAsJHEsJHJvb3RTY29wZSkge1xuXHR0aGlzLmluZm8gPSBmdW5jdGlvbigpe1xuXHRcdHZhciBwcm9taXNlID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArXCIvYXBpL3YxL3VzZXJzL2luZm9cIilcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuXHRcdFx0cHJvbWlzZS5yZXNvbHZlKHJlcyk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oKSB7XG5cdFx0XHRwcm9taXNlLnJlamVjdCgpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBwcm9taXNlLnByb21pc2U7XG5cdH07XG5cdHRoaXMuZ3JvdXBzID0gZnVuY3Rpb24odXNlcil7XG4gICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMnKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycik7XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfVxuICAgIFxuXHRyZXR1cm4gdGhpcztcbn1dKSIsIi8qIGdsb2JhbCBzeW5jICovXG5zeW5jLnNlcnZpY2UoJ05vdGlmaWNhdGlvbicsIFsnJGh0dHAnLCAnJHEnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uIE5vdGlmaWNhdGlvbigkaHR0cCwgJHEsICRyb290U2NvcGUpIHtcbiAgICB0aGlzLmdldE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uICh1c2VyX2lkKSB7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbm90aWZpY2F0aW9ucycsIHtjYWNoZTogZmFsc2V9KVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9XG4gICAgdGhpcy5jcmVhdGVOb3RpZmljYXRpb24gPSBmdW5jdGlvbiAoTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLnBvc3QoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL25vdGlmaWNhdGlvbnMnLCBOb3RpZmljYXRpb24pXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9XG4gICAgdGhpcy5kZWxldGVOb3RpZmljYXRpb24gPSBmdW5jdGlvbiAobm90aWZpY2F0aW9uKSB7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLmRlbGV0ZSgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbm90aWZpY2F0aW9ucy8nICsgbm90aWZpY2F0aW9uKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn1dKTtcblxuc3luYy5jb250cm9sbGVyKCdub3RpZmljYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCdOb3RpZmljYXRpb24nLCckbG9nJywgZnVuY3Rpb24gKCRzY29wZSxOb3RpZmljYXRpb24sJGxvZykge1xuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmdldE5vdGlmaWNhdGlvbigpO1xuICAgIH1cbiAgICAkc2NvcGUuY2xlYXJOb3RpZmljYXRpb24gPSBmdW5jdGlvbihub3RpZmljYXRpb24pe1xuXG5cbiAgICAgIE5vdGlmaWNhdGlvbi5jbGVhck5vdGlmaWNhdGlvbihub3RpZmljYXRpb24pXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIC8vbG9hZCByZW1haW5pbmcgbm90aWZpY2F0aW9uXG4gICAgICAgICRzY29wZS5nZXROb3RpZmljYXRpb24oKTtcbiAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAkc2NvcGUuZ2V0Tm90aWZpY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgTm90aWZpY2F0aW9uLmdldE5vdGlmaWNhdGlvbigpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICAgICAgICAvLyAkbG9nLmluZm8ocmVzdWx0KTtcbiAgICAgICAgICAgICRzY29wZS5ub3RpZmljYXRpb25zID0gcmVzdWx0O1xuICAgICAgICAgICAgXG4gICAgICAgIH0sZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgLy8gJGxvZy5pbmZvKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5pbml0KCk7XG59XSk7XG5zeW5jLmRpcmVjdGl2ZSgnbm90aWZ5JyxbZnVuY3Rpb24oKXtcbiAgcmV0dXJue1xuICAgIHJlc3RyaWN0OidBRScsXG4gICAgc2NvcGU6e1xuXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWwsIGlBdHRycyl7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHZhciB0aXRsZT0nVGhpcyB3aWxsIGJlIHRpdGxlJztcbiAgICAgICAgICAgICAgdmFyIGRlc2M9J01vc3QgcG9wdWxhciBhcnRpY2xlLic7XG4gICAgICAgICAgICAgIHZhciB1cmw9J3N5bmMuY29tOjgwMDAnO1xuICAgICAgICAgICAgICBub3RpZnlCcm93c2VyKHRpdGxlLGRlc2MsdXJsKTtcbiAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIil7XG4gICAgICAgICAgICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBub3RpZnlCcm93c2VyKHRpdGxlLGRlc2MsdXJsKVxuICAgICAge1xuICAgICAgICBpZiAoIU5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Rlc2t0b3Agbm90aWZpY2F0aW9ucyBub3QgYXZhaWxhYmxlIGluIHlvdXIgYnJvd3Nlci4uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09IFwiZ3JhbnRlZFwiKXtcbiAgICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgbm90aWZpY2F0aW9uID0gbmV3IE5vdGlmaWNhdGlvbih0aXRsZSwge1xuICAgICAgICAgICAgaWNvbjonaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1hQ0ZpSzRiYVhYNC9Wam1HSm9qc1FfSS9BQUFBQUFBQU5KZy9oLXNMVlgxTTV6QS9zNDgtSWM0Mi9lZ2dzbWFsbC5wbmcnLFxuICAgICAgICAgICAgYm9keTogZGVzYyxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbm90aWZpY2F0aW9uIGZyb20gTm90aWZpY2F0aW9uIENlbnRlciB3aGVuIGNsaWNrZWQuXG4gICAgICAgIG5vdGlmaWNhdGlvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQ2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgbm90aWZpY2F0aW9uIGlzIGNsb3NlZC5cbiAgICAgICAgbm90aWZpY2F0aW9uLm9uY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ05vdGlmaWNhdGlvbiBjbG9zZWQnKTtcbiAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufV0pXG4iLCJzeW5jLmZhY3RvcnkoJ3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobWVzc2FnZSwgXCJTdWNjZXNzXCIpO1xuICAgICAgICB9LFxuICAgICAgICB3YXJuOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcobWVzc2FnZSwgXCJIZXlcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGluZm86IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuaW5mbyhtZXNzYWdlLCBcIkZZSVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IobWVzc2FnZSwgXCJPaCBOb1wiKTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsInN5bmMuZmFjdG9yeSgndXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhtZXNzYWdlLCBcIlN1Y2Nlc3NcIik7XG4gICAgICAgIH0sXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIud2FybmluZyhtZXNzYWdlLCBcIkhleVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5mbzogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRvYXN0ci5pbmZvKG1lc3NhZ2UsIFwiRllJXCIpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihtZXNzYWdlLCBcIk9oIE5vXCIpO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiXG5zeW5jLmNvbnRyb2xsZXIoJ3VwbG9hZERpYWxvZ0N0cmwnLCBbJyRzY29wZScsJyR1aWJNb2RhbCcsJyRtZERpYWxvZycsJyRtZE1lZGlhJywgZnVuY3Rpb24gKCRzY29wZSwkdWliTW9kYWwsICRtZERpYWxvZywgJG1kTWVkaWEpIHtcblxuXHRcdFx0XHQvL2RlY2xhcmUgZ2xvYmFsIGZ1bmN0aW9uIGZvciBzaG9ydGN1dFxuXHRcdFx0XHQkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdFx0fTtcblx0XHQgICAgJHNjb3BlLmN1c3RvbUZ1bGxzY3JlZW4gPSAkbWRNZWRpYSgneHMnKSB8fCAkbWRNZWRpYSgnc20nKTtcblx0XHQgICAgJHNjb3BlLnVwbG9hZCA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0ICAgICAgJG1kRGlhbG9nLnNob3coe1xuXHRcdFx0XHRcdFx0cGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXG5cdFx0ICAgICAgICBjb250cm9sbGVyOiBEaWFsb2dDb250cm9sbGVyLFxuXHRcdCAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy91cGxvYWQudHBsLmh0bWwnLFxuXHRcdCAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXG5cdFx0ICAgICAgICB0YXJnZXRFdmVudDogZXYsXG5cdFx0ICAgICAgICBjbGlja091dHNpZGVUb0Nsb3NlOmZhbHNlXG5cdFx0ICAgICAgfSlcblx0XHQgICAgICAudGhlbihmdW5jdGlvbihhbnN3ZXIpIHtcblx0XHQgICAgICAgICAgICAkc2NvcGUuc3RhdHVzID0gJ1lvdSBzYWlkIHRoZSBpbmZvcm1hdGlvbiB3YXMgXCInICsgYW5zd2VyICsgJ1wiLic7XG5cdFx0ICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuXHRcdCAgICAgICAgICAgICRzY29wZS5zdGF0dXMgPSAnWW91IGNhbmNlbGxlZCB0aGUgZGlhbG9nLic7XG5cdFx0ICAgICAgICAgIH0pO1xuXHRcdCAgICB9O1xuXHRcdFx0XHRmdW5jdGlvbiBEaWFsb2dDb250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKSB7XG5cdFx0XHRcdCAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ICAgICRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHRcdCAgfTtcblx0XHRcdFx0ICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCAgICAkbWREaWFsb2cuY2FuY2VsKCk7XG5cdFx0XHRcdCAgfTtcblx0XHRcdFx0ICAkc2NvcGUuYW5zd2VyID0gZnVuY3Rpb24oYW5zd2VyKSB7XG5cdFx0XHRcdCAgICAkbWREaWFsb2cuaGlkZShhbnN3ZXIpO1xuXHRcdFx0XHQgIH07XG5cdFx0XHRcdH1cbn1dKTtcbnN5bmMuY29udHJvbGxlcignc2hhcmVDb250cm9sbGVyJywgWyckc2NvcGUnLCckdWliTW9kYWwnLCckbWREaWFsb2cnLCckbWRNZWRpYScsJ3VybFNob3J0ZW5lcicsJ1NoYXJlJywnVXNlcicsIGZ1bmN0aW9uICgkc2NvcGUsJHVpYk1vZGFsLCAkbWREaWFsb2csICRtZE1lZGlhLHVybFNob3J0ZW5lcixTaGFyZSxVc2VyKSB7XG5cblx0Ly9kZWNsYXJlIGdsb2JhbCBmdW5jdGlvbiBmb3Igc2hvcnRjdXRcblx0JHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdH07XG5cdCRzY29wZS5jdXN0b21GdWxsc2NyZWVuID0gJG1kTWVkaWEoJ3hzJykgfHwgJG1kTWVkaWEoJ3NtJyk7XG5cdCRzY29wZS5zaGFyZSA9IGZ1bmN0aW9uKGV2LGZpbGVOYW1lKSB7XG5cblx0XHQkbWREaWFsb2cuc2hvdyh7XG5cdFx0XHRwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcblx0XHRcdGNvbnRyb2xsZXI6IERpYWxvZ0NvbnRyb2xsZXIsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ3ZpZXdzL3NoYXJlLnRwbC5odG1sJyxcblx0XHRcdHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuXHRcdFx0dGFyZ2V0RXZlbnQ6IGV2LFxuXHRcdFx0Y2xpY2tPdXRzaWRlVG9DbG9zZTpmYWxzZVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oYW5zd2VyKSB7XG5cdFx0XHRcdFx0JHNjb3BlLnN0YXR1cyA9ICdZb3Ugc2FpZCB0aGUgaW5mb3JtYXRpb24gd2FzIFwiJyArIGFuc3dlciArICdcIi4nO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkc2NvcGUuc3RhdHVzID0gJ1lvdSBjYW5jZWxsZWQgdGhlIGRpYWxvZy4nO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZykge1xuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdzaGFyZWRGaWxlJysgZmlsZU5hbWUpO1xuXHRcdFx0XHRcdCRzY29wZS5nZXRGaWxlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUuZmlsZT11cmxTaG9ydGVuZXIubWFrZVNob3J0KGZpbGVOYW1lKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdCRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0JHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JG1kRGlhbG9nLmNhbmNlbCgpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0JHNjb3BlLmFuc3dlciA9IGZ1bmN0aW9uKGFuc3dlcikge1xuXHRcdFx0XHRcdFx0JG1kRGlhbG9nLmhpZGUoYW5zd2VyKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0fTtcblxuXG5cblx0JHNjb3BlLnNoYXJlRmlsZSA9IGZ1bmN0aW9uKHZtKXtcblxuXHRcdHZhciBlbWFpbHM9dm0uZW1haWxzO1xuXHRcdHZhciBlbWFpbF9hcnJheSA9IGVtYWlscy5zcGxpdCgnLCcpO1xuXHRcdHZhciBpO1xuXHRcdGZvciAoIGk9MDsgaSA8IGVtYWlsX2FycmF5Lmxlbmd0aDsgaSsrICkge1xuXHRcdFx0Ly92YWxpZGF0ZSBlYWNoIGVtYWlsIHRvIHNoYXJlIHdpdGhcblx0XHRcdFNoYXJlLnNoYXJlKHZtKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzKXtcblx0XHRcdFx0Y29uc29sZS5sb2cocmVzKTtcblx0XHRcdH0pLmNhdGNoKCk7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhlbWFpbF9hcnJheVtpXSk7XG5cblx0XHR9XG5cdH1cblxufV0pO1xuIiwiLyogZ2xvYmFsIHN5bmMgKi9cbi8qKlxuICogIENyZWF0ZWQgYnkgTXVyYWdpamltYW5hIFJpY2hhcmQgb24gMTAvMjAvMTUuXG4gKiAgQmVhc3RhcjQ1N0BnbWFpbC5jb20gLCBzeW5jQGdtYWlsLmNvbSAsIGNoZWNrIHdpdGggbWUhXG4gKi9cbi8qSSB1c2UgQ2FtZWxDYXNlIHdoaWxlIHJlbmFtaW5nIG15IGZ1bmN0aW9ucyAqL1xuLyphbmQgaSB1c2Ugc25ha2UgY2FzZSB3aGlsZSByZW5hbWluZyB2YXJpYWJsZXMgKi9cbi8qcG9zdCBzZXJ2aWNlICovXG5cbnN5bmMuc2VydmljZSgnUG9zdCcsIFsnJGh0dHAnLCAnJHEnLCAnJHJvb3RTY29wZScsIGZ1bmN0aW9uIFBvc3QoJGh0dHAsICRxLCAkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy5nZXRQb3N0ID0gZnVuY3Rpb24gKHVzZXJfaWQpIHtcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9wb3N0cz91c2VyX2lkJyArIHVzZXJfaWQsIHtjYWNoZTogZmFsc2V9KVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMucGFydGljaXBhdGUgPSBmdW5jdGlvbihvYmope1xuICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLnB1dCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvcG9zdHMvJyxvYmopXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmNyZWF0ZVBvc3QgPSBmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9wb3N0cycsIHBvc3QpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuZGVsZXRlUG9zdCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5kZWxldGUoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL3Bvc3RzLycgKyBpZClcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59XSk7XG5cbnN5bmMuY29udHJvbGxlcignUG9zdGluZ0NvbnRyb2xsZXInLCBbXG4gICckc2NvcGUnLFxuICAnUG9zdCcsXG4gICckdGltZW91dCcsXG4gICdVc2VyJyxcbiAgJyRpbnRlcnZhbCcsXG4gICdOb3RpZmljYXRpb24nLFxuICAvLyAnJGlvbmljTGlzdERlbGVnYXRlJyxcbiAgJyRsb2cnLFxuICAndXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uJyxcbiAgZnVuY3Rpb24gKFxuICAkc2NvcGUsXG4gIFBvc3QsXG4gICR0aW1lb3V0LFxuICBVc2VyLFxuICAkaW50ZXJ2YWwsXG4gIE5vdGlmaWNhdGlvbixcbiAgJGlvbmljTGlzdERlbGVnYXRlLFxuICAkbG9nLFxuICB1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb25cbikge1xuXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5wb3N0TG9hZGVyKCk7XG4gICAgICAgICRzY29wZS5nZXRVc2VyKCk7XG5cbiAgICB9O1xuXG4gICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnBvc3RMb2FkZXIoKTtcbiAgICB9LCA4MDAwKTtcbiAgICAkc2NvcGUuZ2V0VXNlciA9ZnVuY3Rpb24oKXtcblxuICAgICAgVXNlci5faWQoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG4gICAgICAgICRzY29wZS51c2VyID0gcmVzcG9uc2U7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgLy9xdWl0IHNsaW50bHlcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmxvYWRNb3JlID0gZnVuY3Rpb24oKXtcblxuICAgIH07XG4gICAgJHNjb3BlLnBhcnRpY2lwYXRlSW50b1Bvc3QgPSBmdW5jdGlvbihwb3N0LHVzZXIpe1xuICAgICAgLy8gY29uc29sZS5sb2codXNlcik7XG4gICAgICB2YXIgb2JqID17XG4gICAgICAgICdwb3N0X2lkJzpwb3N0LFxuICAgICAgICAndXNlcl9pZCc6dXNlclxuICAgICAgfTtcbiAgICAgIFBvc3QucGFydGljaXBhdGUob2JqKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUucG9zdExvYWRlcigpO1xuICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICAvL3F1aXQgc2xlbnRseVxuXG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5wb3N0TG9hZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuZGF0YUxvYWRpbmcgPSB0cnVlO1xuICAgICAgICBQb3N0LmdldFBvc3QoKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHRyZWUpIHtcblxuICAgICAgICAgICAgICAgICRzY29wZS5wb3N0cyA9dHJlZTtcbiAgICAgICAgICAgICAgICAvL25hdmlnYXRlIHRyb3VnaCB0cmVlIHJlc3BvbnNlIHdoaWNoIGlzIHJlcXVpcmUgbXVjaCBhdHRlbnRpb25cbiAgICAgICAgICAgICAgICAkc2NvcGUuZnJpZW5kcz1bXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucmVwbGllcz1bXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2ZyaWVuZHMnKSAmJiB0cmVlW2ldWydyZXBsaWVzJ10gICYmIHRyZWVbaV1bJ2ZyaWVuZHMnXSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZnJpZW5kcy5wdXNoKHRyZWVbaV0uZnJpZW5kcyk7XG4gICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnJlcGxpZXMucHVzaCh0cmVlW2ldLnJlcGxpZXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2ZyaWVuZHMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZyaWVuZHMgPSBmcmllbmRzLmNvbmNhdCh0cmF2ZXJzZSh0cmVlW2ldLmZyaWVuZHMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXBsaWVzID0gcmVwbGllcy5jb25jYXQodHJhdmVyc2UodHJlZVtpXS5yZXBsaWVzKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuaW1hZ2VEZXNjID0gZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgLy9zaG93IGltYWdlcyB3aXRoIGRpZmZlcmVudCBwaXhlbFxuICAgICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgcmV0dXJuICc2MHB4JztcblxuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBcIjYwcHhcIjtcblxuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBcIjYwcHhcIjtcblxuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBcIjYwcHhcIjtcblxuICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBcIjYwcHhcIjtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gXCI2MHB4XCI7XG5cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcbiAgICB9O1xuICAgICRzY29wZS5zaGFyZSA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJGlvbmljTGlzdERlbGVnYXRlLmNsb3NlT3B0aW9uQnV0dG9ucygpO1xuICAgICAgICAkbG9nLmluZm8oaWQpO1xuICAgIH07XG4gICAgJHNjb3BlLmNyZWF0ZVBvc3QgPSBmdW5jdGlvbiAocG9zdGluZykge1xuICAgICAgLy9pZiBpbWFnZSBpcyB1cGxvYWRlZCB1cGxvYWRlZFxuICAgICAgICB2YXIgX3RoaXMgPSB7IG1lc3NhZ2U6IHBvc3RpbmcgfTtcbiAgICAgICAgUG9zdC5jcmVhdGVQb3N0KF90aGlzKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBvc3RDcmVhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLnBvc3RzLnB1c2gocG9zdENyZWF0ZWQpO1xuICAgICAgICAgICAgICAgICAgdXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLnN1Y2Nlc3MoXCJOZXcgUG9zdCBmZWVkIGNyZWF0ZWQhXCIpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuaW5pdCgpO1xufV0pO1xuc3luYy5kaXJlY3RpdmUoJ2ZlZWRzVXBsb2FkZXInLFtmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgIHRlbXBsYXRlVXJsOiAnQXBwL2pzL3NjcmlwdHMvdmlld3MvZmVlZEF0dGFjaG1lbnQuaHRtbCcsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFjdGlvbjogJ0AnXG4gICAgfSxcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcbiAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XG4gICAgICAkc2NvcGUuYXZhdGFyID0gJyc7XG4gICAgICAkc2NvcGUuc2VuZEZpbGUgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgJGZvcm0gPSAkKGVsKS5wYXJlbnRzKCdmb3JtJyk7XG4gICAgICAgIGlmICgkKGVsKS52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgJGZvcm0uYXR0cignYWN0aW9uJywgJHNjb3BlLmFjdGlvbik7XG4gICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcbiAgICAgICAgfSk7XG4gICAgICAgICRmb3JtLmFqYXhTdWJtaXQoe1xuICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgXHRiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgIFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignYXV0aG9yaXphdGlvbicsICdCZWFyZXIgT3FGaXJRUzQ0UlFUalJ1V25pWGpkSFpKUVhkQ3VFeDQ5cnE4Slk1QScpO1xuICAgICAgICBcdH0sXG4gICAgICAgICAgdXBsb2FkUHJvZ3Jlc3M6IGZ1bmN0aW9uKGV2dCwgcG9zLCB0b3QsIHBlcmNDb21wbGV0ZSkge1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgLy8gdXBsb2FkIHRoZSBwcm9ncmVzcyBiYXIgZHVyaW5nIHRoZSB1cGxvYWRcbiAgICAgICAgICAgICAgLy8gJHNjb3BlLnByb2dyZXNzID0gcGVyY2VudENvbXBsZXRlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXZ0LCBzdGF0dXNUZXh0LCByZXNwb25zZSwgZm9ybSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBhY3Rpb24gYXR0cmlidXRlIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgICRmb3JtLnJlbW92ZUF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cywgeGhyLCBmb3JtKSB7XG4gICAgICAgICAgICB2YXIgYXIgPSAkKGVsKS52YWwoKS5zcGxpdCgnXFxcXCcpLFxuICAgICAgICAgICAgICBmaWxlbmFtZSA9ICBhclthci5sZW5ndGgtMV07XG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIGFjdGlvbiBhdHRyaWJ1dGUgZnJvbSB0aGUgZm9ybVxuICAgICAgICAgICAgJGZvcm0ucmVtb3ZlQXR0cignYWN0aW9uJyk7XG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkc2NvcGUuYXZhdGFyID0gZmlsZW5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfV0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XG5cbiAgICAgIGVsZW0uZmluZCgnLmZha2UtdXBsb2FkZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbS5maW5kKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpLmNsaWNrKCk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgfTtcbn1dKTtcbiIsIi8qIGdsb2JhbCAkdWliTW9kYWxJbnN0YW5jZSAqL1xuLyogZ2xvYmFsIE1vZGFsSW5zdGFuY2VDdHJsICovXG4vKiBnbG9iYWwgJHVpYk1vZGFsICovXG4vKiBnbG9iYWwgc3luYyAqL1xuLyogZ2xvYmFsIHN5bmMgKi9cbnN5bmMuY29udHJvbGxlcignRmlsZXNDb250cm9sbGVyJyxcbiBbXG5cdCckc2NvcGUnLCdGaWxlcycsJyRsb2cnLCckd2luZG93JywnVXNlcicsJyR1aWJNb2RhbCcsJyRpbnRlcnZhbCcsJ3BkZkRlbGVnYXRlJywnJHRpbWVvdXQnLCckc3RhdGVQYXJhbXMnLCckcm9vdFNjb3BlJywnJGV4Y2VwdGlvbkhhbmRsZXInLCBmdW5jdGlvbiAoXG5cdFx0JHNjb3BlLCBGaWxlcywkbG9nLCR3aW5kb3csVXNlciwkdWliTW9kYWwsJGludGVydmFsLHBkZkRlbGVnYXRlLCR0aW1lb3V0LCRzdGF0ZVBhcmFtcywkcm9vdFNjb3BlLCRleGNlcHRpb25IYW5kbGVyKSB7XG5cblx0ICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAvL2xvYWQgYWxsIGJveCBmaWxlc1xuXHRcdCAgICAkc2NvcGUuYWxsKCk7XG5cdCAgfTtcblxuXG5cdCAgLy8gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vICRzY29wZS5hbGwoKTtcbiAgIC8vICB9LCA4MDAwKTtcblxuXG5cdCAkc2NvcGUuYWxsID0gZnVuY3Rpb24oKXtcbiAgICAkc2NvcGUuZGF0YUxvYWRpbmcgPSB0cnVlO1xuXHRcdEZpbGVzLmdldEJveEZpbGVzKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdCRzY29wZS5maWxlcyBcdD1cdHJlcztcblxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHR9KVxuICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS5kYXRhTG9hZGluZyA9IGZhbHNlO1xuICAgICB9KTtcblx0IH07XG4gICRzY29wZS5maWxlVHlwZSAgPSBmdW5jdGlvbih0eXBlKSB7XG5cbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdwZGYnOlxuICAgICAgICAgIHJldHVybiAnaW1nL3BkZi5wbmcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmb2xkZXInOlxuICAgICAgICAgIHJldHVybiAnaW1nL3VuaXZlcnNhbF9mb2xkZXIucG5nJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZm9sZGVyKyc6XG4gICAgICAgICAgcmV0dXJuICdpbWcvQWRkX2ZvbGRlci5wbmcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwaHAnOlxuICAgICAgICAgIHJldHVybiAnaW1nL2NvZGUucG5nJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndHh0JzpcbiAgICAgICAgcmV0dXJuICdpbWcvY29kZS5wbmcnO1xuICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZG9jeCc6XG4gICAgICAgICAgcmV0dXJuICdpbWcvd29yZC5wbmcnO1xuICAgICAgICBjYXNlICdqcGcnOlxuICAgICAgICAgIHJldHVybiAnZmEgZmEtaW1hZ2UnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwbmcnOlxuICAgICAgICAgIHJldHVybiAnaW1nL3ZpZGVvLnBuZyc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2pwZWcnOlxuICAgICAgICAgICAgcmV0dXJuICdpbWcvdW5pdmVyc2FsX2ZvbGRlci5wbmcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd6aXAnOlxuICAgICAgICAgcmV0dXJuICdpbWcvemlwLnBuZyc7XG4gICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICdpbWcvdW5pdmVyc2FsX2ZvbGRlci5wbmcnO1xuICAgICAgfVxuICB9O1xuXG5cdCRzY29wZS5pbml0KCk7XG59XSk7XG5cbnN5bmMuZGlyZWN0aXZlKCdkcmFnZ2FibGUnLCBmdW5jdGlvbigpIHtcblxuICAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0FFJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG4gICAgICAgICAgIHZhciBlbCA9IGVsZW1lbnRbMF07XG5cbiAgICAgICAgICAgIGVsLmRyYWdnYWJsZSA9IHRydWU7XG5cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ2RyYWdzdGFydCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2RyYWcgZXZlbnQgc3RhcnRlZCcpO1xuICAgICAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKCdUZXh0JywgdGhpcy5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnZHJhZycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnZHJhZ2VuZCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZHJhZyBldmVudCByZWxlYXNlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYWcnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG5cbnN5bmMuZGlyZWN0aXZlKCdkcm9wcGFibGUnLCBbJ3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsJ0ZpbGVzJyxmdW5jdGlvbih1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24sRmlsZXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgZHJvcDogJyYnLFxuICAgICAgICAgICAgYmluOiAnPScvLyBwYXJlbnRcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIGFnYWluIHdlIG5lZWQgdGhlIG5hdGl2ZSBvYmplY3RcbiAgICAgICAgICAgIHZhciBlbCA9IGVsZW1lbnRbMF07XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAnZHJhZ292ZXInLFxuICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICAgICAgICAgICAgICAgICAgLy8gYWxsb3dzIHVzIHRvIGRyb3BcbiAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnb3ZlcicpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICk7XG4gICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICdkcmFnZW50ZXInLFxuICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ292ZXInKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgJ2RyYWdsZWF2ZScsXG4gICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnb3ZlcicpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICk7IFxuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAnZHJvcCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdG9wcyBzb21lIGJyb3dzZXJzIGZyb20gcmVkaXJlY3RpbmcuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnN0b3BQcm9wYWdhdGlvbikgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ292ZXInKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYmluSWQgPSB0aGlzLmlkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGUuZGF0YVRyYW5zZmVyLmdldERhdGEoJ1RleHQnKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdJdGVtIG5vdyBpczonK2l0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsIHRoZSBwYXNzZWQgZHJvcCBmdW5jdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbihzY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHNjb3BlLmRyb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBmbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm4oaXRlbS5pZCwgYmluSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1jYXRjaChlKXtcbiAgICAgICAgICAgICAgICAgICAgICAvL3Rocm93IGVycm9yIHRoYXQgaGFwcGVuIHdoZW4gZmlsZSBpcyBkcm9wcGVkIGluIGl0J3Mgb3duIGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgLy9naXZlIHNvbWUgYWxlcnQgdG8gbm90aWZ5IHdoYXQgaGFwcG5lZFxuICAgICAgICAgICAgICAgICAgICAgIC8vIHRocm93KCBuZXcgRXJyb3IoZSkpXG4gICAgICAgICAgICAgICAgICAgICAgLy8gdXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLmVycm9yKFwiRHJvcCBGaWxlIG9uIGZvbGRlciB0byBtb3ZlIGl0IVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XSk7XG5zeW5jLmNvbnRyb2xsZXIoJ0RyYWdEcm9wQ3RybCcsIFsnJHNjb3BlJywnRmlsZXMnLCckaW50ZXJ2YWwnLGZ1bmN0aW9uKCRzY29wZSxGaWxlcywkaW50ZXJ2YWwpIHtcblxuICBcbiAgICAkc2NvcGUuaGFuZGxlRHJvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gMSlpZiBtb3ZlZCBvbmx5IHdoZW4gaXQgcmVhY2ggb24gZm9sZGVyIGFsbG93IG1vdmVcbiAgICAgIC8vIDIpdGFrZSB0aCBpZCBvZiBmaWxlIG1vdmVkIGFuZCB0YWtlIGlkIG9mIGZvbGRlciBtb3ZlIGZpbGUgaW50byBmb2xkZXJcblxuICAgICAgIC8vbW92ZSB0aGUgaXRlbSBpbnRvIHdoZXJlIGl0IGlzIGRyb3BlZFxuICAgICAgIC8vdGhlIGZpcnN0IHRoaW5nIGhlcmUgaXMgdG8gcmVjYWxjdWxhdGUgdGhlIGFycmF5IHRvIGtlZXAgdGhlIGFycmFuZ2VtZW50IGludGFjdFxuICAgICAgIFxuICAgICAgICBcbiAgICB9XG59XSk7XG4iLCJzeW5jLmNvbnRyb2xsZXIoJ3ByZXZpZXdDb250cm9sbGVyJyxcbiBbXG5cdCckc2NvcGUnLCdwZGZEZWxlZ2F0ZScsJyR0aW1lb3V0JywnJHN0YXRlUGFyYW1zJywnJHJvb3RTY29wZScsJyRleGNlcHRpb25IYW5kbGVyJywnRmlsZXMnLCAnRmlsZVNhdmVyJywnQmxvYicsZnVuY3Rpb24gKFxuXHRcdCRzY29wZSxwZGZEZWxlZ2F0ZSwkdGltZW91dCwkc3RhdGVQYXJhbXMsJHJvb3RTY29wZSwkZXhjZXB0aW9uSGFuZGxlcixGaWxlcyxGaWxlU2F2ZXIsIEJsb2IpIHtcblxuICAgICAgLy9nZXQgbWltZSB0eXBlIG9mIGFueUZpbGUgdGhhdCBjb21lcyBpbiBteSBob29kIVxuXG4gICAgICBcblxuICAgICAgaWYoJHN0YXRlUGFyYW1zLnByZXZpZXcgJiYgJHN0YXRlUGFyYW1zLmV4dGVuc2lvbiA9PSAncGRmJyl7XG4gICAgICAgICRzY29wZS5wcmV2aWV3YWJsZSA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL2EgdXNlciBTdHJpbVVwIGlzIGluamVjdGVkIGluIGJlbGxvdyB1cmwgaXQgc2hvdWxkIGJlIGR5bmFtaWMgaW4gZnV0dXJlIVxuICAgICAgICAgICAgJHNjb3BlLnBkZlVybCA9ICRyb290U2NvcGUuZW5kUG9pbnQrICcvcHJldmlldy8nKyAkc3RhdGVQYXJhbXMucHJldmlldysnL29mLycrJ1N0cmltVXAnO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwZGZEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ215LXBkZi1jb250YWluZXInKS56b29tSW4oMC41KTtcbiAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICAgdGhyb3coIG5ldyBFcnJvcihlKSlcbiAgICAgICAgfVxuICAgICAgfWVsc2UgaWYoJHN0YXRlUGFyYW1zLnByZXZpZXcgJiYgJHN0YXRlUGFyYW1zLmV4dGVuc2lvbiA9PSAnanBnJ3x8JHN0YXRlUGFyYW1zLmV4dGVuc2lvbiA9PSAncG5nJyl7XG4gICAgICAgICRzY29wZS5maWxlX25hbWUgPSAkc3RhdGVQYXJhbXMucHJldmlldztcbiAgICAgICAgJHNjb3BlLnByZXZpZXdhYmxlID0gZmFsc2U7XG4gICAgICAgIC8vYXMgYnkgbm93IGltYWdlcyBhcmUgbm90IHJlYWR5IHRvIGJlIHByZXZpZXdlZCBzbyBzZXQgaXQgdG8gZmFsc2UhcHJvdmlkZSBvbmx5IG9wdGlvbiB0byBkb3dubG9hZCB0aGVtIVxuICAgICAgICAgIC8vICRzY29wZS5wcmV2aWV3YWJsZSA9IGZhbHNlO1xuICAgICAgICAgIC8vIEZpbGVzLnNpbmdsZSgkc3RhdGVQYXJhbXMucHJldmlldylcbiAgICAgICAgICAvLyAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgLy8gICAkc2NvcGUuaW1hZ2VQcmV2aWV3ID0gcmVzcG9uc2U7XG4gICAgICAgICAgLy8gfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIC8vICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAvLyB9KTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgLy9zZW5kIGEgZmlsZW5hbWUgdG8gYSBkb3dubG9hZCBidXR0b25cbiAgICAgICAgJHNjb3BlLmZpbGVfbmFtZSA9ICRzdGF0ZVBhcmFtcy5wcmV2aWV3O1xuICAgICAgICAkc2NvcGUucHJldmlld2FibGUgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5pbmNyZW1lbnQgPSAxO1xuICAgICAgICAgIHBkZkRlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbXktcGRmLWNvbnRhaW5lcicpLm5leHQoJHNjb3BlLmluY3JlbWVudCsxKTtcbiAgICAgIH07XG4gICAgICAvL3RoaXMgb3B0aW9uIGRvd24gaGVyZSBvZiBkb3dubG9hZGluZyBhIGZpbGUgd2FzIG5pY2UgYnV0IHN0aWxsIGhhdmUgc29tZSBkcm93YmFja1xuXG4gICAgICAvLyAkc2NvcGUuZG93bmxvYWQgPSBmdW5jdGlvbihmaWxlX25hbWUpe1xuXG4gICAgICAvLyAgIEZpbGVzLmRvd25sb2FkRmlsZShmaWxlX25hbWUpXG4gICAgICAvLyAgIC50aGVuKGZ1bmN0aW9uKGZpbGVfd3JpdGVuKXtcbiAgICAgICAgICAgIFxuICAgICAgLy8gICAgIEZpbGVzLmdldE1pbWVUeXBlKCRzdGF0ZVBhcmFtcy5wcmV2aWV3KVxuICAgICAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24obWltZVR5cGUpe1xuXG4gICAgICAvLyAgICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW2ZpbGVfd3JpdGVuXSwge1xuICAgICAgLy8gICAgICAgICAgICAgdHlwZTogbWltZVR5cGUsXG4gICAgICAvLyAgICAgICAgIH0pO1xuICAgICAgLy8gICAgICAgICBGaWxlU2F2ZXIuc2F2ZUFzKGJsb2IsICRzdGF0ZVBhcmFtcy5wcmV2aWV3KTtcblxuICAgICAgLy8gICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgLy8gICAgICAgfSk7XG5cbiAgICAgICAgICBcblxuICAgICAgLy8gICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAvLyAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9O1xuICAgICAgJHNjb3BlLmdvUHJldiA9IGZ1bmN0aW9uKHBhZ2Upe1xuICAgICAgICAgIHBkZkRlbGVnYXRlLiRnZXRCeUhhbmRsZSgnbXktcGRmLWNvbnRhaW5lcicpLnByZXYoJHNjb3BlLmluY3JlbWVudC0xKTtcbiAgICAgIH07XG59XSk7XG5cbnN5bmMuZGlyZWN0aXZlKCdmaWxlRG93bmxvYWQnLCBbZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLW5nLWNsaWNrPVwiZG93bmxvYWQoKVwiPjxzcGFuIGNsYXNzPVwiXCI+PC9zcGFuPkRvd25sb2FkPC9idXR0b24+JyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFsnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gcHJlcGFyZSh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlhbG9ncy53YWl0KFwiUGxlYXNlIHdhaXRcIiwgXCJZb3VyIGRvd25sb2FkIHN0YXJ0cyBpbiBhIGZldyBzZWNvbmRzLlwiLCAkc2NvcGUucHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICBmYWtlUHJvZ3Jlc3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc3VjY2Vzcyh1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdkaWFsb2dzLndhaXQuY29tcGxldGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3IocmVzcG9uc2UsIHVybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkaWFsb2dzLmVycm9yKFwiQ291bGRuJ3QgcHJvY2VzcyB5b3VyIGRvd25sb2FkIVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmYWtlUHJvZ3Jlc3MoKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucHJvZ3Jlc3MgPCA5NSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyArPSAoOTYgLSAkc2NvcGUucHJvZ3Jlc3MpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2RpYWxvZ3Mud2FpdC5wcm9ncmVzcycsIHsgJ3Byb2dyZXNzJzogJHNjb3BlLnByb2dyZXNzIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZha2VQcm9ncmVzcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRzY29wZS5kb3dubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgJC5maWxlRG93bmxvYWQoJ2h0dHA6Ly9zeW5jbWUuY29tOjgwMDAvYXBpL3YxL2ZpbGVzL2Rvd25sb2FkL3BocHhGbmxoZURWRTVqNW1jVkRYLnBuZy9vZi9TdHJpbVVwP2FjY2Vzc190b2tlbj1CYzdEV1M3S0tSTHR4bWRkVVpJMVQxbFp1MkoxWWhSOE9MWEdXTlpuJywgeyBwcmVwYXJlQ2FsbGJhY2s6IHByZXBhcmUsIHN1Y2Nlc3NDYWxsYmFjazogc3VjY2VzcywgZmFpbENhbGxiYWNrOiBlcnJvciB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XVxuICAgICAgICB9XG59XSk7XG4iLCIvKiBnbG9iYWwgc3luYyAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5zeW5jLmNvbnRyb2xsZXIoJ1Blb3BsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsJ1Blb3BsZScsZnVuY3Rpb24gKCRzY29wZSwgUGVvcGxlKSB7XG5cdFx0JHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuXHRcdFx0JHNjb3BlLmdldFBlb3BsZVRvRm9sbG93KCk7XG5cdFx0fVxuXHRcdCRzY29wZS5nZXRQZW9wbGVUb0ZvbGxvdyAgPSBmdW5jdGlvbigpe1xuXHRcdFx0UGVvcGxlLmdldCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFxuXHRcdFx0XHQkc2NvcGUucGVvcGxlID0gcmVzcG9uc2U7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcil7XG5cblx0XHRcdH0pXG5cdFx0fVxuXHRcdCRzY29wZS4kb24oJ2ZvbGxvd01lbWJlcicsZnVuY3Rpb24oZXZlbnQscGFyYW1zKXtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRQZW9wbGUuZm9sbG93KHBhcmFtcylcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRcdCRzY29wZS5nZXRQZW9wbGVUb0ZvbGxvdygpO1xuXHRcdFx0fSxmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdH0pXG5cdFx0fSk7XG5cdFx0JHNjb3BlLmZvbGxvdyA9IGZ1bmN0aW9uKGlkKXtcblx0XHRcdHZhciBmb2xsb3cgPXtpZDogaWQsIG9wdGlvbjonYWRkUGVvcGxlJ307XG5cdFx0XHQkc2NvcGUuJGVtaXQoXCJmb2xsb3dNZW1iZXJcIiwgZm9sbG93KTtcblx0XHR9XG5cdFx0JHNjb3BlLmluaXQoKTtcbn1dKTtcbiIsIi8qIGdsb2JhbCBGaWxlcyAqL1xuLyogZ2xvYmFsIHN5bmMgKi9cbi8qIGdsb2JhbCAkc2NvcGUgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG4vKkF1dGhvciBNdXJhZ2lqaW1hbmEgRm91bmRlciAmIENFTyBvZiBzeW5jIGNhbGwgaGltIG9uIFN0cmltVXBAZ21haWwuY29tKi9cblxuc3luYy5zZXJ2aWNlKCdHcm91cCcsIFtcblx0JyRodHRwJyxcblx0JyRyb290U2NvcGUnLFxuXHQnJHEnLGZ1bmN0aW9uIEdyb3VwIChcblx0XHQkaHR0cCxcblx0XHQkcm9vdFNjb3BlLFxuXHRcdCRxKSB7XG5cdHRoaXMuY3JlYXRlIFx0XHQ9XHRmdW5jdGlvbihuYW1lKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXHRcdCRodHRwLnBvc3QoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2dyb3VwcycsIG5hbWUpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHR0aGlzLmRlbGV0ZSBcdFx0PVx0ZnVuY3Rpb24oaWQpe1xuXHRcdHZhciBkaWZmZXJlZCBcdD1cdCRxLmRlZmVyKCk7XG5cdFx0JGh0dHAuZGVsZXRlKCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMvJytpZClcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG5cdHRoaXMubXlHcm91cHNcdFx0PVx0ZnVuY3Rpb24oKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXG5cdFx0JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMnKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZGlmZmVyZWQgc2xvdzonICsgZXJyb3IpO1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG5cblx0dGhpcy5hZGRQZW9wbGUgXHQ9XHRmdW5jdGlvbihtZW1iZXIpe1xuXHRcdHZhciBkaWZmZXJlZCBcdD1cdCRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucHV0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMvJytKU09OLnN0cmluZ2lmeShtZW1iZXIpKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKGVycm9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmFkZEZpbGVUb0dyb3VwID0gZnVuY3Rpb24oZmlsZU9iail7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wdXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2dyb3Vwcy8nKyBKU09OLnN0cmluZ2lmeShmaWxlT2JqKSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpe1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHR0aGlzLnJlbW92ZVBlb3BsZSBcdD1cdGZ1bmN0aW9uKG1lbWJlcil7XG5cdFx0dmFyIGRpZmZlcmVkIFx0PVx0JHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wdXQoJHJvb3RTY29wZS5lbmRQb2ludCArJy9hcGkvdjEvbWUvZ3JvdXBzLycrSlNPTi5zdHJpbmdpZnkobWVtYmVyKSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG4gIHRoaXMuc3VnZ2VzdFBlb3BsZSA9IGZ1bmN0aW9uKGlkKXtcblxuICAgIFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICBcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzLycgKyBpZClcbiAgICBcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlcyl7XG4gICAgXHRcdGRpZmZlcmVkLnJlc29sdmUocmVzKTtcbiAgICBcdH0pXG4gICAgXHQuZXJyb3IoZnVuY3Rpb24oZXJyKSB7XG4gICAgXHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgIFx0fSlcbiAgICBcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH1cblx0cmV0dXJuIHRoaXM7XG59XSk7XG5cbnN5bmMuY29udHJvbGxlcignR3JvdXBDb250cm9sbGVyJywgW1xuXHQnJHNjb3BlJyxcblx0J0dyb3VwJyxcblx0J1VzZXInLFxuXHQnRmlsZXMnLFxuXHQndXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uJyxcblx0ZnVuY3Rpb24gR3JvdXBDb250cm9sbGVyIChcblx0XHQkc2NvcGUsXG5cdFx0R3JvdXAsXG5cdFx0VXNlcixcblx0XHRGaWxlcyxcblx0XHR1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb25cblx0KSB7XG5cdCRzY29wZS5pbml0IFx0PVx0ZnVuY3Rpb24oKXtcblx0XHQkc2NvcGUubXlHcm91cHMoKTtcblxuXHRcdCRzY29wZS5zdWdnZXN0ZWRQZW9wbGVUb0dyb3VwKCk7Ly9vZmNhdXNlIHRoZXkgYXJlIGFybGVhZHkgeW91ciBmcmllbmQgYnV0IG5vdCBwYXJ0aWNpcGFudCBpbiB5b3VyIHN0dWZmIHdvcmshXG5cdH1cblx0JHNjb3BlLnVzZXJJZCBcdFx0XHRcdD1cdGZ1bmN0aW9uKCl7XG5cdFx0VXNlci5faWQoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdCRzY29wZS51c2VySWQgXHQ9XHRyZXNwb25zZTtcblx0XHR9LCBmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0fSk7XG5cdH07XG5cdCRzY29wZS5teUdyb3VwcyBcdFx0XHQ9XHRmdW5jdGlvbigpe1xuXHRcdEdyb3VwLm15R3JvdXBzKClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHQkc2NvcGUuZ3JvdXAgXHQ9IHJlc3BvbnNlO1xuXHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHR9KTtcblx0fTtcblx0JHNjb3BlLnN1Z2dlc3RlZFBlb3BsZVRvR3JvdXAgXHQ9XHRmdW5jdGlvbihpZCl7XG5cdFx0Ly9jbGVhcmluZyBhbGwgdmlldyByZW5kZXJlZCBiZWZvcmVcblx0XHQkc2NvcGUuc2hvd0ZpbGVzPWZhbHNlO1xuXHRcdCRzY29wZS5zaG93R3JvdXA9ZmFsc2U7XG5cdFx0JHNjb3BlLnNob3dCb3g9ZmFsc2U7XG5cdFx0aWYoIWFuZ3VsYXIuaXNVbmRlZmluZWQoaWQpKXtcblx0XHRcdEdyb3VwLnN1Z2dlc3RQZW9wbGUoaWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRcdCRzY29wZS5mb2xsb3dlcnMgPSByZXNwb25zZTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHQkc2NvcGUuJG9uKCdyZWZyZXNoR3JvdXAnLGZ1bmN0aW9uKCl7XG4gICAgICAgJHNjb3BlLmluaXQoKTtcbiAgXHR9KTtcblx0JHNjb3BlLiRvbignZ3JvdXBEZWxldGVkJywgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHQkc2NvcGUubXlHcm91cHMoKTtcblx0fSk7XG5cdCRzY29wZS4kb24oJ2dyb3VwVG9iaW5kd2l0aCcsIGZ1bmN0aW9uIChldmVudCwgZ3JvdXBpZCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICRzY29wZS5lbWl0dGVkID1ncm91cGlkO1xuICAgICAgICBpZiggJHNjb3BlLnNob3dGaWxlcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICRzY29wZS5zaG93RmlsZXM9ZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLnN1Z2dlc3RlZFBlb3BsZVRvR3JvdXAoZ3JvdXBpZCk7XG4gICAgICAgICRzY29wZS5hZGRQZW9wbGU9dHJ1ZTtcblx0fSk7XG5cdCRzY29wZS5nZXRHcm91cEZpbGVzID0gZnVuY3Rpb24ob3duZXIpe1xuICAgIEZpbGVzLmdldEdyb3VwRmlsZXMob3duZXIpXG5cdFx0LnRoZW4oZnVuY3Rpb24odHJlZSl7XG5cdFx0XHQkc2NvcGUuZmlsZXMgPSB0cmVlO1xuXHRcdFx0XHQvL25hdmlnYXRlIHRyb3VnaCB0cmVlIHJlc3BvbnNlIHdoaWNoIGlzIHJlcXVpcmUgbXVjaCBhdHRlbnRpb25cblx0XHRcdFx0JHNjb3BlLmdyb3Vwcz1bXTtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRpZiAodHJlZVtpXS5oYXNPd25Qcm9wZXJ0eSgnZ3JvdXBzJykgJiYgdHJlZVtpXVsnZ3JvdXBzJ10pIHtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZ3JvdXBzLnB1c2godHJlZVtpXS5mcmllbmRzKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodHJlZVtpXS5oYXNPd25Qcm9wZXJ0eSgnZ3JvdXBzJykpIHtcblx0XHRcdFx0XHRcdFx0XHQkc2NvcGUuZ3JvdXBzID0gZ3JvdXBzLmNvbmNhdCh0cmF2ZXJzZSh0cmVlW2ldLmdyb3VwcykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSwgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH0pO1xuICB9O1xuXHQkc2NvcGUuZ2V0Qm94RmlsZXMgPSBmdW5jdGlvbihncm91cElkKXtcblx0XHQkc2NvcGUuZW1pdHRlZCA9Z3JvdXBJZDtcbiAgXHRGaWxlcy5nZXRCb3hGaWxlcyhncm91cElkKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHRyZWUpe1xuXHRcdFx0JHNjb3BlLmZpbGVzID0gdHJlZTtcblx0XHRcdFx0Ly9uYXZpZ2F0ZSB0cm91Z2ggdHJlZSByZXNwb25zZSB3aGljaCBpcyByZXF1aXJlIG11Y2ggYXR0ZW50aW9uXG5cdFx0XHRcdCRzY29wZS5ncm91cHM9W107XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2dyb3VwcycpICYmIHRyZWVbaV1bJ2dyb3VwcyddKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmdyb3Vwcy5wdXNoKHRyZWVbaV0uZnJpZW5kcyk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2dyb3VwcycpKSB7XG5cdFx0XHRcdCAgICAgICAgICAgICRzY29wZS5ncm91cHMgPSBncm91cHMuY29uY2F0KHRyYXZlcnNlKHRyZWVbaV0uZ3JvdXBzKSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHR9LCBmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0fSk7XG4gIH07XG4kc2NvcGUuJG9uKCdzaG93T3B0aW9ucycsZnVuY3Rpb24oXyxwYXJhbXMpe1xuICAgICBpZihwYXJhbXMub3duZXIgPT09XCJib3hcIil7XG5cdFx0XHQgJHNjb3BlLmFkZFBlb3BsZT1mYWxzZTtcblx0XHRcdCAkc2NvcGUuc2hvd0dyb3VwPWZhbHNlO1xuICAgICAgICRzY29wZS5zaG93Qm94PXRydWU7XG4gICAgICAgaWYoICRzY29wZS5hZGRQZW9wbGUgPT0gdHJ1ZSl7XG4gICAgICAgICAgICRzY29wZS5hZGRQZW9wbGU9ZmFsc2U7XG4gICAgICAgfVxuXHRcdFx0IC8vc2V0IGZpbGVzIHNjb3BlIHRvIHNob3cgZmlsZXMgb2YgYm94IGZpbGVzIGlzIHJlcGVhdGVkIGluIHZpZXcgZGlyZWN0aXZlXG4gICAgICAgJHNjb3BlLmdldEJveEZpbGVzIChwYXJhbXMuZ3JvdXBfaWQpO1xuXHRcdCB9ZWxzZSBpZiAocGFyYW1zLm93bmVyID09PSBcImdyb3VwXCIpIHtcblx0XHRcdCAkc2NvcGUuc2hvd0JveD1mYWxzZTtcblx0XHRcdCAkc2NvcGUuYWRkUGVvcGxlPWZhbHNlO1xuXHRcdFx0ICRzY29wZS5zaG93R3JvdXA9dHJ1ZTtcblx0XHRcdCBpZiggJHNjb3BlLmFkZFBlb3BsZSA9PSB0cnVlKXtcblx0XHRcdFx0XHQgJHNjb3BlLmFkZFBlb3BsZT1mYWxzZTtcblx0XHRcdCB9XG5cdFx0XHQgLy9jaGFuZ2UgZmlsZXMgdG8gbmV3IHNjb3BlIGZpbGVzIHRvIHNob3cgZmlsZXMgb2YgZ3JvdXBzICBpcyByZXBlYXRlZCBpbiB2aWV3IGRpcmVjdGl2ZVxuXHRcdFx0ICRzY29wZS5nZXRHcm91cEZpbGVzIChwYXJhbXMuZ3JvdXBfaWQpO1xuXHRcdCB9XG59KTtcbiRzY29wZS5pbml0KCk7XG59XSk7XG5zeW5jLmRpcmVjdGl2ZSgnbXlHcm91cHMnLCBbXG5cdCdHcm91cCcsXG5cdCdSZXBvcnQnLFxuXHQndXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uJyxcblx0ZnVuY3Rpb24gbXlHcm91cHMgKFxuXHRcdEdyb3VwLFxuXHRcdFJlcG9ydCxcblx0XHR1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24sXG5cdFx0Tm90aWZpY2F0aW9uKSB7XG5cdHJldHVybiB7XG5cdFx0cHJpb3JpdHk6IDEwLFxuXHRcdHRlbXBsYXRlVXJsOiAnQXBwL3NjcmlwdHMvanMvZGlyZWN0aXZlcy9ncm91cHMuaHRtbCcsXG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0ICBpZDogJz11c2VySWQnLFxuICAgICAgICAgIGdyb3VwczogJz0nLFxuICAgICAgICAgIGZvbGxvd2VyczogJz0nLFxuICAgICAgICAgIGVtaXR0ZWQ6Jz0nLFxuICAgICAgICAgIHNob3dQZW9wbGU6Jz0nLFxuICAgICAgICAgIHNob3dHcm91cCAgIDogICc9JyxcbiAgICAgICAgICBmaWxlcyAgIDogICc9Jyxcblx0ICBcdFx0XHRzaG93Qm94OiAgJz0nXG5cdFx0fSxcblx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIHtcblx0XHRcdHNjb3BlLmRlbGV0ZUdyb3VwID0gZnVuY3Rpb24oaWQpe1xuXHRcdFx0XHRHcm91cC5kZWxldGUoaWQpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdFx0XHR1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24uaW5mbyhcIkdyb3VwIGRlbGV0ZWRcIik7XG5cdFx0XHRcdFx0IFx0c2NvcGUuJGVtaXQoXCJncm91cERlbGV0ZWRcIiwgJ2dyb3VwIGRlbGV0ZWQnKTtcblx0XHRcdFx0fSwgZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0XHRSZXBvcnQuc2VuZCgnZGVsZXRlIGdyb3VwIGVycm9yOicrZXJyKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCl7fSwgZnVuY3Rpb24oKXt9KTtcblx0XHRcdFx0fSlcblx0XHRcdH07XG4gICAgICBzY29wZS5jcmVhdGVHcm91cFx0PVx0ZnVuY3Rpb24obmFtZSl7XG4gICAgICAgICAgR3JvdXAuY3JlYXRlKG5hbWUpXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLnN1Y2Nlc3MoXCJDcmVhdGVkIG5ldyBHcm91cFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kZW1pdCgncmVmcmVzaEdyb3VwJyxudWxsKTtcbiAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcblx0XHRcdHNjb3BlLmluaXRBZGRQZW9wbGUgPSBmdW5jdGlvbihncm91cGlkKXtcblx0XHRcdFx0c2NvcGUuJGVtaXQoXCJncm91cFRvYmluZHdpdGhcIiwgZ3JvdXBpZCk7XG5cdFx0XHR9O1xuXG5cdFx0XHRzY29wZS5hZGRQZW9wbGUgPSBmdW5jdGlvbihwYXJhbXMpe1xuXHRcdFx0XHR2YXIgbmV3UGFyYW1zID17XG5cdFx0XHRcdFx0J29wdGlvbic6J2FkZE1lbWJlcicsXG5cdFx0XHRcdFx0J3VzZXJJZCc6cGFyYW1zLnVzZXJJZCxcblx0XHRcdFx0XHQnZ3JvdXBJZCc6cGFyYW1zLmdyb3VwSWRcblx0XHRcdFx0fVxuXHRcdFx0XHRpZihhbmd1bGFyLmlzVW5kZWZpbmVkKHBhcmFtcykpe1xuXHRcdFx0XHRcdC8vd29uJ3QgaGFwcGVuIW9yIGlmIHRpIGhhcHBlbiB3ZSBxdWl0XG5cdFx0XHRcdH1lbHNle1xuXG5cdFx0XHRcdFx0R3JvdXAuYWRkUGVvcGxlKG5ld1BhcmFtcylcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0Ly9yZWZyZXNoIGdyb3VwIHdpdGggbmV3IG1lbWJlciBzdGF0dXNcblx0XHRcdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLnN1Y2Nlc3MoXCJBZGRlZCBNZW1iZXIgaW4gZ3JvdXAuXCIpO1xuICAgICAgICAgICAgICBzY29wZS5pbml0QWRkUGVvcGxlKHBhcmFtcy5ncm91cElkKTtcbiAgICAgICAgICAgICAgc2NvcGUuJGVtaXQoJ3JlZnJlc2hHcm91cCcsJycpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycm9yLHN0YXR1cyl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0c2NvcGUucmVtb3ZlUGVvcGxlID0gZnVuY3Rpb24ocGFyYW1zKXtcblxuXHRcdFx0XHR2YXIgbmV3UGFyYW1zID17XG5cdFx0XHRcdFx0J29wdGlvbic6J3JlbW92ZU1lbWJlcicsXG5cdFx0XHRcdFx0J3VzZXJJZCc6cGFyYW1zLnVzZXJJZCxcblx0XHRcdFx0XHQnZ3JvdXBJZCc6cGFyYW1zLmdyb3VwSWRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKGFuZ3VsYXIuaXNVbmRlZmluZWQocGFyYW1zKSl7XG5cdFx0XHRcdFx0Ly93b24ndCBoYXBwZW4hb3IgaWYgdGkgaGFwcGVuIHdlIHF1aXQgdG9vIGJhZCBoaWVyYWNoeSFcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdEdyb3VwLnJlbW92ZVBlb3BsZShuZXdQYXJhbXMpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLmluZm8oXCJSZW1vdmVkIE1lbWJlciBpbiBncm91cC5cIik7XG5cdCAgICAgICAgICAgIHNjb3BlLmluaXRBZGRQZW9wbGUocGFyYW1zLmdyb3VwSWQpO1xuXHQgICAgICAgICAgICBzY29wZS4kZW1pdCgncmVmcmVzaEdyb3VwJywnJyk7XG4gICAgICAgICAgICBcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblx0XHRcdFx0XHR9LCBmdW5jdGlvbiAoZXJyb3Isc3RhdHVzKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdFx0c2NvcGUucmVtb3ZlRnJvbUdyb3VwID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGNhbiByZW1vdmUgZmlsZSBpbiBncm91cCcpO1xuXHRcdFx0fVxuXHRcdFx0c2NvcGUuYWRkRmlsZVRvR3JvdXAgPSBmdW5jdGlvbihwYXJhbXMpe1xuXHRcdFx0XHR2YXIgZmlsZU9iaiA9e1xuXHRcdFx0XHRcdCdvcHRpb24nOidhZGRGaWxlcycsXG5cdFx0XHRcdFx0J2ZpbGVJZCc6cGFyYW1zLmZpbGVJZCxcblx0XHRcdFx0XHQnZ3JvdXBJZCc6cGFyYW1zLmdyb3VwSWRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdEdyb3VwLmFkZEZpbGVUb0dyb3VwKGZpbGVPYmopXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRcdFx0Ly8gdXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLnN1Y2Nlc3MoXCJBIGZpbGUgaXMgYWRkZWQgaW4gZ3JvdXBcIik7XG5cdFx0XHRcdH0sZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0XHR1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24ud2FybihcIlNvbWUgZXJyb3Igb2NjdXJlZCBkdXJpbmcgYWRkaW5nIGZpbGVcIik7XG5cdFx0XHRcdH0pXG5cblx0XHRcdH1cblx0XHRcdHNjb3BlLmZpbGVzSW5Cb3ggPSBmdW5jdGlvbihncm91cGlkKXtcblx0XHRcdFx0dmFyIHBhcmFtcyA9eydncm91cF9pZCc6Z3JvdXBpZCwnb3duZXInOidib3gnfTtcblx0XHRcdFx0c2NvcGUuJGVtaXQoJ3Nob3dPcHRpb25zJyxwYXJhbXMpO1xuXG5cdFx0XHR9XG5cdFx0XHRzY29wZS5maWxlc0luR3JvdXAgPSBmdW5jdGlvbihncm91cGlkKXtcblxuXHRcdFx0XHR2YXIgcGFyYW1zID17J2dyb3VwX2lkJzpncm91cGlkLCdvd25lcic6J2dyb3VwJ307XG5cdFx0XHRcdHNjb3BlLiRlbWl0KCdzaG93T3B0aW9ucycscGFyYW1zKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XSk7XG5cbnN5bmMuc2VydmljZSgnUmVwb3J0JywgW2Z1bmN0aW9uIFJlcG9ydCAoJGh0dHAsJHEsJHJvb3RTY29wZSkge1xuXHR0aGlzLnNlbmQgPSBmdW5jdGlvbihpc3N1ZSl7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9pc3N1ZXMnLCBpc3N1ZSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXMpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycikge1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHRyZXR1cm4gdGhpcztcbn1dKTtcbiIsIi8qIGdsb2JhbCBzeW5jICovXG5zeW5jLnNlcnZpY2UoJ1NldHRpbmdzJywgWyckaHR0cCcsJyRyb290U2NvcGUnLCckcScsZnVuY3Rpb24gKCRodHRwLCRyb290U2NvcGUsJHEpIHtcblx0dGhpcy5jdXJyZW50ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9zZXR0aW5ncycpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3Ape1xuICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufV0pO1xuXG5zeW5jLmNvbnRyb2xsZXIoJ1NldHRpbmdzQ29udHJvbGxlcicsIFsnJHNjb3BlJywnU2V0dGluZ3MnLCckbG9nJywgZnVuY3Rpb24gKCRzY29wZSxTZXR0aW5ncywkbG9nKSB7XG5cdCRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmxvYWRDdXJyZW50U2V0dGluZ3MoKTtcbiAgICB9XG4gICAgICRzY29wZS5sb2FkQ3VycmVudFNldHRpbmdzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgIFNldHRpbmdzLmN1cnJlbnQoKS50aGVuKGZ1bmN0aW9uKHJlc3Ape1xuICAgICAgICAgICAgICRzY29wZS5zZXR0aW5ncyA9IHJlc3A7XG4gICAgICAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICRsb2cuaW5mbygnZXJycm9yIHByZXZlbnQgcHJvbWlzZSB0byBiZSBmdWxsZmlsbCcpO1xuICAgICAgICAgfSk7XG4gICAgIH1cbiAgICAgJHNjb3BlLmluaXQoKTtcbn1dKTtcbiIsIi8qIGdsb2JhbCBzeW5jICovXG5zeW5jLmNvbnRyb2xsZXIoJ1NoYXJlQ29udHJvbGxlcicsIFtcblx0JyRzY29wZScsXG5cdCckcm9vdFNjb3BlJyxcblx0JyRyb3V0ZVBhcmFtcycsXG5cdCckcm91dGUnLFxuXHQnJGxvZycsXG5cdCckdWliTW9kYWwnLFxuXHQnU2hhcmUnLFxuXHQnVXNlcicsXG5cdGZ1bmN0aW9uIChcblx0XHQkc2NvcGUsXG5cdFx0JHJvb3RTY29wZSxcblx0XHQkcm91dGVQYXJhbXMsXG5cdFx0JHJvdXRlLFxuXHRcdCRsb2csXG5cdFx0JHVpYk1vZGFsLFxuXHRcdFNoYXJlLFxuXHRcdFVzZXJcblx0KSBcbntcblxuXHQkc2NvcGUuc2hhcmUgPSBmdW5jdGlvbihmaWxlX2lkKXtcblx0XHQvLyBhbGVydCgnaGVyZScpO1xuXHRcdGNvbnNvbGUubG9nKGZpbGVfaWQpO1xuXHR9O1xufVxuXSk7XG4iLCIvKiBnbG9iYWwgc3luYyAqL1xuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cbid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuXG4gICAgc3luYy5jb250cm9sbGVyKCdVcGxvYWRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnRmlsZVVwbG9hZGVyJywnJHJvb3RTY29wZScsJ0ZpbGVzJywgZnVuY3Rpb24oJHNjb3BlLCBGaWxlVXBsb2FkZXIsJHJvb3RTY29wZSxGaWxlcykge1xuICAgICAgICB2YXIgdXBsb2FkZXIgPSAkc2NvcGUudXBsb2FkZXIgPSBuZXcgRmlsZVVwbG9hZGVyKHtcbiAgICAgICAgICAgIHVybDogJHJvb3RTY29wZS5lbmRQb2ludCsnL2FwaS92MS91cGxvYWQnXG4gICAgICAgIH0pO1xuICAgICAgICAvL0ZJTFRFUlNcbiAgICAgICAgdXBsb2FkZXIuZmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6ICdjdXN0b21GaWx0ZXInLFxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uKGl0ZW0gLyp7RmlsZXxGaWxlTGlrZU9iamVjdH0qLywgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXVlLmxlbmd0aCA8IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy9DQUxMQkFDS1NcbiAgICAgICAgdXBsb2FkZXIub25XaGVuQWRkaW5nRmlsZUZhaWxlZCA9IGZ1bmN0aW9uKGl0ZW0gLyp7RmlsZXxGaWxlTGlrZU9iamVjdH0qLywgZmlsdGVyLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQnLCBpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkFmdGVyQWRkaW5nRmlsZSA9IGZ1bmN0aW9uKGZpbGVJdGVtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uQWZ0ZXJBZGRpbmdGaWxlJywgZmlsZUl0ZW0pO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkFmdGVyQWRkaW5nQWxsID0gZnVuY3Rpb24oYWRkZWRGaWxlSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25BZnRlckFkZGluZ0FsbCcsIGFkZGVkRmlsZUl0ZW1zKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25CZWZvcmVVcGxvYWRJdGVtID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdvbkJlZm9yZVVwbG9hZEl0ZW0nLCBpdGVtKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25Qcm9ncmVzc0l0ZW0gPSBmdW5jdGlvbihmaWxlSXRlbSwgcHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25Qcm9ncmVzc0l0ZW0nLCBmaWxlSXRlbSwgcHJvZ3Jlc3MpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vblByb2dyZXNzQWxsID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25Qcm9ncmVzc0FsbCcsIHByb2dyZXNzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25TdWNjZXNzSXRlbSA9IGZ1bmN0aW9uKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uU3VjY2Vzc0l0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uRXJyb3JJdGVtID0gZnVuY3Rpb24oZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25FcnJvckl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uQ2FuY2VsSXRlbSA9IGZ1bmN0aW9uKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uQ2FuY2VsSXRlbScsIGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25Db21wbGV0ZUl0ZW0gPSBmdW5jdGlvbihmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdvbkNvbXBsZXRlSXRlbScsIGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25Db21wbGV0ZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIEZpbGVzLmdldEJveEZpbGVzKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICRzY29wZS5maWxlcyBcdD1cdHJlcztcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5kYXRhTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25Db21wbGV0ZUFsbCcpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmluZm8oJ3VwbG9hZGVyJywgdXBsb2FkZXIpO1xuICAgIH1dKTtcbiIsInN5bmMuc2VydmljZSgndXJsU2hvcnRlbmVyJyxbZnVuY3Rpb24oKXtcbiAgdGhpcy5tYWtlU2hvcnQgPSBmdW5jdGlvbihsb25nVXJsKXtcbiAgICByZXR1cm4gbG9uZ1VybDtcbiAgfTtcbiAgLy8gdGhpcy5tYWtlU2hvcnQgPSBmdW5jdGlvbihsb25nVXJsKVxuICAvLyB7XG4gIC8vICAgLy8gIHZhciBsb25nVXJsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9uZ3VybFwiKS52YWx1ZTtcbiAgLy8gICAgIHZhciByZXF1ZXN0ID0gZ2FwaS5jbGllbnQudXJsc2hvcnRlbmVyLnVybC5pbnNlcnQoe1xuICAvLyAgICAgJ3Jlc291cmNlJzoge1xuICAvLyAgICAgICAnbG9uZ1VybCc6IGxvbmdVcmxcbiAgLy8gXHR9XG4gIC8vICAgICB9KTtcbiAgLy8gICAgIHJlcXVlc3QuZXhlY3V0ZShmdW5jdGlvbihyZXNwb25zZSlcbiAgLy8gXHR7XG4gIC8vXG4gIC8vIFx0XHRpZihyZXNwb25zZS5pZCAhPSBudWxsKVxuICAvLyBcdFx0e1xuICAvLyBcdFx0XHRzdHIgPVwiPGI+TG9uZyBVUkw6PC9iPlwiK2xvbmdVcmwrXCI8YnI+XCI7XG4gIC8vIFx0XHRcdHN0ciArPVwiPGI+eW91ciBGaWxlIGlzOjwvYj4gPGEgaHJlZj0nXCIrcmVzcG9uc2UuaWQrXCInPlwiK3Jlc3BvbnNlLmlkK1wiPC9hPjxicj5cIjtcbiAgLy8gXHRcdFx0cmV0dXJuIHN0cjtcbiAgLy8gXHRcdH1cbiAgLy8gXHRcdGVsc2VcbiAgLy8gXHRcdHtcbiAgLy8gXHRcdFx0Y29uc29sZS5sb2coXCJlcnJvcjogdW5hYmxlIHRvIGNyZWF0ZSBzaG9ydCB1cmxcIik7XG4gIC8vIFx0XHR9XG4gIC8vXG4gIC8vICAgICB9KTtcbiAgLy8gIH1cbiAgLy9cbiAgLy8gdGhpcy5nZXRTaG9ydEluZm8gPSBmdW5jdGlvbigpXG4gIC8vICB7XG4gIC8vICAgICAgdmFyIHNob3J0VXJsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcnR1cmxcIikudmFsdWU7XG4gIC8vXG4gIC8vICAgICAgdmFyIHJlcXVlc3QgPSBnYXBpLmNsaWVudC51cmxzaG9ydGVuZXIudXJsLmdldCh7XG4gIC8vICAgICAgICAnc2hvcnRVcmwnOiBzaG9ydFVybCxcbiAgLy8gIFx0ICAgICAncHJvamVjdGlvbic6J0ZVTEwnXG4gIC8vICAgICAgfSk7XG4gIC8vICAgICAgcmVxdWVzdC5leGVjdXRlKGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAvLyAgXHR7XG4gIC8vICBcdFx0aWYocmVzcG9uc2UubG9uZ1VybCE9IG51bGwpXG4gIC8vICBcdFx0e1xuICAvLyAgXHRcdFx0c3RyID1cIjxiPkxvbmcgVVJMOjwvYj5cIityZXNwb25zZS5sb25nVXJsK1wiPGJyPlwiO1xuICAvLyAgXHRcdFx0c3RyICs9XCI8Yj5DcmVhdGUgT246PC9iPlwiK3Jlc3BvbnNlLmNyZWF0ZWQrXCI8YnI+XCI7XG4gIC8vICBcdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm91dHB1dFwiKS5pbm5lckhUTUwgPSBzdHI7XG4gIC8vICBcdFx0fVxuICAvLyAgXHRcdGVsc2VcbiAgLy8gIFx0XHR7XG4gIC8vICBcdFx0XHRjb25zb2xlLmxvZyhcImVycm9yOiB1bmFibGUgdG8gZ2V0IFVSTCBpbmZvcm1hdGlvblwiKTtcbiAgLy8gIFx0XHR9XG4gIC8vXG4gIC8vICAgICAgfSk7XG4gIC8vXG4gIC8vICB9XG4gIC8vICBmdW5jdGlvbiBsb2FkKClcbiAgLy8gIHtcbiAgLy8gIFx0Z2FwaS5jbGllbnQuc2V0QXBpS2V5KCdBSXphU3lEU243ejdWMWY2SDN5WHJnQWxnVkd3NTJkU0VtcUFMSWMnKTsgLy9nZXQgeW91ciBvd25uIEJyb3dzZXIgQVBJIEtFWVxuICAvLyAgXHRnYXBpLmNsaWVudC5sb2FkKCd1cmxzaG9ydGVuZXInLCAndjEnLGZ1bmN0aW9uKCl7fSk7XG4gIC8vICB9XG4gIC8vICB3aW5kb3cub25sb2FkID0gbG9hZDtcbn1dKTtcbiIsIiAgLy9cbiAgLy8gKGZ1bmN0aW9uKGkscyxvLGcscixhLG0pe2lbJ0dvb2dsZUFuYWx5dGljc09iamVjdCddPXI7aVtyXT1pW3JdfHxmdW5jdGlvbigpe1xuICAvLyAoaVtyXS5xPWlbcl0ucXx8W10pLnB1c2goYXJndW1lbnRzKX0saVtyXS5sPTEqbmV3IERhdGUoKTthPXMuY3JlYXRlRWxlbWVudChvKSxcbiAgLy8gbT1zLmdldEVsZW1lbnRzQnlUYWdOYW1lKG8pWzBdO2EuYXN5bmM9MTthLnNyYz1nO20ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSxtKVxuICAvLyB9KSh3aW5kb3csZG9jdW1lbnQsJ3NjcmlwdCcsJy8vd3d3Lmdvb2dsZS1hbmFseXRpY3MuY29tL2FuYWx5dGljcy5qcycsJ2dhJyk7XG4gIC8vXG4gIC8vIGdhKCdjcmVhdGUnLCAnVUEtNjQ5NTU4NjYtMicsICdhdXRvJyk7XG4gIC8vIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4iLCIgICAgICAgIC8vdGhpcyBmdW5jdGlvbiBjYW4gcmVtb3ZlIGFuIGFycmF5IGVsZW1lbnQuXG4gICAgICAgICAgICBBcnJheS5yZW1vdmUgPSBmdW5jdGlvbihhcnJheSwgZnJvbSwgdG8pIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdCA9IGFycmF5LnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgYXJyYXkubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBhcnJheS5sZW5ndGggPSBmcm9tIDwgMCA/IGFycmF5Lmxlbmd0aCArIGZyb20gOiBmcm9tO1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheS5wdXNoLmFwcGx5KGFycmF5LCByZXN0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgdG90YWxfcG9wdXBzID0gMDtcbiAgICAgICAgICAgIHZhciBwb3B1cHMgPSBbXTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb3NlX3BvcHVwKGlkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaWlpID0gMDsgaWlpIDwgcG9wdXBzLmxlbmd0aDsgaWlpKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZihpZCA9PSBwb3B1cHNbaWlpXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucmVtb3ZlKHBvcHVwcywgaWlpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlX3BvcHVwcygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZGlzcGxheXMgdGhlIHBvcHVwcy4gRGlzcGxheXMgYmFzZWQgb24gdGhlIG1heGltdW0gbnVtYmVyIG9mIHBvcHVwcyB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb24gdGhlIGN1cnJlbnQgdmlld3BvcnQgd2lkdGhcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRpc3BsYXlfcG9wdXBzKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHQgPSAyMjA7XG5cbiAgICAgICAgICAgICAgICB2YXIgaWlpID0gMDtcbiAgICAgICAgICAgICAgICBmb3IoaWlpOyBpaWkgPCB0b3RhbF9wb3B1cHM7IGlpaSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocG9wdXBzW2lpaV0gIT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHVwc1tpaWldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucmlnaHQgPSByaWdodCArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gcmlnaHQgKyAzMjA7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGpqaiA9IGlpaTsgampqIDwgcG9wdXBzLmxlbmd0aDsgampqKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHVwc1tqampdKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhpcyBzY3JpcHQgaGFzIGJlZW4gYWRkZWQgYnkgbWUgZm9yIG15IGN1c3RvbWVcblxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheFNldHVwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdYLUNTUkYtVE9LRU4nOiAkKCdtZXRhW25hbWU9XCJjc3JmLXRva2VuXCJdJykuYXR0cignY29udGVudCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAgICAgICAgICQoXCIjY2hhdFwiKS5rZXlwcmVzcyhmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGV2dC53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwid2UgYXJlIGxpc3RuaW5nIHRvIGVudGVyIGV2ZW50XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXVzZXJuYW1lID0gJCgnI3Nob3V0X3VzZXJuYW1lJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWVzc2FnZSA9ICQoJyNzaG91dF9tZXNzYWdlJykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RfZGF0YSA9IHsndXNlcm5hbWUnOml1c2VybmFtZSwgJ21lc3NhZ2UnOmltZXNzYWdlfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3NlbmQgZGF0YSB0byBcInNob3V0LnBocFwiIHVzaW5nIGpRdWVyeSAkLnBvc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnBvc3QoJ3Nob3V0LnBocCcsIHBvc3RfZGF0YSwgZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FwcGVuZCBkYXRhIGludG8gbWVzc2FnZWJveCB3aXRoIGpRdWVyeSBmYWRlIGVmZmVjdCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZGF0YSkuaGlkZSgpLmFwcGVuZFRvKCcubWVzc2FnZV9ib3gnKS5mYWRlSW4oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9rZWVwIHNjcm9sbGVkIHRvIGJvdHRvbSBvZiBjaGF0IVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbHRvaCA9ICQoJy5tZXNzYWdlX2JveCcpWzBdLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5tZXNzYWdlX2JveCcpLnNjcm9sbFRvcChzY3JvbGx0b2gpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc2V0IHZhbHVlIG9mIG1lc3NhZ2UgYm94XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2hvdXRfbWVzc2FnZScpLnZhbCgnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2FsZXJ0IEhUVFAgc2VydmVyIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVyci5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL3RvZ2dsZSBoaWRlL3Nob3cgc2hvdXQgYm94XG4gICAgICAgICAgICAgICAgICAgICQoXCIuY2xvc2VfYnRuXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2dldCBDU1MgZGlzcGxheSBzdGF0ZSBvZiAudG9nZ2xlX2NoYXQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvZ2dsZVN0YXRlID0gJCgnLnRvZ2dsZV9jaGF0JykuY3NzKCdkaXNwbGF5Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdG9nZ2xlIHNob3cvaGlkZSBjaGF0IGJveFxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnRvZ2dsZV9jaGF0Jykuc2xpZGVUb2dnbGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy91c2UgdG9nZ2xlU3RhdGUgdmFyIHRvIGNoYW5nZSBjbG9zZS9vcGVuIGljb24gaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRvZ2dsZVN0YXRlID09ICdibG9jaycpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5oZWFkZXIgZGl2XCIpLmF0dHIoJ2NsYXNzJywgJ29wZW5fYnRuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmhlYWRlciBkaXZcIikuYXR0cignY2xhc3MnLCAnY2xvc2VfYnRuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvKmRvbmUgYWRkaW5nIG15IGN1c3RvbSBzY3JpcHRzKi9cbiAgICAgICAgICAgIC8vY3JlYXRlcyBtYXJrdXAgZm9yIGEgbmV3IHBvcHVwLiBBZGRzIHRoZSBpZCB0byBwb3B1cHMgYXJyYXkuXG4gICAgICAgICAgICBmdW5jdGlvbiByZWdpc3Rlcl9wb3B1cChpZCwgbmFtZSlcbiAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaWlpID0gMDsgaWlpIDwgcG9wdXBzLmxlbmd0aDsgaWlpKyspXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvL2FscmVhZHkgcmVnaXN0ZXJlZC4gQnJpbmcgaXQgdG8gZnJvbnQuXG4gICAgICAgICAgICAgICAgICAgIGlmKGlkID09IHBvcHVwc1tpaWldKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5yZW1vdmUocG9wdXBzLCBpaWkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cHMudW5zaGlmdChpZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZV9wb3B1cHMoKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudD0nPGRpdiBjbGFzcz1cInBvcHVwLWJveCBjaGF0LXBvcHVwXCIgaWQ9XCInKyBpZCArJ1wiPic7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPWVsZW1lbnQgKyAnPGRpdiBzdHlsZT1cImJhY2tncm91bmQ6I2RkZDtjb2xvcjojZmZmO1wiIGNsYXNzPVwiaGVhZGVyXCI+R3JvdXA8ZGl2IGNsYXNzPVwiY2xvc2VfYnRuXCI+Jm5ic3A7PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9ZWxlbWVudCArICcgPGRpdiBjbGFzcz1cInRvZ2dsZV9jaGF0XCI+JztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9ZWxlbWVudCArICc8ZGl2IGNsYXNzPVwibWVzc2FnZV9ib3hcIj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID1lbGVtZW50ICsgJzx0ZXh0YXJlYSBzdHlsZT1cImJhY2tncm91bmQ6d2hpdGU7bWFyZ2luLXRvcDoxODBweDtcIiBpZD1cImNoYXRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHJvd3M9XCIzXCIgcmVxdWlyZWQ9XCJyZXF1aXJlZFwiPjwvdGV4dGFyZWE+JztcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCA9ZWxlbWVudCArXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgPSBlbGVtZW50ICsgJzxkaXYgY2xhc3M9XCJwb3B1cC1oZWFkLXJpZ2h0XCI+PGEgaHJlZj1cImphdmFzY3JpcHQ6Y2xvc2VfcG9wdXAoXFwnJysgaWQgKydcXCcpO1wiPiYjMTAwMDU7PC9hPjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgLy8gdmFyIGVsZW1lbnQgPSAnPGRpdiBjbGFzcz1cInBvcHVwLWJveCBjaGF0LXBvcHVwXCIgaWQ9XCInKyBpZCArJ1wiPic7XG4gICAgICAgICAgICAgICAgLy8gZWxlbWVudCA9IGVsZW1lbnQgKyAnPGRpdiBjbGFzcz1cInBvcHVwLWhlYWRcIj4nO1xuICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgPSBlbGVtZW50ICsgJzxkaXYgY2xhc3M9XCJwb3B1cC1oZWFkLWxlZnRcIj4nKyBuYW1lICsnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAvLyBlbGVtZW50ID0gZWxlbWVudCArICc8ZGl2IGNsYXNzPVwicG9wdXAtaGVhZC1yaWdodFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OmNsb3NlX3BvcHVwKFxcJycrIGlkICsnXFwnKTtcIj4mIzEwMDA1OzwvYT48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgPSBlbGVtZW50ICsgJzxkaXYgc3R5bGU9XCJjbGVhcjogYm90aDtcIj48L2Rpdj48L2Rpdj48cCBvbmNsaWNrPVwidCgpXCIgaWQ9XCJtXCI+PC9wPjxkaXYgY2xhc3M9XCJwb3B1cC1tZXNzYWdlc1wiPjx0ZXh0YXJlYSAgY2xhc3M9XCJ0b3BcIj48L3RleHRhcmVhPjwvZGl2PjwvZGl2Pic7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmlubmVySFRNTCArIGVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBwb3B1cHMudW5zaGlmdChpZCk7XG5cbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVfcG9wdXBzKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jYWxjdWxhdGUgdGhlIHRvdGFsIG51bWJlciBvZiBwb3B1cHMgc3VpdGFibGUgYW5kIHRoZW4gcG9wdWxhdGUgdGhlIHRvYXRhbF9wb3B1cHMgdmFyaWFibGUuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVfcG9wdXBzKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICBpZih3aWR0aCA8IDU0MClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsX3BvcHVwcyA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gd2lkdGggLSAyMDA7XG4gICAgICAgICAgICAgICAgICAgIC8vMzIwIGlzIHdpZHRoIG9mIGEgc2luZ2xlIHBvcHVwIGJveFxuICAgICAgICAgICAgICAgICAgICB0b3RhbF9wb3B1cHMgPSBwYXJzZUludCh3aWR0aC8zMjApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRpc3BsYXlfcG9wdXBzKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9yZWNhbGN1bGF0ZSB3aGVuIHdpbmRvdyBpcyBsb2FkZWQgYW5kIGFsc28gd2hlbiB3aW5kb3cgaXMgcmVzaXplZC5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGNhbGN1bGF0ZV9wb3B1cHMpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNhbGN1bGF0ZV9wb3B1cHMpOyIsIi8vQXV0aG9yIE11cmFnaWppbWFuYSBSaWNoYXJkIHN0cmltdXBAZ21haWwuY29tIGJlYXN0YXI0NTdAZ21haWwuY29tXG5cbiAgc3luYy5jb250cm9sbGVyKCdNZXNzYWdlQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkaHR0cCwkc2NvcGUsJHEsJHJvb3RTY29wZSkge1xuICAgICAgICQuYWpheFNldHVwKHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnWC1DU1JGLVRPS0VOJzogJCgnbWV0YVtuYW1lPVwiY3NyZi10b2tlblwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIFxuICAgICAgICAgJHNjb3BlLm5hbWU9XCJNdXJhZ2lqaW1hbmFcIjtcbiAgICAgICAgIHZhciBwb3N0cz0kaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL3Bvc3QnKSxcbiAgICAgICAgICAgICBpbnN0aXR1dGlvbnM9JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9wb3N0Jyk7XG5cbiAgICAgICAgICAkcS5hbGwoW3Bvc3RzLGluc3RpdHV0aW9uc10pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIgdG1wID0gW107XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocmVzdWx0LCBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICB0bXAucHVzaChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRtcDtcbiAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHRtcFJlc3VsdCkge1xuICAgICAgICAgICAgICAvLyBwb3N0cz10bXBSZXN1bHQ7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFuZ3VsYXIudG9Kc29uKHRtcFJlc3VsdFswXSwgdHJ1ZSkpO1xuICAgICAgICAgICAgJHNjb3BlLnBvc3RzID0gdG1wUmVzdWx0WzBdO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgJCgnLnBvc3QtaW4nKS5hdHdobyh7XG4gICAgICAgICAgICBhdDogXCJAXCIsXG4gICAgICAgICAgICBkYXRhOlsnUGV0ZXInLCAnVG9tJywgJ0FubmUnXSxcblxuICAgICAgICAgfSk7XG5cbiAgfSk7XG4iLCJcbnN5bmMuY29udHJvbGxlcihcIlR1dG9yaWFsTW9kYWxcIiwgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gdHJ1ZTtcbiAgfTtcbiAgJHNjb3BlLm9rID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IGZhbHNlO1xuICB9O1xuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gZmFsc2U7XG4gIH07XG5cbn0pO1xuXG5zeW5jLmNvbnRyb2xsZXIoXCJTdHJpbWluTW9kYWxcIiwgZnVuY3Rpb24oJHNjb3BlKSB7XG5cbiAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gdHJ1ZTtcbiAgfTtcbiAgJHNjb3BlLm9rID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IGZhbHNlO1xuICB9O1xuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuc2hvd01vZGFsID0gZmFsc2U7XG4gIH07XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
