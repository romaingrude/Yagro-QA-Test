<script setup>
import YLogo from '~~/components/elements/YLogo.vue'
import { useSelectedStore } from '~~/stores/selected'

const selected = useSelectedStore()
</script>

<template>
  <YLogo :partner-id="selected.partnerId" />
</template>
