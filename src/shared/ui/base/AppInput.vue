<script setup lang="ts">
import type { QInputProps } from 'quasar'

withDefaults(defineProps<{
  modelValue: string | number | null
  label?: string
  type?: QInputProps['type']
  placeholder?: string
  hint?: string
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  autocomplete?: string
}>(), {
  type: 'text',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()
</script>

<template>
  <q-input class="app-input" dark outlined :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)" :label="label" :type="type" :placeholder="placeholder"
    :hint="hint" :error="error" :error-message="errorMessage" :disable="disabled" :autocomplete="autocomplete"
    no-error-icon @focus="emit('focus')" @blur="emit('blur')" />
</template>

<style scoped lang="scss">
.app-input :deep(.q-field__control) {
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.10);

  transition:
    border-color 180ms var(--ease-smooth),
    box-shadow 180ms var(--ease-smooth),
    background-color 180ms var(--ease-smooth);
}

.app-input :deep(.q-field__native) {
  color: rgba(255, 255, 255, 0.92);
}

.app-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.55);
}

.app-input :deep(.q-field--focused .q-field__control) {
  border-color: rgba(139, 92, 246, 0.55);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.22);
}

.app-input :deep(.q-field--focused .q-field__label) {
  color: rgba(255, 255, 255, 0.78);
}

/* hint + error */
.app-input :deep(.q-field__bottom) {
  padding-top: 6px;
}

.app-input :deep(.q-field__messages) {
  color: var(--text-muted);
  font-size: var(--text-caption);
}
</style>
