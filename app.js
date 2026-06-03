/* ===========================================================
   Meltdown — Daily Management Scale / Échelle de gestion
   Vanilla JS PWA. All data lives in localStorage (private, offline).
   Bilingual: French (default) + English, toggle in settings.
   =========================================================== */

(() => {
  "use strict";

  /* ===========================================================
     I18N DICTIONARY
     =========================================================== */

  const DICT = {
    fr: {
      categories: {
        health: "Santé", wealth: "Richesse", productivity: "Productivité", connectivity: "Relations",
      },
      months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
      dow: ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"], // Sunday-indexed (matches Date.getDay())
      greeting: { night: "Encore debout", morning: "Bonjour", afternoon: "Bon après-midi", evening: "Bonsoir" },
      bands: [
        { min: 8,   label: "Épanoui",                 desc: "Tu tournes à plein régime. Garde ce rythme." },
        { min: 6.5, label: "Au-dessus de la moyenne", desc: "Belle journée. Quelques ajustements et tu t'envoles." },
        { min: 5,   label: "Dans la moyenne",         desc: "Une journée équilibrée — observe ce qui a fait bouger les choses." },
        { min: 3.5, label: "En dessous de la moyenne", desc: "Une journée plus difficile. Sois indulgent et repars de zéro." },
        { min: 0,   label: "À bout de souffle",       desc: "Journée éprouvante. Demain est un nouveau chapitre." },
      ],
      questions: [
        { cat: "health", icon: "🌱", q: "Qu'as-tu fait pour améliorer ta santé aujourd'hui ?", ph: "Activité, alimentation, sommeil, esprit…", labels: ["Négligée", "En dessous", "Correct", "Bien gérée", "Très bien gérée"] },
        { cat: "health", icon: "😄", q: "T'es-tu amusé aujourd'hui — et si oui, à quoi ?", ph: "Qu'est-ce qui t'a fait sourire ?", labels: ["Pas du tout", "Un peu", "Moyennement", "Beaucoup", "Énormément"] },
        { cat: "productivity", icon: "📚", q: "Qu'as-tu appris aujourd'hui ?", ph: "Une idée, une compétence, une prise de conscience…", labels: ["Rien de neuf", "Un peu", "Quelque chose", "Beaucoup", "Une révélation"] },
        { cat: "connectivity", icon: "🙏", q: "Pour quoi es-tu le plus reconnaissant aujourd'hui ?", ph: "Cite une chose…", labels: ["Difficilement", "À peine", "Un peu", "Reconnaissant", "Profondément reconnaissant"] },
        { cat: "connectivity", icon: "🤝", q: "Qui te souviens-tu avoir aidé aujourd'hui ?", ph: "Une personne, un geste…", labels: ["Personne", "Brièvement", "Quelqu'un", "Plusieurs", "Vraie différence"] },
        { cat: "health", icon: "🧘", q: "T'es-tu énervé ou contrarié aujourd'hui ? Comment as-tu réagi ?", ph: "Ce qui s'est passé, comment tu as réagi…", labels: ["Perdu le contrôle", "En difficulté", "Géré", "Bien géré", "Resté serein"] },
        { cat: "wealth", icon: "💰", q: "Comment as-tu amélioré ta richesse aujourd'hui ?", ph: "Gagné, économisé, investi, appris…", labels: ["Recul", "Rien", "Un peu", "Bon progrès", "Grand pas"] },
        { cat: "productivity", icon: "🎯", q: "Que peux-tu faire mieux demain ?", ph: "Une chose à améliorer…", labels: ["Aucune idée", "Vague", "Un plan", "Plan clair", "Déterminé"] },
      ],
      tips: {
        health: [
          "Fixe demain une habitude santé non négociable à une heure précise — 20 min de marche, extinction des feux à 23h, ou un vrai déjeuner loin du bureau.",
          "Ton corps est le moteur de tous les autres scores. Protège d'abord ton sommeil ; il améliore l'humeur, la concentration et la patience gratuitement.",
          "Empile une mini-victoire : 10 pompes après t'être brossé les dents. La régularité bat l'intensité dans un emploi du temps d'entrepreneur.",
        ],
        wealth: [
          "Bloque 30 minutes concentrées demain sur la seule tâche qui rapporte le plus — prospection, pitch, ou livrer le produit.",
          "Suis un indicateur financier chaque jour (chiffre d'affaires, pipeline, ou trésorerie). Ce qui se mesure s'améliore.",
          "Distingue « être occupé » de « créer de la richesse ». Demande-toi chaque soir : le travail d'aujourd'hui capitalise-t-il, ou maintient-il juste la machine ?",
        ],
        productivity: [
          "Choisis ce soir, avant de dormir, LA tâche la plus importante de demain. Fais-la en premier, avant les e-mails ou les messages.",
          "Tu apprends — boucle la boucle : écris une phrase sur la façon dont tu appliqueras la leçon du jour cette semaine.",
          "Cadre ton travail en profondeur. Deux blocs protégés de 90 min produisent plus qu'une journée dispersée de 10 heures.",
        ],
        connectivity: [
          "Contacte une personne demain sans but précis — un message vocal, un café, un merci. L'auteur aussi avait les relations pour score le plus bas.",
          "La gratitude renforce les relations. Dis à quelqu'un précisément ce que tu as apprécié chez lui aujourd'hui.",
          "L'entrepreneuriat isole. Planifie un vrai moment humain cette semaine et traite-le comme un rendez-vous immuable.",
        ],
      },
      ui: {
        ready_title: "Prêt à faire ton bilan ?",
        ready_sub: "Cinq minutes. Huit questions. Un score honnête.",
        reflection_title: "Réflexion du soir",
        reflection_body: "Réponds chaque soir aux huit mêmes questions, évalue chaque aspect de ta journée, et regarde ton Échelle de Gestion Meltdown prendre forme.",
        start_today: "Commencer le bilan du jour",
        streak_keep: (n) => `🔥 Série de ${n} jour${n > 1 ? "s" : ""} — ne la brise pas.`,
        todays_balance: "Ton équilibre du jour",
        edit_answers: "Modifier",
        view_insights: "Voir les analyses",
        last_7: "7 derniers jours",
        back: "← Retour",
        future_day: "Ce jour n'est pas encore arrivé.",
        no_checkin: "Aucun bilan enregistré pour ce jour.",
        add_day: "Ajouter ce jour",
        no_note: "Pas de note",
        balance: "Équilibre",
        reflections: "Réflexions",
        edit_day: "Modifier ce jour",
        cal_eyebrow: "Calendrier",
        cal_title: "Ton parcours",
        low: "Faible", high: "Élevé",
        days_unit: (n) => `jour${n > 1 ? "s" : ""}`,
        checked_month: "Bilans ce mois-ci",
        monthly_avg: "Moyenne du mois",
        ins_eyebrow: "Analyses",
        ins_title: "Tendances &amp; progrès",
        ins_empty: "Dès que tu auras enregistré quelques bilans, tes tendances, moyennes hebdomadaires et recommandations personnelles apparaîtront ici.",
        start_first: "Commencer ton premier bilan",
        avg_30: "Moyenne sur 30 jours",
        day_streak: "Jours de série",
        total_checkins: (n) => `${n} bilan${n > 1 ? "s" : ""} au total`,
        score_trend: "Évolution du score",
        last_30: "30 derniers jours",
        month_weekly: "Ce mois, semaine par semaine",
        week: (i) => `Sem. ${i}`,
        average: "Moyenne",
        energy: "Où va ton énergie",
        recommendations: "Recommandations",
        not_enough: "Pas encore assez de données.",
        focus: (label, v) => `Axe prioritaire : ${label} (${v}/5)`,
        strength: (label, v) => `Ton point fort : ${label} (${v}/5)`,
        strength_body: (lo) => `C'est ce qui te porte en ce moment. Observe ce que tu fais ici et applique la même méthode pour : ${lo}.`,
        band30: (avg, band) => `Moyenne sur 30 jours : ${avg}/10 — ${band}`,
        band_high: "Tu es régulièrement dans une bonne zone. Maintenant, relève le plancher : réduis tes pires jours plutôt que de viser la perfection.",
        band_mid: "Tu es autour de la moyenne — exactement là où de petits changements répétés paient le plus. Choisis une habitude et tiens-la une semaine.",
        band_low: "Tes scores sont bas en ce moment, et le reconnaître est déjà courageux. Commence par le sommeil et une petite victoire par jour ; le reste suit souvent.",
        streak_title_on: (n) => `Série de ${n} jours — l'élan se construit`,
        streak_title_off: "Construis ta série",
        streak_body_on: "La régularité fait tout. Programme un rappel à 19h30 pour que le bilan reste non négociable.",
        streak_body_off: "Le conseil du livre : rends ce bilan « non négociable ». Programme un rappel quotidien à 19h30 pour qu'il devienne automatique.",
        tap_scale: "Évalue ta journée",
        next: "Suivant", finish: "Terminer", back_btn: "Retour",
        leave_confirm: "Quitter le bilan ? Ta progression de cette session ne sera pas enregistrée.",
        saved: (date) => `Ton bilan du ${date} est enregistré.`,
        see_insights: "Voir mes analyses",
        back_today: "Retour à aujourd'hui",
        nav_today: "Aujourd'hui", nav_calendar: "Calendrier", nav_insights: "Analyses", nav_more: "Plus",
        new_checkin: "Nouveau bilan",
        settings_title: "Réglages",
        name_label: "Ton prénom (pour les salutations)",
        name_ph: "ex. Alex",
        language: "Langue",
        reminder_title: "Rappel quotidien",
        reminder_body: "La règle n°1 du livre : rends le bilan <b>non négociable</b>. Programme un rappel sur ton téléphone à <b>19h30</b> et laisse-le devenir une habitude. (Les apps web ne peuvent pas planifier de notifications iOS — utilise l'app Horloge ou Rappels.)",
        your_data: "Tes données",
        data_count: (n) => `${n} bilan${n > 1 ? "s" : ""} enregistré${n > 1 ? "s" : ""} en privé sur cet appareil.`,
        export: "Exporter (JSON)",
        reset: "Tout réinitialiser",
        footer: "Échelle de Gestion Meltdown · d'après le livre « Meltdown »",
        reset_confirm: "Supprimer définitivement TOUS les bilans ? Action irréversible.",
        data_cleared: "Toutes les données effacées",
        exported: "Exporté",
        score_word: "Score",
        prog_title: "Ta progression",
        prog_up: (d) => `En hausse de ${d} pt vs les 30 jours précédents.`,
        prog_down: (d) => `En baisse de ${d} pt vs les 30 jours précédents.`,
        prog_flat: "Stable par rapport aux 30 jours précédents.",
        prog_improved: (label, d) => ` Plus forte hausse : ${label} (+${d}).`,
        prog_declined: (label, d) => ` En recul : ${label} (−${d}).`,
        prog_need_more: "Continue tes bilans : le suivi de progression d'une période à l'autre se débloque dès que tu auras deux périodes à comparer.",
        life_title: "Depuis le début",
        life_body: (n, avg) => `${n} bilan${n > 1 ? "s" : ""} enregistré${n > 1 ? "s" : ""} · moyenne de vie ${avg}/10.`,
        life_best: (s, date) => ` Record : ${s}/10 le ${date}.`,
        life_longest: (n) => ` Plus longue série : ${n} jour${n > 1 ? "s" : ""}.`,
      },
      auth: {
        setup_title: "Protège ton journal",
        setup_sub: "Crée un mot de passe. Il chiffre tes données sur cet appareil — personne ne peut les lire sans lui, même pas en inspectant le navigateur.",
        pw: "Mot de passe",
        pw_ph: "Au moins 6 caractères",
        pw_confirm: "Confirme le mot de passe",
        create: "Créer et chiffrer",
        unlock_sub: "Entre ton mot de passe pour déverrouiller ton journal.",
        unlock: "Déverrouiller",
        working: "Chiffrement…",
        wrong_pw: "Mot de passe incorrect.",
        pw_short: "Choisis au moins 6 caractères.",
        pw_mismatch: "Les deux mots de passe ne correspondent pas.",
        forgot: "Mot de passe oublié ?",
        recovery_title: "Récupérer l'accès",
        recovery_sub: "Entre la clé de récupération que tu as notée à la création. Tu pourras ensuite définir un nouveau mot de passe.",
        recovery_ph: "XXXXX-XXXXX-XXXXX-XXXXX",
        recovery_btn: "Récupérer",
        recovery_bad: "Clé de récupération invalide.",
        back_to_unlock: "← Retour",
        recovery_save_title: "Ta clé de récupération",
        recovery_save_sub: "C'est le SEUL moyen de récupérer tes données si tu oublies ton mot de passe. Note-la et garde-la en lieu sûr — elle ne sera plus jamais réaffichée.",
        copy: "Copier la clé",
        copied: "Clé copiée",
        saved_continue: "J'ai noté ma clé en lieu sûr",
        set_new_pw_title: "Nouveau mot de passe",
        set_new_pw_sub: "Choisis un nouveau mot de passe pour reverrouiller ton journal.",
        security: "Sécurité &amp; confidentialité",
        security_body: "Tes bilans sont chiffrés sur cet appareil. Ils ne quittent jamais ton navigateur.",
        change_pw: "Changer le mot de passe",
        new_recovery: "Régénérer la clé de récupération",
        pw_changed: "Mot de passe modifié",
        no_crypto: "Le chiffrement sécurisé n'est pas disponible ici. Ouvre l'app via son adresse https : homeric1.github.io/Meltdown",
      },
    },

    en: {
      categories: {
        health: "Health", wealth: "Wealth", productivity: "Productivity", connectivity: "Connectivity",
      },
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      dow: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      greeting: { night: "Late night", morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
      bands: [
        { min: 8,   label: "Thriving",       desc: "You're firing on all cylinders. Keep this rhythm." },
        { min: 6.5, label: "Above average",   desc: "Solid day. A few small tweaks and you're flying." },
        { min: 5,   label: "Average",         desc: "A balanced day — notice what nudged the needle." },
        { min: 3.5, label: "Below average",   desc: "A heavier day. Be kind to yourself and reset." },
        { min: 0,   label: "Running on empty", desc: "Tough day. Tomorrow is a fresh chapter." },
      ],
      questions: [
        { cat: "health", icon: "🌱", q: "What did you do to improve your health today?", ph: "Movement, food, sleep, mind…", labels: ["Neglected it", "Below par", "Okay", "Looked after it", "Took great care"] },
        { cat: "health", icon: "😄", q: "Did you have fun today — and if so, what was it?", ph: "What made you smile?", labels: ["No fun at all", "A little", "Some", "A good amount", "So much fun"] },
        { cat: "productivity", icon: "📚", q: "What did you learn today?", ph: "An idea, skill, or insight…", labels: ["Nothing new", "A little", "Something", "A lot", "A breakthrough"] },
        { cat: "connectivity", icon: "🙏", q: "What's the biggest thing you're grateful for today?", ph: "Name one thing…", labels: ["Struggled to", "Barely", "Somewhat", "Grateful", "Deeply grateful"] },
        { cat: "connectivity", icon: "🤝", q: "Who do you remember helping today?", ph: "A person, a gesture…", labels: ["No one", "Briefly", "Someone", "A few people", "Real difference"] },
        { cat: "health", icon: "🧘", q: "Did you get angry or triggered today? How did you deal with it?", ph: "What happened, how you responded…", labels: ["Lost control", "Struggled", "Managed", "Handled well", "Stayed centered"] },
        { cat: "wealth", icon: "💰", q: "How have you improved your wealth today?", ph: "Earned, saved, invested, learned…", labels: ["Went backwards", "Nothing", "A little", "Good progress", "Big step"] },
        { cat: "productivity", icon: "🎯", q: "What can you do better tomorrow?", ph: "One thing to improve…", labels: ["No idea", "Vague", "A plan", "Clear plan", "Locked in"] },
      ],
      tips: {
        health: [
          "Pin one non-negotiable health habit to a fixed time tomorrow — a 20-min walk, lights-out by 11, or a real lunch away from the desk.",
          "Your body is the engine behind every other score. Protect sleep first; it lifts mood, focus and patience for free.",
          "Stack a tiny win: 10 push-ups after brushing your teeth. Consistency beats intensity for an entrepreneur's schedule.",
        ],
        wealth: [
          "Block 30 focused minutes tomorrow on the single task that most moves money — outreach, a pitch, or shipping the thing.",
          "Track one money metric daily (revenue, pipeline, or runway). What gets measured gets improved.",
          "Separate 'busy' from 'building wealth'. Ask each evening: did today's work compound, or just keep the lights on?",
        ],
        productivity: [
          "Choose tomorrow's ONE most important task tonight, before you sleep. Do it first, before email or messages.",
          "You're learning — now close the loop: write one sentence on how you'll apply today's lesson this week.",
          "Time-box deep work. Two protected 90-min blocks will out-produce a scattered 10-hour day.",
        ],
        connectivity: [
          "Reach out to one person tomorrow with no agenda — a voice note, a coffee, a thank-you. The author found connection was his lowest score too.",
          "Gratitude compounds relationships. Tell someone specifically what you appreciated about them today.",
          "Entrepreneurship is isolating. Schedule one real human connection this week and treat it like a meeting you can't move.",
        ],
      },
      ui: {
        ready_title: "Ready to check in?",
        ready_sub: "Five minutes. Eight questions. One honest score.",
        reflection_title: "Tonight's reflection",
        reflection_body: "Answer the same eight questions you do every evening, rate how each part of your day went, and watch your Meltdown Management Scale take shape.",
        start_today: "Start today's check-in",
        streak_keep: (n) => `🔥 ${n}-day streak — keep it alive.`,
        todays_balance: "Today's balance",
        edit_answers: "Edit answers",
        view_insights: "View insights",
        last_7: "Last 7 days",
        back: "← Back",
        future_day: "This day hasn't happened yet.",
        no_checkin: "No check-in recorded for this day.",
        add_day: "Add this day",
        no_note: "No note",
        balance: "Balance",
        reflections: "Reflections",
        edit_day: "Edit this day",
        cal_eyebrow: "Calendar",
        cal_title: "Your journey",
        low: "Low", high: "High",
        days_unit: (n) => `day${n > 1 ? "s" : ""}`,
        checked_month: "Checked in this month",
        monthly_avg: "Monthly average",
        ins_eyebrow: "Insights",
        ins_title: "Patterns &amp; growth",
        ins_empty: "Once you log a few check-ins, your trends, weekly averages and personal recommendations will appear here.",
        start_first: "Start your first check-in",
        avg_30: "30-day average",
        day_streak: "Day streak",
        total_checkins: (n) => `${n} total check-in${n > 1 ? "s" : ""}`,
        score_trend: "Score trend",
        last_30: "last 30 days",
        month_weekly: "This month, week by week",
        week: (i) => `Week ${i}`,
        average: "Average",
        energy: "Where your energy goes",
        recommendations: "Recommendations",
        not_enough: "Not enough data yet.",
        focus: (label, v) => `Focus area: ${label} (${v}/5)`,
        strength: (label, v) => `Your strength: ${label} (${v}/5)`,
        strength_body: (lo) => `This is carrying you right now. Notice what you're doing here and borrow that same habit-building approach for ${lo}.`,
        band30: (avg, band) => `30-day average: ${avg}/10 — ${band}`,
        band_high: "You're consistently in a strong zone. Now raise the floor: shrink your worst days rather than chasing perfect ones.",
        band_mid: "You're around the middle — exactly where small, repeatable changes pay off most. Pick one habit and run it for a week.",
        band_low: "Scores are low right now, and naming that is the brave part. Start with sleep and one daily win; the rest tends to follow.",
        streak_title_on: (n) => `${n}-day streak — momentum is building`,
        streak_title_off: "Build the streak",
        streak_body_on: "Consistency is the whole game. Set a 7:30pm reminder so the check-in stays non-negotiable.",
        streak_body_off: "The book's advice: make this check-in 'non-negotiable.' Set a daily 7:30pm reminder so it becomes automatic.",
        tap_scale: "Tap how today felt",
        next: "Next", finish: "Finish", back_btn: "Back",
        leave_confirm: "Leave check-in? Your progress for this session won't be saved.",
        saved: (date) => `Your check-in for ${date} is saved.`,
        see_insights: "See my insights",
        back_today: "Back to today",
        nav_today: "Today", nav_calendar: "Calendar", nav_insights: "Insights", nav_more: "More",
        new_checkin: "New check-in",
        settings_title: "Settings",
        name_label: "Your name (for greetings)",
        name_ph: "e.g. Alex",
        language: "Language",
        reminder_title: "Daily reminder",
        reminder_body: "The book's #1 rule: make the check-in <b>non-negotiable</b>. Set a phone reminder for <b>7:30pm</b> and let it become a habit. (Web apps can't schedule iOS notifications — use your Clock or Reminders app.)",
        your_data: "Your data",
        data_count: (n) => `${n} check-in${n > 1 ? "s" : ""} stored privately on this device.`,
        export: "Export JSON",
        reset: "Reset all",
        footer: "Meltdown Management Scale · based on the book “Meltdown”",
        reset_confirm: "Delete ALL check-ins permanently? This cannot be undone.",
        data_cleared: "All data cleared",
        exported: "Exported",
        score_word: "Score",
        prog_title: "Your progression",
        prog_up: (d) => `Up ${d} pts vs the previous 30 days.`,
        prog_down: (d) => `Down ${d} pts vs the previous 30 days.`,
        prog_flat: "Steady versus the previous 30 days.",
        prog_improved: (label, d) => ` Biggest gain: ${label} (+${d}).`,
        prog_declined: (label, d) => ` Slipping: ${label} (−${d}).`,
        prog_need_more: "Keep checking in: period-over-period progression unlocks once you have two periods to compare.",
        life_title: "Since you started",
        life_body: (n, avg) => `${n} check-in${n > 1 ? "s" : ""} logged · lifetime average ${avg}/10.`,
        life_best: (s, date) => ` Personal best: ${s}/10 on ${date}.`,
        life_longest: (n) => ` Longest streak: ${n} day${n > 1 ? "s" : ""}.`,
      },
      auth: {
        setup_title: "Protect your journal",
        setup_sub: "Create a password. It encrypts your data on this device — no one can read it without it, not even by inspecting the browser.",
        pw: "Password",
        pw_ph: "At least 6 characters",
        pw_confirm: "Confirm password",
        create: "Create &amp; encrypt",
        unlock_sub: "Enter your password to unlock your journal.",
        unlock: "Unlock",
        working: "Encrypting…",
        wrong_pw: "Incorrect password.",
        pw_short: "Use at least 6 characters.",
        pw_mismatch: "The two passwords don't match.",
        forgot: "Forgot your password?",
        recovery_title: "Recover access",
        recovery_sub: "Enter the recovery code you saved when you created your password. You'll then set a new password.",
        recovery_ph: "XXXXX-XXXXX-XXXXX-XXXXX",
        recovery_btn: "Recover",
        recovery_bad: "Invalid recovery code.",
        back_to_unlock: "← Back",
        recovery_save_title: "Your recovery code",
        recovery_save_sub: "This is the ONLY way to recover your data if you forget your password. Write it down and keep it safe — it will never be shown again.",
        copy: "Copy code",
        copied: "Code copied",
        saved_continue: "I've saved my code safely",
        set_new_pw_title: "New password",
        set_new_pw_sub: "Choose a new password to re-lock your journal.",
        security: "Security &amp; privacy",
        security_body: "Your check-ins are encrypted on this device. They never leave your browser.",
        change_pw: "Change password",
        new_recovery: "Regenerate recovery code",
        pw_changed: "Password changed",
        no_crypto: "Secure encryption isn't available here. Open the app over its https address: homeric1.github.io/Meltdown",
      },
    },
  };

  // Category colours/icons are language-independent.
  const CAT_META = {
    health:       { icon: "🌱", color: "#34d399" },
    wealth:       { icon: "💰", color: "#fbbf24" },
    productivity: { icon: "⚡", color: "#60a5fa" },
    connectivity: { icon: "🤝", color: "#f472b6" },
  };
  const CAT_KEYS = ["health", "wealth", "productivity", "connectivity"];

  /* ---------------- Storage ---------------- */

  const LEGACY_ENTRIES = "meltdown.entries.v1";   // old plaintext store (migrated on first setup)
  const ENTRIES_KEY = "meltdown.entries.v2";      // encrypted store: { iv, ct }
  const CRYPTO_KEY = "meltdown.crypto.v1";        // key-wrapping metadata
  const SETTINGS_KEY = "meltdown.settings.v1";    // lang + name (not sensitive, kept in clear)

  // In-memory, decrypted state. Populated only after the user unlocks.
  let DEK = null;          // AES-GCM CryptoKey that encrypts the entries
  let DEKRAW = null;       // raw DEK bytes, kept in memory to re-wrap on password / recovery change
  let memEntries = {};     // decrypted entries cache; the rest of the app reads this synchronously

  const Store = {
    load() { return memEntries; },
    save(data) { memEntries = data; persistEntries(); },
    get(key) { return memEntries[key] || null; },
    set(key, entry) { memEntries[key] = entry; persistEntries(); },
    settings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; } },
    saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); },
  };

  /* ---------------- Crypto (envelope encryption, all client-side) ---------------- */
  /* Entries are encrypted at rest with a random Data Encryption Key (DEK).
     The DEK is wrapped twice: once by a key derived from the password, once by a
     key derived from a recovery code. Forgetting the password is recoverable via
     the recovery code; losing both means the data is unrecoverable by design. */

  const SUBTLE = (window.crypto && window.crypto.subtle) ? window.crypto.subtle : null;
  const PBKDF2_ITER = 250000;
  const _enc = new TextEncoder();
  const _dec = new TextDecoder();
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  function cryptoConfigured() { return !!localStorage.getItem(CRYPTO_KEY); }

  async function deriveKEK(secret, saltBytes) {
    const base = await SUBTLE.importKey("raw", _enc.encode(secret), "PBKDF2", false, ["deriveKey"]);
    return SUBTLE.deriveKey(
      { name: "PBKDF2", salt: saltBytes, iterations: PBKDF2_ITER, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }
  async function aesEncrypt(key, bytes) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await SUBTLE.encrypt({ name: "AES-GCM", iv }, key, bytes);
    return { iv: b64(iv), ct: b64(ct) };
  }
  async function aesDecrypt(key, obj) {
    const pt = await SUBTLE.decrypt({ name: "AES-GCM", iv: unb64(obj.iv) }, key, unb64(obj.ct));
    return new Uint8Array(pt);
  }
  const importDEK = (raw) => SUBTLE.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);

  const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no easily-confused chars
  function genRecoveryCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    let s = "";
    for (let i = 0; i < bytes.length; i++) {
      s += RECOVERY_ALPHABET[bytes[i] % RECOVERY_ALPHABET.length];
      if (i % 5 === 4 && i < bytes.length - 1) s += "-";
    }
    return s; // e.g. ABCDE-FGHJK-MNPQR-STUVW
  }
  const normalizeRecovery = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Create the very first password (and recovery code). Migrates legacy plaintext entries.
  async function setupPassword(password) {
    const dekRaw = crypto.getRandomValues(new Uint8Array(32));
    const recovery = genRecoveryCode();
    const pwSalt = crypto.getRandomValues(new Uint8Array(16));
    const recSalt = crypto.getRandomValues(new Uint8Array(16));
    const [kekPw, kekRec] = await Promise.all([
      deriveKEK(password, pwSalt),
      deriveKEK(normalizeRecovery(recovery), recSalt),
    ]);
    const meta = {
      v: 1, iter: PBKDF2_ITER,
      pwSalt: b64(pwSalt), recSalt: b64(recSalt),
      wrapPw: await aesEncrypt(kekPw, dekRaw),
      wrapRec: await aesEncrypt(kekRec, dekRaw),
    };
    localStorage.setItem(CRYPTO_KEY, JSON.stringify(meta));
    DEKRAW = dekRaw;
    DEK = await importDEK(dekRaw);
    let legacy = {};
    try { legacy = JSON.parse(localStorage.getItem(LEGACY_ENTRIES)) || {}; } catch { legacy = {}; }
    memEntries = (legacy && typeof legacy === "object") ? legacy : {};
    await persistEntries();
    localStorage.removeItem(LEGACY_ENTRIES);
    return recovery;
  }

  async function unwrapWith(secret, saltField, wrapField) {
    const meta = JSON.parse(localStorage.getItem(CRYPTO_KEY));
    const kek = await deriveKEK(secret, unb64(meta[saltField]));
    try { return await aesDecrypt(kek, meta[wrapField]); } // AES-GCM auth failure => wrong secret
    catch { return null; }
  }
  async function unlockWithPassword(password) {
    const dekRaw = await unwrapWith(password, "pwSalt", "wrapPw");
    if (!dekRaw) return false;
    DEKRAW = dekRaw;
    DEK = await importDEK(dekRaw);
    await loadEntries();
    return true;
  }
  async function unlockWithRecovery(code) {
    const dekRaw = await unwrapWith(normalizeRecovery(code), "recSalt", "wrapRec");
    if (!dekRaw) return false;
    DEKRAW = dekRaw;
    DEK = await importDEK(dekRaw);
    await loadEntries();
    return true;
  }
  // Re-wrap the in-memory DEK under a new password. Requires being unlocked.
  async function changePassword(newPassword) {
    if (!DEKRAW) return false;
    const meta = JSON.parse(localStorage.getItem(CRYPTO_KEY));
    const pwSalt = crypto.getRandomValues(new Uint8Array(16));
    const kek = await deriveKEK(newPassword, pwSalt);
    meta.pwSalt = b64(pwSalt);
    meta.wrapPw = await aesEncrypt(kek, DEKRAW);
    localStorage.setItem(CRYPTO_KEY, JSON.stringify(meta));
    return true;
  }
  // Issue a brand-new recovery code (invalidates the old one). Requires being unlocked.
  async function regenerateRecovery() {
    if (!DEKRAW) return null;
    const meta = JSON.parse(localStorage.getItem(CRYPTO_KEY));
    const recovery = genRecoveryCode();
    const recSalt = crypto.getRandomValues(new Uint8Array(16));
    const kek = await deriveKEK(normalizeRecovery(recovery), recSalt);
    meta.recSalt = b64(recSalt);
    meta.wrapRec = await aesEncrypt(kek, DEKRAW);
    localStorage.setItem(CRYPTO_KEY, JSON.stringify(meta));
    return recovery;
  }

  async function persistEntries() {
    if (!DEK) return;
    const bytes = _enc.encode(JSON.stringify(memEntries));
    const obj = await aesEncrypt(DEK, bytes);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(obj));
  }
  async function loadEntries() {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) { memEntries = {}; return; }
    try {
      const bytes = await aesDecrypt(DEK, JSON.parse(raw));
      memEntries = JSON.parse(_dec.decode(bytes)) || {};
    } catch { memEntries = {}; }
  }

  /* ---------------- Language ---------------- */

  let LANG = (Store.settings().lang === "en" || Store.settings().lang === "fr") ? Store.settings().lang : "fr";
  const L = () => DICT[LANG];
  const t = (key, ...args) => {
    const v = L().ui[key];
    return typeof v === "function" ? v(...args) : v;
  };
  const tA = (key, ...args) => {
    const v = L().auth[key];
    return typeof v === "function" ? v(...args) : v;
  };
  function setLang(lang) {
    LANG = lang;
    const s = Store.settings(); s.lang = lang; Store.saveSettings(s);
    document.documentElement.lang = lang;
  }
  document.documentElement.lang = LANG;

  /* ---------------- Date helpers ---------------- */

  const pad = (n) => String(n).padStart(2, "0");
  const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => new Date();
  const todayKey = () => keyOf(today());
  const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };

  function prettyDate(d) {
    return `${L().dow[d.getDay()]} ${d.getDate()} ${L().months[d.getMonth()]}`;
  }
  function greeting() {
    const h = new Date().getHours();
    const g = L().greeting;
    if (h < 5) return g.night;
    if (h < 12) return g.morning;
    if (h < 17) return g.afternoon;
    return g.evening;
  }

  /* ---------------- Scoring ---------------- */

  function scoreFromRatings(ratings) {
    const mean = ratings.reduce((a, b) => a + b, 0) / ratings.length; // 1..5
    return +(((mean - 1) / 4) * 9 + 1).toFixed(1); // 1..10
  }

  function categoryScores(ratings) {
    const qs = L().questions;
    const out = {};
    for (const cat of CAT_KEYS) {
      const idx = qs.map((q, i) => (q.cat === cat ? i : -1)).filter((i) => i >= 0);
      const vals = idx.map((i) => ratings[i]);
      out[cat] = vals.reduce((a, b) => a + b, 0) / vals.length;
    }
    return out;
  }

  const scoreColor = (s) => {
    const tt = Math.max(0, Math.min(1, (s - 1) / 9));
    const stops = [[0.0, [251, 113, 133]], [0.5, [251, 191, 36]], [1.0, [52, 211, 153]]];
    let a = stops[0], b = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (tt >= stops[i][0] && tt <= stops[i + 1][0]) { a = stops[i]; b = stops[i + 1]; break; }
    }
    const lt = (tt - a[0]) / (b[0] - a[0] || 1);
    const c = a[1].map((v, i) => Math.round(v + (b[1][i] - v) * lt));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };

  function scoreBand(s) {
    return L().bands.find((b) => s >= b.min) || L().bands[L().bands.length - 1];
  }

  const catLabel = (k) => L().categories[k];

  /* ---------------- App state ---------------- */

  const state = {
    tab: "today",
    calMonth: new Date(today().getFullYear(), today().getMonth(), 1),
    flow: null,
    viewDate: null,
  };

  const app = document.getElementById("app");

  /* ===========================================================
     RENDERING
     =========================================================== */

  function render() {
    if (state.flow) { renderFlow(); attachNav(false); return; }
    let body = "";
    if (state.viewDate) body = renderDayDetail(state.viewDate);
    else if (state.tab === "today") body = renderToday();
    else if (state.tab === "calendar") body = renderCalendar();
    else if (state.tab === "insights") body = renderInsights();
    app.innerHTML = `<div class="fade-in">${body}</div>`;
    renderNav();
    bindBody();
  }

  function ring(score, size = 92, stroke = 9) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const filled = score == null ? 0 : (score / 10) * c;
    const col = score == null ? "#3a3f63" : scoreColor(score);
    return `
      <div class="ring-wrap" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="${stroke}"/>
          <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${stroke}"
            stroke-linecap="round" stroke-dasharray="${filled} ${c}"
            transform="rotate(-90 ${size/2} ${size/2})" style="transition:stroke-dasharray .7s cubic-bezier(.2,.8,.2,1)"/>
        </svg>
        <div class="ring-label">
          <span class="score-num" style="color:${col}">${score == null ? "—" : score}</span>
          <span class="score-den">/ 10</span>
        </div>
      </div>`;
  }

  /* ----- TODAY ----- */
  function renderToday() {
    const tk = todayKey();
    const entry = Store.get(tk);
    const name = Store.settings().name;
    const header = `
      <div class="app-header">
        <div>
          <div class="eyebrow">${prettyDate(today())}</div>
          <div class="h1">${greeting()}${name ? ", " + escapeHtml(name) : ""}</div>
        </div>
      </div>`;

    if (!entry) {
      const streak = currentStreak();
      return header + `
        <div class="card hero">
          ${ring(null)}
          <div class="hero-text">
            <h3>${t("ready_title")}</h3>
            <p>${t("ready_sub")}</p>
          </div>
        </div>
        <div class="card prompt-card">
          <div class="emoji">🌙</div>
          <h3>${t("reflection_title")}</h3>
          <p>${t("reflection_body")}</p>
          <button class="btn" data-action="start-checkin">${t("start_today")}</button>
          ${streak > 0 ? `<p style="margin-top:14px" class="faint">${t("streak_keep", streak)}</p>` : ""}
        </div>
        ${recentStrip()}
      `;
    }

    const cats = categoryScores(entry.ratings);
    const band = scoreBand(entry.score);
    return header + `
      <div class="card hero">
        ${ring(entry.score)}
        <div class="hero-text">
          <h3>${band.label}</h3>
          <p>${band.desc}</p>
        </div>
      </div>
      <div class="section-title"><span class="h2">${t("todays_balance")}</span></div>
      ${catGrid(cats)}
      <div class="btn-row" style="margin-top:16px">
        <button class="btn secondary" data-action="edit-today">${t("edit_answers")}</button>
        <button class="btn" data-action="go-insights">${t("view_insights")}</button>
      </div>
      ${recentStrip()}
    `;
  }

  function catGrid(cats) {
    return `<div class="cat-grid">` + CAT_KEYS.map((k) => {
      const meta = CAT_META[k];
      const v = cats[k];
      const pct = (v / 5) * 100;
      return `
        <div class="cat-tile">
          <div class="cat-top">
            <div class="cat-ico" style="background:${hexA(meta.color,0.16)};color:${meta.color}">${meta.icon}</div>
            <span class="cat-name">${catLabel(k)}</span>
          </div>
          <div class="cat-val" style="color:${meta.color}">${v.toFixed(1)}<small> / 5</small></div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${meta.color}"></div></div>
        </div>`;
    }).join("") + `</div>`;
  }

  function recentStrip() {
    const days = lastNDays(7).reverse();
    const items = days.map((d) => {
      const e = Store.get(keyOf(d));
      const col = e ? scoreColor(e.score) : "rgba(255,255,255,0.07)";
      const isToday = keyOf(d) === todayKey();
      return `
        <button data-action="view-day" data-date="${keyOf(d)}" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;${e ? "" : "pointer-events:none;opacity:.6"}">
          <span class="faint" style="font-size:11px;font-weight:700">${L().dow[d.getDay()][0]}</span>
          <span style="width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:${col};color:${e ? "#0b0e1f" : "var(--text-faint)"};font-weight:800;font-size:12px;${isToday && !e ? "border:1.5px solid var(--brand)" : ""}">${e ? Math.round(e.score) : ""}</span>
        </button>`;
    }).join("");
    return `
      <div class="section-title"><span class="h2">${t("last_7")}</span></div>
      <div class="card" style="display:flex;gap:6px;padding:16px 14px">${items}</div>`;
  }

  /* ----- DAY DETAIL ----- */
  function renderDayDetail(dateKey) {
    const d = parseKey(dateKey);
    const entry = Store.get(dateKey);
    const back = `<button class="btn ghost" data-action="back" style="margin-bottom:6px">${t("back")}</button>`;
    if (!entry) {
      const isFuture = d > today();
      return back + `
        <div class="card prompt-card">
          <div class="emoji">${isFuture ? "📅" : "✍️"}</div>
          <h3>${prettyDate(d)}</h3>
          <p>${isFuture ? t("future_day") : t("no_checkin")}</p>
          ${isFuture ? "" : `<button class="btn" data-action="start-checkin" data-date="${dateKey}">${t("add_day")}</button>`}
        </div>`;
    }
    const cats = categoryScores(entry.ratings);
    const band = scoreBand(entry.score);
    const qs = L().questions;
    const answers = qs.map((q, i) => {
      const r = entry.ratings[i];
      const dots = Array.from({ length: 5 }, (_, k) =>
        `<span class="dot" style="${k < r ? `background:${scoreColor(((r-1)/4)*9+1)}` : ""}"></span>`).join("");
      const txt = (entry.answers[i] || "").trim();
      return `
        <div class="answer-item">
          <div class="ai-q">${q.icon} ${escapeHtml(q.q)} <span class="ai-dots">${dots}</span></div>
          <div class="${txt ? "ai-text" : "ai-empty"}">${txt ? escapeHtml(txt) : t("no_note")}</div>
        </div>`;
    }).join("");

    return back + `
      <div class="app-header"><div><div class="eyebrow">${prettyDate(d)}</div><div class="h1">${band.label}</div></div></div>
      <div class="card hero">${ring(entry.score)}<div class="hero-text"><h3>${t("score_word")} ${entry.score}/10</h3><p>${band.desc}</p></div></div>
      <div class="section-title"><span class="h2">${t("balance")}</span></div>
      ${catGrid(cats)}
      <div class="section-title"><span class="h2">${t("reflections")}</span></div>
      <div class="card">${answers}</div>
      <div class="btn-row" style="margin-top:16px">
        <button class="btn secondary" data-action="start-checkin" data-date="${dateKey}">${t("edit_day")}</button>
      </div>`;
  }

  /* ----- CALENDAR (week starts Monday) ----- */
  function renderCalendar() {
    const m = state.calMonth;
    const year = m.getFullYear(), month = m.getMonth();
    const first = new Date(year, month, 1);
    const startDow = (first.getDay() + 6) % 7; // 0 = Monday
    const daysIn = new Date(year, month + 1, 0).getDate();
    const tk = todayKey();
    const now = today();

    // Monday-first weekday headers
    const order = [1, 2, 3, 4, 5, 6, 0];
    const dowHeader = order.map((i) => `<span>${L().dow[i][0]}</span>`).join("");

    let cells = "";
    for (let i = 0; i < startDow; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let day = 1; day <= daysIn; day++) {
      const d = new Date(year, month, day);
      const k = keyOf(d);
      const e = Store.get(k);
      const isFuture = d > now && k !== tk;
      const cls = ["cal-cell"];
      if (k === tk) cls.push("today");
      if (e) cls.push("has-entry");
      if (isFuture) cls.push("future");
      const bg = e ? `background:${scoreColor(e.score)}` : "";
      cells += `
        <button class="${cls.join(" ")}" style="${bg}" data-action="view-day" data-date="${k}">
          <span>${day}</span>
          ${e ? `<span class="mini-score">${e.score}</span>` : ""}
        </button>`;
    }

    const monthEntries = entriesInMonth(year, month);
    const avg = monthEntries.length
      ? (monthEntries.reduce((a, e) => a + e.score, 0) / monthEntries.length).toFixed(1)
      : "—";

    return `
      <div class="app-header"><div><div class="eyebrow">${t("cal_eyebrow")}</div><div class="h1">${t("cal_title")}</div></div></div>
      <div class="card">
        <div class="cal-head">
          <div class="cal-title">${L().months[month]} ${year}</div>
          <div class="cal-nav">
            <button data-action="cal-prev">‹</button>
            <button data-action="cal-today">•</button>
            <button data-action="cal-next">›</button>
          </div>
        </div>
        <div class="cal-dow">${dowHeader}</div>
        <div class="cal-grid">${cells}</div>
        <div class="cal-legend"><span>${t("low")}</span><span class="legend-bar"></span><span>${t("high")}</span></div>
      </div>
      <div class="stat-row" style="margin-top:16px">
        <div class="stat"><div class="stat-val">${monthEntries.length}<small> ${t("days_unit", monthEntries.length)}</small></div><div class="stat-lbl">${t("checked_month")}</div></div>
        <div class="stat"><div class="stat-val" style="color:${avg === "—" ? "var(--text)" : scoreColor(+avg)}">${avg}${avg === "—" ? "" : "<small> /10</small>"}</div><div class="stat-lbl">${t("monthly_avg")}</div></div>
      </div>`;
  }

  /* ----- INSIGHTS ----- */
  function renderInsights() {
    const all = allEntries();
    const header = `<div class="app-header"><div><div class="eyebrow">${t("ins_eyebrow")}</div><div class="h1">${t("ins_title")}</div></div></div>`;

    if (all.length === 0) {
      return header + `
        <div class="card insight-empty">
          <div class="emoji">📈</div>
          <p>${t("ins_empty")}</p>
          <button class="btn" style="margin-top:16px" data-action="start-checkin">${t("start_first")}</button>
        </div>`;
    }

    const last30 = lastNDays(30).map((d) => Store.get(keyOf(d))).filter(Boolean);
    const avg30 = last30.length ? last30.reduce((a, e) => a + e.score, 0) / last30.length : null;
    const streak = currentStreak();

    const catAgg = {};
    for (const k of CAT_KEYS) catAgg[k] = [];
    for (const e of last30) {
      const cs = categoryScores(e.ratings);
      for (const k of CAT_KEYS) catAgg[k].push(cs[k]);
    }
    const catAvg = {};
    for (const k of CAT_KEYS)
      catAvg[k] = catAgg[k].length ? catAgg[k].reduce((a, b) => a + b, 0) / catAgg[k].length : 0;

    const lowest = [...CAT_KEYS].sort((a, b) => catAvg[a] - catAvg[b])[0];
    const highest = [...CAT_KEYS].sort((a, b) => catAvg[b] - catAvg[a])[0];

    return header + `
      <div class="stat-row">
        <div class="stat">
          <div class="stat-val" style="color:${avg30 ? scoreColor(avg30) : "var(--text)"}">${avg30 ? avg30.toFixed(1) : "—"}<small> /10</small></div>
          <div class="stat-lbl">${t("avg_30")}</div>
          <div class="stat-sub" style="color:${avg30 ? scoreColor(avg30) : "var(--text-faint)"}">${avg30 ? scoreBand(avg30).label : ""}</div>
        </div>
        <div class="stat">
          <div class="stat-val">🔥 ${streak}</div>
          <div class="stat-lbl">${t("day_streak")}</div>
          <div class="stat-sub faint">${t("total_checkins", all.length)}</div>
        </div>
      </div>

      <div class="card">
        <div class="row-between" style="margin-bottom:6px"><span class="h2">${t("score_trend")}</span><span class="faint" style="font-size:12px">${t("last_30")}</span></div>
        ${sparkline(lastNDays(30))}
      </div>

      <div class="section-title"><span class="h2">${t("month_weekly")}</span></div>
      <div class="card">${weeklyBars()}</div>

      <div class="section-title"><span class="h2">${t("energy")}</span></div>
      <div class="card">${catAvgBars(catAvg)}</div>

      <div class="section-title"><span class="h2">${t("recommendations")}</span></div>
      <div class="card">${recommendations(catAvg, lowest, highest, avg30, streak)}</div>
    `;
  }

  function sparkline(days) {
    const pts = days.map((d) => { const e = Store.get(keyOf(d)); return e ? e.score : null; });
    const W = 440, H = 130, padX = 8, padY = 14;
    const n = pts.length;
    const x = (i) => padX + (i / (n - 1)) * (W - padX * 2);
    const y = (v) => padY + (1 - (v - 1) / 9) * (H - padY * 2);
    let path = "", area = "", dots = "", started = false, lastX = padX;
    pts.forEach((v, i) => {
      if (v == null) return;
      const px = x(i), py = y(v);
      if (!started) { path += `M ${px} ${py}`; area += `M ${px} ${H - padY} L ${px} ${py}`; started = true; }
      else { path += ` L ${px} ${py}`; area += ` L ${px} ${py}`; }
      lastX = px;
      dots += `<circle cx="${px}" cy="${py}" r="2.4" fill="${scoreColor(v)}"/>`;
    });
    if (started) area += ` L ${lastX} ${H - padY} Z`;
    const gridY = [1, 5.5, 10].map((v) => `<line x1="${padX}" y1="${y(v)}" x2="${W-padX}" y2="${y(v)}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`).join("");
    if (!started) return `<div class="faint" style="text-align:center;padding:30px 0">${t("not_enough")}</div>`;
    return `
      <svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(139,124,255,0.35)"/><stop offset="100%" stop-color="rgba(139,124,255,0)"/>
        </linearGradient></defs>
        ${gridY}
        <path d="${area}" fill="url(#sg)"/>
        <path d="${path}" fill="none" stroke="#8b7cff" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        ${dots}
      </svg>`;
  }

  function weeklyBars() {
    const m = today();
    const year = m.getFullYear(), month = m.getMonth();
    const daysIn = new Date(year, month + 1, 0).getDate();
    const weeks = [[], [], [], [], []];
    for (let day = 1; day <= daysIn; day++) {
      const e = Store.get(keyOf(new Date(year, month, day)));
      const wi = Math.min(4, Math.floor((day - 1) / 7));
      if (e) weeks[wi].push(e.score);
    }
    const rows = weeks.map((w, i) => {
      if (i === 4 && w.length === 0) return "";
      const avg = w.length ? w.reduce((a, b) => a + b, 0) / w.length : null;
      const pct = avg ? (avg / 10) * 100 : 0;
      return `
        <div class="week-row">
          <span class="wk-name">${t("week", i + 1)}</span>
          <span class="wk-track"><span class="wk-fill" style="width:${pct}%;background:${avg ? scoreColor(avg) : "transparent"}"></span></span>
          <span class="wk-val" style="color:${avg ? scoreColor(avg) : "var(--text-faint)"}">${avg ? avg.toFixed(1) : "—"}</span>
        </div>`;
    }).join("");
    const monthEntries = entriesInMonth(year, month);
    const mAvg = monthEntries.length ? (monthEntries.reduce((a, e) => a + e.score, 0) / monthEntries.length) : null;
    return rows + (mAvg ? `
      <div class="week-row" style="border-top:1px solid var(--card-border);border-bottom:none;margin-top:4px;padding-top:14px">
        <span class="wk-name" style="font-weight:800;color:var(--text)">${t("average")}</span>
        <span class="wk-track"><span class="wk-fill" style="width:${(mAvg/10)*100}%;background:${scoreColor(mAvg)}"></span></span>
        <span class="wk-val" style="color:${scoreColor(mAvg)}">${mAvg.toFixed(1)}</span>
      </div>` : "");
  }

  function catAvgBars(catAvg) {
    return CAT_KEYS.map((k) => {
      const meta = CAT_META[k];
      const v = catAvg[k];
      return `
        <div class="week-row">
          <span class="wk-name" style="display:flex;align-items:center;gap:6px;width:120px;color:var(--text)">${meta.icon} ${catLabel(k)}</span>
          <span class="wk-track"><span class="wk-fill" style="width:${(v/5)*100}%;background:${meta.color}"></span></span>
          <span class="wk-val" style="color:${meta.color}">${v.toFixed(1)}</span>
        </div>`;
    }).join("");
  }

  /* ----- Recommendations engine -----
     Recommendations adapt as history grows: a progression card compares the last
     30 days against the previous 30, the focus tip is chosen by that category's
     trend, and a lifetime card surfaces stats that get richer over time. */
  function recommendations(catAvg, lowest, highest, avg30, streak) {
    const recos = [];
    const loMeta = CAT_META[lowest], hiMeta = CAT_META[highest];

    // Compare recent (last 30 days) vs previous (days 31–60) for true progression.
    const prev = entriesInWindow(60, 31);
    const prevAvg = avgScore(prev);
    const prevCat = catAvgOf(prev);
    const catDelta = (k) => (prev.length ? catAvg[k] - prevCat[k] : null);

    // 1) Progression card — only meaningful once there's a prior period to compare.
    if (prevAvg != null && avg30 != null) {
      const d = +(avg30 - prevAvg).toFixed(1);
      let body = d > 0.1 ? t("prog_up", Math.abs(d).toFixed(1))
               : d < -0.1 ? t("prog_down", Math.abs(d).toFixed(1))
               : t("prog_flat");
      // Most improved / most declined category over the same windows.
      const deltas = CAT_KEYS.map((k) => ({ k, d: catAvg[k] - prevCat[k] }));
      const up = deltas.slice().sort((a, b) => b.d - a.d)[0];
      const down = deltas.slice().sort((a, b) => a.d - b.d)[0];
      if (up && up.d > 0.1) body += t("prog_improved", catLabel(up.k), up.d.toFixed(1));
      if (down && down.d < -0.1 && down.k !== up.k) body += t("prog_declined", catLabel(down.k), Math.abs(down.d).toFixed(1));
      recos.push({ icon: d >= 0 ? "📈" : "📉", color: d >= 0 ? "#34d399" : "#fb7185", title: t("prog_title"), body });
    } else {
      recos.push({ icon: "📈", color: "#8b7cff", title: t("prog_title"), body: t("prog_need_more") });
    }

    // 2) Focus area — tip chosen by whether that area is trending up, flat, or down.
    recos.push({
      icon: loMeta.icon, color: loMeta.color,
      title: t("focus", catLabel(lowest), catAvg[lowest].toFixed(1)),
      body: pickTip(lowest, catDelta(lowest)),
    });

    // 3) Strength
    recos.push({
      icon: hiMeta.icon, color: hiMeta.color,
      title: t("strength", catLabel(highest), catAvg[highest].toFixed(1)),
      body: t("strength_body", catLabel(lowest).toLowerCase()),
    });

    // 4) Band message on the 30-day average
    if (avg30 != null) {
      const band = scoreBand(avg30);
      const body = avg30 >= 7 ? t("band_high") : avg30 >= 5 ? t("band_mid") : t("band_low");
      recos.push({ icon: "🧭", color: "#8b7cff", title: t("band30", avg30.toFixed(1), band.label), body });
    }

    // 5) Lifetime card — grows richer the longer you keep at it.
    const all = allEntries();
    const life = allTimeAvg();
    if (life != null) {
      const best = personalBest();
      const longest = longestStreak();
      let body = t("life_body", all.length, life.toFixed(1));
      if (best) body += t("life_best", best.score, prettyDate(parseKey(best.date)));
      if (longest >= 2) body += t("life_longest", longest);
      recos.push({ icon: "🏅", color: "#fbbf24", title: t("life_title"), body });
    }

    // 6) Streak nudge
    recos.push({
      icon: "🔥", color: "#fbbf24",
      title: streak >= 3 ? t("streak_title_on", streak) : t("streak_title_off"),
      body: streak >= 3 ? t("streak_body_on") : t("streak_body_off"),
    });

    return recos.map((r) => `
      <div class="reco">
        <div class="reco-ico" style="background:${hexA(r.color,0.16)};color:${r.color}">${r.icon}</div>
        <div class="reco-body"><h4>${escapeHtml(r.title)}</h4><p>${escapeHtml(r.body)}</p></div>
      </div>`).join("");
  }

  // Pick a tip for a category, steered by its recent trend (declining → most actionable).
  function pickTip(cat, delta) {
    const list = L().tips[cat];
    if (delta == null) return list[allEntries().length % list.length];
    if (delta < -0.15) return list[0];
    if (delta > 0.15) return list[2];
    return list[1];
  }

  /* ===========================================================
     CHECK-IN FLOW
     =========================================================== */

  function startCheckin(dateKey) {
    const key = dateKey || todayKey();
    const existing = Store.get(key);
    state.flow = {
      dateKey: key,
      step: 0,
      ratings: existing ? [...existing.ratings] : Array(8).fill(0),
      answers: existing ? [...existing.answers] : Array(8).fill(""),
    };
    state.viewDate = null;
    render();
  }

  function renderFlow() {
    const f = state.flow;
    const qs = L().questions;
    const totalSteps = qs.length;

    if (f.step >= totalSteps) { renderFinish(); return; }

    const q = qs[f.step];
    const meta = CAT_META[q.cat];
    const rating = f.ratings[f.step];
    const progress = (f.step / totalSteps) * 100;

    const scaleBtns = [1, 2, 3, 4, 5].map((n) => {
      const emojis = ["😞", "😕", "😐", "🙂", "😄"];
      const active = rating === n;
      return `<button data-rate="${n}" class="${active ? "active" : ""}" style="color:${active ? meta.color : "var(--card-border)"}">${emojis[n-1]}</button>`;
    }).join("");

    const label = rating ? q.labels[rating - 1] : t("tap_scale");

    app.innerHTML = `
      <div class="flow">
        <div class="flow-inner">
          <div class="flow-top">
            <button class="close" data-action="close-flow">✕</button>
            <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
            <div class="flow-step">${f.step + 1}/${totalSteps}</div>
          </div>
          <div class="flow-body fade-in" key="${f.step}">
            <div class="q-ico">${q.icon}</div>
            <span class="q-cat" style="background:${hexA(meta.color,0.16)};color:${meta.color}">${catLabel(q.cat)}</span>
            <div class="q-text">${escapeHtml(q.q)}</div>
            <div class="scale">${scaleBtns}</div>
            <div class="scale-label" style="color:${rating ? meta.color : "var(--text-faint)"}">${label}</div>
            <textarea data-answer placeholder="${escapeAttr(q.ph)}">${escapeHtml(f.answers[f.step])}</textarea>
          </div>
          <div class="flow-foot">
            ${f.step > 0 ? `<button class="btn secondary" data-action="flow-back">${t("back_btn")}</button>` : ""}
            <button class="btn" data-action="flow-next" ${rating ? "" : "disabled"}>${f.step === totalSteps - 1 ? t("finish") : t("next")}</button>
          </div>
        </div>
      </div>`;

    bindFlow();
  }

  function renderFinish() {
    const f = state.flow;
    const score = scoreFromRatings(f.ratings);
    const band = scoreBand(score);

    const entry = { date: f.dateKey, ratings: f.ratings, answers: f.answers, score, updatedAt: Date.now() };
    Store.set(f.dateKey, entry);

    app.innerHTML = `
      <div class="flow">
        <div class="flow-inner">
          <div class="finish">
            <div class="big-ring confetti">${ring(score, 150, 13)}</div>
            <h2>${band.label}</h2>
            <p>${band.desc}</p>
            <p class="faint" style="margin-top:14px">${t("saved", prettyDate(parseKey(f.dateKey)))}</p>
            <div style="height:24px"></div>
            <button class="btn" data-action="finish-done" style="max-width:320px">${t("see_insights")}</button>
            <button class="btn ghost" data-action="finish-home" style="margin-top:6px">${t("back_today")}</button>
          </div>
        </div>
      </div>`;

    app.querySelector('[data-action="finish-done"]').onclick = () => { state.flow = null; state.tab = "insights"; render(); };
    app.querySelector('[data-action="finish-home"]').onclick = () => { state.flow = null; state.tab = "today"; render(); };
  }

  function bindFlow() {
    const f = state.flow;
    app.querySelectorAll("[data-rate]").forEach((b) => {
      b.onclick = () => { f.ratings[f.step] = +b.dataset.rate; renderFlow(); };
    });
    const ta = app.querySelector("[data-answer]");
    if (ta) ta.oninput = () => { f.answers[f.step] = ta.value; };
    const next = app.querySelector('[data-action="flow-next"]');
    if (next) next.onclick = () => { syncAnswer(); f.step++; render(); };
    const back = app.querySelector('[data-action="flow-back"]');
    if (back) back.onclick = () => { syncAnswer(); f.step--; render(); };
    const close = app.querySelector('[data-action="close-flow"]');
    if (close) close.onclick = () => {
      syncAnswer();
      if (confirm(t("leave_confirm"))) { state.flow = null; render(); }
    };
  }
  function syncAnswer() {
    const ta = app.querySelector("[data-answer]");
    if (ta && state.flow) state.flow.answers[state.flow.step] = ta.value;
  }

  /* ===========================================================
     NAV + EVENT BINDING
     =========================================================== */

  function renderNav() {
    let nav = document.querySelector(".bottom-nav");
    if (!nav) { nav = document.createElement("nav"); nav.className = "bottom-nav"; document.body.appendChild(nav); }
    const item = (tab, ico, label) => `
      <button class="nav-item ${state.tab === tab && !state.viewDate ? "active" : ""}" data-tab="${tab}">
        <span class="nav-ico">${ico}</span><span>${label}</span>
      </button>`;
    nav.innerHTML = `
      <div class="nav-inner">
        ${item("today", "🏠", t("nav_today"))}
        ${item("calendar", "🗓", t("nav_calendar"))}
        <button class="nav-fab" data-action="start-checkin" aria-label="${t("new_checkin")}">＋</button>
        ${item("insights", "📈", t("nav_insights"))}
        <button class="nav-item" data-action="settings"><span class="nav-ico">⚙️</span><span>${t("nav_more")}</span></button>
      </div>`;
    nav.querySelectorAll("[data-tab]").forEach((b) => {
      b.onclick = () => { state.tab = b.dataset.tab; state.viewDate = null; render(); };
    });
    nav.querySelector('[data-action="start-checkin"]').onclick = () => startCheckin();
    nav.querySelector('[data-action="settings"]').onclick = openSettings;
  }

  function attachNav(show) {
    const nav = document.querySelector(".bottom-nav");
    if (nav) nav.style.display = show ? "" : "none";
  }

  function bindBody() {
    attachNav(true);
    app.querySelectorAll("[data-action]").forEach((el) => {
      const a = el.dataset.action;
      el.onclick = () => handleAction(a, el.dataset);
    });
  }

  function handleAction(a, data) {
    switch (a) {
      case "start-checkin": startCheckin(data.date); break;
      case "edit-today": startCheckin(todayKey()); break;
      case "view-day": state.viewDate = data.date; render(); break;
      case "back": state.viewDate = null; render(); break;
      case "go-insights": state.tab = "insights"; state.viewDate = null; render(); break;
      case "cal-prev": state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1); render(); break;
      case "cal-next": state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1); render(); break;
      case "cal-today": state.calMonth = new Date(today().getFullYear(), today().getMonth(), 1); render(); break;
      case "settings": openSettings(); break;
    }
  }

  /* ----- Settings sheet (name, language, export, reset) ----- */
  function openSettings() {
    const s = Store.settings();
    const count = allEntries().length;
    const overlay = document.createElement("div");
    overlay.className = "flow";
    overlay.style.zIndex = 70;
    const langBtn = (code, label) => `
      <button class="btn ${LANG === code ? "" : "secondary"}" data-lang="${code}" style="flex:1">${label}</button>`;
    overlay.innerHTML = `
      <div class="flow-inner">
        <div class="flow-top">
          <button class="close" data-x>✕</button>
          <div class="progress-track"><div class="progress-fill" style="width:100%"></div></div>
          <div class="flow-step">${t("nav_more")}</div>
        </div>
        <div class="flow-body" style="justify-content:flex-start;gap:14px;overflow-y:auto">
          <div class="h1" style="margin-bottom:4px">${t("settings_title")}</div>
          <div class="card">
            <label class="cat-name" style="display:block;margin-bottom:8px">${t("language")}</label>
            <div class="btn-row" style="margin-top:0">
              ${langBtn("fr", "Français")}
              ${langBtn("en", "English")}
            </div>
          </div>
          <div class="card">
            <label class="cat-name" style="display:block;margin-bottom:8px">${t("name_label")}</label>
            <textarea data-name style="min-height:48px" placeholder="${escapeAttr(t("name_ph"))}">${escapeHtml(s.name || "")}</textarea>
          </div>
          <div class="card">
            <div class="h2" style="margin-bottom:8px">${t("reminder_title")}</div>
            <p class="muted" style="font-size:14px">${t("reminder_body")}</p>
          </div>
          <div class="card">
            <div class="h2" style="margin-bottom:8px">${tA("security")}</div>
            <p class="muted" style="font-size:14px;margin-bottom:14px">${tA("security_body")}</p>
            <div class="btn-row">
              <button class="btn secondary" data-changepw>${tA("change_pw")}</button>
              <button class="btn secondary" data-newrec>${tA("new_recovery")}</button>
            </div>
          </div>
          <div class="card">
            <div class="h2" style="margin-bottom:8px">${t("your_data")}</div>
            <p class="muted" style="font-size:14px;margin-bottom:14px">${t("data_count", count)}</p>
            <div class="btn-row">
              <button class="btn secondary" data-export>${t("export")}</button>
              <button class="btn secondary" data-reset style="color:var(--score-low)">${t("reset")}</button>
            </div>
          </div>
          <div class="faint" style="text-align:center;font-size:13px;margin-top:auto">${t("footer")}</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    attachNav(false);
    const close = () => { overlay.remove(); attachNav(true); };
    const saveName = () => {
      const v = overlay.querySelector("[data-name]").value.trim();
      const cur = Store.settings(); cur.name = v; Store.saveSettings(cur);
    };
    overlay.querySelector("[data-x]").onclick = () => { saveName(); close(); render(); };
    overlay.querySelectorAll("[data-lang]").forEach((b) => {
      b.onclick = () => {
        saveName();
        setLang(b.dataset.lang);
        close(); render(); openSettings(); // reopen in the new language
      };
    });
    overlay.querySelector("[data-export]").onclick = () => exportData();
    overlay.querySelector("[data-changepw]").onclick = () => { saveName(); close(); renderSetNewPassword(); };
    overlay.querySelector("[data-newrec]").onclick = async () => {
      saveName();
      const code = await regenerateRecovery();
      close();
      if (code) renderRecoverySave(code, () => render());
    };
    overlay.querySelector("[data-reset]").onclick = () => {
      if (confirm(t("reset_confirm"))) {
        memEntries = {}; persistEntries();
        close(); state.tab = "today"; render(); toast(t("data_cleared"));
      }
    };
  }

  function exportData() {
    const data = { entries: Store.load(), settings: Store.settings(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `meltdown-export-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast(t("exported"));
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast"; el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  /* ===========================================================
     DATA QUERIES
     =========================================================== */

  function allEntries() {
    const d = Store.load();
    return Object.values(d).sort((a, b) => a.date.localeCompare(b.date));
  }
  function entriesInMonth(year, month) {
    return allEntries().filter((e) => {
      const dt = parseKey(e.date);
      return dt.getFullYear() === year && dt.getMonth() === month;
    });
  }
  function lastNDays(n) {
    const out = [];
    const base = today();
    for (let i = n - 1; i >= 0; i--) out.push(new Date(base.getFullYear(), base.getMonth(), base.getDate() - i));
    return out;
  }
  function currentStreak() {
    let streak = 0;
    const base = today();
    let start = 0;
    if (!Store.get(todayKey())) start = 1;
    for (let i = start; i < 400; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
      if (Store.get(keyOf(d))) streak++;
      else break;
    }
    return streak;
  }
  // Entries whose offset from today is within [endAgo .. startAgo] days (startAgo is older).
  function entriesInWindow(startAgo, endAgo) {
    const base = today(), out = [];
    for (let i = startAgo; i >= endAgo; i--) {
      const e = Store.get(keyOf(new Date(base.getFullYear(), base.getMonth(), base.getDate() - i)));
      if (e) out.push(e);
    }
    return out;
  }
  const avgScore = (arr) => (arr.length ? arr.reduce((a, e) => a + e.score, 0) / arr.length : null);
  function catAvgOf(arr) {
    const out = {};
    for (const k of CAT_KEYS) {
      const vals = arr.map((e) => categoryScores(e.ratings)[k]);
      out[k] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    }
    return out;
  }
  function longestStreak() {
    const all = allEntries();
    if (!all.length) return 0;
    let best = 1, cur = 1;
    for (let i = 1; i < all.length; i++) {
      const diff = Math.round((parseKey(all[i].date) - parseKey(all[i - 1].date)) / 86400000);
      if (diff === 1) { cur++; best = Math.max(best, cur); }
      else if (diff > 1) cur = 1;
    }
    return best;
  }
  function personalBest() {
    const all = allEntries();
    return all.length ? all.reduce((m, e) => (e.score > m.score ? e : m), all[0]) : null;
  }
  const allTimeAvg = () => avgScore(allEntries());

  /* ---------------- Utils ---------------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function hexA(hex, a) {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ===========================================================
     AUTH GATE — lock screen + first-run encryption setup
     =========================================================== */

  function hideNav() { const n = document.querySelector(".bottom-nav"); if (n) n.style.display = "none"; }
  function authShell(inner) {
    return `<div class="flow auth"><div class="flow-inner"><div class="auth-box fade-in">${inner}</div></div></div>`;
  }
  const pwInput = (attr, ph, auto) =>
    `<input class="auth-input" type="password" ${attr} placeholder="${escapeAttr(ph)}" autocomplete="${auto}" autocapitalize="off" />`;

  function renderGate() {
    hideNav();
    if (!SUBTLE) {
      app.innerHTML = authShell(`<div class="q-ico">🔒</div><div class="h1">Meltdown</div><p class="muted auth-sub">${tA("no_crypto")}</p>`);
      return;
    }
    if (cryptoConfigured()) renderLock(); else renderSetup();
  }

  function renderSetup() {
    hideNav();
    app.innerHTML = authShell(`
      <div class="q-ico">🔐</div>
      <div class="h1">${tA("setup_title")}</div>
      <p class="muted auth-sub">${tA("setup_sub")}</p>
      ${pwInput("data-pw", tA("pw_ph"), "new-password")}
      ${pwInput("data-pw2", tA("pw_confirm"), "new-password")}
      <div class="auth-err" data-err></div>
      <button class="btn" data-go>${tA("create")}</button>`);
    const pw = app.querySelector("[data-pw]"), pw2 = app.querySelector("[data-pw2]");
    const err = app.querySelector("[data-err]"), go = app.querySelector("[data-go]");
    const submit = async () => {
      if (pw.value.length < 6) { err.textContent = tA("pw_short"); return; }
      if (pw.value !== pw2.value) { err.textContent = tA("pw_mismatch"); return; }
      err.textContent = ""; go.disabled = true; go.textContent = tA("working");
      const recovery = await setupPassword(pw.value);
      renderRecoverySave(recovery, () => render());
    };
    go.onclick = submit;
    pw2.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    setTimeout(() => pw.focus(), 50);
  }

  function renderRecoverySave(recovery, onDone) {
    hideNav();
    app.innerHTML = authShell(`
      <div class="q-ico">🗝️</div>
      <div class="h1">${tA("recovery_save_title")}</div>
      <p class="muted auth-sub">${tA("recovery_save_sub")}</p>
      <div class="recovery-code">${escapeHtml(recovery)}</div>
      <button class="btn secondary" data-copy>${tA("copy")}</button>
      <button class="btn" data-done>${tA("saved_continue")}</button>`);
    app.querySelector("[data-copy]").onclick = async () => {
      try { await navigator.clipboard.writeText(recovery); toast(tA("copied")); } catch { /* clipboard blocked */ }
    };
    app.querySelector("[data-done]").onclick = onDone;
  }

  function renderLock() {
    hideNav();
    app.innerHTML = authShell(`
      <div class="q-ico">🔒</div>
      <div class="h1">Meltdown</div>
      <p class="muted auth-sub">${tA("unlock_sub")}</p>
      ${pwInput("data-pw", tA("pw"), "current-password")}
      <div class="auth-err" data-err></div>
      <button class="btn" data-go>${tA("unlock")}</button>
      <button class="btn ghost" data-forgot>${tA("forgot")}</button>`);
    const pw = app.querySelector("[data-pw]"), err = app.querySelector("[data-err]"), go = app.querySelector("[data-go]");
    const submit = async () => {
      err.textContent = ""; go.disabled = true; go.textContent = tA("working");
      if (await unlockWithPassword(pw.value)) { render(); }
      else { err.textContent = tA("wrong_pw"); go.disabled = false; go.textContent = tA("unlock"); pw.select(); }
    };
    go.onclick = submit;
    pw.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    app.querySelector("[data-forgot]").onclick = () => renderRecovery();
    setTimeout(() => pw.focus(), 50);
  }

  function renderRecovery() {
    hideNav();
    app.innerHTML = authShell(`
      <div class="q-ico">🗝️</div>
      <div class="h1">${tA("recovery_title")}</div>
      <p class="muted auth-sub">${tA("recovery_sub")}</p>
      <input class="auth-input" type="text" data-rec placeholder="${escapeAttr(tA("recovery_ph"))}" autocomplete="off" autocapitalize="characters" spellcheck="false" />
      <div class="auth-err" data-err></div>
      <button class="btn" data-go>${tA("recovery_btn")}</button>
      <button class="btn ghost" data-back>${tA("back_to_unlock")}</button>`);
    const rec = app.querySelector("[data-rec]"), err = app.querySelector("[data-err]"), go = app.querySelector("[data-go]");
    const submit = async () => {
      err.textContent = ""; go.disabled = true; go.textContent = tA("working");
      if (await unlockWithRecovery(rec.value)) { renderSetNewPassword(); }
      else { err.textContent = tA("recovery_bad"); go.disabled = false; go.textContent = tA("recovery_btn"); }
    };
    go.onclick = submit;
    app.querySelector("[data-back]").onclick = () => renderLock();
  }

  function renderSetNewPassword() {
    hideNav();
    app.innerHTML = authShell(`
      <div class="q-ico">🔐</div>
      <div class="h1">${tA("set_new_pw_title")}</div>
      <p class="muted auth-sub">${tA("set_new_pw_sub")}</p>
      ${pwInput("data-pw", tA("pw_ph"), "new-password")}
      ${pwInput("data-pw2", tA("pw_confirm"), "new-password")}
      <div class="auth-err" data-err></div>
      <button class="btn" data-go>${tA("change_pw")}</button>`);
    const pw = app.querySelector("[data-pw]"), pw2 = app.querySelector("[data-pw2]");
    const err = app.querySelector("[data-err]"), go = app.querySelector("[data-go]");
    go.onclick = async () => {
      if (pw.value.length < 6) { err.textContent = tA("pw_short"); return; }
      if (pw.value !== pw2.value) { err.textContent = tA("pw_mismatch"); return; }
      err.textContent = ""; go.disabled = true; go.textContent = tA("working");
      await changePassword(pw.value);
      toast(tA("pw_changed")); render();
    };
    setTimeout(() => pw.focus(), 50);
  }

  /* ---------------- PWA service worker ---------------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  /* ---------------- Go ---------------- */
  document.documentElement.lang = LANG;
  renderGate();
})();
