// Main JS - Interactions

document.addEventListener('DOMContentLoaded', () => {

    // Counter Animation
    const stats = document.querySelectorAll('.stat-item__number');

    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseFloat(target.getAttribute('data-target'));
                const suffix = target.innerText.replace(/[0-9.]/g, ''); // keep +, %

                let startTimestamp = null;
                const duration = 2000;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

                    if (Number.isInteger(targetValue)) {
                        target.innerText = Math.floor(progress * targetValue) + suffix;
                    } else {
                        target.innerText = (progress * targetValue).toFixed(1) + suffix;
                    }

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };

                window.requestAnimationFrame(step);
                observer.unobserve(target);
            }
        });
    };

    const obsOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(animateStats, obsOptions);
    stats.forEach(stat => observer.observe(stat));

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);

            nav.classList.toggle('nav--open');

            // Toggle icon (menu vs x)
            const icon = mobileToggle.querySelector('i');
            /* Note: In a real implementation with Lucide, we might want to smarter icon switching, 
               but here we rely on CSS or simple toggle. We'll simply toggle class.
            */
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
            });
        });
    }

    // Form Submission
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            // Loading state
            btn.innerText = 'Odesílám...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerText = 'Odesláno ✓';
                btn.style.backgroundColor = '#00D084';
                btn.style.borderColor = '#00D084';

                alert('Děkujeme za vaši poptávku. Ozveme se vám co nejdříve.');

                form.reset();

                // Reset button after 3s
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }, 1000);
        });
    }

    // Dark Mode Toggle (Simple implementation)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            // In a full implementation, we would save to localStorage
        });
    }
});
