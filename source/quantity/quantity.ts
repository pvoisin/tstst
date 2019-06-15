import BigNumber from "bignumber.js";
import { getCartesianProduct } from "../collection.utility";

export interface Quantity {
  name: string;
  unitScale: UnitScale;
}

export class DefaultQuantity implements Quantity {
  public name: string;
  public unitScale: UnitScale;

  public constructor(name: string, unitScale: UnitScale = {}) {
    this.name = name;
    this.unitScale = unitScale;
  }

  public toString(): string {
    return this.name;
  }
}

export interface Unit {
  name: string;
  quantity: Quantity;
  symbol: string;
}

export class DefaultUnit implements Unit {
  public name: string;
  public quantity: Quantity;
  public symbol: string;

  public constructor(quantity: Quantity, name: string, symbol: string) {
    this.quantity = quantity;
    this.name = name;
    this.symbol = symbol;
  }

  public toString(): string {
    return this.symbol;
  }
}

export interface UnitScale {
  [factor: string]: Unit;
}

export interface Amount {
  value: number;
  unit: Unit;
}

export function getUnitForSymbol(symbol: string, quantity: Quantity): Unit {
  let result: Unit = null;

  for (const unit of (Object as any).values(quantity.unitScale)) {
    if (unit.symbol === symbol) {
      result = unit;
      break;
    }
  }

  return result;
}

const UNIT_CONVERSIONS: Map<Unit, Map<Unit, (amount: Amount) => number>> = new Map();

export function registerUnitConversion(
  unit1: Unit,
  unit2: Unit,
  conversion: (amount: number) => number
): (amount: Amount) => number {
  if (unit1.quantity !== unit2.quantity) {
    throw new Error(`Incompatible quantities! ${unit1.quantity} ⇄ ${unit2.quantity}`);
  }

  let conversions: Map<Unit, (value: Amount) => number> = UNIT_CONVERSIONS.get(unit1);
  if (!conversions) {
    conversions = new Map();
    UNIT_CONVERSIONS.set(unit1, conversions);
  }

  const wrapper = (amount: Amount) => {
    return conversion(amount.value);
  };

  conversions.set(unit2, wrapper);

  return wrapper;
}

export function registerUnitConversions(unitScale: UnitScale) {
  const referenceUnit = unitScale[1];

  if (!referenceUnit) {
    throw new Error("Missing reference unit!");
  }

  const factors = Object.keys(unitScale);
  for (const combination of getCartesianProduct(factors, factors)) {
    let factor1 = combination[0];
    let factor2 = combination[1];
    const unit1 = unitScale[factor1];
    const unit2 = unitScale[factor2];
    factor1 = new BigNumber(factor1);
    factor2 = new BigNumber(factor2);

    registerUnitConversion(unit1, unit2, (amount) => {
      return new BigNumber(amount)
        .multipliedBy(factor1)
        .dividedBy(factor2)
        .toNumber();
    });
  }
}

export function convertAmount(amount: Amount, unit: Unit): number {
  return UNIT_CONVERSIONS.get(amount.unit).get(unit)(amount);
}
