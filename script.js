/**
 * Weddings By Shruti - Client Script
 * Author: Antigravity (Award-winning UI/UX Designer & Senior Frontend Dev)
 * Handles all premium interactions, carousel, custom cursor, scroll effects, filters and load states.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMobileNav();
  initHeroCarousel();
  initTypingEffect();
  initScrollEffects();
  initStatsCounter();
  initGalleryFilter();
  initLightbox();
  initTestimonialsCarousel();
  initCustomCursor();
  initActiveMenuLink();
});

/**
 * 1. Preloader Screen
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 600); // Give it a elegant brief pause
    });
    
    // Safety fallback if load event already fired or is slow
    setTimeout(() => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
      }
    }, 3000);
  }
}

/**
 * 2. Mobile Navigation Drawer
 */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-menu');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('#mobile-drawer a');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileDrawer.classList.toggle('active');
      
      // Toggle scroll on body
      if (mobileDrawer.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * 3. Hero Section Slideshow
 */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000); // Transition every 5 seconds
  }
}

/**
 * 4. Typing Subtitle Effect in Hero
 */
function initTypingEffect() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const words = ['Destination Wedding Planning', 'Luxury Decor Styling', 'Corporate Events Management'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Erasing characters
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Erase faster
    } else {
      // Typing characters
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Standard typing speed
    }

    // Word completely typed
    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } 
    // Word completely erased
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before starting next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start the typing loop
  setTimeout(type, 1000);
}

/**
 * 5. Scroll Page Effects (Fixed Header styles & Back-to-Top trigger)
 */
function initScrollEffects() {
  const header = document.getElementById('main-header');
  const sentinel = document.getElementById('top-sentinel');

  // Fallback Scroll Listener for older browsers
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header styling shift
    if (header) {
      if (scrollY > 50) {
        header.classList.add('header-scrolled');
        
        // Dynamic color palette shift on scroll based on section contrasts
        if (scrollY > window.innerHeight - 80) {
          header.classList.add('header-scrolled-light');
        } else {
          header.classList.remove('header-scrolled-light');
        }
      } else {
        header.classList.remove('header-scrolled', 'header-scrolled-light');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run immediately on load

  // Scroll Reveal elements using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we don't need to observe it again
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12, // Trigger when 12% of element is in viewport
      rootMargin: '0px 0px -50px 0px' // Slightly offset bottom viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: immediately show elements if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/**
 * 6. Numeric Counter Animation (Stats Section)
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000; // Animation duration in ms
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (Cubic Ease Out)
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      const current = Math.floor(easeOut * target);
      
      el.textContent = current + '+';

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + '+';
      }
    };

    window.requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  } else {
    // Fallback
    statNumbers.forEach(num => {
      num.textContent = num.getAttribute('data-count') + '+';
    });
  }
}

/**
 * 7. Featured Gallery category filters
 */
function initGalleryFilter() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (filters.length === 0 || items.length === 0) return;

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Toggle active filter styling
      filters.forEach(btn => btn.classList.remove('active'));
      filter.classList.add('active');

      const filterValue = filter.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hidden');
          // Small delays for clean animation layout reflows
          setTimeout(() => {
            item.style.display = 'block';
          }, 50);
        } else {
          item.classList.add('hidden');
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });
}

/**
 * 8. Lightbox for Gallery Imagery
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!lightbox || galleryItems.length === 0) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-image');
      const title = item.querySelector('.gallery-title');
      
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        if (lightboxCaption && title) {
          lightboxCaption.textContent = title.textContent;
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * 9. Custom Client Testimonials Carousel
 */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('carousel-dots-container');

  if (!track || slides.length === 0 || !dotsContainer) return;

  let currentIndex = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let animationID = 0;

  // Create DOTS dynamically based on slide counts
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
    if (idx === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => {
      goToSlide(idx);
    });
    
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  function updateDots() {
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    const translateAmount = -currentIndex * 100;
    track.style.transform = `translateX(${translateAmount}%)`;
    updateDots();
  }

  // --- Auto-scroll carousel ---
  let autoPlayInterval = setInterval(nextSlide, 6000);

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  // Pause auto-scroll on hover/interaction
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    carousel.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 6000);
    });
    
    // Support Touch gestures (swipe left / right)
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('touchend', touchEnd);
    carousel.addEventListener('touchmove', touchMove);
  }

  function touchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(autoPlayInterval);
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    // If swiped significantly
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> next slide
        nextSlide();
      } else {
        // Swipe right -> prev slide
        let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
      }
      isDragging = false; // complete interaction
    }
  }

  function touchEnd() {
    isDragging = false;
  }
}

/**
 * 10. Custom Luxury Cursor
 */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  if (!dot || !outline) return;

  // Track cursor position
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth trail animation for outline
  const animateOutline = () => {
    // Easing calculations
    const ease = 0.15;
    outlineX += (mouseX - outlineX) * ease;
    outlineY += (mouseY - outlineY) * ease;

    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';

    requestAnimationFrame(animateOutline);
  };
  requestAnimationFrame(animateOutline);

  // Scaling effect on hoverable elements
  const hoverElements = document.querySelectorAll('a, button, .gallery-item, .filter-btn, input, textarea, select');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      outline.classList.add('custom-cursor-hover');
      dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });

    el.addEventListener('mouseleave', () => {
      outline.classList.remove('custom-cursor-hover');
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

/**
 * 11. Navigation links active state update on scroll
 */
function initActiveMenuLink() {
  const sections = document.querySelectorAll('section, footer');
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-links a');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}
