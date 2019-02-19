/**
 * Dependancies: base64, dropbox, lawnchair, storage, validate, app
 */ 
var APP = APP || {}, Base64, Windows, cordova;
APP.nyckelDB = (function () {
	"use strict";
	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	/*delete duplicate values held in an array
	note: deleteDuplicates converts non String values to Strings first :. "1" matches 1
	also handles multi dimensional arrays*/
	function deleteDuplicates(arr) {
		for (var x = 0, len = arr.length, y; x < len - 1; x++) {
			for (y = x + 1; y < len; y++) {
				if (String(arr[x]) === String(arr[y])) {
					arr.splice(y, 1);
					len--;
					y--;
				}
			}
		}
		x = null; len = null; y = null;
		return arr;
	}
	/*returns number of minutes since Fri Jul 14 2017 02:40:00 GMT+0000, or since 15e11 in javascript time
	wRefTo (with reference to) specifies a base timestamp as reference. Returns the difference b/t wRefTo
	and Now. Optional */
	function timestamp(wRefTo) {
		var now = Math.floor((new Date().getTime() - 15e11) / 6e4);
		return isNumeric(wRefTo) ? now - wRefTo : now;
	}
	//returns a string in the form YYYYMMDDHHMM ie. 201812312359
	function readableTimestamp() {
		function twoDigits(a) {
			a = String(a);
			while (a.length < 2) a = "0" + a;
			return a;
		}
		var date = new Date(),
			day = twoDigits(date.getDate()),
			month = twoDigits(date.getMonth() + 1), //+ 1 because getMonth is 0 indexed
			year = String(date.getFullYear()),
			hour = twoDigits(date.getHours()),
			minute = twoDigits(date.getMinutes());
		date = null;
		return year + month + day + hour + minute;
	}
	function rowIdIsValid(rowId) {
		if (this.isDeleted()) return false;
		if (isNumeric(rowId)) {
			if (rowId < 0) {
				cacheError.call(this, rowId, "row id cannot be less than 0");
				return false;
			}
			else if (rowId < db[this.id].table.length) return true;
			else return false;
		}
		else if (typeof rowId === "string" && /^[a-z0-9]+$/i.test(rowId)) {
			if (db[this.id].ids[rowId]) return true;
			else return false;
		}
		else {
			cacheError.call(this, typeof rowId, "invalid row Id, number or  string required: " + rowId);
			return false;
		}
	}
	function colNameIsValid(colName) {
		if (this.isDeleted()) return false;
		if (typeof colName === "string" && db[this.id].headers.indexOf(VAL.toPropName(colName)) > -1) {
			if (colName === "id") {
				cacheError.call(this, colName, "'id' is a reserved column name, and is not accessible");
				return false;
			}
			else return true;
		}
		else if (isNumeric(colName)) {
			if (colName < 1) {
				cacheError.call(this, colName, "column name cannot be less than 1");
				return false;
			}
			else if (colName < db[this.id].headers.length) return true;
			else {
				cacheError.call(this, colName, "column name not found");
				return false;
			}
		}
		else {
			cacheError.call(this, colName, "column name not found");
			return false;
		}
	}
	function valueIsValid(value, type) {
		if (value == null) {//checks for both null and undefined
			cacheError.call(this, value, type + " value cannot be");
			return false;
		}
		else if (type === "any") return true;
		else if (typeof value === "string" && type.match(/string|uniqueString|multilineString|date|email|phoneNumber|password|streetAddress|mailAddress|cityCounty|provinceStateRegion|country|postalZipCode|givenName|familyName|geoLocation/)) {
			return true;
		}
		else if (typeof value === "number" && type.match(/number|integer|posInteger|negInteger|date|phoneNumber|password|postalZipCode|longitude|latitude/)) {
			if (isNaN(value) || value === Infinity) {
				cacheError.call(this, value, "number value cannot be");
				return false;
			}
			else return true;
		}
		else if (typeof value === "boolean" && type === "boolean") return true;
		else {
			if (!type.match(validTypes)) cacheError.call(this, type, "Invalid data type");
			else cacheError.call(this, "invalid value", value + " is a " + typeof value + ", not a " + type);
			return false;
		}
	}
	function getIndexOfRow(rowId) {
		if (this.isDeleted()) return -1;
		if (rowIdIsValid.call(this, rowId)) {
			if (isNumeric(rowId)) return rowId;
			else {
				if (db[this.id].ids[rowId][0] === "del") return -1;
				if (rowIndex[this.id] && rowIndex[this.id][rowId]) return rowIndex[this.id][rowId]; //direct from cache
				else {
					for (let a = 0, len = db[this.id].table.length; a < len; a++) {
						rowIndex[this.id][db[this.id].table[a][0]] = a;//build a cache for faster performance
						if (db[this.id].table[a][0] === rowId) {
							return a;
						}
					}
				}
			}
		}
		else return -1;
	}
	function getIndexOfCol(colName) {
		if (this.isDeleted()) return -1;
		else if (isNumeric(colName) && colName > 0 && colName < db[this.id].headers.length) return colName;
		else {
			colName = VAL.toPropName(colName);
			if (colName !== "id") return db[this.id].headers.indexOf(colName);
			else return -1;
		}
	}
	function toLocalStorage(changes) {
		function save() {
			if (typeof changes === "undefined" || changes === true) {
				APP.Sto.setItem(db[this.id].title, JSON.stringify(db[this.id]));
			}
			errors[this.id] = null;
		}
		if (APP.Sto) {
			if (errors[this.id]) {
				var msg = "The following errors are found in the " + db[this.id].title + " database\n" + errors[this.id] + "\nWould you still like to save changes?",
					_this = this;
				if (APP.confirm) {
					APP.confirm(msg, save.bind(_this), null, { "okButton": "Save" });
				}
				else if (window && window.confirm(msg.replace(/<[^>]+>/g, " "))) save.call(this);
				msg = null;
			}
			else save.call(this);
		}
		buildSearchIndex.call(this);
	}
	function importJSON(json, callback, key, fromLocalStorageBool) {
		if (typeof json === "string") json = JSON.parse(json);
		var syncChanges = false;
		if (json && json.data && json.version === this.Version + "_" + Base64.Version && Base64.hmac(json.data, key) === json.signature) {
			json = Base64.read(json.data, key);
		}
		if (json && json.title) {
			var eTitle = VAL.toPropName(db[this.id].title),
				nTitle = VAL.toPropName(json.title);
			if (json.previousTitle && json.previousTitle.indexOf(eTitle) > -1) {
				//title has been changed
				db[this.id].title = json.title;
			}
			if (nTitle === eTitle || db[this.id].previousTitle && db[this.id].previousTitle.indexOf(nTitle) > -1) {
				//table titles match
				if (typeof json.deleted !== "undefined") {
					if (!this.isDeleted()) {
						//delete table
						deleteTable.call(this, function () {
							if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, true), this;
							else return this;
						}.bind(this), json.deleted, false);
					}
					else if (callback instanceof Function) return callback(true, "table is deleted", db[this.id].title, false), this;
					else return this;
				}
				else if (json.table) {
					if (db[this.id].lastModified === 0 && db[this.id].table.length === 0 && db[this.id].created !== json.created || this.isDeleted()) {
						if (db[this.id].lastModified < json.lastModified) {
							//recreate existing/deleted table
							delete db[this.id].deleted;
							db[this.id].created = json.created;
							db[this.id].headers = json.headers;
							db[this.id].ids = json.ids;
							db[this.id].lastModified = json.lastModified;
							db[this.id].properties = json.properties;
							db[this.id].table = json.table;
							db[this.id].types = json.types;
							db[this.id].version = this.Version + "_" + Base64.Version;
							if (!fromLocalStorageBool) toLocalStorage.call(this);
							if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, true), this;
							else return this;
						}
						else if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, false), this;
						else return this;
					}
					var createdDiff = db[this.id].created - json.created;//the difference in time between when the two tables were created
					//update rows
					for (var b = 0, len = json.table.length, c, lenC, e, eLen, match, nRow, xRow, xId, nId; b < len; b++) {
						match = false;
						nRow = json.table[b];//new row
						for (c = 0, lenC = db[this.id].table.length; c < lenC; c++) {
							xRow = db[this.id].table[c];//existing row
							if (xRow[0] && nRow[0] && xRow[0] === nRow[0]) {
								//ids match, found right row
								xId = db[this.id].ids[xRow[0]];//existing row metadata
								nId = json.ids[nRow[0]];//new row metadata
								for (e = 1, eLen = nId.length; e < eLen; e++) {
									if (xId[0] + xId[e] !== nId[0] + nId[e] - createdDiff) {
										//cells are different
										syncChanges = true;
										if (nId[0] !== "del" && xId[0] + xId[e] < nId[0] + nId[e] - createdDiff) {
											//cell needs updated
											setVal.call(this, c, e, nRow[e], false, nId[e]);
										}
									}
								}
								match = true;
								continue;//row match found and updated so don't need to search further
							}
						}
						if (!match && (!db[this.id].ids[nRow[0]] || db[this.id].ids[nRow[0]][0] === "del" && db[this.id].ids[nRow[0]][1] < json.ids[nRow[0]][0]) - createdDiff) {
							//new row
							syncChanges = true;
							addRow.call(this, nRow, nRow[0], false, json.ids[nRow[0]]);
						}
					}
					b = null; len = null; c = null; lenC = null; e = null; eLen = null; match = null; xRow = null; nRow = null; xId = null; nId = null;
					if (json.created < db[this.id].created) {
						//update created timestamp
						db[this.id].created = json.created;
						db[this.id].lastModified = db[this.id].lastModified === 0 ? json.lastModified : db[this.id].lastModified - createdDiff;
						//update all other timestamps to reflect change in created timestamp
						var i, idiLen;
						for (var id in db[this.id].ids) {
							for (i = 0, idiLen = db[this.id].ids[id].length; i < idiLen; i++) {
								if (i !== 0 || db[this.id].ids[id][i] !== "del")
									db[this.id].ids[id][i] = db[this.id].ids[id][i] - createdDiff;
							}
						}
						id = null; i = null; idiLen = null;
						syncChanges = true;
					}
					//delete deleted rows
					for (var rowId in json.ids) {
						if (json.ids[rowId][0] === "del" && db[this.id].ids[rowId] && db[this.id].ids[rowId][0] !== "del") {
							if (json.ids[rowId][1] !== db[this.id].ids[rowId][0]) syncChanges = true;
							//if it was deleted after it was created (not restored)
							if (json.ids[rowId][1] - createdDiff > db[this.id].ids[rowId][0]) {
								deleteRow.call(this, rowId, false, json.ids[rowId][1]);
								//dbLength--;//not used for anything
							}
						}
					}
					rowId = null;
					if (json.properties && db[this.id].properties) {
						for (var prop in json.properties) {
							var _prop = VAL.toPropName(prop);
							if (db[this.id].properties[_prop]) {
								if (!db[this.id].properties[_prop][1] || db[this.id].properties[_prop][1] < json.properties[prop][1]) {
									setProp.call(this, prop, json.properties[prop][0], json.properties[prop][1], false);
									syncChanges = true;
								}
								else if (db[this.id].properties[_prop][1] && db[this.id].properties[_prop][1] !== json.properties[prop][1]) syncChanges = true;
							}
							else cacheError.call(this, "customProperty " + _prop + " not initialized");
						}
						prop = null; _prop = null;
					}
					//check for errors
					var missing = [];
					for (var item in json.ids) {
						if (!db[this.id].ids[item] && json.ids[item][0] !== "del") {
							missing.push(item);
						}
					}
					item = null;
					if (missing.length !== 0) {
						cacheError.call(this, missing, "import did not complete sucessfully");
						for (let a = 0, lenA = missing.length, d, lenD; a < lenA; a++) {
							for (d = 0, lenD = json.length; d < lenD; d++) {
								if (json.table[d][0] === missing[a]) {
									//TODO
									console.log("error");
									break;
								}
							}
						}
					}
					if (!fromLocalStorageBool) toLocalStorage.call(this, syncChanges);
					else buildSearchIndex.call(this);
					createdDiff = null;
					if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, syncChanges), this;
					else return this;
				}
				else {
					cacheError.call(this, json.title, "json is not valid");
					if (callback instanceof Function) return callback(false, errors[this.id], db[this.id].title, false), this;
					else return this;
				}
			}
			else {
				cacheError.call(this, eTitle, "cannot import " + json.title);
				if (callback instanceof Function) return callback(false, errors[this.id], db[this.id].title, false), this;
				else return this;
			}
		}
		else if (json && json.Headers && json.Rows) {
			//importing CSV file converted to JSON with csv2json function
			var headers = checkHeadersArray(json.Headers),
				headersOK = true, foundMatch = false;
			for (let a = 0, lenA = headers.length, b, lenB; a < lenA; a++) {
				foundMatch = false;
				for (b = 0, lenB = db[this.id].headers.length; b < lenB; b++) {
					if (headers[a] === db[this.id].headers[b]) {
						foundMatch = true;
						continue;
					}
				}
				if (foundMatch === false) {
					cacheError.call(this, db[this.id].headers, headers[a] + " csv file header not found");
					headersOK = false;
				}
			}
			foundMatch = false;
			if (headersOK) {
				function getId(json, searchLevel, remainingIds, idColName) {
					function findDifferences(id, json) {
						var x, y, b = 0, ret = [];
						for (var item in json) {
							if (json.hasOwnProperty(item)) {
								x = String(json[item]);
								y = String(this.getVal(id, item));
								if (y && x !== y) {
									ret[b] = item;
									b++;
								}
							}
						}
						if (b === 0) return false;
						else return ret;
					}
					function onePossibleMatch(matchedID, minimunFindIdLoop, searchLevel, json) {
						var dif = findDifferences.call(this, matchedID, json);
						if (searchLevel >= minimunFindIdLoop || dif === false) {// contact info changed so update metadata
							if (dif) {
								for (let a = 0, difLen = dif.length; a < difLen; a++) {
									setVal.call(this, matchedID, dif[a], json[dif[a]], false, json.lastModified);
									syncChanges = true;
								}
							}
							return matchedID; //perfect match
						}
						else return false;
					}
					function toArray(json) {
						var arr = [];
						for (let a = 0, len = db[this.id].headers.length - 1; a < len; a++) {
							arr[a] = json[db[this.id].headers[a + 1]];
							//add empty values to table for boolean (false), number (0) or string ("") values
							if (arr[a] === undefined) {
								if (db[this.id].types[a + 1] === "boolean") arr[a] = false;
								else if (/^number|nteger$|itude$/.test(db[this.id].types[a + 1])) arr[a] = 0;
								else arr[a] = "";
							}
						}
						return arr;
					}
					//if there are no registered ids existing/left, create a new one
					if (remainingIds.length === 0) {
						syncChanges = true;
						return addRow.call(this, toArray.call(this, json), false, false, json.lastModified);
					}
					else {
						var ids = [],
							b = 0,
							matchedID = false;
						for (let a = 0, idsLen = remainingIds.length; a < idsLen; a++) {
							if (this.getVal(remainingIds[a], idColName) === json[idColName]) {
								ids[b] = remainingIds[a];
								b++;
							}
						}
						if (ids.length === 1) {//found one possible match
							return onePossibleMatch.call(this, ids[0], 3, searchLevel, json);
						}
						else if (ids.length === 0 && searchLevel > 1) {
							syncChanges = true;
							return addRow.call(this, toArray.call(this, json), false, false, json.lastModified);
						}
						else if (ids.length > 1 && searchLevel >= 4) {
							var numDif = [],
								dif = [];
							for (var k = 0; k < ids.length; k++) {
								dif[k] = findDifferences.call(this, ids[k], json);
								if (dif[k] === false) {
									return ids[k];
								}
								numDif[k] = dif[k].length;
							}
							if (searchLevel >= 5) {
								var closest = 0;
								for (var m = 1; m < numDif.length; m++) {
									if (numDif[m] < numDif[m - 1]) closest = m;
								}
								return onePossibleMatch.call(this, ids[closest], 5, searchLevel, json);
							}
							else return false;
						}
						else {//no confirmed id match found. increase searchLevel and try again on a smaller subset of ids
							return false;
						}
					}
				}
				function finish() {
					if (json.Rows.length > 0) {
						cacheError.call(this, JSON.stringify(json.Rows), "CSV import not completed");
						if (callback instanceof Function) return callback(false, errors[this.id], db[this.id].title, false), this;
						else return this;
					}
					else {
						if (json.replaceAll && remainingIds.length > 0) {
							//delete remaining rows
							for (var h = 0, hLen = remainingIds.length; h < hLen; h++) {
								deleteRow.call(this, remainingIds[h], false, json.lastModified);
							}
							syncChanges = true;
						}
						toLocalStorage.call(this, syncChanges);
						if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, syncChanges), this;
						else return this;
					}
				}
				//try match rows with existing data
				var remainingIds = [],
					f = 0,
					identifierCol = json.identifierCol && headers.indexOf(json.identifierCol) > -1 ? json.identifierCol : headers[0];
				this.forEachRow(function (id) {
					if (db[this.id].ids[id][0] !== "del") {
						remainingIds[f] = id;
						f++;
					}
				}.bind(this));
				for (let loop = 0, g, lenG, id; loop < 10; loop++) {
					for (g = 0, lenG = json.Rows.length; g < lenG; g++) {
						id = getId.call(this, json.Rows[g], loop, remainingIds, identifierCol);
						if (id) {
							json.Rows.splice(g, 1);
							g--;
							lenG--;
							remainingIds.splice(remainingIds.indexOf(id), 1);
						}
					}
				}
				return finish.call(this);
			}
			else {
				if (callback instanceof Function) return callback(false, "incompatible table headers: csv file headers don't match NyckelDB file headers", db[this.id] && db[this.id].title, false), this;
				else return this;
			}
		}
		else {
			if (callback instanceof Function) return callback(false, "no json", db[this.id] && db[this.id].title, false), this;
			else return this;
		}
	}
	function cacheError(error, description) {
		error = description ? String(description) + ": " + String(error) : String(error);
		description = null;
		errors[this.id] = errors[this.id] ? errors[this.id] + "<br />" + error : error;
		if (console && console.log) db[this.id] ? console.log(db[this.id].title + ": " + error) : console.log(error);
	}
	function saveFile(str, fileName, mimeType) {
		//depends on a hidden link with id='hiddenDownloadLink'
		//<a id='hiddenDownloadLink' style='display:none' download='' href=''></a>
		//somewhere in the page to create a web browser download link
		//create link
		if (!mimeType) mimeType = "text/plain";
		if (Windows) {
			// Verify that we are currently not snapped, or that we can unsnap to open the picker
			var currentState = Windows.UI.ViewManagement.ApplicationView.value;
			if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
				!Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
				// Fail silently if we can't unsnap
				cacheError.call(this, "Some kind of Windows 8 bug prevented saving this file.");
				return;
			}
			// Create the picker object and set options
			var savePicker = new Windows.Storage.Pickers.FileSavePicker();
			savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Downloads;
			// Dropdown of file types the user can save the file as
			savePicker.fileTypeChoices.insert("JSON (Javascript Object Notation) File", [".json"]);
			savePicker.fileTypeChoices.insert("Table of Comma Separated Values", [".csv"]);
			savePicker.fileTypeChoices.insert("vCard Contact File", [".vcf"]);
			savePicker.fileTypeChoices.insert("Plain Text", [".txt"]);
			// Default file name if the user does not type one in or select a file to replace
			savePicker.suggestedFileName = fileName;
			savePicker.pickSaveFileAsync().then(function (file) {
				if (file) {
					// Prevent updates to the remote version of the file until we finish making changes and call CompleteUpdatesAsync.
					Windows.Storage.CachedFileManager.deferUpdates(file);
					// write to file
					Windows.Storage.FileIO.writeTextAsync(file, str).done(function () {
						// Let Windows know that we're finished changing the file so the other app can update the remote version of the file.
						// Completing updates may require Windows to ask for user input.
						Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
							if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
								return true;
							} else {
								cacheError.call(this, "File " + file.name + " couldn't be saved.");
								return false;
							}
						}.bind(this));
					}.bind(this));
				} else {
					return false;
				}
			}.bind(this));
		}
		else if (cordova && cordova.file) {
			var fileApi = cordova.file,
				path;
			if (fileApi.externalDataDirectory) path = fileApi.externalDataDirectory;//Android SD Card
			else if (fileApi.documentsDirectory) path = fileApi.documentsDirectory;	//iPhone
			else path = fileApi.dataDirectory;										//Android
			fileApi.writeFile(path, fileName, str, true);
			return true;
		}
		else {
			var url = "";
			if (Blob && (window.navigator.msSaveOrOpenBlob || URL && URL.createObjectURL)) {
				var blobObject = new Blob([str], { type: mimeType });
				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(blobObject, fileName);
					return true;
				}
				else if (URL && URL.createObjectURL) {
					url = URL.createObjectURL(blobObject);
				}
			}
			else {
				url = "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(str);
			}
			var link = document.getElementById("hiddenDownloadLink");
			link.download = fileName;
			link.href = url;
			link.click();
			if (URL) URL.revokeObjectURL(url);
			return true;
		}
	}
	//returns an array of valid search terms
	function searchValidate(str) {
		if (!str) return [];
		str = String(str);
		str = str.replace(/<[^>]+>/g, "");//removeHTMLTags
		str = str.toLowerCase();
		if (/[\xE0-\xFE]/.test(str)) {//toEnglishAlphabet
			str = str.replace(/[\xE0-\xE5]/g, "a");
			str = str.replace(/\xE6/g, "ae");
			str = str.replace(/\xE7/g, "c");
			str = str.replace(/[\xE8-\xEB]/g, "e");
			str = str.replace(/[\xEC-\xEF]/g, "i");
			str = str.replace(/\xF0/g, "d");
			str = str.replace(/\xF1/g, "n");
			str = str.replace(/[\xF2-\xF8]/g, "o");
			str = str.replace(/[\xF9-\xFC]/g, "u");
			str = str.replace(/\xFD|\xFF/g, "y");
			str = str.replace(/\xFE/g, "p");
		}
		str = str.replace(/[^_0-9a-z ]/g, " ");
		//trim
		while (/\s\s/g.test(str)) str = str.replace(/\s\s/g, " ");
		str = str.replace(/^\s+|\s+$/gm, "");
		if (str === "" || str === " ") return [];
		str = str.split(" ");
		for (var a = 0, len = str.length; a < len; a++) {
			//toPropName
			str[a] = str[a].replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
			if (/\d/.test(str[a].charAt(0))) str[a] = "_" + str[a];
		}
		str = deleteDuplicates(str);
		return str;
	}
	function buildSearchIndex(colNamesToIndex, callback) {
		function sortByFirstCol(a, b) {
			//sort index by first column
			return a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1;
		}
		function sortSearchWords(a, b) {
			a = a[0];
			b = b[0];
			//try to compare items as numbers
			if (!isNaN(a * 1) && !isNaN(b * 1)) {
				a = a * 1;
				b = b * 1;
			}
			return a === b ? 0 : a > b ? -1 : 1;
		}
		function start() {
			searchIndex[this.id] = {}; //clear searchIndex
			searchSuggestions[this.id] = []; //clear searchSuggestions
			var indexItem = [],
				a = 0,
				colNums = [];
			for (var h = 0, hLen = colNamesIndexed[this.id].length; h < hLen; h++) {
				colNums[h] = getIndexOfCol.call(this, colNamesIndexed[this.id][h]);
			}
			//get all the words in the table
			for (var b = 0, len = this.getLength(), words, d, f, fLen, dLen = colNamesIndexed[this.id].length; b < len; b++) {
				for (words = [], d = 0; d < dLen; d++) {
					if (colNums[d] > -1) {
						words = searchValidate(db[this.id].table[b][colNums[d]]);
						for (f = 0, fLen = words.length; f < fLen; f++) {
							//arrange words in arrays of [word, columnName, rowId]
							indexItem[a] = [words[f], colNamesIndexed[this.id][d], db[this.id].table[b][0]];
							a++;
						}
					}
				}
			}
			words = null;
			indexItem = indexItem.sort(sortByFirstCol);
			for (var x = 0, y = 1, z = 0, reps = indexItem.length; x < reps; x = z > 0 ? x + z : x + 1, y = x + 1, z = 0) {
				var foundMatch = true,
					row, col,
					i = searchIndex[this.id][indexItem[x][0]] = {};
				while (foundMatch === true) {
					if (!indexItem[y + z] || indexItem[x][0] !== indexItem[y + z][0]) {
						foundMatch = false;
					}
					row = indexItem[x + z][2];
					col = indexItem[x + z][1];
					if (!i[col]) i[col] = [row];
					else i[col].push(row);
					z++;
				}
			}
			indexItem = null; row = null; col = null; i = null;
			var searchWords = [],
				numResultsPerWord = [];
			searchWords = Object.keys(searchIndex[this.id]);
			for (var c = 0, lenC = searchWords.length, g, lenG = colNamesIndexed[this.id].length; c < lenC; c++) {
				numResultsPerWord[c] = 0;
				for (g = 0; g < lenG; g++) {
					if (colNamesIndexed[this.id][g] !== "id" && searchIndex[this.id][searchWords[c]][colNamesIndexed[this.id][g]]) {
						numResultsPerWord[c] += searchIndex[this.id][searchWords[c]][colNamesIndexed[this.id][g]].length;
					}
				}
				searchWords[c] = [numResultsPerWord[c], searchWords[c]];
			}
			searchWords.sort(sortSearchWords);
			for (var e = 0, lenE = searchWords.length; e < lenE; e++) {
				searchSuggestions[this.id][e] = searchWords[e][1];
			}
			stoSearchIndex.call(this);
			searchWords = null; numResultsPerWord = null;
			runQueuedCallbacks.call(this);
			if (callback instanceof Function) return callback();
		}
		function runQueuedCallbacks() {
			while (buildingSearchIndexQueue[this.id].length > 0) {
				buildingSearchIndexQueue[this.id].shift()();
			}
			buildingSearchIndex[this.id] = false;
		}
		if (!this.isDeleted()) {
			if (!buildingSearchIndex[this.id]) {
				buildingSearchIndexQueue[this.id] = [];
				buildingSearchIndex[this.id] = true;
				if (db[this.id].indexable !== undefined) {
					if (!colNamesToIndex) colNamesToIndex = db[this.id].indexable.join("|").split("|");
					//refine colNames list
					else for (let c = 0, d = 0; c < colNamesToIndex.length; c++ , d++) {
						if (colNamesToIndex[c] && colNamesToIndex[c] !== "" && db[this.id].indexable.indexOf(colNamesToIndex[c]) === -1) {
							colNamesToIndex.splice(d, 1);
							d--;
						}
					}
				}
				colNamesIndexed[this.id] = colNamesToIndex ? colNamesToIndex.join("|").split("|") : db[this.id].indexable ? db[this.id].indexable.join("|").split("|") : db[this.id].headers.join("|").split("|");
				APP.Sto.getItem("searchIndex_" + db[this.id].title, null, function (obj) {
					if (typeof obj === "string") obj = JSON.parse(obj);
					if (obj.version === this.Version + "_" + Base64.Version && obj.length === this.getLength() && obj.lastModified === db[this.id].lastModified && obj.colNamesIndexed.join("") === colNamesIndexed[this.id].join("")) {
						searchIndex[this.id] = obj.searchIndex;
						searchSuggestions[this.id] = obj.searchSuggestions;
						recentlySearched[this.id] = obj.recentlySearched;
						runQueuedCallbacks.call(this);
						if (callback instanceof Function) return callback();
					}
					else return start.call(this);
				}.bind(this), start.bind(this));
			}
			else if (callback instanceof Function) {
				buildingSearchIndexQueue[this.id].push(callback);
			}
		}
	}
	function stoSearchIndex() {
		APP.Sto.setItem("searchIndex_" + db[this.id].title, {
			"lastModified": db[this.id].lastModified,
			"colNamesIndexed": colNamesIndexed[this.id],
			"searchIndex": searchIndex[this.id],
			"searchSuggestions": searchSuggestions[this.id],
			"recentlySearched": recentlySearched[this.id],
			"length": this.getLength(),
			"version": this.Version + "_" + Base64.Version
		});
	}
	function setProp(propName, value, editTime, storeBool) {
		if (typeof value === "string") {
			value = value.replace(/<[^>]+>/g, "");//remove html markup
			if (value !== "" && !isNaN(value * 1)) value = value * 1; //convert numbers in String form to Number form
			if (value === "true") value = true;
			if (value === "false") value = false;
		}
		propName = VAL.toPropName(propName);
		if (!this.isDeleted() && db[this.id].properties[propName] && valueIsValid.call(this, value, db[this.id].properties[propName][2])) {
			if (db[this.id].properties[propName] !== undefined) {
				editTime = typeof editTime === "number" ? editTime : timestamp(db[this.id].created);
				db[this.id].properties[propName][0] = value;
				db[this.id].properties[propName][1] = editTime;
				db[this.id].lastModified = editTime > db[this.id].lastModified ? editTime : db[this.id].lastModified;
				this.syncPending = true;
				if (storeBool !== false) toLocalStorage.call(this, true);
				return value;
			}
			else cacheError.call(this, propName, "invalid property name");
		}
		else cacheError.call(this, value, "cannot set " + propName);
	}
	function addRow(array, id, storeBool, editTimesArr) {
		function getNextId(idLength, existingIds, startingPoint) {
			var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),
				forbidden = "alert all anchor anchors area assign blur button checkbox clearInterval clearTimeout clientInformation close closed confirm constructor crypto decodeURI decodeURIComponent";
			forbidden += " defaultStatus document element elements embed embeds encodeURI encodeURIComponent escape event fileUpload focus form forms frame innerHeight innerWidth layer layers link location";
			forbidden += " mimeTypes navigate navigator frames frameRate hidden history image images offscreenBuffering open opener option outerHeight outerWidth packages pageXOffset pageYOffset parent";
			forbidden += " parseFloat parseInt password pkcs11 plugin prompt propertyIsEnum radio reset screenX screenY scroll secure select self setInterval setTimeout status submit taint text textarea";
			forbidden += " Array Date eval function hasOwnProperty Infinity isFinite isNaN isPrototypeOf length Math NaN name Number Object prototype String toString undefined valueOfabstract arguments";
			forbidden += " boolean break byte case catch char class const continue debugger default delete do double else enum eval export extends false final finally float for function goto if implements";
			forbidden += " import in instanceof int interface let long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof";
			forbidden += " top unescape untaint window var void volatile while with yield onblur onclick onerror onfocus onkeydown onkeypress onkeyup onmouseover onload onmouseup onmousedown onsubmit";
			forbidden += " jQuery Lawnchair Dropbox Base64 WinJS cordova APP COM VAL getClass java JavaArray javaClass JavaObject JavaPackage debug DEBUGMODE DEBUGTOCONSOLE DEBUGCOUNT DEBUGTIME DEBUGSTOP";
			forbidden = forbidden.split(" ");
			idLength = parseInt(idLength, 10);

			existingIds = existingIds || {};
			if (typeof existingIds !== "object") {
				cacheError.call(this, "getNextId failed", "Invalid parameters: existingIds expects a JSON object");
				return false;
			}
			var alphabetLength = alphabet.length,
				maxIdsPossible = Math.pow(alphabetLength, idLength - 1) * (alphabetLength - 10),
				newId = "",
				num = 0,
				alpha = alphabet[0];
			if (startingPoint) {
				newId = VAL.toEnglishAlphabet(startingPoint);
				newId = newId.replace(/[^A-z0-9]/g, "");
				if (/^\d/.test(newId)) newId = alpha + newId;
				newId = newId.slice(0, idLength);
			}
			while (newId.length < idLength) newId += alpha;
			for (var activeChar = idLength - 1, letterIndex, end; (existingIds[newId] !== undefined || forbidden.indexOf(newId) !== -1) && activeChar > -1 && num < maxIdsPossible; activeChar-- , num++) {
				for (letterIndex = alphabet.indexOf(newId.charAt(activeChar)); (existingIds[newId] !== undefined || forbidden.indexOf(newId) !== -1) && letterIndex < alphabetLength && num < maxIdsPossible; letterIndex++ , num++) {
					if (letterIndex + 1 === alphabetLength) {
						while (letterIndex + 1 === alphabetLength) {
							//reached the end of the alphabet
							end = "";
							for (var c = 0; c < newId.slice(activeChar, idLength).length; c++) end += alpha;
							if (activeChar === 0) {
								//reached the first character in the id, roll over to all letters back to A or 0 or whatever
								newId = end;
								activeChar = idLength - 1;
								letterIndex = alphabet.indexOf(newId.charAt(activeChar)) - 1;
								break;
							}
							letterIndex = alphabet.indexOf(newId.charAt(activeChar - 1));
							if (letterIndex + 1 === alphabetLength || activeChar === 1 && /\d/.test(alphabet[letterIndex + 1])) {
								//the next character is also at the end of the alphabet
								activeChar--;
								letterIndex = alphabet.indexOf(newId.charAt(activeChar)) - 1;
								continue;
							}
							newId = newId.slice(0, activeChar - 1) + alphabet[letterIndex + 1] + end;
							activeChar--;
							if (alphabet[letterIndex + 1] !== "") {
								newId = newId.slice(0, activeChar) + alphabet[letterIndex + 1] + newId.slice(activeChar + 1, idLength);
								activeChar = idLength - 1;
								letterIndex = alphabet.indexOf(newId.charAt(activeChar)) - 1;
							}
						}
					}
					else {
						if (activeChar === 0 && /\d/.test(alphabet[letterIndex + 1])) {
							num--;
							continue;
						}
						newId = newId.slice(0, activeChar) + alphabet[letterIndex + 1] + newId.slice(activeChar + 1, idLength);
					}
				}
			}
			alphabet = null; forbidden = null; alphabetLength = null; alpha = null; activeChar = null; letterIndex = null; end = null;
			if (num > maxIdsPossible) {
				cacheError.call(this, "getNextId failed", "You have exceeded a design limitation in the number of possible records that this application can handle.");
				return false;
			}
			else return newId;
		}
		if (!this.isDeleted()) {
			if (id && array.length === db[this.id].headers.length && array[0] === id) {
				array = array.slice(1);
			}
			if (array.length !== db[this.id].headers.length - 1) {
				cacheError.call(this, array, "new row doesn't match table size: " + db[this.id].headers.length);
				return false;
			}
			id = getNextId.call(this, 3, db[this.id].ids, id ? id : array && array instanceof Array ? array.join("") : null);
			if (id) {
				var row = [id];
				if (array && array instanceof Array) {
					db[this.id].table.push(row);
					rowIndex[this.id] = {};
					db[this.id].lastModified = editTimesArr && editTimesArr[0] !== undefined ? editTimesArr[0] + db[this.id].created > db[this.id].lastModified ? editTimesArr[0] + db[this.id].created : db[this.id].lastModified : timestamp();
					db[this.id].ids[id] = editTimesArr && editTimesArr[0] !== undefined ? [editTimesArr[0]] : [timestamp(db[this.id].created)];
					for (let a = 0, len = db[this.id].headers.length - 1, editTime; a < len; a++) {
						editTime = editTimesArr && editTimesArr[a + 1] !== undefined ? editTimesArr[a + 1] : false;
						setVal.call(this, id, a + 1, array[a], false, editTime);
					}
					row = null;
					this.syncPending = true;
					if (storeBool !== false) toLocalStorage.call(this, true);
					return id;
				}
				else {
					cacheError.call(this, array, "cannot add row");
					row = null;
					return false;
				}
			}
			else return false;
		}
		else {
			cacheError.call(this, "please recreate table before adding rows");
			return false;
		}
	}
	function setVal(rowId, colName, newValue, storeBool, editTime, callback) {
		var error;
		if (typeof newValue === "string") {
			newValue = newValue.replace(/<[^>]+>/g, "");//remove html markup
			if (newValue !== "" && !isNaN(newValue * 1)) newValue = newValue * 1; //convert numbers in String form to Number form
			if (newValue === "true") newValue = true;
			if (newValue === "false") newValue = false;
		}
		if (!this.isDeleted()) {
			var type = isNumeric(colName) ? db[this.id].types[VAL.toPropName(db[this.id].headers[colName])] : db[this.id].types[colName];
			if (valueIsValid.call(this, newValue, type)) {//get row index
				type = null;
				var rowIndex = getIndexOfRow.call(this, rowId),
					colIndex = getIndexOfCol.call(this, colName);
				//if found, update data
				if (rowIndex > -1 && colIndex > 0) {
					editTime = typeof editTime === "number" ? editTime : timestamp(db[this.id].created + db[this.id].ids[db[this.id].table[rowIndex][0]][0]);
					db[this.id].table[rowIndex][colIndex] = newValue;
					db[this.id].ids[db[this.id].table[rowIndex][0]][colIndex] = editTime;
					var thisModified = editTime + db[this.id].ids[db[this.id].table[rowIndex][0]][0] + db[this.id].created;
					db[this.id].lastModified = thisModified > db[this.id].lastModified ? thisModified : db[this.id].lastModified;
					thisModified = null; rowIndex = null; colIndex = null;
					this.syncPending = true;
					if (storeBool !== false) toLocalStorage.call(this, true);
					return callback instanceof Function ? callback(true, false, db[this.id].title, true) : newValue;
				}
				else {
					error = rowIndex === -1 ? "rowId not found" : "colName not found";
					cacheError.call(this, rowId + "," + colName, error);
					rowIndex = null; colIndex = null;
					return callback instanceof Function ? callback(false, error, db[this.id].title, this.syncPending) : error;
				}
			}
			else return callback instanceof Function ? callback(false, errors[this.id], db[this.id].title, this.syncPending) : errors[this.id];
		}
		else {
			error = "table is deleted";
			cacheError.call(this, error);
			return callback instanceof Function ? callback(false, error, db[this.id].title, this.syncPending) : error;
		}
	}
	function deleteRow(rowId, storeBool, editTime) {
		if (!this.isDeleted()) {//get row index
			var index = getIndexOfRow.call(this, rowId);
			//if found, update data
			if (index > -1) {
				//delete row
				db[this.id].table.splice(index, 1);
				rowIndex[this.id] = {};
				index = null;
				editTime = typeof editTime === "number" ? editTime : timestamp(db[this.id].created);
				db[this.id].ids[rowId] = ["del", editTime];
				db[this.id].lastModified = editTime + db[this.id].created > db[this.id].lastModified ? editTime + db[this.id].created : db[this.id].lastModified;
				this.syncPending = true;
				if (storeBool !== false) toLocalStorage.call(this, true);
				return true;
			}
			else {
				index = null;
				cacheError.call(this, rowId, "row does not exist or was already deleted");
				return false;
			}
		}
		else {
			cacheError.call(this, rowId, "could not delete row, table has been deleted");
			return false;
		}
	}
	function validateEditTime(num, createdDiff) {
		var t = timestamp();
		createdDiff = createdDiff || 0;
		if (num === "del") return num;
		else if (!(typeof num * 1 === "number")) return t;
		else return num + db[this.id].created - createdDiff <= t ? num : num - db[this.id].created;
	}
	function deleteTable(callback, editTime, storeBool) {
		var msg = "Are you sure you want to delete " + db[this.id].title + " ?",
			del = function () {
				deleteTableById.call(this, this.id, editTime);
				this.syncPending = true;
				if (storeBool !== false) toLocalStorage.call(this, true);
				if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, true), this;
				else return this;
			}.bind(this),
			cancel = function () {
				if (callback instanceof Function) return callback(false, errors[this.id], db[this.id].title, false), this;
				else return this;
			}.bind(this);
		if (APP.confirm) APP.confirm(msg, del, cancel, { "okButton": "Delete" });
		else if (window && window.confirm(msg)) del();
		else cancel();
		msg = null; del = null; cancel = null;
	}
	function deleteTableById(id, editTime) {
		db[id] = {
			"title": db[id].title,
			"created": db[id].created,
			"deleted": editTime ? validateEditTime.call(this, editTime) : timestamp(),
			"lastModified": editTime > db[id].lastModified ? editTime : db[id].lastModified
		};
	}
	function initiateNewDB(title, callback) {
		function newDBS() {
			dbs[uid] = this.title;
			//declare private db object and unique this.id for every new instance of APP.NyckelBDObj()
			this.id = Base64.number_hash(this.title + Base64.hash(uid++), 12);
			searchIndex[this.id] = {};
			searchSuggestions[this.id] = [];
			recentlySearched[this.id] = [];
			rowIndex[this.id] = {};
			APP.Sto.setItem("tables", JSON.stringify(dbs));
			return callback(title);
		}
		title = String(title).replace(/[^A-z\s_0-9]/g, "");
		this.title = VAL.toPropName(title);
		APP.Sto && APP.Sto.getItem("tables", null, function (tables) {
			if (tables) {
				dbs = JSON.parse(tables);
				if (dbs.indexOf(this.title) > -1) {
					this.id = Base64.number_hash(this.title + Base64.hash(dbs.indexOf(this.title)), 12);
					searchIndex[this.id] = {};
					searchSuggestions[this.id] = [];
					recentlySearched[this.id] = [];
					rowIndex[this.id] = {};
					uid++;
					return callback(title);
				}
				else newDBS.call(this);
			}
			else cacheError.call(this, "couldn't find tables");
		}.bind(this), newDBS.bind(this));
	}
	function checkHeadersArray(headers) {
		var header;
		for (var a = 0, b = 1, len = headers.length, c; a < len; a++) {
			headers[a] = VAL.toPropName(headers[a]);
			header = headers[a];
			for (c = a + 1, b = 2; c < len; c++) {
				if (headers[c] === header) {
					headers[a] = header + "_" + 1;
					headers[c] = header + "_" + b;
					b++;
				}
			}
		}
		header = null; a = null; b = null; c = null; len = null;
		if (headers[0] !== "id") {
			if (headers.indexOf("id") > -1) headers[headers.indexOf("id")] = "_id";
			headers.unshift("id");
		}
		return headers;
	}
	function createBase64File(key, token, callback) {
		function dataString() {
			var str = Base64.write(JSON.stringify(db[this.id]), key);
			return JSON.stringify({
				"data": str,
				"signature": Base64.hmac(str, key),
				"version": this.Version + "_" + Base64.Version
			});
		}
		function syncFile() {
			var title = VAL.toPropName(db[this.id].title);
			if (!dbxSyncObj[title] || db[this.id].lastModified > dbxSyncObj[title]) dbxSyncObj[title] = db[this.id].lastModified;
			return JSON.stringify(dbxSyncObj);
		}
		function syncToken(token) {
			if (token) {
				token = typeof token === "string" ? JSON.parse(token) : token;
				if (token.version === this.Version + "_" + Base64.Version) {
					if (token.signature && token.token && token.signature === Base64.hmac(token.token, key)) {
						token = JSON.parse(Base64.read(token.token, key));
						for (var i in token) {
							if (!dbxSyncObj[i]) dbxSyncObj[i] = token[i];
						}
					}
					else {
						syncError = true;
						syncErrorTime = new Date().getTime();
						cacheError.call(this, "incorrect key tried");
					}
				}
				else cacheError.call(this, "token version not supported");
			}
			var title = VAL.toPropName(db[this.id].title);
			if (!dbxSyncObj[title] || db[this.id].lastModified > dbxSyncObj[title]) dbxSyncObj[title] = db[this.id].lastModified;
			token = Base64.write(JSON.stringify(dbxSyncObj), key);
			return JSON.stringify({
				"token": token,
				"signature": Base64.hmac(token, key),
				"version": this.Version + "_" + Base64.Version
			});
		}
		if (syncError && new Date().getTime() - syncErrorTime < 6e4) return callback instanceof Function ? (callback(false, "try again later", db[this.id].title, false), this) : this;
		var obj = {
			"title": db[this.id].title,
			"file": dataString.call(this),
			"syncFile": syncFile.call(this),
			"syncToken": syncToken.call(this, token)
		};
		return callback instanceof Function ? (callback(true, errors[this.id], db[this.id].title, obj), this) : this;
	}
	/** @param {string} tableTitle the database title
	* @param {arrayOrObject} tableHeaders an array of the column headers, or object containing column headers and corresponding types
	* @param {arrayOrObject} headerTypes optional, if not specified in with tableHeaders
	* @param {object} options {
	*	customProperties:{
	*	  <property1Name>: {
	*	    initialValue: <value>,
	*	    type: "String", "Boolean" or "Number" <String>
	*	  },
	*	  <property2Name>...
	*	},
	*	importData: <json>, table data that is ready to drop in to the database without parsing
	*	importJSON: <json>, json data that needs to be parsed
	*	importCSV: <string>, CSV data that needs to be converted to JSON and then parsed
	*	doNotIndex: <Array of tableHeaders>, any columns that do not need to ever be search indexed. Can speed up load times
	*	initialIndex: <Array of tableHeaders>, columns to be search indexed on load. Specifying this value can speed up load times
	*	key: <string>,
    *	token: <string>
	* }
	* @param {function} callback the callback function
	* @returns {parameters} to callback function: success (boolean), errors (array), tableTitle (string), and syncPending (boolean)
	*/
	function NyckelDBObj(tableTitle, tableHeaders, headerTypes, options, callback) {
		function validateType(type, options) {
			type = type ? String(type).toLowerCase().replace(/[^a-z]/g, "") : "null";
			if (!options) {
				type = type.replace(/^(posinteger|posintegers|positiveint|positiveinteger|pos)$/, "posInteger");
				type = type.replace(/^(neginteger|negintegers|negativeint|negativeinteger|neg)$/, "negInteger");
				type = type.replace(/^(uniquestring|uniquestrings|unique|id|uniqueid)$/, "uniqueString");
				type = type.replace(/^(multiline|mulitlinestring|multilinestring|multilinestrings)$/, "multilineString");
				type = type.replace(/^(phonenumber|phonenumbers|phone|phones|mobile|mobilephone|homephone|workphone|personalphone|cellphone|cell)$/, "phoneNumber");
				type = type.replace(/^(streetaddress|streetaddresses|street|address)$/, "streetAddress");
				type = type.replace(/^(mailaddress|mailaddresses|mail|pobox)$/, "mailAddress");
				type = type.replace(/^(citycounty|city|town|citytown|citytowncounty|county)$/, "cityCounty");
				type = type.replace(/^(provincestateregion|province|state|region)$/, "provinceStateRegion");
				type = type.replace(/^(nation)$/, "country");
				type = type.replace(/^(postalzipcode|postalcode|zipcode|postal|zip)$/, "postalZipCode");
				type = type.replace(/^(givenname|givennames|firstnames|names|firstname|first|name)$/, "givenName");
				type = type.replace(/^(familyname|familynames|lastnames|lastname|last|family)$/, "familyName");
				type = type.replace(/^(geolocation|geolocations|location|geo|gpscoordinates)$/, "geoLocation");
				type = type.replace(/^(time|dates|times)$/, "date");
				type = type.replace(/^(emailaddress|emailaddresses)$/, "email");
				type = type.replace(/^(passwords|key|keys)$/, "password");
				type = type.replace(/^(int|integers)$/, "integer");
			}
			type = type.replace(/^(num|numbers)$/, "number");
			type = type.replace(/^(bool|booleans)$/, "boolean");
			type = type.replace(/^(str|strings)$/, "string");
			type = type.replace(/^(all|other)$/, "any");

			if (type && type.match(validTypes)) return type;
			else {
				if (options) cacheError.call(_this, type, "customProperties can only be set to string, number, boolean, or any, not");
				else cacheError.call(_this, type, "invalid Header type");
				return "any";
			}
		}
		function applyHeaders(headers) {
			if (headers && headers instanceof Array) {
				return checkHeadersArray(headers);
			}
			else if (headers && typeof headers === "object") {
				headerTypes = { "id": "uniqueString" };
				var _headers = headers;
				b = 1;
				headers = ["id"];
				for (a in _headers) {
					if (a !== "id") {
						if (typeof _headers[a] === "object") {
							headerTypes[a] = validateType.call(_this, _headers[a].type);
						}
						else if (typeof _headers[a] === "string") {
							headerTypes[a] = validateType.call(_this, _headers[a]);
						}
						headers[b] = a;
						b++;
					}
				}
				_headers = null;
				return headers;
			}
			else cacheError.call(_this, "Please include properly formatted table header information");
		}
		function applyHeaderTypes(types) {
			if (types && types instanceof Array) {
				var _types = { "id": "uniqueString" },
					idExists = tableHeaders[0] === "id" && tableHeaders.length === types.length + 1;
				for (a = idExists ? 1 : 0, b = 0, len = tableHeaders.length; a < len; a++ , b++) {
					_types[VAL.toPropName(tableHeaders[a])] = validateType.call(_this, types[b]);
				}
				idExists = null;
				return _types;
			}
			else if (types && typeof types === "object") {
				types.id = "uniqueString";
				for (a = 0, len = tableHeaders.length; a < len; a++) {
					if (tableHeaders[a] !== VAL.toPropName(tableHeaders[a])) {
						var oldType = tableHeaders[a];
						tableHeaders[a] = VAL.toPropName(tableHeaders[a]);
						types[tableHeaders[a]] = types[oldType];
						types[tableHeaders[a]] = validateType.call(_this, types[tableHeaders[a]]);
						delete types[oldType];
						oldType = null;
					}
					else types[tableHeaders[a]] = validateType.call(_this, types[tableHeaders[a]]);
				}
				return types;
			}
			else cacheError.call(_this, "Please include properly formatted header types");
		}
		function applyProperties(props) {
			if (props) {
				var _props = {};
				if (props instanceof Array) {
					for (var a = 0, len = props.length; a < len; a++) {
						_props[VAL.toPropName(props[a])] = [0, 0, "any"];
					}
					a = null; len = null;
					return _props;
				}
				else if (typeof props === "object") {
					var _type = null, _initialValue = 0, _prop;
					for (var prop in props) {
						if (props.hasOwnProperty(prop)) {
							_prop = VAL.toPropName(prop);
							if (typeof props[prop] === "string") {
								_type = validateType.call(_this, props[prop], "custom");
								_initialValue = _type === "string" ? "" : _type === "boolean" ? false : 0;
								_props[_prop] = [_initialValue, 0, _type];
							}
							else if (props[prop] instanceof Array && props[prop].length === 3) {
								_type = validateType.call(_this, props[prop][2], "custom");
								if (valueIsValid.call(_this, props[prop][0], _type)) _props[_prop] = [props[prop][0], props[prop][1], _type];
							}
							else if (typeof props[prop] === "object") {
								if (props[prop].type) {
									_props[_prop] = [0, 0, validateType.call(_this, props[prop].type, "custom")];
								}
								else _props[_prop] = [0, 0, "any"];
								if (props[prop].initialValue && valueIsValid.call(_this, props[prop].initialValue, _props[_prop][2])) {
									_props[_prop][0] = props[prop].initialValue;
								}
								else {
									_type = _props[_prop][2];
									_initialValue = _type === "string" ? "" : _type === "boolean" ? false : 0;
									_props[_prop][0] = _initialValue;
								}
							}
							else cacheError.call(_this, prop, "invalid customProperty");
						}
					}
					_type = null; _initialValue = null; _prop = null; prop = null;
					return _props;
				}
				else cacheError.call(_this, "Please supply properties in proper format");
			}
			else return {};
		}
		function setIndexableColumns() {
			if (options.doNotIndex && options.doNotIndex instanceof Array) {
				db[_this.id].indexable = db[_this.id].headers.join("|").split("|");
				db[_this.id].indexable.splice(0, 1);//remove "id" column
				for (var a = 0, len = options.doNotIndex.length, i; a < len; a++) {
					i = db[_this.id].indexable.indexOf(VAL.toPropName(options.doNotIndex[a]));
					if (i > -1) db[_this.id].indexable.splice(i, 1);
				}
				a = null; len = null; i = null;
			}
		}
		function gotCachedTable(json) {
			if (json) {
				if (typeof json === "string") json = JSON.parse(json);
				if (json.version !== undefined && json.title && json.title === tableTitle && json.created !== undefined && json.lastModified !== undefined) {
					var version = String(json.version).split("_");
					if (json.lastModified < json.created && json.lastModified !== 0 || json.lastModified > timestamp()) {
						console.log("database lastModified dates are corrupted: " + json.lastModified);
						didntGetCachedTable();
					}
					else if (String(version[0]) === String(this.Version)) {
						if (json.data && String(version[1]) === String(Base64.Version) && Base64.hmac(json.data, options.key) === json.signature) {
							json = Base64.read(json.data, options.key);
							return importJSON.call(_this, json, function (syncChanges, errors) {
								if (syncChanges && !errors) return createBase64File.call(_this, options.key, options.token, callback);
								else if (callback instanceof Function) return callback(true, errors, db[_this.id].title, false);
								else return errors;
							}, false, true);
						}
						else {//loading directly from local storage
							db[_this.id] = json;
							buildSearchIndex.call(_this, options.initialIndex || null);
							return createBase64File.call(_this, options.key, options.token, callback);
						}
					}
					else {
						console.log("versions do not match", String(version[0]), String(this.Version));
						didntGetCachedTable();
					}
				}
				else {
					console.log("properties don't match");
					didntGetCachedTable();
				}
			}
			else {
				console.log('json not found');
				didntGetCachedTable();
			}
		}
		function didntGetCachedTable() {
			console.log("didnt get cached table");
			//creating a brand new table
			db[_this.id] = options.importData && typeof options.importData.deleted !== "undefined" ? {
				"title": tableTitle,
				"created": options.importData.created || timestamp(),
				"deleted": options.importData.deleted,
				"lastModified": options.importData.lastModified !== undefined ? options.importData.lastModified : 0
			} : {
					"title": tableTitle,
					"created": options.importData && options.importData.created !== undefined ? options.importData.created : timestamp(),
					"lastModified": options.importData && options.importData.lastModified !== undefined ? options.importData.lastModified : 0,
					"version": _this.Version + "_" + Base64.Version,
					"ids": options.importData && options.importData.ids ? options.importData.ids : {},
					"headers": options.importData && options.importData.headers ? applyHeaders.call(_this, options.importData.headers) : tableHeaders || ["id"],
					"types": options.importData && options.importData.types ? applyHeaderTypes.call(_this, options.importData.types) : headerTypes,
					"table": options.importData && options.importData.table ? options.importData.table : [],
					"properties": options.importData && options.importData.properties ? options.importData.properties : properties
				};
			//validate ids
			for (let id in db[_this.id].ids) {
				if (db[_this.id].ids.hasOwnProperty(id)) {
					for (let a = 0; a < db[_this.id].ids[id].length; a++) {
						db[_this.id].ids[id][a] = validateEditTime.call(_this, db[_this.id].ids[id][a]);
					}
				}
			}
			for (let prop in db[_this.id].properties) {
				if (db[_this.id].properties.hasOwnProperty(prop)) {
					db[_this.id].properties[prop][1] = validateEditTime.call(_this, db[_this.id].properties[prop][1]);
				}
			}
			setIndexableColumns.call(_this);
			properties = null;
			if (options.importJSON) importJSON.call(_this, options.importJSON, function () {
				return createBase64File.call(_this, options.key, options.token, callback);
			}, );
			else {
				toLocalStorage.call(_this, true);
				return createBase64File.call(_this, options.key, options.token, callback);
			}
		}
		function done(title) {
			tableTitle = title;
			tableHeaders = applyHeaders.call(this, tableHeaders);
			if (headerTypes) headerTypes = applyHeaderTypes.call(this, headerTypes);
			if (options.importData && options.importData.properties) options.importData.properties = applyProperties.call(this, options.importData.properties);
			else if (options.customProperties) properties = applyProperties.call(this, options.customProperties);
			//try to get cached table
			if (APP.Sto) APP.Sto.getItem(tableTitle, null, gotCachedTable.bind(this), didntGetCachedTable.bind(this));
			else return callback instanceof Function ? callback(false, "localStorage not found", tableTitle, false) : "localStorage not found";
		}
		options = options || {};
		if (typeof options.importData === "string") options.importData = JSON.parse(options.importData);

		if (options.importData && (options.importData.lastModified < options.importData.created && options.importData.lastModified !== 0 || options.importData.lastModified > timestamp())) {
			console.log("importData lastModified dates are corrupted: " + options.importData.lastModified);
		}
		tableTitle = options.importData && options.importData.title ? options.importData.title : tableTitle;
		var a, b, len, properties = {};
		this.syncPending = true;
		this.Version = 0.3;
		var _this = this;
		if (tableTitle == null) {//checks for null or undefined
			return callback instanceof Function ? callback(false, "title not defined", null, false) : "title not defined";
		}
		else {
			if (options.importData && options.importData.data) {
				if (options.importData.version !== this.Version + "_" + Base64.Version && options.importData.version !== this.Version + "." + Base64.Version) return callback instanceof Function ? callback(false, "imported database version not supported", null, false) : "imported database version not supported";
				else if (Base64.hmac(options.importData.data, options.key) === options.importData.signature) {
					options.importData = JSON.parse(Base64.read(options.importData.data, options.key));
					initiateNewDB.call(this, tableTitle, done.bind(this));
				}
				else return callback instanceof Function ? callback(false, "imported databse corrupted", null, false) : "imported database corrupted";
			}
			else initiateNewDB.call(this, tableTitle, done.bind(this));
		}
	}
	var db = db || {},
		uid = 0,
		dbs = [],
		dbxSyncObj = {},
		searchIndex = {},
		searchSuggestions = {},
		recentlySearched = {},
		colNamesIndexed = {},
		buildingSearchIndex = {},
		buildingSearchIndexQueue = {},
		rowIndex = {},
		errors = [],
		syncFrequency = 3e5, //5 minutes
		syncError = false,
		syncErrorTime,
		validTypes = /^(any|number|integer|posInteger|negInteger|boolean|string|uniqueString|multilineString|date|email|phoneNumber|password|streetAddress|mailAddress|cityCounty|provinceStateRegion|country|postalZipCode|givenName|familyName|geoLocation|longitude|latitude)$/;

	/*options = {
		"colNames": Array,
		"fuzzyMatch": Boolean 
	 }*/
	NyckelDBObj.prototype.search = function (searchQuery, options, callback) {
		function findMatches(arr, min) {
			min = min || 2;
			if (min === 1) return arr;
			var ret = [], /*return array*/
				a = 0,
				mat = false; /*match found*/
			arr = arr.sort();
			for (var x = 0, y = x + 1, len = arr.length, b; x < len - min + 1; x++ , y = x + 1) {
				if (String(arr[x]) === String(arr[y])) {
					mat = true;
					for (b = 0; b < min - 1; b++) {
						if (arr[x] !== arr[y + b]) mat = false;
					}
					if (mat === true) {
						ret[a] = arr[x];
						x = x + min - 1;
						a++;
					}
				}
			}
			arr = null; a = null; mat = null; min = null; x = null; y = null; len = null, b = null;
			return ret;
		}
		function querySearchIndex(searchQuery, lastRoundBool, callback) {
			var aLen = searchQuery.length,
				tempIds = [];
			for (let a = 0, b, bLen = colNamesIndexed[this.id].length, i; a < aLen; a++) {
				for (b = 0, i = []; b < bLen; b++) {
					if (searchIndex[this.id][searchQuery[a]] && searchIndex[this.id][searchQuery[a]][colNamesIndexed[this.id][b]]) {
						i = i.concat(searchIndex[this.id][searchQuery[a]][colNamesIndexed[this.id][b]]);
					}
				}
				tempIds = tempIds.concat(deleteDuplicates(i));
			}
			ids = ids.concat(deleteDuplicates(findMatches.call(this, tempIds, aLen)));
			if (ids.length > 0) {
				recentlySearched[this.id] = deleteDuplicates(searchQuery.concat(recentlySearched[this.id]));
				recentlySearched[this.id] = recentlySearched[this.id].slice(0, 25);
				stoSearchIndex.call(this);
			}
			if (lastRoundBool) return callback instanceof Function ? callback(ids, errors[this.id], db[this.id].title, this.requiresSync) : ids;
		}
		function fuzzyMatch(searchQuery, callback) {
			//collect all possible alternate queries
			for (let a = 0, lenA = searchQuery.length, b, lenB; a < lenA; a++) {
				if (Spelling[searchQuery[a]]) {
					searchQuery[a] = Spelling[searchQuery[a]].split(" ");
				}
				else searchQuery[a] = [searchQuery[a]];
			}
			//combine them in all possible combinations
			var queries = [],
				activeColumn = 0,
				a = 0,
				n = 0,
				cursor = [],
				len = searchQuery.length;
			while (len) cursor[--len] = 0;//initialize cursors
			len = searchQuery.length;
			//while the last item in the last column has not been reached
			while (searchQuery[n]) {
				//initiate the new combination
				queries[a] = [searchQuery[0][cursor[0]]];
				//write the new combination
				for (let c = 1; c < len; c++) {
					queries[a].push(searchQuery[c][cursor[c]]);
				}
				a++;
				n = 0;
				cursor[n]++;
				while (n <= len && cursor[n] === searchQuery[n].length) {
					cursor[n] = 0;
					cursor[n + 1]++;
					n++;
					if (n === len) break;
				}		
			}
			for (let a = 0, len = queries.length - 1; a < len; a++) {
				querySearchIndex.call(this, queries[a]);
			}
			return querySearchIndex.call(this, queries[queries.length - 1], true, callback);
		}
		function search(searchQuery, callback) {
			if (options.fuzzyMatch) fuzzyMatch.call(this, searchQuery, callback);
			else querySearchIndex.call(this, searchQuery, true, callback);
		}
		if (!this.isDeleted()) {
			options = options || {};
			var cols = options.colNames ? options.colNames.join("|").split("|") : null,
				ids = [];
			searchQuery = searchValidate(searchQuery);
			//check for searchIndex
			buildSearchIndex.call(this, cols, search.bind(this, searchQuery, callback));
		}
		else return callback instanceof Function ? callback([], "no data", db[this.id].title, this.requiresSync) : [];
	};
	NyckelDBObj.prototype.advancedSearch = function (searchQuery, options, callback) {
		function filter(ids, filterOutQueries, callback) {
			if (filterOutQueries.length > 0) {
				for (let b = 0, lenB = filterOutQueries.length; b < lenB; b++) {
					(function (b) {
						_this.search.call(_this, filterOutQueries[b], options, function (result, err, table, sync) {
							if (!err) filterIds = filterIds.concat(result);
							else return callback instanceof Function ? callback([], err, table, sync) : [];
							if (b === lenB - 1) {
								filterIds = deleteDuplicates(filterIds);
								if (filterIds.length > 0) {
									for (let c = 0, lenC = filterIds.length, t = "", d, lenD; c < lenC; c++) {
										t = String(filterIds[c]);
										for (d = 0, lenD = ids.length; d < lenD; d++) {
											if (t === String(ids[d])) {
												ids.splice(d, 1);
												d--;
												lenD--;
											}
										}
									}
								}
								return callback instanceof Function ? callback(ids, errors[_this.id], db[_this.id].title, _this.requiresSync) : ids;
							}
						});
					})(b);
				}
			}
			else return callback instanceof Function ? callback(ids, errors[_this.id], db[_this.id].title, _this.requiresSync) : ids;
		}
		if (searchQuery) {
			var ids = [],
				filterIds = [],
				filterOutQueries = [],
				_this = this;
			if (/\s\+|\s\-/.test(searchQuery)) {
				searchQuery = searchQuery.split(" +");
				for (let a = 0; a < searchQuery.length; a++) {
					if (/\s\-/.test(searchQuery[a])) {
						var f = searchQuery[a].split(" -");
						searchQuery[a] = f.shift();
						filterOutQueries.push.apply(filterOutQueries, f);
					}
				}
			}
			else searchQuery = [searchQuery];
			for (let a = 0, len = searchQuery.length; a < len; a++) {
				(function (a) {
					_this.search.call(_this, searchQuery[a], options, function (result, errors, table, sync) {
						if (!errors) ids = ids.concat(result);
						else return callback instanceof Function ? callback([], errors, table, sync) : [];
						if (a === len - 1) {
							ids = deleteDuplicates(ids);
							filter.call(_this, ids, filterOutQueries, callback);
						}
					});
				})(a);
			}
		}
		else return callback instanceof Function ? callback([], "no query supplied", db[this.id].title, this.requiresSync) : [];
	};
	NyckelDBObj.prototype.getSearchSuggestions = function (searchQuery, options, callback) {
		function buildSuggestionsList() {
			searchQuery = searchQuery.split(" ");
			var last = searchQuery.pop(),
				suggest = [],
				a = 0,
				prefix = last.charAt(0);
			prefix = prefix.match(/\+|\-/) ? prefix : "";
			last = searchValidate(last)[0];
			if (last) {
				var matchesThis = new RegExp("^" + last);
				searchQuery = searchQuery.join(" ");
				for (let b = 0, len = searchSuggestions[this.id].length; b < len; b++) {
					if (searchSuggestions[this.id][b].match(matchesThis)) {
						if (searchSuggestions[this.id][b] === last) {//found exact match, suggest at top of list
							suggest.unshift(searchQuery === "" ? prefix + last : searchQuery + " " + prefix + last);
							suggest[0] = suggest[0].replace(/[^0-9a-z\s\+\-]/g, "").trim();
						}
						else {
							suggest[a] = searchQuery === "" ? prefix + searchSuggestions[this.id][b] : searchQuery + " " + prefix + searchSuggestions[this.id][b];
							suggest[a] = suggest[a].replace(/[^0-9a-z\s\+\-]/g, "").trim();
						}
						a++;
					}
				}
				matchesThis = null;
				for (let c = 0, lenC = recentlySearched[this.id].length, i, item; c < lenC; c++) {
					i = suggest.indexOf(recentlySearched[this.id][c]);
					if (i !== -1) {
						item = suggest.splice(i, 1)[0];
						suggest.unshift(item);
					}
				}
			}
			last = null; a = null; searchQuery = null;
			return callback instanceof Function ? callback(suggest, errors[this.id], db[this.id].title, this.requiresSync) : suggest;
		}
		if (searchSuggestions[this.id].length > 0) {
			buildSuggestionsList.call(this);
		}
		else {
			var cols = options.colNames ? options.colNames.join("|").split("|") : null;
			if(callback instanceof Function) callback([], "currently busy building search index", db[this.id].title, this.requiresSync);
			buildSearchIndex.call(this, cols);
			return [];
		}
	};
	NyckelDBObj.prototype.forEachRow = function (funct, callback) {
		if (funct instanceof Function) {
			for (var a = 0, len = this.getLength(); a < len; a++) {
				funct(db[this.id].table[a][0], a, len);
			}
			a = null; len = null;
			return callback instanceof Function ? (callback(true, errors[this.id], db[this.id].title, this.syncPending), this) : this;
		}
	};
	NyckelDBObj.prototype.forEachCol = function (funct, callback) {
		if (funct instanceof Function) {
			for (var a = 1, len = db[this.id].headers.length; a < len; a++) {
				funct(db[this.id].headers[a], a - 1, len - 1);
			}
			a = null; len = null;
			return callback instanceof Function ? (callback(true, errors[this.id], db[this.id].title, this.syncPending), this) : this;
		}
	};
	NyckelDBObj.prototype.getTitle = function () { return db[this.id] ? db[this.id].title : undefined; };
	NyckelDBObj.prototype.setTitle = function (newTitle, callback) {
		var oldId = this.id,
			oldTitle = db[this.id].title,
			y = dbs.indexOf(oldTitle);

		//applyTitle creates a new id from title
		return initiateNewDB.call(this, newTitle, function (newTitle) {
			//copy table and newTitle to new id
			db[this.id] = JSON.parse(JSON.stringify(db[oldId]));
			db[this.id].title = newTitle;

			//cache oldTitle to maintain syncability
			if (db[this.id].previousTitle) db[this.id].previousTitle.push(VAL.toPropName(oldTitle));
			else db[this.id].previousTitle = [VAL.toPropName(oldTitle)];

			//delete old table
			deleteTableById.call(this, oldId, timestamp());
			oldId = null;

			//update lastModified
			db[this.id].lastModified = timestamp();
			this.syncPending = true;

			//swap database references to refer to the new table
			var x = dbs.indexOf(newTitle);
			dbs[y] = dbs[x];
			dbs[x] = oldTitle;
			oldTitle = null; y = null; x = null;

			toLocalStorage.call(this, true);
			return callback instanceof Function ? (callback(true, errors[this.id], db[this.id].title, true), this) : this;
		}.bind(this));
	};
	/*options {
		"reverse": sort Z-A, (true or false)
		"fromEndOfStr": sort xA-xZ, (true or false)
	*/
	NyckelDBObj.prototype.sortByCol = function (colName, options) {
		function reverseStr(str) {
			str = String(str);
			var ret = [];
			for (var a = 0, len = str.length; a < len; a++) {
				ret[a] = str[len - a - 1];
			}
			a = null; len = null;
			return ret.join("");
		}
		function sortFunction(a, b) {
			a = a[colIndex];
			b = b[colIndex];
			//try to compare items as numbers
			if (!isNaN(a * 1) && !isNaN(b * 1)) {
				a = a * 1;
				b = b * 1;
			}
			//optionally sort string backwards <-- (from this end)
			if (options.fromEndOfStrBool) {
				a = reverseStr(a);
				b = reverseStr(b);
			}
			return a === b ? 0 : a < b ? -1 : 1;
		}
		options = options || {};
		var colIndex = getIndexOfCol.call(this, colName);
		if (colIndex > 0) {
			options.reverse ? db[this.id].table.reverse(sortFunction) : db[this.id].table.sort(sortFunction);
			colIndex = null;
			return this;
		}
	};
	/* rowId can be the index of the row, or it's 3 digit identifier,
	 * colName is the column name from the table header
	 */
	NyckelDBObj.prototype.getVal = function (rowId, colName) {
		var rowIndex = getIndexOfRow.call(this, rowId),
			colIndex = getIndexOfCol.call(this, colName);
		if (rowIndex > -1 && colIndex > 0) return db[this.id].table[rowIndex][colIndex];
	};
	/* rowIds can be an Array of the index of the row, or it's 3 digit identifier,
	 * colNames is an Array the column names from the table header
	 */
	NyckelDBObj.prototype.getVals = function (rowIds, colNames, callback) {
		if (rowIds instanceof Array && colNames instanceof Array && rowIds.length > 0 && colNames.length > 0) {
			var rowIndex,
				colIndex,
				ret = [],
				a, b, x, y,
				len = rowIds.length,
				lenB = colNames.length;
			for (a = 0, x = 0; a < len; a++) {
				rowIndex = getIndexOfRow.call(this, rowIds[a]);
				if (rowIndex > -1) {
					ret[x] = [rowIds[a]];
					for (b = 0, y = 1; b < lenB; b++) {
						colIndex = getIndexOfCol.call(this, colNames[b]);
						if (colIndex > 0) {
							ret[x][y] = db[this.id].table[rowIndex][colIndex];
							y++;
						}
						else if (!colNameIsValid.call(this, colNames[b])) {
							return callback instanceof Function ? callback(false, colNames[b] + " is not a valid colName", db[this.id].title, this.syncPending) : false;
						}
					}
					x++;
				}
				else if (!rowIdIsValid.call(this, rowIds[a])) {
					return callback instanceof Function ? callback(false, rowIds[a] + " is not a valid rowId", db[this.id].title, this.syncPending) : false;
				}
			}
			rowIndex = null; colIndex = null; x = null; y = null; a = null; b = null; len = null; lenB = null;
			return callback instanceof Function ? callback(ret, errors[this.id], db[this.id].title, this.syncPending) : ret;
		}
		else return callback instanceof Function ? callback(false, "invalid inputs", db[this.id].title, this.syncPending) : false;
	};
	NyckelDBObj.prototype.toCSV = function () {
		//TODO
		return "function not complete";
	};
	/*exports table as JSON 2d array*/
	NyckelDBObj.prototype.toJSON_Array = function () {
		return saveFile.call(this, JSON.stringify(db[this.id]), db[this.id].title + "_" + readableTimestamp() + ".json");
	};
	/*exports table as JSON key value pairs*/
	NyckelDBObj.prototype.toJSON_KeyValuePairs = function () {
		//TODO
		return "function not complete";
	};
	NyckelDBObj.prototype.getProp = function (propName) {
		propName = VAL.toPropName(propName);
		return db[this.id].properties && db[this.id].properties[propName] ? db[this.id].properties[propName][0] : undefined;
	};
	NyckelDBObj.prototype.getLength = function () {
		return !db[this.id] || this.isDeleted() ? 0 : db[this.id].table.length;
	};
	NyckelDBObj.prototype.isDeleted = function () {
		return db[this.id] && db[this.id].deleted !== undefined ? true : false;
	};
	NyckelDBObj.prototype.shuffle = function () {
		function shuffle(array) {
			var len = array.length,
				halfLen = Math.ceil(len / 2),
				random = Base64.rand(halfLen).split(""),
				r = 0;
			//shuffle cards
			if (len > 0) {
				var array1, array2;
				for (var reps = 0, a, lenA; reps < 2 || reps < len / 10; reps++) {
					//split the deck
					array1 = array.slice(0, halfLen);
					array2 = array.slice(halfLen, len);
					for (a = 0, lenA = array1.length; a < lenA; a++) {
						array2.splice(a + Number(random[r]), 0, array1[a]);
						r++;
						if (r > len / 2) r = 0;
					}
					array = array2;
					array.push(array.shift());
					r = 0;
				}
				reps = null; a = null; lenA = null; array1 = null; array2 = null;
			}
			len = null; halfLen = null; random = null; r = null;
			return array;
		}
		if (!this.isDeleted()) {
			var len = this.getLength(),
				shuffled = shuffle(db[this.id].table);
			if (shuffled.length !== len) {
				cacheError.call(this, "shuffle error " + len + " != " + this.getLength());
				len = null; shuffled = null;
			}
			else {
				db[this.id].table = shuffled;
				rowIndex[this.id] = {};
				len = null; shuffled = null;
				return this;
			}
		}
	};
	/*
	 * find current index of row by 'id'
	 * or else by value and column name ('orValue' and 'colName')
	 */
	NyckelDBObj.prototype.getIndexOf = function (id, orValue, colName) {
		if (this.isDeleted()) return -1;
		else if (id) {
			return getIndexOfRow.call(this, id);
		}
		else if (orValue && colName) {
			var colIndex = getIndexOfCol.call(this, colName);
			if (colIndex > 0) {
				for (var a = 0, arrLen = db[this.id].table.length; a < arrLen; a++) {
					if (orValue === db[this.id].table[a][colIndex]) {
						return a;
					}
				}
				return -1;
			}
		}
		else return -1;
	};
	NyckelDBObj.prototype.hideRow = function (rowId) {
		if (!this.isDeleted()) {
			var index = getIndexOfRow.call(this, rowId);
			if (index > -1) {
				var row = db[this.id].table[index];
				db[this.id].hiddenIds = db[this.id].hiddenIds || {};
				db[this.id].hiddenIds[row[0]] = JSON.parse(JSON.stringify(db[this.id].ids[row[0]]));
				delete db[this.id].ids[row[0]];
				db[this.id].hidden = db[this.id].hidden || [];
				db[this.id].hidden.push(db[this.id].table.splice(index, 1)[0]);
				rowIndex[this.id] = {};
			}
			index = null;
		}
		return this;
	};
	NyckelDBObj.prototype.unhideRows = function () {
		if (db[this.id].hidden !== undefined) {
			var row;
			while (db[this.id].hidden.length > 0) {
				row = db[this.id].hidden[0];
				db[this.id].ids[row[0]] = JSON.parse(JSON.stringify(db[this.id].hiddenIds[row[0]]));
				delete db[this.id].hiddenIds[row[0]];
				db[this.id].table.push(db[this.id].hidden.splice(0, 1)[0]);
			}
			row = null;
			delete db[this.id].hidden;
			delete db[this.id].hiddenIds;
			rowIndex[this.id] = {};
		}
		return this;
	};
	NyckelDBObj.prototype.filter = function (colName, regExp) {
		if (this.getLength() > 0) {
			var colIndex = getIndexOfCol.call(this, colName),
				val;
			if (colIndex > 0) {
				for (var a = 0, arrLen = db[this.id].table.length; a < arrLen; a++) {
					val = String(db[this.id].table[a][colIndex]);
					if (!val.match(regExp)) {
						this.hideRow(a);
						a--;
						arrLen--;
					}
				}
				a = null; arrLen = null;
			}
			colIndex = null; val = null;
		}
		return this;
	};
	NyckelDBObj.prototype.unfilter = function () {
		return this.unhideRows();
	};
	NyckelDBObj.prototype.setProp = function (propName, value) {
		return setProp.call(this, propName, value);
	};
	NyckelDBObj.prototype.addRow = function (array, id) {
		return addRow.call(this, array, id);
	};
	NyckelDBObj.prototype.setVal = function (rowId, colName, newValue, callback) {
		return setVal.call(this, rowId, colName, newValue, null, null, callback);
	};
	NyckelDBObj.prototype.deleteRow = function (rowId) {
		return deleteRow.call(this, rowId);
	};
	NyckelDBObj.prototype.importJSON = function (json, syncKey, syncToken, callback) {
		return importJSON.call(this, json, function (syncChanges, errors) {
			if (syncChanges && !errors) return createBase64File.call(this, syncKey, syncToken, callback), this;
			else return callback instanceof Function ? (callback(true, errors, db[this.id] && db[this.id].title, false), this) : this;
		}.bind(this), syncKey);
	};
	NyckelDBObj.prototype.deleteTable = function (callback) {
		return deleteTable.call(this, callback);
	};
	NyckelDBObj.prototype.NUKEALL = function (msg, callback) {
		function nuke() {
			for (var a = 0; a < uid; a++) {
				db[this.id] = { "title": db[this.id].title, "deleted": timestamp() };
				if (APP.Sto) {
					APP.Sto.deleteItem(VAL.toPropName(db[this.id].title));
					APP.Sto.deleteItem(dbs[a]);
				}
			}
			a = null;
			if (APP.Sto) APP.Sto.nuke();
			setTimeout(function () {
				if (!Windows && window.location && window.location.reload) {
					window.location.reload(true);
				}
			}, 2000);
			if (callback instanceof Function) return callback(true, errors[this.id], db[this.id].title, true), this;
			else return this;
		}
		if (APP.confirm && APP.notify) APP.confirm(msg, nuke.bind(this), function () { APP.notify("<b>Oi!</b> That was close!", true); }, {
			"okButton": "Delete All"
		});
		else if (window && window.confirm(msg)) nuke.call(this);
	};
	NyckelDBObj.prototype.isSyncPending = function (cloudSyncFile, callback) {
		if (cloudSyncFile) {
			if (typeof cloudSyncFile === "string") cloudSyncFile = JSON.parse(cloudSyncFile);
			var title = VAL.toPropName(db[this.id].title);
			if (!cloudSyncFile[title] && cloudSyncFile[title] !== 0 || parseInt(cloudSyncFile[title]) !== db[this.id].lastModified) {
				this.syncPending = true;
				return callback instanceof Function ? callback(true, errors[this.id], db[this.id].title, true) : true;
			}
			else return callback instanceof Function ? callback(true, errors[this.id], db[this.id].title, false) : false;
		}
		else return callback instanceof Function ? callback(true, errors[this.id], db[this.id].title, this.syncPending) : this.syncPending;
	};
	/** options {
	* forceSync: true, (false is default)
	* key: a String,
	* oldKey: a String,
    * token: a String
	* }
	*/

	NyckelDBObj.prototype.sync = function (json, options, callback) {
		options = options || {};
		var forceSync = options.forceSync || false,
			readKey = options.key || false,
			writeKey = options.key || false,
			codeBreak = 0;
		if (options === true) forceSync = true;
		if (options.oldKey !== undefined && options.key && options.oldKey !== options.key) {
			readKey = options.oldKey;
			db[this.id].lastModified = timestamp();
			this.syncPending = true;
		}
		if (syncError && new Date().getTime() - syncErrorTime < 6e4) return callback instanceof Function ? (callback(false, "try again later", db[this.id].title, false), this) : this;
		if (json) {
			if (typeof json === "string") json = JSON.parse(json);
			if (json.data && (json.version === this.Version + "_" + Base64.Version || json.version === this.Version + "." + Base64.Version)) {
				switch (json.signature) {
					case Base64.hmac(json.data, readKey):
						json = Base64.read(json.data, readKey);
						break;
					case Base64.hmac(json.data, options.initialKey):
						json = Base64.read(json.data, options.initialKey);
						db[this.id].lastModified = timestamp();
						this.syncPending = true;
						break;
					case Base64.hmac(json.data, null):
						json = Base64.read(json.data, null);
						db[this.id].lastModified = timestamp();
						this.syncPending = true;
						break;
					default:
						//wrong key, put user through key update ui and try again
						syncError = true;
						syncErrorTime = new Date().getTime();
						return callback instanceof Function ? (callback(false, "wrong key used", db[this.id].title, false), this) : this;
				}
				return importJSON.call(this, json, function (changes) {
					if (changes || this.syncPending === true || forceSync === true) {
						return createBase64File.call(this, writeKey, options.token, callback);
					}
					else return callback instanceof Function ? (callback(true, errors[this.id], db[this.id].title, false), this) : this;
				}.bind(this));
			}
			else return callback instanceof Function ? (callback(false, "unsupported version:" + json.version, db[this.id].title, false), this) : this;
		}
		else return createBase64File.call(this, writeKey, options.token, callback);
	};
	NyckelDBObj.prototype.getLastModified = function () {
		return db[this.id].lastModified;
	};
	NyckelDBObj.prototype.getType = function (colName) {
		if (colNameIsValid.call(this, colName)) return db[this.id].types[colName];
	};
	NyckelDBObj.prototype.setSyncCompleted = function (syncfile, callback) {
		if (syncfile && this.isSyncPending(syncfile)) {
			return callback instanceof Function ? callback(false, "syncfile supplied doesn't match lastModified time of the database: " + db[this.id].lastModified + JSON.stringify(syncfile), db[this.id].title, true) : false;
		}
		else {
			this.syncPending = false;
			return callback instanceof Function ? callback(true, false, db[this.id].title, false) : true;
		}
	};
	return NyckelDBObj;
}());