// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    rules: {
      'eqeqeq': 'off',
      'vue/eqeqeq': 'off',
      'no-console': 'off',
      'vue/no-reserved-component-names': 'off',
    },
  },
)
