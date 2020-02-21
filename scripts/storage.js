"use strict";
/* global Base64, Lawnchair, Windows */
var Sto = (function () {
    "use strict";
    var LOCAL = {}, Version = 1.1, PreviousVersion = 1;
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
                Windows.Storage.FileIO.writeTextAsync(file, value).done(function () {
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
            value = key ? Base64.write(value, key) : Base64.write(value);
            if (Windows) {
                var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(write, fileNotFoundError);
            }
            else if (typeof LOCAL[refName] === "undefined" || LOCAL[refName] === null || !(LOCAL[refName] instanceof Lawnchair)) {
                LOCAL[refName] = Lawnchair();
                return ret();
            }
            else
                return ret();
        };
        LocalStorageObj.prototype.getItem = function (refName, key, callback, doesntExistCallback) {
            function read(str) {
                var value = key ? Base64.read(str, key) : Base64.read(str);
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
            if (Windows) {
                var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(function (file) {
                    Windows.Storage.FileIO.readTextAsync(file).done(function (fileContent) {
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
            else if (LOCAL[refName] && LOCAL[refName] instanceof Lawnchair) {
                return LOCAL[refName].get(refName, got);
            }
            // or from Lawnchair object and cache it to to LOCAL object for quick retrieval later
            else {
                LOCAL[refName] = Lawnchair();
                return LOCAL[refName].get(refName, got);
            }
        };
        LocalStorageObj.prototype.nuke = function () {
            // eslint-disable-next-line consistent-this
            var _this = this;
            function getAllKeys() { this.keys(deleteEachKey); }
            function deleteEachKey(keys) { keys.forEach(_this.deleteItem); }
            if (Windows) {
                var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
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
                Lawnchair(getAllKeys);
            }
            LOCAL = {};
        };
        LocalStorageObj.prototype.deleteItem = function (refName) {
            function deleteRef() { this.remove(refName); }
            if (Windows) {
                var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(function (file) {
                    file.deleteAsync(Windows.Storage.StorageDeleteOption.default);
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                Lawnchair(deleteRef);
                if (LOCAL && LOCAL[refName])
                    LOCAL[refName] = {};
            }
        };
        return LocalStorageObj;
    }());
    return new LocalStorageObj();
}());
//# sourceMappingURL=storage.js.map