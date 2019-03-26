var APP, VAL, Base64, appData = {}, Windows, cordova; //dependancies
(function () {
	"use strict";
	APP.setDebugMode(true);//set to true to use the debugger during development, or type "debugmode" into the searchbar to activate debugmode
	const DROPBOX_CLIENT_ID = "jk6tb5tp76hs2tx",//get new client id from https://www.dropbox.com/developers
		APP_VERSION = "0.0.1",//increment on major (esp breaking) changes, to force localStorage app state to refresh on load
		views = {
			new: {
				name: "Tables",
				icon: "icon-plus",
				level: 1,
				path: "/new"
			},
			recent: {
				name: "Recent",
				icon: "icon-time",
				level: 1,
				path: "/recent"
			},
			groups: {
				name: "Groups",
				icon: "icon-people",
				level: 1,
				path: "/groups"
			},
			view1: {
				name: "Contacts",
				icon: "icon-user",
				level: 1,
				path: "/view1"
			},
			view2: {
				name: "Passwords",
				icon: "icon-lock",
				level: 1,
				path: "/view2"
			},
			view3: {
				name: "Files",
				icon: "icon-folder-open",
				level: 1,
				path: "/view3"
			},
			search: {
				name: "Search Results",
				level: 2,
				path: "/search"
			},
			details: {
				name: "Details",
				level: 2,
				path: "/details"
			},
			edit: {
				name: "Edit",
				level: 3,
				path: "/edit"
			}
		},
		startView = "recent", //set the view to start at by default		
		debug = APP.debug,//shortform access to APP.debug
		dataTemplates = {//add, remove or edit NyckelDB dataTemplates to suit your app needs. Examples below for contacts, passwords, files and groups NyckelDB databases
			Contacts: {
				//these column headers are setup as an object where the property name is the column header name and the property value is the column header type
				//this makes it easier to see and apply "types" to each "header", especially in a big table like this
				headers: {
					Name: "string",
					GivenName: "givenName",
					AdditionalName: "givenName",
					FamilyName: "familyName",
					YomiName: "string",
					GivenNameYomi: "givenName",
					AdditionalNameYomi: "givenName",
					FamilyNameYomi: "familyName",
					NamePrefix: "string",
					NameSuffix: "string",
					Initials: "string",
					Nickname: "string",
					ShortName: "string",
					MaidenName: "familyName",
					Birthday: "date",
					Gender: "string",
					Location: "geoLocation",
					BillingInformation: "string",
					DirectoryServer: "string",
					Mileage: "string",
					Occupation: "string",
					Hobby: "string",
					Sensitivity: "string",
					Priority: "string",
					Subject: "string",
					Notes: "multilineString",
					Language: "string",
					Photo: "string",
					GroupMembership: "string",
					E_mail1_Type: "string", E_mail1_Value: "email",
					E_mail2_Type: "string", E_mail2_Value: "email",
					E_mail3_Type: "string", E_mail3_Value: "email",
					E_mail4_Type: "string", E_mail4_Value: "email",
					E_mail5_Type: "string", E_mail5_Value: "email",
					E_mail6_Type: "string", E_mail6_Value: "email",
					E_mail7_Type: "string", E_mail7_Value: "email",
					E_mail8_Type: "string", E_mail8_Value: "email",
					E_mail9_Type: "string", E_mail9_Value: "email",
					E_mail10_Type: "string", E_mail10_Value: "email",
					IM1_Type: "string", IM1_Service: "string", IM1_Value: "string",
					IM2_Type: "string", IM2_Service: "string", IM2_Value: "string",
					IM3_Type: "string", IM3_Service: "string", IM3_Value: "string",
					IM4_Type: "string", IM4_Service: "string", IM4_Value: "string",
					IM5_Type: "string", IM5_Service: "string", IM5_Value: "string",
					IM6_Type: "string", IM6_Service: "string", IM6_Value: "string",
					IM7_Type: "string", IM7_Service: "string", IM7_Value: "string",
					IM8_Type: "string", IM8_Service: "string", IM8_Value: "string",
					IM9_Type: "string", IM9_Service: "string", IM9_Value: "string",
					IM10_Type: "string", IM10_Service: "string", IM10_Value: "string",
					Phone1_Type: "string", Phone1_Value: "phoneNumber",
					Phone2_Type: "string", Phone2_Value: "phoneNumber",
					Phone3_Type: "string", Phone3_Value: "phoneNumber",
					Phone4_Type: "string", Phone4_Value: "phoneNumber",
					Phone5_Type: "string", Phone5_Value: "phoneNumber",
					Phone6_Type: "string", Phone6_Value: "phoneNumber",
					Phone7_Type: "string", Phone7_Value: "phoneNumber",
					Phone8_Type: "string", Phone8_Value: "phoneNumber",
					Phone9_Type: "string", Phone9_Value: "phoneNumber",
					Phone10_Type: "string", Phone10_Value: "phoneNumber",
					Address1_Type: "string", Address1_Formatted: "formattedAddress", Address1_Street: "streetAddress", Address1_City: "cityCounty", Address1_POBox: "mailAddress", Address1_Region: "provinceStateRegion", Address1_PostalCode: "postalZipCode", Address1_Country: "country", Address1_ExtendedAddress: "string",
					Address2_Type: "string", Address2_Formatted: "formattedAddress", Address2_Street: "streetAddress", Address2_City: "cityCounty", Address2_POBox: "mailAddress", Address2_Region: "provinceStateRegion", Address2_PostalCode: "postalZipCode", Address2_Country: "country", Address2_ExtendedAddress: "string",
					Organization1_Type: "string", Organization1_Name: "string", Organization1_YomiName: "string", Organization1_Title: "string", Organization1_Department: "string", Organization1_Symbol: "string", Organization1_Location: "geoLocation", Organization1_JobDescription: "string",
					Relation1_Type: "string", Relation1_Value: "string",
					Relation2_Type: "string", Relation2_Value: "string",
					Relation3_Type: "string", Relation3_Value: "string",
					Relation4_Type: "string", Relation4_Value: "string",
					Relation5_Type: "string", Relation5_Value: "string",
					Relation6_Type: "string", Relation6_Value: "string",
					Relation7_Type: "string", Relation7_Value: "string",
					Relation8_Type: "string", Relation8_Value: "string",
					Relation9_Type: "string", Relation9_Value: "string",
					Relation10_Type: "string", Relation10_Value: "string",
					Website1_Type: "string", Website1_Value: "string",
					Website2_Type: "string", Website2_Value: "string",
					Website3_Type: "string", Website3_Value: "string",
					Website4_Type: "string", Website4_Value: "string",
					Website5_Type: "string", Website5_Value: "string",
					Website6_Type: "string", Website6_Value: "string",
					Website7_Type: "string", Website7_Value: "string",
					Website8_Type: "string", Website8_Value: "string",
					Website9_Type: "string", Website9_Value: "string",
					Website10_Type: "string", Website10_Value: "string",
					Event1_Type: "string", Event1_Value: "date",
					Event2_Type: "string", Event2_Value: "date",
					Event3_Type: "string", Event3_Value: "date",
					Event4_Type: "string", Event4_Value: "date",
					Event5_Type: "string", Event5_Value: "date",
					Event6_Type: "string", Event6_Value: "date",
					Event7_Type: "string", Event7_Value: "date",
					Event8_Type: "string", Event8_Value: "date",
					Event9_Type: "string", Event9_Value: "date",
					Event10_Type: "string", Event10_Value: "date",
					CustomField1_Type: "string", CustomField1_Value: "string",
					CustomField2_Type: "string", CustomField2_Value: "string",
					CustomField3_Type: "string", CustomField3_Value: "string",
					CustomField4_Type: "string", CustomField4_Value: "string",
					CustomField5_Type: "string", CustomField5_Value: "string",
					CustomField6_Type: "string", CustomField6_Value: "string",
					CustomField7_Type: "string", CustomField7_Value: "string",
					CustomField8_Type: "string", CustomField8_Value: "string",
					CustomField9_Type: "string", CustomField9_Value: "string",
					CustomField10_Type: "string", CustomField10_Value: "string"
				},
				options: {
					customProperties: {
						"localization": {
							initialValue: "en-CA",
							type: "string"
						}
					},
					initialIndex: ["Name", "GivenName", "AdditionalName", "FamilyName", "Nickname", "ShortName", "MaidenName",
						"E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value", "E_mail6_Value", "E_mail7_Value", "E_mail8_Value", "E_mail9_Value", "E_mail10_Value", "Address1_City", "Address2_City",
						"Address1_Region", "Address2_Region", "Organization1_Name", "Organization1_Title", "Organization1_Department"],
					doNotIndex: ["Photo",
						"E_mail1_Type", "E_mail2_Type", "E_mail3_Type", "E_mail4_Type", "E_mail5_Type", "E_mail6_Type", "E_mail7_Type", "E_mail8_Type", "E_mail9_Type", "E_mail10_Type",
						"IM1_Type", "IM1_Service", "IM2_Type", "IM2_Service", "IM3_Type", "IM3_Service", "IM4_Type", "IM4_Service", "IM5_Type", "IM5_Service", "IM6_Type", "IM6_Service", "IM7_Type", "IM7_Service", "IM8_Type", "IM8_Service", "IM9_Type", "IM9_Service", "IM10_Type", "IM10_Service",
						"Phone1_Type", "Phone2_Type", "Phone3_Type", "Phone4_Type", "Phone5_Type", "Phone6_Type", "Phone7_Type", "Phone8_Type", "Phone9_Type", "Phone10_Type",
						"Address1_Type", "Address2_Type",
						"Relation1_Type", "Relation2_Type", "Relation3_Type", "Relation4_Type", "Relation5_Type", "Relation6_Type", "Relation7_Type", "Relation8_Type", "Relation9_Type", "Relation10_Type",
						"Website1_Type", "Website2_Type", "Website3_Type", "Website4_Type", "Website5_Type", "Website6_Type", "Website7_Type", "Website8_Type", "Website9_Type", "Website10_Type"]
				},
				display: {
					listView: {
						text: ["FamilyName", "GivenName"],//diaplay as "Jones, Bob"
						joiner: ", ",
						sortBy: "FamilyName"
					},
					detailsView: {
						image: "Photo",
						titleH1: ["Name"],
						subtitleH2: ["Organization1_Name", "Organization1_Title", "Organization1_Department"],
						subtitleH2Joiner: ", ", //joins subtitleH2 together with these charactors
						mainContent: [//displays the following content in the following order
							"Nickname",//the value of Nickname is the value and "Nickname" is the label (because label is unspecified)
							"ShortName",
							"MaidenName",
							"Birthday",
							{ value: "Event1_Value", label: "Event1_Type" },//the value of Event1_Value is the value and the value of Event1_Type is 
							{ value: "Event2_Value", label: "Event2_Type" },//the label when value and label are specified 
							{ value: "Event3_Value", label: "Event3_Type" },
							{ value: "Event4_Value", label: "Event4_Type" },
							{ value: "Event5_Value", label: "Event5_Type" },
							{ value: "Event6_Value", label: "Event6_Type" },
							{ value: "Event7_Value", label: "Event7_Type" },
							{ value: "Event8_Value", label: "Event8_Type" },
							{ value: "Event9_Value", label: "Event9_Type" },
							{ value: "Event10_Value", label: "Event10_Type" },
							"Gender",
							"Location",
							{ value: "E_mail1_Value", label: "E_mail1_Type" },
							{ value: "E_mail2_Value", label: "E_mail2_Type" },
							{ value: "E_mail3_Value", label: "E_mail3_Type" },
							{ value: "E_mail4_Value", label: "E_mail4_Type" },
							{ value: "E_mail5_Value", label: "E_mail5_Type" },
							{ value: "E_mail6_Value", label: "E_mail6_Type" },
							{ value: "E_mail7_Value", label: "E_mail7_Type" },
							{ value: "E_mail8_Value", label: "E_mail8_Type" },
							{ value: "E_mail9_Value", label: "E_mail9_Type" },
							{ value: "E_mail10_Value", label: "E_mail10_Type" },
							{ value: "Phone1_Value", label: "Phone1_Type" },
							{ value: "Phone2_Value", label: "Phone2_Type" },
							{ value: "Phone3_Value", label: "Phone3_Type" },
							{ value: "Phone4_Value", label: "Phone4_Type" },
							{ value: "Phone5_Value", label: "Phone5_Type" },
							{ value: "Phone6_Value", label: "Phone6_Type" },
							{ value: "Phone7_Value", label: "Phone7_Type" },
							{ value: "Phone8_Value", label: "Phone8_Type" },
							{ value: "Phone9_Value", label: "Phone9_Type" },
							{ value: "Phone10_Value", label: "Phone10_Type" },
							{ value: "Address1_Formatted", label: "Address1_Type" },
							{ value: "Address2_Formatted", label: "Address2_Type" },
							{ value: "Relation1_Value", label: "Relation1_Type" },
							{ value: "Relation2_Value", label: "Relation2_Type" },
							{ value: "Relation3_Value", label: "Relation3_Type" },
							{ value: "Relation4_Value", label: "Relation4_Type" },
							{ value: "Relation5_Value", label: "Relation5_Type" },
							{ value: "Relation6_Value", label: "Relation6_Type" },
							{ value: "Relation7_Value", label: "Relation7_Type" },
							{ value: "Relation8_Value", label: "Relation8_Type" },
							{ value: "Relation9_Value", label: "Relation9_Type" },
							{ value: "Relation10_Value", label: "Relation10_Type" },
							{ value: "Website1_Value", label: "Website1_Type" },
							{ value: "Website2_Value", label: "Website2_Type" },
							{ value: "Website3_Value", label: "Website3_Type" },
							{ value: "Website4_Value", label: "Website4_Type" },
							{ value: "Website5_Value", label: "Website5_Type" },
							{ value: "Website6_Value", label: "Website6_Type" },
							{ value: "Website7_Value", label: "Website7_Type" },
							{ value: "Website8_Value", label: "Website8_Type" },
							{ value: "Website9_Value", label: "Website9_Type" },
							{ value: "Website10_Value", label: "Website10_Type" },
							{ value: "CustomField1_Value", label: "CustomField1_Type" },
							{ value: "CustomField2_Value", label: "CustomField2_Type" },
							{ value: "CustomField3_Value", label: "CustomField3_Type" },
							{ value: "CustomField4_Value", label: "CustomField4_Type" },
							{ value: "CustomField5_Value", label: "CustomField5_Type" },
							{ value: "CustomField6_Value", label: "CustomField6_Type" },
							{ value: "CustomField7_Value", label: "CustomField7_Type" },
							{ value: "CustomField8_Value", label: "CustomField8_Type" },
							{ value: "CustomField9_Value", label: "CustomField9_Type" },
							{ value: "CustomField10_Value", label: "CustomField10_Type" },
							"Notes"
						],
						mainContentSplitter: " ::: " //splits mainContent into separate line items at these charactors
					},
					editView: {}
				}
			},
			Passwords: {
				headers: ["Site", "Username", "Password", "Alias", "DateCreated"],//these headers are given as an array
				types: ["string", "string", "string", "string", "date"],//when headers are an array, types are given as a corresponding array
				options: {
					customProperties: {
					},
					doNotIndex: ["Password", "DateCreated"],
					initialIndex: ["Site", "Username", "Alias"]
				},
				display: {
					listView: {
						text: ["Site", "Username"],
						joiner: ": ",
						sortBy: "Site"
					},
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
					listView: {
						text: ["Display Name"]
					},
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
					listView: {
						text: ["groupName"]
					},
					detailsView: {},
					editView: {}
				}
			}
		},
		//set default searchable columns from dataTemplates above
		searchableColumns = ["Name", "Owner", "Site", "Username", "Alias", "GivenName", "AdditionalName", "FamilyName", "Nickname", "ShortName", "MaidenName",
			"E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value", "E_mail6_Value", "E_mail7_Value", "Address1_City", "Address2_City",
			"Address1_Region", "Address2_Region", "Organization1_Name", "Organization1_Title", "Organization1_Department", "groupName"],
		freshStateObj = function () {
			return {//vue.js variables
				version: APP_VERSION,
				views: views,
				backArrow: false,
				currentView: views[startView],
				spinner: false,
				spinnerMsg: ["Working..."],
				spinIndex: 0,
				indicatorRight: -164,
				indicatorWidth: 0,
				indicatorTop: 53,
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
				searchResultsTitle: "Search Results",
				searchResultsError: "Nothing here yet... try searching for something.",
				currentQuery: "",
				stoKey: "unknown",
				showStoKeyInput: false,
				stoKeyWarning: "",
				details: {
					id: null,
					table: null,
					data: [],
					image: null,
					titleH1: null,
					subtitleH2: null
				},
				recentlyViewed: [],
				showUpdateKey: false,
				addItemToGroupDropdown: false,
				addSearchToGroupDropdown: false,
				groupSearchBox: "",
				groups: []
			};
		};
	var fileReaderInitiated = [],
		backstack = [],
		backIndex = 0,
		state = freshStateObj(),
		localTestingMode = function () {
			var loc = window.location;
			if (!loc || /^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://") return true;
			else return false;
		}(),
		trim = function (str) {
			str = String(str);
			while (/\s\s/g.test(str)) str = str.replace(/\s\s/g, " ");
			if (str === " ") return "";
			return str.replace(/^\s+|\s+$/gm, "");
		},
		layout = function () {
			var width = getWidth(),
				height = getHeight(),
				type = "tabl",
				orientation = " port ",
				htmlTag = document.getElementsByTagName("html")[0];
			if (width > 1280) type = "desk";
			if (width <= 640) type = "phon";
			if (height < width && width > 360) orientation = " land ";
			htmlTag.className = trim(type + orientation + htmlTag.className.replace(/desk|tabl|phon|port|land/g, ""));
		},
		setNavLinkIndicatorPosition = function (location) {
			location = location ? location.replace(/\//, "") : startView;
			if (app.views[location] && app.views[location].level === 1) {
				var sidenavlink = document.getElementById("sidenavlink_" + location).getBoundingClientRect(),
					topnavlink = document.getElementById("topnavlink_" + location).getBoundingClientRect(),
					views = document.getElementById("topnav-container").getBoundingClientRect(),
					viewsWidth = views.right - views.left,
					extra = app.showSearchBar ? viewsWidth + 410 : viewsWidth + 110;//width of navbar buttons + searchbar (300) + search and menu buttons (110)
				app.indicatorTop = sidenavlink.top - 54;
				app.indicatorWidth = topnavlink.right - topnavlink.left;
				app.indicatorRight = getWidth() - topnavlink.left - extra;
			}
			//else debug(location, "not top level nav");
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
			if (typeof Worker !== "undefined" && !localTestingMode) {
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
							//these functions take a callback as their last argument
							case "deleteTable":
							case "setTitle":
							case "NUKEALL":
							case "isSyncPending":
							case "sync":
							case "importJSON":
							case "search":
							case "getVals":
							case "getRow":
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
			if (errors) {
				if (errors === "wrong key used") {
					app.notify("Wrong key used", true);
					app.updateStoKey();
				}
				else if (/unsupported version/.test(errors)) {
					app.notify("File found is from a newer version of the app. Please update your app to the latest version.");
				}
				else {
					app.notify("Unknown error", true);
					debug(errors, "errors");
				}
			}
		},
		//initialise the application
		startApp = function (resumeBool) {
			function doneInit() {
				checkDBLoaded(function (callback) {
					app.updateCurrentView();
					if (callback instanceof Function) return callback();
				});
			}
			function tryDropbox(cachedStoKey) {
				function applyUser(user) {
					if (user) {
						app.dropboxUsername = user.alias;
						app.dropboxEmail = user.email;
						app.loggedIn = true;
					}
					doneInit();
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
									app[prop] = s[prop];
								}
							}
							if (resumeBool && s.time && new Date().getTime() - s.time < 864e5) {
								//resume view and back history
								backstack = s.backstack;
								backIndex = s.backIndex;
								app.navigate();
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
							doneInit();
						}

					} else if (error) {
						debug(error, "error getting app state");
						doneInit();
					} else {
						APP.Sto.deleteItem("state");
						doneInit();
					}
				}, doneInit);
			}
			getLocal();
			matchWindowsTheme();
			layout();
			document.getElementById("loading").className = "done"; //app is rendered so fade in from black
		},
		//Windows specific functions
		windowsAccentColor = [false, false, false, false, false, false, false],
		matchWindowsTheme = function () {
			function updateUI() {
				if (app.useWindowsTheme) {
					if (backgroundColor.r === 0 && backgroundColor.g === 0 && backgroundColor.b === 0) app.windowsDarkTheme = true;
					else app.windowsDarkTheme = false;
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
		loadingDB = false,
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
						if (window.navigator.onLine) {
							app.syncAll();
						}
						app.spin(false);
						loadDB = false;
						if (loadDBQueue.length === 1) return loadDBQueue.pop()();
						else loadDBQueue.pop()(cb);
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
					loadDBQueue.push(callback);
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
		getDetails = function (obj, callback) {
			function sortDetailsObj(detailsObj) {
				function sortFunction(a, b) {
					return sortOrder.indexOf(a.column) === sortOrder.indexOf(b.column) ? 0 : sortOrder.indexOf(a.column) < sortOrder.indexOf(b.column) ? -1 : 1;
				}
				var sortOrder = [],
					layout = dataTemplates[obj.table].display.detailsView;
				if (layout.image) sortOrder.push(layout.image);
				if (layout.titleH1) sortOrder.push(layout.titleH1);
				if (layout.subtitleH2) sortOrder.push(layout.subtitleH2);
				if (layout.mainContent) {
					for (let a = 0, len = layout.mainContent.length; a < len; a++) {
						if (typeof layout.mainContent[a] === "string") sortOrder.push(layout.mainContent[a]);
						else {
							if (layout.mainContent[a].label) sortOrder.push(layout.mainContent[a].label);
							if (layout.mainContent[a].value) sortOrder.push(layout.mainContent[a].value);
						}
					}
				}
				return detailsObj.sort(sortFunction);
			}
			checkDBLoaded(function (cb) {
				app.spin(true, "Loading contact data...");
				app.storeState();
				wwManager({ "cmd": "getRow", "title": obj.table, "args": [obj.id] }, function (row) {
					var h1 = [],
						h2 = [],
						img,
						data = [],
						layout = dataTemplates[obj.table].display.detailsView;
					for (let a = 0, b = 0, c = 0, d = 0, e = 0, len = row.length, lenB, lenC, lenD, lenE; a < len; a++) {
						data[a] = {
							table: obj.table,
							id: obj.id,
							warning: "",
							column: row[a].column,
							type: row[a].type,
							text: row[a].value,
							label: row[a].column
						};
						//find and apply the right label
						if (layout.mainContent) {
							var hide = layout.mainContent.indexOf(row[a].column) > -1 ? false : true;
							for (b = 0, lenB = layout.mainContent.length; b < lenB; b++) {
								if (typeof layout.mainContent[b] !== "string" && layout.mainContent[b].label) {
									if (row[a].column === layout.mainContent[b].value) {
										hide = false;
										for (e = 0, lenE = row.length; e < lenE; e++) {
											if (row[e].column === layout.mainContent[b].label) {
												data[a].label = row[e].value;
												break;
											}
										}

									}
								}
							}
							data[a].hidden = hide;
						}
						//format multiline strings
						if (/multilineString|formattedAddress/.test(data[a].type) && data[a].text) {
							data[a].text = data[a].text.replace(/\r\n|\r|\n/g, '\r\n').split('\r\n');
						}
						//split out multiple values in one cell
						else if (typeof data[a].text === "string") data[a].text = layout.mainContentSplitter ? data[a].text.split(layout.mainContentSplitter) : data[a].text.split(" ::: ");
						else data[a].text = [data[a].text];
						//get h1 and h2 header values
						if (layout.titleH1) {
							for (c = 0, lenC = layout.titleH1.length; c < lenC; c++) {
								if (layout.titleH1[c] === row[a].column && row[a].value !== "") h1 = h1.concat(row[a].value);
							}
							if (layout.subtitleH2) {
								for (d = 0, lenD = layout.subtitleH2.length; d < lenD; d++) {
									if (layout.subtitleH2[d] === row[a].column && row[a].value !== "") h2 = h2.concat(row[a].value);
								}
							}
						}
						if (layout.image && row[a].column === layout.image) {
							img = row[a].value;
						}
					}
					app.spin(false);
					if (callback instanceof Function) callback({
						id: obj.id,
						table: obj.table,
						data: sortDetailsObj(data),
						image: img,
						titleH1: layout.titleH1 ? h1.join(layout.titleH1Joiner || "") : null,
						subtitleH2: layout.subtitleH2 ? h2.join(layout.subtitleH2Joiner || "") : null
					});
					if (cb instanceof Function) return cb();
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
			var columns = dataTemplates[tableName].display && dataTemplates[tableName].display.listView.text ? dataTemplates[tableName].display.listView.text.join("|||").split("|||") : [1],
				joiner = dataTemplates[tableName].display && dataTemplates[tableName].display.listView.joiner ? dataTemplates[tableName].display.listView.joiner : " ";
			sortByCol = sortByCol || dataTemplates[tableName].display.listView.sortBy || columns[0];
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
				return generateListItems(dbTitle, ids, sortByCol, selected, callback);
			}
			if (ids) getData();
			else if (dbTitle) {
				ids = [];
				wwManager({ "cmd": "forEachRow", "title": dbTitle }, getIds, getData);
			}
			else debug(dbTitle, "title required");
		},
		buildMailtoUri = function (to, bcc, subject, message, callback) {
			var query = bcc || subject || message ? "?" : "",
				joiner1 = bcc && (subject || message) ? "&" : "",
				joiner2 = (bcc || subject) && message ? "&" : "",
				bccBool = bcc ? true : false;
			to = to ? encodeURIComponent(to) : "";
			bcc = bcc ? "bcc=" + encodeURIComponent(bcc) : "";
			subject = subject ? "subject=" + encodeURIComponent(subject) : "";
			message = message ? "body=" + encodeURIComponent(message) : "";
			if (callback instanceof Function) callback("mailto:" + to + query + bcc + joiner1 + subject + joiner2 + message, bccBool);
			else return "mailto:" + to + query + bcc + joiner1 + subject + joiner2 + message;
		},
		addToNewGroup = function (detailsObj, searchQuery) {
			app.addItemToGroupDropdown = false;
			app.addSearchToGroupDropdown = false;
			if (detailsObj) generateListItems(detailsObj[0].table, detailsObj[0].id, null, true, function (list) {
				list[0].selected = true;
				app.activeGroup = list;
			});
			if (searchQuery) {
				app.groupSearchBox = searchQuery;
				app.groupInput();
			}
			app.navigate("groups");
			app.showNewGroupUI = true;
		},
		initializeGroups = function (callback) {
			if (app.groups.length === 0) {
				checkDBLoaded(function (cb) {
					wwManager({ "cmd": "getLength", "title": "Groups" }, function (length) {
						var ids = [];
						for (var a = 0; a < length; a++) ids[a] = a;
						wwManager({ "cmd": "getVals", "title": "Groups", "args": [ids, ["groupName"]] }, function (vals, errors, title, syncPending) {
							for (var a = 0, len = vals.length; a < len; a++) {
								app.groups[a] = vals[a][1];
							}
							if (cb instanceof Function) cb();
							if (callback instanceof Function) return callback();
						});
					});
				});
			}
			else if (callback instanceof Function) return callback();
		},
		generateListView = function (tableTitle, ids, sortByCol, pageNumber, numberPerPage, selected) {
			checkDBLoaded(function (callback) {
				pageNumber = pageNumber || 1;
				numberPerPage = numberPerPage || 100;
				tableTitle = VAL.toPropName(tableTitle);
				if (dataTemplates[tableTitle]) {
					app.searchResults = [];
					generateList(tableTitle, ids, sortByCol, pageNumber, numberPerPage, selected, function (list) {
						app.searchResults = list;
						wwManager({ "cmd": "getTitle", "title": tableTitle }, function (title) { app.searchResultsTitle = title; });
						app.searchResultsError = list.length === 0 ? "Nothing to display" : "";
						app.navigate("search", app.currentQuery);
						if (callback instanceof Function) return callback();
					});
				}
				else {
					debug(tableTitle, "error generating list view");
					if (callback instanceof Function) return callback();
				}
			});
		},
		addToRecentlyViewed = function (obj) {
			var recentlyViewed = false,
				recent = JSON.parse(JSON.stringify(app.recentlyViewed));
			//find and remove this item from recentlyViewed
			for (var b = 0; b < recent.length; b++) {
				if (recent[b].id === obj.id && recent[b].table === obj.table) {
					recent[b].sortBy = new Date().getTime();
					recentlyViewed = true;
				}
			}
			if (!recentlyViewed) {
				recent.unshift(JSON.parse(JSON.stringify(obj)));
				recent[0].sortBy = new Date().getTime();
				recent = recent.slice(0, 20);
			}
			//add this item to top of list
			app.recentlyViewed = recent;
		},
		importFile = function (toTable) {
			function done(success, errors, title, syncPending) {
				if (success && !errors) {
					if (syncPending) {//TODO
						app.notify("Data imported successfully", true);
					}
					else app.notify("Data imported and synchronized successfully", true);
				}
				else if (errors) {
					defaultErrorHandler(success, errors, title, syncPending);
				}
				else app.notify("Done", true);
			}
			if (toTable === "Files") app.loadFile('hiddenFileInput', null, function (data) {
				wwManager({ "cmd": "addRow", "title": toTable, "args": [data] }, done);
			});
			else if (toTable === "Contacts") app.loadFile('hiddenCSVInput', 'csv', function (data) {
				wwManager({ "cmd": "importJSON", "title": toTable, "args": [data, app.stoKey, null] }, done);
			});
		},
		confirm = function (msg, callback, options) {
			app.confirmMsg = msg || "Are you sure?";
			app.confirmOK = options && options.ok ? options.ok : "OK";
			app.confirmCancel = options && options.cancel ? options.cancel : "Cancel";
			app.showConfirm = true;
			app.confirmFunction = callback;
		};
	//Components
	Vue.component('jump-list', {
		props: {
			details: Object,
			links: Array,
			select: {
				type: Boolean,
				default: false
			},
			selectall: {
				type: Boolean,
				default: false
			},
			scrolldiv: String,
			collapse: {
				type: Boolean,
				default: false
			}
		},
		data: function () {
			return {
				emailDropdown: false,
				emailLinks: [],
				selectAll: this.selectall,
				selected: this.select,
				collapsed: this.collapse
			};
		},
		computed: {
			list: {
				get: function () {
					function sortList(list) {
						function sortFunction(a, b) {
							//try to compare items as numbers
							if (!isNaN(a.sortBy * 1) && !isNaN(b.sortBy * 1)) {
								a.sortBy = a.sortBy * 1;
								b.sortBy = b.sortBy * 1;
							}
							if (a.sortBy === b.sortBy && a.type === 'jumplink' && b.type !== 'jumplink') return 1;
							if (a.sortBy === b.sortBy && b.type === 'jumplink' && a.type !== 'jumplink') return -1;
							return a.sortBy === b.sortBy ? 0 : a.sortBy < b.sortBy ? -1 : 1;
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
						//generate headers
						var alphabetHeaders = [],
							b = 0,
							nameHeaders = [],
							c = 0,
							date = new Date(),
							now = date.getTime(),
							time = date.getHours() * 36e5 + date.getMinutes() * 6e4 + date.getSeconds() * 1000 + date.getMilliseconds(),
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
									if (diff >= recentHeaders[header]) {
										name = header;
										break;
									}
								}
								if (a === 0 || name !== nameHeaders[c - 1].text) {
									nameHeaders.push({ id: "jumplink_" + VAL.toPropName(name), sortBy: now - recentHeaders[name], text: name, type: "jumplink" });
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
						list = letter ? list.sort(sortFunction) : list.sort(sortFunction).reverse();
						return list;
					}
					return sortList(this.links);
				},
				set: function (newValue) {
					app.links = newValue;
				}
			}
		},
		methods: {
			seeDetails: function (obj) {
				var _this = this,
					sortByRecent = typeof obj.sortBy === "number" && obj.sortBy > 15e11 && obj.sortBy < 2e12;
				if (sortByRecent) {
					this.list.unshift(obj);
					this.list[0].sortBy = new Date().getTime();
					this.list = this.list.slice(0, 20);
				}
				else _this.$emit("update-recently-viewed", obj);
				getDetails(obj, function (detailsObj) {
					if (/desk/.test(document.getElementsByTagName("html")[0].className)) {
						_this.$emit("update-details", detailsObj);
					}
					else {
						app.details = detailsObj;
						app.navigate("details", null, detailsObj);
					}
				});
			},
			toggle: function (prop) {
				if (this[prop] !== undefined) this[prop] = this[prop] ? false : true;
				else debug(prop, "prop doesn't exist in jump-list");
			},
			toggleSelect: function (link) {
				this.emailDropdown = false;
				for (var a = 0, len = this.list.length; a < len; a++) {
					if (this.list[a].type === "link") this.list[a].selected = false;
				}
				this.selectAll = false;
				this.collapsed = false;
				this.toggle('selected');
				if (link) link.selected = true;
			},
			toggleSelectAll: function () {
				this.emailDropdown = false;
				this.toggle('selectAll');
				for (var a = 0, len = this.list.length; a < len; a++) {
					if (this.list[a].type === "link") this.list[a].selected = this.selectAll ? true : false;
				}
			},
			showIf: function (link, collapse) {
				return link.type === "jumplink" || collapse === false;
			},
			action: function (link, div, collapse) {
				this.emailDropdown = false;
				if (link.type === "jumplink") {
					var el = document.getElementById(div);
					this.collapsed = collapse ? false : true;
					if (collapse) {
						Vue.nextTick(function () {
							var pos = document.getElementById(link.id).offsetTop;
							el.scrollTop = pos;
						});
					}
					else el.scrollTop = 0;
				}
				else if (this.selected) {
					link.selected = link.selected ? false : true;
					this.selectAll = false;
				}
				else {
					this.seeDetails(link);
				}
			},
			updateEmailLinks: function (links) {
				function newEmailLink() {
					_this.emailDropdown = true;
					var link = {};
					link.href = null;
					link.text = "Working...";
					_this.emailLinks.push(link);
					_this.emailDropdown = true;
					var bccIds = [];
					for (let a = 0, len = links.length; a < len; a++) {
						if (links[a].type === "link" && (_this.selected === false || links[a].selected === true)) bccIds.push(links[a].id);
					}
					getEmails(bccIds);
				}
				function getEmails(ids) {
					var emailAddresses = [];
					if (ids.length > 0) wwManager({ cmd: "getVals", title: "Contacts", args: [ids, ["Name", "GivenName", "FamilyName", "E_mail1_Type", "E_mail1_Value", "E_mail2_Type", "E_mail2_Value", "E_mail3_Type", "E_mail3_Value", "E_mail4_Type", "E_mail4_Value", "E_mail5_Type", "E_mail5_Value", "E_mail6_Type", "E_mail6_Value", "E_mail7_Type", "E_mail7_Value"]] }, function (vals, errors, title, syncPending) {
						if (vals && !errors) {
							var type, email, name, primary = false;
							for (let a = 0, lenA = vals.length; a < lenA; a++) {
								name = vals[a][2].replace(/, /g, " and ").split(";")[0] + " " + vals[a][3];
								if (vals[a][6]) {
									for (let b = 4; b < 17; b = b + 2) {//find primary email
										if (/\*/.test(vals[a][b])) primary = b;
									}
								}
								for (let b = 4; b < 17; b = b + 2) {
									email = vals[a][b + 1];
									if (email) {
										type = vals[a][b] || "";
										if (vals[a][6]) {
											if (/\'s Email/.test(type)) name = type.replace(/\'s Email/, " ") + vals[a][3];
											name = name.replace(/\*/, "");
											name = trim(name);
										}
										if (primary === false || primary === b) emailAddresses.push(name + " <" + email.replace(/,/g, ">,<") + ">");
									}
								}
							}
							_this.emailLinks = [];
							if (emailAddresses.length > 0) {
								emailAddresses = emailAddresses.join(",");
								buildMailtoUri(emailAddresses, null, null, null, updateDropdownMenu);
								buildMailtoUri(APP.User && APP.User.email || "", emailAddresses, null, null, updateDropdownMenu);
							}
							else {
								var link = {};
								link.href = null;
								link.text = "Selection contains no e-mail addresses";
								_this.emailLinks.push(link);
							}
						}
						else debug(errors, "get email errors");
					});
					else {
						_this.emailLinks = [{ text: "<Nothing selected>", href: null, disabled: true }];
					}
				}
				function updateDropdownMenu(mailtoUri, bccBool) {
					var link = {};
					link.href = mailtoUri;
					link.text = _this.selected ? bccBool ? "E-mail Selected (BCC)" : "E-mail Selected" : bccBool ? "Email All (BCC)" : "Email All";
					_this.emailLinks.push(link);
				}
				var _this = this;
				this.emailLinks = [];
				if (this.emailDropdown) this.emailDropdown = false;
				else newEmailLink();
			}
		},
		template: "#jump-list"
	});
	Vue.component('details-card', {
		props: {
			details: Object
		},
		data: function () {
			return {
				addItemToGroupDropdown: state.addItemToGroupDropdown,
				groups: state.groups
			};
		},
		methods: {
			editDetails: function () {
				app.navigate("edit");
			},
			toggleGroupsDropdown: function (e) {
				initializeGroups(function () {
					app.addItemToGroupDropdown = app.addItemToGroupDropdown ? false : true;
				});
			},
			externalLink: function (text, column, type, details) {
				var link;
				if (type === "phone") link = "tel:" + encodeURIComponent(String(text).replace(/[^0-9]/g, ""));
				else if (type === "sms") link = "sms:" + encodeURIComponent(String(text).replace(/[^0-9]/g, ""));
				else if (type === "email") link = "mailto:" + encodeURIComponent(String(text));
				else if (type === "bcc") link = buildMailtoUri(APP.User && APP.User.email || "", String(text));
				else if (type === "www") link = text;
				if (link) return link;
				else if (type === "gps" || type === "address" && !/mail/i.test(text)) {
					var a = column.replace(/Type/, ""),
						googlemaps = "http://maps.google.com/?q=",
						bing = "http://www.bing.com/maps/?q=",
						bingmaps = "bingmaps:?q=",
						applemaps = "http://maps.apple.com/?q=",
						userAgent = navigator.userAgent;
					if (type === "gps") {
						link = text.replace("https://www.google.com/maps/search/?api=1&query=", "").replace(/%2C/g, ",").replace(/%2B|\+/g, "");
					}
					else {
						for (var i = 0, length = details.length; i < length; i++) {
							if (details[i].column === column) {
								link = details[i].text.join(" ");
								break;
							}
						}
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
			detailsViewHelp: function () {
				confirm("Item not found. Would you like to remove this listing?", function () {
					app.recentlyViewed.splice(1, 1);
					app.storeState();
				});
			},
			addToNewGroup: addToNewGroup
		},
		template: "#details-card"
	});
	const New = {
		data: function () {
			return {
				newTable: {
					title: "",

					headers: ["Column 1", "Column 2", "Column 3"],
					types: ["string", "string", "string"],

					acceptedValuesDropdown: -1,
					editableDropdown: -1,
					labelColDropdown: -1,
					protectDropdown: -1,
					searchableDropdown: -1,
					typesDropdown: -1,

					acceptedValuesDefault: 'any',
					editableDefault: true,
					labelColDefault: false,
					protectDefault: false,
					searchableDefault: true,
					typesDefault: 'string',

					acceptedValuesDropdownOptions: ['any'],
					editableDropdownOptions: [true, false],
					protectDropdownOptions: [false, true, "to view", "to edit"],
					searchableDropdownOptions: [true, false, 'optional'],
					typesDropdownOptions: ["any", "number", "integer", "posInteger", "negInteger", "boolean", "string", "uniqueString", "multilineString", "date", "email", "phoneNumber", "password", "streetAddress", "mailAddress", "cityCounty", "provinceStateRegion", "country", "postalZipCode", "givenName", "familyName", "geoLocation", "longitude", "latitude"],

					options: {
						customProperties: {},
						doNotIndex: [],
						initialIndex: [],
						searchable: [true, true, true]
					},
					display: {
						listView: {
							text: [],
							joiner: " ",
							sortBy: ""
						},
						detailsView: {
							hidden: [],
							labelCol: [false, false, false]
						},
						editView: {
							protect: [false, false, false],
							editable: [true, true, true],
							acceptedValues: ["any", "any", "any"]
						}
					},
					optionsDropdown: -1,
					fullscreen: false
				}
			};
		},
		methods: {
			importNewTable: function () {
				function matches(subsetArr, ofArr) {
					var matches = true;
					for (let a = 0, len = subsetArr.length; a < len; a++) {
						if (ofArr.indexOf(subsetArr[a]) === -1) matches = false;
					}
					return matches;
				}
				function createTempTable(JSON, template) {
					template.options.importJSON = JSON;
					app.notify("Building new table");
					wwManager({ "cmd": "initNewNyckelDB", "title": "temp", "args": ["temp", template.headers, template.types, template.options] }, function (success, errors, title, requiresSync) {//final callback function for last NyckelDB to initialise
						if (errors) defaultErrorHandler(success, errors, title, requiresSync);
						else app.notify("Done", true);
					});
				}
				var _this = this;
				app.loadFile('hiddenCSVInput', 'csv', function (data) {
					if (matches(data.Headers, _this.newTable.headers)) {
						createTempTable(data, _this.newTable);
					}
					else {
						app.notify("CSV Headers don't match");
						for (var template in dataTemplates) {
							var tryHeaders = dataTemplates[template].headers;
							if (dataTemplates[template].headers[0] === "id") {
								tryHeaders = dataTemplates[template].headers.join("||").split("||");
								tryHeaders.shift();
							}
							if (matches(data.Headers, tryHeaders)) {
								(function (template) {
									confirm("Are you trying to create a " + template + " table? You can use a template.", function () {
										_this.template(template);
										app.notify("");
										createTempTable(data, dataTemplates[template]);
									});
								})(template);
							}
						}
					}
				});
			},
			template: function (templateName) {
				if (dataTemplates[templateName]) {
					this.newTable.title = templateName;
					this.newTable.headers = dataTemplates[templateName].headers.join("|").split("|");
					if (this.newTable.headers[0] === "id") this.newTable.headers.shift();
					this.newTable.types = dataTemplates[templateName].types;
					this.newTable.options = dataTemplates[templateName].options;
					this.newTable.display = dataTemplates[templateName].display;
					this.newTable.display.editView.protect = dataTemplates[templateName].display.editView.protect || [];
					this.newTable.display.editView.acceptedValues = dataTemplates[templateName].display.editView.acceptedValues || [];
					this.newTable.display.editView.editable = dataTemplates[templateName].display.editView.editable || [];
					this.newTable.options.searchable = dataTemplates[templateName].options.searchable || [];
					this.newTable.display.detailsView.labelCol = dataTemplates[templateName].display.detailsView.labelCol || [];
				}
				else {
					this.newTable.title = "";
					this.newTable.headers = ["", "", ""];
					this.newTable.types = [this.newTable.typesDefault, this.newTable.typesDefault, this.newTable.typesDefault];
					this.newTable.options = {
						customProperties: {},
						doNotIndex: [],
						initialIndex: [],
						searchable: []
					};
					this.newTable.display = {
						listView: {
							text: [],
							joiner: " ",
							sortBy: ""
						},
						detailsView: {
						},
						editView: {
							acceptedValues: [],
							editable: [],
							protect: []
						}
					};
				}
				for (let a = 0, len = this.newTable.types.length; a < len; a++) {
					this.newTable.display.editView.protect[a] = this.newTable.display.editView.protect[a] || this.newTable.protectDefault;
					this.newTable.display.editView.acceptedValues[a] = this.newTable.display.editView.acceptedValues[a] || this.newTable.acceptedValuesDefault;
					this.newTable.display.editView.editable[a] = this.newTable.display.editView.editable[a] !== undefined ? this.newTable.display.editView.editable[a] : this.newTable.editableDefault;
					this.newTable.options.searchable[a] = this.newTable.options.searchable[a] !== undefined ? this.newTable.options.searchable[a] : this.newTable.searchableDefault;
					this.newTable.display.detailsView.labelCol[a] = this.newTable.display.detailsView.labelCol[a] || this.newTable.labelColDefault;
				}
			},
			toggleDropdown: function (rowName, colIndex) {
				if (this.newTable[rowName] !== undefined) {
					this.newTable[rowName] = this.newTable[rowName] === colIndex ? -1 : colIndex;
				}
				else debug(rowName, "no such row in table");
			},
			sortbyColumn: function (index) {

			},
			deleteColumn: function (index) {
				this.newTable.headers.splice(index, 1);
				this.newTable.types.splice(index, 1);
				this.newTable.display.editView.protect.splice(index, 1);
				this.newTable.display.editView.acceptedValues.splice(index, 1);
				this.newTable.display.editView.editable.splice(index, 1);
				this.newTable.options.searchable.splice(index, 1);
				this.newTable.display.detailsView.labelCol.splice(index, 1);
				this.newTable.optionsDropdown = -1;
			},
			insertColumn: function (index) {
				if (!index) {
					this.newTable.headers.push("");
					this.newTable.types.push(this.newTable.typesDefault);
					this.newTable.display.editView.protect.push(this.newTable.protectDefault);
					this.newTable.display.editView.acceptedValues.push(this.newTable.acceptedValuesDefault);
					this.newTable.display.editView.editable.push(this.newTable.editableDefault);
					this.newTable.options.searchable.push(this.newTable.searchableDefault);
					this.newTable.display.detailsView.labelCol.push(this.newTable.labelColDefault);
				}
				else {
					this.newTable.headers.splice(index, 0, "");
					this.newTable.types.splice(index, 0, this.newTable.typesDefault);
					this.newTable.display.editView.protect.splice(index, 0, this.newTable.protectDefault);
					this.newTable.display.editView.acceptedValues.splice(index, 0, this.newTable.acceptedValuesDefault);
					this.newTable.display.editView.editable.splice(index, 0, this.newTable.editableDefault);
					this.newTable.options.searchable.splice(index, 0, this.newTable.searchableDefault);
					this.newTable.display.detailsView.labelCol.splice(index, 0, this.newTable.labelColDefault);
				}
				this.newTable.optionsDropdown = -1;
			}
		},
		template: "#new-table-page"
	},
		Recent = {
			data: function () {
				return {
					recentlyViewed: state.recentlyViewed,
					recentDetails: {
						id: null,
						table: null,
						data: [],
						image: null,
						titleH1: null,
						subtitleH2: null
					}
				};
			},
			methods: {
				onDetailsUpdate: function (newDetailsObj) {
					this.recentDetails = newDetailsObj;
				}
			},
			template: "#recent-page"
		},
		Groups = {
			data: function () {
				return {
					groups: state.groups,
					groupName: "",
					showNewGroupUI: false,
					showEditGroupUI: false,
					activeGroup: [],
					groupPage: 1,
					groupHelp: false,
					groupSearchBox: state.groupSearchBox
				};
			},
			methods: {
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
						initializeGroups(function () {
							//check for duplicate groupNames
							if (_this.groups.indexOf(groupName) > -1) {
								while (_this.groups.indexOf(groupName + " " + i) > -1) i++;
								groupName = groupName + " " + i;
							}
							//Save new group
							wwManager({ "cmd": "addRow", "title": "Groups", "args": [[groupName, "", ""]] }, function () {
								_this.updateGroup(groupName, ids, app.groupSearchBox);
								_this.groups.push(groupName);
								_this.activeGroup = [];
								_this.showNewGroupUI = false;
								app.groupSearchBox = "";
								app.groupName = "";
							});
						});
					}
					else app.notify("Group requires a name");
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
						if (VAL.toEnglishAlphabet(key).match(/^[a-z0-9]$/i)) app.groupSearchBox = trim(app.groupSearchBox + key);
					}
				},
				groupInput: function (e) {
					var value = e ? e.target.value : app.groupSearchBox,
						_this = this;
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
							for (let table in dataTemplates) {
								if (dataTemplates.hasOwnProperty(table)) {
									(function (table) {
										wwManager({ "cmd": "advancedSearch", "title": table, "args": [find, { colNames: searchableColumns }] }, function (searchResults, errors, table, requiresSync) {
											if (!errors && searchResults && searchResults.length > 0) {
												generateList(table, searchResults, null, null, null, true, function (list) {
													_this.activeGroup = _this.activeGroup.concat(list);
												});
											}
										});
									})(table);
								}
							}
						}
						if (callback instanceof Function) return callback();
					});
				},
				groupKeyUp: function (e) {
					var keyCode = e.which || e.keyCode || 0;
					if (keyCode === 32) e.preventDefault();
					if (keyCode !== 8 && keyCode !== 9 && keyCode !== 32 && keyCode !== 38 && keyCode !== 40) app.groupSearchBox = trim(app.groupSearchBox);
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
						if (app.groupSearchBox !== "" && app.groupSearchBox.slice(-1) !== " ") {
							app.groupSearchBox = app.groupSearchBox + " ";
						}
					}
				},
				resetGroupSearch: function () {
					app.groupSearchBox = "";
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
						app.searchResults = list;
						app.searchResultsTitle = group[0][1];
						app.searchResultsError = "";
						app.navigate("search", app.currentQuery);
					}
					var list = [];
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
												if (results) generateListItems(table, results, null, null, function (arr) {
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
						if (detailsObj) wwManager({ "cmd": "getVal", "title": "Groups", "args": [index, "groupIds"] }, function (ids) {
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
							app.notify("Added 1 item to " + groupName, true);
						});
						if (searchQuery) wwManager({ "cmd": "getVal", "title": "Groups", "args": [index, "searchTerms"] }, function (query) {
							query = query && query !== "" ? query + " +" + searchQuery : searchQuery;
							wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "searchTerms", query] }, defaultErrorHandler);
							app.notify("Added '" + searchQuery + "' to " + groupName, true);
						});
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
					app.groupPage = 1;
					app.resetGroupSearch();
					app.groupName = "";
					app.activeGroup = [];
					if (app.groups.length === 0) app.goBack();
					else app.toggle('showNewGroupUI');
				}
			},
			template: "#groups-page"
		},
		View1 = {
			methods: {
				generateListView: generateListView,
				importFile: importFile
			},
			template: "#view1-page"
		},
		View2 = {
			template: "#view2-page"
		},
		View3 = {
			methods: {
				generateListView: generateListView,
				importFile: importFile
			},
			template: "#view3-page"
		},
		Details = {
			data: function () {
				return {
					details: state.details
				};
			},
			template: "#details-page"
		},
		Search = {
			data: function () {
				return {
					currentQuery: state.currentQuery,
					searchResults: state.searchResults,
					searchResultsTitle: state.searchResultsTitle,
					searchResultsError: state.searchResultsError,
					addSearchToGroupDropdown: state.addSearchToGroupDropdown,
					groups: state.groups,
					selectSearchResults: false,
					searchDetails: {
						id: null,
						table: null,
						data: [],
						image: null,
						titleH1: null,
						subtitleH2: null
					},
					recentlyViewed: state.recentlyViewed
				};
			},
			methods: {
				onDetailsUpdate: function (newDetailsObj) {
					this.searchDetails = newDetailsObj;
				},
				onRecentlyViewedUpdate: addToRecentlyViewed,
				toggleResultsGroupDropdown: function (e) {
					initializeGroups(function () {
						app.addSearchToGroupDropdown = app.addSearchToGroupDropdown ? false : true;
					});
				},
				addToNewGroup: addToNewGroup
			},
			template: "#search-results-page"
		},
		Edit = {
			methods: {
				saveChanges: function () {
					debug("saveChanges not done");
				},
				cancelChanges: function () {
					debug("cancelChanges not done");
				}
			},
			template: "#edit-details-page"
		},
		NotFound = {
			template: "<div class=\"view\"><div class=\"view-container\"><h1>Page Not Found :´(</h1><h3>Not sure what you was lookin' for here, but I can assure you that this ain't it!</h3></div></div>"
		},
		routes = [
			{
				path: '/',
				name: "home",
				components: {
					default: Recent
				},
				meta: {
					title: 'Home page - Nyckel (Beta)'
				}
			},
			{
				path: '/new',
				name: "new",
				components: {
					default: New
				},
				meta: {
					title: 'Create a new table - Nyckel (Beta)'
				}
			},
			{
				path: '/recent',
				name: "recent",
				components: {
					default: Recent
				},
				meta: {
					title: 'Recent - Nyckel (Beta)'
				}
			},
			{
				path: '/groups',
				name: "groups",
				components: {
					default: Groups
				},
				meta: {
					title: 'Groups - Nyckel (Beta)'
				}
			},
			{
				path: '/view1',
				name: "view1",
				components: {
					default: View1
				},
				meta: {
					title: 'Contacts - Nyckel (Beta)'
				}
			},
			{
				path: '/view2',
				name: "view2",
				components: {
					default: View2
				},
				meta: {
					title: 'Passwords - Nyckel (Beta)'
				}
			},
			{
				path: '/view3',
				name: "view3",
				components: {
					default: View3
				},
				meta: {
					title: 'Files - Nyckel (Beta)'
				}
			},
			{
				path: '/search',
				name: "search",
				components: {
					default: Search
				},
				meta: {
					title: 'Search Results - Nyckel (Beta)'
				}
			},
			{
				path: '/edit',
				name: "edit",
				components: {
					default: Edit
				},
				meta: {
					title: 'Edit - Nyckel (Beta)'
				}
			},
			{
				path: '/details',
				name: "details",
				components: {
					default: Details
				},
				meta: {
					title: 'Details - Nyckel (Beta)'
				}
			},
			{
				path: '*',
				name: "notfound",
				components: {
					default: NotFound
				},
				meta: {
					title: 'Page not found :( - Nyckel (Beta)'
				}
			}
		],
		router = new VueRouter({
			routes: routes
		});

	const app = new Vue({
		router: router,
		el: '#app',
		data: state,
		mounted: function () {
			this.$router.afterEach(this.updateCurrentView);
			this.$router.beforeEach(function (to, from, next) {

				// This goes through the matched routes from last to first, finding the closest route with a title.
				// eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
				const nearestWithTitle = to.matched.slice().reverse().find(function (r) { r.meta && r.meta.title; });

				// If a route with a title was found, set the document (page) title to that value.
				if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

				next();
			});
		},
		methods: {
			updateCurrentView: function (to, from) {
				to = to || { name: this.$route.name, query: this.$route.query };
				var location = to.name;
				if (location === "home") location = this.startView;
				if (location === "details") {
					if (to.query && (to.query.id !== this.details.id || to.query.table !== this.details.table))
						this.seeDetails({ table: to.query.table, id: to.query.id });
				}
				this.currentView = this.views[location] || this.views[startView];
				setNavLinkIndicatorPosition(location);
				if (location === "groups") initializeGroups();
				if (to.query && to.query.search && to.query.search !== encodeURIComponent(this.currentQuery)) {
					this.currentQuery = to.query.search;
					this.search(null, to.query.search);
				}
				if (to.query && to.query.page !== undefined) {
					if (parseInt(to.query.page) !== backIndex) backIndex = parseInt(to.query.page);
					else backIndex++;
					location = location || backstack[backIndex];
					backstack[backIndex - 1] = location;
				}
				else backIndex = 0;

				//show hide back arrow
				if (Windows && WinJS) {
					var currentview = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
					currentview.appViewBackButtonVisibility = backIndex < 1;
				}
				else this.backArrow = backIndex > 0;
			},
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
					if (backIndex > 0) {
						backIndex = backIndex - 2;
						this.$router.go(-1);
						return true;
					}
					else {
						this.$router.push('/');
						if (cordova || Windows && WinJS) {//suspend app
							this.storeState();
						}
						return false;
					}
				}
			},
			/*options = {
				urlQuery
				search
				table
				id
			}*/
			navigate: function (location, searchquery, detailsObj) {
				var query = { page: backIndex + 1 };
				if (searchquery) {
					query.search = encodeURIComponent(searchquery);
					if ("#/" + location + "?page=" + backIndex + "&search=" + query.search === window.location.hash) return;//dont navigate if no change
				}
				else if (detailsObj) {
					query.id = detailsObj.id;
					query.table = detailsObj.table;
					if ("#/" + this.currentView.path + "/" + location + "?page=" + backIndex + "&id=" + query.id + "&table=" + query.table === window.location.hash) return;//dont navigate if no change
				}
				else if ("#/" + location + "?page=" + backIndex === window.location.hash) return; //dont navigate if no change				
				if (location) this.$router.push({ path: "/" + location, query: query });
				else if (backstack[backIndex]) this.$router.push({ path: "/" + backstack[backIndex], query: query });
				else {
					// get location from url hash
					this.$router.push({ path: this.$route.path, query: this.$route.query });
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
					document.getElementById("searchBox").focus();
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
						confirm("Are you sure you want to reset the app?", function () {
							document.getElementById("loading").className = "";
							APP.Sto.nuke();
							_this.logout(function () {
								if (cordova || Windows && WinJS) {
									wwManager({ "cmd": "stop" }, function () {
										setTimeout(function () {
											webWorker = new Worker("scripts/webworker.js");
											webWorker.addEventListener('message', wwReadMessage, false);
											webWorker.addEventListener('error', wwOnError, false);
											appData = {};
											backstack = [];
											backIndex = 0;
											state = freshStateObj();
											_this.storeState();
											for (let s in state) {
												if (_this[s]) _this[s] = state[s];
											}
											setTimeout(function () {
												startApp();
												loadDB = true;
												loadDBQueue = [];
												loadingDB = false;
												checkDBLoaded(function (callback) {
													if (callback instanceof Function) return callback();
												});
											}, 1000);
										}, 1000);
									});
								}
								else if (window.location && window.location.reload) {
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
									results = results.concat(list);
									n++;
									if (n === numOfSearches) {
										_this.searchResults = results;
										if (results.length > 0) {
											_this.searchResultsTitle = 'Results for "' + _this.currentQuery + '"';
											_this.searchResultsError = "";
										}
										else {
											wwManager({ cmd: "getLength", title: "Contacts" }, function (l) {
												if (l > 0) _this.searchResultsError = 'No results found for "' + _this.currentQuery + '". Try searching for something else.';
												else _this.searchResultsError = 'No data found';
											});
										}
										_this.spin(false);
										if (results.length === 1 && results[0].type === "link") {
											_this.seeDetails(results[0]);
											addToRecentlyViewed(results[0]);
										}
										else if (results.length === 2 && results[0].type === "jumplink") {
											_this.seeDetails(results[1]);
											addToRecentlyViewed(results[1]);
										}
										else _this.navigate("search", _this.currentQuery);
										if (callback instanceof Function) return callback();
									}
								});
							}
							var find = optionalQuery ? optionalQuery : _this.searchAutoComplete === "" ? _this.searchBox : _this.searchAutoComplete,
								results = [];
							find = trim(find);
							if (find) {
								_this.currentQuery = find;
								_this.resetSearch();
								_this.showSearchBar = false;
								_this.showSearchSuggestions = false;
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
							} else console.log("empty query field");
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
					else checkDBLoaded(function (callback) {
						if (callback instanceof Function) return callback();
					});
				}
				else {
					this.searchPointer = -1;
					this.searchAutoComplete = "";
				}
			},
			searchKeyUp: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 32) e.preventDefault();
				if (keyCode !== 8 && keyCode !== 9 && keyCode !== 32 && keyCode !== 38 && keyCode !== 40) {
					this.searchBox = this.searchBox.slice(-1) === " " ? trim(this.searchBox) + " " : trim(this.searchBox);
				}
				switch (keyCode) {
					case 8://backspace
						if (this.searchBox === "") {
							this.searchPointer = -1;
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
						this.searchBox = this.searchSuggestions[0] ? this.searchPointer > -1 ? this.searchSuggestions[this.searchPointer] + " " : this.searchSuggestions[0] + " " : this.searchBox + " ";
					}
				}
			},
			seeDetails: function (obj) {
				var _this = this;
				getDetails(obj, function (detailsObj) {
					_this.details = detailsObj;
					_this.navigate("details", null, detailsObj);
				});
			},
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
				confirm("Please input your current password", function () {
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
				function click(callback) {
					document.getElementById(fileInputId).click();
					if (callback instanceof Function) return callback();
				}
				var _this = this;
				checkDBLoaded(function (callback) {
					init(function () { click(callback); });
				});
			},
			/*options = {
				see NyckelDBObj.prototype.sync options

			}*/
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
								wwManager({ "cmd": "setSyncCompleted", "title": title, "args": [syncfile] }, function (success, error, title, syncPending) {
									if (!success) debug(error, title + " setSyncComplete error");
									else console.log("sync complete");
								});
							}, function (error) { debug(error, "save file to Dropbox error"); });
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
							console.log(error, "offline");
							options.forceSync = true;
							wwManager({ "cmd": "sync", "title": title, "args": [null, options] }, done);
						}
						else {
							debug(error, "couldn't sync " + title);
							_this.spin(false);
							_this.notify("Sync did not complete successfully");
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
					if (count === 0) {
						return cb(syncfile);
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
									debug(errors, "problem syncing " + title);
									_this.notify("Sync did not complete successfully");
								}
							});
						}
					}
				}
				function saveSyncfile(syncfile) {
					function failed() {
						_this.notify("Sync did not complete successfully");
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
						_this.notify("Unhandled sync error: " + error);
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
					} else if (window.location.hash.match(/^#access_token=/)) {
						_this.login(function (success) {
							if (success) {
								//debug("login success");
								options.initialKey = APP.User ? APP.User.dbid ? Base64.hash(APP.User.dbid) : Base64.hash(APP.User.email) : null;
								options.key = options.key || _this.stoKey === "unknown" ? options.initialKey : _this.stoKey;
								_this.spin(true, "Synchronising with Dropbox");
								APP.Dbx.open("/sync/lastSync", null, readSyncfile);
							}
							else {
								debug("login fail");
								console.log("cannot sync to Dropbox now");
								_this.spin(false);
							}
						});
					}
					else {
						console.log("cannot sync to Dropbox now");
						_this.spin(false);
					}
					if (callback instanceof Function) return callback();
				});
			}
		}
	});
	//make some functions global
	APP.goBack = app.goBack;
	APP.notify = app.notify;
	APP.confirm = confirm;
	APP.localTestingMode = localTestingMode;

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
					startApp(true);
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
				startApp();//and... GO!
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
				startApp(true);
			}
			function onBack() {
				if (!APP.goBack() && navigator && navigator.app && navigator.app.exitApp) navigator.app.exitApp();
			}
			// Handle the Cordova pause and resume events
			document.addEventListener('pause', onPause.bind(this), false);
			document.addEventListener('resume', onResume.bind(this), false);
			document.addEventListener('backbutton', onBack.bind(this), false);
			// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
			startApp();//and... GO!
		};
		document.addEventListener('deviceready', onDeviceReady.bind(this), false);
	}
	else {
		startApp();//and... GO!
	}
})();