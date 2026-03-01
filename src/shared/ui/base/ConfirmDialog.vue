<script setup lang="ts">
import { computed } from 'vue'
import BaseDialog from './BaseDialog.vue'
import AppButton from './AppButton.vue'

type ConfirmVariant = 'primary' | 'danger'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: ConfirmVariant
  loading?: boolean
}>(), {
  title: 'Confirmar ação',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  confirmVariant: 'primary',
  loading: false
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
  <BaseDialog v-model="model" :title="title" width="560px">
    <div class="confirm-desc" v-if="description">
      {{ description }}
    </div>

    <template #footer>
      <AppButton :label="cancelLabel" variant="ghost" :disabled="loading" @click="close" />

      <AppButton :label="confirmLabel" :variant="confirmVariant === 'danger' ? 'danger' : 'primary'" :loading="loading"
        @click="confirm" />
    </template>
  </BaseDialog>
</template>

<style scoped lang="scss">
.confirm-desc {
  font-size: var(--text-body);
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
