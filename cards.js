/* Speech Cards — card content.
 *
 * TO EDIT: change a line below, then bump CACHE_VERSION in sw.js, commit and push.
 * That is a release. See README.md.
 *
 * Each page must have exactly 4 cards (2 x 2 grid).
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
        { icon: "👨‍⚕️", en: "Doctor",   ta: "டாக்டர்",      speak: "Please call the doctor" },
        { icon: "😵", en: "Dizzy",    ta: "தலைசுற்றல்",   speak: "I feel dizzy" }
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
      category: "people",
      cards: [
        { icon: "📞", en: "Call family",      ta: "குடும்பத்தை கூப்பிடு", speak: "Please call my family" },
        { icon: "👋", en: "Come here",        ta: "இங்கே வா",            speak: "Please come here" },
        { icon: "🙏", en: "Leave me alone",   ta: "தனியாக இரு",          speak: "I want to be alone" },
        { icon: "📱", en: "Phone",            ta: "போன்",                speak: "I want my phone" }
      ]
    },
    {
      category: "activity",
      cards: [
        { icon: "📺", en: "TV",          ta: "டிவி",          speak: "Please put the TV on" },
        { icon: "🎵", en: "Music",       ta: "பாட்டு",        speak: "I want to listen to music" },
        { icon: "🌳", en: "Go outside",  ta: "வெளியே",        speak: "I want to go outside" },
        { icon: "🛐", en: "Prayer",      ta: "பிரார்த்தனை",   speak: "I want to pray" }
      ]
    },
    {
      category: "feelings",
      cards: [
        { icon: "😊", en: "Happy",  ta: "சந்தோஷம்", speak: "I am happy" },
        { icon: "😢", en: "Sad",    ta: "கவலை",     speak: "I am sad" },
        { icon: "😴", en: "Tired",  ta: "சோர்வு",    speak: "I am tired" },
        { icon: "😨", en: "Scared", ta: "பயம்",      speak: "I am scared" }
      ]
    },
    {
      category: "misc",
      cards: [
        { icon: "☕", en: "Tea / Coffee", ta: "டீ / காபி",  speak: "I would like tea or coffee" },
        { icon: "👓", en: "Glasses",      ta: "கண்ணாடி",    speak: "I need my glasses" },
        { icon: "✋", en: "Wait",         ta: "பொறு",       speak: "Please wait" },
        { icon: "❤️", en: "Thank you",    ta: "நன்றி",       speak: "Thank you" }
      ]
    }
  ],
  yesNo: {
    yes: { icon: "✅", en: "Yes", ta: "ஆமாம்" },
    no:  { icon: "❌", en: "No",  ta: "இல்லை" }
  }
};
