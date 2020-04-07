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

function insert_record(request){
	var dbRequest = initialize_indexedDB();
	dbRequest.onerror = function(event) {
		debug && console.log("IndexedDB Error");
	};
    dbRequest.onsuccess = function(event) {
    	var db = event.target.result;
    	var fcObjectStore = db.transaction("flashcard", "readwrite").objectStore("flashcard");
    	//Try to check if this vocabulary already existed
    	var getRequest = fcObjectStore.get(request.vocab);

    	getRequest.onerror = function(event){
    		debug && console.log("Get Vocab error");
    		db.close();
    	}

    	getRequest.onsuccess = function(event){
    		let data = getRequest.result
    		let currentDateTime = new Date()
    		//If no records were found, save the vocab and definition with default values. 
    		if(data == undefined){
    			debug && console.log("No records found");
    			var addRequest = fcObjectStore.add({vocab:request.vocab, 
    												definition:request.definition, 
    												count:1, 
    												creation_date_time:currentDateTime.getTime(), 
    												last_test_date_time:0, 
    												mastery:0});
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
    		db.close();
    	}
  	};
}

function delete_record(vocab){
	var dbRequest = initialize_indexedDB();
	dbRequest.onerror = function(event) {
		debug && console.log("IndexedDB Error");
	};
    dbRequest.onsuccess = function(event) {
    	var db = event.target.result;
    	var request = db.transaction("flashcard", "readwrite").objectStore("flashcard").delete(vocab);

    	request.onerror = function(event){
    		debug && console.log("Get Vocab error");
    		db.close();
    	}

    	request.onsuccess = function(event){
    		debug && console.log("Delete successful")		
  			db.close();
    	}
  	};
}

function send_msg_to_word_list(dataJSON){
	chrome.tabs.query({url:"chrome-extension://*/views/word-list.html"}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, dataJSON);
	});
}

function list_all_records(){
	var dbRequest = initialize_indexedDB();
	dbRequest.onerror = function(event) {
		debug && console.log("IndexedDB Error");
		return false;
	};
    dbRequest.onsuccess = function(event) {
    	var db = event.target.result;
    	var objectStore = db.transaction("flashcard").objectStore("flashcard");
    	var dataCount = 0;
    	objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			var data = []
			if (cursor) {
				let dataJSON = {NULL:false, type:"all", vocab:cursor.value.vocab,  
								count:cursor.value.count, 
								mastery:cursor.value.mastery}
				//Send the data back to word-list.js
				send_msg_to_word_list(dataJSON);
				dataCount++;
				//Continue if there are more data.
				cursor.continue();	    
			}
			else {
				if(dataCount == 0){
					send_msg_to_word_list({NULL:true});
					return false;
				}
				return true;
			}
		};
    }
}

function get_vocab_details(vocab){
	var dbRequest = initialize_indexedDB();
	dbRequest.onerror = function(event) {
		debug && console.log("IndexedDB Error");
		return false;
	};
	//I need to write something here. 
    dbRequest.onsuccess = function(event) {
    	var db = event.target.result;
    	var index = db.transaction("flashcard").objectStore("flashcard").index("vocab");
    	index.get(vocab).onsuccess = function(event){
    		let result = event.target.result;
    		let dataJSON = {NULL:false, type:"vocabDetails", vocab:result.vocab,
    						definition:result.definition, count:result.count, 
    						creationTime:result.creation_date_time, lastTestTime:result.last_test_date_time,
    						mastery:result.mastery};
    		send_msg_to_word_list(dataJSON);
    	};
    }	
}

function update_mastery(vocab, mastered){
	var dbRequest = initialize_indexedDB();
	dbRequest.onerror = function(event) {
		debug && console.log("IndexedDB Error");
	};
    dbRequest.onsuccess = function(event) {
    	var db = event.target.result;
    	var fcObjectStore = db.transaction("flashcard", "readwrite").objectStore("flashcard");
    	//Try to check if this vocabulary already existed
    	var getRequest = fcObjectStore.get(vocab);

    	getRequest.onerror = function(event){
    		debug && console.log("Get Vocab error");
    		db.close();
    	}

    	getRequest.onsuccess = function(event){
    		let data = getRequest.result
    		let currentDateTime = new Date()
    		//If no records were found, save the vocab and definition with default values. 
    		if(data == undefined){
    			debug && console.log("Word retreival error");
    		}
    		//If there is a previosu record, update the values and save it in. 
    		else{	
    			if (mastered){
    				data.mastery = 4;
    			}
    			else{
    				data.mastery = 0;
    			}
    			var addRequest = fcObjectStore.put(data);
    			addRequest.onerror = function(event){
		    		debug && console.log("IndexedDB Insertion error: " + request.vocab);
		    	}

		    	addRequest.onsuccess = function(event) {
		    		debug && console.log("Save complete: " + request.vocab);
		    	}
    		}
    		db.close();
    	}
  	};
}

//Code to launch options page or onboarding page if this is the user's first time. 
//We can also use this code to display change log after update. 	
if (localStorage['lastVersionUsed'] != '1') {
	localStorage['lastVersionUsed'] = '1';
	initialize_indexedDB();
	//Set the extention to be enabled
	chrome.storage.sync.set({extensionEnabled: true});
	chrome.tabs.create({
		url: chrome.extension.getURL('views/welcome.html')
	});
}

//Listener to listen for messages sent from content_script.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		//Open conneciton to FlashcardDictionary
		console.log("Sender URL: "+sender.url);
		//chrome-extension://ekkioomfpehmkanapfbnjhepcehhjphb/views/word-list.html
		var pattern = /chrome-extension:\/\/.+\/views\/word-list\.html/i;
		var result = sender.url.match(pattern);
		if (result == null){
			insert_record(request);
		}
		else{
			if(request.action == "listData"){
				list_all_records();
			}
			else if(request.action == "getDetail"){
				get_vocab_details(request.vocab);
			}
			else if(request.action == "setMastered"){
				update_mastery(request.vocab, true);
			}
			else if(request.action == "setNew"){
				update_mastery(request.vocab, false);
			}
			else if(request.action == "delVocab"){
				delete_record(request.vocab);
			}
		}
	}
);

debug && console.log("Background.js loaded");