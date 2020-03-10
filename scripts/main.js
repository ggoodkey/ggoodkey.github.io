"use strict";
//external dependencies
// vue.min.js vue-router.min.js debugmode.min.js base64.min.js dropbox.min.js Lawnchair.js adapters/dom.js adapters/indexed-db.js
// storage.js validate.min.js nyckelDB.min.js ./cordova.js common.min.js winjs/base.min.js lists.min.js
/*global WinJS, Sto, NyckelDB, cordova, initiateDropbox, Vue */
"use strict";
var Windows, Dbx, APP = APP || {}, COM, VueRouter, VAL, Base64; //dependancies
(function () {
    APP.setDebugMode(false); //TODO set to false
    APP.setDebugToConsole(true); //set to true to use the debugger during development, or type "debugmode" into the searchbar to activate debugmode
    var appData = {};
    var debug = APP.debug, DROPBOX_CLIENT_ID = "jk6tb5tp76hs2tx", //get new client id from https://www.dropbox.com/developers
    APP_VERSION = "0.6.0 beta", //increment on major (esp breaking) changes, to force localStorage app state to refresh on load
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
    }, startView = "recent", //set the view (from views listed above) to start at by default		
    contactsTemplateIMServiceOptions = {
        listInput: ["WhatsApp", "Viber", "Facebook Messenger", "WeChat", "QQ Mobile", "Line", "Skype", "Snapchat",
            "Twitter", "Telegram", "Google Talk", "KakaoTalk", "Kik Messenger", "Tango", "Yahoo", "AIM", "MSN",
            "Nimbuzz", "Hike", "Jabber", "ICQ", "MessageMe"],
        textInput: true
    }, contactsTemplateIMLabelOptions = {
        listInput: ["Personal", "Work", "Other"],
        textInput: true
    }, 
    //add, remove or edit NyckelDB dataTemplates to suit your app needs. Examples below for contacts, files and groups NyckelDB databases
    dataTemplates = {
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
                    },
                    "icon": {
                        initialValue: "icon-user",
                        type: "string"
                    },
                    "iconColor": {
                        initialValue: "#0078d7",
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
                    "Website6_Type", "Website7_Type", "Website8_Type", "Website9_Type", "Website10_Type"]
            },
            display: {
                listView: {
                    text: ["FamilyName", "GivenName"],
                    joiner: ", ",
                    sortBy: "FamilyName"
                },
                heading: {
                    image: "Photo",
                    title: "Name",
                    subtitle: {
                        text: ["Organization1_Name", "Organization1_Title", "Organization1_Department"],
                        joiner: ", "
                    }
                },
                detailsView: [
                    { column: "Photo", hidden: true, readonly: true },
                    {
                        groupHeading: "Name",
                        group: ["NamePrefix", "GivenName", "AdditionalName", "FamilyName", "NameSuffix"],
                        hidden: true
                    },
                    {
                        groupHeading: "Additional Name Information",
                        group: ["Initials", "Nickname", "ShortName", "MaidenName",
                            "YomiName", "GivenNameYomi", "AdditionalNameYomi", "FamilyNameYomi"],
                        hidden: true,
                        readonly: true
                    },
                    {
                        groupHeading: "Organization",
                        group: [
                            {
                                column: "Organization1_Name",
                                label: {
                                    column: "Organization1_Type",
                                    dropdownList: {
                                        listInput: ["Company", "Other"],
                                        textInput: true
                                    }
                                }
                            },
                            { column: "Organization1_YomiName", readonly: true },
                            { column: "Organization1_Title", readonly: true },
                            { column: "Organization1_Department", readonly: true },
                            { column: "Organization1_Symbol", readonly: true },
                            { column: "Organization1_Location", readonly: true },
                            { column: "Organization1_JobDescription", readonly: true }
                        ],
                        hidden: true
                    },
                    { column: "GroupMembership", hidden: true, readonly: true },
                    {
                        groupHeading: "Events",
                        collapse: true,
                        group: [
                            "Birthday",
                            { column: "Event1_Value", label: { column: "Event1_Type" } },
                            { column: "Event2_Value", label: { column: "Event2_Type" } },
                            { column: "Event3_Value", label: { column: "Event3_Type" } },
                            { column: "Event4_Value", label: { column: "Event4_Type" } },
                            { column: "Event5_Value", label: { column: "Event5_Type" } },
                            { column: "Event6_Value", label: { column: "Event6_Type" } },
                            { column: "Event7_Value", label: { column: "Event7_Type" } },
                            { column: "Event8_Value", label: { column: "Event8_Type" } },
                            { column: "Event9_Value", label: { column: "Event9_Type" } },
                            { column: "Event10_Value", label: { column: "Event10_Type" } }
                        ],
                        splitter: " ::: ",
                        label: {
                            dropdownList: {
                                listInput: ["Anniversary", "Other"],
                                textInput: true
                            }
                        }
                    },
                    {
                        groupHeading: "E-mail Addresses",
                        collapse: true,
                        group: [
                            { column: "E_mail1_Value", label: { column: "E_mail1_Type" } },
                            { column: "E_mail2_Value", label: { column: "E_mail2_Type" } },
                            { column: "E_mail3_Value", label: { column: "E_mail3_Type" } },
                            { column: "E_mail4_Value", label: { column: "E_mail4_Type" } },
                            { column: "E_mail5_Value", label: { column: "E_mail5_Type" } },
                            { column: "E_mail6_Value", label: { column: "E_mail6_Type" } },
                            { column: "E_mail7_Value", label: { column: "E_mail7_Type" } },
                            { column: "E_mail8_Value", label: { column: "E_mail8_Type" } },
                            { column: "E_mail9_Value", label: { column: "E_mail9_Type" } },
                            { column: "E_mail10_Value", label: { column: "E_mail10_Type" } }
                        ],
                        splitter: " ::: ",
                        label: {
                            dropdownList: {
                                listInput: ["Personal Email", "Work Email", "Other Email"],
                                textInput: true
                            }
                        }
                    },
                    {
                        groupHeading: "Phone Numbers",
                        collapse: true,
                        group: [
                            { column: "Phone1_Value", label: { column: "Phone1_Type" } },
                            { column: "Phone2_Value", label: { column: "Phone2_Type" } },
                            { column: "Phone3_Value", label: { column: "Phone3_Type" } },
                            { column: "Phone4_Value", label: { column: "Phone4_Type" } },
                            { column: "Phone5_Value", label: { column: "Phone5_Type" } },
                            { column: "Phone6_Value", label: { column: "Phone6_Type" } },
                            { column: "Phone7_Value", label: { column: "Phone7_Type" } },
                            { column: "Phone8_Value", label: { column: "Phone8_Type" } },
                            { column: "Phone9_Value", label: { column: "Phone9_Type" } },
                            { column: "Phone10_Value", label: { column: "Phone10_Type" } }
                        ],
                        splitter: " ::: ",
                        label: {
                            dropdownList: {
                                listInput: ["Mobile Phone", "Home Phone", "Work Phone", "Company Phone",
                                    "Other Phone", "Main Phone", "Pager", "Home Fax", "Work Fax"],
                                textInput: true
                            }
                        }
                    },
                    //IM
                    {
                        groupHeading: "Instant Messaging",
                        collapse: 2,
                        group: [
                            { column: "IM1_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM1_Value", label: { column: "IM1_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM2_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM2_Value", label: { column: "IM2_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM3_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM3_Value", label: { column: "IM3_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM4_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM4_Value", label: { column: "IM4_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM5_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM5_Value", label: { column: "IM5_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM6_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM6_Value", label: { column: "IM6_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM7_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM7_Value", label: { column: "IM7_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM8_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM8_Value", label: { column: "IM8_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM9_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM9_Value", label: { column: "IM9_Type", dropdownList: contactsTemplateIMLabelOptions } },
                            { column: "IM10_Service", dropdownList: contactsTemplateIMServiceOptions },
                            { column: "IM10_Value", label: { column: "IM10_Type", dropdownList: contactsTemplateIMLabelOptions } }
                        ],
                        splitter: " ::: ",
                        hidden: true,
                        readonly: true
                    }, {
                        groupHeading: "Addresses",
                        group: [
                            { column: "Address1_Formatted", label: { column: "Address1_Type" } },
                            { column: "Address2_Formatted", label: { column: "Address2_Type" } }
                        ],
                        readonly: true
                    },
                    {
                        groupHeading: "Address 1",
                        group: [
                            {
                                column: "Address1_Type",
                                dropdownList: {
                                    listInput: ["Home Address", "Work Address", "Mail Address", "Other Address"],
                                    textInput: true
                                }
                            },
                            "Address1_Street",
                            "Address1_City",
                            "Address1_POBox",
                            "Address1_Region",
                            "Address1_PostalCode",
                            "Address1_Country",
                            "Address1_ExtendedAddress"
                        ],
                        hidden: true
                    },
                    {
                        groupHeading: "Address 2",
                        group: [
                            {
                                column: "Address2_Type",
                                dropdownList: {
                                    listInput: ["Home Address", "Work Address", "Mail Address", "Other Address"],
                                    textInput: true
                                }
                            },
                            "Address2_Street",
                            "Address2_City",
                            "Address2_POBox",
                            "Address2_Region",
                            "Address2_PostalCode",
                            "Address2_Country",
                            "Address2_ExtendedAddress"
                        ],
                        hidden: true
                    },
                    {
                        groupHeading: "Family and Relationships",
                        collapse: true,
                        group: [
                            { column: "Relation1_Value", label: { column: "Relation1_Type" } },
                            { column: "Relation2_Value", label: { column: "Relation2_Type" } },
                            { column: "Relation3_Value", label: { column: "Relation3_Type" } },
                            { column: "Relation4_Value", label: { column: "Relation4_Type" } },
                            { column: "Relation5_Value", label: { column: "Relation5_Type" } },
                            { column: "Relation6_Value", label: { column: "Relation6_Type" } },
                            { column: "Relation7_Value", label: { column: "Relation7_Type" } },
                            { column: "Relation8_Value", label: { column: "Relation8_Type" } },
                            { column: "Relation9_Value", label: { column: "Relation9_Type" } },
                            { column: "Relation10_Value", label: { column: "Relation10_Type" } }
                        ],
                        splitter: " ::: ",
                        label: {
                            dropdownList: {
                                listInput: ["Spouse", "Child", "Mother", "Father", "Parent", "Brother", "Sister", "Friend", "Relative",
                                    "Manager", "Assistant", "Partner", "Coworker", "Reference", "Significant Other", "Other Relationship"],
                                textInput: false
                            }
                        }
                    },
                    {
                        groupHeading: "Websites",
                        collapse: true,
                        group: [
                            { column: "Website1_Value", label: { column: "Website1_Type" } },
                            { column: "Website2_Value", label: { column: "Website2_Type" } },
                            { column: "Website3_Value", label: { column: "Website3_Type" } },
                            { column: "Website4_Value", label: { column: "Website4_Type" } },
                            { column: "Website5_Value", label: { column: "Website5_Type" } },
                            { column: "Website6_Value", label: { column: "Website6_Type" } },
                            { column: "Website7_Value", label: { column: "Website7_Type" } },
                            { column: "Website8_Value", label: { column: "Website8_Type" } },
                            { column: "Website9_Value", label: { column: "Website9_Type" } },
                            { column: "Website10_Value", label: { column: "Website10_Type" } }
                        ],
                        splitter: " ::: ",
                        label: {
                            dropdownList: {
                                listInput: ["Profile", "Blog", "Google Maps", "Home Page", "Work Website"],
                                textInput: true
                            }
                        }
                    },
                    {
                        groupHeading: "Other Information",
                        group: ["Gender", "Location", "BillingInformation", "DirectoryServer", "Mileage", "Occupation", "Hobby", "Sensitivity",
                            "Priority", "Subject", "Language"],
                        hidden: true,
                        readonly: true
                    },
                    {
                        groupHeading: "Custom Fields",
                        collapse: 2,
                        group: [
                            "CustomField1_Type", { column: "CustomField1_Value", label: { column: "CustomField1_Type" } },
                            "CustomField2_Type", { column: "CustomField2_Value", label: { column: "CustomField2_Type" } },
                            "CustomField3_Type", { column: "CustomField3_Value", label: { column: "CustomField3_Type" } },
                            "CustomField4_Type", { column: "CustomField4_Value", label: { column: "CustomField4_Type" } },
                            "CustomField5_Type", { column: "CustomField5_Value", label: { column: "CustomField5_Type" } },
                            "CustomField6_Type", { column: "CustomField6_Value", label: { column: "CustomField6_Type" } },
                            "CustomField7_Type", { column: "CustomField7_Value", label: { column: "CustomField7_Type" } },
                            "CustomField8_Type", { column: "CustomField8_Value", label: { column: "CustomField8_Type" } },
                            "CustomField9_Type", { column: "CustomField9_Value", label: { column: "CustomField9_Type" } },
                            "CustomField10_Type", { column: "CustomField10_Value", label: { column: "CustomField10_Type" } }
                        ],
                        splitter: " ::: ",
                        hidden: true,
                        readonly: true
                    },
                    {
                        groupHeading: "Notes",
                        collapse: false,
                        group: ["Notes"]
                    }
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
                    "icon": {
                        initialValue: "icon-folder-open",
                        type: "string"
                    },
                    "iconColor": {
                        initialValue: "#d13438",
                        type: "string"
                    }
                },
                doNotIndex: ["Display Name", "Extension", "Type", "Original Size", "Compression", "Compressed Size", "Created", "Modified", "Hash", "Compressed Contents"],
                initialIndex: ["Name"]
            },
            display: {
                listView: {
                    text: ["Display Name"]
                },
                heading: {
                    title: "Display Name"
                },
                detailsView: [
                    { column: "Display Name", hidden: true },
                    { column: "Extension", readonly: true },
                    { column: "Type", readonly: true },
                    { column: "Original Size", readonly: true },
                    { column: "Compressed Size", readonly: true },
                    { column: "Compression", readonly: true },
                    { column: "Created", readonly: true },
                    { column: "Modified", readonly: true },
                    { column: "Hash", readonly: true, hidden: true },
                    { column: "Compressed Contents", hidden: true, readonly: true }
                ]
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
                    "icon": {
                        initialValue: "",
                        type: "string"
                    },
                    "iconColor": {
                        initialValue: "",
                        type: "string"
                    }
                },
                doNotIndex: ["groupIds", "searchTerms", "excludeIds"],
                initialIndex: ["groupName"]
            },
            display: {
                listView: {
                    text: ["groupName"]
                },
                heading: { title: "groupName" },
                detailsView: []
            }
        }
    }, 
    //set default searchable columns from dataTemplates above
    searchableColumns = ["Name", "Owner", "Site", "Username", "Alias", "GivenName", "AdditionalName", "FamilyName", "Nickname", "ShortName", "MaidenName",
        "Phone1_Value", "Phone2_Value", "Phone3_Value", "Phone4_Value", "Phone5_Value", "Phone6_Value", "Phone7_Value", "Phone8_Value", "Phone9_Value", "Phone10_Value",
        "E_mail1_Value", "E_mail2_Value", "E_mail3_Value", "E_mail4_Value", "E_mail5_Value", "E_mail6_Value", "E_mail7_Value", "Address1_City", "Address2_City",
        "Address1_Region", "Address2_Region", "Organization1_Name", "Organization1_Title", "Organization1_Department", "groupName"], freshStateObj = function () {
        return {
            cookieAgree: false,
            version: APP_VERSION,
            //platform
            windows: false,
            //navigation
            views: views,
            backArrow: false,
            currentView: views[startView],
            indicatorRight: -116,
            indicatorWidth: 0,
            indicatorTop: 53,
            showSearchBar: false,
            hideSearchBar: false,
            showSearchSuggestions: false,
            showSideNav: false,
            showSettings: false,
            //page animations
            transitionName: "forward",
            //Spinner
            spinner: false,
            spinnerMsg: ["Working..."],
            spinIndex: 0,
            //confirm dialog box
            showConfirm: false,
            confirmMsg: "Are you sure?",
            confirmDetails: "",
            confirmOK: "OK",
            confirmCancel: "Cancel",
            confirmFunction: function () { },
            confirmShake: false,
            //notify dialog box
            showNotify: false,
            notifyActivated: 0,
            notifyMsg: "Notification",
            //settings
            dropboxUsername: "",
            dropboxEmail: "",
            loggedIn: false,
            stoKey: "unknown",
            showStoKeyInput: false,
            stoKeyWarning: "",
            showUpdateKey: false,
            //theme
            darkTheme: false,
            useSystemTheme: true,
            systemDarkTheme: false,
            accentColor: "#478cdb",
            //search
            searchBox: "",
            searchAutoComplete: "",
            searchSuggestions: [],
            searchPointer: -1,
            searchResults: [],
            searchResultsTitle: "Search Results",
            searchResultsError: "Nothing here yet... try searching for something.",
            currentQuery: "",
            //details view
            details: {
                id: "",
                table: "",
                data: [{
                        column: "",
                        orig: "",
                        text: [],
                        type: "any"
                    }],
                image: "",
                title: "",
                subtitle: "null"
            },
            recentlyViewed: [],
            //groups
            addItemToGroupDropdown: false,
            groupDropdown: false,
            groupSearchBox: "",
            groups: [],
            showNewGroupUI: false,
            activeGroup: []
        };
    }, localTestingMode = function () {
        var loc = window.location;
        if (!loc || /^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://")
            return true;
        else
            return false;
    }();
    function trim(str) {
        str = String(str);
        while (/\s\s/g.test(str))
            str = str.replace(/\s\s/g, " ");
        if (str === " ")
            return "";
        return str.replace(/^\s+|\s+$/gm, "");
    }
    if (localTestingMode)
        APP.setDebugMode(true);
    var backstack = [], backIndex = 0, state = freshStateObj(), dbid = null, refreshResponsiveLayout = function () {
        var width = COM.getWidth(), height = COM.getHeight(), type = "tabl", orientation = " port ", theme = "", htmlTag = document.getElementsByTagName("html")[0];
        if (width > 1280)
            type = "desk";
        else if (width <= 640)
            type = "phon";
        if (height < width && width > 640)
            orientation = " land ";
        if (app.useSystemTheme && app.systemDarkTheme || app.useSystemTheme === false && app.darkTheme)
            theme = "dark ";
        htmlTag.className = trim(type + orientation + theme + htmlTag.className.replace(/desk|tabl|phon|port|land|dark/g, ""));
    }, setNavLinkIndicatorPosition = function (location) {
        location = location ? location.replace(/\//, "") : startView;
        if (app.views[location] && app.views[location].level === 1) { //show indicator and move to correct position
            var sidenavlink = document.getElementById("sidenavlink_" + location), topnavlink = document.getElementById("topnavlink_" + location), views = document.getElementById("topnav-container");
            if (views) {
                var viewsBox = views.getBoundingClientRect(), viewsWidth = viewsBox.right - viewsBox.left, extra = app.showSearchBar ? viewsWidth + 393 : viewsWidth + 113; //width of navbar buttons + searchbar (320) + search and menu buttons (110)
                if (sidenavlink)
                    app.indicatorTop = sidenavlink.getBoundingClientRect().top - 54;
                if (topnavlink) {
                    var box = topnavlink.getBoundingClientRect();
                    app.indicatorWidth = box.right - box.left;
                    app.indicatorRight = COM.getWidth() - box.left - extra;
                }
            }
        }
        else { //hide indicator
            app.indicatorRight = app.indicatorRight - app.indicatorWidth * 0.66;
            app.indicatorWidth = 0;
        }
    };
    //web worker manager (wwManager) handles access to NyckelDB and Base64 web worker queue
    //and offline senarios where web workers are not available
    var webWorker, wwCallbackQueue = [], wwCallbackIndex = 0;
    /*obj{
     * "cmd": "read" "parseCSV" "merge" etc,
     * "args": [Array of arguments accepted by the cmd]
     * "title": if accessing a NyckelDB database
     * }
     */
    function wwManager(inputObj, callback, finalCallback) {
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
            obj.len = JSON.stringify(obj).length;
            obj.time = new Date().getTime();
            var arrBuffer = str2ab(JSON.stringify(obj));
            webWorker.postMessage(arrBuffer, [arrBuffer]);
            obj = null;
        }
        function noWebWorker() {
            function applyCallback(callback) {
                var hasCallback = ["addColumn", "advancedSearch", "deleteColumn", "deleteTable", "getHeaders", "getRow", "getRowTemplate", "getSearchSuggestions", "getVals",
                    "importJSON", "isSyncPending", "NUKEALL", "renameColumn", "search", "setSyncCompleted", "setTitle", "setType", "setVal", "setVals", "sortByCol", "sync", "validate"];
                if (hasCallback.indexOf(obj.cmd) > -1)
                    return appData[title][obj.cmd].apply(appData[title], obj.args);
                else
                    return callback(appData[title][obj.cmd].apply(appData[title], obj.args));
            }
            if (obj.args && callback)
                obj.args.push(callback);
            else if (callback)
                obj.args = [callback];
            if (obj.title && obj.cmd) {
                var title = VAL.toPropName(obj.title);
                if (obj.cmd === "initNewNyckelDB") {
                    if (obj.args && obj.args.length >= 2) {
                        appData[title] = new NyckelDB(obj.args[0]);
                        appData[title].init(obj.args[1], obj.args[2], obj.args[3], callback);
                    }
                    else
                        debug("NyckelDB not initialised with correct arguments");
                }
                else if (!appData[title]) {
                    debug(obj.args, "couldn't complete '" + obj.cmd + "' because '" + obj.title + "' database has not been successfully initialized");
                    return null;
                }
                else if (!appData[title][obj.cmd]) {
                    debug(obj.cmd, "invalid command called on " + obj.title);
                    return null;
                }
                else if (obj.cmd === "forEachCol" || obj.cmd === "forEachRow")
                    appData[title][obj.cmd](callback, finalCallback);
                else if (callback)
                    return applyCallback(callback);
                else
                    return appData[title][obj.cmd].apply(appData[title], obj.args);
            }
            else if (obj.cmd) {
                //debug(obj.cmd, "cmd");
                Base64[obj.cmd].apply(null, obj.args);
            }
        }
        var obj = inputObj;
        if (!!Worker && !localTestingMode)
            startWorker();
        else
            noWebWorker();
    }
    function wwReadMessage(e) {
        function ab2str(buffer) {
            var bufView = new Uint16Array(buffer), length = bufView.length, result = '', addition = Math.pow(2, 15); //max value in Edge before throwing error
            for (var i = 0; i < length; i += addition) {
                if (i + addition > length) {
                    addition = length - i;
                }
                result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
            }
            return result;
        }
        var str = ab2str(e.data);
        var data = JSON.parse(str);
        switch (data.type) {
            case "debug":
                data.description = "web worker: " + (data.description || "");
                debug(data.message, data.description);
                break;
            case "notify":
                app.notify(data.message, data.fadeOut);
                break;
            case "forEach":
                if (data.callbackIndex)
                    wwCallbackQueue[data.callbackIndex](data.message, data.progress, data.total);
                else
                    debug(data.message, "no forEach callback found");
                break;
            case "result":
                console.log((new Date().getTime() - Number(data.time)) / 1000 + "s", "to get result", data.cmd, data.len);
                if (data.callbackIndex) {
                    if (data.args)
                        wwCallbackQueue[data.callbackIndex].apply(null, JSON.parse(data.args));
                    else
                        wwCallbackQueue[data.callbackIndex](data.message);
                }
                else {
                    debug(data.message, "no result callback found");
                    return data.message;
                }
                break;
            case "finished":
                if (data.finalCallbackIndex) {
                    if (data.args)
                        wwCallbackQueue[data.finalCallbackIndex].apply(null, JSON.parse(data.args));
                    else
                        wwCallbackQueue[data.finalCallbackIndex](data.message);
                }
                else
                    debug(data.message, "finished but no callback found");
                break;
            /*	case "setItem":
                case "deleteItem":
                    Sto[data.type].apply(null, data.args);
                    break;
                case "getItem":
                    Sto.getItem(data.args[0], data.args[1], function (value, error) {
                        if (data.callbackIndex !== false) wwManager({ "cmd": "getItemCallback", "message": value, "error": error, "callbackIndex": data.callbackIndex });
                    }, function () {
                        if (data.doesntExistCallbackIndex !== false) wwManager({ "cmd": "getItemDoesntExistCallback", "doesntExistCallbackIndex": data.doesntExistCallbackIndex });
                    });
                    break;
            */ case "progress":
            case "confirm":
            default: //other types of data
                debug(data.type, "webworker response type not supported");
        }
    }
    function wwOnError(e) {
        debug(e.message, "Web Worker error: " + e.filename + ': ' + e.lineno);
    }
    function defaultErrorHandler(success, errors) {
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
    }
    //initialise the application
    function startApp(resumeBool) {
        function doneLoadingApp() {
            setTimeout(function () {
                setNavLinkIndicatorPosition(app.currentView.path);
                /* eslint-disable-next-line no-extra-parens */
                document.getElementById("loading").className = "done"; //app is rendered so fade in from black
            }, 150);
            checkDBLoaded(function (nextInQueue) {
                app.syncAll(); //adds this to the queue to run after DB is loaded, or run immediately if it is loaded
                if (nextInQueue instanceof Function)
                    return nextInQueue();
            });
            if (!cordova && !app.cookieAgree) {
                app.notify("By continuing to use this site, you agree to the use of first party, non-tracking cookies for personalised content", false);
                app.cookieAgree = true;
                app.storeState();
            }
        }
        function setupUI(callback) {
            app.updateCurrentView();
            matchSystemTheme();
            setAccentColor(app.accentColor);
            refreshResponsiveLayout();
            return callback();
        }
        function tryDropbox(cachedStoKey) {
            function applyUser(user) {
                if (user) {
                    app.dropboxUsername = user.alias;
                    app.dropboxEmail = user.email;
                    app.loggedIn = true;
                    dbid = user.dbid;
                }
                setupUI(doneLoadingApp);
            }
            Dbx = initiateDropbox(DROPBOX_CLIENT_ID, cachedStoKey, applyUser);
        }
        function getLocalState() {
            Sto.getItem("state", null, function (appStateObj, error) {
                if (appStateObj) {
                    if (typeof appStateObj === "string" && JSON.parse)
                        appStateObj = JSON.parse(appStateObj);
                    if (appStateObj.version === app.version) {
                        for (var prop in state) {
                            if (prop === "recentlyViewed" && app[prop].length > 0)
                                continue; //don't overwrite
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
                        var migrate = "darkTheme accentColor cookieAgree".split(" ");
                        for (var x = 0, xLen = migrate.length; x < xLen; x++) {
                            if (appStateObj[migrate[x]] !== undefined) {
                                app[migrate[x]] = appStateObj[migrate[x]];
                            }
                        }
                        Sto.deleteItem("state");
                        setupUI(doneLoadingApp);
                    }
                }
                else if (error) {
                    debug(error, "error getting app state");
                    setupUI(doneLoadingApp);
                }
                else {
                    Sto.deleteItem("state");
                    setupUI(doneLoadingApp);
                }
            }, function () { setupUI(doneLoadingApp); });
        }
        checkDBLoaded(function (nextInQueue) {
            if (nextInQueue instanceof Function)
                return nextInQueue();
        });
        getLocalState();
    }
    /*colorLuminance
    * @craigbuckler
    * https://www.sitepoint.com/javascript-generate-lighter-darker-color/
    * hex #CCC or #123abc, with or without #
    * lum decimal b/t -1 and 1. 0.2 (20% lighter) -0.5 (50% darker)
    */
    var colorLuminance = function (hex, lum, returnRGB) {
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
            c = Math.round(Math.min(Math.max(black, c + lum * white), white));
            rgbColor[i] = c;
            c = c.toString(16);
            hexColor += ("00" + c).substr(c.length);
        }
        return returnRGB ? rgbColor.join(", ") : hexColor;
    }, updateCSSColor = function (rgbColor, replaceColor) {
        var styleSheets = document.styleSheets;
        try {
            for (var a = 0, lenA = styleSheets.length, b, lenB, c, lenC, rules, rule, styles; a < lenA; a++) {
                /* eslint-disable-next-line no-extra-parens */
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
            //	console.log(error);
            return false;
        }
    }, setAccentColor = function (hex) {
        if (!hex)
            return false;
        var colors = [
            colorLuminance(hex, 0, true),
            colorLuminance(hex, -0.1, true),
            colorLuminance(hex, -0.2, true),
            colorLuminance(hex, -0.3, true),
            colorLuminance(hex, 0.1, true),
            colorLuminance(hex, 0.2, true),
            colorLuminance(hex, 0.3, true)
        ], oldColorString = [
            new RegExp(windowsAccentColor[0] || "71, 140, 219", "g"),
            new RegExp(windowsAccentColor[1] || "49, 126, 214", "g"),
            new RegExp(windowsAccentColor[2] || "41, 114, 197", "g"),
            new RegExp(windowsAccentColor[3] || "38, 97, 164", "g"),
            new RegExp(windowsAccentColor[4] || "84, 152, 231", "g"),
            new RegExp(windowsAccentColor[5] || "112, 166, 228", "g"),
            new RegExp(windowsAccentColor[6] || "153, 185, 223", "g")
        ], metaThemeColor = document.querySelector("meta[name=theme-color]"), appleThemeColor = document.querySelector("meta[name=apple-mobile-web-app-status-bar-style]"), windowsThemeColor = document.querySelector("meta[name=msapplication-navbutton-color]"), success = false;
        if (metaThemeColor)
            metaThemeColor.setAttribute("content", hex);
        if (appleThemeColor)
            appleThemeColor.setAttribute("content", hex);
        if (windowsThemeColor)
            windowsThemeColor.setAttribute("content", hex);
        windowsAccentColor = colors;
        app.accentColor = hex;
        app.storeState();
        for (var a = 0, len = colors.length; a < len; a++) {
            success = updateCSSColor(colors[a], oldColorString[a]);
        }
        return success;
    }, 
    //Windows specific functions
    windowsAccentColor = [false, false, false, false, false, false, false], matchSystemTheme = function () {
        function updateWindowsUI() {
            if (backgroundColor.r === 0 && backgroundColor.g === 0 && backgroundColor.b === 0)
                app.systemDarkTheme = true;
            else
                app.systemDarkTheme = false;
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
        function listener(_a) {
            var matches = _a.matches, media = _a.media;
            if (!matches) { // Not matching anymore = not interesting
                return;
            }
            if (media === DARK) {
                app.systemDarkTheme = true;
            }
            else if (media === LIGHT) {
                app.systemDarkTheme = false;
            }
            refreshResponsiveLayout();
        }
        var DARK = '(prefers-color-scheme: dark)';
        var LIGHT = '(prefers-color-scheme: light)';
        if (isFontAvailable('Segoe UI Symbol')) {
            /* eslint-disable-next-line no-extra-parens */
            document.getElementById("segoe-icons").rel = 'stylesheet';
            /* eslint-disable-next-line no-extra-parens */
            document.getElementById("default-icons").rel = 'alternate stylesheet';
        }
        if (Windows) {
            //Windows specific code
            var accentColor = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accent), accentDark1 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentDark1), accentDark2 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentDark2), accentDark3 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentDark3), accentLight1 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentLight1), accentLight2 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentLight2), accentLight3 = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.accentLight3), backgroundColor = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.background), cssColorString = [
                accentColor.r + ", " + accentColor.g + ", " + accentColor.b,
                accentDark1.r + ", " + accentDark1.g + ", " + accentDark1.b,
                accentDark2.r + ", " + accentDark2.g + ", " + accentDark2.b,
                accentDark3.r + ", " + accentDark3.g + ", " + accentDark3.b,
                accentLight1.r + ", " + accentLight1.g + ", " + accentLight1.b,
                accentLight2.r + ", " + accentLight2.g + ", " + accentLight2.b,
                accentLight3.r + ", " + accentLight3.g + ", " + accentLight3.b
            ], oldColorString = [
                new RegExp(windowsAccentColor[0] || "71, 140, 219", "g"),
                new RegExp(windowsAccentColor[1] || "49, 126, 214", "g"),
                new RegExp(windowsAccentColor[2] || "41, 114, 197", "g"),
                new RegExp(windowsAccentColor[3] || "38, 97, 164", "g"),
                new RegExp(windowsAccentColor[4] || "84, 152, 231", "g"),
                new RegExp(windowsAccentColor[5] || "112, 166, 228", "g"),
                new RegExp(windowsAccentColor[6] || "153, 185, 223", "g")
            ];
            updateWindowsUI();
            windowsAccentColor = cssColorString;
        }
        else if (app.useSystemTheme) {
            if (!window.matchMedia) {
                app.useSystemTheme = false;
                return;
            }
            else if (window.matchMedia(DARK).matches) {
                app.systemDarkTheme = true;
            }
            else
                app.systemDarkTheme = false;
            var mqDark = window.matchMedia(DARK);
            mqDark.addListener(listener);
            var mqLight = window.matchMedia(LIGHT);
            mqLight.addListener(listener);
        }
    };
    //load NyckelDB databases
    var loadDB = true, loadDBQueue = [], loadingDB = false;
    function checkDBLoaded(callback) {
        function initDB(title, template, dbNum, numOfTables) {
            var options = template.options || {};
            options.syncKey = app.stoKey === "unknown" ? dbid ? Base64.hash(dbid) : Base64.hash(app.dropboxEmail) : app.stoKey;
            var cb = function (success, errors) {
                if (errors)
                    defaultErrorHandler(success, errors);
            };
            if (numOfTables === dbNum + 1) {
                cb = function (success, errors) {
                    if (errors)
                        defaultErrorHandler(success, errors);
                    app.spin(false, "Loading data...");
                    var nextInQueue = loadDBQueue.pop();
                    if (loadDBQueue.length === 0) {
                        if (nextInQueue instanceof Function)
                            nextInQueue();
                        loadDB = false;
                    }
                    else if (nextInQueue instanceof Function)
                        nextInQueue(cb);
                };
            }
            wwManager({ "cmd": "initNewNyckelDB", "title": title, "args": [title, template.headers, template.types, options] }, cb);
        }
        function getTables() {
            var numOfTables = 0, b = 0;
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
                if (app && app.spin)
                    app.spin(true, "Loading data...");
                getTables();
            }
        }
        else if (callback instanceof Function) {
            return callback();
        }
    }
    //application functions
    function createNewItem(tableName) {
        //get blank details object by just provinding a table and no id
        getDetails({ table: tableName }, function (detailsObj) {
            app.details = detailsObj;
            app.navigate("edit");
        });
    }
    function formatValue(text, type, splitter) {
        var ret = [];
        //format multiline strings
        if (typeof text === "string") {
            if (/multilineString|formattedAddress/.test(type) && text) {
                ret = text.replace(/\r\n|\r|\n/g, '\r\n').split('\r\n');
            }
            //split out multiple values in one cell
            else
                ret = splitter ? text.split(splitter) : text.split(" ::: ");
        }
        else if (text !== undefined)
            ret = [text];
        return ret;
    }
    function getDetails(returnedJSON, callback) {
        function processDetailsReturnData(row, error, cb) {
            function getDetailsData(template, splitter, labelDropdownList) {
                function getDropdownList(optionsObj) {
                    var dropdownList = [];
                    for (var a = 0, lenA = optionsObj.listInput.length; a < lenA; a++) {
                        dropdownList[a] = {
                            text: optionsObj.listInput[a],
                            action: optionsObj.listInput[a]
                        };
                    }
                    return dropdownList;
                }
                function applyValueStr() {
                    vueDetailsData = row[VAL.toPropName(template)];
                    vueDetailsData.orig = row[VAL.toPropName(template)].value;
                    vueDetailsData.text = formatValue(row[VAL.toPropName(template)].value, vueDetailsData.type, splitter);
                    vueDetailsData.splitter = splitter;
                }
                function applyValueArr() {
                    vueDetailsData.text = [];
                    for (var a = 0, lenA = template.column.length; a < lenA; a++) {
                        if (row[template.column[a]].value)
                            vueDetailsData.text[a] = row[template.column[a]].value;
                    }
                    vueDetailsData.text = [vueDetailsData.text.join(template.joiner || " ")];
                    vueDetailsData.readonly = true;
                }
                function applyValueObj() {
                    var a = VAL.toPropName(template.column);
                    vueDetailsData = {
                        type: row[a].type,
                        column: row[a].column,
                        text: formatValue(row[a].value, row[a].type, splitter),
                        orig: row[a].value
                    };
                    if (template.dropdownList) {
                        if (template.dropdownList.listInput)
                            vueDetailsData.options = getDropdownList(template.dropdownList);
                        if (template.dropdownList.textInput)
                            vueDetailsData.textInput = true;
                    }
                }
                function applyLabel() {
                    var a = VAL.toPropName(template.label.column);
                    vueDetailsData.label = {
                        column: template.label.column,
                        orig: row[a].value,
                        text: row[a].value,
                        type: row[a].type
                    };
                    if (labelDropdownList) {
                        if (labelDropdownList.listInput)
                            vueDetailsData.label.options = getDropdownList(labelDropdownList);
                        if (labelDropdownList.textInput)
                            vueDetailsData.label.textInput = true;
                    }
                }
                var vueDetailsData = {
                    column: "",
                    orig: "",
                    text: [],
                    type: "any"
                };
                labelDropdownList = labelDropdownList || template.label && template.label.dropdownList;
                if (typeof template === "string")
                    applyValueStr();
                else if (template.column) {
                    if (template.column.constructor === Array)
                        applyValueArr();
                    else
                        applyValueObj();
                    if (template.label)
                        applyLabel();
                    if (template.readonly)
                        vueDetailsData.readonly = true;
                    if (template.hidden)
                        vueDetailsData.hidden = true;
                    vueDetailsData.splitter = splitter;
                }
                return vueDetailsData;
            }
            function getGroup(template) {
                var ret = {
                    groupHeading: "",
                    group: [],
                    collapse: template.collapse || false,
                    show: 0,
                    hidden: false,
                    readonly: false
                };
                for (var c = 0, lenC = template.group.length, d = void 0, lenD = void 0; c < lenC; c++) {
                    ret.group[c] = getDetailsData(template.group[c], template.splitter, template.label && template.label.dropdownList);
                    for (d = 0, lenD = ret.group[c].text.length; d < lenD; d++) {
                        if (ret.group[c].text[d] !== "")
                            ret.show = c + 1;
                    }
                }
                if (template.groupHeading) {
                    ret.groupHeading = template.groupHeading;
                }
                if (template.hidden)
                    ret.hidden = true;
                if (template.readonly)
                    ret.readonly = true;
                return ret;
            }
            function getHeading(template) {
                var ret;
                if (typeof template === "string")
                    ret = row[VAL.toPropName(template)].value;
                else if (template.text) {
                    ret = [];
                    for (var a = 0, lenA = template.text.length; a < lenA; a++) {
                        if (row[template.text[a]].value)
                            ret[a] = row[template.text[a]].value;
                    }
                    ret = ret.join(template.joiner || " ");
                }
                else
                    debug("template heading error. change heading 'value' to 'text'");
                return ret;
            }
            var data = [], b = 0, display = dataTemplates[returnedJSON.table].display, title = "Item not found :´(", subtitle = "Sorry, we couldn't locate this item in the database", image = "";
            if (row) {
                var detailsView = display.detailsView && display.detailsView.length > 0 ? display.detailsView : getHeadersArr(dataTemplates[returnedJSON.table].headers);
                if (display.heading) {
                    if (display.heading.title)
                        title = getHeading(display.heading.title);
                    else
                        title = "";
                    if (display.heading.subtitle)
                        subtitle = getHeading(display.heading.subtitle);
                    else
                        subtitle = "";
                    if (display.heading.image)
                        image = row[display.heading.image].value;
                }
                else
                    title = "";
                for (var a = 0, lenA = detailsView.length, item = void 0; a < lenA; a++) {
                    item = detailsView[a];
                    if (typeof item === "string" && item !== "id") {
                        data[b++] = getDetailsData(item);
                    }
                    else if (item.text) {
                        data[b++] = getDetailsData(item, item.splitter);
                    }
                    else if (item.group) {
                        data[b++] = getGroup(item);
                    }
                }
            }
            app.spin(false, "Loading data...");
            if (callback instanceof Function)
                callback({
                    id: returnedJSON.id,
                    table: returnedJSON.table,
                    title: title,
                    subtitle: subtitle,
                    image: image,
                    data: data,
                    error: error
                });
            if (cb instanceof Function)
                return cb();
        }
        function afterDBLoaded(nextInQueue) {
            app.spin(true, "Loading data...");
            app.storeState();
            var wwInput = {
                cmd: returnedJSON.id ? "getRow" : "getRowTemplate",
                title: returnedJSON.table,
                args: []
            };
            if (returnedJSON.id)
                wwInput.args = [returnedJSON.id];
            wwManager(wwInput, function (row, error) { processDetailsReturnData(row, error, nextInQueue); });
        }
        checkDBLoaded(afterDBLoaded);
    }
    function generateListItems(tableName, ids, options, callback) {
        function buildList(result, errors) {
            var ret = [];
            if (!errors && result && result.length > 0) {
                for (var a = 0, len = result.length, sort; a < len; a++) {
                    sort = result[a].pop();
                    if (sort === "")
                        sort = "*";
                    ret[a] = {
                        table: tableName,
                        id: result[a].shift(),
                        sortBy: sort + "__" + result[a].join(joiner),
                        text: result[a].join(joiner),
                        selected: options.selected || false,
                        type: "link"
                    };
                }
            }
            return callback instanceof Function ? callback(ret) : ret;
        }
        options = options || {};
        var columns = dataTemplates[tableName].display.listView.text.join("|||").split("|||"), joiner = dataTemplates[tableName].display.listView.joiner ? dataTemplates[tableName].display.listView.joiner : " ";
        columns.push(options.sortByCol || dataTemplates[tableName].display.listView.sortBy || columns[0]);
        if (typeof ids === "string")
            ids = [ids];
        wwManager({ "cmd": "getVals", "title": tableName, "args": [ids, columns] }, buildList);
    }
    function generateList(dbTitle, ids, options, callback) {
        function getIds(rowId) {
            ids.push(rowId);
        }
        function getData() {
            if (options && options.numberPerPage && options.pageNumber && ids.length > options.numberPerPage) {
                ids.slice(options.numberPerPage * (options.pageNumber - 1), options.numberPerPage * (options.pageNumber - 1) + options.numberPerPage);
            }
            return generateListItems(dbTitle, ids, options, callback);
        }
        if (ids)
            getData();
        else if (dbTitle) {
            ids = [];
            wwManager({ "cmd": "forEachRow", "title": dbTitle }, getIds, getData);
        }
        else
            debug(dbTitle, "title required");
    }
    function buildMailtoUri(to, bcc, subject, message, callback) {
        var query = bcc || subject || message ? "?" : "", joiner1 = bcc && (subject || message) ? "&" : "", joiner2 = (bcc || subject) && message ? "&" : "", bccBool = bcc ? true : false;
        to = to ? encodeURIComponent(to) : "";
        bcc = bcc ? "bcc=" + encodeURIComponent(bcc) : "";
        subject = subject ? "subject=" + encodeURIComponent(subject) : "";
        message = message ? "body=" + encodeURIComponent(message) : "";
        if (callback instanceof Function)
            return callback("mailto:" + to + query + bcc + joiner1 + subject + joiner2 + message, bccBool);
        else
            return "mailto:" + to + query + bcc + joiner1 + subject + joiner2 + message;
    }
    function addToGroup(groupName, detailsObj, searchQuery) {
        wwManager({ "cmd": "getIndexOf", "title": "Groups", "args": [null, groupName, "groupName"] }, function (index) {
            if (detailsObj)
                wwManager({ "cmd": "getVal", "title": "Groups", "args": [index, "groupIds"] }, function (ids) {
                    ids = JSON.parse(ids);
                    if (ids instanceof Array) { //convert old array data to object
                        var obj = {};
                        for (var a = 0, len = ids.length; a < len; a++) {
                            if (!obj[ids[a].table])
                                obj[ids[a].table] = [];
                            obj[ids[a].table].push(ids[a].id);
                        }
                        ids = obj;
                    }
                    //debug(detailsObj, "detailsObj");
                    for (var b = 0, lenB = detailsObj.length; b < lenB; b++) {
                        if (!ids[detailsObj[b].table])
                            ids[detailsObj[b].table] = [];
                        if (ids[detailsObj[b].table].indexOf(detailsObj[b].id) === -1) {
                            ids[detailsObj[b].table].push(detailsObj[b].id);
                        }
                    }
                    wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "groupIds", JSON.stringify(ids)] }, defaultErrorHandler);
                    app.notify("Added 1 item to " + groupName, true);
                });
            if (searchQuery)
                wwManager({ "cmd": "getVal", "title": "Groups", "args": [index, "searchTerms"] }, function (query) {
                    query = query && query !== "" ? query + " +" + searchQuery : searchQuery;
                    wwManager({ "cmd": "setVal", "title": "Groups", "args": [index, "searchTerms", query] }, defaultErrorHandler);
                    app.notify("Added '" + searchQuery + "' to " + groupName, true);
                });
        });
    }
    function groupInput(event) {
        function runSearch(table, find) {
            wwManager({ "cmd": "advancedSearch", "title": table, "args": [find, { colNames: searchableColumns }] }, function (searchResults, errors) {
                if (!errors && searchResults && searchResults.length > 0) {
                    generateList(table, searchResults, { selected: true }, function (list) {
                        app.activeGroup = app.activeGroup.concat(list);
                    });
                }
            });
        }
        function processInput(nextInQueue) {
            if (value !== "") {
                var find = String(value);
                find = VAL.removeHTMLTags(find);
                find = find.toLowerCase();
                find = VAL.toEnglishAlphabet(find);
                find = find.replace(/[^_a-z0-9\+\-]/gi, " ");
                find = trim(find);
                app.activeGroup = [];
                document.getElementById("app").focus();
                for (var table in dataTemplates) {
                    if (dataTemplates.hasOwnProperty(table)) {
                        runSearch(table, find);
                    }
                }
            }
            if (nextInQueue instanceof Function)
                return nextInQueue();
        }
        var value = event ? event.target.value : app.groupSearchBox;
        checkDBLoaded(processInput);
    }
    function addToNewGroup(detailsObj, searchQuery) {
        app.addItemToGroupDropdown = false;
        app.groupDropdown = false;
        if (detailsObj)
            generateListItems(detailsObj[0].table, detailsObj[0].id, { selected: true }, function (list) {
                list[0].selected = true;
                app.activeGroup = list;
            });
        if (searchQuery) {
            app.groupSearchBox = searchQuery;
            groupInput();
        }
        app.navigate("groups");
        app.showNewGroupUI = true;
    }
    function initializeGroups(callback) {
        function getGroups(nextInQueue) {
            wwManager({ "cmd": "getLength", "title": "Groups" }, function (length) {
                var ids = [];
                for (var a = 0; a < length; a++)
                    ids[a] = a;
                wwManager({ "cmd": "getVals", "title": "Groups", "args": [ids, ["groupName"]] }, function (vals) {
                    for (var a = 0, len = vals.length; a < len; a++) {
                        app.groups[a] = vals[a][1];
                    }
                    if (callback instanceof Function)
                        callback();
                    if (nextInQueue instanceof Function)
                        return nextInQueue();
                });
            });
        }
        if (app.groups.length === 0)
            checkDBLoaded(getGroups);
        else if (callback instanceof Function)
            return callback();
    }
    function generateListView(tableTitle, ids, options) {
        function applyTitle(title) {
            app.searchResultsTitle = title;
        }
        app.spin(true, "Generating list...");
        checkDBLoaded(function (nextInQueue) {
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
                    if (nextInQueue instanceof Function)
                        return nextInQueue();
                });
            }
            else {
                app.spin(false, "Generating list...");
                debug(tableTitle, "error generating list view");
                if (nextInQueue instanceof Function)
                    return nextInQueue();
            }
        });
    }
    function addToRecentlyViewed(obj) {
        var recentlyViewed = false, recent = JSON.parse(JSON.stringify(app.recentlyViewed));
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
    }
    /* options = {fileExtention: "json" or "csv", "overwrite": boolean } */
    function importFile(toTable, options, callback) {
        function done(success, errors) {
            if (success && !errors) {
                app.notify("Data imported successfully", true);
                if (callback instanceof Function)
                    callback();
            }
            else if (errors) {
                defaultErrorHandler(success, errors);
            }
            else
                app.notify("Done", true);
        }
        options = options || {};
        if (toTable === "Files")
            loadFile('hiddenFileInput', undefined, function (data) {
                wwManager({ "cmd": "addRow", "title": toTable, "args": [data] }, done);
            });
        else
            loadFile('hiddenCSVInput', options, function (data) {
                wwManager({ "cmd": "importJSON", "title": toTable, "args": [data, app.stoKey] }, done);
            });
    }
    function externalLink(text, type, multilineText) {
        var link;
        text = String(text);
        if (type === "phone")
            link = "tel:" + text.replace(/[^\+\-\.0-9]/g, "");
        else if (type === "sms")
            link = "sms:" + text.replace(/[^\+\-\.0-9]/g, "");
        else if (type === "email")
            link = "mailto:" + encodeURIComponent(text);
        else if (type === "bcc")
            link = buildMailtoUri(app.dropboxEmail || "", text);
        else if (type === "www")
            link = text;
        if (link)
            return link;
        else if (type === "gps" || type === "address" && !/mail/i.test(text)) {
            var googlemaps = "https://maps.google.com/?q=", bing = "https://www.bing.com/maps/?q=", bingmaps = "bingmaps:?q=", applemaps = "https://maps.apple.com/?q=", userAgent = navigator.userAgent;
            if (type === "gps") {
                link = text.replace("https://www.google.com/maps/search/?api=1&query=", "").replace(/%2C/g, ",").replace(/%2B|\+/g, "");
            }
            else if (multilineText)
                link = multilineText.join(" ");
            else
                link = text;
            if (/\d/.test(link)) {
                link = encodeURIComponent(trim(link));
                if (/Windows/.test(userAgent)) {
                    if (/NT|Phone 10/.test(userAgent)) {
                        link = bingmaps + link;
                    }
                    else
                        link = bing + link;
                }
                else if (/Macintosh|iPad|iPod|iPhone/.test(userAgent)) {
                    link = applemaps + link;
                }
                else
                    link = googlemaps + link;
                return link;
            }
            else
                return false;
        }
        else
            return false;
    }
    function is_array(a) {
        if (a && a.constructor === Array)
            return true;
        return false;
    }
    function getHeadersArr(headers) {
        var ret = [];
        if (is_array(headers)) {
            ret = headers.join("||").split("||");
        }
        else if (headers && typeof headers === "object") {
            var a = 0;
            for (var headerName in headers) {
                ret[a++] = headerName;
            }
        }
        if (ret[0] === "id") {
            ret.shift();
        }
        return ret;
    }
    function is_typeString(s) {
        var types = ["any", "number", "string", "boolean", "integer", "posInteger", "negInteger", "uniqueString",
            "multilineString", "date", "email", "phoneNumber", "password", "formattedAddress", "streetAddress", "mailAddress",
            "cityCounty", "provinceStateRegion", "country", "postalZipCode", "givenName", "familyName", "geoLocation",
            "longitude", "latitude"].join("|"), valid = new RegExp("^(" + types + ")$");
        if (String(s).match(valid))
            return true;
        else
            return false;
    }
    function getTypesArr(types) {
        var ret = [];
        if (is_array(types)) {
            for (var a = 0, b_1 = 0, len = types.length; a < len; a++) {
                if (is_typeString(types[a]))
                    ret[b_1++] = types[a];
            }
            return ret;
        }
        else if (types && typeof types === "object") {
            var b = 0, c;
            for (var headerName in types) {
                if (types.hasOwnProperty(headerName)) {
                    c = types[headerName];
                    if (is_typeString(c))
                        ret[b++] = c;
                    else if (c.type && is_typeString(c.type))
                        ret[b++] = c.type;
                }
            }
            return ret;
        }
        else
            return ret;
    }
    function is_outsideClick(e) {
        var outsideClick = !/dropdownButton/.test(e.target._prevClass); //for Windows UWP app which does not support .path or .contains
        if (outsideClick)
            return true;
        if (e.path) {
            //for non UWP
            //check to see if it is exactly the same button that was clicked, 
            //or another dropdown button
            outsideClick = !app.$el.contains(e.target);
            var a = e.path.length || 0;
            if (app.$el.id && outsideClick)
                while (a--) {
                    if (e.path[a].id === app.$el.id) {
                        outsideClick = false;
                        break;
                    }
                }
        }
        return outsideClick;
    }
    /*
    * formInputId is id of <input type="file" accept=".csv" id="browseButton1"/> (in this case it would be "browseButton1")
    * fileExtension could be ".txt", ".png", ".csv", etc.
    * callback is the function to preform after the file has been loaded
    */
    function loadFile(fileInputId, options, callback) {
        // readAs accepts "text", "image", "binary", or "array" (defaults to binary)
        function initFileReader(readAs, callback) {
            function removeListeners() {
                fileInputElement.removeEventListener('change', init.bind(null, options));
                fileInputElement.removeEventListener('error', showError);
                fileInputElement.files = null;
                fileInputElement.value = "";
                fileInputElement.accept = "";
            }
            function init(options) {
                app.spin(true, "Loading file...");
                if (!fileInputElement || !fileInputElement.files)
                    return;
                var file = fileInputElement.files[0], /* FileList object*/ path = fileInputElement.value.replace(/\\/g, "/"), accept = fileInputElement.accept.replace(/^\./, ""), ext, 
                // eslint-disable-next-line max-len
                imageTypes = /^image\/(?:bmp|cis\-cod|gif|ief|jpeg|pipeg|png|svg\+xml|tiff|x\-(cmu\-raster|cmx|icon|portable\-(anymap|bitmap|graymap|pixmap)|rgb|xbitmap|xpixmap|xwindowdump))$/i;
                var fileExtension = options && options.fileExtension || null;
                if (fileExtension)
                    ext = new RegExp(fileExtension + "$", "gi");
                if (path === "" || accept !== fileExtension) {
                    if (path)
                        app.notify("A known exception occured. Please try again", true);
                    removeListeners();
                    app.spin(false, "Loading file...");
                    return;
                }
                if (!fileExtension || path.match(ext) instanceof Array && path.match(ext)[0] === fileExtension) /* verify file extension*/ {
                    var reader = new FileReader();
                    reader.onerror = function () {
                        if (reader.error) {
                            switch (reader.error.name) {
                                case "notFoundError":
                                    app.notify('File Not Found!');
                                    break;
                                case "abortError":
                                    break; // noop
                                default:
                                    app.notify('An error occurred reading this file.');
                                    console.log(reader.error);
                            }
                        }
                        removeListeners();
                    };
                    reader.onload = function () {
                        app.spin(false, "Loading file...");
                        removeListeners();
                        callback(reader.result, file);
                    };
                    reader.onabort = function () { removeListeners(); };
                    if (readAs === "image" || imageTypes.test(file.type)) {
                        debug(file, "reading as image");
                        reader.readAsDataURL(file);
                    }
                    else if (readAs === "text")
                        reader.readAsText(file);
                    else if (readAs === "array")
                        reader.readAsArrayBuffer(file);
                    else
                        reader.readAsBinaryString(file);
                }
                else {
                    app.notify("File type not supported! Expected " + fileExtension, false);
                    app.spin(false, "Loading file...");
                    removeListeners();
                }
            }
            function showError(e) {
                removeListeners();
                app.notify("Error loading file: " + e);
            }
            if (fileInputElement && File && FileReader && FileList && Blob) {
                removeListeners();
                if (options && options.fileExtension)
                    fileInputElement.accept = "." + options.fileExtension;
                fileInputElement.addEventListener('change', init.bind(null, options), { once: true });
                fileInputElement.addEventListener('error', showError, { once: true });
            }
            else
                app.notify('Failed to initiate the File Reader.', true);
        }
        function checkFileType(options, cb) {
            if (options.fileExtension && /csv/i.test(options.fileExtension))
                initFileReader('text', parseCSV);
            else if (options.fileExtension && /vcf/i.test(options.fileExtension))
                initFileReader('text', parseVCF);
            else if (options.fileExtension && /json/i.test(options.fileExtension))
                initFileReader('text', parseJSON);
            else if (options.fileExtension && /^(jpe?g|png|gif|bmp|svg|tiff)$/i.test(options.fileExtension))
                initFileReader('image', saveFile);
            else
                initFileReader("binary", saveFile);
            return cb();
        }
        function saveFile(source, details) {
            var contents = Base64.write_and_verify(source, Base64.hash(app.stoKey)), displayName = details.name, ext = /(?:\.([^.]+))?$/.exec(details.name), extension = ext ? ext[1] : "No file extension", name = details.name.split("."), type = details.type || extension, origSize = details.size || source.length, compSize = contents.length, compression = Math.round((1 - compSize / origSize) * 100) + "%", modified = details.lastModified || new Date().getTime(), owner = app.dropboxEmail || "unknown", hash = Base64.hash(Base64.hash(app.stoKey));
            name.pop();
            name = name.join(".");
            modified = typeof modified === "number" ? modified : new Date(modified).getTime();
            var ret = [displayName, name, extension, type, origSize, compSize, compression, new Date().getTime(), modified, owner, hash, contents];
            app.spin(false, "Loading file...");
            if (callback instanceof Function)
                return callback(ret);
            else
                return ret;
        }
        function parseCSV(source) {
            app.notify("Importing data...", false, function () {
                source = COM.csv2json(source);
                source.lastModified = new Date().getTime();
                source.author = app.dropboxEmail || "unknown";
                //try get csv modified date and author from notes
                if (source.Rows[0].Notes) {
                    source.Rows[0].Notes = source.Rows[0].Notes.replace(/\r\n|\r|\n/g, "\r\n"); //normalize line breaks
                    var notes = source.Rows[0].Notes.split("\r\n");
                    for (var d = 0, lenD = notes.length; d < lenD; d++) {
                        if (/^\-Imported/.test(notes[d])) {
                            var impFr = notes[d].replace(/^\-Imported/, ""), importDate = [];
                            if (impFr && impFr.length === 8) {
                                importDate[0] = Number(impFr.substring(0, 4));
                                importDate[1] = Number(impFr.supstring(4, 6));
                                importDate[2] = Number(impFr.supstring(6, 8));
                                source.lastModified = new Date(importDate[2], importDate[0], importDate[1]).getTime();
                            }
                        }
                    }
                }
                source.replaceAll = options && options.overwrite || false;
                source.identifierCol = "Name";
                if (callback instanceof Function)
                    return callback(source);
                else
                    return source;
            });
        }
        function parseVCF(input) {
            debug(input, "parseVCF not done");
        }
        function parseJSON(input) {
            debug(input, "parseJSON not done");
        }
        //click forwarding from a button to the ugly (and now hidden) fileInputElement
        function click(callback) {
            if (fileInputElement)
                fileInputElement.click();
            if (callback instanceof Function)
                return callback();
        }
        options = options || {};
        var fileInputElement = document.getElementById(fileInputId);
        checkDBLoaded(function (nextInQueue) {
            checkFileType(options, function () { click(nextInQueue); });
        });
    }
    var dropdown_button = Vue.extend({
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
            links: {
                type: Array,
                default: function () { return []; }
            },
            title: {
                type: String,
                default: ""
            },
            noarrow: {
                type: Boolean,
                default: false
            },
            customtextinput: {
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
                clickOutsideInit: false,
                clickOutsideFunct: function (e) { return e; }
            };
        },
        methods: {
            toggle: function (open) {
                var appDiv = document.getElementById("app"), 
                // eslint-disable-next-line consistent-this
                _this = this;
                if (open === true || open === false)
                    this.open = open;
                else
                    this.open = !this.open;
                if (this.open) {
                    if (!this.clickOutsideInit) {
                        this.clickOutsideFunct = function clickOutsideFunct(e) {
                            if (is_outsideClick(e))
                                _this.toggle(false);
                        };
                        this.clickOutsideInit = true;
                    }
                    if (appDiv)
                        appDiv.addEventListener("click", this.clickOutsideFunct);
                }
                else if (appDiv)
                    appDiv.removeEventListener("click", this.clickOutsideFunct);
            },
            action: function (event, actionName) {
                if (this.select || this.customtextinput && actionName) {
                    var text = String(actionName).replace(/<[^>]+>/g, "");
                    for (var a = 0, len = this.links.length; a < len; a++) {
                        if (this.links[a].action !== undefined && this.links[a].action === actionName && this.links[a].text) {
                            text = this.links[a].text;
                            break;
                        }
                    }
                    this.buttonValue = text;
                }
                this.toggle(false);
                this.$emit("dropdown-action", actionName);
            }
        },
        template: "#dropdown-button"
    });
    var icon_select = Vue.extend({
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
                clickOutsideInit: false,
                clickOutsideFunct: function (e) { return e; },
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
                var app = document.getElementById("app"), 
                // eslint-disable-next-line consistent-this
                _this = this;
                if (open === true || open === false)
                    this.open = open;
                else
                    this.open = !this.open;
                if (this.open) {
                    if (!this.clickOutsideInit) {
                        this.clickOutsideFunct = function clickOutsideFunct(e) {
                            if (is_outsideClick(e))
                                _this.toggle(false);
                        };
                        this.clickOutsideInit = true;
                    }
                    if (app)
                        app.addEventListener("click", this.clickOutsideFunct);
                }
                else if (app)
                    app.removeEventListener("click", this.clickOutsideFunct);
            },
            select: function (icon) {
                this.iconSelected = icon;
                this.toggle(false);
                this.$emit("icon-select", icon);
            }
        },
        template: "#icon-select"
    });
    var color_select = Vue.extend({
        props: {
            align: {
                type: String,
                default: "left"
            },
            color: {
                type: String,
                default: "#478cdb"
            }
        },
        data: function () {
            return {
                open: false,
                clickOutsideInit: false,
                clickOutsideFunct: function (e) { return e; },
                options: [
                    //hex color themes
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
                var app = document.getElementById("app"), 
                // eslint-disable-next-line consistent-this
                _this = this;
                if (open === true || open === false)
                    this.open = open;
                else
                    this.open = !this.open;
                if (this.open) {
                    if (!this.clickOutsideInit) {
                        this.clickOutsideFunct = function clickOutsideFunct(e) {
                            if (is_outsideClick(e))
                                _this.toggle(false);
                        };
                        this.clickOutsideInit = true;
                    }
                    if (app)
                        app.addEventListener("click", this.clickOutsideFunct);
                }
                else if (app)
                    app.removeEventListener("click", this.clickOutsideFunct);
            },
            select: function (color) {
                this.toggle(false);
                this.$emit("color-select", color);
            }
        },
        template: "#color-select"
    });
    var dialog_box = Vue.extend({
        props: {
            heading: {
                type: String,
                default: ""
            },
            showif: {
                type: Boolean,
                default: true
            },
            okbutton: {
                type: String,
                default: "OK"
            },
            cancelbutton: {
                type: String,
                default: "Cancel"
            }
        },
        data: function () {
            return {
                dialogShake: false
            };
        },
        methods: {
            processConfirm: function (action) {
                if (action)
                    this.$emit("dialog-box-ok");
                else
                    this.$emit("dialog-box-cancel");
            },
            shakeBox: function () {
                this.dialogShake = true;
                setTimeout(function () { this.dialogShake = false; }.bind(this), 600);
            }
        },
        template: "#dialog-box"
    });
    var jump_list = Vue.extend({
        props: {
            links: {
                type: Array,
                default: function () { return []; }
            },
            select: {
                type: Boolean,
                default: false
            },
            selectall: {
                type: Boolean,
                default: false
            },
            scrolldiv: {
                type: String,
                default: ""
            },
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
                        action: "sort",
                        href: "",
                        disabled: false
                    },
                    {
                        text: "Filter List",
                        icon: "icon-filter",
                        action: "filter",
                        href: "",
                        disabled: false
                    },
                    {
                        text: "List View",
                        icon: "icon-list",
                        action: "view",
                        href: "",
                        disabled: false
                    },
                    {
                        text: "Add All to Favorites",
                        icon: "icon-favorite-star",
                        action: "favorite",
                        href: "",
                        disabled: false
                    },
                    {
                        text: "E-mail All",
                        icon: "icon-mail",
                        action: "email",
                        href: "",
                        disabled: false
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
                            if (a.sortBy === b.sortBy &&
                                a.type === "jumplink" &&
                                b.type !== "jumplink")
                                return 1;
                            if (a.sortBy === b.sortBy &&
                                b.type === "jumplink" &&
                                a.type !== "jumplink")
                                return -1;
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
                                return {
                                    id: "jumplink_" + VAL.toPropName(name),
                                    table: "",
                                    sortBy: sortBy,
                                    text: name,
                                    selected: false,
                                    type: "jumplink"
                                };
                            }
                            var b = 0, c = 0, date = new Date(), now = date.getTime(), time = date.getHours() * 36e5 +
                                date.getMinutes() * 6e4 +
                                date.getSeconds() * 1000 +
                                date.getMilliseconds(), diff = 0, recentHeaders = {
                                Older: 2592e6,
                                "In the Past 30 Days": 6048e5,
                                "In the Past 7 Days": 1728e5 - time,
                                Yesterday: 864e5 - time,
                                "Earlier Today": 36e5,
                                "In the Past Hour": 3e5,
                                "Just Now": 0
                            };
                            for (var a = 0, len = list.length, name_1; a < len; a++) {
                                if (list[a].type === "jumplink") {
                                    //strip out old headers
                                    list.splice(a, 1);
                                    a--;
                                    len--;
                                }
                                //by most recent
                                else if (typeof list[a].sortBy === "number" &&
                                    list[a].sortBy > 15e11 &&
                                    list[a].sortBy < 2e12) {
                                    diff = now - list[a].sortBy;
                                    for (var header in recentHeaders) {
                                        if (diff >= recentHeaders[header]) {
                                            name_1 = header;
                                            break;
                                        }
                                    }
                                    if (a === 0 || name_1 !== nameHeaders[c - 1].text) {
                                        nameHeaders.push(obj(name_1, now - recentHeaders[name_1]));
                                        c++;
                                    }
                                }
                                // by alphabetic
                                else {
                                    name_1 = list[a].sortBy && list[a].sortBy.split("__")[0] || "A";
                                    letter = name_1.charAt(0);
                                    if (alphabetHeaders[b - 1] === undefined ||
                                        letter !== alphabetHeaders[b - 1].sortBy) {
                                        alphabetHeaders.push(obj(letter, letter));
                                        b++;
                                    }
                                    if (nameHeaders[c - 1] === undefined ||
                                        name_1 !== nameHeaders[c - 1].sortBy) {
                                        nameHeaders.push(obj(name_1, name_1));
                                        c++;
                                    }
                                }
                            }
                        }
                        var alphabetHeaders = [], nameHeaders = [], letter;
                        generateHeaders();
                        if (nameHeaders.length < 20 || nameHeaders.length / list.length < 0.2)
                            list = nameHeaders.concat(list);
                        else
                            list = alphabetHeaders.concat(list);
                        list = deleteDuplicates(list);
                        list = letter
                            ? list.sort(sortFunction)
                            : list.sort(sortFunction).reverse();
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
            toggle: function (prop) {
                if (this[prop] !== undefined)
                    this[prop] = this[prop] ? false : true;
                else
                    debug(prop, "prop doesn't exist in jump-list");
            },
            moreDropdownActions: function (action) {
                switch (action) {
                    case "":
                        break;
                    case "sort":
                        break;
                    case "filter":
                        break;
                    case "favorite":
                        break;
                    case "view":
                        this.toggle("collapsed");
                        this.moreDropdownLinks[2] = {
                            text: this.collapsed ? "List View" : "Button View",
                            icon: this.collapsed ? "icon-list" : "icon-th",
                            action: "view",
                            href: "",
                            disabled: false
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
                        else
                            debug(action, "no such button action found");
                }
            },
            seeDetails: function (obj) {
                var sortByRecent = typeof obj.sortBy === "number" && obj.sortBy > 15e11 && obj.sortBy < 2e12;
                if (sortByRecent) {
                    this.list.unshift(obj);
                    this.list[0].sortBy = new Date().getTime();
                    this.list = this.list.slice(0, 20);
                }
                else
                    this.$emit("update-recently-viewed", obj);
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
            toggleSelect: function (link) {
                for (var a = 0, len = this.list.length; a < len; a++) {
                    if (this.list[a].type === "link")
                        this.list[a].selected = false;
                }
                this.selectAll = false;
                this.collapsed = false;
                this.toggle("selected");
                if (link)
                    link.selected = true;
                Vue.nextTick(this.updateDropdownLinks);
            },
            toggleSelectAll: function () {
                this.toggle("selectAll");
                for (var a = 0, len = this.list.length; a < len; a++) {
                    if (this.list[a].type === "link")
                        this.list[a].selected = this.selectAll ? true : false;
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
                    if (!el) {
                        debug("jumplink outer div #" + div + " not found. Check the div container id");
                        return;
                    }
                    if (collapse) {
                        Vue.nextTick(function () {
                            var linkEl = document.getElementById(link.id), pos = 0;
                            if (linkEl)
                                pos = linkEl.offsetTop;
                            if (el)
                                el.scrollTop = pos;
                        });
                    }
                    else
                        el.scrollTop = 0;
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
                    for (var a = 0, len = this.list.length; a < len; a++) {
                        if (this.list[a].type === "link" &&
                            (this.selected === false || this.list[a].selected === true) &&
                            this.list[a].table === "Contacts")
                            bccIds.push(this.list[a].id);
                    }
                    getEmails.call(this, bccIds);
                }
                function getEmails(ids) {
                    var emailAddresses = [];
                    if (ids.length > 0)
                        wwManager({
                            cmd: "getVals",
                            title: "Contacts",
                            args: [
                                ids,
                                [
                                    "Name",
                                    "GivenName",
                                    "FamilyName",
                                    "E_mail1_Type",
                                    "E_mail1_Value",
                                    "E_mail2_Type",
                                    "E_mail2_Value",
                                    "E_mail3_Type",
                                    "E_mail3_Value",
                                    "E_mail4_Type",
                                    "E_mail4_Value",
                                    "E_mail5_Type",
                                    "E_mail5_Value",
                                    "E_mail6_Type",
                                    "E_mail6_Value",
                                    "E_mail7_Type",
                                    "E_mail7_Value"
                                ]
                            ]
                        }, function (vals, errors) {
                            if (!vals || errors) {
                                return debug(errors, "get email errors");
                            }
                            var type, email, name, primary = false;
                            for (var a = 0, lenA = vals.length; a < lenA; a++) {
                                name =
                                    vals[a][2].replace(/, /g, " and ").split(";")[0] +
                                        " " +
                                        vals[a][3];
                                if (vals[a][6]) {
                                    for (var b = 4; b < 17; b = b + 2) {
                                        //find primary email
                                        if (/\*/.test(vals[a][b]))
                                            primary = b;
                                    }
                                }
                                for (var b = 4; b < 17; b = b + 2) {
                                    email = vals[a][b + 1];
                                    if (!email)
                                        continue;
                                    type = vals[a][b] || "";
                                    if (vals[a][6]) {
                                        if (/\'s Email/.test(type))
                                            name = type.replace(/\'s Email/, " ") + vals[a][3];
                                        name = name.replace(/\*/, "");
                                        name = trim(name);
                                    }
                                    if (primary === false || primary === b)
                                        emailAddresses.push(name + " <" + email.replace(/,/g, ">,<") + ">");
                                }
                            }
                            if (emailAddresses.length > 0) {
                                if (emailAddresses.length === 1)
                                    buildMailtoUri(emailAddresses[0], null, null, null, function (uri) {
                                        updateLinks.call(this, uri, ids);
                                    }.bind(this));
                                else
                                    buildMailtoUri(app.dropboxEmail || "", emailAddresses.join(","), null, null, function (uri) {
                                        updateLinks.call(this, uri, ids);
                                    }.bind(this));
                            }
                            else
                                updateLinks.call(this);
                        }.bind(this));
                    else
                        updateLinks.call(this);
                }
                function updateLinks(mailtoUri, ids) {
                    var len = ids ? ids.length : 0;
                    this.moreDropdownLinks = [
                        {
                            text: "Sort List",
                            icon: "icon-sort",
                            action: "sort",
                            href: "",
                            disabled: false
                        },
                        {
                            text: "Filter List",
                            icon: "icon-filter",
                            action: "filter",
                            href: "",
                            disabled: false
                        },
                        {
                            text: this.collapsed ? "List View" : "Button View",
                            icon: this.collapsed ? "icon-list" : "icon-th",
                            action: "view",
                            href: "",
                            disabled: false
                        },
                        {
                            text: this.selected
                                ? "Add Selected to Favorites"
                                : "Add All to Favorites",
                            icon: "icon-favorite-star",
                            action: "favorite",
                            href: "",
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
                    for (var a = 0, len_1 = app.groups.length; a < len_1; a++) {
                        this.moreDropdownLinks[a + 4] = {
                            text: this.selected
                                ? "Add Selected to " + app.groups[a] + " Group"
                                : "Add to " + app.groups[a] + " Group",
                            icon: "icon-people",
                            action: "_add_to_group_" + app.groups[a],
                            href: "",
                            disabled: this.selected && len_1 === 0 ? true : false
                        };
                    }
                    this.moreDropdownLinks.push({
                        text: this.selected
                            ? "Save Selected to New Group"
                            : "Save Search as New Group",
                        icon: "icon-plus",
                        action: "_create_new_group",
                        href: "",
                        disabled: this.selected && len === 0 ? true : false
                    });
                }
                initializeGroups(newEmailLink.bind(this));
            }
        },
        template: "#jump-list"
    });
    var new_table_page = Vue.extend({
        name: "NewTablePage",
        components: {
            "dropdown-button": dropdown_button,
            "icon-select": icon_select,
            "color-select": color_select
        },
        data: function () {
            return {
                newTableTitle: "",
                searchableDropdown: -1,
                typesDropdown: -1,
                searchableDefault: "True",
                typesDefault: "any",
                searchableDropdownOptions: [
                    { action: true, text: "True" },
                    { action: false, text: "False" },
                    { action: "optional", text: "Optional" }
                ],
                typesDropdownOptions: [
                    { action: "Any", text: "Any", description: "Any text, number or boolean value" },
                    { action: "Number", text: "Number", description: "Any positive or negative number, including decimal values" },
                    { action: "Integer", text: "Integer", description: "Any positive or negative integer value" },
                    { action: "PosInteger", text: "Positive Integer", description: "Any positive integer value, including 0" },
                    { action: "NegInteger", text: "Negative Integer", description: "Any negative integer value, including 0" },
                    { action: "Boolean", text: "Boolean Value", description: "True or False values" },
                    { action: "String:", text: "Text", description: "Alphanumeric text and symbols without formatting" },
                    { action: "MultilineString", text: "Multiline Text", description: "Formatted lines of aphanumeric text and symbols" },
                    { action: "Date", text: "Date or Time", description: "A UTC formatted date/time" },
                    { action: "UniqueString", text: "Username or ID", description: "A text based unique identifier" },
                    { action: "Password", text: "Password", description: "The validation hash of a password, secret code or access token" },
                    { action: "GivenName", text: "First Name", description: "A person's given name" },
                    { action: "FamilyName", text: "Last Name", description: "A person's family name" },
                    { action: "Email", text: "E-mail Address" },
                    { action: "PhoneNumber", text: "Phone Number" },
                    { action: "StreetAddress", text: "Street Address" },
                    { action: "MailAddress", text: "Mailing Address" },
                    { action: "CityCounty", text: "City or County" },
                    { action: "ProvinceStateRegion", text: "Province, State or Region" },
                    { action: "Country", text: "Country" },
                    { action: "PostalZipCode", text: "Postal/Zip Code" },
                    { action: "GeoLocation", text: "GPS Coordinates", description: "Decimal format GPS Coordinates" },
                    { action: "Longitude", text: "Longitude Coordinate" },
                    { action: "Latitude", text: "Latitude Coordinate" }
                ],
                newTable: {
                    headers: ["Column 1", "Column 2", "Column 3"],
                    types: ["any", "any", "any"],
                    options: {
                        customProperties: {
                            icon: { initialValue: "", type: "string" },
                            iconColor: { initialValue: "#ff4343", type: "string" }
                        },
                        doNotIndex: [],
                        initialIndex: []
                    },
                    display: {
                        listView: {
                            text: [],
                            joiner: " ",
                            sortBy: ""
                        },
                        heading: {
                            image: "",
                            title: "",
                            subtitle: ""
                        },
                        detailsView: []
                    }
                },
                optionsDropdown: -1,
                fullscreen: false,
                icon: "",
                iconColor: "#ff4343",
                customProperties: [],
                showCustomPropertyInput: false,
                customPropertyName: "",
                customPropertyType: "any",
                customPropertyTypes: [
                    { text: "Any", action: "Any" },
                    { text: "String", action: "String" },
                    { text: "Number", action: "Number" },
                    { text: "Boolean", action: "Boolean" }
                ],
                customPropertyInitialValue: "",
                initialValueInputType: "text",
                customPropertyError: "",
                thLinks: [
                    { text: "Sort Table by Column", action: "sortTable", icon: "icon-sort" },
                    { text: "Rename Column", action: "renameColumn", icon: "icon-pencil" },
                    { text: "Edit Column Properties", action: "editProps", icon: "icon-settings" },
                    { text: "Insert Column Left", action: "insertColumnLeft", icon: "icon-left" },
                    { text: "Insert Column Right", action: "insertColumnRight", icon: "icon-right" },
                    { text: "Delete Column", action: "deleteColumn", icon: "icon-delete" }
                ]
            };
        },
        methods: {
            setCustomProp: function (propName, value, type) {
                this.newTable.options = this.newTable.options || {};
                this.newTable.options.customProperties = this.newTable.options.customProperties || {};
                this.newTable.options.customProperties[VAL.toPropName(propName)] = {
                    initialValue: value,
                    type: type
                };
            },
            setIcon: function (icon) {
                this.icon = icon;
                this.setCustomProp("icon", icon, "string");
            },
            setColor: function (color) {
                this.iconColor = color;
                this.setCustomProp("iconColor", color, "string");
            },
            setCustomPropertyType: function (value) {
                this.customPropertyType = value;
                if (value === "String" || value === "Any") {
                    this.initialValueInputType = "string";
                    this.customPropertyInitialValue = "";
                }
                else if (value === "Number") {
                    this.initialValueInputType = "number";
                    this.customPropertyInitialValue = 0;
                }
                else if (value === "Boolean")
                    this.customPropertyInitialValue = false;
                else
                    debug(value, "not valid property type");
            },
            addNewProperty: function () {
                function isNumeric(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                }
                if (!/^[A-z_]\w*(\.[A-z_]\w*)*$/.test(this.customPropertyName)) {
                    this.customPropertyError = "Invalid Property Name";
                }
                else if (!/Any|String|Number|Boolean/.test(this.customPropertyType)) {
                    this.customPropertyError = "Invalid Property Type";
                }
                else if (this.customPropertyType === "string" &&
                    typeof this.customPropertyInitialValue !== "string" ||
                    this.customPropertyType === "boolean" &&
                        typeof this.customPropertyInitialValue !== "boolean" ||
                    this.customPropertyType === "number" &&
                        !isNumeric(this.customPropertyInitialValue)) {
                    this.customPropertyError = "Invalid Initial Value";
                }
                else {
                    this.customPropertyError = "";
                    this.showCustomPropertyInput = false;
                    this.customProperties.push({
                        name: this.customPropertyName,
                        type: this.customPropertyType,
                        initialValue: this.customPropertyInitialValue
                    });
                    this.customPropertyName = "";
                    this.customPropertyType = "any";
                    this.customPropertyInitialValue = "";
                }
            },
            importNewTable: function () {
                loadFile("hiddenCSVInput", { fileExtension: "csv" }, this.applyNewTable);
            },
            applyNewTable: function (data) {
                function matches(subsetArr, ofArr) {
                    var ret = true;
                    if (ofArr && ofArr.constructor === Array) {
                        for (var a = 0, len = subsetArr.length; a < len; a++) {
                            if (ofArr.indexOf(subsetArr[a]) === -1)
                                ret = false;
                            else if (!ofArr[subsetArr[a]])
                                ret = false;
                        }
                        return ret;
                    }
                    else
                        return false;
                }
                function createTempTable(JSON, template) {
                    template.options.importJSON = JSON;
                    app.notify("Building new table");
                    wwManager({
                        cmd: "initNewNyckelDB",
                        title: "temp",
                        args: ["temp", template.headers, template.types, template.options]
                    }, function (success, errors) {
                        //final callback function for last NyckelDB to initialise
                        if (errors)
                            defaultErrorHandler(success, errors);
                        else
                            app.notify("Done", true);
                    });
                }
                if (matches(data.Headers, this.newTable.headers)) {
                    createTempTable(data, this.newTable);
                }
                else {
                    app.notify("CSV Headers don't match");
                    for (var template in dataTemplates) {
                        var tryHeaders = getHeadersArr(dataTemplates[template].headers);
                        if (matches(data.Headers, tryHeaders)) {
                            (function (self, template) {
                                app.confirm("Are you trying to create a " +
                                    template +
                                    " table? You can use a template.", function () {
                                    self.template(template);
                                    app.notify("");
                                    createTempTable(data, dataTemplates[template]);
                                });
                            })(this, template);
                        }
                    }
                }
            },
            template: function (templateName) {
                if (dataTemplates[templateName]) {
                    this.newTableTitle = templateName;
                    this.newTable.headers = getHeadersArr(dataTemplates[templateName].headers);
                    this.newTable.types = getTypesArr(dataTemplates[templateName].types);
                    this.newTable.options = dataTemplates[templateName].options;
                    this.newTable.display = dataTemplates[templateName].display;
                    //TODO
                    //this.newTable.options.searchable = dataTemplates[templateName].options.searchable || [];
                    this.icon = "";
                    this.iconColor = "#ff4343";
                }
                else {
                    this.newTableTitle = "";
                    this.newTable.headers = ["", "", ""];
                    this.newTable.types = [
                        this.typesDefault,
                        this.typesDefault,
                        this.typesDefault
                    ];
                    this.icon = "";
                    this.iconColor = "#ff4343";
                    this.newTable.options = {
                        customProperties: {
                            icon: { initialValue: this.icon, type: "string" },
                            iconColor: { initialValue: this.iconColor, type: "string" }
                        },
                        doNotIndex: [],
                        initialIndex: []
                    };
                    this.newTable.display = {
                        listView: {
                            text: [],
                            joiner: " ",
                            sortBy: ""
                        },
                        heading: { title: "" },
                        detailsView: []
                    };
                }
            },
            thAction: function (action, index) {
                if (action === "insertColumnLeft") {
                    this.insertColumn(index);
                }
                else if (action === "insertColumnRight") {
                    this.insertColumn(index + 1);
                }
                else if (action === "deleteColumn") {
                    /* eslint-disable-next-line no-extra-parens */
                    this.newTable.headers.splice(index, 1);
                    /* eslint-disable-next-line no-extra-parens */
                    this.newTable.types.splice(index, 1);
                    //	this.newTable.options.searchable.splice(index, 1);
                    this.optionsDropdown = -1;
                }
            },
            insertColumn: function (index) {
                if (index === false) {
                    /* eslint-disable-next-line no-extra-parens */
                    this.newTable.headers.push("");
                    /* eslint-disable-next-line no-extra-parens */
                    this.newTable.types.push(this.typesDefault);
                    //	this.newTable.options.searchable.push(this.searchableDefault);
                }
                else {
                    /* eslint-disable-next-line no-extra-parens */
                    this.newTable.headers.splice(index, 0, "");
                    /* eslint-disable-next-line no-extra-parens */
                    this.newTable.types.splice(index, 0, this.typesDefault);
                    //	this.newTable.options.searchable.splice(index, 0, this.searchableDefault);
                }
                this.optionsDropdown = -1;
            },
            typesAction: function (action, index) {
                this.newTable.types = this.newTable.types || [];
                this.newTable.types[index] = action;
            },
            searchableAction: function (action, index) {
                //	this.newTable.options.searchable[index] = action;
            }
        },
        template: "#new-table-page"
    });
    var groups_page = Vue.extend({
        name: "GroupsPage",
        components: {
            "jump-list": jump_list
        },
        data: function () {
            return {
                groups: state.groups,
                groupName: "",
                showNewGroupUI: state.showNewGroupUI,
                showEditGroupUI: false,
                activeGroup: state.activeGroup,
                groupPage: 1,
                groupHelp: false,
                groupSearchBox: state.groupSearchBox,
                addItemToGroupDropdown: state.addItemToGroupDropdown,
                groupDropdown: state.groupDropdown,
                ids: {}
            };
        },
        computed: {
            selectedActiveGroup: function () {
                var ret = [], b = 0;
                for (var a = 0, len = this.activeGroup.length; a < len; a++) {
                    if (this.activeGroup[a].selected)
                        ret[b++] = this.activeGroup[a];
                }
                return ret;
            }
        },
        methods: {
            newGroup: function (event, groupName) {
                //Validate groupName
                groupName = groupName || this.groupName;
                this.groupName = groupName;
                groupName = VAL.toEnglishAlphabet(groupName);
                groupName = groupName.replace(/[^A-z0-9_\-/\s]/g, "");
                groupName = trim(groupName);
                if (groupName && groupName !== "") {
                    groupName = groupName.split(" ");
                    for (var b = 0, lenB = groupName.length; b < lenB; b++) {
                        groupName[b] =
                            groupName[b][0].toUpperCase() + groupName[b].slice(1);
                    }
                    groupName = groupName.join(" ");
                    var title;
                    //get group ids
                    for (var c = 0, lenC = this.activeGroup.length; c < lenC; c++) {
                        if (this.activeGroup[c].selected === true) {
                            title = VAL.toPropName(this.activeGroup[c].table);
                            if (!this.ids[title])
                                this.ids[title] = [];
                            this.ids[title].push(this.activeGroup[c].id);
                        }
                    }
                    initializeGroups(this.initialiseGroupsCB);
                }
                else
                    app.notify("Group requires a name");
            },
            initialiseGroupsCB: function () {
                //check for duplicate groupNames
                var i = 2;
                if (this.groups.indexOf(this.groupName) > -1) {
                    while (this.groups.indexOf(this.groupName + " " + i) > -1)
                        i++;
                    this.groupName = this.groupName + " " + i;
                }
                //Save new group
                wwManager({
                    cmd: "addRow",
                    title: "Groups",
                    args: [[this.groupName, "", "", ""]]
                }, this.saveGroupCB);
            },
            saveGroupCB: function () {
                this.updateGroup(this.groupName, this.ids, this.groupSearchBox);
                this.groups.push(this.groupName);
                this.activeGroup = [];
                this.showNewGroupUI = false;
                this.groupSearchBox = "";
                this.groupName = "";
                this.ids = {};
            },
            updateGroup: function (groupName, ids, searchTerms) {
                groupName = String(groupName);
                wwManager({
                    cmd: "getIndexOf",
                    title: "Groups",
                    args: [null, groupName, "groupName"]
                }, function (index) {
                    if (ids)
                        wwManager({
                            cmd: "setVal",
                            title: "Groups",
                            args: [index, "groupIds", JSON.stringify(ids)]
                        }, defaultErrorHandler);
                    if (searchTerms)
                        wwManager({
                            cmd: "setVal",
                            title: "Groups",
                            args: [
                                index,
                                "searchTerms",
                                String(searchTerms)
                            ]
                        }, defaultErrorHandler);
                });
            },
            deleteGroup: function (groupName) {
                groupName = String(groupName);
                wwManager({
                    cmd: "getIndexOf",
                    title: "Groups",
                    args: [null, groupName, "groupName"]
                }, function (index) {
                    wwManager({ cmd: "deleteRow", title: "Groups", args: [index] }, function (result) {
                        console.log(result, "deletedRow");
                    });
                });
                this.groups.splice(this.groups.indexOf(groupName), 1);
            },
            groupKeyPress: function (e) {
                var keyCode = e.which || e.keyCode || 0;
                if (keyCode === 38 ||
                    keyCode === 40 ||
                    keyCode === 27 ||
                    keyCode === 13) {
                    e.preventDefault();
                }
            },
            groupInput: groupInput,
            groupKeyUp: function (e) {
                var keyCode = e.which || e.keyCode || 0;
                if (keyCode === 32)
                    e.preventDefault();
                if (keyCode !== 8 &&
                    keyCode !== 9 &&
                    keyCode !== 32 &&
                    keyCode !== 38 &&
                    keyCode !== 40)
                    this.groupSearchBox = trim(this.groupSearchBox);
                switch (keyCode) {
                    case 27 /*escape key*/:
                        this.resetGroupSearch();
                        break;
                }
            },
            groupKeyDown: function (e) {
                var keyCode = e.which || e.keyCode || 0;
                if (keyCode === 9 ||
                    keyCode === 13 ||
                    keyCode === 32 ||
                    keyCode === 38 ||
                    keyCode === 27 ||
                    keyCode === 40) {
                    e.preventDefault();
                }
                if (keyCode === 32) {
                    if (this.groupSearchBox !== "" &&
                        this.groupSearchBox.slice(-1) !== " ") {
                        this.groupSearchBox = this.groupSearchBox + " ";
                    }
                }
            },
            resetGroupSearch: function () {
                this.groupSearchBox = "";
            },
            seeGroup: function (index) {
                function add(group) {
                    if (group.groupIds.value !== "" &&
                        group.groupIds.value !== "[]") {
                        var ids = JSON.parse(group.groupIds.value), lenIds = 0, b = 0;
                        for (var a in ids) {
                            if (ids.hasOwnProperty(a)) {
                                lenIds++;
                            }
                        }
                        //	debug(ids, "ids");
                        for (var table in ids) {
                            if (ids.hasOwnProperty(table)) {
                                (function (table) {
                                    //	debug(table, "table");
                                    generateListItems(table, ids[table], undefined, function (arr) {
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
                    else
                        remove(group);
                }
                function remove(group) {
                    if (group.excludeIds &&
                        group.excludeIds.value &&
                        group.excludeIds.value !== "" &&
                        group.excludeIds.value !== "[]") {
                        var removeIds = JSON.parse(group.excludeIds.value);
                        for (var table in removeIds) {
                            for (var a = 0, lenA = list.length; a < lenA; a++) {
                                if (list[a].table === table &&
                                    removeIds.indexOf(list[a].id) > -1) {
                                    list.splice(a, 1);
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
                    wwManager({
                        cmd: "advancedSearch",
                        title: table,
                        args: [
                            group.searchTerms.value,
                            { colNames: searchableColumns }
                        ]
                    }, function (results, err) {
                        if (!err) {
                            if (results)
                                generateListItems(table, results, undefined, function (arr) {
                                    list = list.concat(arr);
                                    n++;
                                    if (n === lenTables)
                                        add(group);
                                });
                            else {
                                n++;
                                if (n === lenTables)
                                    add(group);
                            }
                        }
                        else
                            debug(err, table + " seeGroup error");
                    });
                }
                function showGroup(group, error) {
                    //	debug(group, "group");
                    if (!group || error)
                        debug(error);
                    else if (group.searchTerms.value !== "") {
                        for (var a in dataTemplates) {
                            if (dataTemplates.hasOwnProperty(a))
                                lenTables++;
                        }
                        for (var table in dataTemplates) {
                            if (dataTemplates.hasOwnProperty(table)) {
                                searchForMembers(table, group, lenTables);
                            }
                        }
                    }
                    else
                        add(group);
                }
                var list = [], lenTables = 0, n = 0;
                wwManager({ cmd: "getRow", title: "Groups", args: [index] }, showGroup);
            },
            addToGroup: function (groupName, detailsObj, searchQuery) {
                //	debug(groupName, "groupName");
                this.addItemToGroupDropdown = false;
                this.groupDropdown = false;
                addToGroup(groupName, detailsObj, searchQuery);
            },
            showSelectGroupMembers: function () {
                for (var table in dataTemplates) {
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
                if (this.groups.length === 0)
                    app.goBack();
                else
                    this.toggle("showNewGroupUI");
            },
            toggle: function (prop) {
                if (this[prop] === undefined)
                    return debug(prop, "prop does not exist");
                else
                    this[prop] = !this[prop];
            }
        },
        template: "#groups-page"
    });
    var multi_input = Vue.extend({
        components: {
            "dropdown-button": dropdown_button
        },
        props: {
            type: {
                type: String,
                default: "text"
            },
            value: {
                type: [String, Number, Boolean],
                default: ""
            },
            inputclass: {
                type: String,
                default: ""
            },
            options: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            id: {
                type: String,
                default: ""
            },
            textinput: {
                type: Boolean,
                default: false
            },
            align: {
                type: String,
                default: "left"
            }
        },
        data: function () {
            return {
                focused: false
            };
        },
        methods: {
            emitNewValue: function (value, type) {
                this.$emit("value-changed", { value: value, type: type });
            }
        },
        template: "#multi-input"
    });
    var editable_table = Vue.extend({
        components: {
            "dropdown-button": dropdown_button,
            "multi-input": multi_input,
            "dialog-box": dialog_box
        },
        props: {
            tablename: {
                type: String,
                required: true
            },
            maxrows: {
                type: Number,
                default: 50
            }
        },
        data: function () {
            return {
                db: {
                    headers: [],
                    datatypes: [],
                    tabledata: [[]]
                },
                colLength: 0,
                rowLength: 0,
                blankRowsBefore: 0,
                fullscreen: false,
                scrollPos: 0,
                onScrollRunning: false,
                fetchingData: false,
                thLinks: [
                    { text: "Sort Table by Column", action: "sortTable", icon: "icon-sort" },
                    { text: "Edit Column Properties", action: "editProps", icon: "icon-settings" },
                    { text: "Insert Column Left", action: "insertColumnLeft", icon: "icon-left" },
                    { text: "Insert Column Right", action: "insertColumnRight", icon: "icon-right" },
                    { text: "Delete Column", action: "deleteColumn", icon: "icon-delete" }
                ],
                selectedCell: [-1, 0],
                selectedCellValue: "",
                selectedCellType: "string",
                validTypes: [
                    { action: "Any", text: "Any", description: "Any text, number or boolean value" },
                    { action: "Number", text: "Number", description: "Any positive or negative number, including decimal values" },
                    { action: "Integer", text: "Integer", description: "Any positive or negative integer value" },
                    { action: "PosInteger", text: "Positive Integer", description: "Any positive integer value, including 0" },
                    { action: "NegInteger", text: "Negative Integer", description: "Any negative integer value, including 0" },
                    { action: "Boolean", text: "Boolean Value", description: "True or False values" },
                    { action: "String:", text: "Text", description: "Alphanumeric text and symbols without formatting" },
                    { action: "MultilineString", text: "Multiline Text", description: "Formatted lines of aphanumeric text and symbols" },
                    { action: "Date", text: "Date or Time", description: "A UTC formatted date/time" },
                    { action: "UniqueString", text: "Username or ID", description: "A text based unique identifier" },
                    { action: "Password", text: "Password", description: "The validation hash of a password, secret code or access token" },
                    { action: "GivenName", text: "First Name", description: "A person's given name" },
                    { action: "FamilyName", text: "Last Name", description: "A person's family name" },
                    { action: "Email", text: "E-mail Address" },
                    { action: "PhoneNumber", text: "Phone Number" },
                    { action: "StreetAddress", text: "Street Address" },
                    { action: "MailAddress", text: "Mailing Address" },
                    { action: "CityCounty", text: "City or County" },
                    { action: "ProvinceStateRegion", text: "Province, State or Region" },
                    { action: "Country", text: "Country" },
                    { action: "PostalZipCode", text: "Postal/Zip Code" },
                    { action: "GeoLocation", text: "GPS Coordinates", description: "Decimal format GPS Coordinates" },
                    { action: "Longitude", text: "Longitude Coordinate" },
                    { action: "Latitude", text: "Latitude Coordinate" }
                ],
                showPropsDialogBox: false,
                menuLinks: [
                    { action: "toggleFullscreen", text: "Full Screen", description: "Toggle full screen", icon: "icon-fullscreen" },
                    { action: "importCSV", text: "Import CSV File", description: "Import a CSV file from your device", icon: "icon-import" },
                    { action: "exportJSON", text: "Create Backup File", description: "Export a Nyckel JSON file to your device", icon: "icon-export" },
                    { action: "importJSON", text: "Restore from Backup File", description: "Import a Nyckel JSON file from your device", icon: "icon-import" },
                    { action: "addRow", text: "New Row", description: "Add a new row to the table", icon: "icon-plus" }
                ],
                invalidInput: false,
                inputError: "",
                inputErrorDetails: ""
            };
        },
        methods: {
            fetchData: function (fromRow, rebuild) {
                function getVals(headers, tableLength) {
                    var rows = [], len = fromRow + this.maxrows > tableLength ? tableLength - fromRow : this.maxrows;
                    for (var a = 0; a < len; a++) {
                        rows[a] = a + fromRow;
                    }
                    wwManager({ cmd: "getVals", args: [rows, headers], title: this.tablename }, function (table) {
                        this.rowLength = tableLength;
                        this.colLength = headers.length;
                        this.db.headers = headers;
                        this.db.tabledata = table;
                        this.blankRowsBefore = fromRow;
                        this.fetchingData = false;
                        Vue.nextTick(function () {
                            this.selectCell(this.selectedCell[0] - this.blankRowsBefore, this.selectedCell[1]);
                        }.bind(this));
                    }.bind(this));
                }
                if (!this.fetchingData) {
                    this.fetchingData = true;
                    checkDBLoaded(function () {
                        if (this.db.headers.length > 0 && this.rowLength > 0 && !rebuild)
                            getVals.call(this, this.db.headers, this.rowLength);
                        else
                            wwManager({ cmd: "getLength", title: this.tablename }, function (tableLength) {
                                wwManager({ cmd: "getHeaders", title: this.tablename }, function (headers) {
                                    getVals.call(this, headers, tableLength);
                                }.bind(this));
                            }.bind(this));
                        if (this.db.datatypes.length === 0 || rebuild)
                            wwManager({ cmd: "getTypes", title: this.tablename }, function (types) {
                                this.db.datatypes = types;
                            }.bind(this));
                    }.bind(this));
                }
            },
            thAction: function (action, index) {
                function deleteCol() {
                    this.db.headers.splice(index, 1);
                    this.db.datatypes.splice(index, 1);
                    for (var a = 0, len = this.db.tabledata.length; a < len; a++) {
                        this.db.tabledata[a].splice(index + 1, 1);
                    }
                    //	this.db.options.searchable.splice(index, 1);
                }
                if (action === "insertColumnLeft") {
                    this.insertColumn(index);
                }
                else if (action === "insertColumnRight") {
                    this.insertColumn(index + 1);
                }
                else if (action === "deleteColumn") {
                    //check if column contains data
                    var data = false;
                    for (var a = 1, len = this.db.tabledata.length; a < len; a++) {
                        if (this.db.tabledata[a][index + 1]) {
                            data = true;
                            break;
                        }
                    }
                    if (!data)
                        deleteCol.call(this);
                    else
                        app.confirm("Are you sure you want to delete this column?", deleteCol.bind(this));
                }
                else if (action === "sortTable") {
                    wwManager({ cmd: "sortByCol", title: this.tablename, args: [this.db.headers[index]] }, function () {
                        this.fetchData(0);
                    }.bind(this));
                }
                else if (action === "editProps")
                    this.showPropsDialogBox = true;
            },
            insertColumn: function (index) {
                if (index === false) {
                    this.db.headers.push("");
                    this.db.datatypes.push("any");
                    for (var a = 0, len = this.db.tabledata.length; a < len; a++) {
                        this.db.tabledata[a].push("");
                    }
                    //	this.db.options.searchable.push(true);
                }
                else {
                    this.db.headers.splice(index, 0, "");
                    this.db.datatypes.splice(index, 0, "any");
                    for (var a = 0, len = this.db.tabledata.length; a < len; a++) {
                        this.db.tabledata[a].splice(index + 1, 0, "");
                    }
                    //	this.db.options.searchable.splice(index, 0, true);
                }
            },
            toggleValue: function (rowIndex, colIndex) {
                this.db.tabledata[rowIndex][colIndex] = !this.db.tabledata[rowIndex][colIndex];
            },
            onScroll: function (event) {
                var pos = event.target.scrollTop;
                if (!this.onScrollRunning && !this.fetchingData && (pos > this.scrollPos + 800 || pos < this.scrollPos - 500)) {
                    this.onScrollRunning = true;
                    this.scrollPos = pos;
                    var start = Math.floor(pos / 80) * 2; //makes sure to start at an even number
                    start = start < 16 ? 0 : start - 16; //render 16 rows above scrollTop
                    this.fetchData(start); //fetch x rows
                    window.setTimeout(function () { this.onScrollRunning = false; }.bind(this), 100);
                }
            },
            selectCell: function (row, column) {
                function sel(prevCellValidated) {
                    if (prevCellValidated) {
                        this.selectedCell = [row + this.blankRowsBefore, column];
                        this.selectedCellValue = this.db.tabledata[row][column];
                        this.selectedCellType = this.db.datatypes[column - 1];
                        if (input)
                            input[0].focus({ preventScroll: true });
                    }
                }
                if (row > -1) {
                    var input = document.getElementsByClassName("tableMultiInput");
                    if (this.selectedCell[0] > -1 && input)
                        this.validateValue({ value: input[0].value, type: this.selectedCellType }, sel.bind(this));
                    else
                        sel.call(this, true);
                }
            },
            setProperties: function () {
                this.showPropsDialogBox = false;
            },
            menuActions: function (action) {
                if (action === "toggleFullscreen") {
                    this.menuLinks[0].icon = this.fullscreen ? "icon-fullscreen" : "icon-resize-small";
                    this.fullscreen = !this.fullscreen;
                }
                else if (action === "importCSV") {
                    importFile(this.tablename, { fileExtension: "csv", overwrite: true }, function () { this.fetchData(0, true); }.bind(this));
                }
                else if (action === "addRow") {
                    debug("not done");
                    //TODO
                }
                else if (action === "importJSON") {
                    importFile(this.tablename, { fileExtension: "json", overwrite: false }, function () { this.fetchData(0, true); }.bind(this));
                }
                else if (action === "exportJSON") {
                    //TODO
                }
                else {
                    debug(action, "not done");
                }
            },
            validateValue: function (value, callback) {
                this.selectedCellValue = value.value;
                wwManager({
                    cmd: "validate", title: this.tablename, args: [value.value, value.type]
                }, function (updatedValue, error, errorDetails) {
                    if (error) {
                        this.invalidInput = true;
                        this.inputError = error;
                        if (errorDetails)
                            this.inputErrorDetails = errorDetails;
                    }
                    else {
                        this.invalidInput = false;
                        this.inputError = "";
                        this.inputErrorDetails = "";
                        this.db.tabledata[this.selectedCell[0] - this.blankRowsBefore][this.selectedCell[1]] = updatedValue;
                        if (callback instanceof Function)
                            callback(true, updatedValue);
                    }
                }.bind(this));
            }
        },
        template: "#editable-table"
    });
    var view1_page = Vue.extend({
        name: "View1Page",
        components: {
            "editable-table": editable_table
        },
        data: function () {
            return {
                sharedFileLink: ""
            };
        },
        methods: {
            externalLink: externalLink,
            generateListView: generateListView,
            createNewItem: createNewItem,
            shareFile: function (fileName, fileContents, password, expires) {
                Dbx.share(fileName, fileContents, password, expires, this.dbxShareCB);
            },
            dbxShareCB: function (response, response2, response3) {
                console.log("shared file", response, response2, response3);
                this.sharedFileLink = response.url;
            },
            receiveFile: function (fileName, password) {
                Dbx.receive(this.sharedFileLink, password, function (response, response2, response3) {
                    console.log("got file", response, response2, response3);
                });
            }
        },
        template: "#view1-page"
    });
    var view3_page = Vue.extend({
        name: "View3Page",
        methods: {
            generateListView: generateListView,
            importFile: importFile,
            createNewItem: createNewItem
        },
        template: "#view3-page"
    });
    var details_card_lineitem = Vue.extend({
        props: {
            item: {
                type: Object,
                default: function () {
                    return {
                        column: "",
                        orig: "",
                        text: [],
                        type: "any"
                    };
                }
            }
        },
        data: function () {
            return {};
        },
        methods: {
            externalLink: externalLink
        },
        template: "#details-card-lineitem"
    });
    var details_card = Vue.extend({
        components: {
            "details-card-lineitem": details_card_lineitem,
            "dropdown-button": dropdown_button
        },
        props: {
            details: {
                type: Object,
                default: function () {
                    return {
                        id: "",
                        table: "",
                        data: [{
                                column: "",
                                orig: "",
                                text: [],
                                type: "any"
                            }],
                        image: "",
                        title: "",
                        subtitle: "null"
                    };
                }
            }
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
                    },
                    {
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
                    },
                    {
                        text: "Delete",
                        icon: "icon-delete",
                        action: "delete"
                    }
                ],
                clipboard: function () {
                    return navigator.clipboard ? true : false;
                },
                copyDropdownLinks: []
            };
        },
        methods: {
            initializeGroups: function () {
                initializeGroups(function () {
                    this.groupsDropdownLinks = [];
                    for (var a = 0, len = app.groups.length; a < len; a++) {
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
                else if (action !== "_loading")
                    this.addToGroup(action, this.details);
            },
            initializeCopyActions: function () {
                function addToCopyLinks(item) {
                    if (item.text && item.text[0] && !item.hidden) {
                        this.copyDropdownLinks[b] = {
                            text: item.text.join("\r\n"),
                            action: item.text.join("\r\n")
                        };
                        if (this.copyDropdownLinks[b].text.length > 50)
                            this.copyDropdownLinks[b].text =
                                this.copyDropdownLinks[b].text.slice(0, 50) + "...";
                        b++;
                    }
                }
                var b = 0;
                for (var a = 0, len = this.details.data.length; a < len; a++) {
                    if (this.details.data[a].group && !this.details.data[a].hidden) {
                        for (var c = 0, lenC = this.details.data[a].group.length; c < lenC; c++)
                            addToCopyLinks.call(this, this.details.data[a].group[c]);
                    }
                    else
                        addToCopyLinks.call(this, this.details.data[a]);
                }
            },
            copyToClipboard: function (stringToCopy) {
                if (navigator.clipboard) {
                    try {
                        navigator.clipboard.writeText(stringToCopy);
                        var str = stringToCopy.slice(0, 20), ext = stringToCopy.length > 20 ? "..." : "";
                        app.notify("Copied '" + str + ext + "' to clipboard", true);
                    }
                    catch (err) {
                        console.error("Failed to copy: ", err);
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
                app.confirm("Are you sure that you want to delete " + this.details.title + "?", function () {
                    debug("delete not done");
                });
            },
            exportItem: function () {
                function saveFile(str, fileName, mimeType) {
                    function saveToWindows(str, fileName) {
                        // Verify that we are currently not snapped, or that we can unsnap to open the picker
                        var currentState = Windows.UI.ViewManagement.ApplicationView.value;
                        if (currentState ===
                            Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                            !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                            // Fail silently if we can't unsnap
                            debug("Some kind of Windows 8 bug prevented saving this file.");
                            return false;
                        }
                        // Create the picker object and set options
                        var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                        savePicker.suggestedStartLocation =
                            Windows.Storage.Pickers.PickerLocationId.Downloads;
                        // Dropdown of file types the user can save the file as
                        savePicker.fileTypeChoices.insert("JSON (Javascript Object Notation) File", [".json"]);
                        savePicker.fileTypeChoices.insert("Table of Comma Separated Values", [
                            ".csv"
                        ]);
                        savePicker.fileTypeChoices.insert("vCard Contact File", [".vcf"]);
                        savePicker.fileTypeChoices.insert("Plain Text", [".txt"]);
                        // Default file name if the user does not type one in or select a file to replace
                        savePicker.suggestedFileName = fileName;
                        return savePicker.pickSaveFileAsync().then(function (file) {
                            function setComplete() {
                                // Let Windows know that we're finished changing the file so the other app can update the remote version of the file.
                                // Completing updates may require Windows to ask for user input.
                                Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                                    if (updateStatus ===
                                        Windows.Storage.Provider.FileUpdateStatus.complete) {
                                        return true;
                                    }
                                    else {
                                        debug("File " + file.name + " couldn't be saved.");
                                        return false;
                                    }
                                });
                            }
                            if (file === undefined)
                                return false;
                            // Prevent updates to the remote version of the file until we finish making changes and call completeUpdatesAsync.
                            Windows.Storage.CachedFileManager.deferUpdates(file);
                            // write to file
                            Windows.Storage.FileIO.writeTextAsync(file, str).done(setComplete);
                            return true;
                        });
                    }
                    function saveToCordova(str, fileName) {
                        var fileApi = cordova.file, path;
                        if (fileApi.externalDataDirectory)
                            path = fileApi.externalDataDirectory;
                        //Android SD Card
                        else if (fileApi.documentsDirectory)
                            path = fileApi.documentsDirectory;
                        //iPhone
                        else
                            path = fileApi.dataDirectory; //Android
                        fileApi.writeFile(path, fileName, str, true);
                        return true;
                    }
                    function b64toBlob(b64Data, mimeType, sliceSize) {
                        mimeType = mimeType || "";
                        sliceSize = sliceSize || 512;
                        var byteCharacters = atob(b64Data);
                        var byteArrays = [];
                        for (var offset = 0, slice = void 0, byteNumbers = void 0, byteArray = void 0; offset < byteCharacters.length; offset += sliceSize) {
                            slice = byteCharacters.slice(offset, offset + sliceSize);
                            byteNumbers = new Array(slice.length);
                            for (var i = 0; i < slice.length; i++)
                                byteNumbers[i] = slice.charCodeAt(i);
                            byteArray = new Uint8Array(byteNumbers);
                            byteArrays.push(byteArray);
                        }
                        return new Blob(byteArrays, { type: mimeType });
                    }
                    function downloadToBrowser(str, fileName, mimeType) {
                        //create link
                        if (!mimeType)
                            mimeType = "text/plain";
                        var url = "", b64Img = /^data:image\/\w+;base64,/;
                        if (/Macintosh|iPad|iPod|iPhone/.test(navigator.userAgent)) {
                            //no blob support in safari
                            if (str.match(b64Img))
                                window.open(str, "_blank");
                            else
                                window.open("data:" + mimeType + ";base64," + escape(str), "_blank");
                        }
                        else {
                            if (Blob && (window.navigator.msSaveOrOpenBlob || URL && URL.createObjectURL)) {
                                var blobObject;
                                if (str.match(b64Img)) {
                                    str = str.replace(b64Img, "");
                                    blobObject = b64toBlob(str, mimeType, 512);
                                }
                                else
                                    blobObject = new Blob([str], { type: mimeType });
                                if (window.navigator.msSaveOrOpenBlob) {
                                    window.navigator.msSaveOrOpenBlob(blobObject, fileName);
                                    return true;
                                }
                                else if (URL && URL.createObjectURL) {
                                    url = URL.createObjectURL(blobObject);
                                }
                            }
                            else {
                                url =
                                    "data:" +
                                        mimeType +
                                        ";charset=utf-8," +
                                        encodeURIComponent(str);
                            }
                            var link = document.getElementById("hiddenDownloadLink");
                            if (link) {
                                link.download = fileName;
                                link.href = url;
                                link.click();
                            }
                            else {
                                var msg = "depends on a hidden link with id='hiddenDownloadLink'";
                                msg +=
                                    " <a id='hiddenDownloadLink' style='display:none' download='' href=''></a>";
                                msg +=
                                    " somewhere in the page to create a web browser download link";
                                debug("html download link missing", msg);
                                return false;
                            }
                            if (URL)
                                URL.revokeObjectURL(url);
                        }
                        return true;
                    }
                    if (Windows)
                        return saveToWindows.call(this, str, fileName);
                    else if (cordova && cordova.file)
                        return saveToCordova(str, fileName);
                    else
                        return downloadToBrowser.call(this, str, fileName, mimeType);
                }
                if (this.details.table === "Files") {
                    var contents, extension, name, type, hash;
                    for (var a = 0, i = void 0, aLen = this.details.data.length; a < aLen; a++) {
                        i = this.details.data[a];
                        if (i.column === "Extension")
                            extension = i.value[0];
                        if (i.column === "Display Name")
                            name = i.value[0];
                        if (i.column === "Type")
                            type = i.value[0];
                        if (i.column === "Hash")
                            hash = i.value[0];
                        if (i.column === "Compressed Contents")
                            contents = i.value[0];
                    }
                    if (hash === Base64.hash(Base64.hash(app.stoKey))) {
                        contents = Base64.read(contents, Base64.hash(app.stoKey));
                        return saveFile(contents, name, type || extension);
                    }
                    else {
                        var msg = "You do not have access to this file's contents";
                        app.notify(msg);
                        debug(msg, "hashes do not match");
                        return false;
                    }
                }
            },
            detailsViewHelp: function () {
                app.confirm("Item not found. Would you like to remove this listing?", function () {
                    app.recentlyViewed.splice(1, 1);
                    app.storeState();
                });
            },
            addToNewGroup: addToNewGroup,
            addToGroup: addToGroup
        },
        template: "#details-card"
    });
    var details_view_container = Vue.extend({
        components: {
            "details-card": details_card
        },
        props: {
            details: {
                type: Object,
                default: function () {
                    return {
                        id: "",
                        table: "",
                        data: [{
                                column: "",
                                orig: "",
                                text: [],
                                type: "any"
                            }],
                        image: "",
                        title: "",
                        subtitle: "null"
                    };
                }
            }
        },
        template: "#details-view-container"
    });
    var details_page = Vue.extend({
        name: "DetailsPage",
        components: {
            "details-card": details_card
        },
        data: function () {
            return {
                details: state.details
            };
        },
        template: "#details-page"
    });
    var recent_page = Vue.extend({
        name: "RecentPage",
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
                    title: null,
                    subtitle: null
                },
                detailsView: "v-a"
            };
        },
        watch: {
            // call again the method if the route changes
            $route: "fetchData"
        },
        created: function () {
            // fetch the data when the view is created and the data is
            // already being observed
            this.fetchData();
        },
        methods: {
            onDetailsUpdate: function (newDetailsObj) {
                this.detailsView = this.detailsView === "v-a" ? "v-b" : "v-a";
                this.recentDetails = newDetailsObj;
            },
            onRecentlyViewedUpdate: addToRecentlyViewed,
            addToNewGroup: addToNewGroup,
            fetchData: function () {
                if (this.recentlyViewed.length === 0) {
                    this.loading = true;
                    Sto.getItem("state", null, this.applyState, this.error);
                }
            },
            error: function (err) {
                this.loading = false;
                if (err)
                    console.log(err);
            },
            applyState: function (s, err) {
                if (s) {
                    this.loading = false;
                    if (typeof s === "string" && JSON.parse)
                        s = JSON.parse(s);
                    if (s.recentlyViewed && s.version === this.version) {
                        this.recentlyViewed = s.recentlyViewed;
                        state.recentlyViewed = this.recentlyViewed;
                    }
                }
                else
                    this.error(err);
            }
        },
        template: "#recent-page"
    });
    var search_results_page = Vue.extend({
        name: "SearchResultsPage",
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
                    title: null,
                    subtitle: null
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
    });
    var edit_details_card_lineitem = Vue.extend({
        props: {
            item: {
                type: Object,
                default: function () {
                    return {
                        column: "",
                        orig: "",
                        text: [],
                        type: "any"
                    };
                }
            }
        },
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
                this.item.label.text = value;
            },
            setValue: function (value) {
                this.item.text = [value];
            },
            clearValue: function () {
                this.item.text = [];
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
                wwManager({ cmd: "validate", title: "Groups", args: [value, valueType] }, function (result, error, errorDetails) {
                    if (result !== value)
                        this.setValue(result);
                    this.validationError = error || null;
                    this.validationErrorDetails = errorDetails;
                    this.valid = error ? false : true;
                }.bind(this));
            }
        },
        template: "#edit-details-card-lineitem"
    });
    var edit_details_card_collapse = Vue.extend({
        components: {
            "edit-details-card-lineitem": edit_details_card_lineitem
        },
        props: {
            item: {
                type: Object,
                default: function () {
                    return {
                        column: "",
                        orig: "",
                        text: [],
                        type: "any"
                    };
                }
            },
            collapse: {
                type: [Boolean, Number],
                default: false
            },
            show: {
                type: Number,
                default: 1
            }
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
                if (this.numShown === 0)
                    this.numShown = 1;
            },
            revealNext: function (num) {
                if (num && num !== true && num > 1)
                    this.numShown = this.numShown + num;
                else
                    this.numShown++;
            }
        },
        template: "#edit-details-card-collapse"
    });
    var edit_details_card = Vue.extend({
        props: {
            details: {
                type: Object,
                default: function () {
                    return {
                        id: "",
                        table: "",
                        data: [{
                                column: "",
                                orig: "",
                                text: [],
                                type: "any"
                            }],
                        image: "",
                        title: "",
                        subtitle: "null"
                    };
                }
            }
        },
        components: {
            "edit-details-card-lineitem": edit_details_card_lineitem,
            "edit-details-card-collapse": edit_details_card_collapse
        },
        methods: {
            saveChanges: function () {
                function checkComplete(n) {
                    if (n === 0) {
                        app.spin(false, "Saving...");
                        if (errors.length === 0)
                            app.navigate("details");
                        else
                            debug(errors, "errors saving changes");
                    }
                }
                function save(data, label) {
                    if (data.text) {
                        if (label) {
                            if (String(label.text) !== String(label.orig)) {
                                //set value
                                wwManager({
                                    cmd: "setVal",
                                    title: table,
                                    args: [rowId, label.column, label.text]
                                }, function (setValue, error) {
                                    if (error)
                                        errors.push(error);
                                    if (setValue) {
                                        label.orig = setValue;
                                        label.text = setValue;
                                    }
                                    checkComplete(--n);
                                });
                            }
                            else
                                checkComplete(--n);
                        }
                        var text;
                        //remove formatting
                        if (/multilineString|formattedAddress/.test(data.type)) {
                            text = data.text.join("\r\n");
                        }
                        else if (typeof data.text === "string")
                            text = data.splitter
                                ? data.text.join(data.splitter)
                                : data.text.join(" ::: ");
                        else
                            text = data.text[0];
                        if (text !== data.orig) {
                            //set value
                            wwManager({ cmd: "setVal", title: table, args: [rowId, data.column, text] }, function (setValue, error) {
                                if (error)
                                    errors.push(error);
                                if (setValue) {
                                    data.orig = setValue;
                                    data.text = formatValue(setValue, data.type, data.splitter);
                                }
                                checkComplete(--n);
                            });
                        }
                        else
                            checkComplete(--n);
                    }
                    else
                        checkComplete(--n);
                }
                var table = this.details.table, rowId = this.details.id, data = this.details.data, n = 0, errors = [];
                if (!rowId) {
                    app.spin(true, "Creating new item...");
                    //create array
                    wwManager({ cmd: "getHeaders", title: table }, function (headers) {
                        function setDefault(type) {
                            return /number|integer/i.test(type)
                                ? 0
                                : type === "boolean"
                                    ? false
                                    : "";
                        }
                        function addToObj(data) {
                            arr[headers.indexOf(data.column)] = [];
                            for (var b = 0, lenB = data.text.length; b < lenB; b++) {
                                arr[headers.indexOf(data.column)][b] = data.text[b];
                            }
                            if (data.type === "boolean" || /number|integer/i.test(data.type)) {
                                arr[headers.indexOf(data.column)] =
                                    arr[headers.indexOf(data.column)][0] || setDefault(data.type);
                            }
                            else
                                arr[headers.indexOf(data.column)] = arr[headers.indexOf(data.column)].join(" ::: ");
                            if (data.label) {
                                arr[headers.indexOf(data.label.column)] =
                                    data.label.text || setDefault(data.label.type);
                            }
                        }
                        var arr = new Array(headers.length);
                        for (var a = 0, b = 0, len = data.length, lenB = void 0; a < len; a++) {
                            if (data[a].group) {
                                for (b = 0, lenB = data[a].group.length; b < lenB; b++) {
                                    addToObj(data[a].group[b]);
                                }
                            }
                            else
                                addToObj(data[a]);
                        }
                        //	debug(arr, "creating new row");
                        for (var a = 0, len = arr.length; a < len; a++) {
                            if (arr[a] === undefined)
                                debug(arr[a], headers[a]);
                        }
                        wwManager({ cmd: "addRow", title: table, args: [arr] }, function (id, errors) {
                            if (errors)
                                debug(errors, id);
                            app.spin(false, "Creating new item...");
                        });
                    });
                }
                //go through data and find changes
                else {
                    app.spin(true, "Saving...");
                    //count lineItems
                    for (var a = 0, b = 0, len = data.length, lenB = void 0; a < len; a++) {
                        if (data[a].readonly)
                            continue;
                        if (data[a].group) {
                            if (data[a].group.readonly)
                                continue;
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
                    for (var a = 0, b = 0, len = data.length, lenB = void 0; a < len; a++) {
                        if (data[a].readonly)
                            continue;
                        if (data[a].group) {
                            if (data[a].group.readonly)
                                continue;
                            for (b = 0, lenB = data[a].group.length; b < lenB; b++) {
                                save(data[a].group[b], data[a].group[b].label);
                            }
                        }
                        else
                            save(data[a], data[a].label);
                    }
                }
            },
            cancelChanges: function () {
                debug("cancelChanges not done");
                app.navigate("details");
            }
        },
        template: "#edit-details-card"
    });
    var edit_details_page = Vue.extend({
        name: "EditDetailsPage",
        components: {
            "edit-details-card": edit_details_card
        },
        data: function () {
            return {
                details: state.details
            };
        },
        template: "#edit-details-page"
    });
    var page_not_found = {
        name: "PageNotFound",
        template: "#page-not-found"
    };
    Vue.use(VueRouter);
    var routes = [
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
                default: page_not_found
            },
            meta: {
                title: 'Page not found :( - Nyckel (Beta)'
            }
        }
    ];
    var router = new VueRouter({
        routes: routes
    });
    var app = new Vue({
        router: router,
        el: "#app",
        components: {
            "dropdown-button": dropdown_button,
            "icon-select": icon_select,
            "color-select": color_select
        },
        data: state,
        computed: {
            // a computed getter
            topLevelViews: function () {
                var ret = {};
                for (var navLink in this.views) {
                    if (views[navLink].level === 1)
                        ret[navLink] = this.views[navLink];
                }
                return ret;
            }
        },
        watch: {
            '$route': function (to, from) {
                var toDepth = to.query && to.query.page || 0;
                var fromDepth = from.query && from.query.page || 0;
                this.transitionName = toDepth > fromDepth ? 'forward' : 'back';
            }
        },
        mounted: function () {
            this.$router.afterEach(this.updateCurrentView);
            this.$router.beforeEach(function (to, from, next) {
                // This goes through the matched routes from last to first, finding the closest route with a title.
                // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
                var nearestWithTitle = to.matched.slice().reverse().find(function (r) { return r.meta && r.meta.title; });
                // If a route with a title was found, set the document (page) title to that value.
                if (nearestWithTitle)
                    document.title = nearestWithTitle.meta.title;
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
                            this.currentQuery = decodeURIComponent(to.query.search);
                            this.search(null, this.currentQuery);
                        }.bind(this));
                    }
                }
                function setPage() {
                    if (parseInt(to.query.page) !== backIndex)
                        backIndex = parseInt(to.query.page);
                    else
                        backIndex++;
                    location = location || backstack[backIndex];
                    backstack[backIndex - 1] = location;
                }
                if (window.location.hash.match(/^#\/access_token=/))
                    this.login();
                to = to || { name: this.$route.name, query: this.$route.query };
                var location = to.name;
                if (location === "home")
                    location = this.startView;
                if (location === "details")
                    seeDetails.call(this);
                this.currentView = this.views[location] || this.views[startView];
                setNavLinkIndicatorPosition(location);
                if (location === "groups")
                    initializeGroups();
                if (to.query && to.query.search)
                    search.call(this);
                if (to.query && to.query.page !== undefined)
                    setPage();
                else
                    backIndex = 0;
                //show hide back arrow
                if (Windows && WinJS) {
                    var currentview = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                    currentview.appViewBackButtonVisibility = backIndex < 1;
                }
                else
                    this.backArrow = backIndex > 0;
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
                        if (cordova || Windows && WinJS) { //suspend app
                            this.storeState();
                        }
                        return false;
                    }
                }
            },
            navigate: function (location, searchquery, detailsObj) {
                var query = { page: backIndex + 1 };
                if (searchquery) {
                    query.search = encodeURIComponent(searchquery);
                    if ("#/" + location + "?page=" + backIndex + "&search=" + query.search === window.location.hash)
                        return false; //dont navigate if no change
                }
                else if (detailsObj) {
                    query.id = detailsObj.id;
                    query.table = detailsObj.table;
                    if ("#/" + this.currentView.path +
                        "/" + location +
                        "?page=" + backIndex +
                        "&id=" + query.id +
                        "&table=" + query.table === window.location.hash)
                        return false; //dont navigate if no change
                }
                else if (location && "#/" + location + "?page=" + backIndex === window.location.hash)
                    return false; //dont navigate if no change				
                if (location)
                    this.$router.push({ path: "/" + location, query: query });
                else if (backstack[backIndex])
                    this.$router.push({ path: "/" + backstack[backIndex], query: query });
                else {
                    // get location from url hash
                    this.$router.push({ path: this.$route.path, query: this.$route.query });
                }
                return true;
            },
            toggle: function (prop) {
                if (this[prop] !== undefined)
                    this[prop] = this[prop] === true ? false : true;
                else
                    debug(prop, "not found");
            },
            toggleSettings: function () {
                this.toggle('showSettings');
                this.showSideNav = true;
            },
            storeState: function () {
                if (cordova || this.cookieAgree) {
                    setTimeout(function () {
                        Sto.setItem("state", {
                            version: this.version,
                            darkTheme: this.darkTheme,
                            useSystemTheme: this.useSystemTheme,
                            systemDarkTheme: this.systemDarkTheme,
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
            setTheme: function (event) {
                var theme = event.target.checked ? "dark " : "", htmlTag = document.getElementsByTagName("html")[0];
                htmlTag.className = trim(theme + htmlTag.className.replace(/dark\-theme/g, ""));
            },
            search: function (event, optionalQuery) {
                var searchBoxInputElement = document.getElementById("searchBox");
                if (!searchBoxInputElement)
                    return false;
                if (!this.showSearchBar) {
                    this.searchSuggestions = [];
                    searchBoxInputElement.focus();
                }
                else
                    this.showSearchSuggestions = true;
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
                        checkDBLoaded(function (nextInQueue) {
                            function displayResults(searchResults, errors, table) {
                                if (errors)
                                    debug(errors, "search error");
                                else if (searchResults)
                                    generateList(table, searchResults, null, function (list) {
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
                                                    if (l > 0)
                                                        this.searchResultsError = 'No results found for "' + this.currentQuery + '". Try searching for something else.';
                                                    else
                                                        this.searchResultsError = 'No data found';
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
                                            else
                                                this.navigate("search", this.currentQuery);
                                            if (nextInQueue instanceof Function)
                                                return nextInQueue();
                                        }
                                    }.bind(this));
                            }
                            var find = optionalQuery ? optionalQuery : this.searchAutoComplete === "" ? this.searchBox : this.searchAutoComplete, results = [], appElement = document.getElementById("app");
                            find = trim(find);
                            if (find) {
                                this.currentQuery = find;
                                this.resetSearch();
                                this.hideSearchBar = true;
                                setTimeout(function () { this.hideSearchBar = false; }.bind(this), 1000);
                                this.showSearchBar = false;
                                this.showSearchSuggestions = false;
                                if (appElement)
                                    appElement.focus();
                                var numOfSearches = 0, n = 0;
                                for (var t in dataTemplates) {
                                    if (dataTemplates.hasOwnProperty(t))
                                        numOfSearches++;
                                }
                                for (var table in dataTemplates) {
                                    (function (self, table) {
                                        wwManager({
                                            "cmd": "advancedSearch",
                                            "title": table,
                                            "args": [find, { colNames: searchableColumns, fuzzyMatch: true }]
                                        }, function (success, errors) { displayResults.call(self, success, errors, table); });
                                    })(this, table);
                                }
                            }
                            else if (nextInQueue instanceof Function)
                                return nextInQueue();
                        }.bind(this));
                    }
                }
                return true;
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
                var searchBoxInputElement = document.getElementById("searchBox");
                if (searchBoxInputElement)
                    searchBoxInputElement.focus();
            },
            searchKeyPress: function (e) {
                var keyCode = e.which || e.keyCode || 0;
                if (keyCode === 38 || keyCode === 40 || keyCode === 27 || keyCode === 13) {
                    e.preventDefault();
                }
                else {
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
                        var suggestions = [], str = String(value), numOfTables = 0, n = 0;
                        str = VAL.removeHTMLTags(str);
                        str = str.toLowerCase();
                        str = VAL.toEnglishAlphabet(str);
                        str = str.replace(/[^_a-z0-9\+\-]/gi, " ");
                        str = trim(str);
                        for (var t in dataTemplates) {
                            if (dataTemplates.hasOwnProperty(t))
                                numOfTables++;
                        }
                        for (var table in dataTemplates) {
                            wwManager({ "cmd": "getSearchSuggestions", "title": table, "args": [str, { colNames: searchableColumns }] }, displaySuggestions.bind(this));
                        }
                    }
                    else
                        checkDBLoaded(function (nextInQueue) {
                            if (nextInQueue instanceof Function)
                                return nextInQueue();
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
                        if (this.searchPointer > 0)
                            this.searchPointer--;
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
                        if (this.searchPointer > -1)
                            listElem.children[this.searchPointer].className = "link selected";
                    }
                }
                var keyCode = e.which || e.keyCode || 0;
                if (keyCode === 8) { //backspace
                    if (this.searchBox === "") {
                        this.searchPointer = -1;
                        this.searchSuggestions = [];
                        this.searchAutoComplete = "";
                    }
                }
                else if (keyCode === 9 || keyCode === 38 || keyCode === 40) { //tab, or up or down arrow
                    movePointer.call(this);
                }
                else if (keyCode === 32) { //space key
                    e.preventDefault();
                    this.searchSuggestions = [];
                    this.searchAutoComplete = "";
                }
                else {
                    this.searchBox = this.searchBox.slice(-1) === " " ? trim(this.searchBox) + " " : trim(this.searchBox);
                    if (keyCode === 13) { //enter key
                        this.search();
                    }
                    else if (keyCode === 27) { //escape key
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
                    if (callback instanceof Function)
                        return callback();
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
                    if (callback instanceof Function)
                        return callback();
                }
                if (autoFade || msg === "" || !msg) {
                    //hide message
                    if (msg === "" && new Date().getTime() - this.notifyActivated > timer)
                        timer = 0;
                    setTimeout(clearMsg.bind(this), timer);
                }
            },
            confirm: function (msg, callback, options) {
                this.confirmMsg = msg || "Are you sure?";
                this.confirmOK = options && options.ok ? options.ok : "OK";
                this.confirmCancel = options && options.cancel ? options.cancel : "Cancel";
                this.confirmDetails = options && options.details ? options.details : "";
                this.showConfirm = true;
                this.confirmFunction = callback;
            },
            processConfirm: function (bool) {
                this.showConfirm = false;
                this.showUpdateKey = false;
                if (bool && this.confirmFunction instanceof Function)
                    this.confirmFunction();
            },
            shakeConfirm: function () {
                this.confirmShake = true;
                setTimeout(function () { this.confirmShake = false; }.bind(this), 600);
            },
            spin: function (active, msg) {
                this.spinIndex = active ? this.spinIndex + 1 : this.spinIndex - 1;
                if (msg)
                    this.spinnerMsg[this.spinIndex] = msg;
                this.spinner = active || this.spinIndex > 0 ? true : false;
            },
            toggleUseSystemTheme: function () {
                matchSystemTheme();
                refreshResponsiveLayout();
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
                        if (callback instanceof Function)
                            callback(true);
                    }
                    function startScreen(error) {
                        console.log(error);
                        this.notify("Could not connect to Dropbox at the moment, please try again later", true);
                        // TODO go back to app
                        if (callback instanceof Function)
                            callback(false);
                    }
                    if (!Dbx || !Dbx.login)
                        Dbx = initiateDropbox(DROPBOX_CLIENT_ID, this.stoKey);
                    Dbx.login(null, welcome.bind(this), startScreen.bind(this)); //TODO login password ui
                }
                this.notify("Connecting to Dropbox, please wait...", false, login.bind(this));
            },
            logout: function (callback) {
                function logout() {
                    Dbx.logout(function () {
                        this.loggedIn = false;
                        this.dropboxUsername = "";
                        this.dropboxEmail = "";
                        this.notify("", true);
                        if (callback instanceof Function)
                            return callback();
                    }.bind(this));
                }
                if (Dbx && Dbx.isAuthenticated)
                    this.notify("Disconnecting from Dropbox", false, logout.bind(this));
                else if (callback instanceof Function)
                    return callback();
            },
            newStoKey: function () {
                var key = document.getElementById("stoKeyInput"), confirmKey = document.getElementById("stoKeyInputConfirm");
                checkDBLoaded(function (nextInQueue) {
                    if (key.value === "") {
                        this.stoKeyWarning = "Required";
                    }
                    else if (key.value.length < 8) {
                        this.stoKeyWarning = "8 characters minimum";
                    }
                    else if (!(/[A-Z]/.test(key.value) && /\d/.test(key.value) && /[a-z]/.test(key.value) && /[^A-z0-9]/.test(key.value))) {
                        this.stoKeyWarning = "Uppercase, lowercase, digit and special character required";
                    }
                    else if (key.value === confirmKey.value) {
                        this.stoKeyWarning = "";
                        var oldKey = this.stoKey;
                        if (dbid) {
                            oldKey = oldKey !== "unknown" ? oldKey : Base64.hash(dbid);
                            this.stoKey = Base64.hash(dbid + key.value);
                        }
                        else { //temp until depricate User.id
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
                    if (nextInQueue instanceof Function)
                        return nextInQueue();
                }.bind(this));
            },
            updateStoKey: function () {
                function storeKey(key, callback) {
                    this.storeState(); //save cached state with new stoKey
                    this.syncAll(null, { key: key, forceSync: true });
                    if (callback instanceof Function)
                        return callback();
                }
                this.showUpdateKey = true;
                this.confirm("Please input your current password", function () {
                    checkDBLoaded(function (nextInQueue) {
                        var key = document.getElementById("updateStoKeyInput");
                        if (dbid) {
                            this.stoKey = Base64.hash(dbid + key.value);
                        }
                        else
                            debug("use of dropboxEmail as a key has been depricated", "error"); //_this.stoKey = Base64.hash(_this.dropboxEmail + key.value);//temp until depricate User.id
                        return storeKey.call(this, this.stoKey, nextInQueue);
                    }.bind(this));
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
                            Dbx.save("/data/" + obj.title, obj.file, null, function () {
                                wwManager({ "cmd": "setSyncCompleted", "title": title, "args": [syncfile] }, function (success, error) {
                                    if (!success)
                                        debug(error, title + " setSyncComplete error");
                                    else
                                        console.log("sync complete");
                                    if (finalBool)
                                        this.spin(false, "Synchronising with Dropbox");
                                });
                            }, function (error) {
                                if (finalBool)
                                    this.spin(false, "Synchronising with Dropbox");
                                debug(error, "save file to Dropbox error");
                            });
                        }
                        else {
                            if (finalBool)
                                this.spin(false, "Synchronising with Dropbox");
                            if (!obj && errors) {
                                if (err)
                                    return;
                                err = true; //break until error fixed and try again
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
                            else
                                debug("no json returned to upload to dropbox");
                        }
                        syncfileNeedsUpdated = !syncfile || !syncfile[title] || obj ? true : syncfileNeedsUpdated;
                        if (b === count)
                            return cb(obj && obj.syncFile || JSON.stringify(syncfile));
                        else
                            b++;
                    }
                    function readFile(title, json, error, b) {
                        if (json === false && error !== undefined) {
                            if (b === count)
                                this.spin(false, "Synchronising with Dropbox");
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
                        //console.log("syncing...", json, options);
                        wwManager({ "cmd": "sync", "title": title, "args": [json, options] }, function (success, errors, obj) {
                            console.log("sunk", success, errors, obj);
                            done.call(this, success, errors, obj, title, b === count);
                        }.bind(this));
                    }
                    function download(title, b) {
                        Dbx.open("/data/" + title, null, function (json, error) {
                            readFile.call(this, title, json, error, b);
                        }.bind(this));
                    }
                    syncfile = syncfile || {};
                    //add templates to syncfile
                    for (var table in dataTemplates) {
                        if (dataTemplates.hasOwnProperty(table)) {
                            syncfile[table] = syncfile[table] || 0;
                            count++;
                        }
                    }
                    if (count === 0) {
                        return cb(syncfile);
                    }
                    var a = 1, b = 1;
                    for (var table in dataTemplates) {
                        if (!err && dataTemplates.hasOwnProperty(table)) {
                            (function (self, table) {
                                wwManager({ "cmd": "isSyncPending", "title": table, "args": [syncfile] }, function (requiresSync, errors) {
                                    if (!errors) {
                                        if (requiresSync === true) {
                                            download.call(self, table, b);
                                        }
                                        else if (a === count)
                                            return b++, cb(syncfile);
                                        else
                                            b++;
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
                        Sto.setItem("lastSyncAll", new Date().getTime());
                        this.spin(false, "Synchronising with Dropbox");
                    }
                    if (syncfileNeedsUpdated) {
                        Dbx.save("/sync/lastSync", syncfile, null, success.bind(this), failed.bind(this));
                    }
                    else
                        return success.call(this);
                }
                function readSyncfile(syncfile, error) {
                    if (error === undefined || error === "data not found" || error.match(/^path\/not_found/)) {
                        if (syncfile) {
                            syncfile = JSON.parse(syncfile);
                        }
                        else
                            console.log("no syncfile found " + error);
                        sync.call(this, syncfile, saveSyncfile.bind(this));
                    }
                    else {
                        if (error === "")
                            console.log("Sync failed, you are offline");
                        else
                            this.notify("Unhandled sync error: " + error);
                        this.spin(false, "Synchronising with Dropbox");
                    }
                }
                var err = false, count = 0, syncfileNeedsUpdated = false;
                if (!(Dbx && Dbx.isAuthenticated))
                    return console.log("cannot sync to Dropbox now");
                //else console.log("beginning sync");
                checkDBLoaded(function (nextInQueue) {
                    options = options || {};
                    options.initialKey = dbid ? Base64.hash(dbid) : /*this.dropboxEmail ? Base64.hash(this.dropboxEmail) :*/ null;
                    options.key = options.key ? options.key : this.stoKey === "unknown" ? options.initialKey : this.stoKey;
                    Sto.getItem("lastSyncAll", null, function (time) {
                        //debug(time);
                        if (new Date().getTime() - Number(time) > 3e5 || options.forceSync) { //5 minutes between sync attempts
                            this.spin(true, "Synchronising with Dropbox");
                            Dbx.open("/sync/lastSync", null, readSyncfile.bind(this));
                        }
                        else
                            console.log("db was recently synced");
                    }.bind(this), function () {
                        this.spin(true, "Synchronising with Dropbox");
                        Dbx.open("/sync/lastSync", null, readSyncfile.bind(this));
                    }.bind(this));
                    if (nextInQueue instanceof Function)
                        return nextInQueue();
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
                var loadingDiv = document.getElementById("loading");
                if (loadingDiv)
                    loadingDiv.className = "";
                state = freshStateObj();
                state.cookieAgree = true;
                for (var s in state) {
                    if (this[s])
                        this[s] = state[s];
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
                this.confirm("Are you sure you want to reset the app?", function reset() {
                    Sto.nuke();
                    this.logout(this.resetSettings);
                }.bind(this), { ok: "Reset App", details: msg });
            },
            wipeDropbox: function () {
                function onComplete(response, errors) {
                    console.log(response, errors);
                }
                var msg = "Do this if you are having synchronisation issues.This will not effect your locally saved app data, which can be restored to Dropbox";
                msg += " afterwards by clicking 'SYNC NOW' in Settings";
                this.confirm("Are you sure that you want to delete all of this app's data saved in your Dropbox account?", function () {
                    Dbx.delete("/sync", onComplete);
                    Dbx.delete("/data", onComplete);
                }, { ok: "Reset App Cloud Data", details: msg });
            }
        }
    });
    APP.goBack = app.goBack;
    window.onresize = refreshResponsiveLayout; //recalc layout on resize for a responsive experience
    if (Windows && WinJS) {
        console.log("Windows");
        state.windows = true;
        var winApp = WinJS.Application;
        var activation = Windows.ApplicationModel.Activation;
        var isFirstActivation = true;
        var uiSettings = new Windows.UI.ViewManagement.UISettings();
        var onVisibilityChanged = function ( /*args*/) {
            if (!document.hidden) {
                refreshResponsiveLayout();
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
                return app.goBack();
            };
            if (isFirstActivation) {
                startApp(); //and... GO!
                document.addEventListener("visibilitychange", onVisibilityChanged);
                uiSettings.addEventListener("colorvalueschanged", matchSystemTheme);
                args.setPromise(WinJS.UI.processAll());
            }
            isFirstActivation = false;
        };
        winApp.oncheckpoint = function ( /*args*/) {
            app.storeState();
        };
        winApp.start();
    }
    else if (cordova) {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    else
        startApp(); //and... GO!
    function onDeviceReady() {
        function onPause() {
            // This application has been suspended. Save application state here.
            app.storeState();
        }
        function onResume() {
            // This application has been reactivated. Restore application state here.
            startApp(true);
        }
        function onBack() {
            /* eslint-disable-next-line no-extra-parens */
            if (!app.goBack() && navigator && navigator.app && navigator.app.exitApp)
                navigator.app.exitApp();
        }
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause, false);
        document.addEventListener('resume', onResume, false);
        document.addEventListener('backbutton', onBack, false);
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        startApp(); //and... GO!
    }
}());
//# sourceMappingURL=main.js.map