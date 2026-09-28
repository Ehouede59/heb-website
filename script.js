// ==================== NAVIGATION SCROLL EFFECT ====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ANIMATION ON SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.problem-card, .stat-card, .service-card, .why-card, .cycle-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== COUNTER ANIMATION ====================
const animateCounter = (element, target, duration = 2000) => {
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const isMinus = target.includes('-');

    let numericTarget = parseFloat(target.replace(',', '.').replace(/[^0-9.]/g, ''));
    let start = 0;
    const increment = numericTarget / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < numericTarget) {
            let displayValue = Math.ceil(start);
            if (target.includes(',')) {
                displayValue = start.toFixed(1).replace('.', ',');
            }
            let prefix = '';
            if (isPlus) prefix = '+';
            if (isMinus) prefix = '-';
            let suffix = isPercentage ? '%' : '';
            element.textContent = prefix + displayValue + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number, .stat-number-big, .roi-number');
            statNumbers.forEach(stat => {
                if (!stat.dataset.animated) {
                    animateCounter(stat, stat.textContent);
                    stat.dataset.animated = 'true';
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats, .stats-grid, .roi-grid').forEach(section => {
    statsObserver.observe(section);
});

// ==================== FORM HANDLING ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                contactForm.reset();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                submitBtn.style.background = 'var(--secondary)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);

                alert("✅ Merci ! Votre demande d'audit Biomédical a bien été envoyée. Nous vous contacterons .");
            } else {
                throw new Error("Erreur lors de l'envoi");
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('❌ Une erreur est survenue. Veuillez nous contacter directement par téléphone ou email.');
        }
    });
}

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🏥 HEB - Hospital of Equipment Biomedical', 'color: #1E40AF; font-size: 20px; font-weight: bold;');
//console.log('%cDéveloppé avec ❤️ au Bénin par HONVOU Benoit', 'color: #059669; font-size: 12px;');
