const dict = {

  ua: {

    navchapters: "Ролі",

    navhire: "Для замовлення",

    navcanon: "Самовираження",

    kicker: "KOSATIKS GROUP",

    title: "Три ролі. Одна система хабів.",

    subtitle:

      "Це umbrella-портал моїх хабів: тут є клієнтські напрями, власні системи, активні проєкти й дослідницькі артефакти.<br>Відкрий картку, щоб побачити, як саме нею користуватися.",

    guide:

      "Це не просто список назв. У кожній картці є логіка: що це за хаб, кому він потрібен, який у нього формат і куди вести людину далі - на repo, site, форму або research-маршрут.",

    foot:
      `Немає загальної контактної форми. Кожен offer має свій intake, щоб заявки потрапляли правильно.<br><span class="footer-note__minor">*Зауважте: приймаю лише 2-3 проєкти на місяць; кількість слотів обмежена.</span>`,

    rstrategist: "Стратегиня",

    rproducer: "Продюсерка",

    rcreator: "Мисткиня",

    fall: "Усі",

    fhire: "Для замовлення",

    fself: "Самовираження",

    fproject: "Самовираження",

    mOverview: "Огляд",

    mLinks: "Лінки",

    mForm: "Форма",

    cardHire: "Для замовлення",

    cardLinks: "Лінки",

    mClose: "Закрити",

    hintMe: "Я",

    hintEco: "Екосистема",

    btnOpen: "Відкрити вікно",

    socialKicker: "Соцмережі + маршрути",

    socialTitle: "Соцмаршрути",

    socialSubtitle:
      "Цей нижній шар працює як точка входу до link-агрегаторів, публічних профілів і зовнішніх маршрутів. Я активно будую тематичний контент для стратегині, продюсерки та мисткині, тож цей блок ростиме разом із цими просторами.",

    placeholder: "Під цей фільтр поки немає карток.",

    modeSummary: {

      all: "Усі",

      hire: "Для замовлення",

      self: "Самовираження",

      project: "Самовираження",

    },

    overviewIntro: "Що це",

    overviewBullets: "Що тут відбувається",

    overviewFormat: "Як це працює",

    overviewProjects: "Пов'язані проєкти",

    linksIntro:

      "Тут зібрані мої власні чи соціальні лінки: GitHub-репозиторії, сайти, нотатки, архіви й робочі напрацювання. Це шар для знайомства з тим, що я вже зібрала й куди можна піти далі.",

    linksIntroHire:

      "Тут зібрані додаткові лінки для клієнтського хаба: кейси, приклади виконаних рішень, портфоліо-маршрути або супровідні матеріали. Форма лишається основним входом для нового запиту.",

    formIntro:

      "Для клієнтських хабів тут лишається вбудований intake, щоб заявка одразу потрапляла в правильний маршрут.",

    draftLabel: "draft",

    openExternal: "Відкрити",

    notReady: "Ще в підготовці",

    roleNames: {

      strategist: "Стратегиня",

      producer: "Продюсерка",

      creator: "Мисткиня",

    },

  },
  en: {

    navchapters: "Roles",

    navhire: "For hire",

    navcanon: "Self",

    kicker: "KOSATIKS GROUP",

    title: "Three roles. One hub system.",

    subtitle:

      "This is the umbrella portal for my hubs: client-facing directions, self systems, active projects, and research artifacts.<br>Open any card to see what the hub is actually for.",

    guide:

      "Each card is operational, not decorative: it explains what the hub does, who it is for, how it works, and where the next route should go — repo, site, form, or research layer.",

    foot:
      `No generic contact form. Each offer has its own intake so requests land correctly.<br><span class="footer-note__minor">*Note: I take only 2-3 projects per month; availability is limited.</span>`,

    rstrategist: "Strategist",

    rproducer: "Producer",

    rcreator: "Creator",

    fall: "All",

    fhire: "For hire",

    fself: "Self",

    fproject: "Self",

    mOverview: "Overview",

    mLinks: "Links",

    mForm: "Form",

    cardHire: "For hire",

    cardLinks: "Links",

    mClose: "Close",

    hintMe: "Me",

    hintEco: "Ecosystem",

    btnOpen: "Open window",

    socialKicker: "Social routing",

    socialTitle: "Social routing",

    socialSubtitle:

      "Use this footer layer for link aggregators, public profiles, GitHub routes, and external sites. I am also actively building role-based content across strategist, producer, and creator streams, so this layer will grow with those social spaces.",

    placeholder: "No cards match this filter yet.",

    modeSummary: {

      all: "All",

      hire: "For hire",

      self: "Self",

      project: "Self",

    },

    overviewIntro: "What it is",

    overviewBullets: "What happens here",

    overviewFormat: "How it works",

    overviewProjects: "Related projects",

    linksIntro:

      "These links point to my own spaces or social: GitHub repos, sites, notes, archives, and work in progress. Use this layer to explore what already exists across my self-directed projects.",

    linksIntroHire:

      "These links support a client-facing hub: successful case examples, portfolio proof, build references, or extra context. The embedded form stays the main intake for a new request.",

    formIntro:

      "For client-facing hubs this tab keeps the embedded intake, so requests land in the right route immediately.",

    draftLabel: "draft",

    openExternal: "Open",

    notReady: "In preparation",

    roleNames: {

      strategist: "Strategist",

      producer: "Producer",

      creator: "Creator",

    },

  },

};



const roleMeta = {

  strategist: {

    title: { ua: "Стратегиня", en: "Strategist" },

    desc: {

      ua: "Хаби, де я працюю з позиціонуванням, партнерствами, інвестиційною оптикою та персональними системами напрямку.",

      en: "Hubs for positioning, partnerships, investment thinking, and direction-setting personal systems.",

    },

  },

  producer: {

    title: { ua: "Продюсерка", en: "Producer" },

    desc: {

      ua: "Хаби, де я будую системи, операції, MVP, дослідження, експерименти та керую логікою виконання.",

      en: "Hubs where I build systems, operations, MVPs, research loops, experiments, and execution logic.",

    },

  },

  creator: {

    title: { ua: "Мисткиня", en: "Creator" },

    desc: {

      ua: "Хаби, де я працюю з сенсами, текстами, книгами, квестами, творчою практикою та публікаціями.",

      en: "Hubs for meaning, books, quests, creative practice, and publication layers.",

    },

  },

};



const urls = {

  hireForm: "https://tally.so/r/5B9e6P",

  selfForm: "https://tally.so/r/BzdGlR",

  mentorshipForm: "https://forms.gle/7LAMVQRjHwhQrbQC6",

  ventureSite: "https://sites.google.com/view/ai-venture-studio?usp=sharing",

  lifeOSNotion:

    "https://www.notion.so/kosatiks-group/K-Life-Planner-Build-7fded99a6f8c8302a55b010fb56a6288?source=copy_link",

  kosatiksRepo: "https://github.com/TEZv/Kosatiks-Group",

  githubProfile: "https://github.com/TEZv",

  krndOrg: "https://github.com/K-RnD-Lab",

  masterRepo: "https://github.com/TEZv/master_prep_2026",

  masterDocs: "https://github.com/TEZv/master_prep_2026/tree/main/docs",

  hfOrg: "https://huggingface.co/K-RnD-Lab",

};



const socialLinks = [
  {
    label: { ua: "Linktree", en: "Linktree" },
    hint: { ua: "Агрегатор", en: "Aggregator" },
    note: {
      ua: "Одна routing-сторінка для публічних профілів, офер-лінків і входів у хаби.",
      en: "One routing page for public profiles, offer links, and hub entrances.",
    },
    url: "https://linktr.ee/kosatiks-demo",
  },
  {
    label: { ua: "Beacons", en: "Beacons" },
    hint: { ua: "Агрегатор", en: "Aggregator" },
    note: {
      ua: "Другий link-hub для експериментів, альтернативних профілів або campaign-based маршрутизації.",
      en: "A second link hub for experiments, alternate profiles, or campaign-based routing.",
    },
    url: "https://beacons.ai/kosatiks-demo",
  },
  {
    label: { ua: "LinkedIn", en: "LinkedIn" },
    hint: { ua: "Рольовий потік", en: "Role stream" },
    note: {
      ua: "Найкращий простір для подачі стратегині та продюсерки, case-логіки та ecosystem-thinking.",
      en: "Best place for strategist and producer framing, case logic, and ecosystem thinking.",
    },
    url: "https://www.linkedin.com/in/kosatiks-demo/",
  },
  {
    label: { ua: "Instagram", en: "Instagram" },
    hint: { ua: "Авторський потік", en: "Creator stream" },
    note: {
      ua: "М’якший простір для авторського контенту, візуальних фрагментів і наративних входів.",
      en: "A softer surface for creator-led content, visual fragments, and narrative entries.",
    },
    url: "https://www.instagram.com/kosatiks.demo/",
  },
];

const specialEntries = {

  ecosystem: {

    title: { ua: "Екосистема Kosatiks Group", en: "Kosatiks Group Ecosystem" },

    role: "producer",

    modes: ["hire", "self", "project"],

    code: "KG",

    summary: {

      ua: "Пояснення, як читати цей сайт: що тут клієнтське, що власне, що проєктне і як між цим рухатися без хаосу.",

      en: "A routing layer for reading the site correctly: what is client-facing, what is personal, what is project-based, and how to move through it without chaos.",

    },

    overview: {

      ua: "Kosatiks Group — це не одна послуга і не одна persona. Це агрегатор моїх ролей, хабів і маршрутів взаємодії. Тут важливо не просто подивитися назву, а зрозуміти формат: одні картки ведуть до клієнтської співпраці, інші показують мої внутрішні системи, а треті — активні проєкти або research-напрями.",

      en: "Kosatiks Group is not a single service and not a single persona. It is an umbrella router for my roles, hubs, and interaction paths. The key is to understand the format: some cards route to client collaboration, some show internal systems, and others represent active projects or research directions.",

    },

    bullets: {

      ua: [

        "For hire: коли хаб можна замовити як роботу, консультацію або структурування.",

        "Self & Supply only: коли це мій внутрішній шар, філософія, архів, база або власна операційна система.",

        "Project: коли це активна ініціатива, прототип, дослідження або публічний експеримент.",

      ],

      en: [

        "For hire: a client-facing route for work, consulting, or structured execution.",

        "Self & Supply only: an internal layer, archive, philosophy, or personal operating system.",

        "Project: an active initiative, prototype, research line, or public experiment.",

      ],

    },

    format: {

      ua: "Найкращий спосіб користування сайтом: обираєш роль зверху, далі звужуєш режимом, а потім відкриваєш картки. Саме в модалці видно, який наступний крок доречний: форма, repo, live site, Google Site, Notion або GitHub-організація.",

      en: "Best use pattern: choose a role first, then narrow by mode, and only then open cards. The modal makes the next step explicit: form, repo, live site, Google Site, Notion, or GitHub organization.",

    },

    media: {

      type: "video",

      src: "./assets/video/k-logo.mp4",

      caption: {

        ua: "Тут сходяться ролі, хаби, проєкти та зовнішні маршрути.",

        en: "This is where roles, hubs, projects, and external routes meet.",

      },

    },

    links: [

      { label: { ua: "Kosatiks Group repo", en: "Kosatiks Group repo" }, note: { ua: "вихідний код сайту", en: "site source code" }, url: urls.kosatiksRepo, kind: "repo" },

      { label: { ua: "K-RnD Lab", en: "K-RnD Lab" }, note: { ua: "дослідницька організація", en: "research organization" }, url: urls.krndOrg, kind: "org" },

      { label: { ua: "Master trainer repo", en: "Master trainer repo" }, note: { ua: "research-проєкт у межах K-RnD", en: "research project inside K-RnD" }, url: urls.masterRepo, kind: "project" },

    ],

    logo: "./assets/img/k-logo.jpg",

  },

  me: {

    title: { ua: "Про мене", en: "About Me" },

    role: "creator",

    modes: ["self"],

    code: "ME",

    summary: {

      ua: "Я зібрала Kosatiks Group як місце, де стратегія, продюсування і творчість не розриваються, а працюють разом.",

      en: "I built Kosatiks Group as a place where strategy, production, and creativity work together rather than competing with each other.",

    },

    overview: {

      ua: "Я працюю не з однієї ролі. Для мене важливо одночасно мислити структурою, доводити ідеї до виконання і будувати сенси. Саме тому на сайті є кілька хабів: одні показують, що можна замовити в мене як у фахівчині, інші — як я організовую власну систему, дослідження, тексти й експерименти.",

      en: "I do not work from a single role. I care about structure, execution, and meaning at the same time. That is why the site contains multiple hubs: some show what can be commissioned from me as a specialist, others show how I organize my own systems, research, writing, and experiments.",

    },

    bullets: {

      ua: [

        "Стратегиня: напрям, позиціонування, логіка системи.",

        "Продюсерка: execution, структура, MVP, операційність.",

        "Мисткиня: тексти, наратив, естетика, publishing і Life OS.",

      ],

      en: [

        "Strategist: direction, positioning, system logic.",

        "Producer: execution, structure, MVPs, operations.",

        "Creator: narrative, aesthetics and publishing.",

      ],

    },

    format: {

      ua: "Kosatiks Group — це в першу чергу рамка, яка допомагає не губитися між ролями. Далі вже кожен окремий хаб відкриває свою точну функцію.",

      en: "Kosatiks Group is first and foremost a frame that keeps these roles coherent. Each hub then reveals a specific function inside that frame.",

    },

    media: {

      type: "video",

      src: "./assets/video/k4.mp4",

      caption: {

        ua: "Ядро Kosatiks Group: ролі, філософія, подача.",

        en: "The core of Kosatiks Group: roles, philosophy, and presence.",

      },

    },

    links: [

      { label: { ua: "GitHub профіль", en: "GitHub profile" }, note: { ua: "публічні репозиторії", en: "public repositories" }, url: urls.githubProfile, kind: "profile" },

      { label: { ua: "Kosatiks Group repo", en: "Kosatiks Group repo" }, note: { ua: "сайт і структура", en: "site and structure" }, url: urls.kosatiksRepo, kind: "repo" },

    ],

    logo: "./assets/img/k-me-logo.jpg",

  },

};



