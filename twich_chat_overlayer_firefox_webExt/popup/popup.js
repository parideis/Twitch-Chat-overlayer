/* initialise variables */
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
toggle.onclick = function toggle_tco() {
    getActiveTab().then((tabs) => {
    function toggleaction(cookie) {
        if (cookie == null || cookie.value[10] == "f"){
            /* Activate TCO */
            console.log("TCO activated");
            activate_tco();
        } else if (cookie.value[10] == "t"){
            /* Deactivate TCO */
            console.log("TCO deactivated");
            deactivate_tco();
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

    // Get Auto Fullscreen preference
    var gettingItem = browser.storage.local.get('afs');
    gettingItem.then((res) => {
        /* Set Fullscreen */
        if(!res.afs){
        getCurrentWindow().then((currentWindow) => {
            var updateInfo = {
                state: "fullscreen"
            };
        browser.windows.update(currentWindow.id, updateInfo);
        });
        }
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



