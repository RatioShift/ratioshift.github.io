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
    const currentUrl = window.location.href.toLowerCase();
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        // 1. Remove active from everyone first
        link.classList.remove('active');

        // 2. Get the absolute URL of the link (The browser converts /about to http://site.com/about)
        const linkUrl = link.href.toLowerCase();

        // 3. Check for Blog specifically (Query params)
        if (currentUrl.includes('page=blog') && linkUrl.includes('page=blog')) {
            link.classList.add('active');
        } 
        // 4. Check for other pages
        else if (!currentUrl.includes('page=blog') && currentUrl.includes(linkUrl)) {
            // This handles /about, /products, and /documentation
            link.classList.add('active');
        }
        
        // 5. Special case for Home/Products if path is empty
        if (window.location.pathname === "/" && linkUrl.endsWith("/products")) {
             link.classList.add('active');
        }
    });
}

// Run it!
document.addEventListener('DOMContentLoaded', highlightNav);
/* /* ==========================================================================
   4. FLUID TYPE CALCULATOR LOGIC
   ========================================================================== */
const calcInputs = ['minSize', 'maxSize', 'minVW', 'maxVW', 'baseRem'];
const toast = document.getElementById('toast');
const resetBtn = document.getElementById('resetBtn');

// Only run if we are on the calculator page
if (document.getElementById('minSize')) {
    
    // 1. Listen for typing/sliding
    calcInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateClamp);
    });

    // 2. Copy Button Logic
    document.getElementById('copyBtn').addEventListener('click', function() {
        const code = document.getElementById('clampCode').innerText;
        navigator.clipboard.writeText(code).then(() => {
            showToast();
        });
    });

    // 3. Reset Button Logic
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('minSize').value = 16;
            document.getElementById('maxSize').value = 48;
            document.getElementById('minVW').value = 320;
            document.getElementById('maxVW').value = 1600;
            document.getElementById('baseRem').value = 16;
            calculateClamp(); // Refresh the numbers
        });
    }

    // Initial calculation on page load
    calculateClamp();
}

// 4. Toast Notification Function
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function calculateClamp() {
    const minS = parseFloat(document.getElementById('minSize').value);
    const maxS = parseFloat(document.getElementById('maxSize').value);
    const minV = parseFloat(document.getElementById('minVW').value);
    const maxV = parseFloat(document.getElementById('maxVW').value);
    const base = parseFloat(document.getElementById('baseRem').value);

    if (minS && maxS && minV && maxV && base) {
        const slope = (maxS - minS) / (maxV - minV);
        const yAxisIntersection = -minV * slope + minS;
        
        const slopePercentage = (slope * 100).toFixed(3);
        const baseRemValue = (yAxisIntersection / base).toFixed(3);
        const minRem = (minS / base).toFixed(3);
        const maxRem = (maxS / base).toFixed(3);

        document.getElementById('slopeOut').innerText = slopePercentage;
        document.getElementById('baseOut').innerText = baseRemValue;
        
        const result = `clamp(${minRem}rem, ${baseRemValue}rem + ${slopePercentage}vw, ${maxRem}rem)`;
        document.getElementById('clampCode').innerText = result;
    }
}
const docBtn = document.getElementById('doc-menu-btn');
const docSidebar = document.getElementById('docs-sidebar');

if (docBtn && docSidebar) {
    docBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        docSidebar.classList.toggle('active');
        
        // Switch between Book and Close icon
        const icon = docBtn.querySelector('.material-icons');
        if (docSidebar.classList.contains('active')) {
            icon.textContent = 'close';
        } else {
            icon.textContent = 'menu_book';
        }
    });

    // Close when clicking a link
    document.querySelectorAll('.doc-link').forEach(link => {
        link.addEventListener('click', () => {
            docSidebar.classList.remove('active');
            docBtn.querySelector('.material-icons').textContent = 'menu_book';
        });
    });
}

/* ==========================================================================
   5. FULL-SITE TRANSLATION LOGIC
   ========================================================================== */
const translations = {
    'en': {
        'nav-products': 'Products',
        'nav-docs': 'Documentation',
        'nav-blog': 'Blog',
        'nav-about': 'About Us',
        'hero-title': 'Developer Tools',
        'hero-desc': 'Select a tool to get started with your project.',
        'card-fluid-title': 'Fluid Scale Calculator',
        'card-fluid-desc': 'Generate CSS clamp() for typography, spacing, and layouts.',
        'card-grid-title': 'Grid Generator',
        'card-grid-desc': 'Coming Soon: Visual CSS Grid layout builder.',
        'footer-desc': 'Precise tools for modern web developers.',
        'footer-links-title': 'Quick Links',
        'footer-connect-title': 'Connect',
        'footer-lang-title': 'Language'
    },
    'bn': {
        'nav-products': 'প্রোডাক্টস',
        'nav-docs': 'ডকুমেন্টেশন',
        'nav-blog': 'ব্লগ',
        'nav-about': 'আমাদের সম্পর্কে',
        'hero-title': 'ডেভেলপার টুলস',
        'hero-desc': 'আপনার প্রজেক্ট শুরু করতে একটি টুল সিলেক্ট করুন।',
        'card-fluid-title': 'ফ্লুইড স্কেল ক্যালকুলেটর',
        'card-fluid-desc': 'টাইপোগ্রাফি এবং লেআউটের জন্য CSS clamp() জেনারেট করুন।',
        'card-grid-title': 'গ্রিড জেনারেটর',
        'card-grid-desc': 'শীঘ্রই আসছে: ভিজ্যুয়াল CSS গ্রিড লেআউট বিল্ডার।',
        'footer-desc': 'আধুনিক ওয়েব ডেভেলপারদের জন্য সঠিক টুলস।',
        'footer-links-title': 'প্রয়োজনীয় লিঙ্ক',
        'footer-connect-title': 'যোগাযোগ',
        'footer-lang-title': 'ভাষা'
    }
};

function applyTranslation(lang) {
    const dict = translations[lang];
    
    // Find every element that has a 'data-i18n' attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (dict[key]) {
            // Check if it's an input placeholder or regular text
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = dict[key];
            } else {
                element.textContent = dict[key];
            }
        }
    });
    
    // Set the HTML lang attribute for SEO
    document.documentElement.lang = lang;
}

// Event Listener for the Dropdown
const langSelect = document.querySelector('#language-select');
if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        applyTranslation(lang);
        localStorage.setItem('preferred-lang', lang);
    });
}

// Run on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    if (langSelect) langSelect.value = savedLang;
    applyTranslation(savedLang);
});