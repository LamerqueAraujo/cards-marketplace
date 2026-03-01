<script setup lang="ts">
defineProps<{
  imageUrl?: string
}>()
</script>

<template>
  <div class="preview-image-wrapper">
    <img :src="imageUrl" class="preview-image" />
  </div>
</template>

<style scoped>
.preview-image-wrapper {
  margin-bottom: 24px;
}

.preview-image {
  width: 260px;

  box-shadow:
    0 25px 60px rgba(0, 0, 0, .85),
    0 0 0 1px rgba(255, 255, 255, .04);

  transition: transform .25s ease;
}

.preview-image:hover {
  transform: scale(1.04);
}
</style>
