var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./base64", "./storage", "./main"], function (require, exports, base64_1, storage_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base64_1 = __importDefault(base64_1);
    storage_1 = __importDefault(storage_1);
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
    var CLIENT_ID;
    var localTestingMode = function () {
        if (!window)
            return false; //running in webworker
        var loc = window.location;
        if (!loc || /^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://" || window.navigator.onLine === false)
            return true;
        else
            return false;
    }();
    function dropboxError(error, error1, XMLhttpRequest) {
        //if (error instanceof XMLHttpRequest) error = error.statusText;
        if (console && console.log)
            console.log("dropbox error:", error, error1, XMLhttpRequest);
    }
    var DropboxSessionObj = /** @class */ (function () {
        function DropboxSessionObj(client_id, password, callback) {
            dropbox.setGlobalErrorHandler(dropboxError);
            this.isAuthenticated = false;
            CLIENT_ID = client_id;
            //try login
            if (!localTestingMode) {
                if (localStorage.__dbat && localStorage.__dbat !== "") {
                    this.isAuthenticated = true;
                    //updateFileList();
                    password = password || "";
                    this.getUserInfo(password, callback); /*TODO password*/
                }
                //else check if returning oauth call with token
                else if (window && window.location.hash.match(/^#access_token=/)) {
                    this.login.call(this, password, callback, function () {
                        dropboxError("failed to login");
                    });
                }
                else if (callback instanceof Function) {
                    return callback(false);
                }
            }
            else if (callback instanceof Function)
                return callback(false);
        }
        DropboxSessionObj.prototype.save = function (fileName, fileContents, key, callback, onErrorCallback) {
            if (typeof fileContents !== "string")
                fileContents = JSON.stringify(fileContents);
            if (key)
                fileContents = base64_1.default.write(fileContents, key);
            if (onErrorCallback) {
                var _onErrorCallback = function (error) {
                    dropboxError(error);
                    onErrorCallback(error);
                };
                callback = { onComplete: callback, onError: _onErrorCallback };
            }
            if (localTestingMode)
                return callback instanceof Function ? callback(false) : false;
            dropbox("files/upload", { "mute": true, "autorename": false, "mode": "overwrite", "path": fileName }, fileContents, callback);
        };
        DropboxSessionObj.prototype.open = function (fileName, key, callback) {
            function rtn(apiResponse, data) {
                if (data) {
                    if (key)
                        data = base64_1.default.read(data, key);
                    return callback instanceof Function ? callback(data) : data;
                }
                else
                    return callback instanceof Function ? callback(false, "data not found") : false;
            }
            function fail(error) {
                dropboxError(error);
                return callback instanceof Function ? callback(false, error.statusText) : false;
            }
            if (localTestingMode)
                return callback instanceof Function ? callback(false, "working offline") : false;
            else
                dropbox("files/download", { path: fileName, responseType: "text" }, { onComplete: rtn, onError: fail });
        };
        DropboxSessionObj.prototype.delete = function (fileName, callback) {
            dropbox("files/delete_v2", { path: fileName }, { onComplete: callback, onError: dropboxError });
        };
        DropboxSessionObj.prototype.getUserInfo = function (password, callback) {
            function ret(alias, email, id, account_id) {
                var user = { "alias": alias, "email": email, "id": id, "dbid": account_id };
                return callback instanceof Function ? callback(user) : user;
            }
            function gotCachedUser(user) {
                user = JSON.parse(user);
                return ret(user.alias, user.email, user.id, user.dbid);
            }
            function tryDropbox() {
                function newUser(obj) {
                    if (obj && obj.email && obj.name) {
                        obj.id = base64_1.default.hash(obj.email); //TODO depricate id
                        storage_1.default.setItem(storage_1.default.LocalUserRef, JSON.stringify({ "alias": obj.name.display_name, "email": obj.email, "id": obj.id, "dbid": obj.account_id }));
                        return ret(obj.name.display_name, obj.email, obj.id, obj.account_id);
                    }
                    else {
                        return callback instanceof Function ? callback(false) : false;
                    }
                }
                dropbox("users/get_account", undefined, newUser);
            }
            function gotOldUser(user) {
                console.log("found old cached version user, deleting, get new one from dropbox", user);
                user = JSON.parse(user);
                //TODO migrate user version
                storage_1.default.deleteItem(storage_1.default.LocalUserRef_old);
                tryDropbox();
            }
            function noCachedUser() {
                storage_1.default.getItem(storage_1.default.LocalUserRef_old, null, gotOldUser, tryDropbox);
            }
            password = password || "";
            if (localTestingMode)
                return callback instanceof Function ? callback(false) : false;
            else {
                storage_1.default.getItem(storage_1.default.LocalUserRef, null, gotCachedUser, noCachedUser);
            }
        };
        DropboxSessionObj.prototype.login = function (password, successCallback, failureCallback) {
            function auth() {
                if (!window)
                    return failureCallback instanceof Function ? failureCallback() : false;
                var redirectUri = cordova ? "https://www.dropbox.com/1/oauth2/redirect_receiver" : window.location.href.toLowerCase().split("#")[0];
                dropbox.authenticate({ client_id: CLIENT_ID, redirect_uri: redirectUri }, { "onComplete": initiate.bind(this), "onError": failureCallback });
            }
            function initiate() {
                function gotUser(user) {
                    if (user)
                        return successCallback instanceof Function ? successCallback(user) : true;
                    else
                        return failureCallback instanceof Function ? failureCallback() : false;
                }
                this.isAuthenticated = true;
                this.getUserInfo(password, gotUser);
            }
            password = password || "";
            if (localTestingMode) { //not possible when running locally
                var msg = "You can't login from a page hosted on your local file system";
                alert(msg);
                if (failureCallback instanceof Function)
                    return failureCallback();
                else
                    return;
            }
            else if (this.isAuthenticated)
                initiate.call(this);
            else
                auth.call(this);
        };
        DropboxSessionObj.prototype.logout = function (callback) {
            function resetApp() {
                storage_1.default.deleteItem(storage_1.default.LocalUserRef);
                this.isAuthenticated = false;
                return callback instanceof Function ? callback() : true;
            }
            dropbox("auth/token/revoke", undefined, resetApp.bind(this));
        };
        DropboxSessionObj.prototype.share = function (fileName, fileContents, key, expires, callback) {
            var settings = {
                requested_visibility: key ? "password" : "public",
                audience: key ? "password" : "public",
                access: "max"
            };
            if (key) {
                settings.link_password = base64_1.default.hash(key);
                fileContents = base64_1.default.write(fileContents, key);
            }
            if (expires) {
                if (expires instanceof Date)
                    expires = expires.toISOString();
                settings.expires = expires; //"%Y-%m-%dT%H:%M:%SZ"
            }
            dropbox("sharing/list_shared_links", { "path": "/shared/" + fileName, "direct_only": true }, function (ret) {
                console.log(ret);
                var found = false;
                for (var a = 0, aLen = ret.links.length; a < aLen; a++) {
                    if (ret.links[a].name === fileName && ret.links[a].path_lower === "/shared/" + fileName.toLowerCase())
                        found = ret.links[a];
                }
                if (found === false)
                    this.save("/shared/" + fileName, fileContents, key, function (ret) {
                        dropbox("sharing/create_shared_link_with_settings", { "path": "/shared/" + fileName, "settings": settings }, callback);
                    });
                else
                    return callback instanceof Function ? callback(found) : found;
            }.bind(this));
        };
        DropboxSessionObj.prototype.revoke = function (fileName, callback) {
            dropbox("sharing/list_shared_links", { "path": "/shared/" + fileName, "direct_only": true }, function (ret) {
                console.log(ret);
                //	dropbox("sharing/revoke_shared_link", { "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0" }, callback);
            });
        };
        DropboxSessionObj.prototype.receive = function (linkURL, key, callback) {
            function ret(apiResponse, data) {
                console.log(apiResponse);
                if (data) {
                    if (key)
                        data = base64_1.default.read(data, key);
                    return callback instanceof Function ? callback(data) : data;
                }
                else
                    return callback instanceof Function ? callback(false, "shared data not found") : false;
            }
            var settings = {
                url: linkURL.replace(/\?dl\=0$/, "?dl=1"),
                link_password: undefined
            };
            if (key)
                settings.link_password = base64_1.default.hash(key);
            dropbox("sharing/get_shared_link_file", settings, ret);
        };
        return DropboxSessionObj;
    }());
    exports.initiateDropbox = function (client_id, password, callback) {
        return new DropboxSessionObj(client_id, password, callback);
    };
});
//# sourceMappingURL=dropbox.js.map