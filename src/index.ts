import type { Tokenize } from './tokenize';
import type { Parse } from './parse';

type T = Tokenize<`"foo".bar`>;
type R = Parse<T>;
