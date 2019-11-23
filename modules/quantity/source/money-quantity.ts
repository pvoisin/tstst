import * as deepFreeze from "deep-freeze";
import { Amount, DefaultQuantity, DefaultUnit, Quantity, registerUnitConversions, Unit, UnitScale } from ".";
import { CurrencyCode, getCurrencyCodeId } from "../finance";

export interface MoneyQuantity extends Quantity {}

export const MONEY: MoneyQuantity = new DefaultQuantity("money");

export interface MoneyUnit extends Unit<MoneyQuantity> {
  currency: CurrencyCode;
}

export interface MoneyAmount extends Amount<MoneyQuantity, MoneyUnit> {}

export function isMoneyAmount(amount: Amount): amount is MoneyAmount {
  return amount && amount.unit && amount.unit.quantity === MONEY;
}

export class DefaultMoneyUnit extends DefaultUnit implements MoneyUnit {
  currency: CurrencyCode;
  name: string;

  constructor(name: string, currency: CurrencyCode, symbol: string = getCurrencyCodeId(currency)) {
    super(MONEY, name, symbol);

    this.currency = currency;
  }
}

export const CAD: MoneyUnit = new DefaultMoneyUnit("Canadian dollar", CurrencyCode.CAD);
export const USD: MoneyUnit = new DefaultMoneyUnit("American dollar", CurrencyCode.USD);
export const EUR: MoneyUnit = new DefaultMoneyUnit("Euro", CurrencyCode.EUR);

export const MONEY_UNIT_SCALE: UnitScale<MoneyQuantity> = {
  0.74: CAD,
  1: USD,
  1.12: EUR,
};

MONEY.unitScale = MONEY_UNIT_SCALE;
deepFreeze(MONEY_UNIT_SCALE); // 🔒
Object.freeze(MONEY); // 🔒

registerUnitConversions(MONEY_UNIT_SCALE);
