/* ==========================================================
   NOTRE FUTUR, À NOUS DEUX — script.js
   ----------------------------------------------------------
   Sommaire
   1. PERSONNALISATION  (à modifier facilement)
   2. CONTENU           (questions, choix, réactions)
   3. OUTILS            (petites fonctions utiles)
   4. ÉTAT + SAUVEGARDE (localStorage)
   5. NAVIGATION
   6. ÉCRANS            (choix, jeu, rêves, lettre, final)
   7. MUSIQUE D’AMBIANCE
   8. DÉMARRAGE
   ========================================================== */
'use strict';

/* ==========================================================
   1. PERSONNALISATION
   Change ici les prénoms, le message final, etc.
   ========================================================== */
const CONFIG = {
  partnerName: 'Iverson',          // lui
  authorName: 'Ranelle',           // toi
  siteTitle: 'Notre futur, à nous deux',

  // Message affiché par le bouton « J’ai un message pour toi 💌 »
  finalMessage:
    'Merci d’avoir pris le temps de faire ce petit voyage avec moi. J’espère qu’on aura plein de choses à cocher dans cette liste, et surtout plein de souvenirs à créer mon fils. ❤️',
  finalSignature: '— Ranelle ❤️',

  // Clé de sauvegarde dans le navigateur (change le « v1 » pour repartir de zéro chez tout le monde)
  storageKey: 'notre-futur-iverson-ranelle-v1'
};

/* ==========================================================
   2. CONTENU
   ========================================================== */

// Ordre des écrans (sert aussi à la barre de progression)
const SCREENS = [
  'welcome', 'histoire', 'futur-intro', 'home', 'travel', 'daily', 'projects',
  'game', 'bucket', 'letter', 'final'
];