const HUBS = [

  {

    id: "identity-brand",

    code: "K BH",

    role: "strategist",

    modes: ["hire", "self"],

    title: { ua: "K Identity & Brand Hub", en: "K Identity & Brand Hub" },

    summary: { ua: "Позиціонування, смислова опора бренду, повідомлення і система самоопису.", en: "Positioning, messaging, brand meaning, and self-description systems." },

    overview: { ua: "Це хаб про те, як назвати себе, свій напрям і свою відмінність так, щоб це трималося не на випадкових словах, а на структурі. Тут може народжуватися і клієнтське позиціонування, і мій власний бренд-щоденник.", en: "This hub is about naming yourself, your direction, and your difference in a way that is structural rather than random. It can support both client positioning and my own internal brand diary." },

    bullets: { ua: ["позиціонування і рамка того, як себе пояснювати", "message architecture для сторінок, bio, deck і hub-карток", "бренд як сенсова система, а не лише візуальна обгортка"], en: ["positioning and the frame for explaining yourself clearly", "message architecture for pages, bio, deck, and hub cards", "brand as a meaning system, not only a visual layer"] },

    format: { ua: "Клієнтський маршрут тут іде у форму запиту. Self-layer потрібен мені для фіксації власного голосу, тональності й канону подачі.", en: "The client route goes into an intake form. The self layer is where I keep track of voice, tone, and presentation canon for myself." },

    logo: "./assets/img/k-logo.jpg",

    media: { type: "image", src: "./assets/img/k-logo.jpg", caption: { ua: "Хаб про формулювання себе й своєї рамки.", en: "A hub for defining yourself and your framing." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "для клієнтського запиту", en: "for client requests" }, url: urls.hireForm, kind: "form" },

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "внутрішній шар / архів", en: "internal layer / archive" }, url: urls.selfForm, kind: "self" },

    ],

  },

  {

    id: "community-partnerships",

    code: "K PH",

    role: "strategist",

    modes: ["hire", "self"],

    title: { ua: "K Community & Partnerships Hub", en: "K Community & Partnerships Hub" },

    summary: { ua: "Партнерські карти, community-дизайн, вихід на потрібних людей без шуму.", en: "Partner maps, community design, and focused outreach without noise." },

    overview: { ua: "Це хаб не про нескінченний нетворкінг, а про якісне збирання свого кола: хто реально потрібен, як з ними будувати контакт і як не витрачати ресурс на хаотичні розмови без наслідку.", en: "This hub is not about endless networking. It is about building the right circle, knowing who matters, how to approach them, and how not to waste energy on random conversations that lead nowhere." },

    bullets: { ua: ["карта партнерств і цільових контактів", "формати присутності: community, outreach, handshakes, collabs", "структура для власного або клієнтського кола зв’язків"], en: ["partner map and target contact architecture", "presence formats: community, outreach, handshakes, collaborations", "structure for either a client network or my own relationship layer"] },

    format: { ua: "Тут можна замовляти стратегію партнерств або використовувати хаб як мою внутрішню карту social-garden логіки.", en: "This can be commissioned as a partnership strategy layer or used internally as my own social-garden map." },

    logo: "./assets/img/k-logo.jpg",

    media: { type: "image", src: "./assets/img/k-logo.jpg", caption: { ua: "Карта зв’язків має бути вибірковою, а не хаотичною.", en: "A relationship map should be selective, not chaotic." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "клієнтський маршрут", en: "client route" }, url: urls.hireForm, kind: "form" },

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "внутрішні нотатки й social garden", en: "internal notes and social garden" }, url: urls.selfForm, kind: "self" },

    ],

  },

  {

    id: "investments",

    code: "K IH",

    role: "strategist",

    modes: ["hire", "self"],

    title: { ua: "K Investments Hub", en: "K Investments Hub" },

    summary: { ua: "Теза, фільтри рішень, інвестиційна логіка та рамка оцінювання можливостей.", en: "Thesis, decision filters, investment logic, and opportunity framing." },

    overview: { ua: "Це хаб для тих випадків, коли важливо не просто реагувати на можливості, а мати власну рамку відбору. Тут інвестиції читаються широко: як капітал, як ризик, як розподіл уваги і як дисципліна рішення.", en: "This hub is for situations where reacting is not enough and a selection frame is needed. Investments are treated broadly here: as capital, as risk, as attention allocation, and as decision discipline." },

    bullets: { ua: ["інвестиційна теза і red flags", "рішення не за FOMO, а за власним фреймом", "власний або клієнтський investment memo-підхід"], en: ["investment thesis and red-flag filters", "decisions based on a frame instead of FOMO", "personal or client-facing memo logic"] },

    format: { ua: "Це радше структурний і дослідницький хаб, ніж обіцянка фінансових порад. Він потрібен для мислення, відбору та аналітичної рамки.", en: "This is primarily a structural and analytical hub rather than a promise of financial advice. It supports thinking, filtering, and decision framing." },

    logo: "./assets/img/k-logo.jpg",

    media: { type: "image", src: "./assets/img/k-logo.jpg", caption: { ua: "Інвестиційна рамка теж має свій канон і дисципліну.", en: "Investment thinking also needs its own canon and discipline." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "для структурних запитів", en: "for structural requests" }, url: urls.hireForm, kind: "form" },

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "внутрішній investment journal", en: "internal investment journal" }, url: urls.selfForm, kind: "self" },

    ],

  },

  {

    id: "life-os",

    code: "K LO",

    role: "strategist",

    modes: ["hire", "self"],

    title: { ua: "K Life OS", en: "K Life OS" },

    summary: { ua: "Life OS як система сфер життя, планування, рефлексії, нотаток і маршруту до власного порядку.", en: "Life OS as a system for life spheres, planning, reflection, notes, and personal order." },

    overview: { ua: "Це один з моїх базових self-хабів. Саме тут сходяться 12 сфер життя, planning logic, записи, враження, власні ритми та продукти, які можуть вирости з цієї системи далі.", en: "This is one of my core self hubs. It brings together the 12 life spheres, planning logic, notes, impressions, rhythms, and future products that can grow out of this system." },

    bullets: { ua: ["особистий operating system замість хаосу в нотатках", "рамка для блогів, вражень, життєвих маршрутів і власних шаблонів", "можливий майбутній продукт або Notion-based layer"], en: ["a personal operating system instead of scattered notes", "a frame for blogs, impressions, life routes, and personal templates", "a possible future product or Notion-based layer"] },

    format: { ua: "Поки найкращий маршрут тут — через Notion build. Далі це може стати продуктом, бібліотекою шаблонів або формою запиту на персоналізацію без прямого Calendly-спаму.", en: "For now the best route is through the Notion build. Later this can become a product, a template library, or a request-based customization flow without turning into Calendly spam." },

    logo: "./assets/img/k-logo.jpg",

    media: { type: "image", src: "./assets/img/k-logo.jpg", caption: { ua: "Life OS — це і нотатки, і ритми, і майбутні продукти.", en: "Life OS holds notes, rhythms, and future product logic." } },

    links: [

      { label: { ua: "Notion build", en: "Notion build" }, note: { ua: "поточна база K Life Planner / OS", en: "current K Life Planner / OS base" }, url: urls.lifeOSNotion, kind: "notion" },

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "внутрішнє продовження", en: "internal continuation" }, url: urls.selfForm, kind: "self" },

    ],

  },

  {

    id: "automation-ai-ops",

    code: "K AI",

    role: "producer",

    modes: ["hire", "project"],

    title: { ua: "K Automation / AI Ops Hub", en: "K Automation / AI Ops Hub" },

    summary: { ua: "Автоматизації, AI-driven flow, no-code ланцюги і збірка робочих систем.", en: "Automations, AI-driven flows, no-code chains, and working systems." },

    overview: { ua: "Це хаб для процесів, які не повинні робитися руками щоразу заново. Тут я мислю не про «заміну людини», а про звільнення уваги, збирання маршруту даних і складання системи, яка реально працює в повсякденному циклі.", en: "This hub is for processes that should not be rebuilt manually every time. The focus is not on replacing a human, but on freeing attention, routing data correctly, and building a system that actually works in daily cycles." },

    bullets: { ua: ["AI ops, no-code і lightweight backend-логіка", "автоматизації для даних, контенту, заявок і внутрішніх процесів", "окремі клієнтські або проєктні збірки"], en: ["AI ops, no-code, and lightweight backend logic", "automations for data, content, intake, and internal workflows", "client builds and project-based system packages"] },

    format: { ua: "У клієнтському режимі це можна замовити як впровадження. У проєктному — це частина власних ініціатив і експериментів, які потім можуть ставати окремими кейсами.", en: "In client mode this can be commissioned as implementation work. In project mode it becomes part of my own initiatives and experiments that can later turn into standalone cases." },

    logo: "./assets/img/k-me-logo.jpg",

    media: { type: "video", src: "./assets/img/k-me-logo.jpg", caption: { ua: "Продюсерський хаб для систем і flow-архітектури.", en: "A producer hub for systems and flow architecture." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "клієнтське впровадження", en: "client implementation" }, url: urls.hireForm, kind: "form" },

      { label: { ua: "Project route", en: "Project route" }, note: { ua: "для окремих ініціатив", en: "for standalone initiatives" }, url: urls.selfForm, kind: "project" },

    ],

  },

  {

    id: "client-projects",

    code: "K CP",

    role: "producer",

    modes: ["hire"],

    title: { ua: "K Client Projects Hub", en: "K Client Projects Hub" },

    summary: { ua: "Хаб для збирання клієнтських проєктів, delivery-логіки, статусів і впорядкування виконання.", en: "A hub for client project delivery, status logic, and execution order." },

    overview: { ua: "Це операційний хаб: коли важливо не просто придумати напрям, а довести роботу до ритму, дедлайнів, прозорої комунікації й видимого стану справ. Саме сюди добре лягає клієнтське execution-мислення.", en: "This is the operational hub: it is for taking work beyond ideas into rhythm, deadlines, transparent communication, and visible status. It is the natural home of client execution thinking." },

    bullets: { ua: ["delivery pipeline і статуси без хаосу", "структура клієнтського виконання й огляд прогресу", "місце, де клієнтський запит стає керованим процесом"], en: ["delivery pipeline and status visibility without chaos", "client execution structure and progress overview", "the place where a request turns into a manageable process"] },

    format: { ua: "Це чисто клієнтський шар. Якщо людині треба не лише стратегія, а ще й зібране доведення до виконання — маршрут іде сюди.", en: "This is a purely client-facing layer. If someone needs not only strategy but also structured follow-through, this is the correct route." },

    logo: "./assets/img/k-me-logo.jpg",

    media: { type: "image", src: "./assets/img/k-me-logo.jpg", caption: { ua: "Execution теж має виглядати як система, а не як пожежогасіння.", en: "Execution should look like a system, not like firefighting." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "для клієнтських проєктів", en: "for client projects" }, url: urls.hireForm, kind: "form" },

    ],

  },

  {

    id: "venture-studio",

    code: "K VH",

    role: "producer",

    modes: ["hire", "project"],

    title: { ua: "K Venture Studio Hub", en: "K Venture Studio Hub" },

    summary: { ua: "MVP, venture build, упаковка ідей у робочі продукти й окремі venture-маршрути.", en: "MVPs, venture builds, and turning ideas into working products and venture routes." },

    overview: { ua: "Це не про «ще одну ідею». Це хаб для тих випадків, коли ідею треба стиснути до MVP, перевірити, упакувати й відпустити в світ — або чесно закрити, якщо вона не тримається. Саме тому venture виділений окремо, хоча й може перетинатися з mentorship.", en: "This is not about just another idea. It is a hub for compressing an idea into an MVP, testing it, packaging it, and shipping it — or closing it honestly if it does not hold. That is why venture is separate even if it intersects with mentorship." },

    bullets: { ua: ["MVP-мислення, а не нескінченна підготовка", "venture experimentation і product packaging", "може існувати окремо від mentorship, хоча й торкається його"], en: ["MVP thinking rather than endless preparation", "venture experimentation and product packaging", "can exist separately from mentorship while still touching it"] },

    format: { ua: "У цьому хабі добре живуть окремі build-напрями. Для зовнішнього перегляду я лишаю Google Site, а GitHub і Kosatiks — як source-of-truth і маршрутизатор.", en: "This hub is a good home for standalone build directions. Google Site can stay as the lightweight presentation layer while GitHub and Kosatiks remain the source of truth and router." },

    logo: "./assets/img/favicon.png",

    media: { type: "image", src: "./assets/img/favicon.png", caption: { ua: "Venture Studio як окремий build-маршрут.", en: "Venture Studio as a standalone build route." } },

    links: [

      { label: { ua: "Google Site", en: "Google Site" }, note: { ua: "поточний live-майданчик", en: "current live layer" }, url: urls.ventureSite, kind: "site" },

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "співпраця або build-запит", en: "collaboration or build request" }, url: urls.hireForm, kind: "form" },

    ],

  },

  {

    id: "krnd-lab",

    code: "K RD",

    role: "producer",

    modes: ["project", "hire"],

    title: { ua: "K-RnD Lab", en: "K-RnD Lab" },

    summary: { ua: "Дослідницький хаб для гіпотез, аналітики, експериментів і публічних кейсів. Сюди ж лягає Master Trainer.", en: "A research hub for hypotheses, analytics, experiments, and public cases. This is also where Master Trainer fits." },

    overview: { ua: "K-RnD Lab — це мій research-layer. Тут зручно тримати те, що є на стику науки, технологій, аналітики та системного мислення. Саме сюди логічно відносити Master Trainer / підготовку до магістратури: це не окремий «сайт про магістратуру», а дослідницький проєкт з метриками, діаграмами, прогресом і публічним кейсом.", en: "K-RnD Lab is my research layer. It holds work at the intersection of science, technology, analytics, and systems thinking. This is exactly where Master Trainer / master's preparation belongs: not as a separate site about admission, but as a research project with metrics, charts, progress, and a public case-study angle." },

    bullets: { ua: ["гіпотези, експерименти, дослідницька рамка і public proof", "analytics-first подача, діаграми, evidence layer", "сюди інтегруються проєкти на кшталт Master Trainer як дослідження"], en: ["hypotheses, experiments, research framing, and public proof", "analytics-first presentation with charts and evidence", "projects like Master Trainer slot here as research work"] },

    format: { ua: "Якщо мені треба показати публічне дослідження, технічний кейс або аналітичний артефакт — він має лягати саме сюди. Для клієнтів це радше proof-of-thinking; для мене — окремий research-мотор.", en: "If I need to present a public research case, technical experiment, or analytical artifact, it should live here. For clients it acts as proof-of-thinking; for me it is a dedicated research engine." },

    projects: { ua: [{ title: "Master Trainer / підготовка до магістратури", body: "Трекер підготовки з матеріалами, прогресом, аналітикою та візуальними зрізами. Це research-story про дисципліну, систему і вимірюваний прогрес." }], en: [{ title: "Master Trainer / master's preparation research", body: "A preparation tracker with materials, progress logging, analytics, and visual reporting. It works as a research story about discipline, systems, and measurable progress." }] },

    logo: "./assets/img/hubs/krnd-lab.png",

    media: { type: "image", src: "./assets/img/hubs/krnd-lab.png", caption: { ua: "K-RnD Lab — ядро research-напрямів у Kosatiks.", en: "K-RnD Lab is the research core inside Kosatiks." } },

    links: [

      { label: { ua: "K-RnD Lab org", en: "K-RnD Lab org" }, note: { ua: "GitHub-організація", en: "GitHub organization" }, url: urls.krndOrg, kind: "org" },

      { label: { ua: "Master trainer repo", en: "Master trainer repo" }, note: { ua: "research-проєкт у GitHub", en: "research project on GitHub" }, url: urls.masterRepo, kind: "repo" },

      { label: { ua: "Master trainer docs", en: "Master trainer docs" }, note: { ua: "trainer + report shell у repo", en: "trainer + report shell in repo" }, url: urls.masterDocs, kind: "docs" },

      { label: { ua: "Hugging Face org", en: "Hugging Face org" }, note: { ua: "ML-напрям, якщо доречно", en: "ML-facing route if relevant" }, url: urls.hfOrg, kind: "lab" },

    ],

  },

  {

    id: "ops-systems",

    code: "K OS",

    role: "producer",

    modes: ["hire"],

    title: { ua: "K Ops & Systems Hub", en: "K Ops & Systems Hub" },

    summary: { ua: "Системи, SOP, документація, опорні ритуали і нормальна внутрішня архітектура процесів.", en: "Systems, SOPs, documentation, rituals, and internal process architecture." },

    overview: { ua: "Це хаб для тих запитів, де проблема не в ідеї, а в тому, що ніхто не може відтворити процес без хаосу. Тут потрібні SOP, ясність, ритуали й документована опора, щоб усе не трималося тільки в голові.", en: "This hub is for requests where the problem is not the idea but the fact that nobody can reproduce the process cleanly. It is about SOPs, clarity, rituals, and documented structure so that the system does not live only in someone’s head." },

    bullets: { ua: ["внутрішні системи та документація", "процеси, що можна передати й повторити", "операційна ясність без зайвої бюрократії"], en: ["internal systems and documentation", "processes that can be transferred and repeated", "operational clarity without unnecessary bureaucracy"] },

    format: { ua: "Клієнтський хаб для тих, кому вже потрібне не натхнення, а нормальна процесна опора.", en: "A client-facing hub for people who no longer need inspiration but solid process support." },

    logo: "./assets/img/k-me-logo.jpg",

    media: { type: "image", src: "./assets/img/k-me-logo.jpg", caption: { ua: "Система має бути передаваною, а не тільки зрозумілою авторці.", en: "A system should be transferable, not only understandable to its author." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "ops / systems робота", en: "ops / systems work" }, url: urls.hireForm, kind: "form" },

    ],

  },

  {

    id: "leadership-team",

    code: "K LT",

    role: "producer",

    modes: ["hire"],

    title: { ua: "K Leadership / Team Hub", en: "K Leadership / Team Hub" },

    summary: { ua: "Командна структура, ролі, правила рішень і зменшення friction усередині команди.", en: "Team structure, role clarity, decision rules, and reduced internal friction." },

    overview: { ua: "Це хаб для ситуацій, коли команда є, але її не зібрано в нормальну рамку: ролі розмиті, зустрічі не працюють, відповідальність плаває. Тут потрібне не натхнення, а здорове структурування людей і рішень.", en: "This hub is for cases where a team exists but is not framed properly: roles are fuzzy, meetings do not work, and responsibility keeps drifting. What is needed here is not motivation but healthy structuring of people and decisions." },

    bullets: { ua: ["рольова ясність і межі відповідальності", "decision rules замість нескінченних погоджень", "командний ритм, який реально тримається"], en: ["role clarity and responsibility boundaries", "decision rules instead of endless approvals", "a team rhythm that actually holds"] },

    format: { ua: "Це client-facing хаб для тих, кому треба не просто «лідити», а зробити командну систему адекватною.", en: "This is a client-facing hub for those who need more than generic leadership talk and want a functional team system instead." },

    logo: "./assets/img/k-me-logo.jpg",

    media: { type: "image", src: "./assets/img/k-me-logo.jpg", caption: { ua: "Командна структура теж є частиною продюсування.", en: "Team structure is part of production work too." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "командний або leadership-запит", en: "team or leadership request" }, url: urls.hireForm, kind: "form" },

    ],

  },

  {

    id: "experiments",

    code: "K EX",

    role: "producer",

    modes: ["hire", "project"],

    title: { ua: "K Experiments Hub", en: "K Experiments Hub" },

    summary: { ua: "Швидкі тести, валідація, гіпотези й безпечний простір для перевірки ідей до масштабування.", en: "Rapid tests, validation, hypotheses, and a safe space for checking ideas before scaling." },

    overview: { ua: "Це мій легший experimental layer. Тут важливо швидко перевіряти й чесно дивитися на результат. Не все має ставати великим продуктом або довгим проєктом — частину речей краще відсіювати експериментом.", en: "This is my lighter experimental layer. The point is to test quickly and look at results honestly. Not everything should become a large product or long project — some things should be filtered out through experiments first." },

    bullets: { ua: ["гіпотеза -> тест -> висновок", "малий safe-to-fail формат перед масштабуванням", "добре лягає і в клієнтські спринти, і у власні ініціативи"], en: ["hypothesis -> test -> conclusion", "a small safe-to-fail format before scaling", "works for both client sprints and personal initiatives"] },

    format: { ua: "Це міст між execution і research. Саме тому хаб живе в продюсерському шарі, але може працювати і як окремий project-mode маршрут.", en: "This hub bridges execution and research. That is why it lives in the producer layer while still functioning as a standalone project-mode route." },

    logo: "./assets/img/k-me-logo.jpg",

    media: { type: "image", src: "./assets/img/k-me-logo.jpg", caption: { ua: "Експеримент — це не хаос, а спосіб валідувати рух.", en: "An experiment is not chaos; it is a way to validate movement." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "швидкі перевірки або спринти", en: "rapid validation or sprint request" }, url: urls.hireForm, kind: "form" },

      { label: { ua: "Project route", en: "Project route" }, note: { ua: "власні тести й ініціативи", en: "personal tests and initiatives" }, url: urls.selfForm, kind: "project" },

    ],

  },

  {

    id: "mentorship",

    code: "K MH",

    role: "producer",

    modes: ["self", "hire", "project"],

    title: { ua: "K Mentorship Hub", en: "K Mentorship Hub" },

    summary: { ua: "Легший mentorship-shell: відбір, ресурсні маршрути, application-first beta, без перенавантаженої community-операційки.", en: "A lighter mentorship shell: selection, resource routes, and an application-first beta instead of overloaded community ops." },

    overview: { ua: "Я свідомо не роблю з цього хаба величезну академію або Genesis-style систему зараз. Найкращий формат на цій стадії — проста й чесна beta: сторінка, форма, ресурсні маршрути, ручний відбір і можливість виростити це далі лише якщо з’являється реальний попит.", en: "I am deliberately not turning this hub into a giant academy or Genesis-style system right now. The best format at this stage is a clean beta: one page, one form, resource routes, manual selection, and the option to grow only if real demand appears." },

    bullets: { ua: ["application-first підхід замість хаотичної community-операційки", "можна будувати resource paths через існуючі матеріали та мої рекомендації", "перетинається з Venture Studio, але не зливається з ним"], en: ["an application-first approach instead of chaotic community operations", "resource paths can be built from existing material and my own recommendations", "intersects with Venture Studio but remains independent"] },

    format: { ua: "Тут доречні форма, відбір, beta-доступ і поступове нарощування. Якщо буде потрібно, далі можна додати private layer, але не зобов’язано вже зараз.", en: "This hub works well with a form, selection, beta access, and gradual scaling. A private layer can be added later if needed, but it should not be forced now." },

    logo: "./assets/img/hubs/mentorship.png",

    media: { type: "image", src: "./assets/img/hubs/mentorship.png", caption: { ua: "Mentorship краще запускати як beta-оболонку, а не як перевантажену платформу.", en: "Mentorship is better launched as a beta shell than as an overloaded platform." } },

    links: [

      { label: { ua: "Apply form", en: "Apply form" }, note: { ua: "основний вхід у beta", en: "main beta entry point" }, url: urls.mentorshipForm, kind: "form" },

      { label: { ua: "Generic route", en: "Generic route" }, note: { ua: "якщо треба звичайний запит", en: "if a normal request is enough" }, url: urls.hireForm, kind: "intake" },

    ],

  },

  {

    id: "publishing",

    code: "K PB",

    role: "creator",

    modes: ["hire", "self", "project"],

    title: { ua: "K Publishing Hub", en: "K Publishing Hub" },

    summary: { ua: "Книги, тексти, релізи, authorial lines, publishing-системи і майбутні маршрути на зовнішні платформи.", en: "Books, texts, releases, authorial lines, publishing systems, and future routes to external platforms." },

    overview: { ua: "Це хаб для книжок, текстів і release-логіки. Він не зводиться лише до продажу, а тримає цілу авторську рамку: як збирається текст, де він живе, як його публікувати, як вести читача й куди далі маршрутизувати — хоч на Amazon, хоч на окремий reading hub.", en: "This hub is for books, text systems, and release logic. It is not only about selling; it holds the broader authorial frame: how the text is assembled, where it lives, how it is published, how the reader is routed next, whether to Amazon or to a dedicated reading hub." },

    bullets: { ua: ["авторська лінія, книги, зини, release-маршрути", "майбутні зовнішні платформи можна тримати як окремі виходи", "сюди ж добре лягають і творчі, і продуктні тексти"], en: ["authorial line, books, zines, and release routes", "future external platforms can remain separate output paths", "both creative and product-facing texts fit here"] },

    format: { ua: "Зараз це радше publishing-shell із правильним маршрутизатором, ніж завершена bookstore-система. І це нормально: важливо спершу дати ясний простір, а монетизацію нарощувати далі.", en: "For now this is better treated as a publishing shell with correct routing than as a fully built bookstore system. That is fine: clarity comes first, monetization can scale later." },

    logo: "./assets/img/hubs/publishing.png",

    media: { type: "image", src: "./assets/img/hubs/publishing.png", caption: { ua: "Publishing hub тримає не лише тексти, а й саму авторську історію.", en: "The publishing hub holds not only texts but the authorial story itself." } },

    links: [

      { label: { ua: "Форма запиту", en: "Intake form" }, note: { ua: "для publishing-запитів", en: "for publishing-facing requests" }, url: urls.hireForm, kind: "form" },

      { label: { ua: "Amazon / Goodreads", en: "Amazon / Goodreads" }, note: { ua: "маршрут можна додати пізніше", en: "can be added later" }, disabled: true, kind: "draft" },

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "авторський архів і work-in-progress", en: "author archive and work in progress" }, url: urls.selfForm, kind: "self" },

    ],

  },

  {

    id: "quest",

    code: "K QH",

    role: "creator",

    modes: ["hire", "self", "project"],

    title: { ua: "K Quest Hub", en: "K Quest Hub" },

    summary: { ua: "Квестова логіка, gamified-маршрути, наративні оболонки й подорожі через систему, а не через нудний список задач.", en: "Quest logic, gamified routes, narrative wrappers, and journeys through systems instead of dry task lists." },

    overview: { ua: "Це хаб для всього, що хоче мати форму подорожі, а не просто чекліста. Він може торкатися навчання, росту, storytelling і навіть окремих продуктів, якщо їм потрібен сильний narrative shell.", en: "This hub is for anything that wants to feel like a journey rather than a checklist. It can touch learning, growth, storytelling, and even product directions when they need a strong narrative shell." },

    bullets: { ua: ["gamified routes і narrative design", "придатний і для self-layer, і для проєктних історій", "допомагає робити систему цікавою, не втрачаючи структури"], en: ["gamified routes and narrative design", "useful for both self layers and project stories", "keeps systems engaging without losing structure"] },

    format: { ua: "Quest hub не обов’язково продається як окрема послуга. Часто це швидше смисловий і creative-shell, який підсилює інші напрями.", en: "Quest hub does not have to be sold as a separate service. Often it works better as a meaning and creative shell that strengthens other directions." },

    logo: "./assets/img/favicon.png",

    media: { type: "image", src: "./assets/img/favicon.png", caption: { ua: "Коли шлях має форму квесту, система перестає бути нудною.", en: "When a path becomes a quest, the system stops feeling dull." } },

    links: [

      { label: { ua: "Project route", en: "Project route" }, note: { ua: "для окремих квестових історій", en: "for standalone quest stories" }, url: urls.selfForm, kind: "project" },

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "внутрішня narrative-практика", en: "internal narrative practice" }, url: urls.selfForm, kind: "self" },

    ],

  },

  {

    id: "creative-practice",

    code: "K CH",

    role: "creator",

    modes: ["self"],

    title: { ua: "K Creative Practice Hub", en: "K Creative Practice Hub" },

    summary: { ua: "Творча практика, мистецькі спроби, музика, поезія, візуальна й внутрішня лабораторія без клієнтського тиску.", en: "Creative practice, artistic attempts, music, poetry, and an internal laboratory without client pressure." },

    overview: { ua: "Це максимально власний шар. Тут немає потреби робити все продавабельним. Навпаки, цей хаб існує для того, щоб творчість могла бути джерелом, а не лише продуктом. Саме з нього часто народжується подальший publishing або creative direction.", en: "This is the most internal layer. It does not need to be immediately sellable. In fact, it exists so that creativity can remain a source rather than only a product. Publishing and creative direction often grow from here later." },

    bullets: { ua: ["музика, поезія, візуальні й мисленнєві практики", "без тиску на монетизацію тут і зараз", "власний резервуар сенсів для інших хабів"], en: ["music, poetry, visual and reflective practices", "without pressure to monetize immediately", "a private reservoir of meaning for other hubs"] },

    format: { ua: "Це self-only хаб. Його варто показувати як частину філософії Kosatiks Group, але не як звичайну форму замовлення.", en: "This is a self-only hub. It should be shown as part of the philosophy of Kosatiks Group rather than as a standard order form." },

    logo: "./assets/img/favicon.png",

    media: { type: "image", src: "./assets/img/favicon.png", caption: { ua: "Творча практика — джерело, а не тільки deliverable.", en: "Creative practice is a source, not only a deliverable." } },

    links: [

      { label: { ua: "Self route", en: "Self route" }, note: { ua: "внутрішній архів і практика", en: "internal archive and practice" }, url: urls.selfForm, kind: "self" },

    ],

  },

];



