/* ═══════════════════════════════════════════════
   SIRI CHANDANA — PORTFOLIO  |  script.js
   ═══════════════════════════════════════════════ */

/* ── CURSOR GLOW ─── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ── TYPING ANIMATION ─── */
const typingEl = document.getElementById('typingLabel');
const phrases  = ['IT Student', 'Web Developer', 'Python Enthusiast', 'ML Explorer'];
let pIdx = 0, cIdx = 0, deleting = false;

function typePhrase() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typingEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(typePhrase, 1800);
      return;
    }
  } else {
    typingEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(typePhrase, deleting ? 60 : 95);
}

window.addEventListener('load', () => setTimeout(typePhrase, 400));

/* ── PARTICLE CANVAS ─── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.55;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 230, 160, ${alpha})`;
      ctx.fill();
    }
  }

  // Connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 230, 160, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  for (let i = 0; i < 70; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  })();
})();

/* ── NAV SCROLL EFFECT ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});

/* ── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav__link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

/* ── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .cert-card, .about__grid, .stat, .contact-card, .resume-cta'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  const delay = el.dataset.delay ? parseInt(el.dataset.delay) : i * 60;
  el.style.transitionDelay = delay + 'ms';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── SMOOTH SCROLL OFFSET ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ── SKILL CARD HOVER SPARKLE ─── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

/* ── GLITCH TRIGGER ON HERO NAME HOVER ─── */
document.querySelectorAll('.glitch').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
});

/* ── CONSOLE EASTER EGG ─── */
console.log('%c[ SIRI CHANDANA RAVIRALA ]', 'color: #00e6a0; font-family: monospace; font-size: 14px; font-weight: bold;');
console.log('%cAspiring Web Developer & Python Enthusiast', 'color: #00c8ff; font-family: monospace; font-size: 11px;');
console.log('%c→ github.com/ravirala-sirichandana', 'color: #6b7a9a; font-family: monospace; font-size: 10px;');
/* ── CERTIFICATE GALLERY ─── */

const certImages = {
  0: ["certificates/ibm1.jpg","certificates/ibm2.jpg","certificates/ibm3.jpg"],
  1: ["certificates/cisco1.jpg","certificates/cisco2.jpg"]
};

const modal = document.getElementById("certModal");
const modalImg = document.getElementById("certImage");
const closeBtn = document.getElementById("certClose");
const prevBtn = document.getElementById("certPrev");
const nextBtn = document.getElementById("certNext");

let currentCert = 0;
let currentImg = 0;

document.querySelectorAll(".cert-card").forEach((card,index)=>{
  card.addEventListener("click",()=>{
    currentCert = index;
    currentImg = 0;
    modal.classList.add("open");
    modalImg.src = certImages[currentCert][currentImg];
  });
});

closeBtn.onclick = ()=> modal.classList.remove("open");

nextBtn.onclick = ()=>{
  currentImg = (currentImg+1) % certImages[currentCert].length;
  modalImg.src = certImages[currentCert][currentImg];
};

prevBtn.onclick = ()=>{
  currentImg = (currentImg-1+certImages[currentCert].length) % certImages[currentCert].length;
  modalImg.src = certImages[currentCert][currentImg];
};