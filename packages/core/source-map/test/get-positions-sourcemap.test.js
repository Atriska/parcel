// @flow
import assert from 'assert';
import clone from 'clone';

import SourceMap from '../src/SourceMap';

const BASIC_TEST_MAPPINGS = [
  {
    source: 'a.js',
    name: 'A',
    original: {
      line: 1,
      column: 156
    },
    generated: {
      line: 6,
      column: 15
    }
  },
  {
    source: 'b.js',
    name: 'B',
    original: {
      line: 2,
      column: 27
    },
    generated: {
      line: 7,
      column: 25
    }
  }
];

const NULL_MAPPING = {
  source: 'null.js',
  name: 'N',
  original: null,
  generated: {
    line: 10,
    column: 45
  }
};

describe('Get Sourcemap Position', () => {
  it('get original position linked to a generated position', async function() {
    let map = new SourceMap(clone([...BASIC_TEST_MAPPINGS]));

    let originalPositionOne = map.originalPositionFor({
      line: 6,
      column: 15
    });

    let originalPositionTwo = map.originalPositionFor({
      line: 7,
      column: 25
    });

    assert.deepEqual(originalPositionOne, {
      source: 'a.js',
      name: 'A',
      line: 1,
      column: 156
    });

    assert.deepEqual(originalPositionTwo, {
      source: 'b.js',
      name: 'B',
      line: 2,
      column: 27
    });
  });

  it('get original position linked to non exact mappings', async function() {
    let map = new SourceMap(clone([...BASIC_TEST_MAPPINGS]));

    let originalPositionOne = map.originalPositionFor({
      line: 6,
      column: 18
    });

    let originalPositionTwo = map.originalPositionFor({
      line: 7,
      column: 27
    });

    assert.deepEqual(originalPositionOne, {
      source: 'a.js',
      name: 'A',
      line: 1,
      column: 156
    });

    assert.deepEqual(originalPositionTwo, {
      source: 'b.js',
      name: 'B',
      line: 2,
      column: 27
    });
  });

  it('get original position linked to a generated position with a null mapping', async function() {
    let map = new SourceMap(clone([...BASIC_TEST_MAPPINGS, NULL_MAPPING]));

    let originalPositionOne = map.originalPositionFor({
      line: 6,
      column: 15
    });

    let originalPositionTwo = map.originalPositionFor({
      line: 7,
      column: 25
    });

    let originalPositionThree = map.originalPositionFor({
      line: 10,
      column: 45
    });

    assert.deepEqual(originalPositionOne, {
      source: 'a.js',
      name: 'A',
      line: 1,
      column: 156
    });

    assert.deepEqual(originalPositionTwo, {
      source: 'b.js',
      name: 'B',
      line: 2,
      column: 27
    });

    assert.deepEqual(originalPositionThree, {
      source: 'null.js',
      name: 'N',
      line: null,
      column: null
    });
  });
});
