<script setup lang="ts">
import type { BaseCard } from 'src/shared/types/card.types'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import CardPreviewContent from './CardPreviewContent.vue'

const props = defineProps<{
  modelValue: boolean
  card: BaseCard | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseDialog :model-value="props.modelValue" width="800px" title="Pré-visualização"
    @update:model-value="emit('update:modelValue', $event)">
    <CardPreviewContent v-if="card" :card="card" />

    <template #footer>
      <AppButton label="Fechar" variant="ghost" @click="close" />
    </template>
  </BaseDialog>
</template>
