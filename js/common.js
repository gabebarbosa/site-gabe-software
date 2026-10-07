const SITE = {
  logo: 'https://lh3.googleusercontent.com/a/ACg8ocIJ2pSbI6fZlYWzQ0Q6W_1BLcl6Nfvpz5AfNLEiyL9qdzgXlg0=s324-c-no',
  email: 'contato.gabesoftware@gmail.com'
};

const commonTranslations = {
  pt: {
    heroSub: 'Tecnologia, consultoria e capacitação',
    skipLink: 'Ir para o conteúdo',
    navHome: 'Início',
    navDev: 'Desenvolvimento',
    navCons: 'Consultoria',
    navIa: 'IA & Automação',
    navEnsino: 'Ensino',
    navProd: 'Produtos',
    navSobre: 'Sobre',
    navJogos: 'Jogos',
    navContato: 'Contato',
    breadcrumbHome: 'Início',
    contactTitle: 'Vamos conversar?',
    contactDesc: 'Conte qual desafio tecnológico você precisa resolver.',
    contactBtn: 'Entrar em contato'
  },
  en: {
    heroSub: 'Technology, consulting and training',
    skipLink: 'Skip to content',
    navHome: 'Home',
    navDev: 'Development',
    navCons: 'Consulting',
    navIa: 'AI & Automation',
    navEnsino: 'Training',
    navProd: 'Products',
    navSobre: 'About',
    navJogos: 'Games',
    navContato: 'Contact',
    breadcrumbHome: 'Home',
    contactTitle: 'Let\'s talk?',
    contactDesc: 'Tell us what technology challenge you need to solve.',
    contactBtn: 'Get in touch'
  }
};

const commonTextIds = [
  ['hero-sub', 'heroSub'],
  ['skip-link', 'skipLink'],
  ['nav-home', 'navHome'],
  ['nav-dev', 'navDev'],
  ['nav-cons', 'navCons'],
  ['nav-ia', 'navIa'],
  ['nav-ensino', 'navEnsino'],
  ['nav-prod', 'navProd'],
  ['nav-sobre', 'navSobre'],
  ['nav-contato', 'navContato'],
  ['breadcrumb-home', 'breadcrumbHome'],
  ['contact-title', 'contactTitle'],
  ['contact-desc', 'contactDesc'],
  ['contact-btn', 'contactBtn']
];

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }
}

function updateMeta(t) {
  if (t.metaTitle) document.title = t.metaTitle;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && t.metaDesc) desc.content = t.metaDesc;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && t.ogTitle) ogTitle.content = t.ogTitle;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && t.ogDesc) ogDesc.content = t.ogDesc;
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle && t.ogTitle) twTitle.content = t.ogTitle;
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc && t.ogDesc) twDesc.content = t.ogDesc;
}

function applyTexts(textIds, t) {
  textIds.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el || t[key] === undefined) return;
    if (key.endsWith('Html') || key === 'intro') el.innerHTML = t[key];
    else el.textContent = t[key];
  });
}

function applySiteLanguage(lang, pageTranslations, pageTextIds) {
  const common = commonTranslations[lang];
  const page = pageTranslations[lang];
  const t = { ...common, ...page };

  document.documentElement.lang = lang === 'pt' ? 'pt-br' : 'en';
  updateMeta(t);
  applyTexts(commonTextIds, t);
  if (pageTextIds) applyTexts(pageTextIds, t);
}

initYear();
initReveal();
