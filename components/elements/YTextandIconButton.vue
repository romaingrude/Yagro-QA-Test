<script lang="ts">
import YIcon from './YIcon.vue'

export default defineComponent({
  name: 'YTextandIconButton',
  components: { YIcon },
  props: {
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
})
</script>

<template>
  <div class="y-text-and-icon-button" data-cy="y-text-and-icon-button">
    <button class="y-text-and-icon-button__button" type="button" :aria-label="text" @click="$emit('click')">
      <div class="y-text-and-icon-button__inner">
        <p v-if="text" class="y-text-and-icon-button__text">
          {{ text }}
        </p>
        <div v-if="icon" class="y-text-and-icon__icon">
          <YIcon :name="icon" />
        </div>
      </div>
    </button>
  </div>
</template>

<style lang="scss">
.y-text-and-icon-button {
  line-height: 1;
}

.y-text-and-icon-button__text {
  margin: 0;
  transition: color var(--transition-fastest);
  .y-text-and-icon-button:hover & {
    color: var(--secondary-colour);
  }
}

.y-text-and-icon-button__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.y-text-and-icon-button__button {
  appearance: none;
  border: none;
  background: none;
  padding: 0;
}

.y-text-and-icon__icon {
  border: 1px solid;
  border-radius: 2px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-colour);
  transition: color var(--transition-fastest);

  .y-text-and-icon-button:hover & {
    color: var(--secondary-colour);
  }
}
</style>
