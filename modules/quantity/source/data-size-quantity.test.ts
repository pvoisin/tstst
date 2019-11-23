import { BIT, BYTE, TERABIT, TERABYTE } from "./data-size-quantity";
import { testConvertAmount } from "./quantity.test.helper";

testConvertAmount([
  [{ value: 1, unit: BIT }, BYTE, 0.125],
  [{ value: 1, unit: BIT }, BIT, 1],
  [{ value: 1, unit: BYTE }, BIT, 8],
  [{ value: 1, unit: BYTE }, BYTE, 1],
  [{ value: 1, unit: TERABYTE }, BIT, 8 * 1000 * 1000 * 1000 * 1000],
  [{ value: 1, unit: TERABYTE }, BYTE, 1000 * 1000 * 1000 * 1000],
  [{ value: 1, unit: TERABYTE }, TERABIT, 8],
]);
