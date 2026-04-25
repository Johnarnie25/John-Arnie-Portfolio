let preloaderDone = false;
document.addEventListener("DOMContentLoaded", function () {

/* =========================
   Section Reveal Animation
   ========================= */
const sections = document.querySelectorAll(".section");

function revealSections() {
    const trigger = window.innerHeight * 0.85;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;

        if (sectionTop < trigger && sectionBottom > 0) {
            section.classList.add("show");
        } else {
            section.classList.remove("show");
        }
    });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);


/* =========================
   Typed.js Animation
   ========================= */
if (document.querySelector(".typing")) {
    new Typed(".typing", {
        strings: [
            "Full-Stack Developer",
            "AI Enthusiast",
            "Graphic Designer",
            "Social Media Management",
            "IT Specialist"
        ],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });
}


/* =========================
   Sound Effects System
   ========================= */

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;

const savedSoundSetting = localStorage.getItem('soundEnabled');
if (savedSoundSetting !== null) {
    soundEnabled = savedSoundSetting === 'true';
}

function updateSoundStorage(enabled){
    localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
}

function triggerHapticFeedback(){
    if(navigator.vibrate){
        navigator.vibrate(10);
    }
}

function playSoundSample({
    frequency=440,
    duration=0.12,
    type='sine',
    gain=0.15
} = {}){

    if(!soundEnabled) return;

    if(audioContext.state === 'suspended'){
        audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gainNode.gain.value = gain;

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

function playHoverSound(){
    playSoundSample({frequency:1500,duration:0.08,type:'triangle',gain:0.04});
}

function playClickSound(){
    playSoundSample({frequency:700,duration:0.15,type:'square',gain:0.08});
}

function attachSoundEvents(el){

    if(!el || el.id === "sound-toggle") return;

    el.addEventListener("mouseenter",playHoverSound);
    el.addEventListener("click",playClickSound);
}

function attachSoundToAllInteractives(){

    const selectors = [
        'a',
        'button',
        '[role="button"]',
        '.hire-me',
        '.nav-toggler',
        '.portfolio-img.clickable',
        '#download-cv'
    ];

    const items = new Set();

    selectors.forEach(selector=>{
        document.querySelectorAll(selector).forEach(el=>items.add(el));
    });

    items.forEach(el=>attachSoundEvents(el));
}


/* =========================
   Sound Toggle Button
   ========================= */
/* =================================================
   PROFESSIONAL UI SOUND SYSTEM
   Subtle micro-interaction sounds (Apple-style)
================================================= */

class UISoundEngine {

    constructor(){

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;

        const saved = localStorage.getItem("soundEnabled");

        if(saved !== null){
            this.enabled = saved === "true";
        }

    }

    save(){
        localStorage.setItem("soundEnabled", this.enabled);
    }

    resume(){
        if(this.ctx.state === "suspended"){
            this.ctx.resume();
        }
    }

    tone({
        freq = 440,
        duration = 0.08,
        type = "sine",
        gain = 0.05,
        attack = 0.002,
        release = 0.04,
        detune = 0
    } = {}){

        if(!this.enabled) return;

        this.resume();

        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = detune;

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(gain, now + attack);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + release);

    }

    /* -----------------------
       Hover micro interaction
    ----------------------- */

    hover(){

        this.tone({
            freq: 1300,
            duration: 0.035,
            type: "sine",
            gain: 0.02
        });

        this.tone({
            freq: 1700,
            duration: 0.03,
            type: "triangle",
            gain: 0.015,
            detune: -4
        });

    }

    /* -----------------------
       Click interaction
    ----------------------- */

    click(){

        this.tone({
            freq: 520,
            duration: 0.06,
            type: "sine",
            gain: 0.05
        });

        setTimeout(()=>{

            this.tone({
                freq: 750,
                duration: 0.045,
                type: "triangle",
                gain: 0.03
            });

        },20);

    }

    /* -----------------------
       Open / popup interaction
    ----------------------- */

    open(){

        this.tone({
            freq: 420,
            duration: 0.07,
            type: "sine",
            gain: 0.05
        });

        setTimeout(()=>{

            this.tone({
                freq: 880,
                duration: 0.05,
                type: "triangle",
                gain: 0.03
            });

        },25);

    }

}

const uiSound = new UISoundEngine();



/* =================================================
   ATTACH SOUNDS TO UI
================================================= */

function attachUISounds(){

    const selectors = [

        "a",
        "button",
        "[role='button']",
        ".hire-me",
        ".nav-toggler",
        ".portfolio-img.clickable",
        "#download-cv",
        ".lightbox .close",
        ".lightbox .prev",
        ".lightbox .next"

    ];

    const elements = new Set();

    selectors.forEach(selector=>{

        document.querySelectorAll(selector).forEach(el=>{

            elements.add(el);

        });

    });

    elements.forEach(el=>{

        el.addEventListener("mouseenter", ()=>{

            uiSound.hover();

        });

        el.addEventListener("click", ()=>{

            uiSound.click();

        });

    });

}

attachUISounds();



/* =================================================
   SOUND TOGGLE BUTTON
================================================= */
const soundBtn = document.querySelector('.sound-toggle');

function updateSoundUI() {
    if (!soundBtn) return;

    soundBtn.classList.toggle('active', uiSound.enabled);
    soundBtn.classList.toggle('muted', !uiSound.enabled);

    const icon = soundBtn.querySelector('i');

    if (icon) {
        icon.classList.toggle('fa-volume-up', uiSound.enabled);
        icon.classList.toggle('fa-volume-mute', !uiSound.enabled);
    }
}

// INITIAL STATE (important)
updateSoundUI();

// CLICK EVENT
if (soundBtn) {
    soundBtn.addEventListener('click', () => {

        uiSound.enabled = !uiSound.enabled;
        uiSound.save();

        updateSoundUI();

        // play feedback (kahit toggle)
        if (uiSound.enabled) {
            uiSound.click();
        }

    });
}



/* =================================================
   PORTFOLIO LIGHTBOX OPEN SOUND
================================================= */

document.querySelectorAll(".portfolio-img.clickable").forEach(item=>{

    item.addEventListener("click", ()=>{

        uiSound.open();

    });

});


/* =========================
   Navigation System
   ========================= */

const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const allSections = document.querySelectorAll(".section");

function showSection(element){

    allSections.forEach(section=>{
        section.classList.remove("active");
    });

    const target = element.getAttribute("href").split("#")[1];

    const targetSection = document.getElementById(target);

    if(targetSection){
        targetSection.classList.add("active");
    }
}

function updateNav(element){

    const target = element.getAttribute("href").split("#")[1];

    navLinks.forEach(link=>{
        link.classList.remove("active");

        if(link.getAttribute("href").split("#")[1] === target){
            link.classList.add("active");
        }
    });
}


/* =========================
   Newsletter auto-email send
   ========================= */

const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmailInput = document.getElementById('newsletter-email');
const newsletterStatus = document.getElementById('newsletter-status');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const subscriberEmail = (newsletterEmailInput.value || '').trim();

        if (!subscriberEmail || !subscriberEmail.includes("@")) {
            newsletterStatus.textContent = 'Please enter a valid email address.';
            newsletterStatus.style.color = '#ffb3b3';
            return;
        }

        newsletterStatus.textContent = 'Sending your CV and welcome message...';
        newsletterStatus.style.color = '#fff';

            const templateParams = {
        to_email: subscriberEmail,
        from_name: "Jay",
        message: "I came across your work and was genuinely impressed by what you’re building. If you’re currently exploring ways to improve your website, systems, or user experience, I’d be glad to support your team with scalable and efficient solutions.",
        cv_link: "https://johnarniemariano.vercel.app/pdf/john-arnie-mariano-resume.pdf",
        portfolio_link: "https://johnarniemariano.vercel.app/"
        };

        emailjs.send('service_49c8tp8', 'template_1ffqtkq', templateParams)
            .then(() => {
                newsletterStatus.textContent = 'Email sent successfully! Check your inbox (or spam).';
                newsletterStatus.style.color = '#a4f8b4';
                newsletterForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                newsletterStatus.textContent = 'Failed to send. Check console.';
                newsletterStatus.style.color = '#ffb3b3';
            });
    });
}


