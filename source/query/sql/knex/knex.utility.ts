import * as knex from "knex";
import { Dictionary, isString } from "../../..";
import { FromClause, JoinClause, JoinType, Query, SelectClause, WhereClause } from "../sql.utility";

export class KnexQuery implements Query<knex, knex.QueryBuilder> {
  adaptor: knex;
  builder: knex.QueryBuilder;
  correlationNames: Dictionary<string>;

  constructor(adaptor: knex, correlationNames: Dictionary<string>) {
    this.adaptor = adaptor;
    this.correlationNames = { ...correlationNames };
    this.builder = this.getQueryBuilder();
  }

  protected getQueryBuilder(): knex.QueryBuilder {
    return this.adaptor.queryBuilder();
  }

  applySelectClause(clause: SelectClause): KnexQuery {
    applySelectClause(this.builder, clause);
    return this;
  }

  applyFromClause<P>(clause: FromClause): KnexQuery {
    // TODO
    return this;
  }

  applyWhereClause<P>(clause: WhereClause<P>): KnexQuery {
    // TODO
    return this;
  }

  applyJoinClause<T>(clause: JoinClause<T>, joinType?: JoinType): KnexQuery {
    // TODO
    return this;
  }
}

export function applySelectClause(
  queryBuilder: knex.QueryBuilder,
  clause: SelectClause = ["*"],
  correlationNames?: Dictionary<string>,
  correlationName?: string
) {
  if (clause && clause.length > 0) {
    for (const item of clause) {
      // Either it is a single field reference:
      if (isString(item)) {
        const fieldKey: string = item;
        const [entityName, fieldName] = validateFieldKey(fieldKey, correlationNames, correlationName);
        queryBuilder.select(`${entityName}.${fieldName}`);
      }
      // Or, it is a collection of field references with their aliases:
      else {
        const fieldKeys: Dictionary<string> = {};
        for (const fieldKey of Object.keys(item)) {
          const [entityName, fieldName] = validateFieldKey(fieldKey, correlationNames, correlationName);
          fieldKeys[item[fieldKey]] = `${entityName}.${fieldName}`;
        }
        queryBuilder.select(fieldKeys);
      }
    }
  }
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
