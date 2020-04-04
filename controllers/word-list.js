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
		return {style:"badge badge-success", status:"Mastered"};
	}
}

function filterSearch(){
	let filter = document.getElementById("vocabSearch").value.toLowerCase();
	let cards = document.getElementsByClassName("col mb-4");
	for (i = 0; i < cards.length; i++){
	 	let h5 = cards[i].getElementsByTagName("h5")[0];
	 	txtValue = h5.textContent || h5.innerText;
	 	if(txtValue.toLowerCase().indexOf(filter) > -1){
	 		document.getElementById(txtValue).style.display = "";
	 	} else{
	 		document.getElementById(txtValue).style.display = "none";
	 	}
	}
}

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

document.getElementById("modalBtnDelete").addEventListener("click", function(e){
	let vocab = document.getElementById("modalVocab").innerHTML;
	let h5Title = document.getElementById("confirmationTitle");
	h5Title.replaceChild(document.createTextNode('Are you sure you want to delete "' + vocab + '"?'), h5Title.childNodes[0]);
}, false);


document.getElementById("btnConfirmDel").addEventListener("click", function(e){
	let vocab = document.getElementById("modalVocab").innerHTML;
	let cardVocab = document.getElementById(vocab);
	cardVocab.remove();
	chrome.runtime.sendMessage({action:"delVocab", vocab:vocab});
	$('#vocabDetailModal').modal('hide')
}, false);

//Logic to cater for search bar filter
document.getElementById("vocabSearch").addEventListener("keyup", function(e){
	filterSearch();
});

document.getElementById("vocabSearch").addEventListener("search", function(e){
	filterSearch();
});

//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({action:"listData"});

//Process the data that has been sent back from background.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.NULL){
			console.log("No Data");
		}
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
			if (request.lastTestTime == 0){
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
	});