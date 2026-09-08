export const routineBlueprintQuestions = [
  {
    id: 'middaySkinFeel',
    prompt: 'By midday, your skin usually feels...',
    type: 'single',
    options: [
      { value: 'tight_flaky', label: 'Tight or flaky' },
      { value: 'shiny_oily', label: 'Shiny or oily' },
      { value: 'combo', label: 'Oily in the T-zone but dry or normal elsewhere' },
      { value: 'balanced', label: 'Comfortable and balanced' },
      { value: 'reactive', label: 'Unpredictable or reactive' }
    ]
  },
  {
    id: 'afterCleansingFeel',
    prompt: 'After cleansing, your skin usually feels...',
    type: 'single',
    options: [
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'tight', label: 'Tight' },
      { value: 'greasy_quickly', label: 'Greasy again quickly' },
      { value: 'stingy_red', label: 'Stingy, hot, or red' },
      { value: 'depends_cleanser', label: 'It depends on the cleanser' }
    ]
  },
  {
    id: 'topConcerns',
    prompt: 'What are your top concerns? Pick up to 3.',
    type: 'multi',
    maxSelections: 3,
    options: [
      { value: 'breakouts', label: 'Breakouts' },
      { value: 'clogged_pores', label: 'Clogged pores' },
      { value: 'texture', label: 'Texture' },
      { value: 'dark_spots', label: 'Dark spots or post-breakout marks' },
      { value: 'redness', label: 'Redness' },
      { value: 'dryness', label: 'Dryness' },
      { value: 'fine_lines', label: 'Fine lines' },
      { value: 'sensitivity', label: 'Sensitivity' }
    ]
  },
  {
    id: 'breakoutFrequency',
    prompt: 'How often do you break out?',
    type: 'single',
    options: [
      { value: 'rarely', label: 'Rarely' },
      { value: 'occasionally', label: 'Around my cycle or occasionally' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'most_days', label: 'Most days' }
    ]
  },
  {
    id: 'productReactivity',
    prompt: 'Do products often sting, burn, or cause redness?',
    type: 'single',
    options: [
      { value: 'no', label: 'No' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'often', label: 'Often' },
      { value: 'with_actives', label: 'Only when I use active products' }
    ]
  },
  {
    id: 'drynessLevel',
    prompt: 'Do you have flaking, tightness, roughness, or a "nothing moisturizes enough" feeling?',
    type: 'single',
    options: [
      { value: 'none', label: 'No' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  },
  {
    id: 'currentProducts',
    prompt: 'What are you currently using? Select all that apply.',
    type: 'multi',
    options: [
      { value: 'cleanser', label: 'Cleanser' },
      { value: 'moisturizer', label: 'Moisturizer' },
      { value: 'sunscreen', label: 'Sunscreen' },
      { value: 'exfoliant_acids', label: 'Exfoliant or acids' },
      { value: 'retinoid', label: 'Retinoid' },
      { value: 'benzoyl_peroxide', label: 'Benzoyl peroxide' },
      { value: 'vitamin_c', label: 'Vitamin C' },
      { value: 'none_not_sure', label: 'None or not sure' }
    ]
  },
  {
    id: 'activeFrequency',
    prompt: 'How often do you use exfoliants, retinoids, benzoyl peroxide, or other strong active products?',
    type: 'single',
    options: [
      { value: 'never', label: 'Never' },
      { value: 'one_two_weekly', label: '1-2 times per week' },
      { value: 'three_four_weekly', label: '3-4 times per week' },
      { value: 'daily', label: 'Daily' },
      { value: 'multiple_daily', label: 'Multiple active products daily' }
    ]
  },
  {
    id: 'sunscreenFrequency',
    prompt: 'How often do you wear sunscreen in the morning?',
    type: 'single',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'most_days', label: 'Most days' },
      { value: 'outside_only', label: 'Only when I will be outside' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'never', label: 'Never' }
    ]
  },
  {
    id: 'helpGoal',
    prompt: 'What kind of help are you looking for?',
    type: 'single',
    options: [
      { value: 'starter', label: 'A simple starter routine' },
      { value: 'acne', label: 'Acne-focused routine support' },
      { value: 'barrier', label: 'Calming or barrier support' },
      { value: 'brightening', label: 'Brightening or tone support' },
      { value: 'consultation', label: 'A professional consultation' }
    ]
  }
];

const questionIds = new Set(routineBlueprintQuestions.map((question) => question.id));
const safeSkinTypePriority = ['sensitive', 'dry', 'combination', 'balanced', 'oily'];
const defaultDisclaimer = 'Educational only. Not medical advice.';

