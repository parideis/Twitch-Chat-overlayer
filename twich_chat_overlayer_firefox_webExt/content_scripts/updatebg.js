var html = document.querySelector('html');
var body = document.querySelector('body');
var theatre = document.querySelector(".enter-theatre-button");
var player = document.querySelector(".player");

browser.runtime.onMessage.addListener(updateBg);

function updateBg(request, sender, sendResponse) {

  if(request.active) {
      // Toogle theatre mode if it is not already activated
      if (player.getAttribute("data-theatre") === "false") {
        console.log("Theatre mode toggled");
        theatre.click();
      }
  }
}