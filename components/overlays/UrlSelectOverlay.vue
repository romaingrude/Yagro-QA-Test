<script>
import { defineComponent } from 'vue'
import { useUserStore } from '~~/stores/user'
import { useApplicationStore } from '~~/stores/application'
import Namespaces from '~/api/namespaces.json'

export default defineComponent({
  setup() {
    const user = useUserStore()
    const application = useApplicationStore()
    const namespaceOptions = Object.keys(Namespaces)
    return {
      user,
      application,
      namespaceOptions,
    }
  },
})
</script>

<template>
  <div v-if="user.isAdmin" class="header-mobile">
    <div />
    <div>
      <label for="namespace">Namespace: </label>
      <select v-model="application.$state.namespace" name="namespace">
        <option v-for="namespace in namespaceOptions" :key="namespace" :value="namespace">
          <span class="text-capitalize">{{ namespace }}</span>
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-mobile {
  box-shadow: 0 1px 5px -1px rgba(25, 25, 25, 0.5);
  z-index: 55;
  height: 70px;
  position: fixed;
  top: 0;
  right: 0;
  background-color: #eee;
  padding: 0.25em 0.5em;
  justify-content: space-between;
  display: flex;
  align-items: center;
  z-index: 1001;

  @media (max-width: 1025px) {
    width: 100vw;
  }
}
.fa-bars {
  cursor: pointer;
}
.logo-wrapper {
  max-height: 70px;
  padding: 5px;
}
</style>
