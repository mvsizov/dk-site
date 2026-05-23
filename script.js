const topbar = document.querySelector(".topbar");
const reveals = Array.from(document.querySelectorAll(".reveal"));

const updateTopbar = () => {
  if (!topbar) return;
  if (window.scrollY > 8) {
    topbar.classList.add("is-active");
  } else {
    topbar.classList.remove("is-active");
  }
};

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  }
);

for (const section of reveals) {
  observer.observe(section);
}

// --- Tag filtering for projects + posts ---
const setupFilter = ({ listSelector, itemSelector, emptySelector }) => {
  const list = document.querySelector(listSelector);
  if (!list) return;

  const empty = emptySelector ? document.querySelector(emptySelector) : null;
  const chips = Array.from(
    list.parentElement.querySelectorAll(".filter-chip")
  );

  const applyFilter = (filter) => {
    const items = Array.from(list.querySelectorAll(itemSelector));
    let visible = 0;
    for (const item of items) {
      const tags = (item.dataset.tags || "").toLowerCase().split(/\s+/);
      const match = filter === "all" || tags.includes(filter);
      item.style.display = match ? "" : "none";
      if (match) visible += 1;
    }
    if (empty) {
      const shouldShow = items.length === 0 || visible === 0;
      empty.classList.toggle("is-hidden", !shouldShow);
    }
  };

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      for (const c of chips) c.classList.remove("is-active");
      chip.classList.add("is-active");
      applyFilter((chip.dataset.filter || "all").toLowerCase());
    });
  }

  applyFilter("all");
};

setupFilter({
  listSelector: "#project-grid",
  itemSelector: ".project-card",
  emptySelector: "#empty-state"
});

setupFilter({
  listSelector: "#post-list",
  itemSelector: ".post-item",
  emptySelector: "#post-empty"
});

