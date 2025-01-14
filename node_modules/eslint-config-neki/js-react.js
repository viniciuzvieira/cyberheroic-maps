module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": ["airbnb"],
  "rules": {
    ...require('./rules/js'),
    ...require('./rules/react'),
  }
};