module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "plugins": ["solid"],
  "extends": ["eslint:recommended", "plugin:solid/recommended"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    ...require('./rules/js'),
    ...require('./rules/solid'),
  },
};