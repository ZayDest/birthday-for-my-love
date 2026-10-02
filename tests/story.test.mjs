import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SURPRISES,
  ENDINGS,
  initialState,
  revealSurprise,
  canReadLetter,
  chooseEnding,
} from '../story.mjs';

test('each unique surprise counts once and all three unlock the letter', () => {
  let state = initialState();
  assert.equal(canReadLetter(state), false);

  for (const surprise of SURPRISES) {
    state = revealSurprise(state, surprise.id);
  }

  assert.equal(state.opened.length, 3);
  assert.equal(canReadLetter(state), true);
  assert.equal(revealSurprise(state, SURPRISES[0].id).opened.length, 3);
});

test('unknown surprises do not change progress', () => {
  const state = initialState();
  assert.deepEqual(revealSurprise(state, 'not-a-card'), state);
});

test('an ending can be chosen only after the letter unlocks', () => {
  let state = initialState();
  const endingId = ENDINGS[0].id;

  assert.deepEqual(chooseEnding(state, endingId), state);
  state = SURPRISES.reduce((next, surprise) => revealSurprise(next, surprise.id), state);
  assert.equal(chooseEnding(state, endingId).ending, endingId);
  assert.deepEqual(chooseEnding(state, 'not-an-ending'), state);
});
