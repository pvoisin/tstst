import { assert } from "chai";
import { getCollectionRepresentation as $c } from "./collection.utility";
import { extract, prefix, suffix } from "./string.utility";
import { getValueRepresentation as $v } from "./utility";

describe("String Utility", () => {
  describe("#prefix", () => {
    it("should work properly", () => {
      assert.strictEqual(prefix(undefined, "A"), undefined);
      assert.strictEqual(prefix(null, "A"), null);
      assert.strictEqual(prefix("BC", null), "BC");
      assert.strictEqual(prefix("BC", undefined), "BC");
      assert.strictEqual(prefix("BC", "A"), "ABC");
    });
  });

  describe("#suffix", () => {
    it("should work properly", () => {
      assert.strictEqual(suffix(undefined, "C"), undefined);
      assert.strictEqual(suffix(null, "C"), null);
      assert.strictEqual(suffix("AB", null), "AB");
      assert.strictEqual(suffix("AB", undefined), "AB");
      assert.strictEqual(suffix("AB", "C"), "ABC");
    });
  });

  describe("#extract", () => {
    const pattern = /\s*((?:\+|-)?\d)([a-zA-Z])/;

    const expectations: { parameters: [string, RegExp, boolean?]; expectedResults: string[][] }[] = [
      {
        parameters: ["howdy +1s 2w-3d", pattern, true],
        expectedResults: null,
      },
      {
        parameters: ["howdy +1s 2w-3d", pattern],
        expectedResults: [
          ["+1", "s"],
          ["2", "w"],
          ["-3", "d"],
        ],
      },
      {
        parameters: ["\t8b1B\n2d howdy", pattern],
        expectedResults: [
          ["8", "b"],
          ["1", "B"],
          ["2", "d"],
        ],
      },
      {
        parameters: ["\t8b1B\n2d howdy", pattern, true],
        expectedResults: null,
      },
    ];

    for (const expectation of expectations) {
      const subject = expectation.parameters[0];

      let title = `should return ${$c(expectation.expectedResults)} for ${$v(subject)}`;
      if (expectation.parameters[2]) {
        title += " (strict)";
      }
      it(title, () => {
        assert.deepStrictEqual(extract.apply(null, expectation.parameters), expectation.expectedResults);
      });
    }
  });
});
