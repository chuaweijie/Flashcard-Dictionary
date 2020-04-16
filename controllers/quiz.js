var answerKeys;

//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({action:"getQuiz"});

//This handles the data that is returned after sending getQuiz request to background.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(sender.url == null){
			if(request.NULL){
				$('#modalNoVocab').modal('show');
			}
			else {
				//reset the array to empty
				answerKeys = [];
				answerKeys = answerKeys.concat(request.entries);
				answerKeys.forEach(generateTest);
			}
		}
	});

//instruct carousel not to cycle after clicking next. 
$('.carousel').carousel({interval:false});

$('#btnCloseTab').on("click", closeTabHandler);

//This is the function that iterates through all the items returned from background.js and display them in the view.
function generateTest(item, index){
	$('<li data-target="#carouselQuiz" data-slide-to="'+index+'"></li>').appendTo('.carousel-indicators');
	if(index == answerKeys.length - 1) {
		$('.carousel-item').first().addClass('active');
  		$('.carousel-indicators > li').first().addClass('active');
		$('<div class="carousel-item pl-5 pr-5 pb-3"><div class="card text-center text-white bg-secondary "><div class="card-body"><h5 class="card-title mt-4">'+item.definition+'</h5><input type="text" class="mb-2" id="a'+index+'" aria-describedby="basic-addon3"><div><button type="button" class="btn btn-primary mb-2" id="submitBtn" aria-describeb>Submit</button></div></div></div></div>').appendTo('.carousel-inner')
		$('#submitBtn').on("click", submitHandler);
	}
	else {
		$('<div class="carousel-item pl-5 pr-5 pb-3"><div class="card text-center text-white bg-secondary "><div class="card-body"><h5 class="card-title mt-4">'+item.definition+'</h5><input type="text" class="mb-5" id="a'+index+'" aria-describedby="basic-addon3"></div></div></div>').appendTo('.carousel-inner')
	}
}

//This handles the click on the last slide to submit the data. It will also handle the checking and sending the data to background.js
function submitHandler(e){
	let len = answerKeys.length;
	$('<div class="table-responsive"><table id="vocabTable" aria-hidden="true" class="table table-striped pl-2 pr-2"><thead><tr><th>Definition</th><th class="text-center">Vocabulary</th><th class="text-center">Answer</th></tr></thead><tbody id="vocabTableBody"></tbody></table></div>').appendTo("body");
	for (let i = 0; i < len; i++ ) {
		var ans = $('#a' + i).val().toLowerCase();
		var newMastery;
		if(answerKeys[i].vocab.toLowerCase().localeCompare(ans) == 0) {
			newMastery = answerKeys[i].mastery + 1;
			if (newMastery > 5) {
				newMastery = 5;
			}
			$('<tr><td>'+answerKeys[i].definition+'</td><td class="text-center">'+answerKeys[i].vocab+'</td><td class="table-success text-center">'+ans+'</td></tr>').appendTo("#vocabTableBody");
		}
		else {
			newMastery = answerKeys[i].mastery - 1;
			if (newMastery < 0) {
				newMastery = 0;
			}
			$('<tr><td>'+answerKeys[i].definition+'</td><td class="text-center">'+answerKeys[i].vocab+'</td><td class="table-danger text-center">'+ans+'</td></tr>').appendTo("#vocabTableBody");
		}
		chrome.runtime.sendMessage({action:"updateMastery", vocab:answerKeys[i].vocab, mastery:newMastery});
	}
	$("#carouselQuiz").remove();
	$("#vocabTable").attr("aria-hidden","false");
}

//Closes the current tab when user clickes the close tab button.
function closeTabHandler(e) {
	window.top.close();
}