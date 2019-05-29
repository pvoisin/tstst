import { Dictionary } from "../..";
import { Condition, PredicateSet } from "../../logic";

export interface SelectClause extends Array<string | Dictionary<string>> {}
export interface FromClause extends Dictionary<string> {}
export interface JoinClause<P extends PredicateSet> extends Condition<P> {}
export interface WhereClause<P extends PredicateSet> extends Condition<P> {}

export enum JoinType {
  LEFT,
  INNER,
  RIGHT,
  FULL,
}

export interface Query<A, B> {
  /**
   * Object responsible for invoking the underlying database facade.
   * Example: `knex`
   */
  adaptor: A;

  /**
   * Object used to prepare the query before it is handled by the underlying DB client API.
   * Example: `knex.QueryBuilder`
   */
  builder: B;

  /** Correlation names used to refer to the targeted entities. */
  correlationNames: Dictionary<string>;

  applySelectClause: (clause: SelectClause) => Query<A, B>;
  applyFromClause: (clause: FromClause) => Query<A, B>;
  applyWhereClause: <P>(clause: WhereClause<P>) => Query<A, B>;
  applyJoinClause: <P>(clause: JoinClause<P>, joinType?: JoinType) => Query<A, B>;
}

/**
 * Validates the provided field key against the given correlation names.
 *
 * @param fieldKey Field key to validate.
 * @param correlationNames Correlation names against which to validate the specified field key.
 * @param correlationName Default correlation name to consider if the specified field key only contains the targeted field's name.
 */
export function validateFieldKey(
  fieldKey: string,
  correlationNames: Dictionary<string>,
  correlationName?: string
): [string, string] {
  const parts = fieldKey.split(".");

  // Example: "ASSIGNMENT.roleId"
  if (parts.length > 2) {
    throw new Error(`Invalid field key! \`${fieldKey}\``);
  }

  let entityName: string;
  let fieldName: string;
  if (parts.length > 1) {
    entityName = parts[0];
    fieldName = parts[1];
  } else {
    fieldName = parts[0];
  }

  // Validate the specified field against the correlation names, if provided:
  if (correlationNames && Object.keys(correlationNames).length > 0) {
    // If the entity name is provided it should be known!
    if (entityName) {
      if (!(entityName in correlationNames)) {
        throw new Error(`Unknown entity! \`${entityName}\``);
      }
    }
    // Otherwise, the default correlation name should be provided!
    else {
      if (!correlationName) {
        throw new Error(`Fuzzy field key! \`${fieldKey}\``);
      }

      entityName = correlationName;
    }
  }

  return [entityName, fieldName];
}
