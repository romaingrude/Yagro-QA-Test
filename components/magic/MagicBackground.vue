<script setup>
import { useI18n } from 'vue-i18n'
import YBackground from '~~/components/elements/YBackground.vue'
import { useSelectedStore } from '~~/stores/selected'

const selected = useSelectedStore()
const { t } = useI18n()
</script>

<template>
  <YBackground :partner-id="selected.partnerId" :image-courtesy-of="t('general.imageCourtesyOf')" />
</template>
