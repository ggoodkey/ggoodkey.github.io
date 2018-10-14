if (navigator.serviceWorker) {
	//Service workers
	if (navigator.serviceWorker.controller) {
		console.log('[PWA Builder] active service worker found, no need to register');
	} else {
		//Register the ServiceWorker
		navigator.serviceWorker.register('https://dl.dropboxusercontent.com/spa/5d5279t7cajgml7/nyckel/public/pwabuilder-sw.js', ).then(function (reg) {
			console.log('Service worker has been registered for scope:' + reg.scope);
		}, function (err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		});
	}
}
else console.log("no serviceWorkers");