Object.assign(urls, {
  ventureHub: "https://github.com/K-Venture-Studio-Hub",
  mentorshipHub: "https://github.com/K-Mentorship-Hub",
  masterRepo: "https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE",
  masterDocs:
    "https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE/tree/main/S7%20%E2%80%94%20%F0%9F%93%9A%20K%20Life%20OS/S7-I%20%C2%B7%20%F0%9F%94%8E%20Career%20or%20Education/R1%20-%20Master%20Prep%20Analytics",
  masterDashboard: "https://sphere-i-science.vercel.app/index.html",
  masterTrainer: "https://sphere-i-science.vercel.app/trainer/trainer.html",
});

Object.assign(dict.ua, {
  overviewPressure: "???????",
  overviewFix: "???????",
  overviewEntry: "????????? ????",
  overviewFaqTitle: "?? ???????? ?????? ?????",
  overviewBestFit: "???? ?? ?????",
  overviewActionForm: "???????? ?????",
  overviewActionRepo: "???????? GitHub",
  overviewActionSite: "???????? ????",
  overviewActionLinks: "???????? ?????",
  overviewRouteFallback: "??????? ? ??????? Links, ??? ???????? ????? ????? ????????.",
});

Object.assign(dict.ua, {
  overviewPressure: "Напруга",
  overviewFix: "Рішення",
  overviewEntry: "Найкращий вхід",
  overviewFaqTitle: "Що зазвичай хочуть знати",
  overviewBestFit: "Кому це пасує",
  overviewActionForm: "Відкрити форму",
  overviewActionRepo: "Відкрити GitHub",
  overviewActionSite: "Відкрити сайт",
  overviewActionLinks: "Відкрити лінки",
  overviewRouteFallback: "Перейди у вкладку Links, щоб побачити повну карту маршруту.",
});

Object.assign(dict.ua, {
  overviewPressure: "Як зараз",
  overviewFix: "Що отримає клієнт",
  overviewSetMethod: "SET-лінія",
});

Object.assign(dict.en, {
  overviewPressure: "As is",
  overviewFix: "What the client gets",
  overviewEntry: "Best entry",
  overviewFaqTitle: "What people usually want to know",
  overviewBestFit: "Best fit",
  overviewActionForm: "Open form",
  overviewActionRepo: "Open GitHub",
  overviewActionSite: "Open site",
  overviewActionLinks: "Open links",
  overviewRouteFallback: "Open the Links tab to see the full routing layer.",
  overviewSetMethod: "SET line",
});

