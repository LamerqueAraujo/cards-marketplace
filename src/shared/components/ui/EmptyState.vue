<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>

<template>
  <div class="column items-center justify-center q-pa-xl text-center text-grey">
    <q-icon :name="icon || 'inbox'" size="48px" class="q-mb-md" />

    <div class="text-subtitle1 text-weight-medium">
      {{ title }}
    </div>

    <div v-if="description" class="text-caption q-mt-xs">
      {{ description }}
    </div>
  </div>
</template>
