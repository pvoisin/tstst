/** Mapping based on the keys of the specified model. */
export type Mapping<M, T = unknown> = { [key in keyof M]?: T };

/** Mapping based on the keys of the specified models. */
export type KeyMapping<M1, M2> = Mapping<M1, keyof M2>;
