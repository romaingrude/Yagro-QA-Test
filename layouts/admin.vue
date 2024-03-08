<script setup>
import { useUserStore } from '~/stores/user'

const nuxtApp = useNuxtApp()
const user = useUserStore()

onMounted(() => {
  if (!user.user.auth_token)
    nuxtApp.$router.push({ path: '/login' })

  if (!user.admin)
    nuxtApp.$router.push({ path: '/' })
})
</script>

<template>
  <div class="d-flex">
    <MainSidebar />
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  padding: 2em 1em;
  margin-left: 230px;
}
</style>
