import { DAY, HOUR, MICROSECOND, MILLISECOND, MINUTE, NANOSECOND, SECOND, WEEK } from ".";
import { testConvertAmount } from "./quantity.test.helper";

testConvertAmount([
  [{ value: 1, unit: WEEK }, SECOND, 7 * 24 * 60 * 60],
  [{ value: 1, unit: SECOND }, WEEK, "0.0000016534"],
  [{ value: 1, unit: DAY }, SECOND, 24 * 60 * 60],
  [{ value: 1, unit: SECOND }, DAY, "0.000011574"],
  [{ value: 1, unit: HOUR }, SECOND, 60 * 60],
  [{ value: 1, unit: SECOND }, HOUR, "0.000277777778"],
  [{ value: 1, unit: MINUTE }, SECOND, 60],
  [{ value: 1, unit: SECOND }, MINUTE, "0.016666667"],
  [{ value: 1, unit: SECOND }, SECOND, 1],
  [{ value: 1, unit: SECOND }, MILLISECOND, 1000],
  [{ value: 1, unit: MILLISECOND }, SECOND, 0.001],
  [{ value: 1, unit: SECOND }, MICROSECOND, 1000000],
  [{ value: 1, unit: MICROSECOND }, SECOND, 0.000001],
  [{ value: 1, unit: SECOND }, NANOSECOND, 1000000000],
  [{ value: 1, unit: NANOSECOND }, SECOND, 0.000000001],
  [{ value: 1, unit: SECOND }, HOUR, "0.000277777778"],
  [{ value: 1, unit: HOUR }, MILLISECOND, 3600000],
  [{ value: 1, unit: HOUR }, NANOSECOND, 3600000000000],
]);
