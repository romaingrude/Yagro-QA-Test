<script lang="ts">
import { defineComponent } from 'vue'
import { useNuxtApp } from '#app'
import YAlert from '@/components/elements/YAlert.vue'

export default defineComponent({
  components: {
    YAlert,
  },
  setup() {
    const nuxtApp = useNuxtApp()
    const { alerts, removeAlert } = nuxtApp.$Yalert

    return {
      alerts,
      removeAlert,
    }
  },
})
</script>

<template>
  <div class="y-alert-list">
    <div class="y-alert-list__inner">
      <div class="y-alert-list__body">
        <YAlert
          v-for="alert in alerts"
          :id="alert.id"
          :key="alert.id"
          :title="alert.title"
          :text="alert.text"
          :mode="alert.mode"
          :is-dismissible="alert.isDismissible"
          :auto-dismiss="alert.autoDismiss"
          @close="removeAlert"
        />
      </div>
    </div>
  </div>
</template>

<style>
.y-alert-list {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  pointer-events: none;
  /* backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.2); */
}

.y-alert-list__inner {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  @media (--sm) {
    padding: 2rem;
  }
}

.y-alert-list__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (--sm) {
    width: 385px;
  }
}
</style>
