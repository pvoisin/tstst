import { getValueRepresentation as $v } from '@tstst/general/source/utility';
import { assert } from 'chai';
import { parseAmount } from './amount-parser';
import { BIT, BYTE } from './data-size-quantity';
import { Amount, Unit } from './quantity';
import { MICROSECOND, SECOND } from './time-quantity';

describe('AmountParser', () => {
  describe('#parse', () => {
    const expectations: [string, Unit, Amount][] = [
      ['+1s 2w-3d', SECOND, { value: 950401, unit: SECOND }],
      ['howdy +1s 2w-3d', SECOND, null],
      ['\t8b 1B\n2kB', BIT, { value: 16016, unit: BIT }],
      ['8b1B2kB', BYTE, { value: 2002, unit: BYTE }],
      ['\t8b 1B\n2d howdy', BYTE, null],
      ['-555ms', MICROSECOND, { value: -555000, unit: MICROSECOND }],
    ];
    for (const expectation of expectations) {
      const value = expectation[0];
      const unit = expectation[1];
      const expectedResult = expectation[2];

      let expectedSimplifiedResult = expectedResult && {
        amount: expectedResult.value,
        unit: expectedResult.unit.symbol,
      };
      it(`should return ${$v(expectedSimplifiedResult)} for ${$v(value)}`, () => {
        const result = parseAmount(value, unit);
        if (expectedResult) {
          assert.strictEqual(result.value, expectedResult.value);
          assert.strictEqual(result.unit, expectedResult.unit);
        } else {
          assert.isNull(result);
        }
      });
    }
  });
});