// Écrans à choix multiples (générés automatiquement)
const CHOICE_SCREENS = [
  {
    id: 'histoire', key: 'histoire', kicker: 'Notre histoire 💕',
    title: 'Avant de parler de demain…',
    question: 'Quand tu penses à nous, qu’est-ce qui te rend le plus heureux ?',
    withText: true,
    items: [
      { id: 'h1', icon: '💞', title: 'Nos moments ensemble', desc: 'Ces instants où le reste du monde disparaît.', react: 'Ces moments-là, ce sont aussi mes préférés, tu sais.' },
      { id: 'h2', icon: '💬', title: 'Nos discussions qui durent des heures', desc: 'On commence par un sujet, on finit ailleurs.', react: 'Les heures passent beaucoup trop vite quand on parle tous les deux.' },
      { id: 'h3', icon: '😂', title: 'Nos délires et nos fous rires', desc: 'Les blagues que nous seuls comprenons.', react: 'Rien que d’y penser, je souris. On est vraiment doués pour les délires 😂' },
      { id: 'h4', icon: '🤝', title: 'Le fait de pouvoir compter l’un sur l’autre', desc: 'Une présence sur laquelle on peut s’appuyer.', react: 'Tu peux compter sur moi, Iverson. Toujours.' },
      { id: 'h5', icon: '🌅', title: 'Tout ce qu’il nous reste à découvrir ensemble', desc: 'Il y a encore tellement de pages à écrire.', react: 'Et c’est ça le plus excitant : tout ce qu’il reste à vivre.' },
      { id: 'h6', icon: '💭', title: 'Autre chose ❤️', desc: 'Dis-le-moi avec tes mots, juste en dessous.', react: 'Je suis curieuse de lire ça… écris-le juste en dessous.', focusText: true }
    ]
  },
  {
    id: 'home', key: 'home', kicker: 'Notre futur · 1/4', title: 'Notre futur chez-nous 🏡',
    question: 'Tu nous imagines comment, chez nous ?', visual: true,
    items: [
      { id: 'ho1', icon: '🛋️', g: ['#fbe3dd', '#f2b9bf'], title: 'Un appartement cosy rien qu’à nous.', desc: 'Petit, chaleureux, et vraiment à nous.', react: 'Un cocon rien qu’à nous… j’adore l’idée.' },
      { id: 'ho2', icon: '🏡', g: ['#fde9d9', '#f5c2b4'], title: 'Une petite maison avec un jardin.', desc: 'Des fleurs, un café au soleil le matin.', react: 'Un jardin, du soleil, et nous deux dedans. Oui, s’il te plaît.' },
      { id: 'ho3', icon: '🌇', g: ['#f6d6e0', '#e3a3b6'], title: 'Un logement moderne avec une grande terrasse.', desc: 'Des soirées dehors, un verre à la main.', react: 'Les soirées sur la terrasse, ça me parle beaucoup 🌇' },
      { id: 'ho4', icon: '🕯️', g: ['#f9dfd0', '#e8b1a2'], title: 'Un endroit chaleureux avec une décoration qui nous ressemble.', desc: 'Chaque objet avec sa petite histoire.', react: 'Un endroit qui nous ressemble, c’est exactement ça.' },
      { id: 'ho5', icon: '🫶', g: ['#f8d9de', '#eab4bf'], title: 'Peu importe où, tant qu’on s’y sent bien tous les deux.', desc: 'Le plus important, c’est d’être ensemble.', react: 'Peu importe où, tant qu’on est ensemble : on est d’accord.' }
    ]
  },
  {
    id: 'travel', key: 'travel', kicker: 'Notre futur · 2/4', title: 'Nos voyages 🌍',
    question: 'Si on pouvait partir demain, tu choisirais quoi ?', visual: true,
    items: [
      { id: 't1', icon: '🗼', g: ['#f7dbe3', '#e4a9bd'], title: 'Un week-end romantique dans une ville européenne.', desc: 'Rues pavées, café en terrasse, main dans la main.', react: 'Une ville, un café, et toi : le programme parfait.' },
      { id: 't2', icon: '🏖️', g: ['#fde8cf', '#f4c0a3'], title: 'Des vacances au soleil, à la plage.', desc: 'Sable chaud, mer turquoise, zéro stress.', react: 'Les pieds dans le sable, zéro stress : validé !' },
      { id: 't3', icon: '🚗', g: ['#f9dcd4', '#e9a99f'], title: 'Un road trip improvisé.', desc: 'Une playlist, une route, pas de plan.', react: 'Une playlist, une route, et on verra bien où elle nous mène 🚗' },
      { id: 't4', icon: '✈️', g: ['#f5dfe8', '#d9a9c2'], title: 'Un voyage dans un pays qu’on rêve de découvrir.', desc: 'Celui dont on parle depuis longtemps.', react: 'Un jour, on y sera. Et on aura plein d’histoires à raconter.' },
      { id: 't5', icon: '🏔️', g: ['#efe0e6', '#c9a6b8'], title: 'Un séjour dans un chalet à la montagne.', desc: 'Feu de cheminée, chocolat chaud, plaid.', react: 'Un chalet, un plaid et un chocolat chaud… je signe tout de suite.' },
      { id: 't6', icon: '🎁', g: ['#fbdede', '#f0b0b0'], title: 'Un petit week-end surprise organisé par l’un pour l’autre.', desc: 'Destination secrète, valise à faire les yeux fermés.', react: 'Oh, des surprises… ça pourrait bien arriver un jour 😉' }
    ]
  },
  {
    id: 'daily', key: 'daily', kicker: 'Notre futur · 3/4', title: 'Notre quotidien 🫶',
    question: 'Tu imagines comment notre petite routine à deux ?',
    items: [
      { id: 'd1', icon: '🍝', title: 'Cuisiner ensemble le soir.', desc: 'De la musique, un tablier et un peu de bazar.', react: 'Cuisiner ensemble… et goûter tout avant que ce soit prêt, évidemment.' },
      { id: 'd2', icon: '🍿', title: 'Regarder des films et des séries sous un plaid.', desc: 'Débat sur le choix du film inclus.', react: 'Plaid, snacks, et trente minutes pour choisir le film 😄' },
      { id: 'd3', icon: '🌙', title: 'Se raconter nos journées avant de dormir.', desc: 'Le meilleur moment pour tout se dire.', react: 'Ce moment-là, c’est probablement mon préféré de la journée.' },
      { id: 'd4', icon: '🧭', title: 'Sortir découvrir de nouveaux endroits.', desc: 'Un café, un parc, une rue qu’on ne connaît pas.', react: 'Il y a tellement d’endroits à explorer avec toi.' },
      { id: 'd5', icon: '🎮', title: 'Faire des activités et se lancer des défis.', desc: 'Jeux, sport… et mauvaise foi autorisée.', react: 'Des défis ? Attention, je suis très mauvaise perdante 😏' },
      { id: 'd6', icon: '☁️', title: 'Garder chacun nos moments personnels tout en partageant de beaux moments ensemble.', desc: 'Être deux, sans se perdre soi-même.', react: 'Je trouve ça essentiel : être ensemble sans s’oublier soi-même.' }
    ]
  },
  {
    id: 'projects', key: 'projects', kicker: 'Notre futur · 4/4', title: 'Nos projets 🎯',
    question: 'Quels projets aimerais-tu qu’on réalise ensemble ?',
    items: [
      { id: 'p1', icon: '💰', title: 'Économiser pour un projet commun.', desc: 'Petit à petit, pour quelque chose qui compte.', react: 'Un projet à nous, construit pas à pas : ça me plaît beaucoup.' },
      { id: 'p2', icon: '🌍', title: 'Voyager le plus possible.', desc: 'Voir le monde, à deux.', react: 'Le monde est grand, et j’ai envie de le voir avec toi.' },
      { id: 'p3', icon: '🕊️', title: 'Construire notre indépendance.', desc: 'Gagner en liberté, chacun et ensemble.', react: 'Construire notre liberté, ensemble : belle ambition.' },
      { id: 'p4', icon: '🎨', title: 'Découvrir de nouvelles passions ensemble.', desc: 'Essayer, rater, rire, recommencer.', react: 'Et si on tombait amoureux d’une passion commune ? Je dis oui.' },
      { id: 'p5', icon: '🧸', title: 'Créer notre petit cocon.', desc: 'Un endroit où l’on se sent vraiment bien.', react: 'Notre petit cocon… rien que le mot me fait sourire.' },
      { id: 'p6', icon: '⭐', title: 'Réaliser un rêve important pour l’un de nous.', desc: 'Le soutenir à fond, quoi qu’il arrive.', react: 'Je serai toujours là pour t’aider à réaliser tes rêves, Iverson.' },
      { id: 'p7', icon: '📚', title: 'Se soutenir dans nos études, nos carrières et nos objectifs personnels.', desc: 'Être le premier supporter de l’autre.', react: 'Être ton premier supporter, c’est un rôle que j’adore.' },
      { id: 'p8', icon: '🎄', title: 'Créer nos propres traditions de couple.', desc: 'Des petits rituels rien qu’à nous.', react: 'Nos propres traditions… j’en ai déjà quelques idées 😉' }
    ]
  }
];

// Titres utilisés dans le récapitulatif
const RECAP_TITLES = {
  histoire: 'Ce qui me rend le plus heureux quand je pense à nous',
  home: 'Notre chez-nous',
  travel: 'Nos voyages',
  daily: 'Notre quotidien',
  projects: 'Nos projets'
};

