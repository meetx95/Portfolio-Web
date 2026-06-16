(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', window.scrollY > 10)
  );

  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('open');
  }

  hamburger?.addEventListener('click', (e) => {
    e.stopPropagation(); mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== hamburger) closeMenu();
  });

  const otherBtn = document.getElementById('otherSiteBtn');
  const mobileOther = document.getElementById('mobileOtherBtn');
  const openOther = (e) => {
    e.preventDefault(); window.open('https://github.com/meetx95', '_blank');
  };
  otherBtn?.addEventListener('click', openOther);
  mobileOther?.addEventListener('click', openOther);

  const sections = ['Projects', 'Works', 'about', 'Contact'];
  const navLinks = document.querySelectorAll('.nav-links a');
  function setActiveLink() {
    let current = '';
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 100) current = id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href')?.substring(1);
      if (href === current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
  setTimeout(() => reveals.forEach(r => {
    if (r.getBoundingClientRect().top < window.innerHeight - 100) r.classList.add('visible');
  }), 100);

  const backBtn = document.getElementById('backToTop');
  function updateBackBtn() { backBtn.classList.toggle('visible', window.scrollY > 400); }
  window.addEventListener('scroll', updateBackBtn);
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () =>
      marquee.style.animationPlayState = 'paused'
    );
    marquee.addEventListener('mouseleave', () =>
      marquee.style.animationPlayState = 'running'
    );
  }
})();

// ── Avatar color palette — pick a gradient based on name's first char ──
function avatarGradient(name) {
  const palettes = [
    'linear-gradient(135deg,#0071e3,#34aadc)',   // blue
    'linear-gradient(135deg,#5e5ce6,#9b59b6)',   // purple
    'linear-gradient(135deg,#30d158,#0071e3)',   // green-blue
    'linear-gradient(135deg,#ff9f0a,#ff3b30)',   // orange-red
    'linear-gradient(135deg,#ff2d55,#ff6b81)',   // pink
    'linear-gradient(135deg,#32ade6,#30d158)',   // teal
    'linear-gradient(135deg,#636366,#1d1d1f)',   // dark
  ];
  // charCodeAt(0) gives a number; modulo maps it to one of the palettes
  const index = name.charCodeAt(0) % palettes.length;
  return palettes[index];
}

// ── Live character counter on the textarea ──
function updateCounter(textarea) {
  const counter = document.getElementById('charCounter');
  const len = textarea.value.length;
  const max = textarea.maxLength;         // 300
  counter.textContent = `${len} / ${max}`;

  // colour shifts: normal → warn at 80% → red at limit
  counter.className = 'char-counter';
  if (len >= max) counter.classList.add('limit');
  else if (len >= max * 0.8) counter.classList.add('warn');
}

// ── Like / unlike toggle on a card ──
function toggleLike(btn) {
  const isLiked = btn.classList.toggle('liked');   // flip the class
  const heart = btn.querySelector('.heart');
  const count = btn.querySelector('.like-count');

  // update the visible count ±1
  count.textContent = parseInt(count.textContent) + (isLiked ? 1 : -1);

  // swap the heart glyph (filled ♥ vs outline ♡)
  heart.textContent = isLiked ? '♥' : '♡';

  // tiny pop animation by toggling a scale override inline
  heart.style.transform = 'scale(1.5)';
  setTimeout(() => { heart.style.transform = ''; }, 200);
}

// ── Star-filter bar ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // mark this button active, remove from siblings
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;   // "all" | "5" | "4" | "3"
      const cards = document.querySelectorAll('#reviewsContainer .review-card');

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.rating === filter;
        // fade + hide non-matching cards
        card.style.transition = 'opacity 0.25s, transform 0.25s';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.97)';
          // hide after fade so it collapses in the grid
          setTimeout(() => { if (!match) card.style.display = 'none'; }, 250);
        }
      });
    });
  });
});

// ── Add a new review card ──
function addReview() {
  const name = document.getElementById('username').value.trim();
  const role = document.getElementById('userRole').value.trim() || 'Client';
  const text = document.getElementById('reviewText').value.trim();

  const starInput = document.querySelector('input[name="star"]:checked');
  const rating = starInput ? parseInt(starInput.value) : 5;

  // Validation — highlight empty fields in red
  if (!name || !text) {
    ['username', 'reviewText'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.style.borderColor = '#ff3b30';
        el.style.boxShadow = '0 0 0 3px rgba(255,59,48,0.15)';
        setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1800);
      }
    });
    return;
  }

  // Build initials: "John Doe" → "JD"
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Filled + empty star string: rating=4 → "★★★★☆"
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  // Pick avatar colour from the palette using the name
  const gradient = avatarGradient(name);

  // Build the card element
  const card = document.createElement('div');
  card.className = 'review-card';
  card.dataset.rating = String(rating);   // used by the filter
  card.innerHTML = `
    <div class="review-stars">${stars}</div>
    <p>${text}</p>
    <div class="review-author">
      <div class="review-avatar" style="background:${gradient}">${initials}</div>
      <div class="review-author-info">
        <strong>${name}</strong>
        <span>${role}</span>
      </div>
    </div>
    <div class="review-footer">
      <button class="like-btn" onclick="toggleLike(this)">
        <span class="heart">♡</span><span class="like-count">0</span>
      </button>
      <span class="review-date">Just now</span>
    </div>
  `;

  // Start invisible + shifted down, then animate in
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  document.getElementById('reviewsContainer').prepend(card);

  // Double rAF: gives browser one frame to register initial state before animating
  requestAnimationFrame(() => requestAnimationFrame(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }));

  // Reset form
  document.getElementById('username').value = '';
  document.getElementById('userRole').value = '';
  document.getElementById('reviewText').value = '';
  if (starInput) starInput.checked = false;
  updateCounter(document.getElementById('reviewText'));   // reset counter to 0/300

  // Reset filter to "All" so the new card is always visible
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
  document.querySelectorAll('#reviewsContainer .review-card').forEach(c => {
    c.style.display = ''; c.style.opacity = '1'; c.style.transform = '';
  });

  // Show toast
  const toast = document.getElementById('reviewToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}