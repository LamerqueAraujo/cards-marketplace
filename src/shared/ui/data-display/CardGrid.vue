<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'
import type { ComponentPublicInstance } from 'vue'

import CardItem from './CardItem.vue'
import CardSlot from './CardSlot.vue'

import LoadingState from '../feedback/LoadingState.vue'
import EmptyState from '../feedback/EmptyState.vue'
import ErrorState from '../feedback/ErrorState.vue'

const props = withDefaults(defineProps<{
  cards: BaseCard[]
  loading?: boolean
  error?: string
  selectable?: boolean
  selectedIds?: string[]
  disabledIds?: string[]
  emptyTitle?: string
  emptyDescription?: string
  maxItems?: number | null
  minSlots?: number

  showEmptySlot?: boolean
  keepEmptySlot?: boolean
  emptySlotLabel?: string
}>(), {
  loading: false,
  error: '',
  selectable: false,
  selectedIds: () => [],
  disabledIds: () => [],

  maxItems: null,
  minSlots: 0,

  showEmptySlot: false,
  keepEmptySlot: false,
  emptySlotLabel: 'Adicionar carta'
})

const emit = defineEmits<{
  (e: 'select', payload: { id: string; el: HTMLElement | null }): void
  (e: 'empty-slot-click'): void
}>()

const selectedSet = computed(() => new Set(props.selectedIds))
const disabledSet = computed(() => new Set(props.disabledIds))

const cardRefs = new Map<string, HTMLElement>()
type RefEl = Element | ComponentPublicInstance | null

function registerRef(id: string, el: RefEl) {
  if (!el) {
    cardRefs.delete(id)
    return
  }

  let element: HTMLElement | null = null
  if (el instanceof HTMLElement) element = el
  else if ('$el' in el && el.$el instanceof HTMLElement) element = el.$el

  if (element) cardRefs.set(id, element)
}

function setCardRef(id: string) {
  return (el: RefEl) => registerRef(id, el)
}

function handleClick(cardId: string) {
  if (disabledSet.value.has(cardId)) return

  emit('select', {
    id: cardId,
    el: cardRefs.get(cardId) ?? null
  })
}

const displayItems = computed<(BaseCard | null)[]>(() => {
  const limited = props.maxItems ? props.cards.slice(0, props.maxItems) : props.cards
  const list: (BaseCard | null)[] = [...limited]

  if (props.minSlots && list.length < props.minSlots) {
    const emptyCount = props.minSlots - list.length
    for (let i = 0; i < emptyCount; i++) list.push(null)
  }

  if (!props.showEmptySlot) return list
  if (props.keepEmptySlot) return [...list, null]

  if (props.maxItems && limited.length >= props.maxItems) return list

  return [...list, null]
})

onBeforeUnmount(() => {
  cardRefs.clear()
})
</script>

<template>
  <LoadingState v-if="loading && cards.length === 0" type="grid" />

  <ErrorState v-else-if="error" :title="error" />

  <EmptyState v-else-if="!loading && cards.length === 0 && !minSlots && !showEmptySlot" icon="style"
    :title="emptyTitle || 'Nenhuma carta encontrada'"
    v-bind="emptyDescription ? { description: emptyDescription } : {}" />

  <div v-else class="app-cardGrid" role="list" aria-label="Grade de cartas">
    <template v-for="(item, index) in displayItems" :key="item?.id ?? `slot-${index}`">
      <div class="app-cardGrid__cell" role="listitem">
        <CardItem v-if="item" :index="index" :ref="setCardRef(item.id)" :card="item" :selectable="selectable"
          :selected="selectedSet.has(item.id)" :disabled="disabledSet.has(item.id)"
          @click.stop="handleClick(item.id)" />

        <CardSlot v-else interactive :label="emptySlotLabel" @click="$emit('empty-slot-click')" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.app-cardGrid {
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-card-min), 1fr));
  align-items: start;
}

.app-cardGrid>* {
  min-width: 0;
}

.app-cardGrid__cell {
  overflow: visible;
  transform: translateZ(0);
}

@media (min-width: 1200px) {
  .app-cardGrid {
    grid-template-columns: repeat(auto-fit, minmax(var(--grid-card-min-lg), 1fr));
  }
}

@media (max-width: 420px) {
  .app-cardGrid {
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 360px) {
  .app-cardGrid {
    gap: 10px;
  }
}
</style>
