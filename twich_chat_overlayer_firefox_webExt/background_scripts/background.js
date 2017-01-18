/* Retrieve any previously set cookie and send to content script */
var cookieVal = { active: false };
browser.tabs.onUpdated.addListener(cookieUpdate);

function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true, url: "*://*.twitch.tv/*"});
}

function getCurrentWindow() {
    return browser.windows.getCurrent();
}

function cookieUpdate(tabId, changeInfo, tab) {
  getActiveTab().then((tabs) => {
      browser.pageAction.show(tabs[0].id);
    /* inject content script into current tab */

    browser.tabs.executeScript(null, {
      file: "/content_scripts/updatebg.js"
    });

    // get any previously set cookie for the current tab 
    var gettingCookies = browser.cookies.get({
      url: tabs[0].url,
      name: "bgpicker"
    });
    gettingCookies.then((cookie) => {
      if(cookie) {
        console.log("Getting Cookies");
        console.log("Is the cookie active? " + cookie.value.valueOf());
        if (cookie.value[10] == "t"){
          browser.tabs.insertCSS(null, {file: "/css/style.css"});
        } else if((cookie.value[10] == "f")){
          browser.tabs.removeCSS(null, {file: "/css/style.css"});
        }
        var cookieVal = JSON.parse(cookie.value);
        browser.tabs.sendMessage(tabs[0].id, {active: cookieVal.active});
      }
    });
  }); 
}


browser.commands.onCommand.addListener((command) => {
    console.log("onCommand event received for message: ", command);
if(command == "toggle-feature"){
    toggle();
}
});

function toggle(tabId, changeInfo, tab) {

    getActiveTab().then((tabs) => {
      /* inject content script into current tab */

        browser.tabs.executeScript(null, {
        file: "/content_scripts/updatebg.js"
    });

    // get any previously set cookie for the current tab
    var gettingCookies = browser.cookies.get({
        url: tabs[0].url,
        name: "bgpicker"
    });

    gettingCookies.then((cookie) => {
        console.log(cookie);
        if(cookie === null){
            cookieVal.active = true;
            browser.cookies.set({
                url: tabs[0].url,
                name: "bgpicker",
                value: JSON.stringify(cookieVal)
            })
        }
        if(cookie) {
            console.log("Getting Cookies");
            console.log("Is the cookie active? " + cookie.value.valueOf());
            cookieVal = JSON.parse(cookie.value);
            if (cookie.value[10] == "t"){
                browser.tabs.removeCSS(null, {file: "/css/style.css"});
                cookieVal.active = false;

                // Set Normal Window
                getCurrentWindow().then((currentWindow) => {
                    var updateInfo = {
                        state: "normal"
                    };

                browser.windows.update(currentWindow.id, updateInfo);
                });
            }else if((cookie.value[10] == "f")){
                browser.tabs.insertCSS(null, {file: "/css/style.css"});
                cookieVal.active = true;

                // Get Auto Fullscreen preference
                var gettingItem = browser.storage.local.get('afs');
                gettingItem.then((res) => {
                    /* Set Fullscreen */
                    if(res.afs){
                    getCurrentWindow().then((currentWindow) => {
                        var updateInfo = {
                            state: "fullscreen"
                        };
                    browser.windows.update(currentWindow.id, updateInfo);
                });
                }
            });
            }

            console.log("Cookie Value JSON "+ cookieVal.active);
            browser.cookies.set({
                url: tabs[0].url,
                name: "bgpicker",
                value: JSON.stringify(cookieVal)
            });
            browser.tabs.sendMessage(tabs[0].id, {active: cookieVal.active});
        }
    });
});
}

browser.notifications.onClicked.addListener(function(notificationId) {
    console.log('Notification ' + notificationId + ' was clicked by the user');
    browser.runtime.openOptionsPage();
});

var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
gettingActiveTab.then((tabs) => {
    browser.pageAction.show(tabs[0].id);
});

browser.pageAction.onClicked.addListener(function () {
    console.log("pageAction clicked! ");
    toggle();
    console.log(querying.then(logTabs, onError));
});

function logTabs(tabs) {
    for (tab of tabs) {
        // tab.url requires the `tabs` permission
        console.log(tab.url);
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}

var querying = browser.tabs.query({currentWindow: true, active: true, url: "*://*.twitch.tv/*"});
querying.then(logTabs, onError);

function handleInstalled(details) {
    console.log(details.reason);
    browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/icon-48.png"),
        "title": "New Twitch Chat Overlayer Version! 0.2.3",
        "message": "Added BTTV Support!"
    });
    browser.storage.local.set({
        afs: "on"
    });
    // Set Default Settings on first install
    if(details.reason == "install"){
        browser.storage.local.set({
            afs: "on"
        });
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);