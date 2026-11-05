// The fact record (Decision 19): run with `node --test tests/`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCore, loadFacts, seeded } = require('./load-core');

const core = loadCore();
const F = loadFacts();
const DAY = 20400;
const FAST = 1500;
const SLOW = 4500;

function factOf(rec, op, key) {
    return rec.facts[op][F.TABLE[op].findIndex(f => f.key === key)];
}

test('the fact table is every problem the levels can give, once, in a fixed order', () => {
    const sizes = Object.fromEntries(F.OPS.map(op => [op, F.TABLE[op].length]));
    // Changing these numbers changes the record format: bump FORMAT.
    assert.deepEqual(sizes, { addition: 100, subtraction: 145, multiplication: 90, division: 142 });
    for (const op of F.OPS) {
        const keys = new Set(F.TABLE[op].map(f => f.key));
        assert.equal(keys.size, F.TABLE[op].length);
        for (let level = 1; level <= 4; level++) {
            for (const p of core.problemsAt(op, level)) {
                assert.ok(keys.has(core.normalizeProblem(p.num1, p.num2, p.operator)), `${p.num1} ${p.operator} ${p.num2}`);
            }
        }
    }
});

test('a record survives the trip through Compass unchanged, and a damaged one is refused', () => {
    const rand = seeded(1);
    const rec = F.create(DAY);
    for (const op of F.OPS) {
        for (const f of F.TABLE[op]) {
            if (rand() < 0.5) F.recordAnswer(rec, op, f.key, rand() < 0.8, rand() < 0.5 ? FAST : SLOW, DAY + Math.floor(rand() * 40));
        }
    }
    rec.grad.multiplication = { step: 2, next: DAY + 77 };
    rec.typing = Math.round(rec.typing / 100) * 100; // kept to the nearest 0.1 s
    const text = F.encode(rec);
    assert.match(text, /^[A-Za-z0-9_~.,-]+$/, 'only characters that need no escaping in a URL');
    assert.ok(text.length < 2600, `record is ${text.length} characters`);
    const back = F.decode(text);
    assert.deepEqual(JSON.parse(JSON.stringify(back)), JSON.parse(JSON.stringify(rec)));
    assert.equal(F.decode(''), null);
    assert.equal(F.decode(null), null);
    assert.equal(F.decode('garbage'), null);
    assert.equal(F.decode(text.slice(0, -5)), null, 'a truncated record is refused');
    assert.equal(F.decode('9' + text.slice(1)), null, 'an unknown format is refused');
});

test('a fact moves Unseen → Learning → Fluent → Mastered, and a slip sends it back', () => {
    const rec = F.create(DAY);
    const op = 'multiplication';
    const key = core.normalizeProblem(8, 7, '×');
    const f = factOf(rec, op, key);
    F.recordAnswer(rec, op, key, false, FAST, DAY);
    assert.equal(f.s, F.LEARNING);
    F.recordAnswer(rec, op, key, true, FAST, DAY);
    assert.equal(f.s, F.LEARNING, 'one fast answer is not enough');
    F.recordAnswer(rec, op, key, true, SLOW, DAY);
    assert.equal(f.n, 0, 'a slow answer breaks the run');
    F.recordAnswer(rec, op, key, true, FAST, DAY);
    F.recordAnswer(rec, op, key, true, FAST, DAY);
    assert.equal(f.s, F.FLUENT);
    assert.equal(f.due, DAY + 1);
    F.recordAnswer(rec, op, key, true, FAST, DAY);
    assert.equal(f.d, 1, 'fast again the same day is not another day');
    F.recordAnswer(rec, op, key, true, FAST, DAY + 1);
    assert.equal(f.d, 2);
    assert.equal(f.s, F.FLUENT);
    F.recordAnswer(rec, op, key, true, FAST, f.due);
    assert.equal(f.s, F.MASTERED, 'fluent on 3 separate days');
    const gap = f.due - (DAY + 1 + 3);
    assert.ok(gap >= 7, `next review ${gap} days on`);
    F.recordAnswer(rec, op, key, true, SLOW, f.due);
    assert.equal(f.s, F.LEARNING, 'slow counts as a slip');
    assert.equal(f.x, 1);
});

