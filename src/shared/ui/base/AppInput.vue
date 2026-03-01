<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { QInput, type QInputProps } from 'quasar'

const props = withDefaults(defineProps<{
  modelValue: string | number | null
  label?: string
  type?: QInputProps['type']
  placeholder?: string
  disable?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
}>(), {
  type: 'text',
  disable: false,
  error: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | null): void
}>()

const attrs = useAttrs()

const inputProps = computed(() => ({
  ...attrs,
  dark: true,
  filled: true,
  hideBottomSpace: true
}))
</script>

<template>
  <q-input v-bind="inputProps" class="app-input" :model-value="modelValue" :label="label" :type="type"
    :placeholder="placeholder" :disable="disable" :error="error" :error-message="errorMessage" :hint="hint"
    @update:model-value="emit('update:modelValue', $event)" />
</template>

<style scoped lang="scss">
.app-input :deep(.q-field__control) {
  min-height: 46px;

  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.10);

  transition:
    border-color 180ms var(--ease-smooth),
    box-shadow 180ms var(--ease-smooth),
    filter 180ms var(--ease-smooth);
}

.app-input:not(.q-field--disabled):hover :deep(.q-field__control) {
  border-color: rgba(255, 255, 255, 0.16);
}

.app-input.q-field--focused :deep(.q-field__control) {
  border-color: rgba(139, 92, 246, 0.55);
  box-shadow:
    0 0 0 1px rgba(139, 92, 246, 0.30),
    0 0 22px var(--glow-primary);
}

.app-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.62);
  font-weight: 600;
  letter-spacing: 0.2px;
}


.app-input :deep(.q-field__native),
.app-input :deep(input),
.app-input :deep(textarea) {
  color: rgba(255, 255, 255, 0.92);
}

.app-input :deep(input::placeholder),
.app-input :deep(textarea::placeholder) {
  color: rgba(255, 255, 255, 0.35);
}

.app-input.q-field--error :deep(.q-field__control) {
  border-color: rgba(239, 68, 68, 0.55);
  box-shadow: 0 0 18px rgba(239, 68, 68, 0.18);
}

.app-input.q-field--disabled :deep(.q-field__control) {
  opacity: 0.65;
  filter: saturate(0.9);
}
</style>