// Petit jeu : une question à la fois, aucune mauvaise réponse
const GAME = [
  {
    id: 'g1', q: 'Qui sera le plus susceptible de…',
    opts: [
      { t: 'Organiser un voyage à la dernière minute.', r: 'Le côté aventurier ! Avec toi, une valise se prépare en dix minutes 🧳' },
      { t: 'Prévoir les choses des semaines à l’avance.', r: 'Le grand organisateur ! Au moins, on sera prêts… et on aura le temps de rêver au voyage 📅' }
    ]
  },
  {
    id: 'g2', q: 'Notre dimanche idéal ?',
    opts: [
      { t: 'Rester tranquillement à la maison.', r: 'Plaid, snacks et zéro obligation : un classique indémodable 🛋️' },
      { t: 'Sortir et découvrir un nouvel endroit.', r: 'Direction l’aventure ! Il y a tant d’endroits à explorer ensemble 🧭' },
      { t: 'Faire un peu des deux.', r: 'Le compromis parfait : un peu de calme, un peu d’aventure ✨' }
    ]
  },
  {
    id: 'g3', q: 'Si on avait un projet commun à réaliser cette année, tu choisirais quoi ?',
    opts: [
      { t: 'Un voyage.', r: 'Un voyage… je sens que la valise est déjà à moitié faite ✈️' },
      { t: 'Un projet d’épargne.', r: 'Petit à petit, on ira loin. J’aime cette idée 💰' },
      { t: 'Une nouvelle activité à deux.', r: 'Une nouvelle activité à deux ? Je suis partante, même si je suis nulle au début 😄' },
      { t: 'Un objectif personnel à s’entraider à atteindre.', r: 'S’entraider, c’est la plus belle des façons d’avancer 💪' },
      { t: 'Une surprise à organiser ensemble.', r: 'Une surprise ? Voilà qui promet d’être très secret et très drôle 🎁' }
    ]
  },
  {
    id: 'g4', q: 'Notre plus grand objectif à deux ?',
    opts: [
      { t: 'Construire une vie stable.', r: 'Une base solide pour que tout le reste puisse fleurir 🌱' },
      { t: 'Découvrir le monde.', r: 'Le monde est grand : on a de quoi faire 🌍' },
      { t: 'Réaliser nos rêves ensemble.', r: 'Réaliser nos rêves à deux : ça me donne des étoiles dans les yeux ✨' },
      { t: 'Profiter du présent tout en préparant l’avenir.', r: 'L’équilibre parfait : vivre maintenant, sans oublier demain 💞' }
    ]
  },
  {
    id: 'g5', free: true,
    q: 'Si tu pouvais nous offrir un souvenir à vivre dans le futur, ce serait quoi ?',
    rText: 'Oh… j’adore l’idée. Je la garde précieusement dans un coin de mon cœur ❤️',
    rEmpty: 'Pas d’idée pour l’instant ? Aucun souci, on a tout le temps d’y réfléchir 😉'
  }
];

// Idées de la bucket list
const BUCKET = [
  { id: 'b1', text: 'Voir un coucher de soleil dans un endroit magnifique.' },
  { id: 'b2', text: 'Partir en week-end sans trop prévoir.' },
  { id: 'b3', text: 'Cuisiner un repas qu’on n’a jamais essayé.' },
  { id: 'b4', text: 'Découvrir un nouveau pays.' },
  { id: 'b5', text: 'Créer un album de nos souvenirs.' },
  { id: 'b6', text: 'Organiser une journée surprise.' },
  { id: 'b7', text: 'Réaliser un projet important ensemble.' },
  { id: 'b8', text: 'Passer une journée entière sans téléphone.' },
  { id: 'b9', text: 'Découvrir notre futur endroit préféré.' },
  { id: 'b10', text: 'Créer une tradition qui n’appartient qu’à nous.' }
];

// Raccourcis « Modifier mes réponses » sur l’écran final
const JUMPS = [
  ['histoire', 'Notre histoire'], ['home', 'Chez nous'], ['travel', 'Voyages'], ['daily', 'Quotidien'],
  ['projects', 'Projets'], ['game', 'Le petit jeu'], ['bucket', 'Nos rêves'], ['letter', 'Le message']
];

/* ==========================================================
   3. OUTILS
   ========================================================== */
const $ = (sel, root = document) => root.querySelector(sel);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Crée un élément HTML de façon sûre (le texte est inséré en « textContent », jamais en HTML)
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  kids.flat().forEach((c) => {
    if (c == null || c === false) return;
    el.append(c.nodeType ? c : document.createTextNode(c));
  });
  return el;
}

// Petite animation « pop » sur un élément
function pop(el) {
  el.classList.remove('pop');
  void el.offsetWidth; // relance l’animation
  el.classList.add('pop');
}

// Petits cœurs qui jaillissent d’un élément
function burst(el, count = 9) {
  if (reducedMotion() || !el) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + Math.min(r.height / 2, 60);
  for (let i = 0; i < count; i++) {
    const s = h('span', { class: 'burst', 'aria-hidden': 'true' }, i % 3 === 0 ? '💗' : '❤');
    s.style.left = cx + 'px';
    s.style.top = cy + 'px';
    s.style.fontSize = 11 + Math.random() * 10 + 'px';
    s.style.setProperty('--dx', (Math.random() - 0.5) * 170 + 'px');
    s.style.setProperty('--dy', -(40 + Math.random() * 110) + 'px');
    document.body.append(s);
    setTimeout(() => s.remove(), 1000);
  }
}

// Message temporaire en bas de l’écran
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// Copie dans le presse-papiers (avec solution de secours pour les vieux navigateurs)
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = h('textarea', { readonly: true, style: 'position:fixed;left:-9999px;top:0;opacity:0' });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    ta.remove();
    return ok;
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  } catch (e) {
    return '';
  }
}

/* ---------- Fenêtre modale accessible ---------- */
let modal = null;

function openModal({ title, body, actions = [] }) {
  closeModal();
  const opener = document.activeElement;
  const overlay = h('div', { class: 'modal-overlay' });
  const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modalTitle', tabindex: '-1' },
    h('h2', { class: 'modal-title', id: 'modalTitle', text: title }),
    body,
    actions.length ? h('div', { class: 'actions' }, actions) : null
  );
  overlay.append(box);
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) closeModal(); });

  // Échap pour fermer + le focus reste dans la fenêtre
  const onKey = (e) => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    const f = [...box.querySelectorAll('button, input, textarea, a[href]')].filter((x) => !x.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
  document.body.classList.add('modal-open');
  modal = { overlay, onKey, opener };
  const firstField = box.querySelector('input, textarea, button');
  (firstField || box).focus();
  return box;
}

function closeModal() {
  if (!modal) return;
  document.removeEventListener('keydown', modal.onKey);
  modal.overlay.remove();
  document.body.classList.remove('modal-open');
  if (modal.opener && modal.opener.focus) modal.opener.focus();
  modal = null;
}

/* ==========================================================
   4. ÉTAT + SAUVEGARDE (localStorage)
   Tout reste dans le navigateur de la personne qui utilise le site.
   ========================================================== */
