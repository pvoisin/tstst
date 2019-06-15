import * as deepFreeze from "deep-freeze";
import { DefaultQuantity, DefaultUnit, Quantity, registerUnitConversions, Unit, UnitScale } from "./quantity";

export const TIME: Quantity = new DefaultQuantity("time");

export const NANOSECOND: Unit = new DefaultUnit(TIME, "nanosecond", "ns");
export const MICROSECOND: Unit = new DefaultUnit(TIME, "microsecond", "µs");
export const MILLISECOND: Unit = new DefaultUnit(TIME, "mllisecond", "ms");
export const SECOND: Unit = new DefaultUnit(TIME, "second", "s");
export const MINUTE: Unit = new DefaultUnit(TIME, "minute", "m");
export const HOUR: Unit = new DefaultUnit(TIME, "hour", "h");
export const DAY: Unit = new DefaultUnit(TIME, "day", "d");
export const WEEK: Unit = new DefaultUnit(TIME, "week", "w");

export const TIME_UNIT_SCALE: UnitScale = {
  "0.000000001": NANOSECOND,
  "0.000001": MICROSECOND,
  "0.001": MILLISECOND,
  1: SECOND,
  60: MINUTE,
  [60 * 60]: HOUR,
  [24 * 60 * 60]: DAY,
  [7 * 24 * 60 * 60]: WEEK,
};

TIME.unitScale = TIME_UNIT_SCALE;
deepFreeze(TIME_UNIT_SCALE); // 🔒
Object.freeze(TIME); // 🔒

registerUnitConversions(TIME_UNIT_SCALE);
