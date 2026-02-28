<script setup lang="ts">
import { computed } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'
import CardPreviewImage from './CardPreviewImage.vue'

const props = defineProps<{
  card: BaseCard
}>()

const formattedDescription = computed(() => {
  return props.card.description ?? ''
})
</script>

<template>
  <div class="preview-vertical">

    <CardPreviewImage :image-url="card.imageUrl" />

    <h2 class="preview-title">
      {{ card.name }}
    </h2>

    <div class="preview-divider" />

    <p class="preview-description">
      {{ formattedDescription }}
    </p>

  </div>
</template>

<style scoped>
.preview-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  padding: 28px 24px;
  max-width: 640px;
  margin: 0 auto;
}

.preview-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-primary);
  letter-spacing: 0.4px;
}

.preview-divider {
  width: 64px;
  height: 3px;
  border-radius: 3px;
  margin-bottom: 22px;
  background: var(--gradient-primary);
}

.preview-description {
  line-height: 1.8;
  font-size: 15px;
  color: var(--text-secondary);
  max-width: 520px;
  white-space: pre-line;
}
</style>
