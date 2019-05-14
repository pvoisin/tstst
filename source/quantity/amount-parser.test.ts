import { Amount, IUnit } from "./quantity";
import { assert } from "chai";
import { BIT, BYTE } from "./data-size-quantity";
import { highlightValueRepresentation as hvr } from "../test.utility";
import { MICROSECOND, SECOND } from "./time-quantity";
import { parseAmount } from "./amount-parser";

describe("AmountParser", () => {
  describe("#parse", () => {
    const expectations: [string, IUnit, Amount][] = [
      ["+1s 2w-3d", SECOND, { value: 950401, unit: SECOND }],
      ["howdy +1s 2w-3d", SECOND, null],
      ["\t8b 1B\n2kB", BIT, { value: 16016, unit: BIT }],
      ["8b1B2kB", BYTE, { value: 2002, unit: BYTE }],
      ["\t8b 1B\n2d howdy", BYTE, null],
      ["-555ms", MICROSECOND, { value: -555000, unit: MICROSECOND }],
    ];
    for (const expectation of expectations) {
      const value = expectation[0];
      const unit = expectation[1];
      const expectedResult = expectation[2];

      let expectedSimplifiedResult = expectedResult && {
        amount: expectedResult.value,
        unit: expectedResult.unit.symbol,
      };
      it(`should return ${hvr(expectedSimplifiedResult)} for ${hvr(value)}`, () => {
        const result = parseAmount(value, unit);
        if (expectedResult) {
          assert.strictEqual(result.value, expectedResult.value);
          assert.strictEqual(result.unit, expectedResult.unit);
        } else {
          assert.isNull(result);
        }
      });
    }
  });
});
