import cypress from 'eslint-plugin-cypress/flat';

export default [
  cypress.configs['recommended'],
  {
    // Override or add rules here
    rules: {},
  },
];
