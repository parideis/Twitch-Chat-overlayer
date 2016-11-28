/* initialise variables */
var activate = document.querySelector('.activate button');
var deactivate = document.querySelector('.deactivate button');
var reset = document.querySelector('.color-reset button');
var cookieVal = { active: false};

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function getCurrentWindow() {
    return browser.windows.getCurrent();
}

activate.onclick = function() {
  getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {active: true});

    //Set Cookie
    cookieVal.active = true;
    browser.cookies.set({
        url: tabs[0].url,
        name: "bgpicker",
        value: JSON.stringify(cookieVal)
    })
  });
    // Apply Style
    browser.tabs.insertCSS(null, {file: "/css/style.css"});

    /* Set Fullscreen */
    getCurrentWindow().then((currentWindow) => {
        var updateInfo = {
            state: "fullscreen"
        };

    browser.windows.update(currentWindow.id, updateInfo);

  });

}

deactivate.onclick = function() {
    getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {active: false});
    //Set Cookie
    cookieVal.active = false;
    browser.cookies.set({
        url: tabs[0].url,
        name: "bgpicker",
        value: JSON.stringify(cookieVal)
    })
});
    // Apply Style
    browser.tabs.removeCSS(null, {file: "/css/style.css"});
    // Set Normal
    getCurrentWindow().then((currentWindow) => {
        var updateInfo = {
            state: "normal"
        };

    browser.windows.update(currentWindow.id, updateInfo);
});
}
/* Report cookie changes to the console */

browser.cookies.onChanged.addListener((changeInfo) => {
  console.log(`Cookie changed:\n
              * Cookie: ${JSON.stringify(changeInfo.cookie)}\n
              * Cause: ${changeInfo.cause}\n
              * Removed: ${changeInfo.removed}`);
});
