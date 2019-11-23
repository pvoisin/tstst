/**
 * Object able to create another object of the specified type.
 *
 * @type T Type of the object to create.
 */
export interface Factory<T> {
  create(...options: unknown[]): T;
}
