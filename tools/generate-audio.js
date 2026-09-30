#!/usr/bin/env node
/* Generates the Tamil pronunciation clip for each card in cards.js.
 *
 * Run this after adding or editing cards, then commit the new files under audio/
 * along with your cards.js change and the CACHE_VERSION bump. See README.md.
 *
 * Requires macOS (uses the built-in `say` command and its Tamil voice, "Vani").
 * Skips a card if its audio file already exists — pass --force to regenerate all.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var execFileSync = require("child_process").execFileSync;

var ROOT = path.join(__dirname, "..");
var AUDIO_DIR = path.join(ROOT, "audio");
var FORCE = process.argv.indexOf("--force") !== -1;

function slug(en) {
  return String(en)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function loadCards() {
  var sandbox = {};
  sandbox.self = sandbox;
  var code = fs.readFileSync(path.join(ROOT, "cards.js"), "utf8");
  var vm = require("vm");
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "cards.js" });
  return sandbox.CARDS;
}

function checkTools() {
  try { execFileSync("say", ["-v", "?"]).toString(); }
  catch (e) {
    console.error("This needs macOS's `say` command, which is not available here.");
    console.error("Generate the clip elsewhere (any Tamil text-to-speech) and save it");
    console.error("as audio/<slug>.m4a — see README.md for the naming rule.");
    process.exit(1);
  }
  var voices = execFileSync("say", ["-v", "?"]).toString();
  if (!/\bta_IN\b/.test(voices)) {
    console.error("No Tamil voice is installed for `say` on this Mac.");
    console.error("System Settings -> Accessibility -> Spoken Content -> System voice -> ");
    console.error("Manage Voices... -> add a Tamil voice, then run this again.");
    process.exit(1);
  }
}

function generate(slugName, tamilText) {
  var target = path.join(AUDIO_DIR, slugName + ".m4a");
  if (fs.existsSync(target) && !FORCE) {
    console.log("  skip   " + slugName + ".m4a  (already exists)");
    return;
  }
  var tmp = path.join(require("os").tmpdir(), "speechcards-" + slugName + ".aiff");
  execFileSync("say", ["-v", "Vani", "-o", tmp, tamilText]);
  execFileSync("afconvert", ["-f", "mp4f", "-d", "aac", tmp, target]);
  fs.unlinkSync(tmp);
  console.log("  made   " + slugName + ".m4a  (\"" + tamilText + "\")");
}

function main() {
  checkTools();
  if (!fs.existsSync(AUDIO_DIR)) { fs.mkdirSync(AUDIO_DIR); }

  var data = loadCards();
  var seen = {};
  var count = 0;

  data.pages.forEach(function (page) {
    (page.cards || []).forEach(function (card) {
      var s = slug(card.en);
      if (seen[s]) {
        console.warn("  WARNING: two cards produce the same audio filename (" + s + ".m4a) " +
                     "— \"" + seen[s] + "\" and \"" + card.en + "\". Rename one.");
      }
      seen[s] = card.en;
      generate(s, card.ta);
      count++;
    });
  });

  console.log("\nDone. " + count + " card(s) checked.");
}

main();
