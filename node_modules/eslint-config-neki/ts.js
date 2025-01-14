module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["airbnb-base", "airbnb-typescript/base"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    ...require('./rules/js'),
    ...require('./rules/ts'),
  },
};