<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppPageLayout from 'src/shared/ui/layout/AppPageLayout.vue'
import TradeCard from '../components/TradeCard.vue'
import TradeCreateDialog from '../components/TradeCreateDialog.vue'
import TradeDetailsDialog from '../components/TradeDetailsDialog.vue'
import { useTrades } from '../composables/useTrades'
import LoadingState from 'src/shared/ui/feedback/LoadingState.vue'
import ErrorState from 'src/shared/ui/feedback/ErrorState.vue'
import EmptyState from 'src/shared/ui/feedback/EmptyState.vue'
import SurfaceCard from 'src/shared/ui/base/SurfaceCard.vue'
import type { TradeCardModel } from '../types/trade-card.model.types'

const showCreateTradeDialog = ref(false)
const showDetails = ref(false)
const selectedTrade = ref<TradeCardModel | null>(null)

const {
  trades,
  loading,
  error,
  hasMore,
  loadMore,
  deleteTradeById,
  fetchTrades
} = useTrades()

function openCreateTradeDialog() {
  showCreateTradeDialog.value = true
}

function onOpenDetails(trade: TradeCardModel) {
  selectedTrade.value = trade
  showDetails.value = true
}

function closeDetails() {
  showDetails.value = false
  selectedTrade.value = null
}

async function onCancelTrade(tradeId: string) {
  await deleteTradeById(tradeId)
  if (selectedTrade.value?.id === tradeId) closeDetails()
}

onMounted(() => {
  void fetchTrades(true)
})
</script>

<template>
  <AppPageLayout title="Trocas" subtitle="Trocas ativas do marketplace">
    <template #actions>
      <q-btn label="Criar troca" color="primary" icon="add" @click="openCreateTradeDialog" />
    </template>

    <LoadingState v-if="loading && trades.length === 0" type="grid" />

    <ErrorState v-else-if="error" :title="error" />

    <EmptyState v-else-if="trades.length === 0" icon="swap_horiz" title="Nenhuma troca disponível"
      description="Seja o primeiro a criar uma troca." />

    <div v-else class="trade-grid">
      <TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" @delete="deleteTradeById"
        @open-details="onOpenDetails" />

      <SurfaceCard v-if="hasMore" class="load-more-card" @click="loadMore" role="button" tabindex="0">
        <div class="load-more-content">
          <div class="load-more-icon">
            <q-icon name="add" size="28px" />
          </div>

          <div class="load-more-text">
            <div class="load-more-title">Carregar mais</div>
            <div class="load-more-subtitle">Veja mais trocas disponíveis no marketplace</div>
          </div>
        </div>
      </SurfaceCard>
    </div>

    <TradeCreateDialog v-model="showCreateTradeDialog" />

    <!-- MODAL DE DETALHES -->
    <TradeDetailsDialog v-model="showDetails" :trade="selectedTrade" @update:model-value="(v) => !v && closeDetails()"
      @cancel-trade="onCancelTrade" @request-trade="(id) => console.log('request-trade', id)"
      @preview-card="(cardId) => console.log('preview-card', cardId)" />
  </AppPageLayout>
</template>

<style scoped>
.trade-grid {
  margin-top: 18px;
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  align-items: stretch;
}

@media (max-width: 980px) {
  .trade-grid {
    grid-template-columns: 1fr;
  }
}

.load-more-card {
  cursor: pointer;
  min-height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px dashed rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.02);

  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.load-more-card:hover {
  transform: translateY(-4px);
  border-color: rgba(138, 43, 226, 0.6);
  background: rgba(138, 43, 226, 0.06);
}

.load-more-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
}

.load-more-icon {
  width: 54px;
  height: 54px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--gradient-primary);
  color: white;

  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.45);
}

.load-more-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.load-more-title {
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.load-more-subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
