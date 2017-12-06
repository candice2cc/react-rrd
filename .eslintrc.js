/**
 *
 * eslint 配置
 */
module.exports = {
    "extends": ["airbnb-base","plugin:react/recommended"],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "commonjs": true
    },
    "plugins": [
        "react"
    ],
    "globals": {
        "noxH5ActiveAd":false
    },

    "rules": {
        "indent": ["error", 4],
        "no-mixed-operators": "warn",
        "prefer-destructuring":"warn",
        "prefer-const":"off",
        "no-underscore-dangle":"off",
        "no-throw-literal":"error",
        "no-param-reassign":"error",
        "no-lone-blocks":"error",
        "no-new": "error",
        "class-methods-use-this": "warn",
        "consistent-return": "warn",
    }
};
