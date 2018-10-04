import * as _ from "lodash";
import * as moment from "moment";
import { assert } from "chai";
import { getCartesianProduct } from "./collection.utility";
import { getSafeDate, isDate, isDateBetween, isDateCompatible, isDateRange, ISO_DATE_PATTERN } from "./date.utility";
import {
  underline,
  highlightValueRepresentation as hvr,
  highlightTypeRepresentation as htr,
  highlightCollectionRepresentation as hcr,
} from "./test.utility";

describe("Date Utility", () => {
  describe("#isDateBetween", () => {
    it("should support open ranges", () => {
      assert.isTrue(isDateBetween("2018-01-01T12:34:56", ["2018-01-01T12:34:56", null]));
      assert.isFalse(isDateBetween("2018-01-01T12:34:56", ["2018-01-01T12:34:56.123", null]));
      assert.isTrue(isDateBetween("2018-01-01T12:34:56", [null, "2018-01-01T12:34:56"]));
      assert.isFalse(isDateBetween("2018-01-01T12:34:56", [null, "2018-01-01T12:34:55.999"]));
    });
  });

  describe("#isDateCompatible", () => {
    const dateRepr: string = "2018-09-12T21:45:12.243Z";
    const dateValues = [dateRepr, new Date(dateRepr), moment(dateRepr)];

    getCartesianProduct(dateValues, dateValues).forEach((dateParameters) => {
      const parameter1 = dateParameters[0];
      const parameter2 = dateParameters[1];

      it(`should support ${htr(parameter1)} & ${htr(parameter2)} parameters`, () => {
        assert.isTrue(isDateCompatible(parameter1, parameter2));
      });
    });

    const date1Repr = "2018-09-12T12:34:56.789Z";
    const date1Values = [date1Repr, new Date(date1Repr), moment(date1Repr)];
    const date2Repr = "2018-09-12T21:45:12.243Z";
    const date2Values = [date2Repr, new Date(date2Repr), moment(date2Repr)];

    getCartesianProduct(date1Values, date2Values).forEach((dateRangeParameter) => {
      const dateRangeLowBoundary = dateRangeParameter[0];
      const dateRangeHighBoundary = dateRangeParameter[1];

      dateValues.forEach((dateValue) => {
        it(`should support ${htr(dateValue)}\` & [${htr(dateRangeLowBoundary)}:${htr(
          dateRangeHighBoundary
        )}] parameters`, () => {
          assert.isTrue(isDateCompatible(dateValue, dateRangeParameter));
        });
      });
    });
  });

  const INVALID_DATE_VALUES = [undefined, null, true, false, 123, NaN, "pouet", _.noop, /^$/, {}, []];
  const VALID_DATE_VALUES = [new Date(2018, 7, 31, 23, 59, 59, 999), new Date(2019, 0, 1, 0, 0, 0, 0)];

  describe("#isDate", () => {
    INVALID_DATE_VALUES.forEach((value) => {
      it(`should return ${hvr("false")} for ${hvr(value)}`, () => {
        assert.isFalse(isDate(value));
      });
    });

    VALID_DATE_VALUES.forEach((value) => {
      it(`should return ${hvr("true")} for ${hvr(value)}`, () => {
        assert.isTrue(isDate(value));
      });
    });
  });

  const INVALID_DATE_RANGE_VALUES = getCartesianProduct(INVALID_DATE_VALUES, INVALID_DATE_VALUES);
  const VALID_DATE_RANGE_VALUES = getCartesianProduct(VALID_DATE_VALUES, VALID_DATE_VALUES);
  // Append open ranges in valid date range values:
  VALID_DATE_VALUES.forEach((date) => {
    VALID_DATE_RANGE_VALUES.push([date, null]);
    VALID_DATE_RANGE_VALUES.push([null, date]);
  });
  // Append 3-value items into the invalid date range values:
  VALID_DATE_RANGE_VALUES.forEach((dateRange) => INVALID_DATE_RANGE_VALUES.push(dateRange.concat(null)));

  describe("#isDateRange", () => {
    INVALID_DATE_RANGE_VALUES.forEach((value: any[]) => {
      it(`should return ${hvr("false")} for ${hcr(value, true)}`, () => {
        assert.isFalse(isDateRange(value));
      });
    });

    VALID_DATE_RANGE_VALUES.forEach((value) => {
      it(`should return ${hvr("true")} for ${hcr(value, true)}`, () => {
        assert.isTrue(isDateRange(value));
      });
    });
  });

  describe("#getSafeDate", () => {
    // Cf. http://momentjs.com/docs/#/parsing/string/
    const expectations = {
      "2018-12-07T12:34:56.789": new Date(2018, 11, 7, 12, 34, 56, 789),
      "20181207T123456.789": new Date(2018, 11, 7, 12, 34, 56, 789),
      "2018-12-07": new Date(2018, 11, 7, 0, 0, 0, 0),
    };
    _.forEach(expectations, (expectedResult, value) => {
      it(`should support ${hvr(value)}`, () => {
        assert.deepEqual(getSafeDate(value), expectedResult);
      });
    });

    const expectedlyFailingValues = [null, undefined, "true", "false", "???"];
    expectedlyFailingValues.forEach((value) => {
      it(`should fail with ${hvr(value)}`, () => {
        let failed: boolean = false;
        try {
          getSafeDate(value);
        } catch (error) {
          failed = true;
        }
        assert.isTrue(failed);
      });
    });
  });

  describe("ISO_DATE_PATTERN", () => {
    const expectations = {
      "2018-07-31": ["2018-07-31", "-", undefined, undefined, undefined, undefined],
      "20180731": ["20180731", "", undefined, undefined, undefined, undefined],
      "2018-07-31 00:00:59": ["2018-07-31", "-", "00:00:59", ":", undefined, undefined],
      "2018-07-31T00:59:59": ["2018-07-31", "-", "00:59:59", ":", undefined, undefined],
      "2018-07-31 23:59:59": ["2018-07-31", "-", "23:59:59", ":", undefined, undefined],
      "2018-07-31T12:34:56.789+06": ["2018-07-31", "-", "12:34:56", ":", "789", "+06"],
      "2018-07-31T12:34:56.789+10:11": ["2018-07-31", "-", "12:34:56", ":", "789", "+10:11"],
      "20180731T123456,789+1011": ["20180731", "", "123456", "", "789", "+1011"],
      "20180731 123456,789-1011": ["20180731", "", "123456", "", "789", "-1011"],
      "20180731T123456,789+10:11": ["20180731", "", "123456", "", "789", "+10:11"],
      "20180731 12:34:56,789-1011": ["20180731", "", "12:34:56", ":", "789", "-1011"],
      "2018-07-31 12:34:56.789Z": ["2018-07-31", "-", "12:34:56", ":", "789", "Z"],
    };
    _.forEach(expectations, (expectation, value) => {
      it(`should match ${hvr(value)}`, () => assert.deepEqual(ISO_DATE_PATTERN.exec(value).slice(1), expectation));
    });

    const invalidDateValues = [
      "201807-31", // mismatching date separator
      "2018/07/31", // bad date separator
      "2018-07-31T1234:56", // mismatching time separator
      "20180731123456", // missing date-time separator
      "2018-13-31", // month overflow
      "2018-07-32", // day overflow
      "2018-07-31 24:00:00", // hour overflow
      "2018-07-31 00:60:00", // minute overflow
      "2018-07-31 00:00:60", // second overflow
      "2018-07-31 12", // incomplete time representation
      "2018-07-31 12:34", // incomplete time representation
      "2018-07-31T12:34:56789", // bad second format
      "20180731 123456 789", // bad split second separator
      "2018-07-31 12:34:56.", // bad split second format
      "2018-07-31 12:34:56.7", // bad split second format
      "2018-07-31 12:34:56.78", // bad split second format
      "2018-07-31 01:23:45.6789", // bad split second format
      "20180731T123456.7891011", // missing time-offset separator
      "2018-07-31 01:23:45.678+1", // bad offset format
      "2018-07-31 12:34:56.789+1011Z", // bad offset format
      "2018-07-31 01:23:45.678+2400", // offset overflow
    ];
    invalidDateValues.forEach((value) => {
      it(`should *${underline("NOT")}* match ${hvr(value)}`, () => assert.isNull(ISO_DATE_PATTERN.exec(value)));
    });
  });
});
