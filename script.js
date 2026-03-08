// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_QDrH9Ha8QmPnmG-4aAn1fZdqPXVomIsPQdpkyH-x_3v4UmTQkqD6ECsH2p1NVMne/exec';


// Code lookup
document.getElementById('findInviteBtn').addEventListener('click', async function () {
    const code = document.getElementById('inviteCode').value.trim().toUpperCase();
    const errorEl = document.getElementById('codeError');
    errorEl.style.display = 'none';
    this.textContent = 'Looking up...';
    this.disabled = true;

    try {
        const res = await fetch(`${APPS_SCRIPT_URL}?action=lookup&code=${code}`);
        const json = await res.json();

        if (json.found) {
            document.getElementById('rsvpCode').value = code;
            document.getElementById('rsvpName').value = json.name;

            document.getElementById('guestGreeting').textContent = `Welcome, ${json.name}!`;
            const guestsSelect = document.getElementById('guests');
            guestsSelect.innerHTML = '';
            guestsSelect.dataset.max = json.maxGuests;
            for (let n = 1; n <= json.maxGuests; n++) {
                const opt = document.createElement('option');
                opt.value = n;
                opt.textContent = n;
                guestsSelect.appendChild(opt);
            }
            guestsSelect.value = json.maxGuests;

            document.getElementById('codeGate').style.display = 'none';
            document.getElementById('rsvpFormWrap').style.display = 'block';
        } else {
            errorEl.textContent = 'Code not found. Please double-check your invitation.';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent = 'Something went wrong. Please try again.';
        errorEl.style.display = 'block';
    }

    this.textContent = 'Find My Invitation';
    this.disabled = false;
});

// RSVP submission
document.getElementById('rsvpForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const payload = {
        code: document.getElementById('rsvpCode').value,
        name: document.getElementById('rsvpName').value,
        attendance: document.getElementById('attendance').value,
        guests: document.getElementById('guests').value,
        welcomeParty: document.getElementById('welcomeParty').value,
        shuttle: document.getElementById('shuttle').value,
        dietary: document.getElementById('dietary').value
    };

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        this.style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
    } catch (err) {
        submitBtn.textContent = 'Submit RSVP';
        submitBtn.disabled = false;
        alert('Something went wrong. Please try again.');
    }
});

// Navbar background change on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(52, 73, 94, 0.15)';
    } else {
        nav.style.boxShadow = '0 2px 10px rgba(52, 73, 94, 0.1)';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.detail-card, .travel-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Guest number toggle based on attendance
document.getElementById('attendance').addEventListener('change', function () {
    const guestsSelect = document.getElementById('guests');
    if (this.value === 'no') {
        guestsSelect.disabled = true;
        guestsSelect.innerHTML = '<option value="0">0</option>';
    } else {
        guestsSelect.disabled = false;
        // Options were populated on lookup; restore the saved max from the last lookup
        const savedMax = parseInt(guestsSelect.dataset.max || '1');
        if (guestsSelect.options.length <= 1) {
            guestsSelect.innerHTML = '';
            for (let n = 1; n <= savedMax; n++) {
                const opt = document.createElement('option');
                opt.value = n;
                opt.textContent = n;
                guestsSelect.appendChild(opt);
            }
        }
        guestsSelect.value = guestsSelect.options[guestsSelect.options.length - 1].value;
    }
});

// Shimmer effect on scroll
let lastSparkleTime = 0;
const sparkleThrottle = 200; // milliseconds between sparkles

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.animation = 'shimmer 1s ease-out forwards';

    document.body.appendChild(sparkle);

    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

window.addEventListener('scroll', () => {
    const now = Date.now();

    if (now - lastSparkleTime > sparkleThrottle) {
        lastSparkleTime = now;

        // Create 1-3 random sparkles
        const numSparkles = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numSparkles; i++) {
            // Random position on viewport
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            setTimeout(() => {
                createSparkle(x, y);
            }, i * 100);
        }
    }
});

