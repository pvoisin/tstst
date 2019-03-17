import { assert } from "chai";
import { DAY, HOUR, MICROSECOND, MILLISECOND, MINUTE, NANOSECOND, SECOND, TIME, WEEK } from "./time-quantity";
import { getUnitForSymbol, IQuantity, IUnit } from "./quantity";
import { highlightValueRepresentation as hvr } from "./test.utility";
import {
  BIT,
  BYTE,
  DATA_SIZE,
  KILOBIT,
  KILOBYTE,
  MEGABIT,
  MEGABYTE,
  GIGABIT,
  GIGABYTE,
  TERABIT,
  TERABYTE,
} from "./data-size-quantity";

describe("Quantity, Unit & Amount", () => {
  describe("#getUnitForSymbol", () => {
    const expectations: [string, IQuantity, IUnit][] = [
      ["ns", TIME, NANOSECOND],
      ["µs", TIME, MICROSECOND],
      ["ms", TIME, MILLISECOND],
      ["s", TIME, SECOND],
      ["m", TIME, MINUTE],
      ["h", TIME, HOUR],
      ["d", TIME, DAY],
      ["w", TIME, WEEK],
      ["s", DATA_SIZE, null],
      ["b", DATA_SIZE, BIT],
      ["B", DATA_SIZE, BYTE],
      ["kb", DATA_SIZE, KILOBIT],
      ["kB", DATA_SIZE, KILOBYTE],
      ["Mb", DATA_SIZE, MEGABIT],
      ["MB", DATA_SIZE, MEGABYTE],
      ["Gb", DATA_SIZE, GIGABIT],
      ["GB", DATA_SIZE, GIGABYTE],
      ["Tb", DATA_SIZE, TERABIT],
      ["TB", DATA_SIZE, TERABYTE],
      ["s", DATA_SIZE, null],
    ];
    for (const expectation of expectations) {
      const symbol = expectation[0];
      const quantity = expectation[1];
      const expectedResult = expectation[2];
      const expectedResultRepresentation = hvr(expectedResult && expectedResult.name);
      it(`should return ${expectedResultRepresentation} for ${hvr(symbol)} + ${hvr(quantity.name)}`, () => {
        assert.strictEqual(getUnitForSymbol(symbol, quantity), expectedResult);
      });
    }
  });
});
