<!-- YToggle

  Renders a toggle switch. Functions like a checkbox internally, where
  the left position is "off" and the right position is "on".

  Props:
    * isDisabled: Whether the toggle switch should be disabled, i.e.
      unable to switch. This defaults to false.
    * isChecked: Whether to render the toggle switch in an "on" state
      (in the right position). This defaults to false. Passing a variab-
      le here binds the checked state to that variable.

  Emits:
    * switchFunc: The callable to call upon switching. Normally, this
      would be a function that switches the `isChecked` variable.
-->
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['switchFunc'],
  setup(props, { emit }) {
    const switchFunc = () => {
      emit('switchFunc')
    }
    return { switchFunc }
  },
})
</script>

<template>
  <div class="switch-container">
    <label class="switch-container__label" :class="{ disabled: isDisabled }">
      <input
        name="slider"
        type="checkbox"
        class="switch-container__input"
        :disabled="isDisabled"
        :checked="isChecked"
        @click="switchFunc()"
      >
      <span class="switch-container__span" />
    </label>
  </div>
</template>

<style scoped>
.switch-container {
  display: inline-flex;
  margin-left: 10px;
}
.switch-container__label {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 15px;
  margin: 0;
}

.switch-container__input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-container__span {
  position: absolute;
  cursor: pointer;
  border: 1px solid #cac8cb;
  top: 0;
  left: 0;
  right: 9px;
  bottom: 0;
  background-color: #fff;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.switch-container__span:before {
  position: absolute;
  content: '';
  height: 9px;
  width: 9px;
  left: 3px;
  bottom: 2px;
  background-color: #006838;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.switch-container__input:checked + .switch-container__span:before {
  -webkit-transform: translateX(10px);
  -ms-transform: translateX(10px);
  transform: translateX(10px);
}

.switch-container__span {
  border-radius: 34px;
}

.switch-container__span:before {
  border-radius: 50%;
}

.disabled .switch-container__span:before {
  background-color: #9d9d9d !important;
}
</style>
