var APP, VAL, Base64, appData = {}, NyckelDB, Vue, VueRouter, getWidth, getHeight, csv2json, Windows, WinJS, cordova; //dependancies
(function () {
	"use strict";
	APP.setDebugMode(true);//TODO set to false
	APP.setDebugToConsole(true);//set to true to use the debugger during development, or type "debugmode" into the searchbar to activate debugmode
	const DROPBOX_CLIENT_ID = "jk6tb5tp76hs2tx",//get new client id from https://www.dropbox.com/developers
		APP_VERSION = "0.5 beta",//increment on major (esp breaking) changes, to force localStorage app state to refresh on load
		views = {//views creates new pages in the app
			new: {
				name: "Tables",
				icon: "icon-plus",//icon shows up in the nav button
				level: 1,//level 1 creates a button at the top/side of the screen for quick navigation to this page
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
		startView = "recent", //set the view (from views listed above) to start at by default		
		debug = APP.debug,//shortform access to APP.debug
		contactsTemplateIMServiceOptions = {
			dropdownList: ["WhatsApp", "Viber", "Facebook Messenger", "WeChat", "QQ Mobile", "Line", "Skype", "Snapchat",
				"Twitter", "Telegram", "Google Talk", "KakaoTalk", "Kik Messenger", "Tango", "Yahoo", "AIM", "MSN",
				"Nimbuzz", "Hike", "Jabber", "ICQ", "MessageMe"],
			customLabel: true
		},
		contactsTemplateIMLabelOptions = {
			dropdownList: ["Personal", "Work", "Other"],
			customLabel: true
		},
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
					Address1_Type: "string", Address1_Formatted: "formattedAddress", Address1_Street: "streetAddress", Address1_City: "cityCounty", Address1_POBox: "mailAddress",
					Address1_Region: "provinceStateRegion", Address1_PostalCode: "postalZipCode", Address1_Country: "country", Address1_ExtendedAddress: "string",
					Address2_Type: "string", Address2_Formatted: "formattedAddress", Address2_Street: "streetAddress", Address2_City: "cityCounty", Address2_POBox: "mailAddress",
					Address2_Region: "provinceStateRegion", Address2_PostalCode: "postalZipCode", Address2_Country: "country", Address2_ExtendedAddress: "string",
					Organization1_Type: "string", Organization1_Name: "string", Organization1_YomiName: "string", Organization1_Title: "string", Organization1_Department: "string",
					Organization1_Symbol: "string", Organization1_Location: "geoLocation", Organization1_JobDescription: "string",
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
						"E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value",
						"E_mail6_Value", "E_mail7_Value", "E_mail8_Value", "E_mail9_Value", "E_mail10_Value",
						"Address1_City", "Address2_City", "Address1_Region", "Address2_Region", "Organization1_Name",
						"Organization1_Title", "Organization1_Department"],
					doNotIndex: ["Photo",
						"E_mail1_Type", "E_mail2_Type", "E_mail3_Type", "E_mail4_Type", "E_mail5_Type",
						"E_mail6_Type", "E_mail7_Type", "E_mail8_Type", "E_mail9_Type", "E_mail10_Type",
						"IM1_Type", "IM1_Service", "IM2_Type", "IM2_Service", "IM3_Type", "IM3_Service", "IM4_Type", "IM4_Service", "IM5_Type", "IM5_Service",
						"IM6_Type", "IM6_Service", "IM7_Type", "IM7_Service", "IM8_Type", "IM8_Service", "IM9_Type", "IM9_Service", "IM10_Type", "IM10_Service",
						"Phone1_Type", "Phone2_Type", "Phone3_Type", "Phone4_Type", "Phone5_Type",
						"Phone6_Type", "Phone7_Type", "Phone8_Type", "Phone9_Type", "Phone10_Type",
						"Address1_Type", "Address2_Type",
						"Relation1_Type", "Relation2_Type", "Relation3_Type", "Relation4_Type", "Relation5_Type",
						"Relation6_Type", "Relation7_Type", "Relation8_Type", "Relation9_Type", "Relation10_Type",
						"Website1_Type", "Website2_Type", "Website3_Type", "Website4_Type", "Website5_Type",
						"Website6_Type", "Website7_Type", "Website8_Type", "Website9_Type", "Website10_Type"],
					icon: "icon-user"
				},
				display: {
					listView: {
						text: ["FamilyName", "GivenName"],//diaplay as "Jones, Bob"
						joiner: ", ",
						sortBy: "FamilyName"
					},
					heading: {
						image: "Photo",
						title: "Name",
						subtitle: {
							value: ["Organization1_Name", "Organization1_Title", "Organization1_Department"],
							joiner: ", "
						}
					},
					detailsView: [//displays the following content in the following order
						{ value: "Photo", hidden: true, readonly: true },
						{
							groupHeading: "Name",
							group: ["NamePrefix", "GivenName", "AdditionalName", "FamilyName", "NameSuffix"],
							hidden: true
						},
						{
							groupHeading: "Additional Name Information",
							group: ["Initials", "Nickname", "ShortName", "MaidenName",
								"YomiName", "GivenNameYomi", "AdditionalNameYomi", "FamilyNameYomi"],
							hidden: true
						},
						{
							groupHeading: "Organization",
							group: ["Organization1_Type", "Organization1_Name", "Organization1_YomiName", "Organization1_Title", "Organization1_Department",
								"Organization1_Symbol", "Organization1_Location", "Organization1_JobDescription"],
							hidden: true
						},
						{ value: "GroupMembership", hidden: true, readonly: true },
						{
							groupHeading: "Events",
							collapse: true,
							group: [
								"Birthday",
								{ value: "Event1_Value", label: "Event1_Type" },//here, the value of Event1_Value is the value and the value of Event1_Type is 
								{ value: "Event2_Value", label: "Event2_Type" },//the label when value and label are specified 
								{ value: "Event3_Value", label: "Event3_Type" },
								{ value: "Event4_Value", label: "Event4_Type" },
								{ value: "Event5_Value", label: "Event5_Type" },
								{ value: "Event6_Value", label: "Event6_Type" },
								{ value: "Event7_Value", label: "Event7_Type" },
								{ value: "Event8_Value", label: "Event8_Type" },
								{ value: "Event9_Value", label: "Event9_Type" },
								{ value: "Event10_Value", label: "Event10_Type" }
							],
							splitter: " ::: ",
							labelOptions: {
								dropdownList: ["Anniversary", "Other"],
								customLabel: true
							}
						},
						{
							groupHeading: "E-mail Addresses",
							collapse: true,
							group: [
								{ value: "E_mail1_Value", label: "E_mail1_Type" },
								{ value: "E_mail2_Value", label: "E_mail2_Type" },
								{ value: "E_mail3_Value", label: "E_mail3_Type" },
								{ value: "E_mail4_Value", label: "E_mail4_Type" },
								{ value: "E_mail5_Value", label: "E_mail5_Type" },
								{ value: "E_mail6_Value", label: "E_mail6_Type" },
								{ value: "E_mail7_Value", label: "E_mail7_Type" },
								{ value: "E_mail8_Value", label: "E_mail8_Type" },
								{ value: "E_mail9_Value", label: "E_mail9_Type" },
								{ value: "E_mail10_Value", label: "E_mail10_Type" }
							],
							splitter: " ::: ",
							labelOptions: {
								dropdownList: ["Personal Email", "Work Email", "Other Email"],
								customLabel: true
							}
						},
						{
							groupHeading: "Phone Numbers",
							collapse: true,
							group: [
								{ value: "Phone1_Value", label: "Phone1_Type" },
								{ value: "Phone2_Value", label: "Phone2_Type" },
								{ value: "Phone3_Value", label: "Phone3_Type" },
								{ value: "Phone4_Value", label: "Phone4_Type" },
								{ value: "Phone5_Value", label: "Phone5_Type" },
								{ value: "Phone6_Value", label: "Phone6_Type" },
								{ value: "Phone7_Value", label: "Phone7_Type" },
								{ value: "Phone8_Value", label: "Phone8_Type" },
								{ value: "Phone9_Value", label: "Phone9_Type" },
								{ value: "Phone10_Value", label: "Phone10_Type" }
							],
							splitter: " ::: ",
							labelOptions: {
								dropdownList: ["Mobile Phone", "Home Phone", "Work Phone", "Company Phone",
									"Other Phone", "Main Phone", "Pager", "Home Fax", "Work Fax"],
								customLabel: true
							}
						},
						//IM
						{
							groupHeading: "Instant Messaging",
							collapse: 2,
							group: [
								{ value: "IM1_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM1_Value", label: "IM1_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM2_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM2_Value", label: "IM2_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM3_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM3_Value", label: "IM3_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM4_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM4_Value", label: "IM4_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM5_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM5_Value", label: "IM5_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM6_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM6_Value", label: "IM6_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM7_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM7_Value", label: "IM7_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM8_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM8_Value", label: "IM8_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM9_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM9_Value", label: "IM9_Type", labelOptions: contactsTemplateIMLabelOptions },
								{ value: "IM10_Service", options: contactsTemplateIMServiceOptions },
								{ value: "IM10_Value", label: "IM10_Type", labelOptions: contactsTemplateIMLabelOptions }
							],
							splitter: " ::: "
						}, {
							groupHeading: "Addresses",
							group: [
								{ value: "Address1_Formatted", label: "Address1_Type" },
								{ value: "Address2_Formatted", label: "Address2_Type" }
							],
							readonly: true
						},
						{
							groupHeading: "Address 1",
							group: ["Address1_Type", "Address1_Street", "Address1_City", "Address1_POBox",
								"Address1_Region", "Address1_PostalCode", "Address1_Country", "Address1_ExtendedAddress"],
							hidden: true
						},

						{
							groupHeading: "Address 2",
							group: ["Address2_Type", "Address2_Street", "Address2_City", "Address2_POBox",
								"Address2_Region", "Address2_PostalCode", "Address2_Country", "Address2_ExtendedAddress"],
							hidden: true
						},
						{
							groupHeading: "Family and Relationships",
							collapse: true,
							group: [
								{ value: "Relation1_Value", label: "Relation1_Type" },
								{ value: "Relation2_Value", label: "Relation2_Type" },
								{ value: "Relation3_Value", label: "Relation3_Type" },
								{ value: "Relation4_Value", label: "Relation4_Type" },
								{ value: "Relation5_Value", label: "Relation5_Type" },
								{ value: "Relation6_Value", label: "Relation6_Type" },
								{ value: "Relation7_Value", label: "Relation7_Type" },
								{ value: "Relation8_Value", label: "Relation8_Type" },
								{ value: "Relation9_Value", label: "Relation9_Type" },
								{ value: "Relation10_Value", label: "Relation10_Type" }
							],
							splitter: " ::: ",
							labelOptions: {
								dropdownList: ["Spouse", "Child", "Mother", "Father", "Parent", "Brother", "Sister", "Friend", "Relative",
									"Manager", "Assistant", "Partner", "Coworker", "Reference", "Significant Other", "Other Relationship"],
								customLabel: false
							}
						},
						{
							groupHeading: "Websites",
							collapse: true,
							group: [
								{ value: "Website1_Value", label: "Website1_Type" },
								{ value: "Website2_Value", label: "Website2_Type" },
								{ value: "Website3_Value", label: "Website3_Type" },
								{ value: "Website4_Value", label: "Website4_Type" },
								{ value: "Website5_Value", label: "Website5_Type" },
								{ value: "Website6_Value", label: "Website6_Type" },
								{ value: "Website7_Value", label: "Website7_Type" },
								{ value: "Website8_Value", label: "Website8_Type" },
								{ value: "Website9_Value", label: "Website9_Type" },
								{ value: "Website10_Value", label: "Website10_Type" }
							],
							splitter: " ::: ",
							labelOptions: {
								dropdownList: ["Profile", "Blog", "Google Maps", "Home Page", "Work Website"],
								customLabel: true
							}
						},
						{
							groupHeading: "Other Information",
							group: ["Gender", "Location", "BillingInformation", "DirectoryServer", "Mileage", "Occupation", "Hobby", "Sensitivity",
								"Priority", "Subject", "Language"]
						},
						{
							groupHeading: "Custom Fields",
							collapse: 2,
							group: [
								"CustomField1_Type", { value: "CustomField1_Value", label: "CustomField1_Type" },
								"CustomField2_Type", { value: "CustomField2_Value", label: "CustomField2_Type" },
								"CustomField3_Type", { value: "CustomField3_Value", label: "CustomField3_Type" },
								"CustomField4_Type", { value: "CustomField4_Value", label: "CustomField4_Type" },
								"CustomField5_Type", { value: "CustomField5_Value", label: "CustomField5_Type" },
								"CustomField6_Type", { value: "CustomField6_Value", label: "CustomField6_Type" },
								"CustomField7_Type", { value: "CustomField7_Value", label: "CustomField7_Type" },
								"CustomField8_Type", { value: "CustomField8_Value", label: "CustomField8_Type" },
								"CustomField9_Type", { value: "CustomField9_Value", label: "CustomField9_Type" },
								"CustomField10_Type", { value: "CustomField10_Value", label: "CustomField10_Type" }
							],
							splitter: " ::: "
						},
						{
							groupHeading: "Notes",
							collapse: false,
							group: ["Notes"]

						}
					]
				}
			},
			Passwords: {
				headers: ["Site", "Username", "Password", "Alias", "DateCreated"],//these headers are given as an array
				types: ["string", "string", "string", "string", "date"],//when headers are an array, types are given as a corresponding array
				options: {
					customProperties: {
					},
					doNotIndex: ["Password", "DateCreated"],
					initialIndex: ["Site", "Username", "Alias"],
					icon: "icon-lock"
				},
				display: {
					listView: {
						text: ["Site", "Username"],
						joiner: ": ",
						sortBy: "Site"
					},
					heading: {
						title: "Site",
						subtitle: {
							value: ["Username", "Alias"],
							joiner: ", aka "
						}
					},
					detailsView: [
						{ value: "Site", hidden: true },
						{ value: "Username", hidden: true },
						{ value: "Alias", hidden: true }, 
						"Password",
						"DateCreated"
					]
				}
			},
			Files: {
				headers: ["Display Name", "Name", "Extension", "Type", "Original Size", "Compressed Size", "Compression", "Created", "Modified", "Owner", "Hash", "Compressed Contents"],
				types: {
					"Display Name": "string",
					"Name": "string",
					"Extension": "string",
					"Type": "string",
					"Original Size": "posInteger",
					"Compression Size": "posInteger",
					"Compression": "string",
					"Created": "date",
					"Modified": "date",
					"Owner": "string",
					"Hash": "string",
					"Compressed Contents": "string"
				},
				options: {
					customProperties: {
					},
					doNotIndex: ["Display Name", "Extension", "Type", "Original Size", "Compression", "Compressed Size", "Created", "Modified", "Hash", "Compressed Contents"],
					initialIndex: ["Name"],
					icon: "icon-folder-open"
				},
				display: {
					listView: {
						text: ["Display Name"]
					},
					detailsView: {}
				}
			},
			Groups: {
				headers: ["groupName", "groupIds", "searchTerms", "excludeIds"],
				types: {
					groupName: { type: "string" },
					groupIds: { type: "string" },
					searchTerms: { type: "string" },
					excludeIds: { type: "string" }
				},
				options: {
					customProperties: {
					},
					doNotIndex: ["groupIds", "searchTerms", "excludeIds"],
					initialIndex: ["groupName"]
				},
				display: {
					listView: {
						text: ["groupName"]
					},
					detailsView: {}
				}
			}
		},
		//set default searchable columns from dataTemplates above
		searchableColumns = ["Name", "Owner", "Site", "Username", "Alias", "GivenName", "AdditionalName", "FamilyName", "Nickname", "ShortName", "MaidenName",
			"Phone1_Value", "Phone2_Value", "Phone3_Value", "Phone4_Value", "Phone5_Value", "Phone6_Value", "Phone7_Value", "Phone8_Value", "Phone9_Value", "Phone10_Value",
			"E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value", "E_mail6_Value", "E_mail7_Value", "Address1_City", "Address2_City",
			"Address1_Region", "Address2_Region", "Organization1_Name", "Organization1_Title", "Organization1_Department", "groupName"],
		freshStateObj = function () {
			return {//vue.js variables
				cookieAgree: false,
				version: APP_VERSION,
				views: views,
				backArrow: false,
				currentView: views[startView],
				transitionName: "forward", //or "back"
				spinner: false,
				spinnerMsg: ["Working..."],
				spinIndex: 0,
				indicatorRight: -164,
				indicatorWidth: 0,
				indicatorTop: 53,
				showSearchBar: false,
				hideSearchBar: false,
				showSearchSuggestions: false,
				showSideNav: false,
				showSettings: false,
				windows: false,
				darkTheme: false,
				useWindowsTheme: false,
				windowsDarkTheme: false,
				accentColor: null,
				showConfirm: false,
				confirmMsg: "Are you sure?",
				confirmDetails: null,
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
				groupDropdown: false,
				groupSearchBox: "",
				groups: []
			};
		},
		localTestingMode = function () {
			var loc = window.location;
			if (!loc || /^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://") return true;
			else return false;
		}();
	if(localTestingMode) APP.setDebugMode(true);
	var fileReaderInitiated = [],
		backstack = [],
		backIndex = 0,
		state = freshStateObj(),
		dbid = null,
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
			debug(width, "width");
			debug(height, "height");
			if (width > 1280) type = "desk";
			if (width <= 640) type = "phon";
			if (height < width && width > 640) orientation = " land ";
			htmlTag.className = trim(type + orientation + htmlTag.className.replace(/desk|tabl|phon|port|land/g, ""));
		},
		setNavLinkIndicatorPosition = function (location) {
			location = location ? location.replace(/\//, "") : startView;
			if (app.views[location] && app.views[location].level === 1) {//show indicator and move to correct position
				var sidenavlink = document.getElementById("sidenavlink_" + location).getBoundingClientRect(),
					topnavlink = document.getElementById("topnavlink_" + location).getBoundingClientRect(),
					views = document.getElementById("topnav-container").getBoundingClientRect(),
					viewsWidth = views.right - views.left,
					extra = app.showSearchBar ? viewsWidth + 410 : viewsWidth + 110;//width of navbar buttons + searchbar (300) + search and menu buttons (110)
				app.indicatorTop = sidenavlink.top - 54;
				app.indicatorWidth = topnavlink.right - topnavlink.left;
				app.indicatorRight = getWidth() - topnavlink.left - extra;
			}
			else {//hide indicator
				app.indicatorRight = app.indicatorRight - app.indicatorWidth * 0.66;
				app.indicatorWidth = 0;
			}
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
				obj.time = new Date().getTime();
				var arrBuffer = str2ab(JSON.stringify(obj));
				webWorker.postMessage(arrBuffer, [arrBuffer]);
				obj = null;
			}
			function noWebWorker() {
				function applyCallback(callback) {
					var hasCallback = ["addColumn", "advancedSearch", "deleteColumn", "deleteTable", "getHeaders", "getRow", "getRowTemplate", "getSearchSuggestions", "getVals",
						"importJSON", "isSyncPending", "NUKEALL", "renameColumn", "search", "setSyncCompleted", "setTitle", "setType", "setVal", "setVals", "sync", "validate"];
					if (hasCallback.indexOf(obj.cmd)) return appData[title][obj.cmd].apply(appData[title], obj.args);
					else return callback(appData[title][obj.cmd].apply(appData[title], obj.args));
				}
				if (obj.args && callback) obj.args.push(callback);
				else if (callback) obj.args = [callback];
				if (obj.title && obj.cmd) {
					var title = VAL.toPropName(obj.title);
					if (obj.cmd === "initNewNyckelDB") {
						appData[title] = new NyckelDB(obj.args[0]);
						appData[title].init(obj.args[1], obj.args[2], obj.args[3], callback);
					}
					else if (!appData[title]) {
						debug(obj.args, "couldn't complete '" + obj.cmd + "' because '" + obj.title + "' database has not been successfully initialized");
						return null;
					}
					else if (!appData[title][obj.cmd]) {
						debug(obj.cmd, "invalid command called on " + obj.title);
						return null;
					}
					else if (obj.cmd === "forEachCol" || obj.cmd === "forEachRow") appData[title][obj.cmd](callback, finalCallback);
					else if (callback) return applyCallback(callback);
					else return appData[title][obj.cmd].apply(appData[title], obj.args);
				}
				else if (obj.cmd) {
					//debug(obj.cmd, "cmd");
					Base64[obj.cmd].apply(null, obj.args);
				}
			}
			if (typeof Worker !== "undefined" && !localTestingMode) startWorker();
			else
				noWebWorker();
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
					//	console.log((new Date().getTime() - Number(data.time)) / 1000 + "s", "to get result", data.cmd);
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
		defaultErrorHandler = function (success, errors) {
			if (errors) {
				if (errors === "wrong key used") {
					app.notify("Wrong key used", true);
					debug(app.stoKey, "stoKey tried");
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
			function doneStartApp() {
				setAccentColor(app.accentColor);
				app.updateCurrentView();
				document.getElementById("loading").className = "done"; //app is rendered so fade in from black
				checkDBLoaded(function (callback) {
					app.syncAll();
					if (callback instanceof Function) return callback();
				});
				if (!cordova && !app.cookieAgree) {
					app.notify("By continuing to use this site, you agree to the use of first party, non-tracking cookies for personalised content", false);
					app.cookieAgree = true;
					app.storeState();
				}
			}
			function tryDropbox(cachedStoKey) {
				function applyUser(user) {
					if (user) {
						app.dropboxUsername = user.alias;
						app.dropboxEmail = user.email;
						app.loggedIn = true;
						dbid = user.dbid;
					}
					doneStartApp();
				}
				APP.Dbx = APP.initiateDropbox(DROPBOX_CLIENT_ID, cachedStoKey, applyUser);
			}
			function getLocalState() {
				APP.Sto.getItem("state", null, function (appStateObj, error) {
					if (appStateObj) {
						if (typeof appStateObj === "string" && JSON.parse) appStateObj = JSON.parse(appStateObj);
						if (appStateObj.version === app.version) {
							for (var prop in state) {
								if (prop === "recentlyViewed" && app[prop].length > 0) continue;//don't overwrite
								if (appStateObj[prop] !== undefined) {
									app[prop] = appStateObj[prop];
								}
							}
							if (resumeBool && appStateObj.time && new Date().getTime() - appStateObj.time < 864e5) {
								//resume view and back history
								backstack = appStateObj.backstack;
								backIndex = appStateObj.backIndex;
								app.navigate();
							}
							tryDropbox(appStateObj.stoKey);
						}
						else {
							app.notify("App version has changed from " + appStateObj.version + " to " + app.version + ". Some of your app settings may have returned to their default values.");
							// migrate older version state data here
							var migrate = "darkTheme useWindowsTheme windowsDarkTheme accentColor cookieAgree".split(" ");
							for (let x = 0, xLen = migrate.length; x < xLen; x++){
								if (appStateObj[migrate[x]] !== undefined) {
									app[migrate[x]] = appStateObj[migrate[x]];
								}
							}
							APP.Sto.deleteItem("state");
							doneStartApp();
						}
					}
					else if (error) {
						debug(error, "error getting app state");
						doneStartApp();
					}
					else {
						APP.Sto.deleteItem("state");
						doneStartApp();
					}
				}, doneStartApp);
			}
			checkDBLoaded(function (callback) {
				if (callback instanceof Function) return callback();
			});
			matchWindowsTheme();
			layout();
			//getLocalState();//TODO temp commented out testing iOS
		},
		/*colorLuminance 
		* @craigbuckler
		* https://www.sitepoint.com/javascript-generate-lighter-darker-color/
		* hex #CCC or #123abc, with or without #
		* lum decimal b/t -1 and 1. 0.2 (20% lighter) -0.5 (50% darker)
		*/
		colorLuminance = function (hex, lum, returnRGB) {
			// validate hex string
			hex = new String(hex).replace(/[^0-9a-f]/gi, '');
			if (hex.length < 6) {
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}
			lum = lum || 0;

			// convert to decimal and change luminosity
			var hexColor = "#", rgbColor = [], c, i, black = 0, white = 255;
			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i * 2, 2), 16);
				//	c = Math.round(Math.min(Math.max(black, c + c * lum), white));
				c = Math.round(Math.min(Math.max(black, c + lum * white), white));
				rgbColor[i] = c;
				c = c.toString(16);
				hexColor += ("00" + c).substr(c.length);
			}
			return returnRGB ? rgbColor.join(", ") : hexColor;
		},
		updateCSSColor = function (rgbColor, replaceColor) {
			var styleSheets = document.styleSheets;
			try {
				for (var a = 0, lenA = styleSheets.length, b, lenB, c, lenC, rules, rule, styles; a < lenA; a++) {
					rules = styleSheets[a].rules || styleSheets[a].cssRules;
					for (b = 0, lenB = rules.length; b < lenB; b++) {
						rule = rules[b].cssText;
						if (replaceColor.test(rule)) {
							rule = rule.split("{");
							styles = rule[1].replace(/\}/, "").split(";");
							for (c = 0, lenC = styles.length; c < lenC - 1; c++) {
								styles[c] = styles[c].replace(replaceColor, rgbColor).split(":");
								rules[b].style[trim(styles[c][0])] = trim(styles[c][1]);
							}
						}
					}
				}
				return true;
			}
			catch (error) {
				if (!localTestingMode) app.notify("Error setting color theme: This browser doesn't allow direct access to styles in this way");
				console.log(error);
				return false;
			}
		},
		setAccentColor = function (hex) {
			if (!hex) return;
			var colors = [
				colorLuminance(hex, 0, true),
				colorLuminance(hex, -0.1, true),
				colorLuminance(hex, -0.2, true),
				colorLuminance(hex, -0.3, true),
				colorLuminance(hex, 0.1, true),
				colorLuminance(hex, 0.2, true),
				colorLuminance(hex, 0.3, true)
			],
				oldColorString = [
					new RegExp(windowsAccentColor[0] || "71, 140, 219", "g"),
					new RegExp(windowsAccentColor[1] || "49, 126, 214", "g"),
					new RegExp(windowsAccentColor[2] || "41, 114, 197", "g"),
					new RegExp(windowsAccentColor[3] || "38, 97, 164", "g"),
					new RegExp(windowsAccentColor[4] || "84, 152, 231", "g"),
					new RegExp(windowsAccentColor[5] || "112, 166, 228", "g"),
					new RegExp(windowsAccentColor[6] || "153, 185, 223", "g")
				];
			var success = true;
			for (let a = 0, len = colors.length; a < len; a++) {
				if (success) success = updateCSSColor(colors[a], oldColorString[a]);
			}
			var metaThemeColor = document.querySelector("meta[name=theme-color]"),
				appleThemeColor = document.querySelector("meta[name=apple-mobile-web-app-status-bar-style]"),
				windowsThemeColor = document.querySelector("meta[name=msapplication-navbutton-color]");
			metaThemeColor.setAttribute("content", hex);
			appleThemeColor.setAttribute("content", hex);
			windowsThemeColor.setAttribute("content", hex);
			windowsAccentColor = colors;
			app.accentColor = success ? hex : null;
			app.storeState();
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
					updateCSSColor(cssColorString[d], oldColorString[d]);
				}
			}
			//use alternate icon stylesheet
			function isFontAvailable(font) {
				var width;
				var body = document.body;

				var container = document.createElement('span');
				container.innerHTML = Array(100).join('wi');
				container.style.cssText = [
					'position:absolute',
					'width:auto',
					'font-size:128px',
					'left:-99999px'
				].join(' !important;');

				var getWidth = function (fontFamily) {
					container.style.fontFamily = fontFamily;

					body.appendChild(container);
					width = container.clientWidth;
					body.removeChild(container);

					return width;
				};

				// Pre compute the widths of monospace, serif & sans-serif
				// to improve performance.
				var monoWidth = getWidth('monospace');
				var serifWidth = getWidth('serif');
				var sansWidth = getWidth('sans-serif');
				return monoWidth !== getWidth(font + ',monospace') ||
					sansWidth !== getWidth(font + ',sans-serif') ||
					serifWidth !== getWidth(font + ',serif');
			}

			if (isFontAvailable('Segoe UI Symbol')) {
				document.getElementById("segoe-icons").rel = 'stylesheet';
				document.getElementById("default-icons").rel = 'alternate stylesheet';
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
					];
				updateUI();
				windowsAccentColor = cssColorString;
			}
		},
		//updateWindowsLiveTile = function (content, imageurl) {
		//	if (typeof Windows !== 'undefined' &&
		//		typeof Windows.UI !== 'undefined' &&
		//		typeof Windows.UI.Notifications !== 'undefined') {
		//		var tileContent = new Windows.Data.Xml.Dom.XmlDocument();

		//		var tile = tileContent.createElement("tile");
		//		tileContent.appendChild(tile);

		//		var visual = tileContent.createElement("visual");
		//		tile.appendChild(visual);

		//		var bindingMedium = tileContent.createElement("binding");
		//		bindingMedium.setAttribute("template", "TileMedium");
		//		visual.appendChild(bindingMedium);

		//		var peekImage = tileContent.createElement("image");
		//		peekImage.setAttribute("placement", "peek");
		//		peekImage.setAttribute("src", imageurl);
		//		peekImage.setAttribute("alt", "Random demo image");
		//		bindingMedium.appendChild(peekImage);

		//		var text = tileContent.createElement("text");
		//		text.setAttribute("hint-wrap", "true");
		//		text.innerText = "Demo Message";
		//		bindingMedium.appendChild(text);

		//		// TODO: Add other tile size bindings, like Wide and Large

		//		var notifications = Windows.UI.Notifications;
		//		var tileNotification = new notifications.TileNotification(tileContent);
		//		notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
		//	}
		//},
		//sendWindowsNotification = function (message, iconurl) {
		//	if (typeof Windows !== 'undefined' &&
		//		typeof Windows.UI !== 'undefined' &&
		//		typeof Windows.UI.Notifications !== 'undefined') {
		//		var toastContent = new Windows.Data.Xml.Dom.XmlDocument();

		//		var toast = toastContent.createElement("toast");
		//		toastContent.appendChild(toast);

		//		var visual = toastContent.createElement("visual");
		//		toast.appendChild(visual);

		//		var binding = toastContent.createElement("binding");
		//		binding.setAttribute("template", "ToastGeneric");
		//		visual.appendChild(binding);

		//		// Title text
		//		var text = toastContent.createElement("text");
		//		text.innerText = message;
		//		binding.appendChild(text);

		//		// TODO: Add up to two more text elements

		//		// Override the app logo
		//		var appLogo = toastContent.createElement("image");
		//		appLogo.setAttribute("placement", "appLogoOverride");
		//		appLogo.setAttribute("src", iconurl);
		//		appLogo.setAttribute("alt", message);
		//		binding.appendChild(appLogo);

		//		var notifications = Windows.UI.Notifications;
		//		var notification = new notifications.ToastNotification(toastContent);
		//		notifications.ToastNotificationManager.createToastNotifier().show(notification);
		//	}
		//},
		//load NyckelDB databases
		loadDB = true,
		loadDBQueue = [],
		loadingDB = false,
		checkDBLoaded = function (callback) {
			function initDB(title, template, dbNum, numOfTables) {
				template.options.syncKey = app.stoKey === "unknown" ? dbid ? Base64.hash(dbid) : Base64.hash(app.dropboxEmail) : app.stoKey;
				var cb = function (success, errors) {//default callback function for handling errors initialising NyckelDB
					if (errors) defaultErrorHandler(success, errors);
				};
				if (numOfTables === dbNum + 1) {
					cb = function (success, errors) {//final callback function for last NyckelDB to initialise
						if (errors) defaultErrorHandler(success, errors);
						app.spin(false, "Loading data...");
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
					if (dataTemplates.hasOwnProperty(template)) {
						numOfTables++;
					}
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
		createNewItem = function (tableName) {
			//get blank details object by just provinding a table and no id
			getDetails({ table: tableName }, function (detailsObj) {
				app.details = detailsObj;
				app.navigate("edit");
			});
		},
		formatValue = function (value, type, splitter) {
			//format multiline strings
			if (/multilineString|formattedAddress/.test(type) && value) {
				value = value.replace(/\r\n|\r|\n/g, '\r\n').split('\r\n');
			}
			//split out multiple values in one cell
			else if (typeof value === "string") value = splitter ? value.split(splitter) : value.split(" ::: ");
			else value = [value];
			return value;
		},
		getDetails = function (obj, callback) {
			function processDetailsReturnData(row, error, cb) {
				function getValue(template, splitter, labelOptions) {
					function getDropdownList(optionsObj) {
						var options = [];
						for (let a = 0, lenA = optionsObj.dropdownList.length; a < lenA; a++) {
							options[a] = {
								text: optionsObj.dropdownList[a],
								action: optionsObj.dropdownList[a]
							};
						}
						return options;
					}
					function applyValueStr() {
						obj = row[template];
						obj.orig = obj.value;
						obj.value = formatValue(obj.value, obj.type, splitter);
						obj.splitter = splitter;
					}
					function applyValueArr() {
						obj.value = [];
						for (let a = 0, lenA = template.value.length; a < lenA; a++) {
							if (row[template.value[a]].value) obj.value[a] = row[template.value[a]].value;
						}
						obj.value = obj.value.join(template.joiner || " ");
						obj.readonly = true;
					}
					function applyValueObj() {
						obj = {
							type: row[template.value].type,
							column: row[template.value].column,
							value: row[template.value].value
						};
						if (template.options) {
							if (template.options.dropdownList) obj.options = getDropdownList(template.options);
							if (template.options.customLabel) obj.customize = true;
						}
					}
					function applyLabel() {
						obj.label = {
							column: template.label,
							orig: row[template.label].value,
							value: row[template.label].value,
							type: row[template.label].type
						};
						if (labelOptions) {
							if (labelOptions.dropdownList) obj.label.options = getDropdownList(labelOptions);
							if (labelOptions.customLabel) obj.label.customize = true;
						}
						//if (obj.label.value === "") obj.label.value = obj.label.column.replace(/_/g, " ").replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
					}
					var obj = {};
					labelOptions = labelOptions || template.labelOptions;
					if (typeof template === "string") applyValueStr();
					else if (template.value) {
						if (template.value.constructor === Array) applyValueArr();
						else applyValueObj();
						if (template.label) applyLabel();
						if (template.readonly) obj.readonly = true;
						if (template.hidden) obj.hidden = true;
						obj.orig = obj.value;
						obj.value = formatValue(obj.value, obj.type, splitter);
						obj.splitter = splitter;
					}
					return obj;
				}
				function getGroup(template) {
					var ret = {
						group: [],
						collapse: template.collapse || false,
						show: 0
					};
					for (let c = 0, lenC = template.group.length, d, lenD; c < lenC; c++) {
						ret.group[c] = getValue(template.group[c], template.splitter, template.labelOptions);
						for (d = 0, lenD = ret.group[c].value.length; d < lenD; d++) {
							if (ret.group[c].value[d] !== "") ret.show = c + 1;
						}
					}
					if (template.groupHeading) {
						ret.groupHeading = template.groupHeading;
					}
					if (template.hidden) ret.hidden = true;
					if (template.readonly) ret.readonly = true;
					return ret;
				}
				function getHeading(template) {
					var ret;
					if (typeof template === "string") ret = row[template].value;
					else if (template.value) {
						ret = [];
						for (let a = 0, lenA = template.value.length; a < lenA; a++) {
							if (row[template.value[a]].value) ret[a] = row[template.value[a]].value;
						}
						ret = ret.join(template.joiner || " ");
					}
					return ret;
				}
				var data = [],
					b = 0,
					display = dataTemplates[obj.table].display,
					title = "Item not found :´(",
					subtitle = "Sorry, we couldn't locate this item in the database",
					image = "";
				if (row) {
					
					if (display.heading) {
						if (display.heading.title) title = getHeading(display.heading.title);
						if (display.heading.subtitle) subtitle = getHeading(display.heading.subtitle);
						if (display.heading.image) image = row[display.heading.image].value;
					}
					for (let a = 0, lenA = display.detailsView.length; a < lenA; a++) {
						if (typeof display.detailsView[a] === "string" || display.detailsView[a].value) {
							data[b] = getValue(display.detailsView[a], display.detailsView[a].splitter);
							b++;
						}
						else if (display.detailsView[a].group) {
							data[b] = getGroup(display.detailsView[a]);
							b++;
						}
					}
				}
				app.spin(false, "Loading contact data...");
				if (callback instanceof Function) callback({
					id: obj.id,
					table: obj.table,
					title: title,
					subtitle: subtitle,
					image: image,
					data: data,
					error: error
				});
				if (cb instanceof Function) return cb();
			}
			function afterDBLoaded(cb) {
				app.spin(true, "Loading contact data...");
				app.storeState();
				var cmd = {
					"cmd": obj.id ? "getRow" : "getRowTemplate",
					"title": obj.table
				};
				if (obj.id) cmd.args = [obj.id];
				wwManager(cmd, function (row, error) { processDetailsReturnData(row, error, cb); });
			}
			checkDBLoaded(afterDBLoaded);
		},
		generateListItems = function (tableName, ids, options, callback) {
			function buildList(result, errors) {
				var ret = [];
				if (!errors && result && result.length > 0) {
					for (var a = 0, len = result.length, sort; a < len; a++) {
						sort = result[a].pop();
						if (sort === "") sort = "*";
						ret[a] = { table: tableName, id: result[a].shift(), sortBy: sort + "__" + result[a].join(joiner), text: result[a].join(joiner), selected: options.selected, type: "link" };
					}
				}
				return callback instanceof Function ? callback(ret) : ret;
			}
			options = options || {};
			var columns = dataTemplates[tableName].display && dataTemplates[tableName].display.listView.text ? dataTemplates[tableName].display.listView.text.join("|||").split("|||") : [1],
				joiner = dataTemplates[tableName].display && dataTemplates[tableName].display.listView.joiner ? dataTemplates[tableName].display.listView.joiner : " ";
			columns.push(options.sortByCol || dataTemplates[tableName].display.listView.sortBy || columns[0]);
			if (typeof ids === "string") ids = [ids];
			wwManager({ "cmd": "getVals", "title": tableName, "args": [ids, columns] }, buildList);
		},
		generateList = function (dbTitle, ids, options, callback) {
			function getIds(rowId) {
				ids.push(rowId);
			}
			function getData() {
				if (options && options.numberPerPage && options.pageNumber && ids.length > options.numberPerPage) {
					ids.slice(options.numberPerPage * (options.pageNumber - 1), options.numberPerPage * (options.pageNumber - 1) + options.numberPerPage);
				}
				return generateListItems(dbTitle, ids, options, callback);
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
		addToGroup = function (groupName, detailsObj, searchQuery) {
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
					//debug(detailsObj, "detailsObj");
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
		addToNewGroup = function (detailsObj, searchQuery) {
			app.addItemToGroupDropdown = false;
			app.groupDropdown = false;
			if (detailsObj) generateListItems(detailsObj[0].table, detailsObj[0].id, { selected: true }, function (list) {
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
			function getGroups(cb) {
				wwManager({ "cmd": "getLength", "title": "Groups" }, function (length) {
					var ids = [];
					for (var a = 0; a < length; a++) ids[a] = a;
					wwManager({ "cmd": "getVals", "title": "Groups", "args": [ids, ["groupName"]] }, function (vals) {
						for (var a = 0, len = vals.length; a < len; a++) {
							app.groups[a] = vals[a][1];
						}
						if (cb instanceof Function) cb();
						if (callback instanceof Function) return callback();
					});
				});
			}
			if (app.groups.length === 0) checkDBLoaded(getGroups);
			else if (callback instanceof Function) return callback();
		},
		generateListView = function (tableTitle, ids, options) {
			function applyTitle(title) {
				app.searchResultsTitle = title;
			}
			app.spin(true, "Generating list...");
			checkDBLoaded(function (callback) {
				options = options || {};
				options.pageNumber = options.pageNumber || 1;
				options.numberPerPage = options.numberPerPage || 100;
				tableTitle = VAL.toPropName(tableTitle);
				if (dataTemplates[tableTitle]) {
					app.searchResults = [];
					generateList(tableTitle, ids, options, function (list) {
						app.searchResults = list;
						wwManager({ "cmd": "getTitle", "title": tableTitle }, applyTitle);
						app.searchResultsError = list.length === 0 ? "Nothing to display" : "";
						app.navigate("search", app.currentQuery);
						app.spin(false, "Generating list...");
						if (callback instanceof Function) return callback();
					});
				}
				else {
					app.spin(false, "Generating list...");
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
			app.storeState();
		},
		importFile = function (toTable) {
			function done(success, errors) {
				if (success && !errors) {
					app.notify("Data imported successfully", true);
				}
				else if (errors) {
					defaultErrorHandler(success, errors);
				}
				else app.notify("Done", true);
			}
			if (toTable === "Files") app.loadFile('hiddenFileInput', null, function (data) {
				wwManager({ "cmd": "addRow", "title": toTable, "args": [data] }, done);
			});
			else if (toTable === "Contacts") app.loadFile('hiddenCSVInput', 'csv', function (data) {
				wwManager({ "cmd": "importJSON", "title": toTable, "args": [data, app.stoKey] }, done);
			});
		},
		confirm = function (msg, callback, options) {
			app.confirmMsg = msg || "Are you sure?";
			app.confirmOK = options && options.ok ? options.ok : "OK";
			app.confirmCancel = options && options.cancel ? options.cancel : "Cancel";
			app.confirmDetails = options && options.details ? options.details : null;
			app.showConfirm = true;
			app.confirmFunction = callback;
		};
	//Components
	const dropdown_button = {
		props: {
			buttontext: {
				type: String,
				default: ""
			},
			icon: {
				type: String,
				default: ""
			},
			align: {
				type: String,
				default: "left"
			},
			links: Array,
			title: String,
			noarrow: {
				type: Boolean,
				default: false
			},
			custominput: {
				type: Boolean,
				default: false
			},
			noinputtext: {
				type: String,
				default: ""
			},
			select: {
				type: Boolean,
				default: false
			}
		},
		data: function () {
			return {
				open: false,
				inputValue: this.buttontext || this.noinputtext,
				buttonValue: this.buttontext,
				clickOutside: null
			};
		},
		methods: {
			toggle: function (open) {
				var app = document.getElementById("app");
				if (open === true || open === false) this.open = open;
				else this.open = !this.open;
				if (this.open) {
					if (!this.clickOutside) {
						this.clickOutside = function clickOutside(e) {
							var outsideClick = !/dropdownButton/.test(e.target._prevClass);//for Windows UWP app which does not support .path or .contains
							if (e.path) {
								//for non UWP
								//check to see if it is exactly the same button that was clicked, 
								//or another dropdown button
								outsideClick = !this.$el.contains(e.target);
								var a = e.path.length || 0;
								if (this.$el.id && outsideClick) while (a--) {
									if (e.path[a].id === this.$el.id) {
										outsideClick = false;
										break;
									}
								}
							}
							if (outsideClick) this.action(null, this.buttonValue);
						}.bind(this);
					}
					app.addEventListener("click", this.clickOutside);
					this.$emit("dropdown-open");
					if (this.custominput) Vue.nextTick(function () {
						this.$refs.input.focus();
					}.bind(this));
				}
				else app.removeEventListener("click", this.clickOutside);
			},
			action: function (event, value) {
				if (this.select || this.custominput && value) this.buttonValue = value.replace(/<[^>]+>/g, "");
				this.toggle(false);
				this.$emit("dropdown-action", value);
			}
		},
		template: "#dropdown-button"
	},
		icon_select = {
			props: {
				align: {
					type: String,
					default: "left"
				},
				noinputtext: {
					type: String,
					default: "Select Icon"
				},
				icon: {
					type: String,
					default: null
				}
			},
			data: function () {
				return {
					open: false,
					clickOutside: null,
					iconSelected: this.icon,
					options: [
						"icon-favorite-star",
						"icon-folder-open",
						"icon-audio",
						"icon-film",
						"icon-file",
						"icon-picture",
						"icon-map-marker",
						"icon-plane",
						"icon-world",
						"icon-user",
						"icon-people",
						"icon-lock",
						"icon-mail",
						"icon-calendar",
						"icon-comment",
						"icon-tasks",
						"icon-briefcase",
						"icon-shopping-cart",
						"icon-hdd",
						"icon-bell",
						"icon-bullhorn",
						"icon-flag",
						"icon-tag",
						"icon-bookmarks",
						"icon-book",
						"icon-leaf",
						"icon-fire",
						"icon-like",
						"icon-dislike",
						"icon-eye-open",
						"icon-time"
					]
				};
			},
			methods: {
				toggle: function (open) {
					var app = document.getElementById("app");
					if (open === true || open === false) this.open = open;
					else this.open = !this.open;
					if (this.open) {
						if (!this.clickOutside) {
							this.clickOutside = function clickOutside(e) {
								var outsideClick = !/dropdownButton/.test(e.target._prevClass);//for Windows UWP app which does not support .path or .contains
								if (e.path) {
									//for non UWP
									//check to see if it is exactly the same button that was clicked, 
									//or another dropdown button
									outsideClick = !this.$el.contains(e.target);
									var a = e.path.length || 0;
									if (this.$el.id && outsideClick) while (a--) {
										if (e.path[a].id === this.$el.id) {
											outsideClick = false;
											break;
										}
									}
								}
								if (outsideClick) this.toggle(false);
							}.bind(this);
						}
						app.addEventListener("click", this.clickOutside);
					}
					else app.removeEventListener("click", this.clickOutside);
				},
				select: function (icon) {
					this.iconSelected = icon;
					this.toggle(false);
					this.$emit("icon-select", icon);
				}
			},
			template: "#icon-select"
		},
		color_select = {
			props: {
				align: {
					type: String,
					default: "left"
				},
				noinputcolor: {
					type: String,
					default: "#478cdb"
				},
				color: {
					type: String,
					default: "#478cdb"
				}
			},
			data: function () {
				return {
					open: false,
					clickOutside: null,
					colorSelected: this.color,
					options: [//hex color themes
						"#478cdb",
						"#ffb900",
						"#ff8c00",
						"#ca5010",
						"#da3b01",
						"#ef6950",
						"#d13438",
						"#ff4343",
						"#e74856",
						"#e81123",
						"#ea005e",
						"#c30052",
						"#e3008c",
						"#bf0077",
						"#c239b3",
						"#9a0089",
						"#881798",
						"#b146c2",
						"#744da9",
						"#8764b8",
						"#6b69d6",
						"#8e8cd8",
						"#0063b1",
						"#0078d7",
						"#0099bc",
						"#2d7d9a",
						"#00b7c3",
						"#038387",
						"#00b294",
						"#018574",
						"#00cc6a",
						"#107c10",
						"#498205",
						"#486860"
					]
				};
			},
			methods: {
				toggle: function (open) {
					var app = document.getElementById("app");
					if (open === true || open === false) this.open = open;
					else this.open = !this.open;
					if (this.open) {
						if (!this.clickOutside) {
							this.clickOutside = function clickOutside(e) {
								var outsideClick = !/dropdownButton/.test(e.target._prevClass);//for Windows UWP app which does not support .path or .contains
								if (e.path) {
									//for non UWP
									//check to see if it is exactly the same button that was clicked, 
									//or another dropdown button
									outsideClick = !this.$el.contains(e.target);
									var a = e.path.length || 0;
									if (this.$el.id && outsideClick) while (a--) {
										if (e.path[a].id === this.$el.id) {
											outsideClick = false;
											break;
										}
									}
								}
								if (outsideClick) this.toggle(false);
							}.bind(this);
						}
						app.addEventListener("click", this.clickOutside);
					}
					else app.removeEventListener("click", this.clickOutside);
				},
				select: function (color) {
					this.colorSelected = color;
					this.toggle(false);
					this.$emit("color-select", color);
				}
			},
			template: "#color-select"
		},
		jump_list = {
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
				},
				currentQuery: {
					type: String,
					default: ""
				}
			},
			components: {
				"dropdown-button": dropdown_button
			},
			data: function () {
				return {
					moreDropdownLinks: [
						{
							text: "Sort List",
							icon: "icon-sort",
							action: "sort"
						},
						{
							text: "Filter List",
							icon: "icon-filter",
							action: "filter"
						},
						{
							text: "List View",
							icon: "icon-list",
							action: "view"
						},
						{
							text: "Add All to Favorites",
							icon: "icon-favorite-star",
							action: "favorite"
						},
						{
							text: "E-mail All",
							icon: "icon-mail",
							action: "email"
						}
					],
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
							function generateHeaders() {
								function obj(name, sortBy) {
									return { id: "jumplink_" + VAL.toPropName(name), sortBy: sortBy, text: name, type: "jumplink" };
								}
								var b = 0,
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
								for (let a = 0, len = list.length, name; a < len; a++) {
									if (list[a].type === "jumplink") {//strip out old headers
										list.splice(a, 1);
										a--;
										len--;
									}
									//by most recent
									else if (typeof list[a].sortBy === "number" && list[a].sortBy > 15e11 && list[a].sortBy < 2e12) {
										diff = now - list[a].sortBy;
										for (let header in recentHeaders) {
											if (diff >= recentHeaders[header]) {
												name = header;
												break;
											}
										}
										if (a === 0 || name !== nameHeaders[c - 1].text) {
											nameHeaders.push(obj(name, now - recentHeaders[name]));
											c++;
										}
									}
									// by alphabetic
									else {
										name = list[a].sortBy && list[a].sortBy.split("__")[0] || "A";
										letter = name.charAt(0);
										if (alphabetHeaders[b - 1] === undefined || letter !== alphabetHeaders[b - 1].sortBy) {
											alphabetHeaders.push(obj(letter, letter));
											b++;
										}
										if (nameHeaders[c - 1] === undefined || name !== nameHeaders[c - 1].sortBy) {
											nameHeaders.push(obj(name, name));
											c++;
										}
									}
								}
							}
							var alphabetHeaders = [],
								nameHeaders = [],
								letter;
							generateHeaders();
							if (nameHeaders.length < 20 || nameHeaders.length / list.length < 0.2) list = nameHeaders.concat(list);
							else list = alphabetHeaders.concat(list);
							list = deleteDuplicates(list);
							list = letter ? list.sort(sortFunction) : list.sort(sortFunction).reverse();
							return list;
						}
						return sortList(this.links);
					},
					set: function (newValue) {
						return newValue;
					}
				}
			},
			methods: {
				moreDropdownActions: function (action) {
					switch (action) {
						case "sort":
							break;
						case "filter":
							break;
						case "favorite":
							break;
						case "view":
							this.toggle('collapsed');
							this.moreDropdownLinks[2] = {
								text: this.collapsed ? "List View" : "Button View",
								icon: this.collapsed ? "icon-list" : "icon-th",
								action: "view"
							};
							break;
						case "email":
							break;
						case "_create_new_group":
							addToNewGroup(null, this.currentQuery);
							break;
						default:
							if (/^_add_to_group_/.test(action)) {
								var groupName = action.replace(/_add_to_group_/, "");
								//debug(groupName, "add to group");
								addToGroup(groupName, null, this.currentQuery);
							}
							else debug(action, "no such button action found");
					}
				},
				seeDetails: function (obj) {
					var sortByRecent = typeof obj.sortBy === "number" && obj.sortBy > 15e11 && obj.sortBy < 2e12;
					if (sortByRecent) {
						this.list.unshift(obj);
						this.list[0].sortBy = new Date().getTime();
						this.list = this.list.slice(0, 20);
					}
					else this.$emit("update-recently-viewed", obj);
					getDetails(obj, function (detailsObj) {
						if (/desk/.test(document.getElementsByTagName("html")[0].className)) {
							this.$emit("update-details", detailsObj);
						}
						else {
							app.details = detailsObj;
							app.navigate("details", null, detailsObj);
						}
					}.bind(this));
				},
				toggle: function (prop) {
					if (this[prop] !== undefined) this[prop] = this[prop] ? false : true;
					else debug(prop, "prop doesn't exist in jump-list");
				},
				toggleSelect: function (link) {
					for (var a = 0, len = this.list.length; a < len; a++) {
						if (this.list[a].type === "link") this.list[a].selected = false;
					}
					this.selectAll = false;
					this.collapsed = false;
					this.toggle('selected');
					if (link) link.selected = true;
					Vue.nextTick(this.updateDropdownLinks);
				},
				toggleSelectAll: function () {
					this.toggle('selectAll');
					for (var a = 0, len = this.list.length; a < len; a++) {
						if (this.list[a].type === "link") this.list[a].selected = this.selectAll ? true : false;
					}
					Vue.nextTick(this.updateDropdownLinks);
				},
				showIf: function (link, collapse) {
					return link.type === "jumplink" || collapse === false;
				},
				action: function (link, div, collapse) {
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
					Vue.nextTick(this.updateDropdownLinks);
				},
				updateDropdownLinks: function () {
					function newEmailLink() {
						var bccIds = [];
						for (let a = 0, len = this.list.length; a < len; a++) {
							if (this.list[a].type === "link" && (this.selected === false || this.list[a].selected === true)) bccIds.push(this.list[a].id);
						}
						getEmails.call(this, bccIds);
					}
					function getEmails(ids) {
						var emailAddresses = [];
						if (ids.length > 0) wwManager({
							cmd: "getVals", title: "Contacts",
							args: [ids, ["Name", "GivenName", "FamilyName", "E_mail1_Type", "E_mail1_Value", "E_mail2_Type", "E_mail2_Value",
								"E_mail3_Type", "E_mail3_Value", "E_mail4_Type", "E_mail4_Value", "E_mail5_Type", "E_mail5_Value", "E_mail6_Type",
								"E_mail6_Value", "E_mail7_Type", "E_mail7_Value"]]
						}, function (vals, errors) {
							if (!vals || errors) return debug(errors, "get email errors");
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
									if (!email) continue;
									type = vals[a][b] || "";
									if (vals[a][6]) {
										if (/\'s Email/.test(type)) name = type.replace(/\'s Email/, " ") + vals[a][3];
										name = name.replace(/\*/, "");
										name = trim(name);
									}
									if (primary === false || primary === b) emailAddresses.push(name + " <" + email.replace(/,/g, ">,<") + ">");
								}
							}
							if (emailAddresses.length > 0) {
								emailAddresses = emailAddresses.join(",");
								if (emailAddresses.length === 1) buildMailtoUri(emailAddresses, null, null, null, function (uri) { updateLinks.call(this, uri, ids); }.bind(this));
								else buildMailtoUri(app.dropboxEmail || "", emailAddresses, null, null, function (uri) { updateLinks.call(this, uri, ids); }.bind(this));
							}
							else updateLinks.call(this);
						}.bind(this));
						else updateLinks.call(this);
					}
					function updateLinks(mailtoUri, ids) {
						var len = ids ? ids.length : 0;
						this.moreDropdownLinks = [
							{
								text: "Sort List",
								icon: "icon-sort",
								action: "sort"
							},
							{
								text: "Filter List",
								icon: "icon-filter",
								action: "filter"
							},
							{
								text: this.collapsed ? "List View" : "Button View",
								icon: this.collapsed ? "icon-list" : "icon-th",
								action: "view"
							},
							{
								text: this.selected ? "Add Selected to Favorites" : "Add All to Favorites",
								icon: "icon-favorite-star",
								action: "favorite",
								disabled: this.selected && len === 0 ? true : false
							},
							{
								text: this.selected ? "E-mail Selected" : "E-mail All",
								icon: "icon-mail",
								action: "email",
								href: mailtoUri,
								disabled: this.selected && !mailtoUri ? true : false
							}
						];
						for (let a = 0, len = app.groups.length; a < len; a++) {
							this.moreDropdownLinks[a + 4] = {
								text: this.selected ? "Add Selected to " + app.groups[a] + " Group" : "Add to " + app.groups[a] + " Group",
								icon: "icon-people",
								action: "_add_to_group_" + app.groups[a],
								disabled: this.selected && len === 0 ? true : false
							};
						}
						this.moreDropdownLinks.push({
							text: this.selected ? "Save Selected to New Group" : "Save Search as New Group",
							icon: "icon-plus",
							action: "_create_new_group",
							disabled: this.selected && len === 0 ? true : false
						});
					}
					initializeGroups(newEmailLink.bind(this));
				}
			},
			template: "#jump-list"
		},
		new_table_page = {
			components: {
				"dropdown-button": dropdown_button,
				"icon-select": icon_select
			},
			data: function () {
				return {
					newTable: {
						title: "",
						headers: ["Column 1", "Column 2", "Column 3"],
						types: ["string", "string", "string"],

						searchableDropdown: -1,
						typesDropdown: -1,

						searchableDefault: true,
						typesDefault: 'string',

						searchableDropdownOptions: [true, false, 'optional'],
						typesDropdownOptions: ["any", "number", "integer", "posInteger", "negInteger", "boolean", "string", "uniqueString",
							"multilineString", "date", "email", "phoneNumber", "password", "streetAddress", "mailAddress", "cityCounty",
							"provinceStateRegion", "country", "postalZipCode", "givenName", "familyName", "geoLocation", "longitude", "latitude"],

						options: {
							customProperties: {},
							doNotIndex: [],
							initialIndex: [],
							searchable: [true, true, true],
							icon: null
						},
						display: {
							listView: {
								text: [],
								joiner: " ",
								sortBy: ""
							},
							detailsView: {}
						},
						optionsDropdown: -1,
						fullscreen: false
					},
					icon: null,
					customProperties: [],
					showCustomPropertyInput: false,
					customPropertyName: "",
					customPropertyType: "",
					customPropertyTypes: [{ text: "Any", action: "Any" }, { text: "String", action: "String" }, { text: "Number", action: "Number" }, { text: "Boolean", action: "Boolean" }],
					customPropertyInitialValue: "",
					initialValueInputType: "text",
					customPropertyError: null
				};
			},
			methods: {
				setIcon: function (icon) {
					this.icon = icon;
					this.newTable.options.icon = icon;
				},
				setCustomPropertyType: function (value) {
					this.customPropertyType = value;
					if (value === "String" || value === "Any") {
						this.initialValueInputType = "text";
						this.customPropertyInitialValue = "";
					}
					else if (value === "Number") {
						this.initialValueInputType = "number";
						this.customPropertyInitialValue = 0;
					}
					else if (value === "Boolean") this.customPropertyInitialValue = false;
					else debug(value, "not valid property type");
				},
				addNewProperty: function () {
					function isNumeric(n) { return !isNaN(parseFloat(n)) && isFinite(n); }
					if (!/^[A-z_]\w*(\.[A-z_]\w*)*$/.test(this.customPropertyName)) { this.customPropertyError = "Invalid Property Name"; }
					else if (!/Any|String|Number|Boolean/.test(this.customPropertyType)) { this.customPropertyError = "Invalid Property Type"; }
					else if (this.customPropertyType === "String" && typeof this.customPropertyInitialValue !== "string" ||
						this.customPropertyType === "Boolean" && typeof this.customPropertyInitialValue !== "boolean" ||
						this.customPropertyType === "Number" && !isNumeric(this.customPropertyInitialValue)) {
						this.customPropertyError = "Invalid Initial Value";
					}
					else {
						this.customPropertyError = null;
						this.showCustomPropertyInput = false;
						this.customProperties.push({ name: this.customPropertyName, type: this.customPropertyType, initialValue: this.customPropertyInitialValue });
						this.customPropertyName = "";
						this.customPropertyType = "";
						this.customPropertyInitialValue = "";
					}
				},
				importNewTable: function () {
					function matches(subsetArr, ofArr) {
						var ret = true;
						if (ofArr && ofArr.constructor === Array) {
							for (let a = 0, len = subsetArr.length; a < len; a++) {
								if (ofArr.constructor === Array && ofArr.indexOf(subsetArr[a]) === -1) ret = false;
								else if (!ofArr[subsetArr[a]]) ret = false;
							}
							return ret;
						}
					}
					function createTempTable(JSON, template) {
						template.options.importJSON = JSON;
						app.notify("Building new table");
						wwManager({ "cmd": "initNewNyckelDB", "title": "temp", "args": ["temp", template.headers, template.types, template.options] },
							function (success, errors) {//final callback function for last NyckelDB to initialise
								if (errors) defaultErrorHandler(success, errors);
								else app.notify("Done", true);
							});
					}
					app.loadFile('hiddenCSVInput', 'csv', function (data) {
						if (matches(data.Headers, this.newTable.headers)) {
							createTempTable(data, this.newTable);
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
									(function (self, template) {
										confirm("Are you trying to create a " + template + " table? You can use a template.", function () {
											self.template(template);
											app.notify("");
											createTempTable(data, dataTemplates[template]);
										});
									})(this, template);
								}
							}
						}
					}.bind(this));
				},
				template: function (templateName) {
					if (dataTemplates[templateName]) {
						this.newTable.title = templateName;
						if (dataTemplates[templateName].headers instanceof Array) this.newTable.headers = dataTemplates[templateName].headers.join("|").split("|");
						else {
							this.newTable.headers = [];
							var a = 0;
							for (let header in dataTemplates[templateName].headers) {
								if (dataTemplates[templateName].headers.hasOwnProperty(header)) {
									this.newTable.headers[a] = header;
									a++;
								}
							}
							this.newTable.types = dataTemplates[templateName].types || dataTemplates[templateName].headers;
						}
						if (this.newTable.headers[0] === "id") this.newTable.headers.shift();
						this.newTable.types = this.newTable.types || dataTemplates[templateName].types;
						this.newTable.options = dataTemplates[templateName].options;
						this.newTable.display = dataTemplates[templateName].display;
						this.newTable.options.searchable = dataTemplates[templateName].options.searchable || [];
						this.icon = this.newTable.options.icon || null;
					}
					else {
						this.newTable.title = "";
						this.newTable.headers = ["", "", ""];
						this.newTable.types = [this.newTable.typesDefault, this.newTable.typesDefault, this.newTable.typesDefault];
						this.newTable.options = {
							customProperties: {},
							doNotIndex: [],
							initialIndex: [],
							searchable: [],
							icon: null
						};
						this.newTable.display = {
							listView: {
								text: [],
								joiner: " ",
								sortBy: ""
							},
							detailsView: {
							}
						};
						this.icon = null;
					}
					for (let a = 0, len = this.newTable.types.length; a < len; a++) {
						this.newTable.options.searchable[a] = this.newTable.options.searchable[a] !== undefined ?
							this.newTable.options.searchable[a] : this.newTable.searchableDefault;
					}
				},
				toggleDropdown: function (rowName, colIndex) {
					if (this.newTable[rowName] !== undefined) {
						this.newTable[rowName] = this.newTable[rowName] === colIndex ? -1 : colIndex;
					}
					else debug(rowName, "no such row in table");
				},
				sortbyColumn: function (index) {
					debug(index, "sortByColumn function not done");
				},
				deleteColumn: function (index) {
					this.newTable.headers.splice(index, 1);
					this.newTable.types.splice(index, 1);
					this.newTable.options.searchable.splice(index, 1);
					this.newTable.optionsDropdown = -1;
				},
				insertColumn: function (index) {
					if (!index) {
						this.newTable.headers.push("");
						this.newTable.types.push(this.newTable.typesDefault);
						this.newTable.options.searchable.push(this.newTable.searchableDefault);
					}
					else {
						this.newTable.headers.splice(index, 0, "");
						this.newTable.types.splice(index, 0, this.newTable.typesDefault);
						this.newTable.options.searchable.splice(index, 0, this.newTable.searchableDefault);
					}
					this.newTable.optionsDropdown = -1;
				}
			},
			template: "#new-table-page"
		},
		groups_page = {
			components: {
				"jump-list": jump_list
			},
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
				newGroup: function (event, groupName) {
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
							if (this.groups.indexOf(groupName) > -1) {
								while (this.groups.indexOf(groupName + " " + i) > -1) i++;
								groupName = groupName + " " + i;
							}
							//Save new group
							wwManager({ "cmd": "addRow", "title": "Groups", "args": [[groupName, "", "", ""]] }, function () {
								this.updateGroup(groupName, ids, this.groupSearchBox);
								this.groups.push(groupName);
								this.activeGroup = [];
								this.showNewGroupUI = false;
								this.groupSearchBox = "";
								this.groupName = "";
							}.bind(this));
						}.bind(this));
					}
					else app.notify("Group requires a name");
				},
				updateGroup: function (groupName, ids, searchTerms) {
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
					}
				},
				groupInput: function (e) {
					function runSearch(table, find) {
						wwManager({ "cmd": "advancedSearch", "title": table, "args": [find, { colNames: searchableColumns }] }, function (searchResults, errors) {
							if (!errors && searchResults && searchResults.length > 0) {
								generateList(table, searchResults, { selected: true }, function (list) {
									this.activeGroup = this.activeGroup.concat(list);
								}.bind(this));
							}
						}.bind(this));
					}
					function processInput(callback) {
						if (value !== "") {
							var find = String(value);
							find = VAL.removeHTMLTags(find);
							find = find.toLowerCase();
							find = VAL.toEnglishAlphabet(find);
							find = find.replace(/[^_a-z0-9\+\-]/gi, " ");
							find = trim(find);
							this.activeGroup = [];
							document.getElementById("app").focus();
							for (let table in dataTemplates) {
								if (dataTemplates.hasOwnProperty(table)) {
									runSearch.call(this, table, find);
								}
							}
						}
						if (callback instanceof Function) return callback();
					}
					var value = e ? e.target.value : this.groupSearchBox;
					checkDBLoaded(processInput.bind(this));
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
						if (group.groupIds.value !== "" && group.groupIds.value !== "[]") {
							var ids = JSON.parse(group.groupIds.value),
								lenIds = 0,
								b = 0;
							for (let a in ids) {
								if (ids.hasOwnProperty(a)) {
									lenIds++;
								}
							}
						//	debug(ids, "ids");
							for (let table in ids) {
								if (ids.hasOwnProperty(table)) {
									(function (table) {
									//	debug(table, "table");
										generateListItems(table, ids[table], null, function (arr) {
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
						if (group.excludeIds && group.excludeIds.value && group.excludeIds.value !== "" && group.excludeIds.value !== "[]") {
							var removeIds = JSON.parse(group.excludeIds.value);
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
						app.searchResultsTitle = group.groupName.value;
						app.searchResultsError = "";
						app.navigate("search", app.currentQuery);
					}
					function searchForMembers(table, group, lenTables) {
						wwManager({ "cmd": "advancedSearch", "title": table, "args": [group.searchTerms.value, { colNames: searchableColumns }] }, function (results, err) {
							if (!err) {
								if (results) generateListItems(table, results, null, function (arr) {
									list = list.concat(arr);
									n++;
									if (n === lenTables) add(group);
								});
								else {
									n++;
									if (n === lenTables) add(group);
								}
							}
							else debug(err, table + " seeGroup error");
						});
					}
					function showGroup(group, error) {
					//	debug(group, "group");
						if (!group || error) debug(error);
						else if (group.searchTerms.value !== "") {
							for (let a in dataTemplates) {
								if (dataTemplates.hasOwnProperty(a)) lenTables++;
							}
							for (let table in dataTemplates) {
								if (dataTemplates.hasOwnProperty(table)) {
									searchForMembers(table, group, lenTables);
								}
							}
						}
						else add(group);
					}
					var list = [],
						lenTables = 0,
						n = 0;
					wwManager({ "cmd": "getRow", "title": "Groups", "args": [index] }, showGroup);
				},
				addToGroup: function (groupName, detailsObj, searchQuery) {
				//	debug(groupName, "groupName");
					this.addItemToGroupDropdown = false;
					this.groupDropdown = false;
					addToGroup(groupName, detailsObj, searchQuery);
				},
				showSelectGroupMembers: function () {
					for (let table in dataTemplates) {
						(function (self, table) { 
							generateList(table, null, null, function (list) {
								self.activeGroup = self.activeGroup.concat(list);
							});
						})(this, table);
					}
				},
				resetGroups: function () {
					this.groupPage = 1;
					this.resetGroupSearch();
					this.groupName = "";
					this.activeGroup = [];
					if (this.groups.length === 0) app.goBack();
					else this.toggle('showNewGroupUI');
				},
				toggle: function (prop) {
					if (this[prop] === undefined) return debug(prop, "prop does not exist");
					else this[prop] = !this[prop];
				}
			},
			template: "#groups-page"
		},
		view1_page = {
			data: function() {
				return {
					sharedFileLink: ""
				};
			},
			methods: {
				generateListView: generateListView,
				importFile: importFile,
				createNewItem: createNewItem,
				shareFile: function (fileName, fileContents, password, expires) {
					APP.Dbx.share(fileName, fileContents, password, expires, function (response, response2, response3) {
						console.log("shared file", response, response2, response3);
						this.sharedFileLink = response.url;
					}.bind(this));
				}, 
				receiveFile: function (fileName, password) {
					APP.Dbx.receive(this.sharedFileLink, password, function (response, response2, response3) {
						console.log("got file", response, response2, response3);
					});
				}
			},
			template: "#view1-page"
		},
		view2_page = {
			methods: {
				generateListView: generateListView,
				importFile: importFile,
				createNewItem: createNewItem
			},
			template: "#view2-page"
		},
		view3_page = {
			methods: {
				generateListView: generateListView,
				importFile: importFile,
				createNewItem: createNewItem
			},
			template: "#view3-page"
		},
		details_card_lineitem = {
			props: {
				item: Object
			},
			data: function () {
				return {
					clipboard: function () {
						return navigator.clipboard ? true : false;
					}
				};
			},
			methods: {
				externalLink: function (text, column, type, multilineText) {
					var link;
					if (type === "phone") link = "tel:" + encodeURIComponent(String(text).replace(/[^0-9]/g, ""));
					else if (type === "sms") link = "sms:" + encodeURIComponent(String(text).replace(/[^0-9]/g, ""));
					else if (type === "email") link = "mailto:" + encodeURIComponent(String(text));
					else if (type === "bcc") link = buildMailtoUri(app.dropboxEmail || "", String(text));
					else if (type === "www") link = text;
					if (link) return link;
					else if (type === "gps" || type === "address" && !/mail/i.test(text)) {
						var googlemaps = "http://maps.google.com/?q=",
							bing = "http://www.bing.com/maps/?q=",
							bingmaps = "bingmaps:?q=",
							applemaps = "http://maps.apple.com/?q=",
							userAgent = navigator.userAgent;
						if (type === "gps") {
							link = text.replace("https://www.google.com/maps/search/?api=1&query=", "").replace(/%2C/g, ",").replace(/%2B|\+/g, "");
						}
						else if (multilineText) link = multilineText.join(" ");
						else link = text;
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
				}
			},
			template: "#details-card-lineitem"
		},
		details_card = {
			props: {
				details: Object
			},
			components: {
				"details-card-lineitem": details_card_lineitem,
				"dropdown-button": dropdown_button
			},
			data: function () {
				return {
					addItemToGroupDropdown: state.addItemToGroupDropdown,
					groups: state.groups,
					groupsDropdownLinks: [
						{
							text: "Loading Groups...",
							action: "_loading",
							disabled: true
						}, {
							text: "Create a new group",
							icon: "icon-plus",
							action: "_create_new_group"
						}
					],
					moreDropdownLinks: [
						{
							text: "Edit",
							icon: "icon-pencil",
							action: "edit"
						}, {
							text: "Delete",
							icon: "icon-delete",
							action: "delete"
						}
					],
					copyDropdownLinks: []
				};
			},
			methods: {
				initializeGroups: function () {
					initializeGroups(function () {
						this.groupsDropdownLinks = [];
						for (let a = 0, len = app.groups.length; a < len; a++) {
							this.groupsDropdownLinks[a] = {
								text: app.groups[a],
								icon: "icon-people",
								action: app.groups[a]
							};
						}
						this.groupsDropdownLinks.push({
							text: "Create a new group",
							icon: "icon-plus",
							action: "_create_new_group"
						});
					}.bind(this));
				},
				groupsDropdownActions: function (action) {
					if (action === "_create_new_group") {
						this.addToNewGroup();
					}
					else if (action !== "_loading") this.addToGroup(action, this.details);
				},
				initializeCopyActions: function () {
					function addToCopyLinks(item) {
						if (item.value && item.value[0] && !item.hidden) {
							this.copyDropdownLinks[b] = {
								text: item.value.join('\r\n'),
								action: item.value.join('\r\n')
							};
							if (this.copyDropdownLinks[b].text.length > 50) this.copyDropdownLinks[b].text = this.copyDropdownLinks[b].text.slice(0, 50) + "...";
							b++;
						}
					}
					var b = 0;
					for (let a = 0, len = this.details.data.length; a < len; a++) {
						if (this.details.data[a].group && !this.details.data[a].hidden) {
							for (let c = 0, lenC = this.details.data[a].group.length; c < lenC; c++) {
								addToCopyLinks.call(this, this.details.data[a].group[c], this.details.data[a].groupHeading);
							}
						}
						else addToCopyLinks.call(this, this.details.data[a]);
					}
				},
				copyToClipboard: function (stringToCopy) {
					if (navigator.clipboard) {
						try {
							navigator.clipboard.writeText(stringToCopy);
							var str = stringToCopy.slice(0, 20),
								ext = stringToCopy.length > 20 ? "..." : "";
							app.notify("Copied '" + str + ext + "' to clipboard", true);
						} catch (err) {
							console.error('Failed to copy: ', err);
						}
					}
				},
				moreDropdownActions: function (action) {
					if (action === "delete") {
						this.deleteItem();
					}
					if (action === "edit") {
						this.editDetails();
					}
				},
				editDetails: function () {
					app.details = this.details;
					app.navigate("edit");
				},
				deleteItem: function () {
					confirm("Are you sure that you want to delete " + this.details.title + "?", function () {
						debug("delete not done");
					});
				},
				detailsViewHelp: function () {
					confirm("Item not found. Would you like to remove this listing?", function () {
						app.recentlyViewed.splice(1, 1);
						app.storeState();
					});
				},
				addToNewGroup: addToNewGroup,
				addToGroup: addToGroup
			},
			template: "#details-card"
		},
		details_view_container = {
			props: {
				details: Object
			},
			components: {
				"details-card": details_card
			},
			template: '<details-card class="view-container" v-bind:details="details"></details-card>'
		},
		details_page = {
			components: {
				"details-card": details_card
			},
			data: function () {
				return {
					details: state.details
				};
			},
			template: "#details-page"
		},
		recent_page = {
			components: {
				"jump-list": jump_list,
				"v-a": details_view_container,
				"v-b": details_view_container
			},
			data: function () {
				return {
					loading: false,
					recentlyViewed: state.recentlyViewed,
					version: state.version,
					recentDetails: {
						id: null,
						table: null,
						data: [],
						image: null,
						titleH1: null,
						subtitleH2: null
					},
					detailsView: "v-a"
				};
			},
			created: function () {
				// fetch the data when the view is created and the data is
				// already being observed
				this.fetchData();
			},
			watch: {
				// call again the method if the route changes
				'$route': 'fetchData'
			},
			methods: {
				onDetailsUpdate: function (newDetailsObj) {
					this.detailsView = this.detailsView === "v-a" ? "v-b" : "v-a";
					this.recentDetails = newDetailsObj;
				},
				onRecentlyViewedUpdate: addToRecentlyViewed,
				addToNewGroup: addToNewGroup,
				fetchData: function () {
					function error(err) {
						this.loading = false;
						if (err) console.log(err);
					}
					if (this.recentlyViewed.length === 0) {
						this.loading = true;
						APP.Sto.getItem("state", null, function (s, err) {
							if (s) {
								this.loading = false;
								if (typeof s === "string" && JSON.parse) s = JSON.parse(s);
								if (s.recentlyViewed && s.version === this.version) {
									this.recentlyViewed = s.recentlyViewed;
									state.recentlyViewed = this.recentlyViewed;
								}
							} else error.call(this, err);
						}.bind(this), error.bind(this));
					}
				}
			},
			template: "#recent-page"
		},
		search_results_page = {
			components: {
				"jump-list": jump_list,
				"v-a": details_view_container,
				"v-b": details_view_container
			},
			data: function () {
				return {
					currentQuery: state.currentQuery,
					searchResults: state.searchResults,
					searchResultsTitle: state.searchResultsTitle,
					searchResultsError: state.searchResultsError,
					groupDropdown: state.groupDropdown,
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
					recentlyViewed: state.recentlyViewed,
					detailsView: "v-a"
				};
			},
			methods: {
				onDetailsUpdate: function (newDetailsObj) {
					this.detailsView = this.detailsView === "v-a" ? "v-b" : "v-a";
					this.searchDetails = newDetailsObj;
				},
				onRecentlyViewedUpdate: addToRecentlyViewed,
				addToNewGroup: addToNewGroup
			},
			template: "#search-results-page"
		},	
		edit_details_card_lineitem = {
			props: { item: Object },
			data: function () {
				return {
					focused: false,
					valid: true,
					validationError: "",
					validationErrorDetails: null
				};
			},
			components: {
				"dropdown-button": dropdown_button
			},
			methods: {
				toggleItem: function (item, index) {
					item.value[index] = item.value[index] === true ? false : true;
					//TODO
				},
				setLabel: function (value) {
					this.item.label.value = value;
				},
				setValue: function (value) {
					this.item.value = [value];
				},
				clearValue: function () {
					this.item.value = [];
				},
				onBlur: function (value, valueType) {
					this.focused = false;
					this.validateData(value, valueType);
				},
				/*Cleans up messy contact data. Used before saving data to database to catch common errors
				* valueType = the column heading from the csv table (ie "GivenName", "Address1_Street"...)
				* value = the name, address, phone number etc to check
				*/
				validateData: function (value, valueType) {
					wwManager({ "cmd": "validate", "title": "Groups", "args": [value, valueType] }, function (result, error, errorDetails) {
						if (result !== value) this.setValue(result);
						this.validationError = error || null;
						this.validationErrorDetails = errorDetails;
						this.valid = error ? false : true;
					}.bind(this));
				}
			},
			template: "#edit-details-card-lineitem"
		},
		edit_details_card_collapse = {
			props: {
				item: Object,
				collapse: {
					type: [Boolean, Number],
					default: false
				},
				show: {
					type: Number,
					default: 1
				}
			},
			components: {
				"edit-details-card-lineitem": edit_details_card_lineitem
			},
			data: function () {
				return {
					isCollapsed: this.show === 0,
					numShown: typeof this.collapse === "number" ? this.collapse : this.show
				};
			},
			methods: {
				toggleCollapse: function () {
					this.isCollapsed = this.isCollapsed ? false : true;
					if (this.numShown === 0) this.numShown = 1;
				},
				revealNext: function (num) {
					if (num && num !== true && num > 1) this.numShown = this.numShown + num;
					else this.numShown++;
				}
			},
			template: "#edit-details-card-collapse"
		},
		edit_details_card = {
			props: {
				details: Object
			},
			components: {
				"dropdown-button": dropdown_button,
				"edit-details-card-lineitem": edit_details_card_lineitem,
				"edit-details-card-collapse": edit_details_card_collapse
			},
			methods: {
				saveChanges: function () {
					function checkComplete(n) {
						if (n === 0) {
							app.spin(false, "Saving...");
							if (errors.length === 0) app.navigate("details");
							else debug(errors, "errors saving changes");
						}
					}
					function save(data, label) {
						if (data.value) {
							if (label) {
								if (String(label.value) !== String(label.orig)) {
									//set value 
									wwManager({ "cmd": "setVal", "title": table, "args": [rowId, label.column, label.value] }, function (setValue, error) {
										if (error) errors.push(error);
										if (setValue) {
											label.orig = setValue;
											label.value = setValue;
										}
										checkComplete(--n);
									});
								}
								else checkComplete(--n);
							}
							var value;
							//remove formatting
							if (/multilineString|formattedAddress/.test(data.type)) {
								value = data.value.join('\r\n');
							}
							else if (typeof data.value === "string") value = data.splitter ? data.value.join(data.splitter) : data.value.join(" ::: ");
							else value = data.value[0];
							if (value !== data.orig) {
								//set value 
								wwManager({ "cmd": "setVal", "title": table, "args": [rowId, data.column, value] }, function (setValue, error) {
									if (error) errors.push(error);
									if (setValue) {
										data.orig = setValue;
										data.value = formatValue(setValue, data.type, data.splitter);
									}
									checkComplete(--n);
								});
							}
							else checkComplete(--n);
						}
						else checkComplete(--n);
					}
					var table = this.details.table,
						rowId = this.details.id,
						data = this.details.data,
						n = 0,
						errors = [];
					if (!rowId) {
						app.spin(true, "Creating new item...");
						//create array						
						wwManager({ "cmd": "getHeaders", "title": table }, function (headers) {
							function setDefault(type){
								return /number|integer/i.test(type) ? 0 : type === "boolean" ? false : "";
							}
							function addToObj(data) {
								arr[headers.indexOf(data.column)] = [];
								for (let b = 0, lenB = data.value.length; b < lenB; b++) {
									arr[headers.indexOf(data.column)][b] = data.value[b];
								}
								if(data.type === "boolean" || /number|integer/i.test(data.type)) {
									arr[headers.indexOf(data.column)] = arr[headers.indexOf(data.column)][0] || setDefault(data.type);
								}
								else arr[headers.indexOf(data.column)] = arr[headers.indexOf(data.column)].join(" ::: ");
								if(data.label){
									arr[headers.indexOf(data.label.column)] = data.label.value || setDefault(data.label.type);
								}
							}
							var arr = new Array(headers.length);
							for (let a = 0, b = 0, len = data.length, lenB; a < len; a++) {
								if (data[a].group) {
									for (b = 0, lenB = data[a].group.length; b < lenB; b++) {
										addToObj(data[a].group[b]);
									}
								}
								else addToObj(data[a]);
							}
						//	debug(arr, "creating new row");
							for(let a= 0, len = arr.length; a < len; a++){
								if(arr[a] === undefined) debug(arr[a], headers[a]);
							}
							wwManager({ "cmd": "addRow", "title": table, "args": [arr] }, function (id, errors) {
								debug(errors, id);
								app.spin(false, "Creating new item...");
							});
						});

					}
					//go through data and find changes
					else {
						app.spin(true, "Saving...");
						//count lineItems
						for (let a = 0, b = 0, len = data.length, lenB; a < len; a++) {
							if (data[a].readonly) continue;
							if (data[a].group) {
								if (data[a].group.readonly) continue;
								for (b = 0, lenB = data[a].group.length; b < lenB; b++) {
									if (data[a].group[b].label) {
										n++;
									}
									n++;
								}
							}
							else {
								if (data[a].label) {
									n++;
								}
								n++;
							}
						}
						for (let a = 0, b = 0, len = data.length, lenB; a < len; a++) {
							if (data[a].readonly) continue;
							if (data[a].group) {
								if (data[a].group.readonly) continue;
								for (b = 0, lenB = data[a].group.length; b < lenB; b++) {
									save(data[a].group[b], data[a].group[b].label);
								}
							}
							else save(data[a], data[a].label);
						}
					}
				},
				cancelChanges: function () {
					debug("cancelChanges not done");
					app.navigate("details");
				}
			},
			template: "#edit-details-card"
		},
		edit_details_page = {
			components: {
				"edit-details-card": edit_details_card
			},
			data: function () {
				return {
					details: state.details
				};
			},
			template: "#edit-details-page"
		},
		page_not_found_page = {
			template: "#page-not-found"
		},
		routes = [
			{
				path: '/new',
				name: "new",
				components: {
					default: new_table_page
				},
				meta: {
					title: 'Create a new table - Nyckel (Beta)'
				}
			},
			{
				path: '/',
				name: "home",
				components: {
					default: recent_page
				},
				meta: {
					title: 'Recent - Nyckel (Beta)'
				}
			},
			{
				path: '/recent',
				name: "recent",
				components: {
					default: recent_page
				},
				meta: {
					title: 'Recent - Nyckel (Beta)'
				}
			},
			{
				path: '/groups',
				name: "groups",
				components: {
					default: groups_page
				},
				meta: {
					title: 'Groups - Nyckel (Beta)'
				}
			},
			{
				path: '/view1',
				name: "view1",
				components: {
					default: view1_page
				},
				meta: {
					title: 'Contacts - Nyckel (Beta)'
				}
			},
			{
				path: '/view2',
				name: "view2",
				components: {
					default: view2_page
				},
				meta: {
					title: 'Passwords - Nyckel (Beta)'
				}
			},
			{
				path: '/view3',
				name: "view3",
				components: {
					default: view3_page
				},
				meta: {
					title: 'Files - Nyckel (Beta)'
				}
			},
			{
				path: '/search',
				name: "search",
				components: {
					default: search_results_page
				},
				meta: {
					title: 'Search Results - Nyckel (Beta)'
				}
			},
			{
				path: '/edit',
				name: "edit",
				components: {
					default: edit_details_page
				},
				meta: {
					title: 'Edit - Nyckel (Beta)'
				}
			},
			{
				path: '/details',
				name: "details",
				components: {
					default: details_page
				},
				meta: {
					title: 'Details - Nyckel (Beta)'
				}
			},
			{
				path: '*',
				name: "notfound",
				components: {
					default: page_not_found_page
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
		components: {
			"color-select": color_select
		},
		data: state,
		watch: {
			'$route'(to, from) {
				const toDepth = to.query.page || 0;
				const fromDepth = from.query.page || 0;
				this.transitionName = toDepth > fromDepth ? 'forward' : 'back';
			}
		},
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
			updateCurrentView: function (to) {
				function seeDetails() {
					if (to.query && to.query.id && to.query.table && (to.query.id !== this.details.id || to.query.table !== this.details.table)) {
						this.seeDetails({ table: to.query.table, id: to.query.id });
					}
				}
				function search() {
					if (to.query.search !== encodeURIComponent(this.currentQuery)) {
						initializeGroups(function () {
							this.currentQuery = to.query.search;
							this.search(null, to.query.search);
						}.bind(this));
					}
				}
				function setPage() {
					if (parseInt(to.query.page) !== backIndex) backIndex = parseInt(to.query.page);
					else backIndex++;
					location = location || backstack[backIndex];
					backstack[backIndex - 1] = location;
				}
				if (window.location.hash.match(/^#\/access_token=/)) this.login();
				to = to || { name: this.$route.name, query: this.$route.query };
				var location = to.name;
				if (location === "home") location = this.startView;
				if (location === "details") seeDetails.call(this);
				this.currentView = this.views[location] || this.views[startView];
				setNavLinkIndicatorPosition(location);
				if (location === "groups") initializeGroups();
				if (to.query && to.query.search) search.call(this);
				if (to.query && to.query.page !== undefined) setPage();
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
				if (cordova || this.cookieAgree) {
					setTimeout(function () {
						APP.Sto.setItem("state", {
							version: this.version,
							darkTheme: this.darkTheme,
							useWindowsTheme: this.useWindowsTheme,
							windowsDarkTheme: this.windowsDarkTheme,
							accentColor: this.accentColor,
							recentlyViewed: this.recentlyViewed,
							backstack: backstack,
							backIndex: backIndex,
							stoKey: this.stoKey,
							time: new Date().getTime(),
							cookieAgree: this.cookieAgree
						});
					}.bind(this), 1);
				}
			},
			search: function (event, optionalQuery) {
				if (!this.showSearchBar) {
					this.searchSuggestions = [];
					document.getElementById("searchBox").focus();
				}
				else this.showSearchSuggestions = true;
				this.showSearchBar = true;
				if (this.showSideNav) {
					this.showSideNav = false;
					this.showSettings = false;
				}
				if (this.searchBox !== "" || optionalQuery) {
					if (this.searchBox === "debugmode") {
						APP.setDebugMode(true);
						debug("showing debugmode");
					}
					else if (this.searchBox === "useragent") {
						this.notify(navigator.userAgent);
					}
					else {
						this.spin(true, "Searching...");
						checkDBLoaded(function (callback) {
							function displayResults(searchResults, errors, table) {
								if (errors) debug(errors, "search error");
								else if (searchResults) generateList(table, searchResults, null, function (list) {
									results = results.concat(list);
									n++;
									if (n === numOfSearches) {
										this.searchResults = results;
										if (results.length > 0) {
											this.searchResultsTitle = 'Results for "' + this.currentQuery + '"';
											this.searchResultsError = "";
										}
										else {
											wwManager({ cmd: "getLength", title: table }, function (l) {
												if (l > 0) this.searchResultsError = 'No results found for "' + this.currentQuery + '". Try searching for something else.';
												else this.searchResultsError = 'No data found';
											}.bind(this));
										}
										this.spin(false, "Searching...");
										if (results.length === 1 && results[0].type === "link") {
											this.seeDetails(results[0]);
											addToRecentlyViewed(results[0]);
										}
										else if (results.length === 2 && results[0].type === "jumplink") {
											this.seeDetails(results[1]);
											addToRecentlyViewed(results[1]);
										}
										else this.navigate("search", this.currentQuery);
										if (callback instanceof Function) return callback();
									}
								}.bind(this));
							}
							var find = optionalQuery ? optionalQuery : this.searchAutoComplete === "" ? this.searchBox : this.searchAutoComplete,
								results = [];
							find = trim(find);
							if (find) {
								this.currentQuery = find;
								this.resetSearch();
								this.hideSearchBar = true;
								setTimeout(function () { this.hideSearchBar = false; }.bind(this), 1000);
								this.showSearchBar = false;
								this.showSearchSuggestions = false;
								document.getElementById("app").focus();
								var numOfSearches = 0,
									n = 0;
								for (var t in dataTemplates) {
									if (dataTemplates.hasOwnProperty(t)) numOfSearches++;
								}
								for (let table in dataTemplates) {
									(function (self, table) {
										wwManager(
											{
												"cmd": "advancedSearch",
												"title": table,
												"args": [find, { colNames: searchableColumns, fuzzyMatch: true }]
											},
											function (success, errors) { displayResults.call(self, success, errors, table); }
										);
									})(this, table);
								}
							} else console.log("empty query field");
						}.bind(this));
					}
				}
			},
			cancelSearch: function () {
				this.toggle("showSearchBar");
				this.hideSearchBar = true;
				setTimeout(function () { this.hideSearchBar = false; }.bind(this), 200);
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
				}
			},
			searchInput: function (e) {
				function displaySuggestions(arr) {
					n++;
					suggestions = suggestions.concat(arr);
					if (n === numOfTables) {
						if (suggestions.length > 0) {
							this.searchAutoComplete = value.length < 21 && suggestions[0] ? suggestions[0] : "";
							this.searchSuggestions = suggestions;
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
							this.searchPointer = -1;
							this.searchSuggestions = [];
							this.searchAutoComplete = "";
						}
					}
				}
				var value = trim(e.target.value);
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
							if (dataTemplates.hasOwnProperty(t)) numOfTables++;
						}
						for (var table in dataTemplates) {
							wwManager({ "cmd": "getSearchSuggestions", "title": table, "args": [str, { colNames: searchableColumns }] }, displaySuggestions.bind(this));
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
				function movePointer() {
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
				}
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 8) {//backspace
					if (this.searchBox === "") {
						this.searchPointer = -1;
						this.searchSuggestions = [];
						this.searchAutoComplete = "";
					}
				}
				else if (keyCode === 9 || keyCode === 38 || keyCode === 40) { //tab, or up or down arrow
					movePointer.call(this);
				}
				else if (keyCode === 32) {//space key
					e.preventDefault();
					this.searchSuggestions = [];
					this.searchAutoComplete = "";
				}
				else {
					this.searchBox = this.searchBox.slice(-1) === " " ? trim(this.searchBox) + " " : trim(this.searchBox);
					if (keyCode === 13) {//enter key
						this.search();
					}
					else if (keyCode === 27) {//escape key
						this.cancelSearch();
					}
				}
			},
			searchKeyDown: function (e) {
				var keyCode = e.which || e.keyCode || 0;
				if (keyCode === 9 || keyCode === 13 || keyCode === 32 || keyCode === 38 || keyCode === 27 || keyCode === 40) {
					e.preventDefault();
				}
				if (keyCode === 32) {
					if (this.searchBox !== "" && this.searchBox.slice(-1) !== " ") {
						this.searchBox = this.searchSuggestions[0] ?
							this.searchPointer > -1 ?
								this.searchSuggestions[this.searchPointer] + " " :
								this.searchSuggestions[0] + " " :
							this.searchBox + " ";
					}
				}
			},
			seeDetails: function (obj) {
				getDetails(obj, function (detailsObj) {
					this.details = detailsObj;
					this.navigate("details", null, detailsObj);
				}.bind(this));
			},
			notify: function (msg, autoFade, callback) {
				function clearMsg() {
					this.notifyMsg = "";
					this.showNotify = false;
					if (callback instanceof Function) return callback();
				}
				//set timer between 1.5 - 5 seconds depending on the length of the message
				var timer = msg.length * 55;
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
					setTimeout(clearMsg.bind(this), timer);
				}
			},
			processConfirm: function (bool) {
				this.showConfirm = false;
				this.showUpdateKey = false;
				if (bool && this.confirmFunction instanceof Function) this.confirmFunction();
			},
			shakeConfirm: function () {
				this.confirmShake = true;
				setTimeout(function () { this.confirmShake = false; }.bind(this), 600);
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
						this.notify("Successfully linked to " + user.alias + "'s Dropbox account", true);
						this.dropboxUsername = user.alias;
						this.dropboxEmail = user.email;
						dbid = user.dbid;
						this.loggedIn = true;
						this.syncAll(null, { key: this.stoKey === "unknown" ? user.dbid ? Base64.hash(user.dbid) : Base64.hash(user.email) : this.stoKey });
						if (callback instanceof Function) callback(true);
					}
					function startScreen(error) {
						console.log(error);
						this.notify("Could not connect to Dropbox at the moment, please try again later", true);
						// TODO go back to app
						if (callback instanceof Function) callback(false);
					}
					if (!APP.Dbx || !APP.Dbx.login) APP.Dbx = APP.initiateDropbox(DROPBOX_CLIENT_ID, this.stoKey);
					APP.Dbx.login(null, welcome.bind(this), startScreen.bind(this));//TODO login password ui
				}
				this.notify("Connecting to Dropbox, please wait...", false, login.bind(this));
			},
			logout: function (callback) {
				function logout() {
					APP.Dbx.logout(function () {
						this.loggedIn = false;
						this.dropboxUsername = "";
						this.dropboxEmail = "";
						this.notify("", true);
						if (callback instanceof Function) return callback();
					}.bind(this));
				}
				if (APP.Dbx && APP.Dbx.isAuthenticated) this.notify("Disconnecting from Dropbox", false, logout.bind(this));
				else if (callback instanceof Function) return callback();
			},
			newStoKey: function () {
				var key = document.getElementById("stoKeyInput"),
					confirmKey = document.getElementById("stoKeyInputConfirm");
				checkDBLoaded(function (callback) {
					if (key.value === "") {
						this.stoKeyWarning = "Required";
					}
					else if (key.value.length < 8) {
						this.stoKeyWarning = "8 characters minimum";
					}
					else if (!(/[A-Z]/.test(key.value) && /\d/.test(key.value) && /[a-z]/.test(key.value) && /[^A-z0-9]/.test(key.value))){
						this.stoKeyWarning = "Uppercase, lowercase, digit and special character required";
					}
					else if (key.value === confirmKey.value) {
						this.stoKeyWarning = "";
						var oldKey = this.stoKey;
						if (dbid) {
							oldKey = oldKey !== "unknown" ? oldKey : Base64.hash(dbid);
							this.stoKey = Base64.hash(dbid + key.value);
						}
						else {//temp until depricate APP.User.id
							debug("error setting key", "error");
							console.log(oldKey, this.stoKey, dbid);
							//oldKey = oldKey !== "unknown" ? oldKey : Base64.hash(_this.dropboxEmail);
							//_this.stoKey = Base64.hash(_this.dropboxEmail + key.value);
						}
						this.storeState();
						this.syncAll(null, { oldKey: oldKey, key: this.stoKey, forceSync: true });
						this.showStoKeyInput = false;
						oldKey = null;
					}
					else {
						this.stoKeyWarning = "Passwords don't match";
					}
					if (callback instanceof Function) return callback();
				}.bind(this));
			},
			updateStoKey: function () {
				function storeKey(key, callback) {
					this.storeState(); //save cached state with new stoKey
					this.syncAll(null, { key: key, forceSync: true });
					if (callback instanceof Function) return callback();
				}
				this.showUpdateKey = true;
				confirm("Please input your current password", function () {
					checkDBLoaded(function (callback) {
						var key = document.getElementById("updateStoKeyInput");
						if (dbid) {
							this.stoKey = Base64.hash(dbid + key.value);
						}
						else debug("use of dropboxEmail as a key has been depricated", "error");//_this.stoKey = Base64.hash(_this.dropboxEmail + key.value);//temp until depricate APP.User.id
						return storeKey.call(this, this.stoKey, callback);
					}.bind(this));
				}.bind(this));
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
										this.notify('File Not Found!');
										break;
									case evt.target.error.NOT_READABLE_ERR:
										this.notify('File is not readable');
										break;
									case evt.target.error.ABORT_ERR:
										break; // noop
									default:
										this.notify('An error occurred reading this file.');
								}
							}.bind(this);
							reader.onload = function () {
								callback(reader.result, file);
							};
							if (readAs === "image") reader.readAsDataURL(file);
							else if (readAs === "text") reader.readAsText(file);
							else if (readAs === "array") reader.readAsArrayBuffer(file);
							else reader.readAsBinaryString(file);
							fileReaderInitiated[fileInputId] = true;
						}
						else this.notify("File type not supported! Expected " + fileExtension, false);
					}
					function notify() { this.notify("Loading file...", false, init.bind(this)); }
					function showError(e) { this.notify("Error loading file: " + e); }
					if (!fileReaderInitiated[fileInputId]) {
						if (window.File && window.FileReader && window.FileList && window.Blob) {
							fileInputElem.addEventListener('change', notify.bind(this), false);
							fileInputElem.addEventListener('error', showError.bind(this), false);
						}
						else this.notify('Failed to initiate the File Reader.', true);
					}
				}
				function init(cb) {
					if (fileExtension && /csv/i.test(fileExtension)) initFileReader.call(this, 'text', parseCSV.bind(this));
					else if (fileExtension && /vcf/i.test(fileExtension)) initFileReader.call(this, 'text', parseVCF.bind(this));
					else if (fileExtension && /json/i.test(fileExtension)) initFileReader.call(this, 'text', parseJSON.bind(this));
					else initFileReader.call(this, "binary", saveFile.bind(this));
					return cb();
				}
				function saveFile(source, details) {
					var contents = Base64.write(source, Base64.hash(this.stoKey)),
						displayName = details.name,
						extension = /(?:\.([^.]+))?$/.exec(details.name)[1] || "No file extension",
						name = details.name.split("."),
						type = details.type || extension,
						origSize = details.size || source.length,
						compSize = contents.length,
						compression = Math.round((1 - compSize / origSize) * 100) + "%",
						modified = details.lastModified || new Date().getTime(),
						owner = this.dropboxEmail || "unknown",
						hash = Base64.hash(Base64.hash(this.stoKey));
					name.pop();
					name = name.join(".");
					modified = typeof modified === "number" ? modified : new Date(modified).getTime();
					var ret = [displayName, name, extension, type, origSize, compSize, compression, new Date().getTime(), modified, owner, hash, contents];
					if (callback instanceof Function) return callback(ret);
					else return ret;
				}
				function parseCSV(source) {
					this.notify("Importing data...", false, function () {
						source = csv2json(source);
						source.lastModified = new Date().getTime();
						source.author = this.dropboxEmail || "unknown";
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
					}.bind(this));
				}
				function parseVCF(input) {
					debug(input, "parseVCF not done");
				}
				function parseJSON(input) {
					debug(input, "parseJSON not done");
				}
				function click(callback) {
					document.getElementById(fileInputId).click();
					if (callback instanceof Function) return callback();
				}
				checkDBLoaded(function (callback) {
					init.call(this, function () { click(callback); });
				}.bind(this));
			},
			/*options = {
				see nyckeldb.js NyckelDBObj.prototype.sync options
			}*/
			syncAll: function (event, options) {
				function sync(syncfile, cb) {
					function done(success, errors, obj, title, finalBool) {
						if (success && obj && obj.file) {
							syncfile = JSON.parse(obj.syncFile);
							APP.Dbx.save("/data/" + obj.title, obj.file, null, function () {
								wwManager({ "cmd": "setSyncCompleted", "title": title, "args": [syncfile] }, function (success, error) {
									if (!success) debug(error, title + " setSyncComplete error");
									else console.log("sync complete");
									if (finalBool) this.spin(false, "Synchronising with Dropbox");
								});
							}, function (error) {
								if (finalBool) this.spin(false, "Synchronising with Dropbox");
								debug(error, "save file to Dropbox error");
							});
						}
						else {
							if (finalBool) this.spin(false, "Synchronising with Dropbox");
							if (!obj && errors) {
								if (err) return;
								err = true;//break until error fixed and try again
								if (/unsupported version/.test(errors)) {
									this.notify("File found was written with a newer version of the app. Please update your app to the latest version.");
								}
								else if (/rate limited, try again in /.test(errors)) {
									console.log(errors);
									var time = parseFloat(errors.replace("rate limited, try again in ", ""));
									setTimeout(function () { this.syncAll(null, options); }, time * 6e4);
								}
								else {
									switch (errors) {
										case "wrong key used":
											this.updateStoKey();
											break;
										case "try again later":
											this.notify("Wrong password used. Please try again later", true);
											break;
										default:
											this.notify("Unknown error");
											debug(errors, "sync errors");
									}
								}
							}
							else debug("no json returned to upload to dropbox");
						}
						syncfileNeedsUpdated = !syncfile || !syncfile[title] || obj ? true : syncfileNeedsUpdated;
						if (b === count) return cb(obj && obj.syncFile || JSON.stringify(syncfile));
						else b++;
					}
					function readFile(title, json, error, b) {
						if (json === false && error !== undefined) {
							if(b === count) this.spin(false, "Synchronising with Dropbox");
							if (error === "" || error === "data not found" || error.match(/^path\/not_found/)) {
								console.log(error, "offline");
								options.forceSync = true;
							}
							else {
								debug(error, "couldn't sync " + title);
								this.notify("Sync did not complete successfully");
								return;
							}
						}
						console.log("syncing...", json, options);
						wwManager({ "cmd": "sync", "title": title, "args": [json, options] }, function (success, errors, obj) {
							console.log("sunk", success, errors, obj);
							done.call(this, success, errors, obj, title, b === count);
						}.bind(this));						
					}
					function download(title, b) {
						APP.Dbx.open("/data/" + title, null, function (json, error) {
							readFile.call(this, title, json, error, b);
						}.bind(this));
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
							(function(self, table) {
								wwManager({ "cmd": "isSyncPending", "title": table, "args": [syncfile] }, function (requiresSync, errors) {
									if (!errors) {
										if (requiresSync === true) {
											download.call(self, table, b);
										}
										else if (a === count) return b++, cb(syncfile);
										else b++;
										a++;
									}
									else {
										self.spin(false, "Synchronising with Dropbox");
										debug(errors, "problem syncing " + table);
										self.notify("Sync did not complete successfully");
									}
								});
							})(this, table);
						}
					}
				}
				function saveSyncfile(syncfile) {
					function failed() {
						this.notify("Sync did not complete successfully");
						this.spin(false, "Synchronising with Dropbox");
					}
					function success() {
						this.spin(false, "Synchronising with Dropbox");
					}
					if (syncfileNeedsUpdated) {
						APP.Dbx.save("/sync/lastSync", syncfile, null, success.bind(this), failed.bind(this));
					}
					else return success.call(this);
				}
				function readSyncfile(syncfile, error) {
					if (error === undefined || error === "data not found" || error.match(/^path\/not_found/)) {
						if (syncfile) {
							syncfile = JSON.parse(syncfile);
						}
						else console.log("no syncfile found " + error);
						sync.call(this, syncfile, saveSyncfile.bind(this));
					}
					else {
						if (error === "") console.log("Sync failed, you are offline");
						else this.notify("Unhandled sync error: " + error);
						this.spin(false, "Synchronising with Dropbox");
					}
				}
				var err = false,
					count = 0,
					syncfileNeedsUpdated = false;
				if (!(APP.Dbx && APP.Dbx.isAuthenticated)) return console.log("cannot sync to Dropbox now");
				checkDBLoaded(function (callback) {
					options = options || {};
					options.initialKey = dbid ? Base64.hash(dbid) : /*this.dropboxEmail ? Base64.hash(this.dropboxEmail) :*/ null;
					options.key = options.key ? options.key : this.stoKey === "unknown" ? options.initialKey : this.stoKey;
					this.spin(true, "Synchronising with Dropbox");
					APP.Dbx.open("/sync/lastSync", null, readSyncfile.bind(this));
					if (callback instanceof Function) return callback();
				}.bind(this));
			},
			setAccentColor: setAccentColor,
			resetSettings: function () {
				function loadApp() {
					loadDB = true;
					loadDBQueue = [];
					loadingDB = false;
					startApp();
				}
				document.getElementById("loading").className = "";
				state = freshStateObj();
				state.cookieAgree = true;
				for (let s in state) {
					if (this[s]) this[s] = state[s];
				}
				this.storeState();
				if (cordova || Windows && WinJS) {
					wwManager({ "cmd": "stop" }, function () {
						setTimeout(function () {
							webWorker = new Worker("scripts/webworker.js");
							webWorker.addEventListener('message', wwReadMessage, false);
							webWorker.addEventListener('error', wwOnError, false);
							appData = {};
							backstack = [];
							backIndex = 0;
							setTimeout(loadApp, 1000);
						}, 1000);
					});
				}
				else if (window.location) {
					setTimeout(function () {
						var loc = window.location;
						window.location.href = [loc.protocol, '//', loc.host, loc.pathname].join('');
					}, 2000);
				}
			},
			wipeApp: function () {
				var msg = this.loggedIn ? "sign the app out of Dropbox, clear all locally saved app data (not including what is saved in Dropbox) " : "clear all app data ";
				msg = "This will " + msg + "and restore default settings";
				confirm("Are you sure you want to reset the app?", function reset() {
					APP.Sto.nuke();
					this.logout(this.resetSettings);
				}.bind(this), {ok:"Reset App", details: msg});
			},
			wipeDropbox: function () {
				function onComplete(response, errors) {
					console.log(response, errors);
				}
				var msg = "Do this if you are having synchronisation issues.This will not effect your locally saved app data, which can be restored to Dropbox";
				msg += " afterwards by clicking 'SYNC NOW' in Settings";
				confirm("Are you sure that you want to delete all of this app's data saved in your Dropbox account?", function () {
					APP.Dbx.delete("/sync", onComplete);
					APP.Dbx.delete("/data", onComplete);
				},{ ok:"Reset App Cloud Data", details: msg });
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
		var onVisibilityChanged = function (/*args*/) {
			if (!document.hidden) {
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
		winApp.oncheckpoint = function (/*args*/) {
			app.storeState();
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
	else startApp();//and... GO!
})();