<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import type { UserCard } from '../types/cards.types'
import type { ComponentPublicInstance } from 'vue'

import CardItem from './CardItem.vue'
import LoadingState from 'src/shared/ui/components/LoadingState.vue'
import EmptyState from 'src/shared/ui/components/EmptyState.vue'
import ErrorState from 'src/shared/ui/components/ErrorState.vue'
import CardSlot from './CardSlot.vue'

const props = withDefaults(defineProps<{
  cards: UserCard[]
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
  minSlots: 0,
  selectedIds: () => []
})

const emit = defineEmits<{
  (e: 'select', payload: { id: string; el: HTMLElement | null }): void
  (e: 'empty-slot-click'): void
}>()

const cardRefs = new Map<string, HTMLElement>()

const displayItems = computed<(UserCard | null)[]>(() => {
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

  <LoadingState v-if="loading" type="grid" />
  <ErrorState v-else-if="error" :title="error" />
  <EmptyState v-else-if="cards.length === 0 && !minSlots" icon="style" :title="emptyTitle || 'Nenhuma carta encontrada'"
    :description="emptyDescription" />

  <div v-else class="cards-grid">

    <template v-for="(item, index) in displayItems" :key="item?.id ?? `slot-${index}`">

      <CardItem v-if="item" :index="index" :ref="el => registerRef(item.id, el)" :card="item" :selectable="selectable"
        :selected="selectedIds.includes(item.id)" @click="handleClick(item.id)" />

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
