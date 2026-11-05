// Plays simulated learners through exercises with the real practice rules and
// prints what they would see. Run `node tests/simulate.js` before changing a
// rule (level thresholds, the fluency limit, the picker) and compare.
//
// A learner has a level they know (`knows`) and how often a right answer at
// or below it is fast (`fast`). Above that level they are right less often,
// and rarely fast.
const { loadCore, seeded } = require('./load-core');

const core = loadCore();
// `--accuracy-only` levels up on any correct answer, as before Decision 18.
const ACCURACY_ONLY = process.argv.includes('--accuracy-only');
const RUNS = Number(process.argv.find(a => /^\d+$/.test(a))) || 2000;
const OPS = ['addition', 'subtraction', 'multiplication', 'division'];

const LEARNERS = [
    { name: 'fluent through level 4', knows: 4, fast: 0.95 },
    { name: 'knows level 3, fast', knows: 3, fast: 0.85 },
    { name: 'knows level 3, slow', knows: 3, fast: 0.3 },
    { name: 'knows level 2, mixed', knows: 2, fast: 0.6 },
    { name: 'knows level 1, slow', knows: 1, fast: 0.2 }
];

function answer(learner, problemLevel, rand) {
    const above = problemLevel - learner.knows;
    const pRight = above <= 0 ? 0.95 : above === 1 ? 0.6 : 0.35;
    const correct = rand() < pRight;
    const fast = correct && rand() < (above <= 0 ? learner.fast : learner.fast * 0.3);
    return { correct, fast };
}

const rand = seeded(42);
const rows = [];
for (const learner of LEARNERS) {
    let n = 0, right = 0, fluent = 0, levelSum = 0, offLevel = 0, repeats = 0, finalSum = 0, reached4 = 0;
    for (const op of OPS) {
        for (let run = 0; run < RUNS; run++) {
            const s = core.newState();
            const seen = new Set();
            for (let i = 0; i < 10; i++) {
                const problem = core.pickProblem(op, s, rand);
                core.recordShown(s, problem, op);
                const key = core.normalizeProblem(problem.num1, problem.num2, problem.operator);
                if (seen.has(key)) repeats++;
                seen.add(key);
                if (!core.problemsAt(op, s.level).includes(problem)) offLevel++;
                const { correct, fast } = answer(learner, s.level, rand);
                core.recordAnswer(s, correct, ACCURACY_ONLY ? correct : fast);
                n++;
                levelSum += s.level;
                if (correct) right++;
                if (fast) fluent++;
            }
            finalSum += s.level;
            if (s.level === 4) reached4++;
        }
    }
    const ex = OPS.length * RUNS;
    rows.push({
        learner: learner.name,
        'right %': (100 * right / n).toFixed(1),
        'fluent %': (100 * fluent / n).toFixed(1),
        'avg level': (levelSum / n).toFixed(2),
        'end level': (finalSum / ex).toFixed(2),
        'end at 4 %': (100 * reached4 / ex).toFixed(0),
        'off-level %': (100 * offLevel / n).toFixed(1),
        repeats
    });
}
console.log(`${ACCURACY_ONLY ? 'Accuracy only. ' : ''}${RUNS} exercises of 10 problems per operation per learner`);
console.table(rows);
