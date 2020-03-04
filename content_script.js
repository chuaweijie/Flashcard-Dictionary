

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
    console.log("Selected text: " + selectedText);
  }
}

document.onmouseup = document.onkeyup = function() {
  textSelection();
};

console.log("content_script.js loaded");