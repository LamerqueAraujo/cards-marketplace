<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'
import type { ComponentPublicInstance } from 'vue'

import CardItem from 'src/shared/ui/data-display/CardItem.vue'
import CardSlot from './CardSlot.vue'
import LoadingState from 'src/shared/ui/feedback/LoadingState.vue'
import EmptyState from 'src/shared/ui/feedback/EmptyState.vue'
import ErrorState from 'src/shared/ui/feedback/ErrorState.vue'

const props = withDefaults(defineProps<{
  cards: BaseCard[]
  loading?: boolean
  error?: string
  selectable?: boolean
  selectedIds?: string[]
  emptyTitle?: string
  emptyDescription?: string
  minSlots?: number
}>(), {
  loading: false,
  error: '',
  selectable: false,
  selectedIds: () => [],
  minSlots: 0
})

const emit = defineEmits<{
  (e: 'select', payload: { id: string; el: HTMLElement | null }): void
  (e: 'empty-slot-click'): void
}>()

const cardRefs = new Map<string, HTMLElement>()

const displayItems = computed<(BaseCard | null)[]>(() => {
  const filled = [...props.cards]

  if (!props.minSlots || filled.length >= props.minSlots) {
    return filled
  }

  const emptyCount = props.minSlots - filled.length

  return [
    ...filled,
    ...Array.from({ length: emptyCount }, () => null)
  ]
})

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

  <!-- Estados globais -->
  <LoadingState v-if="loading" type="grid" />

  <ErrorState v-else-if="error" :title="error" />

  <EmptyState v-else-if="cards.length === 0 && !minSlots" icon="style" :title="emptyTitle || 'Nenhuma carta encontrada'"
    :description="emptyDescription" />

  <!-- Grid com ou sem slots -->
  <div v-else class="cards-grid">

    <template v-for="(item, index) in displayItems" :key="item?.id ?? `slot-${index}`">

      <!-- Carta real -->
      <CardItem v-if="item" :index="index" :ref="el => registerRef(item.id, el)" :card="item" :selectable="selectable"
        :selected="selectedIds.includes(item.id)" @click="handleClick(item.id)" />

      <!-- Slot vazio -->
      <CardSlot v-else interactive @click="$emit('empty-slot-click')" />

    </template>

  </div>

</template>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
</style>
