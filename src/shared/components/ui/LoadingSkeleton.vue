<script setup lang="ts">
defineProps<{
  type?: 'list' | 'grid'
}>()
</script>

<template>
  <div>
    <div v-if="type === 'grid'" class="row q-col-gutter-md">
      <div v-for="n in 8" :key="n" class="col-6 col-md-3">
        <q-skeleton height="120px" square />
        <q-skeleton type="text" class="q-mt-sm" />
      </div>
    </div>

    <div v-else>
      <q-skeleton v-for="n in 5" :key="n" height="80px" class="q-mb-md" />
    </div>
  </div>
</template>
