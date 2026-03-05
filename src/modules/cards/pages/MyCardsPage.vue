<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { UserCard } from '../types/cards.types'

import AppPageLayout from 'src/shared/layout/AppPageLayout.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'

import CardGrid from 'src/shared/ui/data-display/CardGrid.vue'
import CardPreviewDialog from 'src/shared/ui/data-display/CardPreviewDialog.vue'

import { useMyCards } from '../composables/useMyCards'
import { useCardPreviewTransition } from '../composables/useCardPreviewTransition'

const showAddDialog = ref(false)
const previewOpen = ref(false)
const selectedPreviewCard = ref<UserCard | null>(null)

const {
  myCards,
  loadingAvailable,
  availableError,
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

const isAddDisabled = computed(() => selectedCardIds.value.length === 0)
const ownedIds = computed(() => myCards.value.map(c => c.id))

const { handleCardSelect, animateBackToOrigin } = useCardPreviewTransition({
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
}

function closeAddDialog() {
  showAddDialog.value = false
  selectedCardIds.value = []
}

async function handleAddCards() {
  const success = await addSelectedCards()
  if (!success) return

  closeAddDialog()
  await fetchMyCards()
}

function onPreviewModelUpdate(value: boolean) {
  if (!value) animateBackToOrigin()
}


watch(
  () => showAddDialog.value,
  (open) => {
    if (open) void fetchAvailableCards()
  }
)

onMounted(() => {
  void fetchMyCards()
})
</script>

<template>
  <AppPageLayout title="Minhas cartas" subtitle="Gerencie sua coleção e adicione cartas para criar trocas.">
    <template #actions>
      <AppButton label="Adicionar cartas" icon="add" @click="openAddDialog" />
    </template>

    <div class="mycards-page">
      <div class="mycards-inventoryScroll">
        <CardGrid :cards="myCards" :loading="loading" :error="error" :min-slots="27" show-empty-slot keep-empty-slot
          empty-slot-label="Adicionar carta" @select="handleCardSelect" @empty-slot-click="openAddDialog" />
      </div>
    </div>

    <BaseDialog v-model="showAddDialog" title="Adicionar cartas"
      subtitle="Selecione cartas para adicionar ao seu inventário" width="min(1000px, 92vw)" :body-scrollable="false">
      <div class="add-dialog">
        <div class="add-dialog__scroll app-scroll">
          <CardGrid :cards="availableCards" :loading="loadingAvailable" :error="availableError" selectable
            :selected-ids="selectedCardIds" :disabled-ids="ownedIds" @select="({ id }) => toggleCardSelection(id)" />
        </div>
      </div>

      <template #footer>
        <div class="app-myCards__dialogFooter">
          <AppButton label="Cancelar" variant="ghost" class="app-myCards__btn" @click="closeAddDialog" />
          <AppButton label="Adicionar à minha coleção" icon="add" :loading="addingCards" :disabled="isAddDisabled"
            class="app-myCards__btn" @click="handleAddCards" />
        </div>
      </template>
    </BaseDialog>

    <CardPreviewDialog v-model="previewOpen" :card="selectedPreviewCard" @update:modelValue="onPreviewModelUpdate" />
  </AppPageLayout>
</template>

<style scoped lang="scss">
.app-myCards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.app-myCards__dialogFooter {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  width: 100%;
}

:deep(.dialog-body) {
  overflow: hidden !important;
}

.add-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.add-dialog__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  max-height: none;
}

@media (max-width: 700px) {
  .app-myCards__dialogFooter {
    flex-direction: column;
    align-items: stretch;
  }

  .app-myCards__btn {
    width: 100%;
  }

  .add-dialog__scroll {
    max-height: 64vh;
  }
}
</style>
