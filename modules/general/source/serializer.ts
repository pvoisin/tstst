/**
 * Object able to serialize the provided object.
 *
 * @type T Type of the object to serialize.
 * @type R Type of the value to return (offered for flexibility, usually `string`).
 */
export type Serializer<T, R extends string = string> = (value: T) => R;

export const DEFAULT_SERIALIZER: Serializer<unknown> = (value: unknown) => String(value);
