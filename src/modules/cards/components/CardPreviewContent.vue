<script setup lang="ts">
import { computed } from 'vue'
import CardPreviewImage from './CardPreviewImage.vue'

const props = defineProps<{
  name: string
  description: string
  imageUrl: string
}>()

const formattedDescription = computed(() =>
  props.description.replace(/\n/g, '<br/>')
)
</script>

<template>
  <div class="preview-vertical">

    <CardPreviewImage :image-url="imageUrl" />

    <h2 class="preview-title">
      {{ name }}
    </h2>

    <div class="preview-divider"></div>

    <p class="preview-description" v-html="formattedDescription" />

  </div>
</template>

<style scoped>
.preview-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  padding: 32px 24px;
  max-width: 650px;
  margin: 0 auto;
}

.preview-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--text-primary);
}

.preview-divider {
  width: 60px;
  height: 3px;
  border-radius: 3px;
  margin-bottom: 22px;

  background: var(--gradient-primary);
}

.preview-description {
  line-height: 1.7;
  font-size: 14.5px;
  color: var(--text-secondary);
  max-width: 520px;
}
</style>
