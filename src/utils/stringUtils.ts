export type EatFirstChar<T> = T extends `${infer A}${infer B}` ? B : '';

export type FirstChar<T> = T extends `${infer A}${infer B}` ? A : '';

export type ConcatStrings<A extends string, B extends string> = `${A}${B}`;
