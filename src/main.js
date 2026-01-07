import './styles/style.css';
import './styles/sections.css';

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

    // Car Data
    const carsData = {
        'bmw-x5': {
            title: 'BMW X5 xDrive30d M-Packet',
            price: '1 850 000 Kč',
            image: 'assets/car-bmw.png',
            desc: 'Luxusní SUV v perfektním stavu s plnou servisní historií. M-Packet výbava, vzduchový podvozek, laserová světla, panorama, kožený interiér Merino.',
            videoId: 'J-5JOnbmS-w',
            specs: {
                'Rok výroby': '2024',
                'Najeto': '15 000 km',
                'Motor': '3.0 Diesel',
                'Výkon': '210 kW',
                'Převodovka': 'Automatická',
                'Pohon': '4x4'
            }
        },
        'audi-a6': {
            title: 'Audi A6 Avant 50 TDI Quattro',
            price: '1 290 000 Kč',
            image: 'assets/car-audi.png',
            desc: 'Manažerské kombi s úsporným a silným motorem. S-Line exteriér, Matrix LED světla, Virtual Cockpit, nezávislé topení.',
            videoId: 'J-5JOnbmS-w',
            specs: {
                'Rok výroby': '2023',
                'Najeto': '42 000 km',
                'Motor': '3.0 Diesel',
                'Výkon': '210 kW',
                'Převodovka': 'Automatická',
                'Pohon': '4x4'
            }
        },
        'skoda-superb': {
            title: 'Škoda Superb L&K 2.0 TDI',
            price: '1 050 000 Kč',
            image: 'assets/car-skoda.png',
            desc: 'Vlajková loď v nejvyšší výbavě Laurin & Klement. Nový vůz, plná záruka. Ventilovaná sedadla, Canton audio, Columbus navigace.',
            videoId: 'J-5JOnbmS-w',
            specs: {
                'Rok výroby': '2024',
                'Najeto': '5 km',
                'Motor': '2.0 Diesel',
                'Výkon': '147 kW',
                'Převodovka': 'Automatická DSG',
                'Pohon': 'Přední'
            }
        }
    };

    // Modal Logic
    const modal = document.getElementById('carModal');
    const carCards = document.querySelectorAll('.car-card');
    const modalClose = document.querySelectorAll('[data-close="true"]');
    const modalVideoFrame = document.getElementById('modalVideoFrame');

    // Open Modal
    carCards.forEach(card => {
        // Find which car based on button data attribute for mapping
        // (In a real app, the card itself would have the ID)
        const btn = card.querySelector('.car-order-btn');
        const carIdMap = {
            'BMW X5 xDrive30d': 'bmw-x5',
            'Audi A6 Avant': 'audi-a6',
            'Škoda Superb L&K': 'skoda-superb'
        };
        const carKey = carIdMap[btn.getAttribute('data-car')];

        // Make the whole card clickable except the button (which scrolls)
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('car-order-btn')) return; // Let button do its scroll stuff

            const data = carsData[carKey];
            if (!data) return;

            // Populate Modal
            document.getElementById('modalTitle').innerText = data.title;
            document.getElementById('modalPrice').innerText = data.price;
            document.getElementById('modalImage').src = data.image;
            document.getElementById('modalDesc').innerText = data.desc;

            // Set Video
            if (modalVideoFrame && data.videoId) {
                modalVideoFrame.src = `https://www.youtube.com/embed/${data.videoId}`;
            }

            // Populate Specs
            const specsContainer = document.getElementById('modalSpecs');
            specsContainer.innerHTML = '';
            for (const [key, value] of Object.entries(data.specs)) {
                specsContainer.innerHTML += `
                    <div class="spec-item">
                        <span class="spec-label">${key}</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `;
            }

            // Update Modal Order Button
            const modalOrderBtn = modal.querySelector('.modal-order-btn');
            modalOrderBtn.onclick = () => {
                closeModal();
                btn.click(); // Trigger the scroll and prefill logic of the original button
            };

            // Show
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock scroll
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (modalVideoFrame) {
            modalVideoFrame.src = ''; // Stop video
        }
    };

    modalClose.forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    // Car Order Buttons (existing logic remains)
    const orderBtns = document.querySelectorAll('.car-order-btn');
    const messageInput = document.getElementById('message');

    orderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const carName = btn.getAttribute('data-car');
            const targetSection = document.querySelector('#kontakt');

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Prefill form after scroll (small delay)
                setTimeout(() => {
                    if (messageInput) {
                        messageInput.value = `Dobrý den, mám zájem o vůz: ${carName}. Prosím o více informací.`;
                        messageInput.focus();

                        // Highlight textarea
                        messageInput.style.borderColor = '#FF6B35';
                        setTimeout(() => {
                            messageInput.style.borderColor = '';
                        }, 2000);
                    }
                }, 500);
            }
        });
    });
});
