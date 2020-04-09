//Sending trigger to background.js to get data. 
chrome.runtime.sendMessage({action:"getQuiz"});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if(sender.url == null){
			if(request.NULL){
				console.log("No Data");
			}
			else {
				console.log(request);
			}
		}
	});