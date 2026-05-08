/* arcade.js */

function loadPage(url) {
  const frame = document.getElementById("contentFrame");
  const menu = document.getElementById("sideMenu");

  if (frame) {
    frame.src = url;
  }

  /* fermeture automatique du menu après clic */
  if (menu) {
    menu.classList.remove("open");
  }
}

function toggleMenu() {
  const menu = document.getElementById("sideMenu");

  if (menu) {
    menu.classList.toggle("open");
  }
}

/* fermeture du menu si clic en dehors */
document.addEventListener("click", function (event) {
  const menu = document.getElementById("sideMenu");
  const button = document.querySelector(".menu-toggle");

  if (!menu || !button) return;

  const clickInsideMenu = menu.contains(event.target);
  const clickOnButton = button.contains(event.target);

  if (!clickInsideMenu && !clickOnButton) {
    menu.classList.remove("open");
  }
});
