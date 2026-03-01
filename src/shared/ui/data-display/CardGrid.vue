<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'
import type { ComponentPublicInstance } from 'vue'

import CardItem from './CardItem.vue'
import LoadingState from '../feedback/LoadingState.vue'
import EmptyState from '../feedback/EmptyState.vue'
import ErrorState from '../feedback/ErrorState.vue'

withDefaults(defineProps<{
  cards: BaseCard[]
  loading?: boolean
  error?: string
  selectable?: boolean
  selectedIds?: string[]
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  loading: false,
  error: '',
  selectable: false,
  selectedIds: () => []
})

const emit = defineEmits<{
  (e: 'select', payload: { id: string; el: HTMLElement | null }): void
}>()

const cardRefs = new Map<string, HTMLElement>()

type RefEl = Element | ComponentPublicInstance | null

function registerRef(id: string, el: RefEl) {
  if (!el) return

  let element: HTMLElement | null = null

  if (el instanceof HTMLElement) {
    element = el
  } else if ('$el' in el && el.$el instanceof HTMLElement) {
    element = el.$el
  }

  if (element) {
    cardRefs.set(id, element)
  }
}

function setCardRef(id: string) {
  return (el: RefEl) => registerRef(id, el)
}

function handleClick(cardId: string) {
  emit('select', {
    id: cardId,
    el: cardRefs.get(cardId) ?? null
  })
}

onBeforeUnmount(() => {
  cardRefs.clear()
})
</script>

<template>
  <template v-if="loading">
    <LoadingState type="grid" />
  </template>

  <template v-else-if="error">
    <ErrorState :title="error" />
  </template>

  <template v-else-if="cards.length === 0">
    <EmptyState icon="style" :title="emptyTitle || 'Nenhuma carta encontrada'"
      v-bind="emptyDescription ? { description: emptyDescription } : {}" />
  </template>

  <template v-else>
    <div class="cards-grid">
      <CardItem v-for="(card, index) in cards" :key="card.id" :index="index" :ref="setCardRef(card.id)" :card="card"
        :selectable="selectable" :selected="selectedIds.includes(card.id)" @click="handleClick(card.id)" />
    </div>
  </template>
</template>

<style scoped lang="scss">
.cards-grid {
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-card-min), 1fr));
  align-items: start;
}

.cards-grid>* {
  min-width: 0;
}

@media (min-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(var(--grid-card-min-lg), 1fr));
  }
}
</style>
