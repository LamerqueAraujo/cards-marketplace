<script setup lang="ts">
import { computed } from 'vue'
import type { TradeCardModel } from '../types/trade-card.model.types'
import { useAuthStore } from 'src/modules/auth/store/auth.store'
import AppCard from 'src/shared/ui/base/AppCard.vue'
import CardItem from '../../../shared/ui/data-display/CardItem.vue'

const props = defineProps<{
  trade: TradeCardModel
}>()

const authStore = useAuthStore()

const MAX_VISIBLE = 4

const isOwner = computed(() => {
  return props.trade.userId === authStore.userId
})

const formattedDate = computed(() => {
  return new Date(props.trade.createdAt).toLocaleDateString()
})

const visibleOffering = computed(() =>
  props.trade.offering.slice(0, MAX_VISIBLE)
)

const visibleReceiving = computed(() =>
  props.trade.receiving.slice(0, MAX_VISIBLE)
)

const offeringOverflow = computed(() =>
  props.trade.offering.length - MAX_VISIBLE
)

const receivingOverflow = computed(() =>
  props.trade.receiving.length - MAX_VISIBLE
)

const emit = defineEmits<{
  (e: 'delete', tradeId: string): void
}>()
</script>

<template>
  <AppCard class="trade-card">

    <!-- HEADER -->
    <div class="trade-header">
      <div>
        <div class="trade-user">
          {{ trade.userName }}
        </div>
        <div class="trade-date">
          {{ formattedDate }}
        </div>
      </div>

      <q-btn v-if="isOwner" icon="delete" flat round dense size="sm" color="negative"
        @click="emit('delete', trade.id)" />
    </div>

    <!-- BODY -->
    <div class="trade-body">

      <!-- OFFERING -->
      <div class="trade-column">
        <div class="column-label">
          Offering
        </div>

        <div class="cards-row">
          <CardItem v-for="(card, index) in visibleOffering" :key="card.id" :card="card" :index="index"
            :selectable="false" />

          <div v-if="offeringOverflow > 0" class="overflow-indicator">
            +{{ offeringOverflow }}
          </div>
        </div>
      </div>

      <!-- ARROW -->
      <div class="trade-divider">
        ⇄
      </div>

      <!-- RECEIVING -->
      <div class="trade-column">
        <div class="column-label receiving">
          Receiving
        </div>

        <div class="cards-row">
          <CardItem v-for="(card, index) in visibleReceiving" :key="card.id" :card="card" :index="index"
            :selectable="false" />

          <div v-if="receivingOverflow > 0" class="overflow-indicator">
            +{{ receivingOverflow }}
          </div>
        </div>
      </div>

    </div>

  </AppCard>
</template>

<style scoped>
.trade-card {
  padding: 18px 20px;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.trade-user {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-primary);
}

.trade-date {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.trade-body {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: start;
}

.trade-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.column-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  color: var(--text-secondary);
}

.column-label.receiving {
  color: var(--primary);
}

.trade-divider {
  align-self: center;
  font-size: 20px;
  opacity: 0.5;
}

/* REDUZ Tamanho Visual das Cartas */
.cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}

.cards-row :deep(.card-entry) {
  transform: scale(0.85);
  transform-origin: top left;
}

/* Indicador +X */
.overflow-indicator {
  width: 100px;
  height: 140px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  color: var(--text-secondary);
}
</style>
