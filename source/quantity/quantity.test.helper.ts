import { assert } from "chai";
import { highlightValueRepresentation as hvr } from "../test.utility";
import { Amount, convertAmount, Unit } from "./quantity";

export function testConvertAmount(expectations: [Amount, Unit, number | string][]) {
  describe("#convertAmount", () => {
    for (const expectation of expectations) {
      const amount = expectation[0];
      const expectedValue = expectation[2];
      const unit = expectation[1];
      it(`${hvr(amount.value + amount.unit.symbol)} should be converted into ${hvr(
        expectedValue + unit.symbol
      )}`, () => {
        let result: any = convertAmount(amount, unit);
        if (typeof expectedValue === "string") {
          let precision = expectedValue.length;
          const match = /^[0.]+/.exec(expectedValue);
          if (match) {
            precision = precision - match[0].length;
          }
          result = result.toPrecision(precision);
        }

        assert.equal(result, expectedValue);
      });
    }
  });
}
