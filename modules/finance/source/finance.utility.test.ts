import { assert } from "chai";
import { CurrencyCode } from "./currency";
import { getConsistentCurrency, getPennyCorrection, getPennyCount, isCurrencyConsistent } from "./finance.utility";
import { CAD, MoneyAmount, USD } from "./money-quantity";

// tslint:disable-next-line function-name
function CAD_AMOUNT(value: number): MoneyAmount {
  return { value, unit: CAD };
}

describe("#isCurrencyConsistent", async () => {
  it("should work properly", async () => {
    // GIVEN
    const amounts: MoneyAmount[] = [];

    // THEN
    assert.isUndefined(isCurrencyConsistent(amounts));
    assert.isUndefined(getConsistentCurrency(amounts));

    // WHEN
    amounts.push(CAD_AMOUNT(1.66));

    // THEN
    assert.isTrue(isCurrencyConsistent(amounts));
    assert.strictEqual(getConsistentCurrency(amounts), CurrencyCode.CAD);

    // WHEN
    amounts.push({ value: 1, unit: USD });

    // THEN
    assert.isFalse(isCurrencyConsistent(amounts));
    assert.isNull(getConsistentCurrency(amounts));

    // WHEN
    amounts.pop();
    amounts.push(CAD_AMOUNT(2.33));

    // THEN
    assert.isTrue(isCurrencyConsistent(amounts));
    assert.strictEqual(getConsistentCurrency(amounts), CurrencyCode.CAD);

    // WHEN
    amounts.push({ value: 2.33, unit: undefined });
    assert.strictEqual(getConsistentCurrency(amounts), CurrencyCode.CAD);
  });

  describe("#getPennyCount", async () => {
    it("should work properly", async () => {
      assert.strictEqual(getPennyCount(1), 0);
      assert.strictEqual(getPennyCount(1.05), 5);
      assert.strictEqual(getPennyCount(1.01), 1);
      assert.strictEqual(getPennyCount(1.014), 1);
      assert.strictEqual(getPennyCount(1.014, false), 1);
      assert.strictEqual(getPennyCount(1.015), 2);
      assert.strictEqual(getPennyCount(1.015, false), 1);
      assert.strictEqual(getPennyCount(1.019), 2);
      assert.strictEqual(getPennyCount(1.019, false), 1);
      assert.strictEqual(getPennyCount(1.02), 2);
    });
  });

  // Cf. https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/phasing-penny.html#rndng
  describe("#getPennyCorrection", async () => {
    it("should work properly", async () => {
      assert.strictEqual(getPennyCorrection(1.0), 0);
      assert.strictEqual(getPennyCorrection(1.01), -1);
      assert.strictEqual(getPennyCorrection(1.02), -2);
      assert.strictEqual(getPennyCorrection(1.03), +2);
      assert.strictEqual(getPennyCorrection(1.04), +1);
      assert.strictEqual(getPennyCorrection(1.044), +1);
      assert.strictEqual(getPennyCorrection(1.044, false), +1);
      assert.strictEqual(getPennyCorrection(1.045), 0);
      assert.strictEqual(getPennyCorrection(1.045, false), +1);
      assert.strictEqual(getPennyCorrection(1.05), 0);
      assert.strictEqual(getPennyCorrection(1.06), -1);
      assert.strictEqual(getPennyCorrection(1.07), -2);
      assert.strictEqual(getPennyCorrection(1.08), +2);
      assert.strictEqual(getPennyCorrection(1.09), +1);
    });
  });
});
