const SITE = {
  email: 'contato.gabesoftware@gmail.com',
  whatsapp: '5521973036099'
};

/* Textos em inglês compartilhados por todas as páginas.
   O português é lido do próprio HTML, então não precisa ser repetido aqui. */
const commonTranslations = {
  en: {
    skipLink: 'Skip to content',
    brandTag: 'TECHNOLOGY',
    navServices: 'Services',
    navDev: 'Development',
    navCons: 'Consulting',
    navIa: 'AI & Automation',
    navEnsino: 'Training',
    navProd: 'Products',
    navProcess: 'How we work',
    navSobre: 'About',
    navJogos: 'Games',
    navFaq: 'FAQ',
    headerCta: 'Talk to us',
    navToggle: 'Open menu',
    breadcrumbHome: 'Home',
    waFloat: 'WhatsApp',
    waFloatAria: 'Chat on WhatsApp',
    ctaBandTitle: 'Ready to take the next step?',
    ctaBandDesc: 'Book a free, no-strings conversation. You talk directly to the person who writes the code — and leave with clear next steps.',
    ctaBandWa: 'Talk on WhatsApp',
    ctaBandMail: 'Send an email',
    footerAbout: 'Custom software, consulting, AI & automation and training — senior technology for companies that want to grow without friction.',
    footerServices: 'Services',
    footerCompany: 'Company',
    footerContact: 'Contact',
    footerRights: 'All rights reserved.',
    footerMade: 'Built with care in Rio de Janeiro, Brazil.',
    waMsg: 'Hi! I came from the GABE Software website and would like to talk about a project.'
  }
};

const LANG_KEY = 'gabe-lang';
const ptCache = new Map();
const ptAttrCache = new Map();
let ptMeta = null;

function waLink(text) {
  return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text);
}

function readMeta() {
  const q = (s) => document.querySelector(s);
  return {
    title: document.title,
    desc: q('meta[name="description"]') && q('meta[name="description"]').content,
    ogTitle: q('meta[property="og:title"]') && q('meta[property="og:title"]').content,
    ogDesc: q('meta[property="og:description"]') && q('meta[property="og:description"]').content
  };
}

function writeMeta(m) {
  if (m.title) document.title = m.title;
  const set = (sel, val) => { const el = document.querySelector(sel); if (el && val) el.content = val; };
  set('meta[name="description"]', m.desc);
  set('meta[property="og:title"]', m.ogTitle);
  set('meta[property="og:description"]', m.ogDesc);
  set('meta[name="twitter:title"]', m.ogTitle);
  set('meta[name="twitter:description"]', m.ogDesc);
}

function applySiteLanguage(lang) {
  const page = (typeof pageTranslations !== 'undefined' && pageTranslations[lang]) || {};
  const dict = Object.assign({}, commonTranslations[lang] || {}, page);
  const isPt = lang !== 'en';

  if (!ptMeta) ptMeta = readMeta();

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!ptCache.has(el)) ptCache.set(el, el.innerHTML);
    if (isPt) el.innerHTML = ptCache.get(el);
    else if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.getAttribute('data-i18n-attr').split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (!ptAttrCache.has(el)) ptAttrCache.set(el, {});
      const cache = ptAttrCache.get(el);
      if (cache[attr] === undefined) cache[attr] = el.getAttribute(attr) || '';
      el.setAttribute(attr, isPt ? cache[attr] : (dict[key] !== undefined ? dict[key] : cache[attr]));
    });
  });

  writeMeta(isPt ? ptMeta : {
    title: dict.metaTitle, desc: dict.metaDesc, ogTitle: dict.metaTitle, ogDesc: dict.metaDesc
  });

  const waText = isPt ? 'Olá! Vim pelo site da GABE Software e gostaria de conversar sobre um projeto.' : dict.waMsg;
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(waText); });

  document.documentElement.lang = isPt ? 'pt-BR' : 'en';
  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === (isPt ? 'pt' : 'en')));
  });
  try { localStorage.setItem(LANG_KEY, isPt ? 'pt' : 'en'); } catch (e) { /* storage indisponível */ }
}

function setLanguage(lang) { applySiteLanguage(lang); }

function initLanguage() {
  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.addEventListener('click', () => setLanguage(b.dataset.lang));
  });
  let saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* storage indisponível */ }
  if (!saved && navigator.language && !navigator.language.toLowerCase().startsWith('pt')) saved = 'en';
  applySiteLanguage(saved === 'en' ? 'en' : 'pt');
}

function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.main-nav a').forEach((a) => a.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { document.body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => {
    // O que já está na primeira dobra aparece de imediato, sem esperar o observer.
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    else io.observe(el);
  });
}

/* Formulário de briefing: monta a mensagem e abre WhatsApp ou e-mail (site estático, sem backend). */
function initBrief() {
  const form = document.getElementById('brief');
  if (!form) return;
  const en = () => document.documentElement.lang === 'en';
  const compose = () => {
    const name = form.elements.nome.value.trim();
    const company = form.elements.empresa.value.trim();
    const msg = form.elements.mensagem.value.trim();
    const needs = Array.from(form.querySelectorAll('input[name="interesse"]:checked'))
      .map((i) => i.nextElementSibling.textContent.trim());
    const L = en()
      ? { hi: 'Hi! I came from the GABE Software website.', n: 'Name', c: 'Company', i: 'Interest', m: 'Message' }
      : { hi: 'Olá! Vim pelo site da GABE Software.', n: 'Nome', c: 'Empresa', i: 'Interesse', m: 'Mensagem' };
    const lines = [L.hi];
    if (name) lines.push(L.n + ': ' + name);
    if (company) lines.push(L.c + ': ' + company);
    if (needs.length) lines.push(L.i + ': ' + needs.join(', '));
    if (msg) lines.push(L.m + ': ' + msg);
    return lines.join('\n');
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open(waLink(compose()), '_blank', 'noopener');
  });
  const mailBtn = document.getElementById('brief-mail');
  if (mailBtn) mailBtn.addEventListener('click', () => {
    const subject = en() ? 'Project — GABE Software website' : 'Projeto — site GABE Software';
    window.location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(compose());
  });
}

function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
}

document.documentElement.classList.remove('no-js');
initYear();
initHeader();
initLanguage();
initReveal();
initBrief();
