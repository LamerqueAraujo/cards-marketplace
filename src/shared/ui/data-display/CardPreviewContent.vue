<script setup lang="ts">
import { computed } from 'vue'
import type { BaseCard } from 'src/shared/types/card.types'
import CardPreviewImage from './CardPreviewImage.vue'
import AppSeparator from 'src/shared/ui/base/AppSeparator.vue'
import AppCard from 'src/shared/ui/base/AppCard.vue'

const props = defineProps<{
  card: BaseCard
}>()

const formattedDescription = computed(() => props.card.description ?? '')
</script>

<template>
  <AppCard class="preview" padding="lg" variant="subtle">
    <div class="preview__content">
      <CardPreviewImage :image-url="card.imageUrl" size="lg" />

      <h2 class="preview__title text-display">
        {{ card.name }}
      </h2>

      <div v-if="formattedDescription" class="preview__divider">
        <AppSeparator :spaced="false" />
      </div>

      <p v-if="formattedDescription" class="preview__description">
        {{ formattedDescription }}
      </p>
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.preview {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.preview__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.preview__title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  max-width: 560px;
  line-height: 1.15;
}

.preview__divider {
  width: 120px;
  opacity: 0.9;
}

.preview__description {
  margin: 0;
  max-width: 560px;

  font-size: var(--text-body);
  line-height: 1.75;
  color: var(--text-muted);
  white-space: pre-line;
}
</style>
