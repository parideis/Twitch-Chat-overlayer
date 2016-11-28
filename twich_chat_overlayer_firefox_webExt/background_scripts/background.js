/* Retrieve any previously set cookie and send to content script */

browser.tabs.onUpdated.addListener(cookieUpdate);

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function cookieUpdate(tabId, changeInfo, tab) {
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
      if(cookie) {
        console.log("Getting Cookies");
        console.log("Is the cookie active? " + cookie.value.valueOf());
        if (cookie.value[10] == "t"){
          browser.tabs.removeCSS(null, {file: "/css/style.css"});
          browser.tabs.insertCSS(null, {file: "/css/style.css"});
          browser.tabs.sendMessage(tabs[0].id, {active: true});
        } else if((cookie.value[10] == "f")){
          browser.tabs.removeCSS(null, {file: "/css/style.css"});
          browser.tabs.sendMessage(tabs[0].id, {active: false});
        }
        var cookieVal = JSON.parse(cookie.value);
        browser.tabs.sendMessage(tabs[0].id, {active: cookieVal.active});
      }
    });
  }); 
}
