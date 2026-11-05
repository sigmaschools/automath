// Plays simulated learners through months of daily warm-ups with the real
// fact record (Decision 19): which facts each day asks, how the record
// changes, when each operation graduates, and how check-ins go. Run
// `node tests/simulate-days.js` before changing a rule in AutomathFacts
// (intervals, the graduation bar, the session mix) and compare.
//
// The learner model is deliberately simple. Each fact has an automaticity
// `m` (0 to 1) and a memory stability `S` in days. Recall after `t` days is
// m · e^(−t/S); the higher it is, the more likely a correct answer and a fast
// one. Practice raises `m`; a fast, correct answer after a gap of a day or
// more roughly doubles `S` (the spacing effect); a miss shrinks it. It is a
// way to compare rule changes, not a prediction of real learners.
const { loadFacts, seeded } = require('./load-core');

const F = loadFacts();
const DAYS = Number(process.argv.find(a => /^\d+$/.test(a))) || 180;
const START = 20400;

const LEARNERS = [
    { name: 'knows almost all facts', known: 0.95, learn: 0.25 },
    { name: 'knows the easy half', known: 0.5, learn: 0.2 },
    { name: 'weak on 8s and 9s', known: 0.85, learn: 0.2, weak: f => /(^|[^0-9])[89]([^0-9]|$)/.test(`${f.num1} ${f.num2} ${f.answer}`) && f.operator === '×' },
    { name: 'knows few, learns slowly', known: 0.15, learn: 0.12 }
];

function makeMemory(learner, rand) {
    const mem = {};
    F.OPS.forEach(op => {
        mem[op] = F.TABLE[op].map(f => {
            // Lower tiers are more likely already known.
            const pKnown = Math.min(1, learner.known * (1.25 - 0.15 * f.tier));
            const known = !(learner.weak && learner.weak(f)) && rand() < pKnown;
            return { m: known ? 1 : 0.15, S: known ? 90 : 2, last: START - (known ? 3 : 30) };
        });
    });
    return mem;
}

function answer(fm, day, learner, rand) {
    const r = fm.m * Math.exp(-(day - fm.last) / fm.S);
    const correct = rand() < 0.35 + 0.65 * Math.min(1, r + 0.25);
    const fast = correct && rand() < r;
    const gap = day - fm.last;
    if (correct && fast) {
        fm.m = Math.min(1, fm.m + 0.1);
        if (gap >= 1) fm.S = Math.min(400, fm.S * 2);
    } else if (correct) {
        fm.m = Math.min(1, fm.m + learner.learn);
        if (gap >= 1) fm.S = Math.min(400, fm.S * 1.3);
    } else {
        fm.m = Math.min(1, fm.m + learner.learn * 0.6);
        fm.S = Math.max(1, fm.S * 0.7);
    }
    fm.last = day;
    // Typing a basic fact takes about 1.5 s on top of recall.
    return { correct, ms: fast ? 1500 + rand() * 1200 : 3500 + rand() * 4000 };
}

const rand = seeded(7);
const rows = [];
for (const learner of LEARNERS) {
    const mem = makeMemory(learner, rand);
    const rec = F.create(START);
    const graduatedOn = {};
    let asked = 0, right = 0, fast = 0, checkins = 0, backs = 0, restDays = 0, warmupDays = 0;
    let first30 = { asked: 0, right: 0 };
    for (let day = START; day < START + DAYS; day++) {
        let any = false;
        for (const op of F.OPS) {
            const kind = F.todayKind(rec, op, day);
            if (kind === 'rest') continue;
            any = true;
            const plan = kind === 'checkin' ? F.planCheckin(rec, op, day, rand) : F.planSession(rec, op, day, rand);
            const answers = plan.map(p => {
                const idx = F.TABLE[op].findIndex(f => f.key === p.key);
                const a = answer(mem[op][idx], day, learner, rand);
                F.recordAnswer(rec, op, p.key, a.correct, a.ms, day);
                asked++;
                if (a.correct) right++;
                const fl = F.isFluent(rec, a.correct, a.ms);
                if (fl) fast++;
                if (day < START + 30) {
                    first30.asked++;
                    if (a.correct) first30.right++;
                }
                return { key: p.key, fluent: fl };
            });
            const outcome = F.finishPart(rec, op, kind, answers, day);
            if (kind === 'checkin') checkins++;
            if (outcome === 'back') backs++;
            if (outcome === 'graduated' && graduatedOn[op] === undefined) graduatedOn[op] = day - START + 1;
        }
        if (any) warmupDays++; else restDays++;
    }
    const days = F.OPS.map(op => graduatedOn[op] === undefined ? '—' : graduatedOn[op]);
    rows.push({
        learner: learner.name,
        'graduated (day) + − × ÷': days.join(' '),
        'warm-up days': warmupDays,
        'days off': restDays,
        'right %': (100 * right / asked).toFixed(1),
        'right % first 30 d': (100 * first30.right / first30.asked).toFixed(1),
        'fluent %': (100 * fast / asked).toFixed(1),
        'check-ins': checkins,
        'sent back': backs,
        'record chars': F.encode(rec).length
    });
}
console.log(`${DAYS} days, every warm-up done; Compass skips operations that are resting`);
console.table(rows);
