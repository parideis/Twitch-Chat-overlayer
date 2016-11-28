/* initialise variables */
var activate = document.querySelector('.activate button');
var deactivate = document.querySelector('.deactivate button');
var toggle = document.querySelector('.toggle');
var reset = document.querySelector('.color-reset button');
var cookieVal = { active: false};

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function getCurrentWindow() {
    return browser.windows.getCurrent();
}

/* Toogle TCO */
toggle.onclick = function () {
    getActiveTab().then((tabs) => {
    function toggleaction(cookie) {
        console.log(cookie.value);
        if (cookie.value[10] == "t"){
            /* Activate TCO */
            console.log("TCO deactivated");
            deactivate_tco();
        }else if (cookie.value[10] == "f"){
            /* Deactivate TCO */
            console.log("TCO activated");
            activate_tco();
        }
    }
    /* Get Cookies */
        var getting = browser.cookies.get({
            url: tabs[0].url,
            name: "bgpicker"
        });
        getting.then(toggleaction);
});
}

function activate_tco() {
  getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {active: true});

    // Set Cookie
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


function deactivate_tco() {
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
/* Report cookie changes to the console

browser.cookies.onChanged.addListener((changeInfo) => {
  console.log(`Cookie changed:\n
              * Cookie: ${JSON.stringify(changeInfo.cookie)}\n
              * Cause: ${changeInfo.cause}\n
              * Removed: ${changeInfo.removed}`);
});
 */