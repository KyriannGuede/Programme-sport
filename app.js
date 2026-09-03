"use strict";

const STORE_KEY = "lockin_training_os_v3";
const LEGACY_KEY = "lockin_sport_v1";

const MODES = {
  cut: {
    label: "Sèche",
    short: "Déficit",
    factor: 0.84,
    copy: "Déficit modéré, protéines hautes et cardio contrôlé pour préserver tes performances."
  },
  recomp: {
    label: "Recomposition",
    short: "Gras ↓ · muscle ↑",
    factor: 0.92,
    copy: "Léger déficit, progression en salle et perte visée de 0,2 à 0,4 kg par semaine."
  },
  maintain: {
    label: "Maintien",
    short: "Poids stable",
    factor: 1,
    copy: "Apport proche du maintien pour stabiliser le poids et pousser la performance."
  },
  bulk: {
    label: "Prise de masse",
    short: "Surplus propre",
    factor: 1.08,
    copy: "Petit surplus calorique pour construire du muscle en limitant la prise de gras."
  }
};

const NAV_ITEMS = [
  { id: "today", label: "Aujourd'hui", title: "Vue d'ensemble", icon: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-5.5h5V20"/></svg>' },
  { id: "training", label: "Séance", title: "Entraînement", icon: '<svg viewBox="0 0 24 24"><path d="M6 8v8M18 8v8M3.5 10v4M20.5 10v4M6 12h12"/></svg>' },
  { id: "nutrition", label: "Nutrition", title: "Journal nutrition", icon: '<svg viewBox="0 0 24 24"><path d="M7 3v8a3 3 0 0 0 3 3V3M10 8H7M10 21v-7M16 3v18M16 3c3 2 4 5 4 8h-4"/></svg>' },
  { id: "progress", label: "Progrès", title: "Progression", icon: '<svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-7"/></svg>' },
  { id: "settings", label: "Réglages", title: "Réglages", icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.7-1.7l.9-1.9-2.1-2.1-1.9.9a7 7 0 0 0-1.7-.7l-.7-2h-3l-.7 2a7 7 0 0 0-1.7.7l-1.9-.9-2.1 2.1.9 1.9a7 7 0 0 0-.7 1.7l-2 .7v3l2 .7a7 7 0 0 0 .7 1.7l-.9 1.9 2.1 2.1 1.9-.9a7 7 0 0 0 1.7.7l.7 2h3l.7-2a7 7 0 0 0 1.7-.7l1.9.9 2.1-2.1-.9-1.9a7 7 0 0 0 .7-1.7l2-.7Z"/></svg>' }
];

const WORKOUTS = {
  pushA: {
    id: "pushA", code: "PUSH A", short: "Push", name: "Push — Force",
    focus: "Haut des pecs · épaules · triceps",
    copy: "Priorité au développé incliné, puis volume contrôlé. Garde 1 à 3 reps en réserve.",
    duration: 82,
    cardio: { type: "Marche inclinée", minutes: 18, detail: "Zone 2 · pente 7–10 % après la musculation" },
    exercises: [
      ex("inclineDb", "Développé incliné haltères", "Haut des pectoraux", 3, 6, 10, 150, 2, "Omoplates serrées, trajectoire stable."),
      ex("chestPress", "Chest press convergente", "Pectoraux", 3, 8, 12, 120, 5, "Contrôle la descente, ne rebondis pas."),
      ex("cableFly", "Pec fly à la poulie", "Pectoraux en longueur", 2, 10, 15, 75, 2.5, "Cherche l'étirement sans perdre l'épaule."),
      ex("lateralRaise", "Élévations latérales", "Deltoïdes latéraux", 4, 12, 20, 60, 1, "Monte avec les coudes, buste fixe."),
      ex("pushdown", "Extension triceps corde", "Triceps", 3, 8, 12, 75, 2.5, "Verrouille les coudes près du corps."),
      ex("overheadTri", "Extension triceps au-dessus tête", "Longue portion du triceps", 2, 10, 15, 75, 2, "Grand étirement, amplitude confortable.")
    ]
  },
  pullA: {
    id: "pullA", code: "PULL A", short: "Pull", name: "Pull — V-Taper",
    focus: "Largeur · épaisseur · biceps",
    copy: "Un tirage vertical, deux angles de rowing, puis arrière d'épaule et bras.",
    duration: 80,
    cardio: { type: "Vélo", minutes: 18, detail: "Zone 2 · cadence fluide, faible impact" },
    exercises: [
      ex("latPulldown", "Tirage vertical pronation", "Grand dorsal", 3, 6, 10, 135, 5, "Tire les coudes vers les hanches."),
      ex("chestRow", "Rowing poitrine appuyée", "Épaisseur du dos", 3, 6, 10, 135, 5, "Pas d'élan, pause courte en contraction."),
      ex("cableRow", "Rowing unilatéral poulie", "Dorsaux", 3, 8, 12, 105, 2.5, "Laisse l'omoplate avancer puis recule-la."),
      ex("rearFly", "Reverse fly", "Arrière d'épaule", 3, 12, 20, 60, 1, "Charge légère, bras dans le plan des épaules."),
      ex("ezCurl", "Curl barre EZ", "Biceps", 3, 8, 12, 75, 2.5, "Garde les épaules derrière les coudes."),
      ex("hammerCurl", "Curl marteau", "Brachial · avant-bras", 3, 8, 12, 75, 2, "Poignets neutres, pas de balancier.")
    ]
  },
  legsA: {
    id: "legsA", code: "LEGS A", short: "Legs", name: "Legs — Quadriceps",
    focus: "Quadriceps · ischios · mollets · abdos",
    copy: "Préactivation des ischios, presse lourde puis travail complet sans volume inutile.",
    duration: 86,
    cardio: { type: "Vélo doux", minutes: 12, detail: "Zone 2 basse · récupération active des jambes" },
    exercises: [
      ex("legCurl", "Leg curl allongé", "Ischios · préparation", 3, 10, 15, 90, 2.5, "Première série progressive, bassin plaqué."),
      ex("legPress", "Presse à cuisses", "Quadriceps · fessiers", 3, 6, 10, 165, 10, "Amplitude contrôlée, genoux alignés."),
      ex("rdl", "Soulevé de terre roumain", "Ischios · fessiers", 3, 6, 10, 150, 5, "Hanches en arrière, dos neutre."),
      ex("legExtension", "Leg extension", "Quadriceps", 3, 10, 15, 75, 2.5, "Pause en haut sans claquer les genoux."),
      ex("standingCalf", "Mollets debout", "Mollets", 4, 10, 15, 60, 5, "Étirement complet et pause en haut."),
      ex("cableCrunch", "Crunch câble", "Abdominaux", 3, 10, 15, 60, 2.5, "Enroule le buste, ne tire pas avec les bras.")
    ]
  },
  pushB: {
    id: "pushB", code: "PUSH B", short: "Push+", name: "Pecs + Bras",
    focus: "Pectoraux · épaules · triceps",
    copy: "Variante volume inspirée des séances pecs/bras : amplitude, congestion et technique stricte.",
    duration: 78,
    cardio: { type: "Elliptique", minutes: 20, detail: "Zone 2 · respiration régulière" },
    exercises: [
      ex("flatPress", "Développé couché machine", "Pectoraux · force", 3, 6, 10, 135, 5, "Poitrine haute, pieds ancrés."),
      ex("shoulderPress", "Shoulder press", "Épaules", 3, 6, 10, 120, 2.5, "Ne cambre pas pour finir la rep."),
      ex("lowCableFly", "Écartés poulie basse", "Haut des pectoraux", 3, 10, 15, 75, 2, "Ramène les mains vers le haut du sternum."),
      ex("lateralRaise", "Élévations latérales", "Deltoïdes latéraux", 4, 12, 20, 60, 1, "Reste loin de l'élan."),
      ex("dips", "Dips assistés ou lestés", "Pectoraux · triceps", 3, 8, 12, 105, 2.5, "Choisis une amplitude sans gêne d'épaule."),
      ex("skullCrusher", "Barre front EZ", "Triceps", 2, 8, 12, 75, 2.5, "Coudes fixes, contrôle derrière le front.")
    ]
  },
  pullB: {
    id: "pullB", code: "PULL B", short: "Pull+", name: "Dos + Bras",
    focus: "Dos dense · biceps · avant-bras",
    copy: "Deux directions de tirage, un travail du grand dorsal puis biceps en supination et prise neutre.",
    duration: 78,
    cardio: { type: "Marche inclinée", minutes: 20, detail: "Zone 2 · pente 6–9 %, allure facile" },
    exercises: [
      ex("pullUp", "Tractions pronation / assistées", "Largeur du dos", 3, 6, 10, 150, 2.5, "Pars épaules basses, poitrine vers la barre."),
      ex("wideRow", "Rowing prise large", "Haut du dos", 3, 8, 12, 120, 5, "Coudes ouverts, poitrine stable."),
      ex("pullover", "Pull-over poulie", "Grand dorsal", 3, 10, 15, 75, 2.5, "Bras presque tendus, côtes contrôlées."),
      ex("rearFly", "Reverse fly", "Arrière d'épaule", 3, 12, 20, 60, 1, "Lent et propre avant de charger."),
      ex("inclineCurl", "Curl incliné haltères", "Biceps en étirement", 3, 8, 12, 75, 2, "Épaule derrière, supination complète."),
      ex("reverseCurl", "Curl marteau / inversé", "Brachial · avant-bras", 3, 10, 15, 75, 2, "Alterne neutre et pronation selon confort.")
    ]
  },
  legsB: {
    id: "legsB", code: "LEGS B", short: "Legs+", name: "Legs — Postérieur",
    focus: "Fessiers · ischios · quadriceps · abdos",
    copy: "Deuxième stimulus jambes : charnière de hanche, unilatéral et finition complète.",
    duration: 88,
    cardio: { type: "Marche plate", minutes: 15, detail: "Zone 2 basse · récupération, sans course" },
    exercises: [
      ex("hackSquat", "Hack squat", "Quadriceps", 3, 6, 10, 165, 5, "Descends seulement tant que le bassin reste stable."),
      ex("hipThrust", "Hip thrust", "Fessiers", 3, 8, 12, 135, 5, "Rétroversion en haut, pas d'hyperextension."),
      ex("bulgarian", "Fentes bulgares", "Jambes complètes", 3, 8, 12, 105, 2, "Même amplitude et appui des deux côtés."),
      ex("seatedLegCurl", "Leg curl assis", "Ischios", 3, 10, 15, 90, 2.5, "Reste gainé, contrôle le retour."),
      ex("calfPress", "Mollets à la presse", "Mollets", 4, 12, 20, 60, 5, "Pas de rebond en bas."),
      ex("hangingRaise", "Relevés de jambes suspendu", "Abdominaux", 3, 8, 15, 60, 0, "Enroule le bassin, limite le balancier.")
    ]
  },
  upperArms: {
    id: "upperArms", code: "UPPER", short: "Upper", name: "Upper + Bras",
    focus: "Haut des pecs · dos · épaules · bras",
    copy: "Séance bonus équilibrée pour un planning quatre jours, avec accent esthétique sur le V-taper.",
    duration: 76,
    cardio: { type: "Vélo", minutes: 20, detail: "Zone 2 · effort conversationnel" },
    exercises: [
      ex("inclineDb", "Développé incliné haltères", "Haut des pectoraux", 3, 8, 12, 120, 2, "Technique stricte, garde une rep de marge."),
      ex("latPulldown", "Tirage vertical pronation", "Grand dorsal", 3, 8, 12, 120, 5, "Conduis avec les coudes."),
      ex("chestRow", "Rowing poitrine appuyée", "Épaisseur du dos", 3, 8, 12, 105, 5, "Pause en contraction."),
      ex("lateralRaise", "Élévations latérales", "Deltoïdes latéraux", 4, 12, 20, 60, 1, "Charge maîtrisée."),
      ex("inclineCurl", "Curl incliné", "Biceps", 3, 8, 12, 75, 2, "Étirement complet."),
      ex("pushdown", "Extension triceps corde", "Triceps", 3, 10, 15, 75, 2.5, "Écarte la corde en bas.")
    ]
  },
  rest: {
    id: "rest", code: "RÉCUP", short: "Repos", name: "Récupération active",
    focus: "Mobilité · pas · sommeil",
    copy: "La récupération fait partie du programme. Marche tranquillement, mange selon ton objectif et prépare la prochaine séance.",
    duration: 30, cardio: null, exercises: []
  }
};

const SCHEDULES = {
  3: ["pushA", "rest", "pullA", "rest", "legsA", "rest", "rest"],
  4: ["pushA", "pullA", "rest", "legsA", "upperArms", "rest", "rest"],
  5: ["pushA", "pullA", "legsA", "rest", "pushB", "pullB", "rest"],
  6: ["pushA", "pullA", "legsA", "pushB", "pullB", "legsB", "rest"]
};

const FOOD_PRESETS = [
  food("Petit-déj Corn Flakes + whey", "Petit-déjeuner", "50 g + 250 ml + 1 scoop", 430, 36, 62, 7, 2, 4, 400, 550),
  food("Cookie protéiné maison", "Collation", "1 cookie", 137, 7.9, 21, 2.8, 2, 0, 85, 200),
  food("Eau de coco Grace", "Boisson", "500 ml", 110, 0, 25, 0, 0, 0, 160, 1085),
  food("Poulet + riz + légumes", "Déjeuner", "1 assiette", 560, 45, 62, 12, 8, 1, 450, 900),
  food("Skyr + fruits rouges", "Collation", "1 bol", 230, 24, 28, 2, 4, 0, 120, 420),
  food("Whey + banane", "Collation", "1 shaker", 220, 25, 28, 1, 3, 0, 120, 500)
];

function ex(id, name, muscle, sets, min, max, rest, increment, tip) {
  return { id, name, muscle, sets, reps: [min, max], rest, increment, tip };
}

function food(name, meal, portion, calories, protein, carbs, fat, fiber, sugar, sodium, potassium) {
  return { name, meal, portion, calories, protein, carbs, fat, fiber, sugar, sodium, potassium };
}

function autoTargets(mode, weight, tdee) {
  const factor = MODES[mode]?.factor ?? MODES.recomp.factor;
  const calories = Math.round((Number(tdee || 2850) * factor) / 50) * 50;
  const proteinFactor = mode === "cut" ? 2.2 : mode === "bulk" ? 1.9 : 2.1;
  const protein = Math.round(Number(weight || 87.6) * proteinFactor / 5) * 5;
  const fat = Math.round(Number(weight || 87.6) * 0.85 / 5) * 5;
  const carbs = Math.max(100, Math.round((calories - protein * 4 - fat * 9) / 4 / 5) * 5);
  return { calories, protein, carbs, fat, fiber: 35, sugar: 30, sodium: 2300, potassium: 3500, steps: 10000 };
}

function makeDefaultState() {
  return {
    version: 3,
    settings: {
      name: "Kyria",
      mode: "recomp",
      trainingDays: 6,
      customTargets: false,
      targets: autoTargets("recomp", 87.6, 2850)
    },
    profile: {
      age: "",
      height: 186,
      weight: 87.6,
      goalWeight: 84,
      bodyFat: 18.5,
      fatMass: 16.2,
      leanMass: 71.4,
      skeletalMuscle: 41.1,
      muscleMass: 67.6,
      bodyWater: 52.2,
      visceralFat: 6,
      whr: 0.89,
      ecwRatio: 0.38,
      bmr: 1935,
      tdee: 2850,
      visbodyScore: 81,
      source: "Visbody · projet ChatGPT Looksmaxx"
    },
    days: {
      "2026-08-31": {
        weight: 86,
        steps: 0,
        sleep: 0,
        workoutDone: false,
        cardioMinutes: 0,
        foods: [
          { id: "import-breakfast-20260831", ...FOOD_PRESETS[0] },
          { id: "import-cookie-20260831", ...FOOD_PRESETS[1] }
        ]
      }
    },
    workoutLogs: {}
  };
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function mergeState(raw) {
  const base = makeDefaultState();
  if (!raw || typeof raw !== "object") return base;
  return {
    ...base,
    ...raw,
    version: 3,
    settings: {
      ...base.settings,
      ...(raw.settings || {}),
      targets: { ...base.settings.targets, ...(raw.settings?.targets || {}) }
    },
    profile: { ...base.profile, ...(raw.profile || {}) },
    days: { ...base.days, ...(raw.days || {}) },
    workoutLogs: { ...(raw.workoutLogs || {}) }
  };
}

function migrateLegacy(legacy) {
  const base = makeDefaultState();
  if (!legacy || typeof legacy !== "object") return base;
  const legacyProfile = legacy.profile || {};
  if (legacyProfile.name) base.settings.name = legacyProfile.name;
  if (Number(legacyProfile.weight) > 0) base.profile.weight = Number(legacyProfile.weight);
  if (Number(legacyProfile.calorieGoal) > 0) {
    base.settings.targets.calories = Number(legacyProfile.calorieGoal);
    base.settings.customTargets = true;
  }
  if (Number(legacyProfile.stepGoal) > 0) base.settings.targets.steps = Number(legacyProfile.stepGoal);
  Object.entries(legacy.days || {}).forEach(([key, value]) => {
    const migratedFoods = Array.isArray(value.foods) ? value.foods.map((item, index) => ({
      id: item.id || `legacy-${key}-${index}`,
      name: item.name || "Aliment importé",
      meal: item.meal || "Journal importé",
      portion: item.portion || "",
      calories: n(item.calories), protein: n(item.protein), carbs: n(item.carbs), fat: n(item.fat),
      fiber: n(item.fiber), sugar: n(item.sugar), sodium: n(item.sodium), potassium: n(item.potassium)
    })) : [];
    if (!migratedFoods.length && n(value.caloriesEaten) > 0) {
      migratedFoods.push({ id: `legacy-total-${key}`, ...food("Total importé de l'ancienne version", "Journal importé", "", n(value.caloriesEaten), 0, 0, 0, 0, 0, 0, 0) });
    }
    base.days[key] = {
      weight: n(value.weight) || "",
      steps: n(value.steps),
      sleep: n(value.sleep),
      workoutDone: Boolean(value.workoutDone),
      cardioMinutes: n(value.walkMinutes) || n(value.cardioMinutes),
      foods: migratedFoods
    };
  });
  base.settings.targets = { ...autoTargets(base.settings.mode, base.profile.weight, base.profile.tdee), ...base.settings.targets };
  return base;
}

function loadState() {
  try {
    const current = JSON.parse(localStorage.getItem(STORE_KEY));
    if (current) return mergeState(current);
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
    return legacy ? migrateLegacy(legacy) : makeDefaultState();
  } catch (error) {
    console.warn("Impossible de charger les données locales", error);
    return makeDefaultState();
  }
}

let state = loadState();
let selectedTrainingDate = localDateKey(new Date());
let selectedNutritionDate = localDateKey(new Date());
let toastTimer = 0;
let savedTimer = 0;

function saveState(showSaved = false) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (showSaved) flashSaved();
}

function n(value) { return Number(value) || 0; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function pct(value, goal) { return goal ? clamp(Math.round(n(value) / n(goal) * 100), 0, 100) : 0; }
function formatNumber(value, digits = 0) { return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits }).format(n(value)); }
function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function parseDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}
function changeDate(key, amount) {
  const date = parseDate(key);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}
