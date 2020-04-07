chrome.storage.sync.get('extensionEnabled', function(result) {
	let btnOn = document.getElementById("btnOn");
	let btnOff = document.getElementById("btnOff");
	let labelOn = document.getElementById("label-on");
	let labelOff = document.getElementById("label-off");
	console.log(result.extensionEnabled);
	if (result.extensionEnabled){
		btnOn.checked = true;
		btnOff.checked = false;
		labelOn.className = "btn btn-primary active";
		labelOff.className = "btn btn-outline-danger";
	}
	else{
		btnOn.checked = false;
		btnOff.checked = true;
		labelOn.className = "btn btn-outline-primary";
		labelOff.className = "btn btn-danger active";
	}
});

document.getElementById("btnOn").addEventListener("click", toggleHandler);
document.getElementById("btnOff").addEventListener("click", toggleHandler);

function toggleHandler(e) {
	let source = e.srcElement || e.originalTarget;
	console.log(source.id);
	let btnOn = document.getElementById("btnOn");
	let btnOff = document.getElementById("btnOff");
	let labelOn = document.getElementById("label-on");
	let labelOff = document.getElementById("label-off");
	if(source.id == "btnOn") {
		chrome.storage.sync.set({extensionEnabled: true});
		labelOn.className = "btn btn-primary focus active";
		labelOff.className = "btn btn-outline-danger";	
		btnOn.checked = false;
		btnOff.checked = true;
		console.log("btnOn");
	}
	else if(source.id == "btnOff") {
		chrome.storage.sync.set({extensionEnabled: false});
		labelOn.className = "btn btn-outline-primary";
		labelOff.className = "btn btn-danger focus active";
		btnOn.checked = true;
		btnOff.checked = false;
		console.log("btnOff");
	}
	console.log("btnOn : "+btnOn.checked);
	console.log("btnOff : "+btnOff.checked);
}