test('fast and right on first sight counts as two days; one more later day masters it', () => {
    const rec = F.create(DAY);
    const key = core.normalizeProblem(6, 9, '×');
    const f = factOf(rec, 'multiplication', key);
    F.recordAnswer(rec, 'multiplication', key, true, FAST, DAY);
    assert.equal(f.s, F.FLUENT);
    assert.equal(f.due, DAY + 3);
    F.recordAnswer(rec, 'multiplication', key, true, FAST, DAY + 1);
    assert.equal(f.s, F.FLUENT, 'before its review date nothing changes');
    F.recordAnswer(rec, 'multiplication', key, true, FAST, DAY + 3);
    assert.equal(f.s, F.MASTERED);
});

test('a fact that slipped before comes back sooner', () => {
    const rec = F.create(DAY);
    const op = 'addition';
    const [a, b] = [F.TABLE[op][40], F.TABLE[op][41]];
    const fa = factOf(rec, op, a.key), fb = factOf(rec, op, b.key);
    fa.s = fb.s = F.MASTERED; fa.d = fb.d = 3; fa.i = fb.i = 2; fa.due = fb.due = DAY;
    fb.x = 1;
    F.recordAnswer(rec, op, a.key, true, FAST, DAY);
    F.recordAnswer(rec, op, b.key, true, FAST, DAY);
    assert.ok(fb.due - DAY < fa.due - DAY, `${fb.due - DAY} vs ${fa.due - DAY}`);
});

test('a slow typist is judged against their own typing speed, within limits', () => {
    const rec = F.create(DAY);
    assert.equal(F.fluentLimit(rec), 3000);
    const rule = F.TABLE.multiplication.filter(f => f.trivial);
    rule.forEach(f => F.recordAnswer(rec, 'multiplication', f.key, true, 3200, DAY));
    assert.ok(F.fluentLimit(rec) > 4000 && F.fluentLimit(rec) <= 6000, `limit ${F.fluentLimit(rec)}`);
    rule.forEach(f => F.recordAnswer(rec, 'multiplication', f.key, true, 15000, DAY));
    assert.equal(F.fluentLimit(rec), 6000, 'never more than 6 s');
});

test('a practice day: 15 problems, the weakest facts 2 or 3 times and apart, few rule facts', () => {
    const rand = seeded(4);
    for (let run = 0; run < 200; run++) {
        const rec = F.create(DAY);
        const op = 'multiplication';
        // Fluent on most facts, weak on the 8s and 9s.
        F.TABLE[op].forEach(f => {
            const weak = [f.num1, f.num2].some(n => n === 8 || n === 9) && f.answer > 20;
            const x = factOf(rec, op, f.key);
            if (weak) { x.s = F.LEARNING; x.w = 4 + Math.floor(rand() * 8); x.due = DAY; }
            else { x.s = F.MASTERED; x.d = 3; x.i = 3; x.due = DAY + 1 + Math.floor(rand() * 20); }
        });
        const plan = F.planSession(rec, op, DAY, rand);
        assert.equal(plan.length, 15);
        const keys = plan.map(p => p.key);
        const weakAsked = keys.filter(k => factOf(rec, op, k).s === F.LEARNING);
        assert.ok(weakAsked.length >= 8, `only ${weakAsked.length} weak asks`);
        assert.ok(new Set(weakAsked).size <= 4, 'at most 4 focus facts a day');
        for (let i = 0; i < keys.length; i++) {
            for (let j = i + 1; j < Math.min(keys.length, i + 3); j++) {
                assert.notEqual(keys[i], keys[j], `same fact within 3: ${keys.join(' ')}`);
            }
        }
        assert.ok(plan.filter(p => F.TABLE[op].find(f => f.key === p.key).trivial).length <= 3);
        for (const p of plan) {
            const product = { '×': p.num1 * p.num2 }[p.operator];
            assert.equal(product, p.answer);
        }
    }
});