const defaultState = () => ({
  screen: 'welcome',
  choices: { histoire: [], home: [], travel: [], daily: [], projects: [] },
  histoireCustom: '',
  game: { index: 0, answers: {}, finished: false },
  bucket: { picked: [], custom: [], done: [] },
  letter: { main: '', hope: '', keep: '', dream: '', savedAt: null }
});

let storageOK = true;
let state = loadState();
let includeLetter = true;

const asArray = (x) => (Array.isArray(x) ? x.filter((v) => typeof v === 'string') : []);
const asString = (x) => (typeof x === 'string' ? x : '');

function loadState() {
  const base = defaultState();
  let raw = null;
  try {
    raw = localStorage.getItem(CONFIG.storageKey);
  } catch (e) {
    storageOK = false; // navigation privée ou stockage bloqué
    return base;
  }
  if (!raw) return base;
  try {
    const s = JSON.parse(raw);
    const choices = {};
    Object.keys(base.choices).forEach((k) => { choices[k] = asArray(s.choices && s.choices[k]); });
    const g = s.game || {};
    const b = s.bucket || {};
    const l = s.letter || {};
    return {
      screen: SCREENS.includes(s.screen) ? s.screen : 'welcome',
      choices,
      histoireCustom: asString(s.histoireCustom),
      game: {
        index: Number.isInteger(g.index) && g.index >= 0 && g.index < GAME.length ? g.index : 0,
        answers: g.answers && typeof g.answers === 'object' ? g.answers : {},
        finished: !!g.finished
      },
      bucket: {
        picked: asArray(b.picked),
        custom: Array.isArray(b.custom)
          ? b.custom.filter((c) => c && typeof c.id === 'string' && typeof c.text === 'string')
          : [],
        done: asArray(b.done)
      },
      letter: {
        main: asString(l.main), hope: asString(l.hope), keep: asString(l.keep), dream: asString(l.dream),
        savedAt: typeof l.savedAt === 'string' ? l.savedAt : null
      }
    };
  } catch (e) {
    return base; // données illisibles : on repart de zéro
  }
}

function saveState() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
  } catch (e) {
    storageOK = false;
  }
}

/* ==========================================================
   5. NAVIGATION
   ========================================================== */
let currentId = null;
let navLock = false;
const navStack = []; // historique pour le bouton « retour »

function updateChrome() {
  const i = SCREENS.indexOf(currentId);
  const pct = Math.round((i / (SCREENS.length - 1)) * 100);
  $('#progressBar').style.width = pct + '%';
  $('#progress').setAttribute('aria-valuenow', String(pct));
  $('#backBtn').style.visibility = i > 0 ? 'visible' : 'hidden';
}

function switchTo(id, push = true) {
  if (navLock || id === currentId) return;
  const nextEl = $('#screen-' + id);
  if (!nextEl) return;
  const curEl = currentId ? $('#screen-' + currentId) : null;
  if (curEl && push) navStack.push(currentId);

  const doSwitch = () => {
    if (curEl) { curEl.hidden = true; curEl.classList.remove('leaving'); }
    currentId = id;
    state.screen = id;
    saveState();
    onEnter(id);
    nextEl.hidden = false;
    nextEl.classList.add('entering');
    setTimeout(() => nextEl.classList.remove('entering'), 600);
    updateChrome();
    window.scrollTo({ top: 0, behavior: 'auto' });
    const title = nextEl.querySelector('h1, h2');
    if (title) title.focus({ preventScroll: true });
    navLock = false;
  };

  navLock = true;
  if (curEl && !reducedMotion()) {
    curEl.classList.add('leaving');
    setTimeout(doSwitch, 240);
  } else {
    doSwitch();
  }
}

function goNext(sourceEl) {
  const i = SCREENS.indexOf(currentId);
  if (i < 0 || i >= SCREENS.length - 1) return;
  if (currentId === 'welcome') burst(sourceEl, 16);
  switchTo(SCREENS[i + 1], true);
}

function goBack() {
  if (navStack.length) {
    switchTo(navStack.pop(), false);
  } else {
    const i = SCREENS.indexOf(currentId);
    if (i > 0) switchTo(SCREENS[i - 1], false);
  }
}

// Appelé à chaque arrivée sur un écran : on rafraîchit son contenu
function onEnter(id) {
  if (id === 'futur-intro') renderFuturIntro();
  if (id === 'game') renderGame(false);
  if (id === 'bucket') renderBucket();
  if (id === 'letter') renderLetter();
  if (id === 'final') renderFinal();
  setFinale(id === 'final');
}

/* ==========================================================
   6. ÉCRANS
   ========================================================== */

