<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useUserStore } from '~~/stores/user'
import { useDisplayStore } from '~~/stores/display'
import { useSelectedStore } from '~/stores/selected'
import { useRouter } from '#imports'
import MagicLogo from '~/components/magic/MagicLogo.vue'

const ignoreRoutes = ['/admin', '/', '/login']

const frontierIgnoredRoutes = ['/data/purchases', '/analytics/prices', '/analytics/purchasing']

export default defineComponent({
  components: { MagicLogo },
  setup() {
    const router = useRouter()
    const display = useDisplayStore()
    const user = useUserStore()
    const selected = useSelectedStore()
    const routeWeightSort = (a: object, b: object) => {
      const WEIGHTKEY = 'weight'
      if (!(WEIGHTKEY in a.meta) && !(WEIGHTKEY in b.meta))
        return 0
      if (!(WEIGHTKEY in b.meta) || a.meta.weight > b.meta.weight)
        return -1
      if (!(WEIGHTKEY in a.meta) || a.meta.weight < b.meta.weight)
        return 1
      return 0
    }
    const topLevelRoutes = computed(() => {
      return router
        .getRoutes()
        .filter(route => route.path.split('/').length === 2)
        .filter(route => !ignoreRoutes.includes(route.path))
        .sort(routeWeightSort)
    })
    const secondLevelRoutes = computed(() => {
      let filteredRoutes = router
        .getRoutes()
        .filter(route => route.path.split('/').length === 3)
        .sort(routeWeightSort)
      if (selected.partnerId === 'frontier')
        filteredRoutes = filteredRoutes.filter(route => !frontierIgnoredRoutes.includes(route.path))

      return filteredRoutes
    })

    const localePath = p => p
    return { display, localePath, secondLevelRoutes, topLevelRoutes, user }
  },
})
</script>

<template>
  <nav class="sidebar-menu" :class="{ overlayed: display.overlaySidebar }">
    <ul class="nav flex-column nav-stacked">
      <NuxtLink :to="localePath('/')">
        <MagicLogo id="sidebar-logo" />
      </NuxtLink>

      <div v-if="user.admin" class="sidebar-select">
        <GroupSelect />
      </div>

      <NuxtLink id="dashboardLink" :to="localePath('/')">
        <li class="nav-link">
          {{ $t('dashboard.dashboard') }}
        </li>
      </NuxtLink>

      <li v-for="route in topLevelRoutes" :key="route.path" class="nav-link expandable-nav-link">
        <div
          class="nav-item d-flex justify-content-between collapsed"
          data-bs-toggle="collapse"
          :data-bs-target="`#collapse-${route.name}`"
          aria-expanded="true"
          :aria-controls="`collapse-${route.name}`"
        >
          <span>{{ route.name }}</span>
          <font-awesome-icon
            :icon="['far', 'chevron-down']"
            class="when-opened float-right"
            fixed-width
            transform="down-3"
          />
          <font-awesome-icon
            :icon="['far', 'chevron-right']"
            class="when-closed float-right"
            fixed-width
            transform="down-3"
          />
        </div>
        <div :id="`collapse-${route.name}`" class="collapse">
          <div class="subnav">
            <div
              v-for="subRoute in secondLevelRoutes.filter((sub) => sub.path.includes(route.path))"
              :key="subRoute.name"
              class="sub-route"
            >
              <NuxtLink :to="localePath(subRoute.path)">
                <div class="sub-route-item">
                  {{ subRoute.name.toString().replace(route.name, '').replace('-', '').replaceAll('-', ' ') }}
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </li>

      <NuxtLink id="logoutLink" :to="localePath('/login')">
        <li class="nav-link">
          {{ $t('login.logOut') }}
        </li>
      </NuxtLink>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.sidebar-menu {
  background-color: #efeeef;
  border-left: 10px solid var(--primary-colour);
  margin: 0;
  transition: all 0.25s ease-out 0s;
  position: fixed;
  top: 0;
  bottom: 0;
  left: -230px;
  width: 230px;
  max-width: 230px;
  flex-shrink: 0;
  z-index: 1000;
  padding-top: 0;
  overflow-y: scroll;

  @media screen and (min-width: 1025px) {
    left: 0;
    box-shadow: none;
  }
  &.overlayed {
    left: 0;
    box-shadow: none;
  }
}

#sidebar-logo {
  display: block;
  text-align: center;
  padding: 0.5em 1em;
}

.sidebar-select {
  padding: 0.5rem 1rem;
}
.nav > a {
  text-transform: capitalize;
  text-decoration: none;
}

.nav-item {
  text-transform: capitalize;
  color: #222;
  font-weight: 700;
  cursor: pointer;
}
.nav:not(.subnav) > a > li {
  color: #222;
  font-weight: 700;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.sub-route {
  padding-top: 1rem;
  text-transform: capitalize;
  :hover {
    color: var(--primary-colour);
  }
  > a {
    text-decoration: none;
    color: #222;
  }
  > .router-link-active {
    font-weight: 500;
  }
}
</style>
