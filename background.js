
//Code to launch options page or onboarding page if this is the user's first time. 
//We can also use this code to display change log after update. 
if (localStorage['lastVersionUsed'] != '1') {
  localStorage['lastVersionUsed'] = '1';
  chrome.tabs.create({
    url: chrome.extension.getURL('options.html')
  });
}