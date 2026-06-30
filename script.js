    /**
 * BIRTHDAY JOURNEY ENGINE - BROTHER-SISTER VERSION (PRINCE & SHRUTI)
 */

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

const State = {
    isMuted: false,
    isDark: true,
    letterTyped: false,
    celebrationActive: false
};

function initApp() {
    setupSecurityEngine();
    setupCanvasEcosystem();
    setupCursorTracking();
    setupNavigationCore();
    setupInterfaceControls();
}

/* SECURITY MATRIX */
function setupSecurityEngine() {        
    const loginBtn = document.getElementById("loginBtn");
    const hintBtn = document.getElementById("hintBtn");
    const passwordInput = document.getElementById("passwordInput");
    const targetKey = "prince";

    loginBtn.addEventListener("click", verifyAccess);
    passwordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") verifyAccess();
    });

    hintBtn.addEventListener("click", () => {
        document.getElementById("hintText").classList.toggle("hidden");
    });

    function verifyAccess() {
        if (passwordInput.value.trim().toLowerCase() === targetKey) {
            document.getElementById("loginScreen").classList.add("hidden");
            document.getElementById("mainJourney").classList.remove("hidden");
            window.scrollTo(0, 0);
            initializeAudioContext();
        } else {
            const err = document.getElementById("loginError");
            err.classList.remove("hidden");
        }
    }
}

/* AUDIO CORE */
const musicElement = document.getElementById("bgMusic");

function initializeAudioContext() {
    musicElement.play().catch(() => {
        State.isMuted = true;
        document.getElementById("musicToggle").innerText = "🔇";
    });
}

function setupInterfaceControls() {
    const musicBtn = document.getElementById("musicToggle");
    const themeBtn = document.getElementById("themeToggle");

    musicBtn.addEventListener("click", () => {
        if (musicElement.paused) {
            musicElement.play();
            musicBtn.innerText = "🔊";
        } else {
            musicElement.pause();
            musicBtn.innerText = "🔇";
        }
    });

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        themeBtn.innerText = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
    });
}

/* CANVAS FX & PHYSICS ENGINE */
let canvas, ctx, particles = [];

function setupCanvasEcosystem() {
    canvas = document.getElementById("particleCanvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
    runRenderLoop();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor(x, y, isFirework = false, color = null) {
        this.x = x;
        this.y = y;
        this.isFirework = isFirework;
        this.size = isFirework ? Math.random() * 3 + 2 : Math.random() * 2 + 1;
        this.speedX = isFirework ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1;
        this.speedY = isFirework ? (Math.random() - 0.5) * 8 : Math.random() * -0.8 - 0.3;
        this.color = color || (Math.random() > 0.5 ? '#ff4791' : '#ffcc00');
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.isFirework) {
            this.speedY += 0.04;
            this.alpha -= this.decay;
        } else if (this.y < 0) {
            this.y = canvas.height;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function runRenderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0);
    if(particles.length < 50 && !State.celebrationActive) {
        particles.push(new Particle(Math.random() * canvas.width, canvas.height));
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(runRenderLoop);
}

function triggerFireworksExplosion() {
    const colors = ['#ff4791', '#ffcc00', '#00e5ff', '#b388ff'];
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(canvas.width / 2, canvas.height / 3, true, colors[Math.floor(Math.random() * colors.length)]));
    }
}

/* INTERACTIONS & SCROLL REVEALS */
function setupCursorTracking() {
    const trail = document.getElementById("cursorTrail");
    window.addEventListener("mousemove", (e) => {
        trail.style.left = e.clientX + "px";
        trail.style.top = e.clientY + "px";
    });
}

window.flipCard = function(card) {
    card.classList.toggle("flipped");
};

const flame = document.getElementById("candleFlame");
if(flame) {
    flame.parentElement.addEventListener("click", () => {
        flame.classList.add("hidden");
        document.getElementById("blowInstruction").innerText = "Candle blown successfully! 🔥";
        document.getElementById("startJourneyBtn").classList.remove("hidden");
        triggerFireworksExplosion();
    });
}

window.openLightbox = function(card) {
    const imgEl = card.querySelector("img");
    document.getElementById("lightboxImg").src = imgEl.src;
    document.getElementById("lightboxCaption").innerText = card.querySelector(".caption").innerText;
    document.getElementById("lightbox").classList.remove("hidden");
};

window.closeLightbox = function() {
    document.getElementById("lightbox").classList.add("hidden");
};

function setupNavigationCore() {
    document.getElementById("startJourneyBtn").addEventListener("click", () => {
        document.getElementById("gallerySection").scrollIntoView({ behavior: 'smooth' });
    });
    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        document.getElementById("scrollProgress").style.width = (winScroll / height) * 100 + "%";

        document.querySelectorAll(".scroll-reveal").forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.85) el.classList.add("visible");
        });

        const letterBox = document.getElementById("letterSection");
        if(letterBox.getBoundingClientRect().top < window.innerHeight * 0.5 && !State.letterTyped) {
            startTypewriterEngine();
        }
    });
}

