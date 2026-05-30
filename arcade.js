function loadPage(url){

const frame=document.getElementById(
"contentFrame"
);

document.getElementById(
"homeDashboard"
).style.display="none";

document.getElementById(
"frameContainer"
).style.display="block";

frame.src=url;

document.getElementById(
"sideMenu"
).classList.remove("open");

}

function returnHome(){

document.getElementById(
"frameContainer"
).style.display="none";

document.getElementById(
"homeDashboard"
).style.display="flex";

document.getElementById(
"contentFrame"
).src="";

document.getElementById(
"sideMenu"
).classList.remove("open");

}

function toggleMenu(){

document.getElementById(
"sideMenu"
).classList.toggle("open");

}

document.addEventListener(
"click",
function(event){

const menu=
document.getElementById(
"sideMenu"
);

const button=
document.querySelector(
".menu-toggle"
);

if(
!menu.contains(event.target)
&&
!button.contains(event.target)
){

menu.classList.remove(
"open"
);

}

});