const scoringRules = {
  middaySkinFeel: {
    tight_flaky: { skinType: { dry: 3 }, concerns: { dryness: 1 }, barrier: { watch: 1 } },
    shiny_oily: { skinType: { oily: 3 }, concerns: { clogged_pores: 1 } },
    combo: { skinType: { combination: 3 } },
    balanced: { skinType: { balanced: 3 }, barrier: { stable: 1 } },
    reactive: { skinType: { sensitive: 3 }, concerns: { sensitivity: 1, redness: 1 }, barrier: { watch: 2 } }
  },
  afterCleansingFeel: {
    comfortable: { barrier: { stable: 1 } },
    tight: { skinType: { dry: 1 }, concerns: { dryness: 1 }, barrier: { watch: 2 } },
    greasy_quickly: { skinType: { oily: 2 }, concerns: { clogged_pores: 1 } },
    stingy_red: { skinType: { sensitive: 2 }, concerns: { sensitivity: 2, redness: 1 }, barrier: { compromised: 2 } },
    depends_cleanser: { skinType: { sensitive: 1 }, barrier: { watch: 1 } }
  },
  topConcerns: {
    breakouts: { concerns: { acne: 3 } },
    clogged_pores: { concerns: { clogged_pores: 3 } },
    texture: { concerns: { texture: 3 } },
    dark_spots: { concerns: { hyperpigmentation: 3 } },
    redness: { concerns: { redness: 3 }, skinType: { sensitive: 1 } },
    dryness: { concerns: { dryness: 3 }, skinType: { dry: 1 } },
    fine_lines: { concerns: { fine_lines: 3 } },
    sensitivity: { concerns: { sensitivity: 3 }, skinType: { sensitive: 1 }, barrier: { watch: 1 } }
  },
  breakoutFrequency: {
    rarely: {},
    occasionally: { concerns: { acne: 1 } },
    weekly: { concerns: { acne: 2, clogged_pores: 1 } },
    most_days: { concerns: { acne: 3, clogged_pores: 1 }, leadIntent: { consultation: 1 } }
  },
  productReactivity: {
    no: { barrier: { stable: 1 } },
    sometimes: { skinType: { sensitive: 1 }, barrier: { watch: 1 } },
    often: { skinType: { sensitive: 2 }, concerns: { sensitivity: 1 }, barrier: { compromised: 2 } },
    with_actives: { skinType: { sensitive: 1 }, barrier: { watch: 2 }, routineGaps: { active_overuse: 1 } }
  },
  drynessLevel: {
    none: {},
    mild: { concerns: { dryness: 1 }, skinType: { dry: 1 }, barrier: { watch: 1 } },
    moderate: { concerns: { dryness: 2 }, skinType: { dry: 2 }, barrier: { watch: 2 } },
    severe: { concerns: { dryness: 3 }, skinType: { dry: 2 }, barrier: { compromised: 2 } }
  },
  currentProducts: {
    cleanser: {},
    moisturizer: {},
    sunscreen: {},
    exfoliant_acids: {},
    retinoid: {},
    benzoyl_peroxide: { concerns: { acne: 1 } },
    vitamin_c: { concerns: { hyperpigmentation: 1 } },
    none_not_sure: { routineGaps: { cleanser: 1, moisturizer: 1, sunscreen: 1 }, leadIntent: { starter: 1 } }
  },
  activeFrequency: {
    never: {},
    one_two_weekly: {},
    three_four_weekly: {},
    daily: { routineGaps: { active_overuse: 2 }, barrier: { watch: 1 } },
    multiple_daily: { routineGaps: { active_overuse: 3 }, barrier: { compromised: 2 } }
  },
  sunscreenFrequency: {
    daily: { sunExposure: { protected: 3 } },
    most_days: { sunExposure: { inconsistent: 2 } },
    outside_only: { sunExposure: { inconsistent: 3 }, routineGaps: { sunscreen: 1 } },
    rarely: { sunExposure: { unprotected: 3 }, routineGaps: { sunscreen: 2 } },
    never: { sunExposure: { unprotected: 4 }, routineGaps: { sunscreen: 3 } }
  },
  helpGoal: {
    starter: { leadIntent: { starter: 3 } },
    acne: { leadIntent: { acne: 3 }, concerns: { acne: 1 } },
    barrier: { leadIntent: { barrier: 3 }, barrier: { watch: 1 } },
    brightening: { leadIntent: { brightening: 3 }, concerns: { hyperpigmentation: 1 } },
    consultation: { leadIntent: { consultation: 3 } }
  }
};

