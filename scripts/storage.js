var APP = APP || {}, Base64;
(function () {
	"use strict";
	var LOCAL = {},
		Version = 1.1,
		PreviousVersion = 1,
		WorkingOffline = function () {
			var loc = window.location;
			if (loc && (/^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://")) return true;
			else return false;
		}(),
		LocalStorageObj = function (tryLawnchairAdaptors) {
			this.LocalUserRef = "User" + Version;
			this.LocalUserRef_old = "User" + PreviousVersion;
			var _this = this;
			LocalStorageObj.prototype.setItem = function (refName, value, key) {
				function ret() {
					LOCAL[refName].save({ key: refName, data: value });
				}
				if (typeof value === "object") value = JSON.stringify(value);
				//if (console && console.log) console.log("setItem", refName, value, key);
				value = key ? Base64.write(value, key) : Base64.write(value);
				if (typeof LOCAL[refName] === "undefined" || LOCAL[refName] === null || !(LOCAL[refName] instanceof Lawnchair)) {
					LOCAL[refName] = new Lawnchair();
					return ret();
				}
				else return ret();
			};
			LocalStorageObj.prototype.getItem = function (refName, key, callback, doesntExistCallback) {
				function got(obj) {
					if (obj && obj.data) {
						var value = key ? Base64.read(obj.data, key) : Base64.read(obj.data);
						//if (console && console.log) console.log("getItem", refName, value, key);
						if (key && !value) return callback instanceof Function ? callback(null, "wrong key") : null;
						else return callback instanceof Function ? callback(value) : value;
					}
					else {
						if (doesntExistCallback instanceof Function) return doesntExistCallback();
						else return null;
					}
				}
				//try get cached value from the LOCAL object
				if (LOCAL[refName] && LOCAL[refName] instanceof Lawnchair) {
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
				Lawnchair(getAllKeys);
				LOCAL = {};
			};
			LocalStorageObj.prototype.deleteItem = function (refName) {
				function deleteRef() { this.remove(refName); }
				Lawnchair(deleteRef);
				if (LOCAL && LOCAL[refName]) LOCAL[refName] = {};
			};
		};
	APP.Sto = new LocalStorageObj();
	var DropboxSessionObj = function (client_id, password, callback) {
		function dropboxError(error) {
			if (error instanceof XMLHttpRequest) error = error.statusText;
			if (console && console.log) console.log("dropbox error:", error);
		}
		function updateFileList() {
			function gotFolder(obj) {
				fileList = obj;
				APP.Sto.setItem("fileList", JSON.stringify(obj));
			}
			APP.Sto.getItem("fileList", null, function (files) {
				fileList = JSON && JSON.parse ? JSON.parse(files) : $.parseJSON(files);
			}, function () {
				dropbox("files/list_folder", { path: "", recursive: true }, gotFolder);
			});
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
			function rtn(apiResponse, data, xhrobj) {
				if (data) {
					if (key) {
						data = Base64.read(data, key);
					}
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
		DropboxSessionObj.prototype.getUserInfo = function (password, callback) {
			function ret(alias, email, id, account_id) {
				APP.User = { "alias": alias, "email": email, "id": id, "dbid": account_id };
				console.log("returning user", APP.User);
				return callback instanceof Function ? callback(APP.User) : APP.User;
			}
			function gotCachedUser(user) {
				console.log("found cached user", user);
				user = JSON.parse(user);
				return ret(user.alias, user.email, user.id, user.dbid);
			}
			function tryDropbox() {
				console.log("getting user from dropbox");
				function newUser(obj) {
					console.log("got user", obj);
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
				//migrate user version

				APP.Sto.deleteItem(APP.Sto.LocalUserRef_old);
				tryDropbox();
			}
			function noCachedUser() {
				console.log("didn't find cached user, try old cache version");
				APP.Sto.getItem(APP.Sto.LocalUserRef_old, null, gotOldUser, tryDropbox);
			}
			password = password || "";
			if (WorkingOffline) return callback instanceof Function ? callback(false) : false;
			else {
				console.log("getting user");
				if (APP.User && APP.User.alias && APP.User.email && APP.User.id && APP.User.dbid) {	//Found cached User
					//sync cached user with localStorage user
					console.log("found active user", APP.User);
					APP.Sto.setItem(APP.Sto.LocalUserRef, JSON.stringify(APP.User));
					return ret(APP.User.alias, APP.User.email, APP.User.id, APP.User.dbid);
				}
				else APP.Sto.getItem(APP.Sto.LocalUserRef, null, gotCachedUser, noCachedUser);
			}
		};
		DropboxSessionObj.prototype.login = function (password, successCallback, failureCallback) {
			function auth() {
				var redirectUri = cordova ? "https://www.dropbox.com/1/oauth2/redirect_receiver" : window.location.href.toLowerCase();
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
			} else if (this.isAuthenticated) initiate();
			else auth();
		};
		DropboxSessionObj.prototype.logout = function (callback) {
			function resetApp() {
				APP.User = {};
				APP.Sto.deleteItem(APP.Sto.LocalUserRef);
				_this.isAuthenticated = false;
				return callback instanceof Function ? callback() : true;
			}
			dropbox("auth/token/revoke", null, resetApp);
		};
		dropbox.setGlobalErrorHandler(dropboxError);
		this.isAuthenticated = false;
		var _this = this,
			CLIENT_ID = client_id,
			fileList = [];
		//try login
		if (!WorkingOffline) {
			//check if token is already cached
			if (localStorage.__dbat && localStorage.__dbat !== "") {
				console.log("got cached dropbox token", localStorage.__dbat);
				this.isAuthenticated = true;
				//updateFileList();
				password = password || "";
				this.getUserInfo(password, callback);/*TODO password*/
			}
			//else check if returning oauth call with token
			else if (window.location.hash.match(/^#access_token=/)) {
				console.log("returning from oath call with dropbox login token");
				this.login(password, callback);
			}
			else if (callback instanceof Function) {
				console.log("no dropbox token");
				return callback(false);
			}
		}
		else if (callback instanceof Function) return callback(false);
	};
	APP.initiateDropbox = function (client_id, password, callback) {
		return new DropboxSessionObj(client_id, password, callback);
	};
})();