function applyContentOverrides() {
  Object.assign(socialLinks[0].note, {
    ua: "Одна routing-сторінка для публічних профілів, офер-лінків і входів у хаби.",
  });

  Object.assign(socialLinks[1].note, {
    ua: "Другий link-hub для експериментів, альтернативних профілів або кампанійних маршрутів.",
  });

  Object.assign(socialLinks[2].note, {
    ua: "Найкращий простір для подачі стратегині й продюсерки, кейсової логіки та ecosystem-thinking.",
  });

  Object.assign(socialLinks[3].note, {
    ua: "М'якший простір для авторського контенту, візуальних фрагментів і наративних входів.",
  });

  Object.assign(specialEntries.ecosystem.summary, {
    ua: "SET-shaped мапа екосистеми: що тут клієнтське, що власне, що дослідницьке і як між цими шарами рухатися без хаосу.",
    en: "A SET-shaped ecosystem map: what is client-facing, what is personal, what is research-facing, and how to move through these layers without chaos.",
  });

  Object.assign(specialEntries.ecosystem.overview, {
    ua: "Kosatiks Group - це не одна послуга і не одна persona. Це рамка, де стратегія, підприємництво, технології, творчість і дослідження збираються в одну систему маршрутів. Тому важливо не просто читати назви, а бачити формат: де замовлення, де власна операційна система, де публічний кейс, а де глибший research-layer.",
    en: "Kosatiks Group is not a single service and not a single persona. It is a frame where strategy, entrepreneurship, technology, creative work, and research become one routed system. The point is not only to read names, but to understand format: where the offer is, where the personal operating system lives, where a public case begins, and where a deeper research layer starts.",
  });

  Object.assign(specialEntries.ecosystem.format, {
    ua: "Найкращий спосіб читати сайт: спершу обираєш роль, далі - режим, а потім відкриваєш картку. У модалці вже видно правильний наступний крок: форма, репозиторій, live site, Notion або GitHub-організація.",
    en: "Best use pattern: choose a role first, then narrow by mode, and only then open a card. The modal makes the next step explicit: form, repo, live site, Notion, or GitHub organization.",
  });
  specialEntries.ecosystem.sphereLabel = { ua: "SPHERES: S + E + T", en: "SPHERES: S + E + T" };
  specialEntries.ecosystem.setLead = {
    ua: "Окрім ролей, я веду ще й три SET-сфери: Science, Entrepreneurship і Technology. Вони можуть з’являтися в одному хабі разом або окремо — залежно від того, яка логіка справді працює для конкретного напрямку.",
    en: "Alongside the role system, I also develop three SET spheres: Science, Entrepreneurship, and Technology. They can appear together inside one hub or stand separately, depending on what genuinely fits that direction.",
  };
  specialEntries.ecosystem.setMap = {
    ua: [
      {
        label: "S — Science",
        body: "Дослідження, метод, evidence layer, системне мислення, K-RnD Lab і все, що потребує глибини та доказовості.",
      },
      {
        label: "E — Entrepreneurship",
        body: "Побудова напрямів, venture-логіка, офери, монетизація, маршрути співпраці та продуктивний рух назовні.",
      },
      {
        label: "T — Technology",
        body: "Цифрові інструменти, automation, live systems, dashboards, digital writing і технологічна інфраструктура.",
      },
    ],
    en: [
      {
        label: "S — Science",
        body: "Research, method, the evidence layer, systems thinking, K-RnD Lab, and everything that needs depth and proof.",
      },
      {
        label: "E — Entrepreneurship",
        body: "Building directions, venture logic, offers, monetization, collaboration routes, and productive movement outward.",
      },
      {
        label: "T — Technology",
        body: "Digital tools, automation, live systems, dashboards, digital writing, and technical infrastructure.",
      },
    ],
  };

  specialEntries.ecosystem.mediaStack = [
    {
      type: "video",
      src: "./assets/video/k-logo.mp4",
      caption: {
        ua: "Тут сходяться ролі, хаби, продукти й зовнішні маршрути.",
        en: "This is where roles, hubs, products, and external routes meet.",
      },
    },
  ];

  Object.assign(specialEntries.me.summary, {
    ua: "Я зібрала Kosatiks Group як систему, де стратегія, продюсування, дослідження і творчість працюють разом, а не розходяться по різних persona.",
    en: "I built Kosatiks Group as a system where strategy, production, research, and creativity work together instead of splitting into disconnected personas.",
  });

  specialEntries.me.mediaStack = [
    {
      type: "video",
      src: "./assets/video/k4.mp4",
      caption: {
        ua: "Ядро Kosatiks Group: ролі, філософія, подача.",
        en: "The core of Kosatiks Group: roles, philosophy, and presence.",
      },
    },
  ];

  const venture = HUBS.find((hub) => hub.id === "venture-studio");
  if (venture) {
    venture.sphereLabel = { ua: "SPHERE: E + T", en: "SPHERE: E + T" };
    venture.setLead = {
      ua: "У цьому хабі роль продюсерки читається через дві SET-сфери: Entrepreneurship як головний build-напрям і Technology як інструментальний шар для запуску, тесту та видимого продуктового руху.",
      en: "In this hub the producer role is expressed through two SET spheres: Entrepreneurship as the main build direction and Technology as the tool layer for launching, testing, and making product movement visible.",
    };
    venture.setMap = {
      ua: [
        {
          label: "E — Entrepreneurship",
          body: "MVP, офер, перевірка попиту, venture-рамка і рішення про рух далі.",
        },
        {
          label: "T — Technology",
          body: "Інструменти, automation, lightweight stack, live shell і збірка того, що можна реально протестувати.",
        },
      ],
      en: [
        {
          label: "E — Entrepreneurship",
          body: "MVP logic, offer design, demand validation, venture framing, and the decision about what moves next.",
        },
        {
          label: "T — Technology",
          body: "Tools, automation, lightweight stack, live shell, and the assembly of something that can actually be tested.",
        },
      ],
    };
    venture.pressure = {
      ua: [
        "ідея зависає між ентузіазмом і реальною збіркою",
        "хочеться будувати все одразу, але без чіткої рамки",
        "продуктова логіка ще не зібрана у видимий venture-case",
      ],
      en: [
        "the idea hangs between excitement and a real build path",
        "there is energy to build, but no clean venture frame yet",
        "the product logic still is not assembled into a visible case",
      ],
    };
    venture.fix = {
      ua: [
        "перевести ідею у перевірну гіпотезу",
        "стиснути її до MVP або тестового офера",
        "чесно побачити: масштабувати, переформулювати чи зупинити",
      ],
      en: [
        "turn the idea into a testable hypothesis",
        "compress it into an MVP or a trial offer",
        "see honestly whether to scale, reframe, or stop",
      ],
    };
    venture.fit = {
      ua: "Найкраще пасує засновникам, сольним білдерам і тим, кому треба швидко перевести задум у перевірний venture-формат.",
      en: "Best for founders, solo builders, and people who need to convert a concept into a venture-ready format quickly.",
    };
    venture.vibe = {
      ua: "Ідея не має лишатися туманом. Вона має пройти перевірку.",
      en: "An idea should not stay fog. It should survive contact with reality.",
    };
    venture.faq = {
      ua: [
        { q: "Це про стартапи чи просто про MVP?", a: "Про обидва шари. Якщо є шанс на venture-напрям, ми це побачимо. Якщо ні, лишимо чесний тестовий продукт або рішення." },
        { q: "Чим це відрізняється від mentorship?", a: "Тут фокус не на орієнтації людини, а на збірці гіпотези, офера, продукту або venture-case." },
      ],
      en: [
        { q: "Is this about startups or just MVPs?", a: "Both layers can fit here. If the idea has real venture energy, we keep that path visible. If not, we still shape a strong testable product case." },
        { q: "How is this different from mentorship?", a: "This hub is about building the venture object itself, not mainly orienting the person behind it." },
      ],
    };
    Object.assign(venture.summary, {
      ua: "Підприємницький build-layer для перетворення структурованих ідей на MVP, тести, офери й venture-кейси.",
      en: "An entrepreneurship-facing build layer for turning structured ideas into MVPs, tests, offers, and venture cases.",
    });
    Object.assign(venture.overview, {
      ua: "K Venture Studio Hub - це підприємницький шар SET-методології. Тут сигнали зі стратегії, дослідження й product-thinking переходять у buildable hypotheses, MVP, offer structure і видимі експерименти. Цінність цього хаба не в тому, щоб довше думати про ідею, а в тому, щоб швидше перевести її в перевірний формат і чесно зрозуміти, чи вона тримається.",
      en: "K Venture Studio Hub is the entrepreneurship layer of the SET methodology. This is where signals from strategy, research, and product thinking become buildable hypotheses, MVPs, offer structures, and visible experiments. The value here is not dreaming about the idea for longer, but translating it into a testable format fast enough to learn honestly.",
    });
    venture.bullets = {
      ua: [
        "підприємницька рамка між ідеєю і реальним build-процесом",
        "MVP, validation loops, offer packaging і next-step architecture",
        "місце, де гіпотеза стає прототипом, продукт-тестом або чесним stop-decision",
      ],
      en: [
        "an entrepreneurship frame between an idea and a real build process",
        "MVPs, validation loops, offer packaging, and next-step architecture",
        "a place where a hypothesis becomes a prototype, a product test, or an honest stop decision",
      ],
    };
    Object.assign(venture.format, {
      ua: "Google Site може лишатися легким публічним shell, а GitHub і Kosatiks - тримати структуру, operating logic і майбутні repo-шари. Саме так venture не виглядає відірвано від решти системи.",
      en: "Google Site can stay as the lightweight public shell while GitHub and Kosatiks hold structure, operating logic, and future repo surfaces. That keeps the venture layer connected to the rest of the system instead of floating alone.",
    });
    venture.links = [
      {
        label: { ua: "GitHub hub", en: "GitHub hub" },
        note: { ua: "структура venture-шару", en: "venture layer structure" },
        url: urls.ventureHub,
        kind: "repo",
      },
      {
        label: { ua: "Google Site", en: "Google Site" },
        note: { ua: "легкий live-layer", en: "light live layer" },
        url: urls.ventureSite,
        kind: "site",
      },
      {
        label: { ua: "Форма запиту", en: "Intake form" },
        note: { ua: "співпраця або build-запит", en: "collaboration or build request" },
        url: urls.hireForm,
        kind: "form",
      },
    ];
    venture.mediaStack = [
      {
        type: "image",
        src: "https://media.giphy.com/media/lInxVz19e4YggejNuy/giphy.gif",
        caption: {
          ua: "Ідея повинна запалювати, але й швидко переходити в збірку.",
          en: "A strong idea should ignite, but also move into a build fast.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/xT0xePyGsKplOK5dHG/giphy.gif",
        caption: {
          ua: "Будуємо, тестуємо, виводимо у видимий кейс.",
          en: "Build it, test it, and turn it into a visible case.",
        },
      },
    ];
    venture.overviewStyle = "legacySignals";
    venture.price = { ua: "Starts at $5", en: "Starts at $5" };
    venture.priceNote = {
      ua: "Per sprint або per build loop.",
      en: "Per sprint or per build loop.",
    };
    venture.disableOverviewRoute = true;
  }

  const krnd = HUBS.find((hub) => hub.id === "krnd-lab");
  if (krnd) {
    krnd.sphereLabel = { ua: "SPHERE: S + E + T", en: "SPHERE: S + E + T" };
    krnd.setLead = {
      ua: "K-RnD Lab — це той хаб, де всі три SET-сфери реально сходяться в одній рамці: наука дає метод, підприємництво — напрям застосування, технології — інструменти й інфраструктуру.",
      en: "K-RnD Lab is the hub where all three SET spheres actually meet in one frame: science provides the method, entrepreneurship the application direction, and technology the tools plus infrastructure.",
    };
    krnd.setMap = {
      ua: [
        {
          label: "S — Science",
          body: "Гіпотези, дослідницькі питання, evidence layer, метрики, proof і системне мислення.",
        },
        {
          label: "E — Entrepreneurship",
          body: "Публічні кейси, applied value, рішення про застосування і те, як дослідження стає корисним назовні.",
        },
        {
          label: "T — Technology",
          body: "Dashboard, trainer, digital tools, data flow і research-infrastructure, що робить кейс живим і вимірюваним.",
        },
      ],
      en: [
        {
          label: "S — Science",
          body: "Hypotheses, research questions, the evidence layer, metrics, proof, and systems thinking.",
        },
        {
          label: "E — Entrepreneurship",
          body: "Public cases, applied value, application logic, and the translation of research into something useful outside the lab.",
        },
        {
          label: "T — Technology",
          body: "Dashboards, trainer tools, data flow, and research infrastructure that make the case measurable and alive.",
        },
      ],
    };
    krnd.pressure = {
      ua: [
        "ідеї виглядають сильними, але без доказового шару звучать як заяви",
        "дослідження, дашборди і case-study можуть розпастися по різних місцях",
        "без структури важко показати, як Science, Entrepreneurship і Technology реально сходяться",
      ],
      en: [
        "ideas may sound strong, but without evidence they remain only claims",
        "research, dashboards, and case studies can scatter into separate surfaces",
        "without structure it is hard to show how Science, Entrepreneurship, and Technology actually meet",
      ],
    };
    krnd.fix = {
      ua: [
        "дати гіпотезі дані, документацію і видимий proof layer",
        "перетворити особисту систему на публічний research-case",
        "показати метод, метрики і розвиток в одній рамці",
      ],
      en: [
        "give the hypothesis data, documentation, and a visible proof layer",
        "turn a personal system into a public research case",
        "show method, metrics, and progress within one coherent frame",
      ],
    };
    krnd.fit = {
      ua: "Найкраще пасує для дослідницьких кейсів, evidence-first продуктів і публічних артефактів, де важлива глибина, а не лише подача.",
      en: "Best for research-led cases, evidence-first products, and public artifacts where depth matters as much as presentation.",
    };
    krnd.vibe = {
      ua: "Не просто думка, а метод, слід, дані й доказ.",
      en: "Not only a thought, but a method, a trace, data, and proof.",
    };
    krnd.faq = {
      ua: [
        { q: "Це тільки про біологію чи медицину?", a: "Ні. Лаба ширша: вона тримає наукові, технологічні та підприємницькі кейси там, де потрібна доказовість і системність." },
        { q: "Чому сюди входить Master Prep Analytics?", a: "Бо це вже не просто підготовка. Це вимірюваний research-case із метриками, тренером, симуляціями й публічним прогресом." },
      ],
      en: [
        { q: "Is this only about biology or medicine?", a: "No. The lab is broader: it holds scientific, technological, and entrepreneurial cases whenever evidence and system design matter." },
        { q: "Why does Master Prep Analytics belong here?", a: "Because it is no longer just preparation. It is a measurable research case with metrics, a trainer, simulations, and public progress." },
      ],
    };
    Object.assign(krnd.summary, {
      ua: "Науково-доказовий шар SET: гіпотези, аналітика, експерименти, вимірювані системи й публічні research-кейси.",
      en: "The science-facing evidence layer of SET: hypotheses, analytics, experiments, measurable systems, and public research cases.",
    });
    Object.assign(krnd.overview, {
      ua: "K-RnD Lab - це науковий і доказовий backbone ширшої SET-методології. Саме тут research questions, аналітичні артефакти, експериментальна логіка й вимірювані публічні кейси збираються в систему, яка дає proof, а не лише заяви. Сюди ж природно лягає Master Prep Analytics: не як окремий сайт про вступ, а як публічний дослідницький кейс з метриками, графіками, тренувальним середовищем і evidence-based progress.",
      en: "K-RnD Lab is the scientific and evidence backbone of the wider SET methodology. This is where research questions, analytical artifacts, experimental logic, and measurable public cases become a system that provides proof rather than only claims. That is also why Master Prep Analytics belongs here: not as a separate admission site, but as a public research case with metrics, charts, a trainer environment, and evidence-based progress.",
    });
    krnd.bullets = {
      ua: [
        "наукова рамка, public proof і evidence-driven iteration",
        "аналітичні дашборди, експерименти, вимірюваний прогрес і відкрита документація",
        "місце для кейсів, де особиста система виростає в дослідницький артефакт",
      ],
      en: [
        "science-facing framing, public proof, and evidence-driven iteration",
        "analytics dashboards, experiments, measurable progress, and open documentation",
        "a home for cases where a personal system grows into a research artifact",
      ],
    };
    Object.assign(krnd.format, {
      ua: "Зовні цей хаб працює як proof-of-thinking, proof-of-method і proof-of-depth. Усередині - це простір, де методи, дані, гіпотези, SET-сфери й research-infrastructure не розсипаються по різних місцях.",
      en: "Externally, this hub works as proof-of-thinking, proof-of-method, and proof-of-depth. Internally, it is the place where methods, data, hypotheses, SET lanes, and research infrastructure stay coherent.",
    });
    krnd.projects = {
      ua: [
        {
          title: "Master Prep Analytics",
          body: "Публічний research-case про підготовку: dashboard, trainer, метрики, симуляції та evidence-based readiness.",
        },
      ],
      en: [
        {
          title: "Master Prep Analytics",
          body: "A public preparation research case: dashboard, trainer, metrics, simulations, and evidence-based readiness.",
        },
      ],
    };
    krnd.links = [
      {
        label: { ua: "K-RnD Lab org", en: "K-RnD Lab org" },
        note: { ua: "головна GitHub-організація", en: "main GitHub organization" },
        url: urls.krndOrg,
        kind: "org",
      },
      {
        label: { ua: "Master Prep Analytics", en: "Master Prep Analytics" },
        note: { ua: "live dashboard", en: "live dashboard" },
        url: urls.masterDashboard,
        kind: "site",
      },
      {
        label: { ua: "AI Master Trainer", en: "AI Master Trainer" },
        note: { ua: "тренувальне середовище", en: "trainer environment" },
        url: urls.masterTrainer,
        kind: "project",
      },
      {
        label: { ua: "SPHERE-I-SCIENCE", en: "SPHERE-I-SCIENCE" },
        note: { ua: "репозиторій наукового шару", en: "science layer repository" },
        url: urls.masterRepo,
        kind: "repo",
      },
      {
        label: { ua: "Hugging Face org", en: "Hugging Face org" },
        note: { ua: "ML-напрям, якщо доречно", en: "ML-facing route if relevant" },
        url: urls.hfOrg,
        kind: "lab",
      },
    ];
    krnd.mediaStack = [
      {
        type: "image",
        src: "https://media.giphy.com/media/fqIBaMWI7m7O8/giphy.gif",
        caption: {
          ua: "Дослідницький режим: питання, гіпотези, аналітика.",
          en: "Research mode: questions, hypotheses, and analytics.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/TncmRRvEGVoVcHgaAb/giphy.gif",
        caption: {
          ua: "Доказовий шар і публічний кейс мають працювати разом.",
          en: "The evidence layer and the public case should work together.",
        },
      },
    ];
    krnd.overviewStyle = "legacySignals";
    krnd.price = { ua: "Starts at $5", en: "Starts at $5" };
    krnd.priceNote = {
      ua: "Per case, dashboard, or research layer.",
      en: "Per case, dashboard, or research layer.",
    };
    krnd.disableOverviewRoute = true;
  }

  const mentorship = HUBS.find((hub) => hub.id === "mentorship");
  if (mentorship) {
    mentorship.sphereLabel = { ua: "SPHERE: S + E + T", en: "SPHERE: S + E + T" };
    mentorship.setLead = {
      ua: "Mentorship тут не окрема академія, а guided SET-layer: людина бачить, як Science, Entrepreneurship і Technology можуть зійтися в одному реальному next step.",
      en: "Mentorship here is not a separate academy but a guided SET layer: it shows how Science, Entrepreneurship, and Technology can converge into one real next step.",
    };
    mentorship.setMap = {
      ua: [
        {
          label: "S — Science",
          body: "Логіка навчання, рефлексія, дослідницьке мислення й робота з тим, як людина вчиться та орієнтується.",
        },
        {
          label: "E — Entrepreneurship",
          body: "Напрям, позиціонування себе, practical next step, venture-orientation і рух у дієвий формат.",
        },
        {
          label: "T — Technology",
          body: "Repo-маршрути, інструменти, digital systems і технологічні шари, через які навчання переходить у build.",
        },
      ],
      en: [
        {
          label: "S — Science",
          body: "Learning logic, reflection, research-minded orientation, and how a person actually learns.",
        },
        {
          label: "E — Entrepreneurship",
          body: "Direction, self-positioning, practical next steps, venture orientation, and movement toward a usable format.",
        },
        {
          label: "T — Technology",
          body: "Repo routes, tools, digital systems, and the technical layers that move learning into a build path.",
        },
      ],
    };
    mentorship.pressure = {
      ua: [
        "\u043b\u044e\u0434\u0438\u043d\u0430 \u0445\u043e\u0447\u0435 \u0440\u0443\u0445\u0430\u0442\u0438\u0441\u044f, \u0430\u043b\u0435 \u043d\u0435 \u0431\u0430\u0447\u0438\u0442\u044c \u0447\u0456\u0442\u043a\u043e\u0433\u043e next step",
        "\u043d\u0430\u0441\u0442\u0430\u0432\u043d\u0438\u0446\u0442\u0432\u043e \u0447\u0430\u0441\u0442\u043e \u0430\u0431\u043e \u043d\u0430\u0434\u0442\u043e \u0437\u0430\u0433\u0430\u043b\u044c\u043d\u0435, \u0430\u0431\u043e \u043f\u0435\u0440\u0435\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u0435",
        "\u0433\u0456\u0431\u0440\u0438\u0434\u043d\u0438\u043c \u043f\u0440\u043e\u0444\u0456\u043b\u044f\u043c \u0441\u043a\u043b\u0430\u0434\u043d\u043e \u0437\u0440\u043e\u0437\u0443\u043c\u0456\u0442\u0438, \u043a\u0443\u0434\u0438 \u0432\u0445\u043e\u0434\u0438\u0442\u0438: \u0443 \u043d\u0430\u0443\u043a\u0443, \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0456\u0457 \u0447\u0438 \u043f\u0456\u0434\u043f\u0440\u0438\u0454\u043c\u043d\u0438\u0446\u0442\u0432\u043e",
      ],
      en: [
        "the person wants to move, but the next step is still unclear",
        "mentorship often feels either too vague or too heavy",
        "hybrid profiles struggle to place themselves across science, technology, and entrepreneurship",
      ],
    };
    mentorship.fix = {
      ua: [
        "\u0434\u0430\u0442\u0438 \u043b\u044e\u0434\u0438\u043d\u0456 \u044f\u0441\u043d\u0443 \u0440\u0430\u043c\u043a\u0443 \u0437\u0430\u043c\u0456\u0441\u0442\u044c \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u0439\u043d\u043e\u0433\u043e \u0448\u0443\u043c\u0443",
        "\u043f\u043e\u0454\u0434\u043d\u0430\u0442\u0438 \u043d\u0430\u0432\u0447\u0430\u043d\u043d\u044f \u0437 \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u0438\u043c build path",
        "\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u0438, \u043a\u0443\u0434\u0438 \u0432\u0435\u0441\u0442\u0438 \u0434\u0430\u043b\u0456: \u0443 repo, tool, research-layer \u0430\u0431\u043e venture-track",
      ],
      en: [
        "give the person a clear frame instead of noise",
        "connect learning to a concrete build path",
        "show where to route next: into a repo, a tool, a research layer, or a venture track",
      ],
    };
    mentorship.fit = {
      ua: "\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0435 \u043f\u0430\u0441\u0443\u0454 \u0434\u043b\u044f \u043b\u044e\u0434\u0435\u0439 \u043d\u0430 \u043f\u0435\u0440\u0435\u0442\u0438\u043d\u0456 \u043a\u0456\u043b\u044c\u043a\u043e\u0445 \u0456\u043d\u0442\u0435\u0440\u0435\u0441\u0456\u0432, \u044f\u043a\u0438\u043c \u043f\u043e\u0442\u0440\u0456\u0431\u0435\u043d \u043d\u0435 hype, \u0430 \u043f\u0440\u0430\u043a\u0442\u0438\u0447\u043d\u0438\u0439 \u043d\u0430\u043f\u0440\u044f\u043c \u0456 \u0441\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u043e\u0432\u0430\u043d\u0438\u0439 \u0432\u0445\u0456\u0434.",
      en: "Best for people crossing multiple interests who need practical direction and a structured entry rather than hype.",
    };
    mentorship.vibe = {
      ua: "\u0421\u043f\u0435\u0440\u0448\u0443 \u043e\u0440\u0456\u0454\u043d\u0442\u0443\u0454\u043c\u043e. \u041f\u043e\u0442\u0456\u043c \u0432\u0447\u0438\u043c\u043e, \u0437\u0431\u0438\u0440\u0430\u0454\u043c\u043e \u0439 \u0432\u0435\u0434\u0435\u043c\u043e \u0434\u0430\u043b\u0456.",
      en: "Orient first. Then learn, build, and move.",
    };
    mentorship.faq = {
      ua: [
        { q: "\u0426\u0435 \u0430\u043a\u0430\u0434\u0435\u043c\u0456\u044f?", a: "\u041d\u0456. \u0426\u0435 \u043b\u0435\u0433\u0448\u0438\u0439 guidance-system, \u044f\u043a\u0438\u0439 \u0434\u0430\u0454 \u0448\u043b\u044f\u0445 \u0456 next step \u0431\u0435\u0437 \u0456\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0456\u0439\u043d\u043e\u0457 \u0432\u0430\u0436\u043a\u043e\u0441\u0442\u0456." },
        { q: "\u0429\u043e \u0442\u0443\u0442 SET?", a: "\u0421\u0430\u043c\u0435 \u0442\u0443\u0442 \u043b\u044e\u0434\u0438\u043d\u0430 \u043c\u043e\u0436\u0435 \u043f\u043e\u0431\u0430\u0447\u0438\u0442\u0438, \u044f\u043a Science, Entrepreneurship \u0456 Technology \u043d\u0435 \u0440\u043e\u0437\u0440\u0438\u0432\u0430\u044e\u0442\u044c\u0441\u044f, \u0430 \u0441\u043a\u043b\u0430\u0434\u0430\u044e\u0442\u044c\u0441\u044f \u0432 \u043e\u0434\u043d\u0443 \u0442\u0440\u0430\u0454\u043a\u0442\u043e\u0440\u0456\u044e." },
      ],
      en: [
        { q: "Is this an academy?", a: "No. It is a lighter guidance system that gives a route and a next step without institutional heaviness." },
        { q: "What makes it SET?", a: "This is one of the places where a person can see Science, Entrepreneurship, and Technology as one trajectory instead of fragmented identities." },
      ],
    };
    Object.assign(mentorship.summary, {
      ua: "SET-guided \u0448\u0430\u0440 \u043e\u0440\u0456\u0454\u043d\u0442\u0430\u0446\u0456\u0457, \u043d\u0430\u0432\u0447\u0430\u043b\u044c\u043d\u0438\u0445 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0456\u0432, \u0432\u0438\u0431\u0456\u0440\u043a\u043e\u0432\u043e\u0457 \u043f\u0456\u0434\u0442\u0440\u0438\u043c\u043a\u0438 \u0439 buildable next steps.",
      en: "A SET-guided layer for orientation, learning routes, selective support, and buildable next steps.",
    });
    Object.assign(mentorship.overview, {
      ua: "K Mentorship Hub \u043d\u0435 \u043c\u0430\u0454 \u0431\u0443\u0442\u0438 \u043f\u0435\u0440\u0435\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043e\u044e \u0430\u043a\u0430\u0434\u0435\u043c\u0456\u0454\u044e. \u0426\u0435 guided activation layer \u0443\u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0456 SET-\u0441\u0438\u0441\u0442\u0435\u043c\u0438: \u043b\u044e\u0434\u0438\u043d\u0430 \u043e\u0440\u0456\u0454\u043d\u0442\u0443\u0454\u0442\u044c\u0441\u044f, \u0440\u043e\u0437\u0443\u043c\u0456\u0454, \u0434\u0435 \u0432\u043e\u043d\u0430 \u043c\u0456\u0436 science, entrepreneurship \u0456 technology, \u0456 \u043e\u0442\u0440\u0438\u043c\u0443\u0454 \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043a\u0440\u043e\u043a, \u044f\u043a\u0438\u0439 \u0440\u0435\u0430\u043b\u044c\u043d\u043e \u043c\u043e\u0436\u043d\u0430 \u0432\u0438\u043a\u043e\u043d\u0430\u0442\u0438. \u0422\u043e\u043c\u0443 \u0442\u0443\u0442 \u0432\u0430\u0436\u043b\u0438\u0432\u0456 \u043d\u0435 \u043e\u0431\u0456\u0446\u044f\u043d\u043a\u0438 \u0432\u0441\u044c\u043e\u0433\u043e \u043e\u0434\u0440\u0430\u0437\u0443, \u0430 \u044f\u0441\u043d\u0430 \u0440\u0430\u043c\u043a\u0430, \u0432\u0456\u0434\u0431\u0456\u0440, \u0440\u0435\u0441\u0443\u0440\u0441\u043d\u0456 \u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0438 \u0439 \u043f\u0440\u0430\u043a\u0442\u0438\u0447\u043d\u0438\u0439 \u0440\u0443\u0445 \u0434\u0430\u043b\u0456.",
      en: "K Mentorship Hub is not meant to become a bloated academy. It is the guided activation layer inside the SET system: a person orients themselves, understands where they are between science, entrepreneurship, and technology, and gets a next step that can actually be carried out. The goal here is not promising everything at once, but creating a clear frame, selective entry, resource routes, and practical movement forward.",
    });
    mentorship.bullets = {
      ua: [
        "application-first beta \u0437\u0430\u043c\u0456\u0441\u0442\u044c \u0448\u0443\u043c\u043d\u043e\u0457 community-\u043e\u043f\u0435\u0440\u0430\u0446\u0456\u0439\u043a\u0438",
        "resource routing, learning paths, feedback loops \u0456 practical direction",
        "\u043c\u043e\u0436\u0435 \u0432\u0435\u0441\u0442\u0438 \u0434\u0430\u043b\u0456 \u0443 Venture Studio, K-RnD Lab \u0430\u0431\u043e \u043e\u043a\u0440\u0435\u043c\u0438\u0439 execution-track",
      ],
      en: [
        "an application-first beta instead of noisy community overhead",
        "resource routing, learning paths, feedback loops, and practical direction",
        "can route further into Venture Studio, K-RnD Lab, or an independent execution track",
      ],
    };
    Object.assign(mentorship.format, {
      ua: "\u041d\u0430\u0439\u043a\u0440\u0430\u0449\u0438\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 \u0437\u0430\u0440\u0430\u0437 - \u0432\u0438\u0431\u0456\u0440\u043a\u043e\u0432\u0438\u0439 \u0432\u0445\u0456\u0434: \u0437\u0440\u043e\u0437\u0443\u043c\u0456\u043b\u0430 \u043f\u0443\u0431\u043b\u0456\u0447\u043d\u0430 \u043e\u0431\u043e\u043b\u043e\u043d\u043a\u0430, \u0444\u043e\u0440\u043c\u0430, \u0440\u0435\u0441\u0443\u0440\u0441\u043d\u0438\u0439 \u043c\u0430\u0440\u0448\u0440\u0443\u0442 \u0456 \u043f\u043e\u0442\u0456\u043c \u0443\u0436\u0435 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0438\u0439 \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043a\u0440\u043e\u043a. \u0422\u0430\u043a mentorship \u043f\u0440\u043e\u0434\u0430\u0454 \u044f\u0441\u043d\u0456\u0441\u0442\u044c \u0456 \u0440\u0443\u0445, \u0430 \u043d\u0435 \u0456\u043b\u044e\u0437\u0456\u044e \u0432\u0435\u043b\u0438\u043a\u043e\u0457 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0438.",
      en: "The best current format is selective entry: a readable public shell, a form, a resource route, and then the right next step. That lets mentorship sell clarity and movement rather than the illusion of a giant platform.",
    });
    mentorship.links = [
      {
        label: { ua: "GitHub hub", en: "GitHub hub" },
        note: { ua: "SET learning and build system", en: "SET learning and build system" },
        url: urls.mentorshipHub,
        kind: "org",
      },
      {
        label: { ua: "Apply form", en: "Apply form" },
        note: { ua: "\u043e\u0441\u043d\u043e\u0432\u043d\u0438\u0439 \u0432\u0445\u0456\u0434 \u0443 beta", en: "main beta entry point" },
        url: urls.mentorshipForm,
        kind: "form",
      },
      {
        label: { ua: "Generic route", en: "Generic route" },
        note: { ua: "\u044f\u043a\u0449\u043e \u0434\u043e\u0441\u0442\u0430\u0442\u043d\u044c\u043e \u0437\u0432\u0438\u0447\u0430\u0439\u043d\u043e\u0433\u043e \u0437\u0430\u043f\u0438\u0442\u0443", en: "if a standard request is enough" },
        url: urls.hireForm,
        kind: "intake",
      },
    ];
    mentorship.mediaStack = [
      {
        type: "image",
        src: "https://media.giphy.com/media/13p77tfexyLtx6/giphy.gif",
        caption: {
          ua: "\u0428\u043b\u044f\u0445 \u043c\u0430\u0454 \u0432\u0456\u0434\u043a\u0440\u0438\u0432\u0430\u0442\u0438\u0441\u044f \u044f\u0441\u043d\u043e, \u0430 \u043d\u0435 \u0442\u043e\u043d\u0443\u0442\u0438 \u0432 \u043f\u0435\u0440\u0435\u0432\u0430\u043d\u0442\u0430\u0436\u0435\u043d\u043d\u0456.",
          en: "A path should open clearly instead of drowning in overload.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRoODRjZXM3NzM4dWo4a28yZTZneDBqMXBsdnY4Z25weTA1anIweiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zWRJMe6sxeNc6VwGqV/giphy.gif",
        caption: {
          ua: "\u041a\u043e\u0436\u0435\u043d checkpoint \u043c\u0430\u0454 \u0432\u0435\u0441\u0442\u0438 \u0443 \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u0438\u0439 \u043d\u0430\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043a\u0440\u043e\u043a.",
          en: "Each checkpoint should lead into a concrete next move.",
        },
      },
    ];
    mentorship.overviewStyle = "legacySignals";
    mentorship.price = { ua: "Starts at $5", en: "Starts at $5" };
    mentorship.priceNote = {
      ua: "Per guidance loop, map, or activation layer.",
      en: "Per guidance loop, map, or activation layer.",
    };
    mentorship.disableOverviewRoute = true;
  }

  const gifStacksByHub = {
    "identity-brand": [
      {
        type: "image",
        src: "https://media.giphy.com/media/jWexOOlYe241y/giphy.gif",
        caption: {
          ua: "Спершу шум. Потім ясна рамка.",
          en: "First the confusion. Then the frame becomes clear.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/lInxVz19e4YggejNuy/giphy.gif",
        caption: {
          ua: "Позиціонування має збирати сенс, а не маскувати хаос.",
          en: "Positioning should gather meaning, not hide chaos.",
        },
      },
    ],
    "community-partnerships": [
      {
        type: "image",
        src: "https://media.giphy.com/media/l0IylOPCNkiqOgMyA/giphy.gif",
        caption: {
          ua: "Хаотичний нетворк не дорівнює системі контактів.",
          en: "Chaotic networking is not the same as a relationship system.",
        },
      },
      {
        type: "image",
        src: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODM1ZjVxZ2c4ejdvNWhuOTdkdjBzeTlibjM2cGJocXp5d2dmeGYxOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qsXsB3WsS5yA8/giphy.gif",
        caption: {
          ua: "Партнерство має бути чистою угодою, а не шумом.",
          en: "A partnership should feel like a clean deal, not noise.",
        },
      },
    ],
    "investments": [
      {
        type: "image",
        src: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXpzZm10ZnNraTNicGdzNHllNGZnNXZ2cWJhcHRjdG5ya3UyenFqcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wWqEtUmXr0m3u/giphy.gif",
        caption: {
          ua: "Рух без тези швидко стає шумом.",
          en: "Motion without a thesis turns into noise fast.",
        },
      },
      {
        type: "image",
        src: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2o5M3ZudTBrNmdsb3gzbmt0OXo1bXY1MnZtMmhhYm5xaWgxMjF6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SbWAWZf4QRgyI/giphy.gif",
        caption: {
          ua: "Рішення мають проходити через спокійний фільтр.",
          en: "Decisions should pass through a calm filter.",
        },
      },
    ],
    "life-os": [
      {
        type: "image",
        src: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2djcXgzZzFkdmowNW8wd2wyaXpuODY4aHdmamtkemRzYjdtd2htaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h1QuBBXMeIj7fTyRSj/giphy.gif",
        caption: {
          ua: "Без Life OS життя розпадається на вкладки.",
          en: "Without a Life OS, life breaks into too many tabs.",
        },
      },
      {
        type: "image",
        src: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3IyN2xlMHk5Y2Fnc2U4amZ5anRsNWx4cWwza3RwcmE4NWNlNWI1biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tqfS3mgQU28ko/giphy.gif",
        caption: {
          ua: "Система має заспокоювати, а не тиснути.",
          en: "A system should calm you down, not add pressure.",
        },
      },
    ],
    "automation-ai-ops": [
      {
        type: "image",
        src: "https://media.giphy.com/media/urvsFBDfR6N32/giphy.gif",
        caption: {
          ua: "Ручний хаос не масштабується.",
          en: "Manual chaos does not scale.",
        },
      },
      {
        type: "image",
        src: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGlyNnEzM2czZjAzb3BzcjdwaGNiMnh2Y25qMnpubWpuOTBpZmo2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Sf5T0iac3uALqpzxJ9/giphy.gif",
        caption: {
          ua: "Автоматизація має давати керований потік.",
          en: "Automation should create a controllable flow.",
        },
      },
    ],
    "client-projects": [
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3MxMjNjZ2d4MDl2c2tsdXdvZjZ2NjZ4YzJvbGxwaGF3MTZveXphbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iDxpH2bZalq5eRnOfq/giphy.gif",
        caption: {
          ua: "Коли все в голові, delivery виглядає як пожежа.",
          en: "When everything stays in your head, delivery looks like firefighting.",
        },
      },
      {
        type: "image",
        src: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmR1aHl5Zzc4dG40cnBsNmRrcjh6aXV5YW02MDlzd244NTAwMnNjdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nin5M8EVAUd5EFOxnZ/giphy.gif",
        caption: {
          ua: "Клієнтський проєкт має читатися як система.",
          en: "A client project should read like a system.",
        },
      },
    ],
    "ops-systems": [
      {
        type: "image",
        src: "https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif",
        caption: {
          ua: "Без процесів усе дуже швидко горить.",
          en: "Without systems, things burn quickly.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/d2Z4rTi11c9LRita/giphy.gif",
        caption: {
          ua: "SOP і ритуали мають охолоджувати хаос.",
          en: "SOPs and rituals should cool down the chaos.",
        },
      },
    ],
    "leadership-team": [
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWY3YWVwMjJ3N3VlODd2ZGFqajltbm9mZnViYnM1YnZqYnJhbDFjbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FBYTrYyjsyq7m/giphy.gif",
        caption: {
          ua: "Команда без правил швидко тоне в friction.",
          en: "A team without rules sinks into friction fast.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWY3YWVwMjJ3N3VlODd2ZGFqajltbm9mZnViYnM1YnZqYnJhbDFjbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FbTpEK2QndAGY/giphy.gif",
        caption: {
          ua: "Структура має давати команді здоровий рух.",
          en: "Structure should give the team a healthier rhythm.",
        },
      },
    ],
    "experiments": [
      {
        type: "image",
        src: "https://media.giphy.com/media/fqIBaMWI7m7O8/giphy.gif",
        caption: {
          ua: "Не кожна ідея заслуговує на повний продукт.",
          en: "Not every idea deserves a full product.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/TncmRRvEGVoVcHgaAb/giphy.gif",
        caption: {
          ua: "Експеримент має дати чесний сигнал.",
          en: "An experiment should produce an honest signal.",
        },
      },
    ],
    "publishing": [
      {
        type: "image",
        src: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
        caption: {
          ua: "Текст не має вмирати в чорновиках.",
          en: "Writing should not die inside drafts.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzNjZDBzbm1zMjVscDdhamllNW55aWRvM3BibWFrNzNtaTJxemJscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BwStBxZnY7wkr8xltb/giphy.gif",
        caption: {
          ua: "Publishing має ставати системою, а не випадковістю.",
          en: "Publishing should become a system, not an accident.",
        },
      },
    ],
    "quest": [
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWdzcXBoMnkxaDYzM3kxc3ZlbGhscjdteTIwenY2cDkxbmZvM2ZmOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13p77tfexyLtx6/giphy.gif",
        caption: {
          ua: "Шлях має бути пригодою, а не сухим чеклістом.",
          en: "A path should feel like a quest, not a dry checklist.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRoODRjZXM3NzM4dWo4a28yZTZneDBqMXBsdnY4Z25weTA1anIweiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zWRJMe6sxeNc6VwGqV/giphy.gif",
        caption: {
          ua: "Система має вести до відчутного loot.",
          en: "The system should lead to real loot, not just motion.",
        },
      },
    ],
    "creative-practice": [
      {
        type: "image",
        src: "https://media.giphy.com/media/lvOHmxddMelSPIFBES/giphy.gif",
        caption: {
          ua: "Творча практика починається як внутрішній простір.",
          en: "Creative practice begins as an internal space.",
        },
      },
      {
        type: "image",
        src: "https://media.giphy.com/media/pDzLuCGrQsLqkXiBhN/giphy.gif",
        caption: {
          ua: "Вона має живити інші шари, а не лише продаватися.",
          en: "It should nourish other layers, not only become sellable.",
        },
      },
    ],
  };

  const sphereDefaults = {
    "identity-brand": {
      sphereLabel: { ua: "SPHERE: E + T", en: "SPHERE: E + T" },
      setLead: {
        ua: "Identity & Brand тут працює як E + T: Entrepreneurship тримає позиціонування, офер і вихід назовні, Technology тримає digital shell і систему подачі.",
        en: "Identity & Brand works here as E + T: Entrepreneurship shapes the positioning, offer, and outward direction, while Technology shapes the digital shell and presentation system.",
      },
    },
    "community-partnerships": {
      sphereLabel: { ua: "SPHERE: E", en: "SPHERE: E" },
      setLead: {
        ua: "Community & Partnerships тут є entrepreneurship-layer: карта партнерств, selective outreach і форматування зв'язків навколо реальної цінності.",
        en: "Community & Partnerships acts here as an entrepreneurship layer: partner mapping, selective outreach, and relationship design around real value.",
      },
    },
    "investments": {
      sphereLabel: { ua: "SPHERE: E", en: "SPHERE: E" },
      setLead: {
        ua: "Investments тут належить до Entrepreneurship: thesis, filters, capital logic і рішення про те, що заслуговує на увагу й ресурс.",
        en: "Investments belongs here to Entrepreneurship: thesis, filters, capital logic, and decisions about what deserves attention and resources.",
      },
    },
    "life-os": {
      sphereLabel: { ua: "SPHERE: S + E + T", en: "SPHERE: S + E + T" },
      setLead: {
        ua: "K Life OS - це інтеграційний шар, де SET сходиться в особистій системі: Science дає спостереження й рефлексію, Entrepreneurship - ресурсну логіку, Technology - digital shell.",
        en: "K Life OS is an integrative layer where SET meets inside a personal system: Science provides observation and reflection, Entrepreneurship the resource logic, and Technology the digital shell.",
      },
    },
    "automation-ai-ops": {
      sphereLabel: { ua: "SPHERE: T + E", en: "SPHERE: T + E" },
      setLead: {
        ua: "Automation / AI Ops тримається на Technology як основі й Entrepreneurship як applied route: системи мають не просто існувати, а працювати в реальному циклі.",
        en: "Automation / AI Ops is built on Technology as the base and Entrepreneurship as the applied route: systems should not just exist, they should work inside real operating cycles.",
      },
    },
    "client-projects": {
      sphereLabel: { ua: "SPHERE: E + T", en: "SPHERE: E + T" },
      setLead: {
        ua: "Client Projects тут читається як E + T: Entrepreneurship дає delivery logic і клієнтський маршрут, Technology дає status systems, visibility і execution shell.",
        en: "Client Projects reads here as E + T: Entrepreneurship provides the delivery logic and client route, while Technology provides status systems, visibility, and the execution shell.",
      },
    },
    "ops-systems": {
      sphereLabel: { ua: "SPHERE: E + T", en: "SPHERE: E + T" },
      setLead: {
        ua: "Ops & Systems тут стоїть на E + T: Entrepreneurship тримає operating logic, Technology тримає SOP, documentation та інструментальну архітектуру.",
        en: "Ops & Systems stands here on E + T: Entrepreneurship holds the operating logic, while Technology holds SOPs, documentation, and the tooling architecture.",
      },
    },
    "leadership-team": {
      sphereLabel: { ua: "SPHERE: E + S", en: "SPHERE: E + S" },
      setLead: {
        ua: "Leadership / Team тут ближче до E + S: Entrepreneurship тримає рішення й відповідальність, Science тримає спостереження, поведінкову логіку й healthy team design.",
        en: "Leadership / Team sits closer to E + S: Entrepreneurship holds decisions and ownership, while Science supports observation, behavioral logic, and healthy team design.",
      },
    },
    "experiments": {
      sphereLabel: { ua: "SPHERE: S + E + T", en: "SPHERE: S + E + T" },
      setLead: {
        ua: "Experiments - це SET у швидкому режимі: Science дає гіпотезу, Entrepreneurship дає критерій цінності, Technology дає оболонку для тесту.",
        en: "Experiments is SET in a fast mode: Science provides the hypothesis, Entrepreneurship the value test, and Technology the shell for running it.",
      },
    },
    "publishing": {
      sphereLabel: { ua: "SPHERE: E + T", en: "SPHERE: E + T" },
      setLead: {
        ua: "Publishing тут ближче до E + T: Entrepreneurship формує line, audience і value, Technology формує систему розміщення, digital routes і publishing infrastructure.",
        en: "Publishing sits here closer to E + T: Entrepreneurship shapes the line, audience, and value, while Technology shapes the publishing system, digital routes, and infrastructure.",
      },
    },
    "quest": {
      sphereLabel: { ua: "SPHERE: S + E + T", en: "SPHERE: S + E + T" },
      setLead: {
        ua: "Quest працює як гібрид SET: Science тримає learning logic, Entrepreneurship - progression design, Technology - gamified shell і system flow.",
        en: "Quest works as a SET hybrid: Science holds the learning logic, Entrepreneurship the progression design, and Technology the gamified shell plus system flow.",
      },
    },
    "creative-practice": {
      sphereLabel: { ua: "SPHERE: K LIFE OS / CREATIVITY", en: "SPHERE: K LIFE OS / CREATIVITY" },
      setLead: {
        ua: "Creative Practice я не прив'язую жорстко до SET. Це радше K Life OS layer: Creativity or Self-Expression плюс Recreation and Hobbies, з якого інші хаби можуть черпати матеріал і сенс.",
        en: "I do not force Creative Practice directly into SET. It sits closer to a K Life OS layer: Creativity or Self-Expression plus Recreation and Hobbies, which can still feed the other hubs with material and meaning.",
      },
    },
  };

  const signalDefaults = {
    "identity-brand": {
      pressure: {
        ua: [
          "позиціонування звучить розмито або як чужий шаблон",
          "є робота, але немає ясної brand frame",
          "message не тримає ні тебе, ні офер",
        ],
        en: [
          "the positioning sounds blurry or borrowed",
          "there is work, but no clear brand frame",
          "the message does not hold either you or the offer",
        ],
      },
      fix: {
        ua: [
          "зібрати ясний brand core і voice",
          "перевести сенс у message system",
          "дати хабам одну впізнавану лінію",
        ],
        en: [
          "assemble a clear brand core and voice",
          "turn meaning into a message system",
          "give the hubs one recognizable line",
        ],
      },
    },
    "community-partnerships": {
      pressure: {
        ua: [
          "контакти є, але немає карти впливу",
          "багато руху без ясної ROI-логіки",
          "партнерства формуються хаотично",
        ],
        en: [
          "there are contacts, but no map of influence",
          "there is movement without a clean ROI logic",
          "partnerships form chaotically",
        ],
      },
      fix: {
        ua: [
          "зібрати selective partner map",
          "обрати 2-3 правильні формати присутності",
          "дати outreach чисту й керовану архітектуру",
        ],
        en: [
          "build a selective partner map",
          "choose 2-3 right formats of presence",
          "give outreach a clean controllable architecture",
        ],
      },
    },
    "investments": {
      pressure: {
        ua: [
          "рішення йдуть за шумом, а не за thesis",
          "можливості не проходять один фільтр",
          "важко відрізнити сигнал від FOMO",
        ],
        en: [
          "decisions follow noise instead of a thesis",
          "opportunities are not passing through one filter",
          "it is hard to separate signal from FOMO",
        ],
      },
      fix: {
        ua: [
          "зібрати decision filters і red flags",
          "вирівняти інвестиційне мислення навколо thesis",
          "бачити можливості через ясну рамку, а не імпульс",
        ],
        en: [
          "assemble decision filters and red flags",
          "align investment thinking around a thesis",
          "see opportunities through a clear frame rather than impulse",
        ],
      },
    },
    "life-os": {
      pressure: {
        ua: [
          "сфери життя розходяться без спільної системи",
          "нотатки, плани й рефлексія не зшиті",
          "порядок тримається лише на зусиллі",
        ],
        en: [
          "life spheres drift without one operating system",
          "notes, plans, and reflection are not stitched together",
          "order is held only by effort",
        ],
      },
      fix: {
        ua: [
          "зібрати особисту operating system",
          "дати сферам життя одну опорну логіку",
          "перетворити хаос на тихий ритм і видимість",
        ],
        en: [
          "assemble a personal operating system",
          "give life spheres one supporting logic",
          "turn chaos into a quieter rhythm with visibility",
        ],
      },
    },
    "automation-ai-ops": {
      pressure: {
        ua: [
          "ручні цикли з'їдають увагу й час",
          "потоки даних ламаються між людьми й інструментами",
          "automation є, але вона не зшита в систему",
        ],
        en: [
          "manual cycles consume attention and time",
          "data flows break between people and tools",
          "automation exists, but it is not stitched into one system",
        ],
      },
      fix: {
        ua: [
          "побачити hate-tasks і перевести їх у flow",
          "дати процесу logic map і ownership",
          "зібрати automation як керований operational layer",
        ],
        en: [
          "spot the hate-tasks and turn them into a flow",
          "give the process a logic map and ownership",
          "assemble automation as a controllable operational layer",
        ],
      },
    },
    "client-projects": {
      pressure: {
        ua: [
          "delivery втрачає форму між листуванням і дедлайнами",
          "статуси живуть у голові, а не в системі",
          "клієнт бачить хаос замість руху",
        ],
        en: [
          "delivery loses shape between messaging and deadlines",
          "statuses live in someone's head instead of a system",
          "the client sees chaos instead of movement",
        ],
      },
      fix: {
        ua: [
          "дати проєкту delivery pipeline",
          "зробити статуси видимими й повторюваними",
          "перевести execution у керований процес",
        ],
        en: [
          "give the project a delivery pipeline",
          "make statuses visible and repeatable",
          "turn execution into a controllable process",
        ],
      },
    },
    "ops-systems": {
      pressure: {
        ua: [
          "процеси існують лише в голові",
          "знання губиться при кожному новому циклі",
          "система не переживає навантаження",
        ],
        en: [
          "processes exist only in someone's head",
          "knowledge gets lost with every new cycle",
          "the system does not survive load",
        ],
      },
      fix: {
        ua: [
          "зібрати SOP, docs і rituals",
          "дати процесу відтворюваність",
          "зменшити крихкість і залежність від пам'яті",
        ],
        en: [
          "assemble SOPs, docs, and rituals",
          "give the process repeatability",
          "reduce fragility and dependence on memory",
        ],
      },
    },
    "leadership-team": {
      pressure: {
        ua: [
          "ролі пливуть, відповідальність розмивається",
          "зустрічі не дають рішення",
          "friction з'їдає командний ресурс",
        ],
        en: [
          "roles drift and responsibility blurs",
          "meetings do not produce decisions",
          "friction consumes team energy",
        ],
      },
      fix: {
        ua: [
          "дати команді ясні ролі й decision rules",
          "зменшити тертя між людьми й контекстами",
          "перевести leadership у здорову структуру",
        ],
        en: [
          "give the team clear roles and decision rules",
          "reduce friction between people and contexts",
          "move leadership into a healthier structure",
        ],
      },
    },
    "experiments": {
      pressure: {
        ua: [
          "ідеї або зависають, або одразу роздуваються",
          "немає безпечного простору для швидкого test",
          "validation змішується з бажанням одразу масштабувати",
        ],
        en: [
          "ideas either stall or get overbuilt too early",
          "there is no safe space for a fast test",
          "validation gets mixed with the urge to scale immediately",
        ],
      },
      fix: {
        ua: [
          "дати гіпотезі швидкий test shell",
          "відсіяти слабкі ідеї до великих витрат",
          "отримати чесний сигнал до масштабування",
        ],
        en: [
          "give the hypothesis a fast test shell",
          "filter weak ideas before large costs",
          "get an honest signal before scaling",
        ],
      },
    },
    "publishing": {
      pressure: {
        ua: [
          "тексти накопичуються без publish system",
          "авторська лінія не складається в маршрут",
          "release-и не мають ритму",
        ],
        en: [
          "writing accumulates without a publishing system",
          "the author line does not turn into a route",
          "releases have no rhythm",
        ],
      },
      fix: {
        ua: [
          "зібрати publishing line і release rhythm",
          "дати текстам систему виходу назовні",
          "пов'язати авторський шар із публічними маршрутами",
        ],
        en: [
          "assemble a publishing line and release rhythm",
          "give texts a system for going public",
          "connect the author layer to public routes",
        ],
      },
    },
    "quest": {
      pressure: {
        ua: [
          "шлях відчувається як сухий список задач",
          "мотивація тримається тільки на дисципліні",
          "немає narrative shell, що веде далі",
        ],
        en: [
          "the path feels like a dry task list",
          "motivation depends only on discipline",
          "there is no narrative shell that keeps moving you forward",
        ],
      },
      fix: {
        ua: [
          "дати руху quest logic і checkpoints",
          "зробити progression відчутним",
          "перетворити system flow на пригоду з результатом",
        ],
        en: [
          "give the motion quest logic and checkpoints",
          "make progression tangible",
          "turn the system flow into an adventure with an outcome",
        ],
      },
    },
    "creative-practice": {
      pressure: {
        ua: [
          "творчість губиться під тиском utilitarian outputs",
          "внутрішній шар не має захищеного простору",
          "креатив починає існувати лише як deliverable",
        ],
        en: [
          "creativity gets crushed by utilitarian outputs",
          "the inner layer has no protected space",
          "creative work starts existing only as a deliverable",
        ],
      },
      fix: {
        ua: [
          "залишити для творчості окремий внутрішній шар",
          "дати їй право бути джерелом, а не тільки продуктом",
          "дозволити цьому простору живити інші хаби природно",
        ],
        en: [
          "preserve a separate internal layer for creative practice",
          "let it be a source rather than only a product",
          "allow this space to nourish the other hubs naturally",
        ],
      },
    },
  };

  HUBS.forEach((hub) => {
    hub.overviewStyle = "legacySignals";
    hub.disableOverviewRoute = true;

    const defaults = sphereDefaults[hub.id];
    if (defaults) {
      hub.sphereLabel = hub.sphereLabel || defaults.sphereLabel;
      hub.setLead = hub.setLead || defaults.setLead;
    }

    if (!hub.mediaStack && gifStacksByHub[hub.id]) {
      hub.mediaStack = gifStacksByHub[hub.id];
    }

    const signals = signalDefaults[hub.id];
    if (signals) {
      hub.pressure = hub.pressure || signals.pressure;
      hub.fix = hub.fix || signals.fix;
    }
  });
}

applyContentOverrides();

const state = { lang: "en", modalLang: "en", facet: "strategist", mode: "all", activeHubId: null, activeSpecialId: null, activeTab: "overview" };



const refs = {

  btnEN: document.getElementById("btnEN"), btnUA: document.getElementById("btnUA"), btnModalEN: document.getElementById("btnModalEN"), btnModalUA: document.getElementById("btnModalUA"),

  facetTabs: document.getElementById("facetTabs"), modePills: document.getElementById("modePills"), panelTitle: document.getElementById("panelTitle"), panelDesc: document.getElementById("panelDesc"),

  cards: document.getElementById("cards"), socialRow: document.getElementById("socialRow"), modal: document.getElementById("modal"), modalTitle: document.getElementById("modalTitle"),

  overviewSlot: document.getElementById("overviewSlot"), formSlot: document.getElementById("formSlot"), routesSlot: document.getElementById("routesSlot"), paneOverview: document.getElementById("paneOverview"), paneForm: document.getElementById("paneForm"), paneRoutes: document.getElementById("paneRoutes"),

  tabOverview: document.getElementById("tabOverview"), tabForm: document.getElementById("tabForm"), tabRoutes: document.getElementById("tabRoutes"), btnModalClose: document.getElementById("btnModalClose"),

};



function getText(source, lang) { if (typeof source === "string") return source; if (!source) return ""; return source[lang] ?? source.ua ?? source.en ?? ""; }

function getDict(path, lang = state.lang) { return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), dict[lang]) ?? ""; }

function getLocalizedSphereLabel(source, lang) {
  const raw = getText(source, lang);
  if (!raw) return "";
  if (lang !== "ua") return raw;

  return raw
    .replace(/^SPHERE:/i, "СФЕРА:")
    .replace("K LIFE OS / CREATIVITY", "K LIFE OS / ТВОРЧІСТЬ");
}

function escapeHtml(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }

function modeLabels(mode, lang) { return getDict(`modeSummary.${mode}`, lang); }

function humanRole(role, lang) { return getDict(`roleNames.${role}`, lang); }

function renderStaticI18n() {

  document.querySelectorAll("[data-i18n]").forEach((node) => {

    const key = node.getAttribute("data-i18n");

    const text = getDict(key, state.lang);

    if (text) node.textContent = text;

  });

  document.querySelectorAll("[data-i18n-html]").forEach((node) => {

    const key = node.getAttribute("data-i18n-html");

    const text = getDict(key, state.lang);

    if (text) node.innerHTML = text;

  });

  const mark = document.querySelector(".mark");

  if (mark) mark.style.backgroundColor = state.lang === "ua" ? "#cccccc" : "#0b0b0c";

  refs.btnEN.classList.toggle("active", state.lang === "en");

  refs.btnUA.classList.toggle("active", state.lang === "ua");

  refs.btnModalEN.classList.toggle("active", state.modalLang === "en");

  refs.btnModalUA.classList.toggle("active", state.modalLang === "ua");

}



function renderPanel() {

  refs.panelTitle.textContent = getText(roleMeta[state.facet].title, state.lang);

  refs.panelDesc.textContent = getText(roleMeta[state.facet].desc, state.lang);

  refs.facetTabs.querySelectorAll(".facetTab").forEach((btn) => btn.classList.toggle("active", btn.dataset.facet === state.facet));

  refs.modePills.querySelectorAll(".pill").forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === state.mode));

}



function getFilteredHubs() {

  return HUBS.filter((hub) => {

    if (hub.role !== state.facet) return false;

    if (state.mode === "all") return true;

    if (state.mode === "project") return hub.modes.includes("project") || hub.modes.includes("self");

    return hub.modes.includes(state.mode);

  });

}



function renderModeTags(modes, lang) {

  return modes.map((mode) => `<span class="modeTag">${escapeHtml(modeLabels(mode, lang))}</span>`).join("");

}



function renderCards() {

  const hubs = getFilteredHubs();

  if (!hubs.length) {

    refs.cards.innerHTML = `<div class="placeholder"><div class="placeholderText">${escapeHtml(getDict("placeholder"))}</div></div>`;

    return;

  }

  refs.cards.innerHTML = hubs.map((hub) => `

    <article class="card">

      <div class="cardTop"><span class="cardCode">${escapeHtml(hub.code)}</span><div class="cardMeta"><span class="cardRole">${escapeHtml(humanRole(hub.role, state.lang))}</span><span class="cardIntent">${escapeHtml(getCardIntentLabel(hub, state.lang))}</span></div></div>

      <div class="cardTitleRow">

        <div class="cardLogo"><img src="${escapeHtml(hub.logo)}" alt="${escapeHtml(getText(hub.title, state.lang))}" /></div>

        <div class="cardTitleWrap"><h3 class="cardTitle">${escapeHtml(getText(hub.title, state.lang))}</h3><div class="cardModeSummary">${escapeHtml(getText(hub.summary, state.lang))}</div></div>

      </div>


      <div class="cardLine">${escapeHtml(getText(hub.overview, state.lang))}</div>

      <div class="cardActions"><button class="btn primary cardCta" type="button" data-open-hub="${escapeHtml(hub.id)}">${escapeHtml(getDict("btnOpen"))}</button></div>

    </article>

  `).join("");

}



function renderSocials() {
  refs.socialRow.innerHTML = socialLinks.map((item) => {
    const label = escapeHtml(getText(item.label, state.lang));
    const hint = escapeHtml(getText(item.hint, state.lang));
    const note = escapeHtml(getText(item.note, state.lang));
    return `<a class="socialChip" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"><span>${label}</span><small>${hint}</small><em>${note}</em></a>`;
  }).join("");
}



function getActiveEntry() {

  if (state.activeHubId) return HUBS.find((hub) => hub.id === state.activeHubId) || null;

  if (state.activeSpecialId) return specialEntries[state.activeSpecialId] || null;

  return null;

}



function renderMedia(entry, lang) {

  if (Array.isArray(entry.mediaStack) && entry.mediaStack.length) {

    const stackClass = entry.mediaStack.length === 1
      ? "overviewMediaStack overviewMediaStack--single"
      : "overviewMediaStack";

    return `<div class="${stackClass}">${entry.mediaStack.map((media) => {

      const caption = escapeHtml(getText(media.caption, lang));

      if (media.type === "video") {

        return `<div class="overviewMediaItem"><video autoplay loop muted playsinline><source src="${escapeHtml(media.src)}" type="video/mp4" /></video><div class="mediaOverlay">${caption}</div></div>`;

      }

      return `<div class="overviewMediaItem"><img src="${escapeHtml(media.src)}" alt="${escapeHtml(getText(entry.title, lang))}" /><div class="mediaOverlay">${caption}</div></div>`;

    }).join("")}</div>`;

  }

  const media = entry.media;

  if (!media) return "";

  const caption = escapeHtml(getText(media.caption, lang));

  if (media.type === "video") {

    return `<div class="overviewMedia"><video controls autoplay loop muted playsinline><source src="${escapeHtml(media.src)}" type="video/mp4" /></video><div class="mediaOverlay">${caption}</div></div>`;

  }

  return `<div class="overviewMedia"><img src="${escapeHtml(media.src)}" alt="${escapeHtml(getText(entry.title, lang))}" /><div class="mediaOverlay">${caption}</div></div>`;

}



function renderProjectList(entry, lang) {

  const list = entry.projects ? entry.projects[lang] : null;

  if (!list || !list.length) return "";

  return `<div class="infoBlock"><h4>${escapeHtml(getDict("overviewProjects", lang))}</h4><div class="projectList">${list.map((item) => `<div class="projectItem"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.body)}</p></div>`).join("")}</div></div>`;

}

