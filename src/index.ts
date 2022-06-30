import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

import type { Tail } from './utils/arrayUtils';
import type { Cast } from './utils/generalUtils';

type T = Tokenize<`
if (foo) {
  log()
}
`>;
type R = Parse<T>[0];

// type Z = Cast<R, Array<any>>;
// type A = Tail<Tail<Z[1]>>;
// type B = R[0][1];
