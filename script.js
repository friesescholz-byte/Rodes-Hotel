/**
 * Rodes Hotel - Interactive Features & Animations
 * Scholz & Friese UI/UX Pro Max Standard
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- STICKY HEADER ---
  const header = document.querySelector('.main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled

  // --- MOBILE NAV MENU ---
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  const closeMobileMenu = () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- NAVIGATION HIGHLIGHTING (ScrollSpy) ---
  const sections = document.querySelectorAll('section, header');
  const scrollSpy = () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // offset for header

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (href === '#' && currentSectionId === 'hero')) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', scrollSpy);
  scrollSpy();

  // --- BOOKING REQUEST FORM MOCK ---
  const bookingForm = document.getElementById('bookingForm');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const showSuccessModal = () => {
    if (successModal) {
      successModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  };

  const closeSuccessModal = () => {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  };

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic field validation
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const type = document.getElementById('formType').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !phone || !message) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus (Name, E-Mail, Telefon, Nachricht).');
        return;
      }

      // Turnstile Token abfragen
      const turnstileToken = typeof turnstile !== 'undefined' ? turnstile.getResponse() : null;
      if (!turnstileToken) {
        alert('Bitte bestätigen Sie den Spam-Schutz (Cloudflare Turnstile).');
        return;
      }

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';

      try {
        const response = await fetch('https://friesescholzwebdesign.pages.dev/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            turnstileToken,
            source: 'Rodes-Hotel',
            name,
            email,
            phone,
            type,
            message
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showSuccessModal();
          bookingForm.reset();
          if (typeof turnstile !== 'undefined') {
            turnstile.reset();
          }
        } else {
          alert('Fehler: ' + (result.message || 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.'));
        }
      } catch (err) {
        console.error('Network error:', err);
        alert('Ein Netzwerkfehler ist aufgetreten. Bitte prüfen Sie Ihre Verbindung.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSuccessModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeSuccessModal);
  }

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSuccessModal();
    }
  });

  // --- HERO AUTO SLIDER ---
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds

  const nextSlide = () => {
    if (slides.length === 0) return;

    // Remove active class from current slide & indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // Calculate next slide index
    currentSlide = (currentSlide + 1) % slides.length;

    // Add active class to new slide & indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  };

  // Start auto play
  let autoPlayTimer = setInterval(nextSlide, slideInterval);

  // Indicator click controls
  indicators.forEach((ind, index) => {
    ind.addEventListener('click', () => {
      // Clear interval
      clearInterval(autoPlayTimer);

      // Remove active classes
      slides[currentSlide].classList.remove('active');
      indicators[currentSlide].classList.remove('active');

      // Set new slide
      currentSlide = index;

      // Add active classes
      slides[currentSlide].classList.add('active');
      indicators[currentSlide].classList.add('active');

      // Restart auto play
      autoPlayTimer = setInterval(nextSlide, slideInterval);
    });
  });

  // --- AOS ANIMATIONS INIT ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-quad',
      once: true,
      offset: 100
    });
  }
});
