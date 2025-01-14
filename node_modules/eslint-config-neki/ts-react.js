module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["airbnb", "airbnb-typescript"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    ...require('./rules/js'),
    ...require('./rules/ts'),
    ...require('./rules/react'),
  },
};