/* ==========================================================================
   RATIOSHIFT JAVASCRIPT CORE ENGINE (V2.5 AWWWARDS SPECIFICATION)
   Liquid Metal & Chromatic Thermal Mechanics
   Inspired by: Adam Perlis Awwwards Showcases (Terminal Intro, What People Say, Contact)
   Zero External Dependencies • 100% DRY Vanilla JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initCursorGlow();
    initTestimonialsSlider();
    initBackToTop();
    initCalculator();
    initDocumentation();
    initBlogReadTime();
});

/* --------------------------------------------------------------------------
   1. AUDIO ENGINE (SYNTHESIZED MECHANICAL & HARMONIC CHIMES)
   Zero MP3 weight • Web Audio API Pure Code Synthesizer
   -------------------------------------------------------------------------- */
let isSoundEnabled = true;
let audioContext = null;

function playAcousticFeedback(type = 'click') {
    if (!isSoundEnabled) return;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;

        if (type === 'click' || type === 'enter') {
            // Crisp tactile mechanical click
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(840, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.035);
        }

        if (type === 'chime' || type === 'enter') {
            // Radiant electric harmonic chime
            const oscHarmonic = audioContext.createOscillator();
            const gainHarmonic = audioContext.createGain();
            oscHarmonic.type = 'sine';
            oscHarmonic.frequency.setValueAtTime(587.33, now + 0.03); // D5
            oscHarmonic.frequency.exponentialRampToValueAtTime(880, now + 0.16); // A5
            gainHarmonic.gain.setValueAtTime(0.18, now + 0.03);
            gainHarmonic.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
            oscHarmonic.connect(gainHarmonic);
            gainHarmonic.connect(audioContext.destination);
            oscHarmonic.start(now + 0.03);
            oscHarmonic.stop(now + 0.42);
        }
    } catch (e) {
        // Silently proceed if AudioContext is blocked
    }
}

/* --------------------------------------------------------------------------
   2. THEME MANAGEMENT (PERMANENT DARK PHOSPHOR METALLIC SPECIFICATION)
   -------------------------------------------------------------------------- */
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

/* --------------------------------------------------------------------------
   3. NAVIGATION (BUG-FREE PATH HIGHLIGHTING)
   -------------------------------------------------------------------------- */
function initNav() {
    const menuBtn = document.querySelector('#mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playAcousticFeedback('click');
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('is-active');
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('is-active');
            }
        });
    }

    const currentPath = window.location.pathname.toLowerCase().replace(/\/index\.html$/, '');
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href, window.location.origin).pathname.toLowerCase().replace(/\/index\.html$/, '');

        if (linkPath !== '' && linkPath !== '/' && currentPath.startsWith(linkPath)) {
            link.classList.add('active');
        } else if ((currentPath === '' || currentPath === '/') && (linkPath === '' || linkPath === '/')) {
            link.classList.add('active');
        }
    });
}

/* --------------------------------------------------------------------------
   4. FLUID GLOWING CURSOR FOLLOWER
   Colors matching website: Phosphor Lime #7fee64 + Electric Cyan #00f2fe
   GPU-accelerated lerp trailing lighting • Auto-disabled on touch
   -------------------------------------------------------------------------- */
function initCursorGlow() {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let glow = document.getElementById('cursorGlow');
    let dot = document.getElementById('cursorDot');

    if (!glow) {
        glow = document.createElement('div');
        glow.id = 'cursorGlow';
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
    }

    if (!dot) {
        dot = document.createElement('div');
        dot.id = 'cursorDot';
        dot.className = 'cursor-dot';
        document.body.appendChild(dot);
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let glowX = -1000;
    let glowY = -1000;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            glow.style.opacity = '1';
            dot.style.opacity = '1';
        }
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        glow.style.opacity = '0';
        dot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        glow.style.opacity = '1';
        dot.style.opacity = '1';
    });

    function renderGlow() {
        if (isVisible) {
            glowX += (mouseX - glowX) * 0.14;
            glowY += (mouseY - glowY) * 0.14;
            glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
        }
        requestAnimationFrame(renderGlow);
    }
    renderGlow();
}

/* --------------------------------------------------------------------------
   5. "WHAT PEOPLE SAY" SLIDING TESTIMONIALS CAROUSEL
   (Adam Perlis Awwwards Showcase Kinetic Sliding Mechanics)
   -------------------------------------------------------------------------- */
