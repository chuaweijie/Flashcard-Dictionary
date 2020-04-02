function getLevelObj(mastery){
	if (mastery == 0){
		return {style:"badge badge-danger", status:"New"};
	}
	else if (mastery == 1){
		return {style:"badge badge-warning", status:"Level 1"};
	}
	else if (mastery == 2){
		return {style:"badge badge-secondary", status:"Level 2"};
	}
	else if (mastery == 3){
		return {style:"badge badge-info", status:"Level 3"};
	}
	else if (mastery == 4){
		return {style:"badge badge-success", status:"Msatered"};
	}
}

//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({action:"listData"});

//Process the data that has been sent back from background.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.NULL){
			console.log("No Data");
		}
		else{
			//Create the HTML elements needed.
			var divCol = document.createElement("div");
			var divCard = document.createElement("div");
			var divCardBody = document.createElement("div");
			var badgeMastery = document.createElement("div");
			var h5Vocab = document.createElement("h5");
			var spanSearchCount = document.createElement("span");

			divCol.id = request.vocab;

			//Create the object that have both badge style and mastery name
			var masteryObj = getLevelObj(request.mastery);

			divCol.addEventListener("click", function(e){
				var vocab = e.currentTarget.id;
				console.log(vocab);
			}, false);

			

			//Set style for all elements
			divCol.className = "col mb-4";
			divCard.className = "card";
			divCardBody.className = "card-body";
			badgeMastery.className = masteryObj.style;
			h5Vocab.className = "class-title";
			spanSearchCount.className = "badge badge-light ml-2";

			//Append data to elements
			h5Vocab.appendChild(document.createTextNode(request.vocab));
			badgeMastery.appendChild(document.createTextNode(masteryObj.status));
			spanSearchCount.appendChild(document.createTextNode(request.count));

			//Let the assembly begin!
			divCardBody.appendChild(h5Vocab);
			badgeMastery.appendChild(spanSearchCount);
			divCard.appendChild(divCardBody);
			divCard.appendChild(badgeMastery);
			divCol.appendChild(divCard);

			//Apend the lement on the page!
			var vocabGrid = document.getElementById("vocabCards")
			vocabGrid.appendChild(divCol);
		}
	});