var APP = APP || {}, Base64, Windows, Lawnchair, dropbox, cordova, window = window;
(function () {
	"use strict";
	var LOCAL = {},
		Version = 1.1,
		PreviousVersion = 1,
		WorkingOffline = function () {
			if (!window) return false;//running in webworker
			var loc = window.location;
			if (!loc || /^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://" || window.navigator.onLine === false) return true;
			else return false;
		}(),
		LocalStorageObj = function () {
			this.LocalUserRef = "User" + Version;
			this.LocalUserRef_old = "User" + PreviousVersion;
			this.technology = null;
			var _this = this; //eslint-disable-line
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
				if (typeof value === "object") value = JSON.stringify(value);
				//if (console && console.log) console.log("setItem", refName, value, key);
				value = key ? Base64.write(value, key) : Base64.write(value);
				if (Windows) {					
					var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
					storageFolder.getFileAsync(refName).done(write, fileNotFoundError);
				}
				else if (typeof LOCAL[refName] === "undefined" || LOCAL[refName] === null || !(LOCAL[refName] instanceof Lawnchair)) {
					LOCAL[refName] = new Lawnchair();
					return ret();
				}
				else return ret();
			};
			LocalStorageObj.prototype.getItem = function (refName, key, callback, doesntExistCallback) {
				function read(str) {
					var value = key ? Base64.read(str, key) : Base64.read(str);
					//if (console && console.log) console.log("getItem", refName, value, key);
					if (key && !value) return callback instanceof Function ? callback(null, "wrong key") : null;
					else return callback instanceof Function ? callback(value) : value;
				}
				function got(obj) {
					if (obj && obj.data) {
						read(obj.data);
					}
					else {
						if (doesntExistCallback instanceof Function) return doesntExistCallback();
						else return null;
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
						if (doesntExistCallback instanceof Function) return doesntExistCallback(error);
						else return null;
					});
				}
				//try get cached value from the LOCAL object
				else if (LOCAL[refName] && LOCAL[refName] instanceof Lawnchair) {
					return LOCAL[refName].get(refName, got);
				}
				// or from Lawnchair object and cache it to to LOCAL object for quick retrieval later
				else {
					LOCAL[refName] = new Lawnchair();
					return LOCAL[refName].get(refName, got);
				}
			};
			LocalStorageObj.prototype.nuke = function () {
				function getAllKeys() { this.keys(deleteEachKey); }
				function deleteEachKey(keys) { keys.forEach(_this.deleteItem); }
				if (Windows) {
					var storageFolder = Windows.Storage.ApplicationData.current.localFolder;
					storageFolder.getFilesAsync().done(function (files) {
						if (files.length > 0) for (var a = 0, len = files.length; a < len; a++) {
							_this.deleteItem(files[a].name);
						}
					}, function (error) {
						console.log(error);
					});
				}
				else { Lawnchair(getAllKeys); }
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
					if (LOCAL && LOCAL[refName]) LOCAL[refName] = {};
				}
			};
		};
	APP.Sto = new LocalStorageObj();
	var DropboxSessionObj = function (client_id, password, callback) {
		function dropboxError(error) {
			if (error instanceof XMLHttpRequest) error = error.statusText;
			if (console && console.log) console.log("dropbox error:", error);
		}
		DropboxSessionObj.prototype.save = function (fileName, fileContents, key, callback, onErrorCallback) {
			if (typeof fileContents !== "string") fileContents = JSON.stringify(fileContents);
			if (key) fileContents = Base64.write(fileContents, key);
			if (onErrorCallback) {
				var _onErrorCallback = function (error) {
					dropboxError(error);
					onErrorCallback(error);
				};
				callback = { onComplete: callback, onError: _onErrorCallback };
			}
			if (WorkingOffline) return callback instanceof Function ? callback(false) : false;
			dropbox("files/upload", { "mute": true, "autorename": false, "mode": "overwrite", "path": fileName }, fileContents, callback);
		};
		DropboxSessionObj.prototype.open = function (fileName, key, callback) {
			function rtn(apiResponse, data) {
				if (data) {
					if (key) data = Base64.read(data, key);
					return callback instanceof Function ? callback(data) : data;
				}
				else return callback instanceof Function ? callback(false, "data not found") : false;
			}
			function fail(error) {
				dropboxError(error);
				return callback instanceof Function ? callback(false, error.statusText) : false;
			}
			if (WorkingOffline) return callback instanceof Function ? callback(false, "working offline") : false;
			else dropbox("files/download", { path: fileName, responseType: "text" }, { onComplete: rtn, onError: fail });
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
						obj.id = Base64.hash(obj.email); //TODO depricate id
						APP.Sto.setItem(APP.Sto.LocalUserRef, JSON.stringify({ "alias": obj.name.display_name, "email": obj.email, "id": obj.id, "dbid": obj.account_id }));
						return ret(obj.name.display_name, obj.email, obj.id, obj.account_id);
					}
					else {
						return callback instanceof Function ? callback(false) : false;
					}
				}
				dropbox("users/get_account", null, newUser);
			}
			function gotOldUser(user) {
				console.log("found old cached version user, deleting, get new one from dropbox", user);
				user = JSON.parse(user);
				//TODO migrate user version

				APP.Sto.deleteItem(APP.Sto.LocalUserRef_old);
				tryDropbox();
			}
			function noCachedUser() {
				APP.Sto.getItem(APP.Sto.LocalUserRef_old, null, gotOldUser, tryDropbox);
			}
			password = password || "";
			if (WorkingOffline) return callback instanceof Function ? callback(false) : false;
			else {
				APP.Sto.getItem(APP.Sto.LocalUserRef, null, gotCachedUser, noCachedUser);
			}
		};
		DropboxSessionObj.prototype.login = function (password, successCallback, failureCallback) {
			function auth() {
				var redirectUri = cordova ? "https://www.dropbox.com/1/oauth2/redirect_receiver" : window.location.href.toLowerCase().split("#")[0];
				dropbox.authenticate({ client_id: CLIENT_ID, redirect_uri: redirectUri }, { "onComplete": initiate, "onError": failureCallback });
			}
			function initiate() {
				function gotUser(user) {
					if (user) return successCallback instanceof Function ? successCallback(user) : true;
					else return failureCallback instanceof Function ? failureCallback() : false;
				}
				_this.isAuthenticated = true;
				_this.getUserInfo(password, gotUser);
			}
			password = password || "";
			if (WorkingOffline) {//not possible when running locally
				var msg = "You can't login from a page hosted on your local file system";
				if (APP.notify) APP.notify(msg, true);
				else alert(msg);
				if (failureCallback instanceof Function) return failureCallback();
				else return;
			} else if (_this.isAuthenticated) initiate();
			else auth();
		};
		DropboxSessionObj.prototype.logout = function (callback) {
			function resetApp() {
				APP.Sto.deleteItem(APP.Sto.LocalUserRef);
				_this.isAuthenticated = false;
				return callback instanceof Function ? callback() : true;
			}
			dropbox("auth/token/revoke", null, resetApp);
		};
		DropboxSessionObj.prototype.share = function (fileName, fileContents, key, expires, callback) {
			var settings = {
				"requested_visibility": key ? "password" : "public",
				"audience": key ? "password" : "public",
				"access": "editor"
			};
			if (key) settings.link_password = key;
			if (expires) {
				if (expires instanceof Date) expires = expires.toISOString();
				settings.expires = expires;//"%Y-%m-%dT%H:%M:%SZ"
			}
			this.save("/shared/" + fileName, fileContents, key, function (ret) {
				console.log(ret, "saved file");
				dropbox("sharing/create_shared_link_with_settings", { "path": "/shared/" + fileName, "settings": settings }, callback);
			});
			dropbox("sharing/list_shared_links", { path: "/shared" }, function (ret) {
				console.log(ret);
				
			});
			//dropbox("sharing/create_shared_link_with_settings", { "path": fileName, "settings": settings }, callback);
		};
		DropboxSessionObj.prototype.revoke = function (fileName, callback) {
			dropbox("sharing/list_shared_links", { path: "/shared" }, function (ret) {
				console.log(ret);
			//	dropbox("sharing/revoke_shared_link", { "url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0" }, callback);
			});
		};
		DropboxSessionObj.prototype.recieve = function (fileName, key, callback) {
			dropbox("sharing/list_shared_links", { path: "/shared" }, function (ret) {
				console.log(ret);
				var settings = {
					"url": "https://www.dropbox.com/s/2sn712vy1ovegw8/Prime_Numbers.txt?dl=0",
					"path": fileName
				};
				if (key) settings.link_password = key;
			//	dropbox("sharing/get_shared_link_file", settings, callback);
			});
			
		};
		dropbox.setGlobalErrorHandler(dropboxError);
		this.isAuthenticated = false;
		var CLIENT_ID = client_id,
			// eslint-disable-next-line consistent-this
			_this = this;
		//try login
		if (!WorkingOffline) {
			if (localStorage.__dbat && localStorage.__dbat !== "") {
				this.isAuthenticated = true;
				//updateFileList();
				password = password || "";
				this.getUserInfo(password, callback);/*TODO password*/
			}
			//else check if returning oauth call with token
			else if (window.location.hash.match(/^#access_token=/)) {
				this.login(password, callback);
			}
			else if (callback instanceof Function) {
				return callback(false);
			}
		}
		else if (callback instanceof Function) return callback(false);
	};
	APP.initiateDropbox = function (client_id, password, callback) {
		return new DropboxSessionObj(client_id, password, callback);
	};
})();