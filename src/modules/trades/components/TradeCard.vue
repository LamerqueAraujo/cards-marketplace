<script setup lang="ts">
import { computed } from 'vue'
import type { TradeCardModel } from '../types/trade-card.model'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

const props = defineProps<{
  trade: TradeCardModel
}>()

const authStore = useAuthStore()

const isOwner = computed(() => {
  return props.trade.userId === authStore.userId
})

const emit = defineEmits<{
  (e: 'delete', tradeId: string): void
}>()
</script>

<template>
  <q-card class="q-mb-md">
    <!-- HEADER -->
    <q-card-section>
      <div class="row justify-between items-center">
        <div>
          <div class="text-subtitle1">
            {{ trade.userName }}
          </div>

          <div class="text-caption text-grey">
            {{ new Date(trade.createdAt).toLocaleDateString() }}
          </div>
        </div>

        <q-btn v-if="isOwner" icon="delete" flat round color="negative" @click="emit('delete', trade.id)" />
      </div>
    </q-card-section>

    <q-separator />

    <!-- OFFERING -->
    <q-card-section>
      <div class="text-weight-bold q-mb-sm">Offering</div>

      <div class="row q-col-gutter-sm">
        <div v-for="card in trade.offering" :key="card.id" class="col-6 col-md-3">
          <q-img :src="card.imageUrl" ratio="1" />
          <div class="text-caption q-mt-xs">
            {{ card.name }}
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- RECEIVING -->
    <q-card-section>
      <div class="text-weight-bold q-mb-sm">Receiving</div>

      <div class="row q-col-gutter-sm">
        <div v-for="card in trade.receiving" :key="card.id" class="col-6 col-md-3">
          <q-img :src="card.imageUrl" ratio="1" />
          <div class="text-caption q-mt-xs">
            {{ card.name }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
