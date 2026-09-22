/* Speech Cards — card content.
 *
 * TO EDIT: change a line below, then bump CACHE_VERSION in sw.js, commit and push.
 * That is a release. See README.md.
 *
 * A page holds 1 to 6 cards. Four is the usual 2 x 2 grid; fewer cards grow to
 * fill the page, and 5 or 6 switch to a 2 x 3 grid with slightly smaller icons.
 * Fields:  icon = emoji   en = English label   ta = Tamil help text
 *          speak = optional; what the phone says out loud (defaults to `en`)
 * category must be one of: needs health comfort people activity feelings misc
 */
window.CARDS = {
  pages: [
    {
      category: "needs",
      cards: [
        { icon: "💧", en: "Water",  ta: "தண்ணீர்",  speak: "I need water" },
        { icon: "🍚", en: "Food",   ta: "சாப்பாடு", speak: "I am hungry" },
        { icon: "🚽", en: "Toilet", ta: "கழிவறை",  speak: "I need the toilet" },
        { icon: "🛏️", en: "Sleep",  ta: "தூக்கம்",  speak: "I want to sleep" }
      ]
    },
    {
      category: "health",
      cards: [
        { icon: "🤕", en: "Pain",     ta: "வலி",         speak: "I have pain" },
        { icon: "💊", en: "Medicine", ta: "மருந்து",      speak: "I need my medicine" },
        { icon: "🤚", en: "Itching",  ta: "அரிப்பு",      speak: "I have an itch" },
        { icon: "😵‍💫", en: "Dizzy",    ta: "தலைசுற்றல்",   speak: "I feel dizzy" },
        { icon: "😖", en: "Headache", ta: "தலைவலி",      speak: "I have a headache" }
      ]
    },
    {
      category: "comfort",
      cards: [
        { icon: "🥵", en: "Hot",    ta: "சூடு",            speak: "I am too hot" },
        { icon: "🥶", en: "Cold",   ta: "குளிர்",           speak: "I am cold" },
        { icon: "🚿", en: "Bath",   ta: "குளியல்",          speak: "I want a bath" },
        { icon: "🪑", en: "Sit up", ta: "எழுந்து உட்கார",  speak: "Help me sit up" }
      ]
    },
    {
      category: "activity",
      cards: [
        { icon: "📺", en: "TV",          ta: "டிவி",     speak: "Please put the TV on" },
        { icon: "🎵", en: "Music",       ta: "பாட்டு",   speak: "I want to listen to music" },
        { icon: "🧘", en: "Exercise",    ta: "பயிற்சி",  speak: "I want to do my exercises" },
        { icon: "🌳", en: "Go outside",  ta: "வெளியே",   speak: "I want to go outside" }
      ]
    },
    {
      category: "misc",
      cards: [
        { icon: "🍵", en: "Tea",    ta: "டீ",            speak: "I would like some tea" },
        { icon: "☕", en: "Coffee", ta: "காபி",          speak: "I would like some coffee" },
        { icon: "🔌", en: "Charger", ta: "சார்ஜர்",       speak: "I need my charger" },
        { icon: "🛐", en: "Prayer", ta: "பிரார்த்தனை",   speak: "I want to pray" }
      ]
    },
    {
      category: "feelings",
      cards: [
        { icon: "😊", en: "Happy", ta: "சந்தோஷம்", speak: "I am happy" },
        { icon: "😴", en: "Tired", ta: "சோர்வு",    speak: "I am tired" }
      ]
    }
  ],
  yesNo: {
    yes: { icon: "✅", en: "Yes", ta: "ஆமாம்" },
    no:  { icon: "❌", en: "No",  ta: "இல்லை" }
  }
};
