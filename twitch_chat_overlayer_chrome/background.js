var toggled = false;
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    if (toggled) { 
    	// Dectivate
    	toggled = false;
    	chrome.tabs.insertCSS(null, { file: "reset.css" });
    	chrome.windows.update(1, { state: "maximized" });
    } 
    else { 
    	// Activate
    	toggled = true; 
    	chrome.tabs.insertCSS(null, { file: "modified.css" });
    	chrome.windows.update(1, { state: "fullscreen" });
    };
});
