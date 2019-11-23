import { assert } from "chai";
import { concat, isBoolean, isNumber, isUndefined, merge } from "lodash";
import {
  getCartesianProduct,
  isCollection,
  isCompatible,
  isEmpty,
  isMatching,
  removeEmptyValues,
  removeMissingValues,
} from "./collection.utility";
import {
  EMPTY_ARRAY,
  EMPTY_FUNCTION,
  EMPTY_MAP,
  EMPTY_OBJECT,
  EMPTY_PATTERN,
  EMPTY_SET,
  EMPTY_VALUES,
  EMPTY_VALUES_MAP,
  NOT_EMPTY_MAP,
  NOT_EMPTY_SET,
  NOT_EMPTY_VALUES,
  NOT_EMPTY_VALUES_MAP,
  NOT_MISSING_VALUES,
  NOT_MISSING_VALUES_MAP,
} from "./test.helper";
import { getValueRepresentation as hvr } from "./utility";

describe("Collection Utility", () => {
  describe("#isEmpty", () => {
    EMPTY_VALUES.forEach(value => {
      it(`should return ${hvr(true)} for ${hvr(value, true)}`, () => {
        assert.isTrue(isEmpty(value));
      });
    });
    NOT_EMPTY_VALUES.forEach(value => {
      it(`should return ${hvr(false)} for ${hvr(value, true)}`, () => {
        assert.isFalse(isEmpty(value));
      });
    });
  });

  describe("#isCollection", () => {
    assert.isTrue(isCollection(EMPTY_OBJECT));
    assert.isTrue(isCollection({ id: 1 }));
    assert.isTrue(isCollection(EMPTY_ARRAY));
    assert.isTrue(isCollection(["🍕"]));
    assert.isTrue(isCollection(EMPTY_MAP));
    assert.isTrue(isCollection(NOT_EMPTY_MAP));
    assert.isTrue(isCollection(EMPTY_SET));
    assert.isTrue(isCollection(NOT_EMPTY_SET));
  });

  describe("#removeEmptyValues", () => {
    it("should remove empty values from arrays", () => {
      const values = concat([], EMPTY_VALUES, NOT_EMPTY_VALUES);
      const result = removeEmptyValues(values);
      assert.deepEqual(result, NOT_EMPTY_VALUES);
    });

    it("should remove empty values from objects", () => {
      const values = merge({}, EMPTY_VALUES_MAP, NOT_EMPTY_VALUES_MAP);
      const result = removeEmptyValues(values);
      assert.deepEqual(result, NOT_EMPTY_VALUES_MAP);
    });
  });

  describe("#removeMissingValues", () => {
    it("should remove missing values from arrays", () => {
      const values = concat([], EMPTY_VALUES, NOT_EMPTY_VALUES);
      const result = removeMissingValues(values);
      assert.deepEqual(result, NOT_MISSING_VALUES);
    });

    it("should remove missing values from objects", () => {
      const values = merge({}, EMPTY_VALUES_MAP, NOT_EMPTY_VALUES_MAP);
      const result = removeMissingValues(values);
      assert.deepEqual(result, NOT_MISSING_VALUES_MAP);
    });
  });

  describe("#getCartesianProduct", () => {
    it("should return expected value", () => {
      const valueSet1 = ["A", 1, true, null, EMPTY_FUNCTION, EMPTY_ARRAY];
      const valueSet2 = [EMPTY_PATTERN, NaN, false, undefined, EMPTY_OBJECT];

      const result = getCartesianProduct(valueSet1, valueSet2);

      const expectedResult = [
        ["A", EMPTY_PATTERN],
        ["A", NaN],
        ["A", false],
        ["A", undefined],
        ["A", EMPTY_OBJECT],
        [1, EMPTY_PATTERN],
        [1, NaN],
        [1, false],
        [1, undefined],
        [1, EMPTY_OBJECT],
        [true, EMPTY_PATTERN],
        [true, NaN],
        [true, false],
        [true, undefined],
        [true, EMPTY_OBJECT],
        [null, EMPTY_PATTERN],
        [null, NaN],
        [null, false],
        [null, undefined],
        [null, EMPTY_OBJECT],
        [EMPTY_FUNCTION, EMPTY_PATTERN],
        [EMPTY_FUNCTION, NaN],
        [EMPTY_FUNCTION, false],
        [EMPTY_FUNCTION, undefined],
        [EMPTY_FUNCTION, EMPTY_OBJECT],
        [EMPTY_ARRAY, EMPTY_PATTERN],
        [EMPTY_ARRAY, NaN],
        [EMPTY_ARRAY, false],
        [EMPTY_ARRAY, undefined],
        [EMPTY_ARRAY, EMPTY_OBJECT],
      ];

      assert.deepEqual(result, expectedResult);
    });
  });

  describe("Utility", () => {
    describe("#isMatching", () => {
      it("should behave properly", () => {
        assert.isTrue(isMatching({ A: 1, B: 2, C: 3 }, { A: 1, B: 2 }));
        assert.isFalse(isMatching({ A: 1, B: 2 }, { A: 1, B: 2, C: 3 }));
        assert.isTrue(isMatching({ A: 1, B: 2 }, { A: "???", B: 2, C: 3 }, ["B"]));
      });
    });

    describe("#isCompatible", () => {
      it("should support fixed values", () => {
        assert.isTrue(isCompatible({ A: 1, B: 2, C: 3 }, { A: 1, B: 2 }));
        assert.isFalse(isCompatible({ A: 1, B: 2 }, { A: 1, B: 2, C: 3 }));
        assert.isTrue(isCompatible({ A: 1, B: 2 }, { A: "???", B: 2, C: 3 }, ["B"]));
      });

      it("should support compatibility rules", () => {
        assert.isTrue(isCompatible({ A: 1, B: 2, C: 3 }, { A: isNumber, C: 3 }));
        assert.isFalse(isCompatible({ A: 1, B: 2, C: 3 }, { B: isBoolean }));
        assert.isTrue(isCompatible({ A: 1, B: 2, C: 3 }, { D: isUndefined }));
      });
    });
  });
});
