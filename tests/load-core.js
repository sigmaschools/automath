// Loads the practice rules (the <script id="automath-core"> and
// <script id="automath-facts"> blocks of index.html) into Node, with no
// browser. Nothing else in the page runs.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function block(html, id, file) {
    const match = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`));
    if (!match) throw new Error(`no ${id} script block in ${file}`);
    return match[1];
}

function loadAll(file = 'index.html') {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const context = { Math, Set, Map, Date, Number, String, Object };
    vm.createContext(context);
    vm.runInContext(`${block(html, 'automath-core', file)}\n${block(html, 'automath-facts', file)}\n`
        + 'this.AutomathCore = AutomathCore; this.AutomathFacts = AutomathFacts;', context);
    return { core: context.AutomathCore, facts: context.AutomathFacts };
}

function loadCore(file = 'index.html') {
    return loadAll(file).core;
}

function loadFacts(file = 'index.html') {
    return loadAll(file).facts;
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

module.exports = { loadCore, loadFacts, seeded, ROOT };
