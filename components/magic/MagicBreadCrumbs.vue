<script lang="ts">
import { computed, defineComponent } from 'vue'
import YBreadcrumbs from '~~/components/elements/YBreadcrumbs.vue'
import { useRoute, useRouter } from '#imports'
import { useSelectedStore } from '~~/stores/selected'

export default defineComponent({
  components: { YBreadcrumbs },
  setup() {
    const selected = useSelectedStore()
    const router = useRouter()

    const route = useRoute()

    const currentPath = computed(() => router.currentRoute.value)
    const matchedPath = computed(() => currentPath.value.matched[0].path)
    const pathElements = computed(() => matchedPath.value.split('/'))
    const relevantLinks = computed(() => {
      const possiblePaths = []
      for (const i in pathElements.value)
        possiblePaths.push(pathElements.value.slice(0, i).join('/'))

      possiblePaths.push(matchedPath.value)
      return router
        .getRoutes()
        .filter(route => possiblePaths.includes(route.path))
        .sort((a, b) => (a.path.length > b.path.length ? 1 : -1))
    })
    const breadcrumbs = computed(() => {
      const crumbs = []
      let lastSeenPath = ''
      for (const link of relevantLinks.value) {
        if (link.path === '/') {
          lastSeenPath = '/'
          continue
        }
        const label = link.path.replace(lastSeenPath, '').replaceAll('/', '').replace('-', ' ')
        if (label.includes('field_id')) {
          crumbs.push({
            label: selected.selected_field?.name ?? 'field',
            onClick: () => {
              router.push(
                link.path
                  .replace(':crop_id()', selected.selected_crop.id)
                  .replace(':variety_id()', selected.selected_variety.id)
                  .replace(':field_id()', selected.selected_field.id),
              )
            },
          })
        }
        else if (label.includes('variety_id')) {
          crumbs.push({
            label: selected.selected_variety?.name ?? 'variety',
            onClick: () => {
              selected.setField(null)
              router.push(
                link.path
                  .replace(':crop_id()', selected.selected_crop.id)
                  .replace(':variety_id()', selected.selected_variety.id),
              )
            },
          })
        }
        else if (label.includes('crop_id')) {
          crumbs.push({
            label: selected.selected_crop?.name ?? 'crop',
            onClick: () => {
              selected.setField(null)
              selected.setVariety(null)
              router.push(link.path.replace(':crop_id()', selected.selected_crop.id))
            },
          })
        }
        else if (label.includes('product_id')) {
          crumbs.push({
            label: selected.selected_product?.name ?? 'product',
            onClick: () => {
              selected.setProduct(null)
              router.push(link.path.replace(':product_id()', selected.selected_product.id))
            },
          })
        }
        else if (label.includes('commodity_ticker')) {
          const routeTicker = computed(() => {
            if (!route.fullPath)
              return null
            const tickerParts = route.fullPath.split('/').reverse()
            if (tickerParts.length)
              return tickerParts[0]

            return null
          })
          crumbs.push({
            label: routeTicker.value ?? 'ticker',
          })
        }
        else {
          crumbs.push({
            label,
            onClick: () => {
              router.push(link.path)
            },
          })
        }
        lastSeenPath = label
      }
      return crumbs
    })
    return { breadcrumbs, currentPath, relevantLinks }
  },
})
</script>

<template>
  <YBreadcrumbs :items="breadcrumbs" />
</template>
