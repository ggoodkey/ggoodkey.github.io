var APP, VAL, Base64, appData = {}, Windows, cordova;//dependancies
(function () {
	"use strict";
	APP.setDebugMode(true);//set to true to use the debugger during development, or type "debugmode" into the searchbar to activate debugmode
	const DROPBOX_CLIENT_ID = "jk6tb5tp76hs2tx",//get new client id from https://www.dropbox.com/developers
		APP_VERSION = "0.0.1";//increment on major (esp breaking) changes, to force localStorage app state to refresh on load
	var views = ["viewNew", "viewRecent", "viewSearch", "viewDetails", "viewEdit", "view1", "view2", "view3", "view4"], //don't change these
		viewNames = ["New Table", "Recent", "Search Results", "Details", "Edit", "Contacts", "Groups", "Passwords", "Files"], //change these to rename views
		viewIcons = ["icon-plus", "icon-time", null, null, null, "icon-user", "icon-people", "icon-lock", "icon-folder-open"], //change icons, see index.css for all possible icon classes
		startView = 1,//change this to show different view on load, see views above
		backstack = [views[startView]],
		backIndex = 1,
		debug = APP.debug,//shortform access to APP.debug
		fileReaderInitiated = [],
		dataTemplates = {//add, remove or edit NyckelDB dataTemplates to suit your app needs. Examples below for contacts, passwords, files and groups NyckelDB databases
			Contacts: {
				headers: ["Name", "GivenName", "AdditionalName", "FamilyName", "YomiName", "GivenNameYomi", "AdditionalNameYomi",
					"FamilyNameYomi", "NamePrefix", "NameSuffix", "Initials", "Nickname", "ShortName", "MaidenName", "Birthday", "Gender",
					"Location", "BillingInformation", "DirectoryServer", "Mileage", "Occupation", "Hobby", "Sensitivity", "Priority", "Subject",
					"Notes", "Language", "Photo", "GroupMembership", "E_mail1_Type", "E_mail1_Value", "E_mail2_Type", "E_mail2_Value", "E_mail3_Type",
					"E_mail3_Value", "E_mail4_Type", "E_mail4_Value", "E_mail5_Type", "E_mail5_Value", "E_mail6_Type", "E_mail6_Value",
					"E_mail7_Type", "E_mail7_Value", "Phone1_Type", "Phone1_Value", "Phone2_Type", "Phone2_Value", "Phone3_Type", "Phone3_Value", "Phone4_Type",
					"Phone4_Value", "Phone5_Type", "Phone5_Value", "Phone6_Type", "Phone6_Value", "Phone7_Type", "Phone7_Value",
					"Phone8_Type", "Phone8_Value", "Phone9_Type", "Phone9_Value", "Phone10_Type", "Phone10_Value", "Address1_Type",
					"Address1_Formatted", "Address1_Street", "Address1_City", "Address1_POBox", "Address1_Region", "Address1_PostalCode",
					"Address1_Country", "Address1_ExtendedAddress", "Address2_Type", "Address2_Formatted", "Address2_Street", "Address2_City",
					"Address2_POBox", "Address2_Region", "Address2_PostalCode", "Address2_Country", "Address2_ExtendedAddress",
					"Organization1_Type", "Organization1_Name", "Organization1_YomiName", "Organization1_Title", "Organization1_Department",
					"Organization1_Symbol", "Organization1_Location", "Organization1_JobDescription", "Website1_Type", "Website1_Value"],
				types: ["string", "givenName", "givenName", "familyName", "string", "givenName", "givenName", "familyName", "string",
					"string", "string", "string", "string", "familyName", "date", "string", "geoLocation", "string", "string", "string",
					"string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "email", "string", "email", "string",
					"email", "string", "email", "string", "email", "string", "email", "string", "email", "string", "phoneNumber", "string", "phoneNumber",
					"string", "phoneNumber", "string", "phoneNumber", "string", "phoneNumber", "string", "phoneNumber", "string",
					"phoneNumber", "string", "phoneNumber", "string", "phoneNumber", "string", "phoneNumber", "string", "string",
					"streetAddress", "cityCounty", "mailAddress", "provinceStateRegion", "postalZipCode", "country", "string",
					"string", "string", "streetAddress", "cityCounty", "mailAddress", "provinceStateRegion", "postalZipCode",
					"country", "string", "string", "string", "string", "string", "string", "string", "geoLocation", "string", "string", "string"],
				options: {
					customProperties: {
						"localization": {
							initialValue: "en-CA",
							type: "string"
						}
					},
					doNotIndex: ["Photo", "E_mail1_Type", "E_mail2_Type", "E_mail3_Type", "E_mail4_Type", "E_mail5_Type", "E_mail6_Type", "E_mail7_Type",
						"Phone1_Type", "Phone2_Type", "Phone3_Type", "Phone4_Type", "Phone5_Type", "Phone6_Type", "Phone7_Type", "Phone8_Type", "Phone9_Type", "Phone10_Type",
						"Address1_Type", "Address2_Type", "Website1_Type"],
					initialIndex: ["Name", "GivenName", "AdditionalName", "FamilyName", "Nickname", "ShortName", "MaidenName",
						"E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value", "E_mail6_Value", "E_mail7_Value", "Address1_City", "Address2_City",
						"Address1_Region", "Address2_Region", "Organization1_Name", "Organization1_Title", "Organization1_Department"]
				},
				display: {
					searchResultsText: ["FamilyName", "GivenName"],
					searchResultsJoiner: ", ",
					sortBy: "FamilyName",
					detailsView: {},
					editView: {}
				}
			},
			Passwords: {
				headers: ["Site", "Username", "Password", "Alias", "DateCreated"],
				types: ["string", "string", "string", "string", "date"],
				options: {
					customProperties: {
					},
					doNotIndex: ["Password", "DateCreated"],
					initialIndex: ["Site", "Username", "Alias"]
				},
				display: {
					searchResultsText: ["Site", "Username"],
					searchResultsJoiner: ": ",
					sortBy: "Site",
					detailsView: {},
					editView: {}
				}
			},
			Files: {
				headers: ["Display Name", "Name", "Extension", "Type", "Original Size", "Compressed Size", "Compression", "Created", "Modified", "Owner", "Hash", "Compressed Contents"],
				types: ["string", "string", "string", "string", "posInteger", "posInteger", "string", "date", "date", "string", "string", "string"],
				options: {
					customProperties: {
					},
					doNotIndex: ["Display Name", "Extension", "Type", "Original Size", "Compression", "Compressed Size", "Created", "Modified", "Hash", "Compressed Contents"],
					initialIndex: ["Name"]
				},
				display: {
					searchResultsText: ["Display Name"],
					detailsView: {},
					editView: {}
				}
			},
			Groups: {
				headers: ["groupName", "groupIds", "searchTerms"],
				types: ["string", "string", "string"],
				options: {
					customProperties: {
					},
					doNotIndex: ["groupIds", "searchTerms"],
					initialIndex: ["groupName"]
				},
				display: {
					searchResultsText: ["groupName"],
					detailsView: {},
					editView: {}
				}
			}
		},
		//set default searchable columns from dataTemplates above
		searchableColumns = ["Name", "Owner", "Site", "Username", "Alias", "GivenName", "AdditionalName", "FamilyName", "Nickname", "ShortName", "MaidenName",
			"E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value", "E_mail6_Value", "E_mail7_Value", "Address1_City", "Address2_City",
			"Address1_Region", "Address2_Region", "Organization1_Name", "Organization1_Title", "Organization1_Department", "groupName"],
		state = {//vue.js variables
			version: APP_VERSION,
			views: views,
			viewNames: viewNames,
			viewIcons: viewIcons,
			viewTransition: false,
			viewTransitionDone: true,
			currentView: viewNames[startView],
			backArrow: false,
			spinner: false,
			spinnerMsg: ["Working..."],
			spinIndex: 0,
			viewNew: views.indexOf("viewNew") === startView,
			viewRecent: views.indexOf("viewRecent") === startView,
			view1: views.indexOf("view1") === startView,
			view2: views.indexOf("view2") === startView,
			view3: views.indexOf("view3") === startView,
			view4: views.indexOf("view4") === startView,
			viewSearch: false,
			viewDetails: false,
			viewEdit: false,
			splitView: false,
			showSearchBar: false,
			showSearchSuggestions: false,
			showSideNav: false,
			showSettings: false,
			windows: false,
			darkTheme: false,
			useWindowsTheme: false,
			windowsDarkTheme: false,
			showConfirm: false,
			confirmMsg: "Are you sure?",
			confirmOK: "OK",
			confirmCancel: "Cancel",
			confirmFunction: function () { },
			confirmShake: false,
			showNotify: false,
			notifyActivated: 0,
			notifyMsg: "Notification",
			dropboxUsername: "",
			dropboxEmail: "",
			loggedIn: false,
			searchBox: "",
			searchAutoComplete: "",
			searchSuggestions: [],
			searchPointer: -1,
			searchResults: [],
			selectSearchResults: false,
			searchResultsTitle: "Search Results",
			searchResultsError: "Nothing here yet... try searching for something.",
			currentQuery: "",
			stoKey: "unknown",
			showStoKeyInput: false,
			stoKeyWarning: "",
			details: [],
			recentlyViewed: [],
			showUpdateKey: false,
			groups: [],
			groupName: "",
			groupSearchBox: "",
			showNewGroupUI: false,
			showEditGroupUI: false,
			activeGroup: [],
			addItemToGroupDropdown: false,
			addSearchToGroupDropdown: false,
			groupPage: 1,
			groupHelp: false,
			newTable: {
				title: "",
				headers: ["","","",""],
				types: ["string","string","string", "string"],
				options: {
					customProperties: {},
					doNotIndex: [],
					initialIndex: []
				},		
				display: {
					searchResultsText: [],
					searchResultsJoiner: " ",
					sortBy: "",
					detailsView: {},
					editView: {}
				},
				validTypes: ["any", "number", "integer", "posInteger", "negInteger", "boolean", "string", "uniqueString", "date", "email", "phoneNumber", "password", "streetAddress", "mailAddress", "cityCounty", "provinceStateRegion", "country", "postalZipCode", "givenName", "familyName", "geoLocation", "longitude", "latitude"],
				typeDropdown: -1,
				optionsDropdown: -1,
				fullscreen: false
			}
		},
		WorkingOffline = function () {
			var loc = window.location;
			if (/^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://") return true;
			else return false;
		}(),
		trim = function (str) {
			str = String(str);
			while (/\s\s/g.test(str)) str = str.replace(/\s\s/g, " ");
			if (str === " ") return "";
			return str.replace(/^\s+|\s+$/gm, "");
		},
		deleteDuplicates = function (arr) {
			for (var x = 0, len = arr.length; x < len - 1; x++) {
				for (var y = x + 1; y < len; y++) {
					if (String(arr[x]) === String(arr[y])) {
						arr.splice(y, 1);
						len--;
						y--;
					}
				}
			}
			return arr;
		},
		layout = function () {
			var width = getWidth(),
				height = getHeight(),
				type = "tabl",
				orientation = " port ",
				htmlTag = document.getElementsByTagName("html")[0];
			if (width > 1200) type = "desk";
			if (width <= 640) type = "phon";
			if (height < width && width > 360) orientation = " land ";
			htmlTag.className = trim(type + orientation + htmlTag.className.replace(/desk|tabl|phon|port|land/g, ""));
		},
		//web worker manager (wwManager) handles access to NyckelDB and Base64 web worker queue
		//and offline senarios where web workers are not available
		webWorker,
		wwCallbackQueue = [],
		wwCallbackIndex = 0,
		/*obj{
		 * "cmd": "read" "parseCSV" "merge" etc,
		 * "args": [Array of arguments accepted by the cmd]
		 * "title": if accessing a NyckelDB database
		 * }
		 */
		wwManager = function (obj, callback, finalCallback) {
			function str2ab(str) {
				var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
				var bufView = new Uint16Array(buf);
				for (var i = 0, strLen = str.length; i < strLen; i++) {
					bufView[i] = str.charCodeAt(i);
				}
				return buf;
			}
			function startWorker() {
				if (typeof webWorker === "undefined") {
					webWorker = new Worker("scripts/webworker.js");
					webWorker.addEventListener('message', wwReadMessage, false);
					webWorker.addEventListener('error', wwOnError, false);
				}
				if (callback && callback instanceof Function) {
					obj.callbackIndex = ++wwCallbackIndex;
					wwCallbackQueue[wwCallbackIndex] = callback;
				}
				if (finalCallback && finalCallback instanceof Function) {
					obj.finalCallbackIndex = ++wwCallbackIndex;
					wwCallbackQueue[wwCallbackIndex] = finalCallback;
				}
				var arrBuffer = str2ab(JSON.stringify(obj));
				webWorker.postMessage(arrBuffer, [arrBuffer]);
				obj = null;
			}
			if (typeof Worker !== "undefined" && !WorkingOffline) {
				startWorker();
			}
			//no web workers available
			else {
				if (obj.args && callback) obj.args.push(callback);
				if (obj.title && obj.cmd) {
					var title = VAL.toPropName(obj.title);
					if (obj.cmd === "initNewNyckelDB") appData[title] = new APP.nyckelDB(obj.args[0], obj.args[1], obj.args[2], obj.args[3], callback);
					else if (!appData[title]) {
						debug(obj.args, "couldn't complete '" + obj.cmd + "' because '" + obj.title + "' database has not been successfully initialized");
						return null;
					}
					else if (!appData[title][obj.cmd]) {
						debug(obj.cmd, "invalid command called on " + obj.title);
						return null;
					}
					else if (obj.cmd === "forEachCol" || obj.cmd === "forEachRow") appData[title][obj.cmd](callback, finalCallback);
					else if (callback) {
						switch (obj.cmd) {
							case "deleteTable":
							case "setTitle":
							case "NUKEALL":
							case "isSyncPending":
							case "sync":
							case "importJSON":
							case "search":
							case "getVals":
							case "getSearchSuggestions":
								return appData[title][obj.cmd].apply(appData[title], obj.args);
							default:
								return callback(appData[title][obj.cmd].apply(appData[title], obj.args));
						}
					}
					else return appData[title][obj.cmd].apply(appData[title], obj.args);
				}
				else if (obj.cmd) {
					debug(obj.cmd, "cmd");
					Base64[obj.cmd].apply(null, obj.args);
				}
			}
		},
		wwReadMessage = function (e) {
			function ab2str(buffer) {
				var bufView = new Uint16Array(buffer),
					length = bufView.length,
					result = '',
					addition = Math.pow(2, 15);//max value in Edge before throwing error

				for (var i = 0; i < length; i += addition) {
					if (i + addition > length) {
						addition = length - i;
					}
					result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
				}
				return result;
			}
			var data = ab2str(e.data);
			data = JSON.parse(data);
			switch (data.type) {
				case "debug":
					data.description = "web worker: " + (data.description || "");
					debug(data.message, data.description);
					break;
				case "notify":
					app.notify(data.message, data.fadeOut);
					break;
				case "forEach":
					if (data.callbackIndex) wwCallbackQueue[data.callbackIndex](data.message, data.progress, data.total);
					
					else debug(data.message, "no forEach callback found");
					break;
				case "result":
					if (data.callbackIndex) {
						if (data.args) wwCallbackQueue[data.callbackIndex].apply(null, JSON.parse(data.args));
						else wwCallbackQueue[data.callbackIndex](data.message);
					}
					else {
						debug(data.message, "no result callback found");
						return data.message;
					}
					break;
				case "finished":
					if (data.finalCallbackIndex) {
						if (data.args) wwCallbackQueue[data.finalCallbackIndex].apply(null, JSON.parse(data.args));
						else wwCallbackQueue[data.finalCallbackIndex](data.message);
					}
					else debug(data.message, "finished but no callback found");
					break;
				case "setItem":
				case "deleteItem":
					APP.Sto[data.type].apply(null, data.args);
					break;
				case "getItem":
					APP.Sto.getItem(data.args[0], data.args[1], function (value, error) {
						if (data.callbackIndex !== false) wwManager({ "cmd": "getItemCallback", "message": value, "error": error, "callbackIndex": data.callbackIndex });
					}, function () {
						if (data.doesntExistCallbackIndex !== false) wwManager({ "cmd": "getItemDoesntExistCallback", "doesntExistCallbackIndex": data.doesntExistCallbackIndex });
					});
					break;
				case "progress":
				case "confirm":
				default://other types of data
					debug(data.type, "webworker response type not supported");
			}
		},
		wwOnError = function (e) {
			debug(e.message, "Web Worker error: " + e.filename + ': ' + e.lineno);
		},
		defaultErrorHandler = function (success, errors, title, syncPending) {
			if (errors === "wrong key used") {
				_this.notify("Wrong key used", true);
				_this.updateStoKey();
			}
			else if (/unsupported version/.test(errors)) {
				_this.notify("File found is from a newer version of the app. Please update your app to the latest version.");
			}
			else {
				_this.notify("Unknown error", true);
				debug(errors, "errors");
			}
		},
		//initialise the application
		init = function (resumeBool) {
			function tryDropbox(cachedStoKey) {
				function applyUser(user) {
					if (user) {
						app.dropboxUsername = user.alias;
						app.dropboxEmail = user.email;
						app.loggedIn = true;
					}
				}
				APP.Dbx = APP.initiateDropbox(DROPBOX_CLIENT_ID, cachedStoKey, applyUser);
			}
			function getLocal() {
				APP.Sto.getItem("state", null, function (s, error) {
					if (s) {
						if (typeof s === "string" && JSON.parse) s = JSON.parse(s);
						if (s.version === app.version) {
							for (var prop in state) {
								if (s[prop] !== undefined) {
									if (prop === "recentlyViewed") app[prop] = sortList(s[prop]);
									else app[prop] = s[prop];
								}
							}
							if (resumeBool && s.time && new Date().getTime() - s.time < 864e5) {
								//resume view and back history
								backstack = s.backstack;
								backIndex = s.backIndex;
								app.currentView = app.viewNames[app.views.indexOf(backstack[backIndex - 1])];
								for (var a = 0, len = app.views.length; a < len; a++) {
									app[app.views[a]] = backstack[backIndex - 1] === app.views[a];
								}
								//TODO resume view content
							}
							if (!s.stoKey) {
								APP.Sto.getItem("stoKey", null, function (k) {
									app.stoKey = k;
									APP.Sto.deleteItem("stoKey");
									tryDropbox(k);
								});
							}
							else {
								tryDropbox(s.stoKey);
								APP.Sto.deleteItem("stoKey");
							}
						}
						else {
							app.notify("App version has changed from " + s.version + " to " + app.version + ". Resetting app settings to default values.");
							// migrate older version state data here
							APP.Sto.deleteItem("state");
						}
						
					} else if (error) {
						debug(error, "error getting app state");
					} else {
						debug(s, "state not found");
						APP.Sto.deleteItem("state");
					}
				});
			}
			layout();
			document.getElementById("loading").className = "done"; //app is rendered so fade in from black
			getLocal();
			if (typeof Worker !== "undefined" && !WorkingOffline && typeof webWorker === "undefined") {
				webWorker = new Worker("scripts/webworker.js");
				webWorker.addEventListener('message', wwReadMessage, false);
				webWorker.addEventListener('error', wwOnError, false);
			}
			matchWindowsTheme();
			checkDBLoaded();
			updateWindowsLiveTile();
		},
		//Windows specific functions
		windowsAccentColor = [false, false, false, false, false, false, false],
		matchWindowsTheme = function () {
			function updateUI() {
				if (state.useWindowsTheme) {
					if (backgroundColor.r === 0 && backgroundColor.g === 0 && backgroundColor.b === 0) state.windowsDarkTheme = true;
					else state.windowsDarkTheme = false;
				}
				for (var d = 0; d < windowsAccentColor.length; d++) {
					for (var a = 0; a < styleSheets.length; a++) {
						var rules = styleSheets[a].cssRules || styleSheets[a].rules;
						for (var b = 0, len = styleSheets[a].cssRules.length; b < len; b++) {
							var rule = rules[b].cssText;
							if (oldColorString[d].test(rule)) {
								rule = rule.split("{");
								var styles = rule[1].replace(/\}/, "").split(";");
								for (var c = 0; c < styles.length - 1; c++) {
									styles[c] = styles[c].replace(oldColorString[d], cssColorString[d]).split(":");
									rules[b].style[trim(styles[c][0])] = trim(styles[c][1]);
								}
							}
						}
					}
				}
			}
			if (Windows) {
				//Windows specific code
				var accentColor = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accent),
					accentDark1 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentDark1),
					accentDark2 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentDark2),
					accentDark3 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentDark3),
					accentLight1 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentLight1),
					accentLight2 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentLight2),
					accentLight3 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentLight3),
					backgroundColor = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.background),
					cssColorString = [
						accentColor.r + ", " + accentColor.g + ", " + accentColor.b,
						accentDark1.r + ", " + accentDark1.g + ", " + accentDark1.b,
						accentDark2.r + ", " + accentDark2.g + ", " + accentDark2.b,
						accentDark3.r + ", " + accentDark3.g + ", " + accentDark3.b,
						accentLight1.r + ", " + accentLight1.g + ", " + accentLight1.b,
						accentLight2.r + ", " + accentLight2.g + ", " + accentLight2.b,
						accentLight3.r + ", " + accentLight3.g + ", " + accentLight3.b
					],
					oldColorString = [
						new RegExp(windowsAccentColor[0] || "71, 140, 219", "g"),
						new RegExp(windowsAccentColor[1] || "49, 126, 214", "g"),
						new RegExp(windowsAccentColor[2] || "41, 114, 197", "g"),
						new RegExp(windowsAccentColor[3] || "38, 97, 164", "g"),
						new RegExp(windowsAccentColor[4] || "84, 152, 231", "g"),
						new RegExp(windowsAccentColor[5] || "112, 166, 228", "g"),
						new RegExp(windowsAccentColor[6] || "153, 185, 223", "g")
					],
					styleSheets = document.styleSheets;
				updateUI();
				windowsAccentColor = cssColorString;
			}
		},
		updateWindowsLiveTile = function (content, image) {
			if (typeof Windows !== 'undefined' &&
				typeof Windows.UI !== 'undefined' &&
				typeof Windows.UI.Notifications !== 'undefined') {
				var tileContent = new Windows.Data.Xml.Dom.XmlDocument();

				var tile = tileContent.createElement("tile");
				tileContent.appendChild(tile);

				var visual = tileContent.createElement("visual");
				tile.appendChild(visual);

				var bindingMedium = tileContent.createElement("binding");
				bindingMedium.setAttribute("template", "TileMedium");
				visual.appendChild(bindingMedium);

				var peekImage = tileContent.createElement("image");
				peekImage.setAttribute("placement", "peek");
				peekImage.setAttribute("src", "https://unsplash.it/150/150/?random");
				peekImage.setAttribute("alt", "Random demo image");
				bindingMedium.appendChild(peekImage);

				var text = tileContent.createElement("text");
				text.setAttribute("hint-wrap", "true");
				text.innerText = "Demo Message";
				bindingMedium.appendChild(text);

				// TODO: Add other tile size bindings, like Wide and Large

				var notifications = Windows.UI.Notifications;
				var tileNotification = new notifications.TileNotification(tileContent);
				notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
			}
		},
		sendWindowsNotification = function (message, icon) {
			if (typeof Windows !== 'undefined' &&
				typeof Windows.UI !== 'undefined' &&
				typeof Windows.UI.Notifications !== 'undefined') {
				var toastContent = new Windows.Data.Xml.Dom.XmlDocument();

				var toast = toastContent.createElement("toast");
				toastContent.appendChild(toast);

				var visual = toastContent.createElement("visual");
				toast.appendChild(visual);

				var binding = toastContent.createElement("binding");
				binding.setAttribute("template", "ToastGeneric");
				visual.appendChild(binding);

				// Title text
				var text = toastContent.createElement("text");
				text.innerText = "This is the message for my toast";
				binding.appendChild(text);

				// TODO: Add up to two more text elements

				// Override the app logo
				var appLogo = toastContent.createElement("image");
				appLogo.setAttribute("placement", "appLogoOverride");
				appLogo.setAttribute("src", "https://unsplash.it/150/150/?random");
				appLogo.setAttribute("alt", "random graphic");
				binding.appendChild(appLogo);

				var notifications = Windows.UI.Notifications;
				var notification = new notifications.ToastNotification(toastContent);
				notifications.ToastNotificationManager.createToastNotifier().show(notification);
			}
		},
		//load NyckelDB databases
		loadDB = true,
		loadDBQueue = [],
		loadDBQueueIndex = 0,
		loadingDB = false,
		loadingDBRequiresSync = false,
		checkDBLoaded = function (callback) {
			function initDB(title, template, dbNum, numOfTables) {
				function handleErrors(errors) {
					if (errors === "wrong key used") {
						debug(app.stoKey, "wrong key used");
						app.updateStoKey();
					}
					else if (/unsupported version/.test(errors)) {
						app.notify("File found was written with a newer version of the app. Please update your app to the latest version.");
					}
					else debug(errors, "loading " + title);
				}
				template.options.syncKey = app.stoKey === "unknown" && APP.User ? APP.User.dbid ? Base64.hash(APP.User.dbid) : Base64.hash(APP.User.email) : app.stoKey;
				var cb = function (success, errors, title, requiresSync) {//default callback function for handling errors initialising NyckelDB
					if (errors) handleErrors(errors);
				};
				if (numOfTables === dbNum + 1) {
					cb = function (success, errors, title, requiresSync) {//final callback function for last NyckelDB to initialise
						if (errors) handleErrors(errors);
						if (!WorkingOffline) {
							app.syncAll();
						}
						else app.spin(false);
						loadDB = false;
						loadDBQueueIndex--;	
						if (loadDBQueueIndex < 0) return;
						else return loadDBQueueIndex > 0 ? loadDBQueue[loadDBQueueIndex](cb) : loadDBQueue[loadDBQueueIndex]();
					};
				}
				wwManager({ "cmd": "initNewNyckelDB", "title": title, "args": [title, template.headers, template.types, template.options] }, cb);
			}
			function getTables() {
				var numOfTables = 0,
					b = 0;
				for (var template in dataTemplates) {
					numOfTables++;
				}
				for (var templateName in dataTemplates) {
					if (dataTemplates.hasOwnProperty(templateName)) {
						initDB(templateName, dataTemplates[templateName], b, numOfTables);
						b++;
					}
				}
			}
			if (loadDB) {
				if (callback instanceof Function) {
					loadDBQueue.unshift(callback);
					loadDBQueueIndex++;
				}
				if (!loadingDB) {
					loadingDB = true;
					app.spin(true, "Loading data...");
					getTables();
				}
			}
			else if (callback instanceof Function) {
				return callback();
			}
		},
		//application functions
		seeDetails = function (obj) {
			function getText(a, title, id, col) {
				function applyVal(val) {
					if (app.details[a]) {
						app.details[a].text = val;
						if (app.details[a].text && app.details[a].text.length > 1000) {
							app.details[a].fullText = app.details[a].text;
							app.details[a].text = app.details[a].text.slice(0, 500) + "...";
						}
					}
				}
				wwManager({ "cmd": "getVal", "title": title, "args": [id, col] }, applyVal);
			}
			function getType(a, title, col) {
				wwManager({ "cmd": "getType", "title": title, "args": [col] }, function (type) {
					if (app.details[a]) app.details[a].type = type;
				});
			}
			function getVal(col, a, len) {
				app.details[a] = { table: obj.table, id: obj.id, column: col, warning: "" };
				getType(a, obj.table, col);
				getText(a, obj.table, obj.id, col);
			}
			var a = 0;
			checkDBLoaded(function (callback) {
				app.spin(true, "Loading contact data...");
				app.details = [];
				var recentlyViewed = false;
				//find and remove this item from recentlyViewed
				for (var b = 0; b < app.recentlyViewed.length; b++) {
					if (app.recentlyViewed[b].id === obj.id && app.recentlyViewed[b].table === obj.table) {
						app.recentlyViewed[b].sortBy = new Date().getTime();
						recentlyViewed = true;
					}
				}
				if (!recentlyViewed) {
					obj.sortBy = new Date().getTime();
					app.recentlyViewed.unshift(obj);
					app.recentlyViewed = app.recentlyViewed.slice(0, 20);
				}
				//add this item to top of list
				app.recentlyViewed = sortList(app.recentlyViewed);
				app.storeState();
				wwManager({ "cmd": "forEachCol", "title": obj.table }, getVal, function () {
					app.navigate("viewDetails");
					app.spin(false);
					if (callback instanceof Function) return callback();
				});
			});
		},
		generateListItems = function (tableName, ids, sortByCol, selected, callback) {
			function buildList(result, errors, title, requiresSync) {
				var ret = [];
				if (!errors && result && result.length > 0) {
					for (var a = 0, len = result.length, sort; a < len; a++) {
						sort = result[a].pop();
						if (sort === "") sort = "*";
						ret[a] = { table: tableName, id: result[a].shift(), sortBy: sort + "__" + result[a].join(joiner), text: result[a].join(joiner), selected: selected, type: "link" };
					}
				}
				return callback instanceof Function ? callback(ret) : ret;
			}
			var columns = dataTemplates[tableName].display && dataTemplates[tableName].display.searchResultsText ? dataTemplates[tableName].display.searchResultsText.join("|||").split("|||") : [1],
				joiner = dataTemplates[tableName].display && dataTemplates[tableName].display.searchResultsJoiner ? dataTemplates[tableName].display.searchResultsJoiner : " ";
			sortByCol = sortByCol || dataTemplates[tableName].display.sortBy || columns[0];
			columns.push(sortByCol);
			if (typeof ids === "string") ids = [ids];
			wwManager({ "cmd": "getVals", "title": tableName, "args": [ids, columns] }, buildList);
		},
		generateList = function (dbTitle, ids, sortByCol, pageNumber, numberPerPage, selected, callback) {
			function getIds(rowId, index, len) {
				ids.push(rowId);
			}
			function getData() {
				if (numberPerPage && pageNumber && ids.length > numberPerPage) {
					ids.slice(numberPerPage * (pageNumber - 1), numberPerPage * (pageNumber - 1) + numberPerPage);
				}
				return generateListItems(dbTitle, ids, sortByCol, selected, function (list) {
					list = sortList(list);
					return callback instanceof Function ? callback(list) : list;
				});
			}
			if (ids) getData();
			else if (dbTitle) {
				ids = [];
				wwManager({ "cmd": "forEachRow", "title": dbTitle }, getIds, getData);
			}
			else debug(dbTitle, "title required");
		},
		sortList = function (list) {
			function sortFunction(a, b) {
				a = a.sortBy;
				b = b.sortBy;
				//try to compare items as numbers
				if (!isNaN(a * 1) && !isNaN(b * 1)) {
					a = a * 1;
					b = b * 1;
				}
				return a === b ? 0 : a < b ? -1 : 1;
			}
			function deleteDuplicates(arr) {
				for (var x = 0, len = arr.length; x < len - 1; x++) {
					for (var y = x + 1; y < len; y++) {
						if (JSON.stringify(arr[x]) === JSON.stringify(arr[y])) {
							arr.splice(y, 1);
							len--;
							y--;
						}
					}
				}
				return arr;
			}
			list.sort(sortFunction);
			//generate headers
			var alphabetHeaders = [],
				b = 0,
				nameHeaders = [],
				c = 0,
				date = new Date(),
				now = date.getTime(),
				time = date.getHours() * 36e5 + date.getMinutes() * 6e4 + date.getSeconds() * 1000,
				diff = 0,
				recentHeaders = {
					"Older": 2592e6,
					"In the Past 30 Days": 6048e5,
					"In the Past 7 Days": 1728e5 - time,
					"Yesterday": 864e5 - time,
					"Earlier Today": 36e5,
					"In the Past Hour": 3e5,
					"Just Now": 0
				};
			for (var a = 0, len = list.length, letter, name; a < len; a++) {
				if (list[a].type === "jumplink") {//strip out old headers
					list.splice(a, 1);
					a--;
					len--;
				}
				//by most recent
				else if (typeof list[a].sortBy === "number" && list[a].sortBy > 15e11 && list[a].sortBy < 2e12) {
					diff = now - list[a].sortBy;
					for (var header in recentHeaders) {
						if (diff > recentHeaders[header]) {
							name = header;
							break;
						}
					}
					if (a === 0 || name !== nameHeaders[c - 1].text) {
						nameHeaders.push({ id: "jumplink_" + name, sortBy: now - recentHeaders[name], text: name, type: "jumplink" });
						c++;
					}
				}
				// by alphabetic
				else {
					name = list[a].sortBy.split("__")[0];
					letter = name.charAt(0);
					if (alphabetHeaders[b - 1] === undefined || letter !== alphabetHeaders[b - 1].sortBy) {
						alphabetHeaders.push({ id: "jumplink_" + letter, sortBy: letter, text: letter, type: "jumplink" });
						b++;
					}
					if (nameHeaders[c - 1] === undefined || name !== nameHeaders[c - 1].sortBy) {
						nameHeaders.push({ id: "jumplink_" + VAL.toPropName(name), sortBy: name, text: name, type: "jumplink" });
						c++;
					}
				}
			}
			if (nameHeaders.length < 20 || nameHeaders.length / list.length < 0.2) list = nameHeaders.concat(list);
			else list = alphabetHeaders.concat(list);
			list = deleteDuplicates(list);
			return diff > 0 ? list.sort(sortFunction).reverse() : list.sort(sortFunction);
		};
	//Components
	Vue.component('jump-list', {
		props: {
			links: Array,
			select: Boolean,
			selectall: Boolean,
			scrolldiv: String,
			collapse: Boolean
		},
		data: function () {
			return {
				collapse: false,
				select: true,
				selectall: false,
				emailDropdown: false,
				emailLinks: []
			};
		},
		methods: {
			seeDetails: seeDetails,
			toggle: function (prop) {
				if (this[prop] !== undefined) this[prop] = this[prop] ? false : true;
				else debug(prop, "prop doesn't exist in jump-list");
			},
			toggleSelect: function (link) {
				this.emailDropdown = false;
				for (var a = 0, len = this.links.length; a < len; a++) {
					if (this.links[a].type === "link") this.links[a].selected = false;
				}
				this.selectall = false;
				this.collapse = false;
				this.toggle('select');
				if (link) link.selected = true;
			},
			toggleSelectAll: function () {
				this.emailDropdown = false;
				this.toggle('selectall');
				for (var a = 0, len = this.links.length; a < len; a++) {
					if (this.links[a].type === "link") this.links[a].selected = this.selectall ? true : false;
				}
			},
			showIf: function (link, collapse) {
				return link.type === "jumplink" || collapse === false;
			},
			action: function (link, select, div, collapse) {
				this.emailDropdown = false;
				if (link.type === "jumplink") {
					var el = document.getElementById(div);
					this.collapse = collapse ? false : true;
					if (collapse) {
						Vue.nextTick(function () {
							var pos = document.getElementById(link.id).offsetTop;
							el.scrollTop = pos;
						});
					}
					else el.scrollTop = 0;
				}
				else if (select) {
					link.selected = link.selected ? false : true;
					this.selectall = false;
				}
				else this.seeDetails(link);
			},
			updateEmailLinks: function (links, select) {
				function newEmailLink() {
					_this.emailDropdown = true;
					var link = {};
					link.href = null;
					link.text = "Working...";
					_this.emailLinks.push(link);
					_this.emailDropdown = true;
					var bccIds = [];
					for (let a = 0, len = links.length; a < len; a++) {
						if (links[a].type === "link" && (select === false || links[a].selected === true)) bccIds.push(links[a].id);
					}
					getEmails(bccIds);
				}
				function getEmails(ids) {
					var emailAddresses = [];
					wwManager({ cmd: "getVals", title: "Contacts", args: [ids, ["Name", "GivenName", "FamilyName", "E_mail1_Type", "E_mail1_Value", "E_mail2_Type", "E_mail2_Value", "E_mail3_Type", "E_mail3_Value", "E_mail4_Type", "E_mail4_Value", "E_mail5_Type", "E_mail5_Value", "E_mail6_Type", "E_mail6_Value", "E_mail7_Type", "E_mail7_Value"]] }, function (vals, errors, title, syncPending) {
						if (vals && !errors) {
							var type, email, name;
							for (let a = 0, lenA = vals.length; a < lenA; a++) {
								name = vals[a][2].replace(/, /g, " and ").split(";")[0] + " " + vals[a][3];
								for (let b = 4; b < 17; b = b + 2) {
									type = vals[a][b] || "";
									email = vals[a][b + 1];
									if (vals[a][6]) name = type.replace(/\'s Email/, " ") + vals[a][3];
									if (email) emailAddresses.push(name + " <" + email.replace(/,/g, ">,<") + ">");
								}
							}
							_this.emailLinks = [];
							if (emailAddresses.length > 0) {
								emailAddresses = emailAddresses.join(",");
								buildMailtoUri(emailAddresses);
								buildMailtoUri(APP.User && APP.User.email || "", emailAddresses);
							}
							else {
								var link = {};
								link.href = null;
								link.text = "<Nothing selected>";
								_this.emailLinks.push(link);
							}
						}
						else debug(errors, "get email errors");
					});
				}
				function buildMailtoUri(to, bcc, subject, message) {
					var query = bcc || subject || message ? "?" : "",
						joiner1 = bcc && (subject || message) ? "&" : "",
						joiner2 = (bcc || subject) && message ? "&" : "",
						bccBool = bcc ? true : false;
					to = to ? encodeURIComponent(to) : "";
					bcc = bcc ? "bcc=" + encodeURIComponent(bcc) : "";
					subject = subject ? "subject=" + encodeURIComponent(subject) : "";
					message = message ? "body=" + encodeURIComponent(message) : "";
					updateDropdownMenu("mailto:" + to + query + bcc + joiner1 + subject + joiner2 + message, bccBool);
				}
				function updateDropdownMenu(mailtoUri, bccBool) {
					var link = {};
					link.href = mailtoUri;
					link.text = select ? bccBool ? "E-mail Selected (BCC)" : "E-mail Selected" : bccBool ? "Email All (BCC)" : "Email All";
					_this.emailLinks.push(link);	
				}
				var _this = this;
				this.emailLinks = [];
				if (this.emailDropdown) this.emailDropdown = false;
				else newEmailLink();
			}
		},
		template:
		"<div v-if=\"links.length > 0\">\
			<div align=\"left\">\
				<button v-show=\"select === false\" v-on:click=\"toggleSelect()\"><span class=\"icon icon-check\"></span> Select</button>\
				<button v-show=\"select && selectall === false\" v-on:click=\"toggleSelectAll()\"><span class=\"icon icon-unchecked\"></span> Select All</button>\
				<button v-show=\"select && selectall\" v-on:click=\"toggleSelectAll()\"><span class=\"icon icon-check\"></span> Deselect All</button>\
				<button v-show=\"select\" v-on:click=\"toggleSelect()\"><span class=\"icon icon-cancel\"></span> Cancel Select</button>\
				<button v-on:click=\"toggle('collapse')\" v-show=\"collapse === false\"><span class=\"icon icon-th\"></span> Button View</button>\
				<button v-on:click=\"toggle('collapse')\" v-show=\"collapse\"><span class=\"icon icon-th-list\"></span> List View</button>\
				<div class=\"dropdown-container right\">\
					<button v-on:click=\"updateEmailLinks(links, select)\"> <span class=\"icon icon-mail\"></span> E-mail</button>\
					<div v-show=\"emailDropdown\" class=\"dropdown\">\
						<a v-for=\"item in emailLinks\" class=\"link\" v-on:click=\"toggle('emailDropdown')\" v-bind:href=\"item.href\">{{ item.text }}</a>\
					</div>\
				</div>\
			</div>\
			<ul class=\"links\" v-bind:collapse=\"collapse\">\
				<li v-for=\"link in links\" v-bind:id=\"link.id\" v-show=\"showIf(link, collapse)\" v-on:click=\"action(link, select, scrolldiv, collapse)\" v-bind:class=\"{\
					'link':link.type === 'link',\
					'jumplink':link.type === 'jumplink',\
					'jumplink-button':link.type === 'jumplink' && collapse === true,\
					'icon':select && link.type === 'link',\
					'icon-unchecked':select && link.selected === false,\
					'icon-check selected':select && link.selected\
				}\">\
					{{ link.text }}\
				</li>\
			</ul>\
		</div>"
	});
	var app = new Vue({
		el: '#app',
		data: state,
		methods: {
			goBack: function () {
				if (this.showSearchBar) {
					this.cancelSearch();
					return true;
				}
				else if (this.showSideNav) {
					this.showSettings = false;
					this.showSideNav = false;
					return true;
				}
				else {
					if (backIndex > 1) {
						backIndex = backIndex - 2;
						this.navigate(backstack[backIndex]);
						return true;
					}
					else {
						if (cordova || Windows && WinJS) {//suspend app
							this.storeState();
						}
						return false;
					}
				}
			},
			navigate: function (location) {
				if (location || backstack.length > backIndex) {
					var _this = this;
					if (location === "viewDetails") {
						this.splitView = true;
					}
					else {
						this.viewTransitionDone = false;
						this.viewTransition = true;
						this.splitView = false;
					}
					setTimeout(function () {
						//show hide back arrow
						if (Windows && WinJS) {
							var currentview = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
							currentview.appViewBackButtonVisibility = backIndex < 1;
						}
						else _this.backArrow = backIndex > 0;
						backIndex++;
						location = location || backstack[backIndex];
						backstack[backIndex - 1] = location;
						//get the name of the current view
						_this.currentView = viewNames[_this.views.indexOf(backstack[backIndex - 1])];
						//don't save backstack if navigation did not occur
						if (backstack[backIndex - 1] === backstack[backIndex - 2]) backIndex--;
						//iterate through all views and turn them on or off
						for (var a = 0, len = _this.views.length; a < len; a++) {
							_this[_this.views[a]] = location === _this.views[a];
						}
						var b = backIndex - 1;
						if (_this.splitView) {
							while (b > -1) {
								if (backstack[b] === "viewRecent" || backstack[b] === "viewSearch") {
									_this[backstack[b]] = true;
									break;
								}
								b--;
							}
						}
						_this.viewTransition = false;
						setTimeout(function () {
							_this.viewTransitionDone = true;
						}, 210);
					}, 210);
				}
			},
			toggle: function (prop) {
				if (this[prop] !== undefined) this[prop] = this[prop] === true ? false : true;
				else debug(prop, "not found");
			},
			toggleSettings: function () {
				this.toggle('showSettings');
				this.showSideNav = true;
			},
			storeState: function () {
				var _this = this;
				setTimeout(function () {
					APP.Sto.setItem("state", {
						version: _this.version,
						darkTheme: _this.darkTheme,
						useWindowsTheme: _this.useWindowsTheme,
						windowsDarkTheme: _this.windowsDarkTheme,
						recentlyViewed: _this.recentlyViewed,
						backstack: backstack,
						backIndex: backIndex,
						stoKey: _this.stoKey,
						time: new Date().getTime()
					});
				}, 1);
			},
			search: function (event, optionalQuery) {
				if (!this.showSearchBar) {
					this.searchSuggestions = [];
					setTimeout(function () { document.getElementById("searchBox").focus(); }, 210);
				}
				else this.showSearchSuggestions = true;
				this.showSearchBar = true;
				if (this.showSideNav) this.showSideNav = false;
				if (this.searchBox !== "" || optionalQuery) {
					var _this = this;
					if (this.searchBox === "debugmode") {
						APP.setDebugMode(true);
						debug("showing debugmode");
					}
					else if (this.searchBox === "useragent") {
						APP.setDebugMode(true);
						debug(navigator.userAgent, "navigator.userAgent");
					}
					else if (this.searchBox === "nukeapp") {
						this.confirm("Are you sure you want to reset the app?", function () {
							APP.Sto.nuke();
							_this.recentlyViewed = [];
							_this.logout(function () {
								if (cordova || Windows && WinJS) {
									wwManager({ "cmd": "stop" }, function () {
										appData = {};
										backstack = [];
										backIndex = 0;
										_this.navigate(views[startView]);
										_this.darkTheme = false;
										state.stoKey = "unknown";
										init();
										loadDB = true;
										checkDBLoaded();
									});
								}
								else if (window.location && window.location.reload) {
									document.getElementById("loading").className = "";
									setTimeout(function () {
										window.location.reload(true);
									}, 2000);
								}
							});
						});
					}
					else {
						checkDBLoaded(function (callback) {
							function displayResults(searchResults, errors, table, requiresSync) {
								if (errors) debug(errors, "search error");
								else if (searchResults) generateList(table, searchResults, null, null, null, null, function (list) {
									_this.searchResults = _this.searchResults.concat(list);
									n++;
									if (n === numOfSearches) {
										_this.searchResults = sortList(_this.searchResults);
										if (_this.searchResults.length > 0) {
											_this.searchResultsTitle = 'Results for "' + _this.currentQuery + '"';
											_this.searchResultsError = "";
										}
										else {
											wwManager({ cmd: "getLength", title: "Contacts" }, function (l) {
												if (l > 0) _this.searchResultsError = 'No results found for "' + _this.currentQuery + '". Try searching for something else.';
												else _this.searchResultsError = 'No contact data found';
											});
										}
										_this.navigate("viewSearch");
										_this.spin(false);
										if (_this.searchResults.length === 1 && _this.searchResults[0].type === "link") _this.seeDetails(_this.searchResults[0]);
										else if (_this.searchResults.length === 2 && _this.searchResults[0].type === "jumplink") _this.seeDetails(_this.searchResults[1]);
										if (callback instanceof Function) return callback();
									}
								});
							}
							var find = optionalQuery ? optionalQuery : _this.searchAutoComplete === "" ? _this.searchBox : _this.searchAutoComplete;
							find = trim(find);
							_this.currentQuery = find;
							_this.resetSearch();
							_this.showSearchBar = false;
							_this.showSearchSuggestions = false;
							_this.searchResults = [];
							document.getElementById("app").focus();
							var numOfSearches = 0,
								n = 0;
							_this.spin(true, "Searching...");
							for (var t in dataTemplates) {
								numOfSearches++;
							}	
							for (let table in dataTemplates) {
								(function (table) {
									wwManager({ "cmd": "advancedSearch", "title": table, "args": [find, { colNames: searchableColumns, fuzzyMatch: true }] }, displayResults);
								})(table);
							}
						});
					}
				}
			},
			cancelSearch: function () {
				this.toggle("showSearchBar");
				this.showSearchSuggestions = false;
				this.resetSearch();
			},
			resetSearch: function () {
				this.searchBox = "";
				this.searchSuggestions = [];
				this.searchAutoComplete = "";
				this.searchPointer = -1;
			},
			applySuggestion: function (str) {
				this.searchBox = str + " ";
				this.searchSuggestions = [];
				this.searchAutoComplete = "";
				this.searchPointer = -1;
				document.getElementById("searchBox").focus();
			},
			searchKeyPress: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 38 || keyCode === 40 || keyCode === 27 || keyCode === 13) {
					e.preventDefault();
				} else {
					this.searchPointer = -1;
					var key = e.char || e.key;
					if (VAL.toEnglishAlphabet(key).match(/^[a-z0-9]$/i)) this.searchBox = trim(this.searchBox + key);
				}
			},
			searchInput: function (e) {
				function displaySuggestions(arr, errors, table, requiresSync) {
					n++;
					suggestions = suggestions.concat(arr);
					if (n === numOfTables) {
						if (suggestions.length > 0) {
							_this.searchAutoComplete = value.length < 21 && suggestions[0] ? suggestions[0] : "";
							_this.searchSuggestions = suggestions;
							setTimeout(function () {
								var listElem = document.getElementById("searchSuggestions");
								if (listElem) {
									for (var a = 0, len = listElem.children.length; a < len; a++) {
										listElem.children[a].className = "link";
									}
								}
							}, 150);
						}
						else {
							_this.searchPointer = -1;
							_this.searchSuggestions = [];
							_this.searchAutoComplete = "";
						}
					}
				}
				var value = trim(e.target.value),
					_this = this;
				if (value !== "") {
					if (loadDB === false) {
						var suggestions = [],
							str = String(value),
							numOfTables = 0,
							n = 0;
						str = VAL.removeHTMLTags(str);
						str = str.toLowerCase();
						str = VAL.toEnglishAlphabet(str);
						str = str.replace(/[^_a-z0-9\+\-]/gi, " ");
						str = trim(str);

						for (var t in dataTemplates) {
							numOfTables++;
						}
						for (var table in dataTemplates) {
							wwManager({ "cmd": "getSearchSuggestions", "title": table, "args": [str, { colNames: searchableColumns }] }, displaySuggestions);
						}
					}
					else checkDBLoaded();
				}
				else {
					this.searchPointer = -1;
					this.searchAutoComplete = "";
				}
			},
			searchKeyUp: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 32) e.preventDefault();
				if (keyCode !== 8 && keyCode !== 9 && keyCode !== 32 && keyCode !== 38 && keyCode !== 40) this.searchBox = trim(this.searchBox);
				switch (keyCode) {
					case 8://backspace
						if (this.searchBox === "") {
							this.searchSuggestions = [];
							this.searchAutoComplete = "";
						}
						break;
					case 9:/*tab*/
					case 38:/*up arrow*/
					case 40://down arrow
						if (keyCode === 9 && e.shiftKey || e.keyCode === 38) {
							if (this.searchPointer > 0) this.searchPointer--;
						}
						else if (this.searchPointer < this.searchSuggestions.length - 1) {
							this.searchPointer++;
						}
						if (this.searchSuggestions.length > 0) {
							this.searchBox = this.searchSuggestions[this.searchPointer];
							this.searchAutoComplete = this.searchBox;
						}
						var listElem = document.getElementById("searchSuggestions");
						if (listElem) {
							for (var a = 0, len = listElem.children.length; a < len; a++) {
								listElem.children[a].className = "link";
							}
							if (this.searchPointer > -1) listElem.children[this.searchPointer].className = "link selected";
						}
						break;
					case 13:/*enter key*/
						this.search();
						break;
					case 27:/*escape key*/
						this.cancelSearch();
						break;
					case 32: //space key
						this.searchSuggestions = [];
						this.searchAutoComplete = "";
						break;
				}
			},
			searchKeyDown: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 9 || keyCode === 13 || keyCode === 32 || keyCode === 38 || keyCode === 27 || keyCode === 40) {
					e.preventDefault();
				}
				if (keyCode === 32) {
					if (this.searchBox !== "" && this.searchBox.slice(-1) !== " ") {
						this.searchBox = this.searchSuggestions[0] ? this.searchSuggestions[0] + " " : this.searchBox + " ";
					}
				}
			},
			seeDetails: seeDetails,
			notify: function (msg, autoFade, callback) {
				function clearMsg() {
					_this.notifyMsg = "";
					_this.showNotify = false;
					if (callback instanceof Function) return callback();
				}
				//set timer between 1.5 - 5 seconds depending on the length of the message
				var timer = msg.length * 55,
					_this = this;
				timer = 1000 > timer ? 1000 : timer;
				timer = 5000 < timer ? 5000 : timer;
				if (msg !== "") {
					//show message
					this.notifyActivated = new Date().getTime();
					this.notifyMsg = msg;
					this.showNotify = true;
					if (callback instanceof Function) return callback();
				}
				if (autoFade || msg === "" || !msg) {
					//hide message
					if (msg === "" && new Date().getTime() - this.notifyActivated > timer) timer = 0;
					setTimeout(clearMsg, timer);
				}
			},
			confirm: function (msg, callback, options) {
				this.confirmMsg = msg || "Are you sure?";
				this.confirmOK = options && options.ok ? options.ok : "OK";
				this.confirmCancel = options && options.cancel ? options.cancel : "Cancel";
				this.showConfirm = true;
				this.confirmFunction = callback;
			},
			processConfirm: function (bool) {
				this.showConfirm = false;
				this.showUpdateKey = false;
				if (bool && this.confirmFunction instanceof Function) this.confirmFunction();
			},
			shakeConfirm: function () {
				var _this = this;
				this.confirmShake = true;
				setTimeout(function () { _this.confirmShake = false; }, 600);
			},
			spin: function (active, msg) {
				this.spinIndex = active ? this.spinIndex + 1 : this.spinIndex - 1;
				if (msg) this.spinnerMsg[this.spinIndex] = msg;
				this.spinner = active || this.spinIndex > 0 ? true : false;
			},
			toggleUseWindowsTheme: function () {
				this.toggle("useWindowsTheme");
				matchWindowsTheme();
				this.storeState();
			},
			login: function (callback) {
				function login() {
					function welcome(user) {
						_this.notify("Successfully linked to " + APP.User.alias + "'s Dropbox account", true);
						_this.dropboxUsername = APP.User.alias;
						_this.dropboxEmail = APP.User.email;
						_this.loggedIn = true;
						_this.syncAll(null, { key: _this.stoKey === "unknown" && APP.User ? APP.User.dbid ? Base64.hash(APP.User.dbid) : Base64.hash(APP.User.email) : _this.stoKey });
						if (callback instanceof Function) callback(true);
					}
					function startScreen(error) {
						debug(error, "login error");
						_this.notify("Could not connect to Dropbox at the moment, please try again later", true);
						// TODO go back to app
						if (callback instanceof Function) callback(false);
					}
					if (!APP.Dbx || !APP.Dbx.login) APP.Dbx = APP.initiateDropbox(DROPBOX_CLIENT_ID, _this.stoKey);
					APP.Dbx.login(null, welcome, startScreen);//TODO login password ui
				}
				var _this = this;
				this.notify("Connecting to Dropbox, please wait...", false, login);
			},
			logout: function (callback) {
				function logout() {
					APP.Dbx.logout(function () {
						_this.loggedIn = false;
						_this.dropboxUsername = "";
						_this.dropboxEmail = "";
						_this.notify("", true);
						if (callback instanceof Function) return callback();
					});
				}
				var _this = this;
				if (APP.Dbx && APP.Dbx.isAuthenticated) this.notify("Disconnecting from Dropbox", false, logout);
				else if (callback instanceof Function) return callback();
			},
			newStoKey: function () {
				var key = document.getElementById("stoKeyInput"),
					confirmKey = document.getElementById("stoKeyInputConfirm"),
					_this = this;
				checkDBLoaded(function (callback) {
					if (key.value === "") {
						_this.stoKeyWarning = "Required";
					}
					else if (key.value === confirmKey.value) {
						_this.stoKeyWarning = "";
						var oldKey = _this.stoKey;
						if (APP.User && APP.User.dbid) {
							oldKey = oldKey !== "unknown" ? oldKey : Base64.hash(APP.User.dbid);
							_this.stoKey = Base64.hash(APP.User.dbid + key.value);
						}
						else {//temp until depricate APP.User.id
							oldKey = oldKey !== "unknown" ? oldKey : Base64.hash(APP.User.email);
							_this.stoKey = Base64.hash(APP.User.email + key.value);
						}
						_this.storeState();
						_this.syncAll(null, { oldKey: oldKey, key: _this.stoKey });
						_this.showStoKeyInput = false;
						oldKey = null;
					}
					else {
						_this.stoKeyWarning = "Passwords don't match";
					}
					if (callback instanceof Function) return callback();
				});
			},
			updateStoKey: function () {
				function storeKey(key, callback) {
					_this.storeState(); //save cached state with new stoKey
					_this.syncAll(null, { key: key, forceSync: true });
					if (callback instanceof Function) return callback();
				}
				this.showUpdateKey = true;
				var _this = this;
				this.confirm("Please input your current password", function () {
					checkDBLoaded(function (callback) {
						var key = document.getElementById("updateStoKeyInput");
						if (APP.User && APP.User.dbid) {
							_this.stoKey = Base64.hash(APP.User.dbid + key.value);
						}
						else _this.stoKey = Base64.hash(APP.User.email + key.value);//temp until depricate APP.User.id
						return storeKey(_this.stoKey, callback);
					});
				});
			},
			/*
			* formInputId is id of <input type="file" accept=".csv" id="browseButton1"/> (in this case it would be "browseButton1")
			* fileExtension could be ".txt", ".png", ".csv", etc.
			* callback is the function to preform after the file has been loaded
			*/
			loadFile: function (fileInputId, fileExtension, callback) {
				// readAs accepts "text", "image", "binary", or "array" (defaults to binary)
				function initFileReader(readAs, callback) {
					var fileInputElem = document.getElementById(fileInputId);
					function init() {
						var file = fileInputElem.files[0],/* FileList object*/
							path = fileInputElem.value.replace(/\\/g, "/"),
							ext;
						if (fileExtension) ext = new RegExp(fileExtension + "$", "gi");
						if (!fileExtension || path.match(ext) instanceof Array && path.match(ext)[0] === fileExtension) /* verify file extension*/ {
							var reader = new FileReader();
							reader.onerror = function (evt) {
								switch (evt.target.error.code) {
									case evt.target.error.NOT_FOUND_ERR:
										_this.notify('File Not Found!');
										break;
									case evt.target.error.NOT_READABLE_ERR:
										_this.notify('File is not readable');
										break;
									case evt.target.error.ABORT_ERR:
										break; // noop
									default:
										_this.notify('An error occurred reading this file.');
								}
							};
							reader.onload = function () {
								callback(reader.result, file);
							};
							if (readAs === "image") reader.readAsDataURL(file);
							else if (readAs === "text") reader.readAsText(file);
							else if (readAs === "array") reader.readAsArrayBuffer(file);
							else reader.readAsBinaryString(file);
							fileReaderInitiated[fileInputId] = true;
						}
						else _this.notify("File type not supported! Expected " + fileExtension, false);
					}
					function notify() { _this.notify("Loading file...", false, init); }
					function showError(e) { _this.notify("Error loading file: " + e); }
					if (!fileReaderInitiated[fileInputId]) {
						if (window.File && window.FileReader && window.FileList && window.Blob) {
							fileInputElem.addEventListener('change', notify, false);
							fileInputElem.addEventListener('error', showError, false);
						}
						else _this.notify('Failed to initiate the File Reader.', true);
					}
				}
				function init(cb) {
					if (fileExtension && /csv/i.test(fileExtension)) initFileReader('text', parseCSV);
					else if (fileExtension && /vcf/i.test(fileExtension)) initFileReader('text', parseVCF);
					else if (fileExtension && /json/i.test(fileExtension)) initFileReader('text', parseJSON);
					else initFileReader("binary", saveFile);
					return cb();
				}
				function saveFile(source, details) {
					var contents = Base64.write(source, Base64.hash(_this.stoKey)),
						displayName = details.name,
						extension = /(?:\.([^.]+))?$/.exec(details.name)[1] || "No file extension",
						name = details.name.split("."),
						type = details.type || extension,
						origSize = details.size || source.length,
						compSize = contents.length,
						compression = Math.round((1 - compSize / origSize) * 100) + "%",
						modified = details.lastModified || new Date().getTime(),
						owner = APP.User && APP.User.email || "unknown",
						hash = Base64.hash(Base64.hash(_this.stoKey));
					name.pop();
					name = name.join(".");
					modified = typeof modified === "number" ? modified : new Date(modified).getTime();
					var ret = [displayName, name, extension, type, origSize, compSize, compression, new Date().getTime(), modified, owner, hash, contents];
					if (callback instanceof Function) return callback(ret);
					else return ret;
				}
				function parseCSV(source) {
					_this.notify("Importing data...", false, function () {
						source = csv2json(source);
						source.lastModified = new Date().getTime();
						source.author = APP.User && APP.User.email || "unknown";
						//try get csv modified date and author from notes
						if (source.Rows[0].Notes) {
							source.Rows[0].Notes = source.Rows[0].Notes.replace(/\r\n|\r|\n/g, "\r\n");//normalize line breaks
							var notes = source.Rows[0].Notes.split("\r\n");
							for (var d = 0, lenD = notes.length; d < lenD; d++) {
								if (/^Imported from /.test(notes[d]) && / on /.test(notes[d])) {
									var impFr = notes[d].replace(/^Imported from /, "");
									source.author = impFr.substring(0, impFr.indexOf(" on "));
									impFr = impFr.replace(source.author, "").replace(/ on /, "");
									var importDate = impFr.substring(0, impFr.indexOf(".")).replace(/,/g, "").split(" "),
										months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
									if (importDate && importDate.length === 3) {
										importDate[0] = months.indexOf(importDate[0]);
										importDate[1] = parseInt(importDate[1]);
										importDate[2] = parseInt(importDate[2]);
										if (parseInt(new Date(importDate[2], importDate[0], importDate[1]).getTime()) !== "NaN") {
											source.lastModified = new Date(importDate[2], importDate[0], importDate[1]).getTime();
										}
									}
								}
							}
						}
						source.replaceAll = true;
						source.identifierCol = "Name";
						if (callback instanceof Function) return callback(source);
						else return source;
					});
				}
				function parseVCF(input) {
					//var importedVCF = new importvCard().initialize(input);
					debug("parseVCF not done");
				}
				function parseJSON(input) {
					//APP.ADDRESSBOOK.mergeBooks(input, replaceExisting, finish);
					debug("parseJSON not done");
				}
				function click() {
					document.getElementById(fileInputId).click();
				}
				var _this = this;
				checkDBLoaded(function (callback) {
					init(click);
					if (callback instanceof Function) return callback();
				});
			},
			importFile: function (toTable) {
				function done(success, errors, title, syncPending) {
					if (success && !errors) {
						if (syncPending) {//TODO
							_this.notify("Data imported successfully", true);
						}
						else _this.notify("Data imported and synchronized successfully", true);
					}
					else if (errors) {
						defaultErrorHandler(success, errors, title, syncPending);
					}
					else _this.notify("Done", true);
				}
				var _this = this;
				if(toTable === "Files") this.loadFile('hiddenFileInput', null, function (data) {
					wwManager({ "cmd": "addRow", "title": toTable, "args": [data] }, done);
				});
				else if (toTable === "Contacts") this.loadFile('hiddenCSVInput', 'csv', function (data) {
					wwManager({ "cmd": "importJSON", "title": toTable, "args": [data, _this.stoKey, null] }, done);
				});
			},
			importNewTable: function () {
				var _this = this;
				this.loadFile('hiddenCSVInput', 'csv', function (data) {
					debug(data);
				});
			},
			editDetails: function () {
				this.navigate("viewEdit");
			},
			saveChanges: function () {
				debug("saveChanges not done");
			},
			cancelChanges: function () {
				debug("cancelChanges not done");
			},
			syncAll: function (event, options) {
				function sync(syncfile, cb) {
					function done(success, errors, title, obj) {
						_this.spin(false);
						if (err) {
							_this.notify("Please try again later", true);
							return;
						}
						else if (!obj && errors) {
							if (/unsupported version/.test(errors)) {
								_this.notify("File found was written with a newer version of the app. Please update your app to the latest version.");
							}
							else {
								switch (errors) {
									case "wrong key used":
										err = true;//break until right key input and try again
										_this.updateStoKey();
										break;
									case "try again later":
										_this.notify("Wrong password used. Please try again later", true);
										break;
									default:
										_this.notify("Unknown error");
										debug(errors, "sync errors");
								}
							}
						}
						else if (success && obj && obj.file) {
							syncfile = JSON.parse(obj.syncFile);
							APP.Dbx.save("/data/" + obj.title, obj.file, null, function () {
								//TODO Set syncPending to false
								wwManager({ "cmd": "setSyncCompleted", "title": title, "args": [syncfile] }, function (success, error, title, syncPending) {
									if (!success) debug(error, title + " setSyncComplete error");
								});
							});
						}
						else debug(title, "no json returned to upload to dropbox");
						syncfileNeedsUpdated = !syncfile || !syncfile[title] || obj ? true : syncfileNeedsUpdated;
						if (b === count) return cb(obj && obj.syncFile || JSON.stringify(syncfile));
						else b++;
					}
					function readFile(title, json, error) {
						if (json && !error) {
							wwManager({ "cmd": "sync", "title": title, "args": [json, options] }, done);
						}
						else if (json === false && error === "" || error === "data not found" || error.match(/^path\/not_found/)) {
							options.forceSync = true;
							wwManager({ "cmd": "sync", "title": title, "args": [null, options] }, done);
						}
						else {
							debug(error, "couldn't sync " + title);
							_this.spin(false);
							app.notify("Sync did not complete successfully");
						}
					}
					syncfile = syncfile || {};
					//add templates to syncfile
					for (let table in dataTemplates) {
						if (dataTemplates.hasOwnProperty(table)) {
							syncfile[table] = syncfile[table] || 0;
							count++;
						}
					}
					var a = 1,
						b = 1;
					for (let table in dataTemplates) {
						if (!err && dataTemplates.hasOwnProperty(table)) {
							wwManager({ "cmd": "isSyncPending", "title": table, "args": [syncfile] }, function (success, errors, title, requiresSync) {
								if (success && !errors) {
									if (requiresSync === true) {
										(function (title) {//capture title here
											APP.Dbx.open("/data/" + title, null, function (json, error) {
												readFile(title, json, error);
											});
										})(title);
									}
									else if (a === count) return b++ , cb(syncfile);
									else b++;
									a++;
								}
								else {
									_this.spin(false);
									debug(errors, "problem syncing");
									app.notify("Sync did not complete successfully");
								}
							});
						}
					}
				}
				function saveSyncfile(syncfile) {
					function failed() {
						app.notify("Sync did not complete successfully");
						_this.spin(false);
					}
					function success() {
						_this.spin(false);
					}
					if (syncfileNeedsUpdated) {
						APP.Dbx.save("/sync/lastSync", syncfile, null, success, failed);
					}
					else return success();
				}
				function readSyncfile(syncfile, error) {
					if (error === undefined || error === "data not found" || error.match(/^path\/not_found/)) {
						if (syncfile) {
							syncfile = JSON && JSON.parse(syncfile) || $.parseJSON(syncfile);
						}
						else console.log("no syncfile found " + error);
						sync(syncfile, saveSyncfile);
					}
					else if (error === "") {
						console.log("Sync failed, you are offline");
						_this.spin(false);
					}
					else {
						app.notify("Unhandled sync error: " + error);
						_this.spin(false);
					}
				}
				var _this = this,
					err = false,
					count = 0,
					syncFile,
					syncfileNeedsUpdated = false;
				checkDBLoaded(function (callback) {
					options = options || {};
					options.initialKey = APP.User ? APP.User.dbid ? Base64.hash(APP.User.dbid) : Base64.hash(APP.User.email) : null;
					options.key = options.key || _this.stoKey === "unknown" ? options.initialKey : _this.stoKey;
					if (APP.Dbx && APP.Dbx.isAuthenticated) {
						_this.spin(true, "Synchronising with Dropbox");
						APP.Dbx.open("/sync/lastSync", null, readSyncfile);
					}
					else if (window.location.hash.match(/^#access_token=/)) {
						_this.login(function (success) {
							if (success) {
								options.initialKey = APP.User ? APP.User.dbid ? Base64.hash(APP.User.dbid) : Base64.hash(APP.User.email) : null;
								options.key = options.key || _this.stoKey === "unknown" ? options.initialKey : _this.stoKey;
								if (APP.Dbx && APP.Dbx.isAuthenticated) {
									_this.spin(true, "Synchronising with Dropbox");
									APP.Dbx.open("/sync/lastSync", null, readSyncfile);
								}
							}
							else {
								console.log("cannot sync to Dropbox now");
								_this.spin(false);
								if (callback instanceof Function) return callback();
							}
						});	
					}
					else {
						console.log("cannot sync to Dropbox now");
						_this.spin(false);
						if (callback instanceof Function) return callback();
					}
				});
			},
			generateListView: function (tableTitle, ids, sortByCol, pageNumber, numberPerPage, selected) {
				var _this = this;
				checkDBLoaded(function (callback) {
					pageNumber = pageNumber || 1;
					numberPerPage = numberPerPage || 100;
					tableTitle = VAL.toPropName(tableTitle);
					if (dataTemplates[tableTitle]) {
						_this.searchResults = [];
						generateList(tableTitle, ids, sortByCol, pageNumber, numberPerPage, selected, function (list) {
							_this.searchResults = list;
							wwManager({ "cmd": "getTitle", "title": tableTitle }, function (title) { _this.searchResultsTitle = title; });
							_this.searchResultsError = list.length === 0 ? "Nothing to display" : "";
							_this.navigate("viewSearch");
							if (callback instanceof Function) return callback();
						});
					}
					else debug(tableTitle, "error generating list view");
				});
			},
			externalLink: function (item, type, details) {
				var link;
				if (type === "phone") link = "tel:" + encodeURIComponent(String(item.text).replace(/[^0-9]/g, ""));
				else if (type === "sms") link = "sms:" + encodeURIComponent(String(item.text).replace(/[^0-9]/g, ""));
				else if (type === "email") link = "mailto:" + encodeURIComponent(String(item.text));
				if (link) return link;
				else if (type === "gps" || type === "address" && !/mail/i.test(item.text)) {
					var a = item.column.replace(/Type/, ""),
						cols = [a + "Street", a + "City", a + "Region", a + "PostalCode", a + "Country"],
						googlemaps = "http://maps.google.com/?q=",
						bing = "http://www.bing.com/maps/?q=",
						bingmaps = "bingmaps:?q=",
						applemaps = "http://maps.apple.com/?q=",
						userAgent = navigator.userAgent,
						result = [];
					if (type === "gps") {
						link = item.text.replace("https://www.google.com/maps/search/?api=1&query=", "").replace("%2C"," ");
					}
					else {
						for (var i = 0, length = details.length; i < length; i++) {
							var index = cols.indexOf(details[i].column);
							if (index > -1) result[index] = details[i].text;
						}
						link = "";
						if (result[0]) link += result[0] + " ";
						if (result[1]) {
							link += result[1];
							link += result[2] ? ", " : " ";
						}
						if (result[2]) link += result[2] + " ";
						if (result[3]) link += result[3] + " ";
						if (result[4]) link += result[4];
					}
					if (/\d/.test(link)) {
						link = encodeURIComponent(trim(link));
						if (/Windows/.test(userAgent)) {
							if (/NT|Phone 10/.test(userAgent)) {
								link = bingmaps + link;
							}
							else link = bing + link;
						}
						else if (/Macintosh|iPad|iPod|iPhone/.test(userAgent)) {
							link = applemaps + link;
						}
						else link = googlemaps + link;
						return link;
					}
					else return false;
				}
				else return false;
			},
			initializeGroups: function (callback) {
				if (this.groups.length === 0) {
					var _this = this;
					wwManager({ "cmd": "getLength", "title": "Groups" }, function (length) {
						var ids = [];
						for (var a = 0; a < length; a++) ids[a] = a;
						wwManager({ "cmd": "getVals", "title": "Groups", "args": [ids, ["groupName"]] }, function (vals, errors, title, syncPending) {
							for (var a = 0, len = vals.length; a < len; a++) {
								_this.groups[a] = vals[a][1];
							}
							if (callback instanceof Function) return callback();
						});
					});
				}
				else if (callback instanceof Function) return callback();
			},
			newGroup: function (event, groupName, callback) {
				//Validate groupName
				groupName = groupName || this.groupName;
				groupName = VAL.toEnglishAlphabet(groupName);
				groupName = groupName.replace(/[^A-z0-9_\-/\s]/g, "");
				groupName = trim(groupName);
				if (groupName && groupName !== "") {
					groupName = groupName.split(" ");
					for (let b = 0, lenB = groupName.length; b < lenB; b++) {
						groupName[b] = groupName[b][0].toUpperCase() + groupName[b].slice(1);
					}
					groupName = groupName.join(" ");
					var i = 2,
						existingNames = [],
						_this = this,
						title,
						ids = {};
					//get group ids
					for (let c = 0, lenC = this.activeGroup.length; c < lenC; c++) {
						if (this.activeGroup[c].selected === true) {
							title = VAL.toPropName(this.activeGroup[c].table);
							if (!ids[title]) ids[title] = [];
							ids[title].push(this.activeGroup[c].id);
						}
					}
					this.initializeGroups(function () {
						//check for duplicate groupNames
						if (_this.groups.indexOf(groupName) > -1) {
							while (_this.groups.indexOf(groupName + " " + i) > -1) i++;
							groupName = groupName + " " + i;
						}
						//Save new group
						wwManager({ "cmd": "addRow", "title": "Groups", "args": [[groupName, "", ""]] }, function () {
							_this.updateGroup(groupName, ids, _this.groupSearchBox);
							_this.groups.push(groupName);
							_this.activeGroup = [];
							_this.showNewGroupUI = false;
							_this.groupSearchBox = "";
							_this.groupName = "";
						});
					});
				}
				else this.notify("Group requires a name");
			},
			updateGroup: function (groupName, ids, searchTerms) {
				var _this = this;
				groupName = String(groupName);
				wwManager({ "cmd": "getIndexOf", "title": "Groups", "args": [null, groupName, "groupName"] }, function (index) {
					if (ids) wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "groupIds", JSON.stringify(ids)] }, defaultErrorHandler);
					if (searchTerms) wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "searchTerms", String(searchTerms)] }, defaultErrorHandler);
				});
			},
			deleteGroup: function (groupName) {
				groupName = String(groupName);
				wwManager({ "cmd": "getIndexOf", "title": "Groups", "args": [null, groupName, "groupName"] }, function (index) {
					wwManager({ "cmd": "deleteRow", "title": "Groups", "args": [index] });
				});
				this.groups.splice(this.groups.indexOf(groupName), 1);
			},
			groupKeyPress: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 38 || keyCode === 40 || keyCode === 27 || keyCode === 13) {
					e.preventDefault();
				} else {
					var key = e.char || e.key;
					if (VAL.toEnglishAlphabet(key).match(/^[a-z0-9]$/i)) this.groupSearchBox = trim(this.groupSearchBox + key);
				}
			},
			groupInput: function (e) {	
				var value = e ? e.target.value : this.groupSearchBox,
					_this = this,
					n = 0,
					numOfTables = 0;
				checkDBLoaded(function (callback) {
					if (value !== "") {
						var find = String(value);
						find = VAL.removeHTMLTags(find);
						find = find.toLowerCase();
						find = VAL.toEnglishAlphabet(find);
						find = find.replace(/[^_a-z0-9\+\-]/gi, " ");
						find = trim(find);
						_this.activeGroup = [];
						document.getElementById("app").focus();
						for (let t in dataTemplates) {
							numOfTables++;
						}
						for (let table in dataTemplates) {
							if (dataTemplates.hasOwnProperty(table)) {
								(function (table) {
									wwManager({ "cmd": "advancedSearch", "title": table, "args": [find, { colNames: searchableColumns }] }, function (searchResults, errors, table, requiresSync) {
										generateList(table, searchResults, null, null, null, true, function (list) {
											_this.activeGroup = _this.activeGroup.concat(list);
											n++;
											if (n === numOfTables && callback instanceof Function) return callback();
										});
									});
								})(table);
							}
						}
					}
				});
			},
			groupKeyUp: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 32) e.preventDefault();
				if (keyCode !== 8 && keyCode !== 9 && keyCode !== 32 && keyCode !== 38 && keyCode !== 40) this.groupSearchBox = trim(this.groupSearchBox);
				switch (keyCode) {
					case 27:/*escape key*/
						this.resetGroupSearch();
						break;
				}
			},
			groupKeyDown: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 9 || keyCode === 13 || keyCode === 32 || keyCode === 38 || keyCode === 27 || keyCode === 40) {
					e.preventDefault();
				}
				if (keyCode === 32) {
					if (this.groupSearchBox !== "" && this.groupSearchBox.slice(-1) !== " ") {
						this.groupSearchBox = this.groupSearchBox + " ";
					}
				}
			},
			resetGroupSearch: function () {
				this.groupSearchBox = "";
			},
			seeGroup: function (index) {
				function add(group) {
					if (group[0][2] !== "" && group[0][2] !== "[]") {
						var ids = JSON.parse(group[0][2]),
							lenIds = 0,
							b = 0;
						for (let a in ids) {
							lenIds++;
						}
						for (let table in ids) {
							if (ids.hasOwnProperty(table)) {
								(function (table) {
									generateListItems(table, ids[table], null, null, function (arr) {
										list = list.concat(arr);
										b++;
										if (b === lenIds) {
											remove(group);
										}
									});
								})(table);
							}
						}
					}
					else remove(group);
				}
				function remove(group) {
					if (group[0][4] && group[0][4] !== "" && group[0][4] !== "[]") {
						var removeIds = JSON.parse(group[0][4]);
						for (let table in removeIds) {
							for (let a = 0, lenA = list.length; a < lenA; a++) {
								if (list[a].title === table && removeIds.indexOf(list[a].id) > -1) {
									list[a].splice(a, 1);
									a--;
									lenA--;
								}
							}
						}
					}
					_this.searchResults = sortList(list);
					_this.searchResultsTitle = group[0][1];
					_this.searchResultsError = "";
					_this.navigate("viewSearch");
				}
				var _this = this,
					list = [];
				wwManager({ "cmd": "getVals", "title": "Groups", "args": [[index], dataTemplates.Groups.headers] }, function (group) {
					if (group[0][3] !== "") {
						var lenTables = 0,
							n = 0;
						for (let a in dataTemplates) {
							lenTables++;
						}
						for (let table in dataTemplates) {
							if (dataTemplates.hasOwnProperty(table)) {
								(function (table) {
									wwManager({ "cmd": "advancedSearch", "title": table, "args": [group[0][3], { colNames: searchableColumns }] }, function (results, err, title, sync) {
										if (!err) {
											if(results) generateListItems(table, results, null, null, function (arr) {
												list = list.concat(arr);
												n++;
												if (n === lenTables) add(group);
											});
											else {
												n++;
												if (n === lenTables) add(group);
											}
										}
										else debug(err, title + " seeGroup error");
									});
								})(table);
							}
						}
					}
					else add(group);
				});
			},
			addToGroup: function (groupName, detailsObj, searchQuery) {
				this.addItemToGroupDropdown = false;
				this.addSearchToGroupDropdown = false;
				var _this = this;
				wwManager({ "cmd": "getIndexOf", "title": "Groups", "args": [null, groupName, "groupName"] }, function (index) {
					if(detailsObj) wwManager({ "cmd": "getVal", "title": "Groups", "args": [index, "groupIds"] }, function (ids) {
						ids = JSON.parse(ids);
						if (ids instanceof Array) {//convert old array data to object
							var obj = {};
							for (let a = 0, len = ids.length; a < len; a++) {
								if (!obj[ids[a].table]) obj[ids[a].table] = [];
								obj[ids[a].table].push(ids[a].id);
							}
							ids = obj;
						}
						for (let b = 0, lenB = detailsObj.length; b < lenB; b++) {
							if (!ids[detailsObj[b].table]) ids[detailsObj[b].table] = [];
							if (ids[detailsObj[b].table].indexOf(detailsObj[b].id) === -1) {
								ids[detailsObj[b].table].push(detailsObj[b].id);
							}
						}
						wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "groupIds", JSON.stringify(ids)] }, defaultErrorHandler);
						_this.notify("Added 1 item to " + groupName, true);
					});
					if (searchQuery) wwManager({ "cmd": "getVal", "title": "Groups", "args": [index, "searchTerms"] }, function (query) {
						query = query && query !== "" ? query + " +" + searchQuery : searchQuery;
						wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "searchTerms", query] }, defaultErrorHandler);
						_this.notify("Added '" + searchQuery + "' to " + groupName, true);
					});
				});
			},
			addToNewGroup: function (detailsObj, searchQuery) {
				this.addItemToGroupDropdown = false;
				this.addSearchToGroupDropdown = false;
				var _this = this;
				if(detailsObj) generateListItems(detailsObj[0].table, detailsObj[0].id, null, true, function (list) {
					list[0].selected = true;
					_this.activeGroup = list;
				});
				if (searchQuery) {
					this.groupSearchBox = searchQuery;
					this.groupInput();
				}
				this.navigate(this.views[this.viewNames.indexOf("Groups")]);
				this.showNewGroupUI = true;
			},
			toggleGroupsDropdown: function (e) {
				var _this = this;
				this.initializeGroups(function () {
					_this.addItemToGroupDropdown = _this.addItemToGroupDropdown ? false : true;
				});
			},
			toggleResultsGroupDropdown: function (e) {
				var _this = this;
				this.initializeGroups(function () {
					_this.addSearchToGroupDropdown = _this.addSearchToGroupDropdown ? false : true;
				});
			},
			showSelectGroupMembers: function () {
				var _this = this;
				for (let table in dataTemplates) {
					generateList(table, null, null, null, null, false, function (list) {
						_this.activeGroup = _this.activeGroup.concat(list);
					});
				}
			},
			resetGroups: function () {
				this.groupPage = 1;
				this.resetGroupSearch();
				this.groupName = "";
				this.activeGroup = [];
				if (this.groups.length === 0) this.goBack();
				else this.toggle('showNewGroupUI');
			},
			template: function (templateName) {
				if (dataTemplates[templateName]) {
					this.newTable.title = templateName;
					this.newTable.headers = dataTemplates[templateName].headers.join("|").split("|");
					if (this.newTable.headers[0] === "id") this.newTable.headers.shift();
					this.newTable.types = dataTemplates[templateName].types;
					this.newTable.options = dataTemplates[templateName].options;
					this.newTable.display = dataTemplates[templateName].display;
				}
				else {
					this.newTable.title = "";
					this.newTable.headers = ["", "", "", ""];
					this.newTable.types = ["string", "string", "string", "string"];
					this.newTable.options = {
						customProperties: {},
						doNotIndex: [],
						initialIndex: []
					};
					this.newTable.display = {
						searchResultsText: [],
						searchResultsJoiner: " ",
						sortBy: "",
						detailsView: {},
						editView: {}
					};
				}
			},
			sortbyColumn: function (index) {

			},
			deleteColumn: function (index) {
				this.newTable.headers.splice(index, 1);
				this.newTable.types.splice(index, 1);
				this.newTable.optionsDropdown = -1;
			},
			insertColumn: function (index) {
				this.newTable.headers.splice(index, 0, "");
				this.newTable.types.splice(index, 0, "string");
				this.newTable.optionsDropdown = -1;
			}
		}
	});
	//make some functions global
	APP.goBack = app.goBack;
	APP.notify = app.notify;
	APP.confirm = app.confirm;
	APP.WorkingOffline = WorkingOffline;

	window.onresize = layout;//recalc layout on resize for a responsive experience

	if (Windows && WinJS) {
		console.log("Windows");
		state.windows = true;
		var winApp = WinJS.Application;
		var activation = Windows.ApplicationModel.Activation;
		var isFirstActivation = true;
		var uiSettings = new Windows.UI.ViewManagement.UISettings();
		var onVisibilityChanged = function (args) {
			if (!document.hidden) {
				// TODO: The app just became visible. This may be a good time to refresh the view.
				layout();
			}
		};
		winApp.onactivated = function (args) {
			if (args.detail.kind === activation.ActivationKind.voiceCommand) {
				// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
				// this is a good place to decide whether to populate an input field or choose a different initial view.
			}
			else if (args.detail.kind === activation.ActivationKind.launch) {
				// A Launch activation happens when the user launches your app via the tile
				// or invokes a toast notification by clicking or tapping on the body.
				if (args.detail.arguments) {
					// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
					// to take the user in response to them invoking a toast notification.
				}
				else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
					// TODO: This application had been suspended and was then terminated to reclaim memory.
					// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
					// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
					init(true);
				}
			}
			if (!args.detail.prelaunchActivated) {
				// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
				// In that case it would be suspended shortly thereafter.
				// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
				// should be done here (to avoid doing them in the prelaunch case).
				// Alternatively, this work can be done in a resume or visibilitychanged handler.
			}
			WinJS.Application.onbackclick = function (e) {
				e.handled = true;
				return APP.goBack();
			};
			if (isFirstActivation) {
				init();//and... GO!
				document.addEventListener("visibilitychange", onVisibilityChanged);
				uiSettings.addEventListener("colorvalueschanged", matchWindowsTheme);
				args.setPromise(WinJS.UI.processAll());
			}

			isFirstActivation = false;
		};
		winApp.oncheckpoint = function (args) {
			app.storeState();
			// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
			// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
			// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
		};
		winApp.start();
	}
	else if (cordova) {
		var onDeviceReady = function () {
			function onPause() {
				// This application has been suspended. Save application state here.
				app.storeState();
			}
			function onResume() {
				// This application has been reactivated. Restore application state here.
				init(true);
			}
			function onBack() {
				if (!app.goBack() && navigator && navigator.app && navigator.app.exitApp) navigator.app.exitApp();
			}
			// Handle the Cordova pause and resume events
			document.addEventListener('pause', onPause.bind(this), false);
			document.addEventListener('resume', onResume.bind(this), false);
			document.addEventListener('backbutton', onBack.bind(this), false);
			// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
			init();//and... GO!
		};
		document.addEventListener('deviceready', onDeviceReady.bind(this), false);
	}
	else {
		init();//and... GO!
	}
})();