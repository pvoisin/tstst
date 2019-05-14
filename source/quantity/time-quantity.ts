import { IQuantity, IUnit, Quantity, registerUnitConversions, Unit, UnitScale } from "./quantity";
import * as deepFreeze from "deep-freeze";

export const TIME: IQuantity = new Quantity("time");

export const NANOSECOND: IUnit = new Unit(TIME, "nanosecond", "ns");
export const MICROSECOND: IUnit = new Unit(TIME, "microsecond", "µs");
export const MILLISECOND: IUnit = new Unit(TIME, "mllisecond", "ms");
export const SECOND: IUnit = new Unit(TIME, "second", "s");
export const MINUTE: IUnit = new Unit(TIME, "minute", "m");
export const HOUR: IUnit = new Unit(TIME, "hour", "h");
export const DAY: IUnit = new Unit(TIME, "day", "d");
export const WEEK: IUnit = new Unit(TIME, "week", "w");

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