function mondayOf(date) {
  const copyDate = new Date(date);
  const offset = (copyDate.getDay() + 6) % 7;
  copyDate.setDate(copyDate.getDate() - offset);
  copyDate.setHours(12, 0, 0, 0);
  return copyDate;
}
function formatDate(key, includeYear = false) {
  const today = localDateKey(new Date());
  if (key === today) return "Aujourd'hui";
  if (key === changeDate(today, -1)) return "Hier";
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "short", ...(includeYear ? { year: "numeric" } : {}) }).format(parseDate(key));
}

function getDay(key = localDateKey(new Date())) {
  if (!state.days[key]) state.days[key] = { weight: "", steps: 0, sleep: 0, workoutDone: false, cardioMinutes: 0, foods: [] };
  if (!Array.isArray(state.days[key].foods)) state.days[key].foods = [];
  return state.days[key];
}

function getWorkout(key) {
  const savedLog = state.workoutLogs[key];
  if ((savedLog?.startedAt || savedLog?.completedAt) && WORKOUTS[savedLog.workoutId]) return WORKOUTS[savedLog.workoutId];
  const dayIndex = (parseDate(key).getDay() + 6) % 7;
  const frequency = Number(state.settings.trainingDays) || 6;
  return WORKOUTS[(SCHEDULES[frequency] || SCHEDULES[6])[dayIndex]] || WORKOUTS.rest;
}