navLinks.forEach(link => {

    link.addEventListener("click", function(e) {

        e.preventDefault();

        const targetId = this.getAttribute("href").replace("#","");
        const targetSection = document.getElementById(targetId);

        if(targetSection){

            targetSection.scrollIntoView({
                behavior: "smooth"
            });

        }

        updateNav(this);

        if(window.innerWidth < 1200){
            toggleAside();
        }

    });

});

/* =========================
   Scroll Active Nav Detection
   ========================= */

function detectActiveNav(){

    let currentSection = "";

    allSections.forEach(section=>{

        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if(window.scrollY >= sectionTop - 200){
            currentSection = section.getAttribute("id");
        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + currentSection){
            link.classList.add("active");
        }

    });

}

window.addEventListener("scroll",detectActiveNav);


/* =========================
   Hire Me Button
   ========================= */

const hireBtn = document.querySelector(".hire-me");

if(hireBtn){

    hireBtn.addEventListener("click",function(){

        showSection(this);
        updateNav(this);

    });

}


/* =========================
   Nav Toggler
   ========================= */

const navTogglerBtn = document.querySelector(".nav-toggler");
const aside = document.querySelector(".aside");

function toggleAside(){

    if(!aside || !navTogglerBtn) return;

    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");

    allSections.forEach(section=>{
        section.classList.toggle("open");
    });

}

