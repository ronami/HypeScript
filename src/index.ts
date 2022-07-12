import type { Tokenize } from './tokenizer';
import type { Parse } from './parser';
import type { Check } from './checker';

type T = Tokenize<`

const a = [1, "a"][0]

const hello: string = {hello: "world", foo: a};

`>;
type R = Parse<T>;
type C = Check<R>;