function getPrimaryLink(entry) {

  const links = Array.isArray(entry.links) ? entry.links : [];
  const priority = ["form", "intake", "site", "live", "repo", "org", "project", "self", "profile"];

  for (const kind of priority) {
    const found = links.find((link) => link.kind === kind && !link.disabled && link.url);
    if (found) return found;
  }

  return links.find((link) => !link.disabled && link.url) || null;

}

function getActionLabel(link, lang) {

  if (!link) return getDict("overviewActionLinks", lang);

  const map = {
    form: "overviewActionForm",
    intake: "overviewActionForm",
    site: "overviewActionSite",
    live: "overviewActionSite",
    repo: "overviewActionRepo",
    org: "overviewActionRepo",
    project: "overviewActionLinks",
    self: "overviewActionLinks",
    profile: "overviewActionLinks",
  };

  return getDict(map[link.kind] || "overviewActionLinks", lang);

}

function renderSignalPanel(entry, lang, kind) {

  const items = entry[kind]?.[lang] || [];
  if (!items.length) return "";
  const kicker = kind === "pressure" ? getDict("overviewPressure", lang) : getDict("overviewFix", lang);
  const panelClass = kind === "pressure" ? "pain" : "fix";

  return `<div class="signalPanel signalPanel--${panelClass}"><div class="signalKicker">${escapeHtml(kicker)}</div><ul class="signalList">${items.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></div>`;

}