export function createRoutineBlueprint({ answers, lead = {}, source = null, widgetId = null } = {}) {
  const normalizedAnswers = normalizeAnswers(answers);
  const scores = createEmptyScores();

  applyAnswerScores(scores, normalizedAnswers);
  applyDerivedScores(scores, normalizedAnswers);

  const skinType = pickSkinType(scores.skinType);
  const barrier = pickBarrier(scores.barrier);
  const concerns = pickConcerns(scores.concerns);
  const sunProtection = pickSunProtection(scores.sunExposure);
  const routineGaps = pickPositiveBuckets(scores.routineGaps);
  const leadIntent = pickTopBucket(scores.leadIntent, 'starter');
  const flags = createFlags({ barrier, concerns, routineGaps, sunProtection });
  const routine = createRoutine({ skinType, barrier, concerns, routineGaps, sunProtection });
  const leadScore = createLeadScore({ lead, leadIntent, concerns, barrier, routineGaps });

  return {
    resultId: 'routine_blueprint_v1',
    submittedAt: new Date().toISOString(),
    answers: normalizedAnswers,
    lead: normalizeLead(lead),
    source,
    widgetId,
    summary: createSummary({ skinType, concerns, barrier, sunProtection }),
    skinProfile: {
      type: skinType,
      concerns,
      barrier,
      sunProtection
    },
    routine,
    flags,
    leadScore,
    recommendedNextStep: createRecommendedNextStep({ leadIntent, concerns, barrier, routineGaps, sunProtection }),
    disclaimer: defaultDisclaimer
  };
}

export function normalizeAnswers(input = {}) {
  const rawAnswers = Array.isArray(input)
    ? Object.fromEntries(input.map((entry) => [entry.questionId || entry.id, entry.value ?? entry.values]))
    : input;
  const normalized = {};

  for (const question of routineBlueprintQuestions) {
    const rawValue = rawAnswers?.[question.id];

    if (question.type === 'multi') {
      const values = Array.isArray(rawValue) ? rawValue : [rawValue];
      const allowed = new Set(question.options.map((option) => option.value));
      const selected = values
        .map((value) => String(value || '').trim())
        .filter((value) => allowed.has(value));
      normalized[question.id] = question.maxSelections
        ? [...new Set(selected)].slice(0, question.maxSelections)
        : [...new Set(selected)];
      continue;
    }

    const value = String(rawValue || '').trim();
    const allowed = new Set(question.options.map((option) => option.value));
    normalized[question.id] = allowed.has(value) ? value : null;
  }

  return normalized;
}

export function normalizeLead(lead = {}) {
  return {
    name: cleanOptionalString(lead.name),
    email: cleanOptionalString(lead.email),
    phone: cleanOptionalString(lead.phone),
    instagram: cleanOptionalString(lead.instagram || lead.social),
    source: cleanOptionalString(lead.source),
    consentToContact: Boolean(lead.consentToContact)
  };
}

export function hasLeadContact(lead = {}) {
  const normalizedLead = normalizeLead(lead);
  return Boolean(normalizedLead.email || normalizedLead.phone || normalizedLead.instagram);
}

export function getRoutineBlueprintQuestionIds() {
  return [...questionIds];
}

function createEmptyScores() {
  return {
    skinType: {},
    concerns: {},
    barrier: {},
    routineGaps: {},
    sunExposure: {},
    leadIntent: {}
  };
}

function applyAnswerScores(scores, answers) {
  for (const [questionId, value] of Object.entries(answers)) {
    const values = Array.isArray(value) ? value : [value];

    for (const selected of values) {
      if (!selected) continue;
      applyRule(scores, scoringRules[questionId]?.[selected]);
    }
  }
}

function applyDerivedScores(scores, answers) {
  const currentProducts = answers.currentProducts || [];

  if (!currentProducts.includes('cleanser') && !currentProducts.includes('none_not_sure')) {
    addScore(scores.routineGaps, 'cleanser', 1);
  }

  if (!currentProducts.includes('moisturizer') && !currentProducts.includes('none_not_sure')) {
    addScore(scores.routineGaps, 'moisturizer', 1);
  }

  if (!currentProducts.includes('sunscreen') && !currentProducts.includes('none_not_sure')) {
    addScore(scores.routineGaps, 'sunscreen', 1);
  }
}

function applyRule(scores, rule = {}) {
  for (const [group, buckets] of Object.entries(rule)) {
    for (const [bucket, value] of Object.entries(buckets)) {
      addScore(scores[group], bucket, value);
    }
  }
}

function addScore(target, bucket, value) {
  target[bucket] = (target[bucket] || 0) + value;
}

function pickSkinType(scores) {
  const maxScore = Math.max(0, ...Object.values(scores));
  const tied = Object.entries(scores)
    .filter(([, score]) => score === maxScore)
    .map(([bucket]) => bucket);

  if (!tied.length || maxScore === 0) return 'balanced';

  return safeSkinTypePriority.find((bucket) => tied.includes(bucket)) || tied[0];
}

function pickBarrier(scores) {
  if ((scores.compromised || 0) >= 2) return 'compromised';
  if ((scores.watch || 0) >= 2) return 'watch';
  return 'stable';
}

function pickConcerns(scores) {
  return Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .slice(0, 3)
    .map(([bucket]) => bucket);
}