/* ---------- 6.1 Écrans à choix multiples ---------- */
function buildChoiceScreen(def) {
  const selected = () => state.choices[def.key];
  const reaction = h('p', { class: 'reaction', 'aria-live': 'polite' });
  const nextBtn = h('button', { class: 'btn btn-primary', type: 'button', 'data-next': true });
  let textarea = null;

  const updateNext = () => {
    const hasAnswer = selected().length > 0 || (def.withText && state.histoireCustom.trim() !== '');
    nextBtn.textContent = hasAnswer ? 'Continuer →' : 'Passer cette étape →';
  };

  const grid = h('div', { class: 'choice-grid' });
  def.items.forEach((item) => {
    const visual = def.visual
      ? h('span', { class: 'choice-visual', 'aria-hidden': 'true', style: '--g1:' + item.g[0] + ';--g2:' + item.g[1] }, item.icon)
      : h('span', { class: 'choice-icon', 'aria-hidden': 'true' }, item.icon);
    const btn = h('button',
      { type: 'button', class: 'choice' + (def.visual ? ' choice--visual' : ''), 'aria-pressed': String(selected().includes(item.id)) },
      visual,
      h('span', { class: 'choice-body' },
        h('span', { class: 'choice-title', text: item.title }),
        item.desc ? h('span', { class: 'choice-desc', text: item.desc }) : null),
      h('span', { class: 'choice-check', 'aria-hidden': 'true' }, '♥')
    );
    btn.addEventListener('click', () => {
      const list = selected();
      const i = list.indexOf(item.id);
      if (i >= 0) {                       // on désélectionne
        list.splice(i, 1);
        btn.setAttribute('aria-pressed', 'false');
        reaction.textContent = '';
      } else {                            // on sélectionne
        list.push(item.id);
        btn.setAttribute('aria-pressed', 'true');
        reaction.textContent = '';
        reaction.textContent = item.react;
        pop(btn);
        burst(btn, 7);
        if (item.focusText && textarea) textarea.focus();
      }
      saveState();
      updateNext();
    });
    grid.append(btn);
  });

  let textBlock = null;
  if (def.withText) {
    textarea = h('textarea', { id: 'histoireText', rows: '3', maxlength: '600', placeholder: 'Ou écris ta propre réponse ici…' });
    textarea.value = state.histoireCustom;
    textarea.addEventListener('input', () => {
      state.histoireCustom = textarea.value;
      saveState();
      updateNext();
    });
    textBlock = h('div', { class: 'text-block' },
      h('label', { class: 'field-label', for: 'histoireText' }, 'Avec tes propres mots ', h('span', { class: 'muted' }, '(facultatif)')),
      textarea);
  }

  updateNext();
  return h('section', { class: 'screen', id: 'screen-' + def.id, hidden: true, 'data-dynamic': true, 'aria-labelledby': 'title-' + def.id },
    h('div', { class: 'card' },
      h('p', { class: 'kicker', text: def.kicker }),
      h('h2', { id: 'title-' + def.id, tabindex: '-1', text: def.title }),
      h('p', { class: 'lead', text: def.question }),
      h('p', { class: 'hint', text: 'Tu peux en choisir plusieurs, et changer d’avis quand tu veux.' }),
      grid, textBlock, reaction,
      h('div', { class: 'actions actions--end' }, nextBtn)
    )
  );
}

function buildDynamicScreens() {
  document.querySelectorAll('[data-dynamic]').forEach((el) => el.remove());
  const app = $('#app');
  CHOICE_SCREENS.forEach((def) => app.append(buildChoiceScreen(def)));
}

/* ---------- 6.2 Introduction du futur ---------- */
function renderFuturIntro() {
  const list = $('#catList');
  list.replaceChildren();
  CHOICE_SCREENS.filter((d) => d.id !== 'histoire').forEach((def) => {
    const done = state.choices[def.key].length > 0;
    list.append(h('li', {}, def.title, done ? h('span', { class: 'tick', 'aria-label': 'déjà répondu' }, '✓ fait') : null));
  });
}

/* ---------- 6.3 Le petit jeu ---------- */
function renderGame(animate) {
  const idx = state.game.index;
  const q = GAME[idx];
  const ans = state.game.answers[q.id];

  // Pastilles de progression
  const dots = $('#gameDots');
  dots.replaceChildren();
  GAME.forEach((_, i) => dots.append(h('span', { class: 'dot' + (i === idx ? ' active' : i < idx ? ' done' : '') })));

  $('#gameStep').textContent = 'Question ' + (idx + 1) + ' sur ' + GAME.length;
  $('#gameQuestion').textContent = q.q;

  const reaction = $('#gameReaction');
  reaction.textContent = '';
  const optsEl = $('#gameOptions');
  optsEl.replaceChildren();
  const free = $('#gameFree');
  const nextBtn = $('#gameNext');
  const last = idx === GAME.length - 1;

  const updateNext = () => {
    const a = state.game.answers[q.id];
    const answered = q.free ? typeof a === 'string' && a.trim() !== '' : typeof a === 'number';
    nextBtn.textContent = last ? (answered ? 'Continuer →' : 'Passer →') : (answered ? 'Question suivante →' : 'Passer →');
  };

  if (q.free) {
    optsEl.hidden = true;
    free.hidden = false;
    $('#gameText').value = typeof ans === 'string' ? ans : '';
  } else {
    free.hidden = true;
    optsEl.hidden = false;
    q.opts.forEach((o, i) => {
      const btn = h('button', { type: 'button', class: 'option', 'aria-pressed': String(ans === i), text: o.t });
      btn.addEventListener('click', () => {
        state.game.answers[q.id] = i;
        saveState();
        [...optsEl.children].forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
        reaction.textContent = o.r;
        pop(btn);
        burst(btn, 8);
        updateNext();
      });
      optsEl.append(btn);
    });
    if (typeof ans === 'number' && q.opts[ans]) reaction.textContent = q.opts[ans].r;
  }

  $('#gamePrev').hidden = idx === 0;
  updateNext();

  if (animate) {
    const body = $('#gameBody');
    body.classList.remove('entering');
    void body.offsetWidth;
    body.classList.add('entering');
    $('#gameQuestion').focus({ preventScroll: true });
  }
}

function initGame() {
  $('#gamePrev').addEventListener('click', () => {
    if (state.game.index > 0) { state.game.index--; saveState(); renderGame(true); }
  });
  $('#gameNext').addEventListener('click', () => {
    if (state.game.index < GAME.length - 1) {
      state.game.index++;
      saveState();
      renderGame(true);
    } else {
      state.game.finished = true;
      saveState();
      goNext($('#gameNext'));
    }
  });
  // Question libre : on enregistre pendant qu’il écrit
  $('#gameText').addEventListener('input', (e) => {
    state.game.answers.g5 = e.target.value;
    saveState();
    const nb = $('#gameNext');
    nb.textContent = e.target.value.trim() ? 'Continuer →' : 'Passer →';
  });
  $('#gameValidate').addEventListener('click', () => {
    const q = GAME[GAME.length - 1];
    const v = $('#gameText').value.trim();
    state.game.answers.g5 = v;
    saveState();
    $('#gameReaction').textContent = v ? q.rText : q.rEmpty;
    if (v) burst($('#gameValidate'), 10);
    $('#gameNext').textContent = v ? 'Continuer →' : 'Passer →';
  });
}

/* ---------- 6.4 Bucket list ---------- */
function bucketItems() {
  const b = state.bucket;
  return [
    ...BUCKET.filter((i) => b.picked.includes(i.id)).map((i) => ({ id: i.id, text: i.text, custom: false })),
    ...b.custom.map((c) => ({ id: c.id, text: c.text, custom: true }))
  ];
}

