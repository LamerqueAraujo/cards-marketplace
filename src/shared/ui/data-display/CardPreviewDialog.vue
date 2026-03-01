<script setup lang="ts">
import type { BaseCard } from 'src/shared/types/card.types'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import CardPreviewContent from './CardPreviewContent.vue'

defineProps<{
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
  <BaseDialog :model-value="modelValue" width="800px" @update:modelValue="emit('update:modelValue', $event)">
    <CardPreviewContent v-if="card" :card="card" />

    <template #footer>
      <q-btn flat label="Fechar" @click="close" />
    </template>
  </BaseDialog>
</template>
