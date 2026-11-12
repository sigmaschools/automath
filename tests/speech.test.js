// Spoken answers (Decisions 23, 24, 26): run with `node --test tests/`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSpeech } = require('./load-core');

const speech = loadSpeech();

// Compass voice kit (Decision 24, app contract 1.5 section 15).

test('the box shows the last number said, for the learner to confirm (Decision 30)', () => {
    assert.equal(speech.pick([12], 12), 12);
    assert.equal(speech.pick([7], 12), 7);
    assert.equal(speech.pick([7, 8], 8), 8);
    assert.equal(speech.pick([], 12), null);
    assert.equal(speech.pick(undefined, 12), null);
});

test('a teen/ty mix-up of the answer shows the answer (Decision 30)', () => {
    assert.equal(speech.pick([30], 13), 13);
    assert.equal(speech.pick([13], 30), 30);
    assert.equal(speech.pick([90], 19), 19);
    assert.equal(speech.pick([16], 60), 60);
    // Only the answer's own partner: other numbers are shown as heard.
    assert.equal(speech.pick([40], 13), 40);
    assert.equal(speech.pick([30], 12), 30);
    assert.equal(speech.pick([20], 12), 20);
    assert.equal(speech.pick([12], 20), 12);
    assert.equal(speech.pick([31], 13), 31);
    assert.equal(speech.teenTy(13, 13), 13);
});

test('the report notes what was heard only when it was not simply the answer recorded', () => {
    assert.equal(speech.heardNote({ values: [12], text: 'twelve' }, 12), undefined);
    assert.equal(speech.heardNote({ values: [13], text: 'thirteen' }, 12), 'thirteen');
    assert.equal(speech.heardNote({ values: [7, 8], text: 'seven eight' }, 7), 'seven eight');
    assert.equal(speech.heardNote(null, 12), undefined);
    assert.equal(speech.heardNote(undefined, 12), undefined);
});

test('reads the Compass server from the profile note after the #', () => {
    const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const decode = (b) => Buffer.from(b, 'base64').toString('binary');
    const note = (claims) => `${b64url({ alg: 'EdDSA' })}.${b64url(claims)}.c2ln`;
    const iss = 'https://compass.example';
    for (let pad = 0; pad < 4; pad++) {
        const claims = { iss, aud: 'automath', x: 'a'.repeat(pad), student: { name: 'Avery' } };
        assert.equal(speech.profileIssuer(`#compass_profile=${note(claims)}`, decode), iss);
    }
    assert.equal(speech.profileIssuer(`#route&compass_profile=${note({ iss })}`, decode), iss);
    assert.equal(speech.profileIssuer('', decode), null);
    assert.equal(speech.profileIssuer('#compass_profile=nonsense', decode), null);
    assert.equal(speech.profileIssuer('#compass_profile=a.!!!.b', decode), null);
    assert.equal(speech.profileIssuer(`#compass_profile=${note({ sub: 'x' })}`, decode), null);
});
