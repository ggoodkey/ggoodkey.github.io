(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./main"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var main_1 = require("./main");
    'use strict';
    var cordova;
    var toString = {}.toString;
    function isFunction(x) { return toString.call(x) === '[object Function]'; }
    function isString(x) { return toString.call(x) === '[object String]'; }
    function isObject(x) { return toString.call(x) === '[object Object]'; }
    function paramsFromUrlHash(hash) {
        hash = hash || window.location.hash;
        return hash.replace(/^#\/|^#/, '').split('&').reduce(function (o, entry) {
            if (entry === '')
                return o;
            entry = entry.split('=');
            o[decodeURIComponent(entry[0])] = decodeURIComponent(entry[1]);
            return o;
        }, {});
    }
    var api = 'https://api.dropboxapi.com/2/', content = 'https://content.dropboxapi.com/2/', tokenStore = function (key, val) { return arguments.length > 1 ? localStorage[key] = val : localStorage[key]; }, globalErrorHandler = undefined;
    var endpointMapping = {
        'auth/token/revoke': { contentType: null },
        'files/upload': { baseUri: content, format: 'content-upload' },
        'files/get_thumbnail': { baseUri: content, format: 'content-download' },
        'files/download': { baseUri: content, format: 'content-download' },
        'files/get_preview': { baseUri: content, format: 'content-download' },
        'files/upload_session/append': { baseUri: content, format: 'content-upload' },
        'files/upload_session/append_v2': { baseUri: content, format: 'content-upload' },
        'files/upload_session/finish': { baseUri: content, format: 'content-upload' },
        'files/upload_session/start': { baseUri: content, format: 'content-upload' },
        'sharing/get_shared_link_file': { baseUri: content, format: 'content-download' }
    };
    var contentTypeMapping = {
        'rpc': 'application/json',
        'content-upload': 'application/octet-stream'
    };
    var dropbox = function (endpoint, apiArgs, handlers, callback) {
        var args = [].slice.call(arguments), config = endpointMapping[endpoint] || {}, baseUri = config.baseUri || api, format = config.format || 'rpc', contentType = config.contentType || config.contentType === null ? null : contentTypeMapping[format], lastArg = args[args.length - 1];
        handlers = args.length > 2 && (isObject(lastArg) || isFunction(lastArg)) ? lastArg : {};
        if (isFunction(handlers))
            handlers = { onComplete: handlers };
        var promise, promisectl = {};
        if (Promise) {
            promise = new Promise(function (resolve, reject) { promisectl.resolve = resolve; promisectl.reject = reject; });
        }
        if (endpoint === "users/get_account" || endpoint === "users/get_current_account") {
            apiArgs = apiArgs || {};
            apiArgs.account_id = apiArgs.account_id || tokenStore("__dbai");
        }
        var r = new XMLHttpRequest();
        r.open('POST', baseUri + endpoint, true);
        r.setRequestHeader('Authorization', 'Bearer ' + (tokenStore('__dbat') || '000000000000000000000000_00000-000000000000000000000000000000000'));
        if (format === 'content-download')
            r.responseType = 'blob';
        if (apiArgs && apiArgs.responseType !== undefined) {
            r.responseType = apiArgs.responseType;
            delete apiArgs.responseType;
        }
        if (contentType)
            r.setRequestHeader('Content-Type', contentType);
        if (apiArgs && (format === 'content-upload' || format === 'content-download'))
            r.setRequestHeader('Dropbox-API-Arg', JSON.stringify(apiArgs));
        if (handlers.onDownloadProgress)
            r.addEventListener("progress", handlers.onDownloadProgress);
        if (handlers.onUploadProgress && r.upload)
            r.upload.addEventListener("progress", handlers.onUploadProgress);
        if (handlers.onError || globalErrorHandler)
            r.addEventListener("error", function (e) {
                var er = handlers.onError && handlers.onError(e.target);
                promise && promisectl.reject && promisectl.reject(e.target);
                globalErrorHandler && globalErrorHandler(e.target, er);
            });
        r.onreadystatechange = function () {
            if (r.readyState !== 4)
                return;
            if (r.status === 200) {
                var apiResponse = JSON.parse(r.getResponseHeader('dropbox-api-result') || r.responseText);
                if (endpoint === 'auth/token/revoke') {
                    tokenStore('__dbat', '');
                    tokenStore("__dbai", "");
                }
                handlers.onComplete && handlers.onComplete(apiResponse, r.response, r);
                promise && promisectl.resolve && promisectl.resolve(apiResponse, r.response, r);
            }
            else {
                var er = handlers.onError && handlers.onError(r);
                promise && promisectl.reject && promisectl.reject(r);
                globalErrorHandler && globalErrorHandler(r, er);
            }
        };
        var requestPayload = args.length > 2 && format === 'content-upload' ? args[2] : undefined;
        requestPayload = requestPayload || (apiArgs && format === 'rpc' ? JSON.stringify(apiArgs) : null);
        if (requestPayload) {
            r.send(requestPayload);
        }
        else {
            r.send();
        }
        return promise;
    };
    dropbox.setGlobalErrorHandler = function (handler) { globalErrorHandler = handler; };
    dropbox.setTokenStore = function (store) { tokenStore = store; };
    dropbox.authenticate = function (apiArgs, handlers) {
        function initAuth() {
            // initiate authentication
            csrfToken = "" + Math.floor(Math.random() * 100000);
            tokenStore('__dbcsrf', csrfToken);
            var authUrl = "https://www.dropbox.com/1/oauth2/authorize?response_type=token&"
                + "client_id=" + encodeURIComponent(apiArgs.client_id) + "&"
                + "redirect_uri=" + encodeURIComponent(apiArgs.redirect_uri) + "&"
                + "state=" + encodeURIComponent(csrfToken);
            if (cordova)
                authCordova(authUrl);
            else
                window.location.href = authUrl;
        }
        function returnAuth() {
            // we are returning from authentication redirect
            if (params.account_id) {
                tokenStore('__dbai', params.account_id);
            }
            if (params.access_token) {
                // the authentcation was successful
                tokenStore('__dbat', params.access_token);
                tokenStore('__dbcsrf', '');
                window.location.replace(window.location.href.replace(/#.*/, ''));
            }
            else {
                // the authentication was not successful
                var er = handlers.onError && handlers.onError(params);
                promise && promise.reject && promise.reject(params);
                globalErrorHandler && globalErrorHandler(params, er);
            }
        }
        function authCordova(authUrl) {
            var browser, onEvent, removed = false;
            browser = window.open(authUrl, '_blank', 'location=no,closebuttoncaption=Cancel,hardwareback=yes,presentationStyle=fullscreen,resizable=yes,scrollbars=no,status=yes,centerscreen=yes,fullscreen=yes,disallowoverscroll=yes');
            onEvent = function (event) {
                if (event.url) {
                    var params = paramsFromUrlHash(event.url.split("#")[1]);
                    if (params.state && csrfToken && params.state === csrfToken) {
                        if (removed) {
                            return;
                        }
                        browser.removeEventListener('loadstart', onEvent);
                        browser.removeEventListener('loaderror', onEvent);
                        browser.removeEventListener('loadstop', onEvent);
                        browser.removeEventListener('exit', onEvent);
                        removed = true;
                        // we are returning from authentication redirect
                        if (params.account_id) {
                            tokenStore('__dbai', params.account_id);
                        }
                        if (params.access_token) {
                            // the authentcation was successful
                            tokenStore('__dbat', params.access_token);
                            tokenStore('__dbcsrf', '');
                            window.setTimeout(function () {
                                browser.close();
                                handlers.onComplete();
                                promise && promise.resolve && promise.resolve();
                                return promise;
                            }, 10);
                            return;
                        }
                        else {
                            // the authentication was not successful
                            var er = handlers.onError && handlers.onError(params);
                            promise && promise.reject && promise.reject(params);
                            globalErrorHandler && globalErrorHandler(params, er);
                        }
                    }
                }
                if (event.type === 'exit') {
                    if (removed) {
                        return;
                    }
                    browser.removeEventListener('loadstart', onEvent);
                    browser.removeEventListener('loaderror', onEvent);
                    browser.removeEventListener('loadstop', onEvent);
                    browser.removeEventListener('exit', onEvent);
                    removed = true;
                    if (main_1.app && main_1.app.goBack)
                        main_1.app.goBack();
                }
            };
            browser.addEventListener('loadstart', onEvent);
            browser.addEventListener('loaderror', onEvent);
            browser.addEventListener('loadstop', onEvent);
            return browser.addEventListener('exit', onEvent);
        }
        handlers = handlers || {};
        if (isFunction(handlers))
            handlers = { onComplete: handlers };
        apiArgs = apiArgs || {};
        if (isString(apiArgs))
            apiArgs = { client_id: apiArgs };
        apiArgs.redirect_uri = apiArgs.redirect_uri || window.location.href;
        var promise, promisectl = {};
        if (Promise) {
            promise = new Promise(function (resolve, reject) { promisectl.resolve = resolve; promisectl.reject = reject; });
        }
        // if we already have an access token, return immediately
        if (tokenStore('__dbat')) {
            handlers.onComplete();
            promise && promise.resolve && promise.resolve();
            return promise;
        }
        var params = paramsFromUrlHash(window.location.hash), csrfToken = tokenStore('__dbcsrf');
        if (params.state && csrfToken && params.state === csrfToken)
            returnAuth();
        else
            initAuth();
        return promise;
    };
    exports.default = dropbox;
});
//# sourceMappingURL=dropbox.js.map