function totalsForDay(key) {
  return getDay(key).foods.reduce((totals, item) => {
    ["calories", "protein", "carbs", "fat", "fiber", "sugar", "sodium", "potassium"].forEach(field => totals[field] += n(item[field]));
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, potassium: 0 });
}

function createWorkoutLog(key, workout) {
  const exercises = {};
  workout.exercises.forEach(exercise => {
    exercises[exercise.id] = {
      sets: Array.from({ length: exercise.sets }, () => ({ weight: "", reps: "", rir: "", done: false }))
    };
  });
  return { workoutId: workout.id, startedAt: null, completedAt: null, cardio: { minutes: workout.cardio?.minutes || 0, done: false }, exercises };
}

function getWorkoutLog(key, create = false) {
  const workout = getWorkout(key);
  if (workout.id === "rest") return null;
  if (!state.workoutLogs[key] && create) state.workoutLogs[key] = createWorkoutLog(key, workout);
  let log = state.workoutLogs[key] || null;
  if (log && log.workoutId !== workout.id && !log.startedAt && !log.completedAt) {
    if (!create) return null;
    state.workoutLogs[key] = createWorkoutLog(key, workout);
    log = state.workoutLogs[key];
  }
  if (log && log.workoutId === workout.id) {
    workout.exercises.forEach(exercise => {
      if (!log.exercises[exercise.id]) log.exercises[exercise.id] = createWorkoutLog(key, workout).exercises[exercise.id];
    });
  }
  return log;
}

