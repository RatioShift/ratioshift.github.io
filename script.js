const themeToggle = document.querySelector('#checkbox');
const menuBtn = document.querySelector('#mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Theme Toggle
themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

if (localStorage.getItem('theme') === 'dark') {
    themeToggle.checked = true;
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Mobile Menu
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('is-active');
});

// CLAMP CALCULATOR LOGIC
const inputs = ['minSize', 'maxSize', 'minVW', 'maxVW', 'baseRem'];
inputs.forEach(id => document.getElementById(id).addEventListener('input', calculateClamp));

function calculateClamp() {
    const minS = parseFloat(document.getElementById('minSize').value);
    const maxS = parseFloat(document.getElementById('maxSize').value);
    const minV = parseFloat(document.getElementById('minVW').value);
    const maxV = parseFloat(document.getElementById('maxVW').value);
    const base = parseFloat(document.getElementById('baseRem').value);

    if (minS && maxS && minV && maxV && base) {
        // Slope calculation
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

// Copy to Clipboard
document.getElementById('copyBtn').addEventListener('click', () => {
    const code = document.getElementById('clampCode').innerText;
    navigator.clipboard.writeText(code);
    const btn = document.getElementById('copyBtn');
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = "Copy Code", 2000);
});

// Initialize on load
calculateClamp();