if(navTogglerBtn){
    navTogglerBtn.addEventListener("click",toggleAside);
}


/* =========================
   CV Download
   ========================= */

const downloadBtn = document.getElementById("download-cv");

if(downloadBtn){

    downloadBtn.addEventListener("click",function(){

        const pdfUrl = "pdf/john-arnie-mariano-cv.pdf";

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "john-arnie-mariano-cv.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    });

}


/* =========================
   Rainbow Cursor Trail
   ========================= */
const light = document.querySelector(".cursor-light");

document.addEventListener("mousemove",(e)=>{
  light.style.setProperty("--x", e.clientX + "px");
  light.style.setProperty("--y", e.clientY + "px");
});

/* =========================
   Experience Accordion
   ========================= */

const headers = document.querySelectorAll(".exp-header");

headers.forEach(header=>{

    header.addEventListener("click",()=>{

        const card = header.nextElementSibling;
        const icon = header.querySelector(".exp-icon");

        document.querySelectorAll(".exp-card").forEach(c=>{
            if(c!==card) c.style.display="none";
        });

        document.querySelectorAll(".exp-icon").forEach(i=>{
            if(i!==icon) i.textContent="+";
        });

        if(card.style.display==="block"){

            card.style.display="none";
            icon.textContent="+";

        }else{

            card.style.display="block";
            icon.textContent="-";

        }

    });

});


/* =========================
   Portfolio Lightbox
   ========================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");
const prevBtn = document.querySelector(".lightbox .prev");
const nextBtn = document.querySelector(".lightbox .next");

let currentImages=[];
let currentIndex=0;

document.querySelectorAll(".portfolio-img.clickable").forEach(item=>{

    item.addEventListener("click",()=>{

        currentImages = JSON.parse(item.dataset.images);
        currentIndex = 0;

        if(lightboxImg){
            lightboxImg.src = currentImages[currentIndex];
        }

        if(lightbox){
            lightbox.style.display="block";
        }

    });

});

if(closeBtn){
    closeBtn.addEventListener("click",()=>lightbox.style.display="none");
}

if(nextBtn){
    nextBtn.addEventListener("click",()=>{
        currentIndex=(currentIndex+1)%currentImages.length;
        lightboxImg.src=currentImages[currentIndex];
    });
}

if(prevBtn){
    prevBtn.addEventListener("click",()=>{
        currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;
        lightboxImg.src=currentImages[currentIndex];
    });
}

if(lightbox){

    lightbox.addEventListener("click",e=>{
        if(e.target === lightbox){
            lightbox.style.display="none";
        }
    });

}

});
window.addEventListener("load", function () {

    setTimeout(function () {

        const preloader = document.getElementById("preloader");
        if (preloader) preloader.classList.add("hide");

        // mark as done
        preloaderDone = true;

        // reveal sections AFTER preloader
        revealSections();

        // social links animation
        const social = document.querySelector(".social-links");
        if (social) social.classList.add("loaded");

        // RESET NAVBAR STATE (IMPORTANT)
        const aside = document.querySelector(".aside");
        if (aside) {
            aside.classList.add("at-top");
            aside.classList.remove("hide", "show", "scrolled");
        }

    }, 2500);

});


const magneticButtons = document.querySelectorAll(".btn");

magneticButtons.forEach(btn => {

btn.addEventListener("mousemove", function(e){

const rect = btn.getBoundingClientRect();
const x = e.clientX - rect.left - rect.width / 2;
const y = e.clientY - rect.top - rect.height / 2;

btn.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;

});

btn.addEventListener("mouseleave", function(){

btn.style.transform = "translate(0,0)";

});

});
document.querySelectorAll(
".service-item-inner, .portfolio-item-inner, .certificate-item-inner"
).forEach(card=>{

card.addEventListener("mousemove",e=>{

const rect=card.getBoundingClientRect();

card.style.setProperty("--x",(e.clientX-rect.left)+"px");
card.style.setProperty("--y",(e.clientY-rect.top)+"px");

});

});

let lastScroll = 0;
const asideEl = document.querySelector(".aside");

if (asideEl) {

    window.addEventListener("scroll", () => {

        // ❌ STOP scroll behavior sa mobile
        if (window.innerWidth < 1200) {
            asideEl.classList.remove("hide", "show", "scrolled");
            asideEl.classList.add("at-top");
            return;
        }

        if (!preloaderDone) return;

        const currentScroll = window.pageYOffset;

        // 🟢 TOP
        if (currentScroll <= 50) {
            asideEl.classList.remove("scrolled", "hide", "show");
            asideEl.classList.add("at-top");
            return;
        }

        // 🔽 SCROLL DOWN → HIDE
        if (currentScroll > lastScroll) {

            asideEl.classList.add("hide");
            asideEl.classList.remove("show", "at-top");

            asideEl.classList.add("scrolled");

        } 
        // 🔼 SCROLL UP → SHOW
        else {

            asideEl.classList.remove("hide", "scrolled");
            asideEl.classList.add("show");

        }

        lastScroll = currentScroll;

    });

}

(function () {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 64;
    canvas.height = 64;

    let progress = 0;
    let glow = 0;
    let isHidden = false;
    let notificationPulse = 0;

    function drawJ(p, color) {
        ctx.beginPath();

        // Vertical line
        ctx.moveTo(40, 10);
        if (p < 0.6) {
            ctx.lineTo(40, 10 + 50 * (p / 0.6));
        } else {
            ctx.lineTo(40, 60);
        }

        // Curve
        if (p >= 0.6) {
            let curveProgress = (p - 0.6) / 0.4;
            ctx.arc(30, 50, 10, 0, Math.PI * curveProgress, false);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.stroke();
    }

    function drawNotificationDot() {
        notificationPulse += 0.1;
        let scale = 1 + Math.sin(notificationPulse) * 0.2;

        ctx.beginPath();
        ctx.arc(50, 14, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "var(--skin-color)";
        ctx.fill();
    }

    function getScrollColor() {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const ratio = scrollY / maxScroll;

        const r = Math.floor(255);
        const g = Math.floor(80 + (ratio * 100));
        const b = Math.floor(100 + (ratio * 100));

        return `rgb(${r},${g},${b})`;
    }

    function animate() {
        ctx.clearRect(0, 0, 64, 64);

        glow += 0.05;
        let glowIntensity = 0.5 + Math.sin(glow) * 0.5;

        let color = getScrollColor();

        ctx.shadowBlur = 10 * glowIntensity;
        ctx.shadowColor = color;

        drawJ(progress, color);

        if (progress < 1) {
            progress += 0.02;
        }

        // 🔴 Notification mode pag tab inactive
        if (isHidden) {
            drawNotificationDot();
        }

        // Update favicon
        const link = document.querySelector("link[rel='icon']");
        link.href = canvas.toDataURL("image/png");

        requestAnimationFrame(animate);
    }

    // 👀 Detect tab visibility
    document.addEventListener("visibilitychange", () => {
        isHidden = document.hidden;
    });

    animate();

})();
const socialLinks = document.querySelector(".social-links");
const homeSection = document.querySelector(".home");

function toggleSocialLinks() {
    const rect = homeSection.getBoundingClientRect();

    if (rect.top <= 0 && rect.bottom >= window.innerHeight * 0.3) {
        socialLinks.classList.add("show");
    } else {
        socialLinks.classList.remove("show");
    }
}

window.addEventListener("scroll", toggleSocialLinks);
window.addEventListener("load", toggleSocialLinks);
