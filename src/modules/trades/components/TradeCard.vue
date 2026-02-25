<script setup lang="ts">
import { computed } from 'vue'
import type { TradeCardModel } from '../types/trade-card.model'
import { useAuthStore } from 'src/modules/auth/store/auth.store'
import AppCard from 'src/shared/components/ui/AppCard.vue'
import CardThumbnail from 'src/shared/components/ui/CardThumbnail.vue'

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
  <AppCard class="q-mb-md">

    <!-- HEADER -->
    <q-card-section class="q-py-md">
      <div class="row justify-between items-center">
        <div>
          <div class="trade-user">
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
    <q-card-section class="q-py-md">
      <div class="section-title">Offering</div>

      <div class="row q-col-gutter-md">
        <div v-for="card in trade.offering" :key="card.id" class="col-auto">
          <CardThumbnail :image-url="card.imageUrl" :name="card.name" />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- RECEIVING -->
    <q-card-section class="q-py-md">
      <div class="section-title">Receiving</div>

      <div class="row q-col-gutter-md">
        <div v-for="card in trade.receiving" :key="card.id" class="col-auto">
          <CardThumbnail :image-url="card.imageUrl" :name="card.name" />
        </div>
      </div>
    </q-card-section>

  </AppCard>
</template>

<style scoped>
.section-title {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.75;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trade-user {
  font-weight: 600;
  font-size: 15px;
}
</style>
