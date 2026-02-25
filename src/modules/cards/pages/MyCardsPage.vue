<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addCardsToUser, getCards, getMyCards } from '../services/cards.service'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'
import { toggleSelection } from 'src/shared/utils/selection.utils'
import CardThumbnail from 'src/shared/components/ui/CardThumbnail.vue'

const cards = ref<UserCard[]>([])
const loading = ref(false)
const error = ref('')
const showAddDialog = ref(false)
const availableCards = ref<UserCard[]>([])
const loadingAvailable = ref(false)
const availableError = ref('')
const selectedCardIds = ref<string[]>([])
const addingCards = ref(false)

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
  void fetchAvailableCards()
}

async function fetchMyCards() {
  try {
    loading.value = true
    error.value = ''

    const response = await getMyCards()
    cards.value = response

  } catch {
    error.value = 'Erro ao carregar suas cartas'
  } finally {
    loading.value = false
  }
}

function toggleCardSelection(cardId: string) {
  selectedCardIds.value =
    toggleSelection(selectedCardIds.value, cardId)
}

async function handleAddCards() {
  if (selectedCardIds.value.length === 0) return

  try {
    addingCards.value = true

    await addCardsToUser(selectedCardIds.value)

    showAddDialog.value = false
    selectedCardIds.value = []

    await fetchMyCards()

  } catch {
    availableError.value = 'Erro ao adicionar cartas'
  } finally {
    addingCards.value = false
  }
}

onMounted(fetchMyCards)
</script>

<template>
  <q-page class="q-pa-md">

    <!-- HEADER -->
    <div class="row justify-between items-center q-mb-lg">
      <div class="text-h6">
        Minhas Cartas
      </div>

      <q-btn label="Adicionar cartas" color="primary" icon="add" @click="openAddDialog" />
    </div>

    <!-- STATES -->
    <div v-if="loading">
      Carregando suas cartas...
    </div>

    <div v-else-if="error">
      {{ error }}
    </div>

    <div v-else-if="cards.length === 0">
      Você ainda não possui cartas cadastradas.
    </div>

    <!-- GRID -->
    <div v-else class="row q-col-gutter-md">
      <div v-for="card in cards" :key="card.id" class="col-auto">
        <CardThumbnail :image-url="card.imageUrl" :name="card.name" />
      </div>
    </div>

    <!-- ADD DIALOG -->
    <q-dialog v-model="showAddDialog">
      <q-card class="add-dialog">

        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            Adicionar cartas
          </div>

          <q-btn flat round dense icon="close" @click="showAddDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>

          <div v-if="loadingAvailable">
            Carregando cartas...
          </div>

          <div v-else-if="availableError">
            {{ availableError }}
          </div>

          <div v-else class="row q-col-gutter-md">
            <div v-for="card in availableCards" :key="card.id" class="col-auto cursor-pointer"
              @click="toggleCardSelection(card.id)">
              <CardThumbnail :image-url="card.imageUrl" :name="card.name"
                :selected="selectedCardIds.includes(card.id)" />
            </div>
          </div>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="showAddDialog = false" />

          <q-btn label="Adicionar à minha coleção" color="primary" :disable="selectedCardIds.length === 0"
            :loading="addingCards" @click="handleAddCards" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<style scoped>
.add-dialog {
  min-width: 600px;
  max-width: 900px;
}
</style>
