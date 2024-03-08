<script lang="ts">
import { computed, defineComponent } from 'vue'
import YIcon from './YIcon.vue'
import YButton from './YButton.vue'

export default defineComponent({
  name: 'YAlert',
  components: {
    YButton,
    YIcon,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isInfo: {
      type: Boolean,
      required: false,
      default: false,
    },
    primaryButtonText: {
      type: String,
      required: false,
      default: 'Cancel',
    },
    secondaryButtonText: {
      type: String,
      required: false,
      default: 'Save',
    },
    footerDisplay: {
      type: Boolean,
      required: false,
      default: true,
    },
    withScrollBar: {
      type: Boolean,
      required: false,
      default: false,
    },
    modalSize: {
      type: String,
      required: false,
      default: '600px',
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const isShow = computed(() => props.show)

    const cssProps = computed(() => {
      return {
        '--modal-size': props.modalSize,
      }
    })

    const closeModal = () => {
      emit('close')
    }

    const saveModal = () => {
      emit('save')
    }

    return {
      isShow,
      closeModal,
      saveModal,
      cssProps,
    }
  },
})
</script>

<template>
  <div>
    <Transition name="fade" appear>
      <div v-if="isShow" class="y-modal-overlay" @click="closeModal" />
    </Transition>
    <Transition name="slide" appear>
      <div v-if="show" class="y-modal" :style="cssProps">
        <YButton class="y-modal-close" @click="closeModal">
          <YIcon name="icon-close" />
        </YButton>
        <header v-if="title" :class="withScrollBar ? 'y-modal-header-scrollbar' : 'y-modal-header'">
          <div v-if="title" class="y-modal-title">
            {{ title }}
          </div>
        </header>
        <div class="y-modal-content">
          <div :class="withScrollBar ? 'y-modal-content-scrollbar' : 'y-modal-content-no-scrollbar'">
            <slot name="content" />
          </div>
        </div>
        <footer v-if="footerDisplay" class="y-modal-footer">
          <slot v-if="$slots.footer" name="footer" />
          <ul v-else class="y-modal-list">
            <li>
              <YButton id="primary-button" class="btn light" @click="closeModal">
                {{ primaryButtonText }}
              </YButton>
            </li>
            <li>
              <YButton v-if="!isInfo" id="secondary-button" variant="primary" @click="saveModal">
                {{ secondaryButtonText }}
              </YButton>
            </li>
          </ul>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<style>
.y-modal-overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.y-modal {
  position: fixed;
  overflow-y: initial !important;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  z-index: 9999;
  width: 100%;
  max-width: var(--modal-size);
  background-color: #fff;
  border-radius: 0.25rem;
}

.y-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  margin-left: auto;
  width: 1rem;
  height: 1rem;
  overflow: hidden;
  transition: color 0.2s ease-in-out;
  appearance: none;
  border: none;
  background-color: transparent;
  padding: 0;
  color: var(--color-text);

  .y-icon {
    display: block;
  }

  @mixin hover {
    color: var(--color-primary);
  }
}
.y-modal-header {
  padding: 32px 40px 32px;
}

.y-modal-header-scrollbar {
  padding: 32px 40px 32px;
  box-shadow: 0 2px 2px rgba(206, 212, 218, 0.35);
}

.y-modal-title {
  font-weight: 600;
  font-size: 24px;
}

.y-modal-content {
  padding: 0 0 48px;
}

.y-modal-content-no-scrollbar {
  padding: 0 40px 0;
}
.y-modal-content-scrollbar {
  margin-right: 8px;
  padding-left: 40px;
  padding-right: 32px;
  height: 600px;
  overflow-y: auto;
  background:
    /* Shadow Cover TOP */
    linear-gradient(white 30%, rgba(255, 255, 255, 0)) center top,
    /* Shadow Cover BOTTOM */ linear-gradient(rgba(255, 255, 255, 0), white 70%) center bottom,
    /* Shadow TOP */ linear-gradient(rgba(206, 212, 218, 0.35), white 70%) center top,
    /* Shadow BOTTOM */ radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)) center bottom;

  background-repeat: no-repeat;
  background-size:
    100% 30px,
    100% 30px,
    100% 16px,
    100% 16px;
  background-attachment: local, local, scroll, scroll;
}

::-webkit-scrollbar {
  width: 8px;
  margin-top: 12px;
}

::-webkit-scrollbar-track {
  border: solid 3px transparent;
  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: rgba(230, 233, 236, 1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
}

.y-modal-footer {
  padding: 32px 40px;
  background-color: rgba(243, 245, 246, 1);
}

.y-modal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1rem;
  display: flex;
  justify-content: flex-end;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-100vw) translateX(-50%);
}

.btn.light {
  background-color: transparent;
  color: black;
  border-color: transparent;
}

.btn.light:active,
.btn.light:hover,
.btn.light:focus {
  background-color: rgba(108, 117, 125, 1) !important;
}
</style>
