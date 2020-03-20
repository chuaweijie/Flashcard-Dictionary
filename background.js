
//Code to launch options page or onboarding page if this is the user's first time. 
//We can also use this code to display change log after update. 
if (localStorage['lastVersionUsed'] != '1') {
	localStorage['lastVersionUsed'] = '1';
	var dbRequest = indexedDB.open("FlashcardDictionary", 3);
	dbRequest.onerror = function(event) {
		console.log("IndexedDB Error");
		sendResponse({dbMsg: "goodbye"});
	};
	dbRequest.onupgradeneeded = function(event) {
		var db = event.target.result;

		//Create an ObjectStore to hold DB
		var objectStore = db.createObjectStore("flashcard", { keyPath: "vocab" });

		// Create an index to search customers by name. We may have duplicates
		// so we can't use a unique index.
		objectStore.createIndex("vocab", "vocab", { unique: false });

		// Use transaction oncomplete to make sure the objectStore creation is 
		// finished before adding data into it.
		objectStore.transaction.oncomplete = function(event) {
			// Store values in the newly created objectStore.
			console.log("FlashcardDictionary IndexedDB created");
		};
	};
	chrome.tabs.create({
		url: chrome.extension.getURL('options.html')
	});
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
		            "Vocab:" + request.vocab + " Meaning: " + request.definition :
		            "from the extension");
	
	var dbRequest = indexedDB.open("FlashcardDictionary", 3);
	console.log(dbRequest);
	dbRequest.onerror = function(event) {
		console.log("IndexedDB Error");
		sendResponse({dbMsg: "Error"});
	};
    dbRequest.onsuccess = function(event) {
    	console.log("In onsuccess")
    	var db = event.target.result;
    	var fcObjectStore = db.transaction("flashcard", "readwrite").objectStore("flashcard");
    	var addRequest = fcObjectStore.add({vocab:request.vocab, definition:request.definition, count:1});

    	addRequest.onerror = function(event){
    		console.log("IndexedDB Error " + event.target.result);
    	}

    	addRequest.onsuccess = function(event) {
    		sendResponse({dbMsg: "Save complete"});
    	}
  	};	
});

console.log("Background.js loaded");