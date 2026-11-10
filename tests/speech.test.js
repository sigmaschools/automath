// Spoken answers (Decision 23): run with `node --test tests/`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSpeech, loadCore } = require('./load-core');

const speech = loadSpeech();

test('reads the numbers a speech recognizer writes as digits', () => {
    const cases = { '7': 7, '0': 0, '12': 12, '919': 919, '1,121': 1121, '1:44': 144, ' 56. ': 56, '$12': 12 };
    for (const [text, n] of Object.entries(cases)) assert.equal(speech.parseNumber(text), n, text);
});

test('reads numbers said in words', () => {
    const cases = {
        'seven': 7, 'zero': 0, 'Twelve': 12, 'nineteen': 19, 'twenty': 20, 'twenty one': 21, 'twenty-one': 21,
        'forty four': 44, 'one hundred': 100, 'a hundred': 100, 'one hundred five': 105,
        'one hundred and five': 105, 'one hundred twenty one': 121, 'one hundred forty-four': 144,
        'nine hundred nineteen': 919, 'eleven hundred twenty one': 1121,
        'one thousand one hundred twenty one': 1121, 'one thousand five hundred forty seven': 1547
    };
    for (const [text, n] of Object.entries(cases)) assert.equal(speech.parseNumber(text), n, text);
});

test('reads words a recognizer writes for a spoken digit', () => {
    const cases = { 'for': 4, 'to': 2, 'too': 2, 'ate': 8, 'won': 1 };
    for (const [text, n] of Object.entries(cases)) assert.equal(speech.parseNumber(text), n, text);
});

test('takes the last number said, so a learner can correct themselves', () => {
    assert.equal(speech.parseNumber('it is 12'), 12);
    assert.equal(speech.parseNumber('the answer is twenty one'), 21);
    assert.equal(speech.parseNumber('5 no 6'), 6);
    assert.equal(speech.parseNumber('fifteen sixteen'), 16);
    assert.equal(speech.parseNumber('I think it is going to be 12'), 12);
    assert.equal(speech.parseNumber('seven eight'), 8);
});

test('finds no number in talk without one', () => {
    for (const text of ['', 'um', 'I don\'t know', 'hundred', 'and', 'a', 'oh']) {
        assert.equal(speech.parseNumber(text), null, JSON.stringify(text));
    }
    assert.equal(speech.parseNumber(undefined), null);
});

test('every answer the warm-up can ask for reads back from its words', () => {
    const core = loadCore();
    const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
        'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const words = (n) => {
        if (n >= 100) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ' ' + words(n % 100) : ''}`;
        if (n < 20) return ONES[n];
        return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    };
    const answers = new Set();
    for (const op of ['addition', 'subtraction', 'multiplication', 'division']) {
        for (let level = 1; level <= 4; level++) core.problemsAt(op, level).forEach(p => answers.add(p.answer));
    }
    for (const n of answers) {
        assert.equal(speech.parseNumber(words(n)), n, words(n));
        assert.equal(speech.parseNumber(String(n)), n, String(n));
    }
});
