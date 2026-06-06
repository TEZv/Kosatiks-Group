// Server-only epoch calendar + canonical 40-letter sentences per book.
// Spec: docs/RIDDLE-EPOCH.md

const EPOCH_START_ISO = '2026-06-06T00:00:00.000Z';
const WEEKS_PER_EPOCH = 40;

const EPOCHS = [
  { id: 1, book: 'Šviesa',  litBook: 'Šviesa' },
  { id: 2, book: 'Aušra',   litBook: 'Aušra' },
  { id: 3, book: 'Dievas',  litBook: 'Dievas' },
  { id: 4, book: 'Vėlė',    litBook: 'Vėlė' },
  { id: 5, book: 'Ilgesys', litBook: 'Ilgesys' },
  { id: 6, book: 'Dausos',  litBook: 'Dausos' }
];

// status: draft | confirmed | locked
const SENTENCES = {
  1: {
    status: 'draft',
    canonRef: 'uk/book1/chapters/chapter_01_tisha_do_tyshi.md L116-117',
    ua: {
      display: 'Космос почався не зі світла а з мовчання повноти',
      letters: 'Космоспочавсянезісвітлаазмовчанняповноти'.split('')
    },
    en: {
      display: 'Cosmos began not from light but silent fullness',
      letters: 'Cosmosbegannotfromlightbutsilentfullness'.split('')
    }
  }
};

function epochStartMs() {
  return Date.parse(EPOCH_START_ISO);
}

function globalWeekIndex(nowMs) {
  const start = epochStartMs();
  if (!Number.isFinite(start)) return 0;
  const diff = Math.max(0, (nowMs || Date.now()) - start);
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

function resolveEpoch(nowMs) {
  const gw = globalWeekIndex(nowMs);
  if (gw < 1) {
    return {
      globalWeek: 0,
      epochIndex: 1,
      weekInEpoch: 1,
      preStart: true,
      epoch: EPOCHS[0]
    };
  }
  const epochIndex = Math.min(
    EPOCHS.length,
    Math.floor((gw - 1) / WEEKS_PER_EPOCH) + 1
  );
  const weekInEpoch = ((gw - 1) % WEEKS_PER_EPOCH) + 1;
  return {
    globalWeek: gw,
    epochIndex,
    weekInEpoch,
    preStart: false,
    epoch: EPOCHS[epochIndex - 1]
  };
}

function letterForWeek(epochIndex, weekInEpoch, lang) {
  const block = SENTENCES[epochIndex];
  if (!block) return null;
  const pack = lang === 'en' ? block.en : block.ua;
  if (!pack || !pack.letters) return null;
  const idx = weekInEpoch - 1;
  if (idx < 0 || idx >= pack.letters.length) return null;
  return {
    index: weekInEpoch,
    char: pack.letters[idx],
    display: pack.display,
    status: block.status
  };
}

function sentenceProgress(epochIndex, lang, collected) {
  const block = SENTENCES[epochIndex];
  if (!block) return { display: '', masked: '', count: 0, total: WEEKS_PER_EPOCH };
  const pack = lang === 'en' ? block.en : block.ua;
  const chars = pack.letters;
  const map = collected || {};
  let count = 0;
  const masked = chars.map((ch, i) => {
    const key = String(i + 1);
    if (map[key]) {
      count++;
      return map[key];
    }
    return '_';
  });
  return {
    display: pack.display,
    masked: masked.join(''),
    count,
    total: chars.length,
    status: block.status
  };
}

module.exports = {
  EPOCH_START_ISO,
  WEEKS_PER_EPOCH,
  EPOCHS,
  SENTENCES,
  epochStartMs,
  globalWeekIndex,
  resolveEpoch,
  letterForWeek,
  sentenceProgress
};
