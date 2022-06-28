// const result = require('@babel/core').parse('function foo (hello: string) {}', {
//   sourceType: 'module',
//   plugins: [require.resolve('@babel/plugin-syntax-typescript')],
//   //   sourceFilename: 'foo.ts',
//   //   tokens: true,
// });

// console.log(result);

const result = require('@babel/parser').parse('foo.bar()', {
  sourceType: 'module',
  plugins: [
    ['typescript', { disallowAmbiguousJSXLike: undefined }],
    'classProperties',
    'objectRestSpread',
  ],
  ranges: false,
  //   sourceFilename: 'foo.ts',
  tokens: true,
});

// console.log(result.tokens);
console.log(JSON.stringify(result.program.body, null, 2));
