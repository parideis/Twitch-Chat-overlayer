var html = document.querySelector('html');
var body = document.querySelector('body');
//var app = document.querySelector('.app-main');
var theatre = document.querySelector(".enter-theatre-button");
var player = document.querySelector(".player");

browser.runtime.onMessage.addListener(updateBg);

function updateBg(request, sender, sendResponse) {

  //app.style.backgroundColor = "blue";
  if(request.active) {
      // Toogle theatre mode if it is not already activated
      if (player.getAttribute("data-theatre") === "false") {
        console.log("Theatre mode toggled");
        theatre.click();
      }
  } else if(!(request.active)) {
      if (player.getAttribute("data-theatre") === "true") {
          console.log("Theatre mode toggled");
          theatre.click();
      }
  }

}