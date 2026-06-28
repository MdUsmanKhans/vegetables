// ── SabziMandi shared JS ──────────────────

// Cart state
let cart = JSON.parse(localStorage.getItem('sabzi_cart') || '[]');

function saveCart() {
  localStorage.setItem('sabzi_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(name, price, img) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, img, qty: 1 });
  }
  saveCart();
  showToast(`${name} added to cart 🛒`);
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.innerHTML = '<i class="fa-solid fa-check-circle"></i><span></span>';
    document.body.appendChild(t);
  }
  t.querySelector('span').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Scroll-triggered reveal ──────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── Sticky nav ───────────────────────────
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  // highlight active page
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path || a.getAttribute('href') === '../' + path) {
      a.classList.add('active');
    }
  });
}

// ── Number count-up ──────────────────────
function countUp(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString();
    if (start >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target, +e.target.dataset.count);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ── Stagger children ─────────────────────
function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = (i * 0.1) + 's';
    });
  });
}

// ── Hero parallax ────────────────────────
function initParallax() {
  const hero = document.querySelector('.hero-parallax');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    hero.style.transform = `translateY(${window.scrollY * 0.4}px)`;
  }, { passive: true });
}

// ── Star rating ──────────────────────────
function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    const cls = i < Math.floor(rating) ? 'fa-solid' : i < rating ? 'fa-regular fa-star-half-stroke' : 'fa-regular';
    return `<i class="${cls} fa-star"></i>`;
  }).join('');
}

// ── Init ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initCounters();
  initStagger();
  initParallax();
  updateCartBadge();
});