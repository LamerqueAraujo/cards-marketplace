<script setup lang="ts">
import type { TradeCardModel } from '../types/trade-card.model'

defineProps<{
  trade: TradeCardModel
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
