chrome.runtime.sendMessage({msg:"Just some random message from word list"});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.NULL){
			console.log("No Data");
		}
		else{
			var tr = document.createElement("tr");
			var tdVocab = document.createElement("td");
			var tdDef = document.createElement("td");
			var tdCount = document.createElement("td");
			var tdCreation = document.createElement("td");
			var tdLastTest = document.createElement("td");
			var tdMastery = document.createElement("td");
			var tbody = document.getElementById("vocabTable")

			tdVocab.appendChild(document.createTextNode(request.vocab));
			tdDef.appendChild(document.createTextNode(request.definition));
			tdCount.appendChild(document.createTextNode(request.count));
			tdCreation.appendChild(document.createTextNode(request.creation_date_time));
			tdLastTest.appendChild(document.createTextNode(request.last_test_date_time));
			tdMastery.appendChild(document.createTextNode(request.mastery));
			
			tr.appendChild(tdVocab);
			tr.appendChild(tdDef);
			tr.appendChild(tdMastery);
			tr.appendChild(tdCount);
			tr.appendChild(tdLastTest);
			tr.appendChild(tdCreation);

			tbody.appendChild(tr);
		}
	});