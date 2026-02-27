<script setup lang="ts">
defineProps<{
  imageUrl: string
  name: string
  selected?: boolean
}>()
</script>

<template>
  <div class="card-thumb">

    <q-img :src="imageUrl" ratio="0.7" class="card-thumb__image" spinner-color="primary" />

    <div class="card-thumb__name">
      {{ name }}
    </div>

    <q-badge v-if="selected" color="primary" class="card-thumb__badge">
      Selecionada
    </q-badge>

  </div>
</template>

<style scoped>
.card-thumb {
  width: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #2e2e4d;
  transition: all 0.2s ease;
}

.card-thumb:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 12px rgba(147, 112, 219, 0.4);
}

.card-thumb__image {
  border-radius: 8px;
}

.card-thumb__name {
  font-size: 12px;
  margin-top: 6px;
  line-height: 1.2;
  height: 32px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-thumb__badge {
  position: absolute;
  top: 6px;
  right: 6px;
}
</style>
