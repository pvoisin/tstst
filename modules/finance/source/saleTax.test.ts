import { assert } from "chai";
import { CascadingSaleTax, DefaultSaleTax, QUEBEC_GST_QST_TAX, QUEBEC_GST_TAX, QUEBEC_QST_TAX, SaleTax } from ".";
import { CAD, MoneyAmount } from "./money-quantity";

// tslint:disable-next-line function-name
export function CAD_AMOUNT(value: number): MoneyAmount {
  return { value, unit: CAD };
}

describe("DefaultSaleTax", async () => {
  describe("#calculate", async () => {
    it("should work properly", async () => {
      // GST
      assert.deepStrictEqual(QUEBEC_GST_TAX.calculate(1), 0.05);
      assert.deepStrictEqual(QUEBEC_GST_TAX.calculate(1.1), 0.06);
      assert.deepStrictEqual(QUEBEC_GST_TAX.calculate(1234.5678), 61.73);

      // QST
      assert.deepStrictEqual(QUEBEC_QST_TAX.calculate(1), 0.1);
      assert.deepStrictEqual(QUEBEC_QST_TAX.calculate(1.1), 0.11);
      assert.deepStrictEqual(QUEBEC_QST_TAX.calculate(1234.5678), 123.15);
    });
  });

  describe("#apply", async () => {
    it("should work properly", async () => {
      // GST
      assert.deepStrictEqual(QUEBEC_GST_TAX.apply(CAD_AMOUNT(1)), CAD_AMOUNT(1.05));
      assert.deepStrictEqual(QUEBEC_GST_TAX.apply(CAD_AMOUNT(1.1)), CAD_AMOUNT(1.16));
      assert.deepStrictEqual(QUEBEC_GST_TAX.apply(CAD_AMOUNT(1234.5678)), CAD_AMOUNT(1296.3));

      // QST
      assert.deepStrictEqual(QUEBEC_QST_TAX.apply(CAD_AMOUNT(1)), CAD_AMOUNT(1.1));
      assert.deepStrictEqual(QUEBEC_QST_TAX.apply(CAD_AMOUNT(1.1)), CAD_AMOUNT(1.21));
      assert.deepStrictEqual(QUEBEC_QST_TAX.apply(CAD_AMOUNT(1234.5678)), CAD_AMOUNT(1357.72));
    });
  });
});

describe("CascadingSaleTax", async () => {
  // GIVEN
  const tax: DefaultSaleTax = new CascadingSaleTax(QUEBEC_GST_TAX, QUEBEC_QST_TAX);

  describe("#calculate", async () => {
    it("should work properly", async () => {
      // THEN
      assert.deepStrictEqual(tax.calculate(1), 0.15);
      assert.deepStrictEqual(tax.calculate(1.1, 6), 0.170211);
      assert.deepStrictEqual(tax.calculate(1.1), 0.18);
      assert.deepStrictEqual(tax.calculate(1234.5678), 191.04);
    });
  });

  describe("#apply", async () => {
    it("should work properly", async () => {
      // THEN
      assert.deepStrictEqual(tax.apply(CAD_AMOUNT(1)), CAD_AMOUNT(1.15));
      assert.deepStrictEqual(tax.apply(CAD_AMOUNT(1.1), 6), CAD_AMOUNT(1.270211));
      assert.deepStrictEqual(tax.apply(CAD_AMOUNT(1.1)), CAD_AMOUNT(1.28));
      assert.deepStrictEqual(tax.apply(CAD_AMOUNT(1234.5678)), CAD_AMOUNT(1425.61));
    });
  });
});

describe("CumulativeSaleTax", async () => {
  // GIVEN
  const tax: SaleTax = QUEBEC_GST_QST_TAX;

  describe("#calculate", async () => {
    it("should work properly", async () => {
      // THEN
      assert.deepStrictEqual(tax.calculate(1), 0.15);
      assert.deepStrictEqual(tax.calculate(1.1), 0.17);
      assert.deepStrictEqual(tax.calculate(1234.5678), 184.88);
    });
  });

  describe("#apply", async () => {
    it("should work properly", async () => {
      // THEN
      assert.deepStrictEqual(QUEBEC_GST_QST_TAX.apply(CAD_AMOUNT(1)), CAD_AMOUNT(1.15));
      assert.deepStrictEqual(QUEBEC_GST_QST_TAX.apply(CAD_AMOUNT(1.1)), CAD_AMOUNT(1.27));
      assert.deepStrictEqual(QUEBEC_GST_QST_TAX.apply(CAD_AMOUNT(1234.5678)), CAD_AMOUNT(1419.45));
    });
  });
});
