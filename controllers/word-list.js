//This returns the style and mastery status to format and display. 
function getLevelObj(mastery){
	if (mastery == 0){
		return {style:"badge badge-danger mastery", status:"New"};
	}
	else if (mastery == 1){
		return {style:"badge badge-warning mastery", status:"Level 1"};
	}
	else if (mastery == 2){
		return {style:"badge badge-secondary mastery", status:"Level 2"};
	}
	else if (mastery == 3){
		return {style:"badge badge-info mastery", status:"Level 3"};
	}
	else if (mastery == 4){
		return {style:"badge badge-success mastery", status:"Mastered"};
	}
}

//This is the code for real time filter search as the user types
function filterSearch(){
	let filter = document.getElementById("vocabSearch").value.toLowerCase();
	let cards = document.getElementsByClassName("col mb-4");
	for (i = 0; i < cards.length; i++){
	 	let h5 = cards[i].getElementsByTagName("h5")[0];
	 	txtValue = h5.textContent || h5.innerText;
	 	if(txtValue.toLowerCase().indexOf(filter) > -1){
	 		document.getElementById(txtValue).style.display = "";
	 	} 
	 	else{
	 		document.getElementById(txtValue).style.display = "none";
	 	}
	}
}

//This is triggers the logic to change the word to mastered. It sends a request to update the db and updates the UI
document.getElementById("modalBtnMastered").addEventListener("click", function(e){
	let vocab = document.getElementById("modalVocab").innerHTML;
	let btnMastered = document.getElementById("modalBtnMastered");
	let cardVocab = document.getElementById(vocab);
	let cardBadge = cardVocab.getElementsByClassName("badge");
	
	if(btnMastered.innerHTML == "Mastered"){
		chrome.runtime.sendMessage({action:"setMastered", vocab:vocab});
		cardBadge[0].className = "badge badge-success";
		cardBadge[0].firstChild.data = "Mastered";
		//Change the status of word in word-list.html	
	}
	else{
		chrome.runtime.sendMessage({action:"setNew", vocab:vocab});		
		cardBadge[0].className = "badge badge-danger";
		cardBadge[0].firstChild.data = "New";
		//Change the status of word in word-list.html
	}
	
}, false);

//This launches the modal for delete confirmation
document.getElementById("modalBtnDelete").addEventListener("click", function(e){
	let vocab = document.getElementById("modalVocab").innerHTML;
	let h5Title = document.getElementById("confirmationTitle");
	h5Title.replaceChild(document.createTextNode('Are you sure you want to delete "' + vocab + '"?'), h5Title.childNodes[0]);
}, false);

//This deletes the vocab. It updates the DB and the UI.
document.getElementById("btnConfirmDel").addEventListener("click", function(e){
	let vocab = document.getElementById("modalVocab").innerHTML;
	let cardVocab = document.getElementById(vocab);
	cardVocab.remove();
	chrome.runtime.sendMessage({action:"delVocab", vocab:vocab});
	$('#vocabDetailModal').modal('hide')
}, false);

//Logic to cater for search bar filter
document.getElementById("vocabSearch").addEventListener("keyup", filterSearch);
document.getElementById("vocabSearch").addEventListener("search", filterSearch);

//The code for status filter. 
document.getElementById("statusFilter").addEventListener("change", function(e){
	let toggleMasteryLevels = this.getElementsByTagName("input");
	let cards = document.getElementsByClassName("col mb-4");
	for (i = 0; i < cards.length; i++ ){
		let h5 = cards[i].getElementsByTagName("h5")[0];
	 	txtValue = h5.textContent || h5.innerText;
	 	let badgeText = cards[i].getElementsByClassName("badge mastery")[0]
	 	let badgeType = badgeText.className.split(" ")[1];
	 	console.log(badgeType);
		if(!toggleMasteryLevels[0].checked && !toggleMasteryLevels[1].checked && !toggleMasteryLevels[2].checked && !toggleMasteryLevels[3].checked && !toggleMasteryLevels[4].checked){
			document.getElementById(txtValue).style.display = "";
		}
		else{
			if(toggleMasteryLevels[0].checked && badgeType == 'badge-danger'){
				document.getElementById(txtValue).style.display = "";	
			}
			else if(toggleMasteryLevels[1].checked && badgeType == 'badge-warning'){
				document.getElementById(txtValue).style.display = "";
			}
			else if(toggleMasteryLevels[2].checked && badgeType == 'badge-secondary'){
				document.getElementById(txtValue).style.display = "";
			}
			else if(toggleMasteryLevels[3].checked && badgeType == 'badge-info'){
				document.getElementById(txtValue).style.display = "";
			}
			else if(toggleMasteryLevels[4].checked && badgeType == 'badge-success'){
				document.getElementById(txtValue).style.display = "";
			}
			else{
				document.getElementById(txtValue).style.display = "none";		
			}
		}
	}	
});

//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({action:"listData"});

//Process the data that has been sent back from background.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(sender.url == null)
		{
			if(request.NULL){
				console.log("No Data");
			}
			//handles the returned data of all vocabs
			else if (request.type == "all"){
				//Create the HTML elements needed.
				let divCol = document.createElement("div");
				let divCard = document.createElement("div");
				let divCardBody = document.createElement("div");
				let badgeMastery = document.createElement("div");
				let h5Vocab = document.createElement("h5");
				let spanSearchCount = document.createElement("span");

				divCol.id = request.vocab;

				//Create the object that have both badge style and mastery name
				let masteryObj = getLevelObj(request.mastery);

				divCol.addEventListener("click", function(e){
					let vocab = e.currentTarget.id;
					chrome.runtime.sendMessage({action:"getDetail", vocab:vocab});
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
			//handles the returned data of vocab details. 
			else if(request.type = "vocabDetails"){
				let modalVocab = document.getElementById("modalVocab");
				let modalBody = document.getElementById("modalBody");
				let badgeMastery = document.getElementById("badgeMastery");
				let badgeCount = document.getElementById("badgeCount");
				let badgeTest = document.getElementById("badgeTest");
				let badgeAdd = document.getElementById("badgeAdd");
				let h6Definiton = document.createElement("h6");
				let btnMastered = document.getElementById("modalBtnMastered");

				badgeCount.innerHTML = '';
				badgeTest.innerHTML = '';
				badgeAdd.innerHTML = '';

				let masteryObj = getLevelObj(request.mastery);

				badgeMastery.className = masteryObj.style;

				h6Definiton.appendChild(document.createTextNode("Definition: "));

				if(request.mastery == 4){
					btnMastered.innerHTML = "Reset Mastery";
				}
				else{
					btnMastered.innerHTML = "Mastered";
				}

				let creationDate = new Date(request.creationTime).toDateString();
				if (request.lastTestTime == request.creationTime){
					var lastDateTime = "-"
				}
				else{
					var lastDateTime = new Date(request.lastTestTime).toDateString();
				}
			
				modalVocab.replaceChild(document.createTextNode(request.vocab),modalVocab.childNodes[0]);
				badgeMastery.replaceChild(document.createTextNode(masteryObj.status), badgeMastery.childNodes[0]);
				modalBody.replaceChild(document.createTextNode(request.definition), modalBody.childNodes[8]);
				badgeCount.appendChild(document.createTextNode(request.count));
				badgeTest.appendChild(document.createTextNode(lastDateTime));
				badgeAdd.appendChild(document.createTextNode(creationDate));

				$('#vocabDetailModal').modal('show');
			}
		}
	});