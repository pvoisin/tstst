// tslint:disable max-classes-per-file

import { BigNumber } from "bignumber.js";
import { MoneyAmount } from "../quantity";

export interface SaleTax {
  calculate: (amountValue: number, precision?: number) => number;
  apply: (amount: MoneyAmount, precision?: number) => MoneyAmount;
}

export class DefaultSaleTax implements SaleTax {
  rate: number;

  constructor(rate: number) {
    this.rate = rate;
  }

  calculate(amountValue: number, precision: number = 2): number {
    return new BigNumber(amountValue)
      .multipliedBy(this.rate)
      .dp(precision, BigNumber.ROUND_HALF_UP)
      .toNumber();
  }

  apply(amount: MoneyAmount, precision: number = 2): MoneyAmount {
    const amountValue = new BigNumber(amount.value)
      .plus(this.calculate(amount.value, precision))
      .dp(precision, BigNumber.ROUND_HALF_UP);

    return {
      value: amountValue.toNumber(),
      unit: amount.unit,
    };
  }
}

export const QUEBEC_GST_TAX: SaleTax = new DefaultSaleTax(0.05);

export const QUEBEC_QST_TAX: SaleTax = new DefaultSaleTax(0.09975);

/**
 * Sale tax which calculation consists in adding the value of every specified
 * sale tax with which it is composed, applied on the initial money amount.
 */
export class CumulativeSaleTax extends DefaultSaleTax {
  protected taxes: SaleTax[];

  constructor(...taxes: SaleTax[]) {
    super(undefined);

    this.taxes = taxes;
  }

  calculate(amountValue: number, precision: number = 2): number {
    let value: BigNumber = new BigNumber(0);

    for (const tax of this.taxes) {
      value = value.plus(tax.calculate(amountValue, precision));
    }

    return value.dp(precision, BigNumber.ROUND_HALF_UP).toNumber();
  }
}

/**
 * Sale tax which calculation consists in adding the value of every specified
 * sale tax with which it is composed, applied on the money amount resulting from
 * the previous tax calculation.
 *
 * @see https://en.wikipedia.org/wiki/Cascade_tax
 */
export class CascadingSaleTax extends DefaultSaleTax {
  protected taxes: SaleTax[];

  constructor(...taxes: SaleTax[]) {
    super(undefined);

    this.taxes = taxes;
  }

  calculate(amountValue: number, precision: number = 2): number {
    let value: BigNumber = new BigNumber(amountValue);

    for (const tax of this.taxes) {
      value = value.plus(tax.calculate(value.toNumber(), precision));
    }

    value = value.minus(amountValue);

    return value.dp(precision, BigNumber.ROUND_HALF_UP).toNumber();
  }
}

/**
 * @see https://en.wikipedia.org/wiki/Sales_taxes_in_Canada
 * @see http://www.cra-arc.gc.ca/tx/bsnss/tpcs/gst-tps/rts-eng.html
 */
export const QUEBEC_GST_QST_TAX: SaleTax = new CumulativeSaleTax(QUEBEC_GST_TAX, QUEBEC_QST_TAX);
