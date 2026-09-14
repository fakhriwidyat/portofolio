// ===== Satu loop scroll (requestAnimationFrame) yang menggerakkan semua efek scroll =====
const links = document.querySelectorAll('.navlinks a');
const sections = document.querySelectorAll('section[id]');
const timelineEl = document.getElementById('timeline');
const timelineFill = document.getElementById('timelineFill');

let ticking = false;

function onScrollFrame(){
  // Nav link aktif sesuai section yang sedang dilihat
  let current = sections[0].id;
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  // Garis timeline mengisi mengikuti posisi scroll secara langsung (tanpa delay/patah)
  const rect = timelineEl.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = rect.height + vh * 0.5;
  const scrolled = Math.min(Math.max(vh * 0.7 - rect.top, 0), total);
  const pct = Math.min(100, (scrolled / total) * 100);
  timelineFill.style.height = pct + '%';

  ticking = false;
}

function requestTick(){
  if (!ticking){
    requestAnimationFrame(onScrollFrame);
    ticking = true;
  }
}

window.addEventListener('scroll', requestTick, { passive: true });
window.addEventListener('resize', requestTick);
onScrollFrame();

// Reveal-on-scroll: section blur/fade/geser masuk secara halus saat terlihat di layar
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => io.observe(el));
