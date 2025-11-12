/*Nav bar responsivenes*/

const mq = window.matchMedia("(max-width: 1024px)");

let hamburger = document.createElement("div");
function mobileNav() {
    let leftHalf = document.querySelector('.lefthalf');
    leftHalf.classList.add("display-none");
    hamburger.innerHTML = "☰";
    Object.assign(hamburger.style, {
        color: "white",
        fontSize: "32px",
    })
    let nav = document.querySelector(".nav");
    nav.prepend(hamburger)
    let left = document.querySelector('.left');
    left.lastElementChild.classList.add("display-none");
    left.classList.add("grow-none");
    let rightLi = document.querySelector('.right').children[1];
    rightLi.classList.add("display-none");
}

function desktopNav() {
    hamburger.remove();
    let leftHalf = document.querySelector('.lefthalf');
    leftHalf.classList.remove("display-none");
    let left = document.querySelector('.left');
    left.lastElementChild.classList.remove("display-none");
    left.classList.remove("grow-none");
    let rightLi = document.querySelector('.right').children[1];
    rightLi.classList.remove("display-none");
}


mq.addEventListener("change", (e) => {
    if (e.matches) {
        mobileNav();

    }
    else {
        desktopNav();
    }
});