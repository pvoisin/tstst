import BigNumber from "bignumber.js";
import { assert } from "chai";
import { Amount, convertAmount, Unit } from "./quantity";

export function testConvertAmount(expectations: [Amount, Unit, number | string][]) {
  describe("#convertAmount", () => {
    for (const expectation of expectations) {
      const amount = expectation[0];
      const expectedValue = expectation[2];
      const unit = expectation[1];

      it(`"${amount.value + amount.unit.symbol}" should be converted into "${expectedValue + unit.symbol}"`, () => {
        let result: any = convertAmount(amount, unit);
        if (typeof expectedValue === "string") {
          let precision = new BigNumber(expectedValue).precision();
          result = result.toPrecision(precision);
        }

        assert.equal(result, expectedValue);
      });
    }
  });
}
