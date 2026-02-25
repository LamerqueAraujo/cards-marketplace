<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addCardsToUser, getCards, getMyCards } from '../services/cards.service'
import type { UserCard } from '../types/cards.types'
import type { GetCardsResponse } from '../types/cards.response'
import { toggleSelection } from 'src/shared/utils/selection.utils'

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

    await fetchMyCards() // atualiza inventário

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

    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">
        Minhas Cartas
      </div>

      <q-btn label="Adicionar cartas" color="primary" icon="add" @click="openAddDialog" />
    </div>

    <div v-if="loading">
      Carregando suas cartas...
    </div>

    <div v-else-if="error">
      {{ error }}
    </div>

    <div v-else-if="cards.length === 0">
      Você ainda não possui cartas cadastradas.
    </div>

    <div v-else>
      <div v-for="card in cards" :key="card.id" class="q-mb-md">
        <q-img :src="card.imageUrl" ratio="1" />
        <div class="text-subtitle2 q-mt-sm">
          {{ card.name }}
        </div>
      </div>
    </div>

    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 500px">
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

          <div v-else>
            <div v-for="card in availableCards" :key="card.id" class="q-mb-sm cursor-pointer"
              @click="toggleCardSelection(card.id)">
              <q-img :src="card.imageUrl" ratio="1" />

              <div class="text-caption q-mt-xs">
                {{ card.name }}
              </div>

              <q-badge v-if="selectedCardIds.includes(card.id)" color="primary" class="q-mt-xs">
                Selecionada
              </q-badge>
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
