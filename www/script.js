/* =============================================================
   AWS Cloud — script.js
   ============================================================= */

'use strict';

/* ── Star Canvas ─────────────────────────────────────────────── */
(function initStars() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width, height;

    function resize() {
        width  = canvas.width  = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createStar() {
        return {
            x:     Math.random() * width,
            y:     Math.random() * height,
            r:     Math.random() * 1.4 + 0.2,
            alpha: Math.random(),
            speed: Math.random() * 0.004 + 0.001,
            drift: (Math.random() - 0.5) * 0.15,
        };
    }

    function initStarField() {
        stars = Array.from({ length: 180 }, createStar);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const isDark = !document.body.classList.contains('light-theme');
        stars.forEach(s => {
            s.alpha += s.speed;
            if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
            s.x += s.drift;
            if (s.x < 0) s.x = width;
            if (s.x > width) s.x = 0;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = isDark
                ? `rgba(200,220,255,${s.alpha * 0.8})`
                : `rgba(80,100,160,${s.alpha * 0.4})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); initStarField(); });
    resize();
    initStarField();
    draw();
})();

/* ── Interaction Counter ─────────────────────────────────────── */
let counter = 0;
const counterButton = document.getElementById('counterButton');
const counterSpan   = document.getElementById('counter');

if (counterButton) {
    counterButton.addEventListener('click', function () {
        counter++;
        counterSpan.textContent = counter;

        // Brief scale pulse
        counterButton.style.transform = 'scale(0.94)';
        setTimeout(() => { counterButton.style.transform = ''; }, 120);

        // Add a log entry
        appendLog(`click #${counter} registered`);

        if (counter % 5 === 0) showBurst();
    });
}

/* ── Theme Toggle ────────────────────────────────────────────── */
const colorButton = document.getElementById('colorButton');
let isLight = localStorage.getItem('lightTheme') === 'true';

function applyTheme(light) {
    document.body.classList.toggle('light-theme', light);
    if (colorButton) {
        colorButton.innerHTML = light
            ? '🌑 &nbsp; Switch Theme'
            : '🌗 &nbsp; Switch Theme';
    }
}

applyTheme(isLight);

if (colorButton) {
    colorButton.addEventListener('click', function () {
        isLight = !isLight;
        applyTheme(isLight);
        localStorage.setItem('lightTheme', isLight);
        appendLog(`theme → ${isLight ? 'light' : 'dark'}`);
    });
}

/* ── Explore Button ──────────────────────────────────────────── */
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    });
}

/* ── Performance Log Panel ───────────────────────────────────── */
const perfLog = document.getElementById('perfLog');

function appendLog(message, warn = false) {
    if (!perfLog) return;
    const line = document.createElement('div');
    line.className = 'log-line' + (warn ? ' log-warn' : '');
    const now = new Date();
    const ts  = now.toLocaleTimeString('en-GB', { hour12: false });
    line.innerHTML = `<span class="log-prefix">[${ts}]</span> ${escHtml(message)}`;
    perfLog.appendChild(line);
    perfLog.scrollTop = perfLog.scrollHeight;

    // Keep log trimmed to last 20 entries
    while (perfLog.children.length > 20) {
        perfLog.removeChild(perfLog.firstChild);
    }
}

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ── Live Status in Navbar ───────────────────────────────────── */
const statusEl = document.getElementById('status');
const statuses = ['Live', 'Active', 'Online', 'Healthy'];
let statusIdx  = 0;

function cycleStatus() {
    if (!statusEl) return;
    statusEl.style.opacity = '0';
    setTimeout(() => {
        statusIdx = (statusIdx + 1) % statuses.length;
        statusEl.textContent = statuses[statusIdx];
        statusEl.style.opacity = '1';
    }, 300);
}

setInterval(cycleStatus, 4000);

/* ── Particle Burst on milestone ─────────────────────────────── */
function showBurst() {
    const burst = document.createElement('div');
    burst.textContent = counter % 25 === 0 ? '🚀' : '✨';
    Object.assign(burst.style, {
        position:      'fixed',
        top:           '50%',
        left:          '50%',
        transform:     'translate(-50%, -50%) scale(0)',
        fontSize:      '4rem',
        pointerEvents: 'none',
        zIndex:        '9999',
        animation:     'burstAnim 0.9s ease-out forwards',
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes burstAnim {
            0%   { transform: translate(-50%, -50%) scale(0);   opacity: 1; }
            60%  { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
            100% { transform: translate(-50%, -100px) scale(1.2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(burst);

    setTimeout(() => {
        burst.remove();
        style.remove();
    }, 900);
}

/* ── Intersection Observer — fade-in sections ─────────────────── */
function observeSections() {
    const targets = document.querySelectorAll('.glass-card, .arch-node, .demo-panel, .hero-metrics');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeUp 0.6s ease both';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${i * 60}ms`;
        io.observe(el);
    });
}

/* ── Keyboard Shortcuts ──────────────────────────────────────── */
document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
        case ' ':
            e.preventDefault();
            counterButton?.click();
            break;
        case 't':
        case 'T':
            colorButton?.click();
            break;
    }
});

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    observeSections();

    // Boot log messages
    const boots = [
        '✓ S3 origin connected',
        '✓ CloudFront distribution active',
        '✓ TLS certificate valid',
        '✓ Assets cached at edge',
        '» Keyboard: [Space] counter  [T] theme',
    ];
    boots.forEach((msg, i) => {
        setTimeout(() => appendLog(msg), i * 350 + 200);
    });
});

/* ── Page Load Performance ───────────────────────────────────── */
window.addEventListener('load', function () {
    const timing = window.performance?.timing;
    if (timing) {
        const loadMs = timing.loadEventEnd - timing.navigationStart;
        if (loadMs > 0) {
            setTimeout(() => appendLog(`page loaded in ${loadMs}ms`), boots.length * 350 + 600);
        }
    }
    console.log('%c☁  AWS Static Website', 'color:#3dd9ff;font-size:1.2rem;font-weight:700;');
    console.log('%cS3 · CloudFront · Terraform', 'color:#a855f7;');
    console.log('%c⌨  Space → counter  |  T → theme', 'color:#888;font-size:0.85rem;');
});

// Reference to boots array for load handler
const boots = []; // will be populated after DOMContentLoaded runs first