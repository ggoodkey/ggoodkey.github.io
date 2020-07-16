/* eslint-disable complexity */
importScripts('base64.js');
importScripts('validate.js');
importScripts('lists.js');
importScripts('nyckelDB.js');
importScripts('Lawnchair.js');
importScripts('adapters/indexed-db.js');
importScripts('storage.js');
/*global NyckelDB, Base64*/
function ab2str(buffer) {
	var bufView = new Uint16Array(buffer),
		length = bufView.length,
		result = '',
		addition = Math.pow(2, 14) - 1;//(or 16383) max value in Edge before throwing error

	for (var i = 0; i < length; i += addition) {
		if (i + addition > length) {
			addition = length - i;
		}
		result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
	}
	return result;
}
function str2ab(str) {
	var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
	var bufView = new Uint16Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}
// stub undefined APP methods.
var method,
	noop = function () { },
	methods = ["confirm"],//list of methods that don't exisit/haven't been ported to webworker context
	length = methods.length,
	appData = {},
	callbackQueue = [],
	//globals
	APP = APP || {}, VAL;
while (length--) {
	method = methods[length];
	if (!APP[method]) {
		APP[method] = noop;
	}
}
self.addEventListener('message', function (e) {
	function debug(msg, description) {
		var arrBuffer = str2ab(JSON.stringify({ "type": "debug", "message": msg, "description": description }));
		self.postMessage(arrBuffer, [arrBuffer]);
	}
	function post(msg, args, callbackIndex) {
		var obj = { "type": "result", "message": msg, "cmd": data.cmd, "time": data.time };
		if (args) obj.args = JSON.stringify(args);
		if (callbackIndex) obj.callbackIndex = callbackIndex;
		obj.len = JSON.stringify(obj).length;
		var arrBuffer = str2ab(JSON.stringify(obj));
		self.postMessage(arrBuffer, [arrBuffer]);
		obj = null;
	}
	APP.notify = function (msg, fadeOut) {
		var arrBuffer = str2ab(JSON.stringify({ "type": "notify", "message": msg, "fadeOut": fadeOut }));
		self.postMessage(arrBuffer, [arrBuffer]);
	};
	/*
	APP.Sto = {
		setItem: function (refName, value, key) {
			var arrBuffer = str2ab(JSON.stringify({
				"type": "setItem",
				"args": [refName, value, key],
				"len": JSON.stringify({ "type": "setItem", "args": [refName, value, key] })
			}));
			self.postMessage(arrBuffer, [arrBuffer]);
		},
		getItem: function (refName, key, callback, doesntExistCallback) {
			var callbackIndex = false, doesntExistCallbackIndex = false;
			if (callback) {
				callbackQueue.push(callback);
				callbackIndex = callbackQueue.length - 1;
			}
			if (doesntExistCallback) {
				callbackQueue.push(doesntExistCallback);
				doesntExistCallbackIndex = callbackQueue.length - 1;
			}
			var arrBuffer = str2ab(JSON.stringify({
				"type": "getItem",
				"args": [refName, key],
				"callbackIndex": callbackIndex,
				"doesntExistCallbackIndex": doesntExistCallbackIndex,
				"len": JSON.stringify({ "type": "getItem", "args": [refName, key], "callbackIndex": callbackIndex, "doesntExistCallbackIndex": doesntExistCallbackIndex })
			}));
			self.postMessage(arrBuffer, [arrBuffer]);
		},
		nuke: noop,
		deleteItem: function (key) {
			var arrBuffer = str2ab(JSON.stringify({ "type": "deleteItem", "args": [key] }));
			self.postMessage(arrBuffer, [arrBuffer]);
		}
	};*/
	function initNewNyckelDB(title, args, callback) {
		appData[title] = new NyckelDB(args[0], args[1]);
		appData[title].init(args[2], args[3], args[4], callback);
	}
	var data = ab2str(e.data);
	data = JSON.parse(data);
	if (data) {
		if (data.time) console.log((new Date().getTime() - data.time) / 1000 + "s", "to post message to webWorker", data.cmd, data.len);
		if (data.title) data.title = VAL.toPropName(data.title);
		switch (data.cmd) {
			case "initNewNyckelDB":
				initNewNyckelDB(data.title, data.args, function (success, errors, title, syncPending) {
					post(success, [success, errors, title, syncPending], data.callbackIndex);
				});
				break;
			//no arguments, returns 1 value
			case "getTitle":
			case "toCSV"://function not complete => may need to be moved when it is
			case "toJSON_Array":
			case "toJSON_KeyValuePairs"://function not complete => may need to move
			case "getLength":
			case "isDeleted":
			case "shuffle":
			case "unhideRows":
			case "unfilter":
			case "getLastModified":
			case "getHeaders":
			case "getTypes":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else post(appData[data.title][data.cmd](), null, data.callbackIndex);
				break;
			//1 argument, returns 1 value
			case "getProp":
			case "hideRow":
			case "deleteRow":
			case "getType":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else post(appData[data.title][data.cmd](data.args[0]), null, data.callbackIndex);
				break;
			//2 arguments, returns 1 value
			case "getVal":
			case "filter":
			case "setProp":
			case "addRow":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else post(appData[data.title][data.cmd](data.args[0], data.args[1]), null, data.callbackIndex);
				break;
			//3 arguments, returns 1 value
			case "getIndexOf":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else post(appData[data.title][data.cmd](data.args[0], data.args[1], data.args[2]), null, data.callbackIndex);
				break;
			//functions with callbacks as last argument
			//1 callback argument, returns success, errors, title and syncPending to callback
			case "deleteTable":
			case "getRowTemplate":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else {
					appData[data.title][data.cmd](function (success, errors, title, syncPending) {
						post(success, [success, errors, title, syncPending], data.callbackIndex);
					});
				}
				break;
			//2 arguments including callback, returns success, errors, title and syncPending to callback
			case "setTitle":
			case "NUKEALL":
			case "isSyncPending":
			case "setSyncCompleted":
			case "getRow":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else {
					appData[data.title][data.cmd](data.args[0], function (success, errors, title, syncPending) {
						post(success, [success, errors, title, syncPending], data.callbackIndex);
					});
				}
				break;
			//3 arguments including callback, returns success, errors, title and syncPending to callback
			case "sync":
			case "search":
			case "setVals":
			case "sortByCol":
			case "advancedSearch":
			case "importJSON":
			case "getVals":
			case "getSearchSuggestions":
			case "validate"://returns updatedValue, errors, errorDetails, syncPending 
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else {
					appData[data.title][data.cmd](data.args[0], data.args[1], function (success, errors, title, syncPending) {
						post(success, [success, errors, title, syncPending], data.callbackIndex);
					});
				}
				break;
			//4 argumants including callback, returns success, errors, title and syncPending to callback	
			case "setVal":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else {
					appData[data.title][data.cmd](data.args[0], data.args[1], data.args[2], function (success, errors, title, syncPending) {
						post(success, [success, errors, title, syncPending], data.callbackIndex);
					});
				}
				break;
			//functions with repeating callbacks
			case "forEachRow":
			case "forEachCol":
				if (!appData[data.title]) debug(data.title + " table not initiated");
				else appData[data.title][data.cmd](function (msg, index, length) {
					var arrBuffer = str2ab(JSON.stringify({
						"type": "forEach",
						"message": msg,
						"progress": index,
						"total": length,
						"callbackIndex": data.callbackIndex,
						"cmd": data.cmd,
						"time": data.time
					}));
					self.postMessage(arrBuffer, [arrBuffer]);
				}, function finished(success, errors, title, syncPending) {
					var arrBuffer = str2ab(JSON.stringify(
						{
							"type": "finished",
							"message": success,
							"args": JSON.stringify([success, errors, title, syncPending]),
							"finalCallbackIndex": data.finalCallbackIndex,
							"cmd": data.cmd,
							"time": data.time
						}
					));
					self.postMessage(arrBuffer, [arrBuffer]);
				});
				break;
			case "read":
			case "write":
			case "readShared":
				post(Base64[data.cmd](data.args[0], data.args[1]));
				break;
			case "share":
				post(Base64.share(data.args[0], data.args[1], data.args[2], data.args[3]));
				break;
			
			//localStorage functions
			case "getItemCallback":
				callbackQueue[data.callbackIndex](data.message, data.error);
				callbackQueue[data.callbackIndex] = null;
				break;
			case "getItemDoesntExistCallback":
				callbackQueue[data.doesntExistCallbackIndex]();
				callbackQueue[data.doesntExistCallbackIndex] = null;
				break;
			//webworker functions
			case "exists":
				post(typeof appData[data.title] !== "undefined", null, data.callbackIndex);
				break;
			case "stop":
				post("worker stopped", null, data.callbackIndex);
				self.close();
				break;
			default:
				debug(data.cmd, "invalid cmd");
		}
	}
	else debug("no data passed to worker");
}, false);