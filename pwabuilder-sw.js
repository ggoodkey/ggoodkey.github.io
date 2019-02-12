////This is the "Offline copy of pages" service worker

////Install stage sets up the index page (home page) in the cache and opens a new cache
//self.addEventListener('install', function (event) {
//	var indexPage = new Request('index.html');
//	event.waitUntil(
//		fetch(indexPage).then(function (response) {
//			return caches.open('pwabuilder-offline').then(function (cache) {
//				console.log('[PWA Builder] Cached index page during Install' + response.url);
//				return cache.put(indexPage, response);
//			});
//		}));
//});

////If any fetch fails, it will look for the request in the cache and serve it from there first
//self.addEventListener('fetch', function (event) {
//	var updateCache = function (request) {
//		return caches.open('pwabuilder-offline').then(function (cache) {
//			return fetch(request).then(function (response) {
//				console.log('[PWA Builder] add page to offline' + response.url)
//				return cache.put(request, response);
//			});
//		});
//	};

//	event.waitUntil(updateCache(event.request));

//	event.respondWith(
//		fetch(event.request).catch(function (error) {
//			console.log('[PWA Builder] Network request Failed. Serving content from cache: ' + error);

//			//Check to see if you have it in the cache
//			//Return response
//			//If not in the cache, then return error page
//			return caches.open('pwabuilder-offline').then(function (cache) {
//				return cache.match(event.request).then(function (matching) {
//					var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
//					return report
//				});
//			});
//		})
//	);
//})









