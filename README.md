#Intro

Instantiate Motor and call its `start()`.
It'll emit a `tick` event every 1 second (or close to it) passing the decimal and int number of seconds passed.

#Test

It uses Mocha/Chai. Run `npm t` to run tests.

#Babel

The original code is written in ES6 and compiled to ES5 using Babel.
When changing code, run `npm run build` to compile ES6 source.

#TODO

Update the inline documentation.
