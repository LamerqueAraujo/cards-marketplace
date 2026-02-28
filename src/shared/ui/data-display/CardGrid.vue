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

function registerRef(
  id: string,
  el: Element | ComponentPublicInstance | null
) {
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
  <LoadingState v-if="loading" type="grid" />

  <ErrorState v-else-if="error" :title="error" />

  <EmptyState v-else-if="cards.length === 0" icon="style" :title="emptyTitle || 'Nenhuma carta encontrada'"
    :description="emptyDescription" />

  <div v-else class="cards-grid">
    <CardItem v-for="(card, index) in cards" :key="card.id" :index="index" :ref="el => registerRef(card.id, el)"
      :card="card" :selectable="selectable" :selected="selectedIds.includes(card.id)" @click="handleClick(card.id)" />
  </div>
</template>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
</style>
