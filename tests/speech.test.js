// Spoken answers (Decisions 23, 24, 26): run with `node --test tests/`.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSpeech } = require('./load-core');

const speech = loadSpeech();

// Compass voice kit (Decision 24, app contract 1.5 section 15).

test('a heard right answer counts at once, even before the learner stops talking', () => {
    assert.equal(speech.decide(12, false, 12), 'accept');
    assert.equal(speech.decide(12, true, 12), 'accept');
});

test('a heard wrong number is a miss once the learner stops talking (Decision 26)', () => {
    assert.equal(speech.decide(13, false, 12), 'wait');
    assert.equal(speech.decide(13, true, 12), 'miss');
    assert.equal(speech.decide(0, true, 12), 'miss');
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
