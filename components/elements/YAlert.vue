<!-- eslint-disable vue/no-v-html -->

<!--
-------------------------------------------------------------------------------
YAlert
-------------------------------------------------------------------------------
Description
An alert component that works in conjunction with the YAlertList component.
This requires a store to be set up to handle the state of the alerts.

-------------------------------------------------------------------------------
Usage (in a component)
-------------------------------------------------------------------------------
<YAlert
  id="unique-id"
  title="Alert title"
  text="Alert text"
  mode="info"
  :is-dismissible="true"
  :auto-dismiss="true"
>
  <template #primaryAction>
    <YButton
      text="Primary action"
      mode="primary"
      @click="doSomething"
    >
      doSomething
    </YButton>
  </template>
</YAlert>

-------------------------------------------------------------------------------
Usage (Programmatically)
-------------------------------------------------------------------------------

<script>
  setup() {
    const nuxtApp = useNuxtApp();

    const showAlert = () => {
      nuxtApp.$Yalert.addAlert({ title: 'Alert Title' });
    };

    return {
      showAlert,
    };
  }
</script>

-------------------------------------------------------------------------------
-->

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import YIcon from './YIcon.vue'

export default defineComponent({
  name: 'YAlert',
  components: {
    YIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'info',
    },
    isDismissible: {
      type: Boolean,
      default: true,
    },
    autoDismiss: {
      type: Boolean,
      default: false,
    },
    /*
      7 seconds is considered a good default maximum.
      https://ux.stackexchange.com/a/85897
    */
    autoDismissTime: {
      type: Number,
      default: 7000,
    },
    /* Temporary to test design request */
    textColor: {
      type: String,
      default: '',
    },
  },
  emits: ['open', 'close', 'toggle'],
  setup(props, { emit }) {
    /* Translation library */
    const { t } = useI18n()

    /* Data / Computed values */
    const hideAfter = ref(props.autoDismissTime)
    const isVisible = ref(true)

    const modeClass = computed(() => {
      if (!props.mode)
        return

      return `y-alert--${props.mode}`
    })

    /* Methods */
    const toggle = () => {
      isVisible.value = !isVisible.value
      emit('toggle')
    }

    const close = () => {
      isVisible.value = false
      emit('close', props.id)
    }

    const open = () => {
      isVisible.value = true
      emit('open')
    }

    const dismissAlertAfterTimeout = () => {
      if (hideAfter.value > 0) {
        setTimeout(() => {
          isVisible.value = false
        }, hideAfter.value)
      }
    }

    onMounted(() => {
      if (props.autoDismiss === true)
        dismissAlertAfterTimeout()
    })

    return {
      t,
      modeClass,
      isVisible,
      toggle,
      close,
      open,
      dismissAlertAfterTimeout,
    }
  },
})
</script>

<template>
  <Transition name="list" mode="out-in">
    <div v-if="isVisible" :class="`y-alert ${modeClass}`" :style="`color: ${textColor}`">
      <div class="y-alert__inner">
        <button v-if="$props.isDismissible" class="y-alert__close" @click="close()">
          <span class="y-alert__close-text">
            {{ t('yAlert.close') }}
          </span>
          <YIcon name="icon-close" />
        </button>

        <header class="y-alert__header">
          <div class="y-alert__icon">
            <YIcon :name="`icon-${mode}`" :thing="`icon-${mode}`" :another-thing="`icon-${mode}`" />
          </div>
          <div v-if="title" class="y-alert__title">
            {{ title }}
          </div>
        </header>

        <div v-if="text || $slots.text" class="y-alert__body">
          <div v-if="text" class="y-alert__text" v-html="text" />
          <slot v-if="$slots.text" class="y-alert__text" name="text" />
        </div>

        <footer v-if="$slots.primaryAction || $slots.secondaryAction" class="y-alert__footer">
          <ul class="y-alert__list">
            <li v-if="$slots.secondaryAction" class="y-alert__list-item y-alert__list-item--secondary">
              <slot name="secondaryAction" />
            </li>
            <li v-if="$slots.primaryAction" class="y-alert__list-item y-alert__list-item--primary">
              <slot name="primaryAction" />
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style>
.y-alert {
  pointer-events: initial;
  position: relative;
  -webkit-font-smoothing: antialiased;
  border-top: 4px solid var(--color-active-theme);
  color: var(--color-text);
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0px 4px 16px 2px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  background-color: var(--color-white);
  transition: all 0.2s ease-in-out;

  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  .y-alert-list & {
    margin-top: 0;
    margin-bottom: 0;
  }
}

.y-alert__close-text {
  @mixin screen-reader-only;
}

.y-alert__header {
  padding-top: 1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  line-height: 1;
}

.y-alert__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  margin-left: auto;
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  overflow: hidden;
  transition: color 0.2s ease-in-out;
  color: var(--color-active-theme);
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  color: var(--color-text);

  .y-icon {
    display: block;
  }

  @mixin hover {
    color: var(--color-primary);
  }
}

.y-alert__icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  transition: color 0.2s ease-in-out;
  color: var(--color-active-theme);
}

.y-alert__title {
  font-weight: 500;
  margin-bottom: -3px;
}

.y-alert__text {
  font-weight: 400;
  margin: 0;
}

.y-alert__body {
  padding-left: 3rem;
  padding-right: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.y-alert__footer {
  margin-top: -0.5rem;
  padding-left: 3rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  font-size: 14px;
}

.y-alert__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem;
}

.y-alert__list-item {
  min-width: 0;
}

.y-alert__action {
  appearance: none;
  border: none;
  background-color: transparent;
  color: inherit;
  padding: 0;
}

/* Modifiers */
.y-alert--info {
  --color-active-theme: var(--color-status-info);
  --color-active-theme-background: var(--color-status-info-lightest);
  @mixin hover {
    background-color: var(--color-active-theme-background);
  }
}

.y-alert--success {
  --color-active-theme: var(--color-status-success);
  --color-active-theme-background: var(--color-status-success-lightest);
  @mixin hover {
    background-color: var(--color-active-theme-background);
  }
}

.y-alert--warning {
  --color-active-theme: var(--color-status-warning);
  --color-active-theme-background: var(--color-status-warning-lightest);
  @mixin hover {
    background-color: var(--color-active-theme-background);
  }
}

.y-alert--danger {
  --color-active-theme: var(--color-status-danger);
  --color-active-theme-background: var(--color-status-danger-lightest);
  @mixin hover {
    background-color: var(--color-active-theme-background);
  }
}
</style>