function allExerciseSets(exerciseId, beforeKey = null) {
  const entries = [];
  Object.entries(state.workoutLogs).forEach(([date, log]) => {
    if (beforeKey && date >= beforeKey) return;
    (log.exercises?.[exerciseId]?.sets || []).forEach(set => {
      if (set.done && n(set.weight) > 0 && n(set.reps) > 0) entries.push({ ...set, date, e1rm: n(set.weight) * (1 + n(set.reps) / 30) });
    });
  });
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

function lastExerciseSession(exerciseId, beforeKey) {
  const dates = Object.keys(state.workoutLogs).filter(date => date < beforeKey && state.workoutLogs[date].exercises?.[exerciseId]?.sets?.some(set => set.done)).sort().reverse();
  if (!dates.length) return null;
  const sets = state.workoutLogs[dates[0]].exercises[exerciseId].sets.filter(set => set.done && n(set.reps) > 0);
  return sets.length ? { date: dates[0], sets } : null;
}

function exerciseRecord(exerciseId) {
  const sets = allExerciseSets(exerciseId);
  if (!sets.length) return null;
  return sets.reduce((best, set) => set.e1rm > best.e1rm ? set : best, sets[0]);
}

function progressionAdvice(exercise, key) {
  const last = lastExerciseSession(exercise.id, key);
  if (!last) return { label: "Point de départ", detail: "Établis une charge propre" };
  const working = last.sets.filter(set => n(set.weight) > 0);
  if (!working.length) return { label: "Point de départ", detail: "Établis une charge propre" };
  const topWeight = Math.max(...working.map(set => n(set.weight)));
  const sameLoad = working.filter(set => n(set.weight) === topWeight);
  const allAtTop = sameLoad.length >= Math.min(2, exercise.sets) && sameLoad.every(set => n(set.reps) >= exercise.reps[1]);
  const avgRir = sameLoad.reduce((sum, set) => sum + n(set.rir), 0) / sameLoad.length;
  if (allAtTop && avgRir >= 1 && exercise.increment > 0) {
    return { label: "Monte la charge", detail: `${formatNumber(topWeight + exercise.increment, 1)} kg visés` };
  }
  const underRange = sameLoad.some(set => n(set.reps) < exercise.reps[0]);
  if (underRange) return { label: "Consolide", detail: `${formatNumber(topWeight, 1)} kg, reps propres` };
  return { label: "Double progression", detail: `Ajoute 1 rep à ${formatNumber(topWeight, 1)} kg` };
}

function completedSetCount(log) {
  if (!log) return 0;
  return Object.values(log.exercises || {}).reduce((sum, entry) => sum + entry.sets.filter(set => set.done).length, 0);
}

function totalSetCount(workout, log) {
  if (!log) return workout.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  return Object.values(log.exercises || {}).reduce((sum, entry) => sum + entry.sets.length, 0);
}

function renderNavigation() {
  const markup = NAV_ITEMS.map(item => `<button class="nav-button" type="button" data-nav="${item.id}" aria-label="${item.label}">${item.icon}<span>${item.label}</span></button>`).join("");
  document.querySelector(".bottom-nav").innerHTML = markup;
  document.querySelector(".rail-nav").innerHTML = markup;
}

function currentPage() {
  const requested = window.location.hash.replace("#", "");
  return NAV_ITEMS.some(item => item.id === requested) ? requested : "today";
}

function showPage(id, updateHash = true) {
  const pageId = NAV_ITEMS.some(item => item.id === id) ? id : "today";
  document.querySelectorAll(".page").forEach(page => page.classList.toggle("active", page.dataset.page === pageId));
  document.querySelectorAll("[data-nav]").forEach(button => button.classList.toggle("active", button.dataset.nav === pageId));
  document.getElementById("page-title").textContent = NAV_ITEMS.find(item => item.id === pageId).title;
  if (updateHash && window.location.hash !== `#${pageId}`) history.replaceState(null, "", `#${pageId}`);
  renderPage(pageId);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderPage(id) {
  renderHeader();
  if (id === "today") renderToday();
  if (id === "training") renderTraining();
  if (id === "nutrition") renderNutrition();
  if (id === "progress") renderProgress();
  if (id === "settings") renderSettings();
}

function renderHeader() {
  const now = new Date();
  document.getElementById("today-label").textContent = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(now);
  const initials = (state.settings.name || "Lock In").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  document.getElementById("header-initials").textContent = initials || "LI";
  document.getElementById("header-mode-dot").style.background = state.settings.mode === "cut" ? "var(--orange)" : state.settings.mode === "bulk" ? "var(--blue)" : "var(--accent)";
}

function renderToday() {
  const key = localDateKey(new Date());
  const day = getDay(key);
  const workout = getWorkout(key);
  const totals = totalsForDay(key);
  const targets = state.settings.targets;
  const log = getWorkoutLog(key, false);
  const mode = MODES[state.settings.mode] || MODES.recomp;

  document.getElementById("hero-mode").textContent = mode.label;
  document.getElementById("hero-week").textContent = `${state.settings.trainingDays} séances · ${formatNumber(targets.calories)} kcal`;
  document.getElementById("hero-kicker").textContent = workout.id === "rest" ? "AUJOURD'HUI" : workout.code;
  document.getElementById("today-heading").textContent = workout.name;
  document.getElementById("hero-copy").textContent = workout.copy;
  document.getElementById("hero-duration").textContent = workout.id === "rest" ? "30 min" : `${workout.duration} min`;
  const startButton = document.getElementById("start-workout-button");
  startButton.disabled = workout.id === "rest";
  startButton.innerHTML = workout.id === "rest" ? "<span>Récupère aujourd'hui</span><span>·</span>" : log?.completedAt ? "<span>Voir la séance terminée</span><span>✓</span>" : log?.startedAt ? "<span>Reprendre la séance</span><span>→</span>" : "<span>Démarrer la séance</span><span>→</span>";

  const remaining = targets.calories - totals.calories;
  const metrics = [
    { icon: "↘", value: `${formatNumber(totals.calories)}`, unit: `/ ${formatNumber(targets.calories)} kcal`, label: `${formatNumber(Math.abs(remaining))} kcal ${remaining >= 0 ? "restantes" : "au-dessus"}`, progress: pct(totals.calories, targets.calories), color: "" },
    { icon: "P", value: `${formatNumber(totals.protein)}`, unit: `/ ${formatNumber(targets.protein)} g`, label: "protéines", progress: pct(totals.protein, targets.protein), color: "blue" },
    { icon: "↗", value: `${formatNumber(day.steps)}`, unit: `/ ${formatNumber(targets.steps)}`, label: "pas aujourd'hui", progress: pct(day.steps, targets.steps), color: "orange" },
    { icon: "Z", value: `${formatNumber(day.sleep, 1)}`, unit: "/ 8 h", label: "sommeil", progress: pct(day.sleep, 8), color: "purple" }
  ];
  document.getElementById("today-metrics").innerHTML = metrics.map(metric => `
    <article class="metric-card">
      <span class="metric-icon">${metric.icon}</span>
      <strong>${metric.value} <small>${metric.unit}</small></strong>
      <p>${metric.label}</p>
      <div class="progress-track"><div class="progress-fill ${metric.color}" style="width:${metric.progress}%"></div></div>
    </article>`).join("");

  document.getElementById("quick-weight").value = day.weight || "";
  document.getElementById("quick-steps").value = day.steps || "";
  document.getElementById("quick-sleep").value = day.sleep || "";
  document.getElementById("plan-label").textContent = `${state.settings.trainingDays} séances`;
  renderWeekStrip();
}

function renderWeekStrip() {
  const start = mondayOf(new Date());
  const today = localDateKey(new Date());
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  document.getElementById("week-strip").innerHTML = days.map((label, index) => {
    const date = new Date(start); date.setDate(start.getDate() + index);
    const key = localDateKey(date);
    const workout = getWorkout(key);
    const done = Boolean(state.workoutLogs[key]?.completedAt);
    return `<button type="button" class="day-card ${key === today ? "active" : ""} ${done ? "done" : ""}" data-open-training="${key}"><strong>${label}</strong><span>${workout.short}</span><i></i></button>`;
  }).join("");
}

function renderTraining() {
  document.getElementById("training-date").textContent = formatDate(selectedTrainingDate, true);
  const workout = getWorkout(selectedTrainingDate);
  const view = document.getElementById("workout-view");
  if (workout.id === "rest") {
    view.innerHTML = `<section class="rest-card reveal"><div class="rest-mark">○</div><span class="workout-tag">RÉCUPÉRATION</span><h2>${workout.name}</h2><p>${workout.copy}</p><div class="rest-list"><span>8–12k pas</span><span>Mobilité 10 min</span><span>Sommeil 8 h</span></div></section>`;
    return;
  }

  const log = getWorkoutLog(selectedTrainingDate, true);
  const completed = completedSetCount(log);
  const total = totalSetCount(workout, log);
  const sessionState = log.completedAt ? "Terminée" : log.startedAt ? "En cours" : "Prête";
  const buttonLabel = log.completedAt ? "Séance terminée ✓" : log.startedAt ? "Continuer la séance" : "Démarrer la séance";
  view.innerHTML = `
    <section class="workout-overview reveal">
      <span class="workout-tag">${workout.code} · ${sessionState}</span>
      <h2 id="training-title">${workout.name}</h2>
      <p>${workout.copy}</p>
      <div class="workout-facts"><span>${workout.exercises.length} exercices</span><span>${total} séries</span><span>${workout.cardio.minutes} min cardio</span></div>
      <button class="primary-button full workout-cta" type="button" data-action="start-session" ${log.completedAt ? "disabled" : ""}>${buttonLabel}</button>
    </section>
    <div class="session-progress reveal"><strong>Progression de séance</strong><div class="progress-track" style="flex:1"><div class="progress-fill" style="width:${pct(completed,total)}%"></div></div><span>${completed}/${total}</span></div>
    <div class="exercise-stack reveal">${workout.exercises.map((exercise, index) => renderExerciseCard(exercise, index, log)).join("")}</div>
    ${renderCardio(workout, log)}
    <button class="primary-button full" style="margin-top:12px" type="button" data-action="finish-session" ${log.completedAt ? "disabled" : ""}>${log.completedAt ? "Séance enregistrée" : "Terminer et enregistrer"}</button>`;
}

function renderExerciseCard(exercise, index, log) {
  const entry = log.exercises[exercise.id];
  const last = lastExerciseSession(exercise.id, selectedTrainingDate);
  const record = exerciseRecord(exercise.id);
  const advice = progressionAdvice(exercise, selectedTrainingDate);
  const lastLabel = last ? last.sets.map(set => `${formatNumber(set.weight,1)}×${formatNumber(set.reps)}`).join(" · ") : "Aucune séance";
  const recordLabel = record ? `PR ${formatNumber(record.e1rm, 1)} kg e1RM` : "Premier record à établir";
  return `<article class="exercise-card">
    <div class="exercise-header">
      <span class="exercise-index">${String(index + 1).padStart(2, "0")}</span>
      <div class="exercise-title"><strong>${exercise.name}</strong><span>${exercise.muscle} · repos ${Math.floor(exercise.rest / 60)}:${String(exercise.rest % 60).padStart(2,"0")}</span></div>
      <span class="exercise-dose">${entry.sets.length} × ${exercise.reps[0]}–${exercise.reps[1]}</span>
    </div>
    <div class="exercise-insight">
      <div class="insight-box"><span>Dernière fois</span><strong>${lastLabel}<br>${recordLabel}</strong></div>
      <div class="insight-box recommend"><span>${advice.label}</span><strong>${advice.detail}</strong></div>
    </div>
    <div class="set-list">
      <div class="set-head"><span>#</span><span>kg</span><span>reps</span><span>RIR</span><span>OK</span></div>
      ${entry.sets.map((set, setIndex) => {
        const previous = last?.sets[setIndex];
        return `<div class="set-row">
          <span class="set-number">${setIndex + 1}</span>
          <input aria-label="Charge série ${setIndex + 1}" type="number" inputmode="decimal" step="0.5" min="0" value="${escapeHtml(set.weight)}" placeholder="${previous ? escapeHtml(previous.weight) : "kg"}" data-set-field="weight" data-exercise="${exercise.id}" data-set="${setIndex}">
          <input aria-label="Répétitions série ${setIndex + 1}" type="number" inputmode="numeric" min="0" max="100" value="${escapeHtml(set.reps)}" placeholder="${previous ? escapeHtml(previous.reps) : exercise.reps[0]}" data-set-field="reps" data-exercise="${exercise.id}" data-set="${setIndex}">
          <input aria-label="Répétitions en réserve série ${setIndex + 1}" type="number" inputmode="numeric" min="0" max="10" value="${escapeHtml(set.rir)}" placeholder="2" data-set-field="rir" data-exercise="${exercise.id}" data-set="${setIndex}">
          <button type="button" class="set-check ${set.done ? "checked" : ""}" data-action="toggle-set" data-exercise="${exercise.id}" data-set="${setIndex}" aria-label="Valider la série ${setIndex + 1}">${set.done ? "✓" : "·"}</button>
        </div>`;
      }).join("")}
      <button type="button" class="add-set" data-action="add-set" data-exercise="${exercise.id}">＋ Ajouter une série</button>
    </div>
  </article>`;
}

function renderCardio(workout, log) {
  return `<section class="cardio-card reveal">
    <div class="cardio-icon">⌁</div>
    <div><strong>${workout.cardio.type}</strong><p>${workout.cardio.detail}</p></div>
    <div class="cardio-controls"><input aria-label="Minutes de cardio" id="cardio-minutes" type="number" inputmode="numeric" min="0" max="180" value="${n(log.cardio.minutes)}"><button type="button" class="set-check ${log.cardio.done ? "checked" : ""}" data-action="toggle-cardio" aria-label="Valider le cardio">${log.cardio.done ? "✓" : "·"}</button></div>
  </section>`;
}

function renderNutrition() {
  document.getElementById("nutrition-date").textContent = formatDate(selectedNutritionDate, true);
  const day = getDay(selectedNutritionDate);
  const totals = totalsForDay(selectedNutritionDate);
  const target = state.settings.targets;
  const remaining = target.calories - totals.calories;
  const caloriePercent = pct(totals.calories, target.calories);
  document.getElementById("nutrition-remaining").textContent = formatNumber(Math.abs(remaining));
  document.querySelector("#nutrition-title small").textContent = remaining >= 0 ? "kcal restantes" : "kcal au-dessus";
  document.getElementById("nutrition-balance-copy").textContent = `${formatNumber(totals.calories)} consommées sur ${formatNumber(target.calories)} kcal`;
  document.getElementById("calorie-ring-value").textContent = `${caloriePercent}%`;
  document.getElementById("calorie-ring").style.setProperty("--ring", `${caloriePercent * 3.6}deg`);

  const macros = [
    { label: "Protéines", value: totals.protein, target: target.protein, color: "blue" },
    { label: "Glucides", value: totals.carbs, target: target.carbs, color: "orange" },
    { label: "Lipides", value: totals.fat, target: target.fat, color: "purple" }
  ];
  document.getElementById("macro-grid").innerHTML = macros.map(macro => `<article class="macro-card"><span>${macro.label}</span><strong>${formatNumber(macro.value)} <small>/ ${formatNumber(macro.target)} g</small></strong><div class="progress-track"><div class="progress-fill ${macro.color}" style="width:${pct(macro.value, macro.target)}%"></div></div></article>`).join("");
  document.getElementById("food-presets").innerHTML = FOOD_PRESETS.map((item, index) => `<button type="button" class="preset-button" data-add-preset="${index}"><strong>${item.name}</strong><span>＋ ${formatNumber(item.calories)} kcal · ${formatNumber(item.protein)} g prot.</span></button>`).join("");
  renderFoodLog(day.foods);
  renderNutrients(totals, target);
}

function renderFoodLog(foods) {
  document.getElementById("food-count").textContent = foods.length;
  if (!foods.length) {
    document.getElementById("food-log").innerHTML = '<div class="empty-state">Aucun aliment enregistré pour cette date.<br>Utilise un raccourci ou ajoute ton repas.</div>';
    return;
  }
  const groups = foods.reduce((result, item) => {
    const key = item.meal || "Autre";
    (result[key] ||= []).push(item);
    return result;
  }, {});
  document.getElementById("food-log").innerHTML = Object.entries(groups).map(([meal, items]) => `<div class="food-group"><h3 class="food-group-title">${escapeHtml(meal)}</h3>${items.map(item => `<div class="food-row"><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.portion || "Portion libre")} · ${formatNumber(item.protein,1)} g prot.</span></div><b>${formatNumber(item.calories)} kcal</b><button type="button" class="remove-food" data-remove-food="${escapeHtml(item.id)}" aria-label="Supprimer ${escapeHtml(item.name)}">×</button></div>`).join("")}</div>`).join("");
}