// --- i18n: EN base, RU overlay, toggle persists in localStorage ---
const TRANSLATIONS_RU = {
  // common
  brand_name: "дарья королева",
  nav_home: "главная",
  nav_work: "опыт",
  nav_projects: "проекты",
  nav_posts: "посты",
  nav_contact: "контакты",
  toggle_alt: "Переключить язык",
  // index — hero
  hero_name: "Дарья Королева",
  hero_p1: "Бизнес-аналитик в команде «Риски Технологий» Управления операционных рисков Сбера: работаю с технологическими и операционными инцидентами, формирую бизнес-требования к системам и помогаю выстраивать методологическую базу нового вида риска — «Риск изменений».",
  hero_p2: "До Сбера два года занималась проектными и операционными рисками в ГТЛК и Банке ДОМ.РФ — от ведения реестров рисков и оценки кредитного риска до утверждения BIA и расследований инцидентов непрерывности деятельности. Раньше — private equity в Milestone Capital и стажировка в СОГАЗ.",
  hero_p3: "Магистратура НИУ ВШЭ по управлению цифровым продуктом (бизнес-информатика, 2025) и бакалавриат Финансового университета по управлению финансовыми рисками и страхованию (экономика, 2023).",
  hero_p4: "Помимо работы — большой теннис на призовом уровне (международные и российские турниры), академический вокал, горные лыжи, классическая литература и бег.",
  // footer / contact
  contact_eyebrow: "контакты",
  contact_title: "Связаться",
  contact_email: "почта",
  contact_telegram: "телеграм",
  contact_cv: "резюме (pdf)",
  // work — CV banner
  cv_button: "скачать резюме",
  // work — experience
  work_exp_eyebrow: "опыт",
  work_exp_title: "Где я работала",
  work_sber_company: "Сбер",
  work_gtlk_company: "ГТЛК",
  work_dom_company: "Банк ДОМ.РФ · ДОМ.РФ",
  work_2021_company: "Milestone Capital · СОГАЗ",
  work_sber_date: "АПР 2024 — Н.В.",
  work_sber_meta: "Full-time · Москва",
  work_sber_role: "Бизнес-аналитик — Управление операционных рисков, команда «Риски Технологий»",
  work_sber_period: "Апр 2024 — наст. время",
  work_sber_b1: "Анализ технологических ИТ-инцидентов и инцидентов операционного риска: выявление причин и расследования, работа в Service Manager.",
  work_sber_b2: "Формирование бизнес-требований к системам, описание бизнес-процессов; понимание продуктового цикла.",
  work_sber_b3: "Релизный и производственный процесс, участие в построении управления изменениями.",
  work_sber_b4: "Сбор потребностей внутренних пользователей, взаимодействие с кросс-функциональными командами (ИТ, продукт, бизнес).",
  work_sber_b5: "Аналитика и координация проекта с AI-моделью («Сканер-моделей»).",
  work_sber_b6: "Участие в выстраивании методологической базы нового вида риска — «Риск изменений».",
  work_sber_b7: "Jira / Confluence для постановки задач, документации и сопровождения проектов.",

  work_gtlk_date: "ИЮЛ 2023 — АПР 2024",
  work_gtlk_meta: "Full-time · ~10 мес · Москва",
  work_gtlk_role: "Главный специалист — Дирекция по управлению рисками",
  work_gtlk_period: "Июл 2023 — Апр 2024",
  work_gtlk_b1: "Управление проектными рисками государственных программ развития лизинга: реестр рисков, оценка проектных рисков, контроль выполнения минимизирующих и контрольных мероприятий.",
  work_gtlk_b2: "Оценка кредитного риска: построение прогноза дебиторской задолженности по клиентам.",
  work_gtlk_b3: "Оценка финансовых рисков: достаточность средств для исполнения государственных программ.",

  work_dom_date: "АПР 2022 — ИЮЛ 2023",
  work_dom_meta: "Full-time · 1 г 4 мес · Москва",
  work_dom_role1: "Ведущий специалист — Операционные риски и восстановление деятельности (Банк ДОМ.РФ)",
  work_dom_period1: "Июл 2022 — Июл 2023 · 1 г",
  work_dom_b11: "Утверждение результатов Business Impact Analysis (BIA) на Комитете по рискам по всем подразделениям.",
  work_dom_b12: "Расследование инцидентов непрерывности деятельности / ИТ / ИБ, событий операционного риска, работа с рисками.",
  work_dom_b13: "Анализ требований Банка России по операционной надёжности; подготовка отчётов о технических сбоях.",
  work_dom_role2: "Стажёр-специалист — Операционные риски (ДОМ.РФ)",
  work_dom_period2: "Апр 2022 — Июл 2022 · 4 мес",
  work_dom_b21: "Обработка массива данных: план закупок, режимы работы сотрудников, критичные доступы.",
  work_dom_b22: "Анализ положений Банка России по операционной надёжности (716-П, 787-П, 779-П).",
  work_dom_b23: "Подготовка данных для BIA — анализ более 600 бизнес-процессов.",
  work_dom_b24: "Анализ инцидентов ИБ на соответствие требованиям операционного риска.",

  work_2021_date: "2021",
  work_2021_meta: "Стажировки · 2021",
  work_milestone_role: "Private Equity Analyst — Milestone Capital",
  work_milestone_period: "Ноя 2021 — Мар 2022",
  work_milestone_b1: "Работа с базами данных при анализе компаний; фокус на бизнесы с recurring revenue.",
  work_milestone_b2: "Подготовка тизеров и кратких обзоров CIM.",
  work_milestone_b3: "Анализ финансовой отчётности, построение финансовой модели, отраслевые исследования.",
  work_sogaz_role: "Стажёр — Отдел урегулирования имущественных убытков физических лиц (СОГАЗ)",
  work_sogaz_period: "Июл 2021 — Ноя 2021",
  work_sogaz_b1: "Анализ документации, формирование архива, структурирование данных для дальнейшего использования.",

  // education
  edu_eyebrow: "образование",
  edu_title: "Образование",
  edu_msc_period: "2023 — 2025",
  edu_msc_h: "Магистратура · НИУ ВШЭ",
  edu_msc_p: "Управление цифровым продуктом, направление «Бизнес-информатика».",
  edu_bsc_period: "2019 — 2023",
  edu_bsc_h: "Бакалавриат · Финансовый университет",
  edu_bsc_p: "Управление финансовыми рисками и страхование, направление «Экономика».",

  // skills
  skills_eyebrow: "навыки и языки",
  skills_title: "Навыки и языки",
  skills_tools_eyebrow: "инструменты",
  skills_tools_h: "Jira · Confluence · SQL",
  skills_tools_p: "Описание бизнес-процессов, работа с инцидентами, управление изменениями, базовые знания об архитектуре моделей и ИТ-систем, product mindset, системное мышление.",
  skills_lang_eyebrow: "языки",
  skills_lang_h: "Русский · Английский (B1)",
  skills_lang_p: "Русский — родной, английский — Intermediate (B1).",

  // projects
  proj_eyebrow: "проекты и исследования",
  proj_title: "Исследовательские проекты и публикации",
  proj_pub_eyebrow: "публикация",
  proj_1_h: "Влияние пандемии на авиационную сферу",
  proj_1_p: "«Лизинг воздушных судов на примере ГТЛК» — анализ влияния ковид-кризиса на лизинг авиатехники.",
  proj_2_h: "Реализация ипотечного потенциала",
  proj_2_p: "«В монетарную цифровую эпоху» — статья о том, как цифровизация меняет ипотечный рынок.",
  proj_3_h: "Конвергенция страховых и банковских продуктов",
  proj_3_p: "О стирании границ между страховыми и банковскими продуктами и о новых гибридных предложениях.",
  proj_edu_eyebrow: "образовательные программы",
  proj_4_h: "ШУР ВТБ · KPMG Audit Week",
  proj_4_p: "Школа управления рисками ВТБ (ШУР) и образовательная программа КПМГ «Audit Week Online».",
  proj_case_eyebrow: "кейс-чемпионат",
  proj_5_h: "The Cup of Moscow · Russia 2020",
  proj_5_p: "Changellenge The Cup of Moscow, Russia 2020 — диплом «ТОП-25% лучших работ».",

  // posts
  posts_eyebrow: "посты",
  posts_title: "Заметки, ссылки, публикации",
  posts_filter_all: "все",
  posts_filter_telegram: "Telegram",
  posts_filter_article: "Статьи",
  posts_empty_eyebrow: "в работе",
  posts_empty_copy: "Записи появятся здесь — короткие заметки и ссылки на статьи и публикации.",

  // page titles
  page_title_home: "Дарья Королева",
  page_title_work: "Дарья Королева | Опыт",
  page_title_projects: "Дарья Королева | Проекты",
  page_title_posts: "Дарья Королева | Посты",
};

