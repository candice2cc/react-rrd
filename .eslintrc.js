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
        "indent": ["error", 4]
    }
};
