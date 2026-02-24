<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyCards } from '../services/cards.service'
import type { UserCard } from '../types/cards.types'

const cards = ref<UserCard[]>([])
const loading = ref(false)
const error = ref('')

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

onMounted(fetchMyCards)
</script>

<template>
  <q-page class="q-pa-md">

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

  </q-page>
</template>