const LANG_STORAGE_KEY = "dk-lang";

function snapshotEnglish() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (!el.dataset.en) el.dataset.en = el.innerHTML;
  });
  const title = document.querySelector("title[data-i18n]");
  if (title && !title.dataset.en) title.dataset.en = title.textContent;
}

function applyLang(lang) {
  const norm = lang === "ru" ? "ru" : "en";
  document.documentElement.lang = norm;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (norm === "ru" && TRANSLATIONS_RU[key]) {
      el.innerHTML = TRANSLATIONS_RU[key];
    } else {
      el.innerHTML = el.dataset.en;
    }
  });
  const title = document.querySelector("title[data-i18n]");
  if (title) {
    const key = title.dataset.i18n;
    title.textContent =
      norm === "ru" && TRANSLATIONS_RU[key] ? TRANSLATIONS_RU[key] : title.dataset.en;
  }
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.textContent = norm === "en" ? "ru" : "en";
    btn.setAttribute("aria-label", norm === "en" ? "Switch to Russian" : "Switch to English");
  });
  try {
    localStorage.setItem(LANG_STORAGE_KEY, norm);
  } catch (e) {}
}

snapshotEnglish();
const urlLang = new URLSearchParams(window.location.search).get("lang");
const savedLang = (() => {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY);
  } catch (e) {
    return null;
  }
})();
const initialLang = urlLang === "ru" || urlLang === "en"
  ? urlLang
  : savedLang === "ru" ? "ru" : "en";
applyLang(initialLang);

document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = document.documentElement.lang === "ru" ? "en" : "ru";
    applyLang(next);
  });
});
