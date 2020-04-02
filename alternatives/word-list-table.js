function level(mastery){
	if (mastery == 0){
		return "New";
	}
	else if (mastery == 1){
		return "Level 1";
	}
	else if (mastery == 2){
		return "Level 2";
	}
	else if (mastery == 3){
		return "Level 3";
	}
	else if (mastery == 4){
		return "Mastered";
	}
}

//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({msg:"Signal to resut word list"});

//Process the data that has been sent back from background.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.NULL){
			console.log("No Data");
		}
		else{
			//Create the HTML elements needed.
			var tr = document.createElement("tr");
			var tdVocab = document.createElement("td");
			var tdDef = document.createElement("td");
			var tdCount = document.createElement("td");
			var tdCreation = document.createElement("td");
			var tdLastTest = document.createElement("td");
			var tdMastery = document.createElement("td");
			var tbody = document.getElementById("vocabTable")

			//Style certain element to the center of the cell
			tdCount.className = "cell-center";
			tdCreation.className = "cell-center";
			tdLastTest.className = "cell-center";
			tdMastery.className = "badge badge-primary";

			//prepare for date conversion
			var creationDate = new Date(request.creation_date_time);
			
			if (request.last_test_date_time == 0)
			{
				var lastDateTime = "-"
			}
			else
			{
				console.log("in else");
				var lastDateTime = new Date(request.last_test_data_time).toDateString();
			}

			//putting everything together
			tdVocab.appendChild(document.createTextNode(request.vocab));
			tdDef.appendChild(document.createTextNode(request.definition));
			tdCount.appendChild(document.createTextNode(request.count));
			tdCreation.appendChild(document.createTextNode(creationDate.toDateString()));
			tdLastTest.appendChild(document.createTextNode(lastDateTime));
			tdMastery.appendChild(document.createTextNode(level(request.mastery)));
			
			tr.appendChild(tdVocab);
			tr.appendChild(tdDef);
			tr.appendChild(tdMastery);
			tr.appendChild(tdCount);
			tr.appendChild(tdLastTest);
			tr.appendChild(tdCreation);

			tbody.appendChild(tr);
		}
	});