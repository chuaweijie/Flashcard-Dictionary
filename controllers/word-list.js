chrome.runtime.sendMessage({msg:"Just some random message from word list"});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var pattern = /chrome-extension:\/\/.+\/views\/word-list\.html/i;
	var result = sender.url.match(pattern);
	
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });