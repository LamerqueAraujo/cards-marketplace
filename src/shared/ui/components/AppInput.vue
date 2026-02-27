<script setup lang="ts">
type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'search'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'time'
  | 'date'
  | 'datetime-local'
  | 'file'

defineProps<{
  modelValue: string
  label: string
  type?: InputType
  autocomplete?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <q-input :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" :label="label"
    :type="type || 'text'" :autocomplete="autocomplete" dense dark class="app-input" />
</template>

<style scoped lang="scss">
.app-input {
  margin-bottom: 22px;
}

/* Linha base */
.app-input :deep(.q-field__control:before) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

/* Linha ativa animada */
.app-input :deep(.q-field__control:after) {
  border-bottom: 2px solid $primary;
}

/* Label padrão */
.app-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.55);
}

/* Label ativa */
.app-input :deep(.q-field--focused .q-field__label),
.app-input :deep(.q-field--float .q-field__label) {
  color: $primary;
}

/* Texto */
.app-input :deep(.q-field__native) {
  color: white;
  padding-left: 2px;
}
</style>
