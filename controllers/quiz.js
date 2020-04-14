var answerKeys;

//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({action:"getQuiz"});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(sender.url == null){
			if(request.NULL){
				console.log("No Data");
			}
			else {
				answerKeys = [];
				answerKeys = answerKeys.concat(request.entries);
				answerKeys.forEach(generateTest);
			}
		}
	});

//instruct carousel not to cycle after clicking next. 
$('.carousel').carousel({interval:false});


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

function submitHandler(e){
	//check all the answers. 
	//remove carouselQuiz
	//Generate the result list with button to close this tab or go to word list
}