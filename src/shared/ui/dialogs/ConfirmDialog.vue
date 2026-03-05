<script setup lang="ts">
import { computed } from 'vue'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  danger?: boolean
  width?: string
}>(), {
  title: 'Confirmar ação',
  description: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  loading: false,
  danger: false,
  width: '520px'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

function close() {
  model.value = false
  emit('cancel')
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <BaseDialog v-model="model" :title="title" :subtitle="description" :width="width">
    <template #footer>
      <AppButton :label="cancelLabel" variant="ghost" @click="close" />
      <AppButton :label="confirmLabel" :loading="loading" :variant="danger ? 'danger' : 'primary'" @click="confirm" />
    </template>
  </BaseDialog>
</template>