function renderNutrients(totals, target) {
  const nutrients = [
    { label: "Fibres", value: totals.fiber, target: target.fiber, unit: "g", color: "" },
    { label: "Sucres ajoutés", value: totals.sugar, target: target.sugar, unit: "g max", color: "orange" },
    { label: "Sodium", value: totals.sodium, target: target.sodium, unit: "mg max", color: "purple" },
    { label: "Potassium", value: totals.potassium, target: target.potassium, unit: "mg", color: "blue" }
  ];
  document.getElementById("nutrient-list").innerHTML = nutrients.map(item => `<div class="nutrient-row"><div class="nutrient-row-top"><strong>${item.label}</strong><span>${formatNumber(item.value)} / ${formatNumber(item.target)} ${item.unit}</span></div><div class="progress-track"><div class="progress-fill ${item.color}" style="width:${pct(item.value,item.target)}%"></div></div></div>`).join("");
}

function renderProgress() {
  renderWeeklyChart();
  const profile = state.profile;
  const bodyStats = [
    ["Poids scan", `${formatNumber(profile.weight,1)} kg`, `Objectif 1 · ${formatNumber(profile.goalWeight,1)} kg`],
    ["Masse grasse", `${formatNumber(profile.bodyFat,1)} %`, `${formatNumber(profile.fatMass,1)} kg`],
    ["Muscle squelette", `${formatNumber(profile.skeletalMuscle,1)} kg`, "Très bonne base"],
    ["Métabolisme basal", `${formatNumber(profile.bmr)} kcal`, `Maintien ≈ ${formatNumber(profile.tdee)}`],
    ["Masse maigre", `${formatNumber(profile.leanMass,1)} kg`, `${formatNumber(profile.muscleMass,1)} kg muscle`],
    ["Eau corporelle", `${formatNumber(profile.bodyWater,1)} kg`, `Ratio ECW ${formatNumber(profile.ecwRatio,3)}`],
    ["Graisse viscérale", `${formatNumber(profile.visceralFat)} / 10`, `WHR ${formatNumber(profile.whr,2)}`],
    ["Score Visbody", `${formatNumber(profile.visbodyScore)} / 100`, "Import Looksmaxx"]
  ];
  document.getElementById("body-stats").innerHTML = bodyStats.map(([label,value,note]) => `<article class="body-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join("");
  renderRecords();
  renderSessionHistory();
}

function renderWeeklyChart() {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today); date.setDate(today.getDate() - (6 - index)); return localDateKey(date);
  });
  const weights = dates.map(key => n(state.days[key]?.weight)).filter(Boolean);
  const minWeight = weights.length ? Math.min(...weights) - .5 : state.profile.weight - 2;
  const maxWeight = weights.length ? Math.max(...weights) + .5 : state.profile.weight + 2;
  const targetCalories = state.settings.targets.calories;
  document.getElementById("weekly-chart").innerHTML = dates.map(key => {
    const day = state.days[key];
    const weight = n(day?.weight);
    const calories = day ? totalsForDay(key).calories : 0;
    const weightHeight = weight ? 25 + ((weight - minWeight) / Math.max(1, maxWeight - minWeight)) * 75 : 3;
    const calorieHeight = calories ? clamp(calories / targetCalories * 100, 3, 100) : 3;
    return `<div class="chart-day" title="${formatDate(key)} · ${weight ? `${formatNumber(weight,1)} kg` : "poids non saisi"} · ${formatNumber(calories)} kcal"><div class="chart-bars"><i class="chart-bar" style="height:${weightHeight}%"></i><i class="chart-bar calories" style="height:${calorieHeight}%"></i></div><small>${new Intl.DateTimeFormat("fr-FR",{weekday:"narrow"}).format(parseDate(key))}</small></div>`;
  }).join("");
  let trend = "Ajoute tes pesées";
  if (weights.length >= 2) {
    const delta = weights.at(-1) - weights[0];
    trend = `${delta > 0 ? "+" : ""}${formatNumber(delta,1)} kg`;
  }
  document.getElementById("weight-trend").textContent = trend;
}

function exerciseNameById(id) {
  for (const workout of Object.values(WORKOUTS)) {
    const exercise = workout.exercises.find(item => item.id === id);
    if (exercise) return exercise.name;
  }
  return id;
}

function renderRecords() {
  const ids = new Set();
  Object.values(state.workoutLogs).forEach(log => Object.keys(log.exercises || {}).forEach(id => ids.add(id)));
  const records = [...ids].map(id => ({ id, record: exerciseRecord(id) })).filter(item => item.record).sort((a,b) => b.record.e1rm - a.record.e1rm).slice(0,8);
  document.getElementById("records-list").innerHTML = records.length ? records.map((item,index) => `<div class="record-row"><span class="record-rank">${index+1}</span><div><strong>${exerciseNameById(item.id)}</strong><span>${formatDate(item.record.date)} · ${formatNumber(item.record.weight,1)} kg × ${formatNumber(item.record.reps)}</span></div><div class="record-value"><b>${formatNumber(item.record.e1rm,1)} kg</b><small>estimé</small></div></div>`).join("") : '<div class="empty-state">Tes records apparaîtront dès que tu valideras tes premières séries.</div>';
}

function renderSessionHistory() {
  const sessions = Object.entries(state.workoutLogs).filter(([, log]) => log.startedAt || log.completedAt).sort(([a],[b]) => b.localeCompare(a)).slice(0,8);
  document.getElementById("session-history").innerHTML = sessions.length ? sessions.map(([date,log]) => { const workout = WORKOUTS[log.workoutId] || WORKOUTS.rest; return `<button type="button" class="history-row" data-open-training="${date}" style="width:100%;color:inherit;border-right:0;border-bottom:0;border-left:0;background:transparent;text-align:left"><span class="record-rank">${workout.short.slice(0,2)}</span><div><strong>${workout.name}</strong><span>${formatDate(date,true)} · ${completedSetCount(log)} séries</span></div><div class="record-value"><b>${log.completedAt ? "Terminée" : "En cours"}</b><small>${n(log.cardio?.minutes)} min cardio</small></div></button>`; }).join("") : '<div class="empty-state">Aucune séance enregistrée pour le moment.</div>';
}

function renderSettings() {
  const settings = state.settings;
  const profile = state.profile;
  document.getElementById("mode-selector").innerHTML = Object.entries(MODES).map(([id, mode]) => `<button type="button" class="mode-button ${settings.mode === id ? "active" : ""}" data-mode="${id}"><strong>${mode.label}</strong><span>${mode.short}</span></button>`).join("");
  document.getElementById("mode-explanation").textContent = MODES[settings.mode].copy;
  const values = {
    "setting-name": settings.name,
    "setting-age": profile.age,
    "setting-height": profile.height,
    "setting-weight": profile.weight,
    "setting-bmr": profile.bmr,
    "setting-tdee": profile.tdee,
    "setting-calories": settings.targets.calories,
    "setting-protein": settings.targets.protein,
    "setting-steps": settings.targets.steps,
    "setting-frequency": settings.trainingDays
  };
  Object.entries(values).forEach(([id,value]) => { document.getElementById(id).value = value ?? ""; });
}

function flashSaved() {
  const label = document.getElementById("quick-saved");
  if (!label) return;
  label.classList.add("show");
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => label.classList.remove("show"), 1100);
}

function toast(message) {
  const element = document.getElementById("toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("show"), 2200);
}

function openTraining(key) {
  selectedTrainingDate = key;
  showPage("training");
}

function startSession() {
  const workout = getWorkout(selectedTrainingDate);
  if (workout.id === "rest") return;
  const log = getWorkoutLog(selectedTrainingDate, true);
  if (!log.startedAt) log.startedAt = new Date().toISOString();
  saveState();
  renderTraining();
  toast("Séance démarrée — tes séries sont mémorisées");
}

function finishSession() {
  const workout = getWorkout(selectedTrainingDate);
  const log = getWorkoutLog(selectedTrainingDate, false);
  if (!log || completedSetCount(log) === 0) {
    toast("Valide au moins une série avant de terminer");
    return;
  }
  log.startedAt ||= new Date().toISOString();
  log.completedAt = new Date().toISOString();
  log.cardio.minutes = n(document.getElementById("cardio-minutes")?.value) || log.cardio.minutes;
  const day = getDay(selectedTrainingDate);
  day.workoutDone = true;
  day.cardioMinutes = log.cardio.done ? n(log.cardio.minutes) : 0;
  saveState();
  renderTraining();
  toast(`${workout.name} enregistrée`);
}

function addPreset(index) {
  const preset = FOOD_PRESETS[index];
  if (!preset) return;
  getDay(selectedNutritionDate).foods.push({ id: uid("food"), ...clone(preset) });
  saveState();
  renderNutrition();
  toast(`${preset.name} ajouté`);
}

function removeFood(id) {
  const day = getDay(selectedNutritionDate);
  day.foods = day.foods.filter(item => String(item.id) !== String(id));
  saveState();
  renderNutrition();
  toast("Entrée supprimée");
}

function setMode(modeId) {
  if (!MODES[modeId]) return;
  state.settings.mode = modeId;
  state.settings.targets = autoTargets(modeId, state.profile.weight, state.profile.tdee);
  state.settings.customTargets = false;
  saveState();
  renderSettings();
  renderHeader();
  toast(`Mode ${MODES[modeId].label} activé`);
}

function restoreAutoTargets() {
  state.settings.targets = autoTargets(state.settings.mode, state.profile.weight, state.profile.tdee);
  state.settings.customTargets = false;
  saveState();
  renderSettings();
  toast("Objectifs recalculés selon ton mode");
}

function exportData() {
  const payload = { ...state, exportedAt: new Date().toISOString(), application: "LockIn Training OS" };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lockin-sauvegarde-${localDateKey(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast("Sauvegarde exportée");
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.settings || !parsed.profile || !parsed.days) throw new Error("Format incomplet");
      state = mergeState(parsed);
      saveState();
      renderPage(currentPage());
      toast("Sauvegarde importée");
    } catch (error) {
      console.error(error);
      toast("Fichier de sauvegarde invalide");
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!window.confirm("Effacer définitivement les séances, repas et mesures enregistrés sur cet appareil ?")) return;
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(LEGACY_KEY);
  state = makeDefaultState();
  saveState();
  selectedTrainingDate = localDateKey(new Date());
  selectedNutritionDate = localDateKey(new Date());
  renderPage(currentPage());
  toast("Données locales réinitialisées");
}

function handleClick(event) {
  const nav = event.target.closest("[data-nav]");
  if (nav) { showPage(nav.dataset.nav); return; }
  const go = event.target.closest("[data-go]");
  if (go) { showPage(go.dataset.go); return; }
  const weekDay = event.target.closest("[data-open-training]");
  if (weekDay) { openTraining(weekDay.dataset.openTraining); return; }
  const preset = event.target.closest("[data-add-preset]");
  if (preset) { addPreset(Number(preset.dataset.addPreset)); return; }
  const remove = event.target.closest("[data-remove-food]");
  if (remove) { removeFood(remove.dataset.removeFood); return; }
  const mode = event.target.closest("[data-mode]");
  if (mode) { setMode(mode.dataset.mode); return; }
  const action = event.target.closest("[data-action]");
  if (action) handleWorkoutAction(action);
}

function handleWorkoutAction(button) {
  const action = button.dataset.action;
  if (action === "start-session") { startSession(); return; }
  if (action === "finish-session") { finishSession(); return; }
  const log = getWorkoutLog(selectedTrainingDate, true);
  if (action === "toggle-set") {
    const set = log.exercises[button.dataset.exercise].sets[Number(button.dataset.set)];
    if (!set.done && (n(set.reps) <= 0 || n(set.weight) < 0)) { toast("Renseigne la charge et les reps"); return; }
    set.done = !set.done;
    log.startedAt ||= new Date().toISOString();
    saveState(); renderTraining();
  }
  if (action === "add-set") {
    log.exercises[button.dataset.exercise].sets.push({ weight: "", reps: "", rir: "", done: false });
    saveState(); renderTraining();
  }
  if (action === "toggle-cardio") {
    log.cardio.minutes = n(document.getElementById("cardio-minutes")?.value);
    log.cardio.done = !log.cardio.done;
    log.startedAt ||= new Date().toISOString();
    saveState(); renderTraining();
  }
}

function handleInput(event) {
  const field = event.target;
  if (field.matches("[data-set-field]")) {
    const log = getWorkoutLog(selectedTrainingDate, true);
    const set = log.exercises[field.dataset.exercise].sets[Number(field.dataset.set)];
    set[field.dataset.setField] = field.value;
    log.startedAt ||= new Date().toISOString();
    saveState();
    return;
  }
  if (field.id === "cardio-minutes") {
    const log = getWorkoutLog(selectedTrainingDate, true);
    log.cardio.minutes = n(field.value);
    saveState();
  }
}

function handleChange(event) {
  const field = event.target;
  const today = getDay(localDateKey(new Date()));
  if (field.id === "quick-weight") { today.weight = field.value ? n(field.value) : ""; saveState(true); renderToday(); return; }
  if (field.id === "quick-steps") { today.steps = n(field.value); saveState(true); renderToday(); return; }
  if (field.id === "quick-sleep") { today.sleep = n(field.value); saveState(true); renderToday(); return; }
  if (field.dataset.setting) {
    state.settings[field.dataset.setting] = field.dataset.setting === "trainingDays" ? Number(field.value) : field.value;
    saveState(); renderHeader(); toast("Réglage sauvegardé"); return;
  }
  if (field.dataset.profile) {
    state.profile[field.dataset.profile] = field.value === "" ? "" : n(field.value);
    saveState(); toast("Profil sauvegardé"); return;
  }
  if (field.dataset.target) {
    state.settings.targets[field.dataset.target] = n(field.value);
    state.settings.customTargets = true;
    saveState(); toast("Objectif personnalisé sauvegardé");
  }
}

function bindStaticEvents() {
  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);
  window.addEventListener("hashchange", () => showPage(currentPage(), false));

  document.getElementById("start-workout-button").addEventListener("click", () => {
    selectedTrainingDate = localDateKey(new Date());
    showPage("training");
    if (getWorkout(selectedTrainingDate).id !== "rest") startSession();
  });
  document.getElementById("training-prev").addEventListener("click", () => { selectedTrainingDate = changeDate(selectedTrainingDate, -1); renderTraining(); });
  document.getElementById("training-next").addEventListener("click", () => { selectedTrainingDate = changeDate(selectedTrainingDate, 1); renderTraining(); });
  document.getElementById("training-today").addEventListener("click", () => { selectedTrainingDate = localDateKey(new Date()); renderTraining(); });
  document.getElementById("nutrition-prev").addEventListener("click", () => { selectedNutritionDate = changeDate(selectedNutritionDate, -1); renderNutrition(); });
  document.getElementById("nutrition-next").addEventListener("click", () => { selectedNutritionDate = changeDate(selectedNutritionDate, 1); renderNutrition(); });
  document.getElementById("nutrition-today").addEventListener("click", () => { selectedNutritionDate = localDateKey(new Date()); renderNutrition(); });

  const foodDialog = document.getElementById("food-dialog");
  document.getElementById("open-food-dialog").addEventListener("click", () => foodDialog.showModal());
  document.querySelector("[data-close-dialog]").addEventListener("click", () => foodDialog.close());
  foodDialog.addEventListener("click", event => { if (event.target === foodDialog) foodDialog.close(); });
  document.getElementById("food-form").addEventListener("submit", event => {
    event.preventDefault();
    const item = {
      id: uid("food"),
      name: document.getElementById("food-name").value.trim(),
      meal: document.getElementById("food-meal").value,
      portion: document.getElementById("food-portion").value.trim(),
      calories: n(document.getElementById("food-calories").value),
      protein: n(document.getElementById("food-protein").value),
      carbs: n(document.getElementById("food-carbs").value),
      fat: n(document.getElementById("food-fat").value),
      fiber: n(document.getElementById("food-fiber").value),
      sugar: n(document.getElementById("food-sugar").value),
      sodium: n(document.getElementById("food-sodium").value),
      potassium: n(document.getElementById("food-potassium").value)
    };
    if (!item.name || item.calories <= 0) { toast("Ajoute un nom et des calories"); return; }
    getDay(selectedNutritionDate).foods.push(item);
    saveState();
    event.target.reset();
    foodDialog.close();
    renderNutrition();
    toast("Aliment ajouté au journal");
  });

  document.getElementById("restore-auto-targets").addEventListener("click", restoreAutoTargets);
  document.getElementById("export-data").addEventListener("click", exportData);
  document.getElementById("import-data").addEventListener("change", event => { importData(event.target.files?.[0]); event.target.value = ""; });
  document.getElementById("reset-data").addEventListener("click", resetData);
}

function initialize() {
  renderNavigation();
  bindStaticEvents();
  saveState();
  showPage(currentPage(), false);
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(error => console.info("Mode hors-ligne non activé", error)));
  }
}

initialize();
