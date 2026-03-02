<script setup lang="ts">
import { computed } from 'vue'
import type { TradeCardModel } from '../types/trade-card.model.types'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import SurfaceCard from 'src/shared/ui/base/SurfaceCard.vue'
import CardItem from 'src/shared/ui/data-display/CardItem.vue'

const props = defineProps<{
  modelValue: boolean
  trade: TradeCardModel | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'request-trade', tradeId: string): void
  (e: 'cancel-trade', tradeId: string): void
  (e: 'preview-card', cardId: string): void
}>()

const authStore = useAuthStore()

const isOwner = computed(() => {
  if (!props.trade) return false
  return props.trade.userId === authStore.userId
})

const subtitle = computed(() => {
  if (!props.trade) return undefined
  const date = new Date(props.trade.createdAt).toLocaleDateString('pt-BR')
  return `${props.trade.userName} • ${date}`
})

function close() {
  emit('update:modelValue', false)
}

function onPrimaryAction() {
  if (!props.trade) return
  if (isOwner.value) emit('cancel-trade', props.trade.id)
  else emit('request-trade', props.trade.id)
}

function onCardClick(cardId: string) {
  emit('preview-card', cardId)
}
</script>

<template>
  <BaseDialog :model-value="modelValue" width="1120px" title="Detalhes da troca" v-bind="subtitle ? { subtitle } : {}"
    @update:model-value="emit('update:modelValue', $event)">
    <div v-if="trade" class="trade-details">
      <!-- COLUNA: OFERECENDO -->
      <SurfaceCard class="col">
        <div class="col-header">
          <div class="col-title">Oferecendo</div>
          <div class="col-count">{{ trade.offering.length }} cartas</div>
        </div>

        <div class="cards-grid">
          <CardItem v-for="(card, index) in trade.offering" :key="card.id" :card="card" :index="index" static
            class="grid-card" @click.stop="onCardClick(card.id)" />
        </div>
      </SurfaceCard>

      <!-- CENTRO -->
      <div class="mid" aria-hidden="true">
        <div class="mid-icon">⇄</div>
        <div class="mid-line" />
      </div>

      <!-- COLUNA: RECEBENDO -->
      <SurfaceCard class="col">
        <div class="col-header">
          <div class="col-title receiving">Recebendo</div>
          <div class="col-count">{{ trade.receiving.length }} cartas</div>
        </div>

        <div class="cards-grid">
          <CardItem v-for="(card, index) in trade.receiving" :key="card.id" :card="card" :index="index" static
            class="grid-card" @click.stop="onCardClick(card.id)" />
        </div>
      </SurfaceCard>
    </div>

    <div v-else class="empty">
      <div class="empty-title">Nenhuma troca selecionada</div>
      <div class="empty-sub">Feche o modal e tente novamente.</div>
    </div>

    <template #footer>
      <q-btn flat label="Fechar" @click="close" />

      <q-btn v-if="trade" unelevated class="btn-primary" :label="isOwner ? 'Cancelar' : 'Solicitar troca'"
        :color="isOwner ? 'negative' : 'primary'" @click="onPrimaryAction" />
    </template>
  </BaseDialog>
</template>

<style scoped lang="scss">
.trade-details {
  display: grid;
  grid-template-columns: 1fr 86px 1fr;
  gap: 16px;
  align-items: start;
}

/* colunas */
.col {
  padding: 16px;
  border-radius: 18px;
}

.col-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.col-title {
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}

.col-title.receiving {
  color: rgba(138, 43, 226, 0.9);
}

.col-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

/* grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

/* centro */
.mid {
  position: relative;
  height: 100%;
  display: grid;
  place-items: center;
  padding-top: 34px;
}

.mid-icon {
  font-size: 22px;
  opacity: 0.8;
  color: rgba(138, 43, 226, 0.95);
  filter: drop-shadow(0 0 16px rgba(138, 43, 226, 0.18));
}

.mid-line {
  position: absolute;
  width: 2px;
  height: 240px;
  border-radius: 999px;
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0.04),
      rgba(138, 43, 226, 0.25),
      rgba(255, 255, 255, 0.04));
  opacity: 0.7;
}

/* CTA premium */
.btn-primary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
}

/* empty state */
.empty {
  padding: 18px 0 6px;
  text-align: center;
}

.empty-title {
  font-weight: 800;
  color: var(--text-primary);
}

.empty-sub {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.9;
}
</style>
