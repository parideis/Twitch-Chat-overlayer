function saveOptions(e) {
    browser.storage.local.set({
        afs: document.querySelector("#afs").checked
    });
    console.log("Saving?... "+ document.querySelector("#afs").checked);
    e.preventDefault();
}

function restoreOptions() {
    var gettingItem = browser.storage.local.get('afs');
    gettingItem.then((res) => {
        console.log(res);
        document.querySelector("#afs").checked = res.afs;
});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
