import { assert } from 'chai';
import { isFieldSelected } from './selectionCriteria';

describe('Selection Criteria', () => {
  describe('#isFieldSelected', () => {
    it('with empty criteria', () => {
      assert.isFalse(isFieldSelected(undefined, 'field1'));
      assert.isFalse(isFieldSelected(null, 'field1'));
      assert.isFalse(isFieldSelected({}, 'field1'));
    });

    it('with valid criteria', () => {
      assert.isTrue(isFieldSelected({ field1: true }, 'field1'));
      assert.isFalse(isFieldSelected({ field1: false }, 'field1'));
      assert.isFalse(isFieldSelected({ field1: true }, 'field2'));
      assert.isTrue(isFieldSelected({ field1: true, field2: true }, 'field1', 'field2'));
    });
  });
});
