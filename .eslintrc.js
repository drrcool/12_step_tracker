module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'react-native',
    ],
    env: {
        'react-native/react-native': true,
        es6: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        // TypeScript specific rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // React specific rules
        'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        'react/prop-types': 'off', // Using TypeScript for prop validation
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // React Native specific rules
        'react-native/no-unused-styles': 'error',
        'react-native/split-platform-components': 'error',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-color-literals': 'warn',
        'react-native/no-raw-text': 'off', // Can be restrictive

        // General code quality rules
        'no-console': 'warn',
        'no-debugger': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'error',

        // Formatting rules
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
