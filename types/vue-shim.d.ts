declare module '*.vue' {
  import type { defineComponent } from 'vue'

  const component: defineComponent
  export default component
}
