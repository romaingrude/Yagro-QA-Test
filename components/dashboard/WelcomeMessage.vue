<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '~/stores/user'

export default defineComponent({
  computed: {
    user() {
      return useUserStore()
    },

    welcomeMessage() {
      const hours = new Date().getHours()

      if (hours > 0 && hours < 12)
        return this.$t('dashboard.good_morning', { name: this.user.group.name })
      else if (hours >= 12 && hours < 18)
        return this.$t('dashboard.good_afternoon', { name: this.user.group.name })
      else
        return this.$t('dashboard.good_evening', { name: this.user.group.name })
    },
  },
})
</script>

<template>
  <h1 class="mb-3">
    {{ welcomeMessage }}
  </h1>
</template>
