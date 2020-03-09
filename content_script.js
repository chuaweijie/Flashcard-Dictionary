
var bubbleDiv = null, wordDefObj;

//This funciton will be called when users select the text. It will handle false alarms when users just simply click and selects nothing. 
//A portion of this code 
function textSelection() {
  //Get the html element that is in focus. 
  var focused = document.activeElement;
  var selectedText;

  //If there is something that is being focused at. 
  if (focused) {
    // Try to check if it is a string that is being focused. 
    try {
      selectedText = focused.value.substring(
          focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    }
  }

  //Handle the exception if the selected text is undefined. 
  if (selectedText == undefined) {
    selectedText = window.getSelection().toString();
  }

  document.querySelectorAll(".dictionaryDiv").forEach(function(Node){
    Node.remove();
  });
  bubbleDiv = null;
  
  //Only trigger text look up if there are words selected
  if(selectedText != "" && selectedText != ''){
    var info = getSelectionInfo();
    if(bubbleDiv == null){
      bubbleDiv = createDiv(info);
    }
    console.log(bubbleDiv);
    wordLookup(selectedText);
  }
}

//The function that handles the lookup of the vocabulary. 
function wordLookup(vocab){

  //The base link. This should change when I programme the system to handle multiple dictionaries. 
  var link = "https://api.dictionaryapi.dev/api/v1/entries/en/" + vocab;
  
  console.log(link);
  
  //The request to handle the call to 
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { 
      wordDefObj = JSON.parse(this.responseText);
    }
  };
  xhttp.open("GET", link, true);
  xhttp.send();
}

//Function to get the exact position of the word(s) highlighted
function getSelectionInfo(){
  var boundingRect;

  if (window.getSelection().toString().length > 1) {
    boundingRect = getSelectionCoords(window.getSelection());
  } else {
      return null;
  }

  var top = boundingRect.top + window.scrollY;
  var bottom = boundingRect.bottom + window.scrollY;
  var left = boundingRect.left + window.scrollX;

  if(boundingRect.height == 0){
    top = event.pageY;
    bottom = event.pageY;
    left = event.pageX;
  }

  var toReturn = {
    top: top,
    bottom: bottom,
    left: left,
    clientY: event.clientY,
    height: boundingRect.height
  };

  return toReturn;
}

//Get the coordinates of the selection
function getSelectionCoords(selection) {
  var oRange = selection.getRangeAt(0); //get the text range
  var oRect = oRange.getBoundingClientRect();
  return oRect;
}

