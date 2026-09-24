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
        { icon: "💧", en: "Water",  ta: "தண்ணீர்",         speak: "I need water" },
        { icon: "🍚", en: "Food",   ta: "சாப்பாடு",        speak: "I am hungry" },
        { icon: "🚽", en: "Toilet", ta: "கழிவறை",         speak: "I need the toilet" },
        { icon: "🪑", en: "Sit up", ta: "எழுந்து உட்கார", speak: "Help me sit up" }
      ]
    },
    {
      category: "health",
      cards: [
        { icon: "🤕", en: "Pain",     ta: "வலி",        speak: "I have pain" },
        { icon: "🤚", en: "Itching",  ta: "அரிப்பு",     speak: "I have an itch" },
        { icon: "😵‍💫", en: "Dizzy",    ta: "தலைசுற்றல்",  speak: "I feel dizzy" },
        { icon: "😖", en: "Headache", ta: "தலைவலி",     speak: "I have a headache" }
      ]
    },
    {
      category: "misc",
      cards: [
        { icon: "🚿", en: "Bath",   ta: "குளியல்",       speak: "I want to take a bath" },
        { icon: "🍵", en: "Tea",    ta: "டீ",            speak: "I would like some tea" },
        { icon: "☕", en: "Coffee", ta: "காபி",          speak: "I would like some coffee" },
        { icon: "🛐", en: "Prayer", ta: "பிரார்த்தனை",   speak: "I want to pray" }
      ]
    },
    {
      category: "activity",
      cards: [
        { icon: "📺", en: "TV",    ta: "டிவி",   speak: "Please put the TV on" },
        { icon: "🎵", en: "Music", ta: "பாட்டு", speak: "I want to listen to music" }
      ]
    }
  ]
};
