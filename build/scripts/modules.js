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

    $httpProvider.defaults.useXDomain = true;
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

        // $urlRouterProvider.otherwise('/Files');
        // $stateProvider.
        // state('/Feeds', {
        //   url: "/Feeds",
        //   templateUrl : 'views/feeds.html',
        //   controller  : 'PostingController'
        // })
        // .state('/Groups', {
        //   url: "/Groups",
        //   templateUrl: 'views/groups.html',
        //   controller: 'GroupController'
        // })
        //
        // .state('/Upload', {
        //   url: "/Upload",
        //   templateUrl: 'views/Upload.html',
        //   controller: 'UploadController'
        // })
        // .state('/Files', {
        //   url: "/Files",
        //   templateUrl: 'views/files.html',
        //   controller : 'FilesController'
        //
        // })
        //
        // .state('preview', {
        //     url: '/!/:preview/:extension/:of/:user',
        //     templateUrl: 'views/filePreview.html',
        //     controller : 'previewController'
        //   })
        //
        // .state('/People', {
        //   url: "/People",
        //   templateUrl: 'views/people.html',
        //   controller: 'PeopleController'
        // })
        //
        // .state('/Notifications', {
        //   url: "/Notifications",
        //   templateUrl: 'views/notifications.html',
        //   controller: 'notificationController'
        // })
        // .state('/Settings', {
        //   url: "/Settings",
        //   templateUrl: 'views/settings.html',
        //   controller: 'SettingsController'
        // });

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
		        templateUrl: '/App/scripts/views/upload.tpl.html',
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
			templateUrl: '/App/scripts/views/share.tpl.html',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXItdXBsb2FkLmpzIiwiYXBwQ29uZmlnLmpzIiwiYnV0dG9uLmpzIiwiZGlyZWN0aXZlcy5qcyIsImxvZ2luQ29udHJvbGxlci5qcyIsInJlZ2lzdGVyQ29udHJvbGxlci5qcyIsImNvbW1vbi9GaWxlU2VydmljZS5qcyIsImNvbW1vbi9QZW9wbGVTZXJ2aWNlLmpzIiwiY29tbW9uL1NoYXJlU2VydmljZS5qcyIsImNvbW1vbi9Vc2VyU2VydmljZS5qcyIsImNvbW1vbi9ub3RpZmljYXRpb24uanMiLCJjb21tb24vdXNlckludGVyYWN0aW9uTWFuYWdlci5qcyIsImNvbW1vbi91c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24uanMiLCJkaWFsb2dzL2RpYWxvZ0N0cmwuanMiLCJmZWVkcy9mZWVkcy5qcyIsImZpbGVzL2ZpbGUuanMiLCJmaWxlcy9wcmV2aWV3LmpzIiwiZm9sbG93ZXJzL2ZvbGxvd2Vycy5qcyIsImdyb3Vwcy9ncm91cHMuanMiLCJzZXR0aW5ncy9zZXR0aW5ncy5qcyIsInNoYXJpbmcvc2hhcmluZy5qcyIsInVwbG9hZGVyL3VwbG9hZGVyLmpzIiwidXJsU2hvcnRuZXIvc2hvcnRuZXIuanMiLCJmZWVkcy9jb250cm9sbGVyL2FuYWx5dGljcy5qcyIsImZlZWRzL2NvbnRyb2xsZXIvY2hhdFBvcHVwQ29udHJvbGxlci5qcyIsImZlZWRzL2NvbnRyb2xsZXIvbWVzc2FnZUNvbnRyb2xsZXIuanMiLCJmZWVkcy9jb250cm9sbGVyL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQUtBLENBQUMsU0FBUyxpQ0FBaUMsTUFBTSxTQUFTO0NBQ3pELEdBQUcsT0FBTyxZQUFZLFlBQVksT0FBTyxXQUFXO0VBQ25ELE9BQU8sVUFBVTtNQUNiLEdBQUcsT0FBTyxXQUFXLGNBQWMsT0FBTztFQUM5QyxPQUFPLElBQUk7TUFDUCxHQUFHLE9BQU8sWUFBWTtFQUMxQixRQUFRLHlCQUF5Qjs7RUFFakMsS0FBSyx5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T0FBTyxZQUFZOzs7O0FBSXZCIiwiZmlsZSI6Im1vZHVsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIGFuZ3VsYXItZmlsZS11cGxvYWQgdjIuMi4wXG4gaHR0cHM6Ly9naXRodWIuY29tL25lcnZnaC9hbmd1bGFyLWZpbGUtdXBsb2FkXG4qL1xuXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhbmd1bGFyLWZpbGUtdXBsb2FkXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFuZ3VsYXItZmlsZS11cGxvYWRcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcbi8qKioqKiovXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuLyoqKioqKi9cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi9cbi8qKioqKiovXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG4vKioqKioqL1xuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuLyoqKioqKi9cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcbi8qKioqKiovXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIG9wdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygyKSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlVXBsb2FkZXIgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygzKSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlTGlrZU9iamVjdCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDQpKTtcblxuXHR2YXIgc2VydmljZUZpbGVJdGVtID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oNSkpO1xuXG5cdHZhciBzZXJ2aWNlRmlsZURpcmVjdGl2ZSA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDYpKTtcblxuXHR2YXIgc2VydmljZUZpbGVTZWxlY3QgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXyg3KSk7XG5cblx0dmFyIHNlcnZpY2VGaWxlRHJvcCA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDgpKTtcblxuXHR2YXIgc2VydmljZUZpbGVPdmVyID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oOSkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlU2VsZWN0ID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMTApKTtcblxuXHR2YXIgZGlyZWN0aXZlRmlsZURyb3AgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxMSkpO1xuXG5cdHZhciBkaXJlY3RpdmVGaWxlT3ZlciA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKSk7XG5cblx0YW5ndWxhci5tb2R1bGUoQ09ORklHLm5hbWUsIFtdKS52YWx1ZShcImZpbGVVcGxvYWRlck9wdGlvbnNcIiwgb3B0aW9ucykuZmFjdG9yeShcIkZpbGVVcGxvYWRlclwiLCBzZXJ2aWNlRmlsZVVwbG9hZGVyKS5mYWN0b3J5KFwiRmlsZUxpa2VPYmplY3RcIiwgc2VydmljZUZpbGVMaWtlT2JqZWN0KS5mYWN0b3J5KFwiRmlsZUl0ZW1cIiwgc2VydmljZUZpbGVJdGVtKS5mYWN0b3J5KFwiRmlsZURpcmVjdGl2ZVwiLCBzZXJ2aWNlRmlsZURpcmVjdGl2ZSkuZmFjdG9yeShcIkZpbGVTZWxlY3RcIiwgc2VydmljZUZpbGVTZWxlY3QpLmZhY3RvcnkoXCJGaWxlRHJvcFwiLCBzZXJ2aWNlRmlsZURyb3ApLmZhY3RvcnkoXCJGaWxlT3ZlclwiLCBzZXJ2aWNlRmlsZU92ZXIpLmRpcmVjdGl2ZShcIm52RmlsZVNlbGVjdFwiLCBkaXJlY3RpdmVGaWxlU2VsZWN0KS5kaXJlY3RpdmUoXCJudkZpbGVEcm9wXCIsIGRpcmVjdGl2ZUZpbGVEcm9wKS5kaXJlY3RpdmUoXCJudkZpbGVPdmVyXCIsIGRpcmVjdGl2ZUZpbGVPdmVyKS5ydW4oW1wiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZUxpa2VPYmplY3RcIiwgXCJGaWxlSXRlbVwiLCBcIkZpbGVEaXJlY3RpdmVcIiwgXCJGaWxlU2VsZWN0XCIsIFwiRmlsZURyb3BcIiwgXCJGaWxlT3ZlclwiLCBmdW5jdGlvbiAoRmlsZVVwbG9hZGVyLCBGaWxlTGlrZU9iamVjdCwgRmlsZUl0ZW0sIEZpbGVEaXJlY3RpdmUsIEZpbGVTZWxlY3QsIEZpbGVEcm9wLCBGaWxlT3Zlcikge1xuXHQgICAgLy8gb25seSBmb3IgY29tcGF0aWJpbGl0eVxuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVMaWtlT2JqZWN0ID0gRmlsZUxpa2VPYmplY3Q7XG5cdCAgICBGaWxlVXBsb2FkZXIuRmlsZUl0ZW0gPSBGaWxlSXRlbTtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlRGlyZWN0aXZlID0gRmlsZURpcmVjdGl2ZTtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlU2VsZWN0ID0gRmlsZVNlbGVjdDtcblx0ICAgIEZpbGVVcGxvYWRlci5GaWxlRHJvcCA9IEZpbGVEcm9wO1xuXHQgICAgRmlsZVVwbG9hZGVyLkZpbGVPdmVyID0gRmlsZU92ZXI7XG5cdH1dKTtcblxuLyoqKi8gfSxcblxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdFx0XCJuYW1lXCI6IFwiYW5ndWxhckZpbGVVcGxvYWRcIlxuXHR9O1xuXG4vKioqLyB9LFxuLyogMiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSB7XG5cdCAgICB1cmw6IFwiL1wiLFxuXHQgICAgYWxpYXM6IFwiZmlsZVwiLFxuXHQgICAgaGVhZGVyczogeydhdXRob3JpemF0aW9uJzogJ0JlYXJlciBCYzdEV1M3S0tSTHR4bWRkVVpJMVQxbFp1MkoxWWhSOE9MWEdXTlpuJ30sXG5cdCAgICBxdWV1ZTogW10sXG5cdCAgICBwcm9ncmVzczogMCxcblx0ICAgIGF1dG9VcGxvYWQ6IGZhbHNlLFxuXHQgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IGZhbHNlLFxuXHQgICAgbWV0aG9kOiBcIlBPU1RcIixcblx0ICAgIGZpbHRlcnM6IFtdLFxuXHQgICAgZm9ybURhdGE6IFtdLFxuXHQgICAgcXVldWVMaW1pdDogTnVtYmVyLk1BWF9WQUxVRSxcblx0ICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2Vcblx0fTtcblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgY29weSA9IGFuZ3VsYXIuY29weTtcblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXHR2YXIgZm9yRWFjaCA9IGFuZ3VsYXIuZm9yRWFjaDtcblx0dmFyIGlzT2JqZWN0ID0gYW5ndWxhci5pc09iamVjdDtcblx0dmFyIGlzTnVtYmVyID0gYW5ndWxhci5pc051bWJlcjtcblx0dmFyIGlzRGVmaW5lZCA9IGFuZ3VsYXIuaXNEZWZpbmVkO1xuXHR2YXIgaXNBcnJheSA9IGFuZ3VsYXIuaXNBcnJheTtcblx0dmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmlsZVVwbG9hZGVyT3B0aW9ucywgJHJvb3RTY29wZSwgJGh0dHAsICR3aW5kb3csIEZpbGVMaWtlT2JqZWN0LCBGaWxlSXRlbSkge1xuXHQgICAgdmFyIEZpbGUgPSAkd2luZG93LkZpbGU7XG5cdCAgICB2YXIgRm9ybURhdGEgPSAkd2luZG93LkZvcm1EYXRhO1xuXG5cdCAgICB2YXIgRmlsZVVwbG9hZGVyID0gKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAqIFBVQkxJQ1xuXHQgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuXHQgICAgICAgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAgICAgICAqL1xuXG5cdCAgICAgICAgZnVuY3Rpb24gRmlsZVVwbG9hZGVyKG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVVcGxvYWRlcik7XG5cblx0ICAgICAgICAgICAgdmFyIHNldHRpbmdzID0gY29weShmaWxlVXBsb2FkZXJPcHRpb25zKTtcblxuXHQgICAgICAgICAgICBleHRlbmQodGhpcywgc2V0dGluZ3MsIG9wdGlvbnMsIHtcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIF9uZXh0SW5kZXg6IDAsXG5cdCAgICAgICAgICAgICAgICBfZmFpbEZpbHRlckluZGV4OiAtMSxcblx0ICAgICAgICAgICAgICAgIF9kaXJlY3RpdmVzOiB7IHNlbGVjdDogW10sIGRyb3A6IFtdLCBvdmVyOiBbXSB9XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIC8vIGFkZCBkZWZhdWx0IGZpbHRlcnNcblx0ICAgICAgICAgICAgdGhpcy5maWx0ZXJzLnVuc2hpZnQoeyBuYW1lOiBcInF1ZXVlTGltaXRcIiwgZm46IHRoaXMuX3F1ZXVlTGltaXRGaWx0ZXIgfSk7XG5cdCAgICAgICAgICAgIHRoaXMuZmlsdGVycy51bnNoaWZ0KHsgbmFtZTogXCJmb2xkZXJcIiwgZm46IHRoaXMuX2ZvbGRlckZpbHRlciB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZVVwbG9hZGVyLCB7XG5cdCAgICAgICAgICAgIGFkZFRvUXVldWU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQWRkcyBpdGVtcyB0byB0aGUgcXVldWVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxIVE1MSW5wdXRFbGVtZW50fE9iamVjdHxGaWxlTGlzdHxBcnJheTxPYmplY3Q+fSBmaWxlc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj58U3RyaW5nfSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFRvUXVldWUoZmlsZXMsIG9wdGlvbnMsIGZpbHRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzLmlzQXJyYXlMaWtlT2JqZWN0KGZpbGVzKSA/IGZpbGVzIDogW2ZpbGVzXTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgYXJyYXlPZkZpbHRlcnMgPSB0aGlzLl9nZXRGaWx0ZXJzKGZpbHRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjb3VudCA9IHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBhZGRlZEZpbGVJdGVtcyA9IFtdO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChsaXN0LCBmdW5jdGlvbiAoc29tZSAvKntGaWxlfEhUTUxJbnB1dEVsZW1lbnR8T2JqZWN0fSovKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gbmV3IEZpbGVMaWtlT2JqZWN0KHNvbWUpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5faXNWYWxpZEZpbGUodGVtcCwgYXJyYXlPZkZpbHRlcnMsIG9wdGlvbnMpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZUl0ZW0gPSBuZXcgRmlsZUl0ZW0oX3RoaXMsIHNvbWUsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRGaWxlSXRlbXMucHVzaChmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5xdWV1ZS5wdXNoKGZpbGVJdGVtKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkFmdGVyQWRkaW5nRmlsZShmaWxlSXRlbSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmlsdGVyID0gYXJyYXlPZkZpbHRlcnNbX3RoaXMuX2ZhaWxGaWx0ZXJJbmRleF07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25XaGVuQWRkaW5nRmlsZUZhaWxlZCh0ZW1wLCBmaWx0ZXIsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggIT09IGNvdW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQWZ0ZXJBZGRpbmdBbGwoYWRkZWRGaWxlSXRlbXMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5fZ2V0VG90YWxQcm9ncmVzcygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9VcGxvYWQpIHRoaXMudXBsb2FkQWxsKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHJlbW92ZUZyb21RdWV1ZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZW1vdmUgaXRlbXMgZnJvbSB0aGUgcXVldWUuIFJlbW92ZSBsYXN0OiBpbmRleCA9IC0xXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfE51bWJlcn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlRnJvbVF1ZXVlKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleE9mSXRlbSh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXVlW2luZGV4XTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5pc1VwbG9hZGluZykgaXRlbS5jYW5jZWwoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fZGVzdHJveSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLl9nZXRUb3RhbFByb2dyZXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNsZWFyUXVldWU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2xlYXJzIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhclF1ZXVlKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLnF1ZXVlLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlWzBdLnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBVcGxvYWRzIGEgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEl0ZW0odmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4T2ZJdGVtKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVldWVbaW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc3BvcnQgPSB0aGlzLmlzSFRNTDUgPyBcIl94aHJUcmFuc3BvcnRcIiA6IFwiX2lmcmFtZVRyYW5zcG9ydFwiO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fcHJlcGFyZVRvVXBsb2FkaW5nKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH10aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzW3RyYW5zcG9ydF0oaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyB1cGxvYWRpbmcgb2YgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbXxOdW1iZXJ9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhbmNlbEl0ZW0odmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4T2ZJdGVtKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVldWVbaW5kZXhdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5pc0hUTUw1ID8gXCJfeGhyXCIgOiBcIl9mb3JtXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbS5pc1VwbG9hZGluZykgaXRlbVtwcm9wXS5hYm9ydCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICB1cGxvYWRBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhbGwgbm90IHVwbG9hZGVkIGl0ZW1zIG9mIHF1ZXVlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZEFsbCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmdldE5vdFVwbG9hZGVkSXRlbXMoKS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFpdGVtLmlzVXBsb2FkaW5nO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9Zm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uX3ByZXBhcmVUb1VwbG9hZGluZygpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW1zWzBdLnVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBjYW5jZWxBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FuY2VscyBhbGwgdXBsb2Fkc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWxBbGwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY2FuY2VsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGlzRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNGaWxlKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNGaWxlKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNGaWxlTGlrZU9iamVjdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZUxpa2VPYmplY3QodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5pc0ZpbGVMaWtlT2JqZWN0KHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNBcnJheUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBpcyBhcnJheSBsaWtlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuaXNBcnJheUxpa2VPYmplY3QodmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRJbmRleE9mSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGEgaW5kZXggb2YgaXRlbSBmcm9tIHRoZSBxdWV1ZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtJdGVtfE51bWJlcn0gdmFsdWVcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluZGV4T2ZJdGVtKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSA/IHZhbHVlIDogdGhpcy5xdWV1ZS5pbmRleE9mKHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0Tm90VXBsb2FkZWRJdGVtczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG5vdCB1cGxvYWRlZCBpdGVtc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXROb3RVcGxvYWRlZEl0ZW1zKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXVlLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWl0ZW0uaXNVcGxvYWRlZDtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgZ2V0UmVhZHlJdGVtczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIGl0ZW1zIHJlYWR5IGZvciB1cGxvYWRcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UmVhZHlJdGVtcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNSZWFkeSAmJiAhaXRlbS5pc1VwbG9hZGluZztcblx0ICAgICAgICAgICAgICAgICAgICB9KS5zb3J0KGZ1bmN0aW9uIChpdGVtMSwgaXRlbTIpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0xLmluZGV4IC0gaXRlbTIuaW5kZXg7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGRlc3Ryb3k6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRGVzdHJveXMgaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2godGhpcy5fZGlyZWN0aXZlcywgZnVuY3Rpb24gKGtleSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKF90aGlzLl9kaXJlY3RpdmVzW2tleV0sIGZ1bmN0aW9uIChvYmplY3QpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5kZXN0cm95KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkFmdGVyQWRkaW5nQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBmaWxlSXRlbXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25BZnRlckFkZGluZ0FsbChmaWxlSXRlbXMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQWZ0ZXJBZGRpbmdGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBmaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkFmdGVyQWRkaW5nRmlsZShmaWxlSXRlbSkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25XaGVuQWRkaW5nRmlsZUZhaWxlZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfE9iamVjdH0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZpbHRlclxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25XaGVuQWRkaW5nRmlsZUZhaWxlZChpdGVtLCBmaWx0ZXIsIG9wdGlvbnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQmVmb3JlVXBsb2FkSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25CZWZvcmVVcGxvYWRJdGVtKGZpbGVJdGVtKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblByb2dyZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gZmlsZUl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzSXRlbShmaWxlSXRlbSwgcHJvZ3Jlc3MpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uUHJvZ3Jlc3NBbGw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzQWxsKHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblN1Y2Nlc3NJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uRXJyb3JJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkVycm9ySXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNhbmNlbEl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNvbXBsZXRlSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Db21wbGV0ZUFsbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNvbXBsZXRlQWxsKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2dldFRvdGFsUHJvZ3Jlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG5cdCAgICAgICAgICAgICAgICAgKiBQUklWQVRFXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyB0aGUgdG90YWwgcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdmFsdWVdXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRvdGFsUHJvZ3Jlc3ModmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVBZnRlclVwbG9hZCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgfHwgMDtcblx0ICAgICAgICAgICAgICAgICAgICB9dmFyIG5vdFVwbG9hZGVkID0gdGhpcy5nZXROb3RVcGxvYWRlZEl0ZW1zKCkubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB1cGxvYWRlZCA9IG5vdFVwbG9hZGVkID8gdGhpcy5xdWV1ZS5sZW5ndGggLSBub3RVcGxvYWRlZCA6IHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByYXRpbyA9IDEwMCAvIHRoaXMucXVldWUubGVuZ3RoO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gKHZhbHVlIHx8IDApICogcmF0aW8gLyAxMDA7XG5cblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh1cGxvYWRlZCAqIHJhdGlvICsgY3VycmVudCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgYXJyYXkgb2YgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj58U3RyaW5nfSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXk8RnVuY3Rpb24+fVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldEZpbHRlcnMoZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICghZmlsdGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICAgICAgICAgIH1pZiAoaXNBcnJheShmaWx0ZXJzKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVycztcblx0ICAgICAgICAgICAgICAgICAgICB9dmFyIG5hbWVzID0gZmlsdGVycy5tYXRjaCgvW15cXHMsXSsvZyk7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVycy5maWx0ZXIoZnVuY3Rpb24gKGZpbHRlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZXMuaW5kZXhPZihmaWx0ZXIubmFtZSkgIT09IC0xO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcmVuZGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVwZGF0ZXMgaHRtbFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbmRlcigpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoISRyb290U2NvcGUuJCRwaGFzZSkgJHJvb3RTY29wZS4kYXBwbHkoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2ZvbGRlckZpbHRlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIGl0ZW0gaXMgYSBmaWxlIChub3QgZm9sZGVyKVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlfEZpbGVMaWtlT2JqZWN0fSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9mb2xkZXJGaWx0ZXIoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIShpdGVtLnNpemUgfHwgaXRlbS50eXBlKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3F1ZXVlTGltaXRGaWx0ZXI6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB0aGUgbGltaXQgaGFzIG5vdCBiZWVuIHJlYWNoZWRcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3F1ZXVlTGltaXRGaWx0ZXIoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVldWUubGVuZ3RoIDwgdGhpcy5xdWV1ZUxpbWl0O1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfaXNWYWxpZEZpbGU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiBmaWxlIHBhc3MgYWxsIGZpbHRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZXxPYmplY3R9IGZpbGVcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fSBmaWx0ZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaXNWYWxpZEZpbGUoZmlsZSwgZmlsdGVycywgb3B0aW9ucykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWlsRmlsdGVySW5kZXggPSAtMTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWZpbHRlcnMubGVuZ3RoID8gdHJ1ZSA6IGZpbHRlcnMuZXZlcnkoZnVuY3Rpb24gKGZpbHRlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZmFpbEZpbHRlckluZGV4Kys7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXIuZm4uY2FsbChfdGhpcywgZmlsZSwgb3B0aW9ucyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9pc1N1Y2Nlc3NDb2RlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENoZWNrcyB3aGV0aGVyIHVwbG9hZCBzdWNjZXNzZnVsXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pc1N1Y2Nlc3NDb2RlKHN0YXR1cykge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3RyYW5zZm9ybVJlc3BvbnNlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFRyYW5zZm9ybXMgdGhlIHNlcnZlciByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3RyYW5zZm9ybVJlc3BvbnNlKHJlc3BvbnNlLCBoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnNHZXR0ZXIgPSB0aGlzLl9oZWFkZXJzR2V0dGVyKGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goJGh0dHAuZGVmYXVsdHMudHJhbnNmb3JtUmVzcG9uc2UsIGZ1bmN0aW9uICh0cmFuc2Zvcm1Gbikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRyYW5zZm9ybUZuKHJlc3BvbnNlLCBoZWFkZXJzR2V0dGVyKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9wYXJzZUhlYWRlcnM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUGFyc2VkIHJlc3BvbnNlIGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHQgICAgICAgICAgICAgICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvbWFzdGVyL3NyYy9uZy9odHRwLmpzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcGFyc2VIZWFkZXJzKGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkID0ge30sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCFoZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQ7XG5cdCAgICAgICAgICAgICAgICAgICAgfWZvckVhY2goaGVhZGVycy5zcGxpdChcIlxcblwiKSwgZnVuY3Rpb24gKGxpbmUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGxpbmUuaW5kZXhPZihcIjpcIik7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGxpbmUuc2xpY2UoMCwgaSkudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGxpbmUuc2xpY2UoaSArIDEpLnRyaW0oKTtcblxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRba2V5XSA9IHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gKyBcIiwgXCIgKyB2YWwgOiB2YWw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQ7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9oZWFkZXJzR2V0dGVyOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJzZWRIZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfaGVhZGVyc0dldHRlcihwYXJzZWRIZWFkZXJzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkSGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldIHx8IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZEhlYWRlcnM7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3hoclRyYW5zcG9ydDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBUaGUgWE1MSHR0cFJlcXVlc3QgdHJhbnNwb3J0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfeGhyVHJhbnNwb3J0KGl0ZW0pIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IGl0ZW0uX3hociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKGl0ZW0uZm9ybURhdGEsIGZ1bmN0aW9uIChvYmopIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChrZXksIHZhbHVlKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0uX2ZpbGUuc2l6ZSAhPSBcIm51bWJlclwiKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGUgZmlsZSBzcGVjaWZpZWQgaXMgbm8gbG9uZ2VyIHZhbGlkXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGl0ZW0uYWxpYXMsIGl0ZW0uX2ZpbGUsIGl0ZW0uZmlsZS5uYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBNYXRoLnJvdW5kKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUgPyBldmVudC5sb2FkZWQgKiAxMDAgLyBldmVudC50b3RhbCA6IDApO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Qcm9ncmVzc0l0ZW0oaXRlbSwgcHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVhZGVycyA9IF90aGlzLl9wYXJzZUhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gX3RoaXMuX3RyYW5zZm9ybVJlc3BvbnNlKHhoci5yZXNwb25zZSwgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnaXN0ID0gX3RoaXMuX2lzU3VjY2Vzc0NvZGUoeGhyLnN0YXR1cykgPyBcIlN1Y2Nlc3NcIiA6IFwiRXJyb3JcIjtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IFwiX29uXCIgKyBnaXN0ICsgXCJJdGVtXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzW21ldGhvZF0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHhoci5zdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cblx0ICAgICAgICAgICAgICAgICAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBfdGhpcy5fcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fb25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4oaXRlbS5tZXRob2QsIGl0ZW0udXJsLCB0cnVlKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBpdGVtLndpdGhDcmVkZW50aWFscztcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbS5oZWFkZXJzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZm9ybSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9pZnJhbWVUcmFuc3BvcnQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVGhlIElGcmFtZSB0cmFuc3BvcnRcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9pZnJhbWVUcmFuc3BvcnQoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybSA9IGVsZW1lbnQoXCI8Zm9ybSBzdHlsZT1cXFwiZGlzcGxheTogbm9uZTtcXFwiIC8+XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpZnJhbWUgPSBlbGVtZW50KFwiPGlmcmFtZSBuYW1lPVxcXCJpZnJhbWVUcmFuc3BvcnRcIiArIERhdGUubm93KCkgKyBcIlxcXCI+XCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGl0ZW0uX2lucHV0O1xuXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uX2Zvcm0pIGl0ZW0uX2Zvcm0ucmVwbGFjZVdpdGgoaW5wdXQpOyAvLyByZW1vdmUgb2xkIGZvcm1cblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9mb3JtID0gZm9ybTsgLy8gc2F2ZSBsaW5rIHRvIG5ldyBmb3JtXG5cblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkJlZm9yZVVwbG9hZEl0ZW0oaXRlbSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpbnB1dC5wcm9wKFwibmFtZVwiLCBpdGVtLmFsaWFzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvckVhY2goaXRlbS5mb3JtRGF0YSwgZnVuY3Rpb24gKG9iaikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50XyA9IGVsZW1lbnQoXCI8aW5wdXQgdHlwZT1cXFwiaGlkZGVuXFxcIiBuYW1lPVxcXCJcIiArIGtleSArIFwiXFxcIiAvPlwiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRfLnZhbCh2YWx1ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtLmFwcGVuZChlbGVtZW50Xyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgZm9ybS5wcm9wKHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBpdGVtLnVybCxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBpZnJhbWUucHJvcChcIm5hbWVcIiksXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGVuY3R5cGU6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGluZzogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgLy8gb2xkIElFXG5cdCAgICAgICAgICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBpZnJhbWUuYmluZChcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSAyMDA7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpeCBmb3IgbGVnYWN5IElFIGJyb3dzZXJzIHRoYXQgbG9hZHMgaW50ZXJuYWwgZXJyb3IgcGFnZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiBmYWlsZWQgV1MgcmVzcG9uc2UgcmVjZWl2ZWQuIEluIGNvbnNlcXVlbmNlIGlmcmFtZVxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGVudCBhY2Nlc3MgZGVuaWVkIGVycm9yIGlzIHRocm93biBiZWNvdXNlIHRyeWluZyB0b1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWNjZXNzIGNyb3NzIGRvbWFpbiBwYWdlLiBXaGVuIHN1Y2ggdGhpbmcgb2NjdXJzIG5vdGlmeWluZ1xuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2l0aCBlbXB0eSByZXNwb25zZSBvYmplY3QuIFNlZSBtb3JlIGluZm8gYXQ6XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE1MTM2Mi9hY2Nlc3MtaXMtZGVuaWVkLWVycm9yLW9uLWFjY2Vzc2luZy1pZnJhbWUtZG9jdW1lbnQtb2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgaWYgbm9uIHN0YW5kYXJkIDR4eCBvciA1eHggZXJyb3IgY29kZSByZXR1cm5lZFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSBXUyB0aGVuIHJlc3BvbnNlIGNvbnRlbnQgY2FuIGJlIGFjY2Vzc2VkIHdpdGhvdXQgZXJyb3Jcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCAnWEhSJyBzdGF0dXMgYmVjb21lcyAyMDAuIEluIG9yZGVyIHRvIGF2b2lkIGNvbmZ1c2lvblxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuaW5nIHJlc3BvbnNlIHZpYSBzYW1lICdzdWNjZXNzJyBldmVudCBoYW5kbGVyLlxuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZCBhbmd1bGFyLmNvbnRlbnRzKCkgZm9yIGlmcmFtZXNcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSBpZnJhbWVbMF0uY29udGVudERvY3VtZW50LmJvZHkuaW5uZXJIVE1MO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBjYXNlIHdlIHJ1biBpbnRvIHRoZSBhY2Nlc3MtaXMtZGVuaWVkIGVycm9yIG9yIHdlIGhhdmUgYW5vdGhlciBlcnJvciBvbiB0aGUgc2VydmVyIHNpZGVcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIChpbnRlbnRpb25hbCA1MDAsNDAuLi4gZXJyb3JzKSwgd2UgYXQgbGVhc3Qgc2F5ICdzb21ldGhpbmcgd2VudCB3cm9uZycgLT4gNTAwXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMgPSA1MDA7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgeGhyID0geyByZXNwb25zZTogaHRtbCwgc3RhdHVzOiBzdGF0dXMsIGR1bW15OiB0cnVlIH07XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0ge307XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IF90aGlzLl90cmFuc2Zvcm1SZXNwb25zZSh4aHIucmVzcG9uc2UsIGhlYWRlcnMpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ29tcGxldGVJdGVtKGl0ZW0sIHJlc3BvbnNlLCB4aHIuc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4aHIgPSB7IHN0YXR1czogMCwgZHVtbXk6IHRydWUgfTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSB7fTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmcmFtZS51bmJpbmQoXCJsb2FkXCIpLnByb3AoXCJzcmNcIiwgXCJqYXZhc2NyaXB0OmZhbHNlO1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXBsYWNlV2l0aChpbnB1dCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX29uQ2FuY2VsSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgeGhyLnN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmFmdGVyKGZvcm0pO1xuXHQgICAgICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kKGlucHV0KS5hcHBlbmQoaWZyYW1lKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGZvcm1bMF0uc3VibWl0KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbldoZW5BZGRpbmdGaWxlRmFpbGVkOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8T2JqZWN0fSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZmlsdGVyXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uV2hlbkFkZGluZ0ZpbGVGYWlsZWQoaXRlbSwgZmlsdGVyLCBvcHRpb25zKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbldoZW5BZGRpbmdGaWxlRmFpbGVkKGl0ZW0sIGZpbHRlciwgb3B0aW9ucyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkFmdGVyQWRkaW5nRmlsZToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25BZnRlckFkZGluZ0ZpbGUoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25BZnRlckFkZGluZ0ZpbGUoaXRlbSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkFmdGVyQWRkaW5nQWxsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5PEZpbGVJdGVtPn0gaXRlbXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQWZ0ZXJBZGRpbmdBbGwoaXRlbXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQWZ0ZXJBZGRpbmdBbGwoaXRlbXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25CZWZvcmVVcGxvYWRJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqICBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQmVmb3JlVXBsb2FkSXRlbShpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5fb25CZWZvcmVVcGxvYWQoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkSXRlbShpdGVtKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uUHJvZ3Jlc3NJdGVtOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGVJdGVtfSBpdGVtXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblByb2dyZXNzSXRlbShpdGVtLCBwcm9ncmVzcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0b3RhbCA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MocHJvZ3Jlc3MpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0b3RhbDtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vblByb2dyZXNzKHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3NJdGVtKGl0ZW0sIHByb2dyZXNzKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUHJvZ3Jlc3NBbGwodG90YWwpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlcigpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25TdWNjZXNzSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpdGVtLl9vblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3NJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25FcnJvckl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25FcnJvckl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uRXJyb3IocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9ySXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX29uQ2FuY2VsSXRlbToge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGaWxlSXRlbX0gaXRlbVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSByZXNwb25zZVxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vbkNhbmNlbEl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQ2FuY2VsKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25DYW5jZWxJdGVtKGl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25Db21wbGV0ZUl0ZW06IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RmlsZUl0ZW19IGl0ZW1cblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25Db21wbGV0ZUl0ZW0oaXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uX29uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlSXRlbShpdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbSA9IHRoaXMuZ2V0UmVhZHlJdGVtcygpWzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChpc0RlZmluZWQobmV4dEl0ZW0pKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLnVwbG9hZCgpO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlQWxsKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMuX2dldFRvdGFsUHJvZ3Jlc3MoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXIoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sIHtcblx0ICAgICAgICAgICAgaXNGaWxlOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogU1RBVElDXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBhbiBpbnN0YW5jZSBvZiBGaWxlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZSh2YWx1ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBGaWxlICYmIHZhbHVlIGluc3RhbmNlb2YgRmlsZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNGaWxlTGlrZU9iamVjdDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIFwidHJ1ZVwiIGlmIHZhbHVlIGFuIGluc3RhbmNlIG9mIEZpbGVMaWtlT2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRmlsZUxpa2VPYmplY3QodmFsdWUpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBGaWxlTGlrZU9iamVjdDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgaXNBcnJheUxpa2VPYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB2YWx1ZSBpcyBhcnJheSBsaWtlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuXHQgICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBcImxlbmd0aFwiIGluIHZhbHVlO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpbmhlcml0OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEluaGVyaXRzIGEgdGFyZ2V0IChDbGFzc18xKSBieSBhIHNvdXJjZSAoQ2xhc3NfMilcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRhcmdldFxuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc291cmNlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaGVyaXQodGFyZ2V0LCBzb3VyY2UpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzb3VyY2UucHJvdG90eXBlKTtcblx0ICAgICAgICAgICAgICAgICAgICB0YXJnZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gdGFyZ2V0O1xuXHQgICAgICAgICAgICAgICAgICAgIHRhcmdldC5zdXBlcl8gPSBzb3VyY2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlVXBsb2FkZXI7XG5cdCAgICB9KSgpO1xuXG5cdCAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICogUFVCTElDXG5cdCAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgIC8qKlxuXHQgICAgICogQ2hlY2tzIGEgc3VwcG9ydCB0aGUgaHRtbDUgdXBsb2FkZXJcblx0ICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuXHQgICAgICogQHJlYWRvbmx5XG5cdCAgICAgKi9cblx0ICAgIEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNSA9ICEhKEZpbGUgJiYgRm9ybURhdGEpO1xuXHQgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAqIFNUQVRJQ1xuXHQgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cdCAgICAvKipcblx0ICAgICAqIEBib3Jyb3dzIEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNVxuXHQgICAgICovXG5cdCAgICBGaWxlVXBsb2FkZXIuaXNIVE1MNSA9IEZpbGVVcGxvYWRlci5wcm90b3R5cGUuaXNIVE1MNTtcblxuXHQgICAgcmV0dXJuIEZpbGVVcGxvYWRlcjtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiZmlsZVVwbG9hZGVyT3B0aW9uc1wiLCBcIiRyb290U2NvcGVcIiwgXCIkaHR0cFwiLCBcIiR3aW5kb3dcIiwgXCJGaWxlTGlrZU9iamVjdFwiLCBcIkZpbGVJdGVtXCJdO1xuXG4vKioqLyB9LFxuLyogNCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXHR2YXIgaXNFbGVtZW50ID0gYW5ndWxhci5pc0VsZW1lbnQ7XG5cdHZhciBpc1N0cmluZyA9IGFuZ3VsYXIuaXNTdHJpbmc7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgRmlsZUxpa2VPYmplY3QgPSAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgRmlsZUxpa2VPYmplY3Rcblx0ICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8SFRNTElucHV0RWxlbWVudHxPYmplY3R9IGZpbGVPcklucHV0XG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlTGlrZU9iamVjdChmaWxlT3JJbnB1dCkge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUxpa2VPYmplY3QpO1xuXG5cdCAgICAgICAgICAgIHZhciBpc0lucHV0ID0gaXNFbGVtZW50KGZpbGVPcklucHV0KTtcblx0ICAgICAgICAgICAgdmFyIGZha2VQYXRoT3JPYmplY3QgPSBpc0lucHV0ID8gZmlsZU9ySW5wdXQudmFsdWUgOiBmaWxlT3JJbnB1dDtcblx0ICAgICAgICAgICAgdmFyIHBvc3RmaXggPSBpc1N0cmluZyhmYWtlUGF0aE9yT2JqZWN0KSA/IFwiRmFrZVBhdGhcIiA6IFwiT2JqZWN0XCI7XG5cdCAgICAgICAgICAgIHZhciBtZXRob2QgPSBcIl9jcmVhdGVGcm9tXCIgKyBwb3N0Zml4O1xuXHQgICAgICAgICAgICB0aGlzW21ldGhvZF0oZmFrZVBhdGhPck9iamVjdCk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVMaWtlT2JqZWN0LCB7XG5cdCAgICAgICAgICAgIF9jcmVhdGVGcm9tRmFrZVBhdGg6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBmaWxlIGxpa2Ugb2JqZWN0IGZyb20gZmFrZSBwYXRoIHN0cmluZ1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jcmVhdGVGcm9tRmFrZVBhdGgocGF0aCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vZGlmaWVkRGF0ZSA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnR5cGUgPSBcImxpa2UvXCIgKyBwYXRoLnNsaWNlKHBhdGgubGFzdEluZGV4T2YoXCIuXCIpICsgMSkudG9Mb3dlckNhc2UoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBwYXRoLnNsaWNlKHBhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgcGF0aC5sYXN0SW5kZXhPZihcIlxcXFxcIikgKyAyKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2NyZWF0ZUZyb21PYmplY3Q6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ3JlYXRlcyBmaWxlIGxpa2Ugb2JqZWN0IGZyb20gb2JqZWN0XG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ZpbGV8RmlsZUxpa2VPYmplY3R9IG9iamVjdFxuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2NyZWF0ZUZyb21PYmplY3Qob2JqZWN0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0TW9kaWZpZWREYXRlID0gY29weShvYmplY3QubGFzdE1vZGlmaWVkRGF0ZSk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplID0gb2JqZWN0LnNpemU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50eXBlID0gb2JqZWN0LnR5cGU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gb2JqZWN0Lm5hbWU7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlTGlrZU9iamVjdDtcblx0ICAgIH0pKCk7XG5cblx0ICAgIHJldHVybiBGaWxlTGlrZU9iamVjdDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW107XG5cbi8qKiovIH0sXG4vKiA1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGtleSBpbiBwcm9wcykgeyB2YXIgcHJvcCA9IHByb3BzW2tleV07IHByb3AuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKHByb3AudmFsdWUpIHByb3Aud3JpdGFibGUgPSB0cnVlOyB9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpOyB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGNvcHkgPSBhbmd1bGFyLmNvcHk7XG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblx0dmFyIGVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQ7XG5cdHZhciBpc0VsZW1lbnQgPSBhbmd1bGFyLmlzRWxlbWVudDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkY29tcGlsZSwgRmlsZUxpa2VPYmplY3QpIHtcblx0ICAgIHZhciBGaWxlSXRlbSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBGaWxlSXRlbVxuXHQgICAgICAgICAqIEBwYXJhbSB7RmlsZVVwbG9hZGVyfSB1cGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7RmlsZXxIVE1MSW5wdXRFbGVtZW50fE9iamVjdH0gc29tZVxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlSXRlbSh1cGxvYWRlciwgc29tZSwgb3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZUl0ZW0pO1xuXG5cdCAgICAgICAgICAgIHZhciBpc0lucHV0ID0gaXNFbGVtZW50KHNvbWUpO1xuXHQgICAgICAgICAgICB2YXIgaW5wdXQgPSBpc0lucHV0ID8gZWxlbWVudChzb21lKSA6IG51bGw7XG5cdCAgICAgICAgICAgIHZhciBmaWxlID0gIWlzSW5wdXQgPyBzb21lIDogbnVsbDtcblxuXHQgICAgICAgICAgICBleHRlbmQodGhpcywge1xuXHQgICAgICAgICAgICAgICAgdXJsOiB1cGxvYWRlci51cmwsXG5cdCAgICAgICAgICAgICAgICBhbGlhczogdXBsb2FkZXIuYWxpYXMsXG5cdCAgICAgICAgICAgICAgICBoZWFkZXJzOiBjb3B5KHVwbG9hZGVyLmhlYWRlcnMpLFxuXHQgICAgICAgICAgICAgICAgZm9ybURhdGE6IGNvcHkodXBsb2FkZXIuZm9ybURhdGEpLFxuXHQgICAgICAgICAgICAgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IHVwbG9hZGVyLnJlbW92ZUFmdGVyVXBsb2FkLFxuXHQgICAgICAgICAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB1cGxvYWRlci53aXRoQ3JlZGVudGlhbHMsXG5cdCAgICAgICAgICAgICAgICBtZXRob2Q6IHVwbG9hZGVyLm1ldGhvZFxuXHQgICAgICAgICAgICB9LCBvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBmaWxlOiBuZXcgRmlsZUxpa2VPYmplY3Qoc29tZSksXG5cdCAgICAgICAgICAgICAgICBpc1JlYWR5OiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkaW5nOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzVXBsb2FkZWQ6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgaXNTdWNjZXNzOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzQ2FuY2VsOiBmYWxzZSxcblx0ICAgICAgICAgICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuXHQgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IDAsXG5cdCAgICAgICAgICAgICAgICBpbmRleDogbnVsbCxcblx0ICAgICAgICAgICAgICAgIF9maWxlOiBmaWxlLFxuXHQgICAgICAgICAgICAgICAgX2lucHV0OiBpbnB1dFxuXHQgICAgICAgICAgICB9KTtcblxuXHQgICAgICAgICAgICBpZiAoaW5wdXQpIHRoaXMuX3JlcGxhY2VOb2RlKGlucHV0KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZUl0ZW0sIHtcblx0ICAgICAgICAgICAgdXBsb2FkOiB7XG5cdCAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuXHQgICAgICAgICAgICAgICAgICogUFVCTElDXG5cdCAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogVXBsb2FkcyBhIEZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwbG9hZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZEl0ZW0odGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9vbkNvbXBsZXRlSXRlbSh0aGlzLCBcIlwiLCAwLCBbXSk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuX29uRXJyb3JJdGVtKHRoaXMsIFwiXCIsIDAsIFtdKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGNhbmNlbDoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYW5jZWxzIHVwbG9hZGluZyBvZiBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5jZWwoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5jYW5jZWxJdGVtKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlcyBhIEZpbGVJdGVtXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLnJlbW92ZUZyb21RdWV1ZSh0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25CZWZvcmVVcGxvYWQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQmVmb3JlVXBsb2FkKCkge31cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25Qcm9ncmVzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBDYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvblByb2dyZXNzKHByb2dyZXNzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvblN1Y2Nlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uU3VjY2VzcyhyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkVycm9yOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ2FuY2VsOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNhbmNlbChyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkNvbXBsZXRlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHt9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkJlZm9yZVVwbG9hZDoge1xuXHQgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcblx0ICAgICAgICAgICAgICAgICAqIFBSSVZBVEVcblx0ICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBJbm5lciBjYWxsYmFja1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25CZWZvcmVVcGxvYWQoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblByb2dyZXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3Ncblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9vblByb2dyZXNzKHByb2dyZXNzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Qcm9ncmVzcyhwcm9ncmVzcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vblN1Y2Nlc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25TdWNjZXNzKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwbG9hZGVkID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkVycm9yOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uRXJyb3IocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTdWNjZXNzID0gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IHRydWU7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG51bGw7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfb25DYW5jZWw6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSW5uZXIgY2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gcmVzcG9uc2Vcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcblx0ICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzXG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfb25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNDYW5jZWwgPSB0cnVlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25DYW5jZWwocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9vbkNvbXBsZXRlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIElubmVyIGNhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0geyp9IHJlc3BvbnNlXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHByaXZhdGVcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX29uQ29tcGxldGUocmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZShyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKTtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmVBZnRlclVwbG9hZCkgdGhpcy5yZW1vdmUoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX2Rlc3Ryb3k6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRGVzdHJveXMgYSBGaWxlSXRlbVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfZGVzdHJveSgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5wdXQpIHRoaXMuX2lucHV0LnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mb3JtKSB0aGlzLl9mb3JtLnJlbW92ZSgpO1xuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9mb3JtO1xuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9pbnB1dDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3ByZXBhcmVUb1VwbG9hZGluZzoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBQcmVwYXJlcyB0byB1cGxvYWRpbmdcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcmVwYXJlVG9VcGxvYWRpbmcoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggfHwgKyt0aGlzLnVwbG9hZGVyLl9uZXh0SW5kZXg7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3JlcGxhY2VOb2RlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJlcGxhY2VzIGlucHV0IGVsZW1lbnQgb24gaGlzIGNsb25lXG5cdCAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0pRTGl0ZXxqUXVlcnl9IGlucHV0XG5cdCAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBfcmVwbGFjZU5vZGUoaW5wdXQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSAkY29tcGlsZShpbnB1dC5jbG9uZSgpKShpbnB1dC5zY29wZSgpKTtcblx0ICAgICAgICAgICAgICAgICAgICBjbG9uZS5wcm9wKFwidmFsdWVcIiwgbnVsbCk7IC8vIEZGIGZpeFxuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlucHV0LmFmdGVyKGNsb25lKTsgLy8gcmVtb3ZlIGpxdWVyeSBkZXBlbmRlbmN5XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlSXRlbTtcblx0ICAgIH0pKCk7XG5cblx0ICAgIHJldHVybiBGaWxlSXRlbTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGNvbXBpbGVcIiwgXCJGaWxlTGlrZU9iamVjdFwiXTtcblxuLyoqKi8gfSxcbi8qIDYgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2NsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHR2YXIgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQ7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB2YXIgRmlsZURpcmVjdGl2ZSA9IChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURpcmVjdGl2ZX0gb2JqZWN0XG5cdCAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy51cGxvYWRlclxuXHQgICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9wdGlvbnMuZWxlbWVudFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmV2ZW50c1xuXHQgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnByb3Bcblx0ICAgICAgICAgKiBAY29uc3RydWN0b3Jcblx0ICAgICAgICAgKi9cblxuXHQgICAgICAgIGZ1bmN0aW9uIEZpbGVEaXJlY3RpdmUob3B0aW9ucykge1xuXHQgICAgICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICAgICAgZXh0ZW5kKHRoaXMsIG9wdGlvbnMpO1xuXHQgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzW3RoaXMucHJvcF0ucHVzaCh0aGlzKTtcblx0ICAgICAgICAgICAgdGhpcy5fc2F2ZUxpbmtzKCk7XG5cdCAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIF9jcmVhdGVDbGFzcyhGaWxlRGlyZWN0aXZlLCB7XG5cdCAgICAgICAgICAgIGJpbmQ6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQmluZHMgZXZlbnRzIGhhbmRsZXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5ldmVudHMpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmV2ZW50c1trZXldO1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYmluZChrZXksIHRoaXNbcHJvcF0pO1xuXHQgICAgICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgdW5iaW5kOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFVuYmluZHMgZXZlbnRzIGhhbmRsZXNcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdW5iaW5kKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmV2ZW50cykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudW5iaW5kKGtleSwgdGhpcy5ldmVudHNba2V5XSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBkZXN0cm95OiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIERlc3Ryb3lzIGRpcmVjdGl2ZVxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXNbdGhpcy5wcm9wXS5pbmRleE9mKHRoaXMpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXNbdGhpcy5wcm9wXS5zcGxpY2UoaW5kZXgsIDEpO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5lbGVtZW50ID0gbnVsbDtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgX3NhdmVMaW5rczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBTYXZlcyBsaW5rcyB0byBmdW5jdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEBwcml2YXRlXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zYXZlTGlua3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuZXZlbnRzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5ldmVudHNba2V5XTtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wXSA9IHRoaXNbcHJvcF0uYmluZCh0aGlzKTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlRGlyZWN0aXZlO1xuXHQgICAgfSkoKTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBNYXAgb2YgZXZlbnRzXG5cdCAgICAgKiBAdHlwZSB7T2JqZWN0fVxuXHQgICAgICovXG5cdCAgICBGaWxlRGlyZWN0aXZlLnByb3RvdHlwZS5ldmVudHMgPSB7fTtcblxuXHQgICAgcmV0dXJuIEZpbGVEaXJlY3RpdmU7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtdO1xuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxuXHR2YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEZpbGVEaXJlY3RpdmUpIHtcblx0ICAgIHZhciBGaWxlU2VsZWN0ID0gKGZ1bmN0aW9uIChfRmlsZURpcmVjdGl2ZSkge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgaW5zdGFuY2Ugb2Yge0ZpbGVTZWxlY3R9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlU2VsZWN0KG9wdGlvbnMpIHtcblx0ICAgICAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEZpbGVTZWxlY3QpO1xuXG5cdCAgICAgICAgICAgIHZhciBleHRlbmRlZE9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuXHQgICAgICAgICAgICAgICAgLy8gTWFwIG9mIGV2ZW50c1xuXHQgICAgICAgICAgICAgICAgZXZlbnRzOiB7XG5cdCAgICAgICAgICAgICAgICAgICAgJGRlc3Ryb3k6IFwiZGVzdHJveVwiLFxuXHQgICAgICAgICAgICAgICAgICAgIGNoYW5nZTogXCJvbkNoYW5nZVwiXG5cdCAgICAgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICAgICAgLy8gTmFtZSBvZiBwcm9wZXJ0eSBpbnNpZGUgdXBsb2FkZXIuX2RpcmVjdGl2ZSBvYmplY3Rcblx0ICAgICAgICAgICAgICAgIHByb3A6IFwic2VsZWN0XCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZVNlbGVjdC5wcm90b3R5cGUpLCBcImNvbnN0cnVjdG9yXCIsIHRoaXMpLmNhbGwodGhpcywgZXh0ZW5kZWRPcHRpb25zKTtcblxuXHQgICAgICAgICAgICBpZiAoIXRoaXMudXBsb2FkZXIuaXNIVE1MNSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUF0dHIoXCJtdWx0aXBsZVwiKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aGlzLmVsZW1lbnQucHJvcChcInZhbHVlXCIsIG51bGwpOyAvLyBGRiBmaXhcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBfaW5oZXJpdHMoRmlsZVNlbGVjdCwgX0ZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICAgICAgX2NyZWF0ZUNsYXNzKEZpbGVTZWxlY3QsIHtcblx0ICAgICAgICAgICAgZ2V0T3B0aW9uczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ3x1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZpbHRlcnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBpc0VtcHR5QWZ0ZXJTZWxlY3Rpb246IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSWYgcmV0dXJucyBcInRydWVcIiB0aGVuIEhUTUxJbnB1dEVsZW1lbnQgd2lsbCBiZSBjbGVhcmVkXG5cdCAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaXNFbXB0eUFmdGVyU2VsZWN0aW9uKCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIXRoaXMuZWxlbWVudC5hdHRyKFwibXVsdGlwbGVcIik7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIG9uQ2hhbmdlOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEV2ZW50IGhhbmRsZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbGVzID0gdGhpcy51cGxvYWRlci5pc0hUTUw1ID8gdGhpcy5lbGVtZW50WzBdLmZpbGVzIDogdGhpcy5lbGVtZW50WzBdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLmdldEZpbHRlcnMoKTtcblxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy51cGxvYWRlci5pc0hUTUw1KSB0aGlzLmRlc3Ryb3koKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGVyLmFkZFRvUXVldWUoZmlsZXMsIG9wdGlvbnMsIGZpbHRlcnMpO1xuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHlBZnRlclNlbGVjdGlvbigpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5wcm9wKFwidmFsdWVcIiwgbnVsbCk7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlV2l0aCh0aGlzLmVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuY2xvbmUodHJ1ZSkpOyAvLyBJRSBmaXhcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlU2VsZWN0O1xuXHQgICAgfSkoRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgIHJldHVybiBGaWxlU2VsZWN0O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlRGlyZWN0aXZlXCJdO1xuXG4vKioqLyB9LFxuLyogOCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHsgdmFyIHByb3AgPSBwcm9wc1trZXldOyBwcm9wLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChwcm9wLnZhbHVlKSBwcm9wLndyaXRhYmxlID0gdHJ1ZTsgfSBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKTsgfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5cdHZhciBfZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHByb3BlcnR5KTsgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkgeyB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7IGlmIChwYXJlbnQgPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBlbHNlIHsgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYyAmJiBkZXNjLndyaXRhYmxlKSB7IHJldHVybiBkZXNjLnZhbHVlOyB9IGVsc2UgeyB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7IGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7IH0gfTtcblxuXHR2YXIgX2luaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH07XG5cblx0dmFyIF9jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0dmFyIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kO1xuXHR2YXIgZm9yRWFjaCA9IGFuZ3VsYXIuZm9yRWFjaDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZURyb3AgPSAoZnVuY3Rpb24gKF9GaWxlRGlyZWN0aXZlKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURyb3B9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlRHJvcChvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlRHJvcCk7XG5cblx0ICAgICAgICAgICAgdmFyIGV4dGVuZGVkT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICAvLyBNYXAgb2YgZXZlbnRzXG5cdCAgICAgICAgICAgICAgICBldmVudHM6IHtcblx0ICAgICAgICAgICAgICAgICAgICAkZGVzdHJveTogXCJkZXN0cm95XCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJvcDogXCJvbkRyb3BcIixcblx0ICAgICAgICAgICAgICAgICAgICBkcmFnb3ZlcjogXCJvbkRyYWdPdmVyXCIsXG5cdCAgICAgICAgICAgICAgICAgICAgZHJhZ2xlYXZlOiBcIm9uRHJhZ0xlYXZlXCJcblx0ICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAvLyBOYW1lIG9mIHByb3BlcnR5IGluc2lkZSB1cGxvYWRlci5fZGlyZWN0aXZlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgcHJvcDogXCJkcm9wXCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZURyb3AucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVEcm9wLCBfRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZURyb3AsIHtcblx0ICAgICAgICAgICAgZ2V0T3B0aW9uczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG9wdGlvbnNcblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBnZXRGaWx0ZXJzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIFJldHVybnMgZmlsdGVyc1xuXHQgICAgICAgICAgICAgICAgICogQHJldHVybiB7QXJyYXk8RnVuY3Rpb24+fFN0cmluZ3x1bmRlZmluZWR9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZpbHRlcnMoKSB7fVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBvbkRyb3A6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyb3AoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmZXIgPSB0aGlzLl9nZXRUcmFuc2ZlcihldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0cmFuc2Zlcikge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cdCAgICAgICAgICAgICAgICAgICAgfXZhciBvcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKCk7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSB0aGlzLmdldEZpbHRlcnMoKTtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX3JlbW92ZU92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlci5hZGRUb1F1ZXVlKHRyYW5zZmVyLmZpbGVzLCBvcHRpb25zLCBmaWx0ZXJzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25EcmFnT3Zlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBFdmVudCBoYW5kbGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uRHJhZ092ZXIoZXZlbnQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmZXIgPSB0aGlzLl9nZXRUcmFuc2ZlcihldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oYXZlRmlsZXModHJhbnNmZXIudHlwZXMpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgICAgICAgICB9dHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZlbnRBbmRTdG9wKGV2ZW50KTtcblx0ICAgICAgICAgICAgICAgICAgICBmb3JFYWNoKHRoaXMudXBsb2FkZXIuX2RpcmVjdGl2ZXMub3ZlciwgdGhpcy5fYWRkT3ZlckNsYXNzLCB0aGlzKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgb25EcmFnTGVhdmU6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogRXZlbnQgaGFuZGxlclxuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyYWdMZWF2ZShldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0ID09PSB0aGlzLmVsZW1lbnRbMF0pIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXHQgICAgICAgICAgICAgICAgICAgIH10aGlzLl9wcmV2ZW50QW5kU3RvcChldmVudCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZm9yRWFjaCh0aGlzLnVwbG9hZGVyLl9kaXJlY3RpdmVzLm92ZXIsIHRoaXMuX3JlbW92ZU92ZXJDbGFzcywgdGhpcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9nZXRUcmFuc2Zlcjoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBIZWxwZXJcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2dldFRyYW5zZmVyKGV2ZW50KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmRhdGFUcmFuc2ZlciA/IGV2ZW50LmRhdGFUcmFuc2ZlciA6IGV2ZW50Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyOyAvLyBqUXVlcnkgZml4O1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfcHJldmVudEFuZFN0b3A6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogSGVscGVyXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9wcmV2ZW50QW5kU3RvcChldmVudCkge1xuXHQgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9oYXZlRmlsZXM6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmV0dXJucyBcInRydWVcIiBpZiB0eXBlcyBjb250YWlucyBmaWxlc1xuXHQgICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHR5cGVzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9oYXZlRmlsZXModHlwZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICAgICAgICAgICAgICB9aWYgKHR5cGVzLmluZGV4T2YpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVzLmluZGV4T2YoXCJGaWxlc1wiKSAhPT0gLTE7XG5cdCAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlcy5jb250YWlucykge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZXMuY29udGFpbnMoXCJGaWxlc1wiKTtcblx0ICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICBfYWRkT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIENhbGxiYWNrXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9hZGRPdmVyQ2xhc3MoaXRlbSkge1xuXHQgICAgICAgICAgICAgICAgICAgIGl0ZW0uYWRkT3ZlckNsYXNzKCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIF9yZW1vdmVPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogQ2FsbGJhY2tcblx0ICAgICAgICAgICAgICAgICAqL1xuXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbW92ZU92ZXJDbGFzcyhpdGVtKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaXRlbS5yZW1vdmVPdmVyQ2xhc3MoKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0pO1xuXG5cdCAgICAgICAgcmV0dXJuIEZpbGVEcm9wO1xuXHQgICAgfSkoRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgIHJldHVybiBGaWxlRHJvcDtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiRmlsZURpcmVjdGl2ZVwiXTtcblxuLyoqKi8gfSxcbi8qIDkgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIga2V5IGluIHByb3BzKSB7IHZhciBwcm9wID0gcHJvcHNba2V5XTsgcHJvcC5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAocHJvcC52YWx1ZSkgcHJvcC53cml0YWJsZSA9IHRydWU7IH0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcyk7IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuXHR2YXIgX2dldCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikgeyB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7IGlmIChkZXNjID09PSB1bmRlZmluZWQpIHsgdmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpOyBpZiAocGFyZW50ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gZWxzZSB7IHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpOyB9IH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MgJiYgZGVzYy53cml0YWJsZSkgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH07XG5cblx0dmFyIF9pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9O1xuXG5cdHZhciBfY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdHZhciBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZDtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChGaWxlRGlyZWN0aXZlKSB7XG5cdCAgICB2YXIgRmlsZU92ZXIgPSAoZnVuY3Rpb24gKF9GaWxlRGlyZWN0aXZlKSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBpbnN0YW5jZSBvZiB7RmlsZURyb3B9IG9iamVjdFxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG5cdCAgICAgICAgICogQGNvbnN0cnVjdG9yXG5cdCAgICAgICAgICovXG5cblx0ICAgICAgICBmdW5jdGlvbiBGaWxlT3ZlcihvcHRpb25zKSB7XG5cdCAgICAgICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBGaWxlT3Zlcik7XG5cblx0ICAgICAgICAgICAgdmFyIGV4dGVuZGVkT3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG5cdCAgICAgICAgICAgICAgICAvLyBNYXAgb2YgZXZlbnRzXG5cdCAgICAgICAgICAgICAgICBldmVudHM6IHtcblx0ICAgICAgICAgICAgICAgICAgICAkZGVzdHJveTogXCJkZXN0cm95XCJcblx0ICAgICAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgICAgICAvLyBOYW1lIG9mIHByb3BlcnR5IGluc2lkZSB1cGxvYWRlci5fZGlyZWN0aXZlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgcHJvcDogXCJvdmVyXCIsXG5cdCAgICAgICAgICAgICAgICAvLyBPdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICBvdmVyQ2xhc3M6IFwibnYtZmlsZS1vdmVyXCJcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgX2dldChPYmplY3QuZ2V0UHJvdG90eXBlT2YoRmlsZU92ZXIucHJvdG90eXBlKSwgXCJjb25zdHJ1Y3RvclwiLCB0aGlzKS5jYWxsKHRoaXMsIGV4dGVuZGVkT3B0aW9ucyk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgX2luaGVyaXRzKEZpbGVPdmVyLCBfRmlsZURpcmVjdGl2ZSk7XG5cblx0ICAgICAgICBfY3JlYXRlQ2xhc3MoRmlsZU92ZXIsIHtcblx0ICAgICAgICAgICAgYWRkT3ZlckNsYXNzOiB7XG5cdCAgICAgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICAgICAqIEFkZHMgb3ZlciBjbGFzc1xuXHQgICAgICAgICAgICAgICAgICovXG5cblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRPdmVyQ2xhc3MoKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKHRoaXMuZ2V0T3ZlckNsYXNzKCkpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXHQgICAgICAgICAgICByZW1vdmVPdmVyQ2xhc3M6IHtcblx0ICAgICAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgICAgICogUmVtb3ZlcyBvdmVyIGNsYXNzXG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZU92ZXJDbGFzcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3ModGhpcy5nZXRPdmVyQ2xhc3MoKSk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIGdldE92ZXJDbGFzczoge1xuXHQgICAgICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAgICAgKiBSZXR1cm5zIG92ZXIgY2xhc3Ncblx0ICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG5cdCAgICAgICAgICAgICAgICAgKi9cblxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE92ZXJDbGFzcygpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vdmVyQ2xhc3M7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblxuXHQgICAgICAgIHJldHVybiBGaWxlT3Zlcjtcblx0ICAgIH0pKEZpbGVEaXJlY3RpdmUpO1xuXG5cdCAgICByZXR1cm4gRmlsZU92ZXI7XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIkZpbGVEaXJlY3RpdmVcIl07XG5cbi8qKiovIH0sXG4vKiAxMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIF9pbnRlcm9wUmVxdWlyZSA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9ialtcImRlZmF1bHRcIl0gOiBvYmo7IH07XG5cblx0dmFyIENPTkZJRyA9IF9pbnRlcm9wUmVxdWlyZShfX3dlYnBhY2tfcmVxdWlyZV9fKDEpKTtcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkcGFyc2UsIEZpbGVVcGxvYWRlciwgRmlsZVNlbGVjdCkge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlU2VsZWN0KHtcblx0ICAgICAgICAgICAgICAgIHVwbG9hZGVyOiB1cGxvYWRlcixcblx0ICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgb2JqZWN0LmdldE9wdGlvbnMgPSAkcGFyc2UoYXR0cmlidXRlcy5vcHRpb25zKS5iaW5kKG9iamVjdCwgc2NvcGUpO1xuXHQgICAgICAgICAgICBvYmplY3QuZ2V0RmlsdGVycyA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzLmZpbHRlcnM7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgfTtcblx0fTtcblxuXHRtb2R1bGUuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHBhcnNlXCIsIFwiRmlsZVVwbG9hZGVyXCIsIFwiRmlsZVNlbGVjdFwiXTtcblxuLyoqKi8gfSxcbi8qIDExICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgX2ludGVyb3BSZXF1aXJlID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqW1wiZGVmYXVsdFwiXSA6IG9iajsgfTtcblxuXHR2YXIgQ09ORklHID0gX2ludGVyb3BSZXF1aXJlKF9fd2VicGFja19yZXF1aXJlX18oMSkpO1xuXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRwYXJzZSwgRmlsZVVwbG9hZGVyLCBGaWxlRHJvcCkge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgaWYgKCF1cGxvYWRlci5pc0hUTUw1KSByZXR1cm47XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlRHJvcCh7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPcHRpb25zID0gJHBhcnNlKGF0dHJpYnV0ZXMub3B0aW9ucykuYmluZChvYmplY3QsIHNjb3BlKTtcblx0ICAgICAgICAgICAgb2JqZWN0LmdldEZpbHRlcnMgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5maWx0ZXJzO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cdH07XG5cblx0bW9kdWxlLmV4cG9ydHMuJGluamVjdCA9IFtcIiRwYXJzZVwiLCBcIkZpbGVVcGxvYWRlclwiLCBcIkZpbGVEcm9wXCJdO1xuXG4vKioqLyB9LFxuLyogMTIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBfaW50ZXJvcFJlcXVpcmUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmpbXCJkZWZhdWx0XCJdIDogb2JqOyB9O1xuXG5cdHZhciBDT05GSUcgPSBfaW50ZXJvcFJlcXVpcmUoX193ZWJwYWNrX3JlcXVpcmVfXygxKSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoRmlsZVVwbG9hZGVyLCBGaWxlT3Zlcikge1xuXG5cdCAgICByZXR1cm4ge1xuXHQgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuXHQgICAgICAgICAgICB2YXIgdXBsb2FkZXIgPSBzY29wZS4kZXZhbChhdHRyaWJ1dGVzLnVwbG9hZGVyKTtcblxuXHQgICAgICAgICAgICBpZiAoISh1cGxvYWRlciBpbnN0YW5jZW9mIEZpbGVVcGxvYWRlcikpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJcXFwiVXBsb2FkZXJcXFwiIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgRmlsZVVwbG9hZGVyXCIpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgdmFyIG9iamVjdCA9IG5ldyBGaWxlT3Zlcih7XG5cdCAgICAgICAgICAgICAgICB1cGxvYWRlcjogdXBsb2FkZXIsXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG5cdCAgICAgICAgICAgIH0pO1xuXG5cdCAgICAgICAgICAgIG9iamVjdC5nZXRPdmVyQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlcy5vdmVyQ2xhc3MgfHwgb2JqZWN0Lm92ZXJDbGFzcztcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXHR9O1xuXG5cdG1vZHVsZS5leHBvcnRzLiRpbmplY3QgPSBbXCJGaWxlVXBsb2FkZXJcIiwgXCJGaWxlT3ZlclwiXTtcblxuLyoqKi8gfVxuLyoqKioqKi8gXSlcbn0pO1xuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5ndWxhci1maWxlLXVwbG9hZC5qcy5tYXBcbiIsIi8vIC0tQXV0aG9yIE11cmFnaWppbWFuYSBSaWNoYXJkIDxiZWFzdGFyNDU3QGdtYWlsLmNvbT5cbi8vIHZhciBzeW5jID0gYW5ndWxhci5tb2R1bGUoXCJzeW5jXCIsIFtcIm5nUm91dGVcIixcImFuZ3VsYXJGaWxlVXBsb2FkXCIsXCJpb25pY1wiLFwibmdSZXNvdXJjZVwiLFwidWkuYm9vdHN0cmFwXCIsXCJpbmZpbml0ZS1zY3JvbGxcIl0pO1xuYW5ndWxhci5tb2R1bGUoJ0F1dGhNYW5hZ2VyJyxbXSkuc2VydmljZSgnU2Vzc2lvblNlcnZpY2UnLCBbZnVuY3Rpb24oKXtcbiAgICB2YXIgdXNlcklzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRVc2VyQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdXNlcklzQXV0aGVudGljYXRlZCA9IHZhbHVlO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXJBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHVzZXJJc0F1dGhlbnRpY2F0ZWQ7XG4gICAgfTtcbn1dKTtcblxudmFyIHN5bmMgPSBhbmd1bGFyLm1vZHVsZShcInN5bmNcIiwgW1wibmdSb3V0ZVwiLFwiYW5ndWxhckZpbGVVcGxvYWRcIixcInVpLmJvb3RzdHJhcFwiLFwidWkucm91dGVyXCIsXCJpbmZpbml0ZS1zY3JvbGxcIiwnbmdNYXRlcmlhbCcsICduZ01lc3NhZ2VzJywgJ21hdGVyaWFsLnN2Z0Fzc2V0c0NhY2hlJywnbmctbWZiJywncGRmJywnbmdDb250ZXh0TWVudScsJ2FuZ3VsYXItbG9hZGluZy1iYXInLCduZ0ZpbGVTYXZlcicsJ0F1dGhNYW5hZ2VyJywnbmdEaWFsb2cnXSk7XG5cblxudmFyIExvZ2dlcj1hbmd1bGFyLm1vZHVsZShcIkxvZ2dlclwiLFtdKTtcbkxvZ2dlci5ydW4oWyckcm9vdFNjb3BlJyxmdW5jdGlvbigkcm9vdFNjb3BlKXtcblxuICAgICAgLy8gJHJvb3RTY29wZS5lbmRQb2ludD0naHR0cHM6Ly9zdHJlYW11cGJveC5jb20nO1xuICAgICAgJHJvb3RTY29wZS5lbmRQb2ludD0naHR0cDovL3N5bmNtZS5jb206ODAwMCc7XG59XSk7XG53aW5kb3cucm91dGVzID1cbntcbiAgICBcIi9GaWxlc1wiOiB7XG4gICAgICAgIHVybDogXCIvRmlsZXNcIixcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9maWxlcy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0ZpbGVzQ29udHJvbGxlcicsXG4gICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgfSxcbiAgICAgIFwicHJldmlld1wiOntcbiAgICAgICAgdXJsOiAnLyEvOnByZXZpZXcvOmV4dGVuc2lvbi86b2YvOnVzZXInLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2ZpbGVQcmV2aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyIDogJ3ByZXZpZXdDb250cm9sbGVyJ1xuICAgICAgfSxcblxuICAgICAgXCIvR3JvdXBzXCI6IHtcbiAgICAgICAgICB1cmw6IFwiL0dyb3Vwc1wiLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZ3JvdXBzLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdHcm91cENvbnRyb2xsZXInLFxuICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgfVxufTtcblxuXG5zeW5jLnJ1bihbJyRyb290U2NvcGUnLCckbG9nJyxmdW5jdGlvbigkcm9vdFNjb3BlLCRsb2cpe1xuICAkcm9vdFNjb3BlLmVuZFBvaW50PSdodHRwOi8vc3luY21lLmNvbTo4MDAwJztcbiAgIC8vICRyb290U2NvcGUuZW5kUG9pbnQ9J2h0dHBzOi8vc3RyZWFtdXBib3guY29tJztcblxuXG4gICRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdGFydCcsZnVuY3Rpb24oZXZlbnQsIG5leHQsIGN1cnJlbnQpe1xuICAgIGZvcih2YXIgaSBpbiB3aW5kb3cucm91dGVzKSB7XG5cbiAgICAgICAgaWYobmV4dC5pbmRleE9mKGkpICE9IC0xKSB7XG4gICAgICAgICAgICBpZih3aW5kb3cucm91dGVzW2ldLnJlcXVpcmVMb2dpbiAmJiAhU2Vzc2lvblNlcnZpY2UuZ2V0VXNlckF1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiWW91IG5lZWQgdG8gYmUgYXV0aGVudGljYXRlZCB0byBzZWUgdGhpcyBwYWdlIVwiKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG4gIH0pO1xufV0pO1xuc3luYy5wcm92aWRlcih7XG5cbiAgICAkZXhjZXB0aW9uSGFuZGxlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbihleGNlcHRpb24sIGNhdXNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXhjZXB0aW9uKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXI7XG4gICAgICAgIH07XG4gICAgfVxufSk7XG5zeW5jLmNvbmZpZyhbJyRzY2VQcm92aWRlcicsJyRodHRwUHJvdmlkZXInLCckbWRUaGVtaW5nUHJvdmlkZXInLCdjZnBMb2FkaW5nQmFyUHJvdmlkZXInLGZ1bmN0aW9uKCRzY2VQcm92aWRlciwkaHR0cFByb3ZpZGVyLCRtZFRoZW1pbmdQcm92aWRlcixjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIHtcbiAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydBY2NlcHQnXSA9ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnO1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydBY2NlcHQnXSA9ICdhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHQnO1xuICAgIC8vc2V0IGF1dGhvcml6YXRpb24gZm9yIG9hdXRoMi4wIGZvciBwcm90ZWN0aW9uXG5cbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydhdXRob3JpemF0aW9uJ10gPSAnQmVhcmVyIEJjN0RXUzdLS1JMdHhtZGRVWkkxVDFsWnUySjFZaFI4T0xYR1dOWm4nO1xuXG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcbiAgICAkc2NlUHJvdmlkZXIuZW5hYmxlZChmYWxzZSk7XG5cbiAgICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZUJhciA9IGZhbHNlO1xufV0pO1xuc3luYy5jb25maWcoWyckc3RhdGVQcm92aWRlcicsJyR1cmxSb3V0ZXJQcm92aWRlcicsZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwkc2NvcGUpe1xuICAgICAgICAvLyAkcGFyc2VQcm92aWRlci51bndyYXBQcm9taXNlcyh0cnVlKSA7XG5cbiAgICAgICAgICBmb3IodmFyIHBhdGggaW4gd2luZG93LnJvdXRlcykge1xuXG4gICAgICAgICAgICAgIC8vIGlmKG5leHQuaW5kZXhPZihwYXRoKSAhPSAtMSkge1xuICAgICAgICAgICAgICAvLyAgICAgaWYod2luZG93LnJvdXRlc1twYXRoXS5yZXF1aXJlTG9naW4gJiYgIVNlc3Npb25TZXJ2aWNlLmdldFVzZXJBdXRoZW50aWNhdGVkKCkpIHtcbiAgICAgICAgICAgICAgLy8gICAgICAgICBhbGVydChcIllvdSBuZWVkIHRvIGJlIGF1dGhlbnRpY2F0ZWQgdG8gc2VlIHRoaXMgcGFnZSFcIik7XG4gICAgICAgICAgICAgIC8vICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShwYXRoLCB3aW5kb3cucm91dGVzW3BhdGhdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvRmlsZXMnKTtcblxuICAgICAgICAvLyAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvRmlsZXMnKTtcbiAgICAgICAgLy8gJHN0YXRlUHJvdmlkZXIuXG4gICAgICAgIC8vIHN0YXRlKCcvRmVlZHMnLCB7XG4gICAgICAgIC8vICAgdXJsOiBcIi9GZWVkc1wiLFxuICAgICAgICAvLyAgIHRlbXBsYXRlVXJsIDogJ3ZpZXdzL2ZlZWRzLmh0bWwnLFxuICAgICAgICAvLyAgIGNvbnRyb2xsZXIgIDogJ1Bvc3RpbmdDb250cm9sbGVyJ1xuICAgICAgICAvLyB9KVxuICAgICAgICAvLyAuc3RhdGUoJy9Hcm91cHMnLCB7XG4gICAgICAgIC8vICAgdXJsOiBcIi9Hcm91cHNcIixcbiAgICAgICAgLy8gICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2dyb3Vwcy5odG1sJyxcbiAgICAgICAgLy8gICBjb250cm9sbGVyOiAnR3JvdXBDb250cm9sbGVyJ1xuICAgICAgICAvLyB9KVxuICAgICAgICAvL1xuICAgICAgICAvLyAuc3RhdGUoJy9VcGxvYWQnLCB7XG4gICAgICAgIC8vICAgdXJsOiBcIi9VcGxvYWRcIixcbiAgICAgICAgLy8gICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL1VwbG9hZC5odG1sJyxcbiAgICAgICAgLy8gICBjb250cm9sbGVyOiAnVXBsb2FkQ29udHJvbGxlcidcbiAgICAgICAgLy8gfSlcbiAgICAgICAgLy8gLnN0YXRlKCcvRmlsZXMnLCB7XG4gICAgICAgIC8vICAgdXJsOiBcIi9GaWxlc1wiLFxuICAgICAgICAvLyAgIHRlbXBsYXRlVXJsOiAndmlld3MvZmlsZXMuaHRtbCcsXG4gICAgICAgIC8vICAgY29udHJvbGxlciA6ICdGaWxlc0NvbnRyb2xsZXInXG4gICAgICAgIC8vXG4gICAgICAgIC8vIH0pXG4gICAgICAgIC8vXG4gICAgICAgIC8vIC5zdGF0ZSgncHJldmlldycsIHtcbiAgICAgICAgLy8gICAgIHVybDogJy8hLzpwcmV2aWV3LzpleHRlbnNpb24vOm9mLzp1c2VyJyxcbiAgICAgICAgLy8gICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZmlsZVByZXZpZXcuaHRtbCcsXG4gICAgICAgIC8vICAgICBjb250cm9sbGVyIDogJ3ByZXZpZXdDb250cm9sbGVyJ1xuICAgICAgICAvLyAgIH0pXG4gICAgICAgIC8vXG4gICAgICAgIC8vIC5zdGF0ZSgnL1Blb3BsZScsIHtcbiAgICAgICAgLy8gICB1cmw6IFwiL1Blb3BsZVwiLFxuICAgICAgICAvLyAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGVvcGxlLmh0bWwnLFxuICAgICAgICAvLyAgIGNvbnRyb2xsZXI6ICdQZW9wbGVDb250cm9sbGVyJ1xuICAgICAgICAvLyB9KVxuICAgICAgICAvL1xuICAgICAgICAvLyAuc3RhdGUoJy9Ob3RpZmljYXRpb25zJywge1xuICAgICAgICAvLyAgIHVybDogXCIvTm90aWZpY2F0aW9uc1wiLFxuICAgICAgICAvLyAgIHRlbXBsYXRlVXJsOiAndmlld3Mvbm90aWZpY2F0aW9ucy5odG1sJyxcbiAgICAgICAgLy8gICBjb250cm9sbGVyOiAnbm90aWZpY2F0aW9uQ29udHJvbGxlcidcbiAgICAgICAgLy8gfSlcbiAgICAgICAgLy8gLnN0YXRlKCcvU2V0dGluZ3MnLCB7XG4gICAgICAgIC8vICAgdXJsOiBcIi9TZXR0aW5nc1wiLFxuICAgICAgICAvLyAgIHRlbXBsYXRlVXJsOiAndmlld3Mvc2V0dGluZ3MuaHRtbCcsXG4gICAgICAgIC8vICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ29udHJvbGxlcidcbiAgICAgICAgLy8gfSk7XG5cbn1dKTtcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1kb25lIHdpdGggTXVyYWdpamltYW5hIFJpY2hhcmQgPGJlYXN0YXI0NTdAZ21haWwuY29tPi0tLS0tLS0tLS0tLS0tLS8vXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tZGVhbCB3aXRoIHVzZXIncyBhY3Rpb25zIGFuZCBpbnRlcmFjdGlvbiB3aXRoIG90aGVyIHVzZXJzLS0tLS0tLS0tLS0tLS0tLy9cbiIsIjsoZnVuY3Rpb24od2luZG93LCBhbmd1bGFyLCB1bmRlZmluZWQpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIG1mYiA9IGFuZ3VsYXIubW9kdWxlKCduZy1tZmInLCBbXSk7XG5cbiAgbWZiLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ25nLW1mYi1tZW51LWRlZmF1bHQudHBsLmh0bWwnLFxuICAgICAgJzx1bCBjbGFzcz1cIm1mYi1jb21wb25lbnQtLXt7cG9zaXRpb259fSBtZmIte3tlZmZlY3R9fVwiJyArXG4gICAgICAnICAgIGRhdGEtbWZiLXRvZ2dsZT1cInt7dG9nZ2xpbmdNZXRob2R9fVwiIGRhdGEtbWZiLXN0YXRlPVwie3ttZW51U3RhdGV9fVwiPicgK1xuICAgICAgJyAgPGxpIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fd3JhcFwiPicgK1xuICAgICAgJyAgICA8YSBuZy1jbGljaz1cImNsaWNrZWQoKVwiIG5nLW1vdXNlZW50ZXI9XCJob3ZlcmVkKClcIiBuZy1tb3VzZWxlYXZlPVwiaG92ZXJlZCgpXCInICtcbiAgICAgICcgICAgICAgbmctYXR0ci1kYXRhLW1mYi1sYWJlbD1cInt7bGFiZWx9fVwiIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fYnV0dG9uLS1tYWluXCI+JyArXG4gICAgICAnICAgICA8aSBjbGFzcz1cIm1mYi1jb21wb25lbnRfX21haW4taWNvbi0tcmVzdGluZyB7e3Jlc3Rpbmd9fVwiPjwvaT4nICtcbiAgICAgICcgICAgIDxpIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fbWFpbi1pY29uLS1hY3RpdmUge3thY3RpdmV9fVwiPjwvaT4nICtcbiAgICAgICcgICAgPC9hPicgK1xuICAgICAgJyAgICA8dWwgY2xhc3M9XCJtZmItY29tcG9uZW50X19saXN0XCIgbmctdHJhbnNjbHVkZT4nICtcbiAgICAgICcgICAgPC91bD4nICtcbiAgICAgICc8L2xpPicgK1xuICAgICAgJzwvdWw+J1xuICAgICk7XG5cbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ25nLW1mYi1tZW51LW1kLnRwbC5odG1sJyxcbiAgICAgICc8dWwgY2xhc3M9XCJtZmItY29tcG9uZW50LS17e3Bvc2l0aW9ufX0gbWZiLXt7ZWZmZWN0fX1cIicgK1xuICAgICAgJyAgICBkYXRhLW1mYi10b2dnbGU9XCJ7e3RvZ2dsaW5nTWV0aG9kfX1cIiBkYXRhLW1mYi1zdGF0ZT1cInt7bWVudVN0YXRlfX1cIj4nICtcbiAgICAgICcgIDxsaSBjbGFzcz1cIm1mYi1jb21wb25lbnRfX3dyYXBcIj4nICtcbiAgICAgICcgICAgPGEgbmctY2xpY2s9XCJjbGlja2VkKClcIiBuZy1tb3VzZWVudGVyPVwiaG92ZXJlZCgpXCIgbmctbW91c2VsZWF2ZT1cImhvdmVyZWQoKVwiJyArXG4gICAgICAnICAgICAgIHN0eWxlPVwiYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGJveC1zaGFkb3c6IG5vbmU7XCInICtcbiAgICAgICcgICAgICAgbmctYXR0ci1kYXRhLW1mYi1sYWJlbD1cInt7bGFiZWx9fVwiIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fYnV0dG9uLS1tYWluXCI+JyArXG4gICAgICAnICAgICA8bWQtYnV0dG9uIGNsYXNzPVwibWQtZmFiIG1kLWFjY2VudFwiIGFyaWEtbGFiZWw9e3tsYWJlbH19IHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7IG1hcmdpbjogMDsgcGFkZGluZzowO1wiPicgK1xuICAgICAgJyAgICAgICA8bWQtaWNvbiBzdHlsZT1cImxlZnQ6IDA7IHBvc2l0aW9uOiByZWxhdGl2ZTtcIiBtZC1zdmctaWNvbj1cInt7cmVzdGluZ319XCInICtcbiAgICAgICcgICAgICAgICBjbGFzcz1cIm1mYi1jb21wb25lbnRfX21haW4taWNvbi0tcmVzdGluZ1wiPjwvbWQtaWNvbj4nICtcbiAgICAgICcgICAgICAgPG1kLWljb24gc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTtcIiBtZC1zdmctaWNvbj1cInt7YWN0aXZlfX1cIicgK1xuICAgICAgJyAgICAgICAgIGNsYXNzPVwibWZiLWNvbXBvbmVudF9fbWFpbi1pY29uLS1hY3RpdmVcIj48L21kLWljb24+JyArXG4gICAgICAnICAgICA8L21kLWJ1dHRvbj4nICtcbiAgICAgICcgICAgPC9hPicgK1xuICAgICAgJyAgICA8dWwgY2xhc3M9XCJtZmItY29tcG9uZW50X19saXN0XCIgbmctdHJhbnNjbHVkZT4nICtcbiAgICAgICcgICAgPC91bD4nICtcbiAgICAgICc8L2xpPicgK1xuICAgICAgJzwvdWw+J1xuICAgICk7XG5cbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ25nLW1mYi1idXR0b24tZGVmYXVsdC50cGwuaHRtbCcsXG4gICAgICAnPGxpPicgK1xuICAgICAgJyAgPGEgZGF0YS1tZmItbGFiZWw9XCJ7e2xhYmVsfX1cIiBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2J1dHRvbi0tY2hpbGRcIj4nICtcbiAgICAgICcgICAgPGkgY2xhc3M9XCJtZmItY29tcG9uZW50X19jaGlsZC1pY29uIHt7aWNvbn19XCI+JyArXG4gICAgICAnICAgIDwvaT4nICtcbiAgICAgICcgIDwvYT4nICtcbiAgICAgICc8L2xpPidcbiAgICApO1xuXG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCduZy1tZmItYnV0dG9uLW1kLnRwbC5odG1sJyxcbiAgICAgICc8bGk+JyArXG4gICAgICAnICA8YSBocmVmPVwiXCIgZGF0YS1tZmItbGFiZWw9XCJ7e2xhYmVsfX1cIiBjbGFzcz1cIm1mYi1jb21wb25lbnRfX2J1dHRvbi0tY2hpbGRcIiAnICtcbiAgICAgICcgICAgIHN0eWxlPVwiYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7IGJveC1zaGFkb3c6IG5vbmU7XCI+JyArXG4gICAgICAnICAgICA8bWQtYnV0dG9uIHN0eWxlPVwibWFyZ2luOiAwO1wiIGNsYXNzPVwibWQtZmFiIG1kLWFjY2VudFwiIGFyaWEtbGFiZWw9e3tsYWJlbH19PicgK1xuICAgICAgJyAgICAgICA8bWQtaWNvbiBtZC1zdmctc3JjPVwiaW1nL2ljb25zL2FuZHJvaWQuc3ZnXCI+PC9tZC1pY29uPicgK1xuICAgICAgJyAgICAgICA8bWQtaWNvbiBtZC1zdmctaWNvbj1cInt7aWNvbn19XCI+PC9tZC1pY29uPicgK1xuICAgICAgJyAgICAgPC9tZC1idXR0b24+JyArXG4gICAgICAnICA8L2E+JyArXG4gICAgICAnPC9saT4nXG4gICAgKTtcbiAgfV0pO1xuXG4gIG1mYi5kaXJlY3RpdmUoJ21mYkJ1dHRvbkNsb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICByZXF1aXJlOiAnXm1mYk1lbnUnLFxuICAgICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBtZmJNZW51Q29udHJvbGxlcikge1xuICAgICAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG1mYk1lbnVDb250cm9sbGVyLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuXG4gIH0pO1xuXG4gIG1mYi5kaXJlY3RpdmUoJ21mYk1lbnUnLCBbJyR0aW1lb3V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIHBvc2l0aW9uOiAnQCcsXG4gICAgICAgIGVmZmVjdDogJ0AnLFxuICAgICAgICBsYWJlbDogJ0AnLFxuICAgICAgICByZXN0aW5nOiAnQHJlc3RpbmdJY29uJyxcbiAgICAgICAgYWN0aXZlOiAnQGFjdGl2ZUljb24nLFxuICAgICAgICBtYWluQWN0aW9uOiAnJicsXG4gICAgICAgIG1lbnVTdGF0ZTogJz0/JyxcbiAgICAgICAgdG9nZ2xpbmdNZXRob2Q6ICdAJ1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtLCBhdHRycykge1xuICAgICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ25nLW1mYi1tZW51LWRlZmF1bHQudHBsLmh0bWwnO1xuICAgICAgfSxcbiAgICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRhdHRycycsIGZ1bmN0aW9uKCRzY29wZSwgJGF0dHJzKSB7XG4gICAgICAgIHZhciBvcGVuU3RhdGUgPSAnb3BlbicsXG4gICAgICAgICAgY2xvc2VkU3RhdGUgPSAnY2xvc2VkJztcblxuICAgICAgICAvLyBBdHRhY2hlZCB0b2dnbGUsIG9wZW4gYW5kIGNsb3NlIHRvIHRoZSBjb250cm9sbGVyIHRvIGdpdmUgb3RoZXJcbiAgICAgICAgLy8gZGlyZWN0aXZlIGFjY2Vzc1xuICAgICAgICB0aGlzLnRvZ2dsZSA9IHRvZ2dsZTtcbiAgICAgICAgdGhpcy5jbG9zZSA9IGNsb3NlO1xuICAgICAgICB0aGlzLm9wZW4gPSBvcGVuO1xuXG4gICAgICAgICRzY29wZS5jbGlja2VkID0gY2xpY2tlZDtcbiAgICAgICAgJHNjb3BlLmhvdmVyZWQgPSBob3ZlcmVkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIHN0YXRlIHRvIHVzZXItZGVmaW5lZCB2YWx1ZS4gRmFsbGJhY2sgdG8gY2xvc2VkIGlmIG5vXG4gICAgICAgICAqIHZhbHVlIGlzIHBhc3NlZCBmcm9tIHRoZSBvdXRzaWRlLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCEkc2NvcGUubWVudVN0YXRlKSB7XG4gICAgICAgICAgJHNjb3BlLm1lbnVTdGF0ZSA9IGNsb3NlZFN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIG9uIHRvdWNoIGRldmljZSBBTkQgJ2hvdmVyJyBtZXRob2QgaXMgc2VsZWN0ZWQ6XG4gICAgICAgICAqIHdhaXQgZm9yIHRoZSBkaWdlc3QgdG8gcGVyZm9ybSBhbmQgdGhlbiBjaGFuZ2UgaG92ZXIgdG8gY2xpY2suXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoX2lzVG91Y2hEZXZpY2UoKSAmJiBfaXNIb3ZlckFjdGl2ZSgpKSB7XG4gICAgICAgICAgJHRpbWVvdXQodXNlQ2xpY2spO1xuICAgICAgICB9XG5cbiAgICAgICAgJGF0dHJzLiRvYnNlcnZlKCdtZW51U3RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuY3VycmVudFN0YXRlID0gJHNjb3BlLm1lbnVTdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xpY2tlZCgpIHtcbiAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIG1haW4gYWN0aW9uLCBsZXQncyBmaXJlIGl0XG4gICAgICAgICAgaWYgKCRzY29wZS5tYWluQWN0aW9uKSB7XG4gICAgICAgICAgICAkc2NvcGUubWFpbkFjdGlvbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghX2lzSG92ZXJBY3RpdmUoKSkge1xuICAgICAgICAgICAgdG9nZ2xlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGhvdmVyZWQoKSB7XG4gICAgICAgICAgaWYgKF9pc0hvdmVyQWN0aXZlKCkpIHtcbiAgICAgICAgICAgIC8vdG9nZ2xlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnZlcnQgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIG1lbnUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0b2dnbGUoKSB7XG4gICAgICAgICAgaWYgKCRzY29wZS5tZW51U3RhdGUgPT09IG9wZW5TdGF0ZSkge1xuICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3BlbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgICAgICAgJHNjb3BlLm1lbnVTdGF0ZSA9IG9wZW5TdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICAgICRzY29wZS5tZW51U3RhdGUgPSBjbG9zZWRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBpZiB3ZSdyZSBvbiBhIHRvdWNoLWVuYWJsZWQgZGV2aWNlLlxuICAgICAgICAgKiBSZXF1aXJlcyBNb2Rlcm5penIgdG8gcnVuLCBvdGhlcndpc2Ugc2ltcGx5IHJldHVybnMgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9pc1RvdWNoRGV2aWNlKCkge1xuICAgICAgICAgIHJldHVybiB3aW5kb3cuTW9kZXJuaXpyICYmIE1vZGVybml6ci50b3VjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9pc0hvdmVyQWN0aXZlKCkge1xuICAgICAgICAgIHJldHVybiAkc2NvcGUudG9nZ2xpbmdNZXRob2QgPT09ICdob3Zlcic7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udmVydCB0aGUgdG9nZ2xpbmcgbWV0aG9kIHRvICdjbGljaycuXG4gICAgICAgICAqIFRoaXMgaXMgdXNlZCB3aGVuICdob3ZlcicgaXMgc2VsZWN0ZWQgYnkgdGhlIHVzZXJcbiAgICAgICAgICogYnV0IGEgdG91Y2ggZGV2aWNlIGlzIGVuYWJsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1c2VDbGljaygpIHtcbiAgICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLnRvZ2dsaW5nTWV0aG9kID0gJ2NsaWNrJztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9O1xuICB9XSk7XG5cbiAgbWZiLmRpcmVjdGl2ZSgnbWZiQnV0dG9uJywgW2Z1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXF1aXJlOiAnXm1mYk1lbnUnLFxuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIGljb246ICdAJyxcbiAgICAgICAgbGFiZWw6ICdAJ1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbihlbGVtLCBhdHRycykge1xuICAgICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ25nLW1mYi1idXR0b24tZGVmYXVsdC50cGwuaHRtbCc7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pO1xuXG59KSh3aW5kb3csIGFuZ3VsYXIpO1xuIiwic3luYy5kaXJlY3RpdmUoJ2xlZnRNZW51JyxmdW5jdGlvbigpe1xuICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0FFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGRhdGE6ICc9JyxcbiAgICAgICAgICAgIHVzZXI6ICc9JyxcbiAgICAgICAgICAgIHR5cGU6ICc9J1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJkaXJlY3RpdmVzL2xlZnRNZW51Lmh0bWxcIlxuICAgIH07XG59KTtcbnN5bmMuZGlyZWN0aXZlKCdmZWVkcycsZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICBwb3N0czogJz0nLFxuICAgICAgICAgICAgcmVwbGllczogJz0nLFxuICAgICAgICAgICAgY3JlYXRlUG9zdDonPSdcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwiZGlyZWN0aXZlcy9taWRkbGVDb250ZW50Lmh0bWxcIlxuICAgIH07XG59KTtcbnN5bmMuZGlyZWN0aXZlKCdoZWFkZXInLGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQUUnLFxuICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgZGF0YTogJz0nLFxuICAgICAgICAgICAgdXNlcjogJz0nLFxuICAgICAgICAgICAgdHlwZTogJz0nXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcIi4vZGlyZWN0aXZlcy9oZWFkZXIuaHRtbFwiXG5cbiAgICB9O1xufSk7XG5cblxuc3luYy5kaXJlY3RpdmUoJ2tleWJpbmRpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGludm9rZTogJyYnXG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWwsIGF0dHIpIHtcbiAgICAgICAgICAgIE1vdXNldHJhcC5iaW5kKGF0dHIub24sIHNjb3BlLmludm9rZSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCIvKiBnbG9iYWwgJHdpbmRvdyAqL1xuLyogZ2xvYmFsIExvZ2dlciAqL1xuXG5Mb2dnZXIuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJyxbJyRzY29wZScsJyRodHRwJywnJHJvb3RTY29wZScsJyR3aW5kb3cnLCBmdW5jdGlvbiAoJHNjb3BlLCRodHRwLCRyb290U2NvcGUsJHdpbmRvdykge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAnY3JlZGVkZW50aWFsLW5vdC1mb3VuZCcgICAgICAgOiAnQ3JlZGVudGlhbHMgbm90IGZvdW5kIScsXG4gICAgICAgICdzdWNjZXNzJyAgICAgICAgICAgICAgICAgICAgICA6ICdsb2dnaW5nIGluLi4uJ1xuICAgIH07XG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uIChpbmZvKVxuICB7XG4gICAgLy9iZWZvcmUgbm90aWZ5IHRoYXQgd2UgYXJlIGxvZ2dpbmdpblxuICAgICQoJy5sb2dpbi1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IHN1Y2Nlc3MnKS5odG1sKG9wdGlvbnNbJ3N1Y2Nlc3MnXSk7XG4gICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9zZXNzaW9ucycsaW5mbylcbiAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgaWYocmVzcG9uc2UgPT09XCIxXCIpe1xuICAgICAgICAgICAgUmVkaXJlY3RpbmcoKTtcblxuICAgICAgICB9ZWxzZSBpZihyZXNwb25zZSA9PT0gXCIwXCIpe1xuICAgICAgICAgICAgICQoJy5sb2dpbi1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IGVycm9yJykuaHRtbChvcHRpb25zWydjcmVkZWRlbnRpYWwtbm90LWZvdW5kJ10pO1xuICAgICAgICB9ZWxzZSBpZihyZXNwb25zZSA9PT0gXCJub3RWZXJpZmllZFwiKXtcbiAgICAgICAgICAgIG5vdFZlcmlmaWVkKCk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgIC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6JysgZXJyb3IpO1xuICAgIH0pXG4gICAgZnVuY3Rpb24gbm90VmVyaWZpZWQoKXtcbiAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbm90VmVyaWZpZWQnO1xuICAgIH1cbiAgICBmdW5jdGlvbiBSZWRpcmVjdGluZygpe1xuICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3N5bmMnO1xuICAgIH1cbiAgfVxufV0pO1xuIiwiTG9nZ2VyLmNvbnRyb2xsZXIoJ1JlZ2lzdGVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnJHJvb3RTY29wZScsJyRodHRwJyxmdW5jdGlvbiAoJHNjb3BlLCRyb290U2NvcGUsJGh0dHApIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgJ3Bhc3N3b3JkLW5vdE1hdGNoJzogJ3Bhc3N3b3JkIGRvIG5vdCBtYXRjaCcsXG4gICAgICAgICdTaWduVXBJblByb2dyZXNzJyA6ICdXYWl0IHdlIGFyZSBzZXR0aW5nIHVwIHlvdXIgYWNjb3VudC4nXG4gICAgfTtcbiAgICAkc2NvcGUucmVnaXN0ZXI9ZnVuY3Rpb24odXNlcil7XG4gICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBzdWNjZXNzJykuaHRtbChvcHRpb25zWydTaWduVXBJblByb2dyZXNzJ10pO1xuICAgICAgICBpZigkKCcjcGFzc3dvcmQnKS52YWwoKSAhPSAkKCcjcGFzc3dvcmQtY29uZmlybScpLnZhbCgpKXtcbiAgICAgICAgICAkKCcucmVnaXN0ZXItZm9ybS1tYWluLW1lc3NhZ2UnKS5hZGRDbGFzcygnc2hvdyBlcnJvcicpLmh0bWwob3B0aW9uc1sncGFzc3dvcmQtbm90TWF0Y2gnXSk7XG4gICAgICAgICAgc2V0VGltZW91dChtZXNzYWdlUmVtb3ZlLCAyMDAwKTtcbiAgICAgICAgICBmdW5jdGlvbiBtZXNzYWdlUmVtb3ZlKCl7XG4gICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IGVycm9yJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXNlcm5hbWU9JCgnI3VzZXJuYW1lJykudmFsKCk7XG4gICAgICAgIHZhciBlbWFpbD0kKCcjZW1haWwnKS52YWwoKTtcblxuXG4gICAgICAgIGpRdWVyeS5wb3N0KCcvc2Vzc2lvbnMnLCB7dXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDp1c2VyLnBhc3N3b3JkLCBlbWFpbDplbWFpbCwgb3B0aW9uOnVzZXIub3B0aW9uLCBwaG9uZTp1c2VyLnBob25lfSwgZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cywgeGhyKSB7XG4gICAgICAgICAgICBpZihkYXRhID09IDEpe1xuICAgICAgICAgICAgICAgICBSZWRpcmVjdGluZygpO1xuICAgICAgICAgICAgfWVsc2UgaWYoZGF0YSA9PTApe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3ZSBhcmUgZmlyZWQgdGhpcyBjYW4gbm90IGhhcHBlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgICBmdW5jdGlvbiBSZWRpcmVjdGluZygpe1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJy9jaGVja0VtYWlsJztcbiAgICAgICAgfVxuICAgIH1cbn1dKTtcblxuTG9nZ2VyLmRpcmVjdGl2ZSgndW5pcXVlVXNlcm5hbWUnLCBbJ2lzVXNlcm5hbWVBdmFpbGFibGUnLGZ1bmN0aW9uKGlzVXNlcm5hbWVBdmFpbGFibGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuICAgICAgICAgICAgbmdNb2RlbC4kYXN5bmNWYWxpZGF0b3JzLnVuaXF1ZVVzZXJuYW1lID0gaXNVc2VybmFtZUF2YWlsYWJsZTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG5Mb2dnZXIuZmFjdG9yeSgnaXNVc2VybmFtZUF2YWlsYWJsZScsIFsnJHEnLCckaHR0cCcsJyRyb290U2NvcGUnLGZ1bmN0aW9uKCRxLCAkaHR0cCwkcm9vdFNjb3BlKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICdidG4tbG9hZGluZyc6ICc8aSBjbGFzcz1cImZhIGZhLXNwaW5uZXIgZmEtcHVsc2VcIj48L2k+JyxcbiAgICAgICAgJ2J0bi1zdWNjZXNzJzogJzxpIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgJ2J0bi1lcnJvcic6ICc8aSBjbGFzcz1cImZhIGZhLXJlbW92ZVwiPjwvaT4nLFxuICAgICAgICAnbXNnLXN1Y2Nlc3MnOiAnQWxsIEdvb2QhIFJlZGlyZWN0aW5nLi4uJyxcbiAgICAgICAgJ21zZy11c2VybmFtZS1hdmFpbGFibGUnOiAnZ29vZCB1c2VybmFtZSBhdmFpbGFibGUhJyxcbiAgICAgICAgJ21zZy11c2VybmFtZS10YWtlbicgICAgOiAnb29wcyB1c2VybmFtZSB0YWtlbicsXG4gICAgICAgICdtc2ctZW1haWwtdGFrZW4nICAgICAgIDogJ2VtYWlsIHRha2VuJyxcbiAgICAgICAgJ21zZy15b3VyLXBob25lLXN1Y2snICAgOiAneW91ciBwaG9uZSBpcyBub3QgdmFsaWQnLFxuICAgICAgICAndXNlQUpBWCc6IHRydWUsXG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24odXNlcm5hbWUpIHtcblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvdXNlcnM/dXNlcm5hbWU9JyArIHVzZXJuYW1lICsgJyZhY2Nlc3NfdG9rZW49QmM3RFdTN0tLUkx0eG1kZFVaSTFUMWxadTJKMVloUjhPTFhHV05abicpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZihkYXRhPT0nYXZhaWxhYmxlJyl7XG4gICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykuYWRkQ2xhc3MoJ3Nob3cgc3VjY2VzcycpLmh0bWwob3B0aW9uc1snbXNnLXVzZXJuYW1lLWF2YWlsYWJsZSddKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG1lc3NhZ2VSZW1vdmUsIDIwMDApO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG1lc3NhZ2VSZW1vdmUoKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIGlmKGRhdGE9PSd0YWtlbicpe1xuICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IGVycm9yJykuaHRtbChvcHRpb25zWydtc2ctdXNlcm5hbWUtdGFrZW4nXSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCh1c2VybmFtZVRha2VuLCAyMDAwKTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1c2VybmFtZVRha2VuKCl7XG4gICAgICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IGVycm9yJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG59XSk7XG5Mb2dnZXIuZGlyZWN0aXZlKCd1bmlxdWVFbWFpbCcsIFsnaXNFbWFpbEF2YWlsYWJsZScsZnVuY3Rpb24oaXNFbWFpbEF2YWlsYWJsZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRhc3luY1ZhbGlkYXRvcnMudW5pcXVlRW1haWwgPSBpc0VtYWlsQXZhaWxhYmxlO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcbkxvZ2dlci5mYWN0b3J5KCdpc0VtYWlsQXZhaWxhYmxlJywgWyckcScsJyRodHRwJywnJHJvb3RTY29wZScsZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHJvb3RTY29wZSkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAnYnRuLWxvYWRpbmcnOiAnPGkgY2xhc3M9XCJmYSBmYS1zcGlubmVyIGZhLXB1bHNlXCI+PC9pPicsXG4gICAgICAgICdidG4tc3VjY2Vzcyc6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICdidG4tZXJyb3InOiAnPGkgY2xhc3M9XCJmYSBmYS1yZW1vdmVcIj48L2k+JyxcbiAgICAgICAgJ21zZy1zdWNjZXNzJzogJ0FsbCBHb29kISBSZWRpcmVjdGluZy4uLicsXG4gICAgICAgICdtc2ctdXNlcm5hbWUtYXZhaWxhYmxlJzogJ2dvb2QgdXNlcm5hbWUgYXZhaWxhYmxlIScsXG4gICAgICAgICdtc2ctdXNlcm5hbWUtdGFrZW4nICAgIDogJ29vcHMgdXNlcm5hbWUgdGFrZW4nLFxuICAgICAgICAnbXNnLWVtYWlsLXRha2VuJyAgICAgICA6ICdlbWFpbCB0YWtlbicsXG4gICAgICAgICdtc2ctZW1haWwtYXZhaWxhYmxlJyAgIDogJ2VtYWlsIGF2YWlsYWJsZScsXG4gICAgICAgICdtc2cteW91ci1waG9uZS1zdWNrJyAgIDogJ3lvdXIgcGhvbmUgaXMgbm90IHZhbGlkJyxcbiAgICAgICAgJ3VzZUFKQVgnOiB0cnVlLFxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgJGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS91c2Vycz9lbWFpbD0nICsgZW1haWwgKyAnJmFjY2Vzc190b2tlbj1CYzdEV1M3S0tSTHR4bWRkVVpJMVQxbFp1MkoxWWhSOE9MWEdXTlpuJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcblxuICAgICAgICAgICAgaWYoZGF0YT09J2VtYWlsLWF2YWlsYWJsZScpe1xuICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IHN1Y2Nlc3MnKS5odG1sKG9wdGlvbnNbJ21zZy1lbWFpbC1hdmFpbGFibGUnXSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChtZXNzYWdlUmVtb3ZlLCAyMDAwKTtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBtZXNzYWdlUmVtb3ZlKCl7XG4gICAgICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLnJlbW92ZUNsYXNzKCdzaG93IHN1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGRhdGE9PSdlbWFpbC10YWtlbicpe1xuICAgICAgICAgICAgICAgICQoJy5yZWdpc3Rlci1mb3JtLW1haW4tbWVzc2FnZScpLmFkZENsYXNzKCdzaG93IGVycm9yJykuaHRtbChvcHRpb25zWydtc2ctZW1haWwtdGFrZW4nXSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChtZXNzYWdlRW1haWxUYWtlbiwgMjAwMCk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gbWVzc2FnZUVtYWlsVGFrZW4oKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnJlZ2lzdGVyLWZvcm0tbWFpbi1tZXNzYWdlJykucmVtb3ZlQ2xhc3MoJ3Nob3cgZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICAgICB9KS5lcnJvcihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgIH0pO1xuICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn1dKTtcbiIsInN5bmMuc2VydmljZSgnRmlsZXMnLCBbJyRodHRwJywnJHEnLCckcm9vdFNjb3BlJyxmdW5jdGlvbiBGaWxlcyAoJGh0dHAsJHEsJHJvb3RTY29wZSkge1xuICAgIHRoaXMuZ2V0R3JvdXBGaWxlcyA9ZnVuY3Rpb24oZ3JvdXBJZCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAvL2Rvd24gZW5kcG9pbnQgcmV0dXJuIGFsbCBmaWxlcyBJIG93blxuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArJy9hcGkvdjEvZ3JvdXBzLycrZ3JvdXBJZCsnL2dyb3VwZmlsZXMnKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHRoaXMuc2luZ2xlID0gZnVuY3Rpb24oZmlsZSl7XG4gICAgICB2YXIgcHJvbWlzZSA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCsgJy9wcmV2aWV3LycrIGZpbGUpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIHByb21pc2UucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgIHByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmdldEJveEZpbGVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGdyb3VwSWQgPSAxOy8vYnkgZGVmYXVsdCB0aGlzIGNhbiBiZSBhbnkgbnVtYmVyXG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIC8vdGhlIGlkZWEgaXMgdG8gZ2V0IGEgZmlsZSBlaXRoZXIgZnJvbSBncm91cHMgb3IgaW5kaXZpZHVhbCBhY2NvdW50IGdyb3VwIGlzIG9wdGlvbmFsXG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvZ3JvdXBzLycrZ3JvdXBJZCsnL2JveGZpbGVzJylcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdGhpcy5nZXRNaW1lVHlwZSA9IGZ1bmN0aW9uKGZpbGVfbmFtZSl7XG4gICAgICB2YXIgcHJvbWlzZSA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL2ZpbGVzL21pbWVUeXBlLycrIGZpbGVfbmFtZSlcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICBwcm9taXNlLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIHByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwcm9taXNlLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmRvd25sb2FkRmlsZSA9IGZ1bmN0aW9uKGZpbGVfbmFtZSl7XG5cbiAgICAgIHZhciBwcm9taXNlID0gJHEuZGVmZXIoKTtcbiAgICAgIC8vaGFyZCBjb2RlZCBhIHVzZXIgU3RyaW1VcCEgbmVlZCB0byBpbmplY3QgaGltIGR5YW1pY2FsbHlcbiAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50KyAnL2FwaS92MS9maWxlcy9kb3dubG9hZC8nK2ZpbGVfbmFtZSsnL29mLycrICdTdHJpbVVwJylcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgcHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgcHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByb21pc2UucHJvbWlzZTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xufV0pO1xuIiwic3luYy5zZXJ2aWNlKCdQZW9wbGUnLCBbJyRxJywnJGh0dHAnLCckcm9vdFNjb3BlJyxmdW5jdGlvbiAoJHEsICRodHRwLCAkcm9vdFNjb3BlKSB7XG5cdHRoaXMuZ2V0ICA9IGZ1bmN0aW9uICgpe1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9zdWdnZXN0aW9ucycpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHR0aGlzLmFsbElmb2xsb3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2ZvbGxvd2luZ3MnKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycil7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcblx0XHR9KVxuXHRcdHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuXHR9XG5cdHRoaXMudW5Gb2xsb3cgPSBmdW5jdGlvbihpZCl7XG5cdFx0dmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHQkaHR0cC5kZWxldGUoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2ZvbGxvd2luZy8nICtpZClcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpe1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHR0aGlzLmZvbGxvdyA9IGZ1bmN0aW9uKHBhcmFtKXtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLnB1dCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZm9sbG93aW5ncycsIHBhcmFtKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHRyZXR1cm4gdGhpcztcbn1dKTtcbiIsInN5bmMuc2VydmljZSgnU2hhcmUnLFsnJGxvZycsJyRodHRwJywnJHEnLCckcm9vdFNjb3BlJywgZnVuY3Rpb24gKCRsb2csJGh0dHAsJHEsJHJvb3RTY29wZSkge1xuXHR0aGlzLnNoYXJlID0gZnVuY3Rpb24oc2hhcmVibGVPYmope1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLnBvc3QoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL3NoYXJlJyxzaGFyZWJsZU9iailcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblx0dGhpcy5nZXRVc2VyID0gZnVuY3Rpb24odXNlcil7XG5cblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvdXNlcnMvJysgdXNlcilcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpe1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH07XG5cdHRoaXMuZmlsZU1pbWUgPSBmdW5jdGlvbihmaWxlKXtcblx0XHR2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWltZVR5cGUvJysgZmlsZSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpe1xuXHRcdFx0ZGlmZmVyZWQucmVqZWN0KGVycik7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH07XG4gICAgcmV0dXJuIHRoaXM7XG59XSk7Iiwic3luYy5zZXJ2aWNlKCdVc2VyJywgWyckaHR0cCcsJyRxJywnJHJvb3RTY29wZScsZnVuY3Rpb24gRmlsZXMgKCRodHRwLCRxLCRyb290U2NvcGUpIHtcblx0dGhpcy5pbmZvID0gZnVuY3Rpb24oKXtcblx0XHR2YXIgcHJvbWlzZSA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgK1wiL2FwaS92MS91c2Vycy9pbmZvXCIpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKXtcblx0XHRcdHByb21pc2UucmVzb2x2ZShyZXMpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJvbWlzZS5yZWplY3QoKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gcHJvbWlzZS5wcm9taXNlO1xuXHR9O1xuXHR0aGlzLmdyb3VwcyA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzJylcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnIpO1xuICAgICAgfSlcbiAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH1cbiAgICBcblx0cmV0dXJuIHRoaXM7XG59XSkiLCIvKiBnbG9iYWwgc3luYyAqL1xuc3luYy5zZXJ2aWNlKCdOb3RpZmljYXRpb24nLCBbJyRodHRwJywgJyRxJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbiBOb3RpZmljYXRpb24oJGh0dHAsICRxLCAkcm9vdFNjb3BlKSB7XG4gICAgdGhpcy5nZXROb3RpZmljYXRpb24gPSBmdW5jdGlvbiAodXNlcl9pZCkge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL25vdGlmaWNhdGlvbnMnLCB7Y2FjaGU6IGZhbHNlfSlcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlTm90aWZpY2F0aW9uID0gZnVuY3Rpb24gKE5vdGlmaWNhdGlvbikge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9ub3RpZmljYXRpb25zJywgTm90aWZpY2F0aW9uKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfVxuICAgIHRoaXMuZGVsZXRlTm90aWZpY2F0aW9uID0gZnVuY3Rpb24gKG5vdGlmaWNhdGlvbikge1xuICAgICAgICB2YXIgZGlmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAkaHR0cC5kZWxldGUoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL25vdGlmaWNhdGlvbnMvJyArIG5vdGlmaWNhdGlvbilcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59XSk7XG5cbnN5bmMuY29udHJvbGxlcignbm90aWZpY2F0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywnTm90aWZpY2F0aW9uJywnJGxvZycsIGZ1bmN0aW9uICgkc2NvcGUsTm90aWZpY2F0aW9uLCRsb2cpIHtcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5nZXROb3RpZmljYXRpb24oKTtcbiAgICB9XG4gICAgJHNjb3BlLmNsZWFyTm90aWZpY2F0aW9uID0gZnVuY3Rpb24obm90aWZpY2F0aW9uKXtcblxuXG4gICAgICBOb3RpZmljYXRpb24uY2xlYXJOb3RpZmljYXRpb24obm90aWZpY2F0aW9uKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAvL2xvYWQgcmVtYWluaW5nIG5vdGlmaWNhdGlvblxuICAgICAgICAkc2NvcGUuZ2V0Tm90aWZpY2F0aW9uKCk7XG4gICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gICAgJHNjb3BlLmdldE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIE5vdGlmaWNhdGlvbi5nZXROb3RpZmljYXRpb24oKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgICAgLy8gJGxvZy5pbmZvKHJlc3VsdCk7XG4gICAgICAgICAgICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IHJlc3VsdDtcbiAgICAgICAgICAgIFxuICAgICAgICB9LGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgIC8vICRsb2cuaW5mbyhlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAkc2NvcGUuaW5pdCgpO1xufV0pO1xuc3luYy5kaXJlY3RpdmUoJ25vdGlmeScsW2Z1bmN0aW9uKCl7XG4gIHJldHVybntcbiAgICByZXN0cmljdDonQUUnLFxuICAgIHNjb3BlOntcblxuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsLCBpQXR0cnMpe1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICB2YXIgdGl0bGU9J1RoaXMgd2lsbCBiZSB0aXRsZSc7XG4gICAgICAgICAgICAgIHZhciBkZXNjPSdNb3N0IHBvcHVsYXIgYXJ0aWNsZS4nO1xuICAgICAgICAgICAgICB2YXIgdXJsPSdzeW5jLmNvbTo4MDAwJztcbiAgICAgICAgICAgICAgbm90aWZ5QnJvd3Nlcih0aXRsZSxkZXNjLHVybCk7XG4gICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgIGlmIChOb3RpZmljYXRpb24ucGVybWlzc2lvbiAhPT0gXCJncmFudGVkXCIpe1xuICAgICAgICAgICAgICAgICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gbm90aWZ5QnJvd3Nlcih0aXRsZSxkZXNjLHVybClcbiAgICAgIHtcbiAgICAgICAgaWYgKCFOb3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEZXNrdG9wIG5vdGlmaWNhdGlvbnMgbm90IGF2YWlsYWJsZSBpbiB5b3VyIGJyb3dzZXIuLicpO1xuICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uICE9PSBcImdyYW50ZWRcIil7XG4gICAgICAgICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIG5vdGlmaWNhdGlvbiA9IG5ldyBOb3RpZmljYXRpb24odGl0bGUsIHtcbiAgICAgICAgICAgIGljb246J2h0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tYUNGaUs0YmFYWDQvVmptR0pvanNRX0kvQUFBQUFBQUFOSmcvaC1zTFZYMU01ekEvczQ4LUljNDIvZWdnc21hbGwucG5nJyxcbiAgICAgICAgICAgIGJvZHk6IGRlc2MsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZW1vdmUgdGhlIG5vdGlmaWNhdGlvbiBmcm9tIE5vdGlmaWNhdGlvbiBDZW50ZXIgd2hlbiBjbGlja2VkLlxuICAgICAgICBub3RpZmljYXRpb24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdGhlIG5vdGlmaWNhdGlvbiBpcyBjbG9zZWQuXG4gICAgICAgIG5vdGlmaWNhdGlvbi5vbmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdOb3RpZmljYXRpb24gY2xvc2VkJyk7XG4gICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1dKVxuIiwic3luYy5mYWN0b3J5KCd1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKG1lc3NhZ2UsIFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgfSxcbiAgICAgICAgd2FybjogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKG1lc3NhZ2UsIFwiSGV5XCIpO1xuICAgICAgICB9LFxuICAgICAgICBpbmZvOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLmluZm8obWVzc2FnZSwgXCJGWUlcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKG1lc3NhZ2UsIFwiT2ggTm9cIik7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCJzeW5jLmZhY3RvcnkoJ3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MobWVzc2FnZSwgXCJTdWNjZXNzXCIpO1xuICAgICAgICB9LFxuICAgICAgICB3YXJuOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcobWVzc2FnZSwgXCJIZXlcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGluZm86IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuaW5mbyhtZXNzYWdlLCBcIkZZSVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IobWVzc2FnZSwgXCJPaCBOb1wiKTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsIlxuc3luYy5jb250cm9sbGVyKCd1cGxvYWREaWFsb2dDdHJsJywgWyckc2NvcGUnLCckdWliTW9kYWwnLCckbWREaWFsb2cnLCckbWRNZWRpYScsIGZ1bmN0aW9uICgkc2NvcGUsJHVpYk1vZGFsLCAkbWREaWFsb2csICRtZE1lZGlhKSB7XG5cblx0XHRcdFx0Ly9kZWNsYXJlIGdsb2JhbCBmdW5jdGlvbiBmb3Igc2hvcnRjdXRcblx0XHRcdFx0JHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHRcdH07XG5cdFx0ICAgICRzY29wZS5jdXN0b21GdWxsc2NyZWVuID0gJG1kTWVkaWEoJ3hzJykgfHwgJG1kTWVkaWEoJ3NtJyk7XG5cdFx0ICAgICRzY29wZS51cGxvYWQgPSBmdW5jdGlvbihldikge1xuXHRcdCAgICAgICRtZERpYWxvZy5zaG93KHtcblx0XHRcdFx0XHRcdHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuXHRcdCAgICAgICAgY29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHQgICAgICAgIHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL3VwbG9hZC50cGwuaHRtbCcsXG5cdFx0ICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcblx0XHQgICAgICAgIHRhcmdldEV2ZW50OiBldixcblx0XHQgICAgICAgIGNsaWNrT3V0c2lkZVRvQ2xvc2U6ZmFsc2Vcblx0XHQgICAgICB9KVxuXHRcdCAgICAgIC50aGVuKGZ1bmN0aW9uKGFuc3dlcikge1xuXHRcdCAgICAgICAgICAgICRzY29wZS5zdGF0dXMgPSAnWW91IHNhaWQgdGhlIGluZm9ybWF0aW9uIHdhcyBcIicgKyBhbnN3ZXIgKyAnXCIuJztcblx0XHQgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG5cdFx0ICAgICAgICAgICAgJHNjb3BlLnN0YXR1cyA9ICdZb3UgY2FuY2VsbGVkIHRoZSBkaWFsb2cuJztcblx0XHQgICAgICAgICAgfSk7XG5cdFx0ICAgIH07XG5cdFx0XHRcdGZ1bmN0aW9uIERpYWxvZ0NvbnRyb2xsZXIoJHNjb3BlLCAkbWREaWFsb2cpIHtcblx0XHRcdFx0ICAkc2NvcGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQgICAgJG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdFx0ICB9O1xuXHRcdFx0XHQgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ICAgICRtZERpYWxvZy5jYW5jZWwoKTtcblx0XHRcdFx0ICB9O1xuXHRcdFx0XHQgICRzY29wZS5hbnN3ZXIgPSBmdW5jdGlvbihhbnN3ZXIpIHtcblx0XHRcdFx0ICAgICRtZERpYWxvZy5oaWRlKGFuc3dlcik7XG5cdFx0XHRcdCAgfTtcblx0XHRcdFx0fVxufV0pO1xuc3luYy5jb250cm9sbGVyKCdzaGFyZUNvbnRyb2xsZXInLCBbJyRzY29wZScsJyR1aWJNb2RhbCcsJyRtZERpYWxvZycsJyRtZE1lZGlhJywndXJsU2hvcnRlbmVyJywnU2hhcmUnLCdVc2VyJywgZnVuY3Rpb24gKCRzY29wZSwkdWliTW9kYWwsICRtZERpYWxvZywgJG1kTWVkaWEsdXJsU2hvcnRlbmVyLFNoYXJlLFVzZXIpIHtcblxuXHQvL2RlY2xhcmUgZ2xvYmFsIGZ1bmN0aW9uIGZvciBzaG9ydGN1dFxuXHQkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fTtcblx0JHNjb3BlLmN1c3RvbUZ1bGxzY3JlZW4gPSAkbWRNZWRpYSgneHMnKSB8fCAkbWRNZWRpYSgnc20nKTtcblx0JHNjb3BlLnNoYXJlID0gZnVuY3Rpb24oZXYsZmlsZU5hbWUpIHtcblxuXHRcdCRtZERpYWxvZy5zaG93KHtcblx0XHRcdHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuXHRcdFx0Y29udHJvbGxlcjogRGlhbG9nQ29udHJvbGxlcixcblx0XHRcdHRlbXBsYXRlVXJsOiAnL0FwcC9zY3JpcHRzL3ZpZXdzL3NoYXJlLnRwbC5odG1sJyxcblx0XHRcdHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuXHRcdFx0dGFyZ2V0RXZlbnQ6IGV2LFxuXHRcdFx0Y2xpY2tPdXRzaWRlVG9DbG9zZTpmYWxzZVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oYW5zd2VyKSB7XG5cdFx0XHRcdFx0JHNjb3BlLnN0YXR1cyA9ICdZb3Ugc2FpZCB0aGUgaW5mb3JtYXRpb24gd2FzIFwiJyArIGFuc3dlciArICdcIi4nO1xuXHRcdFx0XHR9LCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkc2NvcGUuc3RhdHVzID0gJ1lvdSBjYW5jZWxsZWQgdGhlIGRpYWxvZy4nO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0ZnVuY3Rpb24gRGlhbG9nQ29udHJvbGxlcigkc2NvcGUsICRtZERpYWxvZykge1xuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdzaGFyZWRGaWxlJysgZmlsZU5hbWUpO1xuXHRcdFx0XHRcdCRzY29wZS5nZXRGaWxlID0gZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdHJldHVybiAkc2NvcGUuZmlsZT11cmxTaG9ydGVuZXIubWFrZVNob3J0KGZpbGVOYW1lKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdCRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0JHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0JG1kRGlhbG9nLmNhbmNlbCgpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0JHNjb3BlLmFuc3dlciA9IGZ1bmN0aW9uKGFuc3dlcikge1xuXHRcdFx0XHRcdFx0JG1kRGlhbG9nLmhpZGUoYW5zd2VyKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cblx0fTtcblxuXG5cblx0JHNjb3BlLnNoYXJlRmlsZSA9IGZ1bmN0aW9uKHZtKXtcblx0XHRcblx0XHR2YXIgZW1haWxzPXZtLmVtYWlscztcblx0XHR2YXIgZW1haWxfYXJyYXkgPSBlbWFpbHMuc3BsaXQoJywnKTtcblx0XHR2YXIgaTtcblx0XHRmb3IgKCBpPTA7IGkgPCBlbWFpbF9hcnJheS5sZW5ndGg7IGkrKyApIHtcblx0XHRcdC8vdmFsaWRhdGUgZWFjaCBlbWFpbCB0byBzaGFyZSB3aXRoXG5cdFx0XHRTaGFyZS5zaGFyZSh2bSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHJlcyk7XG5cdFx0XHR9KS5jYXRjaCgpO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coZW1haWxfYXJyYXlbaV0pO1xuXG5cdFx0fVxuXHR9XG5cbn1dKTtcbiIsIi8qIGdsb2JhbCBzeW5jICovXG4vKipcbiAqICBDcmVhdGVkIGJ5IE11cmFnaWppbWFuYSBSaWNoYXJkIG9uIDEwLzIwLzE1LlxuICogIEJlYXN0YXI0NTdAZ21haWwuY29tICwgc3luY0BnbWFpbC5jb20gLCBjaGVjayB3aXRoIG1lIVxuICovXG4vKkkgdXNlIENhbWVsQ2FzZSB3aGlsZSByZW5hbWluZyBteSBmdW5jdGlvbnMgKi9cbi8qYW5kIGkgdXNlIHNuYWtlIGNhc2Ugd2hpbGUgcmVuYW1pbmcgdmFyaWFibGVzICovXG4vKnBvc3Qgc2VydmljZSAqL1xuXG5zeW5jLnNlcnZpY2UoJ1Bvc3QnLCBbJyRodHRwJywgJyRxJywgJyRyb290U2NvcGUnLCBmdW5jdGlvbiBQb3N0KCRodHRwLCAkcSwgJHJvb3RTY29wZSkge1xuICAgIHRoaXMuZ2V0UG9zdCA9IGZ1bmN0aW9uICh1c2VyX2lkKSB7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvcG9zdHM/dXNlcl9pZCcgKyB1c2VyX2lkLCB7Y2FjaGU6IGZhbHNlfSlcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLnBhcnRpY2lwYXRlID0gZnVuY3Rpb24ob2JqKXtcbiAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAkaHR0cC5wdXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL3Bvc3RzLycsb2JqKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH07XG4gICAgdGhpcy5jcmVhdGVQb3N0ID0gZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvcG9zdHMnLCBwb3N0KVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG4gICAgfTtcbiAgICB0aGlzLmRlbGV0ZVBvc3QgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdmFyIGRpZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgJGh0dHAuZGVsZXRlKCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9wb3N0cy8nICsgaWQpXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xufV0pO1xuXG5zeW5jLmNvbnRyb2xsZXIoJ1Bvc3RpbmdDb250cm9sbGVyJywgW1xuICAnJHNjb3BlJyxcbiAgJ1Bvc3QnLFxuICAnJHRpbWVvdXQnLFxuICAnVXNlcicsXG4gICckaW50ZXJ2YWwnLFxuICAnTm90aWZpY2F0aW9uJyxcbiAgLy8gJyRpb25pY0xpc3REZWxlZ2F0ZScsXG4gICckbG9nJyxcbiAgJ3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsXG4gIGZ1bmN0aW9uIChcbiAgJHNjb3BlLFxuICBQb3N0LFxuICAkdGltZW91dCxcbiAgVXNlcixcbiAgJGludGVydmFsLFxuICBOb3RpZmljYXRpb24sXG4gICRpb25pY0xpc3REZWxlZ2F0ZSxcbiAgJGxvZyxcbiAgdXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uXG4pIHtcblxuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUucG9zdExvYWRlcigpO1xuICAgICAgICAkc2NvcGUuZ2V0VXNlcigpO1xuXG4gICAgfTtcblxuICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5wb3N0TG9hZGVyKCk7XG4gICAgfSwgODAwMCk7XG4gICAgJHNjb3BlLmdldFVzZXIgPWZ1bmN0aW9uKCl7XG5cbiAgICAgIFVzZXIuX2lkKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuICAgICAgICAkc2NvcGUudXNlciA9IHJlc3BvbnNlO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgIC8vcXVpdCBzbGludGx5XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5sb2FkTW9yZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICB9O1xuICAgICRzY29wZS5wYXJ0aWNpcGF0ZUludG9Qb3N0ID0gZnVuY3Rpb24ocG9zdCx1c2VyKXtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHVzZXIpO1xuICAgICAgdmFyIG9iaiA9e1xuICAgICAgICAncG9zdF9pZCc6cG9zdCxcbiAgICAgICAgJ3VzZXJfaWQnOnVzZXJcbiAgICAgIH07XG4gICAgICBQb3N0LnBhcnRpY2lwYXRlKG9iailcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLnBvc3RMb2FkZXIoKTtcbiAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgLy9xdWl0IHNsZW50bHlcblxuICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUucG9zdExvYWRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmRhdGFMb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgUG9zdC5nZXRQb3N0KClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0cmVlKSB7XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUucG9zdHMgPXRyZWU7XG4gICAgICAgICAgICAgICAgLy9uYXZpZ2F0ZSB0cm91Z2ggdHJlZSByZXNwb25zZSB3aGljaCBpcyByZXF1aXJlIG11Y2ggYXR0ZW50aW9uXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZyaWVuZHM9W107XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlcGxpZXM9W107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmVlW2ldLmhhc093blByb3BlcnR5KCdmcmllbmRzJykgJiYgdHJlZVtpXVsncmVwbGllcyddICAmJiB0cmVlW2ldWydmcmllbmRzJ10gKSB7XG4gICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZyaWVuZHMucHVzaCh0cmVlW2ldLmZyaWVuZHMpO1xuICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5yZXBsaWVzLnB1c2godHJlZVtpXS5yZXBsaWVzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0cmVlW2ldLmhhc093blByb3BlcnR5KCdmcmllbmRzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mcmllbmRzID0gZnJpZW5kcy5jb25jYXQodHJhdmVyc2UodHJlZVtpXS5mcmllbmRzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucmVwbGllcyA9IHJlcGxpZXMuY29uY2F0KHRyYXZlcnNlKHRyZWVbaV0ucmVwbGllcykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmltYWdlRGVzYyA9IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIC8vc2hvdyBpbWFnZXMgd2l0aCBkaWZmZXJlbnQgcGl4ZWxcbiAgICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHJldHVybiAnNjBweCc7XG5cbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gXCI2MHB4XCI7XG5cbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gXCI2MHB4XCI7XG5cbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gXCI2MHB4XCI7XG5cbiAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICByZXR1cm4gXCI2MHB4XCI7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIFwiNjBweFwiO1xuXG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2hhcmUgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRpb25pY0xpc3REZWxlZ2F0ZS5jbG9zZU9wdGlvbkJ1dHRvbnMoKTtcbiAgICAgICAgJGxvZy5pbmZvKGlkKTtcbiAgICB9O1xuICAgICRzY29wZS5jcmVhdGVQb3N0ID0gZnVuY3Rpb24gKHBvc3RpbmcpIHtcbiAgICAgIC8vaWYgaW1hZ2UgaXMgdXBsb2FkZWQgdXBsb2FkZWRcbiAgICAgICAgdmFyIF90aGlzID0geyBtZXNzYWdlOiBwb3N0aW5nIH07XG4gICAgICAgIFBvc3QuY3JlYXRlUG9zdChfdGhpcylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChwb3N0Q3JlYXRlZCkge1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICRzY29wZS5wb3N0cy5wdXNoKHBvc3RDcmVhdGVkKTtcbiAgICAgICAgICAgICAgICAgIHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiTmV3IFBvc3QgZmVlZCBjcmVhdGVkIVwiKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuXG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmluaXQoKTtcbn1dKTtcbnN5bmMuZGlyZWN0aXZlKCdmZWVkc1VwbG9hZGVyJyxbZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0FFJyxcbiAgICByZXBsYWNlOiBmYWxzZSxcbiAgICB0ZW1wbGF0ZVVybDogJ0FwcC9qcy9zY3JpcHRzL3ZpZXdzL2ZlZWRBdHRhY2htZW50Lmh0bWwnLFxuICAgIHNjb3BlOiB7XG4gICAgICBhY3Rpb246ICdAJ1xuICAgIH0sXG4gICAgY29udHJvbGxlcjogWyckc2NvcGUnLCBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xuICAgICAgJHNjb3BlLmF2YXRhciA9ICcnO1xuICAgICAgJHNjb3BlLnNlbmRGaWxlID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyICRmb3JtID0gJChlbCkucGFyZW50cygnZm9ybScpO1xuICAgICAgICBpZiAoJChlbCkudmFsKCkgPT09ICcnKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsICRzY29wZS5hY3Rpb24pO1xuICAgICAgICAkc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XG4gICAgICAgIH0pO1xuICAgICAgICAkZm9ybS5hamF4U3VibWl0KHtcbiAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIFx0YmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xuICAgICAgICBcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCAnQmVhcmVyIE9xRmlyUVM0NFJRVGpSdVduaVhqZEhaSlFYZEN1RXg0OXJxOEpZNUEnKTtcbiAgICAgICAgXHR9LFxuICAgICAgICAgIHVwbG9hZFByb2dyZXNzOiBmdW5jdGlvbihldnQsIHBvcywgdG90LCBwZXJjQ29tcGxldGUpIHtcbiAgICAgICAgICAgICRzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIC8vIHVwbG9hZCB0aGUgcHJvZ3Jlc3MgYmFyIGR1cmluZyB0aGUgdXBsb2FkXG4gICAgICAgICAgICAgIC8vICRzY29wZS5wcm9ncmVzcyA9IHBlcmNlbnRDb21wbGV0ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGV2dCwgc3RhdHVzVGV4dCwgcmVzcG9uc2UsIGZvcm0pIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgYWN0aW9uIGF0dHJpYnV0ZSBmcm9tIHRoZSBmb3JtXG4gICAgICAgICAgICAkZm9ybS5yZW1vdmVBdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMsIHhociwgZm9ybSkge1xuICAgICAgICAgICAgdmFyIGFyID0gJChlbCkudmFsKCkuc3BsaXQoJ1xcXFwnKSxcbiAgICAgICAgICAgICAgZmlsZW5hbWUgPSAgYXJbYXIubGVuZ3RoLTFdO1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBhY3Rpb24gYXR0cmlidXRlIGZyb20gdGhlIGZvcm1cbiAgICAgICAgICAgICRmb3JtLnJlbW92ZUF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmF2YXRhciA9IGZpbGVuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1dLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycywgY3RybCkge1xuXG4gICAgICBlbGVtLmZpbmQoJy5mYWtlLXVwbG9hZGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGVsZW0uZmluZCgnaW5wdXRbdHlwZT1cImZpbGVcIl0nKS5jbGljaygpO1xuICAgICAgfSk7XG5cbiAgICB9XG4gIH07XG59XSk7XG4iLCIvKiBnbG9iYWwgJHVpYk1vZGFsSW5zdGFuY2UgKi9cbi8qIGdsb2JhbCBNb2RhbEluc3RhbmNlQ3RybCAqL1xuLyogZ2xvYmFsICR1aWJNb2RhbCAqL1xuLyogZ2xvYmFsIHN5bmMgKi9cbi8qIGdsb2JhbCBzeW5jICovXG5zeW5jLmNvbnRyb2xsZXIoJ0ZpbGVzQ29udHJvbGxlcicsXG4gW1xuXHQnJHNjb3BlJywnRmlsZXMnLCckbG9nJywnJHdpbmRvdycsJ1VzZXInLCckdWliTW9kYWwnLCckaW50ZXJ2YWwnLCdwZGZEZWxlZ2F0ZScsJyR0aW1lb3V0JywnJHN0YXRlUGFyYW1zJywnJHJvb3RTY29wZScsJyRleGNlcHRpb25IYW5kbGVyJywgZnVuY3Rpb24gKFxuXHRcdCRzY29wZSwgRmlsZXMsJGxvZywkd2luZG93LFVzZXIsJHVpYk1vZGFsLCRpbnRlcnZhbCxwZGZEZWxlZ2F0ZSwkdGltZW91dCwkc3RhdGVQYXJhbXMsJHJvb3RTY29wZSwkZXhjZXB0aW9uSGFuZGxlcikge1xuXG5cdCAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgLy9sb2FkIGFsbCBib3ggZmlsZXNcblx0XHQgICAgJHNjb3BlLmFsbCgpO1xuXHQgIH07XG5cblxuXHQgIC8vICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHQvLyAkc2NvcGUuYWxsKCk7XG4gICAvLyAgfSwgODAwMCk7XG5cblxuXHQgJHNjb3BlLmFsbCA9IGZ1bmN0aW9uKCl7XG4gICAgJHNjb3BlLmRhdGFMb2FkaW5nID0gdHJ1ZTtcblx0XHRGaWxlcy5nZXRCb3hGaWxlcygpXG5cdFx0XHQudGhlbihmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHQkc2NvcGUuZmlsZXMgXHQ9XHRyZXM7XG5cblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0fSlcbiAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkc2NvcGUuZGF0YUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgfSk7XG5cdCB9O1xuICAkc2NvcGUuZmlsZVR5cGUgID0gZnVuY3Rpb24odHlwZSkge1xuXG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAncGRmJzpcbiAgICAgICAgICByZXR1cm4gJ2ltZy9wZGYucG5nJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZm9sZGVyJzpcbiAgICAgICAgICByZXR1cm4gJ2ltZy91bml2ZXJzYWxfZm9sZGVyLnBuZyc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZvbGRlcisnOlxuICAgICAgICAgIHJldHVybiAnaW1nL0FkZF9mb2xkZXIucG5nJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGhwJzpcbiAgICAgICAgICByZXR1cm4gJ2ltZy9jb2RlLnBuZyc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3R4dCc6XG4gICAgICAgIHJldHVybiAnaW1nL2NvZGUucG5nJztcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RvY3gnOlxuICAgICAgICAgIHJldHVybiAnaW1nL3dvcmQucG5nJztcbiAgICAgICAgY2FzZSAnanBnJzpcbiAgICAgICAgICByZXR1cm4gJ2ZhIGZhLWltYWdlJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncG5nJzpcbiAgICAgICAgICByZXR1cm4gJ2ltZy92aWRlby5wbmcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdqcGVnJzpcbiAgICAgICAgICAgIHJldHVybiAnaW1nL3VuaXZlcnNhbF9mb2xkZXIucG5nJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnemlwJzpcbiAgICAgICAgIHJldHVybiAnaW1nL3ppcC5wbmcnO1xuICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnaW1nL3VuaXZlcnNhbF9mb2xkZXIucG5nJztcbiAgICAgIH1cbiAgfTtcblxuXHQkc2NvcGUuaW5pdCgpO1xufV0pO1xuXG5zeW5jLmRpcmVjdGl2ZSgnZHJhZ2dhYmxlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50WzBdO1xuXG4gICAgICAgICAgICBlbC5kcmFnZ2FibGUgPSB0cnVlO1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICdkcmFnc3RhcnQnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkcmFnIGV2ZW50IHN0YXJ0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICAgICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnVGV4dCcsIHRoaXMuaWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2RyYWcnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ2RyYWdlbmQnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2RyYWcgZXZlbnQgcmVsZWFzZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuXG5zeW5jLmRpcmVjdGl2ZSgnZHJvcHBhYmxlJywgWyd1c2VySW50ZXJhY3Rpb25Ob3RpZmljYXRpb24nLCdGaWxlcycsZnVuY3Rpb24odXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLEZpbGVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIGRyb3A6ICcmJyxcbiAgICAgICAgICAgIGJpbjogJz0nLy8gcGFyZW50XG4gICAgICAgIH0sXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBhZ2FpbiB3ZSBuZWVkIHRoZSBuYXRpdmUgb2JqZWN0XG4gICAgICAgICAgICB2YXIgZWwgPSBlbGVtZW50WzBdO1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgJ2RyYWdvdmVyJyxcbiAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgICAgICAgICAgICAgIC8vIGFsbG93cyB1cyB0byBkcm9wXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ292ZXInKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAnZHJhZ2VudGVyJyxcbiAgICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdvdmVyJyk7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICdkcmFnbGVhdmUnLFxuICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ292ZXInKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApOyBcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgJ2Ryb3AnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3RvcHMgc29tZSBicm93c2VycyBmcm9tIHJlZGlyZWN0aW5nLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdvdmVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJpbklkID0gdGhpcy5pZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCdUZXh0JykpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnSXRlbSBub3cgaXM6JytpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0aGUgcGFzc2VkIGRyb3AgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBzY29wZS5kcm9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCd1bmRlZmluZWQnICE9PSB0eXBlb2YgZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZuKGl0ZW0uaWQsIGJpbklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9Y2F0Y2goZSl7XG4gICAgICAgICAgICAgICAgICAgICAgLy90aHJvdyBlcnJvciB0aGF0IGhhcHBlbiB3aGVuIGZpbGUgaXMgZHJvcHBlZCBpbiBpdCdzIG93biBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgIC8vZ2l2ZSBzb21lIGFsZXJ0IHRvIG5vdGlmeSB3aGF0IGhhcHBuZWRcbiAgICAgICAgICAgICAgICAgICAgICAvLyB0aHJvdyggbmV3IEVycm9yKGUpKVxuICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5lcnJvcihcIkRyb3AgRmlsZSBvbiBmb2xkZXIgdG8gbW92ZSBpdCFcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufV0pO1xuc3luYy5jb250cm9sbGVyKCdEcmFnRHJvcEN0cmwnLCBbJyRzY29wZScsJ0ZpbGVzJywnJGludGVydmFsJyxmdW5jdGlvbigkc2NvcGUsRmlsZXMsJGludGVydmFsKSB7XG5cbiAgXG4gICAgJHNjb3BlLmhhbmRsZURyb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIDEpaWYgbW92ZWQgb25seSB3aGVuIGl0IHJlYWNoIG9uIGZvbGRlciBhbGxvdyBtb3ZlXG4gICAgICAvLyAyKXRha2UgdGggaWQgb2YgZmlsZSBtb3ZlZCBhbmQgdGFrZSBpZCBvZiBmb2xkZXIgbW92ZSBmaWxlIGludG8gZm9sZGVyXG5cbiAgICAgICAvL21vdmUgdGhlIGl0ZW0gaW50byB3aGVyZSBpdCBpcyBkcm9wZWRcbiAgICAgICAvL3RoZSBmaXJzdCB0aGluZyBoZXJlIGlzIHRvIHJlY2FsY3VsYXRlIHRoZSBhcnJheSB0byBrZWVwIHRoZSBhcnJhbmdlbWVudCBpbnRhY3RcbiAgICAgICBcbiAgICAgICAgXG4gICAgfVxufV0pO1xuIiwic3luYy5jb250cm9sbGVyKCdwcmV2aWV3Q29udHJvbGxlcicsXG4gW1xuXHQnJHNjb3BlJywncGRmRGVsZWdhdGUnLCckdGltZW91dCcsJyRzdGF0ZVBhcmFtcycsJyRyb290U2NvcGUnLCckZXhjZXB0aW9uSGFuZGxlcicsJ0ZpbGVzJywgJ0ZpbGVTYXZlcicsJ0Jsb2InLGZ1bmN0aW9uIChcblx0XHQkc2NvcGUscGRmRGVsZWdhdGUsJHRpbWVvdXQsJHN0YXRlUGFyYW1zLCRyb290U2NvcGUsJGV4Y2VwdGlvbkhhbmRsZXIsRmlsZXMsRmlsZVNhdmVyLCBCbG9iKSB7XG5cbiAgICAgIC8vZ2V0IG1pbWUgdHlwZSBvZiBhbnlGaWxlIHRoYXQgY29tZXMgaW4gbXkgaG9vZCFcblxuICAgICAgXG5cbiAgICAgIGlmKCRzdGF0ZVBhcmFtcy5wcmV2aWV3ICYmICRzdGF0ZVBhcmFtcy5leHRlbnNpb24gPT0gJ3BkZicpe1xuICAgICAgICAkc2NvcGUucHJldmlld2FibGUgPSB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy9hIHVzZXIgU3RyaW1VcCBpcyBpbmplY3RlZCBpbiBiZWxsb3cgdXJsIGl0IHNob3VsZCBiZSBkeW5hbWljIGluIGZ1dHVyZSFcbiAgICAgICAgICAgICRzY29wZS5wZGZVcmwgPSAkcm9vdFNjb3BlLmVuZFBvaW50KyAnL3ByZXZpZXcvJysgJHN0YXRlUGFyYW1zLnByZXZpZXcrJy9vZi8nKydTdHJpbVVwJztcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcGRmRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCdteS1wZGYtY29udGFpbmVyJykuem9vbUluKDAuNSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgIHRocm93KCBuZXcgRXJyb3IoZSkpXG4gICAgICAgIH1cbiAgICAgIH1lbHNlIGlmKCRzdGF0ZVBhcmFtcy5wcmV2aWV3ICYmICRzdGF0ZVBhcmFtcy5leHRlbnNpb24gPT0gJ2pwZyd8fCRzdGF0ZVBhcmFtcy5leHRlbnNpb24gPT0gJ3BuZycpe1xuICAgICAgICAkc2NvcGUuZmlsZV9uYW1lID0gJHN0YXRlUGFyYW1zLnByZXZpZXc7XG4gICAgICAgICRzY29wZS5wcmV2aWV3YWJsZSA9IGZhbHNlO1xuICAgICAgICAvL2FzIGJ5IG5vdyBpbWFnZXMgYXJlIG5vdCByZWFkeSB0byBiZSBwcmV2aWV3ZWQgc28gc2V0IGl0IHRvIGZhbHNlIXByb3ZpZGUgb25seSBvcHRpb24gdG8gZG93bmxvYWQgdGhlbSFcbiAgICAgICAgICAvLyAkc2NvcGUucHJldmlld2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAvLyBGaWxlcy5zaW5nbGUoJHN0YXRlUGFyYW1zLnByZXZpZXcpXG4gICAgICAgICAgLy8gLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIC8vICAgJHNjb3BlLmltYWdlUHJldmlldyA9IHJlc3BvbnNlO1xuICAgICAgICAgIC8vIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgLy8gfSk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIC8vc2VuZCBhIGZpbGVuYW1lIHRvIGEgZG93bmxvYWQgYnV0dG9uXG4gICAgICAgICRzY29wZS5maWxlX25hbWUgPSAkc3RhdGVQYXJhbXMucHJldmlldztcbiAgICAgICAgJHNjb3BlLnByZXZpZXdhYmxlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAkc2NvcGUuaW5jcmVtZW50ID0gMTtcbiAgICAgICAgICBwZGZEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ215LXBkZi1jb250YWluZXInKS5uZXh0KCRzY29wZS5pbmNyZW1lbnQrMSk7XG4gICAgICB9O1xuICAgICAgLy90aGlzIG9wdGlvbiBkb3duIGhlcmUgb2YgZG93bmxvYWRpbmcgYSBmaWxlIHdhcyBuaWNlIGJ1dCBzdGlsbCBoYXZlIHNvbWUgZHJvd2JhY2tcblxuICAgICAgLy8gJHNjb3BlLmRvd25sb2FkID0gZnVuY3Rpb24oZmlsZV9uYW1lKXtcblxuICAgICAgLy8gICBGaWxlcy5kb3dubG9hZEZpbGUoZmlsZV9uYW1lKVxuICAgICAgLy8gICAudGhlbihmdW5jdGlvbihmaWxlX3dyaXRlbil7XG4gICAgICAgICAgICBcbiAgICAgIC8vICAgICBGaWxlcy5nZXRNaW1lVHlwZSgkc3RhdGVQYXJhbXMucHJldmlldylcbiAgICAgIC8vICAgICAgIC50aGVuKGZ1bmN0aW9uKG1pbWVUeXBlKXtcblxuICAgICAgLy8gICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtmaWxlX3dyaXRlbl0sIHtcbiAgICAgIC8vICAgICAgICAgICAgIHR5cGU6IG1pbWVUeXBlLFxuICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgIC8vICAgICAgICAgRmlsZVNhdmVyLnNhdmVBcyhibG9iLCAkc3RhdGVQYXJhbXMucHJldmlldyk7XG5cbiAgICAgIC8vICAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIC8vICAgICAgIH0pO1xuXG4gICAgICAgICAgXG5cbiAgICAgIC8vICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAvLyAgIH0pO1xuICAgICAgLy8gfTtcbiAgICAgICRzY29wZS5nb1ByZXYgPSBmdW5jdGlvbihwYWdlKXtcbiAgICAgICAgICBwZGZEZWxlZ2F0ZS4kZ2V0QnlIYW5kbGUoJ215LXBkZi1jb250YWluZXInKS5wcmV2KCRzY29wZS5pbmNyZW1lbnQtMSk7XG4gICAgICB9O1xufV0pO1xuXG5zeW5jLmRpcmVjdGl2ZSgnZmlsZURvd25sb2FkJywgW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1uZy1jbGljaz1cImRvd25sb2FkKClcIj48c3BhbiBjbGFzcz1cIlwiPjwvc3Bhbj5Eb3dubG9hZDwvYnV0dG9uPicsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHByZXBhcmUodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRpYWxvZ3Mud2FpdChcIlBsZWFzZSB3YWl0XCIsIFwiWW91ciBkb3dubG9hZCBzdGFydHMgaW4gYSBmZXcgc2Vjb25kcy5cIiwgJHNjb3BlLnByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgZmFrZVByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3ModXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnZGlhbG9ncy53YWl0LmNvbXBsZXRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGVycm9yKHJlc3BvbnNlLCB1cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlhbG9ncy5lcnJvcihcIkNvdWxkbid0IHByb2Nlc3MgeW91ciBkb3dubG9hZCFcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZmFrZVByb2dyZXNzKCkge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnByb2dyZXNzIDwgOTUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgKz0gKDk2IC0gJHNjb3BlLnByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdkaWFsb2dzLndhaXQucHJvZ3Jlc3MnLCB7ICdwcm9ncmVzcyc6ICRzY29wZS5wcm9ncmVzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlUHJvZ3Jlc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkc2NvcGUuZG93bmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICQuZmlsZURvd25sb2FkKCdodHRwOi8vc3luY21lLmNvbTo4MDAwL2FwaS92MS9maWxlcy9kb3dubG9hZC9waHB4Rm5saGVEVkU1ajVtY1ZEWC5wbmcvb2YvU3RyaW1VcD9hY2Nlc3NfdG9rZW49QmM3RFdTN0tLUkx0eG1kZFVaSTFUMWxadTJKMVloUjhPTFhHV05abicsIHsgcHJlcGFyZUNhbGxiYWNrOiBwcmVwYXJlLCBzdWNjZXNzQ2FsbGJhY2s6IHN1Y2Nlc3MsIGZhaWxDYWxsYmFjazogZXJyb3IgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV1cbiAgICAgICAgfVxufV0pO1xuIiwiLyogZ2xvYmFsIHN5bmMgKi9cblwidXNlIHN0cmljdFwiO1xuc3luYy5jb250cm9sbGVyKCdQZW9wbGVDb250cm9sbGVyJywgWyckc2NvcGUnLCdQZW9wbGUnLGZ1bmN0aW9uICgkc2NvcGUsIFBlb3BsZSkge1xuXHRcdCRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcblx0XHRcdCRzY29wZS5nZXRQZW9wbGVUb0ZvbGxvdygpO1xuXHRcdH1cblx0XHQkc2NvcGUuZ2V0UGVvcGxlVG9Gb2xsb3cgID0gZnVuY3Rpb24oKXtcblx0XHRcdFBlb3BsZS5nZXQoKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcblx0XHRcdFx0JHNjb3BlLnBlb3BsZSA9IHJlc3BvbnNlO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3Ipe1xuXG5cdFx0XHR9KVxuXHRcdH1cblx0XHQkc2NvcGUuJG9uKCdmb2xsb3dNZW1iZXInLGZ1bmN0aW9uKGV2ZW50LHBhcmFtcyl7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0UGVvcGxlLmZvbGxvdyhwYXJhbXMpXG5cdFx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHQkc2NvcGUuZ2V0UGVvcGxlVG9Gb2xsb3coKTtcblx0XHRcdH0sZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHR9KVxuXHRcdH0pO1xuXHRcdCRzY29wZS5mb2xsb3cgPSBmdW5jdGlvbihpZCl7XG5cdFx0XHR2YXIgZm9sbG93ID17aWQ6IGlkLCBvcHRpb246J2FkZFBlb3BsZSd9O1xuXHRcdFx0JHNjb3BlLiRlbWl0KFwiZm9sbG93TWVtYmVyXCIsIGZvbGxvdyk7XG5cdFx0fVxuXHRcdCRzY29wZS5pbml0KCk7XG59XSk7XG4iLCIvKiBnbG9iYWwgRmlsZXMgKi9cbi8qIGdsb2JhbCBzeW5jICovXG4vKiBnbG9iYWwgJHNjb3BlICovXG4vKiBnbG9iYWwgYW5ndWxhciAqL1xuLypBdXRob3IgTXVyYWdpamltYW5hIEZvdW5kZXIgJiBDRU8gb2Ygc3luYyBjYWxsIGhpbSBvbiBTdHJpbVVwQGdtYWlsLmNvbSovXG5cbnN5bmMuc2VydmljZSgnR3JvdXAnLCBbXG5cdCckaHR0cCcsXG5cdCckcm9vdFNjb3BlJyxcblx0JyRxJyxmdW5jdGlvbiBHcm91cCAoXG5cdFx0JGh0dHAsXG5cdFx0JHJvb3RTY29wZSxcblx0XHQkcSkge1xuXHR0aGlzLmNyZWF0ZSBcdFx0PVx0ZnVuY3Rpb24obmFtZSl7XG5cdFx0dmFyIGRpZmZlcmVkIFx0PVx0JHEuZGVmZXIoKTtcblx0XHQkaHR0cC5wb3N0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMnLCBuYW1lKVxuXHRcdC5zdWNjZXNzKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdH0pXG5cdFx0LmVycm9yKGZ1bmN0aW9uKGVycm9yKSB7XG5cdFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuXHRcdH0pXG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH1cblx0dGhpcy5kZWxldGUgXHRcdD1cdGZ1bmN0aW9uKGlkKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXHRcdCRodHRwLmRlbGV0ZSgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzLycraWQpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXHR0aGlzLm15R3JvdXBzXHRcdD1cdGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGRpZmZlcmVkIFx0PVx0JHEuZGVmZXIoKTtcblxuXHRcdCRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzJylcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0Y29uc29sZS5sb2coJ2RpZmZlcmVkIHNsb3c6JyArIGVycm9yKTtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuXG5cdHRoaXMuYWRkUGVvcGxlIFx0PVx0ZnVuY3Rpb24obWVtYmVyKXtcblx0XHR2YXIgZGlmZmVyZWQgXHQ9XHQkcS5kZWZlcigpO1xuXHRcdCRodHRwLnB1dCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvbWUvZ3JvdXBzLycrSlNPTi5zdHJpbmdpZnkobWVtYmVyKSlcblx0XHQuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnJvcikge1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fTtcblx0dGhpcy5hZGRGaWxlVG9Hcm91cCA9IGZ1bmN0aW9uKGZpbGVPYmope1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucHV0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9tZS9ncm91cHMvJysgSlNPTi5zdHJpbmdpZnkoZmlsZU9iaikpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyKXtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuXHRcdH0pXG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH1cblx0dGhpcy5yZW1vdmVQZW9wbGUgXHQ9XHRmdW5jdGlvbihtZW1iZXIpe1xuXHRcdHZhciBkaWZmZXJlZCBcdD1cdCRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucHV0KCRyb290U2NvcGUuZW5kUG9pbnQgKycvYXBpL3YxL21lL2dyb3Vwcy8nK0pTT04uc3RyaW5naWZ5KG1lbWJlcikpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0ZGlmZmVyZWQucmVzb2x2ZShyZXNwb25zZSk7XG5cdFx0fSlcblx0XHQuZXJyb3IoZnVuY3Rpb24oZXJyb3IpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnJvcik7XG5cdFx0fSlcblx0XHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcblx0fVxuICB0aGlzLnN1Z2dlc3RQZW9wbGUgPSBmdW5jdGlvbihpZCl7XG5cbiAgICBcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgXHQkaHR0cC5nZXQoJHJvb3RTY29wZS5lbmRQb2ludCArICcvYXBpL3YxL21lL2dyb3Vwcy8nICsgaWQpXG4gICAgXHQuc3VjY2VzcyhmdW5jdGlvbihyZXMpe1xuICAgIFx0XHRkaWZmZXJlZC5yZXNvbHZlKHJlcyk7XG4gICAgXHR9KVxuICAgIFx0LmVycm9yKGZ1bmN0aW9uKGVycikge1xuICAgIFx0XHRkaWZmZXJlZC5yZWplY3QoZXJyKTtcbiAgICBcdH0pXG4gICAgXHRyZXR1cm4gZGlmZmVyZWQucHJvbWlzZTtcbiAgICB9XG5cdHJldHVybiB0aGlzO1xufV0pO1xuXG5zeW5jLmNvbnRyb2xsZXIoJ0dyb3VwQ29udHJvbGxlcicsIFtcblx0JyRzY29wZScsXG5cdCdHcm91cCcsXG5cdCdVc2VyJyxcblx0J0ZpbGVzJyxcblx0J3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsXG5cdGZ1bmN0aW9uIEdyb3VwQ29udHJvbGxlciAoXG5cdFx0JHNjb3BlLFxuXHRcdEdyb3VwLFxuXHRcdFVzZXIsXG5cdFx0RmlsZXMsXG5cdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uXG5cdCkge1xuXHQkc2NvcGUuaW5pdCBcdD1cdGZ1bmN0aW9uKCl7XG5cdFx0JHNjb3BlLm15R3JvdXBzKCk7XG5cblx0XHQkc2NvcGUuc3VnZ2VzdGVkUGVvcGxlVG9Hcm91cCgpOy8vb2ZjYXVzZSB0aGV5IGFyZSBhcmxlYWR5IHlvdXIgZnJpZW5kIGJ1dCBub3QgcGFydGljaXBhbnQgaW4geW91ciBzdHVmZiB3b3JrIVxuXHR9XG5cdCRzY29wZS51c2VySWQgXHRcdFx0XHQ9XHRmdW5jdGlvbigpe1xuXHRcdFVzZXIuX2lkKClcblx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHQkc2NvcGUudXNlcklkIFx0PVx0cmVzcG9uc2U7XG5cdFx0fSwgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH0pO1xuXHR9O1xuXHQkc2NvcGUubXlHcm91cHMgXHRcdFx0PVx0ZnVuY3Rpb24oKXtcblx0XHRHcm91cC5teUdyb3VwcygpXG5cdFx0LnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0JHNjb3BlLmdyb3VwIFx0PSByZXNwb25zZTtcblx0XHR9LCBmdW5jdGlvbihlcnJvcil7XG5cdFx0fSk7XG5cdH07XG5cdCRzY29wZS5zdWdnZXN0ZWRQZW9wbGVUb0dyb3VwIFx0PVx0ZnVuY3Rpb24oaWQpe1xuXHRcdC8vY2xlYXJpbmcgYWxsIHZpZXcgcmVuZGVyZWQgYmVmb3JlXG5cdFx0JHNjb3BlLnNob3dGaWxlcz1mYWxzZTtcblx0XHQkc2NvcGUuc2hvd0dyb3VwPWZhbHNlO1xuXHRcdCRzY29wZS5zaG93Qm94PWZhbHNlO1xuXHRcdGlmKCFhbmd1bGFyLmlzVW5kZWZpbmVkKGlkKSl7XG5cdFx0XHRHcm91cC5zdWdnZXN0UGVvcGxlKGlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHQkc2NvcGUuZm9sbG93ZXJzID0gcmVzcG9uc2U7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcil7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0JHNjb3BlLiRvbigncmVmcmVzaEdyb3VwJyxmdW5jdGlvbigpe1xuICAgICAgICRzY29wZS5pbml0KCk7XG4gIFx0fSk7XG5cdCRzY29wZS4kb24oJ2dyb3VwRGVsZXRlZCcsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JHNjb3BlLm15R3JvdXBzKCk7XG5cdH0pO1xuXHQkc2NvcGUuJG9uKCdncm91cFRvYmluZHdpdGgnLCBmdW5jdGlvbiAoZXZlbnQsIGdyb3VwaWQpIHtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkc2NvcGUuZW1pdHRlZCA9Z3JvdXBpZDtcbiAgICAgICAgaWYoICRzY29wZS5zaG93RmlsZXMgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAkc2NvcGUuc2hvd0ZpbGVzPWZhbHNlO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5zdWdnZXN0ZWRQZW9wbGVUb0dyb3VwKGdyb3VwaWQpO1xuICAgICAgICAkc2NvcGUuYWRkUGVvcGxlPXRydWU7XG5cdH0pO1xuXHQkc2NvcGUuZ2V0R3JvdXBGaWxlcyA9IGZ1bmN0aW9uKG93bmVyKXtcbiAgICBGaWxlcy5nZXRHcm91cEZpbGVzKG93bmVyKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHRyZWUpe1xuXHRcdFx0JHNjb3BlLmZpbGVzID0gdHJlZTtcblx0XHRcdFx0Ly9uYXZpZ2F0ZSB0cm91Z2ggdHJlZSByZXNwb25zZSB3aGljaCBpcyByZXF1aXJlIG11Y2ggYXR0ZW50aW9uXG5cdFx0XHRcdCRzY29wZS5ncm91cHM9W107XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2dyb3VwcycpICYmIHRyZWVbaV1bJ2dyb3VwcyddKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmdyb3Vwcy5wdXNoKHRyZWVbaV0uZnJpZW5kcyk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRyZWVbaV0uaGFzT3duUHJvcGVydHkoJ2dyb3VwcycpKSB7XG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLmdyb3VwcyA9IGdyb3Vwcy5jb25jYXQodHJhdmVyc2UodHJlZVtpXS5ncm91cHMpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHR9KTtcbiAgfTtcblx0JHNjb3BlLmdldEJveEZpbGVzID0gZnVuY3Rpb24oZ3JvdXBJZCl7XG5cdFx0JHNjb3BlLmVtaXR0ZWQgPWdyb3VwSWQ7XG4gIFx0RmlsZXMuZ2V0Qm94RmlsZXMoZ3JvdXBJZClcblx0XHQudGhlbihmdW5jdGlvbih0cmVlKXtcblx0XHRcdCRzY29wZS5maWxlcyA9IHRyZWU7XG5cdFx0XHRcdC8vbmF2aWdhdGUgdHJvdWdoIHRyZWUgcmVzcG9uc2Ugd2hpY2ggaXMgcmVxdWlyZSBtdWNoIGF0dGVudGlvblxuXHRcdFx0XHQkc2NvcGUuZ3JvdXBzPVtdO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRyZWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICh0cmVlW2ldLmhhc093blByb3BlcnR5KCdncm91cHMnKSAmJiB0cmVlW2ldWydncm91cHMnXSkge1xuXHRcdFx0XHRcdFx0XHRcdCRzY29wZS5ncm91cHMucHVzaCh0cmVlW2ldLmZyaWVuZHMpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0cmVlW2ldLmhhc093blByb3BlcnR5KCdncm91cHMnKSkge1xuXHRcdFx0XHQgICAgICAgICAgICAkc2NvcGUuZ3JvdXBzID0gZ3JvdXBzLmNvbmNhdCh0cmF2ZXJzZSh0cmVlW2ldLmdyb3VwcykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSwgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdH0pO1xuICB9O1xuJHNjb3BlLiRvbignc2hvd09wdGlvbnMnLGZ1bmN0aW9uKF8scGFyYW1zKXtcbiAgICAgaWYocGFyYW1zLm93bmVyID09PVwiYm94XCIpe1xuXHRcdFx0ICRzY29wZS5hZGRQZW9wbGU9ZmFsc2U7XG5cdFx0XHQgJHNjb3BlLnNob3dHcm91cD1mYWxzZTtcbiAgICAgICAkc2NvcGUuc2hvd0JveD10cnVlO1xuICAgICAgIGlmKCAkc2NvcGUuYWRkUGVvcGxlID09IHRydWUpe1xuICAgICAgICAgICAkc2NvcGUuYWRkUGVvcGxlPWZhbHNlO1xuICAgICAgIH1cblx0XHRcdCAvL3NldCBmaWxlcyBzY29wZSB0byBzaG93IGZpbGVzIG9mIGJveCBmaWxlcyBpcyByZXBlYXRlZCBpbiB2aWV3IGRpcmVjdGl2ZVxuICAgICAgICRzY29wZS5nZXRCb3hGaWxlcyAocGFyYW1zLmdyb3VwX2lkKTtcblx0XHQgfWVsc2UgaWYgKHBhcmFtcy5vd25lciA9PT0gXCJncm91cFwiKSB7XG5cdFx0XHQgJHNjb3BlLnNob3dCb3g9ZmFsc2U7XG5cdFx0XHQgJHNjb3BlLmFkZFBlb3BsZT1mYWxzZTtcblx0XHRcdCAkc2NvcGUuc2hvd0dyb3VwPXRydWU7XG5cdFx0XHQgaWYoICRzY29wZS5hZGRQZW9wbGUgPT0gdHJ1ZSl7XG5cdFx0XHRcdFx0ICRzY29wZS5hZGRQZW9wbGU9ZmFsc2U7XG5cdFx0XHQgfVxuXHRcdFx0IC8vY2hhbmdlIGZpbGVzIHRvIG5ldyBzY29wZSBmaWxlcyB0byBzaG93IGZpbGVzIG9mIGdyb3VwcyAgaXMgcmVwZWF0ZWQgaW4gdmlldyBkaXJlY3RpdmVcblx0XHRcdCAkc2NvcGUuZ2V0R3JvdXBGaWxlcyAocGFyYW1zLmdyb3VwX2lkKTtcblx0XHQgfVxufSk7XG4kc2NvcGUuaW5pdCgpO1xufV0pO1xuc3luYy5kaXJlY3RpdmUoJ215R3JvdXBzJywgW1xuXHQnR3JvdXAnLFxuXHQnUmVwb3J0Jyxcblx0J3VzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbicsXG5cdGZ1bmN0aW9uIG15R3JvdXBzIChcblx0XHRHcm91cCxcblx0XHRSZXBvcnQsXG5cdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLFxuXHRcdE5vdGlmaWNhdGlvbikge1xuXHRyZXR1cm4ge1xuXHRcdHByaW9yaXR5OiAxMCxcblx0XHR0ZW1wbGF0ZVVybDogJ0FwcC9zY3JpcHRzL2pzL2RpcmVjdGl2ZXMvZ3JvdXBzLmh0bWwnLFxuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdCAgaWQ6ICc9dXNlcklkJyxcbiAgICAgICAgICBncm91cHM6ICc9JyxcbiAgICAgICAgICBmb2xsb3dlcnM6ICc9JyxcbiAgICAgICAgICBlbWl0dGVkOic9JyxcbiAgICAgICAgICBzaG93UGVvcGxlOic9JyxcbiAgICAgICAgICBzaG93R3JvdXAgICA6ICAnPScsXG4gICAgICAgICAgZmlsZXMgICA6ICAnPScsXG5cdCAgXHRcdFx0c2hvd0JveDogICc9J1xuXHRcdH0sXG5cdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzKSB7XG5cdFx0XHRzY29wZS5kZWxldGVHcm91cCA9IGZ1bmN0aW9uKGlkKXtcblx0XHRcdFx0R3JvdXAuZGVsZXRlKGlkKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXMpe1xuXHRcdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLmluZm8oXCJHcm91cCBkZWxldGVkXCIpO1xuXHRcdFx0XHRcdCBcdHNjb3BlLiRlbWl0KFwiZ3JvdXBEZWxldGVkXCIsICdncm91cCBkZWxldGVkJyk7XG5cdFx0XHRcdH0sIGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdFx0UmVwb3J0LnNlbmQoJ2RlbGV0ZSBncm91cCBlcnJvcjonK2Vycilcblx0XHRcdFx0XHQudGhlbihmdW5jdGlvbigpe30sIGZ1bmN0aW9uKCl7fSk7XG5cdFx0XHRcdH0pXG5cdFx0XHR9O1xuICAgICAgc2NvcGUuY3JlYXRlR3JvdXBcdD1cdGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgICAgIEdyb3VwLmNyZWF0ZShuYW1lKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiQ3JlYXRlZCBuZXcgR3JvdXBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGVtaXQoJ3JlZnJlc2hHcm91cCcsbnVsbCk7XG4gICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH07XG5cdFx0XHRzY29wZS5pbml0QWRkUGVvcGxlID0gZnVuY3Rpb24oZ3JvdXBpZCl7XG5cdFx0XHRcdHNjb3BlLiRlbWl0KFwiZ3JvdXBUb2JpbmR3aXRoXCIsIGdyb3VwaWQpO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuYWRkUGVvcGxlID0gZnVuY3Rpb24ocGFyYW1zKXtcblx0XHRcdFx0dmFyIG5ld1BhcmFtcyA9e1xuXHRcdFx0XHRcdCdvcHRpb24nOidhZGRNZW1iZXInLFxuXHRcdFx0XHRcdCd1c2VySWQnOnBhcmFtcy51c2VySWQsXG5cdFx0XHRcdFx0J2dyb3VwSWQnOnBhcmFtcy5ncm91cElkXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoYW5ndWxhci5pc1VuZGVmaW5lZChwYXJhbXMpKXtcblx0XHRcdFx0XHQvL3dvbid0IGhhcHBlbiFvciBpZiB0aSBoYXBwZW4gd2UgcXVpdFxuXHRcdFx0XHR9ZWxzZXtcblxuXHRcdFx0XHRcdEdyb3VwLmFkZFBlb3BsZShuZXdQYXJhbXMpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcblx0XHRcdFx0XHRcdC8vcmVmcmVzaCBncm91cCB3aXRoIG5ldyBtZW1iZXIgc3RhdHVzXG5cdFx0XHRcdFx0XHRcdHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiQWRkZWQgTWVtYmVyIGluIGdyb3VwLlwiKTtcbiAgICAgICAgICAgICAgc2NvcGUuaW5pdEFkZFBlb3BsZShwYXJhbXMuZ3JvdXBJZCk7XG4gICAgICAgICAgICAgIHNjb3BlLiRlbWl0KCdyZWZyZXNoR3JvdXAnLCcnKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnJvcixzdGF0dXMpe1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHNjb3BlLnJlbW92ZVBlb3BsZSA9IGZ1bmN0aW9uKHBhcmFtcyl7XG5cblx0XHRcdFx0dmFyIG5ld1BhcmFtcyA9e1xuXHRcdFx0XHRcdCdvcHRpb24nOidyZW1vdmVNZW1iZXInLFxuXHRcdFx0XHRcdCd1c2VySWQnOnBhcmFtcy51c2VySWQsXG5cdFx0XHRcdFx0J2dyb3VwSWQnOnBhcmFtcy5ncm91cElkXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihhbmd1bGFyLmlzVW5kZWZpbmVkKHBhcmFtcykpe1xuXHRcdFx0XHRcdC8vd29uJ3QgaGFwcGVuIW9yIGlmIHRpIGhhcHBlbiB3ZSBxdWl0IHRvbyBiYWQgaGllcmFjaHkhXG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRHcm91cC5yZW1vdmVQZW9wbGUobmV3UGFyYW1zKVxuXHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG5cdFx0XHRcdFx0XHRcdHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5pbmZvKFwiUmVtb3ZlZCBNZW1iZXIgaW4gZ3JvdXAuXCIpO1xuXHQgICAgICAgICAgICBzY29wZS5pbml0QWRkUGVvcGxlKHBhcmFtcy5ncm91cElkKTtcblx0ICAgICAgICAgICAgc2NvcGUuJGVtaXQoJ3JlZnJlc2hHcm91cCcsJycpO1xuICAgICAgICAgICAgXHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKGVycm9yLHN0YXR1cyl7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHNjb3BlLnJlbW92ZUZyb21Hcm91cCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCd3ZSBjYW4gcmVtb3ZlIGZpbGUgaW4gZ3JvdXAnKTtcblx0XHRcdH1cblx0XHRcdHNjb3BlLmFkZEZpbGVUb0dyb3VwID0gZnVuY3Rpb24ocGFyYW1zKXtcblx0XHRcdFx0dmFyIGZpbGVPYmogPXtcblx0XHRcdFx0XHQnb3B0aW9uJzonYWRkRmlsZXMnLFxuXHRcdFx0XHRcdCdmaWxlSWQnOnBhcmFtcy5maWxlSWQsXG5cdFx0XHRcdFx0J2dyb3VwSWQnOnBhcmFtcy5ncm91cElkXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRHcm91cC5hZGRGaWxlVG9Hcm91cChmaWxlT2JqKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXHRcdFx0XHRcdC8vIHVzZXJJbnRlcmFjdGlvbk5vdGlmaWNhdGlvbi5zdWNjZXNzKFwiQSBmaWxlIGlzIGFkZGVkIGluIGdyb3VwXCIpO1xuXHRcdFx0XHR9LGZ1bmN0aW9uKGVycil7XG5cdFx0XHRcdFx0dXNlckludGVyYWN0aW9uTm90aWZpY2F0aW9uLndhcm4oXCJTb21lIGVycm9yIG9jY3VyZWQgZHVyaW5nIGFkZGluZyBmaWxlXCIpO1xuXHRcdFx0XHR9KVxuXG5cdFx0XHR9XG5cdFx0XHRzY29wZS5maWxlc0luQm94ID0gZnVuY3Rpb24oZ3JvdXBpZCl7XG5cdFx0XHRcdHZhciBwYXJhbXMgPXsnZ3JvdXBfaWQnOmdyb3VwaWQsJ293bmVyJzonYm94J307XG5cdFx0XHRcdHNjb3BlLiRlbWl0KCdzaG93T3B0aW9ucycscGFyYW1zKTtcblxuXHRcdFx0fVxuXHRcdFx0c2NvcGUuZmlsZXNJbkdyb3VwID0gZnVuY3Rpb24oZ3JvdXBpZCl7XG5cblx0XHRcdFx0dmFyIHBhcmFtcyA9eydncm91cF9pZCc6Z3JvdXBpZCwnb3duZXInOidncm91cCd9O1xuXHRcdFx0XHRzY29wZS4kZW1pdCgnc2hvd09wdGlvbnMnLHBhcmFtcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufV0pO1xuXG5zeW5jLnNlcnZpY2UoJ1JlcG9ydCcsIFtmdW5jdGlvbiBSZXBvcnQgKCRodHRwLCRxLCRyb290U2NvcGUpIHtcblx0dGhpcy5zZW5kID0gZnVuY3Rpb24oaXNzdWUpe1xuXHRcdHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0JGh0dHAucG9zdCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvaXNzdWVzJywgaXNzdWUpXG5cdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKXtcblx0XHRcdGRpZmZlcmVkLnJlc29sdmUocmVzKTtcblx0XHR9KVxuXHRcdC5lcnJvcihmdW5jdGlvbihlcnIpIHtcblx0XHRcdGRpZmZlcmVkLnJlamVjdChlcnIpO1xuXHRcdH0pXG5cdFx0cmV0dXJuIGRpZmZlcmVkLnByb21pc2U7XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59XSk7XG4iLCIvKiBnbG9iYWwgc3luYyAqL1xuc3luYy5zZXJ2aWNlKCdTZXR0aW5ncycsIFsnJGh0dHAnLCckcm9vdFNjb3BlJywnJHEnLGZ1bmN0aW9uICgkaHR0cCwkcm9vdFNjb3BlLCRxKSB7XG5cdHRoaXMuY3VycmVudCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBkaWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvc2V0dGluZ3MnKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihyZXNwKXtcbiAgICAgICAgICAgIGRpZmZlcmVkLnJlc29sdmUocmVzcCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgZGlmZmVyZWQucmVqZWN0KGVycik7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBkaWZmZXJlZC5wcm9taXNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn1dKTtcblxuc3luYy5jb250cm9sbGVyKCdTZXR0aW5nc0NvbnRyb2xsZXInLCBbJyRzY29wZScsJ1NldHRpbmdzJywnJGxvZycsIGZ1bmN0aW9uICgkc2NvcGUsU2V0dGluZ3MsJGxvZykge1xuXHQkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5sb2FkQ3VycmVudFNldHRpbmdzKCk7XG4gICAgfVxuICAgICAkc2NvcGUubG9hZEN1cnJlbnRTZXR0aW5ncyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICBTZXR0aW5ncy5jdXJyZW50KCkudGhlbihmdW5jdGlvbihyZXNwKXtcbiAgICAgICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSByZXNwO1xuICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAkbG9nLmluZm8oJ2VycnJvciBwcmV2ZW50IHByb21pc2UgdG8gYmUgZnVsbGZpbGwnKTtcbiAgICAgICAgIH0pO1xuICAgICB9XG4gICAgICRzY29wZS5pbml0KCk7XG59XSk7XG4iLCIvKiBnbG9iYWwgc3luYyAqL1xuc3luYy5jb250cm9sbGVyKCdTaGFyZUNvbnRyb2xsZXInLCBbXG5cdCckc2NvcGUnLFxuXHQnJHJvb3RTY29wZScsXG5cdCckcm91dGVQYXJhbXMnLFxuXHQnJHJvdXRlJyxcblx0JyRsb2cnLFxuXHQnJHVpYk1vZGFsJyxcblx0J1NoYXJlJyxcblx0J1VzZXInLFxuXHRmdW5jdGlvbiAoXG5cdFx0JHNjb3BlLFxuXHRcdCRyb290U2NvcGUsXG5cdFx0JHJvdXRlUGFyYW1zLFxuXHRcdCRyb3V0ZSxcblx0XHQkbG9nLFxuXHRcdCR1aWJNb2RhbCxcblx0XHRTaGFyZSxcblx0XHRVc2VyXG5cdCkgXG57XG5cblx0JHNjb3BlLnNoYXJlID0gZnVuY3Rpb24oZmlsZV9pZCl7XG5cdFx0Ly8gYWxlcnQoJ2hlcmUnKTtcblx0XHRjb25zb2xlLmxvZyhmaWxlX2lkKTtcblx0fTtcbn1cbl0pO1xuIiwiLyogZ2xvYmFsIHN5bmMgKi9cbi8qIGdsb2JhbCBhbmd1bGFyICovXG4ndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXJcblxuICAgIHN5bmMuY29udHJvbGxlcignVXBsb2FkQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0ZpbGVVcGxvYWRlcicsJyRyb290U2NvcGUnLCdGaWxlcycsIGZ1bmN0aW9uKCRzY29wZSwgRmlsZVVwbG9hZGVyLCRyb290U2NvcGUsRmlsZXMpIHtcbiAgICAgICAgdmFyIHVwbG9hZGVyID0gJHNjb3BlLnVwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcih7XG4gICAgICAgICAgICB1cmw6ICRyb290U2NvcGUuZW5kUG9pbnQrJy9hcGkvdjEvdXBsb2FkJ1xuICAgICAgICB9KTtcbiAgICAgICAgLy9GSUxURVJTXG4gICAgICAgIHVwbG9hZGVyLmZpbHRlcnMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiAnY3VzdG9tRmlsdGVyJyxcbiAgICAgICAgICAgIGZuOiBmdW5jdGlvbihpdGVtIC8qe0ZpbGV8RmlsZUxpa2VPYmplY3R9Ki8sIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5xdWV1ZS5sZW5ndGggPCAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vQ0FMTEJBQ0tTXG4gICAgICAgIHVwbG9hZGVyLm9uV2hlbkFkZGluZ0ZpbGVGYWlsZWQgPSBmdW5jdGlvbihpdGVtIC8qe0ZpbGV8RmlsZUxpa2VPYmplY3R9Ki8sIGZpbHRlciwgb3B0aW9ucykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdvbldoZW5BZGRpbmdGaWxlRmFpbGVkJywgaXRlbSwgZmlsdGVyLCBvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25BZnRlckFkZGluZ0ZpbGUgPSBmdW5jdGlvbihmaWxlSXRlbSkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdvbkFmdGVyQWRkaW5nRmlsZScsIGZpbGVJdGVtKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25BZnRlckFkZGluZ0FsbCA9IGZ1bmN0aW9uKGFkZGVkRmlsZUl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uQWZ0ZXJBZGRpbmdBbGwnLCBhZGRlZEZpbGVJdGVtcyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uQmVmb3JlVXBsb2FkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25CZWZvcmVVcGxvYWRJdGVtJywgaXRlbSk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uUHJvZ3Jlc3NJdGVtID0gZnVuY3Rpb24oZmlsZUl0ZW0sIHByb2dyZXNzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uUHJvZ3Jlc3NJdGVtJywgZmlsZUl0ZW0sIHByb2dyZXNzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdXBsb2FkZXIub25Qcm9ncmVzc0FsbCA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uUHJvZ3Jlc3NBbGwnLCBwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uU3VjY2Vzc0l0ZW0gPSBmdW5jdGlvbihmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdvblN1Y2Nlc3NJdGVtJywgZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkVycm9ySXRlbSA9IGZ1bmN0aW9uKGZpbGVJdGVtLCByZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uRXJyb3JJdGVtJywgZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpO1xuICAgICAgICB9O1xuICAgICAgICB1cGxvYWRlci5vbkNhbmNlbEl0ZW0gPSBmdW5jdGlvbihmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycykge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdvbkNhbmNlbEl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uQ29tcGxldGVJdGVtID0gZnVuY3Rpb24oZmlsZUl0ZW0sIHJlc3BvbnNlLCBzdGF0dXMsIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnb25Db21wbGV0ZUl0ZW0nLCBmaWxlSXRlbSwgcmVzcG9uc2UsIHN0YXR1cywgaGVhZGVycyk7XG4gICAgICAgIH07XG4gICAgICAgIHVwbG9hZGVyLm9uQ29tcGxldGVBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBGaWxlcy5nZXRCb3hGaWxlcygpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAkc2NvcGUuZmlsZXMgXHQ9XHRyZXM7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YUxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ29uQ29tcGxldGVBbGwnKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5pbmZvKCd1cGxvYWRlcicsIHVwbG9hZGVyKTtcbiAgICB9XSk7XG4iLCJzeW5jLnNlcnZpY2UoJ3VybFNob3J0ZW5lcicsW2Z1bmN0aW9uKCl7XG4gIHRoaXMubWFrZVNob3J0ID0gZnVuY3Rpb24obG9uZ1VybCl7XG4gICAgcmV0dXJuIGxvbmdVcmw7XG4gIH07XG4gIC8vIHRoaXMubWFrZVNob3J0ID0gZnVuY3Rpb24obG9uZ1VybClcbiAgLy8ge1xuICAvLyAgIC8vICB2YXIgbG9uZ1VybD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvbmd1cmxcIikudmFsdWU7XG4gIC8vICAgICB2YXIgcmVxdWVzdCA9IGdhcGkuY2xpZW50LnVybHNob3J0ZW5lci51cmwuaW5zZXJ0KHtcbiAgLy8gICAgICdyZXNvdXJjZSc6IHtcbiAgLy8gICAgICAgJ2xvbmdVcmwnOiBsb25nVXJsXG4gIC8vIFx0fVxuICAvLyAgICAgfSk7XG4gIC8vICAgICByZXF1ZXN0LmV4ZWN1dGUoZnVuY3Rpb24ocmVzcG9uc2UpXG4gIC8vIFx0e1xuICAvL1xuICAvLyBcdFx0aWYocmVzcG9uc2UuaWQgIT0gbnVsbClcbiAgLy8gXHRcdHtcbiAgLy8gXHRcdFx0c3RyID1cIjxiPkxvbmcgVVJMOjwvYj5cIitsb25nVXJsK1wiPGJyPlwiO1xuICAvLyBcdFx0XHRzdHIgKz1cIjxiPnlvdXIgRmlsZSBpczo8L2I+IDxhIGhyZWY9J1wiK3Jlc3BvbnNlLmlkK1wiJz5cIityZXNwb25zZS5pZCtcIjwvYT48YnI+XCI7XG4gIC8vIFx0XHRcdHJldHVybiBzdHI7XG4gIC8vIFx0XHR9XG4gIC8vIFx0XHRlbHNlXG4gIC8vIFx0XHR7XG4gIC8vIFx0XHRcdGNvbnNvbGUubG9nKFwiZXJyb3I6IHVuYWJsZSB0byBjcmVhdGUgc2hvcnQgdXJsXCIpO1xuICAvLyBcdFx0fVxuICAvL1xuICAvLyAgICAgfSk7XG4gIC8vICB9XG4gIC8vXG4gIC8vIHRoaXMuZ2V0U2hvcnRJbmZvID0gZnVuY3Rpb24oKVxuICAvLyAge1xuICAvLyAgICAgIHZhciBzaG9ydFVybD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3J0dXJsXCIpLnZhbHVlO1xuICAvL1xuICAvLyAgICAgIHZhciByZXF1ZXN0ID0gZ2FwaS5jbGllbnQudXJsc2hvcnRlbmVyLnVybC5nZXQoe1xuICAvLyAgICAgICAgJ3Nob3J0VXJsJzogc2hvcnRVcmwsXG4gIC8vICBcdCAgICAgJ3Byb2plY3Rpb24nOidGVUxMJ1xuICAvLyAgICAgIH0pO1xuICAvLyAgICAgIHJlcXVlc3QuZXhlY3V0ZShmdW5jdGlvbihyZXNwb25zZSlcbiAgLy8gIFx0e1xuICAvLyAgXHRcdGlmKHJlc3BvbnNlLmxvbmdVcmwhPSBudWxsKVxuICAvLyAgXHRcdHtcbiAgLy8gIFx0XHRcdHN0ciA9XCI8Yj5Mb25nIFVSTDo8L2I+XCIrcmVzcG9uc2UubG9uZ1VybCtcIjxicj5cIjtcbiAgLy8gIFx0XHRcdHN0ciArPVwiPGI+Q3JlYXRlIE9uOjwvYj5cIityZXNwb25zZS5jcmVhdGVkK1wiPGJyPlwiO1xuICAvLyAgXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRcIikuaW5uZXJIVE1MID0gc3RyO1xuICAvLyAgXHRcdH1cbiAgLy8gIFx0XHRlbHNlXG4gIC8vICBcdFx0e1xuICAvLyAgXHRcdFx0Y29uc29sZS5sb2coXCJlcnJvcjogdW5hYmxlIHRvIGdldCBVUkwgaW5mb3JtYXRpb25cIik7XG4gIC8vICBcdFx0fVxuICAvL1xuICAvLyAgICAgIH0pO1xuICAvL1xuICAvLyAgfVxuICAvLyAgZnVuY3Rpb24gbG9hZCgpXG4gIC8vICB7XG4gIC8vICBcdGdhcGkuY2xpZW50LnNldEFwaUtleSgnQUl6YVN5RFNuN3o3VjFmNkgzeVhyZ0FsZ1ZHdzUyZFNFbXFBTEljJyk7IC8vZ2V0IHlvdXIgb3dubiBCcm93c2VyIEFQSSBLRVlcbiAgLy8gIFx0Z2FwaS5jbGllbnQubG9hZCgndXJsc2hvcnRlbmVyJywgJ3YxJyxmdW5jdGlvbigpe30pO1xuICAvLyAgfVxuICAvLyAgd2luZG93Lm9ubG9hZCA9IGxvYWQ7XG59XSk7XG4iLCIgIC8vXG4gIC8vIChmdW5jdGlvbihpLHMsbyxnLHIsYSxtKXtpWydHb29nbGVBbmFseXRpY3NPYmplY3QnXT1yO2lbcl09aVtyXXx8ZnVuY3Rpb24oKXtcbiAgLy8gKGlbcl0ucT1pW3JdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9LGlbcl0ubD0xKm5ldyBEYXRlKCk7YT1zLmNyZWF0ZUVsZW1lbnQobyksXG4gIC8vIG09cy5nZXRFbGVtZW50c0J5VGFnTmFtZShvKVswXTthLmFzeW5jPTE7YS5zcmM9ZzttLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsbSlcbiAgLy8gfSkod2luZG93LGRvY3VtZW50LCdzY3JpcHQnLCcvL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9hbmFseXRpY3MuanMnLCdnYScpO1xuICAvL1xuICAvLyBnYSgnY3JlYXRlJywgJ1VBLTY0OTU1ODY2LTInLCAnYXV0bycpO1xuICAvLyBnYSgnc2VuZCcsICdwYWdldmlldycpO1xuIiwiICAgICAgICAvL3RoaXMgZnVuY3Rpb24gY2FuIHJlbW92ZSBhbiBhcnJheSBlbGVtZW50LlxuICAgICAgICAgICAgQXJyYXkucmVtb3ZlID0gZnVuY3Rpb24oYXJyYXksIGZyb20sIHRvKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3QgPSBhcnJheS5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IGFycmF5Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgYXJyYXkubGVuZ3RoID0gZnJvbSA8IDAgPyBhcnJheS5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXkucHVzaC5hcHBseShhcnJheSwgcmVzdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHRvdGFsX3BvcHVwcyA9IDA7XG4gICAgICAgICAgICB2YXIgcG9wdXBzID0gW107XG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9zZV9wb3B1cChpZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpaSA9IDA7IGlpaSA8IHBvcHVwcy5sZW5ndGg7IGlpaSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoaWQgPT0gcG9wdXBzW2lpaV0pXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnJlbW92ZShwb3B1cHMsIGlpaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZV9wb3B1cHMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2Rpc3BsYXlzIHRoZSBwb3B1cHMuIERpc3BsYXlzIGJhc2VkIG9uIHRoZSBtYXhpbXVtIG51bWJlciBvZiBwb3B1cHMgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9uIHRoZSBjdXJyZW50IHZpZXdwb3J0IHdpZHRoXG4gICAgICAgICAgICBmdW5jdGlvbiBkaXNwbGF5X3BvcHVwcygpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0ID0gMjIwO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlpaSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yKGlpaTsgaWlpIDwgdG90YWxfcG9wdXBzOyBpaWkrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBvcHVwc1tpaWldICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3B1cHNbaWlpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnJpZ2h0ID0gcmlnaHQgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodCA9IHJpZ2h0ICsgMzIwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBqamogPSBpaWk7IGpqaiA8IHBvcHVwcy5sZW5ndGg7IGpqaisrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3B1cHNbampqXSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoaXMgc2NyaXB0IGhhcyBiZWVuIGFkZGVkIGJ5IG1lIGZvciBteSBjdXN0b21lXG5cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXhTZXR1cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnWC1DU1JGLVRPS0VOJzogJCgnbWV0YVtuYW1lPVwiY3NyZi10b2tlblwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgICAgICAgICAkKFwiI2NoYXRcIikua2V5cHJlc3MoZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihldnQud2hpY2ggPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIndlIGFyZSBsaXN0bmluZyB0byBlbnRlciBldmVudFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl1c2VybmFtZSA9ICQoJyNzaG91dF91c2VybmFtZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1lc3NhZ2UgPSAkKCcjc2hvdXRfbWVzc2FnZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0X2RhdGEgPSB7J3VzZXJuYW1lJzppdXNlcm5hbWUsICdtZXNzYWdlJzppbWVzc2FnZX07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9zZW5kIGRhdGEgdG8gXCJzaG91dC5waHBcIiB1c2luZyBqUXVlcnkgJC5wb3N0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3N0KCdzaG91dC5waHAnLCBwb3N0X2RhdGEsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hcHBlbmQgZGF0YSBpbnRvIG1lc3NhZ2Vib3ggd2l0aCBqUXVlcnkgZmFkZSBlZmZlY3QhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGRhdGEpLmhpZGUoKS5hcHBlbmRUbygnLm1lc3NhZ2VfYm94JykuZmFkZUluKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8va2VlcCBzY3JvbGxlZCB0byBib3R0b20gb2YgY2hhdCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGx0b2ggPSAkKCcubWVzc2FnZV9ib3gnKVswXS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcubWVzc2FnZV9ib3gnKS5zY3JvbGxUb3Aoc2Nyb2xsdG9oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNldCB2YWx1ZSBvZiBtZXNzYWdlIGJveFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3Nob3V0X21lc3NhZ2UnKS52YWwoJycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hbGVydCBIVFRQIHNlcnZlciBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy90b2dnbGUgaGlkZS9zaG93IHNob3V0IGJveFxuICAgICAgICAgICAgICAgICAgICAkKFwiLmNsb3NlX2J0blwiKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9nZXQgQ1NTIGRpc3BsYXkgc3RhdGUgb2YgLnRvZ2dsZV9jaGF0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2dnbGVTdGF0ZSA9ICQoJy50b2dnbGVfY2hhdCcpLmNzcygnZGlzcGxheScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RvZ2dsZSBzaG93L2hpZGUgY2hhdCBib3hcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy50b2dnbGVfY2hhdCcpLnNsaWRlVG9nZ2xlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdXNlIHRvZ2dsZVN0YXRlIHZhciB0byBjaGFuZ2UgY2xvc2Uvb3BlbiBpY29uIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0b2dnbGVTdGF0ZSA9PSAnYmxvY2snKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuaGVhZGVyIGRpdlwiKS5hdHRyKCdjbGFzcycsICdvcGVuX2J0bicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5oZWFkZXIgZGl2XCIpLmF0dHIoJ2NsYXNzJywgJ2Nsb3NlX2J0bicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLypkb25lIGFkZGluZyBteSBjdXN0b20gc2NyaXB0cyovXG4gICAgICAgICAgICAvL2NyZWF0ZXMgbWFya3VwIGZvciBhIG5ldyBwb3B1cC4gQWRkcyB0aGUgaWQgdG8gcG9wdXBzIGFycmF5LlxuICAgICAgICAgICAgZnVuY3Rpb24gcmVnaXN0ZXJfcG9wdXAoaWQsIG5hbWUpXG4gICAgICAgICAgICB7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGlpaSA9IDA7IGlpaSA8IHBvcHVwcy5sZW5ndGg7IGlpaSsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy9hbHJlYWR5IHJlZ2lzdGVyZWQuIEJyaW5nIGl0IHRvIGZyb250LlxuICAgICAgICAgICAgICAgICAgICBpZihpZCA9PSBwb3B1cHNbaWlpXSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkucmVtb3ZlKHBvcHVwcywgaWlpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBzLnVuc2hpZnQoaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVfcG9wdXBzKCk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQ9JzxkaXYgY2xhc3M9XCJwb3B1cC1ib3ggY2hhdC1wb3B1cFwiIGlkPVwiJysgaWQgKydcIj4nO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID1lbGVtZW50ICsgJzxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kOiNkZGQ7Y29sb3I6I2ZmZjtcIiBjbGFzcz1cImhlYWRlclwiPkdyb3VwPGRpdiBjbGFzcz1cImNsb3NlX2J0blwiPiZuYnNwOzwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPWVsZW1lbnQgKyAnIDxkaXYgY2xhc3M9XCJ0b2dnbGVfY2hhdFwiPic7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPWVsZW1lbnQgKyAnPGRpdiBjbGFzcz1cIm1lc3NhZ2VfYm94XCI+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9ZWxlbWVudCArICc8dGV4dGFyZWEgc3R5bGU9XCJiYWNrZ3JvdW5kOndoaXRlO21hcmdpbi10b3A6MTgwcHg7XCIgaWQ9XCJjaGF0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiByb3dzPVwiM1wiIHJlcXVpcmVkPVwicmVxdWlyZWRcIj48L3RleHRhcmVhPic7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgPWVsZW1lbnQgK1xuICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50ID0gZWxlbWVudCArICc8ZGl2IGNsYXNzPVwicG9wdXAtaGVhZC1yaWdodFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OmNsb3NlX3BvcHVwKFxcJycrIGlkICsnXFwnKTtcIj4mIzEwMDA1OzwvYT48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIC8vIHZhciBlbGVtZW50ID0gJzxkaXYgY2xhc3M9XCJwb3B1cC1ib3ggY2hhdC1wb3B1cFwiIGlkPVwiJysgaWQgKydcIj4nO1xuICAgICAgICAgICAgICAgIC8vIGVsZW1lbnQgPSBlbGVtZW50ICsgJzxkaXYgY2xhc3M9XCJwb3B1cC1oZWFkXCI+JztcbiAgICAgICAgICAgICAgICAvLyBlbGVtZW50ID0gZWxlbWVudCArICc8ZGl2IGNsYXNzPVwicG9wdXAtaGVhZC1sZWZ0XCI+JysgbmFtZSArJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgLy8gZWxlbWVudCA9IGVsZW1lbnQgKyAnPGRpdiBjbGFzcz1cInBvcHVwLWhlYWQtcmlnaHRcIj48YSBocmVmPVwiamF2YXNjcmlwdDpjbG9zZV9wb3B1cChcXCcnKyBpZCArJ1xcJyk7XCI+JiMxMDAwNTs8L2E+PC9kaXY+JztcbiAgICAgICAgICAgICAgICAvLyBlbGVtZW50ID0gZWxlbWVudCArICc8ZGl2IHN0eWxlPVwiY2xlYXI6IGJvdGg7XCI+PC9kaXY+PC9kaXY+PHAgb25jbGljaz1cInQoKVwiIGlkPVwibVwiPjwvcD48ZGl2IGNsYXNzPVwicG9wdXAtbWVzc2FnZXNcIj48dGV4dGFyZWEgIGNsYXNzPVwidG9wXCI+PC90ZXh0YXJlYT48L2Rpdj48L2Rpdj4nO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmlubmVySFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXS5pbm5lckhUTUwgKyBlbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgcG9wdXBzLnVuc2hpZnQoaWQpO1xuXG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlX3BvcHVwcygpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2FsY3VsYXRlIHRoZSB0b3RhbCBudW1iZXIgb2YgcG9wdXBzIHN1aXRhYmxlIGFuZCB0aGVuIHBvcHVsYXRlIHRoZSB0b2F0YWxfcG9wdXBzIHZhcmlhYmxlLlxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlX3BvcHVwcygpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICAgICAgaWYod2lkdGggPCA1NDApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbF9wb3B1cHMgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IHdpZHRoIC0gMjAwO1xuICAgICAgICAgICAgICAgICAgICAvLzMyMCBpcyB3aWR0aCBvZiBhIHNpbmdsZSBwb3B1cCBib3hcbiAgICAgICAgICAgICAgICAgICAgdG90YWxfcG9wdXBzID0gcGFyc2VJbnQod2lkdGgvMzIwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkaXNwbGF5X3BvcHVwcygpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vcmVjYWxjdWxhdGUgd2hlbiB3aW5kb3cgaXMgbG9hZGVkIGFuZCBhbHNvIHdoZW4gd2luZG93IGlzIHJlc2l6ZWQuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBjYWxjdWxhdGVfcG9wdXBzKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBjYWxjdWxhdGVfcG9wdXBzKTsiLCIvL0F1dGhvciBNdXJhZ2lqaW1hbmEgUmljaGFyZCBzdHJpbXVwQGdtYWlsLmNvbSBiZWFzdGFyNDU3QGdtYWlsLmNvbVxuXG4gIHN5bmMuY29udHJvbGxlcignTWVzc2FnZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJGh0dHAsJHNjb3BlLCRxLCRyb290U2NvcGUpIHtcbiAgICAgICAkLmFqYXhTZXR1cCh7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ1gtQ1NSRi1UT0tFTic6ICQoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBcbiAgICAgICAgICRzY29wZS5uYW1lPVwiTXVyYWdpamltYW5hXCI7XG4gICAgICAgICB2YXIgcG9zdHM9JGh0dHAuZ2V0KCRyb290U2NvcGUuZW5kUG9pbnQgKyAnL2FwaS92MS9wb3N0JyksXG4gICAgICAgICAgICAgaW5zdGl0dXRpb25zPSRodHRwLmdldCgkcm9vdFNjb3BlLmVuZFBvaW50ICsgJy9hcGkvdjEvcG9zdCcpO1xuXG4gICAgICAgICAgJHEuYWxsKFtwb3N0cyxpbnN0aXR1dGlvbnNdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgdmFyIHRtcCA9IFtdO1xuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHJlc3VsdCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgdG1wLnB1c2gocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0bXA7XG4gICAgICAgICAgfSkudGhlbihmdW5jdGlvbih0bXBSZXN1bHQpIHtcbiAgICAgICAgICAgICAgLy8gcG9zdHM9dG1wUmVzdWx0O1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhbmd1bGFyLnRvSnNvbih0bXBSZXN1bHRbMF0sIHRydWUpKTtcbiAgICAgICAgICAgICRzY29wZS5wb3N0cyA9IHRtcFJlc3VsdFswXTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICQoJy5wb3N0LWluJykuYXR3aG8oe1xuICAgICAgICAgICAgYXQ6IFwiQFwiLFxuICAgICAgICAgICAgZGF0YTpbJ1BldGVyJywgJ1RvbScsICdBbm5lJ10sXG5cbiAgICAgICAgIH0pO1xuXG4gIH0pO1xuIiwiXG5zeW5jLmNvbnRyb2xsZXIoXCJUdXRvcmlhbE1vZGFsXCIsIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IHRydWU7XG4gIH07XG4gICRzY29wZS5vayA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5zaG93TW9kYWwgPSBmYWxzZTtcbiAgfTtcblxuICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IGZhbHNlO1xuICB9O1xuXG59KTtcblxuc3luYy5jb250cm9sbGVyKFwiU3RyaW1pbk1vZGFsXCIsIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IHRydWU7XG4gIH07XG4gICRzY29wZS5vayA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5zaG93TW9kYWwgPSBmYWxzZTtcbiAgfTtcblxuICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnNob3dNb2RhbCA9IGZhbHNlO1xuICB9O1xuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
