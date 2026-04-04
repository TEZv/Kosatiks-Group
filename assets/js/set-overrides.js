ÿ¬¬(() => {
  if (
    typeof HUBS === "undefined" ||
    typeof dict === "undefined" ||
    typeof specialEntries === "undefined" ||
    typeof roleMeta === "undefined"
  ) {
    return;
  }

  const copy = (en, ua = en) => ({ en, ua });
  const list = (en, ua = en) => ({ en, ua });
  const textOf = (value, lang) => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.en || value.ua || "";
  };
  const listOf = (value, lang) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value[lang] || value.en || value.ua || [];
  };
  const esc =
    typeof escapeHtml === "function"
      ? escapeHtml
      : (value) =>
          String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[char]);
  const dictText = (key, lang) => {
    if (typeof getDict === "function") return getDict(key, lang);
    return dict?.[lang]?.[key] || dict?.en?.[key] || key;
  };
  const roleLabel = (role, lang) => {
    if (typeof humanRole === "function") return humanRole(role, lang);
    return role || "";
  };

  Object.assign(dict.en, {
    navchapters: "Roles",
    navhire: "For hire",
    navcanon: "Self",
    title: "Three roles. One SET line.",
    subtitle:
      "Kosatiks Group is a routed system for strategy, entrepreneurship, technology, research, and creative signal. Open any card to see what the hub solves, how the work moves, and where the next route should go.",
    guide:
      "Each card should do two jobs at once: explain the hub clearly and make the next action obvious.",
    socialKicker: "Signal layer",
    socialTitle: "External routes and public surfaces.",
    socialSubtitle:
      "Use this layer for GitHub orgs, public profiles, ecosystem surfaces, and outward signal routes that support the wider SET system.",
    foot:
      "No generic contact form. Each offer has its own intake so requests land correctly.<br><span class=\"footer-note__minor\">*I take a limited number of projects per month, so the cleanest route matters.</span>",
    overviewIntro: "What this hub does",
    overviewBullets: "What lives inside",
    overviewFormat: "How the work moves",
    overviewProjects: "Related layers",
    overviewPressure: "The pressure",
    overviewFix: "The SET move",
    overviewEntry: "Best entry",
    overviewFaq: "Quick questions",
    overviewFaqTitle: "What people usually ask",
    overviewBestFit: "Best fit",
    overviewActionForm: "Open form",
    overviewActionRepo: "Open repo",
    overviewActionSite: "Open site",
    overviewActionLinks: "Open links",
    overviewRouteFallback: "Use the Links tab for the full route map.",
    linksIntro:
      "Use this layer for repos, sites, notes, archives, and public signal surfaces that extend the hub.",
    linksIntroHire:
      "Use this layer for proof of work, supporting routes, public references, and surrounding links for the main intake.",
    formIntro:
      "For client-facing hubs the embedded form stays the cleanest intake, so the request lands in the right path immediately.",
    cardHire: "For hire",
    cardLinks: "Links",
    mLinks: "Links",
  });

  Object.assign(dict.ua, {
    navchapters: "¦à¦-¦¬TÖ",
    navhire: "¦ßTÖ¦+ ¦¬¦-¦-¦-¦-¦¬¦¦¦-¦-TÏ",
    navcanon: "Self",
    title: "¦âTÀ¦¬ TÀ¦-¦¬TÖ. ¦Þ¦+¦-¦- SET-¦¬TÖ¦-TÖTÏ.",
    subtitle:
      "Kosatiks Group òÀÔ TÆ¦¦ ¦-¦-TÀTÈTÀTÃTÂ¦¬¦¬¦-¦-¦-¦-¦- TÁ¦¬TÁTÂ¦¦¦-¦- ¦+¦¬TÏ TÁTÂTÀ¦-TÂ¦¦¦¦TÖT×, ¦¬TÖ¦+¦¬TÀ¦¬TÔ¦-¦-¦¬TÆTÂ¦-¦-, TÂ¦¦TÅ¦-¦-¦¬¦-¦¦TÖ¦¦, ¦+¦-TÁ¦¬TÖ¦+¦¦¦¦¦-¦-TÏ ¦¦ TÂ¦-¦-TÀTÇ¦-¦¦¦- TÁ¦¬¦¦¦-¦-¦¬TÃ. ¦ÒTÖ¦+¦¦TÀ¦¬¦¦ ¦-TÃ¦+TÌ-TÏ¦¦TÃ ¦¦¦-TÀTÂ¦¦TÃ, TÉ¦-¦- ¦¬¦-¦-¦-TÇ¦¬TÂ¦¬, TÉ¦- TÁ¦-¦-¦¦ ¦-¦¬TÀTÖTÈTÃTÔ TÅ¦-¦-, TÏ¦¦ TÀTÃTÅ¦-TÔTÂTÌTÁTÏ TÀ¦-¦-¦-TÂ¦- TÖ ¦¦TÃ¦+¦¬ ¦-¦-TÔ ¦-¦¦TÁTÂ¦¬ ¦-¦-TÁTÂTÃ¦¬¦-¦¬¦¦ ¦¦TÀ¦-¦¦.",
    guide:
      "¦Ú¦-¦¦¦-¦- ¦¦¦-TÀTÂ¦¦¦- ¦-¦-TÔ TÀ¦-¦-¦¬TÂ¦¬ ¦+¦-TÖ TÀ¦¦TÇTÖ ¦-¦+¦-¦-TÇ¦-TÁ¦-¦-: TÇTÖTÂ¦¦¦- ¦¬¦-TÏTÁ¦-TÎ¦-¦-TÂ¦¬ TÅ¦-¦- TÖ ¦-TÖ¦+TÀ¦-¦¬TÃ ¦¬¦-¦¦¦-¦¬TÃ¦-¦-TÂ¦¬ ¦¬TÀ¦-¦-¦¬¦¬TÌ¦-¦¬¦¦ ¦-¦-TÁTÂTÃ¦¬¦-¦¬¦¦ ¦¦TÀ¦-¦¦.",
    socialKicker: "Signal layer",
    socialTitle: "¦×¦-¦-¦-TÖTÈ¦-TÖ ¦-¦-TÀTÈTÀTÃTÂ¦¬ ¦¦ ¦¬TÃ¦-¦¬TÖTÇ¦-TÖ ¦¬¦-¦-¦¦TÀTÅ¦-TÖ.",
    socialSubtitle:
      "¦Ò¦¬¦¦¦-TÀ¦¬TÁTÂ¦-¦-TÃ¦¦ TÆ¦¦¦¦ TÈ¦-TÀ ¦+¦¬TÏ GitHub-¦-TÀ¦¦¦-¦-TÖ¦¬¦-TÆTÖ¦¦, ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬TÅ ¦¬TÀ¦-TÄTÖ¦¬TÖ¦-, ecosystem-¦¬¦-¦-¦¦TÀTÅ¦-¦-TÌ TÖ ¦¬¦-¦-¦-TÖTÈ¦-TÖTÅ ¦-¦-TÀTÈTÀTÃTÂTÖ¦-, TÏ¦¦TÖ ¦¬TÖ¦+TÂTÀ¦¬¦-TÃTÎTÂTÌ TÈ¦¬TÀTÈTÃ SET-TÁ¦¬TÁTÂ¦¦¦-TÃ.",
    foot:
      "¦Ñ¦¦¦¬ ¦¬¦-¦¦¦-¦¬TÌ¦-¦-T× ¦¦¦-¦-TÂ¦-¦¦TÂ¦-¦-T× TÄ¦-TÀ¦-¦¬. ¦ã ¦¦¦-¦¦¦-¦-T× ¦¬TÀ¦-¦¬¦-¦¬¦¬TÆTÖT× TÔ TÁ¦-TÖ¦¦ ¦-¦¦TÀ¦¦¦-¦¬¦¦ intake, TÉ¦-¦- ¦¬¦-¦¬¦¬TÂ ¦-¦+TÀ¦-¦¬TÃ ¦¬¦-¦+¦-¦- TÃ ¦¬TÀ¦-¦-¦¬¦¬TÌ¦-¦¬¦¦ ¦-¦-TÀTÈTÀTÃTÂ.<br><span class=\"footer-note__minor\">*¦ï ¦-¦¦TÀTÃ ¦-¦-¦-¦¦¦¦¦¦¦-TÃ ¦¦TÖ¦¬TÌ¦¦TÖTÁTÂTÌ ¦¬TÀ¦-TÔ¦¦TÂTÖ¦- ¦-¦- ¦-TÖTÁTÏTÆTÌ, TÂ¦-¦-TÃ TÇ¦¬TÁTÂ¦¬¦¦ ¦-TÅTÖ¦+ ¦-¦-TÔ ¦¬¦-¦-TÇ¦¦¦-¦-TÏ.</span>",
    overviewIntro: "¦é¦- TÀ¦-¦-¦¬TÂTÌ TÆ¦¦¦¦ TÅ¦-¦-",
    overviewBullets: "¦é¦- TÂTÃTÂ ¦¦¦¬¦-¦¦",
    overviewFormat: "¦ï¦¦ TÀTÃTÅ¦-TÔTÂTÌTÁTÏ TÀ¦-¦-¦-TÂ¦-",
    overviewProjects: "¦ß¦-¦-'TÏ¦¬¦-¦-TÖ TÈ¦-TÀ¦¬",
    overviewPressure: "¦â¦¬TÁ¦¦",
    overviewFix: "SET-TÀTÃTÅ",
    overviewEntry: "¦Ý¦-¦¦¦¦TÀ¦-TÉ¦¬¦¦ ¦-TÅTÖ¦+",
    overviewFaq: "¦è¦-¦¬¦+¦¦TÖ ¦¬¦¬TÂ¦-¦-¦-TÏ",
    overviewFaqTitle: "¦é¦- ¦¬¦-¦¬¦-¦¬TÇ¦-¦¦ TÅ¦-TÇTÃTÂTÌ ¦¬¦-¦-TÂ¦¬",
    overviewBestFit: "¦Ý¦-¦¦¦¦TÀ¦-TÉ¦¦ ¦¬¦-TÁTÃTÔ",
    overviewActionForm: "¦ÒTÖ¦+¦¦TÀ¦¬TÂ¦¬ TÄ¦-TÀ¦-TÃ",
    overviewActionRepo: "¦ÒTÖ¦+¦¦TÀ¦¬TÂ¦¬ TÀ¦¦¦¬¦-¦¬¦¬TÂ¦-TÀTÖ¦¦",
    overviewActionSite: "¦ÒTÖ¦+¦¦TÀ¦¬TÂ¦¬ TÁ¦-¦¦TÂ",
    overviewActionLinks: "¦ÒTÖ¦+¦¦TÀ¦¬TÂ¦¬ ¦¬TÖ¦-¦¦¦¬",
    overviewRouteFallback: "¦Ô¦¬TÏ ¦¬¦-¦-¦-¦-T× ¦¦¦-TÀTÂ¦¬ ¦¬¦¦TÀ¦¦TÅ¦-¦+TÌ TÃ ¦-¦¦¦¬¦-¦+¦¦TÃ Links.",
    linksIntro:
      "¦Ò¦¬¦¦¦-TÀ¦¬TÁTÂ¦-¦-TÃ¦¦ TÆ¦¦¦¦ TÈ¦-TÀ ¦+¦¬TÏ TÀ¦¦¦¬¦-¦¬¦¬TÂ¦-TÀTÖT×¦-, TÁ¦-¦¦TÂTÖ¦-, ¦-¦-TÂ¦-TÂ¦-¦¦, ¦-TÀTÅTÖ¦-TÖ¦- TÖ ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬TÅ signal-¦¬¦-¦-¦¦TÀTÅ¦-¦-TÌ, TÏ¦¦TÖ ¦¬TÀ¦-¦+¦-¦-¦¦TÃTÎTÂTÌ TÅ¦-¦-.",
    linksIntroHire:
      "¦Ò¦¬¦¦¦-TÀ¦¬TÁTÂ¦-¦-TÃ¦¦ TÆ¦¦¦¦ TÈ¦-TÀ ¦+¦¬TÏ ¦¦¦¦¦¦TÁTÖ¦-, proof-of-work, ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬TÅ TÀ¦¦TÄ¦¦TÀ¦¦¦-TÁTÖ¦- TÖ ¦¬TÖ¦+TÂTÀ¦¬¦-TÃ¦-¦-¦¬TÌ¦-¦¬TÅ ¦-¦-TÀTÈTÀTÃTÂTÖ¦- ¦-¦-¦-¦¦¦-¦¬¦- ¦-TÁ¦-¦-¦-¦-¦-¦¦¦- intake.",
    formIntro:
      "¦Ô¦¬TÏ ¦¦¦¬TÖTÔ¦-TÂTÁTÌ¦¦¦¬TÅ TÅ¦-¦-TÖ¦- ¦-¦-TÃ¦+¦-¦-¦-¦-¦- TÄ¦-TÀ¦-¦- ¦¬¦¬TÈ¦-TÔTÂTÌTÁTÏ ¦-¦-¦¦TÇ¦¬TÁTÂTÖTÈ¦¬¦- ¦-TÅ¦-¦+¦-¦-, TÉ¦-¦- ¦¬¦-¦¬¦¬TÂ ¦-¦+TÀ¦-¦¬TÃ ¦¬¦-TÂTÀ¦-¦¬¦¬TÏ¦- TÃ ¦¬TÀ¦-¦-¦¬¦¬TÌ¦-¦¬¦¦ ¦-¦-TÀTÈTÀTÃTÂ.",
    cardHire: "For hire",
    cardLinks: "Links",
    mLinks: "Links",
  });

  Object.assign(roleMeta.strategist.desc, {
    en: "Hubs where I shape direction, positioning, SET logic, partnerships, and the language of the offer.",
    ua: "¦å¦-¦-¦¬, ¦+¦¦ TÏ TÄ¦-TÀ¦-TÃTÎ ¦-¦-¦¬TÀTÏ¦-, ¦¬¦-¦¬¦¬TÆTÖTÎ¦-¦-¦-¦-TÏ, venture-¦¬¦-¦¦TÖ¦¦TÃ, ¦¬¦-TÀTÂ¦-¦¦TÀTÁTÌ¦¦TÖ TÀ¦-¦-¦¦¦¬ ¦¦ ¦-¦-¦-TÃ TÁ¦-¦-¦-T× ¦¬TÀ¦-¦¬¦-¦¬¦¬TÆTÖT×.",
  });

  Object.assign(roleMeta.producer.desc, {
    en: "Hubs where I build systems, execution routes, MVPs, operational loops, and evidence-facing SET work.",
    ua: "¦å¦-¦-¦¬, ¦+¦¦ TÏ ¦¬¦-¦¬TÀ¦-TÎ TÁ¦¬TÁTÂ¦¦¦-¦¬, execution-¦-¦-TÀTÈTÀTÃTÂ¦¬, MVP, ¦-¦¬¦¦TÀ¦-TÆTÖ¦¦¦-TÖ ¦¦¦-¦-TÂTÃTÀ¦¬ ¦¦ evidence-facing TÀ¦-¦-¦-TÂTÃ.",
  });

  Object.assign(roleMeta.creator.desc, {
    en: "Hubs where I work with narrative, publishing, creative practice, quest logic, and authorial signal.",
    ua: "¦å¦-¦-¦¬, ¦+¦¦ TÏ ¦¬TÀ¦-TÆTÎTÎ ¦¬ ¦-¦-TÀ¦-TÂ¦¬¦-¦-¦-, publishing-TÈ¦-TÀ¦-¦-¦¬, TÂ¦-¦-TÀTÇ¦-TÎ ¦¬TÀ¦-¦¦TÂ¦¬¦¦¦-TÎ, quest-¦¬¦-¦¦TÖ¦¦¦-TÎ TÂ¦- ¦-¦-TÂ¦-TÀTÁTÌ¦¦¦¬¦- TÁ¦¬¦¦¦-¦-¦¬¦-¦-.",
  });

  if (typeof socialLinks !== "undefined" && Array.isArray(socialLinks) && socialLinks.length >= 4) {
    Object.assign(socialLinks[0].note, {
      en: "One routing page for public profiles, offer entrances, and lightweight navigation across the ecosystem.",
      ua: "¦Þ¦+¦-¦- routing-TÁTÂ¦-TÀTÖ¦-¦¦¦- ¦+¦¬TÏ ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬TÅ ¦¬TÀ¦-TÄTÖ¦¬TÖ¦-, ¦-TÅ¦-¦+TÖ¦- TÃ ¦¬TÀ¦-¦¬¦-¦¬¦¬TÆTÖT× TÂ¦- ¦¬¦¦¦¦¦¦¦-¦¦¦- TÀTÃTÅTÃ ¦¬¦- ¦¦¦¦¦-TÁ¦¬TÁTÂ¦¦¦-TÖ.",
    });
    Object.assign(socialLinks[1].note, {
      en: "A second signal hub for experiments, alternate profiles, and campaign-based routing.",
      ua: "¦ÔTÀTÃ¦¦¦¬¦¦ signal-TÅ¦-¦- ¦+¦¬TÏ ¦¦¦¦TÁ¦¬¦¦TÀ¦¬¦-¦¦¦-TÂTÖ¦-, ¦-¦¬TÌTÂ¦¦TÀ¦-¦-TÂ¦¬¦-¦-¦¬TÅ ¦¬TÀ¦-TÄTÖ¦¬TÖ¦- TÖ campaign-based routing.",
    });
    Object.assign(socialLinks[2].note, {
      en: "Best place for strategist and producer framing, public cases, and ecosystem thinking.",
      ua: "¦Ý¦-¦¦¦¦TÀ¦-TÉ¦¦ ¦-TÖTÁTÆ¦¦ ¦+¦¬TÏ strategist / producer framing, ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬TÅ ¦¦¦¦¦¦TÁTÖ¦- TÖ ecosystem-thinking.",
    });
    Object.assign(socialLinks[3].note, {
      en: "A softer creator-facing surface for visual fragments, mood, and narrative entries.",
      ua: "¦Ü'TÏ¦¦TÈ¦- creator-facing ¦¬¦-¦-¦¦TÀTÅ¦-TÏ ¦+¦¬TÏ ¦-TÖ¦¬TÃ¦-¦¬TÌ¦-¦¬TÅ TÄTÀ¦-¦¦¦-¦¦¦-TÂTÖ¦-, mood TÖ narrative-¦¬¦-¦-TÖTÂ¦-¦¦.",
    });
  }

  const media = (src, en, ua = en) => ({ type: "image", src, caption: copy(en, ua) });
  const gifStack = (...items) => items;
  const patch = ({ summary, overview, bullets, format, pressure, fix, fit, vibe, faq }) => ({
    summary: copy(summary),
    overview: copy(overview),
    bullets: list(bullets),
    format: copy(format),
    pressure: list(pressure),
    fix: list(fix),
    fit: copy(fit),
    vibe: copy(vibe),
    faq: { en: faq, ua: faq },
  });

  const legacyGifStacks = {
    "identity-brand": gifStack(
      media("https://media.giphy.com/media/jWexOOlYe241y/giphy.gif", "Message drift"),
      media("https://media.giphy.com/media/lInxVz19e4YggejNuy/giphy.gif", "The idea lands")
    ),
    "community-partnerships": gifStack(
      media("https://media.giphy.com/media/l0IylOPCNkiqOgMyA/giphy.gif", "Too many threads"),
      media("https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODM1ZjVxZ2c4ejdvNWhuOTdkdjBzeTlibjM2cGJocXp5d2dmeGYxOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qsXsB3WsS5yA8/giphy.gif", "A clean handshake")
    ),
    investments: gifStack(
      media("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXpzZm10ZnNraTNicGdzNHllNGZnNXZ2cWJhcHRjdG5ya3UyenFqcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wWqEtUmXr0m3u/giphy.gif", "Market noise"),
      media("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2o5M3ZudTBrNmdsb3gzbmt0OXo1bXY1MnZtMmhhYm5xaWgxMjF6eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SbWAWZf4QRgyI/giphy.gif", "Thesis lens")
    ),
    "life-os": gifStack(
      media("https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2djcXgzZzFkdmowNW8wd2wyaXpuODY4aHdmamtkemRzYjdtd2htaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h1QuBBXMeIj7fTyRSj/giphy.gif", "Life overload"),
      media("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3IyN2xlMHk5Y2Fnc2U4amZ5anRsNWx4cWwza3RwcmE4NWNlNWI1biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tqfS3mgQU28ko/giphy.gif", "The system breathes")
    ),
    "automation-ai-ops": gifStack(
      media("https://media.giphy.com/media/urvsFBDfR6N32/giphy.gif", "Manual chaos"),
      media("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGlyNnEzM2czZjAzb3BzcjdwaGNiMnh2Y25qMnpubWpuOTBpZmo2OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Sf5T0iac3uALqpzxJ9/giphy.gif", "Jarvis mode")
    ),
    "client-projects": gifStack(
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3MxMjNjZ2d4MDl2c2tsdXdvZjZ2NjZ4YzJvbGxwaGF3MTZveXphbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iDxpH2bZalq5eRnOfq/giphy.gif", "Before structure"),
      media("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmR1aHl5Zzc4dG40cnBsNmRrcjh6aXV5YW02MDlzd244NTAwMnNjdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nin5M8EVAUd5EFOxnZ/giphy.gif", "Delivery rhythm")
    ),
    "venture-studio": gifStack(
      media("https://media.giphy.com/media/lInxVz19e4YggejNuy/giphy.gif", "Idea spark"),
      media("https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHBnNHhzbGV3NWpnZnZmZXBjeGJ2NjYxaHFzcjY3b2M5Z3V4MjZnMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xePyGsKplOK5dHG/giphy.gif", "Ship it")
    ),
    "krnd-lab": gifStack(
      media("https://media.giphy.com/media/fqIBaMWI7m7O8/giphy.gif", "Research mode"),
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjVwdzJqazlkb3NwcHRkeTI5M2toMTFlcjE4anhpeGhmbmp5ZHJodCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TncmRRvEGVoVcHgaAb/giphy.gif", "Evidence layer")
    ),
    "ops-systems": gifStack(
      media("https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif", "When the process burns"),
      media("https://media.giphy.com/media/d2Z4rTi11c9LRita/giphy.gif", "When the system holds")
    ),
    "leadership-team": gifStack(
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWY3YWVwMjJ3N3VlODd2ZGFqajltbm9mZnViYnM1YnZqYnJhbDFjbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FBYTrYyjsyq7m/giphy.gif", "Meetings without shape"),
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWY3YWVwMjJ3N3VlODd2ZGFqajltbm9mZnViYnM1YnZqYnJhbDFjbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FbTpEK2QndAGY/giphy.gif", "Alignment")
    ),
    experiments: gifStack(
      media("https://media.giphy.com/media/26AHPxxnSw1ks4PoQ/giphy.gif", "Hypothesis noise"),
      media("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", "Clean signal")
    ),
    mentorship: gifStack(
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWdzcXBoMnkxaDYzM3kxc3ZlbGhscjdteTIwenY2cDkxbmZvM2ZmOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13p77tfexyLtx6/giphy.gif", "A path opens"),
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRoODRjZXM3NzM4dWo4a28yZTZneDBqMXBsdnY4Z25weTA1anIweiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zWRJMe6sxeNc6VwGqV/giphy.gif", "Checkpoint")
    ),
    publishing: gifStack(
      media("https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", "Writing mode"),
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzNjZDBzbm1zMjVscDdhamllNW55aWRvM3BibWFrNzNtaTJxemJscCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BwStBxZnY7wkr8xltb/giphy.gif", "Reader enters")
    ),
    quest: gifStack(
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWdzcXBoMnkxaDYzM3kxc3ZlbGhscjdteTIwenY2cDkxbmZvM2ZmOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13p77tfexyLtx6/giphy.gif", "Adventure map"),
      media("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmRoODRjZXM3NzM4dWo4a28yZTZneDBqMXBsdnY4Z25weTA1anIweiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zWRJMe6sxeNc6VwGqV/giphy.gif", "Treasure ahead")
    ),
    "creative-practice": gifStack(
      media("https://media.giphy.com/media/26AHPxxnSw1ks4PoQ/giphy.gif", "Inner spark"),
      media("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", "Room to play")
    ),
  };
  const hubPatches = {
    "identity-brand": patch({
      summary:
        "Strategic identity, message architecture, and offer framing for people and projects that need to become legible fast.",
      overview:
        "This hub turns scattered expertise into one readable frame. It is where positioning, naming, message hierarchy, and brand language stop drifting separately and start supporting the same promise.",
      bullets: [
        "positioning and naming logic",
        "offer architecture for site, bio, deck, and social",
        "message hierarchy that can scale across surfaces",
      ],
      format:
        "We start with message drift, compress the core promise, and then align every outward surface so the same signal lands everywhere.",
      pressure: [
        "the offer sounds different in every place",
        "people feel the energy but miss the point",
        "the founder is manually carrying the explanation",
      ],
      fix: [
        "compress the logic into one strong frame",
        "separate what is core from what is decorative",
        "turn brand language into a reusable system",
      ],
      fit:
        "Best for founders, authors, and hybrid profiles whose public signal still feels split.",
      vibe: "From scattered signal to one legible position.",
      faq: [
        { q: "Is this only visual branding?", a: "No. The visual shell matters, but the core work is strategic clarity and message design." },
        { q: "What changes first?", a: "Usually the frame and the language. Once that is clear, every surface becomes easier to redesign." },
      ],
    }),
    "community-partnerships": patch({
      summary:
        "Collaboration design, ecosystem mapping, and partner logic for outward-facing growth that should feel intentional.",
      overview:
        "This hub is for communities, collaborations, and partnerships that matter commercially and strategically. The work is to decide who should connect, why the relationship matters, and which format makes the exchange real.",
      bullets: [
        "ecosystem mapping and relationship framing",
        "partner logic for collaborations and initiatives",
        "public-facing routes for trust, signal, and connection",
      ],
      format:
        "We map the actors first, separate soft signal from real leverage, and then design the cleanest relationship route instead of improvising every interaction.",
      pressure: [
        "too many threads with no map",
        "partnerships feel ad hoc and reactive",
        "the ecosystem is visible but not structured",
      ],
      fix: [
        "map the roles and relationship types",
        "separate signal, trust, and transaction",
        "turn loose networking into designed routes",
      ],
      fit:
        "Best for ecosystems, collectives, founder networks, and collaboration-heavy projects.",
      vibe: "From loose contacts to designed relationships.",
      faq: [
        { q: "Is this community management?", a: "Only partly. The deeper layer is strategic architecture: what kind of relationship should exist and how it should move." },
        { q: "What is the outcome?", a: "A cleaner ecosystem map, sharper partner logic, and clearer next-step routes." },
      ],
    }),
    investments: patch({
      summary:
        "A thesis-first lens for opportunity reading, venture logic, and capital-facing framing that should not be built on hype.",
      overview:
        "This hub is not about loud money talk. It is about reading opportunities with a calmer thesis: where value could emerge, what the risk actually is, and which stories still need evidence before they deserve confidence.",
      bullets: [
        "opportunity framing and thesis building",
        "venture logic around value, risk, and timing",
        "capital-facing sensemaking for emerging ideas",
      ],
      format:
        "We slow the noise down, build a sharper thesis, and then test whether the opportunity holds up against cleaner criteria.",
      pressure: [
        "hype beats judgment",
        "motion gets confused with real opportunity",
        "ideas are not framed against clear criteria",
      ],
      fix: [
        "slow the signal down",
        "build a cleaner thesis",
        "separate fascination from investable logic",
      ],
      fit:
        "Best for founder-facing reviews, early venture framing, and thesis work around emerging bets.",
      vibe: "Thesis first. Noise second.",
      faq: [
        { q: "Is this an investment fund?", a: "No. It is a strategic lens for reading opportunity with more discipline." },
        { q: "What leaves this hub?", a: "Usually a cleaner thesis, sharper framing, and better decision logic around whether to keep going." },
      ],
    }),
    "life-os": patch({
      summary:
        "A self-facing operating system for priorities, life architecture, rhythms, and decisions that should not live only in your head.",
      overview:
        "K Life OS is where private order becomes visible. It is not productivity theatre. It is a designed layer for holding priorities, patterns, rhythms, and long-arc decisions without making your brain remember everything manually.",
      bullets: [
        "life architecture and review logic",
        "self-systems for planning, notes, and pattern tracking",
        "operating routes across personal priorities",
      ],
      format:
        "We externalize the logic, create review rhythms, and build a structure that can actually hold life instead of just listing tasks.",
      pressure: [
        "life areas compete without structure",
        "important patterns stay invisible",
        "the system works only while you manually remember it",
      ],
      fix: [
        "externalize the logic",
        "create rhythms, reviews, and routes",
        "turn self-management into a designed system",
      ],
      fit:
        "Best for people building a private operating layer behind ambitious work.",
      vibe: "Hold the life, not only the tasks.",
      faq: [
        { q: "Is this just planning?", a: "No. Planning is only one layer. The real value is the architecture behind decisions, energy, and continuity." },
        { q: "Can it stay private?", a: "Yes. This hub can stay deeply internal while still being structured like a real system." },
      ],
    }),
    "automation-ai-ops": patch({
      summary:
        "Automation, AI-assisted flows, and working systems for tasks that should stop draining human attention.",
      overview:
        "This hub is not about replacing people with gimmicks. It is about finding hate-tasks, routing information correctly, and building a system that keeps working after the demo moment ends.",
      bullets: [
        "workflow mapping and operational diagnosis",
        "automation design with human checkpoints",
        "lean AI ops for repeated internal tasks",
      ],
      format:
        "We start with process pain, then map the route, then build the smallest useful automation instead of an overbuilt machine.",
      pressure: [
        "manual copy-pasting and repeated friction",
        "fear of AI without process clarity",
        "human error in repeated tasks",
      ],
      fix: [
        "spot the hate-task",
        "map the route before the bot",
        "build automation with the right checkpoints",
      ],
      fit:
        "Best for founders, operators, and teams who know the work repeats too often and too manually.",
      vibe: "Find the hate-task. Then make it disappear.",
      faq: [
        { q: "Will this replace people?", a: "No. The point is to remove waste, not erase human judgment." },
        { q: "What is the outcome?", a: "A cleaner workflow, lower friction, and a system that holds up in daily use." },
      ],
    }),
    "client-projects": patch({
      summary:
        "A delivery hub for client execution, status logic, and operational rhythm after the idea stage.",
      overview:
        "This is where work stops being only a promise and becomes a visible route. It holds deadlines, delivery order, communication rhythm, and enough structure for the client to feel the project is truly moving.",
      bullets: [
        "delivery order and execution visibility",
        "status logic and communication rhythm",
        "operational structure for client-facing work",
      ],
      format:
        "We turn the project into an operating route: what is next, what is blocked, what is delivered, and what the client should see.",
      pressure: [
        "projects drift after kickoff",
        "status is unclear",
        "clients feel the work but cannot see the route",
      ],
      fix: [
        "make the order visible",
        "turn communication into rhythm",
        "give the project an operational home",
      ],
      fit:
        "Best for live client work that already exists and now needs structure more than more intention.",
      vibe: "From promise to delivery rhythm.",
      faq: [
        { q: "Is this project management?", a: "Yes, but in a more operational and client-readable form than a generic board alone." },
        { q: "What changes first?", a: "Usually clarity: what exists, what moves next, and how the client should experience progress." },
      ],
    }),
    "venture-studio": patch({
      summary:
        "A SET venture-building hub for turning early ideas into MVPs, validation loops, and real entrepreneurial decisions.",
      overview:
        "This is the entrepreneurship engine of the wider line. It takes raw possibility, gives it a route, and pushes it toward a real test: what is the smallest thing worth building, what signal matters, and what should happen next if the idea holds.",
      bullets: [
        "venture framing, MVP routes, and build logic",
        "validation-first movement before scale theatre",
        "clear packaging for the offer, product, and next decision",
      ],
      format:
        "The route stays simple: compress, validate, build, decide. Underneath that simplicity sits the SET line: strategy to define the bet, entrepreneurship to shape the move, and technology to make the test real.",
      pressure: [
        "ideas stay too abstract for too long",
        "the product route is fuzzy",
        "people keep polishing before validation",
      ],
      fix: [
        "compress the idea into a testable build",
        "package the venture logic into one clean route",
        "let evidence decide whether the path continues",
      ],
      fit:
        "Best for founders, venture-minded builders, and hybrid operators who need a sharper route than \"let's just make something.\"",
      vibe: "From possibility to testable venture motion.",
      faq: [
        { q: "Is this only for startups?", a: "Mostly for venture-shaped work, but the same logic helps internal ventures, new products, and entrepreneurial side bets." },
        { q: "What is the output?", a: "A smaller, clearer venture route: what to build first, what to test, and what would count as a real signal." },
      ],
    }),
    "krnd-lab": patch({
      summary:
        "The research backbone of the SET line: open investigations, public artifacts, and reusable evidence surfaces across Science, Entrepreneurship, and Technology.",
      overview:
        "K-RnD Lab is where raw curiosity becomes a visible system. Questions become investigations, investigations become public artifacts, and those artifacts stay reusable instead of disappearing into private notes. It is the layer that proves the wider ecosystem can think, test, and publish seriously.",
      bullets: [
        "science, entrepreneurship, and technology research lanes",
        "public cases, dashboards, reports, and open artifacts",
        "reproducible surfaces for visible research and proof-of-thinking",
      ],
      format:
        "The movement is question -> structure -> evidence -> public artifact. A repo, report, dashboard, or demo is not decorative here; it is the evidence surface that lets the research stay legible to others.",
      pressure: [
        "research gets trapped in private notes",
        "interesting findings are not packaged for reuse",
        "public evidence layers stay fragmented",
      ],
      fix: [
        "turn investigations into visible systems",
        "package findings as reusable public artifacts",
        "connect depth, proof, and public signal in one route",
      ],
      fit:
        "Best for open investigations, research-facing products, technical case studies, and any work that needs stronger proof than a claim on a page.",
      vibe: "From inquiry to evidence to public artifact.",
      faq: [
        { q: "Is this only biomedical research?", a: "No. The lab spans Science, Entrepreneurship, and Technology, even when one lane is currently more visible than the others." },
        { q: "Why does this matter here?", a: "Because research is the strongest proof layer in the wider Kosatiks system: it shows the work can be structured, tested, and published." },
      ],
    }),
    "ops-systems": patch({
      summary:
        "Systems, SOPs, documentation, and internal architecture for work that should be repeatable and not founder-dependent.",
      overview:
        "This hub is for cases where the real problem is not the idea but the fact that nobody can reproduce the process cleanly. It turns internal know-how into a system another human can actually follow.",
      bullets: [
        "SOP design and process cleanup",
        "internal documentation and repeatability",
        "decision architecture for daily operations",
      ],
      format:
        "We identify the process pain, map the operating logic, and document the route until it becomes teachable and repeatable.",
      pressure: [
        "the process lives in one person's head",
        "handoffs are messy",
        "the system breaks when the founder steps away",
      ],
      fix: [
        "externalize the logic",
        "document the route",
        "turn hidden know-how into repeatable operating structure",
      ],
      fit:
        "Best for teams or solo operators whose work depends too much on memory and improvisation.",
      vibe: "If it matters often, it deserves a system.",
      faq: [
        { q: "Is this bureaucracy?", a: "No. The goal is lighter repetition, not heavier paperwork." },
        { q: "What leaves this hub?", a: "Clearer processes, documented steps, and lower operational fragility." },
      ],
    }),
    "leadership-team": patch({
      summary:
        "Role clarity, decision design, and team structure for situations where people exist but alignment does not.",
      overview:
        "This hub is for teams with drift: meetings that do not resolve anything, fuzzy ownership, and friction that keeps returning because the underlying structure is weak.",
      bullets: [
        "role clarity and team shape",
        "decision rules and meeting logic",
        "friction reduction through structural design",
      ],
      format:
        "We identify the recurring friction, map responsibility more clearly, and redesign the decision route so the team can move with less emotional drag.",
      pressure: [
        "roles are fuzzy",
        "decisions bounce between people",
        "friction feels interpersonal but is actually structural",
      ],
      fix: [
        "clarify ownership",
        "design cleaner decision routes",
        "reduce the hidden drag in collaboration",
      ],
      fit:
        "Best for teams, partnerships, and founder-led groups that need healthier structure more than more motivation.",
      vibe: "Less drift. More shape.",
      faq: [
        { q: "Is this team coaching?", a: "Only partly. The deeper work is structural: roles, rules, and decision paths." },
        { q: "What changes first?", a: "Usually ownership and decision logic. Once those shift, the emotional friction drops too." },
      ],
    }),
    experiments: patch({
      summary:
        "Rapid tests, validation loops, and protected spaces for checking ideas before they become oversized commitments.",
      overview:
        "This hub is for lightweight proof. Not every idea deserves a full build, a big launch, or a long emotional attachment. Sometimes the smartest move is a clean, fast test.",
      bullets: [
        "test design and lightweight validation",
        "small experiments before scale",
        "evidence loops for uncertain ideas",
      ],
      format:
        "We define the smallest useful question, run a controlled test, and let the result decide whether the idea grows, pivots, or quietly ends.",
      pressure: [
        "ideas become too big too quickly",
        "people attach before testing",
        "noise is mistaken for evidence",
      ],
      fix: [
        "make the question smaller",
        "test early and cheaply",
        "use evidence before emotional commitment",
      ],
      fit:
        "Best for uncertain bets, early hypotheses, and ideas that need signal before investment.",
      vibe: "Test first. Attach later.",
      faq: [
        { q: "Is this just A/B testing?", a: "No. The principle is broader: how to design fast reality checks before scale." },
        { q: "What is the output?", a: "A cleaner decision about whether the idea deserves more time, money, or attention." },
      ],
    }),
    mentorship: patch({
      summary:
        "A practical SET guidance layer that helps people orient, learn, build, and connect without getting lost in noise first.",
      overview:
        "K Mentorship Hub is the activation layer of the wider ecosystem. It is designed for people who need a real next step, not a motivational speech: choose a direction, understand the path, build something concrete, then connect to the right layer when the timing is real.",
      bullets: [
        "orientation across Science, Entrepreneurship, and Technology",
        "learning-path logic and practical next-step design",
        "bridges into deeper repos, tools, communities, and venture paths",
      ],
      format:
        "The path stays simple: orient, learn, build, connect. The person should feel movement, not overload. The deeper complexity sits behind the scenes, while the entry route stays human and usable.",
      pressure: [
        "people want to move but lack structure",
        "guidance feels either too vague or too heavy",
        "the next step is unclear across hybrid interests",
      ],
      fix: [
        "reduce confusion without flattening ambition",
        "frame one practical next move",
        "connect learning to a visible build path",
      ],
      fit:
        "Best for learners, early builders, hybrid profiles, and people crossing between domains who need structure without institutional heaviness.",
      vibe: "Orient first. Then learn, build, and connect.",
      faq: [
        { q: "Is this an academy?", a: "Not in the heavy, bloated sense. It is a practical guidance system with a cleaner path and lower friction." },
        { q: "What makes it SET?", a: "It helps people move across Science, Entrepreneurship, and Technology as one integrated path instead of fragmenting themselves into separate identities." },
      ],
    }),
    publishing: patch({
      summary:
        "Publishing systems, authorial logic, and narrative packaging for work that deserves a stronger public life.",
      overview:
        "This hub is for turning raw thought into structured public signal: writing, narrative framing, publishing rhythm, and the systems around getting meaningful work into the world.",
      bullets: [
        "writing and narrative architecture",
        "publishing rhythm and outward packaging",
        "authorial systems for reusable signal",
      ],
      format:
        "We shape the message, decide the publishing surface, and build a repeatable rhythm so the work can leave your drafts and meet an audience.",
      pressure: [
        "strong ideas stay trapped in notes",
        "publishing feels inconsistent",
        "the voice exists but the system does not",
      ],
      fix: [
        "shape the narrative clearly",
        "choose the right publishing route",
        "build a rhythm that keeps the signal alive",
      ],
      fit:
        "Best for researchers, authors, creators, and founder-voices with meaningful material but weak publishing structure.",
      vibe: "From drafts to public signal.",
      faq: [
        { q: "Is this content marketing?", a: "Sometimes, but the deeper layer is authorial structure: what gets said, where, and with what rhythm." },
        { q: "What changes first?", a: "Usually the framing and the cadence, so the work stops feeling random or over-forced." },
      ],
    }),
    quest: patch({
      summary:
        "A playful route for challenge arcs, curiosity-driven participation, and exploratory formats that make movement feel alive.",
      overview:
        "Quest is the layer where exploration becomes structured enough to be shared. It can hold challenge logic, discovery routes, playful participation, and lighter entry points into the wider ecosystem.",
      bullets: [
        "challenge arcs and participation logic",
        "exploration routes with narrative energy",
        "lighter entry formats for curiosity and movement",
      ],
      format:
        "We turn abstract interest into a path: a challenge, a route, a sequence, or a playful container that keeps people moving.",
      pressure: [
        "curiosity exists but has no structure",
        "entry points feel too serious or too flat",
        "playful energy is missing from the route",
      ],
      fix: [
        "design the challenge arc",
        "give exploration a visible route",
        "turn play into momentum rather than distraction",
      ],
      fit:
        "Best for experimental formats, exploratory communities, and participation layers that need more spark.",
      vibe: "Adventure as structured motion.",
      faq: [
        { q: "Is this gamification?", a: "Only when it adds real movement. The point is not badges, but a path people actually want to follow." },
        { q: "Where does it help?", a: "Whenever a project needs lighter, more inviting entry points without losing intention." },
      ],
    }),
    "creative-practice": patch({
      summary:
        "A space for creative muscle, aesthetic experiments, and output practice that keeps expression active instead of theoretical.",
      overview:
        "This hub holds the practice side of creativity: not only ideas or inspiration, but actual making, repetition, visual taste, and the cultivation of a stronger authorial hand.",
      bullets: [
        "creative exercises and output rhythm",
        "aesthetic experimentation and taste formation",
        "practice structures for expressive work",
      ],
      format:
        "We protect room for making, build small repeatable practice loops, and let craft develop through motion rather than waiting for perfect inspiration.",
      pressure: [
        "creative energy stays abstract",
        "taste grows but output stays low",
        "practice breaks when it lacks a structure",
      ],
      fix: [
        "lower the friction to make things",
        "turn inspiration into repeatable practice",
        "let output become part of the system",
      ],
      fit:
        "Best for creator-facing work, visual experiments, and authorial practice that needs a steadier rhythm.",
      vibe: "Protect the spark. Build the practice.",
      faq: [
        { q: "Is this only for artists?", a: "No. It also helps founders, researchers, and strategists who need a living creative practice around their work." },
        { q: "What matters most here?", a: "Consistency, experimentation, and a structure that keeps expression active." },
      ],
    }),
  };

  HUBS.forEach((hub) => {
    const patchData = hubPatches[hub.id];
    if (!patchData) return;
    Object.assign(hub, patchData);
    hub.mediaStack = legacyGifStacks[hub.id] || hub.mediaStack || [];
  });

  Object.assign(specialEntries.ecosystem, {
    summary: copy(
      "A routed SET ecosystem: client-facing work, self systems, venture layers, research artifacts, and public signal in one readable frame.",
      "¦Ü¦-TÀTÈTÀTÃTÂ¦¬¦¬¦-¦-¦-¦-¦- SET-¦¦¦¦¦-TÁ¦¬TÁTÂ¦¦¦-¦-: ¦¦¦¬TÖTÔ¦-TÂTÁTÌ¦¦¦- TÀ¦-¦-¦-TÂ¦-, self-TÁ¦¬TÁTÂ¦¦¦-¦¬, venture-TÈ¦-TÀ¦¬, research-¦-TÀTÂ¦¦TÄ¦-¦¦TÂ¦¬ ¦¦ ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬¦¦ TÁ¦¬¦¦¦-¦-¦¬ ¦- ¦-¦+¦-TÖ¦¦ TÇ¦¬TÂ¦-¦-¦¦¦¬TÌ¦-TÖ¦¦ TÀ¦-¦-TÆTÖ."
    ),
    overview: copy(
      "Kosatiks Group is not a single service and not a single persona. It is a routed SET system where strategy, entrepreneurship, technology, research, and creative signal can coexist without chaos.",
      "Kosatiks Group òÀÔ TÆ¦¦ ¦-¦¦ ¦-¦+¦-¦- ¦¬¦-TÁ¦¬TÃ¦¦¦- TÖ ¦-¦¦ ¦-¦+¦-¦- persona. ¦æ¦¦ ¦-¦-TÀTÈTÀTÃTÂ¦¬¦¬¦-¦-¦-¦-¦- SET-TÁ¦¬TÁTÂ¦¦¦-¦-, ¦+¦¦ TÁTÂTÀ¦-TÂ¦¦¦¦TÖTÏ, ¦¬TÖ¦+¦¬TÀ¦¬TÔ¦-¦-¦¬TÆTÂ¦-¦-, TÂ¦¦TÅ¦-¦-¦¬¦-¦¦TÖT×, ¦+¦-TÁ¦¬TÖ¦+¦¦¦¦¦-¦-TÏ ¦¦ TÂ¦-¦-TÀTÇ¦¬¦¦ TÁ¦¬¦¦¦-¦-¦¬ ¦-¦-¦¦TÃTÂTÌ TÁ¦¬TÖ¦-TÖTÁ¦-TÃ¦-¦-TÂ¦¬ ¦-¦¦¦¬ TÅ¦-¦-TÁTÃ."
    ),
    format: copy(
      "Read the site as a route map: choose a role first, then open a hub, then follow the right next step òÀÔ form, repo, site, or public layer. The point is not to browse longer, but to land faster.",
      "¦ç¦¬TÂ¦-¦¦ TÁ¦-¦¦TÂ TÏ¦¦ ¦-¦-TÀTÈTÀTÃTÂ¦-TÃ ¦-¦-¦¬TÃ: TÁ¦¬¦¦TÀTÈTÃ ¦-¦-¦¬TÀ¦-¦¦ TÀ¦-¦¬TÌ, ¦¬¦-TÂTÖ¦- ¦-TÖ¦+¦¦TÀ¦¬¦-¦-¦¦ TÅ¦-¦-, ¦- ¦+¦-¦¬TÖ ¦¦¦+¦¬ ¦- ¦¬TÀ¦-¦-¦¬¦¬TÌ¦-¦¬¦¦ ¦-¦-TÁTÂTÃ¦¬¦-¦¬¦¦ ¦¦TÀ¦-¦¦ òÀÔ TÄ¦-TÀ¦-TÃ, TÀ¦¦¦¬¦-¦¬¦¬TÂ¦-TÀTÖ¦¦, TÁ¦-¦¦TÂ ¦-¦-¦- ¦¬TÃ¦-¦¬TÖTÇ¦-¦¬¦¦ TÈ¦-TÀ. ¦á¦¦¦-TÁ ¦-¦¦ ¦- TÂ¦-¦-TÃ, TÉ¦-¦- ¦+¦-¦-TÈ¦¦ ¦-¦¬TÃ¦¦¦-TÂ¦¬, ¦- ¦- TÂ¦-¦-TÃ, TÉ¦-¦- TÈ¦-¦¬¦+TÈ¦¦ ¦¬TÀ¦¬¦¬¦¦¦-¦¬TÏTÂ¦¬TÁTÏ TÂTÃ¦+¦¬, ¦¦TÃ¦+¦¬ TÂTÀ¦¦¦-¦-."
    ),
  });

  Object.assign(specialEntries.me, {
    summary: copy(
      "I build Kosatiks Group as a system where strategy, production, research, and creativity can reinforce each other instead of splitting into disconnected personas.",
      "¦ï ¦¬¦-¦¬TÀ¦-TÎ Kosatiks Group TÏ¦¦ TÁ¦¬TÁTÂ¦¦¦-TÃ, ¦+¦¦ TÁTÂTÀ¦-TÂ¦¦¦¦TÖTÏ, ¦¬TÀ¦-¦+TÎTÁTÃ¦-¦-¦-¦-TÏ, ¦+¦-TÁ¦¬TÖ¦+¦¦¦¦¦-¦-TÏ ¦¦ TÂ¦-¦-TÀTÇTÖTÁTÂTÌ ¦¬TÖ¦+TÁ¦¬¦¬TÎTÎTÂTÌ ¦-¦+¦-¦¦ ¦-¦+¦-¦-¦¦¦-, ¦- ¦-¦¦ TÀ¦-¦¬TÅ¦-¦+TÏTÂTÌTÁTÏ ¦¬¦- TÀTÖ¦¬¦-¦¬TÅ persona."
    ),
    overview: copy(
      "The point is not to present one polished mask, but to make the real structure legible: how the work branches, how the hubs differ, and how one person can hold strategy, entrepreneurship, technology, research, and creation without flattening them into a fake single note.",
      "¦á¦¦¦-TÁ ¦-¦¦ ¦- TÂ¦-¦-TÃ, TÉ¦-¦- ¦¬¦-¦¦¦-¦¬¦-TÂ¦¬ ¦-¦+¦-TÃ polished-mask, ¦- ¦- TÂ¦-¦-TÃ, TÉ¦-¦- ¦¬TÀ¦-¦-¦¬TÂ¦¬ ¦-¦¬¦+¦¬¦-¦-TÎ TÀ¦¦¦-¦¬TÌ¦-TÃ TÁTÂTÀTÃ¦¦TÂTÃTÀTÃ: TÏ¦¦ TÀ¦-¦¬¦¦¦-¦¬TÃ¦¦TÃTÔTÂTÌTÁTÏ TÀ¦-¦-¦-TÂ¦-, TÇ¦¬¦- ¦-TÖ¦+TÀTÖ¦¬¦-TÏTÎTÂTÌTÁTÏ TÅ¦-¦-¦¬ TÖ TÏ¦¦ ¦-¦+¦-¦- ¦¬TÎ¦+¦¬¦-¦- ¦-¦-¦¦¦¦ TÂTÀ¦¬¦-¦-TÂ¦¬ TÁTÂTÀ¦-TÂ¦¦¦¦TÖTÎ, ¦¬TÖ¦+¦¬TÀ¦¬TÔ¦-¦-¦¬TÆTÂ¦-¦-, TÂ¦¦TÅ¦-¦-¦¬¦-¦¦TÖT×, ¦+¦-TÁ¦¬TÖ¦+¦¦¦¦¦-¦-TÏ ¦¦ TÂ¦-¦-TÀTÇTÖTÁTÂTÌ ¦-¦¦¦¬ TÈTÂTÃTÇ¦-¦-¦¦¦- TÁ¦¬TÀ¦-TÉ¦¦¦-¦-TÏ."
    ),
  });
  const getPrimaryLink = (entry) => {
    const links = Array.isArray(entry.links) ? entry.links : [];
    const priority = ["form", "intake", "site", "live", "repo", "org", "notion", "self", "project", "profile"];
    for (const kind of priority) {
      const found = links.find((link) => link.kind === kind && !link.disabled && link.url);
      if (found) return found;
    }
    return links.find((link) => !link.disabled && link.url) || null;
  };

  const actionLabel = (link, lang) => {
    if (!link) return dictText("overviewActionLinks", lang);
    const map = {
      form: "overviewActionForm",
      intake: "overviewActionForm",
      site: "overviewActionSite",
      live: "overviewActionSite",
      repo: "overviewActionRepo",
      org: "overviewActionRepo",
      notion: "overviewActionLinks",
      self: "overviewActionLinks",
      project: "overviewActionLinks",
      profile: "overviewActionLinks",
    };
    return dictText(map[link.kind] || "overviewActionLinks", lang);
  };

  const renderProjectBox = (entry, lang) => {
    const items = listOf(entry.projects, lang);
    if (!items.length) return "";
    return `<div class="infoBlock"><h4>${esc(dictText("overviewProjects", lang))}</h4><div class="projectList">${items
      .map(
        (item) =>
          `<div class="projectItem"><strong>${esc(item.title || "")}</strong><p>${esc(item.body || "")}</p></div>`
      )
      .join("")}</div></div>`;
  };

  const renderSignalPanel = (entry, lang, kind) => {
    const items = kind === "pain" ? listOf(entry.pressure, lang) : listOf(entry.fix, lang);
    if (!items.length) return "";
    const kicker = kind === "pain" ? "The pain" : "The fix";
    return `<div class="signalPanel signalPanel--${kind}"><div class="signalKicker">${esc(kicker)}</div><ul class="signalList">${items
      .map((line) => `<li>${esc(line)}</li>`)
      .join("")}</ul></div>`;
  };

  const renderRouteStrip = (entry, lang) => {
    const primary = getPrimaryLink(entry);
    if (!primary) {
      return `<div class="routeStrip"><span class="routeLabel">${esc(dictText("overviewEntry", lang))}</span><div class="routeCopy"><strong>${esc(dictText("overviewRouteFallback", lang))}</strong><p>${esc(textOf(entry.fit, lang))}</p></div></div>`;
    }
    return `<div class="routeStrip"><span class="routeLabel">${esc(dictText("overviewEntry", lang))}</span><div class="routeCopy"><strong>${esc(textOf(primary.label, lang) || textOf(entry.title, lang))}</strong><p>${esc(textOf(primary.note, lang) || textOf(entry.fit, lang))}</p></div><a class="routeAction" href="${esc(primary.url)}" target="_blank" rel="noreferrer">${esc(actionLabel(primary, lang))}</a></div>`;
  };

  const renderFaq = (entry, lang) => {
    const faq = listOf(entry.faq, lang);
    const cards = [];
    if (textOf(entry.fit, lang)) {
      cards.push(
        `<div class="faqCard faqCard--fit"><span class="faqLabel">${esc(dictText("overviewBestFit", lang))}</span><strong>${esc(textOf(entry.title, lang))}</strong><p>${esc(textOf(entry.fit, lang))}</p></div>`
      );
    }
    faq.slice(0, 2).forEach((item) => {
      cards.push(`<div class="faqCard"><strong>${esc(item.q || "")}</strong><p>${esc(item.a || "")}</p></div>`);
    });
    if (!cards.length) return "";
    return `<div class="faqSection"><div class="faqHeader"><h4>${esc(dictText("overviewFaqTitle", lang))}</h4></div><div class="faqCards">${cards.join("")}</div></div>`;
  };

  renderMedia = window.renderMedia = function renderMediaOverride(entry, lang) {
    const mediaStack = Array.isArray(entry.mediaStack) && entry.mediaStack.length ? entry.mediaStack : [];
    if (mediaStack.length) {
      return `<div class="overviewMediaStack">${mediaStack
        .map((item) => {
          const caption = esc(textOf(item.caption, lang));
          if (item.type === "video") {
            return `<div class="overviewMediaItem"><video autoplay loop muted playsinline><source src="${esc(item.src)}" type="video/mp4" /></video><div class="mediaOverlay">${caption}</div></div>`;
          }
          return `<div class="overviewMediaItem"><img src="${esc(item.src)}" alt="${esc(textOf(entry.title, lang))}" /><div class="mediaOverlay">${caption}</div></div>`;
        })
        .join("")}</div>`;
    }
    const media = entry.media;
    if (!media) return "";
    const caption = esc(textOf(media.caption, lang));
    return `<div class="overviewMedia"><img src="${esc(media.src)}" alt="${esc(textOf(entry.title, lang))}" /><div class="mediaOverlay">${caption}</div></div>`;
  };

  renderOverview = window.renderOverview = function renderOverviewOverride(entry, lang) {
    return `
      <div class="overviewGrid">
        <div class="overviewText">
          <div class="modalBadgeRow">
            <span class="modalBadge">${esc(entry.code || "KG")}</span>
            <span class="modalBadge">${esc(roleLabel(entry.role || state.facet, lang))}</span>
          </div>
          <div class="overviewHeading">
            <h3>${esc(textOf(entry.title, lang))}</h3>
            <p>${esc(textOf(entry.summary, lang))}</p>
          </div>
          <div class="overviewVibe">${esc(textOf(entry.vibe, lang))}</div>
          <div class="infoBlock">
            <h4>${esc(dictText("overviewIntro", lang))}</h4>
            <p>${esc(textOf(entry.overview, lang))}</p>
          </div>
          <div class="infoBlock">
            <h4>${esc(dictText("overviewBullets", lang))}</h4>
            <ul>${listOf(entry.bullets, lang).map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </div>
          <div class="overviewContrastGrid">
            ${renderSignalPanel(entry, lang, "pain")}
            ${renderSignalPanel(entry, lang, "fix")}
          </div>
          <div class="infoBlock">
            <h4>${esc(dictText("overviewFormat", lang))}</h4>
            <p>${esc(textOf(entry.format, lang))}</p>
          </div>
          ${renderProjectBox(entry, lang)}
          ${renderRouteStrip(entry, lang)}
          ${renderFaq(entry, lang)}
        </div>
        ${renderMedia(entry, lang)}
      </div>
    `;
  };

  if (typeof refresh === "function") refresh();

  const params = new URLSearchParams(window.location.search);
  const autoHub = params.get("autohub");
  const autoSpecial = params.get("autospecial");
  if (autoHub && typeof openHub === "function") {
    requestAnimationFrame(() => openHub(autoHub));
  } else if (autoSpecial && typeof openSpecial === "function") {
    requestAnimationFrame(() => openSpecial(autoSpecial));
  }
})();
