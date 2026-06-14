// MOBILE MENU

const menuBtn =
document.getElementById("menuBtn");

const navLinks =
document.getElementById("navLinks");

menuBtn.addEventListener("click",()=>{

navLinks.classList.toggle("show");

});

// COUNTER ANIMATION

const counters =
document.querySelectorAll(".counter");

counters.forEach(counter=>{

const updateCounter=()=>{

const target =
+counter.getAttribute("data-target");

const count =
+counter.innerText;

const increment =
target / 100;

if(count < target){

counter.innerText =
Math.ceil(count + increment);

setTimeout(updateCounter,20);

}else{

counter.innerText =
target.toLocaleString();

}

};

updateCounter();

});