function renderBucket() {
  // Idées à cocher
  const wrap = $('#bucketIdeas');
  wrap.replaceChildren();
  BUCKET.forEach((idea) => {
    const btn = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(state.bucket.picked.includes(idea.id)), text: idea.text });
    btn.addEventListener('click', () => {
      const p = state.bucket.picked;
      const i = p.indexOf(idea.id);
      if (i >= 0) {
        p.splice(i, 1);
        state.bucket.done = state.bucket.done.filter((d) => d !== idea.id);
      } else {
        p.push(idea.id);
        pop(btn);
        burst(btn, 6);
      }
      btn.setAttribute('aria-pressed', String(p.includes(idea.id)));
      saveState();
      renderDreamList();
    });
    wrap.append(btn);
  });
  renderDreamList();
}

function renderDreamList() {
  const items = bucketItems();
  const ul = $('#dreamList');
  ul.replaceChildren();
  $('#dreamEmpty').hidden = items.length > 0;
  $('#dreamCount').textContent = items.length ? '(' + items.length + ')' : '';

  items.forEach((item) => {
    const isDone = state.bucket.done.includes(item.id);
    const check = h('button', {
      type: 'button', class: 'dream-check', 'aria-pressed': String(isDone),
      'aria-label': 'Marquer « ' + item.text + ' » comme réalisé', title: 'Réalisé'
    }, '✓');
    const del = h('button', {
      type: 'button', class: 'dream-del', 'aria-label': 'Supprimer « ' + item.text + ' »', title: 'Supprimer'
    }, '✕');
    const li = h('li', { class: 'dream-item' + (isDone ? ' done' : '') },
      check, h('span', { class: 'dream-text', text: item.text }), del);

    check.addEventListener('click', () => {
      const d = state.bucket.done;
      const i = d.indexOf(item.id);
      if (i >= 0) d.splice(i, 1); else { d.push(item.id); burst(check, 10); }
      saveState();
      renderDreamList();
    });
    del.addEventListener('click', () => {
      removeDream(item);
      renderDreamList();
      // on resynchronise aussi les pastilles d’idées
      [...$('#bucketIdeas').children].forEach((chip, k) => chip.setAttribute('aria-pressed', String(state.bucket.picked.includes(BUCKET[k].id))));
    });
    ul.append(li);
  });
}

function removeDream(item) {
  const b = state.bucket;
  if (item.custom) b.custom = b.custom.filter((c) => c.id !== item.id);
  else b.picked = b.picked.filter((id) => id !== item.id);
  b.done = b.done.filter((id) => id !== item.id);
  saveState();
}

// Ajoute un rêve personnalisé (utilisé par la page « rêves » et par l’écran final)
function addCustomDream(text) {
  const t = text.trim().slice(0, 120);
  if (!t) return false;
  const id = 'c' + Date.now() + Math.random().toString(36).slice(2, 6);
  state.bucket.custom.push({ id, text: t });
  saveState();
  return true;
}

function initBucket() {
  const toggle = $('#addDreamToggle');
  const form = $('#addDreamForm');
  const input = $('#dreamInput');

  toggle.addEventListener('click', () => {
    const open = form.hidden;
    form.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.value.trim()) { input.focus(); toast('Écris d’abord ton rêve ✍️'); return; }
    addCustomDream(input.value);
    input.value = '';
    renderDreamList();
    burst(toggle, 10);
    toast('Rêve ajouté à notre liste ✨');
    input.focus();
  });
}

/* ---------- 6.5 La lettre ---------- */
function renderLetter() {
  const L = state.letter;
  $('#letterMain').value = L.main;
  $('#letterHope').value = L.hope;
  $('#letterKeep').value = L.keep;
  $('#letterDream').value = L.dream;
  $('#letterError').textContent = '';
  if (L.savedAt) showLetterSaved(false); else $('#letterSaved').hidden = true;
}

function showLetterSaved(animate) {
  const box = $('#letterSaved');
  box.hidden = false;
  $('#letterNote').textContent =
    'Gardé le ' + formatDate(state.letter.savedAt) + '. Ton message est enregistré sur ton appareil, dans ce navigateur. Il n’est pas envoyé automatiquement à ' +
    CONFIG.authorName + '.';
  if (animate) {
    box.classList.remove('sealed');
    void box.offsetWidth;
    box.classList.add('sealed');
  }
}

function initLetter() {
  const map = { letterMain: 'main', letterHope: 'hope', letterKeep: 'keep', letterDream: 'dream' };
  Object.keys(map).forEach((id) => {
    $('#' + id).addEventListener('input', (e) => {
      state.letter[map[id]] = e.target.value;
      saveState();                       // le brouillon est gardé automatiquement
      $('#letterError').textContent = '';
    });
  });
  $('#letterSave').addEventListener('click', () => {
    const L = state.letter;
    if (!(L.main + L.hope + L.keep + L.dream).trim()) {
      $('#letterError').textContent = 'Écris quelques mots avant de garder ton message, même tout petits 💭';
      $('#letterMain').focus();
      return;
    }
    $('#letterError').textContent = '';
    L.savedAt = new Date().toISOString();
    saveState();
    showLetterSaved(true);
    burst($('#letterSave'), 16);
    $('#letterSaved').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  });
}

