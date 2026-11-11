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

// 5. Quiz finale
const QUIZ = [
  ["Tra quali secoli si sviluppano Umanesimo e Rinascimento?", ["Dalla fine del Trecento alla fine del Cinquecento","Dal Mille al Milleduecento","Dal Cinquecento al Settecento"], "Si sviluppano in Italia tra la fine del Trecento e la fine del Cinquecento."],
  ["Che cos’è il mecenatismo?", ["Il finanziamento delle arti","Un tipo di governo comunale","Uno stile di poesia"], "I signori finanziavano artisti e letterati per prestigio politico."],
  ["Quale evento dà inizio alle guerre d’Italia?", ["La discesa di Carlo VIII nel 1494","La morte di Dante","La caduta di Costantinopoli"], "Dopo la morte di Lorenzo il Magnifico (1492), Carlo VIII scende in Italia nel 1494."],
  ["Chi istituisce il Certame Coronario nel 1441?", ["Leon Battista Alberti","Francesco Petrarca","Angelo Poliziano"], "Era una gara poetica in volgare per dare dignità letteraria alla lingua del popolo."],
  ["Quale genere domina nel Quattrocento?", ["La trattatistica","Il romanzo","Il poema epico latino"], "Il trattato è la via per spiegare i nuovi valori e la nuova visione del mondo."],
  ["Di quale opera è autore Luigi Pulci?", ["Morgante","Orlando furioso","Il Principe"], "Il Morgante fu cominciato nel 1461 e pubblicato nel 1483 come Morgante maggiore."],
  ["Quale ciclo narra di Re Artù e dell’amore cortese?", ["Il ciclo bretone","Il ciclo carolingio","Il ciclo classico"], "Il ciclo bretone: Re Artù, Tavola Rotonda, amore cortese, avventura e magia."],
  ["Per chi compose Poliziano le Stanze?", ["Per la giostra di Giuliano de’ Medici","Per il Duca di Milano","Per papa Leone X"], "Poliziano lavorava per la corte medicea."],
  ["Quale incarico ebbe Machiavelli dal 1498 al 1512?", ["Segretario della Repubblica fiorentina","Duca di Urbino","Papa"], "Fu poi cacciato e allontanato dalla vita politica con il ritorno dei Medici."],
  ["Su che cosa si concentra soprattutto Guicciardini?", ["Sull’aspetto tecnico e costituzionale dello Stato","Sulla lingua volgare","Sulla scultura"], "A differenza di Machiavelli, studia le istituzioni e la struttura del buon governo."]
];
const box = document.getElementById('quiz-box');
let qi = 0, score = 0;
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

function showQuestion() {
  const [q, opts, why] = QUIZ[qi];
  box.innerHTML = `<div class="q-meta"><span>Domanda ${qi + 1} di ${QUIZ.length}</span><span>Punti: ${score}</span></div>
    <div class="q-bar"><i style="width:${(qi / QUIZ.length) * 100}%"></i></div><h3></h3><div class="q-opts"></div><p class="q-fb"></p>`;
  box.querySelector('h3').textContent = q;
  const wrap = box.querySelector('.q-opts'), fb = box.querySelector('.q-fb');
  shuffle(opts).forEach(text => {
    const b = document.createElement('button');
    b.className = 'q-opt'; b.textContent = text;
    b.addEventListener('click', () => {
      const right = text === opts[0];
      if (right) score++;
      wrap.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.textContent === opts[0]) x.classList.add('ok'); });
      if (!right) b.classList.add('no');
      fb.textContent = (right ? 'Corretto! ' : 'Non proprio. ') + why;
      const next = document.createElement('button');
      next.className = 'q-btn'; next.textContent = qi + 1 < QUIZ.length ? 'Avanti' : 'Vedi il risultato';
      next.addEventListener('click', () => { qi++; qi < QUIZ.length ? showQuestion() : showResult(); });
      fb.after(next); next.focus();
    });
    wrap.appendChild(b);
  });
}
function showResult() {
  const msg = score >= 9 ? 'Ottimo! Conosci bene il Rinascimento.' : score >= 6 ? 'Buon lavoro! Ripassa qualche sezione.' : 'Rileggi le sezioni e riprova.';
  box.innerHTML = `<h3>Risultato</h3><div class="q-score">${score}/${QUIZ.length}</div><p>${msg}</p><button class="q-btn">Ricomincia</button>`;
  box.querySelector('.q-btn').addEventListener('click', () => { qi = 0; score = 0; showQuestion(); });
}
showQuestion();