function initTestimonialsSlider() {
    const track = document.getElementById('sliderTrack');
    const container = document.getElementById('sliderContainer');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const pagination = document.getElementById('sliderPagination');

    if (!track || !container) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Determine how many slides per view
    function getVisibleCards() {
        return window.innerWidth <= 900 ? 1 : 2;
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getVisibleCards());
    }

    // Render pagination dots
    if (pagination) {
        pagination.innerHTML = '';
        const numDots = getMaxIndex() + 1;
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            pagination.appendChild(dot);
        }
    }

    function updateSlider() {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 32; // 2rem
        const offset = currentIndex * (cardWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        if (pagination) {
            const dots = pagination.querySelectorAll('.slider-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
    }

    function goToSlide(index) {
        playAcousticFeedback('click');
        currentIndex = index;
        updateSlider();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(getMaxIndex()); // loop
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < getMaxIndex()) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0); // loop
            }
        });
    }

    // Touch & Drag Support
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        if (Math.abs(diff) > 50) {
            isDragging = false;
            if (diff > 0 && currentIndex > 0) {
                goToSlide(currentIndex - 1);
            } else if (diff < 0 && currentIndex < getMaxIndex()) {
                goToSlide(currentIndex + 1);
            }
        }
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('resize', updateSlider);
}

/* --------------------------------------------------------------------------
   6. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            playAcousticFeedback('click');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* --------------------------------------------------------------------------
   7. FLUID SCALE CALCULATOR
   -------------------------------------------------------------------------- */
function initCalculator() {
    const minSizeInput = document.getElementById('minSize');
    if (!minSizeInput) return;

    const calcInputs = ['minSize', 'maxSize', 'minVW', 'maxVW', 'baseRem'];
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');

    calcInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateClamp);
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            playAcousticFeedback('click');
            const codeEl = document.getElementById('clampCode');
            if (codeEl) {
                navigator.clipboard.writeText(codeEl.innerText).then(() => {
                    showToast('CSS clamp() copied to clipboard!');
                });
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            playAcousticFeedback('click');
            document.getElementById('minSize').value = 16;
            document.getElementById('maxSize').value = 48;
            document.getElementById('minVW').value = 320;
            document.getElementById('maxVW').value = 1600;
            document.getElementById('baseRem').value = 16;
            calculateClamp();
            showToast('Values reset to defaults');
        });
    }

    calculateClamp();
}

function calculateClamp() {
    const minS = parseFloat(document.getElementById('minSize')?.value);
    const maxS = parseFloat(document.getElementById('maxSize')?.value);
    const minV = parseFloat(document.getElementById('minVW')?.value);
    const maxV = parseFloat(document.getElementById('maxVW')?.value);
    const base = parseFloat(document.getElementById('baseRem')?.value);

    if (minS && maxS && minV && maxV && base && (maxV !== minV)) {
        const slope = (maxS - minS) / (maxV - minV);
        const yAxisIntersection = -minV * slope + minS;
        
        const slopePercentage = (slope * 100).toFixed(3);
        const baseRemValue = (yAxisIntersection / base).toFixed(3);
        const minRem = (minS / base).toFixed(3);
        const maxRem = (maxS / base).toFixed(3);

        const slopeOut = document.getElementById('slopeOut');
        const baseOut = document.getElementById('baseOut');
        const clampCode = document.getElementById('clampCode');

        if (slopeOut) slopeOut.innerText = slopePercentage;
        if (baseOut) baseOut.innerText = baseRemValue;
        
        const result = `clamp(${minRem}rem, ${baseRemValue}rem + ${slopePercentage}vw, ${maxRem}rem)`;
        if (clampCode) clampCode.innerText = result;
    }
}

/* --------------------------------------------------------------------------
   8. TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function showToast(message = 'Copied to clipboard!') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/* --------------------------------------------------------------------------
   9. DOCUMENTATION & BLOG HELPERS
   -------------------------------------------------------------------------- */
function initDocumentation() {
    const docBtn = document.getElementById('doc-menu-btn');
    const docSidebar = document.getElementById('docs-sidebar');

    if (docBtn && docSidebar) {
        docBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playAcousticFeedback('click');
            docSidebar.classList.toggle('active');
            
            const icon = docBtn.querySelector('.material-icons');
            if (icon) {
                icon.textContent = docSidebar.classList.contains('active') ? 'close' : 'menu_book';
            }
        });

        document.querySelectorAll('.doc-link').forEach(link => {
            link.addEventListener('click', () => {
                docSidebar.classList.remove('active');
                const icon = docBtn.querySelector('.material-icons');
                if (icon) icon.textContent = 'menu_book';
            });
        });
    }
}

function initBlogReadTime() {
    const postContainer = document.querySelector('.post-content');
    const displayArea = document.getElementById('read-time');

    if (postContainer && displayArea) {
        const text = postContainer.innerText;
        const wpm = 200;
        const words = text.trim().split(/\s+/).length;
        const time = Math.max(1, Math.ceil(words / wpm));
        displayArea.innerText = `${time} min read`;
    }
}
