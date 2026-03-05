<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

import AppPageLayout from 'src/shared/layout/AppPageLayout.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import AppCard from 'src/shared/ui/base/AppCard.vue'
import LoadingState from 'src/shared/ui/feedback/LoadingState.vue'
import ErrorState from 'src/shared/ui/feedback/ErrorState.vue'
import EmptyState from 'src/shared/ui/feedback/EmptyState.vue'
import ConfirmDialog from 'src/shared/ui/dialogs/ConfirmDialog.vue'

import TradeCard from '../components/TradeCard.vue'
import TradeCreateDialog from '../components/TradeCreateDialog.vue'
import TradeDetailsDialog from '../components/TradeDetailsDialog.vue'
import { useTrades } from '../composables/useTrades'
import type { TradeCardModel } from '../types/trade-card.model.types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showCreateTradeDialog = ref(false)

const showDetails = ref(false)
const selectedTrade = ref<TradeCardModel | null>(null)

const confirmDeleteOpen = ref(false)
const pendingDeleteId = ref<string | null>(null)

const showOnlyMine = ref(false)

const {
  trades,
  myTrades,
  loadingList,
  loadingMore,
  loadingMine,
  error,
  hasMore,
  loadMore,
  deleteTradeById,
  fetchTrades,
  fetchMyTrades,
  deletingById,
} = useTrades()

const listToRender = computed(() => (showOnlyMine.value ? myTrades.value : trades.value))

function openCreateTradeDialog() {
  showCreateTradeDialog.value = true
}

function onCreatedTrade() {
  showOnlyMine.value = false
  void fetchTrades({ reset: true })
}

function onOpenDetails(trade: TradeCardModel) {
  selectedTrade.value = trade
  showDetails.value = true
}

function closeDetails() {
  showDetails.value = false
  selectedTrade.value = null
}

function requestDelete(tradeId: string) {
  pendingDeleteId.value = tradeId
  confirmDeleteOpen.value = true
}

async function confirmDelete() {
  const id = pendingDeleteId.value
  if (!id) return

  await deleteTradeById(id)

  if (selectedTrade.value?.id === id) {
    closeDetails()
  }

  confirmDeleteOpen.value = false
  pendingDeleteId.value = null
}

function cancelDelete() {
  confirmDeleteOpen.value = false
  pendingDeleteId.value = null
}

function normalizeTradeQuery(v: unknown): string | null {
  if (typeof v === 'string' && v.trim()) return v
  if (Array.isArray(v) && typeof v[0] === 'string' && v[0].trim()) return v[0]
  return null
}

function clearTradeQuery() {
  const q = { ...route.query }
  delete q.trade
  void router.replace({ query: q })
}

function tryOpenFromQuery() {
  const tradeId = normalizeTradeQuery(route.query.trade)
  if (!tradeId) return false
  if (loadingList.value || loadingMine.value) return false
  if (!listToRender.value.length) return false

  const found = listToRender.value.find(t => t.id === tradeId)
  if (!found) return false

  selectedTrade.value = found
  showDetails.value = true
  clearTradeQuery()
  return true
}

async function toggleMine() {
  showOnlyMine.value = !showOnlyMine.value
  closeDetails()

  if (showOnlyMine.value) {
    await fetchMyTrades({ silent: true })
  } else {
    void fetchTrades({ reset: true, silent: true })
  }
}

onMounted(() => {
  void fetchTrades({ reset: true })
})

watch(
  [() => route.query.trade, () => listToRender.value.length, () => loadingList.value, () => loadingMine.value],
  () => {
    void tryOpenFromQuery()
  },
  { immediate: true }
)
</script>

<template>
  <AppPageLayout title="Trocas" subtitle="Explore as trocas disponíveis ou crie a sua própria troca!" icon="swap_horiz">
    <template #actions>
      <AppButton label="Criar troca" icon="add" @click="openCreateTradeDialog" />

      <AppButton v-if="authStore.userId" :label="showOnlyMine ? 'Mostrar todas' : 'Minhas trocas ativas'"
        icon="filter_list" variant="ghost" :class="{ 'btn-active': showOnlyMine }"
        :loading="showOnlyMine && loadingMine" @click="toggleMine" />
    </template>

    <div v-if="showOnlyMine" class="mode-pill">
      Mostrando: <strong>Minhas trocas ativas</strong>
    </div>

    <LoadingState
      v-if="(loadingList && trades.length === 0 && !showOnlyMine) || (showOnlyMine && loadingMine && myTrades.length === 0)"
      type="grid" />

    <ErrorState v-else-if="error" :title="error" />

    <EmptyState v-else-if="listToRender.length === 0" icon="swap_horiz"
      :title="showOnlyMine ? 'Você não tem trocas ativas' : 'Nenhuma troca disponível'"
      :description="showOnlyMine ? 'Crie uma troca para ela aparecer aqui.' : 'Seja o primeiro a criar uma troca.'" />

    <div v-else class="trade-grid">
      <TradeCard v-for="trade in listToRender" :key="trade.id" :trade="trade" :is-deleting="!!deletingById[trade.id]"
        @delete="requestDelete" @open-details="onOpenDetails" />

      <AppCard v-if="hasMore && !showOnlyMine" class="load-more-card">
        <div class="load-more-content">
          <div class="load-more-text">
            <div class="load-more-title">Carregar mais</div>
            <div class="load-more-subtitle">Veja mais trocas disponíveis no marketplace</div>
          </div>

          <AppButton label="Carregar mais" icon="add" :loading="loadingMore" :disabled="loadingMore || loadingList"
            @click="loadMore" />
        </div>
      </AppCard>
    </div>

    <TradeCreateDialog v-model="showCreateTradeDialog" @created="onCreatedTrade" />

    <TradeDetailsDialog v-model="showDetails" :trade="selectedTrade" @cancel-trade="requestDelete"
      @update:modelValue="(v) => !v && closeDetails()" />

    <ConfirmDialog v-model="confirmDeleteOpen" title="Cancelar troca?"
      description="Essa ação remove sua solicitação de troca do marketplace." confirm-label="Sim, cancelar"
      cancel-label="Voltar" :loading="false" @confirm="confirmDelete" @cancel="cancelDelete" />
  </AppPageLayout>
</template>

<style scoped>
.mode-pill {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(139, 92, 246, 0.22);
  background: rgba(139, 92, 246, 0.10);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.btn-active {
  border-color: rgba(139, 92, 246, 0.35) !important;
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.18), 0 10px 30px rgba(139, 92, 246, 0.08);
}

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
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  width: 100%;
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
