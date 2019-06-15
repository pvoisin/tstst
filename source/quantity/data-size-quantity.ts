import * as deepFreeze from "deep-freeze";
import { DefaultQuantity, DefaultUnit, Quantity, registerUnitConversions, Unit, UnitScale } from "./quantity";

export const DATA_SIZE: Quantity = new DefaultQuantity("data size");

export const BIT: Unit = new DefaultUnit(DATA_SIZE, "bit", "b");
export const BYTE: Unit = new DefaultUnit(DATA_SIZE, "byte", "B");
export const KILOBIT: Unit = new DefaultUnit(DATA_SIZE, "kilobit", "kb");
export const KILOBYTE: Unit = new DefaultUnit(DATA_SIZE, "kilobyte", "kB");
export const MEGABIT: Unit = new DefaultUnit(DATA_SIZE, "megabit", "Mb");
export const MEGABYTE: Unit = new DefaultUnit(DATA_SIZE, "megabyte", "MB");
export const GIGABIT: Unit = new DefaultUnit(DATA_SIZE, "gigabit", "Gb");
export const GIGABYTE: Unit = new DefaultUnit(DATA_SIZE, "gigabyte", "GB");
export const TERABIT: Unit = new DefaultUnit(DATA_SIZE, "terabit", "Tb");
export const TERABYTE: Unit = new DefaultUnit(DATA_SIZE, "terabyte", "TB");

export const DATA_SIZE_UNIT_SCALE: UnitScale = {
  1: BIT,
  8: BYTE,
  [1000]: KILOBIT,
  [8 * 1000]: KILOBYTE,
  [1000 * 1000]: MEGABIT,
  [8 * 1000 * 1000]: MEGABYTE,
  [1000 * 1000 * 1000]: GIGABIT,
  [8 * 1000 * 1000 * 1000]: GIGABYTE,
  [1000 * 1000 * 1000 * 1000]: TERABIT,
  [8 * 1000 * 1000 * 1000 * 1000]: TERABYTE,
};
DATA_SIZE.unitScale = DATA_SIZE_UNIT_SCALE;
deepFreeze(DATA_SIZE_UNIT_SCALE); // 🔒

Object.freeze(DATA_SIZE); // 🔒

registerUnitConversions(DATA_SIZE_UNIT_SCALE);
