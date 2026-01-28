/* ==========================================================================
   1. THEME MANAGEMENT
   ========================================================================== */
const themeToggle = document.querySelector('#checkbox');

const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) themeToggle.checked = (theme === 'dark');
};

// Initialize Theme
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
    });
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
const menuBtn = document.querySelector('#mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('is-active');
    });
}

/* ==========================================================================
   3. NAV HIGHLIGHTING LOGIC
   ========================================================================== */
function highlightNav() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const path = window.location.pathname.toLowerCase();

    // Reset all links
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));

    // Priority 1: Check URL Parameters (Docs/Blog)
    if (pageParam === 'docs') {
        document.getElementById('nav-docs')?.classList.add('active');
    } else if (pageParam === 'blog') {
        document.getElementById('nav-blog')?.classList.add('active');
    } 
    // Priority 2: Check Pathname (About)
    else if (path.includes('about.html')) {
        document.getElementById('nav-about')?.classList.add('active');
    } 
    // Priority 3: Check for Hub or Specific Calculators
    else if (
        path.includes('index.html') || 
        path.includes('fluid_type_calculator.html') || 
        path.endsWith('/')
    ) {
        document.getElementById('nav-calculators')?.classList.add('active');
    }
}

/* ==========================================================================
   4. FLUID TYPE CALCULATOR LOGIC
   ========================================================================== */
const calcInputs = ['minSize', 'maxSize', 'minVW', 'maxVW', 'baseRem'];

// Only run if we are on the calculator page
if (document.getElementById('minSize')) {
    calcInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateClamp);
    });

    document.getElementById('copyBtn').addEventListener('click', function() {
        const code = document.getElementById('clampCode').innerText;
        navigator.clipboard.writeText(code);
        
        this.innerText = "Copied!";
        this.style.background = "#28a745"; // Success Green
        
        setTimeout(() => {
            this.innerText = "Copy Code";
            this.style.background = "var(--accent-color)";
        }, 2000);
    });

    // Initial calculation
    calculateClamp();
}

function calculateClamp() {
    const minS = parseFloat(document.getElementById('minSize').value);
    const maxS = parseFloat(document.getElementById('maxSize').value);
    const minV = parseFloat(document.getElementById('minVW').value);
    const maxV = parseFloat(document.getElementById('maxVW').value);
    const base = parseFloat(document.getElementById('baseRem').value);

    if (minS && maxS && minV && maxV && base) {
        // The Slope Math
        const slope = (maxS - minS) / (maxV - minV);
        const yAxisIntersection = -minV * slope + minS;
        
        const slopePercentage = (slope * 100).toFixed(3);
        const baseRemValue = (yAxisIntersection / base).toFixed(3);
        const minRem = (minS / base).toFixed(3);
        const maxRem = (maxS / base).toFixed(3);

        // Update UI
        document.getElementById('slopeOut').innerText = slopePercentage;
        document.getElementById('baseOut').innerText = baseRemValue;
        
        const result = `clamp(${minRem}rem, ${baseRemValue}rem + ${slopePercentage}vw, ${maxRem}rem)`;
        document.getElementById('clampCode').innerText = result;
    }
}

// Global Init
window.addEventListener('DOMContentLoaded', highlightNav);