function createDiv(info) {

  // Create the div to hold 
  var hostDiv = document.createElement("div");
  hostDiv.className = "dictionaryDiv";
  hostDiv.style.left = info.left -10 + "px";
  hostDiv.style.position = "absolute";
  hostDiv.attachShadow({mode: 'open'});

  var shadow = hostDiv.shadowRoot;
  var style = document.createElement("style");
  style.textContent = ".mwe-popups{background:#fff;position:absolute;z-index:110;-webkit-box-shadow:0 30px 90px -20px rgba(0,0,0,0.3),0 0 1px #a2a9b1;box-shadow:0 30px 90px -20px rgba(0,0,0,0.3),0 0 1px #a2a9b1;padding:0;font-size:14px;min-width:300px;border-radius:2px}.mwe-popups.mwe-popups-is-not-tall{width:320px}.mwe-popups .mwe-popups-container{color:#222;margin-top:-9px;padding-top:9px;text-decoration:none}.mwe-popups.mwe-popups-is-not-tall .mwe-popups-extract{min-height:40px;max-height:140px;overflow:hidden;margin-bottom:47px;padding-bottom:0}.mwe-popups .mwe-popups-extract{margin:16px;display:block;color:#222;text-decoration:none;position:relative} .mwe-popups.flipped_y:before{content:'';position:absolute;border:8px solid transparent;border-bottom:0;border-top: 8px solid #a2a9b1;bottom:-8px;left:10px}.mwe-popups.flipped_y:after{content:'';position:absolute;border:11px solid transparent;border-bottom:0;border-top:11px solid #fff;bottom:-7px;left:7px} .mwe-popups.mwe-popups-no-image-tri:before{content:'';position:absolute;border:8px solid transparent;border-top:0;border-bottom: 8px solid #a2a9b1;top:-8px;left:10px}.mwe-popups.mwe-popups-no-image-tri:after{content:'';position:absolute;border:11px solid transparent;border-top:0;border-bottom:11px solid #fff;top:-7px;left:7px} .audio{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcUlEQVQ4y2P4//8/AyUYQhAH3gNxA7IAIQPmo/H3g/QA8XkgFiBkwHyoYnRQABVfj88AmGZcTuuHyjlgMwBZM7IE3NlQGhQe65EN+I8Dw8MLGgYoFpFqADK/YUAMwOsFigORatFIlYRElaRMWmaiBAMAp0n+3U0kqkAAAAAASUVORK5CYII=);background-position: center;background-repeat: no-repeat;cursor:pointer;margin-left: 8px;opacity: 0.5; width: 16px; display: inline-block;} .audio:hover {opacity: 1;}";
  shadow.appendChild(style);

  var encapsulateDiv = document.createElement("div");
  encapsulateDiv.style = "all: initial; text-shadow: transparent 0px 0px 0px, rgba(0,0,0,1) 0px 0px 0px !important;";
  shadow.appendChild(encapsulateDiv);


  var popupDiv = document.createElement("div");
  popupDiv.style = "font-family: arial,sans-serif; border-radius: 12px; border: 1px solid #a2a9b1; box-shadow: 0 0 17px rgba(0,0,0,0.5)";
  encapsulateDiv.appendChild(popupDiv);


  var contentContainer = document.createElement("div");
  contentContainer.className = "mwe-popups-container";
  popupDiv.appendChild(contentContainer);



  var content = document.createElement("div");
  content.className = "mwe-popups-extract";
  content.style = "line-height: 1.4; margin-top: 0px; margin-bottom: 11px; max-height: none";
  contentContainer.appendChild(content);


  var heading = document.createElement("h3");
  heading.style = "margin-block-end: 0px; display:inline-block;";
  heading.textContent = "Searching";

  var meaning = document.createElement("p");
  meaning.style = "margin-top: 10px";
  meaning.textContent = "Please Wait...";

  var audio = document.createElement("div");
  audio.className = "audio";
  audio.innerHTML = "&nbsp;";
  audio.style.display = "none";

  var moreInfo =document.createElement("a");
  moreInfo.style = "float: right; text-decoration: none;"
  moreInfo.target = "_blank";

  content.appendChild(heading);
  content.appendChild(audio);
  content.appendChild(meaning);
  content.appendChild(moreInfo);
  document.body.appendChild(hostDiv);

  if(info.clientY < window.innerHeight/2){
      popupDiv.className = "mwe-popups mwe-popups-no-image-tri mwe-popups-is-not-tall";
      hostDiv.style.top = info.bottom + 10 + "px";
      if(info.height == 0){
          hostDiv.style.top = parseInt(hostDiv.style.top) + 8 + "px";
      }
  } else {
      popupDiv.className = "mwe-popups flipped_y mwe-popups-is-not-tall";
      hostDiv.style.top = info.top - 10 - popupDiv.clientHeight + "px";
      if(info.height == 0){
          hostDiv.style.top = parseInt(hostDiv.style.top) - 8 + "px";
      }
  }

  return {heading: heading, meaning: meaning, moreInfo: moreInfo, audio: audio};
}

//The event that will trigger the textSelection function which will process the selected vocabularies. 
document.onmouseup = document.onkeyup = function() {
  textSelection();
};

console.log("content_script.js loaded");