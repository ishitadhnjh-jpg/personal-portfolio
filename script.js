document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       THEME MANAGEMENT
       ========================================== */
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check saved theme or preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersLight) {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });

    /* ==========================================
       SCROLL & STICKY HEADER & BACK-TO-TOP
       ========================================== */
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Sticky Header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll Progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = `${scrollPercent}%`;
        
        // Back-to-top button visibility
        if (scrollY > 600) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    });

    // Scroll to top action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initial check for sticky header on reload
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    /* ==========================================
       MOBILE NAVIGATION MENU
       ========================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    mobileToggle.addEventListener('click', () => {
        body.classList.toggle('mobile-active');
        navMenu.classList.toggle('active');
    });
    
    // Auto close menu when links are clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('mobile-active');
            navMenu.classList.remove('active');
        });
    });

    /* ==========================================
       INTERSECTION OBSERVER - SCROLL REVEALS
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================
       INTERSECTION OBSERVER - SKILLS LOAD
       ========================================== */
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute('data-percent');
                bar.style.width = `${percent}%`;
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        skillsObserver.observe(bar);
    });

    /* ==========================================
       PROJECTS FILTERING SYSTEM
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from buttons, add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card displays cleanly
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger reflow to animate opacity
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Match transit delay
                }
            });
        });
    });

    /* ==========================================
       DYNAMIC ACTIVE NAVIGATION LINK HIGHLIGHTING
       ========================================== */
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for header trigger
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================== */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    // Inputs & Error elements
    const inputs = [
        { id: 'firstName', errorId: 'firstNameError' },
        { id: 'lastName', errorId: 'lastNameError' },
        { id: 'email', errorId: 'emailError', check: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
        { id: 'subject', errorId: 'subjectError' },
        { id: 'message', errorId: 'messageError' }
    ];
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        inputs.forEach(inputObj => {
            const inputElement = document.getElementById(inputObj.id);
            const errorElement = document.getElementById(inputObj.errorId);
            const val = inputElement.value.trim();
            
            let isValid = val.length > 0;
            
            // Check customized validations (like email regex)
            if (isValid && inputObj.check) {
                isValid = inputObj.check(val);
            }
            
            if (!isValid) {
                inputElement.style.borderColor = 'hsl(var(--accent-secondary-val))';
                errorElement.style.display = 'block';
                isFormValid = false;
            } else {
                inputElement.style.borderColor = 'hsl(var(--border-color-val))';
                errorElement.style.display = 'none';
            }
        });
        
        if (isFormValid) {
            // Disable submit button during animation
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Sending... <span class="logo-dot" style="margin-left:5px; animation: pulse 1s infinite;"></span>`;
            
            // Simulate Form Submission
            setTimeout(() => {
                // Success message
                formStatus.className = 'form-status success';
                formStatus.innerText = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
                
                // Reset form fields
                contactForm.reset();
                
                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 5000);
                
            }, 1500);
        } else {
            formStatus.className = 'form-status error';
            formStatus.innerText = 'Please fix the highlighted errors before submitting.';
            formStatus.style.display = 'block';
        }
    });
    
    // Live input formatting reset on typing
    inputs.forEach(inputObj => {
        const inputElement = document.getElementById(inputObj.id);
        const errorElement = document.getElementById(inputObj.errorId);
        
        inputElement.addEventListener('input', () => {
            inputElement.style.borderColor = 'var(--accent-primary)';
            errorElement.style.display = 'none';
            formStatus.style.display = 'none';
        });
        
        inputElement.addEventListener('blur', () => {
            inputElement.style.borderColor = 'hsl(var(--border-color-val))';
        });
    });

    /* ==========================================
       RESUME/CV DOWNLOAD MOCK ACTION
       ========================================== */
    const downloadBtn = document.getElementById('downloadCV');
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Resume/CV download triggered. In a live production context, this link will reference a PDF document.');
    });

    /* ==========================================
       LIGHTBOX / MODAL PHOTO VIEWER
       ========================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    
    // Find all clickable photo containers
    const clickablePhotos = document.querySelectorAll('.collage-frame, .achievement-card, .timeline-photo-wrapper');
    
    clickablePhotos.forEach(photo => {
        photo.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const imgSrc = target.getAttribute('data-image');
            const captionText = target.getAttribute('data-caption');
            
            if (imgSrc) {
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = captionText || '';
                lightboxModal.classList.add('active');
                lightboxModal.setAttribute('aria-hidden', 'false');
                body.style.overflow = 'hidden'; // Lock background scroll
            }
        });
    });
    
    // Close Lightbox function
    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Restore background scroll
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking overlay background
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
    
    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
});