function renderSetMethod(entry, lang) {

  const lead = getText(entry.setLead, lang);
  const rows = entry.setMap?.[lang] || [];
  const sphereLabel = getLocalizedSphereLabel(entry.sphereLabel, lang);
  if (!sphereLabel && !lead && !rows.length) return "";

  return `<section class="setMethodBlock">
    <div class="setMethodHead">
      <span class="setMethodKicker">${escapeHtml(getDict("overviewSetMethod", lang))}</span>
      ${sphereLabel ? `<span class="setMethodSphere">${escapeHtml(sphereLabel)}</span>` : ""}
    </div>
    ${lead ? `<p class="setMethodLead">${escapeHtml(lead)}</p>` : ""}
    ${rows.length ? `<div class="setMethodRows">${rows.map((row) => `<div class="setMethodRow"><strong>${escapeHtml(row.label || "")}</strong><p>${escapeHtml(row.body || "")}</p></div>`).join("")}</div>` : ""}
  </section>`;

}

function renderRouteStrip(entry, lang) {

  const primary = getPrimaryLink(entry);

  if (entry.disableOverviewRoute) return "";

  if (primary && (primary.kind === "form" || primary.kind === "intake")) {
    return "";
  }

  if (!primary) {
    return `<div class="routeStrip"><span class="routeLabel">${escapeHtml(getDict("overviewEntry", lang))}</span><div class="routeCopy"><strong>${escapeHtml(getDict("overviewRouteFallback", lang))}</strong><p>${escapeHtml(getText(entry.fit, lang) || "")}</p></div></div>`;
  }

  return `<div class="routeStrip"><span class="routeLabel">${escapeHtml(getDict("overviewEntry", lang))}</span><div class="routeCopy"><strong>${escapeHtml(getText(primary.label, lang) || getText(entry.title, lang))}</strong><p>${escapeHtml(getText(primary.note, lang) || getText(entry.fit, lang) || "")}</p></div><a class="routeAction" href="${escapeHtml(primary.url)}" target="_blank" rel="noreferrer">${escapeHtml(getActionLabel(primary, lang))}</a></div>`;

}

