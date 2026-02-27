<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  addCardsToUser,
  getCards,
  getMyCards
} from '../services/cards.service'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'
import CardGrid from '../components/CardGrid.vue'
import CardPreviewDialog from '../components/CardPreviewDialog.vue'

const cards = ref<UserCard[]>([])
const loading = ref(false)
const error = ref('')
const showAddDialog = ref(false)
const availableCards = ref<UserCard[]>([])
const loadingAvailable = ref(false)
const availableError = ref('')
const selectedCardIds = ref<string[]>([])
const addingCards = ref(false)
const previewOpen = ref(false)
const selectedPreviewCard = ref<UserCard | null>(null)
const transitionOriginEl = ref<HTMLElement | null>(null)
const transitionCard = ref<UserCard | null>(null)

function handleCardSelect(payload: { id: string; el: HTMLElement | null }) {
  const card = cards.value.find(c => c.id === payload.id)
  if (!card) return

  transitionCard.value = card
  transitionOriginEl.value = payload.el

  startCardTransition()
}

async function fetchMyCards() {
  try {
    loading.value = true
    error.value = ''

    cards.value = await getMyCards()

  } catch {
    error.value = 'Erro ao carregar suas cartas'
  } finally {
    loading.value = false
  }
}

function startCardTransition() {
  if (!transitionOriginEl.value || !transitionCard.value) return

  const rect = transitionOriginEl.value.getBoundingClientRect()

  const ghost = document.createElement('img')
  ghost.src = transitionCard.value.imageUrl

  ghost.style.position = 'fixed'
  ghost.style.top = rect.top + 'px'
  ghost.style.left = rect.left + 'px'
  ghost.style.width = rect.width + 'px'
  ghost.style.height = rect.height + 'px'
  ghost.style.zIndex = '9999'
  ghost.style.transition = 'all .45s cubic-bezier(.2,.8,.2,1)'

  document.body.appendChild(ghost)

  requestAnimationFrame(() => {
    ghost.style.top = '50%'
    ghost.style.left = '50%'
    ghost.style.transform = 'translate(-50%, -50%) scale(1.6) rotateY(15deg)'
  })

  setTimeout(() => {
    document.body.removeChild(ghost)
    selectedPreviewCard.value = transitionCard.value
    previewOpen.value = true
  }, 450)
}

function animateBackToOrigin() {
  if (!transitionOriginEl.value || !transitionCard.value) {
    previewOpen.value = false
    return
  }

  const rect = transitionOriginEl.value.getBoundingClientRect()

  const ghost = document.createElement('img')
  ghost.src = transitionCard.value.imageUrl

  ghost.style.position = 'fixed'
  ghost.style.top = '50%'
  ghost.style.left = '50%'
  ghost.style.transform = 'translate(-50%, -50%) scale(1.6) rotateY(15deg)'
  ghost.style.width = rect.width + 'px'
  ghost.style.height = rect.height + 'px'
  ghost.style.zIndex = '9999'
  ghost.style.transition = 'all .45s cubic-bezier(.2,.8,.2,1)'

  document.body.appendChild(ghost)

  previewOpen.value = false

  requestAnimationFrame(() => {
    ghost.style.top = rect.top + 'px'
    ghost.style.left = rect.left + 'px'
    ghost.style.transform = 'scale(1) rotateY(0deg)'
  })

  setTimeout(() => {
    document.body.removeChild(ghost)
    selectedPreviewCard.value = null
    transitionCard.value = null
  }, 450)
}

async function fetchAvailableCards() {
  try {
    loadingAvailable.value = true
    availableError.value = ''

    const response: GetCardsResponse = await getCards()
    availableCards.value = response.list

  } catch {
    availableError.value = 'Erro ao carregar cartas disponíveis'
  } finally {
    loadingAvailable.value = false
  }
}

function openAddDialog() {
  showAddDialog.value = true
  selectedCardIds.value = []
  void fetchAvailableCards()
}

function toggleCardSelection(payload: { id: string }) {
  const cardId = payload.id

  if (selectedCardIds.value.includes(cardId)) {
    selectedCardIds.value =
      selectedCardIds.value.filter(id => id !== cardId)
  } else {
    selectedCardIds.value.push(cardId)
  }
}

async function handleAddCards() {
  if (!selectedCardIds.value.length) return

  try {
    addingCards.value = true

    await addCardsToUser(selectedCardIds.value)

    showAddDialog.value = false
    selectedCardIds.value = []

    await fetchMyCards()

  } finally {
    addingCards.value = false
  }
}

onMounted(fetchMyCards)
</script>

<template>
  <q-page class="q-pa-md">

    <div class="page-header">
      <q-btn label="Adicionar cartas" color="primary" icon="add" @click="openAddDialog" />
    </div>

    <CardGrid :cards="cards" :loading="loading" :error="error" empty-title="Nenhuma carta cadastrada"
      empty-description="Adicione cartas para começar a negociar." @select="handleCardSelect" />

    <q-dialog v-model="showAddDialog">
      <q-card class="add-dialog">

        <q-card-section class="dialog-header">
          <div>
            <div class="text-h6">Adicionar cartas</div>
            <div class="text-caption text-grey-5">
              Selecione cartas para adicionar ao seu inventário
            </div>
          </div>

          <q-btn flat round dense icon="close" @click="showAddDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">

          <CardGrid :cards="availableCards" :loading="loadingAvailable" :error="availableError" selectable
            :selected-ids="selectedCardIds" empty-title="Nenhuma carta disponível" @select="toggleCardSelection" />

        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showAddDialog = false" />

          <q-btn label="Adicionar à minha coleção" color="primary" :disable="!selectedCardIds.length"
            :loading="addingCards" @click="handleAddCards" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- PREVIEW CORRETO -->
    <CardPreviewDialog v-model="previewOpen" :card="selectedPreviewCard" @close="animateBackToOrigin" />

  </q-page>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-dialog {
  width: 900px;
  max-width: 92vw;
  height: 75vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-content {
  overflow-y: auto;
  padding-top: 12px;
}
</style>
