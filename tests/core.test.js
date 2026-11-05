// The practice rules: run with `node --test tests/`.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadCore, seeded, ROOT } = require('./load-core');

const core = loadCore();
const OPS = ['addition', 'subtraction', 'multiplication', 'division'];
const SYMBOL = { addition: '+', subtraction: '−', multiplication: '×', division: '÷' };

test('index.html and automath.html are the same file', () => {
    const a = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const b = fs.readFileSync(path.join(ROOT, 'automath.html'), 'utf8');
    assert.ok(a === b, 'copy index.html over automath.html (cp index.html automath.html)');
});

test('every problem in every level has the right answer and stays a whole, non-negative number', () => {
    for (const op of OPS) {
        for (let level = 1; level <= 4; level++) {
            const pool = core.problemsAt(op, level);
            assert.ok(pool.length >= 6, `${op} level ${level} has only ${pool.length} problems`);
            for (const p of pool) {
                assert.equal(p.operator, SYMBOL[op]);
                const expected = { addition: p.num1 + p.num2, subtraction: p.num1 - p.num2,
                    multiplication: p.num1 * p.num2, division: p.num1 / p.num2 }[op];
                assert.equal(p.answer, expected, `${p.num1} ${p.operator} ${p.num2}`);
                assert.ok(Number.isInteger(p.answer) && p.answer >= 0, `${p.num1} ${p.operator} ${p.num2}`);
            }
        }
    }
});

test('addition and subtraction are facts within 20 at every level', () => {
    for (let level = 1; level <= 4; level++) {
        for (const p of core.problemsAt('addition', level)) assert.ok(p.answer <= 20, `${p.num1} + ${p.num2}`);
        for (const p of core.problemsAt('subtraction', level)) assert.ok(p.num1 <= 20, `${p.num1} − ${p.num2}`);
    }
});

test('level 4 addition and subtraction are the facts that cross ten', () => {
    for (const p of core.problemsAt('addition', 4)) {
        assert.ok(p.num1 <= 9 && p.num2 <= 9 && p.answer > 10, `${p.num1} + ${p.num2}`);
    }
    for (const p of core.problemsAt('subtraction', 4)) {
        assert.ok(p.num1 > 10 && p.num2 <= 9 && p.answer <= 9 && p.num1 % 10 < p.num2, `${p.num1} − ${p.num2}`);
    }
    // every single-digit pair that crosses ten is there
    const sums = new Set(core.problemsAt('addition', 4).map(p => `${p.num1}+${p.num2}`));
    for (let a = 2; a <= 9; a++) for (let b = 2; b <= 9; b++) if (a + b > 10) assert.ok(sums.has(`${a}+${b}`), `${a}+${b}`);
});

test('fluent means correct within the threshold', () => {
    const limit = core.FLUENT_MS.multiplication;
    assert.equal(core.isFluent('multiplication', true, limit), true);
    assert.equal(core.isFluent('multiplication', true, limit + 1), false);
    assert.equal(core.isFluent('multiplication', false, 500), false);
    assert.equal(core.isFluent('multiplication', true, null), false);
});

test('levels: up after 2 fluent in a row, slow correct answers do not count, a miss drops one', () => {
    const s = core.newState();
    core.recordAnswer(s, true, false);
    core.recordAnswer(s, true, false);
    core.recordAnswer(s, true, false);
    assert.equal(s.level, 1, 'slow correct answers alone never move the learner up');
    core.recordAnswer(s, true, true);
    core.recordAnswer(s, true, false); // slow: neither builds nor breaks the streak
    core.recordAnswer(s, true, true);
    assert.equal(s.level, 2);
    core.recordAnswer(s, true, true);
    core.recordAnswer(s, true, true);
    assert.equal(s.level, 3);
    core.recordAnswer(s, false, false);
    assert.equal(s.level, 2);
    core.recordAnswer(s, true, true);
    core.recordAnswer(s, true, true);
    assert.equal(s.level, 2, 'going back into a level slipped out of takes 3');
    core.recordAnswer(s, true, true);
    assert.equal(s.level, 3);
    for (let i = 0; i < 10; i++) core.recordAnswer(s, true, true);
    assert.equal(s.level, 4, 'never above 4');
    for (let i = 0; i < 10; i++) core.recordAnswer(s, false, false);
    assert.equal(s.level, 1, 'never below 1');
});

// Plays one operation's exercise with a learner who is right with
// probability `p` and fluent on a right answer with probability `f`.
function playExercise(op, rand, p, f, n = 15) {
    const s = core.newState();
    const shown = [];
    for (let i = 0; i < n; i++) {
        const problem = core.pickProblem(op, s, rand);
        core.recordShown(s, problem, op);
        shown.push(core.normalizeProblem(problem.num1, problem.num2, problem.operator));
        const correct = rand() < p;
        core.recordAnswer(s, correct, correct && rand() < f);
    }
    return { s, shown };
}

test('no problem repeats within an exercise, for strong and weak learners', () => {
    const rand = seeded(1);
    for (const op of OPS) {
        for (const [p, f] of [[0.95, 0.9], [0.8, 0.5], [0.5, 0.3], [0.3, 0.1]]) {
            for (let run = 0; run < 300; run++) {
                const { shown } = playExercise(op, rand, p, f);
                assert.equal(new Set(shown).size, shown.length, `${op}, p=${p}: ${shown.join(' | ')}`);
            }
        }
    }
});

test('at most 3 trivial problems and never two in a row, almost always', () => {
    const rand = seeded(2);
    let broken = 0;
    let runs = 0;
    for (const op of OPS) {
        for (let run = 0; run < 500; run++) {
            const s = core.newState();
            let trivial = 0;
            let inRow = 0;
            let bad = false;
            for (let i = 0; i < 15; i++) {
                const problem = core.pickProblem(op, s, rand);
                core.recordShown(s, problem, op);
                if (core.isTrivial(problem.num1, problem.num2, op)) {
                    trivial++;
                    inRow++;
                    if (inRow > 1 || trivial > 3) bad = true;
                } else {
                    inRow = 0;
                }
                const correct = rand() < 0.7;
                core.recordAnswer(s, correct, correct && rand() < 0.6);
            }
            if (bad) broken++;
            runs++;
        }
    }
    assert.ok(broken / runs < 0.02, `soft trivial rules broken in ${broken} of ${runs} exercises`);
});

test('a mixed queue gives each operation 15 problems and never the same operation twice in a row', () => {
    const rand = seeded(3);
    for (const parts of [OPS, ['addition', 'subtraction'], ['multiplication', 'division', 'addition']]) {
        for (let run = 0; run < 200; run++) {
            const queue = core.buildMixedQueue(parts, 15, rand);
            assert.equal(queue.length, parts.length * 15);
            for (const op of parts) assert.equal(queue.filter(q => q === op).length, 15);
            for (let i = 1; i < queue.length; i++) assert.notEqual(queue[i], queue[i - 1]);
        }
    }
});
