

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
    var sel = window.getSelection();
    selectedText = sel.toString();
  }
  
  if(selectedText != "" && selectedText != ''){
    wordLookup(selectedText);
  }
}

function wordLookup(vocab){
  var link = "https://dictionary.cambridge.org/dictionary/english/" + vocab;
  if (/\s/.test(vocab)){
    vocab = vocab.replace(/(\s+)/g, "+");
    link = "https://dictionary.cambridge.org/spellcheck/english/?q=" + vocab;
  }
  
  console.log(link);
  /*var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
         document.getElementById("demo").innerHTML = xhttp.responseText;
      }
  };
  xhttp.open("GET", "filename", true);
  xhttp.send();*/
}

document.onmouseup = document.onkeyup = function() {
  textSelection();
};

console.log("content_script.js loaded");