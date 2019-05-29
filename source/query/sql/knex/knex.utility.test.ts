// tslint:disable:max-func-body-length
import { assert } from "chai";
import * as knex from "knex";
import { Dictionary } from "../../..";
import * as sinon from "sinon";
import { applySelectClause, validateFieldKey } from "./knex.utility";

describe("Query Helper", () => {
  const CORRELATION_NAMES: Dictionary<string> = {
    A: "Animal",
    P: "Animal",
    V: "Visit",
  };

  describe("#validateFieldKey", () => {
    it("with missing field keys", () => {
      try {
        validateFieldKey(undefined, CORRELATION_NAMES, "A");
        assert.fail(`It should fail with \`TypeError\`!`);
      } catch (error) {
        assert.match(error.message, /^Cannot read property/);
      }
    });

    it("with unknown entity", () => {
      try {
        validateFieldKey("X.id", CORRELATION_NAMES, "A");
        assert.fail(`It should fail with "Unknown entity" error!`);
      } catch (error) {
        assert.match(error.message, /^Unknown entity/);
      }
    });

    it("with fuzzy field key", () => {
      try {
        validateFieldKey("id", CORRELATION_NAMES);
        assert.fail(`It should fail with "Fuzzy field key" error!`);
      } catch (error) {
        assert.match(error.message, /^Fuzzy field key/);
      }
    });

    it("with simple field key & default correlation name", () => {
      const result = validateFieldKey("id", CORRELATION_NAMES, "A");
      assert.deepStrictEqual(result, ["A", "id"]);
    });

    it("with explicit field key & default correlation name", () => {
      const result = validateFieldKey("V.date", CORRELATION_NAMES, "A");
      assert.deepStrictEqual(result, ["V", "date"]);
    });
  });

  describe("#applySelectClause", () => {
    let queryBuilderSelectSpy: sinon.SinonSpy;
    let queryBuilder: knex.QueryBuilder;

    beforeEach(() => {
      queryBuilderSelectSpy = sinon.spy();
      queryBuilder = { select: queryBuilderSelectSpy } as any;
    });

    it("with missing clause", () => {
      applySelectClause(queryBuilder, undefined, CORRELATION_NAMES, "A");
      assert.isTrue(queryBuilderSelectSpy.calledOnce);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], ["A.*"]);
    });

    it("with simple field key & default correlation name", () => {
      applySelectClause(queryBuilder, ["id"], CORRELATION_NAMES, "A");
      assert.isTrue(queryBuilderSelectSpy.calledOnce);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], ["A.id"]);
    });

    it("with simple field key & default correlation name", () => {
      applySelectClause(queryBuilder, ["id"], CORRELATION_NAMES, "A");
      assert.isTrue(queryBuilderSelectSpy.calledOnce);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], ["A.id"]);
    });

    it("with explicit field key & default correlation name", () => {
      applySelectClause(queryBuilder, ["V.date"], CORRELATION_NAMES, "A");
      assert.isTrue(queryBuilderSelectSpy.calledOnce);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], ["V.date"]);
    });

    it("with aliased explicit field key & default correlation name", () => {
      applySelectClause(queryBuilder, [{ "V.date": "visitDate" }], CORRELATION_NAMES, "A");
      assert.isTrue(queryBuilderSelectSpy.calledOnce);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], [{ visitDate: "V.date" }]);
    });

    it("with aliased explicit field key", () => {
      applySelectClause(queryBuilder, [{ "V.date": "visitDate" }], CORRELATION_NAMES);
      assert.isTrue(queryBuilderSelectSpy.calledOnce);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], [{ visitDate: "V.date" }]);
    });

    it("with mixed field keys", () => {
      // prettier-ignore
      applySelectClause(queryBuilder, [
          'breed',
          { 'V.date': 'visitDate' },
          'A.birthDate'
        ],
        CORRELATION_NAMES,
        'A'
      );
      assert.strictEqual(queryBuilderSelectSpy.callCount, 3);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[0], ["A.breed"]);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[1], [{ visitDate: "V.date" }]);
      assert.deepStrictEqual(queryBuilderSelectSpy.args[2], ["A.birthDate"]);
    });
  });
});
