/* Safe Harbor Maritime — shared.js */

// ---- NAV scroll state ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav && (window.scrollY > 20 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'));
}, { passive: true });

// reset body scroll state on page load
document.body.style.top = '';
document.body.classList.remove('menu-open');

// ---- Mobile hamburger ----
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

let scrollY = 0;

function closeMobileMenu(targetHref) {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.querySelectorAll('details').forEach(d => d.removeAttribute('open'));

  // Remove the body lock and restore scroll position
  document.body.classList.remove('menu-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);

  // If the link has a hash target on the same page, manually scroll to it
  // after the body lock is released (next frame)
  if (targetHref) {
    const hash = targetHref.includes('#') ? '#' + targetHref.split('#')[1] : null;
    const isSamePage = !targetHref.includes('.html') ||
        targetHref.split('#')[0] === (window.location.pathname.split('/').pop() || 'index.html');

    if (hash && isSamePage) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const target = document.querySelector(hash);
          if (target) {
            const offset = 80; // nav height
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    }
  }
}

hamburger && hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  }
});

mobileMenu && mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    // Check if this is a same-page anchor (e.g. index.html#section or just #section)
    const hash = href && href.includes('#') ? '#' + href.split('#')[1] : null;
    const linkPage = href && href.includes('.html') ? href.split('#')[0] : null;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isSamePage = !linkPage || linkPage === currentPage;

    if (hash && isSamePage) {
      // Prevent default anchor jump — we'll handle scrolling manually after unlock
      e.preventDefault();
      closeMobileMenu(href);
    } else {
      // Cross-page navigation: just close the menu, let browser navigate
      closeMobileMenu();
    }
  });
});

// ---- Fade-in on scroll ----
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

// ---- Active nav link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__dropdown a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ---- Slideshow ----
const slideshow = document.querySelector('.slideshow');
if (slideshow) {
  const slides = slideshow.querySelectorAll('.slide');
  const dots = slideshow.querySelectorAll('.slideshow__dot');
  let current = 0;

  function showSlide(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  slideshow.querySelector('.slideshow__prev') && slideshow.querySelector('.slideshow__prev').addEventListener('click', () => showSlide(current - 1));
  slideshow.querySelector('.slideshow__next') && slideshow.querySelector('.slideshow__next').addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
}

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const end = parseInt(el.dataset.end, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * end).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
if (!isIOS) {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }
}

// ---- News category filter ----
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card[data-category]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    newsCards.forEach(card => {
      card.parentElement.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
    });
  });
});
// ---- YouTube iframe flash fix ----
const videoIframe = document.querySelector('.hero__bg-video iframe');
if (videoIframe) {
  setTimeout(() => {
    videoIframe.classList.add('ready');
  }, 1500);
}