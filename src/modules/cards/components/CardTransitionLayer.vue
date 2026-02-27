<script setup lang="ts">
import { ref } from 'vue'
import type { UserCard } from '../types/cards.types'

defineProps<{
  card: UserCard | null
  originEl: HTMLElement | null
}>()

const style = ref({})
</script>

<template>
  <div v-if="card && originEl" class="transition-layer">

    <div class="ghost-card" :style="style">
      <img :src="card.imageUrl" />
    </div>

  </div>
</template>

<style scoped>
.transition-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.ghost-card {
  position: absolute;
  transition: transform .5s cubic-bezier(.2, .8, .2, 1);

  border-radius: 0 !important;
  overflow: visible !important;
  box-shadow: none !important;
}

.ghost-card img {
  display: block;
  width: 100%;
  height: 100%;

  border-radius: 0 !important;
  overflow: visible !important;
}
</style>