//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
	"favicon.ico",
	"browserconfig.xml",
	"cordova.js",
	"index.html",
	"manifest.json",
	//"pwabuilder-sw.js",
	"css/icons.css",
	"css/index.css",
	"css/fonts/glyphicons-halflings-regular.eot",
	"css/fonts/glyphicons-halflings-regular.svg",
	"css/fonts/glyphicons-halflings-regular.ttf",
	"css/fonts/glyphicons-halflings-regular.woff",
	"css/fonts/glyphicons-halflings-regular.woff2",
	"icon.png",
	"apple-touch-icon.png",
	"apple-touch-icon-152x152.png",
	//"apple-touch-icon-167x167.png",

	//"images/android/android-launchericon-48-48.png",
	//"images/android/android-launchericon-72-72.png",
	//"images/android/android-launchericon-96-96.png",
	//"images/android/android-launchericon-144-144.png",
	//"images/android/android-launchericon-192-192.png",
	//"images/android/android-launchericon-512-512.png",
	//"images/chrome/chrome-extensionmanagementpage-48-48.png",
	//"images/chrome/chrome-favicon-16-16.png",
	//"images/chrome/chrome-installprocess-128-128.png",
	//"images/firefox/firefox-general-16-16.png",
	//"images/firefox/firefox-general-32-32.png",
	//"images/firefox/firefox-general-48-48.png",
	//"images/firefox/firefox-general-64-64.png",
	//"images/firefox/firefox-general-90-90.png",
	//"images/firefox/firefox-general-128-128.png",
	//"images/firefox/firefox-general-256-256.png",
	//"images/firefox/firefox-marketplace-128-128.png",
	//"images/firefox/firefox-marketplace-512-512.png",
	//"images/ios/ios-appicon-76-76.png",
	//"images/ios/ios-appicon-120-120.png",
	//"images/ios/ios-appicon-152-152.png",
	//"images/ios/ios-appicon-180-180.png",
	//"images/ios/ios-appicon-1024-1024.png",
	//"images/ios/ios-launchimage-640-960.png",
	//"images/ios/ios-launchimage-640-1136.png",
	//"images/ios/ios-launchimage-750-1334.png",
	//"images/ios/ios-launchimage-768-1024.png",
	//"images/ios/ios-launchimage-1024-768.png",
	//"images/ios/ios-launchimage-1242-2208.png",
	//"images/ios/ios-launchimage-1334-750.png",
	//"images/ios/ios-launchimage-1536-2048.png",
	//"images/ios/ios-launchimage-2048-1536.png",
	//"images/ios/ios-launchimage-2208-1242.png",
	//"images/windows/SplashScreen.scale-100.png",
	//"images/windows/SplashScreen.scale-125.png",
	//"images/windows/SplashScreen.scale-150.png",
	//"images/windows/SplashScreen.scale-200.png",
	//"images/windows/SplashScreen.scale-400.png",
	//"images/windows/Square44x44Logo.scale-100.png",
	//"images/windows/Square44x44Logo.scale-125.png",
	//"images/windows/Square44x44Logo.scale-150.png",
	//"images/windows/Square44x44Logo.scale-200.png",
	//"images/windows/Square44x44Logo.scale-400.png",
	//"images/windows/Square44x44Logo.targetsize-16.png",
	//"images/windows/Square44x44Logo.targetsize-16_altform-unplated.png",
	//"images/windows/Square44x44Logo.targetsize-24.png",
	//"images/windows/Square44x44Logo.targetsize-24_altform-unplated.png",
	//"images/windows/Square44x44Logo.targetsize-48.png",
	//"images/windows/Square44x44Logo.targetsize-48_altform-unplated.png",
	//"images/windows/Square44x44Logo.targetsize-256.png",
	//"images/windows/Square44x44Logo.targetsize-256_altform-unplated.png",
	//"images/windows/Square71x71Logo.scale-100.png",
	//"images/windows/Square71x71Logo.scale-125.png",
	//"images/windows/Square71x71Logo.scale-150.png",
	//"images/windows/Square71x71Logo.scale-200.png",
	//"images/windows/Square71x71Logo.scale-400.png",
	//"images/windows/Square150x150Logo.scale-100.png",
	//"images/windows/Square150x150Logo.scale-125.png",
	//"images/windows/Square150x150Logo.scale-150.png",
	//"images/windows/Square150x150Logo.scale-200.png",
	//"images/windows/Square150x150Logo.scale-400.png",
	//"images/windows/Square310x310Logo.scale-100.png",
	//"images/windows/Square310x310Logo.scale-125.png",
	//"images/windows/Square310x310Logo.scale-150.png",
	//"images/windows/Square310x310Logo.scale-200.png",
	//"images/windows/Square310x310Logo.scale-400.png",
	//"images/windows/StoreLogo.scale-100.png",
	//"images/windows/StoreLogo.scale-125.png",
	//"images/windows/StoreLogo.scale-150.png",
	//"images/windows/StoreLogo.scale-200.png",
	//"images/windows/StoreLogo.scale-400.png",
	//"images/windows/Wide310x150Logo.scale-100.png",
	//"images/windows/Wide310x150Logo.scale-125.png",
	//"images/windows/Wide310x150Logo.scale-150.png",
	//"images/windows/Wide310x150Logo.scale-200.png",
	//"images/windows/Wide310x150Logo.scale-400.png",
	//"images/windows/windowsphone-appicon-62-62.png",
	//"images/windows/windowsphone-appicon-106-106.png",
	//"images/windows/windowsphone-mediumtile-360-360.png",
	//"images/windows/windowsphone-smalltile-99-99.png",
	//"images/windows/windowsphone-smalltile-170-170.png",
	//"images/windows/windows-smallsquare-24-24.png",
	//"images/windows/windows-smallsquare-30-30.png",
	//"images/windows/windows-smallsquare-42-42.png",
	//"images/windows/windows-smallsquare-54-54.png",
	//"images/windows/windows-splashscreen-868-420.png",
	//"images/windows/windows-splashscreen-1116-540.png",
	//"images/windows/windows-squarelogo-210-210.png",
	//"images/windows/windows-squarelogo-120-120.png",
	//"images/windows/windows-squarelogo-270-270.png",
	//"images/windows/windows-storelogo-70-70.png",
	//"images/windows/windows-storelogo-90-90.png",
	"images/spinner.gif",
	"scripts/base64.min.js",
	"scripts/common.min.js",
	"scripts/debugmode.min.js",
	"scripts/dropbox.min.js",
	"scripts/index.js",
	"scripts/Lawnchair.js",
	"scripts/lists.min.js",
	"scripts/platformOverrides.js",
	"scripts/storage.js",
	"scripts/nyckelDB.js",
	"scripts/nyckelDB.min.js",
	"scripts/validate.min.js",
	"scripts/vue.min.js",
	"scripts/webworker.js",
	"scripts/adapters/memory.js",
	"scripts/adapters/indexed-db.js",
	"scripts/adapters/dom.js",
	"scripts/winjs/base.min.js"
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
	console.log('[PWA Builder] The service worker is being installed.');
	evt.waitUntil(precache().then(function () {
		console.log('[PWA Builder] Skip waiting on install');
		return self.skipWaiting();
	}));
});


//allow sw to control of current page
self.addEventListener('activate', function (event) {
	console.log('[PWA Builder] Claiming clients for current page');
	return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
	console.log('[PWA Builder] The service worker is serving the asset: ' + evt.request.url);
	evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
	evt.waitUntil(update(evt.request));
});


function precache() {
	return caches.open(CACHE).then(function (cache) {
		console.log("[PWA Builder] precache", cache);
		return cache.addAll(precacheFiles);
	});
}

function fromCache(request) {
	console.log("[PWA Builder] fromCache", request);
	//we pull files from the cache first thing so we can show them fast
	return caches.open(CACHE).then(function (cache) {
		console.log("[PWA Builder] match this", cache);
		return cache.match(request).then(function (matching) {
			console.log("[PWA Builder] fromCache", matching);
			return matching || Promise.reject('no-match');
		});
	});
}

function update(request) {
	//this is where we call the server to get the newest version of the 
	//file to use the next time we show view
	return caches.open(CACHE).then(function (cache) {
		return fetch(request).then(function (response) {
			console.log("[PWA Builder] update", response);
			return cache.put(request, response);
		});
	});
}

function fromServer(request) {
	//this is the fallback if it is not in the cache to go to the server and get it
	return fetch(request).then(function (response) {
		console.log("[PWA Builder] fromServer", response);
		return response;
	});
}