test('a first practice day introduces the easiest facts first', () => {
    const rec = F.create(DAY);
    for (const op of F.OPS) {
        const plan = F.planSession(rec, op, DAY, seeded(5));
        assert.equal(plan.length, 15);
        assert.ok(plan.every(p => F.TABLE[op].find(f => f.key === p.key).tier <= 2), op);
    }
});

test('an operation graduates at 95% mastered, rests, and comes back after a bad check-in', () => {
    const rec = F.create(DAY);
    const op = 'division';
    const facts = rec.facts[op];
    facts.forEach(f => { f.s = F.MASTERED; f.d = 3; f.i = 4; f.due = DAY + 30; });
    facts[0].s = F.LEARNING;
    assert.equal(F.finishPart(rec, op, 'practice', [], DAY), null, 'one fact still Learning');
    facts[0].s = F.FLUENT;
    assert.equal(F.finishPart(rec, op, 'practice', [], DAY), 'graduated');
    assert.equal(F.todayKind(rec, op, DAY + 1), 'rest');
    assert.equal(F.todayKind(rec, op, DAY + 7), 'checkin');
    assert.equal(F.dueDays(rec, DAY + 1)[op], DAY + 7);
    assert.equal(F.dueDays(rec, DAY + 1).addition, DAY + 1, 'an operation still in practice is due every day');

    const plan = F.planCheckin(rec, op, DAY + 7, seeded(6));
    assert.equal(plan.length, 10);
    const good = plan.map((p, i) => ({ key: p.key, fluent: i !== 3 }));
    assert.equal(F.finishPart(rec, op, 'checkin', good, DAY + 7), 'kept', 'one slip is allowed');
    assert.equal(F.todayKind(rec, op, DAY + 20), 'rest');
    assert.equal(F.todayKind(rec, op, DAY + 21), 'checkin', 'the next check-in is 2 weeks on');

    const bad = plan.map((p, i) => ({ key: p.key, fluent: i > 1 }));
    assert.equal(F.finishPart(rec, op, 'checkin', bad, DAY + 21), 'back');
    assert.equal(F.todayKind(rec, op, DAY + 22), 'practice');
});

test('a good check-in moves overdue, never-slipped mastered facts out without asking them all', () => {
    const rec = F.create(DAY);
    const op = 'addition';
    rec.facts[op].forEach(f => { f.s = F.MASTERED; f.d = 3; f.i = 5; f.due = DAY; });
    rec.facts[op][0].x = 1; // slipped once: not covered by the sample
    rec.grad[op] = { step: 1, next: DAY };
    const plan = F.planCheckin(rec, op, DAY, seeded(7));
    const asked = new Set(plan.map(p => p.key));
    assert.equal(F.finishPart(rec, op, 'checkin', plan.map(p => ({ key: p.key, fluent: true })), DAY), 'kept');
    const moved = rec.facts[op].filter((f, i) => !asked.has(F.TABLE[op][i].key) && f.due > DAY).length;
    assert.ok(moved >= 80, `${moved} moved out`);
    if (!asked.has(F.TABLE[op][0].key)) assert.equal(rec.facts[op][0].due, DAY, 'a fact that slipped before must be asked');
});

test('a mixed queue follows each operation\'s own count', () => {
    const queue = core.buildMixedQueue(['addition', 'division', 'multiplication'], { addition: 15, division: 10, multiplication: 15 }, seeded(8));
    assert.equal(queue.filter(q => q === 'division').length, 10);
    assert.equal(queue.filter(q => q === 'addition').length, 15);
    for (let i = 1; i < queue.length; i++) {
        if (queue[i] === queue[i - 1]) {
            // allowed only once a single operation is left
            assert.ok(queue.slice(i).every(q => q === queue[i]));
        }
    }
});
