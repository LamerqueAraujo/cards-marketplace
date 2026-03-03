<script setup lang="ts">
import { watch } from 'vue'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import CardGrid from 'src/shared/ui/data-display/CardGrid.vue'
import { useCreateTrade } from '../composables/useCreateTrade'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

const {
  myCards,
  availableCards,
  loadingMyCards,
  loadingAvailable,
  myCardsError,
  availableError,
  selectedOfferingIds,
  selectedReceivingIds,
  creatingTrade,
  isTradeValid,
  fetchMyCardsForTrade,
  fetchAvailableCardsForTrade,
  toggleOffering,
  toggleReceiving,
  handleCreateTrade,
  resetSelection
} = useCreateTrade({
  onSuccess: () => {
    emit('created')
    emit('update:modelValue', false)
    resetSelection()
  }
})

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  await handleCreateTrade()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      void fetchMyCardsForTrade()
      void fetchAvailableCardsForTrade()
    }
  }
)
</script>

<template>
  <BaseDialog :model-value="modelValue" title="Criar nova troca" subtitle="Escolha cartas para oferecer e receber"
    width="1000px" @update:modelValue="emit('update:modelValue', $event)">
    <div class="dialog-content">

      <div class="section">
        <div class="section-title">
          Suas cartas (oferecendo)
        </div>

        <CardGrid :cards="myCards" :loading="loadingMyCards" :error="myCardsError" selectable
          :selected-ids="selectedOfferingIds" empty-title="Nenhuma carta disponível"
          empty-description="Você não possui cartas para oferecer." @select="({ id }) => toggleOffering(id)" />
      </div>

      <div class="divider" />

      <div class="section">
        <div class="section-title">
          Cartas desejadas (recebendo)
        </div>

        <CardGrid :cards="availableCards" :loading="loadingAvailable" :error="availableError" selectable
          :selected-ids="selectedReceivingIds" empty-title="Nenhuma carta disponível"
          @select="({ id }) => toggleReceiving(id)" />
      </div>

    </div>

    <template #footer>
      <AppButton label="Cancelar" variant="ghost" @click="close" />

      <AppButton label="Criar troca" icon="add" :disabled="!isTradeValid" :loading="creatingTrade"
        @click="handleSubmit" />
    </template>
  </BaseDialog>
</template>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 6px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}
</style>
