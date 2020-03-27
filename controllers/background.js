//Variable used to turn on debug mode
var debug = false;

function initialize_indexedDB(){
	var dbRequest = indexedDB.open("FlashcardDictionary", 1);
	dbRequest.onerror = function(event) {
		debug && console.log("Databse error");
	};
	dbRequest.onupgradeneeded = function(event) {
		var db = event.target.result;

		//Create an ObjectStore to hold DB
		var objectStore = db.createObjectStore("flashcard", { keyPath: "vocab" });

		// Create an index to for parts that we might search
		objectStore.createIndex("vocab", "vocab", { unique: true });
		objectStore.createIndex("count", "count", { unique: false });
		objectStore.createIndex("creation_date_time", "creation_date_time", { unique: false });
		objectStore.createIndex("last_test_date_time", "last_test_date_time", { unique: false });
		objectStore.createIndex("mastery", "mastery", { unique: false });

		//Log message to console 
		objectStore.transaction.oncomplete = function(event) {
			debug && console.log("FlashcardDictionary IndexedDB created");
		};
	};
	return dbRequest;
}

//Code to launch options page or onboarding page if this is the user's first time. 
//We can also use this code to display change log after update. 	
if (localStorage['lastVersionUsed'] != '1') {
	localStorage['lastVersionUsed'] = '1';
	initialize_indexedDB();
	chrome.tabs.create({
		url: chrome.extension.getURL('views/welcome.html')
	});
}

//Listener to listen for messages sent from content_script.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//Open conneciton to FlashcardDictionary
		var dbRequest = initialize_indexedDB();
		dbRequest.onerror = function(event) {
			debug &&  console.log("IndexedDB Error");
		};
	    dbRequest.onsuccess = function(event) {
	    	var db = event.target.result;
	    	var fcObjectStore = db.transaction("flashcard", "readwrite").objectStore("flashcard");
	    	//Try to check if this vocabulary already existed
	    	var getRequest = fcObjectStore.get(request.vocab);

	    	getRequest.onerror = function(event){
	    		debug && console.log("Get Vocab error");
	    	}

	    	getRequest.onsuccess = function(event){
	    		let data = getRequest.result
	    		let currentDateTime = new Date()
	    		//If no records were found, save the vocab and definition with default values. 
	    		if(data == undefined){
	    			debug && console.log("No records found");
	    			var addRequest = fcObjectStore.add({vocab:request.vocab, definition:request.definition, count:1, creation_date_time:currentDateTime.getTime(), last_test_date_time:0, mastery:0});
	    			addRequest.onerror = function(event){
			    		debug && console.log("IndexedDB Insertion error: " + request.vocab);
			    	}

			    	addRequest.onsuccess = function(event) {
			    		debug && console.log("Save complete: " + request.vocab);
			    	}
	    		}
	    		//If there is a previosu record, update the values and save it in. 
	    		else{
	    			data.count++;
	    			data.creation_date_time = currentDateTime.getTime();
	    			//Short circuit for if data.mastery > 0, data.mastery--
	    			data.mastery > 0 && data.mastery--;
	    			var addRequest = fcObjectStore.put(data);
	    			addRequest.onerror = function(event){
			    		debug && console.log("IndexedDB Insertion error: " + request.vocab);
			    	}

			    	addRequest.onsuccess = function(event) {
			    		debug && console.log("Save complete: " + request.vocab);
			    	}
	    		}
	    	}
	  	};	
	}
);

debug && console.log("Background.js loaded");