/* ---------- 6.6 Écran final + récapitulatif ---------- */
function recapSections() {
  const out = [];
  CHOICE_SCREENS.forEach((def) => {
    const lines = def.items.filter((i) => state.choices[def.key].includes(i.id)).map((i) => i.title);
    if (def.id === 'histoire' && state.histoireCustom.trim()) lines.push('Avec mes mots : « ' + state.histoireCustom.trim() + ' »');
    out.push({ title: RECAP_TITLES[def.key], lines });
  });

  const gameLines = [];
  GAME.forEach((q) => {
    const a = state.game.answers[q.id];
    if (q.free) { if (typeof a === 'string' && a.trim()) gameLines.push(q.q + ' → ' + a.trim()); }
    else if (typeof a === 'number' && q.opts[a]) gameLines.push(q.q + ' → ' + q.opts[a].t);
  });
  out.push({ title: 'Le petit jeu', lines: gameLines });

  out.push({
    title: 'Notre bucket list',
    lines: bucketItems().map((i) => (state.bucket.done.includes(i.id) ? '✓ ' : '☐ ') + i.text)
  });

  if (includeLetter) {
    const L = state.letter;
    const lines = [];
    if (L.main.trim()) lines.push(L.main.trim());
    if (L.hope.trim()) lines.push('Ce que j’espère pour nous : ' + L.hope.trim());
    if (L.keep.trim()) lines.push('Ce que j’aimerais qu’on continue toujours à faire : ' + L.keep.trim());
    if (L.dream.trim()) lines.push('Le rêve que j’aimerais qu’on réalise : ' + L.dream.trim());
    out.push({ title: 'Mon message pour plus tard', lines });
  }
  return out;
}

function recapText() {
  const lines = [
    CONFIG.siteTitle + ' : les réponses de ' + CONFIG.partnerName,
    'Pour ' + CONFIG.authorName + ' ❤️',
    new Date().toLocaleDateString('fr-FR', { dateStyle: 'long' }),
    ''
  ];
  recapSections().forEach((sec) => {
    lines.push(sec.title.toUpperCase());
    if (sec.lines.length) sec.lines.forEach((l) => lines.push('• ' + l));
    else lines.push('(pas de réponse)');
    lines.push('');
  });
  return lines.join('\n');
}

function renderRecap() {
  const body = $('#recapBody');
  body.replaceChildren();
  recapSections().forEach((sec) => {
    body.append(h('div', { class: 'recap-sec' },
      h('h4', { text: sec.title }),
      sec.lines.length
        ? h('ul', {}, sec.lines.map((l) => h('li', { text: l })))
        : h('p', { text: 'Pas de réponse pour cette partie.' })));
  });
}

function renderFinal() {
  renderRecap();
  const jump = $('#jumpList');
  jump.replaceChildren();
  JUMPS.forEach(([id, label]) => {
    const b = h('button', { type: 'button', class: 'chip', text: label });
    b.addEventListener('click', () => switchTo(id, true));
    jump.append(b);
  });
  $('#recapShare').hidden = !navigator.share;
}

