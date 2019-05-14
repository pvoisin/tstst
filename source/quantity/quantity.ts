import BigNumber from "bignumber.js";
import { getCartesianProduct } from "../collection.utility";

export interface IQuantity {
  name: string;
  unitScale: UnitScale;
}

export class Quantity implements IQuantity {
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

export interface IUnit {
  name: string;
  quantity: IQuantity;
  symbol: string;
}

export class Unit implements IUnit {
  public quantity: IQuantity;
  public name: string;
  public symbol: string;

  public constructor(quantity: IQuantity, name: string, symbol: string) {
    this.quantity = quantity;
    this.name = name;
    this.symbol = symbol;
  }

  public toString(): string {
    return this.symbol;
  }
}

export interface UnitScale {
  [factor: string]: IUnit;
}

export interface Amount {
  value: number;
  unit: IUnit;
}

export function getUnitForSymbol(symbol: string, quantity: IQuantity): IUnit {
  let result: IUnit = null;

  for (const unit of (Object as any).values(quantity.unitScale)) {
    if (unit.symbol === symbol) {
      result = unit;
      break;
    }
  }

  return result;
}

const UNIT_CONVERSIONS: Map<IUnit, Map<IUnit, (amount: Amount) => number>> = new Map();

export function registerUnitConversion<U1 extends IUnit, U2 extends IUnit>(
  unit1: U1,
  unit2: U2,
  conversion: (amount: number) => number
): (amount: Amount) => number {
  if (unit1.quantity !== unit2.quantity) {
    throw new Error(`Incompatible quantities! ${unit1.quantity} ⇄ ${unit2.quantity}`);
  }

  let conversions: Map<IUnit, (value: Amount) => number> = UNIT_CONVERSIONS.get(unit1);
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

export function convertAmount(amount: Amount, unit: IUnit): number {
  return UNIT_CONVERSIONS.get(amount.unit).get(unit)(amount);
}
