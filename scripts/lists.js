var LISTSJSON = {
	"Fields":
	{
		"ablocalworkers": ["AB Local Workers", "ABL"],
		"aboverseasworkers": ["AB Overseas Workers", "ABO"],
		"barrheadftmcmurray": ["Barrhead/Ft McMurray", "B/FtM"],
		"calgarynorthcentral": ["Calgary Northcentral", "CNC"],
		"calgarynortheast": ["Calgary Northeast", "CNE"],
		"calgarynorthwest": ["Calgary Northwest", "CNW"],
		"calgarysouth": ["Calgary South", "CS"],
		"camrosestettler": ["Camrose/Stettler", "C/S"],
		"didsbury": ["Didsbury", "Did"],
		"edmontoneast": ["Edmonton East", "EE"],
		"edmontonnorthwest": ["Edmonton Northwest", "ENW"],
		"edmontonsouthwest": ["Edmonton Southwest", "ESW"],
		"edsonwhitecourt": ["Edson/Whitecourt", "E/W"],
		"ftstjohnyukon": ["Ft St John/Yukon", "FSJ"],
		"grandeprairie": ["Grande Prairie", "GP"],
		"highriverclaresholm": ["High River/Claresholm", "HR"],
		"lacomberimbey": ["Lacombe/Rimbey", "L/R"],
		"lethbridgepinchercreek": ["Lethbridge/Pincher Creek", "L/P"],
		"lloydminsterskfield": ["Lloydminster (sk Field)", "Llo"],
		"medicinehat": ["Medicine Hat", "MH"],
		"peaceriveryellowknife": ["Peace River/Yellowknife", "PR"],
		"reddeerrockymtnhouse": ["Red Deer/Rocky Mtn House", "RD"],
		"vermilionwainwright": ["Vermilion/Wainwright", "V/W"]
	},
	"Counties":
	{
		/* list of towns, cities, counties, municipalities in Alberta from google maps
	Tuscany
	Pincher Creek
	Downtown West End
	Jasper
	Downtown Calgary
	Taber
	Bragg Creek
	Didsbury
	Radisson Heights
	Banff
	Vegreville
	High River
	Bowness
	Turner Valley
	Irricana
	Inglewood
	Eau Claire
	Langdon
	Fort Chipewyan
	Viking
	Hounsfield Heights/Briar Hill
	Arrowwood
	Mission
	Woodlands
	Braeside
	Waterton Park
	Drumheller
	Halkirk
	New Dayton
	Stirlingville
	Stavely
	Forestburg
	Big Valley
	Bruderheim
	Milo
	Stirling
	Slave Lake
	Coaldale
	Foremost
	Bittern Lake
	Vauxhall
	Nobleford
	Sunnyside
	Carstairs
	Donalda
	Boyle
	Drayton Valley
	Innisfail
	Millrise
	Morinville
	Skiff
	Chinatown
	Beiseker
	Pineridge
	Dalhousie
	Barons
	Hinton
	Fairview
	Vermilion
	Erlton
	University Heights
	Alyth/Bonnybrook/Manchester
	Rimbey
	Trochu
	Orion
	Devon
	Whitecourt
	Mayerthorpe
	Fort Vermilion
	Kitscoty
	Chipman
	Thorsby
	Innisfree
	Arbour Lake
	St. Paul
	Exshaw
	Sunalta
	Edson
	Nemiscam
	Lamont
	Beaumont
	Peace River
	Oakridge
	Lac des Arcs
	Lake Louise
	Canmore
	Olds
	Rowley
	Red Deer County
	Peace No. 135
	Genesee
	Sylvan Lake
	Okotoks
	Grande Cache
	Holden
	New Brighton
	Falher
	Wildwood
	Beltline
	Girouxville
	Windermere
	Fort Macleod
	Etzikom
	Stettler
	Wrentham
	Bassano
	Gadsby
	Lansdowne
	High Level
	Magrath
	Monterey Park
	Bowden
	Renfrew
	Wheatland County
	Clearwater County
	Alix
	Bentley
	Bellevue
	Three Hills
	Cochrane
	Bankview
	Entwistle
	Strathcona County
	Penhold
	Evansburg
	Burdett
	Fox Creek
	Athabasca
	Bon Accord
	Vulcan
	Valleyview
	Hillhurst
	Cardston County
	Retlaw
	Rycroft
	Empress
	Brentwood
	Nisku
	Cardston
	Tofield
	Ryley
	Christie Park
	Champion
	Panorama Hills
	Calmar
	Bridgeland
	Lac La Biche
	High Prairie
	Beaverlodge
	Raymond
	Beaver County
	Mundare
	Picture Butte
	Breton
	Patterson
	Britannia
	Bashaw
	Blairmore
	South Calgary
	Hardisty
	Mayland Heights
	Martindale
	Blood 148
	Derwent
	Swalwell
	Strathcona Park
	Canyon Meadows
	Czar
	Kneehill County
	Penbrooke Meadows
	Coronation
	Symons Valley
	Gull Lake
	Palliser
	Blackie
	Sangudo
	Conrich
	Meadowlark Park
	Evanston
	Munson
	Shaganappi
	Mountain View County
	Kingsland
	Rosscarrock
	Riverbend
	West Springs
	Yellowhead County
	Whiskey Gap
	Longview
	Charleswood
	Warburg
	Legal
	Galahad
	Douglasdale/Douglasglen
	Grimshaw
	Delacour
	Balzac
	Vilna
	Hidden Valley
	Discovery Ridge
	Silver Springs
	Dewberry
	Duchess
	Heisler
	Nampa
	Bow Island
	Youngstown
	Marlborough
	Seba Beach
	Banff Trail
	Greenview
	Glamorgan
	Morley
	Rainbow Lake
	Edberg
	Shepard Industrial
	Mannville
	Marlborough Park
	Kelvin Grove
	Scenic Acres
	Cambrian Heights
	Cedarbrae
	Windsor Park
	Chinook Park
	Sedgewick
	Carbon
	Bel-Aire
	Berwyn
	Thorhild
	Forest Lawn
	Clairmont
	Varsity
	Sundance
	Wabamun
	Millet
	Morrin
	Tilley
	Richmond
	Falconridge
	Altadore
	Alliance
	Barnwell
	Crowsnest Pass
	Citadel
	Wainwright
	Irma
	Glenwood
	Beddington Heights
	Bonnyville
	Valley Ridge
	Northern Sunrise County
	Manyberries
	Elbow Park
	Blackfalds
	Ferintosh
	Cereal
	North Glenmore
	Nanton
	Strathmore
	Hythe
	MacEwan
	Coutts
	Wabasca Desmarais
	Tuxedo Park
	Thorncliffe
	Vermilion River County
	Hines Creek
	Manning
	Maybutt
	Shawnessy
	Elboya
	Delburne
	Scarboro
	St. Andrews Heights
	Killarney
	Coalhurst
	Crossfield
	Chauvin
	Sexsmith
	Coach Hill
	Carvel
	Point Mckay
	Beaver Mines
	Vulcan
	Royal Oak
	Hillspring
	Minburn
	Milk River
	Montgomery
	Roxboro
	Delia
	North Haven
	Killam
	Cremona
	Cranston
	McKenzie Towne
	Donnelly
	Cowley
	Ponoka County
	Barrhead
	Claresholm
	Veteran
	Clive Alberta
	Jefferson
	Spring Lake
	Mount Pleasant
	Strome
	Deer Ridge
	Somerset
	Crescent Heights
	Hussar
	Andrew
	Spruce Cliff
	Carmangay
	Chaparral
	Country Hills
	Consort
	Clear Hills County
	Gibbons
	Lakeview
	Provost
	Rockyford
	Lomond
	Bridlewood
	Mount Royal
	Southwood
	Sturgeon County
	Hughenden
	Wembley
	Hanna
	Cheadle
	McKenzie Lake
	Acme
	Copperfield
	Parkhill/Stanley Park
	Pump Hill
	Vulcan County
	Huntington Hills
	Sandstone Valley
	Signal Hill
	Deer Run
	Waskatenau
	Kinuso
	Lougheed
	West Hillhurst
	Haysboro
	Lincoln Park
	Chestermere
	Woodbine
	Cougar Ridge
	Saddle Ridge
	Caroline
	Paradise Valley
	Oyen
	Minburn County No. 27
	Bayview
	Big Lakes
	Rosedale
	Lake Bonavista
	Standard
	Westlock County
	Hay Lakes
	Crestmont
	Maple Ridge
	McLennan
	Warner
	Greenwood Greenbriar
	Castleridge
	Parkland
	Two Hills
	Coleman
	Rocky Ridge
	Highwood
	Edgemont
	Elk Point
	Shawnee Slopes
	Marwayne
	Rosalind
	Redwater
	Swan Hills
	Castor
	Hawkwood
	Springbank Hill
	Linden
	Granum
	Collingwood
	Clyde
	Taradale
	Harvie Heights
	Priddis
	Rocky Mountain House
	Evergreen
	Elkwater
	Mayfair
	Eckville
	Rosemont
	Redcliff
	New Sarepta
	Queensland
	Harvest Hills
	Alliance
	Barnwell
	Crowsnest Pass
	Citadel
	Wainwright
	Irma
	Glenwood
	Beddington Heights
	Bonnyville
	Valley Ridge
	Northern Sunrise County
	Manyberries
	Elbow Park
	Blackfalds
	Ferintosh
	Cereal
	North Glenmore
	Nanton
	Strathmore
	Hythe
	MacEwan
	Coutts
	Wabasca Desmarais
	Tuxedo Park
	Thorncliffe
	Vermilion River County
	Hines Creek
	Manning
	Maybutt
	Shawnessy
	Elboya
	Delburne
	Scarboro
	St. Andrews Heights
	Killarney
	Coalhurst
	Crossfield
	Chauvin
	Sexsmith
	Coach Hill
	Carvel
	Point Mckay
	Beaver Mines
	Vulcan
		 */
		"athabasca": "Athabasca County",
		"bondiss": "Athabasca County",
		"boyle": "Athabasca County",
		"island_lake": "Athabasca County",
		"island_lake_south": "Athabasca County",
		"mewatha_beach": "Athabasca County",
		"south_baptiste": "Athabasca County",
		"sunset_beach": "Athabasca County",
		"west_baptiste": "Athabasca County",
		"whispering_hills": "Athabasca County",
		"barrhead": "Barrhead County No 11",
		"holden": "Beaver County",
		"ryley": "Beaver County",
		"tofield": "Beaver County",
		"viking": "Beaver County",
		"high_prairie": "Big Lakes",
		"swan_hills": "Big Lakes",
		"ghost_lake": "Bighorn No 8",
		"waiparous": "Bighorn No 8",
		"canmore": ["Bighorn No 8", "Kananaskis Improvement District"],
		"bonnyville": "Bonnyville No 87",
		"bonnyville_beach": "Bonnyville No 87",
		"glendon": "Bonnyville No 87",
		"pelican_narrows": "Bonnyville No 87",
		"breton": "Brazeau County",
		"drayton_valley": "Brazeau County",
		"bashaw": "Camrose County",
		"bawlf": "Camrose County",
		"bittern Lake": "Camrose County",
		"edberg": "Camrose County",
		"ferintosh": "Camrose County",
		"hay_lakes": "Camrose County",
		"rosalind": "Camrose County",
		"cardston": "Cardston County",
		"glenwood": "Cardston County",
		"hill_spring": "Cardston County",
		"magrath": "Cardston County",
		"cleardale": "Clear Hills County",
		"hines_creek": "Clear Hills County",
		"burnstick_lake": "Clearwater County",
		"caroline": "Clearwater County",
		"rocky_mountain_house": "Clearwater County",
		"redcliff": "Cypress County",
		"fairview": "Fairview No 136",
		"alliance": "Flagstaff County",
		"daysland": "Flagstaff County",
		"forestburg": "Flagstaff County",
		"galahad": "Flagstaff County",
		"hardisty": "Flagstaff County",
		"heisler": "Flagstaff County",
		"killam": "Flagstaff County",
		"lougheed": "Flagstaff County",
		"sedgewick": "Flagstaff County",
		"strome": "Flagstaff County",
		"black_diamond": "Foothills No 31",
		"high_river": "Foothills No 31",
		"longview": "Foothills No 31",
		"okotoks": "Foothills No 31",
		"turner_valley": "Foothills No 31",
		"bow_island": "Forty Mile County No 8",
		"foremost": "Forty Mile County No 8",
		"beaverlodge": "Grande Prairie County No 1",
		"hythe": "Grande Prairie County No 1",
		"sexsmith": "Grande Prairie County No 1",
		"wembley": "Grande Prairie County No 1",
		"fox_creek": "Greenview No 16",
		"grande_cache": "Greenview No 16",
		"valleyview": "Greenview No 16",
		"banff": "Improvement District No 9",
		"acme": "Kneehill County",
		"carbon": "Kneehill County",
		"linden": "Kneehill County",
		"three_hills": "Kneehill County",
		"trochu": "Kneehill County",
		"drumheller": ["Kneehill County", "Special Area No 2", "Starland County", "Wheatland County"],
		"alberta_beach": "Lac Ste. Anne County",
		"birch_cove": "Lac Ste. Anne County",
		"castle_island": "Lac Ste. Anne County",
		"mayerthorpe": "Lac Ste. Anne County",
		"nakamun_park": "Lac Ste. Anne County",
		"onoway": "Lac Ste. Anne County",
		"ross_haven": "Lac Ste. Anne County",
		"sandy_beach": "Lac Ste. Anne County",
		"silver_sands": "Lac Ste. Anne County",
		"south_view": "Lac Ste. Anne County",
		"sunrise_beach": "Lac Ste. Anne County",
		"sunset_point": "Lac Ste. Anne County",
		"val_quentin": "Lac Ste. Anne County",
		"west_cove": "Lac Ste. Anne County",
		"yellowstone": "Lac Ste. Anne County",
		"alix": "Lacombe County",
		"bentley": "Lacombe County",
		"birchcliff": "Lacombe County",
		"blackfalds": "Lacombe County",
		"clive": "Lacombe County",
		"eckville": "Lacombe County",
		"gull_lake": "Lacombe County",
		"half_moon_bay": "Lacombe County",
		"sunbreaker_cove": "Lacombe County",
		"andrew": "Lamont County",
		"bruderheim": "Lamont County",
		"chipman": "Lamont County",
		"lamont": "Lamont County",
		"mundare": "Lamont County",
		"beaumont": "Leduc County",
		"calmar": "Leduc County",
		"devon": "Leduc County",
		"golden_days": "Leduc County",
		"itaska_beach": "Leduc County",
		"sundance_beach": "Leduc County",
		"thorsby": "Leduc County",
		"warburg": "Leduc County",
		"slave_lake": "Lesser Slave River No 124",
		"barons": "Lethbridge County",
		"coaldale": "Lethbridge County",
		"coalhurst": "Lethbridge County",
		"nobleford": "Lethbridge County",
		"Picture_butte": "Lethbridge County",
		"high_level": "Mackenzie County",
		"rainbow_lake": "Mackenzie County",
		"fort_vermilion": "Mackenzie County",
		"la_crete": "Mackenzie County",
		"zama_city": "Mackenzie County",
		"innisfree": "Minburn County No 27",
		"mannville": "Minburn County No 27",
		"minburn": "Minburn County No 27",
		"vegreville": "Minburn County No 27",
		"carstairs": "Mountain View County",
		"cremona": "Mountain View County",
		"didsbury": "Mountain View County",
		"olds": "Mountain View County",
		"sundre": "Mountain View County",
		"bassano": "Newell County",
		"duchess": "Newell County",
		"rosemary": "Newell County",
		"manning": "Northern Lights County",
		"peace_river": ["Northern Lights County", "Northern Sunrise County", "Peace No 135"],
		"nampa": "Northern Sunrise County",
		"castor": "Paintearth County No 18",
		"coronation": "Paintearth County No 18",
		"halkirk": "Paintearth County No 18",
		"betula_beach": "Parkland County",
		"kapasiwin": "Parkland County",
		"lakeview": "Parkland County",
		"point_alison": "Parkland County",
		"seba_beach": "Parkland County",
		"spring_lake": "Parkland County",
		"stony_plain": "Parkland County",
		"wabamun": "Parkland County",
		"berwyn": "Peace No 135",
		"grimshaw": "Peace No 135",
		"cowley": "Pincher Creek No 9",
		"lundbreck": "Pincher Creek No 9",
		"pincher_creek": "Pincher Creek No 9",
		"parkland_beach": "Ponoka County",
		"ponoka": "Ponoka County",
		"rimbey": "Ponoka County",
		"amisk": "Provost No 52",
		"czar": "Provost No 52",
		"hughenden": "Provost No 52",
		"provost": "Provost No 52",
		"bowden": "Red Deer County",
		"delburne": "Red Deer County",
		"elnora": "Red Deer County",
		"innisfail": "Red Deer County",
		"jarvis_bay": "Red Deer County",
		"norglenwold": "Red Deer County",
		"penhold": "Red Deer County",
		"sylvan_lake": "Red Deer County",
		"beiseker": "Rocky View County",
		"cochrane": "Rocky View County",
		"crossfield": "Rocky View County",
		"irricana": "Rocky View County",
		"smoky_lake": "Smoky Lake County",
		"vilna": "Smoky Lake County",
		"waskatenau": "Smoky Lake County",
		"donnelly": "Smoky River No 130",
		"falher": "Smoky River No 130",
		"girouxville": "Smoky River No 130",
		"mcLennan": "Smoky River No 130",
		"empress": "Special Area No 2",
		"hanna": "Special Area No 2",
		"cereal": "Special Area No 3",
		"oyen": "Special Area No 3",
		"youngstown": "Special Area No 3",
		"consort": "Special Area No 4",
		"veteran": "Special Area No 4",
		"rycroft": "Spirit River No 133",
		"spirit River": "Spirit River No 133",
		"elk Point": "St Paul County No 19",
		"horseshoe_bay": "St Paul County No 19",
		"st_paul": "St Paul County No 19",
		"delia": "Starland County",
		"morrin": "Starland County",
		"munson": "Starland County",
		"big_valley": "Stettler County No 6",
		"botha": "Stettler County No 6",
		"donalda": "Stettler County No 6",
		"gadsby": "Stettler County No 6",
		"rochon Sands": "Stettler County No 6",
		"stettler": "Stettler County No 6",
		"white_sands": "Stettler County No 6",
		"antler_lake": "Strathcona County",
		"ardrossan": "Strathcona County",
		"collingwood_cove": "Strathcona County",
		"half_moon_lake": "Strathcona County",
		"hastings_lake": "Strathcona County",
		"josephburg": "Strathcona County",
		"north_cooking_lake": "Strathcona County",
		"sherwood_park": "Strathcona County",
		"south_cooking_lake": "Strathcona County",
		"bon_accord": "Sturgeon County",
		"gibbons": "Sturgeon County",
		"legal": "Sturgeon County",
		"morinville": "Sturgeon County",
		"redwater": "Sturgeon County",
		"barnwell": "Taber",
		"taber": "Taber",
		"vauxhall": "Taber",
		"myrnam": "Two Hills County No 21",
		"two_hills": "Two Hills County No 21",
		"willingdon": "Two Hills County No 21",
		"dewberry": "Vermilion River County",
		"kitscoty": "Vermilion River County",
		"marwayne": "Vermilion River County",
		"paradise_valley": "Vermilion River County",
		"vermilion": "Vermilion River County",
		"arrowwood": "Vulcan County",
		"carmangay": "Vulcan County",
		"champion": "Vulcan County",
		"lomond": "Vulcan County",
		"milo": "Vulcan County",
		"vulcan": "Vulcan County",
		"chauvin": "Wainwright No 61",
		"edgerton": "Wainwright No 61",
		"irma": "Wainwright No 61",
		"wainwright": "Wainwright No 61",
		"coutts": "Warner County No 5",
		"milk_river": "Warner County No 5",
		"raymond": "Warner County No 5",
		"stirling": "Warner County No 5",
		"warner": "Warner County No 5",
		"clyde": "Westlock County",
		"larkspur": "Westlock County",
		"westlock": "Westlock County",
		"argentia_beach": "Wetaskiwin County No 10",
		"crystal_springs": "Wetaskiwin County No 10",
		"grandview": "Wetaskiwin County No 10",
		"ma-me-o_beach": "Wetaskiwin County No 10",
		"millet": "Wetaskiwin County No 10",
		"norris_beach": "Wetaskiwin County No 10",
		"poplar_bay": "Wetaskiwin County No 10",
		"silver_beach": "Wetaskiwin County No 10",
		"hussar": "Wheatland County",
		"rockyford": "Wheatland County",
		"standard": "Wheatland County",
		"strathmore": "Wheatland County",
		"claresholm": "Willow Creek No 26",
		"fort_macleod": "Willow Creek No 26",
		"granum": "Willow Creek No 26",
		"nanton": "Willow Creek No 26",
		"stavely": "Willow Creek No 26",
		"Whitecourt": "Woodlands County",
		"edson": "Yellowhead County",
		"hinton": "Yellowhead County",
		"airdrie": ["Rocky View County", "Airdrie"],
		"brooks": ["Newell County No 4", "Brooks"],
		"calgary": ["Rocky View County", "Foothills No 31", "Calgary"],
		"camrose": ["Camrose County No 22", "Camrose"],
		"chestermere": ["Rocky View County", "Chestermere"],
		"cold_lake": ["Bonnyville No 87", "Cold Lake"],
		"edmonton": ["Strathcona County", "Sturgeon County", "Parkland County", "Leduc County", "Edmonton"],
		"fort_saskatchewan": ["Strathcona County", "Sturgeon County", "Fort Saskatchewan"],
		"grande_prairie": ["Grande Prairie County No 1", "Grande Prairie"],
		"lacombe": ["Lacombe County", "Lacombe"],
		"leduc": ["Leduc County", "Leduc"],
		"lethbridge": ["Lethbridge County", "Lethbridge"],
		"lloydminster": ["Vermilion River County No 24", "Lloydminster"],
		"medicine_hat": ["Cypress County", "Medicine Hat"],
		"red_deer": ["Red Deer County", "Red Deer"],
		"spruce_grove": ["Parkland County", "Spruce Grove"],
		"st_albert": ["Sturgeon County", "St Albert"],
		"wetaskiwin": ["Wetaskiwin County No 10", "Wetaskiwin"]
	},
	"Import":
	{
		"ABAddressBook":
		{
			"oldHeaders":
			[
				"FirstNames",
				"LastName",
				"Children",
				"City",
				"FieldName",
				"Address",
				"PostalCode",
				"Location",
				"Directions",
				"Directions2",
				"Phone1",
				"Phone2",
				"Phone3",
				"Phone4",
				"Phone5",
				"Fax",
				"Extra",
				"Notes",
				"Category"
			],
			"Headers":
			[
				"Name",
				"GivenName",
				"AdditionalName",
				"FamilyName",
				"YomiName",
				"GivenNameYomi",
				"AdditionalNameYomi",
				"FamilyNameYomi",
				"NamePrefix",
				"NameSuffix",
				"Initials",
				"Nickname",
				"ShortName",
				"MaidenName",
				"Birthday",
				"Gender",
				"Location",
				"BillingInformation",
				"DirectoryServer",
				"Mileage",
				"Occupation",
				"Hobby",
				"Sensitivity",
				"Priority",
				"Subject",
				"Notes",
				"GroupMembership",
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
				"Phone1_Type",
				"Phone1_Value",
				"Phone2_Type",
				"Phone2_Value",
				"Phone3_Type",
				"Phone3_Value",
				"Phone4_Type",
				"Phone4_Value",
				"Phone5_Type",
				"Phone5_Value",
				"Phone6_Type",
				"Phone6_Value",
				"Phone7_Type",
				"Phone7_Value",
				"Phone8_Type",
				"Phone8_Value",
				"Phone9_Type",
				"Phone9_Value",
				"Phone10_Type",
				"Phone10_Value",
				"Address1_Type",
				"Address1_Formatted",
				"Address1_Street",
				"Address1_City",
				"Address1_POBox",
				"Address1_Region",
				"Address1_PostalCode",
				"Address1_Country",
				"Address1_ExtendedAddress",
				"Address2_Type",
				"Address2_Formatted",
				"Address2_Street",
				"Address2_City",
				"Address2_POBox",
				"Address2_Region",
				"Address2_PostalCode",
				"Address2_Country",
				"Address2_ExtendedAddress",
				"Organization1_Type",
				"Organization1_Name",
				"Organization1_YomiName",
				"Organization1_Title",
				"Organization1_Department",
				"Organization1_Symbol",
				"Organization1_Location",
				"Organization1_JobDescription"
			]
		},
		"CordovaContact": {
			"Object": {// Android, BlackBerry 10, iOS, Windows Phone 7, 8, 8.1 and Windows 10 
				"id": null,//A globally unique identifier. Blackberry 10 assigns id on save. DOMString
				"rawId": null,//A globally unique identifier. DOMString
				"displayName": "",//Not supported in iOS, use 'nickname'. The name of this Contact, suitable for display to end users. DOMString
				"name"://An object containing all components of a persons name. ContactName Object
				{
					"formatted": "",
					"familyName": "",
					"givenName": "",
					"middleName": "",
					"honorificPrefix": "",
					"honorificSuffix": ""
				},
				"nickname": "",     //A casual name by which to address the contact. _(DOMString)_
				"phoneNumbers": [ //An array of all the contact's phone number. _ContactField_
					{
						"id": null,
						"type": "",
						"value": "",
						"pref": false
					}
				],
				"emails": [ //An array of all the contact's email addresses. _(ContactField[])_
					{
						"id": null,
						"type": "",
						"value": "",
						"pref": false
					}
				],
				"addresses": [ //An array of all the contact's addresses. _(ContactAddress)_
					{
						"id": null,
						"pref": false,// Set to `true` if this `ContactAddress` contains the user's preferred value. _(boolean)_
						"type": "",// A string indicating what type of field this is, _home_ for example. _(DOMString)_
						"formatted": "",//The full address formatted for display. _(DOMString)_
						"streetAddress": "",//The full street address. _(DOMString)_
						"locality": "",//The city or locality. _(DOMString)_
						"region": "",//The state or region. _(DOMString)_
						"postalCode": "",//The zip code or postal code. _(DOMString)_
						"country": ""//The country name. _(DOMString)_
					}
				],
				"ims": [ //An array of all the contact's IM addresse. _ContactField_
					{
						"id": null,
						"type": "",
						"value": "",
						"pref": false
					}
				],
				"organizations": [ //An array of all the contact's organization. _ContactOrganization_
					{
						"id": null,
						"pref": false,
						"type": "",
						"name": "",
						"department": "",
						"title": ""
					}
				],
				"birthday": new Date(), //iOS, input as javascript Date object. The birthday of the contact. _(Date)_
				"note": "",         //A note about the contact. _(DOMString)_
				"photos": [ //An array of the contact's photo. _(ContactField)_
					{
						"id": null,
						"type": "",
						"value": "",
						"pref": false
					}
				],
				"categories": [ //Not supported in Android 2.X, or iOS. An array of all the user-defined categories associated with the contact. _(ContactField_
					{
						"id": null,
						"type": "",
						"value": "",
						"pref": false
					}
				],
				"urls": [ //Windows Phone 7 and 8 can save more than 1 url, but only 1 is available when searching the contact. 
					//An array of web pages associated with the contact. _(ContactField_
					{
						"id": null,
						"type": "",
						"value": "",
						"pref": false
					}
				]
			}
		}
	},
	"Export":
	{
		"HotmailContacts":
		{
			"column":
			[
				{ "_num": "00", "_name": "Title", "__text": "Title" },
				{ "_num": "01", "_name": "First Name", "__text": "GivenName" },
				{ "_num": "02", "_name": "Middle Name" },
				{ "_num": "03", "_name": "Last Name", "__text": "FamilyName" },
				{ "_num": "04", "_name": "Suffix" },
				{ "_num": "05", "_name": "Company" },
				{ "_num": "06", "_name": "Department" },
				{ "_num": "07", "_name": "Job Title" },
				{ "_num": "08", "_name": "Business Street" },
				{ "_num": "09", "_name": "Business City" },
				{ "_num": "10", "_name": "Business State" },
				{ "_num": "11", "_name": "Business Postal Code" },
				{ "_num": "12", "_name": "Business Country" },
				{ "_num": "13", "_name": "Home Street", "__text": "Address" },
				{ "_num": "14", "_name": "Home City", "__text": "City" },
				{ "_num": "15", "_name": "Home State" },
				{ "_num": "16", "_name": "Home Postal Code", "__text": "PostalCode" },
				{ "_num": "17", "_name": "Home Country" },
				{ "_num": "18", "_name": "Business Fax" },
				{ "_num": "19", "_name": "Business Phone" },
				{ "_num": "20", "_name": "Business Phone 2" },
				{ "_num": "21", "_name": "Callback" },
				{ "_num": "22", "_name": "Car Phone" },
				{ "_num": "23", "_name": "Company Main Phone" },
				{ "_num": "24", "_name": "Home Fax", "__text": "Fax" },
				{ "_num": "25", "_name": "Home Phone", "__text": "Phone1" },
				{ "_num": "26", "_name": "Home Phone 2", "__text": "Phone2" },
				{ "_num": "27", "_name": "ISDN" },
				{ "_num": "28", "_name": "Mobile Phone", "__text": "Mobile" },
				{ "_num": "29", "_name": "Other Fax" },
				{ "_num": "30", "_name": "Other Phone", "__text": "Phone3" },
				{ "_num": "31", "_name": "Pager" },
				{ "_num": "32", "_name": "Primary Phone", "__text": "Phone1" },
				{ "_num": "33", "_name": "Radio Phone" },
				{ "_num": "34", "_name": "TTY/TDD Phone" },
				{ "_num": "35", "_name": "Telex" },
				{ "_num": "36", "_name": "Account" },
				{ "_num": "37", "_name": "Anniversary" },
				{ "_num": "38", "_name": "Assistant's Name" },
				{ "_num": "39", "_name": "Billing Information" },
				{ "_num": "40", "_name": "Birthday" },
				{ "_num": "41", "_name": "Business Address PO Box" },
				{ "_num": "42", "_name": "Categories", "__text": "Category" },
				{ "_num": "43", "_name": "Children", "__text": "Children" },
				{ "_num": "44", "_name": "Company Yomi" },
				{ "_num": "45", "_name": "Directory Server" },
				{ "_num": "46", "_name": "E-mail Address" },
				{ "_num": "47", "_name": "E-mail Type" },
				{ "_num": "48", "_name": "E-mail Display Name" },
				{ "_num": "49", "_name": "E-mail 2 Address" },
				{ "_num": "50", "_name": "E-mail 2 Type" },
				{ "_num": "51", "_name": "E-mail 2 Display Name" },
				{ "_num": "52", "_name": "E-mail 3 Address" },
				{ "_num": "53", "_name": "E-mail 3 Type" },
				{ "_num": "54", "_name": "E-mail 3 Display Name" },
				{ "_num": "55", "_name": "Gender" },
				{ "_num": "56", "_name": "Given Yomi" },
				{ "_num": "57", "_name": "Government ID Number" },
				{ "_num": "58", "_name": "Hobby" },
				{ "_num": "59", "_name": "Home Address PO Box" },
				{ "_num": "60", "_name": "Initials" },
				{ "_num": "61", "_name": "Internet Free Busy" },
				{ "_num": "62", "_name": "Keywords" },
				{ "_num": "63", "_name": "Language" },
				{ "_num": "64", "_name": "Location", "__text": "Location" },
				{ "_num": "65", "_name": "Manager's Name" },
				{ "_num": "66", "_name": "Mileage" },
				{ "_num": "67", "_name": "Notes", "__text": "Notes + Directions + Directions2" },
				{ "_num": "68", "_name": "Office Location" },
				{ "_num": "69", "_name": "Organizational ID Number" },
				{ "_num": "70", "_name": "Other Address PO Box" },
				{ "_num": "71", "_name": "Priority" },
				{ "_num": "72", "_name": "Private" },
				{ "_num": "73", "_name": "Profession" },
				{ "_num": "74", "_name": "Referred By" },
				{ "_num": "75", "_name": "Sensitivity" },
				{ "_num": "76", "_name": "Spouse" },
				{ "_num": "77", "_name": "Surname Yomi" },
				{ "_num": "78", "_name": "User 1" },
				{ "_num": "79", "_name": "User 2" },
				{ "_num": "80", "_name": "Web Page" }
			]
		}
	}
},
	Spelling = {
		"CreatedDate": "1384928365563",
		"b": "barrhead",
		"bc": "british_columbia bc",
		"c": "camrose",
		"calg": "calgary",
		"cl": "claresholm",
		"cnc": "calgary_northcentral",
		"cne": "calgary_northeast",
		"cnw": "calgary_northwest",
		"conv": "convention conv",
		"convention": "conv convention",
		"cs": "calgary_south",
		"d": "didsbury",
		"did": "didsbury",
		"dids": "didsbury",
		"e": "edson east",
		"edm": "edmonton",
		"ee": "edmonton_east",
		"enw": "edmonton_northwest",
		"esw": "edmonton_southwest",
		"fm": "fort_mcmurray ft_mcmurray",
		"fort": "fort ft",
		"fsj": "ft_st_john fort_st_john fort_saint_john fsj",
		"ft": "fort ft",
		"ftm": "fort_mcmurray ft_mcmurray",
		"f": "fort_mcmurray ft_mcmurray",
		"gp": "grande_prairie",
		"hr": "high_river",
		"l": "lethbridge lacombe",
		"la": "lacombe",
		"le": "lethbridge",
		"ll": "lloydminster",
		"llo": "lloydminster",
		"mh": "medicine_hat",
		"mountain": "mtn mountain",
		"mtn": "mountain mtn",
		"n": "north northeast northwest northcentral north_central",
		"nc": "northcentral north_central",
		"ne": "northeast",
		"nw": "northwest",
		"p": "pincher_creek",
		"pc": "pincher_creek",
		"pr": "peace_river",
		"r": "rimbey",
		"rd": "red_deer road rd",
		"rmh": "rocky_mtn_house rocky_mountain_house rocky",
		"s": "stettler south southeast southwest",
		"se": "southeast",
		"sk": "saskatchewan sk",
		"sw": "southwest",
		"st": "stettler saint st street",
		"v": "vermilion",
		"w": "whitecourt wainwright west",
		"wa": "wainwright",
		"wh": "whitecourt",
		"y": "yellowknife",
		"yk": "yukon yk",

		/*long a*/
		/*abe*/	"abe": "abe abraham abram bram",
		/*abe*/	"abraham": "abe abraham abram bram",
		/*abe*/	"abram": "abe abraham abram bram",

		/*see egg*/

		/*ale*/	"alayne": "elaine alayne",

		/*aid*/	"ada": "ada",

		/*aid*/	"aden": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/ "adin": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"aedan": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"aidan": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"aiden": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"aidyn": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"aydan": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"ayden": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
		/*aid*/	"aydin": "aden adin aedan aidan aiden aidyn aydan ayden aydin",

		/*aid*/	"adrianna": "adrianna",

		/*aim*/	"aimee": "aimee amie amy",
		/*aim*/	"amie": "aimee amie amy",
		/*aim*/	"amy": "aimee amie amy",

		/*aim*/	"amos": "amos",

		/*aine*/	"ainsley": "ainsley",

		/*aish*/ "aisha": "aisha",

		/*aiv*/ "ava": "ava eva",

		/*aiv*/ "aven": "aven avonlea",
		/*aiv*/ "avonlea": "aven avonlea",

		/*aiv*/ "avery": "avery avory ayverie",
		/*aiv*/ "avory": "avery avory ayverie",
		/*aiv*/ "ayverie": "avery avory ayverie",

		/*ape*/ "april": "april",

		/*short a*/

		/*ab*/ "abbie": "abbie abby abigail",
		/*ab*/ "abby": "abie abbie abby abigail",
		/*ab*/ "abie": " abie abby abbie abigail",

		/*ab*/ "abigail": "abbie abby abigail gale gayle gail",

		/*add*/ "ad": "ad ade",
		/*add*/ "ade": "ad ade",

		/*add*/ "adam": "adam",

		/*add*/ "adaline": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "addie": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "addy": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "adela": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "adelaide": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "adele": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "adeline": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "adell": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "adelle": "adaline addie addy adela adelaide adele adeline adell adelle edel",
		/*add*/ "edel": "ad ada adaline addie addy ade adela adelaide adele adeline adell adelle edel",

		/*add*/ "adasyn": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "addeson": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "addison": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "addisyn": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "addyson": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "adison": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "adisson": "adasyn addeson addison addisyn addyson adison adisson adyson",
		/*add*/ "adyson": "adasyn addeson addison addisyn addyson adison adisson adyson",

		/*af*/ "afton": "afton",

		/*air*/ "erin": "erin",

		/*air*/ "aaron": "aaron aron",
		/*air*/ "aron": "aaron aron",

		/*air*/ "ariana": "ariana arianna",
		/*air*/ "arianna": "ariana arianna",

		/*air*/ "aric": "aric eric erick erik",
		/*air*/ "eric": "aric eric erick erik",
		/*air*/ "erick": "aric eric erick erik",
		/*air*/ "erik": "aric eric erick erik",

		/*air*/ "erica": "erica ericka erika",
		/*air*/ "ericka": "erica ericka erika",
		/*air*/ "erika": "erica ericka erika",

		/*al*/ "al": "al alan allan allen alastair alaster alistair alister allister alban albert alec aleck alex alexander alix alf alfie alfred alonso alonzo alton alvin alwin alwyn",
		/*al*/ "alan": "al alan allan allen",
		/*al*/ "allan": "al alan allan allen",
		/*al*/ "allen": "al alan allan allen",

		/*al*/ "alastair": "alastair alaster alistair alister allister",
		/*al*/ "alaster": "alastair alaster alistair alister allister",
		/*al*/ "alistair": "alastair alaster alistair alister allister",
		/*al*/ "alister": "alastair alaster alistair alister allister",
		/*al*/ "allister": "alastair alaster alistair alister allister",

		/*al*/ "alban": "al alban",

		/*al*/ "albert": "al albert bert bertie",

		/*al*/ "alec": "al alec aleck alex alexander alix",
		/*al*/ "aleck": "al alec aleck alex alexander alix",

		/*al*/ "alexander": "al alec aleck alex alexander alix sandy",

		/*al*/ "alex": "al alec aleck alex alexander alix alexandra alexandria",
		/*al*/ "alix": "al alec aleck alex alexander alix alexandra alexandria",

		/*al*/ "alf": "al alf alfie alfred fred freddie freddy",
		/*al*/ "alfie": "al alf alfie alfred fred freddie freddy",
		/*al*/ "alfred": "al alf alfie alfred fred freddie freddy",

		/*al*/ "alonso": "al alonso alonzo lon lonnie lonny",
		/*al*/ "alonzo": "al alonso alonzo lon lonnie lonny",

		/*al*/ "alton": "al alton",

		/*al*/ "alana": "alana alanna lana",
		/*al*/ "alanna": "alana alanna lana",

		/*al*/ "alexandra": "alex alexandra alix",
		/*al*/ "alexandria": "alex alexandria alix",

		/*al*/ "ali": "ali alli allie ally",
		/*al*/ "alli": "ali alli allie ally",
		/*al*/ "allie": "ali alli allie ally",
		/*al*/ "ally": "ali alli allie ally",

		/*al*/ "alice": "ali alice alli allie ally alyce",
		/*al*/ "alyce": "ali alice alli allie ally alyce",

		/*al*/ "alisa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
		/*al*/ "alissa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
		/*al*/ "alyssa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",


		/*al*/ "alisan": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "alison": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "allisan": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "allison": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "allysan": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "allyson": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "alysan": "alisan alison allisan allison allysan allyson alysan alyson",
		/*al*/ "alyson": "alisan alison allisan allison allysan allyson alysan alyson",

		/*al*/ "alivia": "alivia olivia",

		/*al*/ "alberta": "alberta ab alta",
		/*al*/ "ab": "alberta ab alta",
		/*al*/ "alta": "alberta ab alta",

		/*al*/ "alea": "alea aleah allyah",
		/*al*/ "aleah": "alea aleah allyah",
		/*al*/ "allyah": "alea aleah allyah",

		/*al*/ "aleesha": "aleesha alesha alicia alisha allecia alycia",
		/*al*/ "alesha": "aleesha alesha alicia alisha allecia alycia",
		/*al*/ "alicia": "aleesha alesha alicia alisha allecia alycia",
		/*al*/ "alisha": "aleesha alesha alicia alisha allecia alycia",
		/*al*/ "allecia": "aleesha alesha alicia alisha allecia alycia",
		/*al*/ "alycia": "aleesha alesha alicia alisha allecia alycia",

		/*al*/ "aleta": "aleta",

		/*al*/ "alma": "alma",

		/*al*/ "alvin": "al alvin vin vinny elvin",

		/*al*/ "alwin": "al alwin alwyn win",
		/*al*/ "alwyn": "al alwin alwyn win",

		/*all*/ "olive": "olive olivia ollie olly",

		/*all*/ "olivia": "olive olivia ollie olly alivia",

		/*all*/ "ollie": "olive olivia ollie olly oliver oleen olga",
		/*all*/ "olly": "olive olivia ollie olly oliver oleen olga",

		/*all*/ "oliver": "oliver ollie olly",

		/*all*/ "oleen": "oleen ollie olly",

		/*all*/ "olga": "olga ollie olly",

		/*am*/ "amanda": "amanda mandi mandy",

		/*am*/ "amber": "amber",

		/*am*/ "amelia": "amelia emil emilia em",

		/*an*/ "ann": "ann anna anne annie annamay anuschka",
		/*an*/ "anna": "ann anna anne annamay anya",
		/*an*/ "anne": "ann anna anne annie annamay anuschka",
		/*an*/ "annie": "ann anne annie",
		/*an*/ "annamay": "ann anna anne annamay",

		/*an*/ "anya": "anya anna",

		/*an*/ "anabel": "anabel anebel annabel annabelle",
		/*an*/ "anebel": "anabel anebel annabel annabelle",
		/*an*/ "annabel": "anabel anebel annabel annabelle",
		/*an*/ "annabelle": "anabel anebel annabel annabelle",

		/*an*/ "annamarie": "annamarie annemarie anna_marie",
		/*an*/ "annemarie": "annamarie annemarie anne_marie ann_marie",

		/*an*/ "ahnika": "ahnika anika annaka annika",
		/*an*/ "anika": "ahnika anika annaka annika",
		/*an*/ "annaka": "ahnika anika annaka annika",
		/*an*/ "annika": "ahnika anika annaka annika",

		/*an*/ "annaliese": "annaliese annilee anna_lee anne_lee anna_leigh anne_leigh",
		/*an*/ "annilee": "annaliese annilee anna_lee anne_lee anna_leigh anne_leigh",

		/*an*/ "annelle": "annelle annell nell nelle nellie nelly",
		/*an*/ "annell": "annelle annell nell nelle nellie nelly",


		/*an*/ "annette": "annette nettie netty",

		/*an*/ "anecia": "anecia anissa",
		/*an*/ "anissa": "anecia anissa",

		/*an*/ "anita": "anita nita",

		/*an*/ "andre": "andre andreas andres",
		/*an*/ "andreas": "andre andreas andres",
		/*an*/ "andres": "andre andreas andres",

		/*an*/ "andy": "andrew andy",

		/*an*/ "anderson": "anderson andersen",
		/*an*/ "andersen": "anderson andersen",

		/*an*/ "andrea": "andrea andreas",

		/*an*/ "andrew": "andrew andy drew",

		/*an*/ "angela": "angela angeliqua angie",
		/*an*/ "angeliqua": "angela angeliqua angie",
		/*an*/ "angie": "angela angeliqua angie",

		/*an*/ "anthony": "anthony anton antony tony",
		/*an*/ "anton": "anthony anton antony tony",
		/*an*/ "antony": "anthony anton antony tony",

		/*an*/ "anuschka": "anuschka ann anne",

		/*are*/ "auriel": "auriel",

		/*are*/ "ardell": "ardell",

		/*are*/ "aria": "aria",

		/*are*/ "arleen": "arleen arlene arline arlyne",
		/*are*/ "arlene": "arleen arlene arline arlyne",
		/*are*/ "arline": "arleen arlene arline arlyne",
		/*are*/ "arlyne": "arleen arlene arline arlyne",

		/*are*/ "arleigh": "arleigh",

		/*are*/ "arnie": "arnie arnold",
		/*are*/ "arnold": "arnie arnold",

		/*are*/ "art": "art arthur artie arty",
		/*are*/ "arthur": "art arthur artie arty",
		/*are*/ "artie": "art arthur artie arty",
		/*are*/ "arty": "art arthur artie arty",

		/*ash*/ "ash": "ash ashlee ashleigh ashley ashlie asher",
		/*ash*/ "ashlee": "ash ashlee ashleigh ashley ashlie",
		/*ash*/ "ashleigh": "ash ashlee ashleigh ashley ashlie",
		/*ash*/ "ashley": "ash ashlee ashleigh ashley ashlie",
		/*ash*/ "ashlie": "ash ashlee ashleigh ashley ashlie",

		/*ash*/ "asher": "asher ash",

		/*ash*/ "ashlyn": "ashlyn ashlynn",
		/*ash*/ "ashlynn": "ashlyn ashlynn",

		/*ash*/ "ashton": "ashton",

		/*aw*/ "aubrey": "aubrey",

		/*aw*/ "audra": "audra audrey",
		/*aw*/ "audrey": "audra audrey",

		/*aw*/ "augie": "augie august augustine augustus",
		/*aw*/ "august": "august augustine augustus gus gussy gust gustus",
		/*aw*/ "augustine": "august augustine augustus gus gussy gust gustus",
		/*aw*/ "augustus": "august augustine augustus gus gussy gust gustus",

		/*aw*/ "otto": "otto",

		/*aw*/ "atuam": "atuam autumn",
		/*aw*/ "autumn": "atuam autumn",

		/*aw*/ "austen": "austen austin austynn",
		/*aw*/ "austin": "austen austin austynn",
		/*aw*/ "austynn": "austen austin austynn",

		/*axe*/ "axel": "axel",

		/*b*/

		/*bar*/ "barb": "barb barbara barbie",
		/*bar*/ "barbara": "barb barbara barbie",
		/*bar*/ "barbie": "barb barbara barbie",

		/*bar*/ "barney": "barney barnie berney bernie",
		/*bar*/ "barnie": "barney barnie berney bernie",

		/*bar*/ "bart": "bart bartholomew bartlett bartley barty",
		/*bar*/ "bartholomew": "bart bartholomew bartlett bartley barty",
		/*bar*/ "bartlett": "bart bartholomew bartlett bartley barty",
		/*bar*/ "bartley": "bart bartholomew bartlett bartley barty",
		/*bar*/ "barty": "bart bartholomew bartlett bartley barty",

		/*baw*/ "bonnie": "bonnie bonny",
		/*baw*/ "bonny": "bonnie bonny",

		/*baw*/ "bossi": "bossi",

		/*baw*/ "boston": "boston",

		/*bear*/ "barrett": "barrett barrie barry",
		/*bear*/ "barrie": "barrett barrie barry",
		/*bear*/ "barry": "barrett barrie barry",

		/*beck*/ "beck": "beck becky rebecca rebekah",
		/*beck*/ "becky": "beck becky rebecca rebekah",

		/*bee*/ "bea": "bea beatrice beatrix bee",
		/*bee*/ "beatrice": "bea beatrice beatrix bee",
		/*bee*/ "beatrix": "bea beatrice beatrix bee",
		/*bee*/ "bee": "bea beatrice beatrix bee",

		/*ben*/ "ben": "ben benedict bennie benny benjamin benje benjie benjy bennet bennett bensen benson benzen bentley",
		/*ben*/ "benedict": "ben benedict bennie benny",
		/*ben*/ "bennie": "ben benedict bennie benny benjamin",
		/*ben*/ "benny": "ben benedict bennie benny benjamin",
		/*ben*/ "benjamin": "ben benjamin bennie benny",
		/*ben*/ "benje": "ben benje benjie benjy",
		/*ben*/ "benjie": "ben benje benjie benjy",
		/*ben*/ "benjy": "ben benje benjie benjy",
		/*ben*/ "bennet": "ben bennet bennett",
		/*ben*/ "bennett": "ben bennet bennett",
		/*ben*/ "bensen": "ben bensen benson benzen",
		/*ben*/ "benson": "ben bensen benson benzen",
		/*ben*/ "benzen": "ben bensen benson benzen",
		/*ben*/ "bentley": "ben bentley",

		/*bes*/ "bess": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*bes*/ "bessie": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*bes*/ "bessy": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*bes*/ "beth": "bethany bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",

		/*bet*/ "bettie": "bettina bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*bet*/ "betty": "bettina bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",

		/*bet*/ "bettina": "bettina bettie betty",

		/*beth*/ "bethany": "bethany beth",

		/*bev*/ "bev": "bev beverley beverly bevan",

		/*bev*/ "beverley": "bev beverley beverly",
		/*bev*/ "beverly": "bev beverley beverly",

		/*bev*/ "bevan": "bevan bev",

		/*bill*/ "bill": "bill billie billy will willi william willie willy",

		/*bill*/ "billie": "bill billie billy will willi william willie willy",
		/*bill*/ "billy": "bill billie billy will willi william willie willy",

		/*bla*/ "blanch": "blanch blanche",
		/*bla*/ "blanche": "blanch blanche",

		/*blay*/ "blade": "blade blaiden",
		/*blay*/ "blaiden": "blaiden blade",

		/*blay*/ "blake": "blake",

		/*blay*/ "blain": "blain blaine blane",
		/*blay*/ "blaine": "blain blaine blane",
		/*blay*/ "blane": "blain blaine blane",

		/*blay*/ "blayze": "blayze",

		/*bob*/ "bob": "bob bobbi bobbie bobby robert",
		/*bob*/ "bobbi": "bob bobbi bobbie bobby robert",
		/*bob*/ "bobbie": "bob bobbi bobbie bobby robert",
		/*bob*/ "bobby": "bob bobbi bobbie bobby robert",

		/*boe*/ "beau": "beau",

		/*boe*/ "bodi": "bodi",

		/*boe*/ "bowin": "bowin",

		/*boy*/ "boyd": "boyd",

		/*bra*/ "brock": "brock",

		/*bra*/ "bronwen": "bronwen bronwyn",
		/*bra*/ "bronwyn": "bronwen bronwyn",

		/*brad*/ "brad": "brad bradd bradley",
		/*brad*/ "bradd": "brad bradd bradley",
		/*brad*/ "bradley": "brad bradd bradley",

		/*bram*/ "bram": "abe abraham abram bram",

		/*bran*/ "branden": "branden brandon brendan brenton",
		/*bran*/ "brandon": "branden brandon brendan brenton",

		/*bran*/ "brandy": "brandy",

		/*bran*/ "brant": "brant brent",
		/*bran*/ "brent": "brent brenton brant",

		/*bray*/ "bradden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "bradyn": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braeden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braedon": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braiden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braydan": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "brayden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braydin": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
		/*bray*/ "braydon": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",

		/*bray*/ "brady": "brady braidy",
		/*bray*/ "braidy": "brady braidy",

		/*bray*/ "braver": "braver",

		/*bree*/ "bree_ann": "bree_ann bree_anne brianne brie_ann brie_anne",
		/*bree*/ "bree_anne": "bree_ann bree_anne brianne brie_ann brie_anne",
		/*bree*/ "brianne": "bree_ann bree_anne brianne brie_ann brie_anne",
		/*bree*/ "brie_ann": "bree_ann bree_anne brianne brie_ann brie_anne",
		/*bree*/ "brie_anne": "bree_ann bree_anne brianne brie_ann brie_anne",

		/*bree*/ "breana": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "breanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "bree_anna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "breeanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "briana": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "brianna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "brie_anna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "brieanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
		/*bree*/ "bryanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",

		/*bree*/ "bree": "bree brie",
		/*bree*/ "brie": "bree brie",

		/*bree*/ "brea": "brea breeya bria",
		/*bree*/ "breeya": "brea breeya bria",
		/*bree*/ "bria": "brea breeya bria",

		/*bree*/ "brielle": "brielle briella briellah",
		/*bree*/ "briella": "brielle briella briellah",
		/*bree*/ "briellah": "brielle briella briellah",

		/*bree*/ "brina": "brina sabby sabrina",

		/*bren*/ "brendan": "branden brandon brendan brenton",
		/*bren*/ "brenton": "branden brandon brendan brent brenton",

		/*bren*/ "brenda": "brenda",

		/*bren*/ "brenaya": "brenaya brenna",
		/*bren*/ "brenna": "brenaya brenna",

		/*bren*/ "brennan": "brennan brennen",
		/*bren*/ "brennen": "brennan brennen",

		/*bret*/ "bret": "bret brett",
		/*bret*/ "brett": "bret brett",

		/*brew*/ "bruce": "bruce",

		/*brew*/ "bruno": "bruno",

		/*br-eye*/ "briley": "briley",

		/*br-eye*/ "brian": "brian brien bryan bryen bryon",
		/*br-eye*/ "brien": "brian brien bryan bryen bryon",
		/*br-eye*/ "bryan": "brian brien bryan bryen bryon",
		/*br-eye*/ "bryen": "brian brien bryan bryen bryon",
		/*br-eye*/ "bryon": "brian brien bryan bryen bryon",

		/*br-eye*/ "bryce": "bryce",

		/*br-eye*/ "brysen": "brysen",

		/*bridge*/ "bridget": "bridget bridgette brigid brigit",
		/*bridge*/ "bridgette": "bridget bridgette brigid brigit",
		/*bridge*/ "brigid": "bridget bridgette brigid brigit",
		/*bridge*/ "brigit": "bridget bridgette brigid brigit",

		/*brit*/ "brit": "brit britney britt brittanni brittany brittney",
		/*brit*/ "britney": "brit britney britt brittanni brittany brittney",
		/*brit*/ "britt": "brit britney britt brittanni brittany brittney",
		/*brit*/ "brittanni": "brit britney britt brittanni brittany brittney",
		/*brit*/ "brittany": "brit britney britt brittanni brittany brittney",
		/*brit*/ "brittney": "brit britney britt brittanni brittany brittney",

		/*brin*/ "brynlee": "brynlee bryn brynn",
		/*brin*/ "bryn": "brynlee bryn brynn",
		/*brin*/ "brynn": "brynn brynlee bryn",

		/*see br-eye*/

		/*b-road*/ "broderick": "broderick brodie brody bodi",
		/*b-road*/ "brodie": "broderick brodie brody",
		/*b-road*/ "brody": "broderick brodie brody",

		/*brook*/ "brooklyn": "brooklyn brook brooke brooks",
		/*brook*/ "brook": "brooklyn brook brooke brooks",
		/*brook*/ "brooke": "brooklyn brook brooke brooks",
		/*brook*/ "brooks": "brooklyn brook brooke brooks",

		/*see brew*/

		/*bur*/ "beryl": "beryl burrell",
		/*bur*/ "burrell": "beryl burrell",

		/*bur*/ "burk": "burk",

		/*bur*/ "bern": "barnard barney barnie bern bernard berney bernie",

		/*bur*/ "bernadette": "bernadette bern berney bernie",

		/*bur*/ "berney": "barnard barney barnie bern bernard berney bernie",
		/*bur*/ "bernie": "barnard barney barnie bern bernard berney bernie",

		/*bur*/ "barnard": "barnard barney barnie bern bernard berney bernie",
		/*bur*/ "bernard": "barnard barney barnie bern bernard berney bernie",

		/*bur*/ "berenice": "berenice bernice berniece",
		/*bur*/ "bernice": "berenice bernice berniece",
		/*bur*/ "berniece": "berenice bernice berniece",

		/*bur*/ "bert": "albert bert bertie bertram robert herbert hubert",
		/*bur*/ "bertie": "albert bert bertie bertram robert herbert hubert",
		/*bur*/ "bertram": "bert bertie bertram",

		/*bur*/ "berv": "berv",

		/*bur*/ "berwin": "berwin berwyn berwynn",
		/*bur*/ "berwyn": "berwin berwyn berwynn",
		/*bur*/ "berwynn": "berwin berwyn berwynn",

		/*bye*/ "byron": "byron",

		/*see k*/

		/*soft ch*/

		/*cha*/ "chapel": "chapel",

		/*cha*/ "chad": "chad",

		/*cha*/ "chance": "chance",

		/*cha*/ "chansie": "chansie",

		/*chair*/ "cheri": "cheri cherry",
		/*chair*/ "cherry": "cheri cherry",

		/*char*/ "charlee": "charlee charles charley charlie chuck",
		/*char*/ "charles": "charlee charles charley charlie chuck",
		/*char*/ "charley": "charlee charles charley charlie chuck",
		/*char*/ "charlie": "charlee charles charley charlie chuck",

		/*chay*/ "chase": "chase chas",
		/*chay*/ "chas": "chase chas chastity",
		/*chay*/ "chastity": "chastity chas",

		/*chay*/ "chayton": "chayton",

		/*cheh*/ "chester": "chester chet",
		/*cheh*/ "chet": "chet chester",

		/*chel*/ "chelsea": "chelsea chelsey",
		/*chel*/ "chelsey": "chelsea chelsey",

		/*ch-eye*/ "child": "child",

		/*chih*/ "chip": "chip",

		/*chuh*/ "chub": "chub",

		/*chuh*/ "chuck": "charlee charles charley charlie chuck",

		/*chuh*/ "chukkota": "chukkota chuck",

		/*d*/
		/*see day*/

		/*da*/ "dallas": "dallas dalys",
		/*da*/ "dalys": "dallas dalys",

		/*da*/ "dallan": "dallan",

		/*da*/ "dalton": "dalton",

		/*da*/ "dan": "dan daniel danny dani",
		/*da*/ "daniel": "dan daniel danny dani",
		/*da*/ "danny": "dan daniel danny dani",
		/*da*/ "dani": "dan daniel danny dani",

		/*da*/ "danaka": "danaka danica danika dannika",
		/*da*/ "danica": "danaka danica danika dannika",
		/*da*/ "danika": "danaka danica danika dannika",
		/*da*/ "dannika": "danaka danica danika dannika",

		/*da*/ "danelle": "danelle danielle danneilia",
		/*da*/ "danielle": "danelle danielle danneilia",
		/*da*/ "danneilia": "danelle danielle danneilia",

		/*da*/ "danya": "danya",

		/*da*/ "daphie": "daphie daphne",
		/*da*/ "daphne": "daphie daphne",

		/*dah*/ "declan": "declan dax",

		/*da*/ "daxson": "daxson daxton dacson daxen daxon daxsen dax",
		/*da*/ "daxton": "daxson daxton dacson daxen daxon daxsen dax",
		/*da*/ "dacson": "daxson daxton dacson daxen daxon daxsen dax",
		/*da*/ "daxen": "daxson daxton dacson daxen daxon daxsen dax",
		/*da*/ "daxon": "daxson daxton dacson daxen daxon daxsen dax",
		/*da*/ "daxsen": "daxson daxton dacson daxen daxon daxsen dax",
		/*da*/ "dax": "daxson daxton dacson daxen daxon daxsen dax declan",

		/*dar*/ "darla": "darla",

		/*dar*/ "darleen": "darleen darlene darlyne",
		/*dar*/ "darlene": "darleen darlene darlyne",
		/*dar*/ "darlyne": "darleen darlene darlyne",

		/*dar*/ "darlena": "darlena",

		/*dar*/ "darrick": "darrick",

		/*dar*/ "darcy": "darcy",

		/*dar*/ "darwin": "darwin",

		/*dare*/ "daren": "daren darin darren darrin",
		/*dare*/ "darin": "daren darin darren darrin",
		/*dare*/ "darren": "daren darin darren darrin",
		/*dare*/ "darrin": "daren darin darren darrin",

		/*dare*/ "darienne": "darienne",

		/*dare*/ "dario": "dario",

		/*dare*/ "darius": "darius",

		/*dare*/ "darrel": "darrel darrell darryl daryl derrel daryll",
		/*dare*/ "darrell": "darrel darrell darryl daryl derrel daryll",
		/*dare*/ "darryl": "darrel darrell darryl daryl derrel daryll",
		/*dare*/ "daryl": "darrel darrell darryl daryl derrel daryll",
		/*dare*/ "derrel": "darrel darrell darryl daryl derrel daryll",
		/*dare*/ "daryll": "darrel darrell darryl daryl derrel daryll",

		/*dare*/ "derek": "darrick derek derrick",
		/*dare*/ "derrick": "darrick derek derrick",

		/*dare*/ "darry": "darry",

		/*daw*/ "dom": "dom dominic dominick dominique",
		/*daw*/ "dominic": "dom dominic dominick dominique",
		/*daw*/ "dominick": "dom dominic dominick dominique",
		/*daw*/ "dominique": "dom dominic dominick dominique",

		/*daw*/ "dawn": "dawn don",
		/*daw*/ "don": "dawn don donald donnie donny donavon donal",

		/*daw*/ "donald": "donal don donald donnie donny",
		/*daw*/ "donnie": "donal don donald donnie donny",
		/*daw*/ "donny": "donal don donald donnie donny",
		/*daw*/ "donal": "donal don donald donnie donny",

		/*daw*/ "dona": "dona donna",
		/*daw*/ "donna": "dona donna",

		/*daw*/ "donavon": "donavon don",

		/*daw*/ "dawson": "dawson dawsen",
		/*daw*/ "dawsen": "dawson dawsen",

		/*day*/ "damian": "damian damon damien",
		/*day*/ "damon": "damian damon damien",
		/*day*/ "damien": "damian damon damien",

		/*day*/ "dain": "dain dane",
		/*day*/ "dane": "dain dane",

		/*day*/ "dahlia": "dahlia",

		/*day*/ "dale": "dale",

		/*day*/ "daylan": "daylan daylen",
		/*day*/ "daylen": "daylan daylen",

		/*day*/ "dana": "dana",

		/*day*/ "dayton": "dayton dayson",
		/*day*/ "dayson": "dayton dayson",

		/*day*/ "dave": "dave david davie davy",
		/*day*/ "david": "dave david davie davy",
		/*day*/ "davie": "dave david davie davy",
		/*day*/ "davy": "dave david davie davy",

		/*dee*/ "dee": "dee nadine deanna",

		/*dee*/ "deanna": "deanna dee",

		/*dee*/ "deidre": "deidre",

		/*dee*/ "dean": "dean deane",
		/*dee*/ "deane": "dean deane",

		/*dee*/ "dena": "dena",

		/*deh*/ "deb": "deb debbie debby deborah debra",
		/*deh*/ "debbie": "deb debbie debby deborah debra",
		/*deh*/ "debby": "deb debbie debby deborah debra",
		/*deh*/ "deborah": "deb debbie debby deborah debra",
		/*deh*/ "debra": "deb debbie debby deborah debra",

		/*deh*/ "delbert": "delbert",

		/*deh*/ "delraina": "delraina",

		/*deh*/ "delton": "delton",

		/*deh*/ "delvin": "delvin",

		/*deh*/ "delynn": "delynn",

		/*deh*/ "del": "del delano dell della",
		/*deh*/ "delano": "del delano della",
		/*deh*/ "dell": "del delano dell della",
		/*deh*/ "della": "del delano dell della",

		/*deh*/ "den": "den denis dennis denny",
		/*deh*/ "denis": "den denis dennis denny",
		/*deh*/ "dennis": "den denis dennis denny",
		/*deh*/ "denny": "den denis dennis denny",

		/*deh*/ "denice": "denice denise denyse",
		/*deh*/ "denise": "denice denise denyse",
		/*deh*/ "denyse": "denice denise denyse",

		/*deh*/ "denver": "denver",

		/*der*/ "derwin": "derwin durwin",
		/*der*/ "durwin": "durwin derwin",

		/*deh*/ "deveron": "deveron devren",
		/*deh*/ "devren": "deveron devren",

		/*deh*/ "devin": "devin devon",
		/*deh*/ "devon": "devin devon",

		/*deh*/ "dex": "dex dexter",
		/*deh*/ "dexter": "dex dexter",

		/*die*/ "diane": "diane dianne",
		/*die*/ "dianne": "diane dianne",

		/*die*/ "diana": "diana dianna deanna dee",
		/*die*/ "dianna": "diana dianna deanna dee",

		/*dih*/ "dick": "dick richard",

		/*dih*/ "dickson": "dixon dickson",
		/*dih*/ "dixon": "dixon dickson",

		/*dih*/ "diska": "diska",

		/*dih*/ "district": "district",

		/*dih*/ "dixie": "dixie",

		/*dih*/ "dillon": "dillon dylan",
		/*dih*/ "dylan": "dillon dylan",

		/*see daw*/

		/*door*/ "dora": "dora theo theodora",

		/*door*/ "dorie": "dorie",

		/*door*/ "doreen": "doreen dorene",
		/*door*/ "dorene": "doreen dorene",

		/*door*/ "doris": "doris dorris",
		/*door*/ "dorris": "doris dorris",

		/*door*/ "dorothy": "dorothy",

		/*door*/ "dorson": "dorson",

		/*dr*/ "drew": "andrew andy drew",

		/*dr*/ "drusilla": "drusilla",

		/*duh*/ "doug": "doug douglas douglass",
		/*duh*/ "douglas": "doug douglas douglass",
		/*duh*/ "douglass": "doug douglas douglass",

		/*duh*/ "duncan": "duncan",

		/*duh*/ "dustin": "dustin dusty",
		/*duh*/ "dusty": "dustin dusty",

		/*dw*/ "duane": "duane dwayne dwaine",
		/*dw*/ "dwayne": "duane dwayne dwaine",
		/*dw*/ "dwaine": "duane dwayne dwaine",

		/*dw*/ "duight": "duight",

		/*long e*/

		/*eat*/ "eton": "eton eaton",
		/*eat*/ "eaton": "eton eaton",

		/*ees*/ "easton": "easton",

		/*eed*/ "edith": "edith edyth edythe",
		/*eed*/ "edyth": "edith edyth edythe",
		/*eed*/ "edythe": "edith edyth edythe",

		/*eed*/ "eden": "eden",

		/*eel*/ "elisabeth": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*eel*/ "elizabeth": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",

		/*eel*/ "elaine": "elaine alayne",

		/*eel*/ "eli": "eli",

		/*eel*/ "elise": "elise elyse",
		/*eel*/ "elyse": "elise elyse",

		/*eem*/ "emanuel": "emanuel emmanuel",
		/*eem*/ "emmanuel": "emanuel emmanuel",

		/*eeth*/ "ethan": "ethan",

		/*see eat*/

		/*egg*/	"agatha": "agatha aggie agnes",
		/*egg*/	"aggie": "agatha aggie agnes",
		/*egg*/	"agnes": "agatha aggie agnes",

		/*eve*/ "eva": "ava eva",

		/*eve*/ "evol": "evol",

		/*short e*/

		/*eb*/ "ebonee": "ebonee ebonie ebony",
		/*eb*/ "ebonie": "ebonee ebonie ebony",
		/*eb*/ "ebony": "ebonee ebonie ebony",

		/*ed*/ "ed": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",

		/*ed*/ "edna": "edna",

		/*ed*/ "edgar": "ed eddie eddy edgar ted teddy edie",

		/*ed*/ "edmond": "ed edmond edmund eddie eddy edie ted teddy",
		/*ed*/ "edmund": "ed edmond edmund eddie eddy edie ted teddy",

		/*ed*/ "edward": "ed eddie eddy edward ted teddy edie",

		/*ed*/ "edwin": "ed eddie eddy edwin ted teddy edie",

		/*ed*/ "edie": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",
		/*ed*/ "eddie": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",
		/*ed*/ "eddy": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",

		/*ed*/ "edson": "edson",

		/*ef*/ "efren": "efren efron",
		/*ef*/ "efron": "efren efron",

		/*see ur*/

		/*el*/ "el": "el eliot elliot elliott elmer elvin vin elwin elwyn win elwood wood woodrow woody",

		/*el*/ "ella": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",

		/*el*/ "elden": "elden eldon",
		/*el*/ "eldon": "elden eldon",

		/*el*/ "elda": "elda",

		/*el*/ "ellen": "ellen",

		/*el*/ "eleanor": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
		/*el*/ "elenore": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
		/*el*/ "eleonore": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
		/*el*/ "elinor": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",

		/*el*/ "ellie": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
		/*el*/ "elly": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",

		/*el*/ "eliot": "el eliot elliot elliott",
		/*el*/ "elliot": "el eliot elliot elliott",
		/*el*/ "elliott": "el eliot elliot elliott",

		/*el*/ "elisa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
		/*el*/ "elisia": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
		/*el*/ "elissa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
		/*el*/ "eliza": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
		/*el*/ "elyssa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",

		/*el*/ "elka": "elka",

		/*el*/ "elmer": "el elmer",

		/*el*/ "elvin": "el elvin vin alvin",

		/*el*/ "elwin": "el elwin elwyn win",
		/*el*/ "elwyn": "el elwin elwyn win",

		/*el*/ "elwood": "el elwood wood woodrow woody",

		/*el*/ "elmarie": "elmarie",

		/*el*/ "eloise": "eloise",

		/*el*/ "elora": "elora",

		/*el*/ "else": "else elsie",
		/*el*/ "elsie": "else elsie",

		/*em*/ "em": "ema emma emeli emely emilee emilie emily amelia emil emilia",

		/*em*/ "ema": "ema emma em",
		/*em*/ "emma": "ema emma em",
		/*em*/ "emeli": "emeli emely emilee emilie emily em",
		/*em*/ "emely": "emeli emely emilee emilie emily em",
		/*em*/ "emilee": "emeli emely emilee emilie emily em",
		/*em*/ "emilie": "emeli emely emilee emilie emily em",
		/*em*/ "emily": "emeli emely emilee emilie emily em",

		/*em*/ "emil": "amelia emil emilia em",
		/*em*/ "emilia": "amelia emil emilia em",

		/*em*/ "emmy": "emmy",

		/*em*/ "emery": "emery emarie",
		/*em*/ "emarie": "emery emarie",

		/*see air*/

		/*see ur*/

		/*es*/ "estela": "estela estella",
		/*es*/ "estella": "estela estella",

		/*es*/ "esther": "esther",

		/*eth*/ "ethel": "ethel",

		/*ew*/ "eugene": "eugene gene",

		/*ew*/ "eustace": "eustace eustacia stacey staci stacia stacie stacy",
		/*ew*/ "eustacia": "eustace eustacia stacey staci stacia stacie stacy",

		/*ew*/ "eusebio": "eusebio",

		/*ev*/ "ev": "evan evyn ev",
		/*ev*/ "evan": "evan evyn ev",
		/*ev*/ "evyn": "evan evyn ev",

		/*ev*/ "eveleen": "eveleen eveline evelyn evelynne",
		/*ev*/ "eveline": "eveleen eveline evelyn evelynne",
		/*ev*/ "evelyn": "eveleen eveline evelyn evelynne",
		/*ev*/ "evelynne": "eveleen eveline evelyn evelynne",

		/*ev*/ "everett": "everett everette",
		/*ev*/ "everette": "everett everette",

		/*ez*/ "ezra": "ezra",

		/*faw*/ "fonda": "fonda",

		/*faw*/ "foster": "foster",

		/*fay*/ "fae": "fae faith fay faye",
		/*fay*/ "faith": "fae faith fay faye",
		/*fay*/ "fay": "fae faith fay faye",
		/*fay*/ "faye": "fae faith fay faye",

		/*fair*/ "farren": "farren",

		/*fair*/ "farrow": "farrow farough",
		/*fair*/ "farough": "farrow farough",

		/*fee*/ "phebe": "phebe phoebe",
		/*fee*/ "phoebe": "phebe phoebe",

		/*fell*/ "felicity": "felicity",

		/*fell*/ "felipa": "felipa",

		/*few*/ "funeral": "funeral",

		/*see fur*/

		/*fill*/ "phil": "phil philip phillip philippe",
		/*fill*/ "philip": "phil philip phillip philippe",
		/*fill*/ "phillip": "phil philip phillip philippe",
		/*fill*/ "philippe": "phil philip phillip philippe",

		/*fill*/ "phyllis": "phyllis",

		/*fin*/ "finley": "finley findley finn",
		/*fin*/ "findley": "finley findley finn",
		/*fin*/ "finn": "finley findley finn",

		/*flaw*/ "floss": "flo floss flossie",
		/*flaw*/ "flossie": "flo floss flossie",

		/*floor*/ "flora": "flo flora florence florrie",
		/*floor*/ "florence": "flo flora florence florrie",
		/*floor*/ "florrie": "flo flora florence florrie",

		/*flow*/ "flo": "flo flora florence florrie floss flossie floy",

		/*floy*/ "floy": "flo floy floyd",
		/*floy*/ "floyd": "floyd floy flo",

		/*for*/ "ford": "cliff clifford ford",

		/*see faw*/

		/*see full*/

		/*frah*/ "fran": "fran frances francie francine francis francisco frannie franny",
		/*frah*/ "frances": "fran frances francie francine francis francisco frannie franny",
		/*frah*/ "francie": "fran frances francie francine francis francisco frannie franny",
		/*frah*/ "francine": "fran frances francie francine francis francisco frannie franny",
		/*frah*/ "francis": "fran frances francie francine francis francisco frannie franny frank frankie franklin franklyn franky",
		/*frah*/ "francisco": "fran frances francie francine francis francisco frannie franny frank frankie franklin franklyn franky",
		/*frah*/ "frannie": "fran frances francie francine francis francisco frannie franny",
		/*frah*/ "franny": "fran frances francie francine francis francisco frannie franny",

		/*fray*/ "frank": "francis francisco frank frankie franklin franklyn franky",
		/*fray*/ "frankie": "francis francisco frank frankie franklin franklyn franky",
		/*fray*/ "franklin": "francis francisco frank frankie franklin franklyn franky",
		/*fray*/ "franklyn": "francis francisco frank frankie franklin franklyn franky",
		/*fray*/ "franky": "francis francisco frank frankie franklin franklyn franky",

		/*fray*/ "fraser": "fraser frazer",
		/*fray*/ "frazer": "fraser frazer",

		/*freh*/ "fred": "alfred fred freddie freddy wilfred winfred frederic frederick fredric fredrick",
		/*freh*/ "freddie": "alfred fred freddie freddy wilfred winfred frederic frederick fredric fredrick",
		/*freh*/ "freddy": "alfred fred freddie freddy wilfred winfred frederic frederick fredric fredrick",
		/*freh*/ "frederic": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
		/*freh*/ "frederick": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
		/*freh*/ "fredric": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
		/*freh*/ "fredrick": "fred freddie freddy frederic frederick fredric fredrick rick ricky",

		/*see few*/

		/*full*/ "foulton": "foulton",

		/*fur*/ "fern": "fern",

		/*fur*/ "fernando": "fernando",

		/*gay*/ "gage": "gage guage",
		/*gay*/ "guage": "gage guage",

		/*gay*/ "gale": "abigail gale gayle gail",
		/*gay*/ "gayle": "abigail gale gayle gail",
		/*gay*/ "gail": "abigail gail gale gayle",

		/*gay*/ "gayla": "gayla gale gail gayle",

		/*gay*/ "gabe": "gabe gabriel",
		/*gay*/ "gabriel": "gabe gabriel",

		/*ga*/ "gabrielle": "gabrielle gabby gabi gaby gabi",

		/*ga*/ "gabriela": "gabby gabi gabriela gabriella gaby gabi",
		/*ga*/ "gabriella": "gabby gabi gabriela gabriella gaby gabi",

		/*ga*/ "gabby": "gabby gabi gabriela gabriella gaby gabrielle",
		/*ga*/ "gabi": "gabby gabi gabriela gabriella gaby gabrielle",
		/*ga*/ "gaby": "gabby gabi gabriela gabriella gaby gabrielle",

		/*ga*/ "gavan": "gavan gavin",
		/*ga*/ "gavin": "gavan gavin",

		/*g-air*/ "garret": "garret garrett garet",
		/*g-air*/ "garrett": "garret garrett garet",
		/*g-air*/ "garet": "garret garrett garet",

		/*g-air*/ "garry": "garry gary",
		/*g-air*/ "gary": "garry gary",

		/*gar*/ "garfield": "garfield",

		/*gar*/ "garnet": "garnet",

		/*gar*/ "garth": "garth",

		/*gar*/ "garvin": "garvin",

		/*gur*/ "gertie": "gertie gertrude trudie trudy gertraud",
		/*gur*/ "gertrude": "gertie gertrude trudie trudy gertraud",
		/*gur*/ "gertraud": "gertie gertrude trudie trudy gertraud",

		/*gill*/ "gil": "bert gil gilbert",
		/*gill*/ "gilbert": "bert gil gilbert",

		/*glah*/ "gladys": "gladys",

		/*gleh*/ "glen": "glen glenn",
		/*gleh*/ "glenn": "glen glenn",

		/*gleh*/ "glenda": "glenda",

		/*glor*/ "gloria": "gloria",

		/*gor*/ "gord": "gord gordon",
		/*gor*/ "gordon": "gord gordon",

		/*gray*/ "grace": "grace",

		/*gray*/ "grady": "grady",

		/*gray*/ "gra": "graeme graham graydon grayson",

		/*gray*/ "gray": "gray grey",
		/*gray*/ "grey": "gray grey",


		/*gray*/ "graeme": "graeme graham gra",
		/*gray*/ "graham": "graeme graham gra",

		/*gray*/ "graydon": "graydon gra",

		/*gray*/ "grayson": "grayson gra",

		/*grah or gray*/ "gr": "gr grande great",
		/*grah*/ "grande": "grande gr",

		/*grah*/ "grant": "grant",

		/*gree*/ "greagan": "greagan",
		/*gree*/ "gri": "gri gree griselda",
		/*gree*/ "griselda": "gri gree griselda",
		/*gree*/ "gree": "gri griselda gree",

		/*gree*/ "greer": "greer grier",
		/*gree*/ "grier": "greer grier",

		/*greh*/ "grenald": "grenald",

		/*greh*/ "greg": "greg gregg gregor gregory",
		/*greh*/ "gregg": "greg gregg gregor gregory",
		/*greh*/ "gregor": "greg gregg gregor gregory",
		/*greh*/ "gregory": "greg gregg gregor gregory",

		/*grih*/ "griff": "griff griffin griffith",
		/*grih*/ "griffin": "griff griffin griffith",
		/*grih*/ "griffith": "griff griffin griffith",

		/*guh*/ "gus": "augie august augustine augustus gus gussy gust gustus",
		/*guh*/ "gussy": "augie august augustine augustus gus gussy gust gustus",
		/*guh*/ "gust": "augie august augustine augustus gus gussy gust gustus",
		/*guh*/ "gustus": "augie august augustine augustus gus gussy gust gustus",

		/*gw*/ "gwen": "gwen gwendolen gwendolyn wendy gwynne",
		/*gw*/ "gwendolen": "gwen gwendolen gwendolyn wendy gwynne",
		/*gw*/ "gwendolyn": "gwen gwendolen gwendolyn wendy gwynne",
		/*gw*/ "gwynne": "gwen gwendolen gwendolyn wendy gwynne",

		/*hay*/ "haiden": "hayden haiden",
		/*hay*/ "hayden": "hayden haiden",

		/*hay*/ "hazel": "hazel",

		/*hay*/ "hailey": "hailey haley haylee hayleigh hayley",
		/*hay*/ "haley": "hailey haley haylee hayleigh hayley",
		/*hay*/ "haylee": "hailey haley haylee hayleigh hayley",
		/*hay*/ "hayleigh": "hailey haley haylee hayleigh hayley",
		/*hay*/ "hayley": "hailey haley haylee hayleigh hayley",

		/*hay*/ "hank": "hal hank harold harry henry",

		/*hay*/ "haines": "haines haynes",
		/*hay*/ "haynes": "haines haynes",


		/*hah*/ "hal": "hal hank harold harry henry",

		/*hah*/ "hanna": "hanna hannah",
		/*hah*/ "hannah": "hanna hannah",

		/*hah*/ "hat": "hat",

		/*hair*/ "harold": "hal hank harold harry henry",
		/*hair*/ "harry": "hal hank harold harry henry",

		/*hair*/ "haroldene": "haroldene",

		/*har*/ "harlee": "harlee harley",
		/*har*/ "harley": "harlee harley",

		/*har*/ "hartley": "hartley",

		/*har*/ "harve": "harve harvey harv",
		/*har*/ "harvey": "harve harvey harv",
		/*har*/ "harv": "harve harvey harv",

		/*haw*/ "holly": "holly holley",
		/*haw*/ "holley": "holly holley",


		/*haw*/ "hospital": "hospital",

		/*hee*/ "hee": "hee",

		/*hee*/ "hebron": "hebron",

		/*heh*/ "henry": "hal hank henry",

		/*heh*/ "helen": "helen helene",
		/*heh*/ "helene": "helen helene",

		/*heh*/ "helm": "helm helms",
		/*heh*/ "helms": "helm helms",

		/*heh*/ "health": "health",

		/*heh*/ "heather": "heather",

		/*heh*/ "hendrix": "hendrix",

		/*heh*/ "hesron": "hesron",

		/*her*/ "herb": "bert herb herbert",
		/*her*/ "herbert": "bert herb herbert",

		/*h-eye*/ "heidi": "heidi",

		/*h-eye*/ "heinrich": "heinrich",

		/*hih*/ "hilton": "hilton",

		/*hih*/ "hilary": "hilary hillary",
		/*hih*/ "hillary": "hilary hillary",

		/*hih*/ "hilda": "hilda hildie hylda mathilda matilda",
		/*hih*/ "hildie": "hilda hildie hylda mathilda matilda",
		/*hih*/ "hylda": "hilda hildie hylda mathilda matilda",

		/*see haw*/

		/*hoe*/ "home": "home",

		/*hoe*/ "hope": "hope",

		/*see ow*/

		/*see wah*/

		/*how*/ "howard": "howard howie",
		/*how*/ "howie": "howard howie",

		/*hue*/ "hubert": "bert hubert hugh hughie hugo",
		/*hue*/ "hugh": "bert hubert hugh hughie hugo",
		/*hue*/ "hughie": "bert hubert hugh hughie hugo",
		/*hue*/ "hugo": "bert hubert hugh hughie hugo",

		/*huh*/ "hudson": "hudson",

		/*huh*/ "hunter": "hunter",

		/*huh*/ "huntley": "huntley",

		"ian": "ian",

		"iana": "iana",

		"india": "india",

		"indianna": "indianna",

		"inez": "inez",

		"innisfail": "innisfail",

		"iqbal": "iqbal",

		"einar": "einar",

		"iona": "iona",

		"aileen": "aileen alene eileen",
		"alene": "aileen alene eileen",
		"eileen": "aileen alene eileen",

		"iren": "iren irene",
		"irene": "irene iren",

		"irmgard": "irmgard irma",
		"irma": "irmgard irma",

		"iris": "iris",

		"ike": "ike isaac isaak izak",
		"isaac": "ike isaac isaak izak",
		"isaak": "ike isaac isaak izak",
		"izak": "ike isaac isaak izak",

		"isla": "isla islay",
		"islay": "isla islay",

		"isabel": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
		"isabell": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
		"isabelle": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
		"isobel": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
		"isobele": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
		"izabel": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
		"bel": "bel bell bella belle isabel isabell isabelle isobel isobele izabel",
		"bell": "bel bell bella belle isabel isabell isabelle isobel isobele izabel",
		"belle": "bel bell bella belle isabel isabell isabelle isobel isobele izabel",

		"issy": "isabel isabell isabelle isobel isobele issy izabel issie",
		"issie": "isabel isabell isabelle isobel isobele issy izabel issie",

		"isabella": "isabella isobella izabella issie bel bell bella issy",
		"isobella": "isabella isobella izabella issie bel bell bella issy",
		"izabella": "isabella isobella izabella issie bel bell bella issy",
		"bella": "bel bell bella isabella isobella izabella",

		"ivan": "ivan",

		"ivor": "ivor",

		"jae": "jae jay jayanthe jaynon",
		"jay": "jae jay jayanthe jaynon",

		"jayanthe": "jae jay jayanthe",

		"jacob": "jacob jake jakob",
		"jake": "jacob jake jakob",
		"jakob": "jacob jake jakob",

		"jade": "jade jayd",
		"jayd": "jade jayd",

		"jada": "jada jaida jayda",
		"jaida": "jada jaida jayda",
		"jayda": "jada jaida jayda",

		"jaden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jadon": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaeden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaedon": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaiden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaidyn": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaydan": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jayden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaydin": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaydn": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
		"jaydon": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",

		"jaimen": "jaimen jamin",
		"jamin": "jaimen jamin",

		"jayla": "jayla",

		"jaylan": "jaylan jaylin jayelynn",
		"jaylin": "jaylan jaylin jayelynn",
		"jayelynn": "jaylan jaylin jayelynn",

		"james": "james jim jimmie jimmy",

		"jamie": "jamie jayme",
		"jayme": "jamie jayme",

		"jane": "jane jayne",
		"jayne": "jane jayne",

		"jayna": "jayna",

		"jaynon": "jaynon jay",

		"janey": "janey janie",
		"janie": "janey janie",

		"jayce": "jace jayce",
		"jace": "jace jayce",

		"jaison": "jaison jason jayson",
		"jason": "jaison jason jayson",
		"jayson": "jaison jason jayson",

		"jack": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jacksen": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jackson": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jacson": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jaxen": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jaxon": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jaxsen": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
		"jaxson": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",

		"jacalyn": "jacalyn jacklyn jaclyn",
		"jacklyn": "jacalyn jacklyn jaclyn",
		"jaclyn": "jacalyn jacklyn jaclyn",

		"jackie": "jackie jacky jacqueline jacquelyn jax",
		"jacky": "jackie jacky jacqueline jacquelyn jax",
		"jacqueline": "jackie jacky jacqueline jacquelyn jax",
		"jacquelyn": "jackie jacky jacqueline jacquelyn jax",
		"jax": "jacksen jackson jacson jaxen jaxon jaxsen jaxson jax jackie jacky jacqueline jacquelyn",

		"jalena": "jalena",

		"janessa": "janessa",

		"janneka": "janneka",

		"jacinda": "jacinda",
		"jacyntha": "jacyntha",

		"jan": "jan janet janette janice janis jenice",
		"janet": "jan janet janette",
		"janette": "jan janet janette",
		"janice": "jan janice janis jenice",
		"janis": "jan janice janis jenice",
		"jenice": "jan janice janis jenice",

		"janae": "janae janai janay janaya jannea jenae",
		"janai": "janae janai janay janaya jannea jenae",
		"janay": "janae janai janay janaya jannea jenae",
		"janaya": "janae janai janay janaya jannea jenae",
		"jannea": "janae janai janay janaya jannea jenae",
		"jenae": "janae janai janay janaya jannea jenae",

		"janell": "janell janelle",
		"janelle": "janell janelle",

		"janene": "janene janine jeanine jeannine jenneane",
		"janine": "janene janine jeanine jeannine jenneane",
		"jeanine": "janene janine jeanine jeannine jenneane",
		"jeannine": "janene janine jeanine jeannine jenneane",
		"jenneane": "janene janine jeanine jeannine jenneane",

		"jairus": "jairus jarius",
		"jarius": "jarius jairus",

		"jarvis": "jarvis",

		"jasper": "jasper",

		"jassanka": "jassanka",

		"jasmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"jasmine": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"jazmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"jazmine": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"jazmyn": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"yasmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"yasmine": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
		"yazmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",

		"jed": "jed",

		"jr": "jr junior",
		"junior": "jr junior",

		"judah": "judah",

		"justin": "justin",

		"geoff": "geoff geoffrey jeff jeffery jeffrey",
		"geoffrey": "geoff geoffrey jeff jeffery jeffrey",
		"jeff": "geoff geoffrey jeff jeffery jeffrey",
		"jeffery": "geoff geoffrey jeff jeffery jeffrey",
		"jeffrey": "geoff geoffrey jeff jeffery jeffrey",

		"jesper": "jesper",

		"gemma": "gemma",

		"general": "general",

		"genevieve": "genevieve",

		"jeanette": "jeanette jeannette",
		"jeannette": "jeanette jeannette",

		"gen": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny jennica jenita jenith",
		"jen": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny jennica jenita jenith",
		"jenn": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny jennica jenita jenith",

		"jenna": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
		"gena": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",

		"jenne": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
		"jenni": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
		"jennie": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
		"jenny": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",

		"jennifer": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",

		"jennica": "jennica jenn jen gen",

		"jenita": "jenita jen jenn gen nita",

		"jenith": "jenith jen jenn gen",

		"jenessa": "jenessa jennessa",
		"jennessa": "jenessa jennessa",

		"gerald": "gerald geraldine gerard gerri gerrie gerry jerry",
		"geraldine": "gerald geraldine gerard gerri gerrie gerry jerry",
		"gerard": "gerald geraldine gerard gerri gerrie gerry jerry",
		"gerri": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie",
		"gerrie": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie",
		"gerry": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie",
		"jerry": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie jerome",

		"geralyn": "geralyn",

		"jared": "jared jarek jaret jered",
		"jarek": "jared jarek jaret jered",
		"jaret": "jared jarek jaret jered",
		"jered": "jared jarek jaret jered",

		"jaren": "jaren jaron jarren",
		"jaron": "jaren jaron jarren",
		"jarren": "jaren jaron jarren",

		"jeremiah": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
		"jeremy": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
		"jeremias": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
		"jeremie": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",

		"jerome": "jerome jerry",

		"jericho": "jericho",

		"jerika": "jerika",

		"jess": "jess jessica jesse jessie jessy",
		"jessica": "jess jessica",
		"jesse": "jess jesse jessie jessy",
		"jessie": "jess jesse jessie jessy",
		"jessy": "jess jesse jessie jessy",

		"jett": "jett jhett",
		"jhett": "jett jhett",

		"gelila": "gelila",

		"jiles": "jiles jyles",
		"jyles": "jiles jyles",

		"jill": "jilayne gillian jill jillian jelayne",

		"jelayne": "jilayne jill jelayne",
		"jilayne": "jilayne jill jelayne",

		"gillian": "gillian jill jillian",
		"jillian": "gillian jill jillian",


		"jim": "james jim jimmie jimmy",
		"jimmie": "james jim jimmie jimmy",
		"jimmy": "james jim jimmie jimmy",

		"joe": "joe joey joseph jo",
		"joey": "joe joey joseph jo",
		"joseph": "joe joey joseph jo",
		"jo": "joe joey joseph jo",

		"jobe": "jobe",

		"joel": "joel",

		"joan": "joan",

		"jonah": "jonah",

		"joni": "joni",

		"joann": "joann joanne",
		"joanne": "joann joanne",

		"joceline": "joceline jocelyn",
		"jocelyn": "joceline jocelyn",

		"jodi": "jodi jodie jody",
		"jodie": "jodi jodie jody",
		"jody": "jodi jodie jody",

		"john": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"johnny": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"jon": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"jonathan": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"jonathon": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"jonny": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"johnathon": "john johnny jon jonathan jonathon jonny johnathon johnathan",
		"johnathan": "john johnny jon jonathan jonathon jonny johnathon johnathan",

		"johnson": "johnson johnston",
		"johnston": "johnson johnston",

		"jauna": "jauna",

		"joyce": "joyce",

		"jolene": "jolene joylyn",

		"jose": "jose",

		"jolan": "jolan",

		"jolindie": "jolindie joline jolyn jolynn joylyn",
		"joline": "jolindie joline jolyn jolynn joylyn",
		"jolyn": "jolindie joline jolyn jolynn joylyn",
		"jolynn": "jolindie joline jolyn jolynn joylyn",

		"jordana": "jordana",

		/*jee*/ "gene": "eugene gene georgine jean jeanne",

		"georgine": "georgine jean jeanne gene",
		"jean": "georgine jean jeanne gene",
		"jeanne": "georgine jean jeanne gene",

		"george": "george georgie",
		"georgie": "george georgie",

		"georgette": "georgette",

		"georgia": "georgia jorja",
		"jorja": "georgia jorja",

		"georgina": "georgina gina",
		"gina": "georgina gina",

		"jordain": "jordain jordan jordane jordann jordin jordyn jordy",
		"jordan": "jordain jordan jordane jordann jordin jordyn jordy",
		"jordane": "jordain jordan jordane jordann jordin jordyn jordy",
		"jordann": "jordain jordan jordane jordann jordin jordyn jordy",
		"jordin": "jordain jordan jordane jordann jordin jordyn jordy",
		"jordyn": "jordain jordan jordane jordann jordin jordyn jordy",

		"jordy": "jordain jordan jordane jordann jordin jordyn jordy geordie",
		"geordie": "jordain jordan jordane jordann jordin jordyn geordie jordy",

		"josh": "josh joshua",
		"joshua": "josh joshua",

		"joylyn": "joylyn joylynn joylynne jolene joline jolyn jolynn",
		"joylynn": "joylyn joylynn joylynne jolene joline jolyn jolynn",
		"joylynne": "joylyn joylynn joylynne jolene joline jolyn jolynn",

		"jude": "jude judie judith judy",
		"judie": "jude judie judith judy",
		"judith": "jude judie judith judy",
		"judy": "jude judie judith judy",

		"jule": "jule jules julian julius jul",
		"jules": "jule jules julian julius jul",
		"julian": "jule jules julian julius jul",
		"julius": "jule jules julian julius jul",
		"jul": "jule jules julian julius jul",

		"julianne": "julianne julia julianna",
		"julia": "julianne julia julianna",
		"julianna": "julianne julia julianna",

		"julie": "julie juliet juliette julliette",
		"juliet": "julie juliet juliette julliette",
		"juliette": "julie juliet juliette julliette",
		"julliette": "julie juliet juliette julliette",

		"juneau": "juneau june",
		"june": "juneau june",

		"justice": "justice justus",
		"justus": "justice justus",

		"justina": "justina justine",
		"justine": "justina justine",

		/*k (and hard c)*/

		/*kay*/ "kay": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kaye kay",
		/*kay*/ "kaye": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kaye kay",

		/*kay*/ "cade": "cade kade kayd",
		/*kay*/ "kade": "cade kade kayd",
		/*kay*/ "kayd": "cade kade kayd",

		/*kay*/ "caden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "caiden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "cayden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "kaden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "kadin": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "kadyn": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "kaeden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "kaiden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
		/*kay*/ "kayden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",

		/*kay*/ "cael": "cael cailin kalon kalyn",

		/*kay*/ "cailin": "cael cailin kalon kalyn",
		/*kay*/ "kalon": "cael cailin kalon kalyn",
		/*kay*/ "kalyn": "cael cailin kalon kalyn",

		/*kay*/ "cayla": "cayla kaela kaila kayla kaylah keyla calla",
		/*kay*/ "kaela": "cayla kaela kaila kayla kaylah keyla calla",
		/*kay*/ "kaila": "cayla kaela kaila kayla kaylah keyla calla",
		/*kay*/ "kayla": "cayla kaela kaila kayla kaylah keyla calla",
		/*kay*/ "kaylah": "cayla kaela kaila kayla kaylah keyla calla",
		/*kay*/ "calla": "cayla kaela kaila kayla kaylah keyla calla",

		/*kay*/ "caleb": "caleb cayleb kaleb kayleb kaylob",
		/*kay*/ "cayleb": "caleb cayleb kaleb kayleb kaylob",
		/*kay*/ "kaleb": "caleb cayleb kaleb kayleb kaylob",
		/*kay*/ "kayleb": "caleb cayleb kaleb kayleb kaylob",
		/*kay*/ "kaylob": "caleb cayleb kaleb kayleb kaylob",

		/*kay*/ "kaelee": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kaelie": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kailee": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kailey": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kaylea": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kaylee": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kayleigh": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kayley": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kayli": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
		/*kay*/ "kaylie": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",

		/*kay*/ "kaylene": "kaylene",

		/*kay*/ "kalix": "kalix",

		/*kay*/ "kayce": "kayce",

		/*kay*/ "kaysen": "kaysen",

		/*kay*/ "casey": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kay*/ "cassey": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kay*/ "cassi": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kay*/ "cassie": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kay*/ "kasey": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kay*/ "cacee": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kay*/ "kasie": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",

		/*kay*/ "kate": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",

		/*kay*/ "caitlin": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "caitlyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "cateline": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "catelyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "kaitlan": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "kaitlin": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "kaitlyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "kaitlynn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "katelan": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "katelin": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "katelinn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "katelyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
		/*kay*/ "katelynn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",

		/*kay*/ "katie": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
		/*kay*/ "kattie": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
		/*kay*/ "katty": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
		/*kay*/ "katy": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",

		/*ka*/ "kajsa": "kajsa",

		/*k-air*/ "cara": "cara kara",
		/*k-air*/ "kara": "cara kara",

		/*k-air*/ "caren": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "carin": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "caryn": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "karen": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "karin": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "karon": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "karyn": "caren carin caryn karen karin karon karyn karren",
		/*k-air*/ "karren": "caren carin caryn karen karin karon karyn karren",

		/*k-air*/ "carey": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "carrie": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "carry": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "cary": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "karrie": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "keri": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "kerri": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "kerry": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "kari": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
		/*k-air*/ "kerrie": "carey carrie carry cary karrie keri kerri kerry kari kerrie",

		/*k-air*/ "kariann": "kari_ann kariann karianne carey_ann carrie_ann carry_ann cary_ann karrie_ann keri_ann kerri_ann kerry_ann kerrie_ann kari_anne carey_anne carrie_anne carry_anne cary_anne karrie_anne keri_anne kerri_anne kerry_anne kerrie_anne",
		/*k-air*/ "karianne": "kari_ann kariann karianne carey_ann carrie_ann carry_ann cary_ann karrie_ann keri_ann kerri_ann kerry_ann kerrie_ann kari_anne carey_anne carrie_anne carry_anne cary_anne karrie_anne keri_anne kerri_anne kerry_anne kerrie_anne",

		/*k-air*/ "carol": "carol carole carrol carroll karol",
		/*k-air*/ "carole": "carol carole carrol carroll karol",
		/*k-air*/ "carrol": "carol carole carrol carroll karol",
		/*k-air*/ "carroll": "carol carole carrol carroll karol",
		/*k-air*/ "karol": "carol carole carrol carroll karol",

		/*k-air*/ "caroline": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
		/*k-air*/ "carolyn": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
		/*k-air*/ "carolynn": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
		/*k-air*/ "karoline": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",


		/*kal*/ "cal": "cal calvin kel kelvin kalvin calby callum",
		/*kal*/ "calvin": "cal calvin kel kelvin kalvin",

		/*see kel*/

		/*kal*/ "kalvin": "cal calvin kel kelvin kalvin",
		/*kal*/ "calby": "calby cal",
		/*kal*/ "callum": "callum cal",

		/*kal*/ "cali": "cali callie kaleigh kaley kali calli kallie",
		/*kal*/ "callie": "cali callie kaleigh kaley kali calli kallie",
		/*kal*/ "kaley": "cali callie kaleigh kaley kali calli kallie",
		/*kal*/ "kali": "cali callie kaleigh kaley kali calli kallie",
		/*kal*/ "calli": "cali callie kaleigh kaley kali calli kallie",
		/*kal*/ "kallie": "cali callie kaleigh kaley kali calli kallie",
		/*kal*/ "kaleigh": "cali callie kaleigh kaley kali calli kallie",

		/*kal*/ "callena": "callena kalena",
		/*kal*/ "kalena": "callena kalena",

		/*kam*/ "cam": "cam cameron camron",
		/*kam*/ "cameron": "cam cameron camron",
		/*kam*/ "camron": "cam cameron camron",

		/*kam*/ "cambria": "cambria",

		/*kam*/ "camila": "camila camilla camille",
		/*kam*/ "camilla": "camila camilla camille",
		/*kam*/ "camille": "camila camilla camille",

		/*kan*/ "candace": "candace candice candy kandace kandis",
		/*kan*/ "candice": "candace candice candy kandace kandis",
		/*kan*/ "candy": "candace candice candy kandace kandis",
		/*kan*/ "kandace": "candace candice candy kandace kandis",
		/*kan*/ "kandis": "candace candice candy kandace kandis",

		/*kar*/ "charissa": "karissa charissa char",
		/*kar*/ "karissa": "karissa charissa char",

		/*kar*/ "carl": "carl carlos karl",
		/*kar*/ "carlos": "carl carlos karl",
		/*kar*/ "karl": "carl carlos karl",

		/*kar*/ "carla": "carla",

		/*kar*/ "karlon": "carline carlyne carlyn karlon carlin",
		/*kar*/ "carlyn": "carline carlyne carlyn karlon carlin karlene",
		/*kar*/ "carlin": "carline carlyne carlyn karlon carlin karlene",
		/*kar*/ "carline": "carline carlyne carlyn karlon carlin karlene",
		/*kar*/ "carlyne": "carline carlyne carlyn karlon carlin karlene",

		/*kar*/ "carlee": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "carleigh": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "carley": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "carli": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "carlie": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "carly": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "karlee": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "karleigh": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "karley": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "karli": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "karlie": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
		/*kar*/ "karly": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",

		/*kar*/ "karleen": "karleen karlene carline carlyne",
		/*kar*/ "karlene": "karlene karleen carline carlyne",

		/*kar*/ "carma": "carma karma",
		/*kar*/ "karma": "carma karma",

		/*kar*/ "carmen": "carmen carmine",
		/*kar*/ "carmine": "carmen carmine",

		/*kar*/ "carson": "carson karson",
		/*kar*/ "karson": "carson karson",

		/*kar*/ "carter": "carter",

		/*kash*/ "kashton": "kashton",

		/*kass*/ "cas": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra caspar casper",
		/*kass*/ "cass": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra caspar casper",

		/*kass*/ "kassandra": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kass*/ "casandra": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
		/*kass*/ "cassandra": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",

		/*kass*/ "caspar": "cas caspar casper cass",
		/*kass*/ "casper": "cas caspar casper cass",

		/*kass*/ "cassidy": "cas cass cassey cassi cassie kasey cacee kasie cassidy",

		/*kass*/ "cassia": "cas cass cassey cassi cassie kasey cacee kasie cassia kassia",
		/*kass*/ "kassia": "cassia kassia",

		/*kat*/ "catrina": "catrina catryna katrina katryna katherina tina treena trina",
		/*kat*/ "catryna": "catrina catryna katrina katryna katherina tina treena trina",
		/*kat*/ "katrina": "catrina catryna katrina katryna katherina tina treena trina",
		/*kat*/ "katryna": "catrina catryna katrina katryna katherina tina treena trina",
		/*kat*/ "katherina": "catrina catryna katrina katryna katherina tina treena trina",

		/*kath*/ "catharine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "catherine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "catheryn": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "cathie": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "cathryn": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "cathy": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "katharine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "katherine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "kathie": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "kathrine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "kathryn": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "kathrynne": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "kathy": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
		/*kath*/ "katryne": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",

		/*kath*/ "cathlin": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
		/*kath*/ "cathline": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
		/*kath*/ "cathleen": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
		/*kath*/ "kathleen": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
		/*kath*/ "kathlene": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
		/*kath*/ "kathlyn": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
		/*kath*/ "kathlynne": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",

		/*kaw*/ "calder": "calder",

		/*kaw*/ "colin": "colin collen collin",
		/*kaw*/ "collen": "colin collen collin",
		/*kaw*/ "collin": "colin collen collin",

		/*kaw*/ "coleen": "coleen colleen colene",
		/*kaw*/ "colleen": "coleen colleen colene",
		/*kaw*/ "colene": "coleen colleen colene",

		/*kaw*/ "connan": "connan",

		/*kaw*/ "con": "con connie conny",
		/*kaw*/ "connie": "con connie conny",
		/*kaw*/ "conny": "con connie conny",

		/*kaw*/ "connor": "connor",

		/*kaw*/ "cottage": "cottage",

		/*k-ear*/ "kirsten": "kirsten kyrsten",
		/*k-ear*/ "kyrsten": "kirsten kyrsten",

		/*see key*/

		/*kel*/ "kel": "kel kelley kelli kelly cal calvin kelvin kalvin",
		/*kel*/ "kelvin": "cal calvin kel kelvin kalvin",

		/*kel*/ "kellie": "kel kelley kelli kelly kellie",
		/*kel*/ "kelley": "kel kelley kelli kelly kellie",
		/*kel*/ "kelli": "kel kelley kelli kelly kellie",
		/*kel*/ "kelly": "kel kelley kelli kelly kellie",

		/*kel*/ "kelsey": "kelsey kelsi kelsie",
		/*kel*/ "kelsi": "kelsey kelsi kelsie",
		/*kel*/ "kelsie": "kelsey kelsi kelsie",

		/*kel*/ "kelton": "kelton kelty",
		/*kel*/ "kelty": "kelton kelty",

		/*ken*/ "kenna": "kenna",

		/*ken*/ "ken": "ken kenneth kenny",
		/*ken*/ "kenneth": "ken kenneth kenny kent",
		/*ken*/ "kenny": "ken kenneth kenny",

		/*ken*/ "kendell": "kendell kendall",
		/*ken*/ "kendall": "kendell kendall",

		/*ken*/ "kendra": "kendra",

		/*ken*/ "kennedi": "kennedi kennedy",
		/*ken*/ "kennedy": "kennedi kennedy",

		/*ken*/ "kent": "kenneth kent kenton",

		/*ken*/ "kenton": "kenton kent",

		/*ken*/ "kenya": "kanya kenya",
		/*ken*/ "kanya": "kanya kenya",

		/*ket*/ "ketchie": "ketchie katie",

		/*kev*/ "kev": "kev kevin",
		/*kev*/ "kevin": "kev kevin",

		/*key*/ "kianna": "kianna",

		/*key*/ "keidron": "keidron keadran keadren keadron kidran kidren kidron",
		/*key*/ "keadran": "keidron keadran keadren keadron kidran kidren kidron",
		/*key*/ "keadren": "keidron keadran keadren keadron kidran kidren kidron",
		/*key*/ "keadron": "keidron keadran keadren keadron kidran kidren kidron",
		/*key*/ "kidran": "keidron keadran keadren keadron kidran kidren kidron",
		/*key*/ "kidren": "keidron keadran keadren keadron kidran kidren kidron",
		/*key*/ "kidron": "keidron keadran keadren keadron kidran kidren kidron",

		/*key*/ "keagen": "keagen keaghan keegan",
		/*key*/ "keaghan": "keagen keaghan keegan",
		/*key*/ "keegan": "keagen keaghan keegan",

		/*key*/ "keyla": "keyla",

		/*key*/ "keely": "keely",

		/*key*/ "keonna": "keonna",

		/*key*/ "kesha": "kesha",

		/*key*/ "keaston": "keaston",

		/*key*/ "keith": "keith keithan",
		/*key*/ "keithan": "keith keithan",

		/*key*/ "keaton": "keaton",

		/*hard c long i*/

		/*k-eye*/"kya": "kya",

		/*k-eye*/"kyle": "kyle",

		/*k-eye*/"kyla": "kyla kylah",
		/*k-eye*/"kylah": "kyla kylah",

		/*k-eye*/"kylen": "kylen kylenn",
		/*k-eye*/"kylenn": "kylen kylenn",

		/*k-eye*/"kyler": "kyler",

		/*k-eye*/"kiley": "kiley kylee kyley kyli kylie",
		/*k-eye*/"kylee": "kiley kylee kyley kyli kylie",
		/*k-eye*/"kyley": "kiley kylee kyley kyli kylie",
		/*k-eye*/"kyli": "kiley kylee kyley kyli kylie",
		/*k-eye*/"kylie": "kiley kylee kyley kyli kylie",

		/*k-eye*/"kyliah": "kyliah kylea kyleigh",
		/*k-eye*/"kylea": "kyliah kylea kyleigh",
		/*k-eye*/"kyleigh": "kyliah kylea kyleigh",

		/*k-eye*/ "kyra": "kyra kyrah kyrha",
		/*k-eye*/ "kyrah": "kyra kyrah kyrha",
		/*k-eye*/ "kyrha": "kyra kyrah kyrha",

		/*k-eye*/ "kiral": "kiral",

		/*k-eye*/ "kyren": "kyren",

		/*kew*/ "kumar": "kumar",

		/*kew*/ "cooper": "cooper",

		/*k-ice*/"kyson": "kyson kysun",
		/*k-ice*/"kysun": "kyson kysun",

		/*hard c short i*/

		/*kih*/ "kynderly": "kynderly",

		/*kih*/ "kim": "kim kimberley kimberly",
		/*kih*/ "kimberley": "kim kimberley kimberly",
		/*kih*/ "kimberly": "kim kimberley kimberly",

		/*kih*/ "kipp": "kipp",

		/*kih*/ "kitchen": "kitchen",

		/*see k-ear*/

		/*kih*/ "kitly": "kitly",

		/*klah*/ "clancy": "clancy",

		/*kl-air*/ "clair": "clair claire clare",
		/*kl-air*/ "claire": "clair claire clare",
		/*kl-air*/ "clare": "clair claire clare",

		/*kl-air*/ "clara": "clara",

		/*kl-air*/ "clarence": "clarence",

		/*kl-air*/ "clarice": "clarice",

		/*klaw*/ "claud": "claud claude claudia",
		/*klaw*/ "claude": "claud claude claudia",
		/*klaw*/ "claudia": "claud claude claudia",

		/*klaw*/ "clark": "clark clarke",
		/*klaw*/ "clarke": "clark clarke",

		/*klay*/ "clay": "clay clayton",
		/*klay*/ "clayton": "clay clayton",

		/*kleh*/ "clem": "clem clement",
		/*kleh*/ "clement": "clem clement",

		/*klee*/ "cleo": "cleo clio",
		/*klee*/ "clio": "cleo clio",

		/*klee*/ "cleota": "cleota",

		/*klie*/ "clive": "clive",

		/*klih*/ "cliff": "cliff clifford ford",
		/*klih*/ "clifford": "cliff clifford ford",

		/*klih*/ "clint": "clint clinton",
		/*klih*/ "clinton": "clint clinton",

		/*kl-owe*/ "chloe": "chloe cloe khloe",
		/*kl-owe*/ "cloe": "cloe chloe khloe",
		/*kl-owe*/ "khloe": "chloe cloe khloe",

		/*kl-owe*/ "clover": "cloe clover",

		/*hard c long o*/

		/*k-owe*/ "koba": "koba",

		/*k-owe*/ "colby": "colby kobe",
		/*k-owe*/ "kobe": "colby kobe",

		/*k-owe*/ "cody": "cody",

		/*k-owe*/ "coen": "coen",

		/*k-owe*/ "cole": "cole",

		/*k-owe*/ "colt": "colt colter colton",
		/*k-owe*/ "colter": "colt colter",

		/*k-owe*/ "colton": "colt colton",

		/*k-owe*/ "cosette": "cosette",

		/*hard c short o*/

		/*see kaw*/

		/*see kuh*/

		/*kore*/ "cora": "cora kora",
		/*kore*/ "kora": "cora kora",

		/*kore*/ "coral": "coral",

		/*kore*/ "corban": "corban corbin korban korbin",
		/*kore*/ "corbin": "corban corbin korban korbin",
		/*kore*/ "korban": "corban corbin korban korbin",
		/*kore*/ "korbin": "corban corbin korban korbin",

		/*kore*/ "cornie": "cornie",

		/*kore*/ "coralee": "coralee cora_lee corey cory kory cori corri corrie",
		/*kore*/ "cora_lee": "coralee cora_lee corey cory kory cori corri corrie",

		/*kore*/ "kordell": "kordell",

		/*kore*/ "corey": "coralee cora_lee corey cory kory cori corri corrie coryden",
		/*kore*/ "cory": "coralee cora_lee corey cory kory cori corri corrie coryden",
		/*kore*/ "kory": "coralee cora_lee corey cory kory cori corri corrie coryden",
		/*kore*/ "cori": "coralee cora_lee corey cory kory cori corri corrie coryden",
		/*kore*/ "corri": "coralee cora_lee corey cory kory cori corri corrie coryden",
		/*kore*/ "corrie": "coralee cora_lee corey cory kory cori corri corrie coryden",

		/*kore*/ "coryden": "coryden corey cory kory cori corri corrie",

		/*kore*/ "corina": "corina corinna karina",
		/*kore*/ "corinna": "corina corinna karina",
		/*kore*/ "karina": "corina corinna karina",

		/*kore*/ "corine": "corine corinne corrine corynne coreen",
		/*kore*/ "corinne": "corine corinne corrine corynne coreen",
		/*kore*/ "corrine": "corine corinne corrine corynne coreen",
		/*kore*/ "corynne": "corine corinne corrine corynne coreen",
		/*kore*/ "coreen": "corine corinne corrine corynne coreen",

		/*kore*/ "cortney": "cortney courteney courtnee courtney kourtnee kourtney",
		/*kore*/ "courteney": "cortney courteney courtnee courtney kourtnee kourtney",
		/*kore*/ "courtnee": "cortney courteney courtnee courtney kourtnee kourtney",
		/*kore*/ "courtney": "cortney courteney courtnee courtney kourtnee kourtney",
		/*kore*/ "kourtnee": "cortney courteney courtnee courtney kourtnee kourtney",
		/*kore*/ "kourtney": "cortney courteney courtnee courtney kourtnee kourtney",

		/*koy*/ "coy": "coy kai kao",
		/*koy*/ "kai": "coy kai kao",
		/*koy*/ "kao": "coy kai kao",

		/*kray*/ "craig": "craig",

		/*krih*/ "krisean": "krisean kris chris criss",

		/*krih*/ "chris": "chris christian criss cristian kris kristian krystian christopher cris cristopher kristofer kristopher krisean",
		/*krih*/ "christian": "chris christian criss cristian kris kristian krystian",
		/*krih*/ "criss": "chris christian criss cristian kris kristian krystian krisean",
		/*krih*/ "cristian": "chris christian criss cristian kris kristian krystian",
		/*krih*/ "kris": "chris christian criss cristian kris kristian krystian christopher cris cristopher kristofer kristopher krisean krista",
		/*krih*/ "kristian": "chris christian criss cristian kris kristian krystian",
		/*krih*/ "krystian": "chris christian criss cristian kris kristian krystian",
		/*krih*/ "christopher": "chris christopher cris cristopher kris kristofer kristopher",
		/*krih*/ "cris": "chris christopher cris cristopher kris kristofer kristopher krisean",
		/*krih*/ "cristopher": "chris christopher cris cristopher kris kristofer kristopher",
		/*krih*/ "kristofer": "chris christopher cris cristopher kris kristofer kristopher",
		/*krih*/ "kristopher": "chris christopher cris cristopher kris kristofer kristopher",

		/*krih*/ "christensen": "christensen christianson",
		/*krih*/ "christianson": "christensen christianson",

		/*krih*/ "krista": "kris krista",

		/*krih*/ "christal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "chrystal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "cristal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "cristel": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "cristle": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "crystal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "crystel": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "kristle": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "krystal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
		/*krih*/ "krystle": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",

		/*krih*/ "christine": "christine kristen kristin kristine kristyn",
		/*krih*/ "kristen": "christine kristen kristin kristine kristyn",
		/*krih*/ "kristin": "christine kristen kristin kristine kristyn",
		/*krih*/ "kristine": "christine kristen kristin kristine kristyn",
		/*krih*/ "kristyn": "christine kristen kristin kristine kristyn",

		/*krih*/ "christina": "christina kristina",
		/*krih*/ "kristina": "christina kristina",

		/*krih*/ "christy": "christy chrysti cristy kristi kristie kristy christie",
		/*krih*/ "chrysti": "christy chrysti cristy kristi kristie kristy christie",
		/*krih*/ "cristy": "christy chrysti cristy kristi kristie kristy christie",
		/*krih*/ "kristi": "christy chrysti cristy kristi kristie kristy christie",
		/*krih*/ "kristie": "christy chrysti cristy kristi kristie kristy christie",
		/*krih*/ "kristy": "christy chrysti cristy kristi kristie kristy christie",
		/*krih*/ "christie": "christy chrysti cristy kristi kristie kristy christie",


		/*krih*/ "krisie": "krisie crissi chrissi chrissy crissy",
		/*krih*/ "crissi": "krisie crissi chrissi chrissy crissy",
		/*krih*/ "chrissi": "krisie crissi chrissi chrissy crissy",
		/*krih*/ "chrissy": "krisie crissi chrissi chrissy crissy",
		/*krih*/ "crissy": "krisie crissi chrissi chrissy crissy",

		/*krew*/ "cruz": "cruz",

		/*hard c short u*/

		/*kuh*/ "cook": "cook cooke",
		/*kuh*/ "cooke": "cook cooke",

		/*kur*/ "kirby": "kirby",

		/*kur*/ "kirk": "kirk",

		/*kur*/ "curt": "curt curtis kurt kurtis",
		/*kur*/ "curtis": "curt curtis kurt kurtis",
		/*kur*/ "kurt": "curt curtis kurt kurtis",
		/*kur*/ "kurtis": "curt curtis kurt kurtis",

		/*kure*/ "keera": "keera keira kiera kira kierra",
		/*kure*/ "keira": "keera keira kiera kira kierra",
		/*kure*/ "kiera": "keera keira kiera kira kierra",
		/*kure*/ "kira": "keera keira kiera kira kierra",
		/*kure*/ "kierra": "keera keira kiera kira kierra",

		/*kure*/ "kieran": "kieran",

		/*hard c long u see kew*/


		/*long a*/

		"lacey": "lacey",

		"lane": "lane lanie layne",
		"lanie": "lane lanie layne",
		"layne": "lane lanie layne",

		"leyton": "leyton",

		/*short a*/

		"lacombe": "lacombe",

		"ladawne": "ladawne ladonn ladon",
		"ladonn": "ladawne ladonn ladon",
		"ladon": "ladawne ladonn ladon",

		"lana": "alana alanna lana",

		"lance": "lance lancelot launcelot",
		"lancelot": "lance lancelot launcelot",
		"launcelot": "lance lancelot launcelot",

		"lancy": "lancy",

		"landon": "landon landyn",
		"landyn": "landon landyn",

		"larry": "larry",

		"larson": "larson larsen",
		"larsen": "larson larsen",

		"lauchie": "lauchie",

		"lavila": "lavila",

		"lavonne": "lavonne",

		"lavern": "lavern laverne",
		"laverne": "lavern laverne",

		"laverna": "laverna verna",
		"verna": "laverna verna",

		"layla": "layla leila",
		"leila": "layla leila",

		/*long e*/

		"lee": "lee leigh leroy lees",
		"leigh": "lee leigh",

		"lees": "lee lees",

		"lea": "lea leah lia leanor",
		"leah": "lea leah lia leanor",
		"lia": "lea leah lia leanor",
		"leanor": "lea leah lia leanor",

		"liane": "leanne liane lea_ann lea_anne lee_ann lee_anne",
		"lea_ann": "leanne liane lea_ann lea_anne lee_ann lee_anne",
		"lea_anne": "leanne liane lea_ann lea_anne lee_ann lee_anne",
		"lee_ann": "leanne liane lea_ann lea_anne lee_ann lee_anne",
		"lee_anne": "leanne liane lea_ann lea_anne lee_ann lee_anne",
		"leanne": "leanne liane lea_ann lea_anne lee_ann lee_anne",

		"leanna": "leanna leiana",
		"leiana": "leanna leiana",

		"liam": "liam",

		"leif": "leif",

		"leo": "leo leon leonard",
		"leon": "leo leon leonard",

		"leona": "leona",

		"lisa": "lisa lissa mel melissa",
		"lissa": "lisa lissa mel melissa",

		"leta": "leta",

		"leroy": "lee leroy roy",

		"levi": "levi",

		/*short e*/

		"leonard": "len lennie lenny leo leon leonard",

		"lenora": "lenora lenore leonora leonore nora norah",
		"lenore": "lenora lenore leonora leonore nora norah",
		"leonora": "lenora lenore leonora leonore nora norah",
		"leonore": "lenora lenore leonora leonore nora norah",
		"nora": "lenora lenore leonora leonore nora norah",
		"norah": "lenora lenore leonora leonore nora norah",

		"len": "len lennie lenny leo leon leonard",
		"lennie": "len lennie lenny leo leon leonard",
		"lenny": "len lennie lenny leo leon leonard",

		"lem": "lem",

		"les": "les lesley leslie lester",
		"lesley": "les lesley leslie",
		"leslie": "les lesley leslie",
		"lester": "les lester",

		"leticia": "leticia letisha letitia lettie tish tisha",
		"letisha": "leticia letisha letitia lettie tish tisha",
		"letitia": "leticia letisha letitia lettie tish tisha",
		"lettie": "leticia letisha letitia lettie tish tisha",
		"tish": "leticia letisha letitia lettie tish tisha",
		"tisha": "leticia letisha letitia lettie tish tisha",

		"levonie": "levonie",

		"lex": "al alec aleck alex alexander alix lex sander sandy",

		"lexus": "lexus",

		"lidia": "lidia lydia",
		"lydia": "lidia lydia",

		"lil": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lili": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lilian": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lill": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lilli": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lillian": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lillie": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lilly": "lil lili lilian lill lilli lillian lillie lilly lily",
		"lily": "lil lili lilian lill lilli lillian lillie lilly lily",

		"lynn": "lynn lynne",
		"lynne": "lynn lynne",

		"linarra": "linarra linara",
		"linara": "linarra linara",

		"linnea": "linnea lynnea",
		"lynnea": "linnea lynnea",

		"linc": "linc lincoln",
		"lincoln": "linc lincoln",

		"linda": "linda lynda",
		"lynda": "linda lynda",

		"lindsay": "lindsay lindsey lyndsay lyndsey lynsi",
		"lindsey": "lindsay lindsey lyndsay lyndsey lynsi",
		"lyndsay": "lindsay lindsey lyndsay lyndsey lynsi",
		"lyndsey": "lindsay lindsey lyndsay lyndsey lynsi",
		"lynsi": "lindsay lindsey lyndsay lyndsey lynsi",

		"lynella": "lynella",

		"linette": "linette lynette",
		"lynette": "linette lynette",

		"lynlee": "lynlee",

		"lysia": "lysia",

		/*liz*/ "liz": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*liz*/ "lizbeth": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*liz*/ "lizzie": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
		/*liz*/ "lizzy": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",

		"logan": "logan",

		"lois": "lois",

		"lon": "al alonso alonzo lon lonnie lonny",
		"lonnie": "al alonso alonzo lon lonnie lonny",
		"lonny": "al alonso alonzo lon lonnie lonny",

		"larissa": "larissa lorisa",
		"lorisa": "larissa lorisa",

		"lars": "lars laurence laurie lawrence lawrie lorence lorenzo",
		"laurence": "lars laurence laurie lawrence lawrie lorence lorenzo",
		"lawrence": "lars laurence laurie lawrence lawrie lorence lorenzo",
		"lorence": "lars laurence laurie lawrence lawrie lorence lorenzo",
		"lorenzo": "lars laurence laurie lawrence lawrie lorence lorenzo",

		"etta": "etta lauretta loretta retta",
		"lauretta": "etta lauretta loretta retta",
		"loretta": "etta lauretta loretta retta",
		"retta": "etta lauretta loretta retta",

		"laura": "laura lora",
		"lora": "laura lora",

		"lauraine": "lauraine loraine lorrain lorraine",
		"loraine": "lauraine loraine lorrain lorraine",
		"lorrain": "lauraine loraine lorrain lorraine",
		"lorraine": "lauraine loraine lorrain lorraine",

		"laureen": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"lauren": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"laurene": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"laurine": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"loreen": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"loren": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"lorene": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"lorine": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"laurenne": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
		"lorreen": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",

		"laurel": "laurel lorel",
		"lorel": "laurel lorel",

		"lauri": "lauri laurie lawrie lori lorie lorri lorrie loree",
		"lori": "lauri laurie lawrie lori lorie lorri lorrie loree",
		"lorie": "lauri laurie lawrie lori lorie lorri lorrie loree",
		"lorri": "lauri laurie lawrie lori lorie lorri lorrie loree",
		"lorrie": "lauri laurie lawrie lori lorie lorri lorrie loree",
		"loree": "lauri laurie lawrie lori lorie lorri lorrie loree",
		"laurie": "lars laurence laurie lawrence lawrie lorence lorenzo lauri lori lorie lorri lorrie loree",
		"lawrie": "lars laurence laurie lawrence lawrie lorence lorenzo lauri lori lorie lorri lorrie loree",

		"lareelyn": "lareelyn",

		"laurinda": "laurinda lorinda",
		"lorinda": "laurinda lorinda",

		"lorne": "lorne",

		"lorna": "lorna",

		"loyal": "loyal",

		"lloyd": "lloyd loy loyd loyde",
		"loy": "lloyd loy loyd loyde lloydminster",
		"loyd": "lloyd loy loyd loyde",
		"loyde": "lloyd loy loyd loyde",

		"lloydminster": "lloydminster",

		"lou": "lewis lou louie louis luis lucinda lucy luci lucie luanne louise lucile lucille luella",

		"luanne": "luanne lou",

		"lewis": "lewis lou louie louis luis",
		"louie": "lewis lou louie louis luis",
		"louis": "lewis lou louie louis luis",
		"luis": "lewis lou louie louis luis",

		"lucinda": "lucinda lou luci lucy lucie",
		"lucy": "luci lucie lucy lucinda",
		"luci": "luci lucie lucy lucinda",
		"lucie": "luci lucie lucy lucinda",

		"lucas": "lucas luke lukas",
		"luke": "lucas luke lukas",
		"lukas": "lucas luke lukas",

		"luella": "luella lou",

		"lucile": "lucile lucille lou",
		"lucille": "lucile lucille lou",

		"louise": "louise lou",

		"luleta": "luleta",

		"luther": "luther",

		"lila": "lila",

		"lyle": "lyle",

		"mae": "mae may",
		"may": "mae may",

		"mabel": "mabel mabelle mable",
		"mabelle": "mabel mabelle mable",
		"mable": "mabel mabelle mable",

		"mason": "mason",

		"mace": "mace macy",
		"macy": "mace macy",

		"madge": "midge madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",

		"maddox": "maddox",

		"maigan": "maigan meagan meg megan meghan",
		"meagan": "maigan meagan meg megan meghan",
		"meg": "maigan meagan meg megan meghan",
		"megan": "maigan meagan meg megan meghan",
		"meghan": "maigan meagan meg megan meghan",

		"mavis": "mavis maivis",
		"maivis": "mavis maivis",

		"mcdougal": "mcdougal macdougall",
		"macdougall": "mcdougal macdougall",

		"mcdonald": "mcdonald macdonald",
		"macdonald": "mcdonald macdonald",

		"macrae": "macrae mcrae",
		"mcrae": "macrae mcrae",


		"mackenzie": "mackenzie makenzie mckenzie mackenzi mac mack",
		"makenzie": "mackenzie makenzie mckenzie mackenzi mac mack",
		"mckenzie": "mackenzie makenzie mckenzie mackenzi mac mack",
		"mackenzi": "mackenzie makenzie mckenzie mackenzi mac mack",
		"mac": "mackenzie makenzie mckenzie mackenzi mac mack",
		"mack": "mackenzie makenzie mckenzie mackenzi mac mack",

		"makaila": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"makayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"mckayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"micaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"michaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"mikaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"mikayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"mikhayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
		"mychaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",

		"mckenna": "mckenna",

		"mclane": "mclane maclean mclean",
		"mclean": "mclane maclean mclean",
		"maclean": "mclane maclean mclean",

		/*mah*/ "madalynn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madeleine": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madeline": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madelyn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madelynn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madilyn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madilynn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "madelene": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",

		/*mah*/ "maddison": "maddison madison maddie maddy mady",
		/*mah*/ "madison": "maddison madison maddie maddy mady",

		/*mah*/ "maddie": "maddison madison madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "maddy": "maddison madison madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
		/*mah*/ "mady": "maddison madison madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",

		/*mah*/ "maggie": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory magdalen magdaline",

		/*mah*/ "magdalen": "magdalen magdaline maggie",
		/*mah*/ "magdaline": "magdalen magdaline maggie",

		/*mah*/ "mal": "mal malc malcolm mallory malachi",

		/*mah*/ "malc": "mal malc malcolm",
		/*mah*/ "malcolm": "mal malc malcolm",

		/*mah*/ "malachi": "malachi mel mal",

		/*mah*/ "mallory": "mallory mal mel",

		/*mah*/ "mancel": "mancel",

		/*mah*/ "mandi": "amanda mandi mandy",
		/*mah*/ "mandy": "amanda mandi mandy",

		/*mah*/ "manson": "manson",

		/*mah*/ "mat": "mat matt matthew",
		/*mah*/ "matt": "mat matt matthew",
		/*mah*/ "matthew": "mat matt matthew",

		/*mah*/ "mataya": "mataya",

		/*mah*/ "maverick": "maverick",

		/*mah*/ "max": "max",

		/*mah*/ "maxine": "maxine",

		/*maw*/ "mathilda": "hilda hildie hylda mathilda matilda",
		/*maw*/ "matilda": "hilda hildie hylda mathilda matilda",

		"marc": "marc marcus mark markus",
		"mark": "marc marcus mark markus",

		"marcus": "marc marcus mark markus",
		"markus": "marc marcus mark markus",

		"marg": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",

		"margie": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",

		"margret": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
		"margaret": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
		"marguerite": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",

		"marie": "marie mary mari",
		"mari": "marie mary mari",

		"marina": "marina",

		"mariah": "mariah maria moriah",
		"maria": "mariah maria moriah",
		"moriah": "mariah maria moriah",

		"marge": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",

		"margery": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
		"marjorie": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
		"marjory": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",

		"marla": "marla",

		"marleen": "marleen",

		"marlin": "marlin marlon",
		"marlon": "marlin marlon",

		"marni": "marni",

		"marsha": "marsha",

		"marshal": "marshal marshall",
		"marshall": "marshal marshall",

		"marcela": "marcela",

		"marci": "marci marcie marcy",
		"marcie": "marci marcie marcy",
		"marcy": "marci marcie marcy",

		"mart": "mart martin marty",
		"martin": "mart martin marty",
		"marty": "mart martin marty",

		"martha": "martha",

		"marv": "marv marvin merv mervin marvyn",

		"marvin": "marv marvin merv mervin marvyn",
		"marvyn": "marv marvin merv mervin marvyn",

		/*see mah*/

		"medicine": "medicine",

		"mel": "lisa lissa mel melissa melanie melinda mindy melvin melisa",
		"melissa": "lisa lissa mel melissa",

		"melanie": "mel melanie",
		"melinda": "mel melinda mindy",
		"melvin": "mel melvin",

		"melisa": "melisa mel",

		"maralee": "maralee",

		"mary": "marie mary mari",

		"mariam": "mariam",

		"mariette": "mariette",

		"marissa": "marissa",

		"marian": "marian marianne marion maryann maryanne mary_anne mary_ann",
		"marianne": "marian marianne marion maryann maryanne mary_anne mary_ann",
		"marion": "marian marianne marion maryann maryanne mary_anne mary_ann",
		"maryann": "marian marianne marion maryann maryanne mary_anne mary_ann",
		"maryanne": "marian marianne marion maryann maryanne mary_anne mary_ann",
		"mary_anne": "marian marianne marion maryann maryanne mary_anne mary_ann",
		"mary_ann": "marian marianne marion maryann maryanne mary_anne mary_ann",

		"marilyn": "marilyn marilynn marlene marlyn marylin merilyn",
		"marilynn": "marilyn marilynn marlene marlyn marylin merilyn",
		"marlene": "marilyn marilynn marlene marlyn marylin merilyn",
		"marlyn": "marilyn marilynn marlene marlyn marylin merilyn",
		"marylin": "marilyn marilynn marlene marlyn marylin merilyn",
		"merilyn": "marilyn marilynn marlene marlyn marylin merilyn",

		"merika": "merika",

		"merle": "merle",

		"merlin": "merlin",

		"mercedes": "mercedes mercy sadie",
		"mercy": "mercedes mercy",

		"myrtle": "myrtle",

		"merv": "marv marvin merv mervin marvyn",
		"mervin": "marv marvin merv mervin marvyn",

		"mia": "mia maia maya mya",
		"maia": "mia maia maya mya",
		"maya": "mia maia maya mya",
		"mya": "mia maia maya mya",

		"mikka": "mikka micah meeka maika",
		"micah": "mikka micah meeka maika",
		"meeka": "mikka micah meeka maika",
		"maika": "mikka micah meeka maika",

		"mieke": "mieke mikai mikie",
		"mikai": "mieke mikai mikie",
		"mikie": "mieke mikai mikie",

		"myla": "myla",

		"milan": "milan",

		"millie": "millie",

		"miles": "miles myles",
		"myles": "miles myles",

		"mira": "mira myra",
		"myra": "mira myra",

		"mikiyo": "mikiyo",

		"micael": "micael michael micheal mickey mike mikel",
		"michael": "micael michael micheal mickey mike mikel",
		"micheal": "micael michael micheal mickey mike mikel",
		"mickey": "micael michael micheal mickey mike mikel",
		"mike": "micael michael micheal mickey mike mikel",
		"mikel": "micael michael micheal mickey mike mikel",

		"michele": "michele michelle",
		"michelle": "michele michelle",

		"midge": "madge midge",

		"miguel": "miguel",

		"mildred": "mildred",

		"mindy": "mel melinda mindy",

		"minea": "minea",

		"minerva": "minerva",

		"mitch": "mitch mitchell",
		"mitchell": "mitch mitchell",

		"mo": "mo moe mose moses",
		"moe": "mo moe mose moses",
		"mose": "mo moe mose moses",
		"moses": "mo moe mose moses",

		"mollie": "mollie molly",
		"molly": "mollie molly",

		"monica": "monica monika",
		"monika": "monica monika",

		"montague": "montague monte montgomery monty",
		"monte": "montague monte montgomery monty",
		"montgomery": "montague monte montgomery monty",
		"monty": "montague monte montgomery monty",

		"maureen": "maureen",

		"morgan": "morgan",

		"maurice": "maurice morris",
		"morris": "maurice morris",

		"mumu": "mumu",

		"munro": "munro",

		"muriel": "muriel",

		"murray": "murray",

		/*nah*/ "nadine": "dee nadine",

		/*nah*/ "nanda": "nanda",
		/*nah*/ "narcylheen": "narcylheen",
		/*nah*/ "nash": "nash",

		/*nah*/ "nan": "nan nana nance nancie nancy nanny nina",

		/*nah*/ "nana": "nan nana nance nancie nancy nanny nina",

		/*nah*/ "nance": "nan nana nance nancie nancy nanny nina",
		/*nah*/ "nancie": "nan nana nance nancie nancy nanny nina",
		/*nah*/ "nancy": "nan nana nance nancie nancy nanny nina",

		/*nah*/ "nanny": "nan nana nance nancie nancy nanny nina",

		/*nah*/ "nat": "nat nate nathan nathanial nathaniel",
		/*nah*/ "nathanial": "nat nate nathan nathanial nathaniel",
		/*nah*/ "nathaniel": "nat nate nathan nathanial nathaniel",

		/*nah*/ "natalia": "natalia natalie nathalie",
		/*nah*/ "natalie": "natalia natalie nathalie",
		/*nah*/ "nathalie": "natalia natalie nathalie",

		/*nah*/ "natasha": "natasha nattie natty natisha",
		/*nah*/ "nattie": "natasha nattie natty natisha",
		/*nah*/ "natty": "natasha nattie natty natisha",
		/*nah*/ "natisha": "natasha nattie natty natisha",

		/*nay*/ "nathan": "nat nate nathan nathanial nathaniel",
		/*nay*/ "nate": "nat nate nathan nathanial nathaniel",


		/*nay*/ "naomi": "naomi",

		/*nee*/ "nita": "nita anita jenita renita renata reta rita",

		/*nee*/ "neal": "neal neil",
		/*nee*/ "neil": "neal neil",

		/*nee*/ "nielson": "nielson nielsen neilson neilsen",
		/*nee*/ "nielsen": "nielson nielsen neilson neilsen",
		/*nee*/ "neilson": "nielson nielsen neilson neilsen",
		/*nee*/ "neilsen": "nielson nielsen neilson neilsen",

		/*neh*/ "nell": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
		/*neh*/ "nelle": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
		/*neh*/ "nellie": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
		/*neh*/ "nelly": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",

		/*neh*/ "ned": "ed edmond edmund eddie eddy edwin ned ted teddy theo theodore edie",

		/*neh*/ "netta": "netta nettie netty",
		/*neh*/ "nettie": "netta nettie netty",
		/*neh*/ "netty": "netta nettie netty",

		/*neh*/ "nevil": "nevil nevill neville",
		/*neh*/ "nevill": "nevil nevill neville",
		/*neh*/ "neville": "nevil nevill neville",

		"nicholas": "nic nicholas nikolas nick nicolas nicholus",
		"nikolas": "nic nicholas nikolas nick nicolas nicholus",
		"nick": "nic nicholas nikolas nick nicolas nicholus",
		"nicolas": "nic nicholas nikolas nick nicolas nicholus",
		"nicholus": "nic nicholas nikolas nick nicolas nicholus",

		"niko": "nicole nikki nikky nicki nicky nicol nic niko",
		"nic": "nicole nikki nikky nicki nicky nicol nic niko",
		"nicole": "nicole nikki nikky nicki nicky nicol nic niko",
		"nikki": "nicole nikki nikky nicki nicky nicol nic niko",
		"nikky": "nicole nikki nikky nicki nicky nicol nic niko",
		"nicki": "nicole nikki nikky nicki nicky nicol nic niko",
		"nicky": "nicole nikki nikky nicki nicky nicol nic niko",
		"nicol": "nicole nikki nikky nicki nicky nicol nic niko",

		/*nix*/ "nixon": "nixon",

		/*nigh*/ "ngaire": "ngaire",

		/*nigh*/ "nigel": "nigel",

		/*nigh*/ "niles": "niles",

		/*nigh*/ "nina": "nan nana nance nancie nancy nanny nina",

		/*no*/ "noah": "noah",

		/*no*/ "noel": "noel nowell noelle",
		/*no*/ "nowell": "noel nowell noelle",
		/*no*/ "noelle": "noel nowell noelle",

		/*no*/ "nola": "nola",

		/*no*/ "nolan": "nolan",

		/*no*/ "nona": "nona",

		/*non*/ "nonylheen": "nonylheen",

		/*nor*/ "norma": "norma",

		/*nor*/ "norton": "norton",

		/*nor*/ "norm": "norm norman",
		/*nor*/ "norman": "norm norman",

		"neuman": "neuman neumann",
		"neumann": "neuman neumann",


		/*see are*/
		/*see aw*/
		/*see all*/

		/*or*/ "orin": "orin orrin orrion",
		/*or*/ "orrin": "orin orrin orrion",
		/*or*/ "orrion": "orin orrin orrion",

		/*or*/ "orlyn": "orlyn",

		/*or*/ "orma": "orma",

		/*or*/ "orton": "orton",

		/*oh*/ "oakley": "oakley",

		/*oh*/ "odessa": "odessa",

		/*oh*/ "olds": "olds",

		/*oh*/ "olson": "olson olsen olsson",
		/*oh*/ "olsen": "olson olsen olsson",
		/*oh*/ "olsson": "olson olsen olsson",

		/*oh*/ "ove": "ove",

		/*oh*/ "owen": "owen",

		/*ow*/ "hour": "hour",

		/*pah*/ "pam": "pam pamela pammie pammy",
		/*pah*/ "pamela": "pam pamela pammie pammy",
		/*pah*/ "pammie": "pam pamela pammie pammy",
		/*pah*/ "pammy": "pam pamela pammie pammy",

		/*pah*/ "pat": "pat patricia patsy patti pattie patty tricia trish trisha trissie patrick",
		/*pah*/ "patricia": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		/*pah*/ "patsy": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		/*pah*/ "patti": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		/*pah*/ "pattie": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		/*pah*/ "patty": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		/*pah*/ "patrick": "pat patrick",

		/*pah*/ "pattison": "pattison paddison",
		/*pah*/ "paddison": "pattison paddison",

		/*paw*/ "paul": "paul",
		/*paw*/ "pauline": "pauline",
		/*paw*/ "ponoka": "ponoka",
		/*paw*/ "possibly": "possibly",

		/*par*/ "parke": "parke parks",
		/*par*/ "parks": "parke parks",

		/*par*/ "park": "park pk",
		/*par*/ "pk": "park pk",


		/*pay*/ "paye": "payton peyton paye paige",

		/*pay*/ "paige": "paige paye page",
		/*pay*/ "page": "paige page",

		/*pay*/ "payton": "payton peyton paye",
		/*pay*/ "peyton": "payton peyton paye",

		/*pair*/ "perry": "perry",

		/*see pur*/

		/*peh*/ "peggy": "peggy",
		/*peh*/ "penny": "penny",

		/*see f*/

		/*pee*/ "pete": "pete peter",
		/*pee*/ "peter": "pete peter",

		/*pee*/ "peterson": "petersen peterson",
		/*pee*/ "petersen": "petersen peterson",

		/*pih*/ "pipke": "pipke",

		/*prayer*/ "prairie": "prairie",

		/*preh*/ "preston": "preston",

		/*prih*/ "priscilla": "priscilla",

		/*pur*/ "pearl": "pearl",
		/*pur*/ "percy": "percy",

		/*quay*/ "kwade": "kwade",

		/*quih*/ "quentin": "quentin quenton quinn quintin quinton kwyntin",
		/*quih*/ "quenton": "quentin quenton quinn quintin quinton kwyntin",
		/*quih*/ "quintin": "quentin quenton quinn quintin quinton kwyntin",
		/*quih*/ "quinton": "quentin quenton quinn quintin quinton kwyntin",
		/*quih*/ "kwyntin": "quentin quenton quinn quintin quinton kwyntin",

		/*quih*/ "quincy": "quentin quenton quincy quinn quintin quinton kwyntin",

		/*quih*/ "quindy": "quindy quinn",

		/*quih*/ "quinn": "quentin quenton quincy quindy quinn quintin quinton kwyntin",

		/*ra*/ "rachael": "rachael rachel rachelle",
		/*ra*/ "rachel": "rachael rachel rachelle",
		/*ra*/ "rachelle": "rachael rachel rachelle",

		/*ra*/ "racquel": "racquel raquel",
		/*ra*/ "raquel": "racquel raquel",

		/*ra*/ "radhika": "radhika",
		/*ra*/ "ralph": "ralph",
		/*ra*/ "ramona": "ramona",
		/*ra*/ "randy": "randy",
		/*ra*/ "ransom": "ransom",

		/*raw*/ "rob": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
		/*raw*/ "robbie": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
		/*raw*/ "robby": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
		/*raw*/ "robert": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
		/*raw*/ "robin": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
		/*raw*/ "robyn": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",

		/*raw*/ "roberta": "roberta",

		/*raw*/ "rocky": "rocky",

		/*raw*/ "roderic": "rick ricky roderic roderick rod roddy",
		/*raw*/ "roderick": "rick ricky roderic roderick rod roddy",

		/*raw*/ "rod": "rod roddy roderic roderick rodney rodger roger",
		/*raw*/ "roddy": "rod roddy roderic roderick rodney",
		/*raw*/ "rodney": "rod roddy rodney",
		/*raw*/ "rodger": "rod rodger roger",
		/*raw*/ "roger": "rod rodger roger",

		/*raw*/ "ron": "ron ronald ronnie ronny",
		/*raw*/ "ronald": "ron ronald ronnie ronny",
		/*raw*/ "ronnie": "ron ronald ronnie ronny ronni veronica",
		/*raw*/ "ronny": "ron ronald ronnie ronny ronni veronica",

		/*raw*/ "ronni": "ron ronald ronnie ronny ronni veronica",

		/*raw*/ "rhonda": "rhonda ronda",
		/*raw*/ "ronda": "rhonda ronda",

		/*raw*/ "roselin": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",
		/*raw*/ "rosalyn": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",
		/*raw*/ "rozlynn": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",

		/*raw*/ "roscoe": "roscoe ross",
		/*raw*/ "ross": "roscoe ross",

		/*raw*/ "roxana": "roxana roxanna roxanne roxie roxy",
		/*raw*/ "roxanna": "roxana roxanna roxanne roxie roxy",
		/*raw*/ "roxanne": "roxana roxanna roxanne roxie roxy",
		/*raw*/ "roxie": "roxana roxanna roxanne roxie roxy",
		/*raw*/ "roxy": "roxana roxanna roxanne roxie roxy",

		/*ray*/ "ray": "ray raymond raymund raynold",

		/*ray*/ "raya": "raya raina rana rayma",

		/*ray*/ "raeanne": "rhiannon raeanne reanne riane",
		/*ray*/ "reanne": "rhiannon raeanne reanne riane",

		/*ray*/ "raelyn": "raelyn raelynn",
		/*ray*/ "raelynn": "raelyn raelynn",

		/*ray*/ "rayma": "rayma raya",

		/*ray*/ "raina": "raina rana raya",
		/*ray*/ "rana": "raina rana raya",

		/*ray*/ "raymond": "ray raymond raymund",
		/*ray*/ "raymund": "ray raymond raymund",
		/*ray*/ "raynold": "raynold ray",

		/*ree*/ "riane": "raeanne reanne riane",

		/*ree*/ "rhiannon": "rhiannon raeanne reanne riane",

		/*ree*/ "rio": "rio",

		/*ree*/ "reagan": "reagan regan",
		/*ree*/ "regan": "reagan regan",

		/*ree*/ "reece": "reece reese rhys",
		/*ree*/ "reese": "reece reese rhys",
		/*ree*/ "rhys": "reece reese rhys",

		/*ree*/ "reed": "reed reid read",
		/*ree*/ "reid": "reed reid read",
		/*ree*/ "read": "reed reid read",

		/*ree*/ "reta": "renita renata reta rita nita",
		/*ree*/ "rita": "renita renata reta rita nita",

		/*reh*/ "rebecca": "beck becky rebecca rebekah",
		/*reh*/ "rebekah": "beck becky rebecca rebekah",

		/*reh*/ "red": "red",

		/*reh*/ "reg": "reg reggie reginald",
		/*reh*/ "reggie": "reg reggie reginald",
		/*reh*/ "reginald": "reg reggie reginald",

		/*reh*/ "relieta": "relieta",
		/*reh*/ "rex": "rex",
		/*reh*/ "rhett": "rhett",

		/*reh*/ "remington": "remington remi remy",
		/*reh*/ "remi": "remington remi remy",
		/*reh*/ "remy": "remington remi remy",

		/*reh*/ "rena": "renae rena rene",
		/*reh*/ "renae": "renae rena rene",

		/*reh*/ "rene": "renie renae rene renee rennie renny reni renie",

		/*reh*/ "renee": "renie rene renee rennie renny reni renie",
		/*reh*/ "rennie": "renie rene renee rennie renny reni renie",
		/*reh*/ "renny": "renie rene renee rennie renny reni renie",
		/*reh*/ "renie": "renie rene renee rennie renny reni renie",

		/*reh*/ "renita": "renita renata reta rita nita",
		/*reh*/ "renata": "renita renata reta rita nita",

		/*r-eye*/ "rian": "rian rion ryan ryon",
		/*r-eye*/ "rion": "rian rion ryan ryon",
		/*r-eye*/ "ryan": "rian rion ryan ryon",
		/*r-eye*/ "ryon": "rian rion ryan ryon",

		/*r-eye*/ "rydan": "rydan",

		/*r-eye*/ "ryder": "ryder",

		/*r-eye*/ "ryker": "ryker",

		/*r-eye*/ "rylan": "rylan rylen ryland",
		/*r-eye*/ "rylen": "rylan rylen ryland",

		/*r-eye*/ "ryland": "rylan rylen ryland",

		/*r-eye*/ "ryley": "ryley reilly riley rilea",
		/*r-eye*/ "reilly": "ryley reilly riley rilea",
		/*r-eye*/ "riley": "ryley reilly riley rilea",
		/*r-eye*/ "rilea": "ryley reilly riley rilea",

		/*see raw*/

		/*see r-eye*/

		/*rih*/ "rich": "broderick rich richard richie rick ricky",
		/*rih*/ "richard": "broderick rich richard richie rick ricky",
		/*rih*/ "richie": "broderick rich richard richie rick ricky",
		/*rih*/ "rick": "broderick rich richard richie rick ricky roderic roderick frederic frederick fredric fredrick",
		/*rih*/ "ricky": "broderick rich richard richie rick ricky roderic roderick frederic frederick fredric fredrick",

		/*roar*/ "rorke": "rorke",
		/*roar*/ "rory": "rory",

		/*row*/ "rodey": "rodey rhodey",
		/*row*/ "rhodey": "rodey rhodey",

		/*row*/ "rohini": "rohini rowena",

		/*row*/ "roland": "roland rolland",
		/*row*/ "rolland": "roland rolland",

		/*row*/ "rolanda": "rolanda rolando",
		/*row*/ "rolando": "rolanda rolando",

		/*row*/ "roman": "roman",

		/*row*/ "ronan": "ronan",

		/*row*/ "rowan": "rowan",

		/*row*/ "rowena": "rohini rowena",

		/*row*/ "rose": "rosabel rosabelle rose rosie rosy rosa rosalee rosalie roselea rosa_lee rosa_lea rosaline roselin rosalyn rozlynn rosanne rosemarie rosemary rose_marie rose_mary",

		/*row*/ "rosa": "rosabel rosabelle rose rosie rosy rosa rosabella",

		/*row*/ "rosabel": "rosabel rosabelle rose rosie rosy rosa",
		/*row*/ "rosabelle": "rosabel rosabelle rose rosie rosy rosa",

		/*row*/ "rosabella": "rosabella rosa",

		/*row*/ "rosalee": "rosalee rosalie rose rosie rosy rosa rosa roselea rosa_lee rosa_lea",
		/*row*/ "rosalie": "rosalee rosalie rose rosie rosy rosa rosa roselea rosa_lee rosa_lea",
		/*row*/ "roselea": "rosalee rosalie rose rosie rosy rosa rosa roselea rosa_lee rosa_lea",

		/*row*/ "rosaline": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",

		/*row*/ "rosanna": "rosanna roseanna rose_anna",
		/*row*/ "roseanna": "rosanna roseanna rose_anna",

		/*row*/ "rosanne": "rosanne rose rosie rosy rose_anne rose_ann",

		/*row*/ "rosemarie": "rose rosemarie rosemary rosie rosy rose_marie rose_mary",
		/*row*/ "rosemary": "rose rosemarie rosemary rosie rosy rose_marie rose_mary",

		/*row*/ "rosie": "rosabel rosabelle rose rosie rosy rosa rosalee rosalie roselea rosa_lee rosa_lea rosaline roselin rosalyn rozlynn rosanne rosemarie rosemary rose_marie rose_mary",
		/*row*/ "rosy": "rosabel rosabelle rose rosie rosy rosa rosalee rosalie roselea rosa_lee rosa_lea rosaline roselin rosalyn rozlynn rosanne rosemarie rosemary rose_marie rose_mary",

		/*see raw*/

		/*see roar*/

		/*roy*/ "roy": "leroy roy royden royal",

		/*roy*/ "royal": "royal roy",

		/*roy*/ "royden": "royden roy",

		/*rue*/ "reuben": "reuben",

		/*rue*/ "rubie": "rubie ruby",
		/*rue*/ "ruby": "rubie ruby",

		/*rue*/ "ruth": "ruth ruthie",
		/*rue*/ "ruthie": "ruth ruthie",

		/*ruh*/ "russ": "russ russel russell",
		/*ruh*/ "russel": "russ russel russell",
		/*ruh*/ "russell": "russ russel russell",

		/*say*/ "sabby": "brina sabby sabrina",

		/*say*/ "sadie": "mercedes sadie",

		/*say*/ "sage": "sage",

		/*say*/ "saya": "saya",

		/*say*/ "saylor": "saylor",

		/*say*/ "saint": "saint st",

		/*say*/ "sayvrie": "sayvrie",

		/*say*/ "sailey": "sailey",

		/*sah*/ "sabrina": "brina sabby sabrina",

		"sal": "sal sallie sally",
		"sallie": "sal sallie sally",
		"sally": "sal sallie sally",

		"sander": "al alec aleck alex alexander alix lex sander sandy",

		"sam": "sam samantha sammie sammy samuel",
		"samantha": "sam samantha sammie sammy",
		"sammie": "sam samantha sammie sammy",
		"sammy": "sam samantha sammie sammy samuel",
		"samuel": "sam sammy samuel",

		"samara": "samara samaria",
		"samaria": "samara samaria",

		"sandra": "sandra sandy sandi",
		"sandi": "sandra sandy sandi",
		"sandy": "sandy sandra sandi",

		"sara": "sara sarah",
		"sarah": "sara sarah",

		"sari": "sari sarita",
		"sarita": "sari sarita",

		"savanna": "savanna savannah",
		"savannah": "savanna savannah",

		"scott": "scott scottie scotty",
		"scottie": "scott scottie scotty",
		"scotty": "scott scottie scotty",

		"seb": "seb sebastian",
		"sebastian": "seb sebastian",

		"celine": "celine selene",
		"selene": "celine selene",

		"celena": "celena celina lena lina selena selina",
		"celina": "celena celina lena lina selena selina",
		"lena": "celena celina lena lina selena selina",
		"lina": "celena celina lena lina selena selina",
		"selena": "celena celina lena lina selena selina",
		"selina": "celena celina lena lina selena selina",

		"sienna": "sienna syena ciana",
		"syena": "sienna syena ciana",
		"ciana": "sienna syena ciana",

		"sierra": "sierra ciara",
		"ciara": "sierra ciara",

		"cecily": "cecily cicely cissy sissy",
		"cicely": "cecily cicely cissy sissy",

		"cissy": "cecelia cecilia cecillia celia cissy sissy cecil cecile cecily cicely sissi",
		"sissy": "cecelia cecilia cecillia celia cissy sissy cecil cecile cecily cicely sissi",
		"sissi": "cecelia cecilia cecillia celia cissy sissy cecil cecile cecily cicely sissi",

		"cindy": "cindy cynth cynthia cyndi",
		"cynth": "cindy cynth cynthia cyndi",
		"cynthia": "cindy cynth cynthia cyndi",
		"cyndi": "cindy cynth cynthia cyndi",

		"cecelia": "cecelia cecilia cecillia celia cissy sissy sissi",
		"cecilia": "cecelia cecilia cecillia celia cissy sissy sissi",
		"cecillia": "cecelia cecilia cecillia celia cissy sissy sissi",
		"celia": "cecelia cecilia cecillia celia cissy sissy sissi",
		"cecil": "cecil cecile cissy sissy sissi",
		"cecile": "cecil cecile cissy sissy sissi",

		"shaeli": "shaeli",

		"shaelyn": "shaelyn shaelynne shaelynn",
		"shaelynne": "shaelyn shaelynne shaelynn",
		"shaelynn": "shaelyn shaelynne shaelynn",

		"shaylene": "cheylene shaylene",
		"cheylene": "cheylene shaylene",

		"shayla": "shayla shiella",
		"shiella": "shayla shiella",

		"shane": "shane shayne",
		"shayne": "shane shayne",

		"shalaina": "shalaina",

		"chandra": "chandra",

		"shannon": "shannon",

		"chantal": "chantal",

		"charl": "char charl charlene sharleen charlotte",
		"charlotte": "char charl charlotte",

		"charlene": "char charl charlene sharleen",
		"sharleen": "char charl charlene sharleen",
		"char": "char charl charlene sharleen charlotte",

		"sharon": "sharon sharron",
		"sharron": "sharon sharron",

		"sean": "sean shaun shawn shaan",
		"shaun": "sean shaun shawn shaan",
		"shawn": "sean shaun shawn shaan",
		"shaan": "sean shaun shawn shaan",

		"shauna": "shauna shawna",
		"shawna": "shauna shawna",

		"shalanne": "shalanne chelan",
		"chelan": "chelan shalanne",

		"shelley": "shelley shelli shelly",
		"shelli": "shelley shelli shelly",
		"shelly": "shelley shelli shelly",

		"sheridan": "sheridan",

		"sherri": "sherri sherry",
		"sherry": "sherri sherry",

		"cheryl": "cheryl sherrill sheryl",
		"sherrill": "cheryl sherrill sheryl",
		"sheryl": "cheryl sherrill sheryl",

		"cherene": "cherene",

		"cheyanne": "cheyanne",

		"shirl": "shirl shirlee shirley shirlie",
		"shirlee": "shirl shirlee shirley shirlie",
		"shirley": "shirl shirlee shirley shirlie",
		"shirlie": "shirl shirlee shirley shirlie",

		"sid": "sid sidney syd sydney",
		"sidney": "sid sidney syd sydney",
		"syd": "sid sidney syd sydney",
		"sydney": "sid sidney syd sydney",

		"silvester": "silvester syl sylvester vester",
		"syl": "silvester syl sylvester vester silvia sylvia sylvie",
		"sylvester": "silvester syl sylvester vester",
		"vester": "silvester syl sylvester vester",
		"silvia": "silvia syl sylvia sylvie",
		"sylvia": "silvia syl sylvia sylvie",
		"sylvie": "silvia syl sylvia sylvie",

		"sylvain": "sylvain sylvene",
		"sylvene": "sylvain sylvene",

		"simeon": "simeon simon",
		"simon": "simeon simon",

		"simons": "simons simmonds",
		"simmonds": "simons simmonds",

		"cynder": "cynder",

		"cyril": "cyril",

		"sofia": "sofia sofie sophia sophie sophy",
		"sofie": "sofia sofie sophia sophie sophy",
		"sophia": "sofia sofie sophia sophie sophy",
		"sophie": "sofia sofie sophia sophie sophy",
		"sophy": "sofia sofie sophia sophie sophy",

		"sophiane": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
		"sophie_anne": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
		"sofie_anne": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
		"sophie_ann": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
		"sofie_ann": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",

		"sonia": "sonia sonya",
		"sonya": "sonia sonya",

		"spencer": "spencer spence",
		"spence": "spencer spence",

		"stan": "stan stanley",
		"stanley": "stan stanley",

		/*stay*/ "stacey": "eustace eustacia stacey staci stacia stacie stacy",
		/*stay*/ "staci": "eustace eustacia stacey staci stacia stacie stacy",
		/*stay*/ "stacie": "eustace eustacia stacey staci stacia stacie stacy",
		/*stay*/ "stacy": "eustace eustacia stacey staci stacia stacie stacy",

		/*stay*/ "stacia": "eustacia stacey staci stacia stacie stacy",


		"stef": "stef stefan steff steffan steph stephan stephen steve steven stevie stefanie steffanie stephanie stephany stephie stephanne",
		"stefan": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"steff": "stef stefan steff steffan steph stephan stephen steve steven stevie stefanie steffanie stephanie stephany stephie stephanne",
		"steffan": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"steph": "stef stefan steff steffan steph stephan stephen steve steven stevie stefanie steffanie stephanie stephany stephie stephanne",
		"stephan": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"stephen": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"steve": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"steven": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"stevie": "stef stefan steff steffan steph stephan stephen steve steven stevie",
		"stefanie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
		"steffanie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
		"stephanie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
		"stephany": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
		"stephie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
		"stephanne": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",

		"stew": "stew stewart stu stuart",
		"stewart": "stew stewart stu stuart",
		"stu": "stew stewart stu stuart",
		"stuart": "stew stewart stu stuart",

		"sue": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy suhanthy",

		"susan": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susana": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susanna": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susannah": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susanne": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susi": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susie": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"susy": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"suzanne": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"suzie": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
		"suzy": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",

		/*sue*/ "suhanthy": "suhanthy sue",

		/*tay*/ "tacy": "tacy",

		/*tay*/ "taylor": "taylor",

		/*tay*/ "tayla": "tayla",

		/*tah*/  "tabby": "tabby tabitha",
		/*tah*/  "tabitha": "tabby tabitha",

		/*tah*/ "talan": "talan",

		/*tah*/ "talia": "talia tahlia",
		/*tah*/ "tahlia": "talia tahlia",

		/*tah*/ "tamar": "tamar tamara tammie tammy",

		/*tah*/ "tamara": "tamar tamara tammie tammy",

		/*tah*/ "tamaine": "tamaine tammie tammy ",

		/*tah*/ "tammie": "tamar tamara tammie tammy tamaine",
		/*tah*/ "tammy": "tamar tamara tammie tammy tamaine",

		/*tah*/ "tana": "tanna tana",
		/*tah*/ "tanna": "tanna tana",

		/*tah*/ "tania": "tania tanya tonia tonya tanna",
		/*tah*/ "tanya": "tania tanya tonia tonya tanna",

		/*tah*/ "tanika": "tanika",
		/*tah*/ "tanis": "tanis",
		/*tah*/ "tanner": "tanner",
		/*tah*/ "tanzi": "tanzi",
		/*tah*/ "tasha": "tasha",

		/*tah*/ "tatiana": "tatiana tetchienna",

		/*tar*/ "tarissa": "tarissa",

		/*taw*/ "tonia": "tania tanya tonia tonya tanna",
		/*taw*/ "tonya": "tania tanya tonia tonya tanna",

		/*tee*/ "teagen": "teagen tegan teagan",
		/*tee*/ "tegan": "teagen tegan teagan",
		/*tee*/ "teagan": "teagen tegan teagan",

		/*tee*/ "teeya": "tia teeya",
		/*tee*/ "tia": "tia teeya",

		/*tee*/ "teija": "teija",

		/*tee*/ "teo": "teo",

		/*tee*/ "tiara": "tiara",

		/*tee*/ "tina": "catrina catryna katrina katryna katherina tina treena trina",

		/*teh*/ "ted": "ed edmond edmund eddie eddy ned ted teddy theo theodore edie",
		/*teh*/ "teddy": "ed edmond edmund eddie eddy ned ted teddy theo theodore edie",

		/*teh*/ "terell": "terell terrill",
		/*teh*/ "terrill": "terell terrill",

		/*teh*/ "terence": "terence terrance terrence terry teri terri terrie",
		/*teh*/ "terrance": "terence terrance terrence terry teri terri terrie",
		/*teh*/ "terrence": "terence terrance terrence terry teri terri terrie",

		/*teh*/ "therese": "teresa tess tessa tessie theresa therese",

		/*teh*/ "teresa": "teresa tess tessa tessie theresa therese",
		/*teh*/ "theresa": "teresa tess tessa tessie theresa therese",

		/*teh*/ "terry": "terence terrance terrence terry teri terri terrie teresa theresa therese",
		/*teh*/ "teri": "terence terrance terrence terry teri terri terrie teresa theresa therese",
		/*teh*/ "terri": "terence terrance terrence terry teri terri terrie teresa theresa therese",
		/*teh*/ "terrie": "terence terrance terrence terry teri terri terrie teresa theresa therese",

		/*teh*/ "tess": "teresa tess tessa tessie theresa therese",

		/*teh*/ "tessa": "teresa tess tessa tessie theresa therese",

		/*teh*/ "tessie": "teresa tess tessa tessie theresa therese",

		/*teh*/ "tetchienna": "tatiana tetchienna",

		/*thee*/ "theodore": "ed eddie eddy ned ted teddy theo theodore edie",

		/*thee*/ "theo": "dora theo theodora ed eddie eddy edgar edward edwin ned ted teddy theodore edie",

		/*thee*/ "theodora": "dora theo theodora",

		"tiff": "tiff tiffany tiffy",
		"tiffany": "tiff tiffany tiffy",
		"tiffy": "tiff tiffany tiffy",

		"tim": "tim timmy timothy",
		"timmy": "tim timmy timothy",
		"timothy": "tim timmy timothy",

		/*toe*/ "tony": "anthony anton antony tony",

		"thom": "thom thomas tom tommy tomas",
		"thomas": "thom thomas tom tommy tomas",
		"tom": "thom thomas tom tommy tomas",
		"tommy": "thom thomas tom tommy tomas",
		"tomas": "thom thomas tom tommy tomas",

		"tod": "tod todd",
		"todd": "tod todd",

		"tracey": "tracey traci tracie tracy trissie",
		"traci": "tracey traci tracie tracy trissie",
		"tracie": "tracey traci tracie tracy trissie",
		"tracy": "tracey traci tracie tracy trissie",

		"trenton": "trenton trent",
		"trent": "trenton trent",

		"treena": "catrina catryna katrina katryna katherina tina treena trina",
		"trina": "catrina catryna katrina katryna katherina tina treena trina",

		"tristan": "tristan trystan",
		"trystan": "tristan trystan",

		"tricia": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		"trish": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		"trisha": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
		"trissie": "pat patricia patsy patti pattie patty tricia trish trisha trissie tracey traci tracie tracy",

		/*true*/ "trudie": "gertie gertrude trudie trudy gertraud",
		/*true*/ "trudy": "gertie gertrude trudie trudy gertraud",

		"twila": "twila twyla",
		"twyla": "twila twyla",

		"ty": "ty tyler tyce tyson tyrel tyrell tyrrell tyrone",
		"tyler": "ty tyler",
		"tyce": "tyce tyson ty",
		"tyson": "tyce tyson ty",
		"tyrel": "tyrel tyrell tyrrell ty",
		"tyrell": "tyrel tyrell tyrrell ty",
		"tyrrell": "tyrel tyrell tyrrell ty",
		"tyrone": "tyrone ty",

		/*ur*/ "earl": "earl earle",
		/*ur*/ "earle": "earl earle",

		/*ur*/ "erma": "erma",

		/*ur*/ "earnest": "earnest ernest ernie",
		/*ur*/ "ernest": "earnest ernest ernie",
		/*ur*/ "ernie": "earnest ernest ernie",

		/*ur*/ "erv": "erv ervin irv irvin irvine irving vin ervyn",
		/*ur*/ "ervin": "erv ervin irv irvin irvine irving vin ervyn",
		/*ur*/ "irv": "erv ervin irv irvin irvine irving vin ervyn",
		/*ur*/ "irvin": "erv ervin irv irvin irvine irving vin ervyn",
		/*ur*/ "irvine": "erv ervin irv irvin irvine irving vin ervyn",
		/*ur*/ "irving": "erv ervin irv irvin irvine irving vin ervyn",
		/*ur*/ "ervyn": "erv ervin irv irvin irvine irving vin ervyn",

		/*ur*/ "erwin": "erwin irwin win",
		/*ur*/ "irwin": "erwin irwin win",

		"val": "val valarie valerie valery valori",
		"valarie": "val valarie valerie valery valori",
		"valerie": "val valarie valerie valery valori",
		"valery": "val valarie valerie valery valori",
		"valori": "val valarie valerie valery valori",

		"vanesa": "vanesa vanessa vinessa",
		"vanessa": "vanesa vanessa vinessa",
		"vinessa": "vanesa vanessa vinessa",

		/*ver*/ "vern": "vern vernon",
		/*ver*/ "vernon": "vern vernon",

		/*ver*/ "veronica": "ronni ronnie ronny veronica",

		"vetta": "vetta vettie yvette",
		"vettie": "vetta vettie yvette",
		"yvette": "vetta vettie yvette",

		"vianna": "vianna vienna",
		"vienna": "vianna vienna",

		"vic": "vic vick vicki vickie vicky victoria viki vikki victor",
		"vick": "vic vick vicki vickie vicky victoria viki vikki victor",
		"vicki": "vic vick vicki vickie vicky victoria viki vikki",
		"vickie": "vic vick vicki vickie vicky victoria viki vikki",
		"vicky": "vic vick vicki vickie vicky victoria viki vikki",
		"victoria": "vic vick vicki vickie vicky victoria viki vikki",
		"viki": "vic vick vicki vickie vicky victoria viki vikki",
		"vikki": "vic vick vicki vickie vicky victoria viki vikki",
		"victor": "vic vick victor",

		"vin": "vin vince vincent vinny alvin elvin ervin irvin irvine irving ervyn",
		"vinny": "vin vince vincent vinny alvin elvin ervin irvin irvine irving ervyn",

		"vince": "vin vince vincent vinny",
		"vincent": "vin vince vincent vinny",

		"violet": "violet violette",
		"violette": "violet violette",

		"viv": "viv vivian vivien vivienne",
		"vivian": "viv vivian vivien vivienne",
		"vivien": "viv vivian vivien vivienne",
		"vivienne": "viv vivian vivien vivienne",

		"vonna": "vonna vonnie yvonne",
		"vonnie": "vonna vonnie yvonne",
		"yvonne": "vonna vonnie yvonne",

		/*wah*/ "hua": "hua",

		/*wah*/ "wallace": "wallace wally",

		/*wah*/ "wally": "wallace wally walt walter",

		/*wah*/ "waltz": "waltz waltze",
		/*wah*/ "waltze": "waltz waltze",

		/*wah*/ "walker": "walker",

		/*wah*/ "walt": "wally walt walter",
		/*wah*/ "walter": "wally walt walter",

		/*wah*/ "wanda": "wanda",

		/*wah*/ "waselenko": "waselenko waslenko",
		/*wah*/ "waslenko": "waselenko waslenko",

		/*war*/ "warren": "warren",

		/*war*/ "warrick": "warrick",

		"wade": "wade",

		"wane": "wane wayne",
		"wayne": "wane wayne",

		"wainwright": "wainwright",

		"waylon": "waylon weylan",
		"weylan": "waylon weylan",

		/*weh*/ "weather": "weather",

		/*weh*/ "wendell": "wendell",

		/*weh*/ "wendy": "gwen gwendolen gwendolyn wendy gwynne",

		/*weh*/ "wes": "wes wesley",
		/*weh*/ "wesley": "wes wesley",

		/*weh*/ "wetaskiwin": "wetaskiwin",

		/*w-eye*/ "wyatt": "wyatt",

		/*w-eye*/ "wiley": "wiley wylie wylee",
		/*w-eye*/ "wylie": "wiley wylie wylee",
		/*w-eye*/ "wylee": "wiley wylie wylee",

		/*w-eye*/ "whitecourt": "whitecourt",

		/*will*/ "will": "bill billie billy will willi william willie willy wilber wilbur wilson",

		/*will*/ "wilfred": "wilfred winfred fred freddie freddy wilf",

		/*will*/ "willi": "bill billie billy will willi william willie willy wilber wilbur wilson",
		/*will*/ "william": "bill billie billy will willi william willie willy",
		/*will*/ "willie": "bill billie billy will willi william willie willy wilber wilbur wilson",
		/*will*/ "willy": "bill billie billy will willi william willie willy wilber wilbur wilson",

		/*will*/ "willa": "willa",

		/*will*/ "wilber": "wilber wilbur will willi willie willy",
		/*will*/ "wilbur": "wilber wilbur will willi willie willy",

		/*will*/ "wilma": "wilma",

		/*will*/ "wilf": "wilf wilfred",

		/*will*/ "wilson": "will willi willie willy wilson",

		/*win*/ "winn": "alwin alwyn win elwin elwyn erwin irwin winston winn wynn win",
		/*win*/ "wynn": "alwin alwyn win elwin elwyn erwin irwin winston winn wynn win",
		/*win*/ "win": "alwin alwyn win elwin elwyn erwin irwin winston winn wynn",

		/*win*/ "winfred": "wilfred winfred fred freddie freddy",

		/*win*/ "winston": "winston winn wynn win",

		/*woh*/ "wood": "el elwood wood woodrow woody",
		/*woh*/ "woodrow": "el elwood wood woodrow woody",
		/*woh*/ "woody": "el elwood wood woodrow woody",

		/*see w-eye*/

		/*yar*/ "yari": "yari",

		/*y-owe*/ "yolanda": "yolanda yolande",
		/*y-owe*/ "yolande": "yolanda yolande",

		/*yuh*/ "young": "young",

		/*zay*/ "zane": "zane",

		"zach": "zach zachariah zacharias zachary zack zacky",
		"zachariah": "zach zachariah zacharias zachary zack zacky",
		"zacharias": "zach zachariah zacharias zachary zack zacky",
		"zachary": "zach zachariah zacharias zachary zack zacky",
		"zack": "zach zachariah zacharias zachary zack zacky",
		"zacky": "zach zachariah zacharias zachary zack zacky",

		"zahra": "zahra zara zarah",
		"zara": "zahra zara zarah",
		"zarah": "zahra zara zarah",

		/*zeh*/ "zephan": "zephan",
		/*zeh*/ "zev": "zev",

		/*z-eye*/ "zion": "zion",

		"zoe": "zoe zoey",
		"zoey": "zoe zoey",

		/*zuh*/ "zurich": "zurich",

		/*unfinished/ungrouped*/

		/*sa*/ "saffron": "saffron",
		/*sa*/ "sahara": "sahara",
		/*sa*/ "samrana": "samrana",
		/*sa*/ "savitri": "savitri",

		/*soy*/ "sawyer": "sawyer",

		/*seh*/ "seldon": "seldon",
		/*seh*/ "seth": "seth",
		/*seh*/ "separated": "separated",

		/*see*/ "seona": "seona",
		/*see*/ "simone": "simone",

		/*sir*/ "services": "services",
		/*sir*/ "suresh": "suresh",

		/*shar*/ "sharla": "sharla",
		/*shar*/ "sharmilla": "sharmilla",

		/*she*/ "sheena": "sheena",
		/*she*/ "sheila": "sheila",

		/*sheh*/ "shelby": "shelby",
		/*sheh*/ "sheldon": "sheldon",
		/*sheh*/ "shenay": "shenay",

		/*shy*/ "shiloh": "shiloh",

		/*shih*/ "shizuka": "shizuka",

		/*sky*/ "ski": "ski",
		/*sky*/ "skyla": "skyla",
		/*sky*/ "skylar": "skylar",
		/*sky*/ "skyra": "skyra",

		/*sleigh*/ "slade": "slade",
		/*sleigh*/ "slater": "slater",

		/*sew*/ "solidad": "solidad",

		/*saw*/ "songhua": "songhua song",
		/*saw*/ "song": "songhua song",
		/*saw*/ "sonnette": "sonnette",

		/*stee*/ "steel": "steel",
		/*stee*/ "steen": "steen",

		/*steh*/ "stella": "stella",

		/*stir*/ "sterling": "sterling",

		/*steh*/ "stetson": "stetson stet",
		/*steh*/ "stet": "stetson stet",

		/*strah*/ "stratton": "stratton stratson strat",
		/*strah*/ "strat": "stratton stratson strat",
		/*strah*/ "stratson": "stratton stratson strat",

		/*suh*/ "sullivan": "sullivan sully",
		/*suh*/ "sully": "sullivan sully",

		/*suh*/ "summy": "summy",
		/*suh*/ "sunjay": "sunjay",

		/*t-air*/ "tara": "tara",
		/*t-air*/ "taryn": "taryn",

		/*teh*/ "tenielle": "tenielle",

		/*the*/ "thelma": "thelma",

		/*th-eye*/ "thyra": "thyra",

		/*tie*/ "titus": "titus",

		/*toe*/ "toby": "toby",

		/*tore*/ "tor": "tor",
		/*tore*/ "tori": "tori",

		/*toy*/ "toyin": "toyin",

		/*trah*/ "travis": "travis",

		/*treh*/ "trellyn": "trellyn",
		/*treh*/ "trevor": "trevor",

		/*tray*/ "trey": "trey treyson",
		/*tray*/ "treyson": "trey treyson",

		/*trih*/ "trinity": "trinity",
		/*trih*/ "trista": "trista",

		/*troy*/ "troy": "troy",

		/*true*/ "trudi": "trudi",

		/*trih*/ "tryn": "tryn",

		/*tuh*/ "tucker": "tucker",

		/*ew*/ "una": "una",

		/*ur*/ "urs": "urs",

		/*vah*/ "vance": "vance",
		/*vah*/ "vaughn": "vaughn",

		/*veh*/ "ventress": "ventress",

		/*ver*/ "verdell": "verdell",
		/*ver*/ "vermilion": "vermilion",
		/*ver*/ "virginia": "virginia",
		/*ver*/ "verne": "verne",

		/*vih*/ "vinod": "vinod",

		/*temp until remove last comma after last name*/"end": "end"
	};