function renderFaq(entry, lang) {

  const faq = entry.faq?.[lang] || [];
  const cards = [];

  if (getText(entry.fit, lang)) {
    cards.push(`<div class="faqCard faqCard--fit"><span class="faqLabel">${escapeHtml(getDict("overviewBestFit", lang))}</span><strong>${escapeHtml(getText(entry.title, lang))}</strong><p>${escapeHtml(getText(entry.fit, lang))}</p></div>`);
  }

  faq.slice(0, 2).forEach((item) => {
    cards.push(`<div class="faqCard"><strong>${escapeHtml(item.q || "")}</strong><p>${escapeHtml(item.a || "")}</p></div>`);
  });

  if (!cards.length) return "";

  return `<div class="faqSection"><div class="faqHeader"><h4>${escapeHtml(getDict("overviewFaqTitle", lang))}</h4></div><div class="faqCards">${cards.join("")}</div></div>`;

}



function renderLegacyPrice(entry, lang) {

  const price = getText(entry.price, lang);
  const note = getText(entry.priceNote, lang);
  if (!price && !note) return "";
  const label = lang === "ua" ? "Вартість" : "Cost";

  return `<div class="routeStrip routeStrip--price"><div class="routePriceWrap"><span class="routeLabel routeLabel--price">${escapeHtml(label)}</span><strong>${escapeHtml(price || "")}</strong></div><p>${escapeHtml(note || "")}</p></div>`;

}

