<script lang="ts">
import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedStore } from '~~/stores/selected'
import useFetchData from '~~/composables/useFetchData'

export default defineComponent({
  setup() {
    const selected = useSelectedStore()
    const { t } = useI18n()
    const analyticsEnabled = computed(() => true)

    const explorerEnabled = computed(() => true)

    const tradingEnabled = computed(() => true)

    const trackerEnabled = computed(() => true)

    const marketplaceEnabled = computed(() => true)

    const localePath = p => p // TODO: intlify nop stub, remove when using @nuxtjs/i18n

    const variables = ref({
      groupId: selected.group?.id,
    })

    watchEffect(() => {
      variables.value = {
        groupId: selected.group?.id,
      }
    })

    const insights = ref([])
    const { fetchedData: fetchedInsights } = useFetchData('insights/insights')

    const insightCanExpand = (insight) => {
      const insightTooLong = insight.content?.replace(/<.*?>/g, '')?.replace(/&nbsp;/g, ' ')?.length > 250
      const insightHasTallProps
        = insight.content?.includes('<img') || insight.content?.includes('<br') || insight.content?.includes('<li')
      return insightTooLong || insightHasTallProps
    }

    watch(fetchedInsights, (newVal) => {
      if (newVal) {
        insights.value = newVal
        insights.value[0].url = 'analytics/explorer/crop/172'
      }
    })

    const addInsightExpandProperties = (insightsArray) => {
      if (!insightsArray)
        return []
      for (const insight of insightsArray) {
        insight.canExpand = insightCanExpand(insight)
        insight.isExpanded = false
      }
      return insightsArray
    }

    const insightsData = computed(() => {
      if (!insights.value)
        return []
      const recentInsights = insights
      recentInsights.value = recentInsights.value
        .sort((a, b) => b.year - a.year || new Date(b.updated) - new Date(a.updated))
        .slice(0, 3)
      recentInsights.value = addInsightExpandProperties(recentInsights.value)
      return recentInsights
    })

    const toggleInsightExpanded = (insight) => {
      insight.isExpanded = !insight.isExpanded
    }

    const allInsightsExpanded = computed(() => {
      return insightsData?.value?.every(insight => insight.isExpanded || !insightCanExpand(insight))
    })

    const anyInsightCanExpand = computed(() => {
      return insightsData?.value?.some(insight => insightCanExpand(insight))
    })

    const toggleAllInsightsExpanded = (intendedExpandState) => {
      for (const insight of insightsData.value) {
        if (insight.canExpand)
          insight.isExpanded = intendedExpandState
      }
    }

    return {
      analyticsEnabled,
      explorerEnabled,
      insightsData,
      localePath,
      marketplaceEnabled,
      selected,
      t,
      trackerEnabled,
      tradingEnabled,
      toggleInsightExpanded,
      toggleAllInsightsExpanded,
      addInsightExpandProperties,
      allInsightsExpanded,
      anyInsightCanExpand,
    }
  },
})
</script>

<template>
  <div>
    <div v-if="insightsData.length" class="my-5">
      <div class="d-flex justify-content-between">
        <h3 class="my-3">
          {{ t('insights.latestInsights') }}
        </h3>
        <YButton v-if="anyInsightCanExpand" type="link" @click="toggleAllInsightsExpanded(!allInsightsExpanded)">
          {{ allInsightsExpanded ? $t('general.collapseAll') : $t('general.expandAll') }}
          <font-awesome-icon :icon="['far', allInsightsExpanded ? 'angle-down' : 'angle-up']" />
        </YButton>
      </div>
      <ul class="list-group">
        <li
          v-for="insight in insightsData"
          :id="insight.id"
          :key="insight.id"
          class="list-group-item list-group-item-action overflow-hidden"
        >
          <div class="d-flex w-100 justify-content-between align-items-center">
            <div
              class="mt-2 px-2"
              :class="{ 'collapsed-insight insight-fade-text': insight.canExpand && !insight.isExpanded }"
            >
              <small class="text-muted">{{ insight.year }}</small>
              <span class="text-break" v-html="insight.content" />
            </div>
            <nuxt-link class="px-2 pt-4" :to="insight.url">
              <font-awesome-icon v-if="insight.url" :icon="['far', 'link']" size="sm" />
            </nuxt-link>
          </div>
          <YButton
            v-if="insight.canExpand"
            class="pb-2 mt-1 px-0 ps-2"
            type="link"
            @click="toggleInsightExpanded(insight)"
          >
            {{ insight.isExpanded ? $t('general.seeLess') : $t('general.seeMore') }}
          </YButton>
        </li>
      </ul>
    </div>
    <div v-if="analyticsEnabled || explorerEnabled" class="highlighted-item mb-4 bg-dove-grey">
      <div class="row">
        <div class="col-md-6 mb-3 mb-md-0">
          <div class="p-3">
            <h3 class="h5">
              {{ t('feature.analytics') }}
            </h3>
            <p>{{ t('analytics.description') }}</p>
            <nuxt-link v-if="explorerEnabled" :to="localePath('/analytics/explorer')" class="btn btn-primary">
              {{ t('general.navigateTo', { page: t('feature.explorer') }) }}
            </nuxt-link>
            <nuxt-link v-else :to="localePath('/')" class="btn btn-primary">
              {{ t('general.learnMoreAbout', { feature: t('feature.analytics') }) }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12 col-md-6 mb-4 mb-md-0 d-flex">
        <div class="bg-dove-grey p-3 flex-grow d-flex flex-column justify-content-between">
          <h3 class="h5">
            {{ t('feature.tracker') }}
          </h3>
          <p>{{ t('tracker.description') }}</p>
          <div>
            <nuxt-link v-if="trackerEnabled" :to="localePath('/tracker/crop-progress')" class="btn btn-outline-primary">
              {{ t('tracker.cropProgressInfoShort') }}
            </nuxt-link>
            <nuxt-link v-else :to="localePath('/')" class="btn btn-primary">
              {{ t('tracker.learnAboutTracker') }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-if="marketplaceEnabled" class="col-12 col-md-6 mb-4 mb-md-0 d-flex">
        <div class="bg-dove-grey p-3 flex-grow d-flex flex-column justify-content-between">
          <h3 class="h5">
            {{ t('feature.marketplace') }}
          </h3>
          <p>{{ t('marketplace.description') }}</p>
          <div>
            <nuxt-link :to="localePath('/')" class="btn btn-outline-primary">
              {{ t('marketplace.requestProducts') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapsed-insight {
  max-height: 89px;
  overflow: hidden;
}

.insight-fade-text {
  -webkit-mask-image: linear-gradient(to bottom, #000 83%, transparent);
  mask-image: linear-gradient(to bottom, #000 83%, transparent);
}
</style>
