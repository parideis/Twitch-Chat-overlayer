// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.insertCSS(null, {file:"items.css"});
});
