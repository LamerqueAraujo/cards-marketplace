<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserCard } from '../types/cards.types'

import CardGrid from 'src/shared/ui/data-display/CardGrid.vue'
import CardPreviewDialog from 'src/shared/ui/data-display/CardPreviewDialog.vue'
import InventoryGrid from '../components/InventoryGrid.vue'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import { useMyCards } from '../composables/useMyCards'
import { useCardPreviewTransition } from '../composables/useCardPreviewTransition'

const showAddDialog = ref(false)
const previewOpen = ref(false)
const selectedPreviewCard = ref<UserCard | null>(null)

const {
  myCards,
  loading,
  error,
  selectedCardIds,
  addingCards,
  availableCards,
  fetchMyCards,
  fetchAvailableCards,
  addSelectedCards,
  toggleCardSelection
} = useMyCards()

const {
  handleCardSelect,
  animateBackToOrigin
} = useCardPreviewTransition({
  cards: myCards,
  onOpen: (card: UserCard) => {
    selectedPreviewCard.value = card
    previewOpen.value = true
  },
  onClose: () => {
    previewOpen.value = false
    selectedPreviewCard.value = null
  }
})

function openAddDialog() {
  showAddDialog.value = true
  void fetchAvailableCards()
}

async function handleAddCards() {
  const success = await addSelectedCards()

  if (success) {
    showAddDialog.value = false
  }
}

onMounted(fetchMyCards)
</script>

<template>
  <q-page class="q-pa-md">

    <div class="page-header">
      <AppButton label="Adicionar cartas" icon="add" @click="openAddDialog" />
    </div>

    <InventoryGrid :cards="myCards" :min-slots="27" :loading="loading" :error="error"
      empty-title="Nenhuma carta cadastrada" empty-description="Adicione cartas para começar a negociar."
      @select="handleCardSelect" @empty-slot-click="openAddDialog" />

    <BaseDialog v-model="showAddDialog" title="Adicionar cartas"
      subtitle="Selecione cartas para adicionar ao seu inventário" width="1000px">
      <CardGrid :cards="availableCards" selectable :selected-ids="selectedCardIds"
        @select="({ id }) => toggleCardSelection(id)" />

      <template #footer>
        <q-btn flat label="Cancelar" @click="showAddDialog = false" />

        <q-btn label="Adicionar à minha coleção" color="primary" :disable="!selectedCardIds.length"
          :loading="addingCards" @click="handleAddCards" />
      </template>
    </BaseDialog>

    <CardPreviewDialog v-model="previewOpen" :card="selectedPreviewCard" @update:modelValue="(value) => {
      if (!value) animateBackToOrigin()
    }" />

  </q-page>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
