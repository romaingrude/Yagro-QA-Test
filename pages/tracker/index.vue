<script lang="ts">
import { defineComponent } from 'vue'
import { definePageMeta } from '#imports'

export default defineComponent({
  setup() {
    definePageMeta({
      weight: 10,
    })
    const localePath = p => p
    return { localePath }
  },
})
</script>

<template>
  <div class="container content">
    <div>
      <h1>{{ $t('feature.tracker') }}</h1>
    </div>
    <div class="highlighted-item mb-4">
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="p-3 bg-dove-grey">
            <h3 class="h5">
              {{ $t('feature.cropProgress') }}
            </h3>
            <p>{{ $t('tracker.cropProgressInfo') }}</p>

            <nuxt-link :to="localePath('/tracker/crop-progress')" class="btn btn-primary">
              {{ $t('general.navigateTo', { page: $t('feature.cropProgress') }) }}
            </nuxt-link>
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <div class="p-3 bg-dove-grey">
            <h3 class="h5">
              {{ $t('feature.budgets') }}
            </h3>
            <p>{{ $t('tracker.budgetsInfo') }}</p>

            <nuxt-link :to="localePath('/tracker/budgets')" class="btn btn-primary">
              {{ $t('general.navigateTo', { page: $t('feature.budgets') }) }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