function initFinal() {
  $('#btnRevoir').addEventListener('click', () => {
    const card = $('#recapCard');
    card.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
  });

  $('#btnAddDream').addEventListener('click', () => {
    const input = h('input', { type: 'text', maxlength: '120', autocomplete: 'off', placeholder: 'Ex. : refaire notre premier rendez-vous…', 'aria-label': 'Ton dernier rêve' });
    const form = h('form', {},
      h('p', { class: 'modal-text', text: 'Un dernier rêve à ajouter à notre liste ?' }),
      input,
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-ghost', 'data-close': true }, 'Annuler'),
        h('button', { type: 'submit', class: 'btn btn-primary' }, 'Ajouter ❤️')));
    form.querySelector('[data-close]').addEventListener('click', closeModal);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!addCustomDream(input.value)) { input.focus(); return; }
      closeModal();
      renderRecap();
      toast('Rêve ajouté à notre liste ✨');
      burst($('#btnAddDream'), 14);
    });
    openModal({ title: 'Ajouter un dernier rêve', body: form });
  });

  $('#btnMessage').addEventListener('click', () => {
    const body = h('div', {},
      h('p', { class: 'modal-text', text: CONFIG.finalMessage }),
      h('p', { class: 'signature', text: CONFIG.finalSignature }));
    openModal({
      title: 'Pour toi, ' + CONFIG.partnerName + ' 💌',
      body,
      actions: [h('button', { type: 'button', class: 'btn btn-primary', onclick: null }, 'Fermer')]
    });
    modal.overlay.querySelector('.actions .btn').addEventListener('click', closeModal);
    burst($('#btnMessage'), 18);
  });

  $('#recapIncludeLetter').addEventListener('change', (e) => { includeLetter = e.target.checked; renderRecap(); });

  $('#recapCopy').addEventListener('click', async () => {
    const ok = await copyText(recapText());
    toast(ok ? 'Récapitulatif copié ✓' : 'Impossible de copier : utilise plutôt « Exporter »');
  });

  $('#recapExport').addEventListener('click', () => {
    const blob = new Blob([recapText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: 'notre-futur-' + CONFIG.partnerName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.txt' });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast('Fichier texte exporté ✓');
  });

  $('#recapShare').addEventListener('click', async () => {
    try {
      await navigator.share({ title: CONFIG.siteTitle, text: recapText() });
    } catch (e) { /* partage annulé : rien à faire */ }
  });
}

/* ---------- 6.7 Confidentialité + recommencer ---------- */
function initFooter() {
  $('#privacyBtn').addEventListener('click', () => {
    const body = h('div', {},
      h('ul', {},
        h('li', { text: 'Ce site n’a ni compte, ni mot de passe, ni serveur, ni base de données.' }),
        h('li', { text: 'Tes réponses sont enregistrées dans ton navigateur (localStorage), sur cet appareil uniquement.' }),
        h('li', { text: 'Rien n’est envoyé automatiquement à ' + CONFIG.authorName + ' : tu choisis si tu veux lui montrer ton récapitulatif (copier, exporter ou envoyer).' }),
        h('li', { text: 'Si tu changes d’appareil ou de navigateur, ou que tu vides les données du site, tes réponses disparaissent.' }),
        storageOK ? null : h('li', { text: '⚠️ Ton navigateur bloque la sauvegarde (navigation privée ?) : tes réponses seront perdues si tu fermes la page.' })),
      );
    openModal({
      title: 'Confidentialité 🔒', body,
      actions: [h('button', { type: 'button', class: 'btn btn-primary' }, 'Compris')]
    });
    modal.overlay.querySelector('.actions .btn').addEventListener('click', closeModal);
  });

  $('#restartBtn').addEventListener('click', () => {
    const yes = h('button', { type: 'button', class: 'btn btn-primary' }, 'Oui, recommencer');
    const no = h('button', { type: 'button', class: 'btn btn-ghost' }, 'Annuler');
    openModal({
      title: 'Recommencer l’expérience ?',
      body: h('p', { class: 'modal-text', text: 'Toutes tes réponses, ta liste de rêves et ton message gardé sur cet appareil seront effacés.' }),
      actions: [no, yes]
    });
    no.addEventListener('click', closeModal);
    yes.addEventListener('click', () => { closeModal(); restart(); });
  });
}

function restart() {
  try { localStorage.removeItem(CONFIG.storageKey); } catch (e) { /* rien */ }
  state = defaultState();
  includeLetter = true;
  $('#recapIncludeLetter').checked = true;
  buildDynamicScreens();
  document.querySelectorAll('.screen').forEach((s) => { s.hidden = true; s.classList.remove('leaving', 'entering'); });
  currentId = null;
  navStack.length = 0;
  navLock = false;
  switchTo('welcome', false);
  toast('On repart à zéro ✨');
}

/* ---------- 6.8 Décor : cœurs et étoiles ---------- */
function makeHeart(big) {
  const s = h('span', { class: 'heart' + (big ? ' heart--big' : ''), 'aria-hidden': 'true' }, '♥');
  s.style.left = Math.random() * 100 + '%';
  s.style.fontSize = (big ? 18 + Math.random() * 18 : 10 + Math.random() * 14) + 'px';
  s.style.animationDuration = 13 + Math.random() * 12 + 's';
  s.style.animationDelay = -Math.random() * 22 + 's';
  s.style.setProperty('--sway', (Math.random() - 0.5) * 120 + 'px');
  return s;
}

function initAmbience() {
  if (reducedMotion()) return;
  const hearts = $('#hearts');
  for (let i = 0; i < 12; i++) hearts.append(makeHeart(false));
  const stars = $('#stars');
  for (let i = 0; i < 34; i++) {
    const s = h('span', { class: 'star' });
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDuration = 3 + Math.random() * 4 + 's';
    s.style.animationDelay = -Math.random() * 6 + 's';
    stars.append(s);
  }
}

// Sur l’écran final : une petite pluie de cœurs en plus (douce)
function setFinale(on) {
  const hearts = $('#hearts');
  hearts.querySelectorAll('.heart--big').forEach((el) => el.remove());
  if (on && !reducedMotion()) for (let i = 0; i < 12; i++) hearts.append(makeHeart(true));
}

/* ==========================================================
   7. MUSIQUE D’AMBIANCE
   Générée directement par le navigateur (aucun fichier audio à héberger).
   Désactivée par défaut : elle ne démarre qu’après un clic volontaire.
   ========================================================== */
const music = (() => {
  let ctx = null, master = null, timer = null, tickN = 0, playing = false;
  // Accords doux : Do maj7, La min7, Fa maj7, Sol6
  const CHORDS = [
    [261.63, 329.63, 392.0, 493.88],
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 329.63],
    [196.0, 246.94, 293.66, 329.63]
  ];

  function setup() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1500;
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.5;
    const fb = ctx.createGain(); fb.gain.value = 0.38;
    const wet = ctx.createGain(); wet.gain.value = 0.45;
    master.connect(lp); lp.connect(ctx.destination);
    lp.connect(delay); delay.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(ctx.destination);
    return true;
  }

  function tone(freq, t0, o) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(o.gain, t0 + o.attack);
    g.gain.setValueAtTime(o.gain, t0 + o.attack + o.hold);
    g.gain.linearRampToValueAtTime(0.0001, t0 + o.attack + o.hold + o.release);
    osc.connect(g); g.connect(master);
    osc.start(t0);
    osc.stop(t0 + o.attack + o.hold + o.release + 0.1);
  }

  function tick() {
    const t = ctx.currentTime + 0.05;
    const chord = CHORDS[Math.floor(tickN / 4) % CHORDS.length];
    if (tickN % 4 === 0) {
      chord.forEach((f, i) => tone(i === 0 ? f / 2 : f, t, { gain: 0.045, attack: 2.2, hold: 2.5, release: 3.5 }));
    }
    const note = chord[(tickN * 2 + 1) % chord.length] * 2;
    tone(note, t + 0.1, { type: 'triangle', gain: 0.035, attack: 0.03, hold: 0.1, release: 2.2 });
    tickN++;
  }

  function start() {
    if (!ctx && !setup()) return false;
    ctx.resume();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0.9, now + 1.5);
    tickN = 0;
    tick();
    timer = setInterval(tick, 1800);
    playing = true;
    return true;
  }

  function stop() {
    if (!ctx) return;
    playing = false;
    clearInterval(timer);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 0.8);
    setTimeout(() => { if (!playing) ctx.suspend(); }, 1000);
  }

  // On met en pause quand l’onglet est caché
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  return { start, stop, isPlaying: () => playing };
})();

function initMusic() {
  const btn = $('#musicBtn');
  btn.addEventListener('click', () => {
    if (music.isPlaying()) {
      music.stop();
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Activer la musique d’ambiance');
      btn.classList.add('off');
    } else if (music.start()) {
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Couper la musique d’ambiance');
      btn.classList.remove('off');
    } else {
      toast('Ton navigateur ne permet pas la musique d’ambiance.');
    }
  });
}

/* ==========================================================
   8. DÉMARRAGE
   ========================================================== */
function init() {
  // Prénoms (modifiables dans CONFIG en haut du fichier)
  document.querySelectorAll('[data-bind]').forEach((el) => {
    el.textContent = el.dataset.bind === 'partner' ? CONFIG.partnerName : CONFIG.authorName;
  });
  document.title = CONFIG.siteTitle + ' · ' + CONFIG.partnerName + ' & ' + CONFIG.authorName;

  buildDynamicScreens();
  initGame();
  initBucket();
  initLetter();
  initFinal();
  initFooter();
  initMusic();
  initAmbience();

  // Boutons « Continuer » (data-next) et bouton retour
  document.addEventListener('click', (e) => {
    const n = e.target.closest('[data-next]');
    if (n) goNext(n);
  });
  $('#backBtn').addEventListener('click', goBack);

  // On reprend là où il s’était arrêté
  switchTo(state.screen, false);
}

init();
