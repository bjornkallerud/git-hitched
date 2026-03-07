// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('October 24, 2026 16:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    // If countdown is finished
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = `
            <div class="countdown-item">
                <span class="countdown-number">🎉</span>
                <span class="countdown-label">Today's the Day!</span>
            </div>
        `;
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

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

// Form submission
document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        attendance: document.getElementById('attendance').value,
        guests: document.getElementById('guests').value,
        dietary: document.getElementById('dietary').value,
        message: document.getElementById('message').value
    };

    // Log form data (in production, you'd send this to a server)
    console.log('RSVP Submitted:', formData);

    // Hide form and show success message
    this.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');

    // Optional: Reset form
    // this.reset();

    // Optional: Send data to a server
    // fetch('/api/rsvp', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // });
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
    const guestsInput = document.getElementById('guests');
    if (this.value === 'no') {
        guestsInput.disabled = true;
        guestsInput.value = '0';
    } else {
        guestsInput.disabled = false;
        guestsInput.value = '1';
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

