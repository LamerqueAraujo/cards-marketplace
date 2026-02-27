<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserCard } from '../types/cards.types'

import CardGrid from '../components/CardGrid.vue'
import CardPreviewContent from '../components/CardPreviewContent.vue'
import BaseDialog from '../../../shared/ui/components/BaseDialog.vue'

import { useMyCards } from '../composables/useMyCards'
import { useCardPreviewTransition } from '../composables/useCardPreviewTransition'

const showAddDialog = ref(false)
const previewOpen = ref(false)
const selectedPreviewCard = ref<UserCard | null>(null)
const {
  myCards,
  availableCards,
  loading,
  loadingAvailable,
  error,
  availableError,
  selectedCardIds,
  addingCards,
  fetchMyCards,
  fetchAvailableCards,
  toggleCardSelection,
  addSelectedCards
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
      <q-btn label="Adicionar cartas" color="primary" icon="add" @click="openAddDialog" />
    </div>

    <CardGrid :cards="myCards" :min-slots="27" :loading="loading" :error="error" empty-title="Nenhuma carta cadastrada"
      empty-description="Adicione cartas para começar a negociar." @select="handleCardSelect" />

    <BaseDialog v-model="showAddDialog" title="Adicionar cartas"
      subtitle="Selecione cartas para adicionar ao seu inventário" width="1000px">
      <CardGrid :cards="availableCards" :loading="loadingAvailable" :error="availableError" selectable
        :selected-ids="selectedCardIds" empty-title="Nenhuma carta disponível"
        @select="({ id }) => toggleCardSelection(id)" />

      <template #footer>
        <q-btn flat label="Cancelar" @click="showAddDialog = false" />

        <q-btn label="Adicionar à minha coleção" color="primary" :disable="!selectedCardIds.length"
          :loading="addingCards" @click="handleAddCards" />
      </template>
    </BaseDialog>

    <BaseDialog v-model="previewOpen" width="800px">
      <CardPreviewContent v-if="selectedPreviewCard" :name="selectedPreviewCard.name"
        :description="selectedPreviewCard.description" :image-url="selectedPreviewCard.imageUrl" />

      <template #footer>
        <q-btn flat label="Fechar" @click="animateBackToOrigin" />
      </template>
    </BaseDialog>

  </q-page>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
