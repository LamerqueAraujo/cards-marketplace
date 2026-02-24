<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades } from '../services/trade.service'
import type { Trade } from '../types/trade.types'

const trades = ref<Trade[]>([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    loading.value = true
    const response = await getTrades()
    trades.value = response.list
  } catch {
    error.value = 'Erro ao carregar trades'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <q-page class="q-pa-md">

    <div v-if="loading">
      Carregando...
    </div>

    <div v-else-if="error">
      {{ error }}
    </div>

    <div v-else>
      <div v-for="trade in trades" :key="trade.id" class="q-mb-md">
        <div><strong>Usuário:</strong> {{ trade.user.name }}</div>
        <div><strong>ID:</strong> {{ trade.id }}</div>
        <hr />
      </div>
    </div>

  </q-page>
</template>