function renderLegacyPriceStrip(entry, lang) {

  const price = getText(entry.price, lang);
  const note = getText(entry.priceNote, lang);
  const hasForm = getFormLinks(entry).length > 0;
  const hasRoutes = getRouteLinks(entry).length > 0;

  if (!price && !note && !hasForm && !hasRoutes) return "";

  const noteCopy = note || getText(entry.fit, lang) || "";
  const normalizedPrice = price
    ? price
        .replace(/^starts?\s+at\s*/i, "")
        .replace(/^від\s*/i, "")
        .trim()
    : "";
  const ctaPrice = normalizedPrice || "$5";
  const ctaLabel = hasForm
    ? (lang === "ua" ? `👉 Давайте почнемо з ${ctaPrice} 👈` : `👉 Let's start at ${ctaPrice} 👈`)
    : (lang === "ua" ? "👉 Тицьни сюди 👈" : "👉 Tap here 👈");
  const targetTab = hasForm ? "form" : (hasRoutes ? "routes" : "");

  return `<div class="routeStrip routeStrip--price">${noteCopy ? `<p class="routePriceNote">${escapeHtml(noteCopy)}</p>` : ""}${targetTab ? `<button class="routeAction routeAction--cta" type="button" data-modal-tab-target="${escapeHtml(targetTab)}">${escapeHtml(ctaLabel)}</button>` : ""}</div>`;

}

function renderLegacySignalOverview(entry, lang) {
  const sphereLabel = getLocalizedSphereLabel(entry.sphereLabel, lang);

  return `

    <div class="overviewGrid overviewGrid--legacy">

      <div class="overviewMain">

        <div class="modalBadgeRow">
          <span class="modalBadge">${escapeHtml(entry.code || "KG")}</span>
          <span class="modalBadge">${escapeHtml(humanRole(entry.role || state.facet, lang))}</span>
          ${sphereLabel ? `<span class="modalBadge modalBadge--sphere">${escapeHtml(sphereLabel)}</span>` : ""}
        </div>

        <div class="overviewHeading">
          <h3>${escapeHtml(getText(entry.title, lang))}</h3>
          <p>${escapeHtml(getText(entry.summary, lang))}</p>
        </div>

        ${renderSetMethod(entry, lang)}

        ${entry.vibe ? `<div class="overviewVibe">${escapeHtml(getText(entry.vibe, lang))}</div>` : ""}

        <div class="overviewStoryGrid overviewStoryGrid--legacy">
          <div class="infoBlock infoBlock--story infoBlock--primary">
            <h4>${escapeHtml(getDict("overviewIntro", lang))}</h4>
            <p>${escapeHtml(getText(entry.overview, lang))}</p>
          </div>

          <div class="infoBlock infoBlock--story infoBlock--primary">
            <h4>${escapeHtml(getDict("overviewBullets", lang))}</h4>
            <ul>${(entry.bullets?.[lang] || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
          </div>
        </div>

        ${(entry.pressure?.[lang] || []).length || (entry.fix?.[lang] || []).length ? `<div class="overviewContrastGrid overviewContrastGrid--legacy">${renderSignalPanel(entry, lang, "pressure")}${renderSignalPanel(entry, lang, "fix")}</div>` : ""}

        <div class="infoBlock infoBlock--story">
          <h4>${escapeHtml(getDict("overviewFormat", lang))}</h4>
          <p>${escapeHtml(getText(entry.format, lang))}</p>
        </div>

        ${renderProjectList(entry, lang)}

        ${renderLegacyPriceStrip(entry, lang)}

        ${renderFaq(entry, lang)}

      </div>

      <aside class="overviewSide overviewSide--legacy">
        ${renderMedia(entry, lang)}
      </aside>

    </div>
  `;

}

function renderOverview(entry, lang) {

  if (entry.overviewStyle === "legacySignals") {
    return renderLegacySignalOverview(entry, lang);
  }

  const sphereLabel = getLocalizedSphereLabel(entry.sphereLabel, lang);

  return `

    <div class="overviewGrid overviewGrid--editorial">

      <div class="overviewMain">

        <div class="modalBadgeRow">
          <span class="modalBadge">${escapeHtml(entry.code || "KG")}</span>
          <span class="modalBadge">${escapeHtml(humanRole(entry.role || state.facet, lang))}</span>
          ${sphereLabel ? `<span class="modalBadge modalBadge--sphere">${escapeHtml(sphereLabel)}</span>` : ""}
        </div>

        <div class="overviewHeading">
          <h3>${escapeHtml(getText(entry.title, lang))}</h3>
          <p>${escapeHtml(getText(entry.summary, lang))}</p>
        </div>

        ${renderSetMethod(entry, lang)}

        ${entry.vibe ? `<div class="overviewVibe">${escapeHtml(getText(entry.vibe, lang))}</div>` : ""}

        <div class="overviewStoryGrid">
          <div class="infoBlock infoBlock--story infoBlock--primary">
            <h4>${escapeHtml(getDict("overviewIntro", lang))}</h4>
            <p>${escapeHtml(getText(entry.overview, lang))}</p>
          </div>

          <div class="infoBlock infoBlock--story infoBlock--primary">
            <h4>${escapeHtml(getDict("overviewBullets", lang))}</h4>
            <ul>${(entry.bullets?.[lang] || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
          </div>
        </div>

        ${(entry.pressure?.[lang] || []).length || (entry.fix?.[lang] || []).length ? `<div class="overviewContrastGrid">${renderSignalPanel(entry, lang, "pressure")}${renderSignalPanel(entry, lang, "fix")}</div>` : ""}

        <div class="infoBlock infoBlock--story">
          <h4>${escapeHtml(getDict("overviewFormat", lang))}</h4>
          <p>${escapeHtml(getText(entry.format, lang))}</p>
        </div>

        ${renderProjectList(entry, lang)}

        ${renderRouteStrip(entry, lang)}

        ${renderFaq(entry, lang)}

      </div>

      <aside class="overviewSide">
        ${renderMedia(entry, lang)}
      </aside>

    </div>

  `;

}



function mountIframeHtml(url, title = "Embedded form") {

  return `<iframe src="${escapeHtml(url)}" title="${escapeHtml(title)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

}



function getFormLinks(entry) {

  return (entry.links || []).filter((link) => link.kind === "form");

}



function getRouteLinks(entry) {

  return (entry.links || []).filter((link) => link.kind !== "form");

}



function getCardIntentLabel(hub, lang) {

  if (state.mode === "hire" && getFormLinks(hub).length) return getDict("cardHire", lang);

  if (state.mode === "project") return getDict("cardLinks", lang);

  return getFormLinks(hub).length ? getDict("cardHire", lang) : getDict("cardLinks", lang);

}



function getLinkIcon(kind) {

  const icons = {

    repo: "</>",

    site: "WEB",

    live: "LIVE",

    notion: "N",

    org: "ORG",

    form: "FORM",

    self: "SELF",

    project: "CASE",

    profile: "ME",

    intake: "FORM",

    google: "G",

  };

  return icons[kind] || "LINK";

}
function getLinkKindLabel(kind, lang) {

  const labels = {

    repo: { ua: "GitHub", en: "GitHub" },

    site: { ua: "Сайт", en: "Site" },

    live: { ua: "Наживо", en: "Live" },

    notion: { ua: "Notion", en: "Notion" },

    org: { ua: "Організація", en: "Org" },

    form: { ua: "Форма", en: "Form" },

    self: { ua: "Self", en: "Self" },

    project: { ua: "Кейс", en: "Case" },

    profile: { ua: "Профіль", en: "Profile" },

    intake: { ua: "Intake", en: "Intake" },

    google: { ua: "Google Site", en: "Google Site" },

    draft: { ua: "Чернетка", en: "Draft" },

  };

  return getText(labels[kind], lang) || kind || getDict("draftLabel", lang);

}




function renderForm(entry, lang) {

  const forms = getFormLinks(entry);

  if (!forms.length) {

    return `<div class="linksGrid"><p class="linkIntro">${escapeHtml(getDict("notReady", lang))}</p></div>`;

  }

  const primary = forms[0];

  const extras = forms.slice(1).map((link) => `<a class="linkCard" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer"><span class="linkKind"><span class="linkIcon">${escapeHtml(getLinkIcon(link.kind))}</span>${escapeHtml(getLinkKindLabel(link.kind, lang))}</span><strong>${escapeHtml(getText(link.label, lang))}</strong><p>${escapeHtml(getText(link.note, lang))}</p><span class="linkFooter">${escapeHtml(getDict("openExternal", lang))}</span></a>`).join("");

  return `<div class="linksGrid"><p class="linkIntro">${escapeHtml(getDict("formIntro", lang))}</p><div class="formFrame">${mountIframeHtml(primary.url, getText(primary.label, lang))}</div>${extras ? `<div class="linkCards formExtras">${extras}</div>` : ""}</div>`;

}



function renderRoutes(entry, lang) {

  const visibleLinks = getRouteLinks(entry);

  const cards = visibleLinks.map((link) => {

    const classes = ["linkCard"];

    const href = link.disabled ? "#" : link.url;

    if (link.disabled) classes.push("is-disabled");

    const tag = link.disabled ? "span" : "a";

    const attrs = link.disabled ? "" : `href="${escapeHtml(href)}" target="_blank" rel="noreferrer"`;

    return `<${tag} class="${classes.join(" ")}" ${attrs}><span class="linkKind"><span class="linkIcon">${escapeHtml(getLinkIcon(link.kind))}</span>${escapeHtml(getLinkKindLabel(link.kind, lang))}</span><strong>${escapeHtml(getText(link.label, lang))}</strong><p>${escapeHtml(getText(link.note, lang))}</p><span class="linkFooter">${escapeHtml(link.disabled ? getDict("notReady", lang) : getDict("openExternal", lang))}</span></${tag}>`;

  }).join("");

  const introKey = getFormLinks(entry).length ? "linksIntroHire" : "linksIntro";

  return `<div class="linksGrid"><p class="linkIntro">${escapeHtml(getDict(introKey, lang))}</p><div class="linkCards">${cards || `<div class="linkCard is-disabled"><strong>${escapeHtml(getDict("notReady", lang))}</strong></div>`}</div></div>`;

}



function getPreferredTab(entry) {

  if (state.mode === "hire" && getFormLinks(entry).length) return "form";

  if (state.mode === "project" && getRouteLinks(entry).length) return "routes";

  return "overview";

}



function renderModal() {

  const entry = getActiveEntry();

  if (!entry) return;

  const lang = state.modalLang;

  const hasForm = getFormLinks(entry).length > 0;

  const hasRoutes = getRouteLinks(entry).length > 0;

  if (state.activeTab === "form" && !hasForm) state.activeTab = hasRoutes ? "routes" : "overview";

  if (state.activeTab === "routes" && !hasRoutes) state.activeTab = hasForm ? "form" : "overview";

  refs.modalTitle.textContent = getText(entry.title, lang);

  refs.overviewSlot.innerHTML = renderOverview(entry, lang);

  refs.formSlot.innerHTML = renderForm(entry, lang);

  refs.routesSlot.innerHTML = renderRoutes(entry, lang);

  refs.tabOverview.textContent = getDict("mOverview", lang);
  refs.tabForm.textContent = getDict("mForm", lang);

  refs.tabRoutes.textContent = getDict("mLinks", lang);

  refs.btnModalClose.textContent = getDict("mClose", lang);

  refs.tabForm.style.display = hasForm ? "inline-flex" : "none";

  refs.tabRoutes.style.display = hasRoutes ? "inline-flex" : "none";

  refs.tabOverview.classList.toggle("active", state.activeTab === "overview");

  refs.tabForm.classList.toggle("active", state.activeTab === "form");

  refs.tabRoutes.classList.toggle("active", state.activeTab === "routes");

  refs.paneOverview.classList.toggle("is-active", state.activeTab === "overview");

  refs.paneForm.classList.toggle("is-active", state.activeTab === "form");

  refs.paneRoutes.classList.toggle("is-active", state.activeTab === "routes");

  refs.paneOverview.style.display = state.activeTab === "overview" ? "block" : "none";

  refs.paneForm.style.display = state.activeTab === "form" ? "block" : "none";

  refs.paneRoutes.style.display = state.activeTab === "routes" ? "block" : "none";

}



function openHub(id) { state.activeHubId = id; state.activeSpecialId = null; state.modalLang = state.lang; const entry = getActiveEntry(); state.activeTab = entry ? getPreferredTab(entry) : "overview"; refs.modal.classList.add("open"); refs.modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); renderStaticI18n(); renderModal(); }

function openSpecial(id) { state.activeHubId = null; state.activeSpecialId = id; state.modalLang = state.lang; state.activeTab = "overview"; refs.modal.classList.add("open"); refs.modal.setAttribute("aria-hidden", "false"); document.body.classList.add("modal-open"); renderStaticI18n(); renderModal(); }

function closeModal() { refs.modal.classList.remove("open"); refs.modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("modal-open"); state.activeHubId = null; state.activeSpecialId = null; state.activeTab = "overview"; }

function switchModalTab(tab) { state.activeTab = tab; renderModal(); }

function refresh() { renderStaticI18n(); renderPanel(); renderCards(); renderSocials(); if (refs.modal.classList.contains("open")) renderModal(); }



refs.btnUA.addEventListener("click", () => { state.lang = "ua"; if (!refs.modal.classList.contains("open")) state.modalLang = "ua"; refresh(); });

refs.btnEN.addEventListener("click", () => { state.lang = "en"; if (!refs.modal.classList.contains("open")) state.modalLang = "en"; refresh(); });

refs.btnModalUA.addEventListener("click", () => { state.modalLang = "ua"; renderStaticI18n(); renderModal(); });

refs.btnModalEN.addEventListener("click", () => { state.modalLang = "en"; renderStaticI18n(); renderModal(); });

refs.facetTabs.addEventListener("click", (event) => { const button = event.target.closest("[data-facet]"); if (!button) return; state.facet = button.dataset.facet; refresh(); });

refs.modePills.addEventListener("click", (event) => { const button = event.target.closest("[data-mode]"); if (!button) return; state.mode = button.dataset.mode; refresh(); });



document.addEventListener("click", (event) => {

  const hubButton = event.target.closest("[data-open-hub]");

  if (hubButton) { openHub(hubButton.dataset.openHub); return; }

  const specialButton = event.target.closest("[data-special]");

  if (specialButton) { openSpecial(specialButton.dataset.special); return; }

  const modalTabTarget = event.target.closest("[data-modal-tab-target]");

  if (modalTabTarget) { switchModalTab(modalTabTarget.dataset.modalTabTarget); return; }

  const tabButton = event.target.closest("[data-tab]");

  if (tabButton) { switchModalTab(tabButton.dataset.tab); return; }

  if (event.target === refs.modal) closeModal();

});



refs.btnModalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => { if (event.key === "Escape" && refs.modal.classList.contains("open")) closeModal(); });



function bootFromUrl() {

  const params = new URLSearchParams(window.location.search);

  const lang = params.get("lang");

  const facet = params.get("facet");

  const mode = params.get("mode");

  const open = params.get("open");

  const special = params.get("special");



  if (lang === "ua" || lang === "en") {

    state.lang = lang;

    state.modalLang = lang;

  }



  if (facet && roleMeta[facet]) {

    state.facet = facet;

  }



  if (mode && ["all", "hire", "self", "project"].includes(mode)) {

    state.mode = mode;

  }



  refresh();



  if (open && HUBS.some((hub) => hub.id === open)) {

    openHub(open);

    return;

  }



  if (special && specialEntries[special]) {

    openSpecial(special);

  }

}



bootFromUrl();









function renderSocials() {
  refs.socialRow.innerHTML = socialLinks.map((item) => {
    const label = escapeHtml(getText(item.label, state.lang));
    const hint = escapeHtml(getText(item.hint, state.lang));
    const note = escapeHtml(getText(item.note, state.lang));
    const mark = escapeHtml(label.slice(0, 1));
    return `<a class="socialChip" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"><span class="socialChipMark">${mark}</span><span class="socialChipBody"><small>${hint}</small><strong>${label}</strong><em>${note}</em></span><span class="socialChipArrow">&#8599;</span></a>`;
  }).join("");
}



