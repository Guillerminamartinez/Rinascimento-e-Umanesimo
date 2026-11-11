// 1. Biografie: clic sul ritratto -> apre/chiude
document.querySelectorAll('.portrait').forEach(btn => {
  const bio = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    bio.classList.toggle('open', !open);
  });
  // Se la foto manca, mostra le iniziali
  const img = btn.querySelector('img');
  const fallback = () => btn.classList.add('noimg');
  img.addEventListener('error', fallback);
  if (img.complete && img.naturalWidth === 0) fallback();
});

// 2. Schede Umanesimo / Rinascimento
const tabs = document.querySelectorAll('.tabs [role="tab"]');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}));

// 3. Le tre teorie sulla lingua (fisarmonica)
document.querySelectorAll('.theory').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  btn.nextElementSibling.hidden = open;
}));

// 4. Voce di menu attiva durante lo scroll
const links = document.querySelectorAll('.nav a');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
links.forEach(a => { const s = document.querySelector(a.hash); if (s) obs.observe(s); });