/* TYPEWRITER ENGINE (BROTHER-SISTER TEXT) */
function startTypewriterEngine() {
    State.letterTyped = true;
    const targetContainer = document.getElementById("typewriterText");
    const message = `Dear Chhoti... 😎\n\nZyada emotional baatein toh mujhe aati nahi, par tumhara birthday hai toh bolna padega. Choti se kab badi ho gayi tum pata hi nahi chala (height chod ke, haha!).\n\nHar baat par daat dikhana, aur baat-baat par bahas karna😉 tumhara signature style hai. Par seriously, joke apart, you are the best sister one could ask for. Kaafi sahi aur samajhdaar hoti ja rahi ho.\n\nIs saal jo bhi goals hain tumhare, sab poore karo. Mehnat karo aur hamesha aise hi bindass raho. Happy Birthday Chhoti!\n\nTreat ready rakhna,\nYour brother Prince Singh🌟`;
    
    let index = 0;
    function type() {
        if (index < message.length) {
            targetContainer.textContent += message.charAt(index);
            index++;
            setTimeout(type, 35);
        }
    }
    type();
}

/* WISH WALL ELEMENT SPARKLES */
const wishes = ["Infinite joy! ⭐", "Keep Shining! ✨" , "Stay Bindass Chhoti! 💫", "Success Ahead! 👑", "Happy Birthday! 🎉","Radhey Rani ki kripa bani rahe! ☺️","Enjoy your day! 😉"];
const wall = document.getElementById("wishWallContainer");
if (wall) {
    wishes.forEach((wish, idx) => {
        const span = document.createElement("span");
        span.className = "floating-wish";
        span.innerText = wish;
        span.style.left = (Math.random() * 70 + 5) + "%";
        span.style.top = (Math.random() * 60 + 10) + "%";
        span.style.animationDelay = (idx * 1.2) + "s";
        wall.appendChild(span);
    });
}

/* 
/* ==========================================================================

   ========================================================================== */
function runCountdownEngine() {
    
    const targetDate = new Date(`July 1, ${new Date().getFullYear()} 00:00:00`).getTime();
    
    const ticker = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const timeLockZone = document.getElementById("timeLockZone");
        const loginFormZone = document.getElementById("loginFormZone");

        
        if (difference > 0) {
            
            if(timeLockZone && loginFormZone) {
                timeLockZone.classList.remove("hidden");
                loginFormZone.classList.add("hidden");
            }

            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            
            const timeString = `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
            
            if(document.getElementById("preCountdownDisplay")) {
                document.getElementById("preCountdownDisplay").innerText = timeString;
            }
            if(document.getElementById("countdownDisplay")) {
                document.getElementById("countdownDisplay").innerText = timeString;
            }
        } 
        
        else {
            clearInterval(ticker);
            
            // Lock interface gayab aur mast login form open!
            if(timeLockZone && loginFormZone) {
                timeLockZone.classList.add("hidden");
                loginFormZone.classList.remove("hidden");
            }
            
            if(document.getElementById("countdownDisplay")) {
                document.getElementById("countdownDisplay").innerText = "Unlocked! Open Your Gift! 🎁";
            }
        }
    }, 1000);
}
runCountdownEngine();

/* FINAL CELEBRATION CONTROL */
window.triggerFinalCelebration = function() {
    document.getElementById("finalCelebration").classList.remove("hidden");
    document.getElementById("finalCelebration").scrollIntoView({ behavior: 'smooth' });
    State.celebrationActive = true;
    for(let i = 0; i < 6; i++) {
        setTimeout(triggerFireworksExplosion, i * 350);
    }
};

window.triggerEasterEgg = function() {
    triggerFireworksExplosion();
    alert("🤫 Secret Message: Zyada pako mat, chupchap party do ab! Happy Birthday Shruti! 🎉\n\n Sari bate bakwaas thi😁😁");
};



/* ==========================================================================
   
   ========================================================================== */
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");


if (noBtn) {
    const fleeFunction = () => {
        // Container block ki limits nikalne ke liye
        const container = noBtn.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        
        const maxX = containerRect.width - noBtn.offsetWidth;
        const maxY = 150; // Thoda upar niche bhagne ke liye limit
        
        const randomX = Math.floor(Math.random() * maxX);
        // Bhai-behen prank control: thoda minus plus random delta
        const randomY = Math.floor((Math.random() - 0.5) * maxY);
        
        noBtn.style.left = randomX + "px";
        noBtn.style.top = randomY + "px";
    };

    noBtn.addEventListener("mouseover", fleeFunction);
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault(); 
        fleeFunction();
    });
}

if (yesBtn) {
    yesBtn.addEventListener("click", () => {
        alert("Chal ab jaldi se WhatsApp pe bol de ki 'Haan aayenge' ! Ekdum pakka wala confirm kar! 📱🔥");
        
        // Optional: Ye line direct use tumhare WhatsApp chat par redirect bhi kar degi text ke saath!
        window.open("https://wa.me/917070848361");
    });
}
