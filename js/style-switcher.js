/* Jayz Style Switcher */
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
styleSwitcherToggle.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})

window.addEventListener("scroll", () =>{
    if(document.querySelector(".style-switcher").classList.contains("open"))
    {
        document.querySelector(".style-switcher").classList.remove("open");
    }
})

const alternateStyles = document.querySelectorAll(".alternate-style");
function setActiveStyle(color)
{
    alternateStyles.forEach((style) => {
        if(color === style.getAttribute("title"))
        {
            style.removeAttribute("disabled");
        }
        else
        {
         style.setAttribute("disabled","true");
        }
    })
}
/* Jayz Dark Mode*/
// Jayz Dark Mode

// Select the day-night toggle button
const dayNight = document.querySelector(".day-night");

// Function to set the correct icon based on the current mode
function setIcon() {
    if (document.body.classList.contains("dark")) {
        dayNight.querySelector("i").classList.add("fa-sun");
        dayNight.querySelector("i").classList.remove("fa-moon");
    } else {
        dayNight.querySelector("i").classList.add("fa-moon");
        dayNight.querySelector("i").classList.remove("fa-sun");
    }
}

// Add event listener to toggle dark mode and change icon
dayNight.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    setIcon();
});

// On page load, set dark mode and the correct icon
window.addEventListener("load", () => {
    document.body.classList.add("dark");
    setIcon();
});

