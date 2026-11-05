// Loads the practice rules (the <script id="automath-core"> block of
// index.html) into Node, with no browser. Nothing else in the page runs.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadCore(file = 'index.html') {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const match = html.match(/<script id="automath-core">([\s\S]*?)<\/script>/);
    if (!match) throw new Error(`no automath-core script block in ${file}`);
    const context = { Math, Set };
    vm.createContext(context);
    vm.runInContext(`${match[1]}\nthis.AutomathCore = AutomathCore;`, context);
    return context.AutomathCore;
}

// A small seeded random number generator, so a failing run can be replayed.
function seeded(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

module.exports = { loadCore, seeded, ROOT };