function pickSunProtection(scores) {
  return pickTopBucket(scores, 'protected');
}

function pickPositiveBuckets(scores) {
  return Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .map(([bucket]) => bucket);
}

function pickTopBucket(scores, fallback) {
  const entries = Object.entries(scores).filter(([, score]) => score > 0);
  if (!entries.length) return fallback;

  return entries.sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))[0][0];
}

function createRoutine({ skinType, barrier, concerns, routineGaps, sunProtection }) {
  const morning = [];
  const evening = [];
  const weekly = [];

  morning.push(skinType === 'dry' || barrier !== 'stable' ? 'Gentle cleanser or rinse' : 'Gentle cleanser');
  morning.push(barrier === 'compromised' ? 'Barrier-supporting moisturizer' : 'Lightweight moisturizer');
  morning.push('Broad-spectrum sunscreen');

  evening.push('Gentle cleanser');
  evening.push(barrier === 'stable' ? 'Moisturizer' : 'Barrier-supporting moisturizer');

  if (barrier === 'compromised') {
    weekly.push('Pause strong actives until stinging, burning, or flaking calms down');
  } else if (concerns.includes('acne') || concerns.includes('clogged_pores')) {
    weekly.push('Introduce one acne-safe active slowly, one to two nights per week');
  } else if (concerns.includes('hyperpigmentation')) {
    weekly.push('Add brightening support only after daily sunscreen is consistent');
  } else {
    weekly.push('Introduce active products slowly after the routine feels stable');
  }

  if (routineGaps.includes('active_overuse')) {
    weekly.push('Avoid stacking multiple strong active products in the same routine');
  }

  if (sunProtection !== 'protected') {
    morning.push('Make sunscreen the non-negotiable last step');
  }

  return { morning: dedupe(morning), evening: dedupe(evening), weekly: dedupe(weekly) };
}

function createFlags({ barrier, concerns, routineGaps, sunProtection }) {
  const flags = [];

  if (sunProtection !== 'protected') {
    flags.push('Prioritize daily sunscreen before brightening products');
  }

  if (routineGaps.includes('active_overuse')) {
    flags.push('Avoid stacking multiple strong active products');
  }

  if (barrier === 'compromised') {
    flags.push('Focus on calming and barrier support before exfoliation, retinoids, or acne actives');
  }

  if (concerns.includes('acne') && concerns.includes('sensitivity')) {
    flags.push('Choose gentle acne support and consider a professional consultation');
  }

  return flags;
}

function createLeadScore({ lead, leadIntent, concerns, barrier, routineGaps }) {
  const normalizedLead = normalizeLead(lead);
  let score = 0;

  if (normalizedLead.email || normalizedLead.phone || normalizedLead.instagram) score += 2;
  if (normalizedLead.consentToContact) score += 1;
  if (leadIntent === 'consultation') score += 2;
  if (concerns.includes('acne')) score += 1;
  if (barrier === 'compromised') score += 1;
  if (routineGaps.length >= 2) score += 1;

  if (score >= 4) return 'qualified';
  if (score >= 2) return 'warm';
  return 'free_user';
}

function createRecommendedNextStep({ leadIntent, concerns, barrier, routineGaps, sunProtection }) {
  if (leadIntent === 'consultation') {
    return 'Book a consultation for a personalized acne-safe routine.';
  }

  if (barrier === 'compromised') {
    return 'Start with a calming routine and get professional guidance before adding strong actives.';
  }

  if (concerns.includes('acne')) {
    return 'Use a simple acne-safe routine and consider a professional review if breakouts are frequent.';
  }

  if (sunProtection !== 'protected') {
    return 'Build a daily sunscreen habit before investing in brightening or advanced active products.';
  }

  if (routineGaps.length) {
    return 'Fill the basic routine gaps first, then add one targeted product at a time.';
  }

  return 'Keep the routine simple and adjust one product at a time.';
}

function createSummary({ skinType, concerns, barrier, sunProtection }) {
  const concernText = concerns.length ? ` with ${humanList(concerns.map(humanizeBucket))}` : '';
  const barrierText = barrier === 'stable' ? 'a stable barrier' : `a ${barrier} barrier signal`;
  const sunText = sunProtection === 'protected' ? 'consistent sun protection' : `${sunProtection} sun protection`;

  return `Your answers suggest ${humanizeBucket(skinType)}-leaning skin${concernText}, ${barrierText}, and ${sunText}.`;
}

function humanizeBucket(value) {
  return value.replace(/_/g, ' ');
}

function humanList(values) {
  if (values.length <= 1) return values[0] || '';
  if (values.length === 2) return values.join(' and ');
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function dedupe(items) {
  return [...new Set(items)];
}

function cleanOptionalString(value) {
  const cleaned = String(value || '').trim();
  return cleaned || null;
}
