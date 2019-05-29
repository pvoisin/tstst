import { Dictionary } from "..";

/**
 * Structure holding sort criteria, orderly.
 * It helps preparing SQL "order by" clauses.
 */
export interface SortCriteria extends Array<SortDirectionClause> {}

// Ideally, those would only have one entry but it's not possible to express it...
export interface SortDirectionClause extends Dictionary<SortOrder> {}

export enum SortOrder {
  ASCENDING = "ASC",
  DESCENDING = "DESC",
}
