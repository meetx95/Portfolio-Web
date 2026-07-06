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
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(link =>
    link.addEventListener('click', closeMenu)
  );

  window.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      e.target !== hamburger
    ) {
      closeMenu();
    }
  });

  const sections = ['Projects', 'Works', 'about', 'Contact'];
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActiveLink() {
    let current = '';

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 100) {
          current = id;
        }
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href')?.substring(1);
      if (href === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  setTimeout(() => {
    reveals.forEach(r => {
      if (r.getBoundingClientRect().top < window.innerHeight - 100) {
        r.classList.add('visible');
      }
    });
  }, 100);

  const backBtn = document.getElementById('backToTop');

  function updateBackBtn() {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', updateBackBtn);

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const marquee = document.querySelector('.marquee-track');

  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });

    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }
})();
