var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./base64", "./dropbox", "./Lawnchair"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var base64_1 = __importDefault(require("./base64"));
    var dropbox_1 = __importDefault(require("./dropbox"));
    var Lawnchair_1 = __importDefault(require("./Lawnchair"));
    /* global cordova */
    "use strict";
    var LOCAL = {}, Version = 1.1, PreviousVersion = 1, WorkingOffline = function () {
        if (!window)
            return false; //running in webworker
        var loc = window.location;
        if (!loc || /^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://" || window.navigator.onLine === false)
            return true;
        else
            return false;
    }();
    var LocalStorageObj = /** @class */ (function () {
        function LocalStorageObj() {
            this.LocalUserRef = "User" + Version;
            this.LocalUserRef_old = "User" + PreviousVersion;
            this.technology = "";
        }
        LocalStorageObj.prototype.setItem = function (refName, value, key) {
            function ret() {
                LOCAL[refName].save({ key: refName, data: value });
            }
            function write(file) {
                window.Windows.Storage.FileIO.writeTextAsync(file, value).done(function () {
                }, function (error) {
                    //file couldn't be written - handle the error
                    console.log(error, "not written");
                });
            }
            function fileNotFoundError(error) {
                //file not found, handle the error
                console.log(error, "file not found, creating file");
                storageFolder.createFileAsync(refName).done(write, function (error) {
                    //file not created, handle the error
                    console.log(error, "not created");
                });
            }
            if (typeof value === "object")
                value = JSON.stringify(value);
            //if (console && console.log) console.log("setItem", refName, value, key);
            value = key ? base64_1.default.write(value, key) : base64_1.default.write(value);
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(write, fileNotFoundError);
            }
            else if (typeof LOCAL[refName] === "undefined" || LOCAL[refName] === null || !(LOCAL[refName] instanceof Lawnchair_1.default)) {
                LOCAL[refName] = Lawnchair_1.default();
                return ret();
            }
            else
                return ret();
        };
        LocalStorageObj.prototype.getItem = function (refName, key, callback, doesntExistCallback) {
            function read(str) {
                var value = key ? base64_1.default.read(str, key) : base64_1.default.read(str);
                //if (console && console.log) console.log("getItem", refName, value, key);
                if (key && !value)
                    return callback instanceof Function ? callback(null, "wrong key") : null;
                else
                    return callback instanceof Function ? callback(value) : value;
            }
            function got(obj) {
                if (obj && obj.data) {
                    read(obj.data);
                }
                else {
                    if (doesntExistCallback instanceof Function)
                        return doesntExistCallback();
                    else
                        return null;
                }
            }
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(function (file) {
                    window.Windows.Storage.FileIO.readTextAsync(file).done(function (fileContent) {
                        read(fileContent);
                        //'fileContent' contains your JSON data as a string
                    }, function (error) {
                        //file couldn't be read - handle the error
                        return callback instanceof Function ? callback(null, error) : null;
                    });
                }, function (error) {
                    //file not found, handle the error
                    if (doesntExistCallback instanceof Function)
                        return doesntExistCallback(error);
                    else
                        return null;
                });
            }
            //try get cached value from the LOCAL object
            else if (LOCAL[refName] && LOCAL[refName] instanceof Lawnchair_1.default) {
                return LOCAL[refName].get(refName, got);
            }
            // or from Lawnchair object and cache it to to LOCAL object for quick retrieval later
            else {
                LOCAL[refName] = Lawnchair_1.default();
                return LOCAL[refName].get(refName, got);
            }
        };
        LocalStorageObj.prototype.nuke = function () {
            // eslint-disable-next-line consistent-this
            var _this = this;
            function getAllKeys() { this.keys(deleteEachKey); }
            function deleteEachKey(keys) { keys.forEach(_this.deleteItem); }
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFilesAsync().done(function (files) {
                    if (files.length > 0)
                        for (var a = 0, len = files.length; a < len; a++) {
                            _this.deleteItem(files[a].name);
                        }
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                Lawnchair_1.default(getAllKeys);
            }
            LOCAL = {};
        };
        LocalStorageObj.prototype.deleteItem = function (refName) {
            function deleteRef() { this.remove(refName); }
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(function (file) {
                    file.deleteAsync(window.Windows.Storage.StorageDeleteOption.default);
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                Lawnchair_1.default(deleteRef);
                if (LOCAL && LOCAL[refName])
                    LOCAL[refName] = {};
            }
        };
        return LocalStorageObj;
    }());
    exports.Sto = new LocalStorageObj();
    var CLIENT_ID;
    function dropboxError(error, error1, XMLhttpRequest) {
        //if (error instanceof XMLHttpRequest) error = error.statusText;
        if (console && console.log)
            console.log("dropbox error:", error, error1, XMLhttpRequest);
    }
    var DropboxSessionObj = /** @class */ (function () {
        function DropboxSessionObj(client_id, password, callback) {
            dropbox_1.default.setGlobalErrorHandler(dropboxError);
            this.isAuthenticated = false;
            CLIENT_ID = client_id;
            //try login
            if (!WorkingOffline) {
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
            if (WorkingOffline)
                return callback instanceof Function ? callback(false) : false;
            dropbox_1.default("files/upload", { "mute": true, "autorename": false, "mode": "overwrite", "path": fileName }, fileContents, callback);
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
            if (WorkingOffline)
                return callback instanceof Function ? callback(false, "working offline") : false;
            else
                dropbox_1.default("files/download", { path: fileName, responseType: "text" }, { onComplete: rtn, onError: fail });
        };
        DropboxSessionObj.prototype.delete = function (fileName, callback) {
            dropbox_1.default("files/delete_v2", { path: fileName }, { onComplete: callback, onError: dropboxError });
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
                        exports.Sto.setItem(exports.Sto.LocalUserRef, JSON.stringify({ "alias": obj.name.display_name, "email": obj.email, "id": obj.id, "dbid": obj.account_id }));
                        return ret(obj.name.display_name, obj.email, obj.id, obj.account_id);
                    }
                    else {
                        return callback instanceof Function ? callback(false) : false;
                    }
                }
                dropbox_1.default("users/get_account", undefined, newUser);
            }
            function gotOldUser(user) {
                console.log("found old cached version user, deleting, get new one from dropbox", user);
                user = JSON.parse(user);
                //TODO migrate user version
                exports.Sto.deleteItem(exports.Sto.LocalUserRef_old);
                tryDropbox();
            }
            function noCachedUser() {
                exports.Sto.getItem(exports.Sto.LocalUserRef_old, null, gotOldUser, tryDropbox);
            }
            password = password || "";
            if (WorkingOffline)
                return callback instanceof Function ? callback(false) : false;
            else {
                exports.Sto.getItem(exports.Sto.LocalUserRef, null, gotCachedUser, noCachedUser);
            }
        };
        DropboxSessionObj.prototype.login = function (password, successCallback, failureCallback) {
            function auth() {
                if (!window)
                    return failureCallback instanceof Function ? failureCallback() : false;
                var redirectUri = cordova ? "https://www.dropbox.com/1/oauth2/redirect_receiver" : window.location.href.toLowerCase().split("#")[0];
                dropbox_1.default.authenticate({ client_id: CLIENT_ID, redirect_uri: redirectUri }, { "onComplete": initiate.bind(this), "onError": failureCallback });
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
            if (WorkingOffline) { //not possible when running locally
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
                exports.Sto.deleteItem(exports.Sto.LocalUserRef);
                this.isAuthenticated = false;
                return callback instanceof Function ? callback() : true;
            }
            dropbox_1.default("auth/token/revoke", undefined, resetApp.bind(this));
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
            dropbox_1.default("sharing/list_shared_links", { "path": "/shared/" + fileName, "direct_only": true }, function (ret) {
                console.log(ret);
                var found = false;
                for (var a = 0, aLen = ret.links.length; a < aLen; a++) {
                    if (ret.links[a].name === fileName && ret.links[a].path_lower === "/shared/" + fileName.toLowerCase())
                        found = ret.links[a];
                }
                if (found === false)
                    this.save("/shared/" + fileName, fileContents, key, function (ret) {
                        dropbox_1.default("sharing/create_shared_link_with_settings", { "path": "/shared/" + fileName, "settings": settings }, callback);
                    });
                else
                    return callback instanceof Function ? callback(found) : found;
            }.bind(this));
        };
        DropboxSessionObj.prototype.revoke = function (fileName, callback) {
            dropbox_1.default("sharing/list_shared_links", { "path": "/shared/" + fileName, "direct_only": true }, function (ret) {
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
            dropbox_1.default("sharing/get_shared_link_file", settings, ret);
        };
        return DropboxSessionObj;
    }());
    exports.initiateDropbox = function (client_id, password, callback) {
        return new DropboxSessionObj(client_id, password, callback);
    };
});
//# sourceMappingURL=storage.js.map